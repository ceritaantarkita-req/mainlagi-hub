import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,gameplayPattern,isInitialSoundActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {initialSoundConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/initialSoundConfig.js"));

const expected=new Set([
  "bahasa-awal-bola",
  "bahasa-awal-kucing",
  "bahasa-awal-pisang"
]);

const scoped=ACTIVITIES.filter(activity=>isInitialSoundActivity(activity));
assert.equal(scoped.length,3,"initial-sound family must remain exactly three assessed Bahasa choice activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Bahasa Wave A initial-sound choices use Initial Sound");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-dasar-huruf",`${activity.id} remains in Bahasa dasar huruf stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^[A-Z]$/.test(choice)),`${activity.id} choices remain uppercase single letters`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(choiceGameplayPresentation(activity),"initial_sound",`${activity.id} uses Initial Sound presentation`);
  assert.equal(gameplayPattern(activity),"initial_sound",`${activity.id} is classified as Initial Sound`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.bunyi.awal.recognition"),`${activity.id} keeps canonical initial-sound skill`);
  const config=initialSoundConfig(activity);
  assert(config,`${activity.id} has explicit Initial Sound config`);
  assert.equal(config.word[0].toUpperCase(),activity.correctChoice,`${activity.id} configured word begins with canonical correctChoice`);
  assert(config.clue.length>0,`${activity.id} keeps a visual clue`);
}

for(const id of [
  "bahasa-match-awal-tas-susu",
  "bahasa-vokal-i",
  "bahasa-pilih-vokal-ae",
  "bahasa-gabung-baju",
  "english-initial-ball",
  "letters-order-after-g",
  "math-group-6-by-2"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isInitialSoundActivity(activity),false,`${id} must stay outside Initial Sound`);
  assert.notEqual(gameplayPattern(activity),"initial_sound",`${id} must not classify as Initial Sound`);
}

console.log("Initial Sound regression passed for exact three-activity Bahasa Wave A initial-letter family.");
