import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".english-narration-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json", "--outDir", outDir], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const systemBase = require(path.join(outDir, "src", "lib", "learning", "systemBase.js"));
const englishBatch9 = require(path.join(outDir, "src", "lib", "learning", "englishBatch9.js"));
const narrationRegistry = JSON.parse(
  readFileSync(path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json"), "utf8")
);

const targetOnlyPrompts = new Map(Object.entries({
  "english-find-blue-audio": "Blue.",
  "english-listen-cat": "Cat.",
  "english-listen-cat-2": "Cat.",
  "english-listen-letter-a": "Letter A.",
  "english-listen-letter-m": "Letter M.",
  "english-listen-yellow": "Yellow.",
  "english-listen-three": "Three.",
  "english-listen-bird": "Bird.",
  "english-listen-bag": "Bag.",
  "english-listen-eyes": "Eyes.",
  "english-listen-sister": "Sister.",
  "english-review-listen-father": "Father.",
  "english-review-listen-fish": "Fish.",
  "english-listen-milk": "Milk.",
  "english-listen-sleep": "Sleep.",
  "english-listen-apple-review": "Apple.",
  "english-listen-jump-review": "Jump.",
  "english-listen-book-review": "Book.",
  "english-listen-hand-review": "Hand.",
  "english-listen-baby-review": "Baby.",
  "english-listen-phrase-blue-book": "A blue book.",
  "english-review-listen-yellow-ball": "A yellow ball."
}));

const comprehensionPrompts = new Map(Object.entries({
  "english-detail-red-ball": "The ball is red. What color is the ball?",
  "english-detail-two-books": "I have two books. How many books?",
  "english-detail-dog-runs": "The dog runs. What does the dog do?",
  "english-detail-baby-sleeps": "The baby sleeps. Who sleeps?",
  "english-detail-bird-up": "The bird is up. Which word did you hear?"
}));

try {
  const englishListening = system.ACTIVITIES.filter(
    (activity) => activity.subjectId === "english" && activity.runtime === "listen_and_choose"
  );
  assert.equal(englishListening.length, 27, "English narration wave must preserve the existing 27 listening activities");

  for (const activity of englishListening) {
    assert.equal(activity.prompt, "Listen, then choose the best answer.", `${activity.id} must keep a leak-free visible listening instruction`);
    assert.ok(activity.audioPrompt?.trim(), `${activity.id} must expose non-empty spoken English narration`);
    assert.notEqual(activity.audioPrompt, activity.prompt, `${activity.id} spoken narration must stay separate from visible instruction`);
  }

  for (const [activityId, expected] of targetOnlyPrompts) {
    const activity = system.getActivity(activityId);
    assert(activity, `${activityId} must remain in the English catalog`);
    assert.equal(activity.audioPrompt, expected, `${activityId} must use reviewed target-first spoken copy`);
    assert.doesNotMatch(activity.audioPrompt, /^(choose|find|listen)\b/i, `${activityId} must not prepend generic task instructions to the learning target`);
  }

  for (const [activityId, expected] of comprehensionPrompts) {
    const activity = system.getActivity(activityId);
    assert(activity, `${activityId} comprehension activity must remain in the English catalog`);
    assert.equal(activity.audioPrompt, expected, `${activityId} must preserve its full listening-comprehension sentence and question`);
  }

  const canonicalListening = [
    ...systemBase.ACTIVITIES,
    ...englishBatch9.ENGLISH_BATCH9_ACTIVITIES
  ].filter((activity) => activity.subjectId === "english" && activity.runtime === "listen_and_choose");

  assert.equal(canonicalListening.length, englishListening.length, "presentation-only narration work must not add or remove assessed listening activities");
  for (const canonical of canonicalListening) {
    const runtime = system.getActivity(canonical.id);
    assert(runtime, `${canonical.id} must survive presentation normalization`);
    assert.equal(runtime.runtime, canonical.runtime, `${canonical.id} runtime contract must stay unchanged`);
    assert.equal(runtime.stageId, canonical.stageId, `${canonical.id} stage ownership must stay unchanged`);
    assert.deepEqual(runtime.choices, canonical.choices, `${canonical.id} choices must stay unchanged`);
    assert.equal(runtime.correctChoice, canonical.correctChoice, `${canonical.id} correct answer must stay unchanged`);
  }

  assert.equal(targetOnlyPrompts.size + comprehensionPrompts.size, englishListening.length, "all English listening activities must be reviewed by this wave");

  assert.equal(narrationRegistry.version, 1, "English narration asset registry version must stay explicit");
  assert.equal(narrationRegistry.scope, "english-learning-fixed-narration", "English narration registry scope must stay fixed");
  const registryIds = Object.keys(narrationRegistry.items ?? {}).sort();
  const runtimeIds = englishListening.map((activity) => activity.id).sort();
  assert.deepEqual(registryIds, runtimeIds, "English narration asset registry must cover exactly the live 27 listening activities");
  for (const activity of englishListening) {
    const assetRecord = narrationRegistry.items[activity.id];
    assert(assetRecord, `${activity.id} must have a narration asset registry slot`);
    assert.equal(assetRecord.language, "en-US", `${activity.id} asset language must stay en-US`);
    assert.equal(assetRecord.transcript, activity.audioPrompt, `${activity.id} asset transcript must exactly match the reviewed runtime audioPrompt`);
  }

  console.log(`English narration quality tests passed: ${englishListening.length} listening activities reviewed, ${targetOnlyPrompts.size} target-first prompts, ${comprehensionPrompts.size} comprehension prompts, asset registry transcripts synchronized.`);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
