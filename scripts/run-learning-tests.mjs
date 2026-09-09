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
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));
const progression = require(path.join(outDir, "src", "lib", "learning", "progression.js"));

try {
  const perfect = mastery.normalizeLearningAttemptOutcome({
    assessed: true,
    correctCount: 1,
    incorrectCount: 0,
    retryCount: 0,
    completedAt: "2026-09-09T10:00:00.000Z"
  });
  assert.equal(perfect.accuracy, 1);
  assert.ok(Math.abs(mastery.calculateEvidenceScore(perfect) - 1) < 1e-9);

  const first = mastery.createSkillEvidence({ attemptId: "a1", activityId: "x", skillId: "s", outcome: perfect });
  assert.ok(first);
  let snapshot = mastery.calculateSkillMastery("s", [first]);
  assert.equal(snapshot.level, "exploring", "one perfect attempt must never create false mastery");

  const evidence = [0, 1, 2].map((index) => mastery.createSkillEvidence({
    attemptId: `a${index + 1}`,
    activityId: index === 1 ? "y" : "x",
    skillId: "s",
    outcome: mastery.normalizeLearningAttemptOutcome({
      assessed: true,
      accuracy: 1,
      completedAt: `2026-09-09T10:0${index}:00.000Z`
    })
  }));
  snapshot = mastery.calculateSkillMastery("s", evidence.filter(Boolean));
  assert.equal(snapshot.level, "mastered");
  assert.ok(snapshot.confidence >= 0.65);

  const retryHeavy = mastery.normalizeLearningAttemptOutcome({ assessed: true, accuracy: 1, retryCount: 7 });
  const retryEvidence = mastery.createSkillEvidence({ attemptId: "retry", activityId: "x", skillId: "s", outcome: retryHeavy });
  assert.ok(retryEvidence);
  assert.equal(retryEvidence.qualifiesForMastery, false, "excessive retries should not count toward mastery");

  const stage1 = { id: "stage-1", subjectId: "math", activityIds: ["a"] };
  const stage2 = { id: "stage-2", subjectId: "math", activityIds: ["b"] };
  const activities = [
    { id: "a", subjectId: "math", stageId: "stage-1", ageMin: 3, ageMax: 7, requiredForStage: true, motionOptional: false, skillIds: ["s"], assessed: true },
    { id: "b", subjectId: "math", stageId: "stage-2", ageMin: 3, ageMax: 7, requiredForStage: true, motionOptional: false, skillIds: ["t"], assessed: true }
  ];
  const masteryBySkill = {
    s: { ...mastery.calculateSkillMastery("s", evidence.filter(Boolean)), level: "developing", score: 0.7 },
    t: mastery.calculateSkillMastery("t", [])
  };
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-1", stages: [stage1, stage2], activities, completedActivityIds: [], masteryBySkill }), true);
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-2", stages: [stage1, stage2], activities, completedActivityIds: [], masteryBySkill }), false);
  assert.equal(progression.isStageUnlocked({ targetStageId: "stage-2", stages: [stage1, stage2], activities, completedActivityIds: ["a"], masteryBySkill }), true);

  const ranked = progression.rankNextActivities({ age: 5, stages: [stage1, stage2], activities, completedActivityIds: ["a"], masteryBySkill, lastActivityId: "a" });
  assert.equal(ranked[0], "b");

  console.log("Learning mastery/progression tests passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
