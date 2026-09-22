import assert from "node:assert/strict";
import { rmSync } from "node:fs";
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
const mechanics = require(path.join(outDir, "src", "lib", "learning", "mechanicLibrary.js"));

try {
  assert.equal(world.MONEY_WORLD_ID, "money-festival");
  assert.equal(world.MONEY_WORLD_CHAPTERS.length, 2, "money dummy must keep two chapters");
  assert.equal(world.MONEY_WORLD_STAGES.length, 8, "money dummy must keep eight stages");
  assert.deepEqual(
    world.MONEY_WORLD_STAGES.map((stage) => stage.order),
    [1,2,3,4,5,6,7,8],
    "World stage order must remain contiguous"
  );
  assert.ok(world.MONEY_WORLD_STAGES.every((stage) => stage.playable), "all eight dummy stages must be playable once unlocked");

  const stageIds = world.MONEY_WORLD_STAGES.map((stage) => stage.id);
  assert.equal(new Set(stageIds).size, stageIds.length, "stage IDs must be unique");

  const chapterStageIds = world.MONEY_WORLD_CHAPTERS.flatMap((chapter) => [...chapter.stageIds]);
  assert.deepEqual(chapterStageIds, stageIds, "chapter stage membership must exactly cover ordered World stages");

  const segmentIds = [];
  const placementIds = [];
  let activityCount = 0;
  let narrativeChoiceCount = 0;

  for (const stage of world.MONEY_WORLD_STAGES) {
    const segments = world.getMoneyWorldSegments(stage.id);
    assert.ok(segments.length >= 5, stage.id + " must have a real narrative/activity runtime");

    const activities = segments.filter((segment) => segment.type === "activity");
    assert.equal(activities.length, 2, stage.id + " must keep the two-activity dummy formula");

    for (const segment of segments) {
      segmentIds.push(segment.id);
      if (segment.type === "activity") {
        activityCount += 1;
        placementIds.push(segment.activity.id);
        assert.equal(
          segment.activity.assessment,
          "practice",
          segment.activity.id + " must remain practice-only until the server-owned World evidence bridge exists"
        );
        assert.notEqual(segment.activity.mechanicId, "motion_game", "World V1 must not depend on motion/camera");
        const validation = mechanics.validateReusableMechanicPayload(
          segment.activity.mechanicId,
          segment.activity.payload
        );
        assert.equal(
          validation.valid,
          true,
          segment.activity.id + " payload invalid: " + validation.errors.join("; ")
        );
        assert.equal(
          mechanics.resolveMechanicEvidenceContract(segment.activity.mechanicId, "practice"),
          "completion_only_v1",
          segment.activity.id + " must resolve to completion-only evidence at this checkpoint"
        );
      }

      if (segment.type === "narrative_choice") {
        narrativeChoiceCount += 1;
        assert.equal(stage.order, 8, "open narrative decision belongs only in final Stage");
        assert.equal(segment.options.length, 3, "final open decision must keep three visible options");
        assert.equal(new Set(segment.options.map((option) => option.id)).size, segment.options.length, "narrative choice IDs must be unique");
      }
    }
  }

  assert.equal(new Set(segmentIds).size, segmentIds.length, "segment IDs must be unique");
  assert.equal(new Set(placementIds).size, placementIds.length, "activity placement IDs must be unique");
  assert.equal(activityCount, 16, "eight-stage dummy must expose sixteen reusable mechanic placements");
  assert.equal(narrativeChoiceCount, 1, "dummy must contain exactly one telemetry-only narrative choice");

  const stageEight = world.getMoneyWorldSegments("money-stage-08-final-festival");
  const subtraction = stageEight.find((segment) => segment.type === "activity" && segment.activity.id === "money-s08-activity-02");
  assert.ok(subtraction && subtraction.type === "activity", "final subtraction activity must exist");
  assert.equal(subtraction.activity.mechanicId, "tap_choice");
  assert.equal(subtraction.activity.presentation?.kind, "take_away", "final numeric challenge must stay a subtraction presentation");
  assert.equal(subtraction.activity.presentation?.startCount, 8);
  assert.equal(subtraction.activity.presentation?.removeCount, 2);
  assert.equal(subtraction.activity.payload.correctOptionId, "answer-6");

  const riskyClaim = /pasti\s+(selalu\s+)?(untung|naik)|dijamin\s+(untung|naik)/i;
  for (const stage of world.MONEY_WORLD_STAGES) {
    for (const segment of world.getMoneyWorldSegments(stage.id)) {
      if ("text" in segment) {
        assert.doesNotMatch(segment.text, riskyClaim, stage.id + " must not promise investment returns");
      }
    }
  }

  console.log("Petualangan Uang eight-stage payload, progression, practice boundary, and financial-language contracts passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
