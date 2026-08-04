import test from "node:test";
import assert from "node:assert/strict";
import { addNoise, mirrorPath, scorePathAgainstTarget } from "../.qa-dist/engine/geometry.js";
import { recognizeDigit } from "../.qa-dist/engine/recognition.js";
import { createRandom } from "../.qa-dist/engine/random.js";
import { DIGIT_TEMPLATES, SHAPE_TEMPLATES } from "../.qa-dist/engine/templates.js";

for (let digit = 0; digit <= 9; digit += 1) {
  test(`recognizes digit ${digit}, including mirrored/noisy paths`, () => {
    const base = DIGIT_TEMPLATES[digit][0];
    const direct = recognizeDigit(base, 0.45);
    assert.equal(direct.value, digit);
    assert.equal(direct.accepted, true);

    const mirrored = recognizeDigit(mirrorPath(base), 0.45);
    assert.equal(mirrored.value, digit);
    assert.equal(mirrored.accepted, true);

    const rng = createRandom(1000 + digit);
    const noisy = addNoise(base, 0.012, () => rng.next());
    const recognized = recognizeDigit(noisy, 0.42);
    assert.equal(recognized.value, digit);
    assert.equal(recognized.accepted, true);
  });
}

test("short gesture is rejected instead of counted wrong", () => {
  const result = recognizeDigit([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  assert.equal(result.accepted, false);
  assert.equal(result.value, null);
});

test("guided shape score rewards matching path", () => {
  for (const target of Object.values(SHAPE_TEMPLATES)) {
    assert.ok(scorePathAgainstTarget(target, target) >= 99);
  }
});
