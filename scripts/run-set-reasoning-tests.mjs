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
const {setReasoningConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/setReasoningConfig.js"));

const expected=new Set([
  "logic-set-both-red-round",
  "logic-set-animal-not-bird",
  "logic-set-shape-not-square",
  "logic-set-only-blue-triangle",
  "logic-set-outside-round-red"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="set_reasoning");
assert.equal(scoped.length,5,"set-reasoning family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only the reviewed Logic Wave D set-reasoning activities use Set Reasoning");

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
  assert((spec.skills??[]).some(link=>link.skillId==="logic.set.relation.basic"),`${activity.id} keeps canonical set-relation skill`);
  const config=setReasoningConfig(activity);
  assert(config,`${activity.id} has explicit Set Reasoning config`);
  assert.equal(config.rules.length,2,`${activity.id} exposes exactly two set rules`);
  assert(config.rules.every(rule=>Boolean(rule.label)&&["in","out"].includes(rule.membership)),`${activity.id} set rules remain explicit`);
  assert(config.operationLabel,`${activity.id} keeps an explicit set operation`);
  assert(config.targetLabel,`${activity.id} keeps an explicit target rule`);
  assert.deepEqual(new Set(Object.keys(config.choiceLabels)),new Set(activity.choices??[]),`${activity.id} config covers exactly the canonical choices`);
}

for(const id of [
  "logic-compose-red-circle-to-star",
  "logic-transitive-height-abc",
  "logic-spatial-halfturn-up",
  "logic-infer-not-red",
  "logic-classify-red-round"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"set_reasoning",`${id} must stay outside Set Reasoning`);
}

console.log("Set Reasoning regression passed for exact five-activity Logic Wave D family.");
