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
const {transitiveChainConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/transitiveChainConfig.js"));

const expected=new Set([
  "logic-transitive-height-abc",
  "logic-transitive-shortest-xyz",
  "logic-transitive-most-dots",
  "logic-transitive-lightest",
  "logic-transitive-middle-order"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="transitive_chain");
assert.equal(scoped.length,5,"transitive-chain family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only the reviewed Logic Wave D transitive-comparison activities use Transitive Chain");

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
  assert((spec.skills??[]).some(link=>link.skillId==="logic.comparison.transitive.basic"),`${activity.id} keeps canonical transitive-comparison skill`);
  const config=transitiveChainConfig(activity);
  assert(config,`${activity.id} has explicit Transitive Chain config`);
  assert.equal(config.nodes.length,3,`${activity.id} keeps a three-node relation chain`);
  assert(config.nodes.every(Boolean),`${activity.id} chain nodes remain non-empty`);
  assert(config.relationLabel,`${activity.id} keeps an explicit relation label`);
  assert(config.questionLabel,`${activity.id} keeps an explicit conclusion question`);
  assert.deepEqual(new Set(Object.keys(config.choiceLabels)),new Set(activity.choices??[]),`${activity.id} config covers exactly the canonical choices`);
}

for(const id of [
  "logic-compose-red-circle-to-star",
  "logic-set-both-red-round",
  "logic-spatial-halfturn-up",
  "logic-infer-not-red",
  "logic-order-first-after-start"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"transitive_chain",`${id} must stay outside Transitive Chain`);
}

console.log("Transitive Chain regression passed for exact five-activity Logic Wave D family.");
