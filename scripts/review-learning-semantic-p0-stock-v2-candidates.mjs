import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const expected = [
  ["action.jump", "action-jump.svg", "action-jump-v2-candidate.webp"],
  ["body.head", "body-head.svg", "body-head-v2-candidate.webp"],
  ["feature.beak", "feature-beak.svg", "feature-beak-v2-candidate.webp"],
  ["feature.cactus-thick-stem", "feature-cactus-thick-stem.svg", "feature-cactus-thick-stem-v2-candidate.webp"],
  ["feature.gills", "feature-gills.svg", "feature-gills-v2-candidate.webp"],
  ["object.ball", "object-ball.svg", "object-ball-v2-candidate.webp"],
  ["object.raincoat", "object-raincoat.svg", "object-raincoat-v2-candidate.webp"],
  ["object.towel", "object-towel.svg", "object-towel-v2-candidate.webp"],
  ["object.toy-block", "object-toy-block.svg", "object-toy-block-v2-candidate.webp"]
];
const rubricFields = ["semanticIdentity", "neighboringConceptSafety", "smallScaleReadability", "visualCleanliness", "mainlagiStyleFit", "mobileDetailRetention"];

function fail(message) {
  console.error(`Learning semantic P0 stock v2 human review: ${message}`);
  process.exit(1);
}
function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}
function slash(value) {
  return value.split(path.sep).join("/");
}
function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`cannot read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
function safePath(value, label) {
  const resolved = path.resolve(root, value);
  const publicRoot = path.resolve(root, "public");
  if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep)) fail(`${label} must not come from public/`);
  return resolved;
}
function parseArgs(argv) {
  const args = { mode: "status", output: "internal/learning-illustration-candidates/p0-v2" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--output") args.output = argv[++i];
    else if (token === "--write-template") args.mode = "write-template";
    else if (token === "--validate-review") args.mode = "validate-review";
    else fail(`unknown argument: ${token}`);
  }
  if (!args.output) fail("--output requires a path");
  return args;
}
function exactKeys(object, wanted, label) {
  const actual = Object.keys(object ?? {}).sort();
  const expectedKeys = [...wanted].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expectedKeys)) fail(`${label} keys differ from exact nine-item scope`);
}

const args = parseArgs(process.argv.slice(2));
const outDir = safePath(args.output, "review input");
const manifestPath = path.join(outDir, "candidate-manifest.json");
const reviewPath = path.join(outDir, "candidate-human-review.json");
if (!existsSync(manifestPath)) fail(`candidate manifest not found: ${slash(path.relative(root, manifestPath))}`);

const manifestBytes = readFileSync(manifestPath);
const manifest = readJson(manifestPath, "candidate manifest");
const manifestSha256 = digest(manifestBytes);
if (manifest.version !== 2 || manifest.scope !== "learning-semantic-p0-stock-v2-candidates" || manifest.candidateSet !== "p0-v2" || manifest.lifecycle !== "review-only") {
  fail("unexpected manifest version/scope/candidateSet/lifecycle");
}
if (manifest.production !== false || manifest.runtimeActive !== false || manifest.humanReviewRequired !== true) {
  fail("manifest must remain review-only, non-production, non-runtime, and human-review-required");
}
if (!Array.isArray(manifest.items) || manifest.items.length !== expected.length) fail("manifest must contain exactly nine items");

const byKey = new Map(manifest.items.map((item) => [item.semanticKey, item]));
if (byKey.size !== expected.length) fail("manifest contains duplicate semantic keys");
exactKeys(Object.fromEntries(byKey), expected.map(([key]) => key), "manifest item");
const sourceDir = safePath(manifest.sourceDirectory, "source input");
const registryBefore = existsSync(registryPath) ? readFileSync(registryPath) : null;
const verified = [];

for (const [semanticKey, sourceFilename, filename] of expected) {
  const item = byKey.get(semanticKey);
  if (!item) fail(`${semanticKey} missing from manifest`);
  if (item.sourceFilename !== sourceFilename || item.filename !== filename) fail(`${semanticKey} canonical filename/source mismatch`);
  if (item.production !== false || item.runtimeActive !== false || item.humanReviewRequired !== true) fail(`${semanticKey} lifecycle mismatch`);
  if (item.width !== 512 || item.height !== 512 || item.hasAlpha !== true) fail(`${semanticKey} manifest technical contract mismatch`);
  if (!Number.isInteger(item.bytes) || item.bytes <= 512 || item.bytes >= 300000) fail(`${semanticKey} candidate byte size outside contract`);
  if (!Number.isInteger(item.sourceBytes) || item.sourceBytes <= 128) fail(`${semanticKey} source byte size invalid`);
  if (!/^[a-f0-9]{64}$/.test(item.sha256) || !/^[a-f0-9]{64}$/.test(item.sourceSha256)) fail(`${semanticKey} SHA-256 invalid`);

  const sourcePath = path.join(sourceDir, sourceFilename);
  if (!existsSync(sourcePath)) fail(`${semanticKey} source file missing`);
  const sourceBytes = readFileSync(sourcePath);
  if (sourceBytes.length !== item.sourceBytes || digest(sourceBytes) !== item.sourceSha256) fail(`${semanticKey} source differs from manifest`);

  const candidatePath = path.join(outDir, filename);
  if (!existsSync(candidatePath)) fail(`${semanticKey} candidate file missing`);
  const bytes = readFileSync(candidatePath);
  if (bytes.length !== item.bytes || digest(bytes) !== item.sha256) fail(`${semanticKey} candidate differs from manifest`);
  const meta = await sharp(bytes).metadata();
  if (meta.format !== "webp" || meta.width !== 512 || meta.height !== 512 || meta.hasAlpha !== true) fail(`${semanticKey} candidate must remain 512x512 alpha WebP`);
  verified.push(item);
}
console.log("Candidate integrity OK: 9/9 exact semantic P0 v2 files + bound source SVGs.");
console.log(`Manifest SHA-256: ${manifestSha256}`);

if (args.mode === "status") {
  console.log(`Human review file: ${existsSync(reviewPath) ? "exists" : "not created"}`);
  console.log("Production registry, public illustration subtree, and runtime mapping remain unchanged.");
} else if (args.mode === "write-template") {
  if (existsSync(reviewPath)) fail("human review file already exists; refusing to overwrite");
  const items = {};
  for (const item of verified) {
    items[item.semanticKey] = {
      candidateFilename: item.filename,
      candidateSha256: item.sha256,
      sourceFilename: item.sourceFilename,
      sourceSha256: item.sourceSha256,
      decision: "pending",
      semanticIdentity: "pending",
      neighboringConceptSafety: "pending",
      smallScaleReadability: "pending",
      visualCleanliness: "pending",
      mainlagiStyleFit: "pending",
      mobileDetailRetention: "pending",
      notes: null
    };
  }
  const review = {
    version: 2,
    scope: "learning-semantic-p0-stock-v2-human-review",
    candidateSet: "p0-v2",
    lifecycle: "human-review-record",
    manifestSha256,
    reviewer: { name: null, reviewedAt: null },
    attestation: {
      viewedExactFiles: false,
      noProductionApprovalRequested: true,
      noRuntimeActivationRequested: true
    },
    items
  };
  writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  console.log(`Human review template created: ${slash(path.relative(root, reviewPath))}`);
  console.log("Fill it only after viewing the exact nine v2 candidate binaries. Nothing was approved, copied to public/, or activated.");
} else {
  if (!existsSync(reviewPath)) fail("human review file not found");
  const review = readJson(reviewPath, "human review");
  if (review.version !== 2 || review.scope !== "learning-semantic-p0-stock-v2-human-review" || review.candidateSet !== "p0-v2") fail("unexpected review version/scope/candidateSet");
  if (review.manifestSha256 !== manifestSha256) fail("review manifest SHA differs from current candidate manifest");
  if (!review.reviewer?.name || typeof review.reviewer.name !== "string") fail("reviewer name is required");
  if (!review.reviewer?.reviewedAt || Number.isNaN(Date.parse(review.reviewer.reviewedAt))) fail("valid reviewedAt timestamp is required");
  if (review.attestation?.viewedExactFiles !== true) fail("viewedExactFiles must be true");
  if (review.attestation?.noProductionApprovalRequested !== true || review.attestation?.noRuntimeActivationRequested !== true) fail("review attestation boundaries must remain true");
  exactKeys(review.items, expected.map(([key]) => key), "review item");

  let accepted = 0;
  let rejected = 0;
  for (const item of verified) {
    const reviewItem = review.items[item.semanticKey];
    if (reviewItem.candidateFilename !== item.filename || reviewItem.candidateSha256 !== item.sha256 || reviewItem.sourceFilename !== item.sourceFilename || reviewItem.sourceSha256 !== item.sourceSha256) {
      fail(`${item.semanticKey} review binding differs from current exact candidate/source`);
    }
    if (!["accepted", "rejected"].includes(reviewItem.decision)) fail(`${item.semanticKey} review decision is still pending`);
    const rubric = rubricFields.map((field) => reviewItem[field]);
    if (rubric.some((value) => !["pass", "fail"].includes(value))) fail(`${item.semanticKey} has pending rubric checks`);
    if (reviewItem.decision === "accepted" && rubric.some((value) => value !== "pass")) fail(`${item.semanticKey} accepted requires all rubric fields to pass`);
    if (reviewItem.decision === "rejected" && !rubric.includes("fail")) fail(`${item.semanticKey} rejected requires at least one failed rubric field`);
    if (reviewItem.decision === "accepted") accepted += 1;
    else rejected += 1;
  }

  console.log(`HUMAN REVIEW RECORDED: ${accepted} accepted / ${rejected} rejected exact v2 candidate(s).`);
  console.log("This is NOT production approval. Legal provenance, public production copy, registry approval, and runtime semantic mapping remain separate gated work.");
}
if (registryBefore && existsSync(registryPath)) {
  const registryAfter = readFileSync(registryPath);
  if (!registryBefore.equals(registryAfter)) fail("review tooling mutated production provenance registry");
}
