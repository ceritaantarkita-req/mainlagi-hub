import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { validateWorldMoneyNarrationAssetGate } from "./world-money-narration-asset-gate.mjs";

const root = process.cwd();
const outDir = path.join(root, ".world-narration-asset-dist");
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
  const production = require(path.join(
    outDir,
    "src",
    "lib",
    "learning",
    "world",
    "moneyWorldNarrationProduction.js"
  ));

  if (!production.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.valid) {
    throw new Error(
      "Narration production manifest invalid: " +
      production.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.errors.join("; ")
    );
  }

  const result = validateWorldMoneyNarrationAssetGate({
    root,
    entries: production.MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES,
    expectedCount: 88
  });

  if (!result.valid) {
    for (const error of result.errors) console.error("world narration assets: " + error);
    process.exitCode = 1;
  } else {
    console.log(
      "World narration assets OK: " +
      result.approvedPaths.length +
      " approved production asset(s); " +
      (88 - result.approvedPaths.length) +
      " blocked/pending slot(s)"
    );
  }
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
