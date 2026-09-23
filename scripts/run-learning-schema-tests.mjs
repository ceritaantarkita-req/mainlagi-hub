import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const schema = readFileSync(path.join(root, "supabase/migrations/0002_learning_attempt_schema.sql"), "utf8");
const functions = readFileSync(path.join(root, "supabase/migrations/0003_learning_mastery_functions.sql"), "utf8");
const hardening = readFileSync(path.join(root, "supabase/migrations/0004_learning_rpc_hardening.sql"), "utf8");
const advisorHardening = readFileSync(path.join(root, "supabase/migrations/0005_database_advisor_hardening.sql"), "utf8");
const privateAdmin = readFileSync(path.join(root, "supabase/migrations/0006_private_admin_helper.sql"), "utf8");
const childOwnership = readFileSync(path.join(root, "supabase/migrations/0007_learning_child_ownership.sql"), "utf8");
const contentExpansion = readFileSync(path.join(root, "supabase/migrations/0008_curriculum_content_expansion.sql"), "utf8");
const contentArchitecture = readFileSync(path.join(root, "supabase/migrations/0011_scalable_content_architecture.sql"), "utf8");
const reusableMechanics = readFileSync(path.join(root, "supabase/migrations/0012_reusable_mechanic_library.sql"), "utf8");
const subjectFoundations = readFileSync(path.join(root, "supabase/migrations/0013_new_subject_curriculum_foundations.sql"), "utf8");
const worldProgress = readFileSync(path.join(root, "supabase/migrations/0047_world_progress_persistence.sql"), "utf8");
const supplementalEvidence = readFileSync(path.join(root, "supabase/migrations/0048_world_supplemental_evidence_foundation.sql"), "utf8");

