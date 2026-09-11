import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const staticChunksDir = path.join(nextDir, "static", "chunks");
const MiB = 1024 * 1024;

const BUDGETS = Object.freeze({
  largestStaticChunkBytes: 5 * MiB,
  totalStaticJavaScriptBytes: 18 * MiB,
  rootMainJavaScriptBytes: 2 * MiB,
  appEntryJavaScriptBytes: 3 * MiB,
  appEntriesOverBudget: 0
});

function walk(directory) {
  const output = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(full));
    else output.push(full);
  }
  return output;
}

function bytesForManifestFiles(files) {
  return [...new Set(files)]
    .filter((file) => typeof file === "string" && file.endsWith(".js"))
    .reduce((total, file) => {
      const resolved = path.join(nextDir, file.replace(/^\.?\//, ""));
      return total + (existsSync(resolved) ? statSync(resolved).size : 0);
    }, 0);
}

function mib(bytes) {
  return Math.round((bytes / MiB) * 100) / 100;
}

assert.ok(existsSync(nextDir), "Batch 16 build budget requires an existing .next production build");
assert.ok(existsSync(staticChunksDir), "Next static chunk directory is missing");

const staticJavaScript = walk(staticChunksDir).filter((file) => file.endsWith(".js"));
assert.ok(staticJavaScript.length > 0, "No production JavaScript chunks were found");

const chunkSizes = staticJavaScript
  .map((file) => ({ file: path.relative(nextDir, file).split(path.sep).join("/"), bytes: statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes);
const totalStaticJavaScriptBytes = chunkSizes.reduce((sum, item) => sum + item.bytes, 0);
const largestStaticChunk = chunkSizes[0];

assert.ok(
  largestStaticChunk.bytes <= BUDGETS.largestStaticChunkBytes,
  `Largest production JS chunk is ${mib(largestStaticChunk.bytes)} MiB (${largestStaticChunk.file}), budget is ${mib(BUDGETS.largestStaticChunkBytes)} MiB`
);
assert.ok(
  totalStaticJavaScriptBytes <= BUDGETS.totalStaticJavaScriptBytes,
  `Total production static JS is ${mib(totalStaticJavaScriptBytes)} MiB, budget is ${mib(BUDGETS.totalStaticJavaScriptBytes)} MiB`
);

const buildManifestPath = path.join(nextDir, "build-manifest.json");
assert.ok(existsSync(buildManifestPath), "Next build-manifest.json is missing");
const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8"));
const rootMainFiles = Array.isArray(buildManifest.rootMainFiles) ? buildManifest.rootMainFiles : [];
const rootMainJavaScriptBytes = bytesForManifestFiles(rootMainFiles);
assert.ok(
  rootMainJavaScriptBytes <= BUDGETS.rootMainJavaScriptBytes,
  `Root/main production JS is ${mib(rootMainJavaScriptBytes)} MiB, budget is ${mib(BUDGETS.rootMainJavaScriptBytes)} MiB`
);

const appBuildManifestPath = path.join(nextDir, "app-build-manifest.json");
let largestAppEntry = { entry: null, bytes: 0 };
let appEntriesOverBudget = [];
if (existsSync(appBuildManifestPath)) {
  const appManifest = JSON.parse(readFileSync(appBuildManifestPath, "utf8"));
  for (const [entry, files] of Object.entries(appManifest.pages ?? {})) {
    const bytes = bytesForManifestFiles(Array.isArray(files) ? files : []);
    if (bytes > largestAppEntry.bytes) largestAppEntry = { entry, bytes };
    if (bytes > BUDGETS.appEntryJavaScriptBytes) appEntriesOverBudget.push({ entry, bytes });
  }
}
assert.equal(
  appEntriesOverBudget.length,
  BUDGETS.appEntriesOverBudget,
  `App entries exceeded ${mib(BUDGETS.appEntryJavaScriptBytes)} MiB JS budget: ${JSON.stringify(appEntriesOverBudget.map((item) => ({ entry: item.entry, mib: mib(item.bytes) })))}`
);

// Keep the heaviest optional computer-vision dependency out of the initial
// route graph. Type-only imports are allowed because they disappear at build
// time; executable MediaPipe code must remain behind dynamic import().
for (const sourcePath of [
  "src/components/VisionOverlay.tsx",
  "src/lib/vision/useVisionRuntime.ts"
]) {
  const source = readFileSync(path.join(root, sourcePath), "utf8");
  assert.match(source, /import\(["']@mediapipe\/tasks-vision["']\)/, `${sourcePath} must keep MediaPipe behind dynamic import()`);
  assert.doesNotMatch(
    source,
    /import\s+(?!type\b)[\s\S]{0,180}?from\s+["']@mediapipe\/tasks-vision["']/,
    `${sourcePath} must not statically import executable MediaPipe code into initial route JS`
  );
}

// AudioManager may exist globally, but remote TTS must remain interaction-led;
// page/module initialization must not eagerly call the remote TTS API.
const audioManager = readFileSync(path.join(root, "src/lib/audio/AudioManager.ts"), "utf8");
assert.doesNotMatch(audioManager, /constructor\s*\([^)]*\)\s*\{[\s\S]{0,1200}fetch\s*\(\s*["'`]\/api\/tts/, "AudioManager constructor must not eagerly fetch remote TTS");

console.log(JSON.stringify({
  budgetsMiB: {
    largestStaticChunk: mib(BUDGETS.largestStaticChunkBytes),
    totalStaticJavaScript: mib(BUDGETS.totalStaticJavaScriptBytes),
    rootMainJavaScript: mib(BUDGETS.rootMainJavaScriptBytes),
    appEntryJavaScript: mib(BUDGETS.appEntryJavaScriptBytes)
  },
  observedMiB: {
    largestStaticChunk: mib(largestStaticChunk.bytes),
    totalStaticJavaScript: mib(totalStaticJavaScriptBytes),
    rootMainJavaScript: mib(rootMainJavaScriptBytes),
    largestAppEntry: mib(largestAppEntry.bytes)
  },
  largestStaticChunk: largestStaticChunk.file,
  largestAppEntry: largestAppEntry.entry,
  mediaPipeLazyBoundary: "PASS",
  ttsInitializationBoundary: "PASS"
}));