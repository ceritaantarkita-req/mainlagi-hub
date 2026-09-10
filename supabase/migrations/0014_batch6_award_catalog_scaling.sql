-- Mainlagi Batch 6 cloud award catalog scaling.
-- The original award trigger was created when Mainlagi had five subjects.
-- Batch 6 expands the current first-class catalog to eight subjects, so the
-- server-owned all-subjects achievement must use the same eight-subject gate.
-- This migration also keeps the initial letter-tracing activity completion-only
-- until letter-specific path-fidelity measurement is validated.

update public.learning_activities
set assessment = 'practice',
    evidence_contract = 'completion_only_v1',
    updated_at = now()
where activity_id = 'letters-trace-a';

update public.learning_activity_skills
set evidence_weight = 0.5
where activity_id = 'letters-trace-a'
  and skill_key = 'letters.latin.a.formation';

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
      and mastery_level in ('proficient','mastered')
  ) then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(new.account_id, new.child_key, 'first-proficient', jsonb_build_object('source', 'canonical_mastery'))
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  if exists(
    select 1
    from public.child_skill_mastery
    where account_id = new.account_id
      and child_key = new.child_key
      and mastery_level = 'mastered'
  ) then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(new.account_id, new.child_key, 'first-mastered', jsonb_build_object('source', 'canonical_mastery'))
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  if v_subject_count >= 8 then
    insert into public.child_learning_achievements(account_id, child_key, achievement_key, evidence)
    values(new.account_id, new.child_key, 'all-subjects', jsonb_build_object('subject_count', v_subject_count, 'catalog_subject_count', 8))
    on conflict (account_id, child_key, achievement_key) do nothing;
  end if;

  -- Certificate v1 remains subject-scoped and evidence-driven. The loop is
  -- intentionally catalog-derived, so new assessed subjects participate once
  -- their active activities and skills are registered.
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
      count(*) filter(where csm.mastery_level in ('proficient','mastered'))::integer
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
            'level', csm.mastery_level,
            'score', csm.mastery_score,
            'confidence', csm.confidence,
            'qualifying_evidence_count', csm.qualifying_evidence_count,
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

revoke all on function private.refresh_learning_awards() from public, anon, authenticated, service_role;

-- Re-evaluate existing progress rows using the expanded subject-count gate.
-- Existing achievement rows are append-only through ON CONFLICT DO NOTHING.
update public.child_learning_progress
set last_activity_id = last_activity_id;
