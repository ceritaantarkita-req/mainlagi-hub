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
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const curriculum = require(path.join(outDir, "src", "lib", "learning", "curriculum.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const batch7 = require(path.join(outDir, "src", "lib", "learning", "mathBatch7.js"));

const expectedFloors = Object.freeze({ bahasa: 6, english: 6, math: 25, iqro: 4, letters: 3, logic: 3, science: 3, color: 2 });
const expansionTargets = Object.freeze({ bahasa: 100, english: 100, math: 100, iqro: 100, letters: 100, logic: 100, science: 100, color: 100 });

function countBy(items, key) {
  return items.reduce((counts, item) => { const value = item[key]; counts[value] = (counts[value] ?? 0) + 1; return counts; }, {});
}

try {
  const coverage = curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds, [], "all current stages must remain owned by a learning path");
  assert.deepEqual(coverage.uncoveredActivityIds, [], "all current activities must remain owned by a lesson");

  const activityCounts = countBy(system.ACTIVITIES, "subjectId");
  const runtimeCounts = countBy(system.ACTIVITIES, "runtime");
  const skillCounts = countBy(catalog.LEARNING_SKILLS, "subjectId");
  const specValues = Object.values(catalog.ACTIVITY_LEARNING_SPECS);
  const assessmentCounts = countBy(specValues, "assessment");

  assert.equal(system.SUBJECTS.length, 8);
  assert.equal(system.ACTIVITIES.length, 52, "Batch 7 Wave A must produce 52 total activities");
  assert.equal(system.STAGES.length, 11, "Batch 7 Wave A must add exactly one Math stage");
  assert.equal(curriculum.LEARNING_PATHS.length, 8);
  assert.equal(curriculum.LEARNING_LESSONS.length, 20, "Batch 7 Wave A must add four Math lessons");
  assert.equal(manifest.CONTENT_PACKS.length, 20, "Batch 7 Wave A must add four content packs");
  assert.equal(catalog.LEARNING_SKILLS.length, 22, "Batch 7 Wave A must add four Math skills");
  assert.equal(specValues.length, system.ACTIVITIES.length, "every playable activity needs a learning catalog spec");

  for (const [subjectId, floor] of Object.entries(expectedFloors)) {
    assert.ok((activityCounts[subjectId] ?? 0) >= floor, `${subjectId} activity count regressed below floor ${floor}`);
  }
  assert.equal(activityCounts.math, 25, "Wave A closes only when Math reaches exactly 25 activities");
  assert.deepEqual(batch7.MATH_BATCH7_WAVE_ACTIVITY_COUNTS, { A: 18 }, "Wave A must add exactly 18 activities on top of seven historical Math activities");
  assert.equal(new Set(batch7.MATH_BATCH7_ACTIVITY_IDS).size, 18, "Wave A activity IDs must be unique");

  for (const [subjectId, target] of Object.entries(expansionTargets)) {
    assert.ok((activityCounts[subjectId] ?? 0) < target, `${subjectId} reached its 100 target unexpectedly during Wave A`);
  }

  assert.deepEqual(runtimeCounts, { tap_choice: 25, listen_and_choose: 5, matching: 14, trace: 2, story: 1, motion_game: 3, coloring: 2 });
  assert.deepEqual(assessmentCounts, { assessed: 45, practice: 7 }, "Wave A must add assessed evidence activities without changing practice boundaries");

  const uniqueIds = new Set(system.ACTIVITIES.map((activity) => activity.id));
  assert.equal(uniqueIds.size, system.ACTIVITIES.length, "activity IDs must remain unique");
  for (const activity of system.ACTIVITIES) {
    const spec = catalog.getActivityLearningSpec(activity.id);
    assert.ok(spec, `${activity.id} is missing a learning spec`);
    assert.equal(spec.subjectId, activity.subjectId);
    assert.equal(spec.stageId, activity.stageId);
    assert.ok(activity.ageMin >= 3 && activity.ageMax <= 7 && activity.ageMin <= activity.ageMax);
  }
  for (const activityId of batch7.MATH_BATCH7_ACTIVITY_IDS) {
    const spec = catalog.getActivityLearningSpec(activityId);
    assert.equal(spec?.assessment, "assessed", `${activityId} must remain assessed with measured evidence`);
  }

  const audioManagerSource = readFileSync(path.join(root, "src", "lib", "audio", "AudioManager.ts"), "utf8");
  assert.match(audioManagerSource, /mainlagi-speech-latency/);
  assert.match(audioManagerSource, /startLatencyMs/);
  assert.match(audioManagerSource, /textLength/);
  assert.match(audioManagerSource, /warmed/);

  const report = {
    subjects: system.SUBJECTS.length,
    activities: system.ACTIVITIES.length,
    stages: system.STAGES.length,
    paths: curriculum.LEARNING_PATHS.length,
    lessons: curriculum.LEARNING_LESSONS.length,
    packs: manifest.CONTENT_PACKS.length,
    skills: catalog.LEARNING_SKILLS.length,
    bySubject: activityCounts,
    byRuntime: runtimeCounts,
    byAssessment: assessmentCounts,
    targetGap: Object.fromEntries(Object.entries(expansionTargets).map(([subjectId, target]) => [subjectId, target - (activityCounts[subjectId] ?? 0)])),
    skillsBySubject: skillCounts
  };
  console.log("Mainlagi Expansion Batch 7 Math Wave A contracts passed.");
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error);
  process.exit(1);
}
