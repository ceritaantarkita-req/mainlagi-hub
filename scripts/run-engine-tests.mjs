import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();

const math = await import("../.qa-dist/engine/math.js");
const random = await import("../.qa-dist/engine/random.js");
const countdown = await import("../.qa-dist/engine/countdown.js");
const stroke = await import("../.qa-dist/engine/stroke.js");
const body = await import("../.qa-dist/engine/body.js");
const digit = await import("../.qa-dist/engine/digit.js");
const templates = await import("../.qa-dist/engine/templates.js");
const hijaiyah = await import("../.qa-dist/engine/hijaiyah.js");
const geometry = await import("../.qa-dist/engine/geometry.js");
const gesture = await import("../.qa-dist/vision/gesture.js");
const assignment = await import("../.qa-dist/vision/player-assignment.js");
const smoothing = await import("../.qa-dist/vision/smoothing.js");

for (const level of ["tk", "sd1", "sd2"]) {
  test(`math constraints ${level}`, () => {
    const rng = random.createRandom(0xabc123);
    for (let index = 0; index < 10000; index += 1) {
      const question = math.createMathQuestion(rng, level);
      assert.deepEqual(math.validateMathQuestion(question, level), []);
    }
  });
}

test("pattern generation stays integer", () => {
  const rng = random.createRandom(91);
  for (const level of ["tk", "sd1", "sd2"]) {
    for (let index = 0; index < 5000; index += 1) {
      const question = math.createPatternQuestion(rng, level);
      assert.equal(Number.isInteger(question.answer), true);
    }
  }
});

test("countdown is monotonic and terminates", () => {
  const start = 1000;
  assert.equal(countdown.countdownValue(start, 1000), 3);
  assert.equal(countdown.countdownValue(start, 2000), 2);
  assert.equal(countdown.countdownValue(start, 3000), 1);
  assert.equal(countdown.countdownValue(start, 4000), "GO");
  assert.equal(countdown.countdownValue(start, 5001), null);
});

test("multi-stroke lifecycle keeps separate strokes", () => {
  let glyph = stroke.emptyGlyph();
  glyph = stroke.beginStroke(glyph, { x: 0.1, y: 0.1 }, 1, "a");
  glyph = stroke.appendPoint(glyph, { x: 0.2, y: 0.2 }, 2);
  glyph = stroke.endStroke(glyph, 3);
  glyph = stroke.beginStroke(glyph, { x: 0.7, y: 0.2 }, 4, "b");
  glyph = stroke.appendPoint(glyph, { x: 0.72, y: 0.21 }, 5);
  assert.equal(glyph.strokes.length, 2);
  assert.equal(stroke.usableStrokes(glyph).length, 2);
});

test("expected digit verification accepts canonical templates", () => {
  for (let value = 0; value <= 9; value += 1) {
    const points = templates.DIGIT_TEMPLATES[value][0];
    const result = digit.verifyExpectedDigit(
      [{ id: "x", points, startedAt: 0, endedAt: 1 }],
      value
    );
    assert.equal(result.accepted, true, `digit ${value}`);
  }
});

test("body classifier distinguishes actions", () => {
  const baseline = { centerX: 0.5, hipY: 0.58, torsoScale: 1 };
  assert.equal(
    body.classifyBodyAction(
      { centerX: 0.3, hipY: 0.58, torsoScale: 1, kneeCompression: 0 },
      baseline
    ),
    "left"
  );
  assert.equal(
    body.classifyBodyAction(
      { centerX: 0.5, hipY: 0.45, torsoScale: 1, kneeCompression: 0 },
      baseline
    ),
    "jump"
  );
  assert.equal(
    body.classifyBodyAction(
      { centerX: 0.5, hipY: 0.7, torsoScale: 1, kneeCompression: 0.3 },
      baseline
    ),
    "crouch"
  );
  assert.equal(
    body.classifyBodyAction(
      { centerX: 0.5, hipY: 0.58, torsoScale: 1.3, kneeCompression: 0 },
      baseline
    ),
    "forward"
  );
});

test("gesture latch removes one-frame chatter", () => {
  const latch = new gesture.GestureLatch(3, 2);
  assert.equal(latch.update("pinch"), "unknown");
  assert.equal(latch.update("pinch"), "unknown");
  assert.equal(latch.update("pinch"), "pinch");
  assert.equal(latch.update("unknown"), "pinch");
  assert.equal(latch.update("unknown"), "unknown");
});

