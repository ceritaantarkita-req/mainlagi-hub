import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {CONTENT_PACKS}=require(path.resolve(".learning-test-dist/src/lib/learning/contentManifest.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {shapeAttributeBoardConfig,isShapeAttributeBoardActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/shapeAttributeBoardConfig.js"));

const expected=new Map([
  ["math-shape-find-circle",{prompt:"Bentuk mana yang bulat tanpa sudut?",choices:["●","▲","■"],correct:"●",mode:"identify_circle",skill:"math.shape.recognition"}],
  ["math-shape-find-triangle",{prompt:"Mana bentuk segitiga?",choices:["■","▲","●"],correct:"▲",mode:"identify_triangle",skill:"math.shape.recognition"}],
  ["math-shape-find-square",{prompt:"Pilih bentuk persegi.",choices:["▭","■","●"],correct:"■",mode:"identify_square",skill:"math.shape.recognition"}],
  ["math-shape-three-sides",{prompt:"Bentuk mana yang punya 3 sisi?",choices:["●","▲","■"],correct:"▲",mode:"identify_three_sides",skill:"math.shape.properties"}]
]);

const scoped=ACTIVITIES.filter(activity=>isShapeAttributeBoardActivity(activity));
assert.equal(scoped.length,4,"Pattern 47 must remain exactly four activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()));

for(const activity of scoped){
  const exp=expected.get(activity.id);
  assert(exp,"unexpected Pattern 47 activity "+activity.id);
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-banding-bentuk");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,exp.prompt);
  assert.deepEqual(activity.choices,exp.choices);
  assert.equal(activity.correctChoice,exp.correct);

  const config=shapeAttributeBoardConfig(activity);
  assert(config,"missing config for "+activity.id);
  assert.equal(config.mode,exp.mode);
  assert.equal(config.expectedPrompt,exp.prompt);
  assert.deepEqual(config.expectedChoices,exp.choices);
  assert.equal(config.expectedCorrectChoice,exp.correct);
  assert.deepEqual(Object.keys(config.choiceVisuals),exp.choices);
  assert.equal(canonicalGameplayPattern(activity),"shape_attribute_board");

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,"missing learning spec for "+activity.id);
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:exp.skill,weight:1}]);
}

const pack=CONTENT_PACKS.find(item=>item.id==="math.pack.shapes");
assert(pack,"missing math shape pack");
assert.equal(pack.stageId,"math-banding-bentuk");
const packEntries=new Map(pack.activities.map(item=>[item.activityId,item]));
for(const [id,exp] of expected){
  const entry=packEntries.get(id);
  assert(entry,"missing pack entry for "+id);
  assert.equal(entry.lessonId,"math-shapes");
  assert.equal(entry.mechanicId,"tap_choice");
  assert.equal(entry.assessment,"assessed");
  assert.equal(entry.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(entry.skills,[{skillId:exp.skill,weight:1}]);
}
for(const id of ["math-shape-match-circle-square","math-shape-match-triangle-rectangle"]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,"missing same-pack matching "+id);
  assert.equal(activity.runtime,"matching");
  assert.equal(isShapeAttributeBoardActivity(activity),false);
  assert.equal(canonicalGameplayPattern(activity),"visible_matching");
}

const exclusions=[
  ["math-pattern-ab-shapes","pattern_completion"],
  ["math-order-next-1-2","number_line"],
  ["math-compare-more-2-4","more_less_balance"],
  ["math-spatial-above","spatial_relation_board"],
  ["letters-find-a","symbol_hunt"]
];
for(const [id,pattern] of exclusions){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,"missing exclusion "+id);
  assert.equal(isShapeAttributeBoardActivity(activity),false,id+" must stay outside Pattern 47");
  assert.equal(canonicalGameplayPattern(activity),pattern,id+" pattern must remain unchanged");
}

const base=ACTIVITIES.find(item=>item.id==="math-shape-find-circle");
assert(base);
assert.equal(shapeAttributeBoardConfig({...base,prompt:"Prompt drift"}),null);
assert.equal(shapeAttributeBoardConfig({...base,choices:[...(base.choices??[])].reverse()}),null);
assert.equal(shapeAttributeBoardConfig({...base,correctChoice:"▲"}),null);
assert.equal(shapeAttributeBoardConfig({...base,stageId:"math-operasi-awal"}),null);
assert.equal(shapeAttributeBoardConfig({...base,subjectId:"logic"}),null);
assert.equal(shapeAttributeBoardConfig({...base,runtime:"matching"}),null);

console.log("Pattern 47 shape-attribute-board tests passed exact four-ID scope, canonical runtime payload, ownership/evidence, same-pack matching exclusion and fail-closed drift checks.");
