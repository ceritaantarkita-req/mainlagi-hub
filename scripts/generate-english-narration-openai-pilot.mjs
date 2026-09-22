import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const specPath = path.join(root, "src", "lib", "data", "english-narration-pilot-spec.json");
const registryPath = path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json");

function fail(message) {
  console.error(`English narration pilot: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { generate: false, force: false, voice: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--generate") args.generate = true;
    else if (token === "--dry-run") args.generate = false;
    else if (token === "--force") args.force = true;
    else if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--voice") {
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) fail("--voice requires a value");
      args.voice = next;
      i += 1;
    } else {
      fail(`unknown argument: ${token}`);
    }
  }
  return args;
}

function looksLikeMp3(buffer) {
  if (buffer.length < 4) return false;
  if (buffer.toString("ascii", 0, 3) === "ID3") return true;
  return buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function safeSegment(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

const args = parseArgs(process.argv.slice(2));
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

if (args.help) {
  console.log("Usage: node scripts/generate-english-narration-openai-pilot.mjs [--dry-run] [--generate] [--voice marin|cedar] [--force]");
  console.log("Dry-run is the default. --generate requires OPENAI_API_KEY and writes only under internal/.");
  process.exit(0);
}

if (spec?.version !== 1 || spec.scope !== "english-narration-four-item-provider-pilot") {
  fail("unexpected pilot spec version/scope");
}
if (spec.provider?.name !== "OpenAI" || spec.provider?.status !== "primary-pilot-candidate-not-production-locked") {
  fail("pilot provider spec must remain an explicit OpenAI candidate, not a production lock");
}
if (spec.provider?.outputFormat !== "mp3") fail("pilot output format must remain mp3");
if (spec.output?.public !== false || spec.output?.production !== false || spec.output?.runtimeActive !== false || spec.output?.registryAutoApproval !== false) {
  fail("pilot output must remain local-only, non-production, non-runtime, and non-auto-approving");
}
if (typeof spec.output?.root !== "string" || !spec.output.root.startsWith("internal/")) {
  fail("pilot output root must remain under internal/");
}
if (!Array.isArray(spec.items) || spec.items.length !== 4) fail("pilot spec must contain exactly four items");

const voice = args.voice ?? spec.provider.defaultVoice;
if (!spec.provider.voiceCandidates.includes(voice)) {
  fail(`unsupported pilot voice "${voice}"; allowed: ${spec.provider.voiceCandidates.join(", ")}`);
}

const ids = new Set();
for (const item of spec.items) {
  if (!item?.activityId || typeof item.transcript !== "string" || !item.transcript.trim()) {
    fail("each pilot item requires activityId and transcript");
  }
  if (ids.has(item.activityId)) fail(`duplicate pilot activity: ${item.activityId}`);
  ids.add(item.activityId);
  const registryRecord = registry.items?.[item.activityId];
  if (!registryRecord) fail(`${item.activityId} is missing from narration provenance registry`);
  if (registryRecord.lifecycle !== "review-required") {
    fail(`${item.activityId} must remain review-required before pilot human approval`);
  }
  if (registryRecord.transcript !== item.transcript) {
    fail(`${item.activityId} pilot transcript drifted from narration provenance registry`);
  }
}

const model = spec.provider.model;
const outDir = path.join(root, spec.output.root, `${safeSegment(model)}__${safeSegment(voice)}`);
const plan = spec.items.map((item) => ({
  activityId: item.activityId,
  transcript: item.transcript,
  candidatePath: path.relative(root, path.join(outDir, `${item.activityId}-candidate.mp3`)).split(path.sep).join("/")
}));

if (!args.generate) {
  console.log("English narration provider pilot DRY RUN — no network call, no file writes.");
  console.log(`Provider: ${spec.provider.name}`);
  console.log(`Model: ${model}`);
  console.log(`Voice: ${voice}`);
  console.log(`Output: ${path.relative(root, outDir).split(path.sep).join("/")}`);
  for (const item of plan) console.log(`- ${item.activityId}: "${item.transcript}" -> ${item.candidatePath}`);
  console.log("Human listening + provenance approval remain mandatory; registry and runtime are unchanged.");
  process.exit(0);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || !apiKey.trim()) {
  fail("--generate requires OPENAI_API_KEY in the environment");
}

mkdirSync(outDir, { recursive: true });
const generated = [];

for (const item of spec.items) {
  const outputPath = path.join(outDir, `${item.activityId}-candidate.mp3`);
  if (existsSync(outputPath) && !args.force) {
    fail(`${path.relative(root, outputPath)} already exists; use --force only after intentionally choosing to replace the local candidate`);
  }

  const response = await fetch(spec.provider.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      input: item.transcript,
      instructions: spec.provider.instructions,
      response_format: "mp3"
    }),
    signal: AbortSignal.timeout(60_000)
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    fail(`${item.activityId} generation failed with HTTP ${response.status}: ${detail}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 512) fail(`${item.activityId} returned only ${bytes.length} bytes`);
  if (!looksLikeMp3(bytes)) fail(`${item.activityId} response does not look like MP3`);

  writeFileSync(outputPath, bytes);
  generated.push({
    activityId: item.activityId,
    transcript: item.transcript,
    file: path.relative(root, outputPath).split(path.sep).join("/"),
    bytes: bytes.length,
    sha256: sha256(bytes),
    contentType: response.headers.get("content-type")
  });
  console.log(`Generated local candidate: ${path.relative(root, outputPath)}`);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  provider: spec.provider.name,
  model,
  voice,
  outputFormat: spec.provider.outputFormat,
  production: false,
  runtimeActive: false,
  registryUpdated: false,
  humanReviewRequired: true,
  aiDisclosureRequired: spec.provider.rightsReview.aiDisclosureRequired,
  sourceDocs: spec.provider.sourceDocs,
  items: generated
};
writeFileSync(path.join(outDir, "pilot-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log(`Pilot complete: ${generated.length} local candidate(s). Nothing was copied to public/, approved in the registry, or activated at runtime.`);
