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

const fixtures=new Map([
  ["science-earth-sun-day",{
    prompt:"Saat bagian tempat kita berada menghadap Matahari, biasanya kita mengalami apa?",
    choices:["siang hari","malam hari","musim hujan selalu"],correct:"siang hari",
    domain:"earth_sky",mode:"sun_day_relation",pack:"science.pack.earth-sky-patterns",
    lesson:"science-earth-sky-patterns",skill:"science.earth.sky_patterns.basic"
  }],
  ["science-earth-moon-night",{
    prompt:"Benda langit mana yang sering mudah terlihat pada malam hari?",
    choices:["bulan","pelangi setiap malam","awan selalu hitam"],correct:"bulan",
    domain:"earth_sky",mode:"night_sky_observation",pack:"science.pack.earth-sky-patterns",
    lesson:"science-earth-sky-patterns",skill:"science.earth.sky_patterns.basic"
  }],
  ["science-earth-shadow-sun",{
    prompt:"Apa yang dapat terbentuk saat benda menghalangi cahaya?",
    choices:["bayangan","suara","rasa manis"],correct:"bayangan",
    domain:"earth_sky",mode:"light_shadow_relation",pack:"science.pack.earth-sky-patterns",
    lesson:"science-earth-sky-patterns",skill:"science.earth.sky_patterns.basic"
  }],
  ["science-earth-cloud-rain",{
    prompt:"Jika awan makin gelap dan tebal, perubahan cuaca apa yang mungkin terjadi?",
    choices:["hujan turun","bintang muncul siang hari","tanah langsung membeku"],correct:"hujan turun",
    domain:"earth_sky",mode:"cloud_rain_prediction",pack:"science.pack.earth-sky-patterns",
    lesson:"science-earth-sky-patterns",skill:"science.earth.sky_patterns.basic"
  }],
  ["science-eco-plant-sun-water",{
    prompt:"Tanaman di kebun membutuhkan kombinasi mana untuk tumbuh?",
    choices:["air dan cahaya","plastik dan kaca","mainan dan kertas"],correct:"air dan cahaya",
    domain:"ecosystem_dependency",mode:"plant_resource_dependency",pack:"science.pack.ecosystem-dependencies",
    lesson:"science-ecosystem-dependencies",skill:"science.ecosystem.dependencies.basic"
  }],
  ["science-eco-bee-flower",{
    prompt:"Mengapa lebah sering mendatangi bunga?",
    choices:["mencari nektar","mencari batu","mencari plastik"],correct:"mencari nektar",
    domain:"ecosystem_dependency",mode:"bee_flower_food_relation",pack:"science.pack.ecosystem-dependencies",
    lesson:"science-ecosystem-dependencies",skill:"science.ecosystem.dependencies.basic"
  }],
  ["science-eco-bird-tree",{
    prompt:"Pohon dapat membantu burung dengan menyediakan apa?",
    choices:["tempat bertengger atau bersarang","air laut","roda kendaraan"],correct:"tempat bertengger atau bersarang",
    domain:"ecosystem_dependency",mode:"bird_tree_habitat_relation",pack:"science.pack.ecosystem-dependencies",
    lesson:"science-ecosystem-dependencies",skill:"science.ecosystem.dependencies.basic"
  }],
  ["science-eco-food-chain-change",{
    prompt:"Jika makanan utama suatu hewan sangat berkurang, apa yang mungkin terjadi?",
    choices:["hewan lebih sulit mendapat makanan","hewan tidak perlu makan lagi","semua benda menjadi hidup"],correct:"hewan lebih sulit mendapat makanan",
    domain:"ecosystem_dependency",mode:"food_resource_change_consequence",pack:"science.pack.ecosystem-dependencies",
    lesson:"science-ecosystem-dependencies",skill:"science.ecosystem.dependencies.basic"
  }]
]);

