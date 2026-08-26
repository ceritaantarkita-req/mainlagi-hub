import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const airTarget = await import("../.qa-dist/interaction/air-target.js");
const penMapper = await import("../.qa-dist/interaction/pen-mapper.js");

const targets = [
  { id: "milk", left: 100, top: 100, right: 220, bottom: 220 },
  { id: "bread", left: 300, top: 100, right: 420, bottom: 220 }
];

test("air cursor prefers a target containing the pointer", () => {
  const match = airTarget.pickMagneticTarget(160, 160, targets, 80);
  assert.equal(match?.id, "milk");
  assert.equal(match?.inside, true);
  assert.equal(match?.distance, 0);
});

test("air cursor magnetically acquires a nearby large target", () => {
  const match = airTarget.pickMagneticTarget(250, 160, targets, 40);
  assert.equal(match?.id, "milk");
  assert.equal(match?.inside, false);
  assert.equal(match?.distance, 30);
  assert.equal(match?.snappedX < 250, true);
});

test("air cursor ignores targets outside the magnetic radius", () => {
  const match = airTarget.pickMagneticTarget(10, 10, targets, 40);
  assert.equal(match, null);
});

test("dwell requires a stable hold before selecting", () => {
  const dwell = new airTarget.DwellSelector(900, 300);
  assert.deepEqual(dwell.update("milk", 0), {
    targetId: "milk",
    progress: 0,
    selected: null
  });
  assert.equal(dwell.update("milk", 450).progress, 0.5);
  assert.equal(dwell.update("milk", 899).selected, null);
  assert.equal(dwell.update("milk", 900).selected, "milk");
});

test("selected target cannot repeat until the cursor exits", () => {
  const dwell = new airTarget.DwellSelector(100, 50);
  dwell.update("milk", 0);
  assert.equal(dwell.update("milk", 100).selected, "milk");
  assert.equal(dwell.update("milk", 500).selected, null);
  dwell.update(null, 510);
  dwell.update("milk", 520);
  assert.equal(dwell.update("milk", 620).selected, "milk");
});

test("moving to another target releases the previous target lock", () => {
  const dwell = new airTarget.DwellSelector(100, 50);
  dwell.update("milk", 0);
  assert.equal(dwell.update("milk", 100).selected, "milk");
  dwell.update("bread", 200);
  assert.equal(dwell.update("bread", 300).selected, "bread");
});

test("pen mapper places the first sample in the middle of the canvas", () => {
  const mapper = new penMapper.PenMapper();
  const first = mapper.update({ x: 0.9, y: 0.1 }, 100);
  assert.equal(Math.abs(first.x - 0.5) < 0.001, true);
  assert.equal(Math.abs(first.y - 0.5) < 0.001, true);
});

test("pen mapper is absolute: returning the hand returns the pen", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, 67);
  mapper.lock();
  const origin = mapper.update({ x: 0.5, y: 0.5 }, 100);
  mapper.update({ x: 0.54, y: 0.47 }, 133);
  mapper.update({ x: 0.57, y: 0.51 }, 166);
  mapper.update({ x: 0.53, y: 0.5 }, 200);
  const back = mapper.update({ x: 0.5, y: 0.5 }, 233);
  // Absolute mapping means no accumulated drift: the pen lands back where it
  // started. The old relative mapper integrated velocity and never did.
  assert.equal(Math.abs(back.x - origin.x) < 0.02, true);
  assert.equal(Math.abs(back.y - origin.y) < 0.02, true);
});

test("pen mapper does not drift under sustained jitter", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, -33);
  mapper.lock();
  const start = mapper.update({ x: 0.5, y: 0.5 }, 0);
  let time = 0;
  for (let index = 0; index < 400; index += 1) {
    time += 33;
    const wobble = Math.sin(index) * 0.004;
    mapper.update({ x: 0.5 + wobble, y: 0.5 - wobble }, time);
  }
  const end = mapper.update({ x: 0.5, y: 0.5 }, time + 33);
  assert.equal(Math.abs(end.x - start.x) < 0.03, true);
  assert.equal(Math.abs(end.y - start.y) < 0.03, true);
});

test("pen mapper expands its box when the player reaches further", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, 0);
  const before = mapper.reach();
  mapper.update({ x: 0.54, y: 0.5 }, 33);
  mapper.update({ x: 0.58, y: 0.5 }, 66);
  mapper.update({ x: 0.62, y: 0.5 }, 99);
  mapper.update({ x: 0.68, y: 0.5 }, 132);
  const after = mapper.reach();
  assert.equal(after.width >= before.width, true);
});

test("pen mapper rejects single-frame tracking teleports", () => {
  const mapper = new penMapper.PenMapper({ maxJumpPerFrame: 0.05 });
  mapper.update({ x: 0.5, y: 0.5 }, 0);
  const held = mapper.update({ x: 0.52, y: 0.5 }, 33);
  const spiked = mapper.update({ x: 0.95, y: 0.5 }, 66);
  assert.equal(Math.abs(spiked.x - held.x) < 0.05, true);
});

test("pen mapper keeps the cursor inside the canvas margins", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, 0);
  let time = 0;
  let current = null;
  for (let index = 0; index < 40; index += 1) {
    time += 33;
    current = mapper.update({ x: 0.5 + index * 0.02, y: 0.5 + index * 0.02 }, time);
  }
  assert.equal(current.x <= 0.97, true);
  assert.equal(current.y <= 0.96, true);
  assert.equal(current.x >= 0.03, true);
});

test("pen mapper recenter clears the learned reach", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, 0);
  mapper.update({ x: 0.8, y: 0.5 }, 33);
  mapper.recenter(66);
  assert.equal(mapper.reach(), null);
});

test("pen mapper freezes the reference box while the pen is down", () => {
  const mapper = new penMapper.PenMapper();
  mapper.update({ x: 0.5, y: 0.5 }, 0);
  mapper.lock();
  const before = mapper.reach();
  for (let index = 1; index <= 8; index += 1) {
    mapper.update({ x: 0.5 + index * 0.05, y: 0.5 }, index * 33);
  }
  const during = mapper.reach();
  assert.equal(during.width, before.width);
  mapper.unlock();
  for (let index = 9; index <= 12; index += 1) {
    mapper.update({ x: 0.5 + index * 0.05, y: 0.5 }, index * 33);
  }
  assert.equal(mapper.reach().width > before.width, true);
});
