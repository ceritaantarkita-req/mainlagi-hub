import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);
const block = (source, start, end) => {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert(a >= 0 && b > a, `missing source block ${start} -> ${end}`);
  return source.slice(a, b);
};

const pkg = JSON.parse(read("package.json"));
const route = read("src/app/child/[childId]/activity/[activity]/page.tsx");

const specializedOwners = [
  ["MathTraceWorldActivity", "src/components/learning/world/MathTraceWorldActivity.tsx"],
  ["CreativePracticeActivity", "src/components/learning/CreativePracticeActivity.tsx"],
  ["AudioChoiceLearningActivity", "src/components/learning/AudioChoiceLearningActivity.tsx"],
  ["SymbolHuntChoiceActivity", "src/components/learning/SymbolHuntChoiceActivity.tsx"],
  ["MemoryMatchActivity", "src/components/learning/MemoryMatchActivity.tsx"],
  ["DragTargetMatchActivity", "src/components/learning/DragTargetMatchActivity.tsx"],
  ["SequenceSlotChoiceActivity", "src/components/learning/SequenceSlotChoiceActivity.tsx"],
  ["SyllableAssemblyActivity", "src/components/learning/SyllableAssemblyActivity.tsx"],
  ["InitialSoundActivity", "src/components/learning/InitialSoundActivity.tsx"],
  ["PhraseSceneMatchActivity", "src/components/learning/PhraseSceneMatchActivity.tsx"],
  ["GrowthStageTransitionActivity", "src/components/learning/GrowthStageTransitionActivity.tsx"],
  ["SingleRuleApplyActivity", "src/components/learning/SingleRuleApplyActivity.tsx"],
  ["SubitizingGlanceActivity", "src/components/learning/SubitizingGlanceActivity.tsx"],
  ["EliminationBoardActivity", "src/components/learning/EliminationBoardActivity.tsx"],
  ["PhenomenonRelationBoardActivity", "src/components/learning/PhenomenonRelationBoardActivity.tsx"],
  ["ShapeAttributeBoardActivity", "src/components/learning/ShapeAttributeBoardActivity.tsx"],
  ["PictureWordMatchActivity", "src/components/learning/PictureWordMatchActivity.tsx"],
  ["SentenceOrderCardsActivity", "src/components/learning/SentenceOrderCardsActivity.tsx"],
  ["ReadingPassageQuestionActivity", "src/components/learning/ReadingPassageQuestionActivity.tsx"],
  ["ClozeSentenceChoiceActivity", "src/components/learning/ClozeSentenceChoiceActivity.tsx"],
  ["VisualWordProblemActivity", "src/components/learning/VisualWordProblemActivity.tsx"],
  ["SpatialRelationBoardActivity", "src/components/learning/SpatialRelationBoardActivity.tsx"],
  ["SortingBucketsChoiceActivity", "src/components/learning/SortingBucketsChoiceActivity.tsx"],
  ["OddOneOutActivity", "src/components/learning/OddOneOutActivity.tsx"],
  ["RulePipelineActivity", "src/components/learning/RulePipelineActivity.tsx"],
  ["SetReasoningActivity", "src/components/learning/SetReasoningActivity.tsx"],
  ["TransitiveChainActivity", "src/components/learning/TransitiveChainActivity.tsx"],
  ["SpatialTransformActivity", "src/components/learning/SpatialTransformActivity.tsx"],
  ["RelativeOrderTrackActivity", "src/components/learning/RelativeOrderTrackActivity.tsx"],
  ["CountAndSelectActivity", "src/components/learning/CountAndSelectActivity.tsx"],
  ["NumberLineActivity", "src/components/learning/NumberLineActivity.tsx"],
  ["MoreLessBalanceActivity", "src/components/learning/MoreLessBalanceActivity.tsx"],
  ["PatternCompletionActivity", "src/components/learning/PatternCompletionActivity.tsx"],
  ["EqualGroupsActivity", "src/components/learning/EqualGroupsActivity.tsx"],
  ["MakeTotalActivity", "src/components/learning/MakeTotalActivity.tsx"],
  ["TakeAwayActivity", "src/components/learning/TakeAwayActivity.tsx"],
  ["CauseEffectActivity", "src/components/learning/CauseEffectActivity.tsx"],
  ["ComparePropertiesActivity", "src/components/learning/ComparePropertiesActivity.tsx"],
  ["HealthyHabitRoutineActivity", "src/components/learning/HealthyHabitRoutineActivity.tsx"],
  ["MaterialLabActivity", "src/components/learning/MaterialLabActivity.tsx"],
  ["FeatureFunctionLinkActivity", "src/components/learning/FeatureFunctionLinkActivity.tsx"],
  ["InvestigationBoardActivity", "src/components/learning/InvestigationBoardActivity.tsx"]
];

