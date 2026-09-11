import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

const page = read("src/app/qa/device/page.tsx");
const component = read("src/components/DeviceQaHarness.tsx");
const styles = read("src/app/qa/device/device-qa.module.css");
const matrix = read("docs/BATCH16_PHYSICAL_DEVICE_QA.md");

assert.match(page, /robots:\s*\{[\s\S]*index:\s*false[\s\S]*follow:\s*false/, "QA route must remain noindex/nofollow");
assert.match(page, /<DeviceQaHarness\s*\/>/, "QA page must render the canonical harness component");
assert.match(component, /data-mainlagi-route-boundary="device-qa"/, "QA harness must expose its route boundary");
assert.match(component, /mainlagi:physical-device-qa:v1/, "QA local-storage schema key must remain explicit/versioned");
assert.match(component, /mainlagi-physical-device-qa-v1/, "QA exported evidence schema must remain explicit/versioned");
assert.match(component, /window\.localStorage/, "QA evidence recorder must persist locally for route-to-route testing");
assert.match(component, /new Blob\(/, "QA harness must support local JSON evidence export");
assert.match(component, /navigator\.clipboard\.writeText/, "QA harness must support copyable evidence summaries");
assert.match(component, /navigator\.mediaDevices\?\.getUserMedia/, "QA harness must report camera capability without invoking camera automatically");
assert.doesNotMatch(component, /getUserMedia\s*\(/, "QA harness must never request camera permission automatically");
assert.doesNotMatch(component, /fetch\s*\(/, "QA harness must not upload evidence or call remote APIs");
assert.doesNotMatch(component, /@\/lib\/auth|@\/lib\/supabase|SUPABASE_|OPENROUTER|SERVICE_ROLE|access_token|refresh_token/i, "QA harness must stay credential/auth independent");
assert.match(component, /No QA data was uploaded by this harness/, "QA export flow must state its local-only boundary");
assert.match(styles, /min-height:\s*44px/, "QA controls must retain physical-device touch sizing");

const expectedIds = [
  "core-mobile",
  "parent-mobile",
  "safe-areas",
  "orientation",
  "virtual-keyboard",
  "trace-touch",
  "trace-orientation",
  "drawing",
  "coloring",
  "audio-unlock",
  "audio-replay",
  "audio-fallback",
  "camera-allow",
  "camera-deny",
  "camera-recovery",
  "camera-orientation",
  "reduced-motion",
  "assistive-tech",
  "zoom-text-size",
  "offline-attempt",
  "reconnect-outbox",
  "session-isolation"
];

for (const id of expectedIds) {
  assert.ok(component.includes(`id: "${id}"`), `Physical-device harness is missing canonical test ${id}`);
}

const idMatches = [...component.matchAll(/\bid:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
assert.equal(idMatches.length, 22, `Physical-device harness must contain exactly 22 canonical tests, found ${idMatches.length}`);
assert.equal(new Set(idMatches).size, 22, "Physical-device harness test IDs must remain unique");

const matrixRows = (matrix.match(/\| [^\n]+ \| PENDING \| PENDING \|/g) ?? []).length;
assert.equal(matrixRows, 22, `Canonical physical-device matrix must remain aligned to 22 pending test rows, found ${matrixRows}`);
assert.match(matrix, /\/qa\/device/, "Canonical physical-device matrix must point testers to the guided QA harness");
assert.match(matrix, /not an automated physical-device certifier/i, "Canonical matrix must preserve the no-fake-hardware-certification boundary");
assert.match(matrix, /actually performs the physical test/i, "Canonical matrix must require an actually performed physical test before PASS");

console.log(JSON.stringify({
  status: "PASS",
  route: "/qa/device",
  canonicalTests: idMatches.length,
  localOnlyEvidence: true,
  automaticCameraRequest: false,
  remoteUpload: false
}));
