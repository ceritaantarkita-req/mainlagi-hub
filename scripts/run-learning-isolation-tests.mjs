import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-isolation-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [
  tscBin,
  "-p",
  "tsconfig.learning-tests.json",
  "--outDir",
  outDir
], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
  clear() { this.#values.clear(); }
}

const previousWindow = globalThis.window;
const previousCustomEvent = globalThis.CustomEvent;

globalThis.window = {
  localStorage: new MemoryStorage(),
  dispatchEvent() { return true; }
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
  }
};

try {
  const require = createRequire(import.meta.url);
  const attempts = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));

  const record = (childId, completedAt) => attempts.recordLearningAttempt({
    childId,
    activityId: "bahasa-cari-a",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    runtime: "tap_choice",
    outcome: {
      assessed: true,
      accuracy: 1,
      correctCount: 1,
      completedAt,
      metadata: { evidenceFidelity: "choice_interaction" }
    }
  });

  record("child-a", "2026-09-09T14:00:00.000Z");
  record("child-b", "2026-09-09T14:00:00.000Z");

  let childA = attempts.readLearningAnalytics("child-a");
  let childB = attempts.readLearningAnalytics("child-b");
  assert.equal(childA.totalAttempts, 1);
  assert.equal(childB.totalAttempts, 1);
  assert.ok(childA.attempts.every((item) => item.childId === "child-a"));
  assert.ok(childB.attempts.every((item) => item.childId === "child-b"));
  assert.equal(childA.masteryBySkill["bahasa.huruf.a.recognition"].qualifyingEvidenceCount, 1);
  assert.equal(childB.masteryBySkill["bahasa.huruf.a.recognition"].qualifyingEvidenceCount, 1);

  // A rapid replay for child A must not reduce/alter child B's independent
  // mastery stream. Child B's later attempt remains qualifying.
  record("child-a", "2026-09-09T14:00:10.000Z");
  record("child-b", "2026-09-09T14:01:00.000Z");
  childA = attempts.readLearningAnalytics("child-a");
  childB = attempts.readLearningAnalytics("child-b");
  assert.equal(childA.totalAttempts, 2);
  assert.equal(childB.totalAttempts, 2);
  assert.equal(childA.masteryBySkill["bahasa.huruf.a.recognition"].qualifyingEvidenceCount, 1);
  assert.equal(childB.masteryBySkill["bahasa.huruf.a.recognition"].qualifyingEvidenceCount, 2);

  const cloud = readFileSync(path.join(root, "src/lib/learning/cloud.ts"), "utf8");
  const parentGate = readFileSync(path.join(root, "src/lib/auth/requireParent.ts"), "utf8");
  const childLayout = readFileSync(path.join(root, "src/app/child/[childId]/layout.tsx"), "utf8");
  const common = readFileSync(path.join(root, "src/components/learning/LearningCommon.tsx"), "utf8");
  const bridge = readFileSync(path.join(root, "src/components/learning/LearningAttemptBridge.tsx"), "utf8");
  const outbox = readFileSync(path.join(root, "src/lib/learning/outbox.ts"), "utf8");
  const advisor = readFileSync(path.join(root, "supabase/migrations/0005_database_advisor_hardening.sql"), "utf8");
  const ownership = readFileSync(path.join(root, "supabase/migrations/0007_learning_child_ownership.sql"), "utf8");

  const childFilters = cloud.match(/\.eq\("child_key", childId\)/g) ?? [];
  assert.ok(childFilters.length >= 4, "cloud attempts/evidence/mastery/progress reads must all filter by child_key");
  assert.match(cloud, /account_id:\s*accountId/i, "cloud child creation must bind account_id to authenticated user");
  assert.match(cloud, /\.eq\("id", childId\)[\s\S]*\.is\("deleted_at", null\)/i, "cloud profile reads must reject deleted children");
  assert.match(cloud, /value === "TK"\) return 5/i, "legacy TK profiles must remain usable by learning mode");
  assert.match(cloud, /value === "SD 1"\) return 6/i, "legacy SD 1 profiles must remain usable by learning mode");
  assert.match(cloud, /value === "SD 2"\) return 7/i, "legacy SD 2 profiles must remain usable by learning mode");
  assert.doesNotMatch(cloud, /value === "Umum"\) return/i, "ambiguous legacy Umum profiles must not be silently assigned a child age");

  assert.match(parentGate, /if \(childId === "demo-gian"\) return true/i, "only explicit demo sentinel may bypass real-profile ownership lookup");
  assert.match(parentGate, /\.eq\("account_id", userId\)/i, "server child ownership must bind profile lookup to authenticated account");
  assert.match(parentGate, /\.is\("deleted_at", null\)/i, "deleted child profiles must not remain routable");
  assert.match(parentGate, /export async function parentCanAccessChild/i, "parent child route ownership helper is required");
  assert.match(parentGate, /export async function learningChildCanAccess/i, "authenticated child mode also needs ownership enforcement");
  assert.match(parentGate, /gate\.mode === "unconfigured" \|\| gate\.mode === "denied"/i, "guest/local child play must remain available without an authenticated cloud session");
  assert.match(childLayout, /learningChildCanAccess\(childId\)[\s\S]*notFound\(\)/i, "authenticated direct child URL manipulation must fail closed");

  assert.match(common, /const userId = await getCurrentUserId\(\)/i, "learning hooks must distinguish authenticated cloud state from guest local state");
  assert.match(bridge, /syncOrQueueLearningAttempt\(attempt\)/i, "learning attempts must use the durable account-bound sync adapter");
  assert.match(bridge, /state === "synced"[\s\S]*mainlagi-learning-cloud/i, "successful cloud attempt sync must still trigger immediate cloud refresh");
  assert.doesNotMatch(bridge, /syncLearningAttemptCloud\(attempt\)/i, "activity bridge must not bypass the durable outbox adapter");
  assert.match(outbox, /ownerUserId/i, "queued learning attempts must remain account-bound");
  assert.doesNotMatch(outbox, /access_token|refresh_token/i, "outbox must never persist authentication tokens");

  assert.match(advisor, /create policy "player profiles own"[\s\S]*account_id = \(select auth\.uid\(\)\)[\s\S]*with check \(account_id = \(select auth\.uid\(\)/i, "player_profiles RLS must remain account-owned");
  assert.match(ownership, /create or replace function private\.enforce_learning_attempt_child_ownership\(\)/i);
  assert.match(ownership, /new\.child_key = 'demo-gian'/i);
  assert.match(ownership, /pp\.id::text = new\.child_key/i);
  assert.match(ownership, /pp\.account_id = new\.account_id/i);
  assert.match(ownership, /pp\.deleted_at is null/i);
  assert.match(ownership, /before insert or update of account_id, child_key on public\.learning_attempts/i);
  assert.match(ownership, /revoke all on function private\.enforce_learning_attempt_child_ownership\(\) from public, anon, authenticated, service_role/i);

  console.log("Multi-child isolation, cloud source-of-truth, durable outbox, legacy profile compatibility, and parent/child ownership contract tests passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
  if (previousWindow === undefined) delete globalThis.window;
  else globalThis.window = previousWindow;
  if (previousCustomEvent === undefined) delete globalThis.CustomEvent;
  else globalThis.CustomEvent = previousCustomEvent;
}
