import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const insights = require(path.join(outDir, "src", "lib", "learning", "insights.js"));
const batch8 = require(path.join(outDir, "src", "lib", "learning", "bahasaBatch8.js"));

function analytics(overrides = {}) {
  return {
    attempts: [],
    masteryBySkill: {},
    totalAttempts: 0,
    assessedAttempts: 0,
    practiceAttempts: 0,
    lastAttemptAt: null,
    ...overrides
  };
}

function mastery(skillId, score = 0.7, confidence = 0.6, qualifyingEvidenceCount = 2) {
  return {
    skillId,
    score,
    confidence,
    level: "proficient",
    evidenceCount: qualifyingEvidenceCount,
    qualifyingEvidenceCount,
    lastEvidenceAt: "2026-09-09T10:00:00.000Z",
    needsPractice: false
  };
}

try {
  const expectedBahasaStageIds = ["bahasa-huruf", "bahasa-cerita", ...batch8.BAHASA_BATCH8_STAGE_IDS];
  const emptyProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };
  const initialRows = insights.getSubjectStageReadiness("bahasa", emptyProgress, analytics());
  assert.deepEqual(initialRows.map((row) => row.stageId), expectedBahasaStageIds, "parent readiness must expose historical and current Batch 8 Bahasa stages in canonical order");
  assert.equal(initialRows[0].status, "in_progress", "first stage must start unlocked");
  for (const row of initialRows.slice(1)) assert.equal(row.status, "locked", `${row.stageId} must remain locked before prior readiness`);

  const readyProgress = {
    completedActivityIds: ["bahasa-cari-a", "bahasa-dengar-a", "bahasa-pasang-awal"],
    stars: 7,
    lastActivityId: "bahasa-pasang-awal"
  };
  const readyAnalytics = analytics({
    masteryBySkill: {
      "bahasa.huruf.a.recognition": mastery("bahasa.huruf.a.recognition", 0.75, 0.65, 2),
      "bahasa.huruf.awal.matching": mastery("bahasa.huruf.awal.matching", 0.7, 0.6, 2)
    }
  });
  const readyRows = insights.getSubjectStageReadiness("bahasa", readyProgress, readyAnalytics);
  assert.deepEqual(readyRows.map((row) => row.stageId), expectedBahasaStageIds);
  assert.equal(readyRows[0].status, "ready", "completed core plus sufficient evidence must mark stage ready");
  assert.equal(readyRows[1].status, "in_progress", "next historical stage must unlock after prior readiness");
  for (const row of readyRows.slice(2)) assert.equal(row.status, "locked", `${row.stageId} must remain locked while the preceding story stage is still in progress`);

  const completionOnlyRows = insights.getSubjectStageReadiness("bahasa", readyProgress, analytics());
  assert.equal(completionOnlyRows[0].status, "evidence_needed", "completion without qualifying evidence must not unlock progression");
  for (const row of completionOnlyRows.slice(1)) assert.equal(row.status, "locked", `${row.stageId} must stay locked when earlier evidence is missing`);

  const recent = insights.getRecentLearningAttempts(analytics({
    attempts: [
      { id: "old", activityId: "math-count-3", subjectId: "math", assessed: true, accuracy: 1, retryCount: 0, completedAt: "2026-09-09T09:00:00.000Z" },
      { id: "new", activityId: "english-listen-cat", subjectId: "english", assessed: true, accuracy: 0.5, retryCount: 1, completedAt: "2026-09-09T11:00:00.000Z" }
    ]
  }), 1);
  assert.equal(recent.length, 1);
  assert.equal(recent[0].id, "new", "recent attempt timeline must sort by completion time descending");
  assert.equal(recent[0].activityTitle, "Listen: cat", "recent attempts should resolve human-readable activity titles");

  const subjectRecommendation = insights.getSubjectNextLearningRecommendation({
    subjectId: "math",
    age: 5,
    progress: emptyProgress,
    analytics: analytics(),
    allowMotion: false
  });
  assert.ok(subjectRecommendation, "parent dashboard should produce a subject-scoped recommendation when eligible content exists");
  assert.equal(subjectRecommendation.activity.subjectId, "math", "subject recommendation must never leak an activity from another subject");
  assert.notEqual(subjectRecommendation.activity.runtime, "motion_game", "camera activity must stay excluded unless explicitly allowed");

  console.log("Parent dashboard readiness, recent-attempt, and subject recommendation tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
