import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const spec = JSON.parse(readFileSync(path.join(root, "src", "lib", "data", "english-narration-pilot-spec.json"), "utf8"));
const registryPath = path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json");
const registryBefore = readFileSync(registryPath);
const script = path.join(root, "scripts", "review-english-narration-pilot.mjs");
const testOutputRoot = `internal/test-fixtures/english-narration-pilot-review-${process.pid}`;
const voice = "marin";
const outDir = path.join(root, testOutputRoot, `${spec.provider.model}__${voice}`);
const manifestPath = path.join(outDir, "pilot-manifest.json");
const reviewPath = path.join(outDir, "pilot-human-review.json");

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "test",
      MAINLAGI_NARRATION_PILOT_TEST_OUTPUT_ROOT: testOutputRoot
    },
    encoding: "utf8"
  });
}

try {
  mkdirSync(outDir, { recursive: true });
  const items = spec.items.map((item, index) => {
    const bytes = Buffer.alloc(1024 + index, index + 1);
    bytes.write("ID3", 0, "ascii");
    const filePath = path.join(outDir, `${item.activityId}-candidate.mp3`);
    writeFileSync(filePath, bytes);
    return {
      activityId: item.activityId,
      transcript: item.transcript,
      file: path.relative(root, filePath).split(path.sep).join("/"),
      bytes: bytes.length,
      sha256: digest(bytes),
      contentType: "audio/mpeg"
    };
  });

  const manifest = {
    generatedAt: new Date(0).toISOString(),
    provider: spec.provider.name,
    model: spec.provider.model,
    voice,
    outputFormat: spec.provider.outputFormat,
    production: false,
    runtimeActive: false,
    registryUpdated: false,
    humanReviewRequired: true,
    aiDisclosureRequired: true,
    sourceDocs: spec.provider.sourceDocs,
    items
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  {
    const result = run(["--voice", voice]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Candidate integrity OK: 4\/4/);
    assert.match(result.stdout, /Production registry, public audio, and runtime remain unchanged/);
  }

  {
    const result = run(["--voice", voice, "--write-template"]);
    assert.equal(result.status, 0, result.stderr);
    assert(existsSync(reviewPath));
    assert.match(result.stdout, /Nothing was approved or activated/);
  }

  {
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    review.decision = "accepted";
    review.reviewer = { name: "QA Reviewer", reviewedAt: "2026-09-22T12:00:00.000Z" };
    review.attestation.listenedToExactFiles = true;
    writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
    const result = run(["--voice", voice, "--validate-review"]);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /accepted decision requires every rubric check/);
  }

  {
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    for (const item of Object.values(review.items)) {
      item.exactWordFidelity = "pass";
      item.pronunciation = "pass";
      item.childLearningPace = "pass";
      item.audioCleanliness = "pass";
    }
    writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
    const result = run(["--voice", voice, "--validate-review"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /HUMAN ACCEPTED local candidate set/);
    assert.match(result.stdout, /NOT production approval/);
  }

  {
    const first = spec.items[0];
    const filePath = path.join(outDir, `${first.activityId}-candidate.mp3`);
    const bytes = readFileSync(filePath);
    bytes[bytes.length - 1] ^= 0xff;
    writeFileSync(filePath, bytes);
    const result = run(["--voice", voice]);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /SHA-256 differs from manifest/);
  }

  assert.deepEqual(readFileSync(registryPath), registryBefore, "review tooling must never mutate the production registry");
  console.log("English narration human-review gate tests passed: exact candidate integrity, non-overwriting review template, complete human acceptance rubric, stale/tampered candidate rejection, and zero production-registry mutation.");
} finally {
  rmSync(path.join(root, testOutputRoot), { recursive: true, force: true });
}
