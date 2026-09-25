import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  sanitizeAndValidateSvg,
  validateSvgProductionDirectory,
  validateSvgProductionPathRecords
} from "./lib/svg-asset-security.mjs";

const root = process.env.CHARACTER_ASSET_ROOT ? path.resolve(process.env.CHARACTER_ASSET_ROOT) : process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "character-asset-provenance.json");

const CHARACTER_IDS = ["naya", "gian", "zia", "paca", "gavi"];
const STATES = ["hero", "welcome", "pointing", "thinking", "correct", "try_again", "celebrate"];
const ALLOWED_LIFECYCLE = new Set(["review-required", "approved"]);
const ALLOWED_PROVENANCE = new Set(["pending", "owned", "licensed"]);
const IMAGE_EXTENSIONS = new Set([".png", ".webp", ".jpg", ".jpeg", ".avif", ".svg"]);
const SOURCE_VALIDATOR = "scripts/lib/svg-asset-security.mjs";
const SOURCE_INVENTORY = "docs/data/MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.json";

function fail(message) {
  console.error(`character assets: ${message}`);
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

function validDriveId(value) {
  return requiredString(value) && /^[A-Za-z0-9_-]+$/.test(value);
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
  registry?.version !== 2 ||
  registry.scope !== "mainlagi-character-svg-state-bank" ||
  registry.productionDirectory !== "/artwork/characters" ||
  registry.sourceInventory !== SOURCE_INVENTORY ||
  !Array.isArray(registry.characterIds) ||
  !Array.isArray(registry.stateVocabulary) ||
  !registry.items ||
  typeof registry.items !== "object" ||
  Array.isArray(registry.items)
) {
  fail("registry header must define version=2, mainlagi-character-svg-state-bank scope, canonical production directory/source inventory, characterIds, stateVocabulary, and items");
  process.exit();
}

if (JSON.stringify(registry.characterIds) !== JSON.stringify(CHARACTER_IDS)) {
  fail(`characterIds must be exactly: ${CHARACTER_IDS.join(", ")}`);
}
if (JSON.stringify(registry.stateVocabulary) !== JSON.stringify(STATES)) {
  fail(`stateVocabulary must be exactly: ${STATES.join(", ")}`);
}

const actualIds = Object.keys(registry.items);
if (JSON.stringify([...actualIds].sort()) !== JSON.stringify([...CHARACTER_IDS].sort())) {
  fail(`registry must contain exactly characters: ${CHARACTER_IDS.join(", ")}`);
}

const sourceDriveIds = new Map();
const sourceHashes = new Map();
const approvedRecords = [];
const allExpectedPaths = new Map();

for (const id of CHARACTER_IDS) {
  const character = registry.items[id];
  if (!character || typeof character !== "object" || Array.isArray(character)) {
    fail(`${id}: missing character record`);
    continue;
  }

  const identity = character.identityReference;
  if (!identity || typeof identity !== "object" || Array.isArray(identity)) {
    fail(`${id}: identityReference object is required`);
  } else {
    if (!validDriveId(identity.driveFileId)) fail(`${id}: identityReference.driveFileId is invalid`);
    if (!requiredString(identity.sourceFilename) || !identity.sourceFilename.toLowerCase().endsWith(".svg")) {
      fail(`${id}: identityReference.sourceFilename must be .svg`);
    }
    if (!Number.isInteger(identity.sizeBytes) || identity.sizeBytes <= 0) {
      fail(`${id}: identityReference.sizeBytes must be a positive integer`);
    }
  }

  if (!character.variants || typeof character.variants !== "object" || Array.isArray(character.variants)) {
    fail(`${id}: variants object is required`);
    continue;
  }

  const actualStates = Object.keys(character.variants);
  if (JSON.stringify([...actualStates].sort()) !== JSON.stringify([...STATES].sort())) {
    fail(`${id}: variants must contain exactly states: ${STATES.join(", ")}`);
  }

  for (const state of STATES) {
    const slot = `${id}.${state}`;
    const variant = character.variants[state];
    if (!variant || typeof variant !== "object" || Array.isArray(variant)) {
      fail(`${slot}: missing variant record`);
      continue;
    }

    if (!ALLOWED_LIFECYCLE.has(variant.lifecycle)) fail(`${slot}: invalid lifecycle`);

    const source = variant.source;
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      fail(`${slot}: source object is required`);
    } else {
      if (!validDriveId(source.driveFileId)) fail(`${slot}: source.driveFileId is invalid`);
      if (!requiredString(source.sourceFilename) || !source.sourceFilename.toLowerCase().endsWith(".svg")) {
        fail(`${slot}: source.sourceFilename must be .svg`);
      }
      if (!validSha(source.sourceSha256)) fail(`${slot}: source.sourceSha256 must be lowercase SHA-256`);
      if (!Number.isInteger(source.sizeBytes) || source.sizeBytes <= 0) {
        fail(`${slot}: source.sizeBytes must be a positive integer`);
      }
      if (source.ambiguityStatus !== "unique") fail(`${slot}: source.ambiguityStatus must be unique`);
      if (!requiredString(source.visualInventoryReview)) fail(`${slot}: source.visualInventoryReview is required`);

      if (validDriveId(source.driveFileId)) {
        if (sourceDriveIds.has(source.driveFileId)) {
          fail(`${slot}: source.driveFileId already assigned to ${sourceDriveIds.get(source.driveFileId)}`);
        } else {
          sourceDriveIds.set(source.driveFileId, slot);
        }
      }
      if (validSha(source.sourceSha256)) {
        if (sourceHashes.has(source.sourceSha256)) {
          fail(`${slot}: source SHA-256 already assigned to ${sourceHashes.get(source.sourceSha256)}`);
        } else {
          sourceHashes.set(source.sourceSha256, slot);
        }
      }
    }

    const stateSlug = state.replaceAll("_", "-");
    const expectedPath = `/artwork/characters/${id}-${stateSlug}-v1.svg`;
    if (variant.expectedProductionPath !== expectedPath) {
      fail(`${slot}: expectedProductionPath must be ${expectedPath}`);
    }
    if (allExpectedPaths.has(expectedPath)) {
      fail(`${slot}: expectedProductionPath already assigned to ${allExpectedPaths.get(expectedPath)}`);
    } else {
      allExpectedPaths.set(expectedPath, slot);
    }

    const provenance = variant.provenance;
    if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) {
      fail(`${slot}: provenance object is required`);
    } else {
      if (!ALLOWED_PROVENANCE.has(provenance.status)) fail(`${slot}: invalid provenance status`);
      if (!requiredString(provenance.sourceBasis)) fail(`${slot}: provenance.sourceBasis is required`);
      if (typeof provenance.redistributionAllowed !== "boolean") {
        fail(`${slot}: provenance.redistributionAllowed must be boolean`);
      }
      if (!validDate(provenance.reviewedAt)) fail(`${slot}: provenance.reviewedAt must use YYYY-MM-DD`);
    }

    const technical = variant.technical;
    if (!technical || typeof technical !== "object" || Array.isArray(technical)) {
      fail(`${slot}: technical contract is required`);
    } else {
      if (technical.format !== "svg") fail(`${slot}: technical.format must be svg`);
      if (!Number.isInteger(technical.maxBytes) || technical.maxBytes <= 0) {
        fail(`${slot}: technical.maxBytes must be a positive integer`);
      }
      if (technical.requireViewBox !== true) fail(`${slot}: technical.requireViewBox must be true`);
      if (technical.productionSanitizationRequired !== true) {
        fail(`${slot}: technical.productionSanitizationRequired must be true`);
      }
      const sourceValidation = technical.sourceValidation;
      if (!sourceValidation || typeof sourceValidation !== "object" || Array.isArray(sourceValidation)) {
        fail(`${slot}: technical.sourceValidation is required`);
      } else {
        if (sourceValidation.status !== "passed") fail(`${slot}: sourceValidation.status must be passed`);
        if (sourceValidation.validator !== SOURCE_VALIDATOR) {
          fail(`${slot}: sourceValidation.validator must be ${SOURCE_VALIDATOR}`);
        }
        if (!validDate(sourceValidation.reviewedAt)) {
          fail(`${slot}: sourceValidation.reviewedAt must use YYYY-MM-DD`);
        }
      }
    }

    if (variant.lifecycle !== "approved") {
      if (variant.productionPath !== null) fail(`${slot}: non-approved variant must keep productionPath=null`);
      if (variant.productionSha256 !== null) fail(`${slot}: non-approved variant must keep productionSha256=null`);
      if (provenance?.redistributionAllowed !== false) {
        fail(`${slot}: non-approved variant must fail closed for redistribution`);
      }
      continue;
    }

    if (variant.productionPath !== expectedPath) {
      fail(`${slot}: approved productionPath must equal expectedProductionPath`);
    }
    if (!validSha(variant.productionSha256)) {
      fail(`${slot}: approved variant requires lowercase production SHA-256`);
    }
    if (!provenance || !["owned", "licensed"].includes(provenance.status)) {
      fail(`${slot}: approved variant requires owned or licensed provenance`);
    }
    if (provenance?.redistributionAllowed !== true) {
      fail(`${slot}: approved variant requires redistributionAllowed=true`);
    }
    if (!requiredString(provenance?.rightsHolder)) fail(`${slot}: approved variant requires rightsHolder`);
    if (!requiredString(provenance?.licenseBasis)) fail(`${slot}: approved variant requires licenseBasis`);

    if (variant.productionPath === expectedPath) {
      approvedRecords.push({ id: slot, productionPath: variant.productionPath, variant });
    }
  }
}

