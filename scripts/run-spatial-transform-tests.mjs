import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {spatialTransformConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/spatialTransformConfig.js"));

const expected=new Set([
  "logic-spatial-halfturn-up",
  "logic-spatial-quarterturn-left",
  "logic-spatial-quarterturn-right-down",
  "logic-spatial-two-right-turns",
  "logic-spatial-mirror-left-right"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="spatial_transform");
assert.equal(scoped.length,5,"spatial-transform family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Logic Wave D spatial-transform activities use Spatial Transform");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"logic",`${activity.id} remains Logic`);
  assert.equal(activity.stageId,"logic-mixed-reasoning-challenge",`${activity.id} remains in Logic Wave D stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="logic.spatial.transform.basic"),`${activity.id} keeps canonical spatial-transform skill`);
  const config=spatialTransformConfig(activity);
  assert(config,`${activity.id} has explicit Spatial Transform config`);
  assert(["up","right","down","left"].includes(config.startDirection),`${activity.id} keeps a valid start direction`);
  assert(["rotation","mirror"].includes(config.transformKind),`${activity.id} keeps an explicit transform kind`);
  if(config.transformKind==="rotation"){
    assert(["left","right"].includes(config.turnDirection),`${activity.id} rotation keeps a turn direction`);
    assert([1,2].includes(config.quarterTurns),`${activity.id} rotation keeps one or two quarter turns`);
  }else{
    assert.equal(config.mirrorAxis,"vertical",`${activity.id} mirror stays left-right across a vertical axis`);
  }
  assert.deepEqual(new Set(Object.keys(config.choiceArrows)),new Set(activity.choices??[]),`${activity.id} config covers exactly canonical choices`);
}

for(const id of [
  "logic-compose-triangle-turn-right",
  "logic-set-both-red-round",
  "logic-transitive-height-abc",
  "logic-order-first-after-start",
  "logic-infer-not-red",
  "logic-spatial-star-left-circle"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"spatial_transform",`${id} must stay outside Spatial Transform`);
}

console.log("Spatial Transform regression passed for exact five-activity Logic Wave D family.");
