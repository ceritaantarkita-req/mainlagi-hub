import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const spec = JSON.parse(readFileSync(path.join(root, "src", "lib", "data", "english-narration-pilot-spec.json"), "utf8"));
const registry = JSON.parse(readFileSync(path.join(root, "src", "lib", "data", "english-narration-asset-provenance.json"), "utf8"));
const script = path.join(root, "scripts", "generate-english-narration-openai-pilot.mjs");

const expected = new Map([
  ["english-listen-bird", "Bird."],
  ["english-listen-letter-a", "Letter A."],
  ["english-listen-phrase-blue-book", "A blue book."],
  ["english-detail-red-ball", "The ball is red. What color is the ball?"]
]);

assert.equal(spec.version, 1);
assert.equal(spec.scope, "english-narration-four-item-provider-pilot");
assert.equal(spec.state, "generation-ready-human-review-required");
assert.equal(spec.provider.name, "OpenAI");
assert.equal(spec.provider.status, "primary-pilot-candidate-not-production-locked");
assert.equal(spec.provider.model, "gpt-4o-mini-tts-2025-12-15");
assert.deepEqual(spec.provider.voiceCandidates, ["marin", "cedar"]);
assert.equal(spec.provider.defaultVoice, "marin");
assert.equal(spec.provider.outputFormat, "mp3");
assert.equal(spec.provider.rightsReview.aiDisclosureRequired, true);
assert.match(spec.output.root, /^internal\//);
assert.equal(spec.output.public, false);
assert.equal(spec.output.production, false);
assert.equal(spec.output.runtimeActive, false);
assert.equal(spec.output.registryAutoApproval, false);
assert.equal(spec.items.length, expected.size);

for (const item of spec.items) {
  assert.equal(expected.get(item.activityId), item.transcript, `${item.activityId} must remain in the four-item pilot with exact transcript`);
  const record = registry.items[item.activityId];
  assert(record, `${item.activityId} must exist in canonical narration registry`);
  assert.equal(record.lifecycle, "review-required", `${item.activityId} must remain review-required before human approval`);
  assert.equal(record.transcript, item.transcript, `${item.activityId} transcript must match canonical registry`);
}

{
  const env = { ...process.env };
  delete env.OPENAI_API_KEY;
  const result = spawnSync(process.execPath, [script, "--dry-run", "--voice", "marin"], {
    cwd: root,
    env,
    encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /DRY RUN/);
  assert.match(result.stdout, /no network call, no file writes/i);
  for (const id of expected.keys()) assert.match(result.stdout, new RegExp(id));
  assert.match(result.stdout, /registry and runtime are unchanged/i);
}

{
  const result = spawnSync(process.execPath, [script, "--dry-run", "--voice", "alloy"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /unsupported pilot voice/);
}

{
  const env = { ...process.env };
  delete env.OPENAI_API_KEY;
  const result = spawnSync(process.execPath, [script, "--generate", "--voice", "cedar"], {
    cwd: root,
    env,
    encoding: "utf8"
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /requires OPENAI_API_KEY/);
}

console.log("English narration provider pilot tests passed: exact four-item scope, canonical transcript lock, local-only output, voice allowlist, dry-run default, and credential gate.");
