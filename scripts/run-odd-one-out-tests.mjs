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
const {oddOneOutConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/oddOneOutConfig.js"));

const expectedIds=new Set([
  "logic-odd-category-animal-vehicle",
  "logic-odd-shape-angular",
  "logic-odd-direction-right",
  "logic-odd-count-three",
  "logic-odd-pattern-symmetry"
]);

const scoped=ACTIVITIES.filter(activity=>gameplayPattern(activity)==="odd_one_out");
assert.equal(scoped.length,5,"odd-one-out family size must remain exactly five");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expectedIds,"only reviewed Logic Wave A odd-one-out activities use odd_one_out");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"logic",`${activity.id} remains Logic`);
  assert.equal(activity.stageId,"logic-classification-rules-basics",`${activity.id} stays in Logic Wave A`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} preserves canonical correctChoice`);
  assert.equal(choiceGameplayPresentation(activity),"odd_one_out",`${activity.id} uses odd_one_out presentation`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps canonical learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills.map(link=>link.skillId),["logic.discrimination.odd_one_out.basic"],`${activity.id} keeps exact odd-one-out skill`);

  const config=oddOneOutConfig(activity);
  assert(config,`${activity.id} has explicit odd-one-out config`);
  assert(config.commonTrait&&config.promptHint&&config.successText,`${activity.id} keeps a meaningful comparison clue`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} visual config maps exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical outsider has a visual`);
}

for(const id of [
  "logic-classify-animal",
  "logic-compare-more-dots",
  "logic-rule-alternate-shapes",
  "logic-compose-red-circle-to-star",
  "logic-set-both-red-round"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"odd_one_out",`${id} stays outside odd-one-out scope`);
  assert.notEqual(gameplayPattern(activity),"odd_one_out",`${id} keeps its canonical non-odd-one-out pattern`);
}

console.log("Odd-one-out regression passed for 5 exact Logic Wave A discrimination activities.");
