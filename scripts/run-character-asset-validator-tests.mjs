import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const validatorPath = path.join(repoRoot, "scripts", "validate-character-assets.mjs");
const IDS = ["naya", "gian", "zia"];

function makeRecord(id) {
  return {
    lifecycle: "reference-only",
    identityReference: id === "naya" ? "kak-naya-character-design-set-v1.png" : `${id}-character-design-set-v1.png`,
    expectedProductionPath: `/artwork/characters/${id}-activity-v1.webp`,
    productionPath: null,
    provenance: {
      status: "pending",
      source: `Mainlagi project Drive identity reference: ${id}`,
      rightsHolder: null,
      licenseBasis: null,
      redistributionAllowed: false,
      reviewedAt: "2026-09-21"
    },
    technical: {
      format: "webp",
      requireAlpha: true,
      minWidth: 384,
      minHeight: 512,
      maxWidth: 2048,
      maxHeight: 2048,
      maxBytes: 1000000
    }
  };
}

function makeRegistry() {
  return {
    version: 1,
    scope: "human-activity-foreground",
    productionDirectory: "/artwork/characters",
    items: Object.fromEntries(IDS.map((id) => [id, makeRecord(id)]))
  };
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

function createFixture(registry, binaries = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-character-assets-"));
  const registryDir = path.join(root, "src", "lib", "data");
  const characterDir = path.join(root, "public", "artwork", "characters");
  mkdirSync(registryDir, { recursive: true });
  mkdirSync(characterDir, { recursive: true });
  writeFileSync(path.join(registryDir, "character-asset-provenance.json"), JSON.stringify(registry, null, 2));

  for (const [name, buffer] of Object.entries(binaries)) {
    writeFileSync(path.join(characterDir, name), buffer);
  }
  return root;
}

function runFixture(name, registry, binaries, expected) {
  const root = createFixture(registry, binaries);
  try {
    const result = spawnSync(process.execPath, [validatorPath], {
      cwd: repoRoot,
      env: { ...process.env, CHARACTER_ASSET_ROOT: root },
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

runFixture("reference-only baseline", makeRegistry(), {}, { ok: true });

runFixture(
  "stray public binary",
  makeRegistry(),
  { "naya-activity-v1.webp": makeVp8lMetadataFixture(512, 640, true) },
  { ok: false, message: /without an approved provenance record/ }
);

{
  const registry = makeRegistry();
  registry.items.naya.lifecycle = "approved";
  registry.items.naya.productionPath = registry.items.naya.expectedProductionPath;
  registry.items.naya.provenance = {
    ...registry.items.naya.provenance,
    status: "owned",
    redistributionAllowed: true,
    rightsHolder: null,
    licenseBasis: "Project-owned production derivative"
  };
  runFixture(
    "approved missing rights holder",
    registry,
    { "naya-activity-v1.webp": makeVp8lMetadataFixture(512, 640, true) },
    { ok: false, message: /requires rightsHolder/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.naya.lifecycle = "approved";
  registry.items.naya.productionPath = registry.items.naya.expectedProductionPath;
  registry.items.naya.provenance = {
    ...registry.items.naya.provenance,
    status: "owned",
    redistributionAllowed: true,
    rightsHolder: "Mainlagi project owner",
    licenseBasis: "Project-owned production derivative"
  };
  runFixture(
    "opaque production asset",
    registry,
    { "naya-activity-v1.webp": makeVp8lMetadataFixture(512, 640, false) },
    { ok: false, message: /must contain alpha\/transparency data/ }
  );
}

{
  const registry = makeRegistry();
  registry.items.naya.lifecycle = "approved";
  registry.items.naya.productionPath = registry.items.naya.expectedProductionPath;
  registry.items.naya.provenance = {
    ...registry.items.naya.provenance,
    status: "owned",
    redistributionAllowed: true,
    rightsHolder: "Mainlagi project owner",
    licenseBasis: "Project-owned production derivative"
  };
  runFixture(
    "undersized production asset",
    registry,
    { "naya-activity-v1.webp": makeVp8lMetadataFixture(320, 480, true) },
    { ok: false, message: /width 320px is outside/ }
  );
  runFixture(
    "valid transparent production metadata",
    registry,
    { "naya-activity-v1.webp": makeVp8lMetadataFixture(512, 640, true) },
    { ok: true }
  );
}

console.log("Character asset validator regression passed: fail-closed registry, provenance, format, dimensions, and alpha gates.");
