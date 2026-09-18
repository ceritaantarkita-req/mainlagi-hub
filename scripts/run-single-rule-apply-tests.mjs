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
const {singleRuleApplyConfig,isSingleRuleApplyActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/singleRuleApplyConfig.js"));

const expected=new Map([
  ["logic-if-red-then-circle",{prompt:"Aturannya: jika merah, pilih lingkaran. Mana yang benar?",choices:["🔴 lingkaran","🔴 segitiga","🔵 lingkaran"],correct:"🔴 lingkaran",mode:"constraint_match"}],
  ["logic-if-two-then-star",{prompt:"Aturannya: jika jumlahnya 2, pilih bintang. Mana yang cocok?",choices:["★★","●●","★★★"],correct:"★★",mode:"constraint_match"}],
  ["logic-rule-small-goes-left",{prompt:"Aturannya: benda kecil harus di kiri benda besar. Mana susunan yang benar?",choices:["●  ⬤","⬤  ●","⬤  ⬤"],correct:"●  ⬤",mode:"constraint_match"}],
  ["logic-rule-up-means-one",{prompt:"Aturannya: ↑ berarti satu titik dan → berarti dua titik. Apa pasangan untuk → ?",choices:["●●","●","●●●"],correct:"●●",mode:"symbol_mapping"}],
  ["logic-rule-switch-shape",{prompt:"Aturannya: lingkaran berubah jadi segitiga. Jika mulai dari ●, hasilnya?",choices:["▲","■","●"],correct:"▲",mode:"single_transform"}]
]);

const scoped=ACTIVITIES.filter(activity=>isSingleRuleApplyActivity(activity));
assert.equal(scoped.length,5,"single-rule-apply family must remain exactly five audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Logic Wave C conditional-rule choices use Pattern 43");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["single_rule_apply"]));

const authoring=new Map(LOGIC_BATCH12_WAVE_C.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
assert.equal(authoring.size,5,"all Pattern 43 activities remain owned by Logic Wave C authoring");

const manifestPack=CONTENT_PACKS.find(pack=>pack.id==="logic.pack.conditional-rules");
assert(manifestPack,"canonical Pattern 43 content pack remains in manifest");
assert.equal(manifestPack.stageId,"logic-conditional-analogy-inference");

const seenModes=new Set();
let visualCount=0;
for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,"activity remains in frozen Pattern 43 snapshot");
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-conditional-analogy-inference");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,snapshot.prompt);
  assert.deepEqual(activity.choices,snapshot.choices);
  assert.equal(activity.correctChoice,snapshot.correct);
  assert.equal(canonicalGameplayPattern(activity),"single_rule_apply");

  const config=singleRuleApplyConfig(activity);
  assert(config,"activity has fail-closed explicit single-rule config");
  assert.equal(config.mode,snapshot.mode);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);
  assert.deepEqual(config.choiceVisuals.map(visual=>visual.label),snapshot.choices);
  assert(config.choiceVisuals.every(visual=>visual.icon&&visual.accessibleLabel));
  assert(config.ruleLabel&&config.inputIcon&&config.inputLabel&&config.targetLabel&&config.cue&&config.successText);
  seenModes.add(config.mode);
  visualCount+=config.choiceVisuals.length;

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,"activity keeps learning spec");
  assert.equal(spec.subjectId,"logic");
  assert.equal(spec.stageId,"logic-conditional-analogy-inference");
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:"logic.conditional.rule.basic",weight:1}]);

  const seed=authoring.get(activity.id);
  assert(seed,"activity keeps Logic Wave C authoring seed");
  assert.equal(seed.packId,"logic.pack.conditional-rules");
  assert.equal(seed.lessonId,"logic-conditional-rules");
  assert.equal(seed.skillId,"logic.conditional.rule.basic");
  assert.deepEqual(seed.choices,snapshot.choices);
  assert.equal(seed.correctChoice,snapshot.correct);

  const manifestActivity=manifestPack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,"activity remains in canonical conditional-rules pack");
  assert.equal(manifestActivity.lessonId,"logic-conditional-rules");
  assert.equal(manifestActivity.mechanicId,"tap_choice");
  assert.equal(manifestActivity.assessment,"assessed");
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(manifestActivity.skills,[{skillId:"logic.conditional.rule.basic",weight:1}]);
}

assert.equal(visualCount,15);
assert.deepEqual(seenModes,new Set(["constraint_match","symbol_mapping","single_transform"]));

for(const id of ["logic-compose-red-circle-to-star","logic-set-both-red-round","logic-infer-not-red","logic-order-first-after-start","logic-classify-red-round"]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,"excluded sentinel remains in catalog");
  assert.equal(isSingleRuleApplyActivity(activity),false);
  assert.notEqual(canonicalGameplayPattern(activity),"single_rule_apply");
}
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="logic-compose-red-circle-to-star")),"rule_pipeline");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="logic-set-both-red-round")),"set_reasoning");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="logic-order-first-after-start")),"relative_order_track");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="logic-classify-red-round")),"set_reasoning");

const first=scoped[0];
assert(first,"Pattern 43 representative exists");
assert.equal(singleRuleApplyConfig({...first,correctChoice:first.choices?.[1]}),null);
assert.equal(singleRuleApplyConfig({...first,choices:[...(first.choices??[])].reverse()}),null);
assert.equal(singleRuleApplyConfig({...first,prompt:String(first.prompt)+" "}),null);
assert.equal(singleRuleApplyConfig({...first,stageId:"logic-mixed-reasoning-challenge"}),null);
assert.equal(singleRuleApplyConfig({...first,subjectId:"math"}),null);
assert.equal(singleRuleApplyConfig({...first,runtime:"listen_and_choose"}),null);

console.log("Pattern 43 single-rule apply regression passed: exact five Logic Wave C activities preserve canonical content, authoring, manifest, skill and evidence ownership.");
