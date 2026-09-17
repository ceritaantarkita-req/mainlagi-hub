import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {ENGLISH_BATCH9_WAVE_D}=require(path.resolve(".learning-test-dist/src/lib/learning/englishBatch9WaveD.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {isSentenceCompletionSlotActivity,parseSentenceCompletionPrompt,sentenceCompletionSlotConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/sentenceCompletionSlotConfig.js"));

const expected=new Map([
  ["english-complete-cat-sleeps",{prompt:"Complete: The cat ___.",before:"The cat ",after:".",choices:["SLEEPS","BOOK","YELLOW"],correct:"SLEEPS",required:true}],
  ["english-complete-bird-flies",{prompt:"Complete: The bird ___.",before:"The bird ",after:".",choices:["FLIES","MILK","HAND"],correct:"FLIES",required:false}],
  ["english-complete-i-read",{prompt:"Complete: I ___ a book.",before:"I ",after:" a book.",choices:["READ","RED","RABBIT"],correct:"READ",required:false}],
  ["english-complete-two-apples",{prompt:"Complete: I see two ___.",before:"I see two ",after:".",choices:["APPLES","FATHER","RUN"],correct:"APPLES",required:true}],
  ["english-complete-mother-family",{prompt:"Complete: My ___ is here.",before:"My ",after:" is here.",choices:["MOTHER","CHAIR","FISH"],correct:"MOTHER",required:false}]
]);

const scoped=ACTIVITIES.filter(activity=>isSentenceCompletionSlotActivity(activity));
assert.equal(scoped.length,5,"sentence-completion-slot family must remain exactly five English Wave D assessed activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only reviewed English sentence-completion activities use Pattern 38");

const waveSeeds=new Map(ENGLISH_BATCH9_WAVE_D.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
assert.equal(waveSeeds.size,5,"all five canonical sentence-completion seeds remain in English Wave D");

for(const activity of scoped){
  const canonical=expected.get(activity.id);
  assert(canonical,`${activity.id} has canonical fixture`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"english",`${activity.id} remains English`);
  assert.equal(activity.stageId,"english-phrases-review",`${activity.id} remains in English phrase/review stage`);
  assert.equal(activity.lessonId,"english-sentence-completion",`${activity.id} keeps canonical lesson`);
  assert.equal(activity.prompt,canonical.prompt,`${activity.id} keeps canonical sentence text`);
  assert.deepEqual(activity.choices,canonical.choices,`${activity.id} keeps canonical answer order and labels`);
  assert.equal(activity.correctChoice,canonical.correct,`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"sentence_completion_slot",`${activity.id} is classified as Pattern 38 sentence completion slot`);

  const seed=waveSeeds.get(activity.id);
  assert(seed,`${activity.id} keeps Wave D authoring seed`);
  assert.equal(seed.packId,"english.pack.sentence-completion",`${activity.id} keeps canonical pack`);
  assert.equal(seed.lessonId,"english-sentence-completion",`${activity.id} keeps canonical lesson`);
  assert.equal(seed.skillId,"english.sentence.completion",`${activity.id} keeps canonical skill`);
  assert.equal(Boolean(seed.requiredForStage),canonical.required,`${activity.id} keeps required-for-stage contract`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="english.sentence.completion"),`${activity.id} keeps sentence-completion skill evidence`);

  assert.deepEqual(parseSentenceCompletionPrompt(activity.prompt),{before:canonical.before,after:canonical.after},`${activity.id} parser derives exact fixed context around one blank`);
  assert.deepEqual(sentenceCompletionSlotConfig(activity),{before:canonical.before,after:canonical.after},`${activity.id} config remains canonical`);
}

for(const id of [
  "english-phrase-red-ball",
  "english-opposite-big-small",
  "english-review-category-action",
  "bahasa-urut-ibu-memasak",
  "letters-order-after-u"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isSentenceCompletionSlotActivity(activity),false,`${id} stays outside Pattern 38`);
  assert.notEqual(gameplayPattern(activity),"sentence_completion_slot",`${id} must not classify as Pattern 38`);
}

assert.equal(parseSentenceCompletionPrompt("The cat ___."),null,"prompt without canonical Complete prefix fails closed");
assert.equal(parseSentenceCompletionPrompt("Complete: ___"),null,"empty surrounding context fails closed");
assert.equal(parseSentenceCompletionPrompt("Complete: A ___ and ___"),null,"multiple blanks fail closed");
assert.equal(parseSentenceCompletionPrompt("Complete: sentence without blank"),null,"missing blank fails closed");

const distribution=ACTIVITIES.reduce((map,activity)=>{
  const pattern=gameplayPattern(activity);
  map.set(pattern,(map.get(pattern)??0)+1);
  return map;
},new Map());
assert.equal(distribution.get("sentence_completion_slot"),5,"Pattern 38 must own exactly five activities");
assert.equal(distribution.get("choice_grid"),272,"Pattern 38 must move exactly five activities out of the 277-choice_grid baseline");
assert.equal([...distribution.values()].reduce((sum,count)=>sum+count,0),900,"pattern distribution still covers all 900 activities");
assert.equal(distribution.size,38,"Pattern 38 increases active gameplay-pattern count from 37 to 38 only");

console.log("Sentence Completion Slot regression passed for exact five-activity English Wave D family.");
