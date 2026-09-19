import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,matchingPresentation,gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {healthyHabitRoutineConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/healthyHabitRoutineConfig.js"));

const FIXTURES={
  "science-body-wash-hands":{
    domainVariant:"body_health",skillId:"science.body.health_habits.basic",
    prompt:"Kapan sebaiknya tangan dicuci dengan sabun?",
    choices:["sebelum makan","setelah memakai sepatu saja","hanya saat hari Minggu"],
    correct:"sebelum makan"
  },
  "science-body-teeth-brush":{
    domainVariant:"body_health",skillId:"science.body.health_habits.basic",
    prompt:"Kebiasaan mana yang membantu menjaga kebersihan gigi?",
    choices:["menyikat gigi","tidak pernah membersihkan gigi","menggosok gigi dengan pasir"],
    correct:"menyikat gigi"
  },
  "science-body-water-drink":{
    domainVariant:"body_health",skillId:"science.body.health_habits.basic",
    prompt:"Apa yang membantu tubuh tetap mendapat cairan?",
    choices:["minum air","memegang batu","melihat televisi"],
    correct:"minum air"
  },
  "science-body-sleep-rest":{
    domainVariant:"body_health",skillId:"science.body.health_habits.basic",
    prompt:"Kegiatan mana yang memberi tubuh waktu beristirahat?",
    choices:["tidur cukup","berlari tanpa berhenti","tidak tidur semalaman"],
    correct:"tidur cukup"
  },
  "science-env-trash-bin":{
    domainVariant:"environment_care",skillId:"science.environment.care.basic",
    prompt:"Apa tindakan yang tepat untuk bungkus makanan setelah digunakan?",
    choices:["buang ke tempat sampah yang sesuai","lempar ke sungai","tinggalkan di jalan"],
    correct:"buang ke tempat sampah yang sesuai"
  },
  "science-env-save-water":{
    domainVariant:"environment_care",skillId:"science.environment.care.basic",
    prompt:"Apa yang sebaiknya dilakukan saat keran tidak sedang dipakai?",
    choices:["matikan keran","biarkan terus mengalir","buka semua keran"],
    correct:"matikan keran"
  },
  "science-env-reuse-bottle":{
    domainVariant:"environment_care",skillId:"science.environment.care.basic",
    prompt:"Mana contoh menggunakan kembali barang?",
    choices:["memakai botol isi ulang","membuang gelas baru setelah satu teguk","membakar semua kertas"],
    correct:"memakai botol isi ulang"
  },
  "science-env-plant-care":{
    domainVariant:"environment_care",skillId:"science.environment.care.basic",
    prompt:"Tindakan mana yang membantu tanaman di halaman tetap terawat?",
    choices:["menyiram sesuai kebutuhan","menginjak tanaman","mencabut semua daun setiap hari"],
    correct:"menyiram sesuai kebutuhan"
  }
};

const expected=new Set(Object.keys(FIXTURES));
const family=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="healthy_habit_routine");
assert.equal(family.length,8,"healthy-habit family must contain exact 4 body-health + 4 environment-care activities");
assert.deepEqual(new Set(family.map(activity=>activity.id)),expected,"only the reviewed eight Science direct-choice activities use Healthy Habit Routine");

for(const activity of family){
  const fixture=FIXTURES[activity.id];
  assert(fixture,activity.id);
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  assert.equal(activity.prompt,fixture.prompt);
  assert.deepEqual(activity.choices,fixture.choices);
  assert.equal(activity.correctChoice,fixture.correct);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} must keep canonical learning spec`);
  assert.equal(spec.assessment,"assessed");
  assert.equal(spec.skills.length,1);
  assert.equal(spec.skills[0]?.skillId,fixture.skillId);

  assert.equal(gameplayPattern(activity),"healthy_habit_routine");
  const config=healthyHabitRoutineConfig(activity);
  assert(config,`${activity.id} must have exact Healthy Habit Routine config`);
  assert.equal(config.domainVariant,fixture.domainVariant);
  assert.deepEqual(Object.keys(config.choiceVisuals),fixture.choices,`${activity.id} visuals preserve canonical choice order`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} correct choice keeps explicit visual`);

  assert.equal(healthyHabitRoutineConfig({...activity,subjectId:"math"}),null,`${activity.id} subject drift fails closed`);
  assert.equal(healthyHabitRoutineConfig({...activity,stageId:"science-life-material-motion"}),null,`${activity.id} stage drift fails closed`);
  assert.equal(healthyHabitRoutineConfig({...activity,runtime:"listen_and_choose"}),null,`${activity.id} runtime drift fails closed`);
  assert.equal(healthyHabitRoutineConfig({...activity,prompt:`${activity.prompt} berubah`}),null,`${activity.id} prompt drift fails closed`);
  assert.equal(healthyHabitRoutineConfig({...activity,choices:[...fixture.choices].reverse()}),null,`${activity.id} choice-order drift fails closed`);
  const wrongCorrect=fixture.choices.find(choice=>choice!==fixture.correct);
  assert.equal(healthyHabitRoutineConfig({...activity,correctChoice:wrongCorrect}),null,`${activity.id} answer drift fails closed`);
}

for(const id of ["science-match-body-care-c","science-match-environment-actions-c"]){
  const excluded=ACTIVITIES.find(activity=>activity.id===id);
  assert(excluded,`${id} remains in catalog`);
  assert.equal(excluded.runtime,"matching");
  assert.equal(matchingPresentation(excluded),"grid_pairs");
  assert.equal(gameplayPattern(excluded),"visible_matching");
}

for(const id of ["science-observe-record-same-time","science-earth-sun-day"]){
  const unrelated=ACTIVITIES.find(activity=>activity.id===id);
  assert(unrelated,`${id} remains in catalog`);
  assert.equal(healthyHabitRoutineConfig(unrelated),null,`${id} must not enter Healthy Habit Routine by generic shape`);
}

console.log("Healthy-habit routine regression passed for exact 8-ID body-health + environment-care family with fail-closed identity and matching exclusions.");
