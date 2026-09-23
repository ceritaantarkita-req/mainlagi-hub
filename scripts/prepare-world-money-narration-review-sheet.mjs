import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".world-narration-review-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(
  process.execPath,
  [tscBin, "-p", "tsconfig.learning-tests.json", "--outDir", outDir],
  { cwd: root, stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);

try {
  const pilotModule = require(path.join(
    outDir,
    "src",
    "lib",
    "learning",
    "world",
    "moneyWorldNarrationPilot.js"
  ));
  const reviewModule = require(path.join(
    outDir,
    "src",
    "lib",
    "learning",
    "world",
    "moneyWorldNarrationReview.js"
  ));

  if (!reviewModule.MONEY_WORLD_NARRATION_REVIEW_VALIDATION.valid) {
    throw new Error(
      "Narration review contract invalid: " +
      reviewModule.MONEY_WORLD_NARRATION_REVIEW_VALIDATION.errors.join("; ")
    );
  }

  const pilot = pilotModule.MONEY_WORLD_NARRATION_PROVIDER_PILOT;
  const packet = {
    version: reviewModule.MONEY_WORLD_NARRATION_REVIEW_VERSION,
    pilotVersion: pilot.version,
    providerStatus: pilot.providerStatus,
    generationAuthorized: pilot.generationAuthorized,
    reviewInstruction:
      "Do not mark the pilot accepted until every one of the four cues passes every blocking dimension and the provider/voice/source/rights decision has been explicitly approved.",
    blockingDimensions: reviewModule.MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS,
    records: reviewModule.createPendingMoneyWorldNarrationPilotReviewRecords()
  };

  const outArg = process.argv.find((arg) => arg.startsWith("--out="));
  if (outArg) {
    const output = path.resolve(root, outArg.slice("--out=".length));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(packet, null, 2) + "\n", "utf8");
    console.log("Wrote narration human-review sheet: " + path.relative(root, output));
  } else {
    process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
  }

  console.error(
    "Narration pilot review: " +
    packet.records.length +
    " cues, " +
    packet.blockingDimensions.length +
    " blocking dimensions, providerStatus=" +
    pilot.providerStatus +
    ", generationAuthorized=" +
    pilot.generationAuthorized
  );
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
