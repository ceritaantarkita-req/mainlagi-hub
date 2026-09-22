import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".world-narration-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(
  process.execPath,
  [tscBin, "-p", "tsconfig.learning-tests.json", "--outDir", outDir],
  { cwd: root, stdio: "inherit" }
);
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const production = require(path.join(
  outDir,
  "src",
  "lib",
  "learning",
  "world",
  "moneyWorldNarrationProduction.js"
));

try {
  const validation = production.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION;
  const summary = production.MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY;
  const entries = production.MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES;

  if (!validation.valid) {
    throw new Error("Narration production manifest is invalid: " + validation.errors.join("; "));
  }

  const missingApprovedAssets = entries
    .filter((entry) => entry.status === "approved")
    .filter((entry) => !entry.productionSrc || !existsSync(path.join(root, "public" + entry.productionSrc)));

  if (missingApprovedAssets.length) {
    throw new Error(
      "Approved narration assets are missing: " +
      missingApprovedAssets.map((entry) => entry.cueId + " -> " + entry.productionSrc).join("; ")
    );
  }

  const cueSheet = {
    version: production.MONEY_WORLD_NARRATION_PRODUCTION_VERSION,
    generatedFromRepositoryContract: true,
    summary,
    entries: entries.map((entry) => ({
      cueId: entry.cueId,
      stageId: entry.stageId,
      kind: entry.kind,
      speaker: entry.speaker,
      locale: entry.locale,
      text: entry.text,
      textFingerprint: entry.textFingerprint,
      expectedSrc: entry.expectedSrc,
      status: entry.status
    }))
  };

  const outArg = process.argv.find((arg) => arg.startsWith("--out="));
  if (outArg) {
    const output = path.resolve(root, outArg.slice("--out=".length));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(cueSheet, null, 2) + "\n", "utf8");
    console.log("Wrote narration cue sheet: " + path.relative(root, output));
  } else {
    process.stdout.write(JSON.stringify(cueSheet, null, 2) + "\n");
  }

  console.error(
    "Narration production: " +
    summary.approved + "/" + summary.total +
    " approved, " + summary.pending + " pending, productionReady=" + summary.productionReady
  );
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
