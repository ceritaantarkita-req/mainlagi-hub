-- Harden learning RPC privileges and canonicalize server-owned activity metadata.
-- Keeps the public RPC signature stable for existing clients.

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
  v_skill record;
  v_activity record;
  v_status text;
  v_started_at timestamptz;
  v_completed_at timestamptz;
  v_is_assessed boolean := false;
begin
  if v_account is null then raise exception 'authentication required'; end if;
  if p_child_key is null or char_length(p_child_key) not between 1 and 128 then raise exception 'invalid child key'; end if;
  if p_client_attempt_id is null or char_length(p_client_attempt_id) not between 1 and 160 then raise exception 'invalid attempt id'; end if;
  if octet_length(coalesce(p_metadata, '{}'::jsonb)::text) > 16384 then raise exception 'metadata too large'; end if;

  select activity_id, subject_id, stage_id, runtime, assessment, star_reward
  into v_activity
  from public.learning_activities
  where activity_id = p_activity_id and active = true;
  if not found then raise exception 'unknown activity'; end if;

  select id into v_existing
  from public.learning_attempts
  where account_id = v_account and child_key = p_child_key and client_attempt_id = p_client_attempt_id;
  if v_existing is not null then return v_existing; end if;

  v_status := case when p_status in ('completed','abandoned','interrupted') then p_status else 'interrupted' end;
  v_completed_at := least(coalesce(p_completed_at, now()), now() + interval '5 minutes');
  v_started_at := least(coalesce(p_started_at, v_completed_at), v_completed_at);
  v_accuracy := coalesce(p_accuracy, p_score);
  v_is_assessed := v_activity.assessment = 'assessed' and v_status = 'completed' and v_accuracy is not null;

  -- Use server receipt time for replay protection so a client cannot bypass the
  -- 30-second guard by forging completed_at values.
  select exists(
    select 1 from public.learning_attempts
    where account_id = v_account
      and child_key = p_child_key
      and activity_id = p_activity_id
      and status = 'completed'
      and created_at > now() - interval '30 seconds'
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
    v_account, p_child_key, p_client_attempt_id, p_activity_id,
    v_activity.subject_id, v_activity.stage_id, v_activity.runtime,
    v_status,
    v_is_assessed,
    case when p_score is null then null else greatest(0, least(1, p_score)) end,
    case when p_accuracy is null then null else greatest(0, least(1, p_accuracy)) end,
    greatest(0, coalesce(p_correct_count, 0)),
    greatest(0, coalesce(p_incorrect_count, 0)),
    greatest(0, coalesce(p_hint_count, 0)),
    greatest(0, coalesce(p_retry_count, 0)),
    case when p_duration_ms is null then null else greatest(0, p_duration_ms) end,
    nullif(p_input_mode, ''),
    v_started_at,
    v_completed_at,
    coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_attempt_id;

  if v_is_assessed then
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
      v_completed_at
    from public.learning_activity_skills las
    join public.learning_activities la on la.activity_id = las.activity_id
    where las.activity_id = p_activity_id and la.assessment = 'assessed';

    for v_skill in
      select distinct skill_key from public.learning_attempt_skill_evidence where attempt_id = v_attempt_id
    loop
      perform public.recompute_child_skill_mastery(v_account, p_child_key, v_skill.skill_key);
    end loop;
  end if;

  if v_status = 'completed' then
    insert into public.child_learning_progress(account_id, child_key, completed_activity_ids, total_stars, last_activity_id, updated_at)
    values(
      v_account,
      p_child_key,
      array[p_activity_id],
      case when v_first_completion then coalesce(v_activity.star_reward,0) else 0 end,
      p_activity_id,
      now()
    )
    on conflict (account_id, child_key) do update set
      completed_activity_ids = case
        when p_activity_id = any(public.child_learning_progress.completed_activity_ids)
          then public.child_learning_progress.completed_activity_ids
        else array_append(public.child_learning_progress.completed_activity_ids, p_activity_id)
      end,
      total_stars = public.child_learning_progress.total_stars + case when v_first_completion then coalesce(v_activity.star_reward,0) else 0 end,
      last_activity_id = p_activity_id,
      updated_at = now();
  end if;

  return v_attempt_id;
end; $$;

-- Supabase may provision explicit function EXECUTE grants for API roles. Revoke
-- them explicitly rather than relying only on revoking PUBLIC.
revoke all on function public.recompute_child_skill_mastery(uuid, text, text) from public, anon, authenticated, service_role;
grant execute on function public.recompute_child_skill_mastery(uuid, text, text) to service_role;

revoke all on function public.record_learning_attempt(text,text,text,text,text,text,text,boolean,numeric,numeric,integer,integer,integer,integer,integer,text,timestamptz,timestamptz,jsonb) from public, anon, authenticated, service_role;
grant execute on function public.record_learning_attempt(text,text,text,text,text,text,text,boolean,numeric,numeric,integer,integer,integer,integer,integer,text,timestamptz,timestamptz,jsonb) to authenticated, service_role;
