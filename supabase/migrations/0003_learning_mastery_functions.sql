-- Mainlagi learning mastery functions
-- Server-owned attempt ingestion and deterministic mastery materialization.

create or replace function public.recompute_child_skill_mastery(
  p_account_id uuid,
  p_child_key text,
  p_skill_key text
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_count integer := 0;
  v_score numeric := 0;
  v_consistency numeric := 0;
  v_confidence numeric := 0;
  v_last timestamptz;
  v_latest_two_strong boolean := false;
  v_level text := 'not_started';
begin
  with recent_raw as (
    select evidence_score, evidence_weight, created_at
    from public.learning_attempt_skill_evidence
    where account_id = p_account_id
      and child_key = p_child_key
      and skill_key = p_skill_key
      and qualifies_for_mastery = true
    order by created_at desc
    limit 8
  ), recent as (
    select *,
      row_number() over(order by created_at asc)::numeric as idx,
      count(*) over()::numeric as cnt
    from recent_raw
  ), stats as (
    select
      count(*)::integer as n,
      coalesce(
        sum(evidence_score * evidence_weight * (0.75 + 0.25 * (idx / nullif(cnt, 0)))) /
        nullif(sum(evidence_weight * (0.75 + 0.25 * (idx / nullif(cnt, 0)))), 0),
        0
      ) as score,
      greatest(0, least(1, 1 - coalesce(stddev_pop(evidence_score), 0))) as consistency,
      max(created_at) as last_at
    from recent
  )
  select n, score, consistency, last_at
  into v_count, v_score, v_consistency, v_last
  from stats;

  if v_count = 0 then
    delete from public.child_skill_mastery
    where account_id = p_account_id and child_key = p_child_key and skill_key = p_skill_key;
    return;
  end if;

  v_score := greatest(0, least(1, v_score));
  v_confidence := greatest(0, least(1, (v_count::numeric / 4) * (0.7 + v_consistency * 0.3)));

  select count(*) = 2 and bool_and(evidence_score >= 0.8)
  into v_latest_two_strong
  from (
    select evidence_score
    from public.learning_attempt_skill_evidence
    where account_id = p_account_id
      and child_key = p_child_key
      and skill_key = p_skill_key
      and qualifies_for_mastery = true
    order by created_at desc
    limit 2
  ) latest;

  if v_count >= 3 and v_score >= 0.85 and v_confidence >= 0.65 and v_latest_two_strong then
    v_level := 'mastered';
  elsif v_count >= 2 and v_score >= 0.70 then
    v_level := 'proficient';
  elsif v_count >= 2 and v_score >= 0.45 then
    v_level := 'developing';
  else
    v_level := 'exploring';
  end if;

  insert into public.child_skill_mastery(
    account_id, child_key, skill_key, mastery_score, confidence, mastery_level,
    evidence_count, qualifying_evidence_count, last_evidence_at, updated_at
  )
  values(
    p_account_id, p_child_key, p_skill_key, v_score, v_confidence, v_level,
    (select count(*) from public.learning_attempt_skill_evidence where account_id = p_account_id and child_key = p_child_key and skill_key = p_skill_key),
    v_count, v_last, now()
  )
  on conflict (account_id, child_key, skill_key) do update set
    mastery_score = excluded.mastery_score,
    confidence = excluded.confidence,
    mastery_level = excluded.mastery_level,
    evidence_count = excluded.evidence_count,
    qualifying_evidence_count = excluded.qualifying_evidence_count,
    last_evidence_at = excluded.last_evidence_at,
    updated_at = now();
end; $$;
revoke all on function public.recompute_child_skill_mastery(uuid, text, text) from public;

create or replace function public.record_learning_attempt(
  p_client_attempt_id text,
  p_child_key text,
  p_activity_id text,
  p_subject_id text,
  p_stage_id text,
  p_runtime text,
  p_status text default 'completed',
  p_assessed boolean default false,
  p_score numeric default null,
  p_accuracy numeric default null,
  p_correct_count integer default 0,
  p_incorrect_count integer default 0,
  p_hint_count integer default 0,
  p_retry_count integer default 0,
  p_duration_ms integer default null,
  p_input_mode text default null,
  p_started_at timestamptz default now(),
  p_completed_at timestamptz default now(),
  p_metadata jsonb default '{}'::jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_account uuid := auth.uid();
  v_attempt_id uuid;
  v_existing uuid;
  v_rapid_repeat boolean := false;
  v_first_completion boolean := false;
  v_accuracy numeric;
  v_independence numeric;
  v_evidence_score numeric;
  v_star_reward integer := 0;
  v_skill record;
begin
  if v_account is null then raise exception 'authentication required'; end if;
  if p_child_key is null or char_length(p_child_key) not between 1 and 128 then raise exception 'invalid child key'; end if;
  if p_client_attempt_id is null or char_length(p_client_attempt_id) not between 1 and 160 then raise exception 'invalid attempt id'; end if;
  if not exists(select 1 from public.learning_activities where activity_id = p_activity_id and active = true) then raise exception 'unknown activity'; end if;

  select id into v_existing
  from public.learning_attempts
  where account_id = v_account and child_key = p_child_key and client_attempt_id = p_client_attempt_id;
  if v_existing is not null then return v_existing; end if;

  select exists(
    select 1 from public.learning_attempts
    where account_id = v_account
      and child_key = p_child_key
      and activity_id = p_activity_id
      and status = 'completed'
      and completed_at <= p_completed_at
      and completed_at > p_completed_at - interval '30 seconds'
  ) into v_rapid_repeat;

  select not exists(
    select 1 from public.learning_attempts
    where account_id = v_account
      and child_key = p_child_key
      and activity_id = p_activity_id
      and status = 'completed'
  ) into v_first_completion;

  insert into public.learning_attempts(
    account_id, child_key, client_attempt_id, activity_id, subject_id, stage_id, runtime,
    status, assessed, score, accuracy, correct_count, incorrect_count, hint_count,
    retry_count, duration_ms, input_mode, started_at, completed_at, metadata
  ) values (
    v_account, p_child_key, p_client_attempt_id, p_activity_id, p_subject_id, p_stage_id, p_runtime,
    case when p_status in ('completed','abandoned','interrupted') then p_status else 'interrupted' end,
    p_assessed,
    case when p_score is null then null else greatest(0, least(1, p_score)) end,
    case when p_accuracy is null then null else greatest(0, least(1, p_accuracy)) end,
    greatest(0, coalesce(p_correct_count, 0)),
    greatest(0, coalesce(p_incorrect_count, 0)),
    greatest(0, coalesce(p_hint_count, 0)),
    greatest(0, coalesce(p_retry_count, 0)),
    case when p_duration_ms is null then null else greatest(0, p_duration_ms) end,
    nullif(p_input_mode, ''),
    coalesce(p_started_at, p_completed_at, now()),
    coalesce(p_completed_at, now()),
    coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_attempt_id;

  v_accuracy := coalesce(p_accuracy, p_score);
  if p_assessed and p_status = 'completed' and v_accuracy is not null then
    v_accuracy := greatest(0, least(1, v_accuracy));
    v_independence := 1 - least(0.65, greatest(0, coalesce(p_hint_count,0)) * 0.12 + greatest(0, coalesce(p_retry_count,0)) * 0.08);
    v_evidence_score := greatest(0, least(1, v_accuracy * 0.72 + v_independence * 0.18 + 0.10));

    insert into public.learning_attempt_skill_evidence(
      attempt_id, account_id, child_key, activity_id, skill_key,
      evidence_score, evidence_weight, qualifies_for_mastery, created_at
    )
    select
      v_attempt_id, v_account, p_child_key, p_activity_id, las.skill_key,
      v_evidence_score,
      las.evidence_weight * (0.9 + la.difficulty * 0.05),
      (not v_rapid_repeat) and greatest(0, coalesce(p_retry_count,0)) < 7,
      coalesce(p_completed_at, now())
    from public.learning_activity_skills las
    join public.learning_activities la on la.activity_id = las.activity_id
    where las.activity_id = p_activity_id and la.assessment = 'assessed';

    for v_skill in
      select distinct skill_key from public.learning_attempt_skill_evidence where attempt_id = v_attempt_id
    loop
      perform public.recompute_child_skill_mastery(v_account, p_child_key, v_skill.skill_key);
    end loop;
  end if;

  if p_status = 'completed' then
    select star_reward into v_star_reward from public.learning_activities where activity_id = p_activity_id;
    insert into public.child_learning_progress(account_id, child_key, completed_activity_ids, total_stars, last_activity_id, updated_at)
    values(
      v_account,
      p_child_key,
      array[p_activity_id],
      case when v_first_completion then coalesce(v_star_reward,0) else 0 end,
      p_activity_id,
      now()
    )
    on conflict (account_id, child_key) do update set
      completed_activity_ids = case
        when p_activity_id = any(public.child_learning_progress.completed_activity_ids)
          then public.child_learning_progress.completed_activity_ids
        else array_append(public.child_learning_progress.completed_activity_ids, p_activity_id)
      end,
      total_stars = public.child_learning_progress.total_stars + case when v_first_completion then coalesce(v_star_reward,0) else 0 end,
      last_activity_id = p_activity_id,
      updated_at = now();
  end if;

  return v_attempt_id;
end; $$;
revoke all on function public.record_learning_attempt(text,text,text,text,text,text,text,boolean,numeric,numeric,integer,integer,integer,integer,integer,text,timestamptz,timestamptz,jsonb) from public;
grant execute on function public.record_learning_attempt(text,text,text,text,text,text,text,boolean,numeric,numeric,integer,integer,integer,integer,integer,text,timestamptz,timestamptz,jsonb) to authenticated;
