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
const {takeAwayConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/takeAwayConfig.js"));

const legacyIds=[
  "math-sub-3-1",
  "math-sub-4-2",
  "math-sub-5-1",
  "math-sub-6-2",
  "math-sub-7-3"
];

const mixedIds=[
  "math-mixed-sub-6-1",
  "math-mixed-sub-9-3"
];

const expected=new Set([...legacyIds,...mixedIds]);
const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="take_away");
assert.equal(scoped.length,7,"take-away family must contain exactly five legacy subtraction + two audited mixed-sub activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"take-away scope must remain the exact audited seven-ID family");

for(const activity of scoped){
  const isMixed=mixedIds.includes(activity.id);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,isMixed?"math-ukur-ruang":"math-operasi-awal",`${activity.id} stays in its canonical audited stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"take_away",`${activity.id} is classified as Take Away`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  const expectedSkill=isMixed?"math.operation.mixed":"math.operation.subtraction.within_10";
  assert((spec.skills??[]).some(link=>link.skillId===expectedSkill),`${activity.id} keeps canonical skill ${expectedSkill}`);

  const config=takeAwayConfig(activity);
  assert(config,`${activity.id} has exact Take Away config`);
  assert(config.startCount>=2&&config.startCount<=10,`${activity.id} starts with valid within-10 group`);
  assert(config.removeCount>=1&&config.removeCount<config.startCount,`${activity.id} removes a positive proper subset`);
  assert.equal(config.startCount-config.removeCount,Number(activity.correctChoice),`${activity.id} visual remainder equals canonical answer`);

  assert.equal(takeAwayConfig({...activity,title:`${activity.title}!`}),null,`${activity.id} title drift fails closed`);
  assert.equal(takeAwayConfig({...activity,prompt:`${activity.prompt}!`}),null,`${activity.id} prompt drift fails closed`);
  assert.equal(takeAwayConfig({...activity,choices:[...(activity.choices??[])].reverse()}),null,`${activity.id} choice-order drift fails closed`);
  assert.equal(takeAwayConfig({...activity,correctChoice:(activity.choices??[]).find(choice=>choice!==activity.correctChoice)}),null,`${activity.id} answer drift fails closed`);
  assert.equal(takeAwayConfig({...activity,stageId:`${activity.stageId}-drift`}),null,`${activity.id} stage drift fails closed`);
  assert.equal(takeAwayConfig({...activity,subjectId:"science"}),null,`${activity.id} subject drift fails closed`);
  assert.equal(takeAwayConfig({...activity,runtime:"matching"}),null,`${activity.id} runtime drift fails closed`);
}

assert.equal(scoped.filter(activity=>legacyIds.includes(activity.id)).length,5,"legacy Take Away family remains exactly five");
assert.equal(scoped.filter(activity=>mixedIds.includes(activity.id)).length,2,"mixed-sub reuse remains exactly two");

for(const id of [
  "math-mixed-choose-add",
  "math-mixed-add-2-3",
  "math-add-1-1",
  "math-group-6-by-2",
  "math-missing-1-3",
  "math-length-longer-lines",
  "math-count-2",
  "bahasa-gambar-apel"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(takeAwayConfig(activity),null,`${id} stays outside exact Take Away config`);
  assert.notEqual(choiceGameplayPresentation(activity),"take_away",`${id} must stay outside Take Away`);
}

console.log("Take Away regression passed for exact seven-ID legacy + mixed-sub family with canonical fail-closed validation.");
