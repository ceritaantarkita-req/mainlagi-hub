import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const script = path.join(root, "scripts", "generate-learning-semantic-p0-stock-v2-candidates.mjs");
const sources = [
  "body-head.svg", "action-jump.svg", "feature-gills.svg", "feature-beak.svg",
  "feature-cactus-thick-stem.svg", "object-towel.svg", "object-raincoat.svg",
  "object-toy-block.svg", "object-ball.svg"
];
const keys = [
  "body.head", "action.jump", "feature.gills", "feature.beak",
  "feature.cactus-thick-stem", "object.towel", "object.raincoat",
  "object.toy-block", "object.ball"
].sort();

function fixtureSource(dir) {
  mkdirSync(dir, { recursive: true });
  sources.forEach((name, index) => {
    const color = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#8338ec"][index % 5];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect x="72" y="72" width="368" height="368" rx="72" fill="${color}"/>
      <circle cx="${140 + index * 12}" cy="256" r="64" fill="#ffffff" opacity=".75"/>
      <path d="M140 360 Q256 ${120 + index * 4} 372 360" fill="none" stroke="#17324d" stroke-width="18"/>
    </svg>`;
    writeFileSync(path.join(dir, name), svg);
  });
}
function run(args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" });
}

const temp = mkdtempSync(path.join(os.tmpdir(), "mainlagi-p0-v2-gen-"));
const source = path.join(temp, "source");
const a = path.join(temp, "a");
const b = path.join(temp, "b");
fixtureSource(source);

try {
  const dry = run(["--source-dir", source, "--output", a]);
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /DRY RUN/);
  assert.equal(existsSync(a), false);
  for (const out of [a, b]) {
    const result = run(["--generate", "--source-dir", source, "--output", out]);
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(readFileSync(path.join(out, "candidate-manifest.json"), "utf8"));
    assert.equal(manifest.version, 2);
    assert.equal(manifest.scope, "learning-semantic-p0-stock-v2-candidates");
    assert.equal(manifest.candidateSet, "p0-v2");
    assert.equal(manifest.items.length, 9);
    assert.deepEqual(manifest.items.map((item) => item.semanticKey).sort(), keys);
    for (const item of manifest.items) {
      assert.match(item.sourceSha256, /^[a-f0-9]{64}$/);
      assert.match(item.sha256, /^[a-f0-9]{64}$/);
      assert(item.sourceBytes > 128);
      assert(item.bytes > 512 && item.bytes < 300000);
      const meta = await sharp(path.join(out, item.filename)).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, 512);
      assert.equal(meta.height, 512);
      assert.equal(meta.hasAlpha, true);
    }
  }

  const ma = JSON.parse(readFileSync(path.join(a, "candidate-manifest.json"), "utf8"));
  const mb = JSON.parse(readFileSync(path.join(b, "candidate-manifest.json"), "utf8"));
  assert.deepEqual(
    Object.fromEntries(ma.items.map((item) => [item.semanticKey, item.sha256])),
    Object.fromEntries(mb.items.map((item) => [item.semanticKey, item.sha256])),
    "v2 candidate binaries must be deterministic"
  );

  const overwrite = run(["--generate", "--source-dir", source, "--output", a]);
  assert.notEqual(overwrite.status, 0);
  assert.match(overwrite.stderr, /use --force/);

  const publicAttempt = run(["--generate", "--source-dir", source, "--output", "public/artwork/learning-illustrations"]);
  assert.notEqual(publicAttempt.status, 0);
  assert.match(publicAttempt.stderr, /refuses public\/ path/);

  writeFileSync(path.join(source, "unexpected.svg"), "<svg xmlns=\"http://www.w3.org/2000/svg\"/>");
  const extraSource = run(["--source-dir", source, "--output", path.join(temp, "c")]);
  assert.notEqual(extraSource.status, 0);
  assert.match(extraSource.stderr, /exactly the canonical nine SVG files/);

  console.log("Learning semantic P0 stock v2 generator regression passed.");
} finally {
  try { rmSync(temp, { recursive: true, force: true }); } catch (error) { if (error?.code !== "EBUSY") throw error; }
}
