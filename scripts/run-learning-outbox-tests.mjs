import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });
const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const core = require(path.join(outDir, "src", "lib", "learning", "outboxCore.js"));
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));

function attempt(id, childId, completedAt, assessed = true) {
  return {
    id,
    childId,
    activityId: "bahasa-cari-a",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    runtime: "tap_choice",
    difficulty: 1,
    status: "completed",
    assessed,
    score: assessed ? 1 : null,
    accuracy: assessed ? 1 : null,
    correctCount: assessed ? 1 : 0,
    incorrectCount: 0,
    hintCount: 0,
    retryCount: 0,
    durationMs: 2000,
    inputMode: "touch",
    startedAt: completedAt,
    completedAt,
    metadata: {},
    evidence: [],
    masteryEligible: assessed
  };
}

try {
  const nowMs = Date.parse("2026-09-10T00:00:00.000Z");
  assert.deepEqual(core.parseLearningOutbox("not-json", nowMs), []);

  const fresh = attempt("fresh", "child-a", "2026-09-09T23:00:00.000Z");
  const old = attempt("old", "child-a", "2026-08-01T00:00:00.000Z");
  const parsed = core.parseLearningOutbox(JSON.stringify([
    { ownerUserId: "user-a", attempt: old, queuedAt: old.completedAt, updatedAt: old.completedAt, retryCount: 0, nextRetryAt: null, blocked: false },
    { ownerUserId: "user-a", attempt: fresh, queuedAt: fresh.completedAt, updatedAt: fresh.completedAt, retryCount: 0, nextRetryAt: null, blocked: false }
  ]), nowMs);
  assert.equal(parsed.length, 1, "expired outbox entries must be pruned");
  assert.equal(parsed[0].attempt.id, "fresh");

  const atRetryLimit = core.parseLearningOutbox(JSON.stringify([
    { ownerUserId: "user-a", attempt: fresh, queuedAt: fresh.completedAt, updatedAt: fresh.completedAt, retryCount: core.MAX_AUTO_RETRIES, nextRetryAt: null, blocked: false }
  ]), nowMs);
  assert.equal(atRetryLimit[0].blocked, true, "retry ceiling must fail closed into blocked state");

  let queue = [];
  queue = core.upsertLearningOutboxAttempt(queue, "user-a", fresh, new Date(nowMs));
  queue = core.upsertLearningOutboxAttempt(queue, "user-a", { ...fresh, accuracy: 0.8 }, new Date(nowMs + 1000));
  assert.equal(queue.length, 1, "same owner + attempt id must be idempotent in the outbox");
  assert.equal(queue[0].attempt.accuracy, 0.8, "latest local attempt payload should replace its own queued copy");

  queue = core.upsertLearningOutboxAttempt(queue, "user-b", fresh, new Date(nowMs + 2000));
  assert.equal(queue.length, 2, "the same attempt id under another account must remain isolated");
  assert.equal(core.summarizeLearningOutbox(queue, "user-a").pending, 1);
  assert.equal(core.summarizeLearningOutbox(queue, "user-b").pending, 1);

  assert.equal(core.learningOutboxRetryDelayMs(0), 5000);
  assert.ok(core.learningOutboxRetryDelayMs(3) > core.learningOutboxRetryDelayMs(1));
  assert.equal(core.learningOutboxRetryDelayMs(99), core.RETRY_MAX_MS, "retry delay must be capped");

  const cloud = attemptsLib.emptyLearningAnalytics();
  const cloudAttempt = attempt("cloud-1", "child-a", "2026-09-09T20:00:00.000Z", true);
  const pendingAttempt = attempt("pending-1", "child-a", "2026-09-09T21:00:00.000Z", false);
  const cloudSnapshot = {
    ...cloud,
    attempts: [cloudAttempt],
    totalAttempts: 1,
    assessedAttempts: 1,
    practiceAttempts: 0,
    lastAttemptAt: cloudAttempt.completedAt
  };
  const overlay = core.overlayPendingLearningAnalytics(cloudSnapshot, [cloudAttempt, pendingAttempt]);
  assert.equal(overlay.totalAttempts, 2, "pending attempts must appear optimistically without duplicating cloud ids");
  assert.equal(overlay.assessedAttempts, 1);
  assert.equal(overlay.practiceAttempts, 1);
  assert.equal(overlay.lastAttemptAt, pendingAttempt.completedAt);
  assert.strictEqual(overlay.masteryBySkill, cloudSnapshot.masteryBySkill, "pending local evidence must not promote canonical mastery before server acceptance");

  const adapter = readFileSync(path.join(root, "src/lib/learning/outbox.ts"), "utf8");
  const globalBridge = readFileSync(path.join(root, "src/components/learning/LearningCloudOutboxBridge.tsx"), "utf8");
  const rootLayout = readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
  const attemptBridge = readFileSync(path.join(root, "src/components/learning/LearningAttemptBridge.tsx"), "utf8");
  assert.match(adapter, /ownerUserId/, "outbox must bind each queued item to an account id");
  assert.doesNotMatch(adapter, /access_token|refresh_token/i, "outbox source must never persist auth tokens");
  assert.match(globalBridge, /online/);
  assert.match(globalBridge, /visibilitychange/);
  assert.match(globalBridge, /setInterval/);
  assert.match(rootLayout, /<LearningCloudOutboxBridge\s*\/>/, "outbox retry service must be mounted globally");
  assert.match(attemptBridge, /syncOrQueueLearningAttempt/, "activity bridge must queue failed cloud writes");
  assert.doesNotMatch(attemptBridge, /syncLearningAttemptCloud\(/, "activity bridge must not bypass the durable outbox adapter");

  console.log("Learning offline cloud outbox tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
