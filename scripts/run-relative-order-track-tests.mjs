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
const {relativeOrderTrackConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/relativeOrderTrackConfig.js"));

const expected=new Set([
  "logic-order-first-after-start",
  "logic-order-before-d",
  "logic-order-between-blue-green",
  "logic-order-third-symbol",
  "logic-order-two-steps-after"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="relative_order_track");
assert.equal(scoped.length,5,"relative-order-track family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Logic Wave C relative-ordering activities use Relative Order Track");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"logic",`${activity.id} remains Logic`);
  assert.equal(activity.stageId,"logic-conditional-analogy-inference",`${activity.id} remains in Logic Wave C stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="logic.order.relative.basic"),`${activity.id} keeps canonical relative-order skill`);
  const config=relativeOrderTrackConfig(activity);
  assert(config,`${activity.id} has explicit Relative Order Track config`);
  assert(config.items.length>=4,`${activity.id} track exposes at least four canonical positions`);
  assert(config.targetIndex>=0&&config.targetIndex<config.items.length,`${activity.id} target index stays inside track`);
  assert.equal(config.items[config.targetIndex],activity.correctChoice,`${activity.id} masked track slot corresponds exactly to canonical correctChoice`);
  assert.equal(config.items.filter(item=>item===activity.correctChoice).length,1,`${activity.id} canonical answer appears once on the source track`);
}

for(const id of [
  "logic-if-red-then-circle",
  "logic-classify-red-round",
  "logic-infer-not-red",
  "logic-analogy-young-adult",
  "math-order-next-1-2",
  "letters-order-after-g"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"relative_order_track",`${id} must stay outside Relative Order Track`);
}

console.log("Relative Order Track regression passed for exact five-activity Logic Wave C family.");
