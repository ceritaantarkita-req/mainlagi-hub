import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const generator = path.join(root, "scripts", "generate-learning-semantic-p0-stock-v2-candidates.mjs");
const reviewer = path.join(root, "scripts", "review-learning-semantic-p0-stock-v2-candidates.mjs");
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const registryBefore = readFileSync(registryPath);
const sources = [
  "body-head.svg", "action-jump.svg", "feature-gills.svg", "feature-beak.svg",
  "feature-cactus-thick-stem.svg", "object-towel.svg", "object-raincoat.svg",
  "object-toy-block.svg", "object-ball.svg"
];

function fixtureSource(dir) {
  mkdirSync(dir, { recursive: true });
  sources.forEach((name, index) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect x="64" y="64" width="384" height="384" rx="80" fill="#${["ef476f","ffd166","06d6a0","118ab2","8338ec"][index % 5]}"/>
      <circle cx="256" cy="256" r="${90 + index}" fill="#fff" opacity=".7"/>
    </svg>`;
    writeFileSync(path.join(dir, name), svg);
  });
}
function run(script, args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" });
}

const temp = mkdtempSync(path.join(os.tmpdir(), "mainlagi-p0-v2-review-"));
const source = path.join(temp, "source");
const output = path.join(temp, "output");
const reviewPath = path.join(output, "candidate-human-review.json");
fixtureSource(source);

try {
  let result = run(generator, ["--generate", "--source-dir", source, "--output", output]);
  assert.equal(result.status, 0, result.stderr);

  result = run(reviewer, ["--output", output]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Candidate integrity OK: 9\/9/);
  assert.match(result.stdout, /bound source SVGs/);

  result = run(reviewer, ["--output", output, "--write-template"]);
  assert.equal(result.status, 0, result.stderr);

  let review = JSON.parse(readFileSync(reviewPath, "utf8"));
  review.reviewer = { name: "QA Reviewer", reviewedAt: "2026-09-24T03:00:00.000Z" };
  review.attestation.viewedExactFiles = true;
  const first = Object.keys(review.items)[0];
  review.items[first].decision = "accepted";
  writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  result = run(reviewer, ["--output", output, "--validate-review"]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /pending rubric checks|decision is still pending/);

  review = JSON.parse(readFileSync(reviewPath, "utf8"));
  for (const item of Object.values(review.items)) {
    item.decision = "accepted";
    item.semanticIdentity = "pass";
    item.neighboringConceptSafety = "pass";
    item.smallScaleReadability = "pass";
    item.visualCleanliness = "pass";
    item.mainlagiStyleFit = "pass";
    item.mobileDetailRetention = "pass";
  }
  review.items["object.towel"].decision = "rejected";
  review.items["object.towel"].smallScaleReadability = "fail";
  writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
  result = run(reviewer, ["--output", output, "--validate-review"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /8 accepted \/ 1 rejected exact v2/);
  const manifest = JSON.parse(readFileSync(path.join(output, "candidate-manifest.json"), "utf8"));
  const candidatePath = path.join(output, manifest.items[0].filename);
  const bytes = readFileSync(candidatePath);
  bytes[bytes.length - 1] ^= 0xff;
  writeFileSync(candidatePath, bytes);
  result = run(reviewer, ["--output", output]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /candidate differs from manifest/);

  rmSync(output, { recursive: true, force: true });
  result = run(generator, ["--generate", "--source-dir", source, "--output", output]);
  assert.equal(result.status, 0, result.stderr);
  const sourcePath = path.join(source, sources[0]);
  writeFileSync(sourcePath, readFileSync(sourcePath, "utf8") + "\n<!-- tampered -->\n");
  result = run(reviewer, ["--output", output]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /source differs from manifest/);

  assert.deepEqual(readFileSync(registryPath), registryBefore);
  console.log("Learning semantic P0 stock v2 human-review regression passed.");
} finally {
  try { rmSync(temp, { recursive: true, force: true }); } catch (error) { if (error?.code !== "EBUSY") throw error; }
}
