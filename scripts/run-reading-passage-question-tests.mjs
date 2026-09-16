import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {BAHASA_BATCH8_WAVE_C}=require(path.resolve(".learning-test-dist/src/lib/learning/bahasaBatch8WaveC.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {isReadingPassageQuestionActivity,parseReadingPassageQuestion,readingPassageQuestionConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/readingPassageQuestionConfig.js"));

const expected=new Map([
  ["bahasa-baca-lala-kucing",{prompt:"Baca: 'Lala punya kucing putih.' Apa warna kucing Lala?",passage:"Lala punya kucing putih.",question:"Apa warna kucing Lala?",choices:["putih","hitam","cokelat"],correct:"putih",required:true}],
  ["bahasa-baca-dodi-sepeda",{prompt:"Baca: 'Dodi naik sepeda ke taman.' Dodi naik apa?",passage:"Dodi naik sepeda ke taman.",question:"Dodi naik apa?",choices:["sepeda","mobil","bus"],correct:"sepeda",required:false}],
  ["bahasa-baca-nina-bunga",{prompt:"Baca: 'Nina menyiram bunga setiap pagi.' Apa yang disiram Nina?",passage:"Nina menyiram bunga setiap pagi.",question:"Apa yang disiram Nina?",choices:["bunga","buku","sepatu"],correct:"bunga",required:false}],
  ["bahasa-baca-raka-sarapan",{prompt:"Baca: 'Raka makan roti dan minum susu saat sarapan.' Apa yang diminum Raka?",passage:"Raka makan roti dan minum susu saat sarapan.",question:"Apa yang diminum Raka?",choices:["air","susu","jus"],correct:"susu",required:true}],
  ["bahasa-baca-sari-hujan",{prompt:"Baca: 'Hujan turun. Sari memakai payung merah.' Apa warna payung Sari?",passage:"Hujan turun. Sari memakai payung merah.",question:"Apa warna payung Sari?",choices:["merah","biru","kuning"],correct:"merah",required:false}]
]);

const scoped=ACTIVITIES.filter(activity=>isReadingPassageQuestionActivity(activity));
assert.equal(scoped.length,5,"reading-passage-question family must remain exactly five assessed Bahasa short-reading activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only reviewed Bahasa Wave C short-reading activities use Reading Passage Question");

const waveSeeds=new Map(BAHASA_BATCH8_WAVE_C.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
assert.equal(waveSeeds.size,5,"all five canonical short-reading seeds remain in Bahasa Wave C");

for(const activity of scoped){
  const canonical=expected.get(activity.id);
  assert(canonical,`${activity.id} has canonical regression fixture`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-kalimat-pemahaman",`${activity.id} remains in Bahasa sentence/comprehension stage`);
  assert.equal(activity.prompt,canonical.prompt,`${activity.id} keeps canonical passage/question text`);
  assert.deepEqual(activity.choices,canonical.choices,`${activity.id} keeps canonical answer order and labels`);
  assert.equal(activity.correctChoice,canonical.correct,`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"reading_passage_question",`${activity.id} is classified as Reading Passage Question`);

  const seed=waveSeeds.get(activity.id);
  assert(seed,`${activity.id} keeps Wave C authoring seed`);
  assert.equal(seed.packId,"bahasa.pack.bacaan-pendek",`${activity.id} keeps canonical pack`);
  assert.equal(seed.lessonId,"bahasa-bacaan-pendek",`${activity.id} keeps canonical lesson`);
  assert.equal(seed.skillId,"bahasa.bacaan.short_comprehension",`${activity.id} keeps canonical skill`);
  assert.equal(Boolean(seed.requiredForStage),canonical.required,`${activity.id} keeps required-for-stage progression contract`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.bacaan.short_comprehension"),`${activity.id} keeps short-reading comprehension skill evidence`);

  const parsed=parseReadingPassageQuestion(activity.prompt);
  assert.deepEqual(parsed,{passage:canonical.passage,question:canonical.question},`${activity.id} parser derives only canonical passage/question text`);
  const config=readingPassageQuestionConfig(activity);
  assert(config,`${activity.id} has Reading Passage Question config`);
  assert.equal(config.passage,canonical.passage,`${activity.id} config passage stays canonical`);
  assert.equal(config.question,canonical.question,`${activity.id} config question stays canonical`);
}

for(const id of [
  "bahasa-makna-rina-apel",
  "bahasa-urut-ibu-memasak",
  "bahasa-instruksi-ambil-buku",
  "bahasa-gambar-apel",
  "english-find-blue"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isReadingPassageQuestionActivity(activity),false,`${id} must stay outside Reading Passage Question`);
  assert.notEqual(gameplayPattern(activity),"reading_passage_question",`${id} must not classify as Reading Passage Question`);
}

assert.equal(parseReadingPassageQuestion("Rina makan apel. Apa yang dimakan Rina?"),null,"unquoted generic comprehension prompt must not enter reviewed short-reading parser");
assert.equal(parseReadingPassageQuestion("Baca: 'Kalimat tanpa pertanyaan.'"),null,"prompt without canonical question must fail closed");

console.log("Reading Passage Question regression passed for exact five-activity Bahasa Wave C short-reading family.");
