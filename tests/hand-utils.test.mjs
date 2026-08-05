import test from "node:test";
import assert from "node:assert/strict";
import { assignPlayer, isIndexWritingPose, isOpenPalm, mirroredPoint, smoothPoint, toPlayerLocalPoint } from "../.qa-dist/vision/hand-utils.js";

/**
 * Build a 21-point hand. Named fingers are straight (collinear joints, so the
 * knuckle angles are ~180 degrees); the rest are curled back on themselves.
 */
function makeHand({ index = false, middle = false, ring = false, pinky = false, thumb = false } = {}) {
  const points = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  points[0] = { x: 0.5, y: 0.72, z: 0 };
  points[9] = { x: 0.5, y: 0.6, z: 0 };
  const fingers = {
    thumb: { joints: [1, 2, 3, 4], dx: -0.09, on: thumb },
    index: { joints: [5, 6, 7, 8], dx: -0.035, on: index },
    middle: { joints: [9, 10, 11, 12], dx: 0, on: middle },
    ring: { joints: [13, 14, 15, 16], dx: 0.035, on: ring },
    pinky: { joints: [17, 18, 19, 20], dx: 0.07, on: pinky }
  };
  for (const { joints, dx, on } of Object.values(fingers)) {
    joints.forEach((joint, step) => {
      const offset = on ? step * 0.055 : (step < 2 ? step * 0.05 : (3 - step) * 0.05 + 0.02);
      points[joint] = { x: 0.5 + dx, y: 0.6 - offset, z: 0 };
    });
  }
  // Keep the thumb clear of the index tip so this never reads as a pinch.
  if (!thumb) points[4] = { x: 0.5 - 0.16, y: 0.62, z: 0 };
  return points;
}

function baseHand() {
  return makeHand();
}

test("mirror conversion and split-screen dead zone are consistent", () => {
  const point = mirroredPoint({ x: 0.2, y: 0.4, z: 0 });
  assert.equal(point.x, 0.8);
  assert.equal(point.y, 0.4);
  assert.equal(assignPlayer({ x: 0.2, y: 0.5 }, false), "A");
  assert.equal(assignPlayer({ x: 0.8, y: 0.5 }, false), "B");
  assert.equal(assignPlayer({ x: 0.5, y: 0.5 }, false), null);
  // A 12% dead band: a hand at 0.47 belongs to nobody rather than flickering into A.
  assert.equal(assignPlayer({ x: 0.47, y: 0.5 }, false), null);
  assert.equal(assignPlayer({ x: 0.8, y: 0.5 }, true), "A");

  const playerA = toPlayerLocalPoint({ x: 0.22, y: 0.4 }, "A", false);
  const playerB = toPlayerLocalPoint({ x: 0.78, y: 0.4 }, "B", false);
  assert.ok(Math.abs(playerA.x - 0.5) < 1e-9);
  assert.ok(Math.abs(playerB.x - 0.5) < 1e-9);
  assert.equal(playerA.y, 0.4);
  assert.equal(playerB.y, 0.4);
});

test("writing pose requires index extended and remaining fingers folded", () => {
  assert.equal(isIndexWritingPose(makeHand({ index: true })), true);
  assert.equal(isIndexWritingPose(makeHand({ index: true, middle: true })), false,
    "a peace sign must not count as writing");
  assert.equal(isIndexWritingPose(makeHand({})), false);
});

test("writing pose survives the hand being rotated", () => {
  // The old test compared raw y values, so tilting the hand made the index
  // finger read as folded and writing stopped mid-digit.
  const upright = makeHand({ index: true });
  const rotate = (points, degrees) => {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return points.map((point) => {
      const x = point.x - 0.5;
      const y = point.y - 0.5;
      return { x: 0.5 + x * cos - y * sin, y: 0.5 + x * sin + y * cos, z: 0 };
    });
  };
  for (const angle of [-70, -35, 35, 70]) {
    assert.equal(isIndexWritingPose(rotate(upright, angle)), true,
      `pointing must still be detected at ${angle} degrees`);
  }
});

test("open palm is detected from all four fingers extended", () => {
  assert.equal(isOpenPalm(makeHand({ index: true, middle: true, ring: true, pinky: true })), true);
  assert.equal(isOpenPalm(makeHand({ index: true })), false);
});

test("smoothing eases toward the new point", () => {
  const smoothed = smoothPoint({ x: 0, y: 0, t: 0 }, { x: 1, y: 1, t: 10 }, 0.5);
  assert.equal(smoothed.x, 0.5);
  assert.equal(smoothed.y, 0.5);
  assert.equal(smoothed.t, 10);
  assert.deepEqual(smoothPoint(null, { x: 0.3, y: 0.4, t: 5 }), { x: 0.3, y: 0.4, t: 5 });
});
