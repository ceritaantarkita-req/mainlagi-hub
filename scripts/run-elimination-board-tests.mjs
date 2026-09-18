import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {CONTENT_PACKS}=require(path.resolve(".learning-test-dist/src/lib/learning/contentManifest.js"));
const {LOGIC_BATCH12_WAVE_C}=require(path.resolve(".learning-test-dist/src/lib/learning/logicBatch12WaveC.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {eliminationBoardConfig,isEliminationBoardActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/eliminationBoardConfig.js"));

const expected=new Map([
  ["logic-infer-not-red",{prompt:"Pilih yang bukan merah.",choices:["biru 🔵","merah bulat 🔴","merah kotak 🟥"],correct:"biru 🔵",mode:"negative_exclusion"}],
  ["logic-infer-only-triangle",{prompt:"Hanya satu pilihan berbentuk segitiga. Mana itu?",choices:["▲","●","■"],correct:"▲",mode:"unique_target"}],
  ["logic-infer-not-largest",{prompt:"Yang terbesar sudah disisihkan. Mana yang paling kecil?",choices:["● kecil","◉ sedang","⬤ besar"],correct:"● kecil",mode:"size_elimination"}],
  ["logic-infer-common-feature",{prompt:"Contoh: 🔴 dan 🔵. Ciri apa yang sama?",choices:["keduanya bulat","keduanya merah","keduanya kotak"],correct:"keduanya bulat",mode:"common_feature"}],
  ["logic-infer-missing-member",{prompt:"Set arah harus punya ↑ → ↓ ←. Yang terlihat ↑ → ↓. Mana yang belum ada?",choices:["←","↑","→"],correct:"←",mode:"missing_member"}]
]);

const scoped=ACTIVITIES.filter(activity=>isEliminationBoardActivity(activity));
assert.equal(scoped.length,5,"Pattern 45 family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()));

for(const activity of scoped){
  const exp=expected.get(activity.id);
  assert(exp,`unexpected Pattern 45 activity ${activity.id}`);
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-conditional-analogy-inference");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,exp.prompt);
  assert.deepEqual(activity.choices,exp.choices);
  assert.equal(activity.correctChoice,exp.correct);
  assert.equal(eliminationBoardConfig(activity)?.mode,exp.mode);
  assert.equal(canonicalGameplayPattern(activity),"elimination_board");
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`missing learning spec for ${activity.id}`);
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:"logic.inference.elimination.basic",weight:1}]);
}

const waveSeeds=LOGIC_BATCH12_WAVE_C.activities.filter(seed=>expected.has(seed.id));
assert.equal(waveSeeds.length,5);
for(const seed of waveSeeds){
  assert.equal(seed.kind,"choice");
  assert.equal(seed.packId,"logic.pack.elimination-inference");
  assert.equal(seed.lessonId,"logic-elimination-inference");
  assert.equal(seed.skillId,"logic.inference.elimination.basic");
}
const pack=CONTENT_PACKS.find(item=>item.id==="logic.pack.elimination-inference");
assert(pack,"missing Pattern 45 pack");
assert.equal(pack.stageId,"logic-conditional-analogy-inference");
assert.deepEqual(new Set(pack.activities.map(item=>item.activityId)),new Set(expected.keys()));
for(const item of pack.activities){
  assert.equal(item.mechanicId,"tap_choice");
  assert.equal(item.assessment,"assessed");
  assert.equal(item.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(item.skills,[{skillId:"logic.inference.elimination.basic",weight:1}]);
}

const exclusions=[
  ["logic-classify-red-round","set_reasoning"],
  ["logic-odd-category-animal-vehicle","odd_one_out"],
  ["logic-set-both-red-round","set_reasoning"],
  ["logic-order-first-after-start","relative_order_track"],
  ["logic-if-red-then-circle","single_rule_apply"]
];
for(const [id,pattern] of exclusions){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`missing exclusion ${id}`);
  assert.equal(isEliminationBoardActivity(activity),false,`${id} must stay outside Pattern 45`);
  assert.equal(canonicalGameplayPattern(activity),pattern,`${id} pattern must remain unchanged`);
}

const base=ACTIVITIES.find(item=>item.id==="logic-infer-not-red");
assert(base);
assert.equal(eliminationBoardConfig({...base,prompt:"Prompt drift"}),null);
assert.equal(eliminationBoardConfig({...base,choices:[...(base.choices??[])].reverse()}),null);
assert.equal(eliminationBoardConfig({...base,correctChoice:"merah bulat 🔴"}),null);
assert.equal(eliminationBoardConfig({...base,stageId:"logic-mixed-reasoning-challenge"}),null);
assert.equal(eliminationBoardConfig({...base,subjectId:"math"}),null);
assert.equal(eliminationBoardConfig({...base,runtime:"matching"}),null);

console.log("Pattern 45 elimination-board tests passed exact five-ID scope, canonical ownership/evidence, exclusions and fail-closed drift checks.");
