import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const migration = readFileSync(path.join(root, "supabase", "migrations", "0014_batch6_award_catalog_scaling.sql"), "utf8");
const insights = readFileSync(path.join(root, "src", "lib", "learning", "insights.ts"), "utf8");
const awardsCloud = readFileSync(path.join(root, "src", "lib", "learning", "awardsCloud.ts"), "utf8");

assert.match(migration, /create or replace function private\.refresh_learning_awards\(\)/i, "Batch 6 must replace the server-owned award function");
assert.match(migration, /if v_subject_count >= 8 then/i, "cloud all-subjects award must require all eight current first-class subjects");
assert.match(migration, /'catalog_subject_count', 8/i, "cloud award evidence should record the catalog threshold used");
assert.match(migration, /on conflict \(account_id, child_key, achievement_key\) do nothing/i, "award refresh must remain idempotent");
assert.match(migration, /revoke all on function private\.refresh_learning_awards\(\) from public, anon, authenticated, service_role/i, "private trigger helper must stay unavailable as an API RPC");
assert.doesNotMatch(migration, /drop\s+table/i, "award scaling migration must not drop tables");
assert.doesNotMatch(migration, /delete\s+from\s+public\.learning_/i, "award scaling migration must not delete learning history");

assert.match(insights, /exploredSubjects\.size >= SUBJECTS\.length/, "local all-subjects award must derive its threshold from the current catalog");
assert.match(awardsCloud, /if \(!getSubject\(row\.subject_id\)\) return \[\]/, "cloud certificate reader must accept all known first-class subjects without a stale hardcoded list");

console.log("Batch 6 local/cloud award and certificate subject scaling contracts passed.");
