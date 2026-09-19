import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern,isNumberLineActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {numberLineConfig,numberLineValues}=require(path.resolve(".learning-test-dist/src/lib/learning/numberLineConfig.js"));

const legacyIds=[
  "math-order-next-1-2",
  "math-order-next-3-4",
  "math-order-before-6",
  "math-order-between-6-8",
  "math-order-descend-5",
  "math-order-descend-10"
];

const missingIds=[
  "math-missing-1-3",
  "math-missing-3-5",
  "math-missing-before-6",
  "math-missing-after-8",
  "math-missing-descend-10-8"
];

const expected=new Set([...legacyIds,...missingIds]);
const scoped=ACTIVITIES.filter(activity=>isNumberLineActivity(activity));
assert.equal(scoped.length,11,"number-line family must contain exactly six legacy ordering + five audited missing-number activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),expected,"number-line scope must remain the exact audited 11-ID family");

for(const activity of scoped){
  assert.equal(activity.subjectId,"math",`${activity.id} stays in Math`);
  assert(["math-banding-bentuk","math-operasi-awal"].includes(activity.stageId),`${activity.id} stays inside audited Math stages`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal((activity.choices??[]).length,3,`${activity.id} keeps three canonical choices`);
  assert.equal(new Set(activity.choices??[]).size,3,`${activity.id} choices remain unique`);
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),`${activity.id} choices remain numeric`);
  assert((activity.choices??[]).includes(activity.correctChoice),`${activity.id} keeps canonical correctChoice`);
  assert.equal(gameplayPattern(activity),"number_line",`${activity.id} is classified as Number Line`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);

  const config=numberLineConfig(activity);
  assert(config,`${activity.id} has exact Number Line config`);
  assert.equal(numberLineValues(config).length,5,`${activity.id} keeps a five-tick local line`);
  assert(config.contextValues.length>=1,`${activity.id} keeps explicit context values`);
  assert(config.contextValues.every(value=>value>=config.min&&value<=config.max),`${activity.id} context stays visible`);
  assert((activity.choices??[]).every(choice=>Number(choice)>=config.min&&Number(choice)<=config.max),`${activity.id} canonical choices stay visible on line`);

  assert.equal(isNumberLineActivity({...activity,title:`${activity.title}!`}),false,`${activity.id} title drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,prompt:`${activity.prompt}!`}),false,`${activity.id} prompt drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,choices:[...(activity.choices??[])].reverse()}),false,`${activity.id} choice-order drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,correctChoice:(activity.choices??[]).find(choice=>choice!==activity.correctChoice)}),false,`${activity.id} answer drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,stageId:`${activity.stageId}-drift`}),false,`${activity.id} stage drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,subjectId:"logic"}),false,`${activity.id} subject drift fails closed`);
  assert.equal(isNumberLineActivity({...activity,runtime:"matching"}),false,`${activity.id} runtime drift fails closed`);
}

assert.equal(scoped.filter(activity=>legacyIds.includes(activity.id)).length,6,"legacy ordering family remains exactly six");
assert.equal(scoped.filter(activity=>missingIds.includes(activity.id)).length,5,"Wave C missing-number reuse remains exactly five");

for(const id of [
  "math-group-6-by-2",
  "math-add-1-1",
  "math-sub-3-1",
  "math-length-longer-lines",
  "math-size-bigger-circles",
  "math-pattern-number-step-one",
  "english-initial-ball",
  "science-force-push-door"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isNumberLineActivity(activity),false,`${id} stays outside Number Line`);
  assert.notEqual(gameplayPattern(activity),"number_line",`${id} preserves its existing gameplay family`);
}

console.log("Number Line regression passed for exact 11-ID legacy + Math missing-number family with canonical fail-closed validation.");
