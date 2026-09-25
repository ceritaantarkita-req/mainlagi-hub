import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const compile = spawnSync(
  process.execPath,
  ["node_modules/typescript/bin/tsc", "-p", "tsconfig.learning-tests.json"],
  { stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const {
  CHARACTER_ASSET_REGISTRY,
  CHARACTER_PRESENTATION_STATES,
  CHARACTER_STATE_ASSET_REGISTRY,
  approvedCharacterRuntimeAsset,
  approvedCharacterRuntimeSrc,
  resolveCharacterState
} = require(path.resolve(".learning-test-dist/src/lib/learning/characterAssets.js"));
const {
  BELAJAR_CHARACTER_STATE_BY_MOMENT,
  CHARACTER_PRESENTATION_CONTEXTS,
  SUBJECT_CHARACTER_PAIRS,
  WORLD_CHARACTER_CASTS,
  characterStateForBelajarMoment,
  resolveCharacterEnsemble,
  resolveCharacterPresentation
} = require(path.resolve(".learning-test-dist/src/lib/learning/characterPresentation.js"));

const provenance = JSON.parse(
  fs.readFileSync(path.resolve("src/lib/data/character-asset-provenance.json"), "utf8")
);

const IDS = ["naya", "gian", "zia", "paca", "gavi"];
const STATES = ["hero", "welcome", "pointing", "thinking", "correct", "try_again", "celebrate"];

assert.deepEqual([...CHARACTER_PRESENTATION_STATES], STATES, "runtime state vocabulary stays locked");
assert.deepEqual(Object.keys(CHARACTER_STATE_ASSET_REGISTRY).sort(), [...IDS].sort(), "runtime registry covers five characters");

let pathCount = 0;
for (const id of IDS) {
  for (const state of STATES) {
    const runtime = approvedCharacterRuntimeAsset(id, state);
    const record = provenance.items[id].variants[state];
    assert(runtime, `${id}/${state} resolves approved runtime SVG`);
    assert.equal(record.lifecycle, "approved", `${id}/${state} provenance remains approved`);
    assert.equal(runtime.src, record.productionPath, `${id}/${state} runtime path matches provenance`);
    assert.equal(runtime.state, state);
    assert.equal(runtime.source, "svg-state");
    assert.match(runtime.src, /^\/artwork\/characters\/[a-z]+-(hero|welcome|pointing|thinking|correct|try-again|celebrate)-v1\.svg$/);
    pathCount += 1;
  }
}
assert.equal(pathCount, 35, "all 35 approved state assets are runtime-addressable");

assert(CHARACTER_PRESENTATION_CONTEXTS.includes("play_entry"), "shared presentation contexts include Bermain entry");
assert(CHARACTER_PRESENTATION_CONTEXTS.includes("play_completion"), "shared presentation contexts include Bermain completion");

// Historical compatibility API remains stable for callers that have not migrated.
 // Session 06 Belajar surfaces must no longer depend on this API.
for (const id of ["naya", "gian", "zia"]) {
  assert.equal(CHARACTER_ASSET_REGISTRY[id].lifecycle, "reference-only");
  assert.equal(approvedCharacterRuntimeSrc(id), null, `${id} legacy compatibility gate remains closed until Session 06`);
}
for (const id of ["gavi", "paca"]) {
  assert.match(approvedCharacterRuntimeSrc(id), /^\/artwork\/garden-(gavi|paca)\.webp$/);
}

// Exercise the real same-identity fallback chain by temporarily removing slots.
{
  const states = CHARACTER_STATE_ASSET_REGISTRY.naya;
  const savedCorrect = states.correct;
  delete states.correct;
  try {
    const resolved = resolveCharacterState("naya", "correct");
    assert(resolved);
    assert.equal(resolved.id, "naya");
    assert.equal(resolved.state, "hero", "missing requested state falls back to same-character hero");
  } finally {
    states.correct = savedCorrect;
  }
}

{
  const states = CHARACTER_STATE_ASSET_REGISTRY.gavi;
  const saved = { hero: states.hero, welcome: states.welcome, correct: states.correct };
  delete states.correct;
  delete states.hero;
  delete states.welcome;
  try {
    const resolved = resolveCharacterState("gavi", "correct");
    assert(resolved);
    assert.equal(resolved.source, "legacy-webp", "Gavi may fall back to approved legacy asset");
    assert.equal(resolved.src, "/artwork/garden-gavi.webp");
  } finally {
    states.correct = saved.correct;
    states.hero = saved.hero;
    states.welcome = saved.welcome;
  }
}

{
  const states = CHARACTER_STATE_ASSET_REGISTRY.naya;
  const saved = { hero: states.hero, welcome: states.welcome, correct: states.correct };
  delete states.correct;
  delete states.hero;
  delete states.welcome;
  try {
    assert.equal(resolveCharacterState("naya", "correct"), null, "human character never falls back to an unapproved reference asset");
  } finally {
    states.correct = saved.correct;
    states.hero = saved.hero;
    states.welcome = saved.welcome;
  }
}

assert.deepEqual(
  BELAJAR_CHARACTER_STATE_BY_MOMENT,
  {
    entry: "welcome",
    guide: "pointing",
    waiting: "hero",
    correct: "correct",
    retry: "try_again",
    completion: "celebrate"
  },
  "Belajar moment-to-state policy stays canonical"
);
for (const [moment, state] of Object.entries(BELAJAR_CHARACTER_STATE_BY_MOMENT)) {
  assert.equal(characterStateForBelajarMoment(moment), state, `${moment} resolves to ${state}`);
}

assert.deepEqual(SUBJECT_CHARACTER_PAIRS.english, ["naya", "zia"]);
assert.deepEqual(SUBJECT_CHARACTER_PAIRS.math, ["gian", "paca"]);
assert.deepEqual(WORLD_CHARACTER_CASTS["money-festival"], ["gavi", "paca"]);

const english = resolveCharacterPresentation({ context: "activity", subjectId: "english", requestedState: "pointing" });
assert.equal(english.source, "subject-preference");
assert.deepEqual(english.characters.map((c) => c.id), ["naya", "zia"]);
assert.deepEqual(english.characters.map((c) => c.state), ["pointing", "pointing"]);
assert(english.characters.every((c) => c.assetSource === "svg-state"));

const math = resolveCharacterPresentation({ context: "activity", subjectId: "math", requestedState: "thinking" });
assert.deepEqual(math.characters.map((c) => c.id), ["gian", "paca"]);
assert.deepEqual(math.characters.map((c) => c.state), ["thinking", "thinking"]);

const worldCatalog = resolveCharacterPresentation({ context: "world_catalog", worldId: "money-festival" });
assert.equal(worldCatalog.source, "world-cast");
assert.deepEqual(worldCatalog.characters.map((c) => c.id), ["gavi", "paca"]);
assert(worldCatalog.characters.every((c) => c.state === "welcome"));

const worldMap = resolveCharacterPresentation({ context: "world_map", worldId: "money-festival" });
assert(worldMap.characters.every((c) => c.state === "pointing"));

const worldCompletion = resolveCharacterPresentation({ context: "world_completion", worldId: "money-festival" });
assert(worldCompletion.characters.every((c) => c.state === "celebrate"));

const activityCompletion = resolveCharacterPresentation({ context: "activity_completion", subjectId: "bahasa" });
assert(activityCompletion.characters.every((c) => c.state === "celebrate"));

const playEntry = resolveCharacterPresentation({
  context: "play_entry",
  requestedCharacters: ["gavi", "paca"],
  allowIdentityFallback: false
});
assert.equal(playEntry.source, "authored");
assert.deepEqual(playEntry.characters.map((c) => c.id), ["gavi", "paca"]);
assert(playEntry.characters.every((c) => c.state === "welcome"));
assert(playEntry.characters.every((c) => c.assetSource === "svg-state"));

const playCompletion = resolveCharacterPresentation({
  context: "play_completion",
  requestedCharacters: ["gavi", "paca"],
  allowIdentityFallback: false
});
assert.deepEqual(playCompletion.characters.map((c) => c.id), ["gavi", "paca"]);
assert(playCompletion.characters.every((c) => c.state === "celebrate"));

const homeEnsemble = resolveCharacterEnsemble({
  context: "home",
  requestedCharacters: ["naya", "gian", "paca", "zia", "gavi"],
  requestedState: "hero",
  allowIdentityFallback: false
});
assert.equal(homeEnsemble.source, "authored");
assert.deepEqual(
  homeEnsemble.characters.map((c) => c.id),
  ["naya", "gian", "paca", "zia", "gavi"],
  "Home ensemble preserves the canonical five-character order"
);
assert(homeEnsemble.characters.every((c) => c.state === "hero"));
assert(homeEnsemble.characters.every((c) => c.assetSource === "svg-state"));

const authored = resolveCharacterPresentation({
  context: "home",
  requestedCharacters: ["zia", "zia", "naya", "gian"],
  requestedState: "welcome"
});
assert.equal(authored.source, "authored");
assert.deepEqual(authored.characters.map((c) => c.id), ["zia", "naya"], "authored cast dedupes and caps at two");

const unknownWorld = resolveCharacterPresentation({ context: "world_scene", worldId: "future-world" });
assert.equal(unknownWorld.characters.length, 0, "unknown World cast fails closed instead of injecting mascots");

// Cross-identity fallback is presentation-owned and explicit.
{
  const states = CHARACTER_STATE_ASSET_REGISTRY.naya;
  const saved = { hero: states.hero, welcome: states.welcome, correct: states.correct };
  delete states.correct;
  delete states.hero;
  delete states.welcome;
  try {
    const fallback = resolveCharacterPresentation({ context: "activity", subjectId: "english", requestedState: "correct" });
    assert.equal(fallback.source, "approved-fallback");
    assert.deepEqual(fallback.characters.map((c) => c.id), ["gavi", "zia"]);
  } finally {
    states.correct = saved.correct;
    states.hero = saved.hero;
    states.welcome = saved.welcome;
  }
}

const providerSource = fs.readFileSync(path.resolve("src/components/learning/ActivityVisualThemeProvider.tsx"), "utf8");
const bridgeSource = fs.readFileSync(path.resolve("src/components/learning/LearningAttemptBridge.tsx"), "utf8");
const frameSource = fs.readFileSync(path.resolve("src/components/learning/GardenActivityFrame.tsx"), "utf8");
const themeSource = fs.readFileSync(path.resolve("src/lib/learning/activityVisualTheme.ts"), "utf8");

assert.match(providerSource, /LEARNING_CHARACTER_PRESENTATION_EVENT/, "activity provider listens to the shared presentation event");
assert.match(providerSource, /detail\.childId !== childId \|\| detail\.activityId !== activityId/, "activity provider filters feedback by exact child/activity identity");
assert.match(providerSource, /useState<BelajarCharacterMoment>\("entry"\)/, "activity provider initializes each mount in entry state");
assert.doesNotMatch(providerSource, /setMomentState\("entry"\)/, "activity provider must not synchronously reset state inside an effect");
assert.match(providerSource, /if \(current !== "entry"\) return current;/, "entry state transitions to waiting without learning-state mutation");
const activityRouteSource = fs.readFileSync(path.resolve("src/app/child/[childId]/activity/[activity]/page.tsx"), "utf8");
assert.match(activityRouteSource, /ActivityVisualThemeProvider key=\{activity\}/, "activity route remounts the character provider for exact activity identity");
assert.match(providerSource, /isTransientMoment/, "guide/correct/retry moments are transient");
assert.match(providerSource, /detail\.moment === "completion" && momentRef\.current === "correct"/, "completion must preserve a visible correct pose before celebration");
assert.match(providerSource, /CORRECT_TO_COMPLETION_MS = 550/, "correct-to-celebrate handoff duration stays presentation-only and bounded");
assert.match(bridgeSource, /moment: "correct"/, "attempt bridge publishes correct presentation feedback");
assert.match(bridgeSource, /moment: "retry"/, "attempt bridge publishes retry presentation feedback");
assert.match(bridgeSource, /moment: "completion"/, "attempt bridge publishes completion presentation feedback");
assert.match(frameSource, /setCharacterMoment\("guide"\)/, "Dengar action publishes guide presentation state");
assert.match(frameSource, /!workspace && characterPresentation/, "creative workspaces hide the decorative character layer");
assert.match(frameSource, /<CharacterLayer characters=\{runtimeCharacters\}/, "Garden frame renders through the shared CharacterLayer");
assert.doesNotMatch(frameSource, /runtimeCharacters\.map/, "Garden frame must not retain a second character renderer");
assert.match(themeSource, /resolveCharacterPresentation\(\{ context: "activity", subjectId \}\)/, "Belajar visual theme resolves through the shared character presentation module");
assert.doesNotMatch(themeSource, /approvedCharacterRuntimeSrc/, "Belajar visual theme must no longer depend on the legacy compatibility API");

const layerSource = fs.readFileSync(path.resolve("src/components/learning/CharacterLayer.tsx"), "utf8");
const layerCss = fs.readFileSync(path.resolve("src/components/learning/CharacterLayer.module.css"), "utf8");
assert.match(layerSource, /variant === "ensemble" \? 5 : 2/, "CharacterLayer preserves two-character normal rendering and explicitly allows five-character Home ensemble");
assert.match(layerSource, /styles\.ensemble/, "CharacterLayer exposes one shared ensemble variant instead of a second renderer");
assert.match(layerSource, /data-character-state=/, "CharacterLayer exposes state QA attribute");
assert.match(layerSource, /data-character-asset-source=/, "CharacterLayer exposes asset source QA attribute");
assert.match(layerSource, /alt=""/, "decorative character images do not duplicate screen-reader narration");
assert.match(layerCss, /pointer-events:\s*none/, "character layer cannot block task interaction");
assert.match(layerCss, /env\(safe-area-inset-bottom\)/, "character layer respects bottom safe area");
assert.match(layerCss, /prefers-reduced-motion:\s*reduce/, "character motion respects reduced-motion preference");
assert.match(layerCss, /animation:\s*none\s*!important/, "reduced-motion disables character animation");

console.log(
  "Character runtime regression passed: 35 provenance-bound SVG states, canonical Belajar/World/Bermain state mapping, five-character Home ensemble, shared feedback bridge/provider state machine, and CharacterLayer safety contract."
);
