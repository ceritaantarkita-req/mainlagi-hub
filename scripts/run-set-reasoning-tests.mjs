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
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {setReasoningConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/setReasoningConfig.js"));

const expected=new Map([
  ["logic-set-both-red-round",{stage:"logic-mixed-reasoning-challenge",skill:"logic.set.relation.basic",prompt:"Kelompok A = benda merah. Kelompok B = benda bulat. Mana yang masuk A dan B?",choices:["lingkaran merah","kotak merah","lingkaran biru"],correct:"lingkaran merah"}],
  ["logic-set-animal-not-bird",{stage:"logic-mixed-reasoning-challenge",skill:"logic.set.relation.basic",prompt:"Pilih hewan yang bukan burung.",choices:["kucing","elang","merpati"],correct:"kucing"}],
  ["logic-set-shape-not-square",{stage:"logic-mixed-reasoning-challenge",skill:"logic.set.relation.basic",prompt:"Semua pilihan adalah bentuk. Mana yang bukan kotak?",choices:["segitiga ▲","kotak biru 🟦","kotak merah 🟥"],correct:"segitiga ▲"}],
  ["logic-set-only-blue-triangle",{stage:"logic-mixed-reasoning-challenge",skill:"logic.set.relation.basic",prompt:"Mana yang sekaligus biru dan segitiga?",choices:["segitiga biru","lingkaran biru","segitiga merah"],correct:"segitiga biru"}],
  ["logic-set-outside-round-red",{stage:"logic-mixed-reasoning-challenge",skill:"logic.set.relation.basic",prompt:"Kelompok yang dicari adalah merah atau bulat. Mana yang tidak termasuk keduanya?",choices:["kotak biru","lingkaran biru","kotak merah"],correct:"kotak biru"}],
  ["logic-classify-red-round",{stage:"logic-conditional-analogy-inference",skill:"logic.classification.multi_attribute",prompt:"Mana yang sekaligus merah dan bulat?",choices:["🔴","🟥","🔵"],correct:"🔴"}],
  ["logic-classify-blue-not-round",{stage:"logic-conditional-analogy-inference",skill:"logic.classification.multi_attribute",prompt:"Mana yang biru tetapi bukan bulat?",choices:["🟦","🔵","🟥"],correct:"🟦"}],
  ["logic-classify-two-red-items",{stage:"logic-conditional-analogy-inference",skill:"logic.classification.multi_attribute",prompt:"Mana kelompok yang punya tepat dua benda merah?",choices:["🔴🔴","🔴🔴🔴","🔵🔵"],correct:"🔴🔴"}],
  ["logic-classify-arrow-not-left",{stage:"logic-conditional-analogy-inference",skill:"logic.classification.multi_attribute",prompt:"Mana panah yang tidak mengarah ke kiri?",choices:["→","←","↓"],correct:"→"}],
  ["logic-classify-same-shape-different-color",{stage:"logic-conditional-analogy-inference",skill:"logic.classification.multi_attribute",prompt:"Pasangan mana yang bentuknya sama tetapi warnanya berbeda?",choices:["🔴 🔵","🔴 🟥","🟥 🔵"],correct:"🔴 🔵"}]
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="set_reasoning");
assert.equal(scoped.length,10,"set-reasoning family must remain exactly ten audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only the ten audited Logic activities use Set Reasoning");

for(const activity of scoped){
  const exp=expected.get(activity.id);
  assert(exp,"unexpected Set Reasoning activity "+activity.id);
  assert.equal(activity.runtime,"tap_choice",activity.id+" keeps canonical tap_choice runtime");
  assert.equal(activity.subjectId,"logic",activity.id+" remains Logic");
  assert.equal(activity.stageId,exp.stage,activity.id+" keeps exact audited stage");
  assert.equal(activity.prompt,exp.prompt,activity.id+" keeps exact canonical prompt");
  assert.deepEqual(activity.choices,exp.choices,activity.id+" keeps exact canonical choice order");
  assert.equal(activity.correctChoice,exp.correct,activity.id+" keeps exact canonical correctChoice");
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,activity.id+" keeps learning spec");
  assert.equal(spec.assessment,"assessed",activity.id+" remains assessed");
  assert.deepEqual(spec.skills,[{skillId:exp.skill,weight:1}],activity.id+" keeps exact audited skill ownership");
  const config=setReasoningConfig(activity);
  assert(config,activity.id+" has explicit Set Reasoning config");
  assert.equal(config.expectedStageId,exp.stage);
  assert.equal(config.expectedPrompt,exp.prompt);
  assert.deepEqual(config.expectedChoices,exp.choices);
  assert.equal(config.expectedCorrectChoice,exp.correct);
  assert.equal(config.rules.length,2,activity.id+" exposes exactly two rules");
  assert(config.rules.every(rule=>Boolean(rule.label)&&["in","out"].includes(rule.membership)),activity.id+" rules remain explicit");
  assert(config.operationLabel,activity.id+" keeps an explicit operation label");
  assert(config.targetLabel,activity.id+" keeps an explicit target rule");
  assert.deepEqual(Object.keys(config.choiceLabels),exp.choices,activity.id+" config covers canonical choices in canonical order");
  assert.equal(canonicalGameplayPattern(activity),"set_reasoning",activity.id+" classifies as existing set_reasoning");
}

const reusedIds=[
  "logic-classify-red-round",
  "logic-classify-blue-not-round",
  "logic-classify-two-red-items",
  "logic-classify-arrow-not-left",
  "logic-classify-same-shape-different-color"
];
for(const id of reusedIds){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,id+" remains in catalog");
  assert.equal(activity.stageId,"logic-conditional-analogy-inference");
  assert.equal(canonicalGameplayPattern(activity),"set_reasoning");
}

for(const id of [
  "logic-compose-red-circle-to-star",
  "logic-transitive-height-abc",
  "logic-spatial-halfturn-up",
  "logic-infer-not-red",
  "logic-order-first-after-start",
  "logic-odd-category-animal-vehicle"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,id+" remains in catalog");
  assert.notEqual(choiceGameplayPresentation(activity),"set_reasoning",id+" must stay outside Set Reasoning");
}

const driftBase=ACTIVITIES.find(item=>item.id==="logic-classify-red-round");
assert(driftBase);
assert.equal(setReasoningConfig({...driftBase,prompt:"Prompt drift"}),null);
assert.equal(setReasoningConfig({...driftBase,choices:[...(driftBase.choices??[])].reverse()}),null);
assert.equal(setReasoningConfig({...driftBase,correctChoice:"🟥"}),null);
assert.equal(setReasoningConfig({...driftBase,stageId:"logic-mixed-reasoning-challenge"}),null);
assert.equal(setReasoningConfig({...driftBase,subjectId:"math"}),null);
assert.equal(setReasoningConfig({...driftBase,runtime:"matching"}),null);

console.log("Set Reasoning regression passed exact ten-ID old+reuse scope, fail-closed payload validation, skill ownership and nearby-family exclusions.");
