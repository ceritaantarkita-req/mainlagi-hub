import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const tracing = await import("../.qa-dist/tracing/guided.js");

function stroke(id, points) {
  return { id, points, startedAt: 0, endedAt: points.length };
}

function line(startX, endX, y, count = 41) {
  return Array.from({ length: count }, (_, index) => ({
    x: startX + ((endX - startX) * index) / (count - 1),
    y
  }));
}

const horizontalTarget = line(0.1, 0.9, 0.3);

const closedSquare = [
  { x: 0.2, y: 0.2 },
  { x: 0.8, y: 0.2 },
  { x: 0.8, y: 0.8 },
  { x: 0.2, y: 0.8 },
  { x: 0.2, y: 0.2 }
];

test("guided tracing accepts a complete forward path", () => {
  const result = tracing.evaluateGuidedTrace(
    [stroke("forward", horizontalTarget)],
    horizontalTarget,
    { requireDirection: true, minCoverage: 0.8 }
  );
  assert.equal(result.accepted, true, result.reason);
  assert.equal(result.coverage, 1);
  assert.equal(result.directionValid, true);
});

test("guided tracing rejects a reversed path when direction is required", () => {
  const result = tracing.evaluateGuidedTrace(
    [stroke("reverse", [...horizontalTarget].reverse())],
    horizontalTarget,
    { requireDirection: true, minCoverage: 0.8 }
  );
  assert.equal(result.accepted, false);
  assert.equal(result.directionValid, false);
  assert.match(result.reason ?? "", /arah|titik awal/i);
});

test("guided tracing rejects a path far outside the target corridor", () => {
  const result = tracing.evaluateGuidedTrace(
    [stroke("off-path", line(0.1, 0.9, 0.65))],
    horizontalTarget,
    { corridor: 0.06 }
  );
  assert.equal(result.accepted, false);
  assert.equal(result.coverage < 0.2, true);
  assert.equal(result.offPathRatio > 0.8, true);
});

test("separate strokes do not create an imaginary bridge", () => {
  const result = tracing.evaluateGuidedTrace(
    [
      stroke("left", line(0.1, 0.26, 0.3, 12)),
      stroke("right", line(0.74, 0.9, 0.3, 12))
    ],
    horizontalTarget,
    { corridor: 0.045, minCoverage: 0.72 }
  );
  assert.equal(result.accepted, false);
  assert.equal(result.coverage < 0.65, true);
});

test("closed shape passes explicit closure validation", () => {
  const result = tracing.evaluateGuidedTrace(
    [stroke("square", closedSquare)],
    closedSquare,
    {
      requireClosure: true,
      closureThreshold: 0.14,
      minCoverage: 0.75
    }
  );
  assert.equal(result.accepted, true, result.reason);
  assert.equal(result.closureValid, true);
});

test("open shape fails explicit closure validation", () => {
  const openSquare = closedSquare.slice(0, -1);
  const result = tracing.evaluateGuidedTrace(
    [stroke("open-square", openSquare)],
    closedSquare,
    {
      requireClosure: true,
      closureThreshold: 0.14,
      minCoverage: 0.6
    }
  );
  assert.equal(result.accepted, false);
  assert.equal(result.closureValid, false);
  assert.match(result.reason ?? "", /sambungkan/i);
});
