import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const airTarget = await import("../.qa-dist/interaction/air-target.js");

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
