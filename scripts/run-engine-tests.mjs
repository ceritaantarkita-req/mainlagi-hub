import test from "node:test";
import assert from "node:assert/strict";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();

const math = await import("../.qa-dist/engine/math.js");
const choices = await import("../.qa-dist/engine/choices.js");
const random = await import("../.qa-dist/engine/random.js");
const countdown = await import("../.qa-dist/engine/countdown.js");
const stroke = await import("../.qa-dist/engine/stroke.js");
const body = await import("../.qa-dist/engine/body.js");
const digit = await import("../.qa-dist/engine/digit.js");
const templates = await import("../.qa-dist/engine/templates.js");
const hijaiyah = await import("../.qa-dist/engine/hijaiyah.js");
const geometry = await import("../.qa-dist/engine/geometry.js");
const multiDigit = await import("../.qa-dist/engine/multi-digit.js");
const features = await import("../.qa-dist/engine/features.js");
const pointcloud = await import("../.qa-dist/engine/pointcloud.js");
const gesture = await import("../.qa-dist/vision/gesture.js");
const assignment = await import("../.qa-dist/vision/player-assignment.js");
const smoothing = await import("../.qa-dist/vision/smoothing.js");
const faceAnalysis = await import("../.qa-dist/vision/face-analysis.js");
const lanes = await import("../.qa-dist/engine/lanes.js");
const ranking = await import("../.qa-dist/engine/ranking.js");

for (const level of ["tk", "sd1", "sd2"]) {
  test(`math constraints ${level}`, () => {
    const rng = random.createRandom(0xabc123);
    for (let index = 0; index < 10000; index += 1) {
      const question = math.createMathQuestion(rng, level);
      assert.deepEqual(math.validateMathQuestion(question, level), []);
    }
  });
}

test("multiple-choice options are always valid and solvable", () => {
  const rng = random.createRandom(0x5150);
  for (const level of ["tk", "sd1", "sd2"]) {
    const ceiling = level === "tk" ? 10 : level === "sd1" ? 30 : 100;
    for (let index = 0; index < 5000; index += 1) {
      const question = math.createMathQuestion(rng, level);
      const set = choices.buildChoices(rng, question, level, 4);
      assert.equal(set.options.length, 4, "wrong option count");
      assert.equal(
        new Set(set.options).size,
        4,
        `duplicate options ${set.options} for ${question.prompt}`
      );
      assert.equal(
        set.options.filter((value) => value === question.answer).length,
        1,
        `answer ${question.answer} not present exactly once in ${set.options}`
      );
      for (const value of set.options) {
        assert.equal(Number.isInteger(value), true, `${value} not an integer`);
        assert.equal(value >= 0, true, `${value} is negative`);
        assert.equal(value <= ceiling, true, `${value} exceeds ${level} ceiling`);
      }
    }
  }
});

test("the correct option is not biased towards one box", () => {
  // A child spots "it is always the second one" quickly, and then stops doing
  // any arithmetic at all.
  const rng = random.createRandom(0x9001);
  const positions = [0, 0, 0, 0];
  for (let index = 0; index < 4000; index += 1) {
    const question = math.createMathQuestion(rng, "sd1");
    const set = choices.buildChoices(rng, question, "sd1", 4);
    positions[set.options.indexOf(question.answer)] += 1;
  }
  for (const count of positions) {
    assert.equal(
      count > 4000 / 4 * 0.8 && count < 4000 / 4 * 1.2,
      true,
      `answer position distribution is skewed: ${positions}`
    );
  }
});

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

test("gesture latch debounces non-drawing gestures", () => {
  const latch = new gesture.GestureLatch(3, 2, 3);
  assert.equal(latch.update("open"), "unknown");
  assert.equal(latch.update("open"), "unknown");
  assert.equal(latch.update("open"), "open");
  assert.equal(latch.update("unknown"), "open");
  assert.equal(latch.update("unknown"), "unknown");
});

