-- Mainlagi World evidence live-database advisor hardening.
--
-- 0048 intentionally used RLS-with-no-policy as a deny-all browser posture and
-- revoked direct table mutation from every API role. Supabase's advisor reports
-- that posture as INFO. This migration makes the deny intent explicit without
-- changing the service-role-only write boundary.
--
-- It also adds a leftmost index for the skill_key foreign key so deletes/updates
-- on learning_skills do not require scanning the supplemental evidence table.

create index if not exists idx_supplemental_evidence_skill_key
  on public.learning_supplemental_skill_evidence(skill_key);

drop policy if exists "supplemental evidence deny direct api" on public.learning_supplemental_skill_evidence;
create policy "supplemental evidence deny direct api"
  on public.learning_supplemental_skill_evidence
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Keep the explicit privilege boundary from 0048.
revoke all on public.learning_supplemental_skill_evidence
  from public, anon, authenticated, service_role;
grant select on public.learning_supplemental_skill_evidence to service_role;

-- record_world_skill_evidence remains service-role-only. This migration does
-- not change World mapping, mastery, progress, rewards, certificates, or runtime.
