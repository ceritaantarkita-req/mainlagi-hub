import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const gesture = await import("../.qa-dist/vision/gesture.js");

function foldedFinger(
  landmarks,
  [mcp, pip, dip, tip],
  x,
  baseY = 0.54
) {
  landmarks[mcp] = { x, y: baseY };
  landmarks[pip] = { x, y: baseY - 0.11 };
  landmarks[dip] = { x: x + 0.05, y: baseY - 0.06 };
  landmarks[tip] = { x: x + 0.02, y: baseY + 0.02 };
}

function thumbsUpLandmarks() {
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.6 }));
  landmarks[0] = { x: 0.5, y: 0.85 };
  landmarks[1] = { x: 0.44, y: 0.68 };
  landmarks[2] = { x: 0.44, y: 0.55 };
  landmarks[3] = { x: 0.44, y: 0.38 };
  landmarks[4] = { x: 0.44, y: 0.18 };
  foldedFinger(landmarks, [5, 6, 7, 8], 0.38);
  foldedFinger(landmarks, [9, 10, 11, 12], 0.5, 0.55);
  foldedFinger(landmarks, [13, 14, 15, 16], 0.6);
  foldedFinger(landmarks, [17, 18, 19, 20], 0.69);
  return landmarks;
}

test("thumbs-up is recognized when the thumb is vertical and fingers are folded", () => {
  const result = gesture.analyzeGesture(thumbsUpLandmarks());
  assert.equal(result.gesture, "thumbs-up");
  assert.equal(result.confidence >= 0.72, true);
});

test("folded hand without a raised thumb remains a fist", () => {
  const landmarks = thumbsUpLandmarks();
  landmarks[3] = { x: 0.46, y: 0.58 };
  landmarks[4] = { x: 0.49, y: 0.64 };
  const result = gesture.analyzeGesture(landmarks);
  assert.equal(result.gesture, "fist");
});
