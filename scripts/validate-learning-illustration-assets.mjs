import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.env.LEARNING_ILLUSTRATION_ASSET_ROOT
  ? path.resolve(process.env.LEARNING_ILLUSTRATION_ASSET_ROOT)
  : process.cwd();

const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const EXPECTED_KEYS = [
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
  "object.raincoat",
  "object.towel",
  "object.toy-block",
  "object.umbrella",
  "vehicle.car"
];
const ALLOWED_LIFECYCLE = new Set(["review-required", "approved"]);
const ALLOWED_PROVENANCE = new Set(["pending", "owned", "licensed"]);
const ALLOWED_CANDIDATE_REVIEW = new Set(["none", "visually-suitable", "rejected"]);
const ALLOWED_SEMANTIC_REVIEW = new Set(["pending", "approved"]);
const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg", ".avif", ".svg"]);

function fail(message) {
  console.error(`learning illustrations: ${message}`);
  process.exitCode = 1;
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function safePublicPath(value) {
  if (!requiredString(value) || !value.startsWith("/artwork/")) return false;
  const normalized = path.posix.normalize(value);
  return normalized === value && !normalized.includes("..") && !normalized.includes("\\");
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function inspectWebp(buffer) {
  if (
    buffer.length < 16 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error("invalid WebP RIFF header");
  }

  let width = null;
  let height = null;
  let hasAlpha = false;
  let hasImagePayload = false;
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + size;
    if (dataEnd > buffer.length) throw new Error(`truncated WebP chunk ${type}`);

    if (type === "VP8X" && size >= 10) {
      const flags = buffer[dataStart];
      hasAlpha ||= (flags & 0x10) !== 0;
      width = readUInt24LE(buffer, dataStart + 4) + 1;
      height = readUInt24LE(buffer, dataStart + 7) + 1;
    } else if (type === "ALPH") {
      hasAlpha = true;
    } else if (type === "VP8 " && size >= 10) {
      hasImagePayload = true;
      if (
        (width === null || height === null) &&
        buffer[dataStart + 3] === 0x9d &&
        buffer[dataStart + 4] === 0x01 &&
        buffer[dataStart + 5] === 0x2a
      ) {
        width = buffer.readUInt16LE(dataStart + 6) & 0x3fff;
        height = buffer.readUInt16LE(dataStart + 8) & 0x3fff;
      }
    } else if (type === "VP8L" && size >= 5 && buffer[dataStart] === 0x2f) {
      hasImagePayload = true;
      const bits = buffer.readUInt32LE(dataStart + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
      hasAlpha ||= ((bits >>> 28) & 0x1) === 1;
    }

    offset = dataEnd + (size % 2);
  }

  if (!hasImagePayload) throw new Error("missing VP8/VP8L image payload");
  if (!width || !height) throw new Error("unable to read WebP dimensions");
  return { width, height, hasAlpha };
}

function walkImageFiles(directory) {
  if (!existsSync(directory)) return [];
  const results = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkImageFiles(absolute));
      continue;
    }
    if (!entry.isFile()) continue;
    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) results.push(absolute);
  }
  return results;
}

if (!existsSync(registryPath)) {
  fail("missing src/lib/data/learning-illustration-asset-provenance.json");
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
  registry.scope !== "learning-semantic-illustration" ||
  registry.productionDirectory !== "/artwork/learning-illustrations" ||
  !registry.items ||
  typeof registry.items !== "object" ||
  Array.isArray(registry.items)
) {
  fail("registry header must define version=1, learning-semantic-illustration scope, canonical production directory, and items");
  process.exit();
}

const actualKeys = Object.keys(registry.items).sort();
if (JSON.stringify(actualKeys) !== JSON.stringify([...EXPECTED_KEYS].sort())) {
  fail(`registry must contain exactly: ${EXPECTED_KEYS.join(", ")}`);
}

const approvedPublicPaths = new Map();

