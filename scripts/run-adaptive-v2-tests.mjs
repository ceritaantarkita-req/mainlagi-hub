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
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const adaptive = require(path.join(outDir, "src", "lib", "learning", "adaptive.js"));
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));

const NOW = Date.parse("2026-09-10T12:00:00.000Z");

function attempt(id, activityId, accuracy, retryCount, completedAt, subjectId = "bahasa", stageId = "bahasa-huruf") {
  return {
    id,
    childId: "demo-gian",
    activityId,
    subjectId,
    stageId,
    runtime: "tap_choice",
    difficulty: 1,
    status: "completed",
    assessed: true,
    score: accuracy,
    accuracy,
    correctCount: accuracy >= 0.7 ? 1 : 0,
    incorrectCount: accuracy >= 0.7 ? 0 : 1,
    hintCount: 0,
    retryCount,
    durationMs: 3000,
    inputMode: "touch",
    startedAt: completedAt,
    completedAt,
    metadata: {},
    evidence: [],
    masteryEligible: true
  };
}

function analyticsWith(attempts, masteryOverrides = {}) {
  const base = attemptsLib.emptyLearningAnalytics();
  return {
    ...base,
    attempts,
    masteryBySkill: { ...base.masteryBySkill, ...masteryOverrides },
    totalAttempts: attempts.length,
    assessedAttempts: attempts.filter((item) => item.assessed).length,
    practiceAttempts: attempts.filter((item) => !item.assessed).length,
    lastAttemptAt: attempts.at(-1)?.completedAt ?? null
  };
}

try {
  const weakA = {
    ...mastery.calculateSkillMastery("bahasa.huruf.a.recognition", []),
    score: 0.48,
    confidence: 0.32,
    level: "developing",
    evidenceCount: 2,
    qualifyingEvidenceCount: 2,
    lastEvidenceAt: "2026-09-10T11:00:00.000Z",
    needsPractice: true
  };
  const failed = attempt("a1", "bahasa-cari-a", 0.5, 2, "2026-09-10T11:55:00.000Z");
  const remediation = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: "bahasa",
    progress: {
      completedActivityIds: ["bahasa-cari-a", "bahasa-dengar-a", "bahasa-pasang-awal"],
      stars: 7,
      lastActivityId: "bahasa-cari-a"
    },
    analytics: analyticsWith([failed], { "bahasa.huruf.a.recognition": weakA }),
    allowMotion: false,
    nowMs: NOW
  });
  const alternate = remediation.find((item) => item.id === "bahasa-cari-a-lagi");
  const repeated = remediation.find((item) => item.id === "bahasa-cari-a");
  assert.ok(alternate && repeated, "expected both original and alternate A-recognition activities");
  assert.ok(alternate.score > repeated.score, "weak evidence must prefer a different measured activity over exact repetition");
  assert.equal(alternate.reason, "remediate_variant", "alternate same-skill activity should be labeled remediation");

  const lowConfidence = {
    ...weakA,
    score: 0.72,
    confidence: 0.3,
    level: "developing",
    lastEvidenceAt: "2026-09-10T10:00:00.000Z"
  };
  const good = attempt("a2", "bahasa-dengar-a", 1, 0, "2026-09-10T10:00:00.000Z");
  const confidenceRank = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: "bahasa",
    progress: {
      completedActivityIds: ["bahasa-cari-a", "bahasa-dengar-a", "bahasa-pasang-awal"],
      stars: 7,
      lastActivityId: "bahasa-dengar-a"
    },
    analytics: analyticsWith([good], { "bahasa.huruf.a.recognition": lowConfidence }),
    allowMotion: false,
    nowMs: NOW
  });
  assert.ok(confidenceRank.some((item) => item.reason === "build_confidence" && item.targetSkillId === "bahasa.huruf.a.recognition"), "low-confidence skill should request varied confidence-building evidence");

  const oldStrong = {
    ...mastery.calculateSkillMastery("bahasa.huruf.a.recognition", []),
    score: 0.92,
    confidence: 0.82,
    level: "mastered",
    evidenceCount: 5,
    qualifyingEvidenceCount: 5,
    lastEvidenceAt: "2026-08-30T12:00:00.000Z",
    needsPractice: false
  };
  const spaced = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: "bahasa",
    progress: {
      completedActivityIds: ["bahasa-cari-a", "bahasa-dengar-a", "bahasa-pasang-awal", "bahasa-cari-a-lagi"],
      stars: 9,
      lastActivityId: "bahasa-pasang-awal"
    },
    analytics: analyticsWith([], { "bahasa.huruf.a.recognition": oldStrong }),
    allowMotion: false,
    nowMs: NOW
  });
  assert.ok(spaced.some((item) => item.targetSkillId === "bahasa.huruf.a.recognition" && item.reason === "spaced_review"), "strong stale skill should become eligible for spaced review");

  const noMotion = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: "math",
    progress: { completedActivityIds: [], stars: 0, lastActivityId: null },
    analytics: attemptsLib.emptyLearningAnalytics(),
    allowMotion: false,
    nowMs: NOW
  });
  assert.equal(noMotion.some((item) => item.id === "math-number-trace-motion" || item.id === "math-pattern-motion"), false, "motion must remain excluded until explicitly enabled");

  const withMotion = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: "math",
    progress: { completedActivityIds: [], stars: 0, lastActivityId: null },
    analytics: attemptsLib.emptyLearningAnalytics(),
    allowMotion: true,
    nowMs: NOW
  });
  assert.ok(withMotion.some((item) => item.id === "math-number-trace-motion"), "motion may enter ranking only after opt-in");

  const tooYoung = adaptive.rankAdaptiveLearningV2({
    age: 3,
    subjectId: "math",
    progress: { completedActivityIds: [], stars: 0, lastActivityId: null },
    analytics: attemptsLib.emptyLearningAnalytics(),
    allowMotion: true,
    nowMs: NOW
  });
  assert.equal(tooYoung.some((item) => item.id === "math-pattern-touch" || item.id === "math-pattern-touch-2"), false, "age eligibility remains a hard boundary");

  console.log("Adaptive Learning V2 remediation, confidence, spacing, motion, and age tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