test("gesture latch lets a pinch start immediately", () => {
  // MotionPad keeps a pre-pinch ring buffer and stitches those samples into
  // the stroke, so pen-down can be optimistic. Waiting three frames used to
  // clip the first ~100 ms off every character.
  const latch = new gesture.GestureLatch();
  assert.equal(latch.update("pinch"), "pinch");
});

test("pinch classification uses hysteresis, not one threshold", () => {
  const palm = [{ x: 0.5, y: 0.8 }];
  const build = (tipGap) => {
    const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    landmarks[0] = { x: 0.5, y: 0.8, z: 0 };
    landmarks[9] = { x: 0.5, y: 0.5, z: 0 };
    landmarks[4] = { x: 0.5, y: 0.5, z: 0 };
    landmarks[8] = { x: 0.5 + tipGap, y: 0.5, z: 0 };
    return landmarks;
  };
  void palm;
  // A gap inside the hysteresis band keeps whichever state it was already in.
  const gap = 0.3 * 0.48;
  assert.equal(gesture.analyzeGesture(build(gap), true).gesture, "pinch");
  assert.equal(gesture.analyzeGesture(build(gap), false).gesture !== "pinch", true);
});

test("a held gesture survives a dropped frame", () => {
  // The reported "open palm sometimes does nothing": a single misclassified
  // frame used to reset the hold timer to zero, and at 25fps over 500ms a
  // dropout is likely rather than rare.
  const hold = new gesture.GestureHold(500, 220, 1200);
  let now = 0;
  const step = (active, ms = 40) => {
    now += ms;
    return hold.update(active, now);
  };
  assert.equal(step(true), false); // 40
  assert.equal(step(true), false); // 80
  assert.equal(step(false), false); // 120 - classifier blips
  assert.equal(step(true), false); // 160 - and recovers
  assert.equal(step(true), false); // 200
  for (let index = 0; index < 7; index += 1) step(true);
  // 480..? keep going until past the 500ms mark measured from t=40
  let fired = false;
  for (let index = 0; index < 5 && !fired; index += 1) fired = step(true);
  assert.equal(fired, true, "hold never completed despite a sustained gesture");
});

test("a genuinely released gesture abandons the hold", () => {
  const hold = new gesture.GestureHold(500, 220, 1200);
  let now = 0;
  hold.update(true, (now += 40));
  hold.update(true, (now += 40));
  // Released for longer than the grace window.
  for (let index = 0; index < 10; index += 1) hold.update(false, (now += 40));
  // Re-holding has to start the clock over, not resume near completion.
  let fired = false;
  for (let index = 0; index < 8; index += 1) {
    fired = hold.update(true, (now += 40)) || fired;
  }
  assert.equal(fired, false, "hold completed too early after a real release");
});

test("one long hold fires exactly once", () => {
  const hold = new gesture.GestureHold(500, 220, 1200);
  let now = 0;
  let fires = 0;
  for (let index = 0; index < 30; index += 1) {
    if (hold.update(true, (now += 40))) fires += 1;
  }
  assert.equal(fires, 1, `fired ${fires} times over one continuous hold`);
});

test("an open palm still registers with one finger not fully straight", () => {
  // A child's ring finger rarely reaches the straightness threshold.
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  landmarks[0] = { x: 0.5, y: 0.9, z: 0 };
  landmarks[9] = { x: 0.5, y: 0.6, z: 0 };
  // Thumb well away from the index tip so this is not read as a pinch.
  landmarks[4] = { x: 0.2, y: 0.6, z: 0 };
  const straighten = (joints, x) => {
    const [mcp, pip, dip, tip] = joints;
    landmarks[mcp] = { x, y: 0.6, z: 0 };
    landmarks[pip] = { x, y: 0.45, z: 0 };
    landmarks[dip] = { x, y: 0.3, z: 0 };
    landmarks[tip] = { x, y: 0.15, z: 0 };
  };
  straighten([5, 6, 7, 8], 0.44);
  straighten([9, 10, 11, 12], 0.5);
  straighten([13, 14, 15, 16], 0.56);
  // Pinky left curled.
  landmarks[17] = { x: 0.62, y: 0.6, z: 0 };
  landmarks[18] = { x: 0.64, y: 0.55, z: 0 };
  landmarks[19] = { x: 0.62, y: 0.56, z: 0 };
  landmarks[20] = { x: 0.6, y: 0.6, z: 0 };
  assert.equal(gesture.analyzeGesture(landmarks, false).gesture, "open");
});

