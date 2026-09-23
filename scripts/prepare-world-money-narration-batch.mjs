import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".world-narration-plan-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(
  process.execPath,
  [tscBin, "-p", "tsconfig.learning-tests.json", "--outDir", outDir],
  { cwd: root, stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const plan = require(path.join(
  outDir,
  "src",
  "lib",
  "learning",
  "world",
  "moneyWorldNarrationPlan.js"
));
const production = require(path.join(
  outDir,
  "src",
  "lib",
  "learning",
  "world",
  "moneyWorldNarrationProduction.js"
));

try {
  if (!plan.MONEY_WORLD_NARRATION_PLAN_VALIDATION.valid) {
    throw new Error(
      "Narration production plan is invalid: " +
      plan.MONEY_WORLD_NARRATION_PLAN_VALIDATION.errors.join("; ")
    );
  }

  const stageArg = process.argv.find((arg) => arg.startsWith("--stage="));
  const outArg = process.argv.find((arg) => arg.startsWith("--out="));
  const requestedStage = stageArg?.slice("--stage=".length) ?? "1";

  let batch;
  if (/^\d+$/.test(requestedStage)) {
    const order = Number(requestedStage);
    batch = plan.MONEY_WORLD_NARRATION_STAGE_BATCHES.find((item) => item.stageOrder === order);
  } else {
    batch = plan.getMoneyWorldNarrationStageBatch(requestedStage);
  }

  if (!batch) {
    throw new Error("Unknown narration Stage batch: " + requestedStage);
  }

  const entriesById = new Map(
    production.MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES.map((entry) => [entry.cueId, entry])
  );

  const packet = {
    version: plan.MONEY_WORLD_NARRATION_PLAN_VERSION,
    voicePolicy: plan.MONEY_WORLD_NARRATION_VOICE_POLICY,
    batch: {
      id: batch.id,
      stageId: batch.stageId,
      stageOrder: batch.stageOrder,
      status: batch.status,
      generationAuthorized: batch.generationAuthorized,
      cueCount: batch.cueCount,
      approvedCueCount: batch.approvedCueCount
    },
    productionInstruction: batch.generationAuthorized
      ? "Audio generation may proceed for this Stage batch, but every cue still requires explicit review/approval."
      : "STOP: audio generation is not authorized. Resolve and approve final voice identity first.",
    requiredApprovalFields: [
      "providerOrSource",
      "redistribution-approved rights",
      "reviewedBy",
      "reviewedAt",
      "pronunciationReviewed",
      "pacingReviewed",
      "loudnessReviewed",
      "mobilePlaybackReviewed"
    ],
    cues: batch.cueIds.map((cueId) => {
      const entry = entriesById.get(cueId);
      if (!entry) throw new Error("Batch references missing narration entry: " + cueId);
      return {
        cueId: entry.cueId,
        kind: entry.kind,
        speaker: entry.speaker,
        locale: entry.locale,
        text: entry.text,
        textFingerprint: entry.textFingerprint,
        expectedSrc: entry.expectedSrc,
        status: entry.status,
        productionSrc: entry.productionSrc
      };
    })
  };

  if (outArg) {
    const output = path.resolve(root, outArg.slice("--out=".length));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(packet, null, 2) + "\n", "utf8");
    console.log("Wrote narration Stage packet: " + path.relative(root, output));
  } else {
    process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
  }

  console.error(
    "Narration batch " + batch.id +
    ": " + batch.cueCount + " cues, " +
    batch.approvedCueCount + " approved, status=" + batch.status +
    ", generationAuthorized=" + batch.generationAuthorized
  );
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
