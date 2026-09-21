import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "character-asset-provenance.json");
const CHARACTER_IDS = ["naya", "gian", "zia"];
const ALLOWED_LIFECYCLE = new Set(["reference-only", "approved"]);
const ALLOWED_PROVENANCE = new Set(["pending", "owned", "licensed"]);
const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg", ".avif", ".svg"]);

function fail(message) {
  console.error(`character assets: ${message}`);
  process.exitCode = 1;
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
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
    } else if (type === "VP8 " && size >= 10 && (width === null || height === null)) {
      if (
        buffer[dataStart + 3] === 0x9d &&
        buffer[dataStart + 4] === 0x01 &&
        buffer[dataStart + 5] === 0x2a
      ) {
        width = buffer.readUInt16LE(dataStart + 6) & 0x3fff;
        height = buffer.readUInt16LE(dataStart + 8) & 0x3fff;
      }
    } else if (type === "VP8L" && size >= 5 && buffer[dataStart] === 0x2f) {
      const bits = buffer.readUInt32LE(dataStart + 1);
      width = (bits & 0x3fff) + 1;
      height = ((bits >>> 14) & 0x3fff) + 1;
      hasAlpha ||= ((bits >>> 28) & 0x1) === 1;
    }

    offset = dataEnd + (size % 2);
  }

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
  fail("missing src/lib/data/character-asset-provenance.json");
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
  registry.scope !== "human-activity-foreground" ||
  registry.productionDirectory !== "/artwork/characters" ||
  !registry.items ||
  typeof registry.items !== "object" ||
  Array.isArray(registry.items)
) {
  fail("registry header must define version=1, human-activity-foreground scope, /artwork/characters directory, and items");
  process.exit();
}

const actualIds = Object.keys(registry.items).sort();
if (JSON.stringify(actualIds) !== JSON.stringify([...CHARACTER_IDS].sort())) {
  fail(`registry must contain exactly: ${CHARACTER_IDS.join(", ")}`);
}

const approvedPublicPaths = new Map();

for (const id of CHARACTER_IDS) {
  const record = registry.items[id];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${id}: missing record`);
    continue;
  }

  const expectedPath = `/artwork/characters/${id}-activity-v1.webp`;
  if (!ALLOWED_LIFECYCLE.has(record.lifecycle)) fail(`${id}: invalid lifecycle`);
  if (!requiredString(record.identityReference)) fail(`${id}: identityReference is required`);
  if (record.expectedProductionPath !== expectedPath) {
    fail(`${id}: expectedProductionPath must be ${expectedPath}`);
  }

  const provenance = record.provenance;
  if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) {
    fail(`${id}: provenance object is required`);
  } else {
    if (!ALLOWED_PROVENANCE.has(provenance.status)) fail(`${id}: invalid provenance status`);
    if (!requiredString(provenance.source)) fail(`${id}: provenance.source is required`);
    if (typeof provenance.redistributionAllowed !== "boolean") {
      fail(`${id}: provenance.redistributionAllowed must be boolean`);
    }
    if (!requiredString(provenance.reviewedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(provenance.reviewedAt)) {
      fail(`${id}: provenance.reviewedAt must use YYYY-MM-DD`);
    }
  }

  const technical = record.technical;
  if (!technical || typeof technical !== "object" || Array.isArray(technical)) {
    fail(`${id}: technical contract is required`);
    continue;
  }
  if (technical.format !== "webp") fail(`${id}: production format must be webp`);
  if (technical.requireAlpha !== true) fail(`${id}: production asset must require alpha/transparency`);
  for (const key of ["minWidth", "minHeight", "maxWidth", "maxHeight", "maxBytes"]) {
    if (!Number.isInteger(technical[key]) || technical[key] <= 0) fail(`${id}: technical.${key} must be a positive integer`);
  }
  if (technical.minWidth > technical.maxWidth || technical.minHeight > technical.maxHeight) {
    fail(`${id}: technical dimension bounds are invalid`);
  }

  if (record.lifecycle !== "approved") {
    if (record.productionPath !== null) fail(`${id}: non-approved character must keep productionPath=null`);
    if (provenance?.redistributionAllowed !== false) fail(`${id}: non-approved character must fail closed for redistribution`);
    continue;
  }

  if (record.productionPath !== expectedPath) fail(`${id}: approved productionPath must equal expectedProductionPath`);
  if (!provenance || !["owned", "licensed"].includes(provenance.status)) {
    fail(`${id}: approved asset requires owned or licensed provenance`);
  }
  if (provenance?.redistributionAllowed !== true) fail(`${id}: approved asset requires redistributionAllowed=true`);
  if (!requiredString(provenance?.rightsHolder)) fail(`${id}: approved asset requires rightsHolder`);
  if (!requiredString(provenance?.licenseBasis)) fail(`${id}: approved asset requires licenseBasis`);

  if (record.productionPath !== expectedPath) continue;
  const relative = record.productionPath.slice(1);
  const normalized = path.posix.normalize(record.productionPath);
  if (normalized !== record.productionPath || normalized.includes("..")) {
    fail(`${id}: unsafe productionPath`);
    continue;
  }

  const absolute = path.join(root, "public", relative);
  if (!existsSync(absolute)) {
    fail(`${id}: approved production asset does not exist (${record.productionPath})`);
    continue;
  }

  const ext = path.extname(absolute).toLowerCase();
  if (ext !== ".webp") fail(`${id}: approved production asset must be .webp`);

  const size = statSync(absolute).size;
  if (size > technical.maxBytes) fail(`${id}: asset exceeds maxBytes (${size} > ${technical.maxBytes})`);

  try {
    const metadata = inspectWebp(readFileSync(absolute));
    if (metadata.width < technical.minWidth || metadata.width > technical.maxWidth) {
      fail(`${id}: width ${metadata.width}px is outside ${technical.minWidth}-${technical.maxWidth}px`);
    }
    if (metadata.height < technical.minHeight || metadata.height > technical.maxHeight) {
      fail(`${id}: height ${metadata.height}px is outside ${technical.minHeight}-${technical.maxHeight}px`);
    }
    if (technical.requireAlpha && !metadata.hasAlpha) {
      fail(`${id}: WebP must contain alpha/transparency data`);
    }
  } catch (error) {
    fail(`${id}: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (approvedPublicPaths.has(record.productionPath)) {
    fail(`${id}: productionPath already assigned to ${approvedPublicPaths.get(record.productionPath)}`);
  } else {
    approvedPublicPaths.set(record.productionPath, id);
  }
}

const characterDir = path.join(root, "public", "artwork", "characters");
for (const absolute of walkImageFiles(characterDir)) {
  const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
  if (!approvedPublicPaths.has(publicPath)) {
    fail(`${publicPath}: character image exists in public tree without an approved provenance record`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(
  `character assets OK: ${approvedPublicPaths.size} approved human production asset(s); ${CHARACTER_IDS.length - approvedPublicPaths.size} fail-closed reference-only slot(s)`
);
