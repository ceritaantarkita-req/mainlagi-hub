-- Mainlagi World supplemental evidence — implementation wave 2.
-- Source-aware mastery + strict Belajar progression/reward/certificate isolation.
--
-- This migration remains pre-activation:
-- - World ingestion application switch stays false;
-- - record_world_skill_evidence keeps its independent mapping switch false;
-- - Petualangan Uang runtime remains disconnected;
-- - Stage 8 remains authored as practice.
--
-- Goal:
-- supplemental World evidence may contribute to a source-aware mastery snapshot,
-- but canonical Belajar evidence remains authoritative for progression, rewards,
-- and certificate eligibility.

alter table public.child_skill_mastery
  add column if not exists canonical_mastery_score numeric(7,6) not null default 0
    check (canonical_mastery_score >= 0 and canonical_mastery_score <= 1),
  add column if not exists canonical_confidence numeric(7,6) not null default 0
    check (canonical_confidence >= 0 and canonical_confidence <= 1),
  add column if not exists canonical_mastery_level text not null default 'not_started'
    check (canonical_mastery_level in ('not_started','exploring','developing','proficient','mastered')),
  add column if not exists canonical_evidence_count integer not null default 0
    check (canonical_evidence_count >= 0),
  add column if not exists canonical_qualifying_evidence_count integer not null default 0
    check (canonical_qualifying_evidence_count >= 0),
  add column if not exists canonical_last_evidence_at timestamptz,
  add column if not exists supplemental_evidence_count integer not null default 0
    check (supplemental_evidence_count >= 0),
  add column if not exists supplemental_qualifying_evidence_count integer not null default 0
    check (supplemental_qualifying_evidence_count >= 0),
  add column if not exists evidence_source_policy text not null default 'belajar-only';

-- Existing mastery rows predate supplemental World evidence. Preserve their
-- exact legacy values as the canonical Belajar baseline.
update public.child_skill_mastery
set canonical_mastery_score = mastery_score,
    canonical_confidence = confidence,
    canonical_mastery_level = mastery_level,
    canonical_evidence_count = evidence_count,
    canonical_qualifying_evidence_count = qualifying_evidence_count,
    canonical_last_evidence_at = last_evidence_at,
    supplemental_evidence_count = 0,
    supplemental_qualifying_evidence_count = 0,
    evidence_source_policy = 'belajar-only';

create or replace function public.recompute_child_skill_mastery(
  p_account_id uuid,
  p_child_key text,
  p_skill_key text
) returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_canonical_count integer := 0;
  v_canonical_score numeric := 0;
  v_canonical_consistency numeric := 0;
  v_canonical_confidence numeric := 0;
  v_canonical_last timestamptz;
  v_canonical_latest_two_strong boolean := false;
  v_canonical_level text := 'not_started';
  v_canonical_evidence_total integer := 0;

  v_combined_count integer := 0;
  v_combined_score numeric := 0;
  v_combined_consistency numeric := 0;
  v_combined_confidence numeric := 0;
  v_combined_last timestamptz;
  v_combined_level text := 'not_started';

  v_supplemental_evidence_total integer := 0;
  v_supplemental_recent_qualifying integer := 0;
  v_policy text := 'belajar-only';
