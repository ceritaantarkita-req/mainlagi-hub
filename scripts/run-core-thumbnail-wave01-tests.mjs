import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const assetRoot = path.resolve("public/artwork/core-thumbnails");
const sourceMap = JSON.parse(
  readFileSync(path.resolve("docs/data/MAINLAGI_CORE_THUMBNAIL_WAVE01_SOURCE_MAP_2026-09-26.json"), "utf8")
);

const expectedAssets = [
  "home-hero-mainlagi.webp",
  "main-gerak-header.webp",
  "world-header-mainlagi.webp",
  "subject-bahasa-indonesia.webp",
  "subject-bahasa-inggris.webp",
  "subject-huruf-menulis.webp",
  "subject-iqro.webp",
  "subject-matematika.webp",
  "subject-logika.webp",
  "subject-sains.webp",
  "subject-mewarnai.webp",
  "subject-menggambar.webp",
  "game-pilih-jawaban.webp",
  "game-math-battle.webp",
  "game-number-trace.webp",
  "game-shape-quest.webp",
  "game-pattern-race.webp",
  "game-math-warung.webp",
  "game-iqro-motion.webp",
  "game-aiboard.webp",
  "game-beat-motion.webp",
  "game-run-to-target.webp",
  "world-uang-investasi.webp",
  "world-arsitek-interior.webp",
  "world-youtuber-content-creator.webp",
  "world-pembalap-mobil.webp",
  "world-robot-engineer.webp",
  "world-ai-software-engineer.webp",
  "world-dokter.webp",
  "world-ilmuwan-penjelajah-alam.webp",
  "world-chef-pemilik-restoran.webp"
].sort();

function readWebpSize(filePath) {
  const buffer = readFileSync(filePath);
  assert.equal(buffer.toString("ascii", 0, 4), "RIFF", `${filePath} must be RIFF`);
  assert.equal(buffer.toString("ascii", 8, 12), "WEBP", `${filePath} must be WebP`);
  const chunk = buffer.toString("ascii", 12, 16);
  const data = 20;

  if (chunk === "VP8X") {
    const width = 1 + buffer[data + 4] + (buffer[data + 5] << 8) + (buffer[data + 6] << 16);
    const height = 1 + buffer[data + 7] + (buffer[data + 8] << 8) + (buffer[data + 9] << 16);
    return { width, height };
  }

  if (chunk === "VP8 ") {
    assert.equal(buffer[data + 3], 0x9d, `${filePath} VP8 start code byte 1`);
    assert.equal(buffer[data + 4], 0x01, `${filePath} VP8 start code byte 2`);
    assert.equal(buffer[data + 5], 0x2a, `${filePath} VP8 start code byte 3`);
    return {
      width: buffer.readUInt16LE(data + 6) & 0x3fff,
      height: buffer.readUInt16LE(data + 8) & 0x3fff
    };
  }

  if (chunk === "VP8L") {
    assert.equal(buffer[data], 0x2f, `${filePath} VP8L signature`);
    const b1 = buffer[data + 1];
    const b2 = buffer[data + 2];
    const b3 = buffer[data + 3];
    const b4 = buffer[data + 4];
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10)
    };
  }

  throw new Error(`${filePath}: unsupported WebP chunk ${chunk}`);
}

assert.equal(existsSync(assetRoot), true, "core thumbnail asset directory must exist");
const actualAssets = readdirSync(assetRoot).filter((name) => name.endsWith(".webp")).sort();
assert.deepEqual(actualAssets, expectedAssets, "Wave 01 production asset set must remain exact");

let totalBytes = 0;
for (const name of actualAssets) {
  const filePath = path.join(assetRoot, name);
  const size = statSync(filePath).size;
  totalBytes += size;
  assert(size > 0 && size < 200_000, `${name} must stay optimized below 200 KB; got ${size}`);
  assert.deepEqual(readWebpSize(filePath), { width: 1200, height: 900 }, `${name} must remain exact 4:3 production geometry`);
}
assert(totalBytes < 4_000_000, `Wave 01 production set should stay below 4 MB; got ${totalBytes}`);

const activityPreviewDir = path.resolve("public/artwork/activity-previews");
const activityPreviewCount = readdirSync(activityPreviewDir).filter((name) => name.endsWith(".webp")).length;
assert.equal(activityPreviewCount, 125, "the 125 activity/gallery preview WebPs are explicitly out of scope");

assert.equal(Object.keys(sourceMap.assets.subjects).length, 9, "source map must freeze nine subject thumbnails");
assert.equal(Object.keys(sourceMap.assets.games).length, 10, "source map must freeze ten Main Gerak thumbnails");
assert.equal(Object.keys(sourceMap.assets.worlds).length, 9, "source map must freeze nine World thumbnails");
assert.equal(sourceMap.worldState.live, 1);
assert.equal(sourceMap.worldState.locked, 8);
assert.equal(sourceMap.assets.games["number-trace"].driveFileId, "1Kw7TpNeP69jmwG9r2IUpQYh400zsXDJH", "newer Number Trace source must stay canonical");
assert.equal(sourceMap.assets.worlds["money-festival"].driveFileId, "1Pv1KkFxiwWCieRUHl2OwiPQJA44Lt3CZ", "live money World must use world-uang-investasi source");
assert(sourceMap.excludedSources.some((item) => item.driveFileId === "16zB20iWhpdCKIWHcpJKGQxbMWABcn8dj"), "historical money-world visual must remain explicitly excluded");

const registrySource = readFileSync(path.resolve("src/lib/learning/coreThumbnailRegistry.ts"), "utf8");
assert.match(registrySource, /CORE_SUBJECT_THUMBNAILS/);
assert.match(registrySource, /CORE_GAME_THUMBNAILS/);
assert.match(registrySource, /CORE_WORLD_CARDS/);
assert.equal((registrySource.match(/status: "live",/g) ?? []).length, 1, "registry must expose exactly one live World");
assert.equal((registrySource.match(/status: "locked",/g) ?? []).length, 8, "registry must expose exactly eight locked Worlds");
assert.doesNotMatch(registrySource, /world-petualangan-uang/, "historical money-world visual must never enter runtime registry");

const gameArtworkSource = readFileSync(path.resolve("src/components/GameArtwork.tsx"), "utf8");
assert.match(gameArtworkSource, /CORE_GAME_THUMBNAILS\[slug\]/, "all game artwork must route through central thumbnail registry");
assert.doesNotMatch(gameArtworkSource, /\/artwork\/(math-choice|math-motion-battle|number-trace|shape-quest|pattern-race|math-warung|iqro-motion|airboard-presenter|dodge-motion|run-to-target)\.webp/, "old game artwork paths must not remain active in GameArtwork");

const worldSource = readFileSync(path.resolve("src/components/learning/world-v2/MoneyWorldExperience.tsx"), "utf8");
assert.match(worldSource, /CORE_WORLD_CARDS\.map/);
assert.match(worldSource, /href=\{liveHref\}/);
assert.match(worldSource, /data-world-status="locked"/);
assert.doesNotMatch(worldSource, /href=\{[^}]*world\.id/, "locked future World ids must not be converted into runtime links");

console.log(`Core Thumbnail Wave 01 static gate PASS: 31 optimized 1200x900 assets (${totalBytes} bytes), 9 subjects, 10 games, 9 Worlds (1 live/8 locked), and 125 activity previews untouched.`);
