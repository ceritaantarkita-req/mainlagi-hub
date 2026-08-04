import test from "node:test";
import assert from "node:assert/strict";
import { assignPlayer, isIndexWritingPose, isOpenPalm, mirroredPoint, smoothPoint } from "../.qa-dist/vision/hand-utils.js";

function baseHand() {
  return Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
}

test("mirror conversion and split-screen dead zone are consistent", () => {
  const point = mirroredPoint({ x: 0.2, y: 0.4, z: 0 });
  assert.equal(point.x, 0.8);
  assert.equal(point.y, 0.4);
  assert.equal(assignPlayer({ x: 0.2, y: 0.5 }, false), "A");
  assert.equal(assignPlayer({ x: 0.8, y: 0.5 }, false), "B");
  assert.equal(assignPlayer({ x: 0.5, y: 0.5 }, false), null);
  assert.equal(assignPlayer({ x: 0.8, y: 0.5 }, true), "A");
});

test("writing pose requires index extended and remaining fingers folded", () => {
  const hand = baseHand();
  hand[8].y = 0.2; hand[6].y = 0.4;
  hand[12].y = 0.7; hand[10].y = 0.5;
  hand[16].y = 0.7; hand[14].y = 0.5;
  hand[20].y = 0.7; hand[18].y = 0.5;
  assert.equal(isIndexWritingPose(hand), true);
  hand[12].y = 0.2;
  assert.equal(isIndexWritingPose(hand), false);
});

test("open palm and smoothing behave predictably", () => {
  const hand = baseHand();
  for (const tip of [8, 12, 16, 20]) {
    hand[tip].y = 0.2;
    hand[tip - 2].y = 0.5;
  }
  assert.equal(isOpenPalm(hand), true);
  const smoothed = smoothPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 0.5);
  assert.equal(smoothed.x, 0.5);
  assert.equal(smoothed.y, 0.5);
});
