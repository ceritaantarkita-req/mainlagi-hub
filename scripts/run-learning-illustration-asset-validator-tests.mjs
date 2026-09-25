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

const CLEAR_KEYS = [
  "action.jump",
  "animal.bird",
  "animal.cat",
  "animal.fish",
  "body.head",
  "feature.beak",
  "feature.cactus-thick-stem",
  "feature.gills",
  "object.apple",
  "object.ball",
  "object.cup",
  "object.house",
  "object.toy-block",
  "object.umbrella"
];
const HELD_KEYS = ["object.raincoat", "object.towel", "vehicle.car"];

assert.equal(sourceRegistry.version, 2, "production semantic registry must use SVG-aware schema v2");
assert.equal(sourceRegistry.preferredProductionFormat, "svg");
assert.equal(sourceRegistry.runtimeActivation, "off");
for (const key of CLEAR_KEYS) {
  const record = sourceRegistry.items[key];
  assert.equal(record.lifecycle, "approved", `${key} stays semantically/provenance approved`);
  assert.equal(record.productionAssets.webp?.status, "approved", `${key} preserves WebP production history`);
  assert.equal(record.productionAssets.svg?.status, "migration-ready", `${key} must be ready for Session 11 SVG promotion`);
  assert.equal(
    record.productionAssets.svg?.expectedPath,
    `/artwork/learning-illustrations/${key.replaceAll(".", "-")}-v1.svg`
  );
  assert.equal(record.productionAssets.svg?.path, null);
  assert.equal(record.productionAssets.svg?.sha256, null);
}
for (const key of HELD_KEYS) {
  const record = sourceRegistry.items[key];
  assert.equal(record.lifecycle, "review-required", `${key} remains held`);
  assert.equal(record.productionAssets.webp, null, `${key} must not gain WebP production binding`);
  assert.equal(record.productionAssets.svg?.status, "held", `${key} SVG slot remains held`);
  assert.equal(record.productionAssets.svg?.path, null);
  assert.equal(record.productionAssets.svg?.sha256, null);
  assert.equal(record.provenance?.redistributionAllowed, false);
}

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
      reviewedAt: "2026-09-25"
    };
    record.semanticReview = {
      status: "pending",
      childReadable: null,
      reviewedAt: null,
      notes: "Test fixture pending."
    };
    record.lifecycle = "review-required";
    record.productionAssets.webp = null;
    record.productionAssets.svg.status = "held";
    record.productionAssets.svg.path = null;
    record.productionAssets.svg.sha256 = null;
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

function safeSvg() {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M20 20h216v216H20z"/></svg>',
    "utf8"
  );
}

function unsafeSvg() {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><script>alert(1)</script></svg>',
    "utf8"
  );
}

function approveWebp(registry, semanticKey, buffer) {
  const record = registry.items[semanticKey];
  const slug = semanticKey.replaceAll(".", "-");
  record.lifecycle = "approved";
  record.productionAssets.webp = {
    status: "approved",
    format: "webp",
    path: `/artwork/learning-illustrations/${slug}-v1.webp`,
    sha256: createHash("sha256").update(buffer).digest("hex")
  };
  record.productionAssets.svg.status = "migration-ready";
  record.productionAssets.svg.path = null;
  record.productionAssets.svg.sha256 = null;
  record.provenance = {
    status: "owned",
    source: "Mainlagi test fixture",
    rightsHolder: "Mainlagi test owner",
    licenseBasis: "Project-owned regression fixture",
    redistributionAllowed: true,
    reviewedAt: "2026-09-25"
  };
  record.semanticReview = {
    status: "approved",
    childReadable: true,
    reviewedAt: "2026-09-25",
    notes: "Fixture semantic review approved."
  };
  return record;
}

function approveSvg(registry, semanticKey, buffer) {
  const record = registry.items[semanticKey];
  record.productionAssets.svg.status = "approved";
  record.productionAssets.svg.path = record.productionAssets.svg.expectedPath;
  record.productionAssets.svg.sha256 = createHash("sha256").update(buffer).digest("hex");
  return record;
}

