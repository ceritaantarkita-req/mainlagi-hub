import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const generator = path.join(root, "scripts", "generate-learning-semantic-p0-candidates.mjs");
const reviewer = path.join(root, "scripts", "review-learning-semantic-p0-candidates.mjs");
const registryPath = path.join(root, "src", "lib", "data", "learning-illustration-asset-provenance.json");
const registryBefore = readFileSync(registryPath);
const outputRel = `internal/test-fixtures/learning-semantic-p0-review-${process.pid}`;
const output = path.join(root, outputRel);
const reviewPath = path.join(output, "candidate-human-review.json");

function run(script, args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: "utf8" });
}

try {
  rmSync(output, { recursive: true, force: true });

  {
    const result = run(generator, ["--generate", "--output", outputRel]);
    assert.equal(result.status, 0, result.stderr);
  }

  {
    const result = run(reviewer, ["--output", outputRel]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Candidate integrity OK: 9\/9/);
    assert.match(result.stdout, /Production registry, public illustration subtree, and runtime mapping remain unchanged/);
  }

  {
    const result = run(reviewer, ["--output", outputRel, "--write-template"]);
    assert.equal(result.status, 0, result.stderr);
    assert(existsSync(reviewPath));
    assert.match(result.stdout, /Nothing was approved, copied to public\/, or activated/);
  }

  {
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    review.reviewer = { name: "QA Reviewer", reviewedAt: "2026-09-23T03:00:00.000Z" };
    review.attestation.viewedExactFiles = true;
    const firstKey = Object.keys(review.items)[0];
    review.items[firstKey].decision = "accepted";
    writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
    const result = run(reviewer, ["--output", outputRel, "--validate-review"]);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /pending rubric checks|decision is still pending/);
  }

  {
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    const keys = Object.keys(review.items);
    for (const key of keys) {
      const item = review.items[key];
      item.decision = "accepted";
      item.semanticIdentity = "pass";
      item.neighboringConceptSafety = "pass";
      item.smallScaleReadability = "pass";
      item.visualCleanliness = "pass";
      item.mainlagiStyleFit = "pass";
      item.mobileDetailRetention = "pass";
    }
    const rejectedKey = "object.towel";
    review.items[rejectedKey].decision = "rejected";
    review.items[rejectedKey].smallScaleReadability = "fail";
    review.items[rejectedKey].notes = "Fixture rejection to prove mixed per-item review.";
    writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");

    const result = run(reviewer, ["--output", outputRel, "--validate-review"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /HUMAN REVIEW RECORDED: 8 accepted \/ 1 rejected/);
    assert.match(result.stdout, /NOT production approval/);
  }

  {
    const manifest = JSON.parse(readFileSync(path.join(output, "candidate-manifest.json"), "utf8"));
    const first = manifest.items[0];
    const filePath = path.join(output, first.filename);
    const bytes = readFileSync(filePath);
    bytes[bytes.length - 1] ^= 0xff;
    writeFileSync(filePath, bytes);
    const result = run(reviewer, ["--output", outputRel]);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /SHA-256 differs from manifest/);
  }

  assert.deepEqual(readFileSync(registryPath), registryBefore, "semantic human-review tooling must never mutate production registry");
  console.log("Learning semantic P0 human-review gate tests passed: exact nine-file integrity, non-overwriting review template, per-item mixed decisions, stale/tampered candidate rejection, and zero production-registry mutation.");
} finally {
  rmSync(output, { recursive: true, force: true });
}
