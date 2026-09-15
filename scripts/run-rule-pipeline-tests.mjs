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
const {rulePipelineConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/rulePipelineConfig.js"));

const expectedIds=new Set([
  "logic-compose-red-circle-to-star",
  "logic-compose-small-left-then-up",
  "logic-compose-two-to-blue",
  "logic-compose-triangle-turn-right",
  "logic-compose-swap-then-grow"
]);

const scoped=ACTIVITIES.filter(activity=>gameplayPattern(activity)==="rule_pipeline");
assert.equal(scoped.length,5,"rule-pipeline family size must remain exactly five");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expectedIds,"only reviewed Logic Wave D composed-rule activities use rule_pipeline");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"logic",`${activity.id} remains Logic`);
  assert.equal(activity.stageId,"logic-mixed-reasoning-challenge",`${activity.id} stays in Logic Wave D`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical final choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} final choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} preserves canonical correctChoice`);
  assert.equal(choiceGameplayPresentation(activity),"rule_pipeline",`${activity.id} uses rule_pipeline presentation`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps a canonical learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills.map(link=>link.skillId),["logic.rule.composition.basic"],`${activity.id} keeps exact composed-rule skill`);

  const config=rulePipelineConfig(activity);
  assert(config,`${activity.id} has explicit rule-pipeline config`);
  assert(config.startLabel&&config.ruleOne&&config.intermediateLabel&&config.ruleTwo,`${activity.id} exposes both rule steps and intermediate state`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} config maps exactly canonical final choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical correctChoice keeps a visual`);
}

for(const id of [
  "logic-if-red-then-circle",
  "logic-set-both-red-round",
  "logic-infer-not-red",
  "logic-spatial-halfturn-up",
  "logic-compare-more-dots"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(choiceGameplayPresentation(activity),"default",`${id} stays outside rule-pipeline scope`);
  assert.equal(gameplayPattern(activity),"choice_grid",`${id} remains canonical choice_grid`);
}

console.log("Rule-pipeline regression passed for 5 exact Logic Wave D composed-rule activities.");
