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
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const curriculum = require(path.join(outDir, "src", "lib", "learning", "curriculum.js"));
const progression = require(path.join(outDir, "src", "lib", "learning", "progression.js"));
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));

try {
  const coverage = curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds, [], "every stage must belong to a learning path");
  assert.deepEqual(coverage.uncoveredActivityIds, [], "every activity must belong to a lesson");
  assert.equal(coverage.stageCount, system.STAGES.length);
  assert.equal(coverage.activityCount, system.ACTIVITIES.length);

  const stageOwners = new Map();
  for (const learningPath of curriculum.LEARNING_PATHS) {
    assert.ok(learningPath.ageMin >= 3 && learningPath.ageMax <= 7 && learningPath.ageMin <= learningPath.ageMax);
    assert.ok(learningPath.stageIds.length > 0, `${learningPath.id} must contain stages`);
    for (const stageId of learningPath.stageIds) {
      const stage = system.getStage(stageId);
      assert.ok(stage, `${learningPath.id} references unknown stage ${stageId}`);
      assert.equal(stage.subjectId, learningPath.subjectId, `${stageId} subject must match its learning path`);
      assert.equal(stageOwners.has(stageId), false, `${stageId} must belong to exactly one learning path`);
      stageOwners.set(stageId, learningPath.id);
    }
  }
  assert.equal(stageOwners.size, system.STAGES.length, "all stages must have exactly one learning-path owner");

  const activityOwners = new Map();
  for (const lesson of curriculum.LEARNING_LESSONS) {
    const stage = system.getStage(lesson.stageId);
    const learningPath = curriculum.getLearningPath(lesson.pathId);
    assert.ok(stage, `${lesson.id} references unknown stage`);
    assert.ok(learningPath, `${lesson.id} references unknown learning path`);
    assert.equal(stage.subjectId, lesson.subjectId, `${lesson.id} subject must match stage`);
    assert.equal(learningPath.subjectId, lesson.subjectId, `${lesson.id} subject must match learning path`);
    assert.ok(learningPath.stageIds.includes(lesson.stageId), `${lesson.id} stage must belong to its path`);
    assert.ok(lesson.activityIds.length > 0, `${lesson.id} must contain activities`);

    for (const activityId of lesson.activityIds) {
      const activity = system.getActivity(activityId);
      assert.ok(activity, `${lesson.id} references unknown activity ${activityId}`);
      assert.equal(activity.stageId, lesson.stageId, `${activityId} stage must match lesson`);
      assert.equal(activity.subjectId, lesson.subjectId, `${activityId} subject must match lesson`);
      assert.ok(activity.ageMax >= lesson.ageMin && activity.ageMin <= lesson.ageMax, `${activityId} must overlap lesson age range`);
      assert.equal(activityOwners.has(activityId), false, `${activityId} must belong to exactly one lesson`);
      activityOwners.set(activityId, lesson.id);
    }
  }
  assert.equal(activityOwners.size, system.ACTIVITIES.length, "all activities must have exactly one lesson owner");

  const expandedActivityIds = [
    "bahasa-cari-a-lagi",
    "bahasa-pasang-awal-lagi",
    "english-find-blue-audio",
    "english-listen-cat-2",
    "english-match-words-2",
    "math-count-2",
    "math-pattern-touch-2",
    "iqro-pasang-alif"
  ];
  for (const activityId of expandedActivityIds) {
    const activity = system.getActivity(activityId);
    const spec = catalog.getActivityLearningSpec(activityId);
    assert.ok(activity, `expanded runtime activity ${activityId} must exist`);
    assert.ok(spec, `expanded catalog activity ${activityId} must exist`);
    assert.equal(spec.assessment, "assessed", `${activityId} must provide measured evidence`);
    assert.equal(spec.requiredForStage, false, `${activityId} must enrich evidence without expanding the stage completion gate`);
    assert.equal(activity.motionOptional, false, `${activityId} must remain touch/audio-first`);
    assert.ok(["tap_choice", "listen_and_choose", "matching"].includes(activity.runtime), `${activityId} must use a measured runtime supported by the evidence bridge`);
    assert.equal(spec.skills.length, 1, `${activityId} should target one clear foundational skill`);
  }

  const assessedTrace = system.ACTIVITIES.filter((activity) => activity.runtime === "trace" && catalog.getActivityLearningSpec(activity.id)?.assessment === "assessed");
  assert.deepEqual(assessedTrace.map((activity) => activity.id), ["math-trace-5-touch"], "do not expand assessed trace glyphs until the guided-trace measurement contract is generalized");

  const assessedActivityCountBySkill = new Map();
  for (const spec of Object.values(catalog.ACTIVITY_LEARNING_SPECS)) {
    if (spec.assessment !== "assessed") continue;
    for (const link of spec.skills) {
      assessedActivityCountBySkill.set(link.skillId, (assessedActivityCountBySkill.get(link.skillId) ?? 0) + 1);
    }
  }
  for (const skillId of [
    "bahasa.huruf.a.recognition",
    "bahasa.huruf.awal.matching",
    "english.color.blue",
    "english.word.cat.listening",
    "english.word.picture_matching",
    "math.count.1_3",
    "math.pattern.matching",
    "iqro.alif.recognition"
  ]) {
    assert.ok((assessedActivityCountBySkill.get(skillId) ?? 0) >= 2, `${skillId} needs at least two distinct measured activities after expansion`);
  }

  // Adaptive ranking: age is a hard boundary, camera remains opt-in, and a
  // weak assessed skill outranks an already-mastered activity after core
  // completion is equal.
  const stages = [{ id: "s1", subjectId: "math", activityIds: ["weak", "mastered", "older", "motion"] }];
  const activities = [
    { id: "weak", subjectId: "math", stageId: "s1", ageMin: 3, ageMax: 7, requiredForStage: false, motionOptional: false, skillIds: ["weak-skill"], assessed: true, difficulty: 1 },
    { id: "mastered", subjectId: "math", stageId: "s1", ageMin: 3, ageMax: 7, requiredForStage: false, motionOptional: false, skillIds: ["mastered-skill"], assessed: true, difficulty: 1 },
    { id: "older", subjectId: "math", stageId: "s1", ageMin: 5, ageMax: 7, requiredForStage: false, motionOptional: false, skillIds: ["older-skill"], assessed: true, difficulty: 2 },
    { id: "motion", subjectId: "math", stageId: "s1", ageMin: 3, ageMax: 7, requiredForStage: false, motionOptional: true, skillIds: ["motion-skill"], assessed: false, difficulty: 2 }
  ];
  const weakSnapshot = { ...mastery.calculateSkillMastery("weak-skill", []), level: "developing", score: 0.45, confidence: 0.3, qualifyingEvidenceCount: 2, evidenceCount: 2 };
  const masteredSnapshot = { ...mastery.calculateSkillMastery("mastered-skill", []), level: "mastered", score: 0.95, confidence: 0.9, qualifyingEvidenceCount: 4, evidenceCount: 4 };
  const ranked = progression.rankActivityRecommendations({
    age: 4,
    stages,
    activities,
    completedActivityIds: ["weak", "mastered"],
    masteryBySkill: { "weak-skill": weakSnapshot, "mastered-skill": masteredSnapshot },
    allowMotion: false
  });
  assert.equal(ranked[0].id, "weak", "weaker assessed skill should be recommended before mastered review");
  assert.equal(ranked.some((item) => item.id === "older"), false, "age-ineligible activity must never be recommended");
  assert.equal(ranked.some((item) => item.id === "motion"), false, "motion must stay opt-in");

  const withMotion = progression.rankActivityRecommendations({
    age: 5,
    stages,
    activities,
    completedActivityIds: ["weak", "mastered", "older"],
    masteryBySkill: { "weak-skill": weakSnapshot, "mastered-skill": masteredSnapshot },
    allowMotion: true,
    lastActivityId: "weak"
  });
  assert.ok(withMotion.some((item) => item.id === "motion"), "motion can enter ranking only when explicitly enabled");
  assert.notEqual(withMotion[0].id, "weak", "last activity penalty should prevent immediate recommendation loops when alternatives exist");

  console.log("Curriculum hierarchy, content diversity, and adaptive ranking tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