test("hijaiyah library has 14 unique MVP letters", () => {
  const letters = hijaiyah.HIJAIYAH_TEMPLATES.map((item) => item.letter);
  assert.equal(letters.length, 14);
  assert.equal(new Set(letters).size, 14);
});

test("single-point strokes remain available for Hijaiyah dots", () => {
  let glyph = stroke.emptyGlyph();
  glyph = stroke.beginStroke(glyph, { x: 0.5, y: 0.2 }, 1, "dot");
  glyph = stroke.endStroke(glyph, 2);
  assert.equal(stroke.usableStrokes(glyph).length, 1);
  assert.equal(stroke.usableStrokes(glyph)[0].points.length, 1);
});

test("body player slots survive MediaPipe detection-order changes", () => {
  const createBody = (mirroredX) => {
    const rawX = 1 - mirroredX;
    const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
    landmarks[11] = { x: rawX - 0.03, y: 0.3 };
    landmarks[12] = { x: rawX + 0.03, y: 0.3 };
    landmarks[23] = { x: rawX - 0.02, y: 0.6 };
    landmarks[24] = { x: rawX + 0.02, y: 0.6 };
    return landmarks;
  };
  const tracker = new assignment.BodySlotTracker();
  const first = tracker.update([createBody(0.25), createBody(0.75)], 2);
  assert.equal(first.find((item) => item.player === "A").center.x < 0.5, true);
  assert.equal(first.find((item) => item.player === "B").center.x > 0.5, true);
  const reordered = tracker.update([createBody(0.72), createBody(0.28)], 2);
  assert.equal(
    reordered.find((item) => item.player === "A").center.x < 0.5,
    true
  );
  assert.equal(
    reordered.find((item) => item.player === "B").center.x > 0.5,
    true
  );
});

test("canonical Hijaiyah templates pass body and dot validation", () => {
  for (const template of hijaiyah.HIJAIYAH_TEMPLATES) {
    const box = geometry.bounds(template.body);
    const dotY =
      template.dotZone === "above"
        ? Math.max(0.02, box.minY - 0.08)
        : Math.min(0.98, box.maxY + 0.08);
    const dots = Array.from({ length: template.dots }, (_, index) => ({
      id: `dot-${index}`,
      points: [{ x: 0.42 + index * 0.07, y: dotY }],
      startedAt: index + 2,
      endedAt: index + 2
    }));
    const result = hijaiyah.evaluateHijaiyah(
      [
        { id: "body", points: template.body, startedAt: 0, endedAt: 1 },
        ...dots
      ],
      template
    );
    assert.equal(
      result.accepted,
      true,
      `${template.letter}: ${result.reason ?? result.score}`
    );
  }
});

test("One Euro filtering reduces stationary cursor jitter", () => {
  const filter = new smoothing.OneEuroFilter({
    minCutoff: 1,
    beta: 0,
    derivativeCutoff: 1
  });
  const input = [0.5, 0.54, 0.46, 0.53, 0.47, 0.52, 0.48, 0.5];
  const output = input.map((value, index) => filter.filter(value, index * 33));
  const inputError = input.reduce((sum, value) => sum + Math.abs(value - 0.5), 0);
  const outputError = output.reduce(
    (sum, value) => sum + Math.abs(value - 0.5),
    0
  );
  assert.equal(outputError < inputError, true);
});

test("One Euro filtering resets after a long tracking gap", () => {
  const filter = new smoothing.OneEuroFilter({ maxGapMs: 300 });
  filter.filter(0.2, 0);
  filter.filter(0.22, 33);
  assert.equal(filter.filter(0.9, 1000), 0.9);
});

test("landmark smoothing preserves landmark metadata", () => {
  const smoother = new smoothing.LandmarkSmoother({
    minCutoff: 1,
    beta: 0
  });
  const first = smoother.update(
    [{ x: 0.4, y: 0.5, z: -0.1, visibility: 0.91 }],
    0
  );
  const second = smoother.update(
    [{ x: 0.44, y: 0.46, z: -0.08, visibility: 0.87 }],
    33
  );
  assert.equal(first.length, 1);
  assert.equal(second[0].visibility, 0.87);
  assert.equal(second[0].x > 0.4 && second[0].x < 0.44, true);
});