assert.equal(specializedOwners.length, 42, "SI-11 must lock the exact SI-00 specialized Belajar owner count");
assert.equal(new Set(specializedOwners.map(([name]) => name)).size, 42, "specialized Belajar owner list must be unique");

for (const [component, file] of specializedOwners) {
  const source = read(file);
  has(source, "<ActivityCompletion", `${component} must reach canonical ActivityCompletion`);
  has(source, "completeActivity(childId", `${component} must preserve its renderer-owned completion/progress signal`);
  has(route, component, `${component} must remain reachable from the production activity dispatcher`);
}

const fallback = read("src/components/learning/ChildLearningPlatform.tsx");
const fallbackBlocks = [
  ["choice", block(fallback, "function ChoiceActivity", "function MatchingActivity")],
  ["matching", block(fallback, "function MatchingActivity", "function TraceActivity")],
  ["trace", block(fallback, "function TraceActivity", "function ColoringActivity")],
  ["coloring", block(fallback, "function ColoringActivity", "function StoryActivity")],
  ["story", block(fallback, "function StoryActivity", "function MotionActivity")]
];
for (const [name, source] of fallbackBlocks) {
  has(source, "<ActivityCompletion", `legacy/fallback ${name} must reach canonical ActivityCompletion`);
}
const motion = block(fallback, "function MotionActivity", "export function ActivityScreen");
has(motion, "/play/${activity.gameSlug}", "fallback motion remains an explicit Main Gerak redirect");
lacks(motion, "ActivityCompletion", "fallback motion must not invent a second terminal owner");

const bermainCompletion = read("src/games/BermainCompletion.tsx");
const sharedGame = read("src/games/shared.tsx");
const gameShell = read("src/components/GameShell.tsx");
const airboard = read("src/games/AirBoardGame.tsx");
has(bermainCompletion, 'context="bermain"', "Bermain must consume canonical Completion");
has(bermainCompletion, 'import { CanonicalShareDialog } from "@/components/CanonicalShare"', "Bermain must consume canonical Share");
has(sharedGame, "<BermainCompletion", "RoundEndOverlay must delegate canonical finite-game terminals");

const finiteGames = [
  ["math-choice", "src/games/MathChoiceGame.tsx"],
  ["math-motion-battle", "src/games/DigitRace.tsx"],
  ["number-trace", "src/games/NumberTraceGame.tsx"],
  ["shape-quest", "src/games/ShapeQuestGame.tsx"],
  ["pattern-race", "src/games/DigitRace.tsx"],
  ["math-warung", "src/games/MathWarungGame.tsx"],
  ["iqro-motion", "src/games/IqroMotionGame.tsx"],
  ["dodge-motion", "src/games/DodgeMotionGame.tsx"],
  ["run-to-target", "src/games/RunToTargetGame.tsx"]
];
assert.equal(finiteGames.length, 9, "exact nine scored/timed Main Gerak terminals remain finite");
for (const [slug, file] of finiteGames) {
  has(read(file), "canonical", `${slug} must opt into canonical RoundEnd/Bermain completion`);
}
has(airboard, 'data-airboard-action="finish"', "AirBoard must keep the explicit owner-approved finish action");
has(airboard, 'resultMode="workspace"', "AirBoard must keep workspace-mode canonical Completion");
has(airboard, "<BermainCompletion", "AirBoard must reach canonical Completion");
lacks(airboard, "LeaderboardCapture", "AirBoard must not invent leaderboard score");
lacks(airboard, "useProgressSync", "AirBoard must not invent gameplay progress evidence");

lacks(gameShell, "ShareButton", "GameShell must not retain the duplicate gameplay-header Share owner");
assert.equal(fs.existsSync(path.join(root, "src/components/ShareButton.tsx")), false, "legacy ShareButton implementation must stay deleted");

const canonicalShare = read("src/components/CanonicalShare.tsx");
const belajarCompletion = read("src/components/learning/ActivityCompletion.tsx");
const world = read("src/components/learning/world-v2/MoneyWorldExperience.tsx");
for (const literal of ['fetch("/api/parent/share-gate"', "navigator.clipboard.writeText(shareUrl)", "navigator.share"]) {
  has(canonicalShare, literal, `canonical Share retains exclusive implementation primitive: ${literal}`);
}
for (const [name, source] of [["Belajar", belajarCompletion], ["World", world], ["Bermain", bermainCompletion]]) {
  has(source, 'CanonicalShareDialog', `${name} adapter must consume canonical Share`);
  for (const legacy of ["/api/parent/share-gate", "navigator.clipboard", "navigator.share", "wa.me", "t.me/share"]) {
    lacks(source, legacy, `${name} adapter must not duplicate Share implementation: ${legacy}`);
  }
}
has(world, 'context="world"', "World stage/finale must consume canonical Completion");
has(world, 'data-world-completion-final={finalStage ? "true" : "false"}', "World finale state remains explicit");
has(world, "emitMoneyWorldEvidenceObservation", "World evidence owner must remain preserved");

