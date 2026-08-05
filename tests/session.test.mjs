import test from "node:test";
import assert from "node:assert/strict";
import { createMathChallenge } from "../.qa-dist/engine/challenges.js";
import { createRandom } from "../.qa-dist/engine/random.js";
import { createSession, digitsToNumber, expectedDigitCount, reduceSession } from "../.qa-dist/engine/session.js";

function begin() {
  const challenge = createMathChallenge("grade-2", createRandom(99), "add");
  let session = createSession("math-battle", "grade-2", 60, 99);
  session = reduceSession(session, { type: "DEVICE_CHECK" });
  session = reduceSession(session, { type: "READY" });
  session = reduceSession(session, { type: "COUNTDOWN" });
  session = reduceSession(session, { type: "START", challenge });
  return { session, challenge };
}

test("state machine follows setup to gameplay", () => {
  const { session } = begin();
  assert.equal(session.phase, "playing");
  assert.equal(session.remainingSeconds, 60);
  assert.equal(session.challengeIndex, 1);
});

test("pause blocks timer ticks and resume continues", () => {
  let { session } = begin();
  session = reduceSession(session, { type: "PAUSE" });
  const paused = reduceSession(session, { type: "TICK" });
  assert.equal(paused.remainingSeconds, 60);
  session = reduceSession(paused, { type: "RESUME" });
  session = reduceSession(session, { type: "TICK" });
  assert.equal(session.remainingSeconds, 59);
});

test("score, wrong answer, zero digit, time-up and replay are consistent", () => {
  let { session, challenge } = begin();
  session = reduceSession(session, { type: "DIGIT", player: "A", digit: 0 });
  assert.equal(session.players.A.digits[0], 0);
  session = reduceSession(session, { type: "CORRECT", player: "A", speedBonus: 25 });
  assert.ok(session.players.A.score >= 125);
  session = reduceSession(session, { type: "WRONG", player: "B" });
  assert.equal(session.players.B.wrong, 1);
  session = reduceSession(session, { type: "TIME_UP" });
  assert.equal(session.phase, "time-up");
  session = reduceSession(session, { type: "RESULT" });
  assert.equal(session.winner, "A");
  session = reduceSession(session, { type: "REPLAY", challenge });
  assert.equal(session.phase, "playing");
  assert.equal(session.players.A.score, 0);
});


test("a player cannot score the same challenge more than once", () => {
  let { session } = begin();
  session = reduceSession(session, { type: "CORRECT", player: "A", speedBonus: 25 });
  const firstScore = session.players.A.score;
  const firstCorrect = session.players.A.correct;
  session = reduceSession(session, { type: "CORRECT", player: "A", speedBonus: 25 });
  assert.equal(session.players.A.score, firstScore);
  assert.equal(session.players.A.correct, firstCorrect);
});

test("time-up cannot skip setup states", () => {
  const session = createSession("math-battle", "kindergarten", 60, 5);
  const unchanged = reduceSession(session, { type: "TIME_UP" });
  assert.equal(unchanged.phase, "setup");
  assert.equal(unchanged.remainingSeconds, 60);
});

test("digit helpers support 0 and 100", () => {
  assert.equal(digitsToNumber([0]), 0);
  assert.equal(digitsToNumber([1, 0, 0]), 100);
  assert.equal(digitsToNumber([]), null);
  assert.equal(expectedDigitCount({ kind: "math", id: "x", prompt: "", answer: 100, operation: "add", operands: [50, 50] }), 3);
});
