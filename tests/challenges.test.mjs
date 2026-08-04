import test from "node:test";
import assert from "node:assert/strict";
import { createMathChallenge, createPatternChallenge, ChallengeDeck } from "../.qa-dist/engine/challenges.js";
import { createRandom } from "../.qa-dist/engine/random.js";

for (const [level, count] of [["kindergarten", 25000], ["grade-1", 25000], ["grade-2", 25000]]) {
  test(`random math constraints: ${level} (${count.toLocaleString()} challenges)`, () => {
    const rng = createRandom(level.length * 987654);
    for (let index = 0; index < count; index += 1) {
      const challenge = createMathChallenge(level, rng);
      const [a, b] = challenge.operands;
      if (challenge.operation === "add") assert.equal(a + b, challenge.answer);
      if (challenge.operation === "subtract") {
        assert.equal(a - b, challenge.answer);
        assert.ok(challenge.answer >= 0);
      }
      if (challenge.operation === "multiply") assert.equal(a * b, challenge.answer);
      if (challenge.operation === "divide") {
        assert.notEqual(b, 0);
        assert.equal(a / b, challenge.answer);
        assert.ok(Number.isInteger(challenge.answer));
      }
      const max = level === "kindergarten" ? 10 : level === "grade-1" ? 20 : 100;
      assert.ok(challenge.answer >= 0 && challenge.answer <= max);
      if (level !== "grade-2") assert.ok(["add", "subtract"].includes(challenge.operation));
    }
  });
}

test("pattern challenges remain within age range and have correct answer", () => {
  for (const level of ["kindergarten", "grade-1", "grade-2"]) {
    const rng = createRandom(level.length * 112233);
    for (let index = 0; index < 10000; index += 1) {
      const challenge = createPatternChallenge(level, rng);
      const expected = challenge.sequence.at(-1) + challenge.step;
      assert.equal(challenge.answer, expected);
      const max = level === "kindergarten" ? 10 : level === "grade-1" ? 20 : 100;
      assert.ok(challenge.answer >= 0 && challenge.answer <= max);
    }
  }
});

test("challenge deck avoids immediate repeats", () => {
  const deck = new ChallengeDeck("math-battle", "grade-2", createRandom(404), 20);
  const signatures = [];
  for (let index = 0; index < 100; index += 1) {
    const challenge = deck.next();
    const signature = `${challenge.operation}:${challenge.operands.join(":")}`;
    assert.notEqual(signature, signatures.at(-1));
    signatures.push(signature);
  }
});


test("small-domain trace and shape decks avoid immediate repeats", () => {
  for (const gameId of ["number-trace", "shape-quest"]) {
    const deck = new ChallengeDeck(gameId, "kindergarten", createRandom(gameId.length * 808));
    let previous = null;
    for (let index = 0; index < 100; index += 1) {
      const challenge = deck.next();
      const signature = challenge.kind === "trace" ? `digit:${challenge.digit}` : `shape:${challenge.shape}`;
      assert.notEqual(signature, previous);
      previous = signature;
    }
  }
});
