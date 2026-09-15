import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {syllableAssemblyConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/syllableAssemblyConfig.js"));

const expected=new Set([
  "bahasa-gabung-baju",
  "bahasa-gabung-buku",
  "bahasa-gabung-meja",
  "bahasa-gabung-bola",
  "bahasa-gabung-susu"
]);

const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="syllable_assembly");
assert.equal(scoped.length,5,"syllable-assembly family must remain exactly five activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"only reviewed Bahasa Wave B blending activities use Syllable Assembly");

for(const activity of scoped){
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"bahasa",`${activity.id} remains Bahasa`);
  assert.equal(activity.stageId,"bahasa-suku-kata-kata",`${activity.id} remains in Bahasa Wave B stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"syllable_assembly",`${activity.id} is classified as Syllable Assembly`);
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="bahasa.suku_kata.blending"),`${activity.id} keeps canonical blending skill`);
  const config=syllableAssemblyConfig(activity);
  assert(config,`${activity.id} has explicit Syllable Assembly config`);
  assert.equal(config.syllables.length,2,`${activity.id} keeps exactly two prompt-supported syllables`);
  assert.equal(config.syllables.join(""),activity.correctChoice,`${activity.id} syllables assemble exactly to canonical correctChoice`);
  assert(config.syllables.every(syllable=>(activity.prompt??"").toLowerCase().includes(syllable)),`${activity.id} syllables remain grounded in canonical prompt`);
}

for(const id of [
  "bahasa-suku-ba",
  "bahasa-gambar-apel",
  "bahasa-awal-bola",
  "english-initial-ball",
  "logic-order-first-after-start",
  "math-add-1-1"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.notEqual(choiceGameplayPresentation(activity),"syllable_assembly",`${id} must stay outside Syllable Assembly`);
}

console.log("Syllable Assembly regression passed for exact five-activity Bahasa Wave B blending family.");
