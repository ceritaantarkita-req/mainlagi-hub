import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern,isEqualGroupsActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {equalGroupsConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/equalGroupsConfig.js"));

const expected=new Set([
  "math-group-6-by-2",
  "math-group-8-by-2",
  "math-group-9-by-3"
]);

const scoped=ACTIVITIES.filter(activity=>isEqualGroupsActivity(activity));
assert.equal(scoped.length,3,"equal-groups family must remain exactly three assessed choice activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Math Wave C grouping choices use Equal Groups");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,"math-operasi-awal",`${activity.id} remains in Math operasi awal stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"equal_groups",`${activity.id} is classified as Equal Groups`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="math.grouping.equal_groups"),`${activity.id} keeps canonical equal-groups skill`);
  const config=equalGroupsConfig(activity);
  assert(config,`${activity.id} has explicit Equal Groups config`);
  assert(config.totalCount>=2&&config.totalCount<=10,`${activity.id} keeps a valid within-10 total`);
  assert(config.groupSize>=1&&config.groupSize<config.totalCount,`${activity.id} keeps a positive proper group size`);
  assert.equal(config.totalCount%config.groupSize,0,`${activity.id} total divides evenly into equal groups`);
  assert.equal(config.totalCount/config.groupSize,Number(activity.correctChoice),`${activity.id} group count equals canonical correctChoice`);
}

for(const id of [
  "math-group-match-2s",
  "math-group-match-3s",
  "math-missing-1-3",
  "math-add-1-1",
  "math-sub-3-1",
  "math-length-longer-lines",
  "science-living-dog"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isEqualGroupsActivity(activity),false,`${id} must stay outside Equal Groups`);
  assert.notEqual(gameplayPattern(activity),"equal_groups",`${id} must not classify as Equal Groups`);
}

console.log("Equal Groups regression passed for exact three-activity Math Wave C grouping choice family.");
