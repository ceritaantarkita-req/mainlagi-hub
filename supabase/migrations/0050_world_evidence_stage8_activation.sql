-- Mainlagi World evidence activation — Stage 8 subtraction only.
-- This migration activates exactly one reviewed supplemental-evidence mapping.
-- It does not grant browser RPC access, create Belajar activity completion,
-- award stars, unlock Belajar stages, or issue certificates.

create table if not exists private.world_evidence_activation_registry (
  world_activity_id text primary key,
  content_version text not null,
  active boolean not null default false,
  activated_at timestamptz,
  updated_at timestamptz not null default now()
);

revoke all on private.world_evidence_activation_registry
  from public, anon, authenticated, service_role;

insert into private.world_evidence_activation_registry(
  world_activity_id,
  content_version,
  active,
  activated_at,
  updated_at
)
values(
  'money-s08-activity-02',
  'money-world-s08-subtraction-v2-assessed',
  true,
  now(),
  now()
)
on conflict (world_activity_id) do update set
  content_version = excluded.content_version,
  active = excluded.active,
  activated_at = case
    when excluded.active then coalesce(private.world_evidence_activation_registry.activated_at, now())
    else private.world_evidence_activation_registry.activated_at
  end,
  updated_at = now();

create or replace function public.record_world_skill_evidence(
  p_account_id uuid,
  p_child_key text,
  p_client_observation_id text,
  p_world_id text,
  p_stage_id text,
  p_world_activity_id text,
  p_mechanic_id text,
  p_content_version text,
  p_answer_sequence text[],
  p_input_mode text,
  p_started_at timestamptz,
  p_completed_at timestamptz,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_mapping_active boolean := false;

  v_existing uuid;
  v_id uuid;
  v_age integer;
  v_answer_count integer;
  v_correct_count integer;
  v_incorrect_count integer;
  v_retry_count integer;
  v_duration_ms bigint;
  v_accuracy numeric;
  v_independence numeric;
  v_evidence_score numeric;
  v_rapid_repeat boolean := false;
  v_prior_qualifying boolean := false;
  v_qualifies boolean := false;
  v_reason text := 'non-qualifying';
begin
  if p_account_id is null then
    raise exception using errcode = '22023', message = 'account id required';
  end if;
  if p_child_key is null or char_length(p_child_key) not between 1 and 128 then
    raise exception using errcode = '22023', message = 'invalid child key';
  end if;
  if p_child_key = 'demo-gian' then
    raise exception using errcode = '42501', message = 'demo child cannot create canonical supplemental evidence';
  end if;
  if p_client_observation_id is null or char_length(p_client_observation_id) not between 1 and 160 then
    raise exception using errcode = '22023', message = 'invalid observation id';
  end if;
  if octet_length(coalesce(p_metadata, '{}'::jsonb)::text) > 8192 then
    raise exception using errcode = '22023', message = 'metadata too large';
  end if;

  -- Exact server-owned source mapping. There is no client-supplied skill key,
  -- evidence weight, assessment flag, or mastery eligibility parameter.
  if p_world_id is distinct from 'money-festival'
     or p_stage_id is distinct from 'money-stage-08-final-festival'
     or p_world_activity_id is distinct from 'money-s08-activity-02'
     or p_mechanic_id is distinct from 'tap_choice'
     or p_content_version is distinct from 'money-world-s08-subtraction-v2-assessed' then
    raise exception using errcode = '22023', message = 'unknown World evidence mapping';
  end if;

  select exists(
    select 1
    from private.world_evidence_activation_registry r
    where r.world_activity_id = p_world_activity_id
      and r.content_version = p_content_version
      and r.active = true
  )
  into v_mapping_active;

  -- Database-level kill switch. Keep this BEFORE any evidence write.
  if not v_mapping_active then
    raise exception using errcode = '55000', message = 'World evidence mapping is not activated';
  end if;

  -- Serialize all evidence writes for one owned child. This closes concurrent
  -- replay races before the prior-qualifying check.
  select
    case
      when pp.age_group ~ '^[0-9]+$' then pp.age_group::integer
      when pp.age_group = 'SD 1' then 6
      when pp.age_group = 'SD 2' then 7
      when pp.age_group = 'TK' then 5
      else null
    end
  into v_age
  from public.player_profiles pp
  where pp.id::text = p_child_key
    and pp.account_id = p_account_id
    and pp.deleted_at is null
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'World evidence child is not owned by account';
  end if;

  if v_age is null or v_age < 6 or v_age > 7 then
    raise exception using errcode = '22023', message = 'child age is not eligible for canonical World evidence';
  end if;

  select id into v_existing
  from public.learning_supplemental_skill_evidence
  where account_id = p_account_id
    and child_key = p_child_key
    and client_observation_id = p_client_observation_id;
  if v_existing is not null then
    return v_existing;
  end if;

  v_answer_count := cardinality(coalesce(p_answer_sequence, '{}'::text[]));
  if v_answer_count < 1 or v_answer_count > 32 then
    raise exception using errcode = '22023', message = 'invalid answer sequence length';
  end if;

  if exists (
    select 1
    from unnest(p_answer_sequence) as answer_row(answer_id)
    where answer_id not in ('answer-4', 'answer-6', 'answer-8')
  ) then
    raise exception using errcode = '22023', message = 'unknown answer option';
  end if;

  select count(*)::integer
  into v_correct_count
  from unnest(p_answer_sequence) as answer_row(answer_id)
  where answer_id = 'answer-6';

  if v_correct_count <> 1 or p_answer_sequence[v_answer_count] is distinct from 'answer-6' then
    raise exception using errcode = '22023', message = 'completed answer sequence must end with exactly one correct answer';
  end if;

  v_incorrect_count := v_answer_count - v_correct_count;
  v_retry_count := greatest(0, v_answer_count - 1);
  v_accuracy := v_correct_count::numeric / v_answer_count::numeric;

  if p_started_at is null or p_completed_at is null or p_completed_at < p_started_at then
    raise exception using errcode = '22023', message = 'invalid evidence timestamps';
  end if;

  v_duration_ms := floor(extract(epoch from (p_completed_at - p_started_at)) * 1000);
  if v_duration_ms < 0 or v_duration_ms > 7200000 then
    raise exception using errcode = '22023', message = 'invalid evidence duration';
  end if;

  -- Same independence principle as canonical Belajar, but World remains
  -- supplemental and is intentionally down-weighted.
  v_independence := 1 - least(0.65, v_retry_count * 0.08);
  v_evidence_score := greatest(0, least(1, v_accuracy * 0.72 + v_independence * 0.18 + 0.10));

  select exists(
    select 1
    from public.learning_supplemental_skill_evidence e
    where e.account_id = p_account_id
      and e.child_key = p_child_key
      and e.world_activity_id = p_world_activity_id
      and e.created_at > now() - interval '30 seconds'
  ) into v_rapid_repeat;

  select exists(
    select 1
    from public.learning_supplemental_skill_evidence e
    where e.account_id = p_account_id
      and e.child_key = p_child_key
      and e.world_activity_id = p_world_activity_id
      and e.content_version = p_content_version
      and e.qualifies_for_mastery = true
  ) into v_prior_qualifying;

  v_qualifies := (not v_rapid_repeat)
    and (not v_prior_qualifying)
    and v_retry_count < 7;

  v_reason := case
    when v_rapid_repeat then 'rapid-replay'
    when v_prior_qualifying then 'content-version-already-qualified'
    when v_retry_count >= 7 then 'excessive-retries'
    else 'qualifying-supplemental'
  end;

  insert into public.learning_supplemental_skill_evidence(
    account_id,
    child_key,
    client_observation_id,
    source_kind,
    world_id,
    stage_id,
    world_activity_id,
    mechanic_id,
    content_version,
    skill_key,
    evidence_contract,
    evidence_role,
    answer_sequence,
    accuracy,
    correct_count,
    incorrect_count,
    hint_count,
    retry_count,
    duration_ms,
    input_mode,
    evidence_score,
    evidence_weight,
    qualifies_for_mastery,
    qualification_reason,
    started_at,
    completed_at,
    metadata
  )
  values(
    p_account_id,
    p_child_key,
    p_client_observation_id,
    'world',
    'money-festival',
    'money-stage-08-final-festival',
    'money-s08-activity-02',
    'tap_choice',
    'money-world-s08-subtraction-v2-assessed',
    'math.operation.subtraction.within_10',
    'choice_accuracy_v1',
    'supplemental',
    p_answer_sequence,
    v_accuracy,
    v_correct_count,
    v_incorrect_count,
    0,
    v_retry_count,
    v_duration_ms::integer,
    nullif(left(coalesce(p_input_mode, ''), 32), ''),
    v_evidence_score,
    0.5000,
    v_qualifies,
    v_reason,
    p_started_at,
    p_completed_at,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  -- IMPORTANT: no mastery recompute here. Supplemental rows are inert until a
  -- separately reviewed source-aware mastery implementation is deployed.
  return v_id;
end;
$$;

revoke all on function public.record_world_skill_evidence(
  uuid, text, text, text, text, text, text, text, text[], text, timestamptz, timestamptz, jsonb
) from public, anon, authenticated, service_role;

grant execute on function public.record_world_skill_evidence(
  uuid, text, text, text, text, text, text, text, text[], text, timestamptz, timestamptz, jsonb
) to service_role;
