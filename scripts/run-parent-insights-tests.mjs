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
  const emptyProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };
  const initialRows = insights.getSubjectStageReadiness("bahasa", emptyProgress, analytics());
  assert.equal(initialRows.length, 2, "Bahasa should expose both stage rows");
  assert.equal(initialRows[0].stageId, "bahasa-huruf");
  assert.equal(initialRows[0].status, "in_progress", "first stage must start unlocked");
  assert.equal(initialRows[1].stageId, "bahasa-cerita");
  assert.equal(initialRows[1].status, "locked", "second stage must remain locked before prior readiness");

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
  assert.equal(readyRows[0].status, "ready", "completed core plus sufficient evidence must mark stage ready");
  assert.equal(readyRows[1].status, "in_progress", "next stage must unlock after prior readiness");

  const completionOnlyRows = insights.getSubjectStageReadiness("bahasa", readyProgress, analytics());
  assert.equal(completionOnlyRows[0].status, "evidence_needed", "completion without qualifying evidence must not unlock progression");
  assert.equal(completionOnlyRows[1].status, "locked", "next stage must stay locked when evidence is missing");

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