const scoped=ACTIVITIES.filter(activity=>isPhenomenonRelationBoardActivity(activity));
assert.equal(scoped.length,8,"Phenomenon Relation Board family must remain exactly eight audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(fixtures.keys()));

for(const activity of scoped){
  const exp=fixtures.get(activity.id);
  assert(exp,`unexpected phenomenon relation activity ${activity.id}`);
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,exp.prompt);
  assert.deepEqual(activity.choices,exp.choices);
  assert.equal(activity.correctChoice,exp.correct);

  const config=phenomenonRelationBoardConfig(activity);
  assert(config,`missing config for ${activity.id}`);
  assert.equal(config.domainVariant,exp.domain);
  assert.equal(config.mode,exp.mode);
  assert.deepEqual(Object.keys(config.choiceVisuals),exp.choices);
  assert.equal(canonicalGameplayPattern(activity),"phenomenon_relation_board");

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`missing learning spec for ${activity.id}`);
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:exp.skill,weight:1}]);

  const seed=SCIENCE_BATCH13_WAVE_C.activities.find(item=>item.id===activity.id);
  assert(seed,`missing Wave C seed for ${activity.id}`);
  assert.equal(seed.kind,"choice");
  assert.equal(seed.packId,exp.pack);
  assert.equal(seed.lessonId,exp.lesson);
  assert.equal(seed.skillId,exp.skill);

  const pack=CONTENT_PACKS.find(item=>item.id===exp.pack);
  assert(pack,`missing pack ${exp.pack}`);
  assert.equal(pack.stageId,"science-earth-body-environment");
  const manifestItem=pack.activities.find(item=>item.activityId===activity.id);
  assert(manifestItem,`missing manifest item ${activity.id}`);
  assert.equal(manifestItem.mechanicId,"tap_choice");
  assert.equal(manifestItem.assessment,"assessed");
  assert.equal(manifestItem.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(manifestItem.skills,[{skillId:exp.skill,weight:1}]);

  const alternate=exp.choices.find(choice=>choice!==exp.correct);
  assert(alternate);
  assert.equal(phenomenonRelationBoardConfig({...activity,prompt:"Prompt drift"}),null,`${activity.id} prompt drift must fail closed`);
  assert.equal(phenomenonRelationBoardConfig({...activity,choices:[...exp.choices].reverse()}),null,`${activity.id} choice-order drift must fail closed`);
  assert.equal(phenomenonRelationBoardConfig({...activity,correctChoice:alternate}),null,`${activity.id} answer drift must fail closed`);
  assert.equal(phenomenonRelationBoardConfig({...activity,stageId:"science-evidence-review-challenge"}),null,`${activity.id} stage drift must fail closed`);
  assert.equal(phenomenonRelationBoardConfig({...activity,subjectId:"logic"}),null,`${activity.id} subject drift must fail closed`);
  assert.equal(phenomenonRelationBoardConfig({...activity,runtime:"matching"}),null,`${activity.id} runtime drift must fail closed`);
}

const earthPack=CONTENT_PACKS.find(item=>item.id==="science.pack.earth-sky-patterns");
assert(earthPack);
assert.deepEqual(new Set(earthPack.activities.map(item=>item.activityId)),new Set([
  "science-earth-sun-day","science-earth-moon-night","science-earth-shadow-sun","science-earth-cloud-rain","science-match-sky-observation-c"
]));
const ecosystemPack=CONTENT_PACKS.find(item=>item.id==="science.pack.ecosystem-dependencies");
assert(ecosystemPack);
assert.deepEqual(new Set(ecosystemPack.activities.map(item=>item.activityId)),new Set([
  "science-eco-plant-sun-water","science-eco-bee-flower","science-eco-bird-tree","science-eco-food-chain-change","science-match-ecosystem-needs-c"
]));

const exclusions=[
  ["science-match-sky-observation-c","visible_matching"],
  ["science-match-ecosystem-needs-c","visible_matching"],
  ["science-force-push-door","choice_grid"],
  ["science-force-pull-drawer","choice_grid"],
  ["science-force-gravity-ball","choice_grid"],
  ["science-force-rough-surface-slow","choice_grid"],
  ["science-water-ice-melts","cause_effect"],
  ["science-investigate-plant-light","investigation_board"],
  ["science-cycle-frog","growth_stage_transition"],
  ["science-measure-longer-pencil","compare_properties"]
];
for(const [id,pattern] of exclusions){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`missing exclusion ${id}`);
  assert.equal(isPhenomenonRelationBoardActivity(activity),false,`${id} must stay outside phenomenon relation reuse`);
  assert.equal(canonicalGameplayPattern(activity),pattern,`${id} pattern must remain unchanged`);
}

console.log("Phenomenon Relation Board tests passed exact eight-ID Earth/sky + ecosystem scope, domain variants, canonical evidence, matching/force exclusions and fail-closed drift checks.");
