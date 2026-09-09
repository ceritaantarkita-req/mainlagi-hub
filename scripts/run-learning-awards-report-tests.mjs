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
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const reporting = require(path.join(outDir, "src", "lib", "learning", "reporting.js"));
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));

const migration = readFileSync(path.join(root, "supabase/migrations/0009_learning_awards_certificates.sql"), "utf8");

function attempt(id, completedAt, assessed = true, accuracy = 1, subjectId = "bahasa", qualifying = true) {
  return {
    id,
    childId: "demo-gian",
    activityId: "bahasa-cari-a",
    subjectId,
    stageId: "bahasa-huruf",
    runtime: "tap_choice",
    difficulty: 1,
    status: "completed",
    assessed,
    score: assessed ? accuracy : null,
    accuracy: assessed ? accuracy : null,
    correctCount: assessed ? 1 : 0,
    incorrectCount: 0,
    hintCount: 0,
    retryCount: 0,
    durationMs: 3000,
    inputMode: "touch",
    startedAt: completedAt,
    completedAt,
    metadata: {},
    evidence: assessed ? [{
      attemptId: id,
      activityId: "bahasa-cari-a",
      skillId: "bahasa.huruf.a.recognition",
      score: accuracy,
      weight: 1,
      createdAt: completedAt,
      qualifiesForMastery: qualifying
    }] : [],
    masteryEligible: assessed && qualifying
  };
}

try {
  const now = Date.parse("2026-09-10T12:00:00.000Z");
  const base = attemptsLib.emptyLearningAnalytics();
  const strong = {
    ...mastery.calculateSkillMastery("bahasa.huruf.a.recognition", []),
    score: 0.92,
    confidence: 0.8,
    level: "mastered",
    evidenceCount: 4,
    qualifyingEvidenceCount: 4,
    lastEvidenceAt: "2026-09-09T10:00:00.000Z",
    needsPractice: false
  };
  const weak = {
    ...mastery.calculateSkillMastery("math.count.1_3", []),
    score: 0.45,
    confidence: 0.3,
    level: "developing",
    evidenceCount: 2,
    qualifyingEvidenceCount: 2,
    lastEvidenceAt: "2026-09-08T10:00:00.000Z",
    needsPractice: true
  };
  const attempts = [
    attempt("old", "2026-09-01T10:00:00.000Z"),
    attempt("current-1", "2026-09-05T10:00:00.000Z", true, 0.8),
    attempt("current-2", "2026-09-08T11:00:00.000Z", true, 1),
    attempt("current-3", "2026-09-08T12:00:00.000Z", false, 0)
  ];
  const analytics = {
    ...base,
    attempts,
    masteryBySkill: {
      ...base.masteryBySkill,
      "bahasa.huruf.a.recognition": strong,
      "math.count.1_3": weak
    },
    totalAttempts: attempts.length,
    assessedAttempts: 3,
    practiceAttempts: 1,
    lastAttemptAt: attempts.at(-1).completedAt
  };
  const report = reporting.buildWeeklyLearningReport(analytics, now);
  assert.equal(report.attempts, 3, "current 7-day window must contain three attempts");
  assert.equal(report.previousAttempts, 1, "previous 7-day window must contain one attempt");
  assert.equal(report.attemptDelta, 2);
  assert.equal(report.assessedAttempts, 2);
  assert.equal(report.practiceAttempts, 1);
  assert.equal(report.activeDays, 2);
  assert.equal(report.qualifyingEvidence, 2);
  assert.ok(Math.abs(report.averageAccuracy - 0.9) < 1e-9);
  assert.equal(report.strongestSkill?.id, "bahasa.huruf.a.recognition");
  assert.equal(report.needsPracticeSkill?.id, "math.count.1_3");

  assert.match(migration, /create or replace function private\.refresh_learning_awards\(\)/i, "server award refresher missing");
  assert.match(migration, /security definer[\s\S]*set search_path = pg_catalog, public, private/i, "award trigger helper must pin search_path");
  assert.match(migration, /after insert or update of completed_activity_ids, total_stars, last_activity_id[\s\S]*on public\.child_learning_progress/i, "awards must refresh after canonical progress changes");
  assert.match(migration, /on conflict \(account_id, child_key, achievement_key\) do nothing/i, "achievement issuance must be idempotent");
  assert.match(migration, /criteria_version[\s\S]*'subject-v1'/i, "certificate criteria version must be explicit");
  assert.match(migration, /required_for_stage = true/i, "certificate completion must use required activities only");
  assert.match(migration, /la\.assessment = 'assessed'/i, "certificate mastery must derive from assessed skills only");
  assert.match(migration, /v_total_assessed_skills > 0/i, "practice-only subjects must not receive competence certificates");
  assert.match(migration, /v_ready_assessed_skills = v_total_assessed_skills/i, "all assessed skills must be at least proficient");
  assert.match(migration, /on conflict \(account_id, child_key, subject_id, criteria_version\) do nothing/i, "certificate issuance must be idempotent");
  assert.match(migration, /revoke all on function private\.refresh_learning_awards\(\) from public, anon, authenticated, service_role/i, "trigger helper must not be exposed as RPC");
  assert.match(migration, /update public\.child_learning_progress[\s\S]*set last_activity_id = last_activity_id/i, "existing children must be backfilled through the canonical trigger path");
  assert.doesNotMatch(migration, /grant execute[\s\S]*refresh_learning_awards/i, "client/API roles must never call award refresher directly");

  const certificateUi = readFileSync(path.join(root, "src/components/learning/ParentAwardsReportV2.tsx"), "utf8");
  assert.match(certificateUi, /server-issued|diterbitkan dan tersimpan|row server/i, "certificate UI must communicate server issuance");
  assert.match(certificateUi, /awards\.certificates\.find/, "download must require persisted certificate row");
  assert.match(certificateUi, /navigator\.share/, "issued certificate must support native share when available");

  console.log("Learning awards, certificate issuance, and weekly report V2 tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