begin
  -- Canonical Belajar evidence uses the exact legacy weighting/recency formula.
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
  into v_canonical_count, v_canonical_score, v_canonical_consistency, v_canonical_last
  from stats;

  select count(*)::integer
  into v_canonical_evidence_total
  from public.learning_attempt_skill_evidence
  where account_id = p_account_id
    and child_key = p_child_key
    and skill_key = p_skill_key;

  if v_canonical_count > 0 then
    v_canonical_score := greatest(0, least(1, v_canonical_score));
    v_canonical_confidence := greatest(
      0,
      least(1, (v_canonical_count::numeric / 4) * (0.7 + v_canonical_consistency * 0.3))
    );

    select count(*) = 2 and bool_and(evidence_score >= 0.8)
    into v_canonical_latest_two_strong
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

    if v_canonical_count >= 3
       and v_canonical_score >= 0.85
       and v_canonical_confidence >= 0.65
       and v_canonical_latest_two_strong then
      v_canonical_level := 'mastered';
    elsif v_canonical_count >= 2 and v_canonical_score >= 0.70 then
      v_canonical_level := 'proficient';
    elsif v_canonical_count >= 2 and v_canonical_score >= 0.45 then
      v_canonical_level := 'developing';
    else
      v_canonical_level := 'exploring';
    end if;
  end if;

  select count(*)::integer
  into v_supplemental_evidence_total
  from public.learning_supplemental_skill_evidence
  where account_id = p_account_id
    and child_key = p_child_key
    and skill_key = p_skill_key;

  -- Combined source-aware snapshot. Supplemental evidence already carries a
  -- conservative weight (0.5 in Wave 1), but cannot bypass canonical gates.
  with combined_raw as (
    select
      evidence_score,
      evidence_weight,
      created_at,
      'belajar'::text as source_kind,
      attempt_id::text || ':' || activity_id as row_key
    from public.learning_attempt_skill_evidence
    where account_id = p_account_id
      and child_key = p_child_key
      and skill_key = p_skill_key
      and qualifies_for_mastery = true

    union all

    select
      evidence_score,
      evidence_weight,
      created_at,
      'world'::text as source_kind,
      id::text as row_key
    from public.learning_supplemental_skill_evidence
    where account_id = p_account_id
      and child_key = p_child_key
      and skill_key = p_skill_key
      and qualifies_for_mastery = true
  ), recent_raw as (
    select *
    from combined_raw
    order by created_at desc, source_kind asc, row_key desc
    limit 8
  ), recent as (
    select *,
      row_number() over(order by created_at asc, source_kind desc, row_key asc)::numeric as idx,
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
      max(created_at) as last_at,
      count(*) filter(where source_kind = 'world')::integer as supplemental_n
    from recent
  )
  select n, score, consistency, last_at, supplemental_n
  into
    v_combined_count,
    v_combined_score,
    v_combined_consistency,
    v_combined_last,
    v_supplemental_recent_qualifying
  from stats;

  if v_combined_count = 0 then
    -- Preserve the legacy database behavior: without qualifying evidence there
    -- is no materialized mastery row.
    delete from public.child_skill_mastery
    where account_id = p_account_id
      and child_key = p_child_key
      and skill_key = p_skill_key;
    return;
  end if;

  v_combined_score := greatest(0, least(1, v_combined_score));
  v_combined_confidence := greatest(
    0,
    least(1, (v_combined_count::numeric / 4) * (0.7 + v_combined_consistency * 0.3))
  );

  -- World-only evidence is capped at exploring.
  -- Developing+ requires canonical Belajar evidence.
  -- Proficient/mastered retain the legacy minimum canonical evidence counts.
  if v_canonical_count >= 3
     and v_combined_count >= 3
     and v_combined_score >= 0.85
     and v_combined_confidence >= 0.65
     and v_canonical_latest_two_strong then
    v_combined_level := 'mastered';
  elsif v_canonical_count >= 2
     and v_combined_count >= 2
     and v_combined_score >= 0.70 then
    v_combined_level := 'proficient';
  elsif v_canonical_count >= 1
     and v_combined_count >= 2
     and v_combined_score >= 0.45 then
    v_combined_level := 'developing';
  else
    v_combined_level := 'exploring';
  end if;

  v_policy := case
    when v_canonical_evidence_total > 0 and v_supplemental_evidence_total > 0
      then 'belajar-plus-world-supplemental'
    when v_supplemental_evidence_total > 0
      then 'world-supplemental-only'
    else 'belajar-only'
  end;

  insert into public.child_skill_mastery(
    account_id,
    child_key,
    skill_key,
    mastery_score,
    confidence,
    mastery_level,
    evidence_count,
    qualifying_evidence_count,
    last_evidence_at,
    canonical_mastery_score,
    canonical_confidence,
    canonical_mastery_level,
    canonical_evidence_count,
    canonical_qualifying_evidence_count,
    canonical_last_evidence_at,
    supplemental_evidence_count,
    supplemental_qualifying_evidence_count,
    evidence_source_policy,
    updated_at
  )
  values(
    p_account_id,
    p_child_key,
    p_skill_key,
    v_combined_score,
    v_combined_confidence,
    v_combined_level,
    v_canonical_evidence_total + v_supplemental_evidence_total,
    v_combined_count,
    v_combined_last,
    v_canonical_score,
    v_canonical_confidence,
    v_canonical_level,
    v_canonical_evidence_total,
    v_canonical_count,
    v_canonical_last,
    v_supplemental_evidence_total,
    v_supplemental_recent_qualifying,
    v_policy,
    now()
  )
  on conflict (account_id, child_key, skill_key) do update set
    mastery_score = excluded.mastery_score,
    confidence = excluded.confidence,
    mastery_level = excluded.mastery_level,
    evidence_count = excluded.evidence_count,
    qualifying_evidence_count = excluded.qualifying_evidence_count,
    last_evidence_at = excluded.last_evidence_at,
    canonical_mastery_score = excluded.canonical_mastery_score,
    canonical_confidence = excluded.canonical_confidence,
    canonical_mastery_level = excluded.canonical_mastery_level,
    canonical_evidence_count = excluded.canonical_evidence_count,
    canonical_qualifying_evidence_count = excluded.canonical_qualifying_evidence_count,
    canonical_last_evidence_at = excluded.canonical_last_evidence_at,
    supplemental_evidence_count = excluded.supplemental_evidence_count,
    supplemental_qualifying_evidence_count = excluded.supplemental_qualifying_evidence_count,
    evidence_source_policy = excluded.evidence_source_policy,
    updated_at = now();
