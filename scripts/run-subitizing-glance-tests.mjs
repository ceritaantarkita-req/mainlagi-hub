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
const {MATH_BATCH7_WAVE_A}=require(path.resolve(".learning-test-dist/src/lib/learning/mathBatch7WaveA.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {subitizingGlanceConfig,isSubitizingGlanceActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/subitizingGlanceConfig.js"));

const expected=new Map([
  ["math-subitize-2",{prompt:"Tanpa menghitung lama, berapa titik yang terlihat: ● ● ?",choices:["1","2","3"],correct:"2",mode:"pair",cells:[3,5]}],
  ["math-subitize-4",{prompt:"Lihat pola ● ● / ● ●. Ada berapa titik?",choices:["3","4","5"],correct:"4",mode:"square",cells:[0,2,6,8]}],
  ["math-subitize-5",{prompt:"Lihat pola seperti dadu lima. Berapa jumlah titiknya?",choices:["4","5","6"],correct:"5",mode:"dice_five",cells:[0,2,4,6,8]}]
]);

const scoped=ACTIVITIES.filter(activity=>isSubitizingGlanceActivity(activity));
assert.equal(scoped.length,3,"subitizing-glance family must remain exactly three audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Math Wave A subitizing choices use Pattern 44");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["subitizing_glance"]));

const authoring=new Map(MATH_BATCH7_WAVE_A.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
assert.equal(authoring.size,3,"all Pattern 44 activities remain owned by Math Wave A authoring");

const manifestPack=CONTENT_PACKS.find(pack=>pack.id==="math.pack.subitizing");
assert(manifestPack,"canonical Pattern 44 content pack remains in manifest");
assert.equal(manifestPack.stageId,"math-jumlah-dasar");

for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,"activity remains in frozen Pattern 44 snapshot");
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-jumlah-dasar");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.prompt,snapshot.prompt);
  assert.deepEqual(activity.choices,snapshot.choices);
  assert.equal(activity.correctChoice,snapshot.correct);
  assert.equal(canonicalGameplayPattern(activity),"subitizing_glance");

  const config=subitizingGlanceConfig(activity);
  assert(config,"activity has fail-closed explicit subitizing config");
  assert.equal(config.mode,snapshot.mode);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);
  assert.deepEqual([...config.dotCells],snapshot.cells);
  assert.equal(config.dotCells.length,Number(snapshot.correct));
  assert.equal(new Set(config.dotCells).size,config.dotCells.length);
  assert(config.dotCells.every(cell=>Number.isInteger(cell)&&cell>=0&&cell<=8));
  assert(config.accessiblePatternLabel&&config.cue&&config.successText);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,"activity keeps learning spec");
  assert.equal(spec.subjectId,"math");
  assert.equal(spec.stageId,"math-jumlah-dasar");
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:"math.quantity.subitizing",weight:1}]);

  const seed=authoring.get(activity.id);
  assert(seed,"activity keeps Math Wave A authoring seed");
  assert.equal(seed.packId,"math.pack.subitizing");
  assert.equal(seed.lessonId,"math-subitizing");
  assert.equal(seed.skillId,"math.quantity.subitizing");
  assert.deepEqual(seed.choices,snapshot.choices);
  assert.equal(seed.correctChoice,snapshot.correct);

  const manifestActivity=manifestPack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,"activity remains in canonical subitizing pack");
  assert.equal(manifestActivity.lessonId,"math-subitizing");
  assert.equal(manifestActivity.mechanicId,"tap_choice");
  assert.equal(manifestActivity.assessment,"assessed");
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(manifestActivity.skills,[{skillId:"math.quantity.subitizing",weight:1}]);
}

for(const id of ["math-count-4","math-match-number-quantity-1-2","math-recognize-0","math-pattern-ab-shapes"]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,"excluded sentinel remains in catalog: "+id);
  assert.equal(isSubitizingGlanceActivity(activity),false);
  assert.notEqual(canonicalGameplayPattern(activity),"subitizing_glance");
}
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="math-count-4")),"count_and_select");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="math-match-number-quantity-1-2")),"visible_matching");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="math-pattern-ab-shapes")),"pattern_completion");

const first=scoped[0];
assert(first,"Pattern 44 representative exists");
assert.equal(subitizingGlanceConfig({...first,correctChoice:first.choices?.[0]}),null);
assert.equal(subitizingGlanceConfig({...first,choices:[...(first.choices??[])].reverse()}),null);
assert.equal(subitizingGlanceConfig({...first,prompt:String(first.prompt)+" "}),null);
assert.equal(subitizingGlanceConfig({...first,stageId:"math-banding-bentuk"}),null);
assert.equal(subitizingGlanceConfig({...first,subjectId:"logic"}),null);
assert.equal(subitizingGlanceConfig({...first,runtime:"listen_and_choose"}),null);

console.log("Pattern 44 subitizing glance regression passed: exact three Math Wave A activities preserve canonical content, authoring, manifest, skill and evidence ownership.");
