-- Enforce that every real learning child key belongs to the same account.
-- The fixed demo child remains available as an account-scoped sandbox sentinel.

create or replace function private.enforce_learning_attempt_child_ownership()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if new.child_key = 'demo-gian' then
    return new;
  end if;

  if exists (
    select 1
    from public.player_profiles pp
    where pp.id::text = new.child_key
      and pp.account_id = new.account_id
      and pp.deleted_at is null
  ) then
    return new;
  end if;

  raise exception using
    errcode = '42501',
    message = 'learning child is not owned by account';
end;
$$;

revoke all on function private.enforce_learning_attempt_child_ownership() from public, anon, authenticated, service_role;

drop trigger if exists learning_attempt_child_ownership on public.learning_attempts;
create trigger learning_attempt_child_ownership
before insert or update of account_id, child_key on public.learning_attempts
for each row execute function private.enforce_learning_attempt_child_ownership();
