import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { validateWorldMoneyNarrationAssetGate } from "./world-money-narration-asset-gate.mjs";

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
const contentAudit = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldContentAudit.js"));
const pilot = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldPilot.js"));
const social = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldSocial.js"));
const narration = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarration.js"));
const narrationProduction = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarrationProduction.js"));
const narrationPlan = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarrationPlan.js"));
const narrationPilot = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarrationPilot.js"));
const narrationReview = require(path.join(outDir, "src", "lib", "learning", "world", "moneyWorldNarrationReview.js"));
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
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_VERSION, "money-world-content-audit-v1");
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_VALIDATION.valid, true, contentAudit.MONEY_WORLD_CONTENT_AUDIT_VALIDATION.errors.join("; "));
  assert.deepEqual(contentAudit.MONEY_WORLD_CONTENT_AUDIT_VALIDATION.errors, []);
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.stages, 8);
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.segments, 89);
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.activities, 16);
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.narrativeChoices, 1);
  assert.equal(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.recaps, 1);
  assert.ok(contentAudit.MONEY_WORLD_CONTENT_AUDIT_SUMMARY.maxSpokenWords <= 18);
  assert.ok(contentAudit.MONEY_WORLD_CONTENT_AUDIT_ROWS.every((row) => row.activityCount === 2), "each Stage must keep exactly two practice challenges");
  assert.deepEqual(
    contentAudit.MONEY_WORLD_CONTENT_FOCUS.map((entry) => entry.stageId),
    world.MONEY_WORLD_STAGES.map((stage) => stage.id),
    "content audit focus registry must follow canonical Stage order"
  );
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

  const socialPageSource = readFileSync(path.join(root, "src/app/worlds/money-festival/page.tsx"), "utf8");
  const socialRouteSource = readFileSync(path.join(root, "src/app/worlds/money-festival/social-card/route.tsx"), "utf8");
  assert.match(socialPageSource, /MONEY_WORLD_SOCIAL_CARD\.path/, "public World metadata must use the dedicated social-card contract");
  assert.doesNotMatch(socialPageSource, /\/og\/math-warung\.png/, "public World metadata must not fall back to the generic math-warung social card");
  assert.match(socialRouteSource, /new ImageResponse/, "dedicated social card must render as an image response");
  assert.match(socialRouteSource, /MONEY_WORLD_SOCIAL_CARD\.width/, "social card renderer must use contract width");
  assert.match(socialRouteSource, /MONEY_WORLD_SOCIAL_CARD\.height/, "social card renderer must use contract height");
  assert.doesNotMatch(socialRouteSource, /demo-gian|childId|accountId|mastery score/i, "social card renderer must remain public-safe");

  const worldRuntimeSource = readFileSync(path.join(root, "src/components/learning/world-v2/MoneyWorldExperience.tsx"), "utf8");
  const worldRuntimeCss = readFileSync(path.join(root, "src/components/learning/world-v2/MoneyWorldExperience.module.css"), "utf8");
  const worldSceneRendererSource = readFileSync(path.join(root, "src/components/learning/world/WorldSceneRenderer.tsx"), "utf8");
  const learningAttemptBridgeSource = readFileSync(path.join(root, "src/components/learning/LearningAttemptBridge.tsx"), "utf8");
  const learningAttemptRpcSource = readFileSync(path.join(root, "supabase/migrations/0004_learning_rpc_hardening.sql"), "utf8");
  assert.doesNotMatch(worldRuntimeSource, /WORLD_STAGE_AMBIENCE/, "Stage ambience must be data-driven by the pilot manifest");
  assert.doesNotMatch(worldRuntimeCss, /\.stageRuntime\[data-stage-order="[1-8]"\]\s*\{\s*--world-scene-wide/, "Stage background selection must not return to per-order CSS hardcoding");
  assert.match(worldRuntimeSource, /getMoneyWorldPilotStage\(stageId\)/, "Stage runtime must resolve its pilot production manifest");
  assert.match(worldRuntimeSource, /<WorldSceneRenderer/, "Petualangan Uang must render through the reusable Scene presentation layer");
  assert.doesNotMatch(worldRuntimeSource, /showAmbientGuides/, "Scene companion policy must not be hardcoded in Petualangan Uang runtime");
  assert.match(worldRuntimeSource, /MONEY_WORLD_CHAPTERS/, "World runtime must derive visible Chapter navigation from the canonical Chapter registry");
  assert.match(worldRuntimeSource, /data-world-chapter-id/, "World map and Stage shell must expose canonical Chapter identity for QA");
  assert.match(worldRuntimeSource, /data-world-chapter-label/, "Stage shell must render authored Chapter context");
  assert.match(worldRuntimeSource, /chapter\.stageIds\.filter/, "Chapter progress must derive from canonical Chapter membership and completed Stage IDs");
  assert.match(worldRuntimeSource, /chapter\.stageIds\.at\(-1\) === stageId/, "Chapter completion milestone must derive from canonical Chapter membership");
  assert.match(worldRuntimeSource, /data-world-completion-stage/, "Stage completion must expose stable Stage identity for QA");
  assert.match(worldRuntimeSource, /data-world-completion-chapter/, "Stage completion must expose canonical Chapter identity for QA");
  assert.match(worldRuntimeSource, /data-world-completion-final/, "Stage completion must expose final-World status for QA");
  assert.match(worldRuntimeSource, /data-world-completion-context/, "Stage completion must expose concise Chapter/Stage context");
  assert.doesNotMatch(worldRuntimeSource, /chapterOneComplete|stage\?\.order === 4/, "Chapter completion must not regress to Stage-4 hardcoding");
  assert.match(worldSceneRendererSource, /getWorldScenePresentation\(scene\.kind\)/, "reusable Scene renderer must resolve canonical Scene.kind policy");
  assert.match(worldSceneRendererSource, /data-world-scene-presentation/, "reusable Scene renderer must expose its presentation surface for QA");
  assert.match(worldRuntimeSource, /sceneSegmentPosition = activeScene\.segmentIds\.indexOf\(segment\.id\) \+ 1/, "Scene-local progress must derive from authored Scene membership");
  assert.match(worldSceneRendererSource, /data-world-scene-progress/, "reusable Scene renderer must expose Scene-local progress for QA");
  assert.match(worldRuntimeCss, /Production wave 06: Scene wrapper responsive fit/, "World CSS must retain the mobile Scene-wrapper fit correction");
  assert.match(worldRuntimeCss, /\.chapterMapBanner/, "World map must retain semantic Chapter banner styling");
  assert.doesNotMatch(worldRuntimeCss, /content:\s*"Chapter 1|content:\s*"Chapter 2/, "Chapter titles must not be hardcoded as CSS pseudo-content");
  assert.match(worldRuntimeCss, /Production wave 13: Stage completion UX polish/, "World CSS must retain completion UX polish");
  assert.match(worldRuntimeCss, /\.completionActions\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/, "completion navigation must remain one compact three-action row on mobile");
  assert.match(worldRuntimeCss, /\.shareButton\s*\{[\s\S]*width:\s*min\(590px,\s*100%\)/, "Share must remain a separate full completion action below navigation");
  assert.match(worldRuntimeSource, /role="progressbar"/, "Stage progress must expose progressbar semantics");
  assert.match(worldRuntimeSource, /aria-valuenow=\{segmentIndex \+ 1\}/, "Stage progress must expose current Segment position");
  assert.match(worldRuntimeSource, /aria-current=\{stage\.id === nextJourneyStageId \? "step"/, "journey map must expose the current Stage semantically");
  assert.match(worldRuntimeSource, /completionTitleRef\.current\?\.focus\(\)/, "Stage completion must move focus to its completion heading");
  assert.match(worldRuntimeSource, /role="img" aria-label=\{startCount \+ " token, " \+ removeCount \+ " dipakai"\}/, "take-away token board must expose a text alternative");
  assert.match(worldRuntimeSource, /className=\{styles\.orderSlots\} role="list"/, "ordering output must expose list semantics");
  assert.match(worldRuntimeSource, /className=\{styles\.recapGrid\} role="list"/, "final recap must expose list semantics");
  assert.match(worldRuntimeSource, /<p role="status" aria-live="polite">\{selected\.reaction\}<\/p>/, "open choice reaction must be politely announced");
  assert.match(worldSceneRendererSource, /role="region"/, "active World Scene must expose a labelled region");
  assert.match(worldSceneRendererSource, /aria-live="polite"/, "Scene title/progress changes must be announced politely");
  assert.match(worldRuntimeCss, /Production wave 15: World accessibility pass/, "World CSS must retain accessibility focus/high-contrast support");
  assert.doesNotMatch(worldRuntimeCss, /playground-park-(wide|mobile)\.webp[\s\S]*mini-market-(wide|mobile)\.webp[\s\S]*number-park-(wide|mobile)\.webp/, "World CSS must not eagerly hardcode all Stage backgrounds");
  assert.match(worldRuntimeCss, /@media \(forced-colors: active\)/, "World must preserve selected/current states in forced-colors mode");
  assert.match(worldRuntimeCss, /\.stageLink\[href\]:focus-visible/, "journey Stage links must keep a visible keyboard focus ring");
  assert.doesNotMatch(worldRuntimeSource, /moneyWorldEvidenceBridge|recordLearningAttempt|syncOrQueueLearningAttempt|LEARNING_MEASUREMENT_EVENT/, "World runtime must not activate or write through the evidence bridge");
  assert.match(learningAttemptBridgeSource, /parts\.indexOf\("activity"\)/, "canonical LearningAttemptBridge must stay scoped to Belajar activity routes");
  assert.match(learningAttemptBridgeSource, /if \(!activity\) return;/, "canonical attempt bridge must reject unknown/non-catalog activity IDs");
  assert.match(learningAttemptRpcSource, /insert into public\.child_learning_progress/, "existing record_learning_attempt RPC still has Belajar progression side effects");
  assert.match(learningAttemptRpcSource, /coalesce\(v_activity\.star_reward,0\)/, "existing record_learning_attempt RPC still owns Belajar star rewards");

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
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_VERSION, "money-world-narration-plan-v1");
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_VOICE_POLICY.version, "money-world-narration-voice-policy-v1");
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_VOICE_POLICY.fixedAudioGenerationAuthorized, false, "fixed audio generation must remain blocked until final voice identity is explicitly approved");
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_VOICE_POLICY.finalHumanCharactersActivated, false);
  assert.deepEqual(narrationPlan.MONEY_WORLD_NARRATION_VOICE_POLICY.runtimePresentationMapping, { Gian: "gavi", Naya: "paca" });
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_VALIDATION.valid, true, narrationPlan.MONEY_WORLD_NARRATION_PLAN_VALIDATION.errors.join("; "));
  assert.deepEqual(narrationPlan.MONEY_WORLD_NARRATION_PLAN_VALIDATION.errors, []);
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_SUMMARY.stageBatches, 8);
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_SUMMARY.totalCues, 88);
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_SUMMARY.approvedCues, 0);
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_SUMMARY.generationAuthorizedCues, 0);
  assert.equal(narrationPlan.MONEY_WORLD_NARRATION_PLAN_SUMMARY.blockedCues, 88);
  assert.ok(
    narrationPlan.MONEY_WORLD_NARRATION_STAGE_BATCHES.every((batch) => batch.status === "blocked-voice-identity"),
    "all narration Stage batches must remain blocked before voice identity approval"
  );
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VERSION, "money-world-narration-provider-pilot-v1");
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION.valid, true, narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION.errors.join("; "));
  assert.deepEqual(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT_VALIDATION.errors, []);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.cues.length, 4);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.providerStatus, "unselected");
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.generationAuthorized, false);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.publicOutput, false);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.productionOutput, false);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.runtimeActive, false);
  assert.equal(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.registryAutoApproval, false);
  assert.deepEqual(
    narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.cues.map((cue) => cue.speaker).sort(),
    ["Gian", "Gian", "Naya", "Naya"].sort(),
    "provider pilot must cover both canonical speaker roles evenly"
  );
  assert.deepEqual(
    [...new Set(narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT.cues.map((cue) => cue.kind))].sort(),
    ["activity_prompt", "concept", "narrative", "payoff"],
    "provider pilot must cover four representative narration use cases"
  );
  assert.equal(narrationReview.MONEY_WORLD_NARRATION_REVIEW_VERSION, "money-world-narration-review-v1");
  assert.equal(narrationReview.MONEY_WORLD_NARRATION_REVIEW_VALIDATION.valid, true, narrationReview.MONEY_WORLD_NARRATION_REVIEW_VALIDATION.errors.join("; "));
  assert.deepEqual(narrationReview.MONEY_WORLD_NARRATION_REVIEW_VALIDATION.errors, []);
  assert.equal(narrationReview.MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS.length, 9, "pilot review must keep nine blocking dimensions");
  assert.ok(narrationReview.MONEY_WORLD_NARRATION_REVIEW_DIMENSIONS.every((dimension) => dimension.blocking === true));
  assert.deepEqual(
    narrationReview.MONEY_WORLD_NARRATION_PROVIDER_PILOT_REVIEW_TEMPLATES.map((template) => template.cueId),
    narrationPilot.MONEY_WORLD_NARRATION_PROVIDER_PILOT_CUE_IDS,
    "review templates must follow the exact four-cue pilot order"
  );
  const pendingPilotReview = narrationReview.createPendingMoneyWorldNarrationPilotReviewRecords();
  const pendingPilotReviewValidation = narrationReview.validateMoneyWorldNarrationPilotReviewRecords(pendingPilotReview);
  assert.equal(pendingPilotReviewValidation.valid, true);
  assert.equal(pendingPilotReviewValidation.accepted, false, "pending human review must never count as accepted");
  const fullyPassedPilotReview = pendingPilotReview.map((record) => ({
    ...record,
    reviewer: "fixture-reviewer",
    reviewedAt: "2026-09-22T00:00:00.000Z",
    decisions: Object.fromEntries(
      narrationReview.MONEY_WORLD_NARRATION_REVIEW_DIMENSION_IDS.map((dimension) => [dimension, "pass"])
    )
  }));
  const fullyPassedPilotValidation = narrationReview.validateMoneyWorldNarrationPilotReviewRecords(fullyPassedPilotReview);
  assert.equal(fullyPassedPilotValidation.valid, true);
  assert.equal(fullyPassedPilotValidation.accepted, true, "all four cues must pass all dimensions before pilot review can be accepted");
  const failedPilotReview = structuredClone(fullyPassedPilotReview);
  failedPilotReview[0].decisions.pronunciation = "fail";
  assert.equal(
    narrationReview.validateMoneyWorldNarrationPilotReviewRecords(failedPilotReview).accepted,
    false,
    "one blocking dimension failure must reject pilot acceptance"
  );
  const stalePilotReview = structuredClone(fullyPassedPilotReview);
  stalePilotReview[0].textFingerprint = "fnv1a32-stale";
  assert.equal(
    narrationReview.validateMoneyWorldNarrationPilotReviewRecords(stalePilotReview).valid,
    false,
    "stale copy fingerprint must invalidate human review"
  );
  assert.equal(
    narrationReview.validateMoneyWorldNarrationPilotReviewRecords(fullyPassedPilotReview.slice(0, 3)).valid,
    false,
    "partial review scope must fail closed"
  );
  assert.deepEqual(
    narrationPlan.MONEY_WORLD_NARRATION_STAGE_BATCHES.map((batch) => batch.stageId),
    world.MONEY_WORLD_STAGES.map((stage) => stage.id),
    "narration Stage batches must follow canonical Stage order"
  );
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
  const narrationBatchToolSource = readFileSync(path.join(root, "scripts/prepare-world-money-narration-batch.mjs"), "utf8");
  const narrationProviderPilotToolSource = readFileSync(path.join(root, "scripts/prepare-world-money-narration-provider-pilot.mjs"), "utf8");
  const narrationReviewSheetToolSource = readFileSync(path.join(root, "scripts/prepare-world-money-narration-review-sheet.mjs"), "utf8");
  assert.match(narrationRuntimeSource, /playMoneyWorldNarration/, "World runtime must route narration through the fixed-audio resolver");
  assert.doesNotMatch(narrationRuntimeSource, /\bspeakPrompt\s*\(/, "World runtime must not bypass fixed-audio resolution with direct browser speech");
  assert.match(narrationPlaybackSource, /resolveMoneyWorldNarrationProductionSrc/, "playback adapter must resolve reviewed fixed assets");
  assert.match(narrationPlaybackSource, /onFixedAudioFallback/, "fixed audio failure must retain browser-speech fallback");
  assert.match(narrationPlaybackSource, /new Audio\(productionSrc\)/, "reviewed production audio must use deterministic fixed-file playback");
  assert.match(narrationBatchToolSource, /STOP: audio generation is not authorized/, "production packet must fail visibly when voice generation is not authorized");
  assert.match(narrationBatchToolSource, /--stage=/, "narration packet tool must support Stage-scoped production batches");
  assert.match(narrationProviderPilotToolSource, /STOP: provider\/voice decision is not approved/, "provider pilot packet must remain explicitly generation-blocked");
  assert.doesNotMatch(narrationProviderPilotToolSource, /OPENAI_API_KEY|api\.openai\.com|fetch\s*\(/, "provider pilot preparation must remain provider-neutral and offline");
  assert.match(narrationReviewSheetToolSource, /every one of the four cues passes every blocking dimension/, "review sheet must state the all-cues/all-dimensions acceptance rule");
  assert.doesNotMatch(narrationReviewSheetToolSource, /OPENAI_API_KEY|api\.openai\.com|fetch\s*\(/, "human-review sheet preparation must remain provider-neutral and offline");

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

  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_VERSION, "money-world-evidence-bridge-v1");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_MODE, "design-only-disabled");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_ENABLED, false, "World evidence bridge must remain disabled until separately authorized");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_VALIDATION.valid, true, evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_VALIDATION.errors.join("; "));
  assert.deepEqual(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_VALIDATION.errors, []);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_CANDIDATES.length, 1, "only the Stage 8 subtraction activity may remain in the approved future evidence scope");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_EXCLUSIONS.length, 15, "all other World activities must stay explicitly excluded from mastery");
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.length, activityCount, "bridge audit must cover all World activity placements exactly once");
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
  assert.ok(
    evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_AUDIT.every((entry) => entry.sourceAssessment === "practice"),
    "all current World placements must remain practice even when their mechanic can measure accuracy"
  );
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.directRecordLearningAttemptAllowed, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.learningProgressMutationAllowed, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.rewardMutationAllowed, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.masteryRecomputeAllowed, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.runtimeHookAuthorized, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.schemaMigrationAuthorized, false);
  assert.equal(evidenceBridge.MONEY_WORLD_EVIDENCE_WRITE_BOUNDARY.futureServerOwnedAdapterRequired, true);
  const pedagogyRequirement = evidenceBridge.MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS.find(
    (requirement) => requirement.id === "canonical-mapping-pedagogy-review"
  );
  assert.equal(pedagogyRequirement?.satisfied, true, "authorized pedagogical mapping decision must be recorded");
  assert.ok(
    evidenceBridge.MONEY_WORLD_EVIDENCE_ACTIVATION_REQUIREMENTS
      .filter((requirement) => requirement.id !== "canonical-mapping-pedagogy-review")
      .every((requirement) => requirement.satisfied === false),
    "all non-pedagogy activation requirements must remain unsatisfied"
  );

  for (const candidate of evidenceBridge.MONEY_WORLD_EVIDENCE_CANDIDATES) {
    assert.equal(candidate.decision, "candidate");
    assert.equal(candidate.mappingStatus, "pedagogy-approved-disabled");
    assert.equal(candidate.sourceAssessment, "practice");
    assert.equal(candidate.canonicalLearningActivityId, null, "candidate must not fake a canonical learning_activity mapping");
    assert.equal(candidate.progressionEffect, "none");
    assert.equal(candidate.rewardEffect, "none");
    assert.equal(candidate.requiresPedagogyReview, false);
    assert.ok(candidate.canonicalSkillId, candidate.worldActivityId + " candidate must name a canonical skill");
    const canonicalSkill = catalog.getLearningSkill(candidate.canonicalSkillId);
    assert.ok(canonicalSkill, candidate.worldActivityId + " candidate skill must exist in canonical catalog");
    assert.equal(candidate.canonicalSubjectId, canonicalSkill.subjectId, candidate.worldActivityId + " candidate subject must match the canonical skill");
    assert.equal(
      mechanics.resolveMechanicEvidenceContract(candidate.mechanicId, "assessed"),
      candidate.assessedEvidenceContract,
      candidate.worldActivityId + " candidate evidence contract must match the reusable mechanic"
    );
  }

  const blockedCandidate = evidenceBridge.evaluateMoneyWorldEvidenceObservation({
    worldId: world.MONEY_WORLD_ID,
    stageId: "money-stage-08-final-festival",
    worldActivityId: "money-s08-activity-02",
    mechanicId: "tap_choice",
    assessment: "practice",
    status: "completed",
    accuracy: 1,
    correctCount: 1,
    incorrectCount: 0,
    retryCount: 0
  });
  assert.equal(blockedCandidate.validSourceIdentity, true);
  assert.equal(blockedCandidate.disposition, "blocked");
  assert.equal(blockedCandidate.candidateSkillId, "math.operation.subtraction.within_10");
  assert.equal(blockedCandidate.canWriteLearningAttempt, false);
  assert.equal(blockedCandidate.canCreateSkillEvidence, false);
  assert.equal(blockedCandidate.canAffectMastery, false);
  assert.equal(blockedCandidate.canAffectLearningProgress, false);
  assert.equal(blockedCandidate.canAwardStars, false);
  assert.equal(blockedCandidate.canIssueCertificate, false);
  assert.ok(blockedCandidate.blockers.includes("bridge-disabled"));
  assert.ok(blockedCandidate.blockers.includes("world-activity-practice-only"));
  assert.equal(blockedCandidate.blockers.includes("candidate-mapping-not-approved"), false, "approved pedagogy mapping must not retain the old mapping blocker");
  assert.ok(blockedCandidate.blockers.includes("progression-reward-side-effects-not-isolated"));

  const spoofedAssessment = evidenceBridge.evaluateMoneyWorldEvidenceObservation({
    worldId: world.MONEY_WORLD_ID,
    stageId: "money-stage-08-final-festival",
    worldActivityId: "money-s08-activity-02",
    mechanicId: "tap_choice",
    assessment: "assessed",
    status: "completed",
    accuracy: 1
  });
  assert.equal(spoofedAssessment.validSourceIdentity, false);
  assert.ok(spoofedAssessment.blockers.includes("source-assessment-spoofed"), "caller must not promote World practice to assessed");

  const rejectedPriceMapping = evidenceBridge.MONEY_WORLD_EVIDENCE_EXCLUSIONS.find(
    (entry) => entry.worldActivityId === "money-s02-activity-01"
  );
  assert.ok(rejectedPriceMapping, "Stage 2 price comparison must remain explicitly audited");
  assert.equal(rejectedPriceMapping.mappingStatus, "rejected-after-pedagogy-review");
  assert.equal(rejectedPriceMapping.canonicalSkillId, null);
  assert.equal(rejectedPriceMapping.assessedEvidenceContract, null);
  assert.equal(rejectedPriceMapping.requiresPedagogyReview, false);

  const rejectedPriceObservation = evidenceBridge.evaluateMoneyWorldEvidenceObservation({
    worldId: world.MONEY_WORLD_ID,
    stageId: "money-stage-02-price-change",
    worldActivityId: "money-s02-activity-01",
    mechanicId: "compare",
    assessment: "practice",
    status: "completed",
    accuracy: 1
  });
  assert.equal(rejectedPriceObservation.validSourceIdentity, true);
  assert.equal(rejectedPriceObservation.candidateSkillId, null);
  assert.ok(rejectedPriceObservation.blockers.includes("no-approved-canonical-skill-mapping"));

  const excludedObservation = evidenceBridge.evaluateMoneyWorldEvidenceObservation({
    worldId: world.MONEY_WORLD_ID,
    stageId: "money-stage-05-saving",
    worldActivityId: "money-s05-activity-01",
    mechanicId: "drag_to_target",
    assessment: "practice",
    status: "completed",
    accuracy: 1
  });
  assert.equal(excludedObservation.validSourceIdentity, true);
  assert.equal(excludedObservation.candidateSkillId, null);
  assert.ok(excludedObservation.blockers.includes("no-approved-canonical-skill-mapping"));

  const unknownObservation = evidenceBridge.evaluateMoneyWorldEvidenceObservation({
    worldId: world.MONEY_WORLD_ID,
    stageId: "money-stage-01-money-use",
    worldActivityId: "money-unknown",
    mechanicId: "tap_choice",
    assessment: "practice",
    status: "completed",
    accuracy: 1
  });
  assert.equal(unknownObservation.validSourceIdentity, false);
  assert.ok(unknownObservation.blockers.includes("source-identity-mismatch"));

  assert.ok(
    evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS.includes("canonical-learning-skill-age-contract-currently-stops-at-7"),
    "age-8 blocker must remain explicit until canonical learning age migration is complete"
  );
  assert.ok(
    evidenceBridge.MONEY_WORLD_EVIDENCE_BRIDGE_BLOCKERS.includes("progression-reward-side-effects-not-isolated"),
    "existing Belajar progression/reward side effects must remain an explicit blocker"
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

  assert.equal(social.MONEY_WORLD_SOCIAL_CARD_VERSION, "money-world-social-card-v1");
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD_VALIDATION.valid, true, social.MONEY_WORLD_SOCIAL_CARD_VALIDATION.errors.join("; "));
  assert.deepEqual(social.MONEY_WORLD_SOCIAL_CARD_VALIDATION.errors, []);
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.path, "/worlds/money-festival/social-card");
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.width, 1200);
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.height, 630);
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.publicSafe, true);
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.containsChildProgress, false);
  assert.equal(social.MONEY_WORLD_SOCIAL_CARD.containsAccountIdentity, false);

  assert.equal(assets.MONEY_WORLD_ASSET_PLAN_VERSION, "money-world-assets-v1");
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.version, "money-world-runtime-character-dummy-v1");
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.mode, "approved-mascot-dummy");
  assert.deepEqual(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.storyRoleToRuntimeCharacter, { Gian: "gavi", Naya: "paca" });
  assert.equal(assets.MONEY_WORLD_RUNTIME_CHARACTER_POLICY.finalHumanCharactersActivated, false, "World runtime must not activate fallback human characters while character development is paused");
  assert.equal(new Set(assets.MONEY_WORLD_ASSET_SLOTS.map((slot) => slot.id)).size, assets.MONEY_WORLD_ASSET_SLOTS.length, "World asset slot IDs must stay unique");
  for (const asset of assets.MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS) {
    assert.equal(existsSync(path.join(root, asset)), true, "World visual/share asset missing: " + asset);
  }
  const uniqueWorldVisualAssets = [...new Set(assets.MONEY_WORLD_REUSED_PUBLIC_ASSET_PATHS)];
  const visualSizes = uniqueWorldVisualAssets.map((asset) => ({
    asset,
    bytes: statSync(path.join(root, asset)).size
  }));
  assert.ok(
    visualSizes.every((entry) => entry.bytes <= 80 * 1024),
    "every approved reused World visual asset must stay at or below 80 KiB"
  );
  assert.ok(
    visualSizes.reduce((sum, entry) => sum + entry.bytes, 0) <= 600 * 1024,
    "approved reused World visual asset library must stay at or below 600 KiB"
  );
  const worldWordmarkBytes = statSync(path.join(root, "public/artwork/garden-wordmark.webp")).size;
  assert.ok(worldWordmarkBytes <= 40 * 1024, "World Stage wordmark must stay at or below 40 KiB");
  const mapCoreAssetBytes = [
    "public/artwork/math-warung.webp",
    "public/artwork/garden-background.webp",
    "public/artwork/garden-gavi.webp",
    "public/artwork/garden-paca.webp"
  ].reduce((sum, asset) => sum + statSync(path.join(root, asset)).size, 0);
  assert.ok(mapCoreAssetBytes <= 230 * 1024, "World map core artwork must stay at or below 230 KiB");
  const maxStageBackgroundBytes = Math.max(
    ...pilot.MONEY_WORLD_PILOT_STAGES.flatMap((stage) => [stage.backgroundWide, stage.backgroundMobile])
      .map((asset) => statSync(path.join(root, "public" + asset)).size)
  );
  const maxStageShellArtworkBytes =
    maxStageBackgroundBytes +
    worldWordmarkBytes +
    statSync(path.join(root, "public/artwork/garden-gavi.webp")).size +
    statSync(path.join(root, "public/artwork/garden-paca.webp")).size;
  assert.ok(maxStageShellArtworkBytes <= 190 * 1024, "single Stage shell artwork budget must stay at or below 190 KiB");
  assert.deepEqual(
    [...assets.MONEY_WORLD_PRODUCTION_GAPS].sort(),
    ["fixed-narration", "gian-foreground", "naya-foreground"].sort(),
    "World production gaps must stay explicit instead of silently appearing complete"
  );
  assert.ok(
    assets.MONEY_WORLD_ASSET_SLOTS.filter((slot) => slot.kind === "background").every((slot) => slot.status === "approved-reused"),
    "current background reuse must remain explicitly approved in the pilot manifest"
  );

  const narrationAssetGate = validateWorldMoneyNarrationAssetGate({
    root,
    entries: narrationProduction.MONEY_WORLD_NARRATION_PRODUCTION_ENTRIES,
    expectedCount: 88
  });
  assert.equal(narrationAssetGate.valid, true, narrationAssetGate.errors.join("; "));
  assert.equal(narrationAssetGate.approvedPaths.length, 0, "no fixed World narration binary is approved yet");

  const narrationAssetRegression = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "run-world-money-narration-asset-validator-tests.mjs")],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(
    narrationAssetRegression.status,
    0,
    "World narration asset-gate regression failed:\n" +
      (narrationAssetRegression.stdout ?? "") +
      (narrationAssetRegression.stderr ?? "")
  );

  console.log("Petualangan Uang canonical hierarchy, semantic Chapter navigation, polished Stage completion UX, eight-stage content consistency audit, fail-closed World-to-Evidence v1 design contract, World accessibility semantics/focus/high-contrast support, World visual asset budgets/lazy background boundary, reusable Scene renderer/presentation policy, eight-stage production manifest, dedicated public-safe social card, data-driven Stage visuals, fixed-narration production/review resolver, narration binary provenance gate, provider-neutral four-cue pilot review gate, linear progress, age policy/migration audit, fail-closed evidence audit, practice boundary, low-text language, recap, mascot-dummy runtime policy, asset plan, and financial-safety contracts passed.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
