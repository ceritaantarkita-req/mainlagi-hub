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

const bahasaIds=[
  "bahasa-gambar-apel",
  "bahasa-gambar-mobil",
  "bahasa-gambar-kucing",
  "bahasa-gambar-rumah",
  "bahasa-gambar-pisang"
];

const englishIds=[
  "english-animal-dog",
  "english-animal-rabbit",
  "english-animal-fish",
  "english-object-book",
  "english-object-chair",
  "english-object-cup",
  "english-body-head",
  "english-body-hand",
  "english-body-foot",
  "english-family-mother",
  "english-family-father",
  "english-family-baby",
  "english-food-apple",
  "english-food-banana",
  "english-food-bread",
  "english-action-run",
  "english-action-jump",
  "english-action-read"
];

const expected=new Set([...bahasaIds,...englishIds]);
const scoped=ACTIVITIES.filter(activity=>isPictureWordMatchActivity(activity));
assert.equal(scoped.length,23,"picture-word-match family must contain exactly five legacy Bahasa + eighteen audited English activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"picture-word-match scope must remain the exact audited 23-ID family");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"picture_word_match",`${activity.id} is classified as Picture Word Match`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);

  const config=pictureWordMatchConfig(activity);
  assert(config,`${activity.id} has exact Picture Word Match config`);
  assert.equal(config.spokenWord,activity.correctChoice,`${activity.id} configured word matches canonical correctChoice`);
  assert(config.picture.length>0,`${activity.id} keeps a stable visual clue`);
  assert.equal(config.locale,activity.subjectId==="english"?"en-US":"id-ID",`${activity.id} uses subject-aware locale`);
  assert.equal(config.domainVariant,activity.subjectId==="english"?"english_word_picture":"bahasa_word_picture",`${activity.id} uses explicit domain variant`);

  assert.equal(isPictureWordMatchActivity({...activity,title:`${activity.title}!`}),false,`${activity.id} title drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,prompt:`${activity.prompt}!`}),false,`${activity.id} prompt drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,choices:[...(activity.choices??[])].reverse()}),false,`${activity.id} choice-order drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,correctChoice:(activity.choices??[]).find(choice=>choice!==activity.correctChoice)}),false,`${activity.id} answer drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,stageId:`${activity.stageId}-drift`}),false,`${activity.id} stage drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,subjectId:activity.subjectId==="english"?"bahasa":"english"}),false,`${activity.id} subject drift fails closed`);
  assert.equal(isPictureWordMatchActivity({...activity,runtime:"matching"}),false,`${activity.id} runtime drift fails closed`);
}

assert.equal(scoped.filter(activity=>activity.subjectId==="bahasa").length,5,"legacy Bahasa picture-word family remains exactly five");
assert.equal(scoped.filter(activity=>activity.subjectId==="english").length,18,"English reuse family remains exactly eighteen");

for(const id of [
  "bahasa-pasang-kata-benda-1",
  "bahasa-gabung-baju",
  "bahasa-dengar-buku",
  "bahasa-awal-bola",
  "english-review-word-book",
  "english-category-food",
  "english-listen-bird",
  "english-match-objects-book-ball",
  "english-opposite-big-small",
  "english-complete-cat-sleeps",
  "math-group-6-by-2"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isPictureWordMatchActivity(activity),false,`${id} must stay outside Picture Word Match`);
  assert.notEqual(gameplayPattern(activity),"picture_word_match",`${id} must preserve its existing gameplay family`);
}

console.log("Picture Word Match regression passed for exact 23-ID Bahasa + English family with exact canonical fail-closed validation.");
