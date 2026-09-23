import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const world = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorld.js"));
const activation = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldEvidenceActivationDesign.js"));
const ingestion = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldEvidenceIngestion.js"));
const client = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldEvidenceClient.js"));

const runtimeSource = readFileSync(
  path.join(root, "src", "components", "learning", "world-v2", "MoneyWorldExperience.tsx"),
  "utf8"
);
const routeSource = readFileSync(
  path.join(root, "src", "app", "api", "learning", "world-evidence", "route.ts"),
  "utf8"
);
const migration = readFileSync(
  path.join(root, "supabase", "migrations", "0050_world_evidence_stage8_activation.sql"),
  "utf8"
);

const originalFetch = globalThis.fetch;

function fakeResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; }
  };
}

try {
  assert.equal(activation.MONEY_WORLD_EVIDENCE_ACTIVATION_ENABLED, true);
  assert.equal(activation.MONEY_WORLD_EVIDENCE_ACTIVATION_MODE, "stage8-supplemental-activated");
  assert.equal(activation.MONEY_WORLD_EVIDENCE_ACTIVATION_DESIGN_VALIDATION.valid, true);
  assert.deepEqual(activation.MONEY_WORLD_EVIDENCE_ACTIVATION_DESIGN_VALIDATION.errors, []);
  assert.ok(
    activation.MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS.every((item) => item.satisfied),
    "all reviewed activation requirements must be closed"
  );

  const placements = world.MONEY_WORLD_STAGES.flatMap((stage) =>
    world.getMoneyWorldSegments(stage.id)
      .filter((segment) => segment.type === "activity")
      .map((segment) => segment.activity)
  );
  assert.equal(placements.length, 16);
  assert.equal(placements.filter((item) => item.assessment === "assessed").length, 1);
  const assessed = placements.find((item) => item.assessment === "assessed");
  assert.equal(assessed?.id, "money-s08-activity-02");
  assert.equal(assessed?.mechanicId, "tap_choice");

  assert.equal(ingestion.MONEY_WORLD_EVIDENCE_INGESTION_ENABLED, true);
  assert.equal(ingestion.MONEY_WORLD_EVIDENCE_CONTENT_VERSION, "money-world-s08-subtraction-v2-assessed");

  const validObservation = {
    clientObservationId: "activation-contract-001",
    childId: "11111111-1111-4111-8111-111111111111",
    worldId: "money-festival",
    stageId: "money-stage-08-final-festival",
    worldActivityId: "money-s08-activity-02",
    mechanicId: "tap_choice",
    contentVersion: "money-world-s08-subtraction-v2-assessed",
    status: "completed",
    answerSequence: ["answer-4", "answer-6"],
    inputMode: "pointer",
    startedAt: "2026-09-23T10:00:00.000Z",
    completedAt: "2026-09-23T10:00:05.000Z"
  };

  const accepted = ingestion.evaluateMoneyWorldEvidenceIngestion(validObservation);
  assert.equal(accepted.disposition, "ready");
  assert.deepEqual(accepted.blockers, []);
  assert.equal(accepted.writePayload?.contentVersion, "money-world-s08-subtraction-v2-assessed");

  const stalePracticeVersion = ingestion.evaluateMoneyWorldEvidenceIngestion({
    ...validObservation,
    contentVersion: "money-world-s08-subtraction-v1"
  });
  assert.equal(stalePracticeVersion.disposition, "blocked");
  assert.ok(stalePracticeVersion.blockers.includes("content-version-mismatch"));

  const spoofed = ingestion.evaluateMoneyWorldEvidenceIngestion({
    ...validObservation,
    skillKey: "math.operation.subtraction.within_10",
    accuracy: 1,
    evidenceWeight: 1,
    qualifiesForMastery: true
  });
  assert.equal(spoofed.disposition, "blocked");
  assert.ok(spoofed.blockers.includes("client-canonical-field-forbidden"));

  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, init, body: JSON.parse(String(init?.body ?? "{}")) });
    if (requests.length === 1) return fakeResponse(503, { accepted: false, reason: "temporary" });
    return fakeResponse(201, { accepted: true, evidenceId: "22222222-2222-4222-8222-222222222222" });
  };

  const delivery = await client.emitMoneyWorldEvidenceObservation({
    childId: "11111111-1111-4111-8111-111111111111",
    answerSequence: ["answer-4", "answer-6"],
    startedAt: "2026-09-23T10:00:00.000Z",
    completedAt: "2026-09-23T10:00:05.000Z",
    inputMode: "keyboard"
  });
  assert.equal(delivery.status, "accepted");
  assert.equal(requests.length, 2, "one transient server failure should cause exactly one retry");
  assert.equal(requests[0].url, "/api/learning/world-evidence");
  assert.equal(requests[0].body.clientObservationId, requests[1].body.clientObservationId, "network retry must preserve idempotency identity");
  assert.equal(requests[0].body.contentVersion, "money-world-s08-subtraction-v2-assessed");
  assert.deepEqual(requests[0].body.answerSequence, ["answer-4", "answer-6"]);
  for (const forbidden of [
    "skillKey",
    "canonicalSkillId",
    "accuracy",
    "correctCount",
    "incorrectCount",
    "retryCount",
    "evidenceScore",
    "evidenceWeight",
    "qualifiesForMastery",
    "assessment"
  ]) {
    assert.equal(forbidden in requests[0].body, false, "client payload must not send canonical field " + forbidden);
  }

  const requestCountBeforeDemo = requests.length;
  const demo = await client.emitMoneyWorldEvidenceObservation({
    childId: "demo-gian",
    answerSequence: ["answer-6"],
    startedAt: "2026-09-23T10:00:00.000Z",
    completedAt: "2026-09-23T10:00:01.000Z",
    inputMode: "button"
  });
  assert.equal(demo.status, "skipped-demo");
  assert.equal(requests.length, requestCountBeforeDemo, "demo child must not call the canonical evidence endpoint");

  assert.match(runtimeSource, /emitMoneyWorldEvidenceObservation/);
  assert.match(runtimeSource, /segment\.activity\.id === "money-s08-activity-02"/);
  assert.match(runtimeSource, /segment\.activity\.assessment === "assessed"/);
  assert.match(runtimeSource, /answerSequence: nextAnswers/);
  assert.doesNotMatch(runtimeSource, /record_world_skill_evidence|record_learning_attempt/);

  assert.match(routeSource, /requireParentSession\(\)/);
  assert.match(routeSource, /getAdminClient\(\)/);
  assert.match(routeSource, /admin\.rpc\("record_world_skill_evidence"/);
  assert.doesNotMatch(routeSource, /record_learning_attempt/);

  assert.match(migration, /private\.world_evidence_activation_registry/);
  assert.match(migration, /money-world-s08-subtraction-v2-assessed/);
  assert.match(migration, /to service_role/i);
  assert.doesNotMatch(migration, /to authenticated/i);
  assert.doesNotMatch(migration, /insert into public\.learning_attempts/i);
  assert.doesNotMatch(migration, /insert into public\.child_learning_progress/i);
  assert.doesNotMatch(migration, /insert into public\.learning_certificates/i);

  console.log("World Stage 8 evidence activation, client retry/idempotency, and server-boundary tests passed.");
} finally {
  globalThis.fetch = originalFetch;
  rmSync(outDir, { recursive: true, force: true });
}