end;
$$;

revoke all on function public.recompute_child_skill_mastery(uuid, text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.recompute_child_skill_mastery(uuid, text, text)
  to service_role;

-- Supplemental evidence can recompute the source-aware snapshot only after a
-- row exists. Wave 1's independent database mapping gate still prevents such
-- rows from being created until a later activation migration.
create or replace function private.refresh_world_supplemental_mastery()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_account_id uuid;
  v_child_key text;
  v_skill_key text;
begin
  v_account_id := case when tg_op = 'DELETE' then old.account_id else new.account_id end;
  v_child_key := case when tg_op = 'DELETE' then old.child_key else new.child_key end;
  v_skill_key := case when tg_op = 'DELETE' then old.skill_key else new.skill_key end;

  perform public.recompute_child_skill_mastery(v_account_id, v_child_key, v_skill_key);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

revoke all on function private.refresh_world_supplemental_mastery()
  from public, anon, authenticated, service_role;

drop trigger if exists trg_refresh_world_supplemental_mastery
  on public.learning_supplemental_skill_evidence;
create trigger trg_refresh_world_supplemental_mastery
after insert or update of
  evidence_score,
  evidence_weight,
  qualifies_for_mastery,
  skill_key
or delete
on public.learning_supplemental_skill_evidence
for each row execute function private.refresh_world_supplemental_mastery();

-- Replace the latest award/certificate refresher with source-isolated checks.
-- World supplemental mastery may enrich the general mastery snapshot, but:
--   * achievements use canonical Belajar mastery level;
--   * certificate eligibility uses canonical Belajar mastery only;
--   * World rows never count as Belajar completion/stars.
create or replace function private.refresh_learning_awards()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_attempt_count integer := 0;
  v_subject_count integer := 0;
  v_total_assessed_skills integer := 0;
  v_ready_assessed_skills integer := 0;
  v_subject text;
  v_completion_ready boolean := false;
  v_mastery_snapshot jsonb := '{}'::jsonb;
begin
  select count(*)::integer,
         count(distinct subject_id)::integer
  into v_attempt_count, v_subject_count
  from public.learning_attempts
  where account_id = new.account_id
    and child_key = new.child_key
    and status = 'completed';

  if v_attempt_count >= 1 then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(new.account_id, new.child_key, 'first-attempt', jsonb_build_object('attempt_count', v_attempt_count))
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  if cardinality(new.completed_activity_ids) >= 5 then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(new.account_id, new.child_key, 'five-activities', jsonb_build_object('completed_activity_count', cardinality(new.completed_activity_ids)))
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  if exists(
    select 1
    from public.child_skill_mastery
    where account_id = new.account_id
      and child_key = new.child_key
      and canonical_mastery_level in ('proficient','mastered')
  ) then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(
      new.account_id,
      new.child_key,
      'first-proficient',
      jsonb_build_object('source', 'canonical_belajar_mastery')
    )
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  if exists(
    select 1
    from public.child_skill_mastery
    where account_id = new.account_id
      and child_key = new.child_key
      and canonical_mastery_level = 'mastered'
  ) then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(
      new.account_id,
      new.child_key,
      'first-mastered',
      jsonb_build_object('source', 'canonical_belajar_mastery')
    )
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  -- Preserve the latest existing catalog gate from migration 0014.
  if v_subject_count >= 8 then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(
      new.account_id,
      new.child_key,
      'all-subjects',
      jsonb_build_object('subject_count', v_subject_count, 'catalog_subject_count', 8)
    )
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  for v_subject in
    select distinct subject_id
    from public.learning_activities
    where active = true
  loop
    select not exists(
      select 1
      from public.learning_activities la
      where la.subject_id = v_subject
        and la.active = true
        and la.required_for_stage = true
        and not (la.activity_id = any(new.completed_activity_ids))
    ) into v_completion_ready;

    with assessed_skills as (
      select distinct las.skill_key
      from public.learning_activities la
      join public.learning_activity_skills las on las.activity_id = la.activity_id
      where la.subject_id = v_subject
        and la.active = true
        and la.assessment = 'assessed'
    )
    select
      count(*)::integer,
      count(*) filter(
        where csm.canonical_mastery_level in ('proficient','mastered')
          and csm.canonical_qualifying_evidence_count >= 2
      )::integer
    into v_total_assessed_skills, v_ready_assessed_skills
    from assessed_skills s
    left join public.child_skill_mastery csm
      on csm.account_id = new.account_id
     and csm.child_key = new.child_key
     and csm.skill_key = s.skill_key;

    if v_completion_ready
       and v_total_assessed_skills > 0
       and v_ready_assessed_skills = v_total_assessed_skills then
      with assessed_skills as (
        select distinct las.skill_key
        from public.learning_activities la
        join public.learning_activity_skills las on las.activity_id = la.activity_id
        where la.subject_id = v_subject
          and la.active = true
          and la.assessment = 'assessed'
      )
      select coalesce(
        jsonb_object_agg(
          csm.skill_key,
          jsonb_build_object(
            'canonical_level', csm.canonical_mastery_level,
            'canonical_score', csm.canonical_mastery_score,
            'canonical_confidence', csm.canonical_confidence,
            'canonical_qualifying_evidence_count', csm.canonical_qualifying_evidence_count,
            'canonical_last_evidence_at', csm.canonical_last_evidence_at,
            'combined_level', csm.mastery_level,
            'combined_score', csm.mastery_score,
            'supplemental_qualifying_evidence_count', csm.supplemental_qualifying_evidence_count,
            'last_evidence_at', csm.last_evidence_at
          )
        ),
        '{}'::jsonb
      )
      into v_mastery_snapshot
      from assessed_skills s
      join public.child_skill_mastery csm
        on csm.account_id = new.account_id
       and csm.child_key = new.child_key
       and csm.skill_key = s.skill_key;

      insert into public.learning_certificates(
        account_id,
        child_key,
        subject_id,
        criteria_version,
        evidence_snapshot
      ) values (
        new.account_id,
        new.child_key,
        v_subject,
        'subject-v1',
        jsonb_build_object(
          'issued_by', 'canonical_progress_trigger',
          'evidence_policy', 'belajar-canonical-only-v2',
          'completed_activity_ids', to_jsonb(new.completed_activity_ids),
          'assessed_skill_count', v_total_assessed_skills,
          'mastery', v_mastery_snapshot
        )
      )
      on conflict (account_id, child_key, subject_id, criteria_version) do nothing;
    end if;
  end loop;

  return new;
end;
$$;

revoke all on function private.refresh_learning_awards()
  from public, anon, authenticated, service_role;

-- Re-materialize existing mastery using source-aware columns. Wave 1's
-- supplemental table is still write-disabled, so this is backward-compatible
-- with the canonical Belajar state at this checkpoint.
do $$
declare
  row record;
begin
  for row in
    select account_id, child_key, skill_key
    from public.child_skill_mastery
  loop
    perform public.recompute_child_skill_mastery(
      row.account_id,
      row.child_key,
      row.skill_key
    );
  end loop;
end;
$$;

-- Re-evaluate server-issued awards/certificates through the canonical progress
-- trigger. Existing rows remain append-only/idempotent.
update public.child_learning_progress
set last_activity_id = last_activity_id;
