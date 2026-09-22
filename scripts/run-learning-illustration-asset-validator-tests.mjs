import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const validatorPath = path.join(repoRoot, "scripts", "validate-learning-illustration-assets.mjs");
const sourceRegistry = JSON.parse(
  readFileSync(path.join(repoRoot, "src", "lib", "data", "learning-illustration-asset-provenance.json"), "utf8")
);

function baselineRegistry() {
  const registry = structuredClone(sourceRegistry);
  for (const record of Object.values(registry.items)) {
    record.candidate = {
      sourcePath: null,
      reviewStatus: "none",
      reviewedAt: null,
      notes: "Fixture has no candidate source."
    };
    record.provenance = {
      status: "pending",
      source: "Test fixture",
      rightsHolder: null,
      licenseBasis: null,
      redistributionAllowed: false,
      reviewedAt: "2026-09-23"
    };
    record.semanticReview = {
      status: "pending",
      childReadable: null,
      reviewedAt: null,
      notes: "Test fixture pending."
    };
    record.lifecycle = "review-required";
    record.productionPath = null;
    record.productionSha256 = null;
  }
  return registry;
}

function makeVp8lMetadataFixture(width, height, hasAlpha) {
  const data = Buffer.alloc(5);
  data[0] = 0x2f;
  const bits =
    ((width - 1) & 0x3fff) |
    (((height - 1) & 0x3fff) << 14) |
    (hasAlpha ? 0x10000000 : 0);
  data.writeUInt32LE(bits >>> 0, 1);

  const total = 12 + 8 + 6;
  const buffer = Buffer.alloc(total);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(total - 8, 4);
  buffer.write("WEBP", 8, "ascii");
  buffer.write("VP8L", 12, "ascii");
  buffer.writeUInt32LE(data.length, 16);
  data.copy(buffer, 20);
  return buffer;
}

function approve(registry, semanticKey, buffer) {
  const record = registry.items[semanticKey];
  record.lifecycle = "approved";
  record.productionPath = record.expectedProductionPath;
  record.productionSha256 = createHash("sha256").update(buffer).digest("hex");
  record.provenance = {
    status: "owned",
    source: "Mainlagi test fixture",
    rightsHolder: "Mainlagi test owner",
    licenseBasis: "Project-owned regression fixture",
    redistributionAllowed: true,
    reviewedAt: "2026-09-23"
  };
  record.semanticReview = {
    status: "approved",
    childReadable: true,
    reviewedAt: "2026-09-23",
    notes: "Fixture semantic review approved."
  };
}

function createFixture(registry, productionFiles = {}, candidateFiles = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-learning-illustrations-"));
  const registryDir = path.join(root, "src", "lib", "data");
  const productionDir = path.join(root, "public", "artwork", "learning-illustrations");
  mkdirSync(registryDir, { recursive: true });
  mkdirSync(productionDir, { recursive: true });
  writeFileSync(
    path.join(registryDir, "learning-illustration-asset-provenance.json"),
    JSON.stringify(registry, null, 2)
  );

  for (const [publicPath, buffer] of Object.entries({ ...candidateFiles, ...productionFiles })) {
    const absolute = path.join(root, "public", publicPath.replace(/^\//, ""));
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(absolute, buffer);
  }
  return root;
}

function runFixture(name, registry, files, expected) {
  const root = createFixture(registry, files.productionFiles ?? {}, files.candidateFiles ?? {});
  try {
    const result = spawnSync(process.execPath, [validatorPath], {
      cwd: repoRoot,
      env: { ...process.env, LEARNING_ILLUSTRATION_ASSET_ROOT: root },
      encoding: "utf8"
    });
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

    if (expected.ok) {
      assert.equal(result.status, 0, `${name} should pass:\n${output}`);
    } else {
      assert.notEqual(result.status, 0, `${name} should fail`);
      assert.match(output, expected.message, `${name} should explain its failure`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

runFixture("review-required baseline", baselineRegistry(), {}, { ok: true });

{
  const registry = baselineRegistry();
  const candidate = makeVp8lMetadataFixture(256, 256, true);
  registry.items["object.apple"].candidate = {
    sourcePath: "/artwork/activity-previews/apple.webp",
    reviewStatus: "visually-suitable",
    reviewedAt: "2026-09-23",
    notes: "Fixture candidate."
  };
  runFixture(
    "candidate path must exist",
    registry,
    {},
    { ok: false, message: /candidate source does not exist/ }
  );
  runFixture(
    "reviewed candidate may exist without production approval",
    registry,
    { candidateFiles: { "/artwork/activity-previews/apple.webp": candidate } },
    { ok: true }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, true);
  runFixture(
    "stray production binary",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /without an approved provenance record/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, true);
  const record = registry.items["object.apple"];
  record.lifecycle = "approved";
  record.productionPath = record.expectedProductionPath;
  record.productionSha256 = createHash("sha256").update(binary).digest("hex");
  record.provenance = {
    status: "owned",
    source: "Fixture",
    rightsHolder: null,
    licenseBasis: "Fixture basis",
    redistributionAllowed: true,
    reviewedAt: "2026-09-23"
  };
  record.semanticReview = {
    status: "approved",
    childReadable: true,
    reviewedAt: "2026-09-23",
    notes: "Approved fixture."
  };
  runFixture(
    "approved missing rights holder",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /requires rightsHolder/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, true);
  approve(registry, "object.apple", binary);
  registry.items["object.apple"].semanticReview = {
    status: "pending",
    childReadable: null,
    reviewedAt: null,
    notes: "Not reviewed."
  };
  runFixture(
    "approved lifecycle requires semantic approval",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /approved lifecycle requires approved child-readable semantic review/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, false);
  approve(registry, "object.apple", binary);
  runFixture(
    "opaque production illustration",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /must contain alpha\/transparency data/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(96, 96, true);
  approve(registry, "object.apple", binary);
  runFixture(
    "undersized production illustration",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /width 96px is outside/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, true);
  approve(registry, "object.apple", binary);
  registry.items["object.apple"].productionSha256 = "0".repeat(64);
  runFixture(
    "production hash mismatch",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /SHA-256 mismatch/ }
  );
}

{
  const registry = baselineRegistry();
  const binary = makeVp8lMetadataFixture(256, 256, true);
  approve(registry, "object.apple", binary);
  runFixture(
    "valid approved semantic illustration",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: true }
  );
}

console.log("Learning illustration asset validator regression passed: candidate, provenance, semantic review, hash, format, dimensions, alpha and stray-file gates.");
