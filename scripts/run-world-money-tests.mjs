import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
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
const worldStructure = require(path.join(outDir, "src", "lib", "learning", "world", "worldStructure.js"));
const scenePresentation = require(path.join(outDir, "src", "lib", "learning", "world", "worldScenePresentation.js"));
const moneyStructure = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldStructure.js"));
const pilot = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldPilot.js"));
const narration = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarration.js"));
const narrationProduction = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarrationProduction.js"));
const ageMigration = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldAgeMigrationAudit.js"));
const evidenceBridge = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldEvidenceBridge.js"));
const presentation = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldPresentation.js"));
const assets = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldAssets.js"));
const progress = require(path.join(outDir, "src", "lib", "learning", "world", "progress.js"));
const mechanics = require(path.join(outDir, "src", "lib", "learning", "mechanicLibrary.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));

try {
  assert.equal(world.MONEY_WORLD_ID, "money-festival");

  assert.equal(worldStructure.WORLD_STRUCTURE_CONTRACT_VERSION, "world-structure-v1");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATION_VERSION, "world-scene-presentation-v1");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATION_VALIDATION.valid, true, scenePresentation.WORLD_SCENE_PRESENTATION_VALIDATION.errors.join("; "));
  assert.deepEqual(scenePresentation.WORLD_SCENE_PRESENTATION_VALIDATION.errors, []);
  assert.deepEqual(
    Object.keys(scenePresentation.WORLD_SCENE_PRESENTATIONS).sort(),
    ["challenge", "choice", "closing", "recap", "story"],
    "every canonical Scene kind must have exactly one reusable presentation policy"
  );
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.story.surface, "dialogue");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.challenge.surface, "activity");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.choice.surface, "choice");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.recap.surface, "recap");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.closing.surface, "payoff");
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.story.showAmbientCompanions, false);
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.challenge.showAmbientCompanions, true);
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.choice.showAmbientCompanions, true);
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.recap.showAmbientCompanions, true);
  assert.equal(scenePresentation.WORLD_SCENE_PRESENTATIONS.closing.showAmbientCompanions, false);

  assert.equal(moneyStructure.MONEY_WORLD_STRUCTURE_VERSION, "money-world-structure-v1");
  assert.equal(moneyStructure.MONEY_WORLD_CANONICAL_STRUCTURE.world.id, world.MONEY_WORLD_ID);
  assert.equal(moneyStructure.MONEY_WORLD_CANONICAL_STRUCTURE.chapters.length, 2, "canonical World must keep two Chapters");
  assert.equal(moneyStructure.MONEY_WORLD_CANONICAL_STRUCTURE.stages.length, 8, "canonical World must keep eight Stages");
  assert.equal(moneyStructure.MONEY_WORLD_CANONICAL_STRUCTURE.scenes.length, 44, "Petualangan Uang authored Scene count must stay explicit");
  assert.equal(
    Object.values(moneyStructure.MONEY_WORLD_SEGMENT_IDS_BY_STAGE).flat().length,
    89,
    "Petualangan Uang canonical hierarchy must keep all 89 existing Segments"
  );
  assert.equal(moneyStructure.MONEY_WORLD_STRUCTURE_VALIDATION.valid, true, moneyStructure.MONEY_WORLD_STRUCTURE_VALIDATION.errors.join("; "));
  assert.deepEqual(moneyStructure.MONEY_WORLD_STRUCTURE_VALIDATION.errors, []);
  for (const stage of world.MONEY_WORLD_STAGES) {
    for (const scene of moneyStructure.getMoneyWorldScenes(stage.id)) {
      const presentationForScene = scenePresentation.getWorldScenePresentation(scene.kind);
      assert.ok(presentationForScene, scene.id + " must resolve a reusable Scene presentation");
      assert.equal(presentationForScene.kind, scene.kind);
    }
    assert.deepEqual(
      moneyStructure.getMoneyWorldCanonicalSegmentIds(stage.id),
      world.getMoneyWorldSegments(stage.id).map((segment) => segment.id),
      stage.id + " canonical Scene flattening must preserve exact Segment order"
    );
    for (const segment of world.getMoneyWorldSegments(stage.id)) {
      const scene = moneyStructure.getMoneyWorldSceneForSegment(stage.id, segment.id);
      assert.ok(scene, stage.id + "/" + segment.id + " must belong to exactly one authored Scene");
      assert.equal(scene.stageId, stage.id);
    }
  }
  assert.equal(
    moneyStructure.getMoneyWorldSceneForSegment("money-stage-01-money-use", "money-s01-narrative-01")?.id,
    "money-scene-s01-opening"
  );
  assert.equal(
    moneyStructure.getMoneyWorldSceneForSegment("money-stage-01-money-use", "money-s01-activity-01")?.id,
    "money-scene-s01-money-price-match"
  );

  assert.equal(pilot.MONEY_WORLD_PILOT_CONTRACT_VERSION, "money-world-pilot-v1");
  assert.equal(pilot.MONEY_WORLD_PILOT_STAGES.length, 8, "pilot production manifest must cover all eight Stages");
  assert.equal(pilot.MONEY_WORLD_PILOT_PRODUCTION_VALIDATION.valid, true, pilot.MONEY_WORLD_PILOT_PRODUCTION_VALIDATION.errors.join("; "));
  assert.deepEqual(pilot.MONEY_WORLD_PILOT_PRODUCTION_VALIDATION.errors, []);
  assert.deepEqual(
    pilot.MONEY_WORLD_PILOT_STAGES.map((stage) => stage.stageId),
    world.MONEY_WORLD_STAGES.map((stage) => stage.id),
    "pilot Stage presentation must follow canonical World order"
  );
  const approvedAssetPaths = new Set(assets.MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS.map((asset) => asset.replace(/^public/, "")));
  for (const stage of pilot.MONEY_WORLD_PILOT_STAGES) {
    assert.equal(stage.runtimeStatus, "pilot-runtime-covered");
    assert.equal(stage.assetStatus, "approved-reused");
    assert.equal(stage.ambience.length, 3);
    assert.ok(approvedAssetPaths.has(stage.backgroundWide), stage.stageId + " wide background must come from the approved World asset manifest");
    assert.ok(approvedAssetPaths.has(stage.backgroundMobile), stage.stageId + " mobile background must come from the approved World asset manifest");
    assert.equal(existsSync(path.join(root, "public" + stage.backgroundWide)), true, stage.stageId + " wide background file must exist");
    assert.equal(existsSync(path.join(root, "public" + stage.backgroundMobile)), true, stage.stageId + " mobile background file must exist");
    const scenes = moneyStructure.getMoneyWorldScenes(stage.stageId);
    assert.equal(scenes[0]?.kind, "story", stage.stageId + " must start as authored story");
    assert.ok(scenes.some((scene) => scene.kind === "challenge"), stage.stageId + " must include challenge gameplay");
    assert.equal(scenes.at(-1)?.kind, "closing", stage.stageId + " must end in a closing Scene");
  }

  const worldRuntimeSource = readFileSync(path.join(root, "src/components/learning/world-v2/MoneyWorldExperience.tsx"), "utf8");
  const worldRuntimeCss = readFileSync(path.join(root, "src/components/learning/world-v2/MoneyWorldExperience.module.css"), "utf8");
  const worldSceneRendererSource = readFileSync(path.join(root, "src/components/learning/world/WorldSceneRenderer.tsx"), "utf8");
  assert.doesNotMatch(worldRuntimeSource, /WORLD_STAGE_AMBIENCE/, "Stage ambience must be data-driven by the pilot manifest");
  assert.doesNotMatch(worldRuntimeCss, /\.stageRuntime\[data-stage-order="[1-8]"\]\s*\{\s*--world-scene-wide/, "Stage background selection must not return to per-order CSS hardcoding");
  assert.match(worldRuntimeSource, /getMoneyWorldPilotStage\(stageId\)/, "Stage runtime must resolve its pilot production manifest");
  assert.match(worldRuntimeSource, /<WorldSceneRenderer/, "Petualangan Uang must render through the reusable Scene presentation layer");
  assert.doesNotMatch(worldRuntimeSource, /showAmbientGuides/, "Scene companion policy must not be hardcoded in Petualangan Uang runtime");
  assert.match(worldSceneRendererSource, /getWorldScenePresentation\(scene\.kind\)/, "reusable Scene renderer must resolve canonical Scene.kind policy");
  assert.match(worldSceneRendererSource, /data-world-scene-presentation/, "reusable Scene renderer must expose its presentation surface for QA");
  assert.match(worldRuntimeSource, /sceneSegmentPosition = activeScene\.segmentIds\.indexOf\(segment\.id\) \+ 1/, "Scene-local progress must derive from authored Scene membership");
  assert.match(worldSceneRendererSource, /data-world-scene-progress/, "reusable Scene renderer must expose Scene-local progress for QA");
  assert.match(worldRuntimeCss, /Production wave 06: Scene wrapper responsive fit/, "World CSS must retain the mobile Scene-wrapper fit correction");

  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.version, "money-world-presentation-v1");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.pilotBandId, "6-8");
  assert.equal(presentation.MONEY_WORLD_PILOT_AGE_BAND.minAge, 6);
  assert.equal(presentation.MONEY_WORLD_PILOT_AGE_BAND.maxAge, 8);
  assert.equal(presentation.MONEY_WORLD_PILOT_AGE_BAND.shippingStatus, "pilot");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.autoMorphSameWorldByAge, false, "one World must not silently morph across ages");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.sameWorldSpansAge3To12, false, "one World must not span ages 3–12 by later harder Stages");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.bands["3-5"].shippingStatus, "future-separate-variant");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.bands["9-12"].shippingStatus, "future-separate-series");
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.invariants.wrongAnswerNeverReducesStars, true);
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.invariants.completionStarsAreNotMastery, true);
  assert.equal(presentation.MONEY_WORLD_PRESENTATION_POLICY.invariants.motionCameraRequired, false);

  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_AUDIT_VERSION, "money-world-age-migration-v0");
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_ENABLED, false, "platform age migration must remain disabled during audit-only World work");
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.length, 13, "age migration audit must keep every verified 3–7 boundary explicit");
  assert.equal(
    new Set(ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.map((item) => item.id)).size,
    ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.length,
    "age migration blocker IDs must be unique"
  );
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_PHASES[0].id, "phase-0-audit");
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_PHASES[0].status, "complete");
  assert.ok(
    ageMigration.MONEY_WORLD_AGE_MIGRATION_PHASES.slice(1).every((phase) => phase.status === "blocked"),
    "profile/content/schema/runtime/evidence migration must stay blocked until separately approved"
  );
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_INVARIANTS.noBlanketAgeMaxRewrite, true);
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_INVARIANTS.profileRangeMustNotOutrunSafeBelajarFallback, true);
  assert.equal(ageMigration.MONEY_WORLD_AGE_MIGRATION_INVARIANTS.worldEvidenceMustRemainDisabledUntilAgeContractCloses, true);
  assert.ok(
    ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.some((item) => item.id === "cloud-profile-create-max-7"),
    "cloud profile age-7 boundary must stay explicit"
  );
  assert.ok(
    ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.some((item) => item.id === "learning-skills-db-max-7"),
    "learning skill database age constraint must stay explicit"
  );
  assert.ok(
    ageMigration.MONEY_WORLD_AGE_MIGRATION_BLOCKERS.some((item) => item.id === "age-filtered-belajar-runtime"),
    "Belajar age-filter empty-state risk must stay explicit"
  );

  const ageBoundarySources = {
    cloud: readFileSync(path.join(root, "src/lib/learning/cloud.ts"), "utf8"),
    localProfile: readFileSync(path.join(root, "src/components/learning/ChildLearningPlatform.tsx"), "utf8"),
    cloudProfile: readFileSync(path.join(root, "src/components/learning/CloudProfileScreens.tsx"), "utf8"),
    contentArchitecture: readFileSync(path.join(root, "src/lib/learning/contentArchitecture.ts"), "utf8"),
    learningSchema: readFileSync(path.join(root, "supabase/migrations/0002_learning_attempt_schema.sql"), "utf8"),
    contentSchema: readFileSync(path.join(root, "supabase/migrations/0011_scalable_content_architecture.sql"), "utf8"),
    homepage: readFileSync(path.join(root, "src/components/HomePage.tsx"), "utf8"),
    curriculumTests: readFileSync(path.join(root, "scripts/run-curriculum-tests.mjs"), "utf8")
  };
  assert.match(ageBoundarySources.cloud, /input\.age\s*>\s*7/, "cloud profile create boundary changed; update the World age migration audit");
  assert.match(ageBoundarySources.cloud, /numeric\s*>=\s*3\s*&&\s*numeric\s*<=\s*7/, "cloud profile parser boundary changed; update the World age migration audit");
  assert.match(ageBoundarySources.localProfile, /\[3,\s*4,\s*5,\s*6,\s*7\]/, "local child profile age choices changed; update the World age migration audit");
  assert.match(ageBoundarySources.cloudProfile, /\[3,\s*4,\s*5,\s*6,\s*7\]/, "cloud child profile age choices changed; update the World age migration audit");
  assert.match(ageBoundarySources.contentArchitecture, /ageMax\s*<=\s*7/, "content architecture age ceiling changed; update the World age migration audit");
  assert.match(ageBoundarySources.learningSchema, /age_max\s+smallint\s+not\s+null\s+check\s*\(age_max\s+between\s+3\s+and\s+7/i, "learning skill DB age ceiling changed; update the World age migration audit");
  assert.match(ageBoundarySources.contentSchema, /age_max\s+smallint\s+not\s+null\s+check\s*\(age_max\s+between\s+3\s+and\s+7/i, "content-pack DB age ceiling changed; update the World age migration audit");
  assert.match(ageBoundarySources.homepage, /usia\s+3[–-]7\s+tahun/i, "public product age claim changed; update the World age migration audit");
  assert.match(ageBoundarySources.curriculumTests, /ageMax\s*<=\s*7/, "canonical curriculum age test changed; update the World age migration audit");

  assert.equal(narration.MONEY_WORLD_NARRATION_CONTRACT_VERSION, "money-world-narration-v1");
  assert.equal(narration.MONEY_WORLD_NARRATION_LOCALE, "id-ID");
  assert.equal(narration.MONEY_WORLD_NARRATION_PRODUCTION_READY, false, "fixed World narration assets are not production-ready yet");
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_VERSION, "money-world-narration-production-v1");
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.valid, true, narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.errors.join("; "));
  assert.deepEqual(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_VALIDATION.errors, []);
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.total, 88, "fixed narration cue sheet must cover all 88 spoken World units");
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.approved, 0, "no fixed narration binary is approved in this wave");
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.pending, 88);
  assert.equal(narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_SUMMARY.productionReady, false);
  assert.deepEqual(narrationProduction.MONEY_WORLD_NARRATION_APPROVALS, [], "generated audio must never auto-approve itself");
  const expectedNarrationIds = [];
  for (const stage of world.MONEY_WORLD_STAGES) {
    for (const segment of world.getMoneyWorldSegments(stage.id)) {
      if (segment.type === "activity") expectedNarrationIds.push(segment.activity.id + "-prompt");
      else if (segment.type === "narrative_choice") expectedNarrationIds.push(segment.id + "-prompt");
      else if (segment.type !== "recap") expectedNarrationIds.push(segment.id);
    }
  }
  assert.deepEqual(
    new Set(narration.MONEY_WORLD_NARRATION_CUES.map((cue) => cue.id)),
    new Set(expectedNarrationIds),
    "narration cue registry must cover every currently spoken World unit exactly once"
  );
  assert.equal(new Set(narration.MONEY_WORLD_NARRATION_CUES.map((cue) => cue.id)).size, narration.MONEY_WORLD_NARRATION_CUES.length);
  assert.ok(narration.MONEY_WORLD_NARRATION_CUES.some((cue) => cue.speaker === "Gian"));
  assert.ok(narration.MONEY_WORLD_NARRATION_CUES.some((cue) => cue.speaker === "Naya"));
  for (const cue of narration.MONEY_WORLD_NARRATION_CUES) {
    assert.equal(cue.status, "fallback-runtime");
    assert.equal(cue.productionSrc, null);
    assert.equal(cue.fallback, "browser-speech");
    assert.equal(cue.locale, "id-ID");
    assert.equal(cue.expectedProductionSrc, "/audio/world/money-festival/id-ID/" + cue.id + ".mp3");
  }
  for (const cue of narration.MONEY_WORLD_NARRATION_CUES) {
    const entry = narrationProduction.getMoneyWorldNarrationProductionEntry(cue.id);
    assert.ok(entry, cue.id + " must exist in fixed narration production cue sheet");
    assert.equal(entry.expectedSrc, cue.expectedProductionSrc);
    assert.equal(entry.productionSrc, null, cue.id + " must fail closed until reviewed");
    assert.equal(entry.status, "pending-review");
    assert.match(entry.textFingerprint, /^fnv1a32-[0-9a-f]{8}$/);
    assert.equal(narrationProduction.resolveMoneyWorldNarrationProductionSrc(cue.id), null);
  }

  const narrationRuntimeSource = readFileSync(path.join(root, "src/components/learning/world-v2/MoneyWorldExperience.tsx"), "utf8");
  const narrationPlaybackSource = readFileSync(path.join(root, "src/lib/learning/world/moneyWorldNarrationPlayback.ts"), "utf8");
  assert.match(narrationRuntimeSource, /playMoneyWorldNarration/, "World runtime must route narration through the fixed-audio resolver");
  assert.doesNotMatch(narrationRuntimeSource, /\bspeakPrompt\s*\(/, "World runtime must not bypass fixed-audio resolution with direct browser speech");
  assert.match(narrationPlaybackSource, /resolveMoneyWorldNarrationProductionSrc/, "playback adapter must resolve reviewed fixed assets");
  assert.match(narrationPlaybackSource, /onFixedAudioFallback/, "fixed audio failure must retain browser-speech fallback");
  assert.match(narrationPlaybackSource, /new Audio\(productionSrc\)/, "reviewed production audio must use deterministic fixed-file playback");

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

  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_VERSION, "money-world-evidence-bridge-v0");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_ENABLED, false, "World evidence bridge must remain disabled until server/catalog blockers close");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_CANDIDATES.length, 2, "pilot evidence audit should expose only two defensible canonical-skill candidates");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_EXCLUSIONS.length, 14, "every other pilot activity must stay explicitly excluded from mastery");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.length, activityCount, "evidence audit must cover all World activity placements exactly once");
  assert.equal(
    new Set(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.map((entry) => entry.worldActivityId)).size,
    activityCount,
    "World evidence audit activity IDs must be unique"
  );
  assert.deepEqual(
    new Set(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.map((entry) => entry.worldActivityId)),
    new Set(placementIds),
    "World evidence audit must cover the exact runtime activity placements"
  );
  for (const candidate of evidenceBridge.MONEY_WORLD_EVIDENCE_CANDIDATES) {
    assert.equal(candidate.decision, "candidate");
    assert.ok(candidate.canonicalSkillId, candidate.worldActivityId + " candidate must name a canonical skill");
    const canonicalSkill = catalog.getLearningSkill(candidate.canonicalSkillId);
    assert.ok(canonicalSkill, candidate.worldActivityId + " candidate skill must exist in canonical catalog");
    assert.equal(
      mechanics.resolveMechanicEvidenceContract(candidate.mechanicId, "assessed"),
      candidate.assessedEvidenceContract,
      candidate.worldActivityId + " candidate evidence contract must match the reusable mechanic"
    );
  }
  assert.ok(
    evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS.includes("canonical-learning-skill-age-contract-currently-stops-at-7"),
    "age-8 blocker must remain explicit until canonical learning age migration is complete"
  );

  const stageEight = world.getMoneyWorldSegments("money-stage-08-final-festival");
  const subtraction = stageEight.find((segment) => segment.type === "activity" && segment.activity.id === "money-s08-activity-02");
  assert.ok(subtraction && subtraction.type === "activity", "final subtraction activity must exist");
  assert.equal(subtraction.activity.mechanicId, "tap_choice");
  assert.equal(subtraction.activity.presentation?.kind, "take_away", "final numeric challenge must stay a subtraction presentation");
  assert.equal(subtraction.activity.presentation?.startCount, 8);
  assert.equal(subtraction.activity.presentation?.removeCount, 2);
  assert.equal(subtraction.activity.payload.correctOptionId, "answer-6");

  const normalizedCorrupt = progress.normalizeMoneyWorldProgress({
    worldId: world.MONEY_WORLD_ID,
    completedStageIds: [
      "money-stage-01-money-use",
      "money-stage-03-income-sources",
      "money-stage-02-price-change"
    ],
    currentStageId: "money-stage-08-final-festival",
    currentSegmentIndex: 999,
    updatedAt: "2026-09-22T00:00:00.000Z"
  });
  assert.deepEqual(
    normalizedCorrupt.completedStageIds,
    ["money-stage-01-money-use"],
    "local World progress must fail closed to the valid linear completion prefix"
  );
  assert.equal(normalizedCorrupt.currentStageId, null, "locked current World stage must be discarded");
  assert.equal(normalizedCorrupt.currentSegmentIndex, 0, "discarded current stage must reset segment position");

  const normalizedReplay = progress.normalizeMoneyWorldProgress({
    worldId: world.MONEY_WORLD_ID,
    completedStageIds: [
      "money-stage-01-money-use",
      "money-stage-02-price-change"
    ],
    currentStageId: "money-stage-01-money-use",
    currentSegmentIndex: 150,
    updatedAt: "2026-09-22T00:00:00.000Z"
  });
  assert.equal(normalizedReplay.currentStageId, "money-stage-01-money-use", "completed World stage replay must remain valid");
  assert.equal(normalizedReplay.currentSegmentIndex, 100, "World segment checkpoints must remain bounded");
  assert.equal(progress.isMoneyWorldStageUnlocked(normalizedReplay, "money-stage-03-income-sources"), true);
  assert.equal(progress.isMoneyWorldStageUnlocked(normalizedReplay, "money-stage-04-needs-wants"), false);

  const riskyClaim = /pasti\s+(selalu\s+)?(untung|naik)|dijamin\s+(untung|naik)/i;
  let recapCount = 0;
  for (const stage of world.MONEY_WORLD_STAGES) {
    for (const segment of world.getMoneyWorldSegments(stage.id)) {
      if ("text" in segment) {
        assert.doesNotMatch(segment.text, riskyClaim, stage.id + " must not promise investment returns");
        assert.ok(segment.text.length <= 96, segment.id + " must keep child-facing narration short");
        assert.ok(segment.text.split(/\s+/).filter(Boolean).length <= 18, segment.id + " must avoid paragraph-like child narration");
      }
      if (segment.type === "recap") {
        recapCount += 1;
        assert.equal(stage.order, 8, "visual recap belongs only in the final Stage");
        assert.equal(segment.items.length, 6, "final recap must keep six concrete learning moments");
        for (const item of segment.items) {
          assert.ok(item.label.split(/\s+/).filter(Boolean).length <= 5, item.id + " recap label must stay glanceable");
        }
      }
    }
  }
  assert.equal(recapCount, 1, "dummy World must keep exactly one final visual recap");

  assert.equal(assets.MONEY_WORLD_ASSET_PLAN_VERSION, "money-world-assets-v1");
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.version, "money-world-runtime-character-dummy-v1");
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.mode, "approved-mascot-dummy");
  assert.deepEqual(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.storyRoleToRuntimeCharacter, { Gian: "gavi", Naya: "paca" });
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.finalHumanCharactersActivated, false, "World runtime must not activate fallback human characters while character development is paused");
  assert.equal(new Set(assets.MONEY_WORLD_ASSET_SLOTS.map((slot) => slot.id)).size, assets.MONEY_WORLD_ASSET_SLOTS.length, "World asset slot IDs must stay unique");
  for (const asset of assets.MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS) {
    assert.equal(existsSync(path.join(root, asset)), true, "World visual/share asset missing: " + asset);
  }
  assert.deepEqual(
    [...assets.MONEY_WORLD_PRODUCTION_GAPS].sort(),
    ["fixed-narration", "gian-foreground", "naya-foreground", "public-share-card"].sort(),
    "World production gaps must stay explicit instead of silently appearing complete"
  );
  assert.ok(
    assets.MONEY_WORLD_ASSET_SLOTS.filter((slot) => slot.kind === "background").every((slot) => slot.status === "approved-reused"),
    "current background reuse must remain explicitly approved in the pilot manifest"
  );

  console.log("Petualangan Uang canonical hierarchy, reusable Scene renderer/presentation policy, eight-stage production manifest, data-driven Stage visuals, fixed-narration production/review resolver, linear progress, age policy/migration audit, fail-closed evidence audit, practice boundary, low-text language, recap, mascot-dummy runtime policy, asset plan, and financial-safety contracts passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
