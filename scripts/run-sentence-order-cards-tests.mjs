import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {isSentenceOrderCardsActivity,sentenceOrderCardsConfig,sentenceOrderTokens}=require(path.resolve(".learning-test-dist/src/lib/learning/sentenceOrderCardsConfig.js"));

const expected=new Set([
  "bahasa-urut-ibu-memasak",
  "bahasa-urut-adi-berlari",
  "bahasa-urut-kucing-tidur",
  "bahasa-urut-siti-membaca",
  "bahasa-urut-burung-terbang"
]);

const scoped=ACTIVITIES.filter(activity=>isSentenceOrderCardsActivity(activity));
assert.equal(scoped.length,5,"sentence-order-cards family must remain exactly five assessed Bahasa choice activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Bahasa Wave C sentence-order activities use Sentence Order Cards");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-kalimat-pemahaman",`${activity.id} remains in Bahasa sentence/comprehension stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"sentence_order_cards",`${activity.id} is classified as Sentence Order Cards`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.kalimat.order"),`${activity.id} keeps canonical sentence-order skill`);
  const config=sentenceOrderCardsConfig(activity);
  assert(config,`${activity.id} has Sentence Order Cards config`);
  assert.deepEqual(new Set(Object.keys(config.choiceTokens)),new Set(activity.choices??[]),`${activity.id} config maps exactly canonical choices`);
  for(const choice of activity.choices??[]){
    assert.deepEqual(config.choiceTokens[choice],sentenceOrderTokens(choice),`${activity.id} token cards derive only from canonical choice text`);
    assert(config.choiceTokens[choice].length>=3&&config.choiceTokens[choice].length<=4,`${activity.id} keeps compact sentence-card length`);
  }
}

for(const id of [
  "bahasa-makna-rina-apel",
  "bahasa-gabung-baju",
  "letters-order-after-g",
  "logic-order-first-after-start",
  "math-order-next-1-2"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isSentenceOrderCardsActivity(activity),false,`${id} must stay outside Sentence Order Cards`);
  assert.notEqual(gameplayPattern(activity),"sentence_order_cards",`${id} must not classify as Sentence Order Cards`);
}

console.log("Sentence Order Cards regression passed for exact five-activity Bahasa Wave C sentence-order family.");
