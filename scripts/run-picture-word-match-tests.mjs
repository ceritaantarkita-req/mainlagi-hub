import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern,isPictureWordMatchActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {pictureWordMatchConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/pictureWordMatchConfig.js"));

const expected=new Set([
  "bahasa-gambar-apel",
  "bahasa-gambar-mobil",
  "bahasa-gambar-kucing",
  "bahasa-gambar-rumah",
  "bahasa-gambar-pisang"
]);

const scoped=ACTIVITIES.filter(activity=>isPictureWordMatchActivity(activity));
assert.equal(scoped.length,5,"picture-word-match family must remain exactly five assessed Bahasa choice activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Bahasa Wave B image-to-word choices use Picture Word Match");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-suku-kata-kata",`${activity.id} remains in Bahasa suku kata/kata stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^[a-z]+$/.test(choice)),`${activity.id} choices remain lowercase word tokens`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"picture_word_match",`${activity.id} is classified as Picture Word Match`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.kata.picture_matching"),`${activity.id} keeps canonical picture-matching skill`);
  const config=pictureWordMatchConfig(activity);
  assert(config,`${activity.id} has explicit Picture Word Match config`);
  assert.equal(config.spokenWord,activity.correctChoice,`${activity.id} configured object word matches canonical correctChoice`);
  assert(config.picture.length>0,`${activity.id} keeps a visual object clue`);
}

for(const id of [
  "bahasa-pasang-kata-benda-1",
  "bahasa-gabung-baju",
  "bahasa-dengar-buku",
  "bahasa-awal-bola",
  "english-object-book",
  "math-group-6-by-2"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isPictureWordMatchActivity(activity),false,`${id} must stay outside Picture Word Match`);
  assert.notEqual(gameplayPattern(activity),"picture_word_match",`${id} must not classify as Picture Word Match`);
}

console.log("Picture Word Match regression passed for exact five-activity Bahasa Wave B image-to-word family.");
