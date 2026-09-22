import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const validatorPath = path.join(repoRoot, "scripts", "validate-english-narration-assets.mjs");
const canonicalRegistry = JSON.parse(
  readFileSync(path.join(repoRoot, "src", "lib", "data", "english-narration-asset-provenance.json"), "utf8")
);
const TEST_ID = "english-listen-bird";

function cloneRegistry() {
  return structuredClone(canonicalRegistry);
}

function mp3Fixture(size = 2048) {
  const buffer = Buffer.alloc(size, 0);
  buffer.write("ID3", 0, "ascii");
  buffer[3] = 4;
  return buffer;
}

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function approve(registry, id, buffer) {
  const record = registry.items[id];
  record.lifecycle = "approved";
  record.productionPath = record.expectedProductionPath;
  record.provider = {
    status: "reviewed",
    name: "Fixture TTS",
    model: "fixture-model-v1",
    voice: "fixture-en-child",
    sourceTerms: "https://example.invalid/fixture-terms",
    rightsBasis: "Fixture output approved for repository redistribution",
    commercialUseAllowed: true,
    redistributionAllowed: true,
    aiDisclosureRequired: true,
    reviewedAt: "2026-09-22"
  };
  record.review = {
    pronunciationStatus: "approved",
    childLearningStatus: "approved",
    reviewedBy: "fixture-reviewer",
    reviewedAt: "2026-09-22"
  };
  record.technical.sha256 = digest(buffer);
  return record;
}

function createFixture(registry, binaries = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-narration-assets-"));
  const registryDir = path.join(root, "src", "lib", "data");
  const audioDir = path.join(root, "public", "audio", "narration", "en");
  mkdirSync(registryDir, { recursive: true });
  mkdirSync(audioDir, { recursive: true });
  writeFileSync(
    path.join(registryDir, "english-narration-asset-provenance.json"),
    JSON.stringify(registry, null, 2)
  );
  for (const [name, buffer] of Object.entries(binaries)) {
    writeFileSync(path.join(audioDir, name), buffer);
  }
  return root;
}

function runFixture(name, registry, binaries, expected) {
  const root = createFixture(registry, binaries);
  try {
    const result = spawnSync(process.execPath, [validatorPath], {
      cwd: repoRoot,
      env: { ...process.env, NARRATION_ASSET_ROOT: root },
      encoding: "utf8"
    });
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    if (expected.ok) {
      assert.equal(result.status, 0, `${name} should pass:\n${output}`);
    } else {
      assert.notEqual(result.status, 0, `${name} should fail`);
      assert.match(output, expected.message, `${name} should explain its failure:\n${output}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

assert.equal(Object.keys(canonicalRegistry.items).length, 27, "canonical narration registry must cover all 27 reviewed English listening activities");
runFixture("review-required baseline", cloneRegistry(), {}, { ok: true });

runFixture(
  "stray public narration binary",
  cloneRegistry(),
  { "english-listen-bird-v1.mp3": mp3Fixture() },
  { ok: false, message: /without an approved provenance record/ }
);

{
  const registry = cloneRegistry();
  const buffer = mp3Fixture();
  const record = approve(registry, TEST_ID, buffer);
  record.provider.commercialUseAllowed = false;
  runFixture(
    "approved asset without commercial-use clearance",
    registry,
    { "english-listen-bird-v1.mp3": buffer },
    { ok: false, message: /requires commercialUseAllowed=true/ }
  );
}

{
  const registry = cloneRegistry();
  const buffer = mp3Fixture();
  const record = approve(registry, TEST_ID, buffer);
  record.review.pronunciationStatus = "pending";
  runFixture(
    "approved asset without pronunciation review",
    registry,
    { "english-listen-bird-v1.mp3": buffer },
    { ok: false, message: /requires pronunciation and child-learning review approval/ }
  );
}

{
  const registry = cloneRegistry();
  const buffer = mp3Fixture();
  const record = approve(registry, TEST_ID, buffer);
  record.technical.sha256 = "0".repeat(64);
  runFixture(
    "approved asset with checksum drift",
    registry,
    { "english-listen-bird-v1.mp3": buffer },
    { ok: false, message: /sha256 mismatch/ }
  );
}

{
  const registry = cloneRegistry();
  const buffer = Buffer.alloc(2048, 0);
  approve(registry, TEST_ID, buffer);
  runFixture(
    "approved non-mp3 payload",
    registry,
    { "english-listen-bird-v1.mp3": buffer },
    { ok: false, message: /does not look like an MP3/ }
  );
}

{
  const registry = cloneRegistry();
  const buffer = mp3Fixture();
  approve(registry, TEST_ID, buffer);
  runFixture(
    "valid approved narration asset",
    registry,
    { "english-listen-bird-v1.mp3": buffer },
    { ok: true }
  );
}

console.log("English narration asset validator regression passed: 27-slot fail-closed provenance, commercial-use, human-review, MP3, and checksum gates.");
