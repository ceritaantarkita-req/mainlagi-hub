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
const {makeTotalConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/makeTotalConfig.js"));

const expected=new Set([
  "math-add-1-1",
  "math-add-2-1",
  "math-add-2-2",
  "math-add-3-2",
  "math-add-4-3"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="make_total");
assert.equal(scoped.length,5,"make-total family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Math Wave C addition activities use Make Total");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,"math-operasi-awal",`${activity.id} remains in Math operasi awal stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"make_total",`${activity.id} is classified as Make Total`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="math.operation.addition.within_10"),`${activity.id} keeps canonical addition skill`);
  const config=makeTotalConfig(activity);
  assert(config,`${activity.id} has explicit Make Total config`);
  assert.equal(config.leftCount+config.rightCount,Number(activity.correctChoice),`${activity.id} visual groups sum exactly to canonical correctChoice`);
  assert(config.leftCount>=1&&config.rightCount>=1,`${activity.id} keeps two non-empty groups`);
  assert(config.leftCount+config.rightCount<=10,`${activity.id} stays within canonical within-10 skill`);
}

for(const id of [
  "math-sub-3-1",
  "math-group-6-by-2",
  "math-missing-1-3",
  "math-length-longer-lines",
  "math-count-2",
  "bahasa-gabung-baju"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"make_total",`${id} must stay outside Make Total`);
}

console.log("Make Total regression passed for exact five-activity Math Wave C addition family.");