const requiredTables = [
  "learning_skills", "learning_activities", "learning_activity_skills", "learning_attempts",
  "learning_attempt_skill_evidence", "child_skill_mastery", "child_learning_progress",
  "child_learning_achievements", "learning_certificates"
];
for (const table of requiredTables) {
  assert.match(schema, new RegExp(`create table if not exists public\\.${table}\\b`, "i"), `missing table ${table}`);
  assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security`, "i"), `RLS missing for ${table}`);
}

assert.match(schema, /unique\s*\(account_id,\s*child_key,\s*client_attempt_id\)/i, "learning attempts must be idempotent per account/child/client attempt");
assert.match(schema, /revoke insert, update, delete on public\.learning_attempts from anon, authenticated/i, "clients must not mutate attempts directly");
assert.match(schema, /revoke insert, update, delete on public\.child_skill_mastery from anon, authenticated/i, "clients must not forge mastery");
assert.match(functions, /create or replace function public\.record_learning_attempt\s*\(/i, "attempt RPC missing");
assert.match(functions, /create or replace function public\.recompute_child_skill_mastery\s*\(/i, "mastery materializer missing");
assert.match(functions, /auth\.uid\(\)/i, "attempt RPC must bind writes to authenticated account");
assert.match(functions, /interval '30 seconds'/i, "rapid replay guard missing");
assert.match(functions, /p_retry_count,0\)\) < 7/i, "excessive retry mastery guard missing");
assert.match(functions, /v_count >= 3 and v_score >= 0\.85 and v_confidence >= 0\.65/i, "mastery threshold contract missing");
assert.match(functions, /grant execute on function public\.record_learning_attempt/i, "authenticated execute grant missing");

assert.match(hardening, /revoke all on function public\.recompute_child_skill_mastery\(uuid, text, text\) from public, anon, authenticated, service_role/i, "mastery helper must revoke API-role execution explicitly");
assert.match(hardening, /grant execute on function public\.recompute_child_skill_mastery\(uuid, text, text\) to service_role/i, "mastery helper should be service-role only");
assert.match(hardening, /revoke all on function public\.record_learning_attempt[\s\S]*from public, anon, authenticated, service_role/i, "attempt RPC must revoke default API grants before granting trusted roles");
assert.match(hardening, /grant execute on function public\.record_learning_attempt[\s\S]*to authenticated, service_role/i, "attempt RPC must be authenticated/service-role only");
assert.match(hardening, /v_activity\.subject_id, v_activity\.stage_id, v_activity\.runtime/i, "attempt metadata must come from the server activity catalog");
assert.match(hardening, /v_is_assessed := v_activity\.assessment = 'assessed' and v_status = 'completed' and v_accuracy is not null/i, "server must require catalog-assessed completed measurable outcomes");
assert.match(hardening, /created_at > now\(\) - interval '30 seconds'/i, "replay protection must use server receipt time");
assert.match(hardening, /\(not v_rapid_repeat\) and greatest\(0, coalesce\(p_retry_count,0\)\) < 7/i, "rapid repeats and excessive retries must remain stored but non-qualifying");
assert.match(hardening, /case when v_first_completion then coalesce\(v_activity\.star_reward,0\) else 0 end/i, "replays must not farm first-completion star rewards");
assert.match(hardening, /octet_length\(coalesce\(p_metadata, '\{\}'::jsonb\)::text\) > 16384/i, "attempt metadata must be bounded server-side");

assert.match(advisorHardening, /alter function public\.week_key_for\(timestamptz\) set search_path = pg_catalog/i, "week helper search path must be pinned");
assert.match(advisorHardening, /revoke all on function public\.handle_new_user\(\) from public, anon, authenticated, service_role/i, "trigger helper must not be exposed as API RPC");
assert.match(advisorHardening, /revoke all on function public\.ensure_active_season\(\) from public, anon, authenticated, service_role/i, "season helper must not be exposed to public API roles");
assert.match(advisorHardening, /record_best_score[\s\S]*security invoker/i, "best-score RPC should use invoker rights");
assert.match(advisorHardening, /account_id = \(select auth\.uid\(\)\)/i, "ownership policies should init-plan auth.uid");
for (const index of ["idx_learning_attempts_activity_id", "idx_learning_activity_skills_skill_key", "idx_learning_evidence_skill_key", "idx_child_skill_mastery_skill_key"]) {
  assert.match(advisorHardening, new RegExp(`create index if not exists ${index}\\b`, "i"), `missing advisor index ${index}`);
}

assert.match(privateAdmin, /create schema if not exists private/i, "private helper schema missing");
assert.match(privateAdmin, /create or replace function private\.is_admin\(\)/i, "private admin helper missing");
assert.match(privateAdmin, /security definer set search_path = pg_catalog, public/i, "private admin helper search path must be pinned");
assert.match(privateAdmin, /select private\.is_admin\(\)/i, "RLS policies must use private admin helper");
assert.match(privateAdmin, /drop function if exists public\.is_admin\(\)/i, "public is_admin RPC must be removed after policy rebinding");

assert.match(childOwnership, /create or replace function private\.enforce_learning_attempt_child_ownership\(\)/i, "learning child ownership helper missing");
assert.match(childOwnership, /new\.child_key = 'demo-gian'/i, "only the explicit demo sandbox sentinel should bypass real-profile lookup");
assert.match(childOwnership, /pp\.id::text = new\.child_key/i, "real learning child keys must resolve to player_profiles");
assert.match(childOwnership, /pp\.account_id = new\.account_id/i, "real learning child profiles must belong to the same account");
assert.match(childOwnership, /pp\.deleted_at is null/i, "soft-deleted child profiles must not accept new learning attempts");
assert.match(childOwnership, /before insert or update of account_id, child_key on public\.learning_attempts/i, "learning child ownership trigger must run before writes");
assert.match(childOwnership, /raise exception[\s\S]*errcode = '42501'/i, "unowned learning child writes must fail closed");

const expandedActivities = [
  "bahasa-cari-a-lagi", "bahasa-pasang-awal-lagi", "english-find-blue-audio", "english-listen-cat-2",
  "english-match-words-2", "math-count-2", "math-pattern-touch-2", "iqro-pasang-alif"
];
for (const activityId of expandedActivities) {
  assert.match(contentExpansion, new RegExp(`\\('${activityId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'`), `content migration must seed ${activityId}`);
}
assert.match(contentExpansion, /'assessed',false,false/i, "evidence variants must stay non-required and non-motion");
assert.match(contentExpansion, /on conflict \(activity_id\) do update/i, "content activity migration must be idempotent");
assert.match(contentExpansion, /on conflict \(activity_id, skill_key\) do update/i, "content skill links must be idempotent");
assert.doesNotMatch(contentExpansion, /insert into public\.learning_skills/i, "this wave must reuse existing validated skills rather than inflate the skill taxonomy");

assert.match(contentArchitecture, /create table if not exists public\.learning_content_packs/i, "Batch 4 content pack table missing");
assert.match(contentArchitecture, /alter table public\.learning_content_packs enable row level security/i, "content packs need RLS");
assert.match(contentArchitecture, /select private\.is_admin\(\)/i, "content-pack policies must reuse the private admin helper");
for (const column of ["content_pack_id", "lesson_id", "mechanic_id", "evidence_contract", "content_revision"]) {
  assert.match(contentArchitecture, new RegExp(`add column if not exists ${column}\\b`, "i"), `Batch 4 missing learning_activities.${column}`);
}
assert.match(contentArchitecture, /review_status in \('internal','expert_required','expert_approved'\)/i, "review state must be explicit");
assert.match(contentArchitecture, /idx_learning_activities_content_pack/i, "content-pack lookup index missing");
assert.match(contentArchitecture, /idx_learning_activities_lesson/i, "lesson lookup index missing");
assert.match(contentArchitecture, /on conflict \(pack_id\) do update/i, "content-pack seed must be idempotent");
assert.match(contentArchitecture, /content_revision > 0/i, "content revisions must stay positive");
assert.doesNotMatch(contentArchitecture, /alter\s+column\s+activity_id/i, "Batch 4 must preserve the historical activity identity column");

const expectedMechanics = [
  "tap_choice", "listen_and_choose", "matching", "guided_trace", "story", "coloring", "motion_game",
  "drag_to_target", "draw_line_matching", "sort_classify", "ordering_sequence", "pattern_completion",
  "odd_one_out", "connect_dots", "memory_pairs", "compare", "missing_item", "maze_path",
  "story_comprehension", "find_object"
];
const expectedEvidenceContracts = [
  "choice_accuracy_v1", "matching_accuracy_v1", "target_accuracy_v1", "classification_accuracy_v1",
  "sequence_accuracy_v1", "guided_trace_path_v1", "path_quality_v1", "completion_only_v1"
];
assert.match(reusableMechanics, /drop constraint if exists learning_activities_mechanic_id_check/i, "Batch 5 must replace only the mechanic vocabulary check");
assert.match(reusableMechanics, /drop constraint if exists learning_activities_evidence_contract_check/i, "Batch 5 must replace only the evidence vocabulary check");
for (const mechanicId of expectedMechanics) assert.match(reusableMechanics, new RegExp(`'${mechanicId}'`), `Batch 5 missing mechanic ${mechanicId}`);
for (const evidenceId of expectedEvidenceContracts) assert.match(reusableMechanics, new RegExp(`'${evidenceId}'`), `Batch 5 missing evidence contract ${evidenceId}`);
assert.doesNotMatch(reusableMechanics, /alter\s+column\s+activity_id/i, "Batch 5 must preserve historical activity identity");
assert.doesNotMatch(reusableMechanics, /delete\s+from\s+public\.learning_/i, "Batch 5 vocabulary migration must not delete learning data");

const batch6Subjects = ["letters", "logic", "science"];
for (const subjectId of batch6Subjects) {
  assert.match(subjectFoundations, new RegExp(`'${subjectId}'`), `Batch 6 must allow subject ${subjectId}`);
}
for (const table of ["learning_skills", "learning_activities", "learning_attempts", "learning_certificates", "learning_content_packs"]) {
  assert.match(subjectFoundations, new RegExp(`alter table public\\.${table}[\\s\\S]*drop constraint if exists ${table}_subject_id_check`, "i"), `Batch 6 must replace ${table} subject vocabulary check`);
  assert.match(subjectFoundations, new RegExp(`alter table public\\.${table}[\\s\\S]*add constraint ${table}_subject_id_check`, "i"), `Batch 6 must restore ${table} subject vocabulary check`);
}
for (const skillId of [
  "letters.latin.a.recognition", "letters.latin.a.formation", "logic.visual.matching",
  "logic.visual.discrimination", "science.living.classification", "science.animals.habitat"
]) {
  assert.match(subjectFoundations, new RegExp(`'${skillId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'`), `Batch 6 migration must seed ${skillId}`);
}
for (const packId of ["letters.pack.letter-a", "logic.pack.visual-basics", "science.pack.living-world"]) {
  assert.match(subjectFoundations, new RegExp(`'${packId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'`), `Batch 6 migration must seed ${packId}`);
}
for (const activityId of [
  "letters-find-a", "letters-trace-a", "letters-match-case", "logic-match-pairs", "logic-odd-one-out",
  "logic-more-less", "science-living-cat", "science-match-habitat", "science-find-plant"
]) {
  assert.match(subjectFoundations, new RegExp(`'${activityId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'`), `Batch 6 migration must seed ${activityId}`);
}
assert.match(subjectFoundations, /on conflict \(skill_key\) do update/i, "Batch 6 skill seed must be idempotent");
assert.match(subjectFoundations, /on conflict \(pack_id\) do update/i, "Batch 6 pack seed must be idempotent");
assert.match(subjectFoundations, /on conflict \(activity_id\) do update/i, "Batch 6 activity seed must be idempotent");
assert.match(subjectFoundations, /on conflict \(activity_id, skill_key\) do update/i, "Batch 6 activity-skill seed must be idempotent");
assert.doesNotMatch(subjectFoundations, /drop\s+table/i, "Batch 6 must not drop learning tables");
assert.doesNotMatch(subjectFoundations, /delete\s+from\s+public\.learning_/i, "Batch 6 must not delete learning data");

assert.match(worldProgress, /create table if not exists public\.child_world_progress/i, "World progress table missing");
assert.match(worldProgress, /primary key \(account_id, child_key, world_id\)/i, "World progress identity must be account + child + world");
assert.match(worldProgress, /alter table public\.child_world_progress enable row level security/i, "World progress must enable RLS");
assert.match(worldProgress, /create policy "child world progress own select"[\s\S]*account_id = \(select auth\.uid\(\)\)/i, "World progress read policy must stay account-owned");
assert.match(worldProgress, /revoke insert, update, delete on public\.child_world_progress from anon, authenticated/i, "World progress clients must not mutate the table directly");
assert.match(worldProgress, /create or replace function public\.save_world_progress\s*\(/i, "World progress RPC missing");
assert.match(worldProgress, /security definer[\s\S]*set search_path = pg_catalog, public/i, "World progress RPC must pin search_path");
assert.match(worldProgress, /p_world_id is distinct from 'money-festival'/i, "World progress RPC must fail closed to registered World IDs");
assert.match(worldProgress, /world stages must complete in order/i, "World progress RPC must enforce linear stage completion");
assert.match(worldProgress, /v_current_order > v_completed_count \+ 1/i, "World progress RPC must reject locked current stages");
assert.match(worldProgress, /for update/i, "World progress RPC must serialize existing progress before overwrite");
assert.match(worldProgress, /v_completed_count < v_existing_completed_count/i, "World progress RPC must reject stale completion regressions");
assert.match(worldProgress, /world completion regression rejected/i, "World progress regression failure must be explicit");
assert.match(worldProgress, /where cardinality\(excluded\.completed_stage_ids\) >= cardinality\(public\.child_world_progress\.completed_stage_ids\)/i, "World progress upsert must reject a concurrent shorter prefix");
assert.match(worldProgress, /if v_result\.account_id is null then[\s\S]*world completion regression rejected/i, "Concurrent World regression must fail closed after conflict filtering");
assert.match(worldProgress, /pp\.id::text = p_child_key[\s\S]*pp\.account_id = v_account_id[\s\S]*pp\.deleted_at is null/i, "World progress RPC must enforce real child ownership");
assert.match(worldProgress, /grant execute on function public\.save_world_progress[\s\S]*to authenticated, service_role/i, "World progress RPC execute grant must be explicit");
assert.doesNotMatch(worldProgress, /insert into public\.child_learning_progress/i, "World progress must not forge canonical Belajar completion");
assert.doesNotMatch(worldProgress, /insert into public\.child_skill_mastery/i, "World progress must not forge mastery");
assert.doesNotMatch(worldProgress, /insert into public\.learning_certificates/i, "World progress must not issue certificates");
assert.doesNotMatch(worldProgress, /insert into public\.child_learning_achievements/i, "World progress must not issue achievements");

assert.match(supplementalEvidence, /create table if not exists public\.learning_supplemental_skill_evidence/i, "World supplemental evidence table missing");
assert.match(supplementalEvidence, /alter table public\.learning_supplemental_skill_evidence enable row level security/i, "supplemental evidence table must enable RLS");
assert.match(supplementalEvidence, /unique \(account_id, child_key, client_observation_id\)/i, "World evidence observations must be idempotent per account\/child\/client observation");
assert.match(supplementalEvidence, /create unique index if not exists uq_supplemental_world_qualifying_content[\s\S]*where source_kind = 'world' and qualifies_for_mastery = true/i, "one static World item/content version must have a database-level qualifying-evidence cap");
assert.match(supplementalEvidence, /revoke all on public\.learning_supplemental_skill_evidence[\s\S]*from public, anon, authenticated, service_role/i, "normal clients and service role must not directly mutate supplemental evidence table");
assert.match(supplementalEvidence, /grant select on public\.learning_supplemental_skill_evidence to service_role/i, "implementation wave may expose supplemental evidence reads only to the server role");
assert.match(supplementalEvidence, /create or replace function public\.record_world_skill_evidence\s*\(/i, "server-only World evidence RPC missing");
assert.match(supplementalEvidence, /security definer[\s\S]*set search_path = pg_catalog, public/i, "World evidence RPC must pin search_path");
assert.match(supplementalEvidence, /v_mapping_active constant boolean := false/i, "database World evidence mapping must remain independently disabled");
assert.match(supplementalEvidence, /grant execute on function public\.record_world_skill_evidence[\s\S]*to service_role/i, "World evidence RPC must be executable by service role only");
assert.doesNotMatch(supplementalEvidence, /grant execute on function public\.record_world_skill_evidence[\s\S]*to authenticated/i, "authenticated browser role must never receive direct World evidence RPC execution");
assert.doesNotMatch(supplementalEvidence, /p_skill_key|p_evidence_weight|p_evidence_score|p_qualifies_for_mastery/i, "client/server caller must not supply canonical mapping, evidence score, weight, or qualification");
assert.match(supplementalEvidence, /p_world_id is distinct from 'money-festival'[\s\S]*p_stage_id is distinct from 'money-stage-08-final-festival'[\s\S]*p_world_activity_id is distinct from 'money-s08-activity-02'[\s\S]*p_mechanic_id is distinct from 'tap_choice'[\s\S]*p_content_version is distinct from 'money-world-s08-subtraction-v1'/i, "database must own the exact World source mapping");
assert.match(supplementalEvidence, /'math\.operation\.subtraction\.within_10'/i, "database mapping must target only the approved subtraction skill");
assert.match(supplementalEvidence, /'choice_accuracy_v1'/i, "database mapping must own the approved evidence contract");
assert.match(supplementalEvidence, /p_child_key = 'demo-gian'[\s\S]*demo child cannot create canonical supplemental evidence/i, "demo sandbox must be mastery-ineligible");
assert.match(supplementalEvidence, /pp\.id::text = p_child_key[\s\S]*pp\.account_id = p_account_id[\s\S]*pp\.deleted_at is null[\s\S]*for update/i, "World evidence RPC must enforce and serialize real child ownership");
assert.match(supplementalEvidence, /when pp\.age_group = 'SD 1' then 6[\s\S]*when pp\.age_group = 'SD 2' then 7/i, "legacy age groups must resolve only to explicit canonical ages");
assert.match(supplementalEvidence, /v_age is null or v_age < 6 or v_age > 7/i, "World supplemental evidence must stay restricted to ages 6-7");
assert.match(supplementalEvidence, /created_at > now\(\) - interval '30 seconds'/i, "World evidence replay protection must use server receipt time");
assert.match(supplementalEvidence, /v_retry_count < 7/i, "seven-or-more retries must remain non-qualifying");
assert.match(supplementalEvidence, /v_prior_qualifying/i, "World evidence must detect prior qualifying content-version evidence");
assert.match(supplementalEvidence, /p_answer_sequence\[v_answer_count\] is distinct from 'answer-6'/i, "database must derive correctness from the canonical answer rather than caller accuracy");
assert.match(supplementalEvidence, /v_accuracy := v_correct_count::numeric \/ v_answer_count::numeric/i, "database must derive accuracy from raw answer sequence");
assert.match(supplementalEvidence, /0\.5000/i, "World evidence must remain conservatively supplemental-weighted");
assert.match(supplementalEvidence, /octet_length\(coalesce\(p_metadata, '\{\}'::jsonb\)::text\) > 8192/i, "World evidence metadata must be bounded");
assert.doesNotMatch(supplementalEvidence, /insert into public\.learning_attempts/i, "supplemental World evidence must not forge a Belajar attempt");
assert.doesNotMatch(supplementalEvidence, /recompute_child_skill_mastery\s*\(/i, "implementation wave 1 must not recompute mastery");
assert.doesNotMatch(supplementalEvidence, /insert into public\.child_learning_progress/i, "World evidence must not mutate Belajar progress");
assert.doesNotMatch(supplementalEvidence, /insert into public\.child_skill_mastery/i, "World evidence must not directly forge mastery rows");
assert.doesNotMatch(supplementalEvidence, /insert into public\.learning_certificates/i, "World evidence must not issue certificates");
assert.doesNotMatch(supplementalEvidence, /insert into public\.child_learning_achievements/i, "World evidence must not issue achievements");

for (const legacy of ["game_sessions", "game_scores", "progress"]) {
  for (const [name, migration] of [
    ["schema", schema], ["functions", functions], ["hardening", hardening], ["advisor hardening", advisorHardening],
    ["private-admin migration", privateAdmin], ["child-ownership migration", childOwnership],
    ["content-expansion migration", contentExpansion], ["content-architecture migration", contentArchitecture],
    ["reusable-mechanic migration", reusableMechanics], ["subject-foundation migration", subjectFoundations],
    ["World progress migration", worldProgress],
    ["World supplemental evidence migration", supplementalEvidence]
  ]) {
    assert.doesNotMatch(migration, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `${name} must not drop legacy table ${legacy}`);
  }
}

console.log("Learning migration, anti-farming, ownership, scalable-content, reusable-mechanic, Batch 6 subject, isolated World progress, and fail-closed supplemental World evidence schema contract tests passed.");
