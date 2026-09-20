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
const trace = require(path.join(outDir, "src", "lib", "learning", "traceMeasurement.js"));
const templates = require(path.join(outDir, "src", "lib", "engine", "templates.js"));
const learningSystem = require(path.join(outDir, "src", "lib", "learning", "system.js"));

function stroke(points, id = "trace") {
  return {
    id,
    points: points.map((point, index) => ({ ...point, t: index * 16 })),
    startedAt: 0,
    endedAt: Math.max(16, points.length * 16)
  };
}

try {
  const target = templates.DIGIT_TEMPLATES[5][0];
  const perfect = trace.measureLearningDigitTrace({
    digit: 5,
    strokes: [stroke(target)],
    retryCount: 1,
    startedAt: "2026-09-10T10:00:00.000Z",
    completedAt: "2026-09-10T10:00:05.000Z"
  });
  assert.equal(perfect.accepted, true, "canonical guided digit path must be accepted");
  assert.ok(perfect.result.score >= 90, "canonical guided path should score strongly");
  assert.equal(perfect.outcome?.assessed, true, "accepted trace must produce assessed outcome");
  assert.equal(perfect.outcome?.retryCount, 1, "trace retry evidence must be preserved");
  assert.equal(perfect.outcome?.metadata?.evidenceFidelity, "guided_trace_path_score");
  assert.ok(Number(perfect.outcome?.metadata?.coverage) >= 0.9, "trace metadata must carry measured coverage");

  const reversed = trace.measureLearningDigitTrace({
    digit: 5,
    strokes: [stroke([...target].reverse(), "reverse")]
  });
  assert.equal(reversed.accepted, false, "reversed trace must fail the direction-aware learning contract");
  assert.equal(reversed.outcome, null, "rejected trace must not manufacture mastery evidence");

  const offPath = trace.measureLearningDigitTrace({
    digit: 5,
    strokes: [stroke([{ x: 0.05, y: 0.95 }, { x: 0.95, y: 0.95 }], "off-path")]
  });
  assert.equal(offPath.accepted, false, "unrelated path must fail guided tracing");
  assert.equal(offPath.outcome, null);

  assert.throws(() => trace.measureLearningDigitTrace({ digit: 99, strokes: [stroke(target)] }), /Unsupported learning trace digit/);

  const bridgeSource = readFileSync(path.join(root, "src/components/learning/LearningAttemptBridge.tsx"), "utf8");
  assert.match(bridgeSource, /LEARNING_MEASUREMENT_EVENT/, "attempt bridge must consume explicit runtime measurements");
  assert.match(bridgeSource, /explicit \?\? measuredOutcome/, "explicit runtime measurement must take precedence over DOM inference");
  assert.doesNotMatch(bridgeSource, /resetCount \* 0\.1/, "trace accuracy must never be manufactured from reset count again");
  assert.match(bridgeSource, /completion-only instead of manufacturing accuracy/i, "unmeasured trace fallback must stay conservative");

  const audioFacadeSource = readFileSync(path.join(root, "src/lib/audio/feedback.ts"), "utf8");
  const audioManagerSource = readFileSync(path.join(root, "src/lib/audio/AudioManager.ts"), "utf8");
  assert.match(audioFacadeSource, /export function speakWithStatus/, "audio facade must expose visible speech start status");
  assert.match(audioManagerSource, /"unavailable"/, "AudioManager must identify unsupported speech devices");
  assert.match(audioFacadeSource, /export function stopSpeech/, "speech playback must remain cancellable through the facade");
  assert.match(audioFacadeSource, /audioManager\.speakPrompt/, "status-aware speech must delegate to the canonical AudioManager");

  const audioUi = readFileSync(path.join(root, "src/components/learning/AudioChoiceLearningActivity.tsx"), "utf8");
  assert.match(audioUi, /fallback \? \([\s\S]*?role="status"[\s\S]*?\{fallback\}/, "listening UI must render its fallback in a live status region");
  for (const status of ["muted", "unavailable", "error"]) {
    assert.match(audioUi, new RegExp(`status === "${status}"\\) return "[^"\\n]+"`), `${status} must have readable fallback copy`);
  }
  assert.match(audioUi, /speakPrompt/, "listening UI must use status-aware managed speech");
  assert.match(audioUi, /observeActivityEntrySpeech/, "listening UI must publish entry-latency evidence for automatic narration");
  assert.match(audioUi, /warmAudio\(lang\)/, "listening UI must warm the correct language on the first eligible gesture");
  assert.match(audioUi, /activity\?\.audioPrompt \?\? activity\?\.prompt/, "listening UI must prefer the audio-only prompt for speech");
  assert.match(audioUi, /title=\{visiblePrompt\}/, "listening UI must render only the visible instruction, never the audio target directly");
  assert.match(audioUi, /const heardPrompt = speechStatus === "spoken"/, "listening UI must track whether the prompt actually started speaking");
  assert.match(audioUi, /if \(!heardPrompt\) return;/, "a listening answer must be ignored until the child has heard the prompt");
  assert.match(audioUi, /disabled=\{!heardPrompt\}/, "listening choices must stay disabled until speech starts successfully");
  assert.doesNotMatch(audioUi, /Gunakan petunjuk teks di layar/, "audio failure must not fall back to a visible answer target");

  const listeningActivities = learningSystem.ACTIVITIES.filter((activity) => activity.runtime === "listen_and_choose");
  assert.ok(listeningActivities.length > 0, "catalog must contain listening activities");
  for (const activity of listeningActivities) {
    assert.ok(activity.audioPrompt?.trim(), `${activity.id} must retain an audio-only prompt`);
    assert.ok(activity.prompt?.trim(), `${activity.id} must retain a visible instruction`);
    assert.notEqual(activity.prompt, activity.audioPrompt, `${activity.id} visible instruction must not equal its spoken target`);
  }

  const visualColorExpectations = {
    "english-find-blue": { choices: ["🔴", "🔵", "🟢"], correct: "🔵" },
    "english-find-red": { choices: ["🔴", "🟢", "🟡"], correct: "🔴" },
    "english-find-green": { choices: ["🔵", "🟢", "🔴"], correct: "🟢" }
  };
  for (const [activityId, expected] of Object.entries(visualColorExpectations)) {
    const activity = learningSystem.getActivity(activityId);
    assert.ok(activity, `${activityId} must exist`);
    assert.deepEqual(activity.choices, expected.choices, `${activityId} must render actual color swatches/symbols rather than repeated color words`);
    assert.equal(activity.correctChoice, expected.correct);
    assert.ok(activity.choices.every((choice) => !/[A-Za-z]/.test(choice)), `${activityId} answer choices must be visual rather than written color labels`);
  }

  const shapeProperty = learningSystem.getActivity("math-shape-three-sides");
  assert.deepEqual(shapeProperty?.choices, ["●", "▲", "■"], "shape-property activity must ask the child to inspect shapes, not read shape names");
  assert.equal(shapeProperty?.correctChoice, "▲");

  const sizePattern = learningSystem.getActivity("math-pattern-size");
  assert.deepEqual(sizePattern?.choices, ["•", "⬤", "■"], "size pattern must be represented visually");
  assert.equal(sizePattern?.correctChoice, "•");

  const symbolHunts = learningSystem.ACTIVITIES.filter((activity) => activity.choicePresentation === "symbol_hunt");
  assert.ok(symbolHunts.length >= 20, "direct literacy catalog must expose a meaningful symbol-hunt family");
  for (const activity of symbolHunts) {
    assert.ok(["bahasa", "english", "letters"].includes(activity.subjectId), `${activity.id} symbol_hunt must stay inside literacy subjects`);
    assert.equal(activity.runtime, "tap_choice", `${activity.id} symbol_hunt keeps canonical tap-choice evidence`);
    assert.ok((activity.choices ?? []).length >= 3, `${activity.id} symbol_hunt needs at least three candidate symbols`);
    assert.ok((activity.choices ?? []).every((choice) => /^[A-Za-z]$/.test(choice)), `${activity.id} symbol_hunt choices must be single Latin letters`);
    assert.ok(activity.correctChoice && activity.choices.includes(activity.correctChoice), `${activity.id} symbol_hunt correct answer must remain canonical`);
  }
  assert.equal(learningSystem.getActivity("english-letter-a")?.choicePresentation, "symbol_hunt", "English direct letter recognition must use symbol hunt");
  assert.equal(learningSystem.getActivity("letters-find-upper-b")?.choicePresentation, "symbol_hunt", "Letters direct recognition must use symbol hunt");
  assert.notEqual(learningSystem.getActivity("math-count-3")?.choicePresentation, "symbol_hunt", "Math single-character answers must never be misclassified as literacy hunts");

  const symbolHuntUi = readFileSync(path.join(root, "src/components/learning/SymbolHuntChoiceActivity.tsx"), "utf8");
  const activityRoute = readFileSync(path.join(root, "src/app/child/[childId]/activity/[activity]/page.tsx"), "utf8");
  assert.match(symbolHuntUi, /data-symbol-hunt/, "symbol-hunt renderer must expose a stable QA hook");
  assert.match(symbolHuntUi, /completeActivity\(childId, activity\.id\)/, "correct hunt choice must complete the canonical activity");
  assert.match(symbolHuntUi, />\s*\{choice\}\s*<\/button>/, "choice button text must stay equal to the canonical choice so LearningAttemptBridge can measure accuracy");
  assert.match(activityRoute, /choicePresentation === "symbol_hunt"/, "activity route must dispatch symbol-hunt activities to the dedicated renderer");
  assert.match(activityRoute, /SymbolHuntChoiceActivity/, "activity route must import the dedicated symbol-hunt renderer");

  console.log("Learning runtime measurement, presentation semantics, symbol hunt, guided trace, and canonical AudioManager fallback tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