const geometryQa = read("scripts/run-si02-character-geometry-browser-tests.mjs");
has(geometryQa, 'assert.equal(await story.locator(":scope > strong").count(), 0', "World character-name label must stay removed");
has(geometryQa, 'data-character-geometry"), "safe-contain-v1"', "representative character geometry must remain fail-closed");
has(geometryQa, 'assertSafeCharacterGeometry(completionCharacters, ["gavi", "paca"]', "World completion must retain no-clipping geometry regression");
has(geometryQa, 'assertSafeCharacterGeometry(characters, ["gavi", "paca"]', "Bermain completion must retain no-clipping geometry regression");

const mobileGate = pkg.scripts["test:ui:mobile-routes"];
for (const browserRegression of [
  "run-si01-orientation-foundation-browser-tests.mjs",
  "run-si02-character-geometry-browser-tests.mjs",
  "run-math-trace-browser-tests.mjs",
  "run-si06g-creative-browser-tests.mjs",
  "run-subitizing-glance-browser-tests.mjs",
  "run-si09-bermain-games-7-10-browser-tests.mjs",
  "run-si10-world-adapter-browser-tests.mjs"
]) {
  has(mobileGate, browserRegression, `blocking mobile gate must keep high-risk SI regression ${browserRegression}`);
}

const si01 = read("scripts/run-si01-orientation-foundation-browser-tests.mjs");
has(si01, "viewport change must not reload the document", "SI-01 must keep no-remount rotation assertion");
has(si01, "Bermain timer must continue instead of resetting on rotation", "Bermain rotation must preserve live round state");
has(si01, "World Scene/segment state must survive portrait recovery", "World rotation must preserve story state");

const bridge = read("src/components/learning/LearningAttemptBridge.tsx");
has(bridge, "DUPLICATE_GUARD_MS = 1500", "LearningAttemptBridge duplicate guard must remain unchanged");
const si05 = read("scripts/run-si05-belajar-pilot-browser-tests.mjs");
has(si05, 'attempts.length,1,"successful pilot writes exactly one attempt"', "Belajar pilot must keep one-attempt proof");
has(si05, '"rotation with Share open must not duplicate attempt/evidence"', "Belajar rotation/Share must keep duplicate-evidence proof");
const subitizingQa = read("scripts/run-subitizing-glance-browser-tests.mjs");
has(subitizingQa, '"subitizing success writes exactly one attempt/evidence record"', "missed SI-00 renderer must now prove one attempt/evidence");
has(subitizingQa, '"subitizing rotation must not duplicate attempt/evidence"', "missed renderer must now prove rotation does not duplicate evidence");
has(subitizingQa, '"opening Share must not duplicate attempt/evidence"', "missed renderer Share must remain presentation-only");

for (const requiredLearningGate of [
  "test:learning:si03-completion",
  "test:learning:si04-share",
  "test:learning:si05-pilot",
  "test:learning:si06a-fallback",
  "test:learning:si06b1-literacy-audio",
  "test:learning:si06b2-sentence-reading",
  "test:learning:si06c-matching-order-drag",
  "test:learning:si06d1-math-choice",
  "test:learning:si06d2-math-trace",
  "test:learning:si06e-logic",
  "test:learning:si06f-science",
  "test:learning:si06g-creative",
  "test:learning:subitizing-glance",
  "test:learning:si10-world",
  "test:learning:si11-closure"
]) {
  has(pkg.scripts["test:learning"], `npm run ${requiredLearningGate}`, `blocking learning aggregate must include ${requiredLearningGate}`);
}
for (const batch of ["test:interaction:si07-bermain", "test:interaction:si08-bermain", "test:interaction:si09-bermain"]) {
  has(pkg.scripts["test:interaction"], `npm run ${batch}`, `blocking interaction aggregate must include ${batch}`);
}
has(pkg.scripts["test:engine"], "npm run test:learning", "engine gate must retain full learning aggregate");
has(pkg.scripts["check"], "npm run test:engine", "quality gate must retain engine/learning closure coverage");

console.log("SI-11 integrated closure static contract PASS: 42/42 specialized Belajar owners plus fallback are canonical, 10/10 Main Gerak terminals have approved canonical semantics, World is canonical, duplicate Share is retired, geometry/rotation/attempt-evidence regressions remain blocking.");
