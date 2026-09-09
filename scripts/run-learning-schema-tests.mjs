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

const requiredTables = [
  "learning_skills",
  "learning_activities",
  "learning_activity_skills",
  "learning_attempts",
  "learning_attempt_skill_evidence",
  "child_skill_mastery",
  "child_learning_progress",
  "child_learning_achievements",
  "learning_certificates"
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
assert.match(advisorHardening, /revoke all on function public\.record_best_score\(text, integer\) from public, anon, authenticated, service_role/i, "best-score RPC must revoke default API grants first");
assert.match(advisorHardening, /grant execute on function public\.record_best_score\(text, integer\) to authenticated, service_role/i, "best-score RPC should remain available to authenticated callers");
assert.match(advisorHardening, /account_id = \(select auth\.uid\(\)\)/i, "ownership policies should init-plan auth.uid");
for (const index of [
  "idx_learning_attempts_activity_id",
  "idx_learning_activity_skills_skill_key",
  "idx_learning_evidence_skill_key",
  "idx_child_skill_mastery_skill_key"
]) {
  assert.match(advisorHardening, new RegExp(`create index if not exists ${index}\\b`, "i"), `missing advisor index ${index}`);
}

assert.match(privateAdmin, /create schema if not exists private/i, "private helper schema missing");
assert.match(privateAdmin, /create or replace function private\.is_admin\(\)/i, "private admin helper missing");
assert.match(privateAdmin, /security definer set search_path = pg_catalog, public/i, "private admin helper search path must be pinned");
assert.match(privateAdmin, /grant execute on function private\.is_admin\(\) to anon, authenticated, service_role/i, "RLS roles need execute on private admin helper");
assert.match(privateAdmin, /select private\.is_admin\(\)/i, "RLS policies must use private admin helper");
assert.match(privateAdmin, /drop function if exists public\.is_admin\(\)/i, "public is_admin RPC must be removed after policy rebinding");

assert.match(childOwnership, /create or replace function private\.enforce_learning_attempt_child_ownership\(\)/i, "learning child ownership helper missing");
assert.match(childOwnership, /new\.child_key = 'demo-gian'/i, "only the explicit demo sandbox sentinel should bypass real-profile lookup");
assert.match(childOwnership, /pp\.id::text = new\.child_key/i, "real learning child keys must resolve to player_profiles");
assert.match(childOwnership, /pp\.account_id = new\.account_id/i, "real learning child profiles must belong to the same account");
assert.match(childOwnership, /pp\.deleted_at is null/i, "soft-deleted child profiles must not accept new learning attempts");
assert.match(childOwnership, /before insert or update of account_id, child_key on public\.learning_attempts/i, "learning child ownership trigger must run before writes");
assert.match(childOwnership, /raise exception[\s\S]*errcode = '42501'/i, "unowned learning child writes must fail closed");
assert.match(childOwnership, /revoke all on function private\.enforce_learning_attempt_child_ownership\(\) from public, anon, authenticated, service_role/i, "ownership trigger helper must not be exposed as an API RPC");

const expandedActivities = [
  "bahasa-cari-a-lagi",
  "bahasa-pasang-awal-lagi",
  "english-find-blue-audio",
  "english-listen-cat-2",
  "english-match-words-2",
  "math-count-2",
  "math-pattern-touch-2",
  "iqro-pasang-alif"
];
for (const activityId of expandedActivities) {
  assert.match(contentExpansion, new RegExp(`\\('${activityId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}'`), `content migration must seed ${activityId}`);
}
assert.match(contentExpansion, /'assessed',false,false/i, "evidence variants must stay non-required and non-motion");
assert.match(contentExpansion, /on conflict \(activity_id\) do update/i, "content activity migration must be idempotent");
assert.match(contentExpansion, /on conflict \(activity_id, skill_key\) do update/i, "content skill links must be idempotent");
assert.doesNotMatch(contentExpansion, /insert into public\.learning_skills/i, "this wave must reuse existing validated skills rather than inflate the skill taxonomy");

for (const legacy of ["game_sessions", "game_scores", "progress"]) {
  for (const [name, migration] of [
    ["schema", schema],
    ["functions", functions],
    ["hardening", hardening],
    ["advisor hardening", advisorHardening],
    ["private-admin migration", privateAdmin],
    ["child-ownership migration", childOwnership],
    ["content-expansion migration", contentExpansion]
  ]) {
    assert.doesNotMatch(migration, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `${name} must not drop legacy table ${legacy}`);
  }
}

console.log("Learning migration, anti-farming, child-ownership, and content-expansion contract tests passed.");
