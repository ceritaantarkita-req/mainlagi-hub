-- Mainlagi database advisor hardening
-- Least-privilege function exposure plus low-risk RLS/index improvements.

-- Pure helper: pin search_path so function resolution cannot be influenced by a
-- caller-controlled schema path.
alter function public.week_key_for(timestamptz) set search_path = pg_catalog;

-- Trigger/helper functions are not public API RPCs.
revoke all on function public.handle_new_user() from public, anon, authenticated, service_role;

revoke all on function public.ensure_active_season() from public, anon, authenticated, service_role;
grant execute on function public.ensure_active_season() to service_role;

-- record_best_score only writes rows owned by auth.uid(), and public.progress
-- already enforces that boundary with RLS. SECURITY INVOKER is sufficient and
-- avoids unnecessary privilege elevation.
create or replace function public.record_best_score(p_game_slug text, p_score integer)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  insert into public.progress(account_id, game_slug, best_score, completed_rounds, updated_at)
  values(auth.uid(), p_game_slug, greatest(0, p_score), 0, now())
  on conflict(account_id, game_slug) do update
    set best_score = greatest(public.progress.best_score, excluded.best_score),
        updated_at = now();
end; $$;
revoke all on function public.record_best_score(text, integer) from public, anon, authenticated, service_role;
grant execute on function public.record_best_score(text, integer) to authenticated, service_role;

-- Avoid per-row re-evaluation of auth.uid() in ownership policies.
drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles
  for select using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "player profiles own" on public.player_profiles;
create policy "player profiles own" on public.player_profiles
  for all using (account_id = (select auth.uid())) with check (account_id = (select auth.uid()));

drop policy if exists "sessions own" on public.game_sessions;
create policy "sessions own" on public.game_sessions
  for all using (account_id = (select auth.uid())) with check (account_id = (select auth.uid()));

drop policy if exists "scores own" on public.game_scores;
create policy "scores own" on public.game_scores
  for all using (account_id = (select auth.uid())) with check (account_id = (select auth.uid()));

drop policy if exists "progress own" on public.progress;
create policy "progress own" on public.progress
  for all using (account_id = (select auth.uid())) with check (account_id = (select auth.uid()));

drop policy if exists "learning attempts own select" on public.learning_attempts;
create policy "learning attempts own select" on public.learning_attempts
  for select using (account_id = (select auth.uid()));

drop policy if exists "learning evidence own select" on public.learning_attempt_skill_evidence;
create policy "learning evidence own select" on public.learning_attempt_skill_evidence
  for select using (account_id = (select auth.uid()));

drop policy if exists "child mastery own select" on public.child_skill_mastery;
create policy "child mastery own select" on public.child_skill_mastery
  for select using (account_id = (select auth.uid()));

drop policy if exists "child learning progress own select" on public.child_learning_progress;
create policy "child learning progress own select" on public.child_learning_progress
  for select using (account_id = (select auth.uid()));

drop policy if exists "child achievements own select" on public.child_learning_achievements;
create policy "child achievements own select" on public.child_learning_achievements
  for select using (account_id = (select auth.uid()));

drop policy if exists "learning certificates own select" on public.learning_certificates;
create policy "learning certificates own select" on public.learning_certificates
  for select using (account_id = (select auth.uid()));

-- A FOR ALL admin policy also participates in SELECT, creating duplicate
-- permissive SELECT policies. Split mutations by command so public-read and
-- admin-write paths stay independent.
drop policy if exists "learning skills admin write" on public.learning_skills;
create policy "learning skills admin insert" on public.learning_skills
  for insert with check ((select public.is_admin()));
create policy "learning skills admin update" on public.learning_skills
  for update using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "learning skills admin delete" on public.learning_skills
  for delete using ((select public.is_admin()));

drop policy if exists "learning activities admin write" on public.learning_activities;
create policy "learning activities admin insert" on public.learning_activities
  for insert with check ((select public.is_admin()));
create policy "learning activities admin update" on public.learning_activities
  for update using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "learning activities admin delete" on public.learning_activities
  for delete using ((select public.is_admin()));

drop policy if exists "learning activity skills admin write" on public.learning_activity_skills;
create policy "learning activity skills admin insert" on public.learning_activity_skills
  for insert with check ((select public.is_admin()));
create policy "learning activity skills admin update" on public.learning_activity_skills
  for update using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "learning activity skills admin delete" on public.learning_activity_skills
  for delete using ((select public.is_admin()));

drop policy if exists "affiliate owner write" on public.affiliate_items;
create policy "affiliate owner insert" on public.affiliate_items
  for insert with check ((select public.is_admin()));
create policy "affiliate owner update" on public.affiliate_items
  for update using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "affiliate owner delete" on public.affiliate_items
  for delete using ((select public.is_admin()));

-- Cover foreign-key lookup directions that are not already left-most in an
-- existing primary/composite index.
create index if not exists idx_learning_attempts_activity_id
  on public.learning_attempts(activity_id);
create index if not exists idx_learning_activity_skills_skill_key
  on public.learning_activity_skills(skill_key);
create index if not exists idx_learning_evidence_skill_key
  on public.learning_attempt_skill_evidence(skill_key);
create index if not exists idx_child_skill_mastery_skill_key
  on public.child_skill_mastery(skill_key);
