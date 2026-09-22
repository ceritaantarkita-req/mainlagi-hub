import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.env.NARRATION_ASSET_ROOT ? path.resolve(process.env.NARRATION_ASSET_ROOT) : process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json");
const productionDir = path.join(root, "public", "audio", "narration", "en");

const EXPECTED_IDS = [
  "english-find-blue-audio",
  "english-listen-cat",
  "english-listen-cat-2",
  "english-listen-letter-a",
  "english-listen-letter-m",
  "english-listen-yellow",
  "english-listen-three",
  "english-listen-bird",
  "english-listen-bag",
  "english-listen-eyes",
  "english-listen-sister",
  "english-review-listen-father",
  "english-review-listen-fish",
  "english-listen-milk",
  "english-listen-sleep",
  "english-listen-apple-review",
  "english-listen-jump-review",
  "english-listen-book-review",
  "english-listen-hand-review",
  "english-listen-baby-review",
  "english-listen-phrase-blue-book",
  "english-review-listen-yellow-ball",
  "english-detail-red-ball",
  "english-detail-two-books",
  "english-detail-dog-runs",
  "english-detail-baby-sleeps",
  "english-detail-bird-up"
];

const ALLOWED_LIFECYCLE = new Set(["review-required", "approved"]);
const ALLOWED_PROVIDER_STATUS = new Set(["pending", "reviewed"]);
const ALLOWED_REVIEW_STATUS = new Set(["pending", "approved"]);
const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".opus", ".aac", ".m4a", ".flac"]);

function fail(message) {
  console.error(`narration assets: ${message}`);
  process.exitCode = 1;
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validDate(value) {
  return requiredString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString("ascii", 0, 3) === "ID3") return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

function walkAudioFiles(directory) {
  if (!existsSync(directory)) return [];
  const results = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkAudioFiles(absolute));
      continue;
    }
    if (!entry.isFile()) continue;
    if (AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) results.push(absolute);
  }
  return results;
}

if (!existsSync(registryPath)) {
  fail("missing src/lib/data/english-narration-asset-provenance.json");
  process.exit();
}

