import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {choiceGameplayPresentation,matchingPresentation,gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {featureFunctionLinkConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/featureFunctionLinkConfig.js"));

const expected=new Set([
  "science-feature-duck-webbed-feet",
  "science-feature-fish-gills",
  "science-feature-bird-beak-seeds",
  "science-feature-cactus-water"
]);

const family=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="feature_function_link");
assert.equal(family.length,expected.size,"feature-function family size must remain intentional");
assert.deepEqual(new Set(family.map(activity=>activity.id)),expected,"only the four reviewed living feature/function choices use Feature Function Link");

for(const activity of family){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-evidence-review-challenge");
  assert.equal(activity.skillId,"science.living.features_function.basic");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"feature-function choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"feature-function link preserves canonical correctChoice");
  assert.equal(gameplayPattern(activity),"feature_function_link");
  const config=featureFunctionLinkConfig(activity);
  assert(config,`${activity.id} must have explicit Feature Function Link config`);
  assert(config.subjectIcon&&config.subjectLabel&&config.featureIcon&&config.featureLabel,`${activity.id} keeps visible organism and feature context`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} visual mapping covers exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical function keeps an explicit visual`);
}

const excluded=ACTIVITIES.find(activity=>activity.id==="science-match-feature-function-d");
assert(excluded,"science-match-feature-function-d remains in catalog");
assert.equal(excluded.runtime,"matching");
assert.equal(matchingPresentation(excluded),"grid_pairs","feature/function matching remains canonical visible matching");
assert.equal(gameplayPattern(excluded),"visible_matching");

console.log(`Feature-function link regression passed for ${family.length} exact Science Wave D activities.`);