test("a visible hand is never assigned to nobody", () => {
  // The two-player dead band: a parent and child share one camera and their
  // hands meet in the middle of the frame, which used to mean the hand was
  // dropped and the pen died mid-stroke.
  const hand = {
    id: "hand-0",
    landmarks: Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5 })),
    point: { x: 0.5, y: 0.5 }
  };
  for (const bodies of [[], undefined]) {
    const player = assignment.assignHandToPlayer(hand, bodies ?? [], 2);
    assert.equal(player === "A" || player === "B", true, `got ${player}`);
  }
  for (let x = 0.4; x <= 0.6; x += 0.01) {
    const player = assignment.assignHandToPlayer(
      { ...hand, point: { x, y: 0.5 } },
      [],
      2
    );
    assert.equal(player === "A" || player === "B", true, `x=${x} gave ${player}`);
  }
});

test("hands still follow their own body when both players are tracked", () => {
  const makeBody = (player, mirroredX, wristX) => {
    const landmarks = Array.from({ length: 33 }, () => ({ x: 1 - mirroredX, y: 0.5 }));
    landmarks[15] = { x: wristX, y: 0.5 };
    landmarks[16] = { x: wristX, y: 0.5 };
    return { id: `b-${player}`, player, landmarks, center: { x: mirroredX, y: 0.5 } };
  };
  // Player A sits left of frame, B right; A's wrist is at raw x=0.72
  // (mirrored 0.28), B's at raw x=0.28 (mirrored 0.72).
  const bodies = [makeBody("A", 0.28, 0.72), makeBody("B", 0.72, 0.28)];
  const handNear = (rawWristX, mirroredTipX) => ({
    id: "h",
    landmarks: [{ x: rawWristX, y: 0.5 }],
    point: { x: mirroredTipX, y: 0.5 }
  });
  assert.equal(assignment.assignHandToPlayer(handNear(0.72, 0.3), bodies, 2), "A");
  assert.equal(assignment.assignHandToPlayer(handNear(0.28, 0.7), bodies, 2), "B");
});

