-- Mainlagi World progress persistence.
-- Additive and isolated from canonical Belajar learning attempts/mastery.
-- World progress records narrative/stage position only; it must not mint mastery,
-- certificates, learning stars, or child_learning_progress completion.

create table if not exists public.child_world_progress (
  account_id uuid not null references public.profiles(id) on delete cascade,
  child_key text not null check (char_length(child_key) between 1 and 128),
  world_id text not null check (char_length(world_id) between 1 and 80),
  completed_stage_ids text[] not null default '{}',
  current_stage_id text,
  current_segment_index integer not null default 0 check (current_segment_index between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (account_id, child_key, world_id)
);

alter table public.child_world_progress enable row level security;

drop policy if exists "child world progress own select" on public.child_world_progress;
create policy "child world progress own select" on public.child_world_progress
  for select using (account_id = (select auth.uid()));

revoke insert, update, delete on public.child_world_progress from anon, authenticated;
grant select on public.child_world_progress to authenticated;

create or replace function public.save_world_progress(
  p_child_key text,
  p_world_id text,
  p_completed_stage_ids text[],
  p_current_stage_id text,
  p_current_segment_index integer
)
returns public.child_world_progress
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_account_id uuid := auth.uid();
  v_stages constant text[] := array[
    'money-stage-01-money-use',
    'money-stage-02-price-change',
    'money-stage-03-income-sources',
    'money-stage-04-needs-wants',
    'money-stage-05-saving',
    'money-stage-06-investment-intro',
    'money-stage-07-risk',
    'money-stage-08-final-festival'
  ];
  v_completed text[] := coalesce(p_completed_stage_ids, '{}'::text[]);
  v_completed_count integer := cardinality(coalesce(p_completed_stage_ids, '{}'::text[]));
  v_current_order integer;
  v_existing_completed_count integer := 0;
  v_index integer;
  v_result public.child_world_progress;
begin
  if v_account_id is null then
    raise exception using errcode = '28000', message = 'authentication required';
  end if;

  if p_child_key is null or char_length(p_child_key) not between 1 and 128 then
    raise exception using errcode = '22023', message = 'invalid child key';
  end if;

  -- Keep the first production persistence boundary fail-closed to the only
  -- World that currently has an app-side content contract.
  if p_world_id is distinct from 'money-festival' then
    raise exception using errcode = '22023', message = 'unknown world';
  end if;

  if p_current_segment_index is null or p_current_segment_index < 0 or p_current_segment_index > 100 then
    raise exception using errcode = '22023', message = 'invalid world segment index';
  end if;

  if v_completed_count > cardinality(v_stages) then
    raise exception using errcode = '22023', message = 'too many completed world stages';
  end if;

  -- Completed stages must be the exact linear prefix. This prevents a client
  -- from jumping directly to later World stages while still allowing replay.
  if v_completed_count > 0 then
    for v_index in 1..v_completed_count loop
      if v_completed[v_index] is distinct from v_stages[v_index] then
        raise exception using errcode = '22023', message = 'world stages must complete in order';
      end if;
    end loop;
  end if;

  if p_current_stage_id is not null then
    v_current_order := array_position(v_stages, p_current_stage_id);
    if v_current_order is null then
      raise exception using errcode = '22023', message = 'unknown current world stage';
    end if;
    if v_current_order > v_completed_count + 1 then
      raise exception using errcode = '22023', message = 'current world stage is locked';
    end if;
  elsif p_current_segment_index <> 0 then
    raise exception using errcode = '22023', message = 'segment index requires current world stage';
  end if;

  -- Match canonical learning ownership: a real child must belong to the
  -- authenticated account. The fixed demo sentinel remains an account-scoped
  -- sandbox and is harmless because rows are still keyed by account_id.
  if p_child_key <> 'demo-gian' and not exists (
    select 1
    from public.player_profiles pp
    where pp.id::text = p_child_key
      and pp.account_id = v_account_id
      and pp.deleted_at is null
  ) then
    raise exception using errcode = '42501', message = 'world child is not owned by account';
  end if;

  -- Never let an older device erase stages already completed on another
  -- device. Replays/restarts remain valid when the completed prefix length is
  -- unchanged; only backwards completion movement is rejected.
  select cardinality(cwp.completed_stage_ids)
  into v_existing_completed_count
  from public.child_world_progress cwp
  where cwp.account_id = v_account_id
    and cwp.child_key = p_child_key
    and cwp.world_id = p_world_id
  for update;

  v_existing_completed_count := coalesce(v_existing_completed_count, 0);
  if v_completed_count < v_existing_completed_count then
    raise exception using errcode = '40001', message = 'world completion regression rejected';
  end if;

  insert into public.child_world_progress(
    account_id,
    child_key,
    world_id,
    completed_stage_ids,
    current_stage_id,
    current_segment_index,
    updated_at
  )
  values(
    v_account_id,
    p_child_key,
    p_world_id,
    v_completed,
    p_current_stage_id,
    p_current_segment_index,
    now()
  )
  on conflict (account_id, child_key, world_id) do update set
    completed_stage_ids = excluded.completed_stage_ids,
    current_stage_id = excluded.current_stage_id,
    current_segment_index = excluded.current_segment_index,
    updated_at = excluded.updated_at
  returning * into v_result;

  return v_result;
end;
$$;

revoke all on function public.save_world_progress(text, text, text[], text, integer)
  from public, anon, authenticated, service_role;
grant execute on function public.save_world_progress(text, text, text[], text, integer)
  to authenticated, service_role;

-- Explicitly keep the World persistence migration away from Belajar mastery
-- materializers/award triggers. No trigger is created on child_learning_progress,
-- child_skill_mastery, learning_attempts, or learning_certificates.
