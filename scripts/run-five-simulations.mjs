import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const { createRandom } = await import("../.qa-dist/engine/random.js");
const {
  createMathQuestion,
  createPatternQuestion,
  validateMathQuestion
} = await import("../.qa-dist/engine/math.js");
const { countdownValue } = await import("../.qa-dist/engine/countdown.js");
const { classifyBodyAction } = await import("../.qa-dist/engine/body.js");
const { verifyExpectedDigit } = await import("../.qa-dist/engine/digit.js");
const { DIGIT_TEMPLATES, SHAPE_TEMPLATES } = await import("../.qa-dist/engine/templates.js");
const { scorePath, bounds } = await import("../.qa-dist/engine/geometry.js");
const { HIJAIYAH_TEMPLATES, evaluateHijaiyah } = await import("../.qa-dist/engine/hijaiyah.js");
const { BodySlotTracker } = await import("../.qa-dist/vision/player-assignment.js");

const offset = Number.parseInt(process.env.SIMULATION_OFFSET ?? "0", 10) || 0;
const seeds = [0x1101, 0x2202, 0x3303, 0x4404, 0x5505].map(
  (seed, index) => (seed + offset * 0x10001 + index * 97) >>> 0
);
const reports = [];

function bodyLandmarks(mirroredX) {
  const rawX = 1 - mirroredX;
  const landmarks = Array.from({ length: 33 }, () => ({ x: rawX, y: 0.5 }));
  landmarks[11] = { x: rawX - 0.03, y: 0.3 };
  landmarks[12] = { x: rawX + 0.03, y: 0.3 };
  landmarks[23] = { x: rawX - 0.02, y: 0.6 };
  landmarks[24] = { x: rawX + 0.02, y: 0.6 };
  return landmarks;
}

for (let run = 0; run < 5; run += 1) {
  const rng = createRandom(seeds[run]);
  let mathErrors = 0;
  let patternErrors = 0;
  let questions = 0;

  for (const level of ["tk", "sd1", "sd2"]) {
    for (let index = 0; index < 20000; index += 1) {
      const question = createMathQuestion(rng, level);
      mathErrors += validateMathQuestion(question, level).length;
      questions += 1;
    }
    for (let index = 0; index < 10000; index += 1) {
      const question = createPatternQuestion(rng, level);
      if (!Number.isInteger(question.answer) || question.sequence.length !== 4) {
        patternErrors += 1;
      }
    }
  }

  let countdownErrors = 0;
  for (let index = 0; index < 100; index += 1) {
    const start = index * 10000;
    const values = [0, 1000, 2000, 3000, 4001].map((delta) =>
      countdownValue(start, start + delta)
    );
    if (JSON.stringify(values) !== JSON.stringify([3, 2, 1, "GO", null])) {
      countdownErrors += 1;
    }
  }

  let digitErrors = 0;
  for (let digit = 0; digit <= 9; digit += 1) {
    for (let sample = 0; sample < 20; sample += 1) {
      const points = DIGIT_TEMPLATES[digit][0].map((point) => ({
        x: point.x + (rng.next() - 0.5) * 0.016,
        y: point.y + (rng.next() - 0.5) * 0.016
      }));
      const result = verifyExpectedDigit(
        [{ id: `d-${digit}-${sample}`, points, startedAt: 0, endedAt: 1 }],
        digit
      );
      if (!result.accepted) digitErrors += 1;
    }
  }

  let shapeErrors = 0;
  for (const template of Object.values(SHAPE_TEMPLATES)) {
    if (scorePath(template, template) < 99) shapeErrors += 1;
  }

  let hijaiyahErrors = 0;
  for (const template of HIJAIYAH_TEMPLATES) {
    // Letter bodies are multi-stroke now, and dots are separated by size
    // relative to the glyph rather than by point count, so the simulated dot
    // has to be a small square instead of a single point.
    const flatBody = template.body.flat();
    const box = bounds(flatBody);
    const dotY =
      template.dotZone === "above"
        ? Math.max(0.02, box.minY - 0.14)
        : Math.min(0.98, box.maxY + 0.14);
    const centerX = flatBody.reduce((sum, point) => sum + point.x, 0) / flatBody.length;
    const dots = Array.from({ length: template.dots }, (_, index) => {
      const x = centerX + (index - (template.dots - 1) / 2) * 0.11;
      return {
        id: `dot-${index}`,
        points: [
          { x, y: dotY },
          { x: x + 0.03, y: dotY },
          { x: x + 0.03, y: dotY + 0.03 },
          { x, y: dotY + 0.03 },
          { x, y: dotY }
        ],
        startedAt: index + 2,
        endedAt: index + 2
      };
    });
    const bodyStrokes = template.body.map((points, index) => ({
      id: `body-${index}`,
      points,
      startedAt: 0,
      endedAt: 1
    }));
    const result = evaluateHijaiyah([...bodyStrokes, ...dots], template);
    if (!result.accepted) hijaiyahErrors += 1;
  }

  const baseline = { centerX: 0.5, hipY: 0.58, torsoScale: 1 };
  const actions = [
    classifyBodyAction({ centerX: 0.25, hipY: 0.58, torsoScale: 1, kneeCompression: 0 }, baseline),
    classifyBodyAction({ centerX: 0.75, hipY: 0.58, torsoScale: 1, kneeCompression: 0 }, baseline),
    classifyBodyAction({ centerX: 0.5, hipY: 0.44, torsoScale: 1, kneeCompression: 0 }, baseline),
    classifyBodyAction({ centerX: 0.5, hipY: 0.69, torsoScale: 1, kneeCompression: 0.3 }, baseline)
  ];
  const bodyActionErrors =
    JSON.stringify(actions) === JSON.stringify(["left", "right", "jump", "crouch"])
      ? 0
      : 1;

  const tracker = new BodySlotTracker();
  tracker.update([bodyLandmarks(0.25), bodyLandmarks(0.75)], 2);
  const reordered = tracker.update([bodyLandmarks(0.72), bodyLandmarks(0.28)], 2);
  const playerSlotErrors =
    reordered.find((item) => item.player === "A")?.center.x < 0.5 &&
    reordered.find((item) => item.player === "B")?.center.x > 0.5
      ? 0
      : 1;

  const invariantErrors =
    mathErrors +
    patternErrors +
    countdownErrors +
    digitErrors +
    shapeErrors +
    hijaiyahErrors +
    bodyActionErrors +
    playerSlotErrors;

  const report = {
    run: run + 1,
    seed: seeds[run],
    mathQuestions: questions,
    patternQuestions: 30000,
    countdowns: 100,
    noisyDigitSamples: 200,
    shapeTemplates: Object.keys(SHAPE_TEMPLATES).length,
    hijaiyahTemplates: HIJAIYAH_TEMPLATES.length,
    bodyActions: actions,
    playerSlotOrderChanges: 1,
    invariantErrors
  };
  reports.push(report);
  console.log(JSON.stringify(report));
  if (invariantErrors) process.exitCode = 1;
}

await (await import("node:fs/promises")).writeFile(
  "qa/five-simulation-report.json",
  JSON.stringify({ runs: reports }, null, 2)
);