function createFixture(registry, productionFiles = {}, candidateFiles = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-learning-illustrations-v2-"));
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
      if (expected.message) assert.match(output, expected.message);
    } else {
      assert.notEqual(result.status, 0, `${name} should fail`);
      assert.match(output, expected.message, `${name} should explain its failure:\n${output}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

runFixture(
  "v2 review-required baseline",
  baselineRegistry(),
  {},
  { ok: true, message: /0 approved WebP history asset\(s\); 0 approved SVG asset\(s\); 0 SVG migration-ready slot\(s\); 17 held fail-closed slot\(s\)/ }
);

{
  const registry = baselineRegistry();
  registry.version = 1;
  runFixture(
    "legacy registry header rejected",
    registry,
    {},
    { ok: false, message: /version=2/ }
  );
}

{
  const registry = baselineRegistry();
  const candidate = makeVp8lMetadataFixture(256, 256, true);
  registry.items["object.apple"].candidate = {
    sourcePath: "/artwork/activity-previews/apple.webp",
    reviewStatus: "visually-suitable",
    reviewedAt: "2026-09-25",
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
    "stray WebP production binary",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.webp": binary } },
    { ok: false, message: /WebP exists without an approved WebP registry binding/ }
  );
}

{
  const registry = baselineRegistry();
  registry.items["object.apple"].productionAssets.svg.status = "migration-ready";
  runFixture(
    "held slot cannot become migration-ready",
    registry,
    {},
    { ok: false, message: /non-approved illustration SVG status must be held/ }
  );
}

{
  const registry = baselineRegistry();
  registry.items["object.apple"].productionAssets.svg.path =
    registry.items["object.apple"].productionAssets.svg.expectedPath;
  runFixture(
    "non-approved SVG path must remain null",
    registry,
    {},
    { ok: false, message: /non-approved SVG must keep path=null/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const record = approveWebp(registry, "object.apple", webp);
  record.provenance.rightsHolder = null;
  runFixture(
    "approved missing rights holder",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /requires rightsHolder/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const record = approveWebp(registry, "object.apple", webp);
  runFixture(
    "approved missing WebP history binary",
    registry,
    {},
    { ok: false, message: /approved WebP production asset does not exist/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, false);
  const record = approveWebp(registry, "object.apple", webp);
  runFixture(
    "opaque approved WebP rejected",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /WebP must contain alpha\/transparency data/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(96, 96, true);
  const record = approveWebp(registry, "object.apple", webp);
  runFixture(
    "undersized approved WebP rejected",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /WebP width 96px is outside/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const record = approveWebp(registry, "object.apple", webp);
  record.productionAssets.webp.sha256 = "0".repeat(64);
  runFixture(
    "approved WebP hash mismatch",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /WebP SHA-256 mismatch/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const record = approveWebp(registry, "object.apple", webp);
  record.productionAssets.svg.path = record.productionAssets.svg.expectedPath;
  runFixture(
    "migration-ready SVG cannot carry production path",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /non-approved SVG must keep path=null/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const svg = safeSvg();
  const record = approveWebp(registry, "object.apple", webp);
  approveSvg(registry, "object.apple", svg);
  runFixture(
    "approved SVG must exist",
    registry,
    { productionFiles: { [record.productionAssets.webp.path]: webp } },
    { ok: false, message: /approved SVG production asset does not exist|approved SVG file is missing/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const svg = unsafeSvg();
  const record = approveWebp(registry, "object.apple", webp);
  approveSvg(registry, "object.apple", svg);
  runFixture(
    "unsafe approved SVG rejected",
    registry,
    {
      productionFiles: {
        [record.productionAssets.webp.path]: webp,
        [record.productionAssets.svg.path]: svg
      }
    },
    { ok: false, message: /forbidden active\/unsafe SVG content/ }
  );
}

{
  const registry = baselineRegistry();
  const svg = safeSvg();
  runFixture(
    "stray SVG production binary",
    registry,
    { productionFiles: { "/artwork/learning-illustrations/object-apple-v1.svg": svg } },
    { ok: false, message: /unexpected\/stray SVG|without an approved SVG registry binding/ }
  );
}

{
  const registry = baselineRegistry();
  const webp = makeVp8lMetadataFixture(256, 256, true);
  const svg = safeSvg();
  const record = approveWebp(registry, "object.apple", webp);
  approveSvg(registry, "object.apple", svg);
  runFixture(
    "valid dual-format approved semantic illustration",
    registry,
    {
      productionFiles: {
        [record.productionAssets.webp.path]: webp,
        [record.productionAssets.svg.path]: svg
      }
    },
    { ok: true, message: /1 approved WebP history asset\(s\); 1 approved SVG asset\(s\)/ }
  );
}

console.log(
  "Learning illustration asset validator v2 regression passed: WebP history, SVG migration-ready/approved, security, hash, dimensions, held-key fail-closed and stray-file gates."
);
