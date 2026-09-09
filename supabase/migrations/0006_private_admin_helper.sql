-- Move the admin-check helper out of the exposed public API schema.
-- RLS policies can execute the private helper, but PostgREST does not expose it
-- as /rest/v1/rpc/is_admin under the public schema.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = pg_catalog, public as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid() and role in ('admin','owner')
  );
$$;
revoke all on function private.is_admin() from public, anon, authenticated, service_role;
grant execute on function private.is_admin() to anon, authenticated, service_role;

-- Rebind all policies that require elevated admin inspection to the private
-- helper. Ownership predicates keep init-plan auth.uid() form.
drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles
  for select using (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "games public read" on public.games;
create policy "games public read" on public.games
  for select using (status <> 'draft' or (select private.is_admin()));

drop policy if exists "articles public read" on public.articles;
create policy "articles public read" on public.articles
  for select using (status = 'published' or (select private.is_admin()));

drop policy if exists "affiliate public read" on public.affiliate_items;
create policy "affiliate public read" on public.affiliate_items
  for select using (active = true or (select private.is_admin()));

drop policy if exists "affiliate owner insert" on public.affiliate_items;
create policy "affiliate owner insert" on public.affiliate_items
  for insert with check ((select private.is_admin()));
drop policy if exists "affiliate owner update" on public.affiliate_items;
create policy "affiliate owner update" on public.affiliate_items
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "affiliate owner delete" on public.affiliate_items;
create policy "affiliate owner delete" on public.affiliate_items
  for delete using ((select private.is_admin()));

drop policy if exists "affiliate click owner read" on public.affiliate_clicks;
create policy "affiliate click owner read" on public.affiliate_clicks
  for select using ((select private.is_admin()));

drop policy if exists "audit owner read" on public.audit_logs;
create policy "audit owner read" on public.audit_logs
  for select using ((select private.is_admin()));

drop policy if exists "learning skills public read" on public.learning_skills;
create policy "learning skills public read" on public.learning_skills
  for select using (active = true or (select private.is_admin()));
drop policy if exists "learning skills admin insert" on public.learning_skills;
create policy "learning skills admin insert" on public.learning_skills
  for insert with check ((select private.is_admin()));
drop policy if exists "learning skills admin update" on public.learning_skills;
create policy "learning skills admin update" on public.learning_skills
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "learning skills admin delete" on public.learning_skills;
create policy "learning skills admin delete" on public.learning_skills
  for delete using ((select private.is_admin()));

drop policy if exists "learning activities public read" on public.learning_activities;
create policy "learning activities public read" on public.learning_activities
  for select using (active = true or (select private.is_admin()));
drop policy if exists "learning activities admin insert" on public.learning_activities;
create policy "learning activities admin insert" on public.learning_activities
  for insert with check ((select private.is_admin()));
drop policy if exists "learning activities admin update" on public.learning_activities;
create policy "learning activities admin update" on public.learning_activities
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "learning activities admin delete" on public.learning_activities;
create policy "learning activities admin delete" on public.learning_activities
  for delete using ((select private.is_admin()));

drop policy if exists "learning activity skills admin insert" on public.learning_activity_skills;
create policy "learning activity skills admin insert" on public.learning_activity_skills
  for insert with check ((select private.is_admin()));
drop policy if exists "learning activity skills admin update" on public.learning_activity_skills;
create policy "learning activity skills admin update" on public.learning_activity_skills
  for update using ((select private.is_admin())) with check ((select private.is_admin()));
drop policy if exists "learning activity skills admin delete" on public.learning_activity_skills;
create policy "learning activity skills admin delete" on public.learning_activity_skills
  for delete using ((select private.is_admin()));

-- The public helper is now unused and should not remain an exposed RPC.
drop function if exists public.is_admin();
