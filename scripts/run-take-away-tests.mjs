import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {takeAwayConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/takeAwayConfig.js"));

const expected=new Set([
  "math-sub-3-1",
  "math-sub-4-2",
  "math-sub-5-1",
  "math-sub-6-2",
  "math-sub-7-3"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="take_away");
assert.equal(scoped.length,5,"take-away family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Math Wave C subtraction activities use Take Away");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,"math-operasi-awal",`${activity.id} remains in Math operasi awal stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"take_away",`${activity.id} is classified as Take Away`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="math.operation.subtraction.within_10"),`${activity.id} keeps canonical subtraction skill`);
  const config=takeAwayConfig(activity);
  assert(config,`${activity.id} has explicit Take Away config`);
  assert(config.startCount>=2&&config.startCount<=10,`${activity.id} starts with a valid within-10 group`);
  assert(config.removeCount>=1&&config.removeCount<config.startCount,`${activity.id} removes a positive proper subset`);
  assert.equal(config.startCount-config.removeCount,Number(activity.correctChoice),`${activity.id} concrete remainder equals canonical correctChoice`);
}

for(const id of [
  "math-add-1-1",
  "math-group-6-by-2",
  "math-missing-1-3",
  "math-length-longer-lines",
  "math-count-2",
  "bahasa-gambar-apel"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"take_away",`${id} must stay outside Take Away`);
}

console.log("Take Away regression passed for exact five-activity Math Wave C subtraction family.");
