import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const script = path.join(root, "scripts", "generate-learning-semantic-p0-candidates.mjs");
const expected = [
  "action.jump",
  "body.head",
  "feature.beak",
  "feature.cactus-thick-stem",
  "feature.gills",
  "object.ball",
  "object.raincoat",
  "object.towel",
  "object.toy-block"
].sort();

function run(args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" });
}

const dry = mkdtempSync(path.join(os.tmpdir(), "mainlagi-semantic-dry-"));
rmSync(dry, { recursive: true, force: true });
const dryRun = run(["--output", dry]);
assert.equal(dryRun.status, 0, dryRun.stderr);
assert.match(dryRun.stdout, /DRY RUN/);
assert.equal(existsSync(dry), false, "dry-run must not write output");

const a = mkdtempSync(path.join(os.tmpdir(), "mainlagi-semantic-a-"));
const b = mkdtempSync(path.join(os.tmpdir(), "mainlagi-semantic-b-"));
rmSync(a, { recursive: true, force: true });
rmSync(b, { recursive: true, force: true });

try {
  for (const target of [a, b]) {
    const result = run(["--generate", "--output", target]);
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(readFileSync(path.join(target, "candidate-manifest.json"), "utf8"));
    assert.equal(manifest.version, 1);
    assert.equal(manifest.scope, "learning-semantic-p0-candidates");
    assert.equal(manifest.production, false);
    assert.equal(manifest.runtimeActive, false);
    assert.equal(manifest.humanReviewRequired, true);
    assert.deepEqual(manifest.items.map((item) => item.semanticKey).sort(), expected);
    for (const item of manifest.items) {
      assert.equal(item.production, false);
      assert.equal(item.runtimeActive, false);
      assert.equal(item.humanReviewRequired, true);
      assert.match(item.sha256, /^[a-f0-9]{64}$/);
      assert(item.bytes > 512 && item.bytes < 300000);
      const meta = await sharp(path.join(target, item.filename)).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, 512);
      assert.equal(meta.height, 512);
      assert.equal(meta.hasAlpha, true);
    }
  }

  const ma = JSON.parse(readFileSync(path.join(a, "candidate-manifest.json"), "utf8"));
  const mb = JSON.parse(readFileSync(path.join(b, "candidate-manifest.json"), "utf8"));
  const shaA = Object.fromEntries(ma.items.map((item) => [item.semanticKey, item.sha256]));
  const shaB = Object.fromEntries(mb.items.map((item) => [item.semanticKey, item.sha256]));
  assert.deepEqual(shaA, shaB, "candidate binaries must be deterministic");

  const overwrite = run(["--generate", "--output", a]);
  assert.notEqual(overwrite.status, 0, "existing output must fail without --force");
  assert.match(overwrite.stderr, /use --force/);

  const publicAttempt = run(["--generate", "--output", "public/artwork/learning-illustrations"]);
  assert.notEqual(publicAttempt.status, 0, "generator must refuse production subtree");
  assert.match(publicAttempt.stderr, /refuses to write under public/);
} finally {
  try { rmSync(a, { recursive: true, force: true }); } catch (error) { if (error?.code !== "EBUSY") throw error; }
  try { rmSync(b, { recursive: true, force: true }); } catch (error) { if (error?.code !== "EBUSY") throw error; }
}

console.log("Learning semantic P0 candidate generator regression passed: exact keys, deterministic WebP+alpha, dry-run, overwrite guard and public-tree refusal.");
