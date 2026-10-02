import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf8");

const learningPlatform = read("src/components/learning/LearningPlatform.tsx");
const childPathViews = read("src/components/learning/ChildLearningPathViews.tsx");
const childLegacy = read("src/components/learning/ChildLearningPlatform.tsx");
const parentLegacy = read("src/components/learning/ParentLearningPlatform.tsx");
const worldLegacy = read("src/components/learning/world/WorldExperience.tsx");

const childHomePage = read("src/app/child/[childId]/home/page.tsx");
const childSelectPage = read("src/app/child/select/page.tsx");
const subjectPage = read("src/app/child/[childId]/subject/[subject]/page.tsx");
const stagePage = read("src/app/child/[childId]/stage/[stage]/page.tsx");
const parentPage = read("src/app/parent/page.tsx");
const worldsPage = read("src/app/child/[childId]/worlds/page.tsx");
const worldMapPage = read("src/app/child/[childId]/world/[worldId]/page.tsx");
const worldStagePage = read("src/app/child/[childId]/world/[worldId]/stage/[stageId]/page.tsx");

assert.match(
  childHomePage,
  /Batch14WorldHome/,
  "child home route must stay owned by Batch14WorldHome"
);
assert.doesNotMatch(
  learningPlatform,
  /ChildHomeScreen/,
  "LearningPlatform must not re-export a retired ChildHomeScreen owner"
);
assert.doesNotMatch(
  childPathViews,
  /export function ChildHomeScreen/,
  "ChildLearningPathViews must not restore its retired ChildHomeScreen"
);
assert.doesNotMatch(
  childLegacy,
  /export function ChildHomeScreen/,
  "ChildLearningPlatform must not restore its retired ChildHomeScreen"
);

assert.match(
  childSelectPage,
  /ChildSelectScreen.*LearningPlatform/s,
  "child select route must consume the LearningPlatform alias"
);
assert.match(
  learningPlatform,
  /CloudChildSelectScreen as ChildSelectScreen/,
  "ChildSelectScreen alias must remain backed by CloudChildSelectScreen"
);
assert.doesNotMatch(
  childLegacy,
  /export function ChildSelectScreen/,
  "legacy ChildLearningPlatform child-select owner must stay retired"
);

assert.match(
  subjectPage,
  /ChildLearningPathViews/,
  "subject route must import the canonical ChildLearningPathViews owner"
);
assert.match(
  childPathViews,
  /<BelajarJourneyMap/,
  "canonical subject screen must render BelajarJourneyMap"
);
assert.doesNotMatch(
  childPathViews,
  /ActivityGallery/,
  "canonical subject screen must not restore the retired ActivityGallery fallback"
);
assert.equal(
  existsSync(path.join(root, "src/components/learning/ActivityGallery.tsx")),
  false,
  "retired ActivityGallery component must remain absent"
);
assert.equal(
  existsSync(path.join(root, "src/components/learning/ActivityGallery.module.css")),
  false,
  "retired ActivityGallery styles must remain absent"
);

assert.match(
  stagePage,
  /DrawingStageScreen[sS]*StageScreen/,
  "Stage route must preserve DrawingStageScreen exception plus canonical StageScreen fallback"
);

assert.match(
  parentPage,
  /ParentOverviewScreen.*LearningPlatform/s,
  "parent root must consume the LearningPlatform alias"
);
assert.match(
  learningPlatform,
  /CloudParentOverviewScreen as ParentOverviewScreen/,
  "ParentOverviewScreen alias must remain backed by CloudParentOverviewScreen"
);
assert.doesNotMatch(
  parentLegacy,
  /export function ParentOverviewScreen/,
  "legacy ParentLearningPlatform overview owner must stay retired"
);

for (const retiredWorldOwner of [
  "MainlagiWorldHome",
  "WorldSubjectScreen",
  "WorldStageScreen",
  "WorldLearnEntry"
]) {
  assert.doesNotMatch(
    worldLegacy,
    new RegExp("export function\\s+" + retiredWorldOwner + "\\b"),
    retiredWorldOwner + " must remain retired from legacy WorldExperience"
  );
}

assert.match(
  worldLegacy,
  /export function WorldChildShell/,
  "active WorldChildShell bridge must remain available"
);
assert.match(
  worldLegacy,
  /export function WorldActivityScreen/,
  "active WorldActivityScreen fallback bridge must remain available"
);
assert.match(
  worldLegacy,
  /LegacyActivityScreen/,
  "WorldActivityScreen must retain the finite ChildLearningPlatform activity fallback"
);
assert.match(
  worldLegacy,
  /export function WorldRewardsScreen/,
  "active WorldRewardsScreen must remain available"
);
assert.match(
  childLegacy,
  /export function ActivityScreen/,
  "active ChildLearningPlatform ActivityScreen fallback must remain available"
);
assert.match(
  childLegacy,
  /export function GamesScreen/,
  "active Bermain GamesScreen must remain available"
);
assert.match(
  parentLegacy,
  /export function ParentShell/,
  "active ParentShell must remain available"
);

assert.match(
  worldsPage,
  /world-v2\/MoneyWorldExperience[sS]*WorldCatalogScreen/,
  "World catalog route must stay on world-v2"
);
assert.match(
  worldMapPage,
  /world-v2\/MoneyWorldExperience[sS]*MoneyWorldMapScreen/,
  "World map route must stay on MoneyWorldMapScreen"
);
assert.match(
  worldStagePage,
  /world-v2\/MoneyWorldExperience[sS]*MoneyWorldStageScreen/,
  "World Stage route must stay on MoneyWorldStageScreen"
);

console.log("P0-UIA-01 canonical UI owner regression PASS: live route owners are locked, retired duplicate owners remain absent, and active fallback/Bermain/shell/rewards owners remain protected.");
