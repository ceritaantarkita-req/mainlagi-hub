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
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const adaptive = require(path.join(outDir, "src", "lib", "learning", "adaptive.js"));
const attemptsLib = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const insights = require(path.join(outDir, "src", "lib", "learning", "insights.js"));

const subjects = [
  {
    id: "letters",
    stageId: "letters-foundations",
    pathId: "letters-writing-foundations",
    lessonId: "letters-a-foundations",
    packId: "letters.pack.letter-a",
    activities: ["letters-find-a", "letters-trace-a", "letters-match-case"],
    skills: ["letters.latin.a.recognition", "letters.latin.a.formation"]
  },
  {
    id: "logic",
    stageId: "logic-foundations",
    pathId: "logic-thinking-foundations",
    lessonId: "logic-visual-foundations",
    packId: "logic.pack.visual-basics",
    activities: ["logic-match-pairs", "logic-odd-one-out", "logic-more-less"],
    skills: ["logic.visual.matching", "logic.visual.discrimination"]
  },
  {
    id: "science",
    stageId: "science-foundations",
    pathId: "science-discovery-foundations",
    lessonId: "science-living-world",
    packId: "science.pack.living-world",
    activities: ["science-living-cat", "science-match-habitat", "science-find-plant"],
    skills: ["science.living.classification", "science.animals.habitat"]
  }
];

try {
  const subjectIds = new Set(system.SUBJECTS.map((subject) => subject.id));
  const analytics = attemptsLib.emptyLearningAnalytics();
  const emptyProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };

  for (const expected of subjects) {
    assert.ok(subjectIds.has(expected.id), `${expected.id} must be a first-class subject`);

    const paths = curriculum.getLearningPathsForSubject(expected.id);
    assert.equal(paths.length, 1, `${expected.id} must begin with one canonical starter path`);
    assert.equal(paths[0].id, expected.pathId);
    assert.deepEqual(paths[0].stageIds, [expected.stageId]);

    const stages = system.getStagesForSubject(expected.id);
    assert.equal(stages.length, 1, `${expected.id} must begin with one starter stage`);
    assert.equal(stages[0].id, expected.stageId);
    assert.deepEqual(stages[0].activityIds, expected.activities);

    const lessons = curriculum.getLessonsForStage(expected.stageId);
    assert.equal(lessons.length, 1, `${expected.id} starter stage must resolve to one lesson`);
    assert.equal(lessons[0].id, expected.lessonId);
    assert.deepEqual(lessons[0].activityIds, expected.activities);

    const packs = manifest.getContentPacksForStage(expected.stageId);
    assert.equal(packs.length, 1, `${expected.id} starter stage must resolve to one versioned content pack`);
    assert.equal(packs[0].id, expected.packId);
    assert.equal(packs[0].reviewStatus, "internal");

    const activities = expected.activities.map((id) => system.getActivity(id));
    assert.ok(activities.every(Boolean), `${expected.id} starter activities must all be playable`);
    assert.ok(activities.every((activity) => activity.subjectId === expected.id));
    assert.ok(activities.every((activity) => activity.ageMin >= 3 && activity.ageMax <= 7));
    assert.ok(activities.every((activity) => !activity.motionOptional && activity.runtime !== "motion_game"), `${expected.id} foundation must remain touch-first and camera-independent`);

    const specs = expected.activities.map((id) => catalog.getActivityLearningSpec(id));
    assert.ok(specs.every(Boolean), `${expected.id} starter activities must all have learning specs`);
    assert.ok(specs.every((spec) => spec.assessment === "assessed"), `${expected.id} starter activities must use measurable assessment contracts`);
    assert.equal(specs.filter((spec) => spec.requiredForStage).length, 2, `${expected.id} starter stage must have exactly two required core activities`);
    assert.ok(specs.every((spec) => spec.skills.length > 0));

    for (const skillId of expected.skills) {
      const skill = catalog.getLearningSkill(skillId);
      assert.ok(skill, `${skillId} must resolve in the canonical skill taxonomy`);
      assert.equal(skill.subjectId, expected.id);
    }
    assert.equal(catalog.getSkillsForSubject(expected.id).length, expected.skills.length);

    const ranked = adaptive.rankAdaptiveLearningV2({
      age: 5,
      subjectId: expected.id,
      progress: emptyProgress,
      analytics,
      allowMotion: false,
      nowMs: Date.parse("2026-09-10T12:00:00.000Z")
    });
    assert.ok(ranked.length > 0, `${expected.id} must participate in adaptive ranking`);
    assert.ok(ranked.every((item) => system.getActivity(item.id)?.subjectId === expected.id), `${expected.id} adaptive ranking must stay subject-scoped`);

    const recommendation = insights.getSubjectNextLearningRecommendation({
      subjectId: expected.id,
      age: 5,
      progress: emptyProgress,
      analytics,
      allowMotion: false
    });
    assert.ok(recommendation, `${expected.id} must produce a parent/child learning recommendation`);
    assert.equal(recommendation.activity.subjectId, expected.id);

    const summary = insights.getSubjectLearningSummary(expected.id, emptyProgress, analytics);
    assert.equal(summary.subjectId, expected.id);
    assert.equal(summary.requiredActivities, 2, `${expected.id} parent summary must use the two required core activities`);
    assert.equal(summary.totalSkills, 2, `${expected.id} parent summary must include the starter skill taxonomy`);

    const readiness = insights.getSubjectStageReadiness(expected.id, emptyProgress, analytics);
    assert.equal(readiness.length, 1, `${expected.id} must participate in stage readiness`);
    assert.equal(readiness[0].stageId, expected.stageId);
    assert.equal(readiness[0].requiredCount, 2);
  }

  const coverage = curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds, [], "Batch 6 must not introduce orphan stages");
  assert.deepEqual(coverage.uncoveredActivityIds, [], "Batch 6 must not introduce orphan activities");

  console.log("Batch 6 Letters/Menulis, Logic, and Science subject foundations passed navigation-data, curriculum, evidence, adaptive, progression, and parent-summary acceptance.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
