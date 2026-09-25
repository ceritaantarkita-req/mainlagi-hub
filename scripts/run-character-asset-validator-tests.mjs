import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const validatorPath = path.join(repoRoot, "scripts", "validate-character-assets.mjs");
const IDS = ["naya", "gian", "zia", "paca", "gavi"];
const STATES = ["hero", "welcome", "pointing", "thinking", "correct", "try_again", "celebrate"];

function sha(value) {
  return createHash("sha256").update(value).digest("hex");
}

function makeVariant(id, state) {
  const slug = state.replaceAll("_", "-");
  return {
    lifecycle: "review-required",
    source: {
      driveFileId: `drive_${id}_${slug}`,
      sourceFilename: `${id}-${slug}.svg`,
      sourceSha256: sha(`source:${id}:${state}`),
      sizeBytes: 2048 + id.length + state.length,
      ambiguityStatus: "unique",
      visualInventoryReview: "identity-and-state-readable; production QA deferred"
    },
    expectedProductionPath: `/artwork/characters/${id}-${slug}-v1.svg`,
    productionPath: null,
    productionSha256: null,
    provenance: {
      status: "pending",
      sourceBasis: "Fixture project-owner-supplied SVG",
      rightsHolder: null,
      licenseBasis: null,
      redistributionAllowed: false,
      reviewedAt: "2026-09-25"
    },
    technical: {
      format: "svg",
      maxBytes: 1000000,
      requireViewBox: true,
      sourceValidation: {
        status: "passed",
        validator: "scripts/lib/svg-asset-security.mjs",
        reviewedAt: "2026-09-25"
      },
      productionSanitizationRequired: true
    }
  };
}

function makeCharacter(id) {
  return {
    identityReference: {
      driveFileId: `design_${id}`,
      sourceFilename: id === "naya" ? "kak-naya-character-design-set.svg" : `${id}-character-design-set.svg`,
      sizeBytes: 10000
    },
    variants: Object.fromEntries(STATES.map((state) => [state, makeVariant(id, state)]))
  };
}

function makeRegistry() {
  return {
    version: 2,
    scope: "mainlagi-character-svg-state-bank",
    productionDirectory: "/artwork/characters",
    sourceInventory: "docs/data/MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.json",
    characterIds: [...IDS],
    stateVocabulary: [...STATES],
    items: Object.fromEntries(IDS.map((id) => [id, makeCharacter(id)]))
  };
}

function safeSvg() {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M0 0h10v10z"/></svg>',
    "utf8"
  );
}

function unsafeSvg() {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><script>alert(1)</script></svg>',
    "utf8"
  );
}

function approve(registry, id, state, buffer = safeSvg()) {
  const variant = registry.items[id].variants[state];
  variant.lifecycle = "approved";
  variant.productionPath = variant.expectedProductionPath;
  variant.productionSha256 = createHash("sha256").update(buffer).digest("hex");
  variant.provenance = {
    ...variant.provenance,
    status: "owned",
    rightsHolder: "Mainlagi fixture owner",
    licenseBasis: "Fixture-owned source",
    redistributionAllowed: true
  };
  return variant;
}

function createFixture(registry, publicFiles = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-character-assets-v2-"));
  const registryDir = path.join(root, "src", "lib", "data");
  mkdirSync(registryDir, { recursive: true });
  writeFileSync(path.join(registryDir, "character-asset-provenance.json"), JSON.stringify(registry, null, 2));

  for (const [publicPath, buffer] of Object.entries(publicFiles)) {
    const absolute = path.join(root, "public", publicPath.replace(/^\/+/, ""));
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(absolute, buffer);
  }

  return root;
}

