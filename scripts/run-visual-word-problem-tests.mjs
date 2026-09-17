import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {isVisualWordProblemActivity,visualWordProblemConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/visualWordProblemConfig.js"));

const expected=new Map([
  ["math-problem-apples",{prompt:"Gian punya 2 apel. Naya memberi 2 lagi. Berapa apel Gian sekarang?",choices:["3","4","5"],correct:"4",start:2,change:2,operation:"add",token:"🍎"}],
  ["math-problem-birds",{prompt:"Ada 5 burung. 2 terbang pergi. Berapa burung tersisa?",choices:["2","3","4"],correct:"3",start:5,change:2,operation:"subtract",token:"🐦"}],
  ["math-problem-cars",{prompt:"Paca punya 3 mobil, lalu menemukan 1 lagi. Berapa semuanya?",choices:["3","4","5"],correct:"4",start:3,change:1,operation:"add",token:"🚗"}],
  ["math-problem-cookies",{prompt:"Ada 6 biskuit. 2 dimakan. Berapa yang tersisa?",choices:["3","4","5"],correct:"4",start:6,change:2,operation:"subtract",token:"🍪"}],
  ["math-problem-balloons",{prompt:"Zia punya 4 balon lalu mendapat 3 lagi. Berapa balon sekarang?",choices:["6","7","8"],correct:"7",start:4,change:3,operation:"add",token:"🎈"}]
]);

const scoped=ACTIVITIES.filter(activity=>isVisualWordProblemActivity(activity));
assert.equal(scoped.length,5,"visual-word-problem family must remain exactly five audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Math visual-problem activities use Pattern 39");
assert.deepEqual(new Set(scoped.map(activity=>gameplayPattern(activity))),new Set(["visual_word_problem"]));

for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,`${activity.id} remains in frozen audit snapshot`);
  assert.equal(activity.subjectId,"math",`${activity.id} remains Math`);
  assert.equal(activity.stageId,"math-ukur-ruang",`${activity.id} remains in math-ukur-ruang`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.prompt,snapshot.prompt,`${activity.id} prompt remains byte-for-byte canonical`);
  assert.deepEqual(activity.choices,snapshot.choices,`${activity.id} choices remain canonical and ordered`);
  assert.equal(activity.correctChoice,snapshot.correct,`${activity.id} correctChoice remains canonical`);
  assert.equal(gameplayPattern(activity),"visual_word_problem",`${activity.id} is canonical Pattern 39`);

  const config=visualWordProblemConfig(activity);
  assert(config,`${activity.id} has fail-closed explicit visual config`);
  assert.equal(config.startCount,snapshot.start);
  assert.equal(config.changeCount,snapshot.change);
  assert.equal(config.operation,snapshot.operation);
  assert.equal(config.token,snapshot.token);
  const result=config.operation==="add"?config.startCount+config.changeCount:config.startCount-config.changeCount;
  assert.equal(String(result),activity.correctChoice,`${activity.id} visual quantity change resolves exactly to canonical answer`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert((spec.skills??[]).some(link=>link.skillId==="math.problem.visual"&&link.weight===1),`${activity.id} keeps canonical visual-problem skill evidence`);
}

assert.deepEqual(new Set(scoped.map(activity=>visualWordProblemConfig(activity)?.operation)),new Set(["add","subtract"]),"Pattern 39 covers both audited operation branches");

for(const id of [
  "math-add-2-1",
  "math-sub-3-1",
  "math-group-6-by-2",
  "math-count-4",
  "math-length-longer-lines",
  "bahasa-lengkap-ayah-minum",
  "science-cycle-butterfly"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isVisualWordProblemActivity(activity),false,`${id} stays outside Pattern 39 scope`);
  assert.notEqual(gameplayPattern(activity),"visual_word_problem",`${id} must not classify as Pattern 39`);
}

const malformed={...scoped[0],correctChoice:"9"};
assert.equal(isVisualWordProblemActivity(malformed),false,"wrong canonical result fails closed");
assert.equal(visualWordProblemConfig(malformed),null,"malformed result returns no visual-word-problem config");

const malformedStage={...scoped[0],stageId:"math-operasi-awal"};
assert.equal(isVisualWordProblemActivity(malformedStage),false,"wrong stage fails closed");

console.log("Pattern 39 visual word problem regression passed for exact five audited Math activities.");
