import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  sanitizeAndValidateSvg,
  validateSvgProductionDirectory,
  validateSvgProductionPathRecords
} from "./lib/svg-asset-security.mjs";

const root = process.env.LEARNING_ILLUSTRATION_ASSET_ROOT
  ? path.resolve(process.env.LEARNING_ILLUSTRATION_ASSET_ROOT)
  : process.cwd();

const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const SVG_SECURITY_VALIDATOR = "scripts/lib/svg-asset-security.mjs";
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
const HELD_KEYS = new Set(["object.raincoat", "object.towel", "vehicle.car"]);
const ALLOWED_LIFECYCLE = new Set(["review-required", "approved"]);
const ALLOWED_PROVENANCE = new Set(["pending", "owned", "licensed"]);
const ALLOWED_CANDIDATE_REVIEW = new Set(["none", "visually-suitable", "rejected"]);
const ALLOWED_SEMANTIC_REVIEW = new Set(["pending", "approved"]);
const ALLOWED_SVG_STATUS = new Set(["held", "migration-ready", "approved"]);
const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg", ".avif", ".svg"]);

function fail(message) {
  console.error(`learning illustrations: ${message}`);
  process.exitCode = 1;
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validDate(value) {
  return requiredString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validSha(value) {
  return requiredString(value) && /^[a-f0-9]{64}$/.test(value);
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
    if (entry.isSymbolicLink()) {
      fail(`${absolute}: symbolic links are forbidden in learning illustration production directories`);
      continue;
    }
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
  registry?.version !== 2 ||
  registry.scope !== "learning-semantic-illustration" ||
  registry.productionDirectory !== "/artwork/learning-illustrations" ||
  registry.preferredProductionFormat !== "svg" ||
  registry.svgSecurityValidator !== SVG_SECURITY_VALIDATOR ||
  !["off", "controlled-svg"].includes(registry.runtimeActivation) ||
  !registry.items ||
  typeof registry.items !== "object" ||
  Array.isArray(registry.items)
) {
  fail("registry header must define version=2, SVG-preferred semantic illustration scope, canonical production directory/security validator, runtimeActivation=off|controlled-svg, and items");
  process.exit();
}

const actualKeys = Object.keys(registry.items).sort();
if (JSON.stringify(actualKeys) !== JSON.stringify([...EXPECTED_KEYS].sort())) {
  fail(`registry must contain exactly: ${EXPECTED_KEYS.join(", ")}`);
}

const approvedWebpPaths = new Map();
const retiredWebpPaths = new Map();
const approvedSvgRecords = [];
const expectedSvgPaths = new Map();

for (const semanticKey of EXPECTED_KEYS) {
  const record = registry.items[semanticKey];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${semanticKey}: missing record`);
    continue;
  }

  const slug = semanticKey.replaceAll(".", "-");
  const expectedWebpPath = `/artwork/learning-illustrations/${slug}-v1.webp`;
  const expectedSvgPath = `/artwork/learning-illustrations/${slug}-v1.svg`;

  if (record.category !== semanticKey.split(".")[0]) fail(`${semanticKey}: category must match semantic-key prefix`);
  if (!ALLOWED_LIFECYCLE.has(record.lifecycle)) fail(`${semanticKey}: invalid lifecycle`);
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
      if (!validDate(candidate.reviewedAt)) fail(`${semanticKey}: reviewed candidate needs YYYY-MM-DD reviewedAt`);
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
    if (!validDate(provenance.reviewedAt)) fail(`${semanticKey}: provenance.reviewedAt must use YYYY-MM-DD`);
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
      if (!validDate(semanticReview.reviewedAt)) {
        fail(`${semanticKey}: approved semantic review needs YYYY-MM-DD reviewedAt`);
      }
      if (!requiredString(semanticReview.notes)) fail(`${semanticKey}: approved semantic review needs notes`);
    }
  }

  const productionAssets = record.productionAssets;
  if (!productionAssets || typeof productionAssets !== "object" || Array.isArray(productionAssets)) {
    fail(`${semanticKey}: productionAssets object is required`);
    continue;
  }

  const svg = productionAssets.svg;
  if (!svg || typeof svg !== "object" || Array.isArray(svg)) {
    fail(`${semanticKey}: productionAssets.svg is required`);
  } else {
    if (!ALLOWED_SVG_STATUS.has(svg.status)) fail(`${semanticKey}: invalid SVG migration status`);
    if (svg.format !== "svg") fail(`${semanticKey}: SVG production format must be svg`);
    if (svg.expectedPath !== expectedSvgPath) {
      fail(`${semanticKey}: SVG expectedPath must be ${expectedSvgPath}`);
    }
    if (expectedSvgPaths.has(expectedSvgPath)) {
      fail(`${semanticKey}: SVG expectedPath already assigned to ${expectedSvgPaths.get(expectedSvgPath)}`);
    } else {
      expectedSvgPaths.set(expectedSvgPath, semanticKey);
    }

    if (svg.status === "approved") {
      if (svg.path !== expectedSvgPath) fail(`${semanticKey}: approved SVG path must equal expectedPath`);
      if (!validSha(svg.sha256)) fail(`${semanticKey}: approved SVG requires lowercase SHA-256`);
      approvedSvgRecords.push({ id: semanticKey, productionPath: svg.path, record });
    } else {
      if (svg.path !== null) fail(`${semanticKey}: non-approved SVG must keep path=null`);
      if (svg.sha256 !== null) fail(`${semanticKey}: non-approved SVG must keep sha256=null`);
    }
  }

  const technical = record.technical;
  if (!technical || typeof technical !== "object" || Array.isArray(technical)) {
    fail(`${semanticKey}: technical contract is required`);
    continue;
  }

  const webpTechnical = technical.webp;
  if (!webpTechnical || typeof webpTechnical !== "object" || Array.isArray(webpTechnical)) {
    fail(`${semanticKey}: technical.webp is required`);
  } else {
    if (webpTechnical.format !== "webp") fail(`${semanticKey}: technical.webp.format must be webp`);
    if (webpTechnical.requireAlpha !== true) fail(`${semanticKey}: WebP production illustration must require alpha/transparency`);
    for (const key of ["minWidth", "minHeight", "maxWidth", "maxHeight", "maxBytes"]) {
      if (!Number.isInteger(webpTechnical[key]) || webpTechnical[key] <= 0) {
        fail(`${semanticKey}: technical.webp.${key} must be a positive integer`);
      }
    }
    if (
      Number.isInteger(webpTechnical.minWidth) &&
      Number.isInteger(webpTechnical.maxWidth) &&
      Number.isInteger(webpTechnical.minHeight) &&
      Number.isInteger(webpTechnical.maxHeight) &&
      (webpTechnical.minWidth > webpTechnical.maxWidth || webpTechnical.minHeight > webpTechnical.maxHeight)
    ) {
      fail(`${semanticKey}: WebP technical dimension bounds are invalid`);
    }
  }

  const svgTechnical = technical.svg;
  if (!svgTechnical || typeof svgTechnical !== "object" || Array.isArray(svgTechnical)) {
    fail(`${semanticKey}: technical.svg is required`);
  } else {
    if (svgTechnical.format !== "svg") fail(`${semanticKey}: technical.svg.format must be svg`);
    if (!Number.isInteger(svgTechnical.maxBytes) || svgTechnical.maxBytes <= 0) {
      fail(`${semanticKey}: technical.svg.maxBytes must be a positive integer`);
    }
    if (svgTechnical.requireViewBox !== true) fail(`${semanticKey}: technical.svg.requireViewBox must be true`);
    if (svgTechnical.productionSanitizationRequired !== true) {
      fail(`${semanticKey}: technical.svg.productionSanitizationRequired must be true`);
    }
    if (svgTechnical.validator !== SVG_SECURITY_VALIDATOR) {
      fail(`${semanticKey}: technical.svg.validator must be ${SVG_SECURITY_VALIDATOR}`);
    }
  }

  if (record.lifecycle !== "approved") {
    if (productionAssets.webp !== null) fail(`${semanticKey}: non-approved illustration must keep productionAssets.webp=null`);
    if (svg?.status !== "held") fail(`${semanticKey}: non-approved illustration SVG status must be held`);
    if (provenance?.redistributionAllowed !== false) fail(`${semanticKey}: non-approved illustration must fail closed for redistribution`);
    if (semanticReview?.status !== "pending") fail(`${semanticKey}: non-approved illustration must keep semantic review pending`);
    continue;
  }

  if (HELD_KEYS.has(semanticKey)) {
    fail(`${semanticKey}: held semantic key must not use approved lifecycle`);
  }
  if (!provenance || !["owned", "licensed"].includes(provenance.status)) {
    fail(`${semanticKey}: approved asset requires owned or licensed provenance`);
  }
  if (provenance?.redistributionAllowed !== true) fail(`${semanticKey}: approved asset requires redistributionAllowed=true`);
  if (!requiredString(provenance?.rightsHolder)) fail(`${semanticKey}: approved asset requires rightsHolder`);
  if (!requiredString(provenance?.licenseBasis)) fail(`${semanticKey}: approved asset requires licenseBasis`);
  if (semanticReview?.status !== "approved" || semanticReview?.childReadable !== true) {
    fail(`${semanticKey}: approved lifecycle requires approved child-readable semantic review`);
  }
  if (svg?.status === "held") fail(`${semanticKey}: approved clear-scope asset cannot keep SVG status held`);

  const webp = productionAssets.webp;
  if (!webp || typeof webp !== "object" || Array.isArray(webp)) {
    fail(`${semanticKey}: approved asset must preserve WebP history metadata`);
    continue;
  }
  if (!["approved", "retired"].includes(webp.status)) {
    fail(`${semanticKey}: productionAssets.webp.status must be approved|retired`);
  }
  if (webp.format !== "webp") fail(`${semanticKey}: productionAssets.webp.format must be webp`);
  if (webp.path !== expectedWebpPath) fail(`${semanticKey}: WebP history path must be ${expectedWebpPath}`);
  if (!safePublicPath(webp.path)) fail(`${semanticKey}: unsafe WebP history path`);
  if (!validSha(webp.sha256)) fail(`${semanticKey}: WebP history requires lowercase SHA-256`);

  if (approvedWebpPaths.has(webp.path) || retiredWebpPaths.has(webp.path)) {
    fail(`${semanticKey}: WebP history path already assigned`);
  }

  const absolute = path.join(root, "public", webp.path.slice(1));

  if (webp.status === "retired") {
    if (!validDate(webp.retiredAt)) fail(`${semanticKey}: retired WebP requires YYYY-MM-DD retiredAt`);
    if (!requiredString(webp.retirementReason)) fail(`${semanticKey}: retired WebP requires retirementReason`);
    retiredWebpPaths.set(webp.path, semanticKey);
    if (existsSync(absolute)) {
      fail(`${semanticKey}: retired WebP binary must be absent (${webp.path})`);
    }
    continue;
  }

  approvedWebpPaths.set(webp.path, semanticKey);
  if (!existsSync(absolute)) {
    fail(`${semanticKey}: approved WebP production asset does not exist (${webp.path})`);
    continue;
  }

  const buffer = readFileSync(absolute);
  const size = statSync(absolute).size;
  if (webpTechnical && size > webpTechnical.maxBytes) {
    fail(`${semanticKey}: WebP exceeds maxBytes (${size} > ${webpTechnical.maxBytes})`);
  }
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (actualHash !== webp.sha256) fail(`${semanticKey}: WebP SHA-256 mismatch`);

  try {
    const metadata = inspectWebp(buffer);
    if (webpTechnical) {
      if (metadata.width < webpTechnical.minWidth || metadata.width > webpTechnical.maxWidth) {
        fail(`${semanticKey}: WebP width ${metadata.width}px is outside ${webpTechnical.minWidth}-${webpTechnical.maxWidth}px`);
      }
      if (metadata.height < webpTechnical.minHeight || metadata.height > webpTechnical.maxHeight) {
        fail(`${semanticKey}: WebP height ${metadata.height}px is outside ${webpTechnical.minHeight}-${webpTechnical.maxHeight}px`);
      }
      if (webpTechnical.requireAlpha && !metadata.hasAlpha) {
        fail(`${semanticKey}: WebP must contain alpha/transparency data`);
      }
    }
  } catch (error) {
    fail(`${semanticKey}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

let approvedSvgPathMap = new Map();
try {
  approvedSvgPathMap = validateSvgProductionPathRecords(
    approvedSvgRecords.map(({ id, productionPath }) => ({ id, productionPath })),
    { productionDirectory: registry.productionDirectory }
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

for (const { id: semanticKey, productionPath, record } of approvedSvgRecords) {
  const absolute = path.join(root, "public", productionPath.slice(1));
  if (!existsSync(absolute)) {
    fail(`${semanticKey}: approved SVG production asset does not exist (${productionPath})`);
    continue;
  }

  const buffer = readFileSync(absolute);
  const maxBytes = record.technical?.svg?.maxBytes ?? 1_000_000;
  if (statSync(absolute).size > maxBytes) {
    fail(`${semanticKey}: SVG exceeds maxBytes`);
  }
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (actualHash !== record.productionAssets.svg.sha256) fail(`${semanticKey}: SVG SHA-256 mismatch`);

  try {
    sanitizeAndValidateSvg(buffer, { maxBytes });
  } catch (error) {
    fail(`${semanticKey}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  validateSvgProductionDirectory({
    root,
    productionDirectory: registry.productionDirectory,
    approvedPaths: [...approvedSvgPathMap.keys()],
    maxBytes: 1_000_000
  });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const productionDir = path.join(root, "public", "artwork", "learning-illustrations");
for (const absolute of walkImageFiles(productionDir)) {
  const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
  const extension = path.extname(absolute).toLowerCase();

  if (extension === ".svg") {
    if (!approvedSvgPathMap.has(publicPath)) {
      fail(`${publicPath}: learning illustration SVG exists without an approved SVG registry binding`);
    }
    continue;
  }

  if (extension === ".webp") {
    if (!approvedWebpPaths.has(publicPath)) {
      fail(`${publicPath}: learning illustration WebP exists without an approved WebP registry binding`);
    }
    continue;
  }

  fail(`${publicPath}: unsupported learning illustration production format`);
}

if (process.exitCode) process.exit(process.exitCode);

const heldCount = EXPECTED_KEYS.filter((key) => registry.items[key]?.lifecycle !== "approved").length;
console.log(
  `learning illustrations v2 OK: ${approvedWebpPaths.size} approved WebP production asset(s); ${retiredWebpPaths.size} retired WebP history record(s); ${approvedSvgPathMap.size} approved SVG asset(s); ${EXPECTED_KEYS.length - heldCount - approvedSvgPathMap.size} SVG migration-ready slot(s); ${heldCount} held fail-closed slot(s); runtime activation ${registry.runtimeActivation}`
);
