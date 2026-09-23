import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".world-narration-provider-pilot-dist");
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

  if (!pilotModule.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION.valid) {
    throw new Error(
      "Narration provider pilot invalid: " +
      pilotModule.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION.errors.join("; ")
    );
  }

  const pilot = pilotModule.MONEY_WORLD_NARRATION_PROVIDER_PILOT;
  const packet = {
    version: pilot.version,
    state: pilot.state,
    providerStatus: pilot.providerStatus,
    generationAuthorized: pilot.generationAuthorized,
    output: {
      root: pilot.outputRoot,
      public: pilot.publicOutput,
      production: pilot.productionOutput,
      runtimeActive: pilot.runtimeActive,
      registryAutoApproval: pilot.registryAutoApproval
    },
    decisionRequired: [
      "final narration identity: Gian/Naya roles or explicitly approved mascot narrator",
      "provider / recording source",
      "provider model or recording method",
      "voice identity",
      "source terms",
      "commercial-use rights",
      "redistribution rights",
      "AI disclosure decision",
      "reuse boundary across future Worlds"
    ],
    productionInstruction:
      "STOP: provider/voice decision is not approved. This packet is review scope only; do not generate permanent audio.",
    cues: pilot.cues.map((cue) => ({
      cueId: cue.cueId,
      stageId: cue.stageId,
      kind: cue.kind,
      speaker: cue.speaker,
      locale: cue.locale,
      text: cue.text,
      textFingerprint: cue.textFingerprint,
      expectedSrc: cue.expectedSrc,
      status: cue.status
    }))
  };

  const outArg = process.argv.find((arg) => arg.startsWith("--out="));
  if (outArg) {
    const output = path.resolve(root, outArg.slice("--out=".length));
    mkdirSync(path.dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(packet, null, 2) + "\n", "utf8");
    console.log("Wrote narration provider pilot packet: " + path.relative(root, output));
  } else {
    process.stdout.write(JSON.stringify(packet, null, 2) + "\n");
  }
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
