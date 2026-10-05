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
const playroom = read("src/components/learning/Playroom.tsx");
const cloudProfiles = read("src/components/learning/CloudProfileScreens.tsx");
const globalNavigation = read("src/lib/navigation/mainlagiGlobal.ts");
const topNavbar = read("src/components/nav/TopNavbar.tsx");
const authFamilyShell = read("src/components/auth/AuthFamilyShell.tsx");
const aboutPage = read("src/app/about/page.tsx");
const accountAboutPage = read("src/app/account/about/page.tsx");
const accountPlayersPage = read("src/app/account/players/page.tsx");
const accountPreferencesPage = read("src/app/account/preferences/page.tsx");

const childHomePage = read("src/app/child/[childId]/home/page.tsx");
const childSelectPage = read("src/app/child/select/page.tsx");
const subjectPage = read("src/app/child/[childId]/subject/[subject]/page.tsx");
const stagePage = read("src/app/child/[childId]/stage/[stage]/page.tsx");
const parentPage = read("src/app/parent/page.tsx");
const rewardsPage = read("src/app/child/[childId]/rewards/page.tsx");
const parentChildrenPage = read("src/app/parent/children/page.tsx");
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
for (const retiredChildOwner of [
  "LearnLibraryScreen",
  "SubjectScreen",
  "StageScreen",
  "RewardsScreen"
]) {
  assert.doesNotMatch(
    childLegacy,
    new RegExp("export function\\s+" + retiredChildOwner + "\\b"),
    retiredChildOwner + " must remain retired from ChildLearningPlatform"
  );
}
assert.doesNotMatch(
  learningPlatform,
  /RewardsScreen/,
  "LearningPlatform must not re-export the retired duplicate RewardsScreen"
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

assert.ok(
  stagePage.includes('import { DrawingStageScreen } from "@/components/learning/CreativeTrackViews";') &&
    stagePage.includes('import { StageScreen } from "@/components/learning/ChildLearningPathViews";'),
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
assert.doesNotMatch(
  parentLegacy,
  /export function ParentChildrenScreen/,
  "legacy ParentLearningPlatform children owner must stay retired"
);
assert.match(
  learningPlatform,
  /CloudParentChildrenScreen as ParentChildrenScreen/,
  "ParentChildrenScreen alias must remain backed by CloudParentChildrenScreen"
);
assert.ok(
  parentChildrenPage.includes("ParentChildrenScreen") && parentChildrenPage.includes("LearningPlatform"),
  "parent children route must consume the LearningPlatform cloud alias"
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
assert.ok(
  rewardsPage.includes("WorldRewardsScreen") && rewardsPage.includes("world/WorldExperience"),
  "rewards route must stay owned by WorldRewardsScreen"
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

assert.ok(
  worldsPage.includes("WorldCatalogScreen") && worldsPage.includes("world-v2/MoneyWorldExperience"),
  "World catalog route must stay on world-v2"
);
assert.ok(
  worldMapPage.includes("MoneyWorldMapScreen") && worldMapPage.includes("world-v2/MoneyWorldExperience"),
  "World map route must stay on MoneyWorldMapScreen"
);
assert.ok(
  worldStagePage.includes("MoneyWorldStageScreen") && worldStagePage.includes("world-v2/MoneyWorldExperience"),
  "World Stage route must stay on MoneyWorldStageScreen"
);

const canonicalLabels = [
  "Beranda",
  "Belajar",
  "Bermain",
  "World",
  "Shop",
  "Bacaan & ide",
  "Area orang tua",
  "Tentang Mainlagi"
];
let lastLabelIndex = -1;
for (const label of canonicalLabels) {
  const index = globalNavigation.indexOf(`"${label}"`);
  assert.ok(index > lastLabelIndex, `canonical global menu label/order drifted at ${label}`);
  lastLabelIndex = index;
}
assert.match(topNavbar, /buildMainlagiGlobalMenu/, "public/family header must use canonical global navigation");
assert.match(playroom, /buildMainlagiGlobalMenu/, "child shell must use canonical global navigation");
assert.match(parentLegacy, /<TopNavbar\s*\/>/, "parent shell must retain global Mainlagi header above parent subnavigation");
assert.match(authFamilyShell, /<TopNavbar\s*\/>/, "auth family surfaces must retain global Mainlagi header");

assert.match(cloudProfiles, /profiles:\s*\[DEMO_PROFILE\][\s\S]*authenticated:\s*false/, "signed-out profile collection must expose Gian Demo only");
assert.match(cloudProfiles, /data-mainlagi-account-first-gate/, "child select must expose the account-first gate while signed out");
assert.match(cloudProfiles, /data-mainlagi-cloud-profile-form/, "authenticated child select must expose the cloud profile form");
assert.doesNotMatch(cloudProfiles, /readProfiles|saveProfile/, "signed-out production profile creation must not fall back to local persistent profiles");

assert.match(accountAboutPage, /redirect\("\/about"\)/, "legacy account About route must redirect to canonical /about");
assert.match(accountPlayersPage, /redirect\("\/parent\/children"\)/, "legacy account players route must redirect to parent children");
assert.match(accountPreferencesPage, /redirect\("\/parent\/settings"\)/, "legacy account preferences route must redirect to parent settings");
assert.match(aboutPage, /anak usia 3–7 tahun/, "canonical About must describe the current 3–7 Mainlagi audience");
assert.match(aboutPage, /Belajar/, "canonical About must include Belajar");
assert.match(aboutPage, /World/, "canonical About must include World");
assert.match(aboutPage, /Gian Demo/, "canonical About must explain the explicit no-account demo boundary");
assert.doesNotMatch(aboutPage, /10 permainan edukasi|Guru\s*&\s*presenter/i, "canonical About must not restore stale motion-only positioning");

console.log("P0-UIA-01 canonical UI owner regression PASS: route owners remain locked and canonical global navigation/account-first/About ownership is protected.");