function runFixture(name, registry, publicFiles, expected) {
  const root = createFixture(registry, publicFiles);
  try {
    const result = spawnSync(process.execPath, [validatorPath], {
      cwd: repoRoot,
      env: { ...process.env, CHARACTER_ASSET_ROOT: root },
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
  makeRegistry(),
  {},
  { ok: true, message: /5 characters \/ 35 SVG state slots; 0 approved/ }
);

{
  const registry = makeRegistry();
  delete registry.items.gavi;
  runFixture(
    "missing character",
    registry,
    {},
    { ok: false, message: /registry must contain exactly characters/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.extra = makeCharacter("extra");
  runFixture(
    "unknown character",
    registry,
    {},
    { ok: false, message: /registry must contain exactly characters/ }
  );
}

{
  const registry = makeRegistry();
  delete registry.items.naya.variants.hero;
  runFixture(
    "missing state",
    registry,
    {},
    { ok: false, message: /variants must contain exactly states/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.naya.variants.wave = makeVariant("naya", "wave");
  runFixture(
    "unknown state",
    registry,
    {},
    { ok: false, message: /variants must contain exactly states/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.gavi.variants.hero.source.driveFileId =
    registry.items.paca.variants.hero.source.driveFileId;
  runFixture(
    "duplicate source Drive ID",
    registry,
    {},
    { ok: false, message: /source\.driveFileId already assigned/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.gavi.variants.hero.source.sourceSha256 = "abc";
  runFixture(
    "invalid source hash",
    registry,
    {},
    { ok: false, message: /source\.sourceSha256 must be lowercase SHA-256/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.gavi.variants.hero.expectedProductionPath =
    "/artwork/characters/gavi-wrong-v1.svg";
  runFixture(
    "wrong canonical path",
    registry,
    {},
    { ok: false, message: /expectedProductionPath must be \/artwork\/characters\/gavi-hero-v1\.svg/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.gavi.variants.hero.productionPath =
    registry.items.gavi.variants.hero.expectedProductionPath;
  runFixture(
    "non-approved production path",
    registry,
    {},
    { ok: false, message: /non-approved variant must keep productionPath=null/ }
  );
}

{
  const registry = makeRegistry();
  const buffer = safeSvg();
  const variant = approve(registry, "naya", "hero", buffer);
  variant.provenance.rightsHolder = null;
  runFixture(
    "approved missing rights holder",
    registry,
    { [variant.productionPath]: buffer },
    { ok: false, message: /approved variant requires rightsHolder/ }
  );
}

{
  const registry = makeRegistry();
  const buffer = safeSvg();
  const variant = approve(registry, "naya", "hero", buffer);
  runFixture(
    "approved missing production SVG",
    registry,
    {},
    { ok: false, message: /approved production SVG does not exist/ }
  );
}

{
  const registry = makeRegistry();
  const buffer = unsafeSvg();
  const variant = approve(registry, "naya", "hero", buffer);
  runFixture(
    "approved unsafe SVG",
    registry,
    { [variant.productionPath]: buffer },
    { ok: false, message: /forbidden active\/unsafe SVG content/ }
  );
}

{
  const registry = makeRegistry();
  const buffer = safeSvg();
  const variant = approve(registry, "naya", "hero", buffer);
  variant.productionSha256 = "0".repeat(64);
  runFixture(
    "approved hash mismatch",
    registry,
    { [variant.productionPath]: buffer },
    { ok: false, message: /production SHA-256 mismatch/ }
  );
}

{
  const registry = makeRegistry();
  const buffer = safeSvg();
  const variant = approve(registry, "naya", "hero", buffer);
  runFixture(
    "valid approved SVG state",
    registry,
    { [variant.productionPath]: buffer },
    { ok: true, message: /1 approved production variant/ }
  );
}

{
  const registry = makeRegistry();
  runFixture(
    "stray public SVG",
    registry,
    { "/artwork/characters/stray.svg": safeSvg() },
    { ok: false, message: /unexpected\/stray SVG|without an approved provenance record/ }
  );
}

{
  const registry = makeRegistry();
  runFixture(
    "non-SVG file in v2 production tree",
    registry,
    { "/artwork/characters/legacy.webp": Buffer.from("not-a-real-webp") },
    { ok: false, message: /production tree is SVG-only/ }
  );
}

console.log(
  "Character asset validator v2 regression passed: exact 5x7 schema, source identity/hash, provenance lifecycle, canonical SVG path, sanitizer/hash, and stray-file gates."
);
