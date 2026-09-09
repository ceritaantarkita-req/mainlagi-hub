import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const schema = readFileSync(path.join(root, "supabase/migrations/0002_learning_attempt_schema.sql"), "utf8");
const functions = readFileSync(path.join(root, "supabase/migrations/0003_learning_mastery_functions.sql"), "utf8");

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

for (const legacy of ["game_sessions", "game_scores", "progress"]) {
  assert.doesNotMatch(schema, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `legacy table ${legacy} must not be dropped`);
  assert.doesNotMatch(functions, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `legacy table ${legacy} must not be dropped`);
}

console.log("Learning migration contract tests passed.");
