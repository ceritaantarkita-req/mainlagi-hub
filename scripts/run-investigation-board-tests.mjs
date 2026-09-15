import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);

const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,gameplayPattern,matchingPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {investigationBoardConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/investigationBoardConfig.js"));

const expectedIds=new Set([
  "science-investigate-plant-light",
  "science-investigate-fair-water",
  "science-predict-ice-warm-place",
  "science-evidence-shadow-times"
]);

const scoped=ACTIVITIES.filter(activity=>gameplayPattern(activity)==="investigation_board");
assert.equal(scoped.length,4,"investigation-board family size must remain exactly four assessed choice activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expectedIds,"only reviewed Science Wave D investigation/evidence choices use investigation_board");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"science",`${activity.id} remains Science`);
  assert.equal(activity.stageId,"science-evidence-review-challenge",`${activity.id} stays in Science Wave D`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} preserves canonical correctChoice`);
  assert.equal(choiceGameplayPresentation(activity),"investigation_board",`${activity.id} uses investigation_board presentation`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps canonical learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills.map(link=>link.skillId),["science.investigation.evidence.basic"],`${activity.id} keeps exact investigation/evidence skill`);

  const config=investigationBoardConfig(activity);
  assert(config,`${activity.id} has explicit investigation-board config`);
  assert(["observe","control","predict","conclude"].includes(config.mode),`${activity.id} has a reviewed investigation mode`);
  assert(config.scenarioLines.length>=2,`${activity.id} exposes at least two scenario facts`);
  assert.deepEqual(new Set(Object.keys(config.choiceIcons)),new Set(activity.choices??[]),`${activity.id} config maps exactly canonical choices`);
}

const matching=ACTIVITIES.find(activity=>activity.id==="science-match-observation-tools-d");
assert(matching,"science-match-observation-tools-d remains in catalog");
assert.equal(matching.runtime,"matching");
assert.equal(matchingPresentation(matching),"grid_pairs","investigation lesson matching activity remains canonical visible matching");
assert.equal(gameplayPattern(matching),"visible_matching");

for(const id of [
  "science-feature-duck-webbed-feet",
  "science-material-raincoat-waterproof",
  "science-weather-dark-clouds-predict",
  "science-mixed-living-choice"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  if(!activity)continue;
  assert.notEqual(choiceGameplayPresentation(activity),"investigation_board",`${id} stays outside investigation-board scope`);
}

console.log("Investigation-board regression passed for 4 exact Science Wave D investigation/evidence choice activities.");