test("hijaiyah library covers all 28 letters, each unique", () => {
  const letters = hijaiyah.HIJAIYAH_TEMPLATES.map((item) => item.letter);
  assert.equal(letters.length >= 28, true);
  assert.equal(new Set(letters).size, letters.length);
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

test("a locked player slot does not jump onto a stranger (1 player)", () => {
  const bodyAt = (rawX) => {
    const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
    landmarks[11] = { x: rawX - 0.03, y: 0.3 };
    landmarks[12] = { x: rawX + 0.03, y: 0.3 };
    landmarks[23] = { x: rawX - 0.02, y: 0.6 };
    landmarks[24] = { x: rawX + 0.02, y: 0.6 };
    return landmarks;
  };
  const tracker = new assignment.BodySlotTracker();
  // Lock onto a player standing in the middle of frame for a few frames.
  for (let i = 0; i < 5; i += 1) tracker.update([bodyAt(0.5)], 1);
  // A stranger appears on the far side of the frame in the same instant the
  // real player is briefly missed - nothing at all near the locked anchor.
  const jumped = tracker.update([bodyAt(0.05)], 1);
  assert.equal(jumped.length, 0, "a distant stranger must not be adopted");
  // The real player, close to where they were, is still accepted.
  const returned = tracker.update([bodyAt(0.52)], 1);
  assert.equal(returned.length, 1);
  assert.equal(returned[0].player, "A");
});

test("a locked player slot does not jump onto a stranger (2 players)", () => {
  const bodyAt = (rawX) => {
    const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
    landmarks[11] = { x: rawX - 0.03, y: 0.3 };
    landmarks[12] = { x: rawX + 0.03, y: 0.3 };
    landmarks[23] = { x: rawX - 0.02, y: 0.6 };
    landmarks[24] = { x: rawX + 0.02, y: 0.6 };
    return landmarks;
  };
  const tracker = new assignment.BodySlotTracker();
  for (let i = 0; i < 5; i += 1) {
    tracker.update([bodyAt(1 - 0.25), bodyAt(1 - 0.75)], 2);
  }
  // Player B steps out; a stranger who happens to be standing far from
  // both known anchors is the only other body detected alongside A.
  const withStranger = tracker.update([bodyAt(1 - 0.26), bodyAt(1 - 0.02)], 2);
  assert.equal(withStranger.length, 1, "the stranger must not fill B's slot");
  assert.equal(withStranger[0].player, "A");
  // B genuinely returns close to their old spot afterwards and is reacquired.
  const bReturns = tracker.update([bodyAt(1 - 0.27), bodyAt(1 - 0.73)], 2);
  assert.equal(bReturns.length, 2);
  assert.equal(bReturns.find((item) => item.player === "B").center.x > 0.5, true);
});

test("a player who steps out and back within budget keeps their identity", () => {
  const bodyAt = (rawX) => {
    const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
    landmarks[11] = { x: rawX - 0.03, y: 0.3 };
    landmarks[12] = { x: rawX + 0.03, y: 0.3 };
    landmarks[23] = { x: rawX - 0.02, y: 0.6 };
    landmarks[24] = { x: rawX + 0.02, y: 0.6 };
    return landmarks;
  };
  const tracker = new assignment.BodySlotTracker();
  for (let i = 0; i < 5; i += 1) tracker.update([bodyAt(0.5)], 1);
  // Missed for a few frames (nobody detected at all).
  tracker.update([], 1);
  tracker.update([], 1);
  tracker.update([], 1);
  // Reappears nearby - well inside the grown jump budget after three misses.
  const reacquired = tracker.update([bodyAt(0.56)], 1);
  assert.equal(reacquired.length, 1);
  assert.equal(reacquired[0].player, "A");
});

test("isHandPlausible rejects a hand far from every tracked player", () => {
  const body = (player, x) => ({
    id: `b-${player}`,
    player,
    landmarks: [],
    center: { x, y: 0.5 }
  });
  const bodies = [body("A", 0.45), body("B", 0.55)];
  const farHand = { id: "h", landmarks: [], point: { x: 0.02, y: 0.98 } };
  assert.equal(assignment.isHandPlausible(farHand, bodies), false);
});

test("isHandPlausible accepts a hand near a tracked player", () => {
  const body = (player, x) => ({
    id: `b-${player}`,
    player,
    landmarks: [],
    center: { x, y: 0.5 }
  });
  const bodies = [body("A", 0.3), body("B", 0.7)];
  const nearHand = { id: "h", landmarks: [], point: { x: 0.34, y: 0.52 } };
  assert.equal(assignment.isHandPlausible(nearHand, bodies), true);
  // With nobody tracked yet, nothing is implausible.
  assert.equal(
    assignment.isHandPlausible({ id: "h", landmarks: [], point: { x: 0.02, y: 0.98 } }, []),
    true
  );
});

test("a locked face slot does not jump onto a stranger", () => {
  const face = (noseRawX) => {
    const landmarks = new Array(478).fill({ x: 0.5, y: 0.5 });
    landmarks[1] = { x: noseRawX, y: 0.5 };
    return landmarks;
  };
  const tracker = new faceAnalysis.FaceSlotTracker();
  for (let i = 0; i < 5; i += 1) tracker.update([face(0.5)], 1);
  const jumped = tracker.update([face(0.02)], 1);
  assert.equal(jumped.length, 0, "a distant stranger's face must not be adopted");
  const returned = tracker.update([face(0.48)], 1);
  assert.equal(returned.length, 1);
  assert.equal(returned[0].player, "A");
});

test("a one-off far candidate does not recover a slot, but two frames in the same spot do", () => {
  const bodyAt = (rawX) => {
    const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
    landmarks[11] = { x: rawX - 0.03, y: 0.3 };
    landmarks[12] = { x: rawX + 0.03, y: 0.3 };
    landmarks[23] = { x: rawX - 0.02, y: 0.6 };
    landmarks[24] = { x: rawX + 0.02, y: 0.6 };
    return landmarks;
  };
  const tracker = new assignment.BodySlotTracker();
  for (let i = 0; i < 5; i += 1) tracker.update([bodyAt(0.5)], 1);
  // Missed long enough that the jump budget has grown past a same-spot walk-in.
  for (let i = 0; i < 8; i += 1) tracker.update([], 1);
  // A single frame with someone new, well outside the base budget: not
  // enough on its own to be trusted.
  const oneShot = tracker.update([bodyAt(0.1)], 1);
  assert.equal(oneShot.length, 0, "a single far sighting must not recover the slot");
  // A different stray position the very next frame: still not the same
  // person twice running, so still rejected.
  const stillStray = tracker.update([bodyAt(0.85)], 1);
  assert.equal(stillStray.length, 0);
  // The same new spot two frames running is trusted as a genuine return,
  // even though it's still well outside the base per-frame budget.
  const firstSighting = tracker.update([bodyAt(0.3)], 1);
  assert.equal(firstSighting.length, 0, "still needs a second frame to confirm");
  const confirmed = tracker.update([bodyAt(0.3)], 1);
  assert.equal(confirmed.length, 1, "the same position held for two frames should be accepted");
  assert.equal(confirmed[0].player, "A");
});

test("lane band stretches the usable part of the frame to the full width", () => {
  // A player fully in shot never reaches the edges, so the middle band has to
  // map to the whole playing width or the outer lanes are unreachable.
  assert.equal(lanes.normalisePosition(0.24), 0);
  assert.equal(lanes.normalisePosition(0.76), 1);
  assert.equal(Math.abs(lanes.normalisePosition(0.5) - 0.5) < 1e-9, true);
  // Out of range and nonsense input must still produce a usable position.
  assert.equal(lanes.normalisePosition(0), 0);
  assert.equal(lanes.normalisePosition(1), 1);
  assert.equal(lanes.normalisePosition(Number.NaN), 0.5);
});

test("lane choice is hysteretic, so standing on a boundary does not flicker", () => {
  // Right on the entry boundary for the left lane.
  const boundary = 0.36;
  // Coming from the centre, that is not far enough to claim the left lane...
  assert.equal(lanes.laneFor(boundary, 0), 0);
  // ...but a player already standing left stays left there.
  assert.equal(lanes.laneFor(boundary, -1), -1);
  // Mirrored on the right.
  assert.equal(lanes.laneFor(0.64, 0), 0);
  assert.equal(lanes.laneFor(0.64, 1), 1);

  // A player jittering around a boundary must not change lane every frame.
  let current = 0;
  let changes = 0;
  for (let i = 0; i < 200; i += 1) {
    const jitter = 0.36 + Math.sin(i) * 0.03;
    const next = lanes.laneFor(jitter, current);
    if (next !== current) changes += 1;
    current = next;
  }
  assert.equal(changes <= 1, true, `lane changed ${changes} times on jitter alone`);
});

test("a decisive step always reaches the outer lanes", () => {
  assert.equal(lanes.laneFor(lanes.normalisePosition(0.28), 0), -1);
  assert.equal(lanes.laneFor(lanes.normalisePosition(0.72), 0), 1);
  assert.equal(lanes.laneFor(lanes.normalisePosition(0.5), -1), 0);
});

test("leaderboard ordering is stable and ties favour the earlier run", () => {
  const entries = [
    { name: "c", score: 100, at: 30 },
    { name: "a", score: 300, at: 10 },
    { name: "b", score: 100, at: 20 }
  ];
  const sorted = ranking.orderEntries(entries);
  assert.deepEqual(sorted.map((item) => item.name), ["a", "b", "c"]);
  // Sorting twice must not reshuffle equal scores.
  assert.deepEqual(
    ranking.orderEntries(sorted).map((item) => item.name),
    ["a", "b", "c"]
  );
  // orderEntries must not mutate its input.
  assert.equal(entries[0].name, "c");
});

test("rank counts only strictly better scores", () => {
  const entries = [
    { score: 300, at: 1 },
    { score: 200, at: 2 },
    { score: 200, at: 3 }
  ];
  assert.equal(ranking.rankOf(entries, 400), 1);
  assert.equal(ranking.rankOf(entries, 300), 2, "matching the leader is second, not joint first");
  assert.equal(ranking.rankOf(entries, 250), 2);
  assert.equal(ranking.rankOf(entries, 200), 4, "ties sit behind every equal score already there");
  assert.equal(ranking.rankOf(entries, 100), 4);
  assert.equal(ranking.rankOf([], 0), 1, "an empty board makes any score first");

  // The previewed rank must equal the rank the entry actually gets once it is
  // inserted, or the number visibly changes when the child presses save.
  for (const candidate of [0, 100, 200, 250, 300, 400]) {
    const preview = ranking.rankOf(entries, candidate);
    const inserted = ranking.orderEntries([
      ...entries,
      { score: candidate, at: 999 }
    ]);
    const actual = inserted.findIndex((item) => item.at === 999) + 1;
    assert.equal(preview, actual, `preview ${preview} != actual ${actual} for ${candidate}`);
  }
});

test("canonical Hijaiyah templates declare consistent dot metadata", () => {
  for (const template of hijaiyah.HIJAIYAH_TEMPLATES) {
    assert.equal(Array.isArray(template.body), true);
    assert.equal(template.body.length >= 1, true);
    for (const strokePoints of template.body) {
      assert.equal(strokePoints.length >= 2, true, `${template.latin} has an empty stroke`);
    }
    if (template.dots === 0) {
      assert.equal(template.dotZone, "none", `${template.latin} declares a zone without dots`);
    } else {
      assert.equal(template.dotZone !== "none", true, `${template.latin} has dots but no zone`);
    }
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

/* ── Handwriting recognition ────────────────────────────────────────── */

let recogSeed = 20260816;
function noise() {
  recogSeed = (recogSeed * 1103515245 + 12345) % 2147483648;
  return recogSeed / 2147483648 - 0.5;
}

/** Turns a template variant into a capture-like stroke list. */
function penStrokes(variant, { jitter = 0.014, offsetX = 0, width = 1, height = 1 } = {}) {
  return variant.strokes.map((points, index) => {
    const dense = [];
    for (let step = 1; step < points.length; step += 1) {
      for (let sub = 0; sub < 6; sub += 1) {
        const fraction = sub / 6;
        dense.push({
          x: offsetX + (points[step - 1].x + (points[step].x - points[step - 1].x) * fraction) * width + noise() * jitter,
          y: (points[step - 1].y + (points[step].y - points[step - 1].y) * fraction) * height + noise() * jitter,
          t: step * 16
        });
      }
    }
    const last = points[points.length - 1];
    dense.push({ x: offsetX + last.x * width, y: last.y * height, t: 999 });
    return { id: `s-${index}`, points: dense, startedAt: 0, endedAt: 1000 };
  });
}

function writeNumber(text, { gap = 0.06, width = 0.24 } = {}) {
  const strokes = [];
  let cursor = 0.06;
  for (let index = 0; index < text.length; index += 1) {
    const digitValue = Number(text[index]);
    const variants = templates.DIGIT_VARIANTS[digitValue];
    const variant = variants[index % variants.length];
    strokes.push(...penStrokes(variant, {
      offsetX: cursor,
      width,
      height: width / 0.62
    }));
    cursor += width + gap;
  }
  return strokes;
}

test("every digit variant is recognized as its own digit", () => {
  let correct = 0;
  let total = 0;
  for (const key of Object.keys(templates.DIGIT_VARIANTS)) {
    for (const variant of templates.DIGIT_VARIANTS[key]) {
      for (const jitter of [0, 0.012, 0.025]) {
        total += 1;
        const result = digit.classifyDigit(
          penStrokes(variant, { jitter, height: 1 / 0.62 })
        );
        if (result.value === Number(key)) correct += 1;
      }
    }
  }
  // Some deliberately harsh jitter cases are allowed to fail; the previous
  // template matcher scored well under 70% here.
  assert.equal(correct / total >= 0.92, true, `accuracy ${correct}/${total}`);
});

test("six and nine are never confused", () => {
  // This is the regression that mattered most: the old matcher accepted a
  // mirrored and reversed template, which made 6 and 9 the same shape.
  for (const [written, wrong] of [["6", 9], ["9", 6]]) {
    for (const variant of templates.DIGIT_VARIANTS[written]) {
      const strokes = penStrokes(variant, { jitter: 0.02, height: 1 / 0.62 });
      const classified = digit.classifyDigit(strokes);
      assert.equal(classified.value, Number(written));
      assert.equal(digit.verifyExpectedDigit(strokes, wrong).accepted, false);
      assert.equal(digit.verifyExpectedDigit(strokes, Number(written)).accepted, true);
    }
  }
});

test("mirrored handwriting is no longer accepted as a match", () => {
  const six = templates.DIGIT_VARIANTS[6][0];
  const mirrored = {
    strokes: six.strokes.map((points) => points.map((point) => ({ x: 1 - point.x, y: point.y })))
  };
  const strokes = penStrokes(mirrored, { jitter: 0.01, height: 1 / 0.62 });
  const ranked = digit.rankDigits(strokes);
  const sixMatch = ranked.matches.find((match) => match.digit === 6);
  const best = ranked.matches[0];
  assert.equal(best.digit !== 6 || sixMatch.distance > 0.02, true);
});

test("multi-digit answers are read in one pass", () => {
  for (const text of ["10", "69", "12", "45", "100"]) {
    const strokes = writeNumber(text);
    const result = multiDigit.verifyExpectedNumber(strokes, Number(text));
    assert.equal(result.segments, text.length, `${text} segmented into ${result.segments}`);
    assert.equal(result.accepted, true, `${text} rejected: ${result.reason}`);
  }
});

test("a wrong multi-digit answer is rejected", () => {
  for (const [written, expected] of [["69", 96], ["10", 1], ["12", 21]]) {
    const result = multiDigit.verifyExpectedNumber(writeNumber(written), expected);
    assert.equal(result.accepted, false, `${written} wrongly accepted as ${expected}`);
  }
});

test("pen-ups are not bridged into phantom strokes", () => {
  const cloud = pointcloud.normalizeCloud([
    [{ x: 0, y: 0 }, { x: 0, y: 1 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }]
  ]);
  const strokeIds = new Set(cloud.map((point) => point.stroke));
  assert.equal(strokeIds.size, 2);
});

test("loop position is measured, which is what separates 6 from 9", () => {
  const six = features.extractFeatures(
    templates.DIGIT_VARIANTS[6][0].strokes
  );
  const nine = features.extractFeatures(
    templates.DIGIT_VARIANTS[9][0].strokes
  );
  assert.equal(six.loopCenters.length > 0, true);
  assert.equal(nine.loopCenters.length > 0, true);
  assert.equal(
    six.loopCenters[six.loopCenters.length - 1] > nine.loopCenters[0],
    true
  );
});

/* ── Hijaiyah ───────────────────────────────────────────────────────── */

function writeLetter(template) {
  const strokes = template.body.map((points, index) => {
    const dense = [];
    for (let step = 1; step < points.length; step += 1) {
      for (let sub = 0; sub < 6; sub += 1) {
        const fraction = sub / 6;
        dense.push({
          x: points[step - 1].x + (points[step].x - points[step - 1].x) * fraction + noise() * 0.014,
          y: points[step - 1].y + (points[step].y - points[step - 1].y) * fraction + noise() * 0.014,
          t: step * 16
        });
      }
    }
    dense.push({ ...points[points.length - 1] });
    return { id: `body-${index}`, points: dense, startedAt: 0, endedAt: 100 };
  });

  const all = template.body.flat();
  const centerX = all.reduce((sum, point) => sum + point.x, 0) / all.length;
  const ys = all.map((point) => point.y);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  for (let index = 0; index < template.dots; index += 1) {
    const x = centerX + (index - (template.dots - 1) / 2) * 0.11;
    const y = template.dotZone === "above" ? top - 0.16 : bottom + 0.16;
    strokes.push({
      id: `dot-${index}`,
      points: [
        { x, y, t: 0 },
        { x: x + 0.035, y, t: 8 },
        { x: x + 0.035, y: y + 0.035, t: 16 },
        { x, y: y + 0.035, t: 24 },
        { x, y, t: 32 }
      ],
      startedAt: 0,
      endedAt: 40
    });
  }
  return strokes;
}

test("all 28 hijaiyah letters are present and self-recognizing", () => {
  assert.equal(hijaiyah.HIJAIYAH_TEMPLATES.length >= 28, true);
  for (const template of hijaiyah.HIJAIYAH_TEMPLATES) {
    const result = hijaiyah.evaluateHijaiyah(writeLetter(template), template);
    assert.equal(result.accepted, true, `${template.latin} rejected: ${result.reason}`);
  }
});

test("a letter is never accepted as a different letter", () => {
  for (const template of hijaiyah.HIJAIYAH_TEMPLATES) {
    const strokes = writeLetter(template);
    for (const other of hijaiyah.HIJAIYAH_TEMPLATES) {
      if (other.letter === template.letter) continue;
      const result = hijaiyah.evaluateHijaiyah(strokes, other);
      assert.equal(
        result.accepted,
        false,
        `${template.latin} accepted as ${other.latin}`
      );
    }
  }
});

test("dots are separated by size, not by point count", () => {
  const template = hijaiyah.HIJAIYAH_TEMPLATES.find((item) => item.latin === "Ba");
  const strokes = writeLetter(template);
  // Give the dot far more sample points than the body, which is exactly the
  // case that broke the previous "longest stroke is the body" heuristic.
  const dot = strokes[strokes.length - 1];
  const inflated = [];
  for (let index = 1; index < dot.points.length; index += 1) {
    for (let sub = 0; sub < 20; sub += 1) {
      const fraction = sub / 20;
      inflated.push({
        x: dot.points[index - 1].x + (dot.points[index].x - dot.points[index - 1].x) * fraction,
        y: dot.points[index - 1].y + (dot.points[index].y - dot.points[index - 1].y) * fraction
      });
    }
  }
  strokes[strokes.length - 1] = { ...dot, points: inflated };
  const separated = hijaiyah.separateDots(strokes, template.body.length);
  assert.equal(separated.dots.length, 1);
  assert.equal(separated.body.length, template.body.length);
});

test("arabic direction is scored, and mirrored letters do not match", () => {
  const dal = hijaiyah.HIJAIYAH_TEMPLATES.find((item) => item.latin === "Dal");
  const mirrored = {
    ...dal,
    body: dal.body.map((points) => points.map((point) => ({ x: 1 - point.x, y: point.y })))
  };
  const result = hijaiyah.evaluateHijaiyah(writeLetter(mirrored), dal);
  assert.equal(result.accepted, false);
});

test("scorePath no longer rewards mirrored input", () => {
  const path = [
    { x: 0.1, y: 0.1 },
    { x: 0.5, y: 0.2 },
    { x: 0.9, y: 0.9 }
  ];
  const mirrored = path.map((point) => ({ x: 1 - point.x, y: point.y }));
  assert.equal(geometry.scorePath(path, path), 100);
  assert.equal(geometry.scorePath(mirrored, path) < 100, true);
});
