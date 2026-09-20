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
const {makeTotalConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/makeTotalConfig.js"));

const legacyIds=[
  "math-add-1-1",
  "math-add-2-1",
  "math-add-2-2",
  "math-add-3-2",
  "math-add-4-3"
];

const mixedIds=[
  "math-mixed-add-2-3",
  "math-mixed-add-4-4"
];

const expected=new Set([...legacyIds,...mixedIds]);
const scoped=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="make_total");
assert.equal(scoped.length,7,"make-total family must contain exactly five legacy addition + two audited mixed-add activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"make-total scope must remain the exact audited seven-ID family");

for(const activity of scoped){
  const isMixed=mixedIds.includes(activity.id);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,isMixed?"math-ukur-ruang":"math-operasi-awal",`${activity.id} stays in its canonical audited stage`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"make_total",`${activity.id} is classified as Make Total`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  const expectedSkill=isMixed?"math.operation.mixed":"math.operation.addition.within_10";
  assert((spec.skills??[]).some(link=>link.skillId===expectedSkill),`${activity.id} keeps canonical skill ${expectedSkill}`);

  const config=makeTotalConfig(activity);
  assert(config,`${activity.id} has exact Make Total config`);
  assert.equal(config.leftCount+config.rightCount,Number(activity.correctChoice),`${activity.id} visual groups sum exactly to canonical answer`);
  assert(config.leftCount>=1&&config.rightCount>=1,`${activity.id} keeps two non-empty groups`);
  assert(config.leftCount+config.rightCount<=10,`${activity.id} remains within 10`);

  assert.equal(makeTotalConfig({...activity,title:`${activity.title}!`}),null,`${activity.id} title drift fails closed`);
  assert.equal(makeTotalConfig({...activity,prompt:`${activity.prompt}!`}),null,`${activity.id} prompt drift fails closed`);
  assert.equal(makeTotalConfig({...activity,choices:[...(activity.choices??[])].reverse()}),null,`${activity.id} choice-order drift fails closed`);
  assert.equal(makeTotalConfig({...activity,correctChoice:(activity.choices??[]).find(choice=>choice!==activity.correctChoice)}),null,`${activity.id} answer drift fails closed`);
  assert.equal(makeTotalConfig({...activity,stageId:`${activity.stageId}-drift`}),null,`${activity.id} stage drift fails closed`);
  assert.equal(makeTotalConfig({...activity,subjectId:"logic"}),null,`${activity.id} subject drift fails closed`);
  assert.equal(makeTotalConfig({...activity,runtime:"matching"}),null,`${activity.id} runtime drift fails closed`);
}

assert.equal(scoped.filter(activity=>legacyIds.includes(activity.id)).length,5,"legacy Make Total family remains exactly five");
assert.equal(scoped.filter(activity=>mixedIds.includes(activity.id)).length,2,"mixed-add reuse remains exactly two");

for(const id of [
  "math-mixed-choose-add",
  "math-mixed-sub-6-1",
  "math-sub-3-1",
  "math-group-6-by-2",
  "math-missing-1-3",
  "math-length-longer-lines",
  "math-count-2",
  "bahasa-gabung-baju"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(makeTotalConfig(activity),null,`${id} stays outside exact Make Total config`);
  assert.notEqual(choiceGameplayPresentation(activity),"make_total",`${id} must stay outside Make Total`);
}

console.log("Make Total regression passed for exact seven-ID legacy + mixed-add family with canonical fail-closed validation.");
