import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile = spawnSync(
  process.execPath,
  ["node_modules/typescript/bin/tsc", "-p", "tsconfig.learning-tests.json"],
  { stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const { ACTIVITIES } = require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {
  SUBJECT_THEMES,
  resolveActivityVisualTheme
} = require(path.resolve(".learning-test-dist/src/lib/learning/activityVisualTheme.js"));

for (const subjectId of ["math", "science"]) {
  const activities = ACTIVITIES.filter((activity) => activity.subjectId === subjectId);
  assert(activities.length > 0, `${subjectId} pilot must contain activities`);

  const sceneIds = new Set(SUBJECT_THEMES[subjectId].scenes.map((scene) => scene.id));
  assert.equal(sceneIds.size, 6, `${subjectId} pilot must expose exactly six scene families`);

  for (const scene of SUBJECT_THEMES[subjectId].scenes) {
    assert.equal(scene.assetStatus, "candidate", `${subjectId}/${scene.id} stays candidate until provenance approval`);
    assert.equal(scene.runtimeAssets, null, `${subjectId}/${scene.id} must not activate unapproved binary assets`);
    assert(scene.candidateWideName.endsWith("-v1.png"));
    assert(scene.candidateMobileName.endsWith("-mobile-v1.png"));
  }

  for (const activity of activities) {
    const first = resolveActivityVisualTheme(activity);
    const second = resolveActivityVisualTheme(activity);
    assert(first, `${activity.id} receives a pilot visual theme`);
    assert.deepEqual(second, first, `${activity.id} visual resolution is deterministic`);
    assert.equal(first.subjectId, subjectId);
    assert.equal(first.scene.subjectId, subjectId);
    assert(sceneIds.has(first.scene.id), `${activity.id} resolves inside its subject scene set`);
  }
}

for (const activity of ACTIVITIES.filter((item) => item.subjectId !== "math" && item.subjectId !== "science")) {
  assert.equal(resolveActivityVisualTheme(activity), null, `${activity.id} stays outside the Math/Science pilot`);
}

const byId = new Map(ACTIVITIES.map((activity) => [activity.id, activity]));
const expected = {
  "math-count-4": "number-park",
  "math-shape-find-circle": "shape-playground",
  "math-group-6-by-2": "block-yard",
  "math-problem-apples": "mini-market",
  "math-measure-longer": "measurement-workshop",
  "science-water-ice-melts": "pond",
  "science-weather-rain-clue": "weather-meadow",
  "science-plant-roots": "greenhouse",
  "science-feature-duck-webbed-feet": "nature-trail",
  "science-material-raincoat-waterproof": "material-workshop",
  "science-investigate-plant-light": "greenhouse"
};

for (const [activityId, sceneId] of Object.entries(expected)) {
  const activity = byId.get(activityId);
  assert(activity, `${activityId} must stay in the catalog`);
  assert.equal(resolveActivityVisualTheme(activity)?.scene.id, sceneId, `${activityId} keeps semantic scene mapping`);
}

console.log("Subject background theme regression passed: six Math + six Science scene families, deterministic resolution, and fail-closed candidate assets.");
