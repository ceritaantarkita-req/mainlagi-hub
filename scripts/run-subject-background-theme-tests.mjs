import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

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
  SUBJECT_CHARACTER_PREFERENCES,
  THEMED_SUBJECT_IDS,
  resolveActivityVisualTheme
} = require(path.resolve(".learning-test-dist/src/lib/learning/activityVisualTheme.js"));
assert.deepEqual(
  [...THEMED_SUBJECT_IDS],
  ["bahasa", "english", "math", "iqro", "letters", "logic", "science", "color", "drawing"],
  "background system must cover the canonical nine subjects"
);

let resolvedCount = 0;
for (const subjectId of THEMED_SUBJECT_IDS) {
  const activities = ACTIVITIES.filter((activity) => activity.subjectId === subjectId);
  assert.equal(activities.length, 100, `${subjectId} must keep the 100-activity baseline`);

  const theme = SUBJECT_THEMES[subjectId];
  assert(theme, `${subjectId} must expose a subject theme`);
  const sceneIds = new Set(theme.scenes.map((scene) => scene.id));
  assert.equal(sceneIds.size, 6, `${subjectId} must expose exactly six scene families`);

  for (const scene of theme.scenes) {
    assert.equal(scene.assetStatus, "approved", `${subjectId}/${scene.id} must be approved for runtime`);
    assert(scene.runtimeAssets, `${subjectId}/${scene.id} must have runtime assets`);
    assert(scene.candidateWideName.endsWith("-v1.png"), `${subjectId}/${scene.id} keeps its reviewed PNG source name`);
    assert(scene.candidateMobileName.endsWith("-mobile-v1.png"), `${subjectId}/${scene.id} keeps its reviewed mobile PNG source name`);
    assert(scene.runtimeAssets.wideSrc.endsWith("-wide.webp"), `${subjectId}/${scene.id} must use optimized wide WebP`);
    assert(scene.runtimeAssets.mobileSrc.endsWith("-mobile.webp"), `${subjectId}/${scene.id} must use optimized mobile WebP`);
    assert(scene.runtimeAssets.wideSrc.startsWith("/artwork/backgrounds/"));
    assert(scene.runtimeAssets.mobileSrc.startsWith("/artwork/backgrounds/"));
  }

  for (const activity of activities) {
    const first = resolveActivityVisualTheme(activity);
    const second = resolveActivityVisualTheme(activity);
    assert(first, `${activity.id} receives a visual theme`);
    assert.deepEqual(second, first, `${activity.id} visual resolution is deterministic`);
    assert.equal(first.subjectId, subjectId);
    assert.equal(first.scene.subjectId, subjectId);
    assert(sceneIds.has(first.scene.id), `${activity.id} resolves inside its subject scene family`);
    assert(first.scene.runtimeAssets, `${activity.id} resolves to active runtime artwork`);
    assert.equal(first.characters.characters.length, 2, `${activity.id} keeps two presentation character slots`);
    assert.deepEqual(
      first.characters.characters.map((character) => character.id),
      SUBJECT_CHARACTER_PREFERENCES[subjectId],
      `${activity.id} resolves the canonical subject character pair`
    );
    assert.equal(first.characters.source, "subject-preference", `${activity.id} uses its approved subject pair without fallback`);
    for (const character of first.characters.characters) {
      assert(character.src.startsWith("/artwork/characters/"), `${activity.id} character must resolve through the SVG production bank`);
      assert(character.src.endsWith("-hero-v1.svg"), `${activity.id} route-entry visual theme defaults to hero state`);
      assert.equal(character.state, "hero", `${activity.id} route-entry visual theme uses neutral hero state`);
      assert.equal(character.assetSource, "svg-state", `${activity.id} uses the shared SVG state runtime`);
      assert(["left", "right"].includes(character.side), `${activity.id} character must have a safe side placement`);
    }
    assert.notEqual(
      first.characters.characters[0].id,
      first.characters.characters[1].id,
      `${activity.id} must not render the same character twice`
    );
    resolvedCount += 1;
  }
}

assert.equal(resolvedCount, 900, "all 900 activities must resolve to an approved subject background");

const frameCss = fs.readFileSync(path.resolve("src/components/learning/GardenActivityFrame.module.css"), "utf8");
const frameSource = fs.readFileSync(path.resolve("src/components/learning/GardenActivityFrame.tsx"), "utf8");
assert.match(frameCss, /\.workspace\{background-color:#fffbee;/, "workspace must keep its paper color without resetting background-image");
assert.doesNotMatch(frameCss, /\.workspace\{background:#fffbee;/, "workspace must not wipe themed background images with the background shorthand");
assert.match(frameSource, /!workspace && characterPresentation/, "creative workspace must suppress the decorative shared CharacterLayer");
assert.match(frameSource, /<CharacterLayer characters=\{runtimeCharacters\}/, "GardenActivityFrame must render characters through the shared CharacterLayer");
assert.doesNotMatch(frameSource, /garden-gavi\.webp|garden-paca\.webp/, "GardenActivityFrame must not hardcode mascot assets outside the presentation resolver");
assert.doesNotMatch(frameSource, /runtimeCharacters\.map/, "GardenActivityFrame must not maintain a second direct character renderer");

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
  "science-investigate-plant-light": "greenhouse",
  "bahasa-cari-a": "letter-garden",
  "english-find-blue": "seaside-learning-cove",
  "letters-find-a": "alphabet-city-02",
  "logic-match-pairs": "space-observatory-01",
  "color-gavi": "art-gallery-01",
  "drawing-line-vertical": "meadow-activity-05"
};

for (const [activityId, sceneId] of Object.entries(expected)) {
  const activity = byId.get(activityId);
  assert(activity, `${activityId} must stay in the catalog`);
  assert.equal(resolveActivityVisualTheme(activity)?.scene.id, sceneId, `${activityId} keeps semantic scene mapping`);
}

assert.deepEqual(SUBJECT_CHARACTER_PREFERENCES.english, ["naya", "zia"], "English is ready for the Naya/Zia production pair");
assert.deepEqual(SUBJECT_CHARACTER_PREFERENCES.math, ["gian", "paca"], "Math is ready for the Gian/Paca production pair");
assert.deepEqual(SUBJECT_CHARACTER_PREFERENCES.bahasa, ["gavi", "paca"], "Bahasa keeps the approved mascot pair today");
assert.deepEqual(SUBJECT_CHARACTER_PREFERENCES.science, ["gavi", "paca"], "Science stays on the approved mascot pair until a product pairing is approved");
assert.deepEqual(SUBJECT_CHARACTER_PREFERENCES.letters, ["gavi", "paca"], "Letters stays on the approved mascot pair until a product pairing is approved");

const englishCharacters = resolveActivityVisualTheme(byId.get("english-find-blue"))?.characters;
assert.deepEqual(
  englishCharacters?.characters.map((character) => character.id),
  ["naya", "zia"],
  "English must activate the approved Naya/Zia SVG pair"
);
assert.equal(englishCharacters?.source, "subject-preference");
assert(englishCharacters?.characters.every((character) => character.state === "hero"));

const mathCharacters = resolveActivityVisualTheme(byId.get("math-shape-three-sides"))?.characters;
assert.deepEqual(
  mathCharacters?.characters.map((character) => character.id),
  ["gian", "paca"],
  "Math must activate the approved Gian/Paca SVG pair"
);

console.log("Subject visual theme regression passed: nine subjects, 54 scene families, 108 responsive WebP backgrounds, deterministic coverage for all 900 activities, and shared SVG character pairing for every Belajar subject.");
