import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,gameplayPattern,isClozeSentenceChoiceActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {clozeSentenceChoiceConfig,isClozeSentenceChoiceCandidate}=require(path.resolve(".learning-test-dist/src/lib/learning/clozeSentenceChoiceConfig.js"));

const expected=new Map([
  ["bahasa-lengkap-ayah-minum",{prompt:"Ayah minum ___ setelah berolahraga.",choices:["air","bantal","sepatu"],correct:"air"}],
  ["bahasa-lengkap-burung-terbang",{prompt:"Burung ___ di langit.",choices:["berenang","terbang","membaca"],correct:"terbang"}],
  ["bahasa-lengkap-kucing-tidur",{prompt:"Kucing tidur di atas ___.",choices:["kursi","hujan","awan"],correct:"kursi"}],
  ["bahasa-lengkap-ibu-pasar",{prompt:"Ibu membeli sayur di ___.",choices:["pasar","langit","sungai"],correct:"pasar"}],
  ["bahasa-lengkap-rina-payung",{prompt:"Saat hujan, Rina memakai ___.",choices:["payung","sendok","pensil"],correct:"payung"}]
]);

const scoped=ACTIVITIES.filter(activity=>isClozeSentenceChoiceActivity(activity));
assert.equal(scoped.length,5,"cloze-sentence family must remain exactly five audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Bahasa context-completion activities use cloze sentence choice");

for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,`${activity.id} remains in audited snapshot`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-literasi-terapan",`${activity.id} remains in Literasi Terapan`);
  assert.equal(activity.prompt,snapshot.prompt,`${activity.id} prompt remains byte-for-byte canonical`);
  assert.deepEqual(activity.choices,snapshot.choices,`${activity.id} choices remain byte-for-byte canonical and ordered`);
  assert.equal(activity.correctChoice,snapshot.correct,`${activity.id} correctChoice remains canonical`);
  assert.equal((activity.prompt.match(/___/g)??[]).length,1,`${activity.id} keeps exactly one literal blank`);
  assert.equal(isClozeSentenceChoiceCandidate(activity),true,`${activity.id} passes fail-closed cloze contract`);
  assert.equal(choiceGameplayPresentation(activity),"cloze_sentence_choice",`${activity.id} uses cloze presentation`);
  assert.equal(gameplayPattern(activity),"cloze_sentence_choice",`${activity.id} is canonical Pattern 38`);
  const config=clozeSentenceChoiceConfig(activity);
  assert(config,`${activity.id} has a parsed cloze config`);
  assert.equal(`${config.before}___${config.after}`,activity.prompt,`${activity.id} parser preserves the unchanged prompt`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.kalimat.context_completion"),`${activity.id} keeps context-completion skill`);
}

for(const id of [
  "bahasa-kapital-awal",
  "bahasa-terapan-mila-pagi",
  "bahasa-gabung-baju",
  "english-initial-ball",
  "letters-order-after-g",
  "math-add-1-1"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isClozeSentenceChoiceActivity(activity),false,`${id} stays outside Pattern 38 scope`);
  assert.notEqual(gameplayPattern(activity),"cloze_sentence_choice",`${id} must not classify as Pattern 38`);
}

const malformed={...scoped[0],prompt:"Ayah minum ___ setelah ___ olahraga."};
assert.equal(isClozeSentenceChoiceCandidate(malformed),false,"multiple blanks fail closed");
assert.equal(clozeSentenceChoiceConfig(malformed),null,"malformed prompt returns no cloze config");

console.log("Pattern 38 cloze sentence choice regression passed for exact five audited Bahasa activities.");
