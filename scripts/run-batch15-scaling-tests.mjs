import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { performance } from "node:perf_hooks";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const adaptive = require(path.join(outDir, "src", "lib", "learning", "adaptive.js"));
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const batch15 = require(path.join(outDir, "src", "lib", "learning", "batch15.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const insights = require(path.join(outDir, "src", "lib", "learning", "insights.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));

const NOW = Date.parse("2026-09-11T05:20:00.000Z");
const emptyProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };

function analytics(overrides = {}) {
  const base = attemptsLib.emptyLearningAnalytics();
  return { ...base, ...overrides };
}

function makeAttempt({ id, activity, completedAt, assessed, accuracy = null, retryCount = 0, hintCount = 0 }) {
  return {
    id,
    childId: "demo-gian",
    activityId: activity.id,
    subjectId: activity.subjectId,
    stageId: activity.stageId,
    runtime: activity.runtime,
    difficulty: catalog.ACTIVITY_LEARNING_SPECS[activity.id]?.difficulty ?? 1,
    status: "completed",
    assessed,
    score: accuracy,
    accuracy,
    correctCount: assessed && accuracy !== null && accuracy >= 0.7 ? 1 : 0,
    incorrectCount: assessed && accuracy !== null && accuracy < 0.7 ? 1 : 0,
    hintCount,
    retryCount,
    durationMs: 3000,
    inputMode: "touch",
    startedAt: completedAt,
    completedAt,
    metadata: {},
    evidence: [],
    masteryEligible: assessed
  };
}