let approvedPathMap = new Map();
try {
  approvedPathMap = validateSvgProductionPathRecords(
    approvedRecords.map(({ id, productionPath }) => ({ id, productionPath })),
    { productionDirectory: registry.productionDirectory }
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

for (const { id: slot, productionPath, variant } of approvedRecords) {
  const absolute = path.join(root, "public", productionPath.slice(1));
  if (!existsSync(absolute)) {
    fail(`${slot}: approved production SVG does not exist (${productionPath})`);
    continue;
  }

  const buffer = readFileSync(absolute);
  const size = statSync(absolute).size;
  if (size > variant.technical.maxBytes) {
    fail(`${slot}: SVG exceeds maxBytes (${size} > ${variant.technical.maxBytes})`);
  }
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (actualHash !== variant.productionSha256) fail(`${slot}: production SHA-256 mismatch`);

  try {
    sanitizeAndValidateSvg(buffer, { maxBytes: variant.technical.maxBytes });
  } catch (error) {
    fail(`${slot}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  validateSvgProductionDirectory({
    root,
    productionDirectory: registry.productionDirectory,
    approvedPaths: [...approvedPathMap.keys()],
    maxBytes: 1_000_000
  });
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const productionDir = path.join(root, "public", "artwork", "characters");
for (const absolute of walkImageFiles(productionDir)) {
  const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
  if (path.extname(absolute).toLowerCase() !== ".svg") {
    fail(`${publicPath}: character production tree is SVG-only under registry v2`);
  } else if (!approvedPathMap.has(publicPath)) {
    fail(`${publicPath}: character SVG exists in public tree without an approved provenance record`);
  }
}

if (process.exitCode) process.exit(process.exitCode);

const approvedCount = approvedRecords.length;
const totalSlots = CHARACTER_IDS.length * STATES.length;
console.log(
  `character assets v2 OK: ${CHARACTER_IDS.length} characters / ${totalSlots} SVG state slots; ${approvedCount} approved production variant(s); ${totalSlots - approvedCount} fail-closed review-required variant(s)`
);
