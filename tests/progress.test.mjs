import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PROGRESS, recordResult, sanitizeProgress } from "../.qa-dist/engine/progress.js";

test("malformed local progress is safely normalized", () => {
  const value = sanitizeProgress({ gamesPlayed: -9, completedRounds: "oops", soundEnabled: false, reducedMotion: true });
  assert.equal(value.gamesPlayed, 0);
  assert.equal(value.completedRounds, 0);
  assert.equal(value.soundEnabled, false);
  assert.equal(value.reducedMotion, true);
});

test("best score only increases", () => {
  let progress = recordResult(DEFAULT_PROGRESS, "math-battle", 120);
  progress = recordResult(progress, "math-battle", 90);
  assert.equal(progress.bestScores["math-battle"], 120);
  assert.equal(progress.completedRounds, 2);
});
