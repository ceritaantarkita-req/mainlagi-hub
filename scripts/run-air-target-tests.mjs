import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const airTarget = await import("../.qa-dist/interaction/air-target.js");
const relativeMapper = await import(
  "../.qa-dist/interaction/relative-hand-mapper.js"
);

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

test("relative mapper anchors the first camera sample without jumping", () => {
  const mapper = new relativeMapper.RelativeHandMapper();
  const first = mapper.update({ x: 0.9, y: 0.1 }, 100);
  assert.equal(first.x, 0.5);
  assert.equal(first.y, 0.52);
});

test("relative mapper turns comfortable hand movement into larger canvas travel", () => {
  const mapper = new relativeMapper.RelativeHandMapper({
    gainX: 2,
    gainY: 2,
    deadZone: 0
  });
  mapper.update({ x: 0.5, y: 0.5 }, 100);
  const moved = mapper.update({ x: 0.53, y: 0.48 }, 133);
  assert.equal(moved.x > 0.55, true);
  assert.equal(moved.y < 0.49, true);
});

test("relative mapper suppresses tiny involuntary hand jitter", () => {
  const mapper = new relativeMapper.RelativeHandMapper({ deadZone: 0.003 });
  mapper.update({ x: 0.5, y: 0.5 }, 100);
  const moved = mapper.update({ x: 0.501, y: 0.498 }, 133);
  assert.equal(moved.x, 0.5);
  assert.equal(moved.y, 0.52);
});

test("relative mapper clamps tracking spikes and canvas boundaries", () => {
  const mapper = new relativeMapper.RelativeHandMapper({
    gainX: 4,
    gainY: 4,
    deadZone: 0,
    maxRawStep: 0.04
  });
  mapper.update({ x: 0.5, y: 0.5 }, 100);
  const moved = mapper.update({ x: 1, y: 1 }, 133);
  assert.equal(moved.x <= 0.66, true);
  assert.equal(moved.y <= 0.68, true);

  let current = moved;
  for (let index = 0; index < 20; index += 1) {
    current = mapper.update(
      { x: 1 + index * 0.04, y: 1 + index * 0.04 },
      166 + index * 33
    );
  }
  assert.equal(current.x <= 0.955, true);
  assert.equal(current.y <= 0.945, true);
});

test("relative mapper re-anchors after tracking is lost", () => {
  const mapper = new relativeMapper.RelativeHandMapper({ maxGapMs: 250 });
  mapper.update({ x: 0.5, y: 0.5 }, 100);
  const moved = mapper.update({ x: 0.54, y: 0.5 }, 133);
  const reacquired = mapper.update({ x: 0.1, y: 0.9 }, 1000);
  assert.equal(reacquired.x, moved.x);
  assert.equal(reacquired.y, moved.y);
});
