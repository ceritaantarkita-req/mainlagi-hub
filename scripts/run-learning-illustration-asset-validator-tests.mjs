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
const EXPECTED_SVG_SHA256 = {
  "action.jump": "5c8bb179f4b6a83bdde993f6598847f656a535a46d1009470d7d6500a5e5f522",
  "animal.bird": "7f48db66d50fb6c892353120339dd950643e69385e8872134930cf5e6143a927",
  "animal.cat": "d1d533398e9141438ec280f1c8b4c65f52320a91d5881b13d68e298cbce47c38",
  "animal.fish": "34fd1640e25cf078df41f0cae2532493bc2176047c72856a5634ccb91f90ae8f",
  "body.head": "f0f45658fc81df468075cccbc5d347ddc6a1fd745941d2b2b1c184ed7f63720b",
  "feature.beak": "0b79a6f355976fb24ae4f8b7a999ad0e6c574d9d2287206ea154a2d9842e4e3e",
  "feature.cactus-thick-stem": "34a5c823e83fc0543948e91cf9fb77e3cdc21f49b84d4a3f78c694f1e78874ff",
  "feature.gills": "49e33a279d0284333a7cecf4d80be22f985e4e718d750fb9a152089cfd1a0c31",
  "object.apple": "2d9b41b217aa4b735ab32dd73b85413473a1e9fe08c8059e3a467842d493093b",
  "object.ball": "63b14a3422e53da84ef31617c0d3762e136a280b9bee805dfb62ac0b3108c134",
  "object.cup": "1d36c427b383746c0cc49fc367bf9784a64690e3f2f6b0e196b38a3910084296",
  "object.house": "8180f78817b0a611421220cb17effe9002db7a17d5ad36ba640297fd7a54a31f",
  "object.toy-block": "3719ccc9e0c558e930e6b273fa64cd03b0ad5999888c76779d17fb93b0650b87",
  "object.umbrella": "e2fe6b828c33c3349224dac67d8efba2ff68e38611afcebdb27079007b58059e"
};

assert.equal(sourceRegistry.version, 2, "production semantic registry must use SVG-aware schema v2");
assert.equal(sourceRegistry.preferredProductionFormat, "svg");
assert.equal(sourceRegistry.runtimeActivation, "off");
for (const key of CLEAR_KEYS) {
  const record = sourceRegistry.items[key];
  assert.equal(record.lifecycle, "approved", `${key} stays semantically/provenance approved`);
  assert.equal(record.productionAssets.webp?.status, "approved", `${key} preserves WebP production history`);
  assert.equal(record.productionAssets.svg?.status, "approved", `${key} must be production-approved after Session 11`);
  assert.equal(
    record.productionAssets.svg?.expectedPath,
    `/artwork/learning-illustrations/${key.replaceAll(".", "-")}-v1.svg`
  );
  assert.equal(record.productionAssets.svg?.path, record.productionAssets.svg?.expectedPath);
  assert.equal(record.productionAssets.svg?.sha256, EXPECTED_SVG_SHA256[key]);
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
  "Learning illustration asset validator v2 regression passed: 14 exact approved semantic SVG bindings, preserved WebP history, future migration-ready/approved fixtures, security, hash, dimensions, held-key fail-closed and stray-file gates."
);