for (const semanticKey of EXPECTED_KEYS) {
  const record = registry.items[semanticKey];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${semanticKey}: missing record`);
    continue;
  }

  const slug = semanticKey.replaceAll(".", "-");
  const expectedPath = `/artwork/learning-illustrations/${slug}-v1.webp`;

  if (record.category !== semanticKey.split(".")[0]) fail(`${semanticKey}: category must match semantic-key prefix`);
  if (!ALLOWED_LIFECYCLE.has(record.lifecycle)) fail(`${semanticKey}: invalid lifecycle`);
  if (record.expectedProductionPath !== expectedPath) fail(`${semanticKey}: expectedProductionPath must be ${expectedPath}`);
  if (!requiredString(record.fallbackGlyph)) fail(`${semanticKey}: fallbackGlyph is required`);

  const candidate = record.candidate;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    fail(`${semanticKey}: candidate review object is required`);
  } else {
    if (!ALLOWED_CANDIDATE_REVIEW.has(candidate.reviewStatus)) fail(`${semanticKey}: invalid candidate reviewStatus`);
    if (candidate.sourcePath !== null) {
      if (!safePublicPath(candidate.sourcePath)) {
        fail(`${semanticKey}: unsafe candidate sourcePath`);
      } else {
        const candidateAbsolute = path.join(root, "public", candidate.sourcePath.slice(1));
        if (!existsSync(candidateAbsolute)) fail(`${semanticKey}: candidate source does not exist (${candidate.sourcePath})`);
      }
    }
    if (candidate.reviewStatus === "none") {
      if (candidate.sourcePath !== null) fail(`${semanticKey}: reviewStatus=none requires sourcePath=null`);
      if (candidate.reviewedAt !== null) fail(`${semanticKey}: reviewStatus=none requires reviewedAt=null`);
    } else {
      if (candidate.sourcePath === null) fail(`${semanticKey}: reviewed candidate requires sourcePath`);
      if (!requiredString(candidate.reviewedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(candidate.reviewedAt)) {
        fail(`${semanticKey}: reviewed candidate needs YYYY-MM-DD reviewedAt`);
      }
      if (!requiredString(candidate.notes)) fail(`${semanticKey}: reviewed candidate needs notes`);
    }
  }

  const provenance = record.provenance;
  if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) {
    fail(`${semanticKey}: provenance object is required`);
  } else {
    if (!ALLOWED_PROVENANCE.has(provenance.status)) fail(`${semanticKey}: invalid provenance status`);
    if (!requiredString(provenance.source)) fail(`${semanticKey}: provenance.source is required`);
    if (typeof provenance.redistributionAllowed !== "boolean") {
      fail(`${semanticKey}: provenance.redistributionAllowed must be boolean`);
    }
    if (!requiredString(provenance.reviewedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(provenance.reviewedAt)) {
      fail(`${semanticKey}: provenance.reviewedAt must use YYYY-MM-DD`);
    }
  }

  const semanticReview = record.semanticReview;
  if (!semanticReview || typeof semanticReview !== "object" || Array.isArray(semanticReview)) {
    fail(`${semanticKey}: semanticReview object is required`);
  } else {
    if (!ALLOWED_SEMANTIC_REVIEW.has(semanticReview.status)) fail(`${semanticKey}: invalid semanticReview.status`);
    if (semanticReview.status === "pending") {
      if (semanticReview.childReadable !== null) fail(`${semanticKey}: pending semantic review requires childReadable=null`);
      if (semanticReview.reviewedAt !== null) fail(`${semanticKey}: pending semantic review requires reviewedAt=null`);
    } else {
      if (semanticReview.childReadable !== true) fail(`${semanticKey}: approved semantic review requires childReadable=true`);
      if (!requiredString(semanticReview.reviewedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(semanticReview.reviewedAt)) {
        fail(`${semanticKey}: approved semantic review needs YYYY-MM-DD reviewedAt`);
      }
      if (!requiredString(semanticReview.notes)) fail(`${semanticKey}: approved semantic review needs notes`);
    }
  }

  const technical = record.technical;
  if (!technical || typeof technical !== "object" || Array.isArray(technical)) {
    fail(`${semanticKey}: technical contract is required`);
    continue;
  }
  if (technical.format !== "webp") fail(`${semanticKey}: production format must be webp`);
  if (technical.requireAlpha !== true) fail(`${semanticKey}: production illustration must require alpha/transparency`);
  for (const key of ["minWidth", "minHeight", "maxWidth", "maxHeight", "maxBytes"]) {
    if (!Number.isInteger(technical[key]) || technical[key] <= 0) fail(`${semanticKey}: technical.${key} must be a positive integer`);
  }
  if (technical.minWidth > technical.maxWidth || technical.minHeight > technical.maxHeight) {
    fail(`${semanticKey}: technical dimension bounds are invalid`);
  }

  if (record.lifecycle !== "approved") {
    if (record.productionPath !== null) fail(`${semanticKey}: non-approved illustration must keep productionPath=null`);
    if (record.productionSha256 !== null) fail(`${semanticKey}: non-approved illustration must keep productionSha256=null`);
    if (provenance?.redistributionAllowed !== false) fail(`${semanticKey}: non-approved illustration must fail closed for redistribution`);
    if (semanticReview?.status !== "pending") fail(`${semanticKey}: non-approved illustration must keep semantic review pending`);
    continue;
  }

  if (record.productionPath !== expectedPath) fail(`${semanticKey}: approved productionPath must equal expectedProductionPath`);
  if (!safePublicPath(record.productionPath)) fail(`${semanticKey}: unsafe productionPath`);
  if (!provenance || !["owned", "licensed"].includes(provenance.status)) {
    fail(`${semanticKey}: approved asset requires owned or licensed provenance`);
  }
  if (provenance?.redistributionAllowed !== true) fail(`${semanticKey}: approved asset requires redistributionAllowed=true`);
  if (!requiredString(provenance?.rightsHolder)) fail(`${semanticKey}: approved asset requires rightsHolder`);
  if (!requiredString(provenance?.licenseBasis)) fail(`${semanticKey}: approved asset requires licenseBasis`);
  if (semanticReview?.status !== "approved" || semanticReview?.childReadable !== true) {
    fail(`${semanticKey}: approved lifecycle requires approved child-readable semantic review`);
  }
  if (!requiredString(record.productionSha256) || !/^[a-f0-9]{64}$/.test(record.productionSha256)) {
    fail(`${semanticKey}: approved asset requires lowercase SHA-256`);
  }

  const absolute = path.join(root, "public", record.productionPath.slice(1));
  if (!existsSync(absolute)) {
    fail(`${semanticKey}: approved production asset does not exist (${record.productionPath})`);
    continue;
  }

  if (path.extname(absolute).toLowerCase() !== ".webp") fail(`${semanticKey}: approved production asset must be .webp`);

  const buffer = readFileSync(absolute);
  const size = statSync(absolute).size;
  if (size > technical.maxBytes) fail(`${semanticKey}: asset exceeds maxBytes (${size} > ${technical.maxBytes})`);
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (actualHash !== record.productionSha256) fail(`${semanticKey}: production SHA-256 mismatch`);

  try {
    const metadata = inspectWebp(buffer);
    if (metadata.width < technical.minWidth || metadata.width > technical.maxWidth) {
      fail(`${semanticKey}: width ${metadata.width}px is outside ${technical.minWidth}-${technical.maxWidth}px`);
    }
    if (metadata.height < technical.minHeight || metadata.height > technical.maxHeight) {
      fail(`${semanticKey}: height ${metadata.height}px is outside ${technical.minHeight}-${technical.maxHeight}px`);
    }
    if (technical.requireAlpha && !metadata.hasAlpha) {
      fail(`${semanticKey}: WebP must contain alpha/transparency data`);
    }
  } catch (error) {
    fail(`${semanticKey}: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (approvedPublicPaths.has(record.productionPath)) {
    fail(`${semanticKey}: productionPath already assigned to ${approvedPublicPaths.get(record.productionPath)}`);
  } else {
    approvedPublicPaths.set(record.productionPath, semanticKey);
  }
}

const productionDir = path.join(root, "public", "artwork", "learning-illustrations");
for (const absolute of walkImageFiles(productionDir)) {
  const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
  if (!approvedPublicPaths.has(publicPath)) {
    fail(`${publicPath}: learning illustration exists in production tree without an approved provenance record`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(
  `learning illustrations OK: ${approvedPublicPaths.size} approved production asset(s); ${EXPECTED_KEYS.length - approvedPublicPaths.size} fail-closed review-required slot(s)`
);
