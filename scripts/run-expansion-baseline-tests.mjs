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
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const curriculum = require(path.join(outDir, "src", "lib", "learning", "curriculum.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));

const baselineFloors = Object.freeze({
  bahasa: 6,
  english: 6,
  math: 7,
  iqro: 4,
  color: 2
});

const expansionTargets = Object.freeze({
  bahasa: 100,
  english: 100,
  math: 100,
  iqro: 100,
  color: 100
});

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
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

  assert.equal(system.ACTIVITIES.length, 25, "Batch 0 freezes the known expansion baseline at 25 playable activities");
  assert.equal(system.STAGES.length, 7, "Batch 0 stage baseline changed unexpectedly");
  assert.equal(curriculum.LEARNING_PATHS.length, 5, "Batch 0 learning-path baseline changed unexpectedly");
  assert.equal(curriculum.LEARNING_LESSONS.length, 13, "Batch 0 lesson baseline changed unexpectedly");
  assert.equal(catalog.LEARNING_SKILLS.length, 12, "Batch 0 skill baseline changed unexpectedly");
  assert.equal(specValues.length, system.ACTIVITIES.length, "every playable activity needs a learning catalog spec");

  for (const [subjectId, floor] of Object.entries(baselineFloors)) {
    assert.ok((activityCounts[subjectId] ?? 0) >= floor, `${subjectId} activity count regressed below Batch 0 floor ${floor}`);
  }

  for (const [subjectId, target] of Object.entries(expansionTargets)) {
    assert.ok((activityCounts[subjectId] ?? 0) < target, `${subjectId} has reached the 100-activity target; update the expansion closure contract instead of silently changing this baseline test`);
  }

  const expectedRuntimeCounts = {
    tap_choice: 6,
    listen_and_choose: 5,
    matching: 7,
    trace: 1,
    story: 1,
    motion_game: 3,
    coloring: 2
  };
  assert.deepEqual(runtimeCounts, expectedRuntimeCounts, "current mechanic/runtime inventory changed; update the documented baseline intentionally");
  assert.deepEqual(assessmentCounts, { assessed: 19, practice: 6 }, "assessment baseline changed unexpectedly");

  const uniqueIds = new Set(system.ACTIVITIES.map((activity) => activity.id));
  assert.equal(uniqueIds.size, system.ACTIVITIES.length, "activity IDs must be unique before catalog expansion starts");

  for (const activity of system.ACTIVITIES) {
    const spec = catalog.getActivityLearningSpec(activity.id);
    assert.ok(spec, `${activity.id} is missing a learning spec`);
    assert.equal(spec.subjectId, activity.subjectId, `${activity.id} subject mismatch between runtime and learning spec`);
    assert.equal(spec.stageId, activity.stageId, `${activity.id} stage mismatch between runtime and learning spec`);
    assert.ok(activity.ageMin >= 3 && activity.ageMax <= 7 && activity.ageMin <= activity.ageMax, `${activity.id} has an invalid age range`);
  }

  const audioManagerSource = readFileSync(path.join(root, "src", "lib", "audio", "AudioManager.ts"), "utf8");
  assert.match(audioManagerSource, /mainlagi-speech-latency/, "speech-start latency instrumentation must stay in the canonical AudioManager");
  assert.match(audioManagerSource, /startLatencyMs/, "speech latency samples must expose measured request-to-start latency when the browser reports it");
  assert.match(audioManagerSource, /textLength/, "latency telemetry should use prompt length rather than copying spoken child-learning text into the event payload");
  assert.match(audioManagerSource, /warmed/, "Batch 3 latency samples must distinguish warmed speech state");

  const feedbackSource = readFileSync(path.join(root, "src", "lib", "audio", "feedback.ts"), "utf8");
  assert.match(feedbackSource, /audioManager\.speakPrompt/, "legacy feedback facade must delegate speech to AudioManager");

  const report = {
    activities: system.ACTIVITIES.length,
    stages: system.STAGES.length,
    paths: curriculum.LEARNING_PATHS.length,
    lessons: curriculum.LEARNING_LESSONS.length,
    skills: catalog.LEARNING_SKILLS.length,
    bySubject: activityCounts,
    byRuntime: runtimeCounts,
    byAssessment: assessmentCounts,
    targetGap: Object.fromEntries(Object.entries(expansionTargets).map(([subjectId, target]) => [subjectId, target - (activityCounts[subjectId] ?? 0)])),
    skillsBySubject: skillCounts
  };

  console.log("Mainlagi expansion baseline contracts passed with canonical Batch 3 AudioManager instrumentation.");
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error);
  process.exit(1);
}
