import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(
  process.execPath,
  [tscBin, "-p", "tsconfig.learning-tests.json"],
  { cwd: root, stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const journey = require(path.join(outDir, "src", "lib", "learning", "journeyMap.js"));
const attempts = require(path.join(outDir, "src", "lib", "learning", "attempts.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));

const EXPECTED_STAGE_IDS = {
  bahasa: [
    "bahasa-huruf",
    "bahasa-cerita",
    "bahasa-dasar-huruf",
    "bahasa-suku-kata-kata",
    "bahasa-kalimat-pemahaman",
    "bahasa-literasi-terapan"
  ],
  english: [
    "english-first-words",
    "english-alphabet-basics",
    "english-everyday-words",
    "english-words-actions",
    "english-phrases-review"
  ],
  math: [
    "math-angka",
    "math-pola",
    "math-jumlah-dasar",
    "math-banding-bentuk",
    "math-operasi-awal",
    "math-ukur-ruang"
  ],
  iqro: [
    "iqro-huruf",
    "iqro-recognition-basics",
    "iqro-middle-families",
    "iqro-advanced-families",
    "iqro-final-families"
  ],
  letters: [
    "letters-foundations",
    "letters-recognition-prewriting-basics",
    "letters-middle-alphabet",
    "letters-late-middle-alphabet",
    "letters-final-alphabet"
  ],
  logic: [
    "logic-foundations",
    "logic-classification-rules-basics",
    "logic-patterns-sequences-relations",
    "logic-conditional-analogy-inference",
    "logic-mixed-reasoning-challenge"
  ],
  science: [
    "science-foundations",
    "science-living-observation-basics",
    "science-life-material-motion",
    "science-earth-body-environment",
    "science-evidence-review-challenge"
  ],
  color: [
    "color-characters",
    "color-exploration-basics",
    "color-patterns-scenes",
    "color-mood-material-story",
    "color-palette-scene-capstone"
  ],
  drawing: [
    "drawing-lines-shapes-basics",
    "drawing-objects-scenes",
    "drawing-space-story-imagination",
    "drawing-composition-design-capstone"
  ]
};

const EMPTY_PROGRESS = {
  completedActivityIds: [],
  stars: 0,
  lastActivityId: null
};

try {
  const emptyAnalytics = attempts.emptyLearningAnalytics();

  assert.deepEqual(
    Object.keys(EXPECTED_STAGE_IDS),
    system.SUBJECTS.map((subject) => subject.id),
    "JM-01 expected subject order must track the canonical subject registry"
  );

  let totalStages = 0;
  for (const subject of system.SUBJECTS) {
    const expected = EXPECTED_STAGE_IDS[subject.id];
    assert.ok(expected, `missing JM-01 stage expectation for ${subject.id}`);

    const model = journey.buildBelajarJourneyMap({
      childId: "demo-gian",
      subjectId: subject.id,
      progress: EMPTY_PROGRESS,
      analytics: emptyAnalytics
    });

    assert.ok(model, `JM-01 model should resolve for ${subject.id}`);
    assert.equal(model.subjectId, subject.id);
    assert.equal(model.subjectHref, `/child/demo-gian/subject/${subject.id}`);
    assert.deepEqual(model.stages.map((stage) => stage.id), expected);
    assert.deepEqual(model.paths.flatMap((item) => item.stageIds), expected);
    assert.equal(model.totalStageCount, expected.length);
    assert.equal(model.completedStageCount, 0);
    assert.equal(model.currentStageId, expected[0]);
    assert.equal(model.stages.filter((stage) => stage.current).length, 1);
    assert.equal(model.stages[0].presentationState, "current");
    assert.equal(model.stages[0].canonicalStatus, "in_progress");
    assert.equal(model.stages[0].open, true);
    assert.equal(model.stages[0].locked, false);
    assert.ok(model.stages.slice(1).every((stage) => stage.presentationState === "locked"));
    assert.ok(model.stages.slice(1).every((stage) => stage.canonicalStatus === "locked"));
    assert.deepEqual(
      model.stages.map((stage) => stage.order),
      Array.from({ length: expected.length }, (_, index) => index + 1)
    );
    assert.ok(
      model.stages.every((stage) => stage.href === `/child/demo-gian/stage/${stage.id}`),
      `${subject.id} stage routes must preserve canonical direct Stage URLs`
    );
    assert.equal(
      model.stages.reduce((sum, stage) => sum + stage.activityCount, 0),
      100,
      `${subject.id} Journey Map must project the exact 100-activity subject membership`
    );
    totalStages += model.totalStageCount;
  }

  assert.equal(totalStages, 46, "JM-01 must project all 46 canonical Belajar stages");

  const english = journey.buildBelajarJourneyMap({
    childId: "demo-gian",
    subjectId: "english",
    progress: EMPTY_PROGRESS,
    analytics: emptyAnalytics
  });
  assert.equal(english.subjectTitle, "Bahasa Inggris");
  assert.equal(english.subjectShortTitle, "Inggris");

  const mathFirstStage = system.getStage("math-angka");
  assert.ok(mathFirstStage);
  const mathEvidenceGate = journey.buildBelajarJourneyMap({
    childId: "demo-gian",
    subjectId: "math",
    progress: {
      completedActivityIds: [...mathFirstStage.activityIds],
      stars: 0,
      lastActivityId: mathFirstStage.activityIds.at(-1) ?? null
    },
    analytics: emptyAnalytics
  });
  assert.ok(mathEvidenceGate);
  assert.equal(mathEvidenceGate.stages[0].canonicalStatus, "evidence_needed");
  assert.equal(mathEvidenceGate.stages[0].presentationState, "current");
  assert.equal(mathEvidenceGate.stages[0].completed, false);
  assert.equal(mathEvidenceGate.stages[0].open, true);
  assert.equal(mathEvidenceGate.stages[1].canonicalStatus, "locked");
  assert.equal(
    mathEvidenceGate.currentStageId,
    "math-angka",
    "JM-01 must not treat completion-without-evidence as an advanced/completed stage"
  );

  const colorFirstStage = system.getStage("color-characters");
  assert.ok(colorFirstStage);
  const colorAdvanced = journey.buildBelajarJourneyMap({
    childId: "demo-gian",
    subjectId: "color",
    progress: {
      completedActivityIds: [...colorFirstStage.activityIds],
      stars: 0,
      lastActivityId: colorFirstStage.activityIds.at(-1) ?? null
    },
    analytics: emptyAnalytics
  });
  assert.ok(colorAdvanced);
  assert.equal(colorAdvanced.stages[0].canonicalStatus, "ready");
  assert.equal(colorAdvanced.stages[0].presentationState, "completed");
  assert.equal(colorAdvanced.stages[0].completed, true);
  assert.equal(colorAdvanced.stages[1].canonicalStatus, "in_progress");
  assert.equal(colorAdvanced.stages[1].presentationState, "current");
  assert.equal(colorAdvanced.currentStageId, "color-exploration-basics");
  assert.equal(colorAdvanced.completedStageCount, 1);

  assert.equal(
    journey.buildBelajarJourneyMap({
      childId: "demo-gian",
      subjectId: "not-a-subject",
      progress: EMPTY_PROGRESS,
      analytics: emptyAnalytics
    }),
    null,
    "unknown subject IDs should fail closed without a fabricated map"
  );

  assert.throws(
    () => journey.buildBelajarJourneyMap({
      childId: "   ",
      subjectId: "math",
      progress: EMPTY_PROGRESS,
      analytics: emptyAnalytics
    }),
    /non-empty childId/
  );

  console.log("JM-01 shared Journey Map data/state foundation tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
