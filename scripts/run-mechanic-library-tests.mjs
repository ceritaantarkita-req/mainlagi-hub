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
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const library = require(path.join(outDir, "src", "lib", "learning", "mechanicLibrary.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const mastery = require(path.join(outDir, "src", "lib", "learning", "mastery.js"));

const option = (id, label = id) => ({ id, label });

function validPayloadFor(id) {
  const definition = library.REUSABLE_MECHANICS[id];
  if (definition.family === "choice") {
    return {
      prompt: "Choose",
      options: [option("a"), option("b"), option("c")],
      correctOptionId: "b",
      ...(id === "story_comprehension" ? { storyLines: ["A short story."] } : {})
    };
  }
  if (definition.family === "pairing") {
    return {
      prompt: "Match",
      pairs: [
        { id: "p1", left: option("l1"), right: option("r1") },
        { id: "p2", left: option("l2"), right: option("r2") }
      ]
    };
  }
  if (definition.family === "targeting") {
    return {
      prompt: "Move",
      items: [option("i1"), option("i2")],
      targets: [option("t1"), option("t2")],
      assignments: { i1: "t1", i2: "t2" }
    };
  }
  if (definition.family === "classification") {
    return {
      prompt: "Sort",
      items: [option("i1"), option("i2")],
      groups: [option("g1"), option("g2")],
      assignments: { i1: "g1", i2: "g2" }
    };
  }
  if (definition.family === "ordering") {
    return { prompt: "Order", items: [option("i1"), option("i2"), option("i3")], correctOrder: ["i1", "i2", "i3"] };
  }
  if (definition.family === "path") {
    return id === "maze_path"
      ? { prompt: "Find the path", checkpoints: ["a", "b", "c"], correctPath: ["a", "b", "c"] }
      : { prompt: "Trace", checkpoints: ["start", "middle", "finish"] };
  }
  if (id === "story") return { storyLines: ["One line"] };
  if (id === "coloring") return { assetRef: "/characters/gavi.svg" };
  if (id === "motion_game") return { gameSlug: "number-trace" };
  throw new Error(`No fixture for ${id}`);
}

function buildState(events) {
  let state = library.createMechanicSession(1_000);
  for (const event of events) state = library.applyMechanicSessionEvent(state, event);
  return state;
}

try {
  const report = library.assertMechanicLibraryValid();
  assert.equal(report.mechanicCount, 20, "Batch 5 must expose exactly 20 reusable mechanic contracts");
  assert.equal(report.assessedCount, 17, "17 mechanics should support measured assessment");
  assert.equal(report.practiceOnlyCount, 3, "story, coloring, and motion wrapper remain practice-only");

  const ids = library.REUSABLE_MECHANIC_IDS;
  assert.equal(new Set(ids).size, ids.length, "mechanic IDs must be unique");
  for (const id of ids) {
    const payloadReport = library.validateReusableMechanicPayload(id, validPayloadFor(id));
    assert.equal(payloadReport.valid, true, `${id} valid payload rejected: ${payloadReport.errors.join("; ")}`);
  }

  for (const [legacyId, legacyDefinition] of Object.entries(manifest.CONTENT_MECHANICS)) {
    const reusable = library.getReusableMechanic(legacyId);
    assert.ok(reusable, `Batch 4 mechanic ${legacyId} must remain represented in the reusable library`);
    assert.equal(
      reusable.assessmentModes.includes("assessed"),
      legacyDefinition.assessmentModes.includes("assessed"),
      `${legacyId} assessment capability drifted`
    );
    if (legacyDefinition.assessedEvidenceContract) {
      assert.equal(reusable.assessedEvidenceContract, legacyDefinition.assessedEvidenceContract, `${legacyId} evidence contract drifted`);
    }
  }

  assert.equal(library.resolveMechanicEvidenceContract("drag_to_target", "assessed"), "target_accuracy_v1");
  assert.equal(library.resolveMechanicEvidenceContract("drag_to_target", "practice"), "completion_only_v1");
  assert.throws(() => library.resolveMechanicEvidenceContract("story", "assessed"), /does not support assessed evidence/i);

  const badChoice = library.validateReusableMechanicPayload("tap_choice", {
    prompt: "Choose",
    options: [option("a"), option("a")],
    correctOptionId: "missing"
  });
  assert.equal(badChoice.valid, false);
  assert.ok(badChoice.errors.some((message) => /unique/i.test(message)));
  assert.ok(badChoice.errors.some((message) => /correctOptionId/i.test(message)));

  const badTarget = library.validateReusableMechanicPayload("drag_to_target", {
    prompt: "Move",
    items: [option("i1"), option("i2")],
    targets: [option("t1"), option("t2")],
    assignments: { i1: "t1" }
  });
  assert.equal(badTarget.valid, false);
  assert.ok(badTarget.errors.some((message) => /every item/i.test(message)));

  const badOrder = library.validateReusableMechanicPayload("ordering_sequence", {
    prompt: "Order",
    items: [option("a"), option("b"), option("c")],
    correctOrder: ["a", "b", "b"]
  });
  assert.equal(badOrder.valid, false);
  assert.ok(badOrder.errors.some((message) => /every item exactly once/i.test(message)));

  const badMaze = library.validateReusableMechanicPayload("maze_path", {
    prompt: "Path",
    checkpoints: ["a", "b"],
    correctPath: ["a", "outside"]
  });
  assert.equal(badMaze.valid, false);
  assert.ok(badMaze.errors.some((message) => /known checkpoints/i.test(message)));

  const assisted = library.finalizeReusableMechanicOutcome({
    mechanicId: "tap_choice",
    assessment: "assessed",
    state: buildState([
      { type: "correct", count: 2 },
      { type: "incorrect" },
      { type: "hint" },
      { type: "retry" },
      { type: "complete" }
    ]),
    completedAtMs: 5_000
  });
  assert.equal(assisted.assessed, true);
  assert.equal(assisted.accuracy, 2 / 3);
  assert.equal(assisted.score, 2 / 3);
  assert.equal(assisted.correctCount, 2);
  assert.equal(assisted.incorrectCount, 1);
  assert.equal(assisted.hintCount, 1);
  assert.equal(assisted.retryCount, 1);
  assert.equal(assisted.durationMs, 4_000);
  assert.equal(assisted.metadata?.evidenceContract, "choice_accuracy_v1");
  assert.notEqual(assisted.metadata?.evidenceFidelity, "completion_only");

  const independent = library.finalizeReusableMechanicOutcome({
    mechanicId: "tap_choice",
    assessment: "assessed",
    state: buildState([{ type: "correct", count: 2 }, { type: "incorrect" }, { type: "complete" }]),
    completedAtMs: 5_000
  });
  const assistedEvidenceScore = mastery.calculateEvidenceScore(mastery.normalizeLearningAttemptOutcome(assisted, new Date(5_000)));
  const independentEvidenceScore = mastery.calculateEvidenceScore(mastery.normalizeLearningAttemptOutcome(independent, new Date(5_000)));
  assert.ok(typeof assistedEvidenceScore === "number" && typeof independentEvidenceScore === "number");
  assert.ok(assistedEvidenceScore < independentEvidenceScore, "existing mastery engine must penalize hint/retry dependence exactly once downstream");

  const allWrong = library.finalizeReusableMechanicOutcome({
    mechanicId: "odd_one_out",
    assessment: "assessed",
    state: buildState([{ type: "incorrect", count: 3 }, { type: "complete" }]),
    completedAtMs: 5_000
  });
  assert.equal(allWrong.assessed, true, "all-wrong interactions are still measured evidence");
  assert.equal(allWrong.accuracy, 0);
  assert.equal(allWrong.score, 0);
  assert.equal(allWrong.incorrectCount, 3);

  const noMeasurement = library.finalizeReusableMechanicOutcome({
    mechanicId: "odd_one_out",
    assessment: "assessed",
    state: buildState([{ type: "complete" }]),
    completedAtMs: 5_000
  });
  assert.equal(noMeasurement.assessed, false, "assessed mechanic with no interaction measurement must fail closed");
  assert.equal(noMeasurement.accuracy, null);
  assert.equal(noMeasurement.metadata?.evidenceFidelity, "completion_only");
  assert.equal(noMeasurement.metadata?.measurementReason, "missing_discrete_measurement");

  const traceMeasured = library.finalizeReusableMechanicOutcome({
    mechanicId: "guided_trace",
    assessment: "assessed",
    state: buildState([{ type: "quality", score: 0.86 }, { type: "complete" }]),
    completedAtMs: 3_000
  });
  assert.equal(traceMeasured.assessed, true);
  assert.equal(traceMeasured.accuracy, 0.86);
  assert.equal(traceMeasured.metadata?.evidenceContract, "guided_trace_path_v1");

  const practiceStory = library.finalizeReusableMechanicOutcome({
    mechanicId: "story",
    assessment: "practice",
    state: buildState([{ type: "hint" }, { type: "complete" }]),
    completedAtMs: 3_000
  });
  assert.equal(practiceStory.assessed, false);
  assert.equal(practiceStory.score, null);
  assert.equal(practiceStory.accuracy, null);
  assert.equal(practiceStory.metadata?.evidenceFidelity, "completion_only");

  const attemptedPromotion = library.finalizeReusableMechanicOutcome({
    mechanicId: "coloring",
    assessment: "assessed",
    state: buildState([{ type: "correct", count: 5 }, { type: "complete" }]),
    completedAtMs: 3_000
  });
  assert.equal(attemptedPromotion.assessed, false, "practice-only mechanic must never self-promote into mastery evidence");

  const interrupted = library.finalizeReusableMechanicOutcome({
    mechanicId: "compare",
    assessment: "assessed",
    state: buildState([{ type: "correct" }]),
    completedAtMs: 2_000
  });
  assert.equal(interrupted.status, "interrupted");
  assert.equal(interrupted.assessed, false);

  const clampedPath = library.finalizeReusableMechanicOutcome({
    mechanicId: "maze_path",
    assessment: "assessed",
    state: buildState([{ type: "quality", score: 5 }, { type: "complete" }]),
    completedAtMs: 2_000
  });
  assert.equal(clampedPath.accuracy, 1, "path quality must clamp to 0..1");

  const migration = readFileSync(path.join(root, "supabase", "migrations", "0012_reusable_mechanic_library.sql"), "utf8");
  for (const id of ids) assert.match(migration, new RegExp(`'${id}'`), `DB mechanic vocabulary missing ${id}`);
  for (const evidenceId of [
    "choice_accuracy_v1", "matching_accuracy_v1", "target_accuracy_v1", "classification_accuracy_v1",
    "sequence_accuracy_v1", "guided_trace_path_v1", "path_quality_v1", "completion_only_v1"
  ]) assert.match(migration, new RegExp(`'${evidenceId}'`), `DB evidence vocabulary missing ${evidenceId}`);
  for (const legacy of ["learning_attempts", "game_sessions", "game_scores", "progress"]) {
    assert.doesNotMatch(migration, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `Batch 5 must preserve ${legacy}`);
  }

  console.log("Reusable mechanic library, payload, outcome, mastery-boundary, compatibility, and DB vocabulary contracts passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