try {
  const scale = batch15.batch15CatalogScaleSnapshot();
  assert.deepEqual(scale, {
    subjects: 9,
    activities: 900,
    assessedActivities: 683,
    practiceActivities: 217,
    skills: 200
  }, "Batch 15 must preserve the fully closed Batch 14 catalog baseline");

  // Every subject must remain recommendation-capable at catalog scale without
  // leaking another subject's activities into a scoped ranking.
  for (const subject of system.SUBJECTS) {
    const ranked = adaptive.rankAdaptiveLearningV2({
      age: 5,
      subjectId: subject.id,
      progress: emptyProgress,
      analytics: analytics(),
      allowMotion: false,
      nowMs: NOW,
      limit: 5
    });
    assert.ok(ranked.length > 0, `${subject.id} must have at least one eligible recommendation`);
    assert.ok(ranked.length <= 5, `${subject.id} ranking must honor the bounded limit`);
    for (const item of ranked) {
      const activity = system.getActivity(item.id);
      assert.equal(activity?.subjectId, subject.id, `${subject.id} ranking leaked ${item.id}`);
      assert.notEqual(activity?.runtime, "motion_game", "motion activity must stay excluded without opt-in");
    }
  }

  // Creative tracks are useful recommendations but remain completion-only.
  for (const subjectId of ["drawing", "color"]) {
    const ranked = adaptive.rankAdaptiveLearningV2({
      age: 5,
      subjectId,
      progress: emptyProgress,
      analytics: analytics(),
      allowMotion: false,
      nowMs: NOW,
      limit: 10
    });
    assert.ok(ranked.length > 0, `${subjectId} should remain recommendable`);
    for (const item of ranked) {
      assert.equal(catalog.ACTIVITY_LEARNING_SPECS[item.id]?.assessment, "practice", `${subjectId} recommendation must remain practice-only`);
      assert.equal(catalog.ACTIVITY_LEARNING_SPECS[item.id]?.evidenceContractId, "completion_only_v1", `${subjectId} recommendation must keep completion-only evidence`);
    }
    const completeIds = system.ACTIVITIES.filter((activity) => activity.subjectId === subjectId).map((activity) => activity.id);
    const eligibility = insights.getCertificateEligibility(subjectId, { completedActivityIds: completeIds, stars: 999, lastActivityId: completeIds.at(-1) ?? null }, analytics());
    assert.equal(eligibility.completionReady, true, `${subjectId} completion should be recognized`);
    assert.equal(eligibility.masteryReady, false, `${subjectId} completion must not fabricate mastery readiness`);
    assert.equal(eligibility.eligible, false, `${subjectId} completion-only practice must not issue academic certificate eligibility`);
  }

  // Find a real measured skill that has multiple variants in the same stage.
  const assessedBySkill = new Map();
  for (const activity of system.ACTIVITIES) {
    const spec = catalog.ACTIVITY_LEARNING_SPECS[activity.id];
    if (spec?.assessment !== "assessed") continue;
    for (const link of spec.skills) {
      const rows = assessedBySkill.get(link.skillId) ?? [];
      rows.push(activity);
      assessedBySkill.set(link.skillId, rows);
    }
  }
  let variantPair = null;
  let variantSkillId = null;
  for (const [skillId, rows] of assessedBySkill) {
    for (const first of rows) {
      const alternate = rows.find((candidate) => candidate.id !== first.id && candidate.stageId === first.stageId);
      if (alternate) {
        variantPair = [first, alternate];
        variantSkillId = skillId;
        if (alternate.runtime !== first.runtime) break;
      }
    }
    if (variantPair && variantPair[0].runtime !== variantPair[1].runtime) break;
  }
  assert.ok(variantPair && variantSkillId, "catalog should expose at least one measured same-skill remediation variant");
  const [failedActivity, alternateActivity] = variantPair;
  const failedAt = "2026-09-11T05:15:00.000Z";
  const weakAttempt = makeAttempt({
    id: "batch15-weak",
    activity: failedActivity,
    completedAt: failedAt,
    assessed: true,
    accuracy: 0.4,
    retryCount: 3,
    hintCount: 2
  });
  const weakMastery = {
    skillId: variantSkillId,
    score: 0.35,
    confidence: 0.25,
    level: "exploring",
    evidenceCount: 2,
    qualifyingEvidenceCount: 2,
    lastEvidenceAt: failedAt,
    needsPractice: true
  };
  const remediation = adaptive.rankAdaptiveLearningV2({
    age: 5,
    subjectId: failedActivity.subjectId,
    progress: { completedActivityIds: [failedActivity.id], stars: 1, lastActivityId: failedActivity.id },
    analytics: analytics({ attempts: [weakAttempt], masteryBySkill: { [variantSkillId]: weakMastery }, totalAttempts: 1, assessedAttempts: 1, lastAttemptAt: failedAt }),
    allowMotion: false,
    nowMs: NOW
  });
  const failedRank = remediation.find((item) => item.id === failedActivity.id);
  const alternateRank = remediation.find((item) => item.id === alternateActivity.id);
  assert.ok(failedRank && alternateRank, "remediation ranking should include failed and alternate variants");
  assert.ok(alternateRank.score > failedRank.score, "weak evidence must prefer an alternate variant over exact replay");
  assert.equal(alternateRank.reason, "remediate_variant", "alternate same-skill item must explain remediation intent");

  // Large analytics snapshot: parent report must stay bounded regardless of
  // attempt history size. This also gives a conservative CI benchmark.
  const assessedActivity = system.ACTIVITIES.find((activity) => catalog.ACTIVITY_LEARNING_SPECS[activity.id]?.assessment === "assessed");
  const drawingActivity = system.ACTIVITIES.find((activity) => activity.subjectId === "drawing");
  const colorActivity = system.ACTIVITIES.find((activity) => activity.subjectId === "color");
  assert.ok(assessedActivity && drawingActivity && colorActivity);
  const largeAttempts = [];
  for (let i = 0; i < 1200; i += 1) {
    const activity = i % 3 === 0 ? drawingActivity : i % 3 === 1 ? colorActivity : assessedActivity;
    const assessed = catalog.ACTIVITY_LEARNING_SPECS[activity.id]?.assessment === "assessed";
    largeAttempts.push(makeAttempt({
      id: `batch15-large-${i}`,
      activity,
      completedAt: new Date(NOW - (i % 6) * 60 * 60 * 1000).toISOString(),
      assessed,
      accuracy: assessed ? (i % 4 === 0 ? 0.6 : 0.9) : null,
      retryCount: assessed ? i % 3 : 0,
      hintCount: assessed ? i % 2 : 0
    }));
  }
  const largeAnalytics = analytics({
    attempts: largeAttempts,
    totalAttempts: largeAttempts.length,
    assessedAttempts: largeAttempts.filter((item) => item.assessed).length,
    practiceAttempts: largeAttempts.filter((item) => !item.assessed).length,
    lastAttemptAt: largeAttempts[0]?.completedAt ?? null
  });

  const benchmarkStart = performance.now();
  const report = batch15.buildBatch15ParentReport({
    age: 5,
    progress: emptyProgress,
    analytics: largeAnalytics,
    allowMotion: false,
    nowMs: NOW,
    recentLimit: 6
  });
  for (const subject of system.SUBJECTS) {
    adaptive.rankAdaptiveLearningV2({
      age: 5,
      subjectId: subject.id,
      progress: emptyProgress,
      analytics: largeAnalytics,
      allowMotion: false,
      nowMs: NOW,
      limit: 5
    });
  }
  const elapsedMs = performance.now() - benchmarkStart;
  const payloadBytes = Buffer.byteLength(JSON.stringify(report), "utf8");

  assert.equal(report.subjects.length, 9, "parent report must stay one bounded row per subject");
  assert.equal(report.recentAttempts.length, 6, "parent report must not dump the raw attempt history");
  assert.equal(report.subjects.find((row) => row.subjectId === "drawing")?.mastery, null, "Drawing report must not synthesize mastery percentages");
  assert.equal(report.subjects.find((row) => row.subjectId === "color")?.mastery, null, "Coloring report must not synthesize mastery percentages");
  assert.equal(report.subjects.find((row) => row.subjectId === "drawing")?.recommendation?.assessment, "practice", "Drawing recommendation must be reported as practice");
  assert.equal(report.subjects.find((row) => row.subjectId === "color")?.recommendation?.assessment, "practice", "Coloring recommendation must be reported as practice");
  assert.ok(payloadBytes < 64 * 1024, `bounded parent report payload should stay below 64 KiB, got ${payloadBytes}`);
  assert.ok(elapsedMs < 5000, `Batch 15 catalog/report benchmark exceeded conservative 5s CI budget: ${elapsedMs.toFixed(1)}ms`);

  console.log(`Batch 15 scaling tests passed: ${elapsedMs.toFixed(1)}ms sweep, ${payloadBytes} byte bounded report.`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
