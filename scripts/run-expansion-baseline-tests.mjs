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

const expectedFloors = Object.freeze({ bahasa: 6, english: 6, math: 50, iqro: 4, letters: 3, logic: 3, science: 3, color: 2 });
const expansionTargets = Object.freeze({ bahasa: 100, english: 100, math: 100, iqro: 100, letters: 100, logic: 100, science: 100, color: 100 });
function countBy(items, key) { return items.reduce((counts, item) => { const value = item[key]; counts[value] = (counts[value] ?? 0) + 1; return counts; }, {}); }

try {
  const coverage = curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds, []);
  assert.deepEqual(coverage.uncoveredActivityIds, []);
  const activityCounts = countBy(system.ACTIVITIES, "subjectId");
  const runtimeCounts = countBy(system.ACTIVITIES, "runtime");
  const skillCounts = countBy(catalog.LEARNING_SKILLS, "subjectId");
  const specValues = Object.values(catalog.ACTIVITY_LEARNING_SPECS);
  const assessmentCounts = countBy(specValues, "assessment");

  assert.equal(system.SUBJECTS.length, 8);
  assert.equal(system.ACTIVITIES.length, 77, "Batch 7 Wave B must produce 77 total activities");
  assert.equal(system.STAGES.length, 12);
  assert.equal(curriculum.LEARNING_PATHS.length, 8);
  assert.equal(curriculum.LEARNING_LESSONS.length, 24);
  assert.equal(manifest.CONTENT_PACKS.length, 24);
  assert.equal(catalog.LEARNING_SKILLS.length, 27);
  assert.equal(specValues.length, system.ACTIVITIES.length);
  for (const [subjectId, floor] of Object.entries(expectedFloors)) assert.ok((activityCounts[subjectId] ?? 0) >= floor, `${subjectId} regressed below ${floor}`);
  assert.equal(activityCounts.math, 50, "Wave B closes only at exactly 50 Math activities");
  assert.deepEqual(batch7.MATH_BATCH7_WAVE_ACTIVITY_COUNTS, { A: 18, B: 25 });
  assert.equal(batch7.MATH_BATCH7_ACTIVITY_IDS.length, 43);
  assert.equal(new Set(batch7.MATH_BATCH7_ACTIVITY_IDS).size, 43);
  for (const [subjectId, target] of Object.entries(expansionTargets)) assert.ok((activityCounts[subjectId] ?? 0) < target, `${subjectId} reached 100 unexpectedly during Wave B`);
  assert.deepEqual(runtimeCounts, { tap_choice: 46, listen_and_choose: 5, matching: 18, trace: 2, story: 1, motion_game: 3, coloring: 2 });
  assert.deepEqual(assessmentCounts, { assessed: 70, practice: 7 });
  assert.equal(new Set(system.ACTIVITIES.map((activity) => activity.id)).size, system.ACTIVITIES.length);
  for (const activityId of batch7.MATH_BATCH7_ACTIVITY_IDS) assert.equal(catalog.getActivityLearningSpec(activityId)?.assessment, "assessed", `${activityId} must remain measured assessed evidence`);
  const audioManagerSource = readFileSync(path.join(root, "src", "lib", "audio", "AudioManager.ts"), "utf8");
  assert.match(audioManagerSource, /mainlagi-speech-latency/);
  console.log("Mainlagi Expansion Batch 7 Math Wave B contracts passed.");
  console.log(JSON.stringify({ activities: system.ACTIVITIES.length, bySubject: activityCounts, byRuntime: runtimeCounts, byAssessment: assessmentCounts, stages: system.STAGES.length, lessons: curriculum.LEARNING_LESSONS.length, packs: manifest.CONTENT_PACKS.length, skills: catalog.LEARNING_SKILLS.length, skillsBySubject: skillCounts }, null, 2));
} catch (error) { console.error(error); process.exit(1); }
