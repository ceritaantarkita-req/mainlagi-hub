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
const {SCIENCE_BATCH13_WAVE_C}=require(path.resolve(".learning-test-dist/src/lib/learning/scienceBatch13WaveC.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {phenomenonRelationBoardConfig,isPhenomenonRelationBoardActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/phenomenonRelationBoardConfig.js"));

const expected=new Map([
  ["science-earth-sun-day",{prompt:"Saat bagian tempat kita berada menghadap Matahari, biasanya kita mengalami apa?",choices:["siang hari","malam hari","musim hujan selalu"],correct:"siang hari",mode:"sun_day_relation"}],
  ["science-earth-moon-night",{prompt:"Benda langit mana yang sering mudah terlihat pada malam hari?",choices:["bulan","pelangi setiap malam","awan selalu hitam"],correct:"bulan",mode:"night_sky_observation"}],
  ["science-earth-shadow-sun",{prompt:"Apa yang dapat terbentuk saat benda menghalangi cahaya?",choices:["bayangan","suara","rasa manis"],correct:"bayangan",mode:"light_shadow_relation"}],
  ["science-earth-cloud-rain",{prompt:"Jika awan makin gelap dan tebal, perubahan cuaca apa yang mungkin terjadi?",choices:["hujan turun","bintang muncul siang hari","tanah langsung membeku"],correct:"hujan turun",mode:"cloud_rain_prediction"}]
]);

const scoped=ACTIVITIES.filter(activity=>isPhenomenonRelationBoardActivity(activity));
assert.equal(scoped.length,4,"Pattern 46 family must remain exactly four activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()));

for(const activity of scoped){
  const exp=expected.get(activity.id);
  assert(exp,`unexpected Pattern 46 activity ${activity.id}`);
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,exp.prompt);
  assert.deepEqual(activity.choices,exp.choices);
  assert.equal(activity.correctChoice,exp.correct);
  assert.equal(phenomenonRelationBoardConfig(activity)?.mode,exp.mode);
  assert.equal(canonicalGameplayPattern(activity),"phenomenon_relation_board");

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`missing learning spec for ${activity.id}`);
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:"science.earth.sky_patterns.basic",weight:1}]);
}

const waveSeeds=SCIENCE_BATCH13_WAVE_C.activities.filter(seed=>expected.has(seed.id));
assert.equal(waveSeeds.length,4);
for(const seed of waveSeeds){
  assert.equal(seed.kind,"choice");
  assert.equal(seed.packId,"science.pack.earth-sky-patterns");
  assert.equal(seed.lessonId,"science-earth-sky-patterns");
  assert.equal(seed.skillId,"science.earth.sky_patterns.basic");
}
const pack=CONTENT_PACKS.find(item=>item.id==="science.pack.earth-sky-patterns");
assert(pack,"missing Pattern 46 pack");
assert.equal(pack.stageId,"science-earth-body-environment");
assert.deepEqual(new Set(pack.activities.map(item=>item.activityId)),new Set([...expected.keys(),"science-match-sky-observation-c"]));
for(const item of pack.activities.filter(item=>expected.has(item.activityId))){
  assert.equal(item.mechanicId,"tap_choice");
  assert.equal(item.assessment,"assessed");
  assert.equal(item.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(item.skills,[{skillId:"science.earth.sky_patterns.basic",weight:1}]);
}
const matching=pack.activities.find(item=>item.activityId==="science-match-sky-observation-c");
assert(matching);
assert.equal(matching.mechanicId,"matching");
assert.equal(matching.evidenceContractId,"matching_accuracy_v1");

const exclusions=[
  ["science-match-sky-observation-c","visible_matching"],
  ["science-water-ice-melts","cause_effect"],
  ["science-investigate-plant-light","investigation_board"],
  ["science-cycle-frog","growth_stage_transition"],
  ["science-measure-longer-pencil","compare_properties"]
];
for(const [id,pattern] of exclusions){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`missing exclusion ${id}`);
  assert.equal(isPhenomenonRelationBoardActivity(activity),false,`${id} must stay outside Pattern 46`);
  assert.equal(canonicalGameplayPattern(activity),pattern,`${id} pattern must remain unchanged`);
}

const base=ACTIVITIES.find(item=>item.id==="science-earth-sun-day");
assert(base);
assert.equal(phenomenonRelationBoardConfig({...base,prompt:"Prompt drift"}),null);
assert.equal(phenomenonRelationBoardConfig({...base,choices:[...(base.choices??[])].reverse()}),null);
assert.equal(phenomenonRelationBoardConfig({...base,correctChoice:"malam hari"}),null);
assert.equal(phenomenonRelationBoardConfig({...base,stageId:"science-evidence-review-challenge"}),null);
assert.equal(phenomenonRelationBoardConfig({...base,subjectId:"logic"}),null);
assert.equal(phenomenonRelationBoardConfig({...base,runtime:"matching"}),null);

console.log("Pattern 46 phenomenon-relation-board tests passed exact four-ID scope, canonical ownership/evidence, matching exclusion and fail-closed drift checks.");
