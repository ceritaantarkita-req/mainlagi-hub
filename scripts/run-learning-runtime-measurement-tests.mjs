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

  const audioSource = readFileSync(path.join(root, "src/lib/audio/feedback.ts"), "utf8");
  assert.match(audioSource, /export function speakWithStatus/, "audio layer must expose visible speech start status");
  assert.match(audioSource, /"unavailable"/, "audio layer must identify unsupported speech devices");
  assert.match(audioSource, /export function stopSpeech/, "speech playback must be cancellable");

  const audioUi = readFileSync(path.join(root, "src/components/learning/AudioChoiceLearningActivity.tsx"), "utf8");
  assert.match(audioUi, /Audio fallback:/, "listening UI must expose a readable audio fallback");
  assert.match(audioUi, /speakWithStatus/, "listening UI must use status-aware speech");

  console.log("Learning runtime measurement, guided trace, and audio fallback tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
