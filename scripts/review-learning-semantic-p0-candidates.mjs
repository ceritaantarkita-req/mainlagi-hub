import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const expected = [
  ["action.jump", "action-jump-v1-candidate.webp"],
  ["body.head", "body-head-v1-candidate.webp"],
  ["feature.beak", "feature-beak-v1-candidate.webp"],
  ["feature.cactus-thick-stem", "feature-cactus-thick-stem-v1-candidate.webp"],
  ["feature.gills", "feature-gills-v1-candidate.webp"],
  ["object.ball", "object-ball-v1-candidate.webp"],
  ["object.raincoat", "object-raincoat-v1-candidate.webp"],
  ["object.towel", "object-towel-v1-candidate.webp"],
  ["object.toy-block", "object-toy-block-v1-candidate.webp"]
];
const expectedMap = new Map(expected);
const rubricFields = [
  "semanticIdentity",
  "neighboringConceptSafety",
  "smallScaleReadability",
  "visualCleanliness",
  "mainlagiStyleFit",
  "mobileDetailRetention"
];

function fail(message) {
  console.error(`Learning semantic P0 human review: ${message}`);
  process.exit(1);
}

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function parseArgs(argv) {
  const args = { mode: "status", output: "internal/learning-illustration-candidates/p0-v1", help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--output") {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) fail("--output requires a path");
      args.output = next;
      index += 1;
    } else if (token === "--write-template") {
      if (args.mode !== "status") fail("choose only one review mode");
      args.mode = "write-template";
    } else if (token === "--validate-review") {
      if (args.mode !== "status") fail("choose only one review mode");
      args.mode = "validate-review";
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    } else {
      fail(`unknown argument: ${token}`);
    }
  }
  return args;
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`cannot read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function safeOutput(relative) {
  const resolved = path.resolve(root, relative);
  const publicRoot = path.resolve(root, "public");
  if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep)) {
    fail("review input must not come from public/");
  }
  return resolved;
}

function exactKeys(object, wanted, label) {
  const actual = Object.keys(object ?? {}).sort();
  const expectedKeys = [...wanted].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expectedKeys)) fail(`${label} keys differ from exact nine-item scope`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log("Usage: node scripts/review-learning-semantic-p0-candidates.mjs [--output <candidate-dir>] [--write-template|--validate-review]");
  console.log("Default mode validates exact candidate integrity only. This tool never approves production, mutates the provenance registry, copies files into public/, or activates runtime mapping.");
  process.exit(0);
}

const outDir = safeOutput(args.output);
const manifestPath = path.join(outDir, "candidate-manifest.json");
const reviewPath = path.join(outDir, "candidate-human-review.json");
if (!existsSync(manifestPath)) fail(`candidate manifest not found: ${slash(path.relative(root, manifestPath))}; generate exact candidates first`);

const manifestBytes = readFileSync(manifestPath);
const manifest = readJson(manifestPath, "candidate manifest");
const manifestSha256 = digest(manifestBytes);

if (manifest.version !== 1 || manifest.scope !== "learning-semantic-p0-candidates" || manifest.lifecycle !== "review-only") {
  fail("unexpected manifest version/scope/lifecycle");
}
if (manifest.production !== false || manifest.runtimeActive !== false || manifest.humanReviewRequired !== true) {
  fail("manifest must remain review-only, non-production, non-runtime, and human-review-required");
}
if (!Array.isArray(manifest.items) || manifest.items.length !== expected.length) fail("manifest must contain exactly nine items");

const byKey = new Map(manifest.items.map((item) => [item.semanticKey, item]));
if (byKey.size !== expected.length) fail("manifest contains duplicate semantic keys");
exactKeys(Object.fromEntries(byKey), expected.map(([key]) => key), "manifest item");

const registryBefore = existsSync(registryPath) ? readFileSync(registryPath) : null;
const verified = [];

for (const [semanticKey, filename] of expected) {
  const item = byKey.get(semanticKey);
  if (!item) fail(`${semanticKey} missing from manifest`);
  if (item.filename !== filename) fail(`${semanticKey} filename differs from canonical candidate filename`);
  if (item.production !== false || item.runtimeActive !== false || item.humanReviewRequired !== true) {
    fail(`${semanticKey} must remain non-production, non-runtime, and human-review-required`);
  }
  if (item.width !== 512 || item.height !== 512 || item.hasAlpha !== true) fail(`${semanticKey} manifest technical contract mismatch`);
  if (!Number.isInteger(item.bytes) || item.bytes <= 512 || item.bytes >= 300000) fail(`${semanticKey} manifest byte size is outside review contract`);
  if (typeof item.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(item.sha256)) fail(`${semanticKey} manifest SHA-256 is invalid`);

  const filePath = path.join(outDir, filename);
  if (!existsSync(filePath)) fail(`${semanticKey} candidate file is missing`);
  const bytes = readFileSync(filePath);
  if (bytes.length !== item.bytes) fail(`${semanticKey} byte count differs from manifest`);
  const sha256 = digest(bytes);
  if (sha256 !== item.sha256) fail(`${semanticKey} SHA-256 differs from manifest`);

  const meta = await sharp(bytes).metadata();
  if (meta.format !== "webp" || meta.width !== 512 || meta.height !== 512 || meta.hasAlpha !== true) {
    fail(`${semanticKey} candidate must remain 512x512 alpha WebP`);
  }

  verified.push({
    semanticKey,
    filename,
    file: slash(path.relative(root, filePath)),
    bytes: bytes.length,
    sha256
  });
}

if (registryBefore && !readFileSync(registryPath).equals(registryBefore)) fail("candidate integrity check mutated production registry");
console.log(`Candidate integrity OK: ${verified.length}/${expected.length} exact semantic P0 files.`);

if (args.mode === "status") {
  console.log(`Manifest SHA-256: ${manifestSha256}`);
  console.log(`Human review file: ${existsSync(reviewPath) ? slash(path.relative(root, reviewPath)) : "not created"}`);
  console.log("Production registry, public illustration subtree, and runtime mapping remain unchanged.");
  process.exit(0);
}

if (args.mode === "write-template") {
  if (existsSync(reviewPath)) fail(`review file already exists: ${slash(path.relative(root, reviewPath))}; refusing to overwrite human work`);
  const review = {
    schemaVersion: 1,
    scope: manifest.scope,
    candidate: {
      manifestSha256,
      outputDirectory: slash(path.relative(root, outDir))
    },
    reviewer: {
      name: null,
      reviewedAt: null
    },
    items: Object.fromEntries(verified.map((item) => [item.semanticKey, {
      filename: item.filename,
      file: item.file,
      sha256: item.sha256,
      decision: "pending",
      semanticIdentity: "pending",
      neighboringConceptSafety: "pending",
      smallScaleReadability: "pending",
      visualCleanliness: "pending",
      mainlagiStyleFit: "pending",
      mobileDetailRetention: "pending",
      notes: ""
    }])),
    attestation: {
      viewedExactFiles: false,
      noProductionApprovalRequested: true,
      noRuntimeActivationRequested: true
    }
  };
  writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  console.log(`Human review template created: ${slash(path.relative(root, reviewPath))}`);
  console.log("Fill it only after viewing the exact nine candidate binaries. Nothing was approved, copied to public/, or activated.");
  process.exit(0);
}

if (!existsSync(reviewPath)) fail("human review file does not exist; run --write-template after candidate integrity passes");
const review = readJson(reviewPath, "human review");
if (review.schemaVersion !== 1 || review.scope !== manifest.scope) fail("review schema/scope mismatch");
if (review.candidate?.manifestSha256 !== manifestSha256) fail("review is stale: candidate manifest changed after template creation");
if (review.candidate?.outputDirectory !== slash(path.relative(root, outDir))) fail("review output directory mismatch");
if (review.attestation?.noProductionApprovalRequested !== true || review.attestation?.noRuntimeActivationRequested !== true) {
  fail("review must attest that production approval and runtime activation remain separate work");
}

exactKeys(review.items, expected.map(([key]) => key), "review item");

let accepted = 0;
let rejected = 0;
for (const item of verified) {
  const record = review.items[item.semanticKey];
  if (record.filename !== item.filename || record.file !== item.file || record.sha256 !== item.sha256) {
    fail(`${item.semanticKey} review evidence no longer matches the exact candidate`);
  }
  if (!["pending", "accepted", "rejected"].includes(record.decision)) fail(`${item.semanticKey} decision must be pending, accepted, or rejected`);

  let pass = 0;
  let failCount = 0;
  let pending = 0;
  for (const field of rubricFields) {
    if (!["pending", "pass", "fail"].includes(record[field])) fail(`${item.semanticKey} ${field} must be pending, pass, or fail`);
    if (record[field] === "pass") pass += 1;
    else if (record[field] === "fail") failCount += 1;
    else pending += 1;
  }

  if (record.decision === "pending") fail(`${item.semanticKey} review decision is still pending`);
  if (pending !== 0) fail(`${item.semanticKey} completed decision cannot contain pending rubric checks`);
  if (record.decision === "accepted") {
    if (failCount !== 0 || pass !== rubricFields.length) fail(`${item.semanticKey} accepted decision requires every rubric check to pass`);
    accepted += 1;
  } else {
    if (failCount < 1) fail(`${item.semanticKey} rejected decision requires at least one failed rubric check`);
    rejected += 1;
  }
}

if (typeof review.reviewer?.name !== "string" || !review.reviewer.name.trim()) fail("completed review requires reviewer.name");
if (typeof review.reviewer?.reviewedAt !== "string" || Number.isNaN(Date.parse(review.reviewer.reviewedAt))) fail("completed review requires valid reviewer.reviewedAt");
if (review.attestation?.viewedExactFiles !== true) fail("completed review requires viewedExactFiles=true");
if (registryBefore && !readFileSync(registryPath).equals(registryBefore)) fail("human review validation mutated production registry");

console.log(`HUMAN REVIEW RECORDED: ${accepted} accepted / ${rejected} rejected exact candidate(s).`);
console.log("This is NOT production approval. Legal provenance, public production copy, registry approval, and runtime semantic mapping remain separate gated work.");
