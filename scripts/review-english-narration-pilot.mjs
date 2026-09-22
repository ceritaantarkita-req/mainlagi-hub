import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const specPath = path.join(root, "src", "lib", "data", "english-narration-pilot-spec.json");
const registryPath = path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json");

function fail(message) {
  console.error(`English narration human review: ${message}`);
  process.exit(1);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`cannot read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString("ascii", 0, 3) === "ID3") return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

function safeSegment(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function parseArgs(argv) {
  const args = { voice: null, mode: "status", help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--voice") {
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) fail("--voice requires a value");
      args.voice = next;
      i += 1;
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

function exactKeys(object, expected, label) {
  const actual = Object.keys(object ?? {}).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    fail(`${label} keys differ from exact pilot scope`);
  }
}

const args = parseArgs(process.argv.slice(2));
const spec = readJson(specPath, "pilot spec");
const registry = readJson(registryPath, "narration registry");

if (args.help) {
  console.log("Usage: node scripts/review-english-narration-pilot.mjs [--voice marin|cedar] [--write-template|--validate-review]");
  console.log("Default mode validates candidate manifest/files only. This tool never changes production registry, public audio, or runtime.");
  process.exit(0);
}

if (spec?.version !== 1 || spec.scope !== "english-narration-four-item-provider-pilot") fail("unexpected pilot spec version/scope");
if (spec.provider?.status !== "primary-pilot-candidate-not-production-locked") fail("provider must remain a pilot candidate, not a production lock");
if (!Array.isArray(spec.items) || spec.items.length !== 4) fail("pilot spec must contain exactly four items");

const voice = args.voice ?? spec.provider.defaultVoice;
if (!spec.provider.voiceCandidates.includes(voice)) fail(`unsupported pilot voice "${voice}"`);

let outputRoot = spec.output.root;
const testOverride = process.env.MAINLAGI_NARRATION_PILOT_TEST_OUTPUT_ROOT;
if (testOverride) {
  if (process.env.NODE_ENV !== "test") fail("test output override is only allowed with NODE_ENV=test");
  if (!testOverride.startsWith("internal/test-fixtures/")) fail("test output override must stay under internal/test-fixtures/");
  outputRoot = testOverride;
}

const outDir = path.join(root, outputRoot, `${safeSegment(spec.provider.model)}__${safeSegment(voice)}`);
const manifestPath = path.join(outDir, "pilot-manifest.json");
const reviewPath = path.join(outDir, "pilot-human-review.json");

if (!existsSync(manifestPath)) {
  fail(`candidate manifest not found: ${slash(path.relative(root, manifestPath))}; generate the exact pilot locally/server-side first`);
}

const manifestBytes = readFileSync(manifestPath);
const manifest = readJson(manifestPath, "candidate manifest");
const manifestSha256 = sha256(manifestBytes);

if (manifest.provider !== spec.provider.name) fail("manifest provider mismatch");
if (manifest.model !== spec.provider.model) fail("manifest model mismatch");
if (manifest.voice !== voice) fail("manifest voice mismatch");
if (manifest.outputFormat !== spec.provider.outputFormat) fail("manifest output format mismatch");
if (manifest.production !== false || manifest.runtimeActive !== false || manifest.registryUpdated !== false || manifest.humanReviewRequired !== true) {
  fail("manifest must remain non-production, non-runtime, registry-unchanged, and human-review-required");
}
if (manifest.aiDisclosureRequired !== true) fail("manifest must preserve AI-disclosure requirement");
if (!Array.isArray(manifest.items) || manifest.items.length !== spec.items.length) fail("manifest item count mismatch");

const manifestItems = new Map(manifest.items.map((item) => [item.activityId, item]));
if (manifestItems.size !== spec.items.length) fail("manifest contains duplicate activity IDs");

const verified = [];
for (const item of spec.items) {
  const registryRecord = registry.items?.[item.activityId];
  if (!registryRecord || registryRecord.lifecycle !== "review-required") {
    fail(`${item.activityId} must remain review-required in production registry during pilot review`);
  }
  if (registryRecord.transcript !== item.transcript) fail(`${item.activityId} registry transcript drift`);

  const candidate = manifestItems.get(item.activityId);
  if (!candidate) fail(`${item.activityId} missing from candidate manifest`);
  if (candidate.transcript !== item.transcript) fail(`${item.activityId} manifest transcript drift`);

  const expectedFile = path.join(outDir, `${item.activityId}-candidate.mp3`);
  const expectedRel = slash(path.relative(root, expectedFile));
  if (candidate.file !== expectedRel) fail(`${item.activityId} candidate path is not canonical for this local pilot`);
  if (!existsSync(expectedFile)) fail(`${item.activityId} candidate MP3 is missing`);

  const bytes = readFileSync(expectedFile);
  if (bytes.length < 512) fail(`${item.activityId} candidate is below 512 bytes`);
  if (!looksLikeMp3(bytes)) fail(`${item.activityId} candidate does not look like MP3`);
  if (candidate.bytes !== bytes.length) fail(`${item.activityId} byte count differs from manifest`);
  const digest = sha256(bytes);
  if (candidate.sha256 !== digest) fail(`${item.activityId} SHA-256 differs from manifest`);

  verified.push({
    activityId: item.activityId,
    transcript: item.transcript,
    file: expectedRel,
    bytes: bytes.length,
    sha256: digest
  });
}

console.log(`Candidate integrity OK: ${verified.length}/${spec.items.length} exact pilot files for ${voice}.`);

if (args.mode === "status") {
  console.log(`Manifest SHA-256: ${manifestSha256}`);
  console.log(`Human review file: ${existsSync(reviewPath) ? slash(path.relative(root, reviewPath)) : "not created"}`);
  console.log("Production registry, public audio, and runtime remain unchanged.");
  process.exit(0);
}

if (args.mode === "write-template") {
  if (existsSync(reviewPath)) fail(`review file already exists: ${slash(path.relative(root, reviewPath))}; refusing to overwrite human work`);
  const review = {
    schemaVersion: 1,
    scope: spec.scope,
    candidate: {
      provider: spec.provider.name,
      model: spec.provider.model,
      voice,
      manifestSha256
    },
    reviewer: {
      name: null,
      reviewedAt: null
    },
    decision: "pending",
    items: Object.fromEntries(verified.map((item) => [item.activityId, {
      transcript: item.transcript,
      file: item.file,
      sha256: item.sha256,
      exactWordFidelity: "pending",
      pronunciation: "pending",
      childLearningPace: "pending",
      audioCleanliness: "pending",
      notes: ""
    }])),
    attestation: {
      listenedToExactFiles: false,
      noRegistryOrRuntimeChangeRequested: true
    }
  };
  writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  console.log(`Human review template created: ${slash(path.relative(root, reviewPath))}`);
  console.log("Fill it only after listening to the exact local candidate files. Nothing was approved or activated.");
  process.exit(0);
}

if (!existsSync(reviewPath)) fail("human review file does not exist; run --write-template after candidate integrity passes");
const review = readJson(reviewPath, "human review");
if (review.schemaVersion !== 1 || review.scope !== spec.scope) fail("review schema/scope mismatch");
if (review.candidate?.provider !== spec.provider.name || review.candidate?.model !== spec.provider.model || review.candidate?.voice !== voice) {
  fail("review candidate identity mismatch");
}
if (review.candidate.manifestSha256 !== manifestSha256) fail("review is stale: candidate manifest changed after the review template was created");
if (!["pending", "accepted", "rejected"].includes(review.decision)) fail("review decision must be pending, accepted, or rejected");
if (review.attestation?.noRegistryOrRuntimeChangeRequested !== true) fail("review must attest that registry/runtime changes are separate work");

const expectedIds = spec.items.map((item) => item.activityId);
exactKeys(review.items, expectedIds, "review item");
const rubricFields = ["exactWordFidelity", "pronunciation", "childLearningPace", "audioCleanliness"];
let passCount = 0;
let failCount = 0;
let pendingCount = 0;

for (const item of verified) {
  const record = review.items[item.activityId];
  if (record.transcript !== item.transcript || record.file !== item.file || record.sha256 !== item.sha256) {
    fail(`${item.activityId} review evidence no longer matches the exact candidate`);
  }
  for (const field of rubricFields) {
    if (!["pending", "pass", "fail"].includes(record[field])) fail(`${item.activityId} ${field} must be pending, pass, or fail`);
    if (record[field] === "pass") passCount += 1;
    else if (record[field] === "fail") failCount += 1;
    else pendingCount += 1;
  }
}

if (review.decision === "pending") {
  console.log(`Human review remains PENDING: ${passCount} pass / ${failCount} fail / ${pendingCount} pending rubric checks.`);
  console.log("Production registry, public audio, and runtime remain unchanged.");
  process.exit(0);
}

if (typeof review.reviewer?.name !== "string" || !review.reviewer.name.trim()) fail("completed review requires reviewer.name");
if (typeof review.reviewer?.reviewedAt !== "string" || Number.isNaN(Date.parse(review.reviewer.reviewedAt))) fail("completed review requires valid reviewer.reviewedAt");
if (review.attestation?.listenedToExactFiles !== true) fail("completed review requires listenedToExactFiles=true");

if (review.decision === "accepted") {
  if (failCount !== 0 || pendingCount !== 0 || passCount !== verified.length * rubricFields.length) {
    fail("accepted decision requires every rubric check on all four exact candidates to pass");
  }
  console.log(`HUMAN ACCEPTED local candidate set for ${voice}: all ${passCount} rubric checks passed.`);
  console.log("This is NOT production approval: registry, public audio, rights recheck, and runtime activation remain separate gated work.");
  process.exit(0);
}

if (pendingCount !== 0) fail("rejected decision cannot contain pending rubric checks");
if (failCount < 1) fail("rejected decision must record at least one failed rubric check");
console.log(`HUMAN REJECTED local candidate set for ${voice}: ${failCount} failed rubric check(s).`);
console.log("Production registry, public audio, and runtime remain unchanged.");