let registry;
try {
  registry = JSON.parse(readFileSync(registryPath, "utf8"));
} catch (error) {
  fail(`invalid provenance JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit();
}

if (
  registry?.version !== 1 ||
  registry.scope !== "english-learning-fixed-narration" ||
  registry.productionDirectory !== "/audio/narration/en" ||
  !registry.items ||
  typeof registry.items !== "object" ||
  Array.isArray(registry.items)
) {
  fail("registry header must define version=1, english-learning-fixed-narration scope, /audio/narration/en directory, and items");
  process.exit();
}

const actualIds = Object.keys(registry.items).sort();
const expectedIds = [...EXPECTED_IDS].sort();
if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
  fail(`registry must contain exactly the 27 reviewed English listening activities; expected ${EXPECTED_IDS.length}, got ${actualIds.length}`);
}

const approvedPaths = new Map();

for (const id of EXPECTED_IDS) {
  const record = registry.items[id];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${id}: missing record`);
    continue;
  }

  const expectedPath = `/audio/narration/en/${id}-v1.mp3`;
  if (!ALLOWED_LIFECYCLE.has(record.lifecycle)) fail(`${id}: invalid lifecycle`);
  if (record.activityId !== id) fail(`${id}: activityId must equal registry key`);
  if (record.language !== "en-US") fail(`${id}: language must be en-US`);
  if (!requiredString(record.transcript)) fail(`${id}: transcript is required`);
  if (record.expectedProductionPath !== expectedPath) {
    fail(`${id}: expectedProductionPath must be ${expectedPath}`);
  }

  const provider = record.provider;
  if (!provider || typeof provider !== "object" || Array.isArray(provider)) {
    fail(`${id}: provider review object is required`);
  } else {
    if (!ALLOWED_PROVIDER_STATUS.has(provider.status)) fail(`${id}: invalid provider status`);
    if (typeof provider.commercialUseAllowed !== "boolean") fail(`${id}: provider.commercialUseAllowed must be boolean`);
    if (typeof provider.redistributionAllowed !== "boolean") fail(`${id}: provider.redistributionAllowed must be boolean`);
    if (provider.aiDisclosureRequired !== null && typeof provider.aiDisclosureRequired !== "boolean") {
      fail(`${id}: provider.aiDisclosureRequired must be boolean or null`);
    }
    if (provider.reviewedAt !== null && !validDate(provider.reviewedAt)) {
      fail(`${id}: provider.reviewedAt must be null or YYYY-MM-DD`);
    }
  }

  const review = record.review;
  if (!review || typeof review !== "object" || Array.isArray(review)) {
    fail(`${id}: human review object is required`);
  } else {
    if (!ALLOWED_REVIEW_STATUS.has(review.pronunciationStatus)) fail(`${id}: invalid pronunciationStatus`);
    if (!ALLOWED_REVIEW_STATUS.has(review.childLearningStatus)) fail(`${id}: invalid childLearningStatus`);
    if (review.reviewedAt !== null && !validDate(review.reviewedAt)) {
      fail(`${id}: review.reviewedAt must be null or YYYY-MM-DD`);
    }
  }

  const technical = record.technical;
  if (!technical || typeof technical !== "object" || Array.isArray(technical)) {
    fail(`${id}: technical contract is required`);
    continue;
  }
  if (technical.format !== "mp3") fail(`${id}: production format must be mp3`);
  for (const key of ["minBytes", "maxBytes"]) {
    if (!Number.isInteger(technical[key]) || technical[key] <= 0) fail(`${id}: technical.${key} must be a positive integer`);
  }
  if (technical.minBytes > technical.maxBytes) fail(`${id}: technical byte bounds are invalid`);
  if (technical.sha256 !== null && !validSha256(technical.sha256)) fail(`${id}: technical.sha256 must be null or a 64-character hex digest`);

  if (record.lifecycle !== "approved") {
    if (record.productionPath !== null) fail(`${id}: non-approved narration must keep productionPath=null`);
    if (technical.sha256 !== null) fail(`${id}: non-approved narration must keep technical.sha256=null`);
    continue;
  }

  if (record.productionPath !== expectedPath) fail(`${id}: approved productionPath must equal expectedProductionPath`);
  if (!provider || provider.status !== "reviewed") fail(`${id}: approved narration requires provider.status=reviewed`);
  for (const key of ["name", "model", "voice", "sourceTerms", "rightsBasis"]) {
    if (!requiredString(provider?.[key])) fail(`${id}: approved narration requires provider.${key}`);
  }
  if (provider?.commercialUseAllowed !== true) fail(`${id}: approved narration requires commercialUseAllowed=true`);
  if (provider?.redistributionAllowed !== true) fail(`${id}: approved narration requires redistributionAllowed=true`);
  if (provider?.aiDisclosureRequired === null) fail(`${id}: approved narration requires an explicit aiDisclosureRequired decision`);
  if (!validDate(provider?.reviewedAt)) fail(`${id}: approved narration requires provider.reviewedAt YYYY-MM-DD`);

  if (!review || review.pronunciationStatus !== "approved" || review.childLearningStatus !== "approved") {
    fail(`${id}: approved narration requires pronunciation and child-learning review approval`);
  }
  if (!requiredString(review?.reviewedBy)) fail(`${id}: approved narration requires review.reviewedBy`);
  if (!validDate(review?.reviewedAt)) fail(`${id}: approved narration requires review.reviewedAt YYYY-MM-DD`);
  if (!validSha256(technical.sha256)) fail(`${id}: approved narration requires technical.sha256`);

  if (record.productionPath !== expectedPath || !validSha256(technical.sha256)) continue;
  const normalized = path.posix.normalize(record.productionPath);
  if (normalized !== record.productionPath || normalized.includes("..")) {
    fail(`${id}: unsafe productionPath`);
    continue;
  }

  const absolute = path.join(root, "public", record.productionPath.slice(1));
  if (!existsSync(absolute)) {
    fail(`${id}: approved narration asset does not exist (${record.productionPath})`);
    continue;
  }
  if (path.extname(absolute).toLowerCase() !== ".mp3") fail(`${id}: approved narration asset must be .mp3`);

  const bytes = readFileSync(absolute);
  const size = statSync(absolute).size;
  if (size < technical.minBytes || size > technical.maxBytes) {
    fail(`${id}: asset size ${size} is outside ${technical.minBytes}-${technical.maxBytes} bytes`);
  }
  if (!looksLikeMp3(bytes)) fail(`${id}: asset does not look like an MP3 file`);

  const digest = sha256(bytes);
  if (digest !== technical.sha256.toLowerCase()) {
    fail(`${id}: sha256 mismatch; registry=${technical.sha256} actual=${digest}`);
  }

  if (approvedPaths.has(record.productionPath)) {
    fail(`${id}: productionPath already assigned to ${approvedPaths.get(record.productionPath)}`);
  } else {
    approvedPaths.set(record.productionPath, id);
  }
}

for (const absolute of walkAudioFiles(productionDir)) {
  const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
  if (!approvedPaths.has(publicPath)) {
    fail(`${publicPath}: narration audio exists in public tree without an approved provenance record`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(
  `narration assets OK: ${approvedPaths.size} approved English production asset(s); ${EXPECTED_IDS.length - approvedPaths.size} review-required slot(s)`
);
