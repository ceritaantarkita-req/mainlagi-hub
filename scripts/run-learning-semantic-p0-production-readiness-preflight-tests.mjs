import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const script = path.join(root, "scripts", "preflight-learning-semantic-p0-production-readiness.mjs");
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const registryBefore = readFileSync(registryPath);

const sources = [
  "action-jump.svg",
  "animal-bird.svg",
  "animal-cat.svg",
  "animal-fish.svg",
  "body-head.svg",
  "feature-beak.svg",
  "feature-cactus-thick-stem.svg",
  "feature-gills.svg",
  "object-apple.svg",
  "object-ball.svg",
  "object-cup.svg",
  "object-house.svg",
  "object-toy-block.svg",
  "object-umbrella.svg"
];

const clearKeys = [
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
].sort();

const heldKeys = ["object.raincoat", "object.towel", "vehicle.car"];

function fixtureSource(dir) {
  mkdirSync(dir, { recursive: true });
  sources.forEach((name, index) => {
    const color = ["ef476f", "ffd166", "06d6a0", "118ab2", "8338ec", "fb5607"][index % 6];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect x="52" y="52" width="408" height="408" rx="82" fill="#${color}"/>
      <circle cx="${150 + index * 8}" cy="210" r="54" fill="#ffffff" opacity=".75"/>
      <path d="M124 356 Q256 ${116 + index * 3} 388 356" fill="none" stroke="#17324d" stroke-width="20"/>
    </svg>`;
    writeFileSync(path.join(dir, name), svg);
  });
}

function run(args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" });
}

const temp = mkdtempSync(path.join(os.tmpdir(), "mainlagi-p0-production-preflight-v2-"));
const source = path.join(temp, "source");
const outA = path.join(temp, "a");
const outB = path.join(temp, "b");
fixtureSource(source);

try {
  let result = run(["--source-dir", source, "--output", outA]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /DRY RUN \/ historical WebP comparison/);
  assert.match(result.stdout, /Registry v2 preferred format: svg; runtime activation: controlled-svg/);
  assert.match(result.stdout, /Clear scope: 14\/17; held scope: 3\/17/);
  assert.match(result.stdout, /SVG target object-apple-v1\.svg/);
  assert.match(result.stdout, /vehicle\.car/);
  assert.equal(existsSync(outA), false);

  for (const output of [outA, outB]) {
    result = run(["--generate", "--source-dir", source, "--output", output]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Generated 14 internal historical WebP comparison files/);
    assert.match(result.stdout, /Registry v2 SVG production bindings remain unchanged/);

    const manifest = JSON.parse(readFileSync(path.join(output, "preflight-manifest.json"), "utf8"));
    assert.equal(manifest.version, 2);
    assert.equal(manifest.registryVersion, 2);
    assert.equal(manifest.scope, "learning-semantic-p0-production-readiness-preflight");
    assert.equal(manifest.lifecycle, "preflight-only");
    assert.equal(manifest.preferredProductionFormat, "svg");
    assert.equal(manifest.clearCount, 14);
    assert.equal(manifest.heldCount, 3);
    assert.deepEqual(manifest.heldKeys, heldKeys);
    assert.equal(manifest.legalApproval, false);
    assert.equal(manifest.productionApproval, false);
    assert.equal(manifest.svgPromotion, false);
    assert.equal(manifest.production, false);
    assert.equal(manifest.runtimeActive, false);
    assert.equal(manifest.items.length, 14);
    assert.deepEqual(manifest.items.map((item) => item.semanticKey).sort(), clearKeys);

    for (const item of manifest.items) {
      assert.match(item.sourceSha256, /^[a-f0-9]{64}$/);
      assert.match(item.sha256, /^[a-f0-9]{64}$/);
      assert.equal(item.lifecycle, "preflight-only");
      assert.equal(item.legalApproval, false);
      assert.equal(item.productionApproval, false);
      assert.equal(item.production, false);
      assert.equal(item.runtimeActive, false);
      assert.equal(item.svgMigrationStatus, "approved");
      assert.equal(
        item.expectedWebpProductionPath,
        `/artwork/learning-illustrations/${item.semanticKey.replaceAll(".", "-")}-v1.webp`
      );
      assert.equal(
        item.expectedSvgProductionPath,
        `/artwork/learning-illustrations/${item.semanticKey.replaceAll(".", "-")}-v1.svg`
      );
      assert.equal(path.posix.basename(item.expectedWebpProductionPath), item.preflightFilename);
      const meta = await sharp(path.join(output, item.preflightFilename)).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, 512);
      assert.equal(meta.height, 512);
      assert.equal(meta.hasAlpha, true);
      assert(item.bytes > 512 && item.bytes < 300000);
    }
  }

  const manifestA = JSON.parse(readFileSync(path.join(outA, "preflight-manifest.json"), "utf8"));
  const manifestB = JSON.parse(readFileSync(path.join(outB, "preflight-manifest.json"), "utf8"));
  assert.deepEqual(
    Object.fromEntries(manifestA.items.map((item) => [item.semanticKey, item.sha256])),
    Object.fromEntries(manifestB.items.map((item) => [item.semanticKey, item.sha256])),
    "historical comparison WebP binaries must remain deterministic"
  );

  result = run(["--generate", "--source-dir", source, "--output", outA]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /use --force/);

  result = run(["--generate", "--source-dir", source, "--output", "public/artwork/learning-illustrations"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /refuses public\/ path/);

  writeFileSync(path.join(source, "vehicle-car.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"/>');
  result = run(["--source-dir", source, "--output", path.join(temp, "c")]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /exactly the 14 canonical clear-scope SVG files/);

  assert.deepEqual(readFileSync(registryPath), registryBefore);
  console.log(
    "Learning semantic P0 production-readiness preflight v2 regression passed: WebP history remains deterministic while approved SVG production bindings stay unchanged and runtime remains off."
  );
} finally {
  try {
    rmSync(temp, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "EBUSY") throw error;
  }
}
