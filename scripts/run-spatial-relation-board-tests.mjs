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
const {LOGIC_BATCH12_WAVE_B}=require(path.resolve(".learning-test-dist/src/lib/learning/logicBatch12WaveB.js"));
const {MATH_BATCH7_WAVE_D}=require(path.resolve(".learning-test-dist/src/lib/learning/mathBatch7WaveD.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {isSpatialRelationBoardActivity,spatialRelationBoardConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/spatialRelationBoardConfig.js"));

const expected=new Map([
  ["logic-spatial-star-left-circle",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Mana yang menunjukkan bintang di kiri lingkaran?",choices:["★ ○","○ ★","★ ★"],correct:"★ ○",kind:"left_of",mode:"object_relation",anchor:"○",moving:"★"}],
  ["logic-spatial-circle-right-triangle",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Mana yang menunjukkan lingkaran di kanan segitiga?",choices:["▲ ○","○ ▲","▲ ▲"],correct:"▲ ○",kind:"right_of",mode:"object_relation",anchor:"▲",moving:"○"}],
  ["logic-spatial-circle-between-stars",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Mana yang menaruh lingkaran di antara dua bintang?",choices:["★ ○ ★","○ ★ ★","★ ★ ○"],correct:"★ ○ ★",kind:"between",mode:"object_relation",anchor:"★",moving:"○"}],
  ["logic-spatial-turn-right-from-up",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Jika menghadap ↑ lalu belok kanan, menghadap ke mana?",choices:["→","←","↓"],correct:"→",kind:"turn_right",mode:"turn",anchor:"↑",moving:"→"}],
  ["logic-spatial-turn-left-from-right",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Jika menghadap → lalu belok kiri, menghadap ke mana?",choices:["↑","↓","←"],correct:"↑",kind:"turn_left",mode:"turn",anchor:"→",moving:"↑"}],
  ["logic-spatial-opposite-left",{subject:"logic",stage:"logic-patterns-sequences-relations",pack:"logic.pack.spatial-relations",lesson:"logic-spatial-relations",skill:"logic.spatial.relation.basic",prompt:"Arah apa yang berlawanan dengan ← ?",choices:["→","↑","↓"],correct:"→",kind:"opposite",mode:"opposite",anchor:"←",moving:"→"}],

  ["math-spatial-above",{subject:"math",stage:"math-ukur-ruang",pack:"math.pack.spatial-position",lesson:"math-spatial-position",skill:"math.spatial.position",prompt:"Bola berada di atas kotak. Posisi bola?",choices:["di atas","di bawah","di dalam"],correct:"di atas",kind:"above",mode:"object_relation",anchor:"📦",moving:"⚽"}],
  ["math-spatial-left",{subject:"math",stage:"math-ukur-ruang",pack:"math.pack.spatial-position",lesson:"math-spatial-position",skill:"math.spatial.position",prompt:"Kucing ada di kiri robot. Posisi kucing?",choices:["kiri","kanan","tengah"],correct:"kiri",kind:"left_of",mode:"object_relation",anchor:"🤖",moving:"🐱"}],
  ["math-spatial-inside",{subject:"math",stage:"math-ukur-ruang",pack:"math.pack.spatial-position",lesson:"math-spatial-position",skill:"math.spatial.position",prompt:"Mainan dimasukkan ke kotak. Mainan sekarang berada di mana?",choices:["di dalam","di atas","di luar"],correct:"di dalam",kind:"inside",mode:"containment",anchor:"📦",moving:"🧸"}],
  ["math-spatial-near",{subject:"math",stage:"math-ukur-ruang",pack:"math.pack.spatial-position",lesson:"math-spatial-position",skill:"math.spatial.position",prompt:"Paca berdiri dekat pintu dan jauh dari pohon. Apa yang lebih dekat ke Paca?",choices:["pintu","pohon","sama"],correct:"pintu",kind:"near",mode:"proximity",anchor:"Paca",moving:"🚪 Pintu",secondaryAnchor:"🌳 Pohon"}],
  ["math-spatial-between",{subject:"math",stage:"math-ukur-ruang",pack:"math.pack.spatial-position",lesson:"math-spatial-position",skill:"math.spatial.position",prompt:"Urutannya Gavi — Paca — Zia. Siapa yang berada di antara Gavi dan Zia?",choices:["Gavi","Paca","Zia"],correct:"Paca",kind:"between",mode:"object_relation",anchor:"Gavi",moving:"Paca",secondaryAnchor:"Zia"}]
]);

const scoped=ACTIVITIES.filter(activity=>isSpatialRelationBoardActivity(activity));
assert.equal(scoped.length,11,"spatial-relation-board family must contain exactly six Logic + five Math activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Logic and Math spatial activities use spatial_relation_board");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["spatial_relation_board"]));

const logicAuthoring=new Map(LOGIC_BATCH12_WAVE_B.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
const mathAuthoring=new Map(MATH_BATCH7_WAVE_D.activities.filter(seed=>expected.has(seed.id)).map(seed=>[seed.id,seed]));
assert.equal(logicAuthoring.size,6,"all six legacy Logic activities remain in Logic Wave B authoring");
assert.equal(mathAuthoring.size,5,"all five Math reuse activities remain in Math Wave D authoring");

const logicPack=CONTENT_PACKS.find(pack=>pack.id==="logic.pack.spatial-relations");
const mathPack=CONTENT_PACKS.find(pack=>pack.id==="math.pack.spatial-position");
assert(logicPack,"Logic spatial pack remains in manifest");
assert(mathPack,"Math spatial-position pack remains in manifest");
assert.equal(logicPack.stageId,"logic-patterns-sequences-relations");
assert.equal(mathPack.stageId,"math-ukur-ruang");

for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,activity.id+" remains in frozen spatial-relation reuse snapshot");
  assert.equal(activity.subjectId,snapshot.subject,activity.id+" keeps canonical subject");
  assert.equal(activity.stageId,snapshot.stage,activity.id+" keeps canonical stage");
  assert.equal(activity.runtime,"tap_choice",activity.id+" keeps canonical tap_choice runtime");
  assert.equal(activity.prompt,snapshot.prompt,activity.id+" prompt remains byte-for-byte canonical");
  assert.deepEqual(activity.choices,snapshot.choices,activity.id+" choices remain canonical and ordered");
  assert.equal(activity.correctChoice,snapshot.correct,activity.id+" correctChoice remains canonical");
  assert.equal(canonicalGameplayPattern(activity),"spatial_relation_board",activity.id+" classifies as existing spatial_relation_board");

  const config=spatialRelationBoardConfig(activity);
  assert(config,activity.id+" has fail-closed explicit spatial config");
  assert.equal(config.kind,snapshot.kind);
  assert.equal(config.mode,snapshot.mode);
  assert.equal(config.anchor,snapshot.anchor);
  assert.equal(config.moving,snapshot.moving);
  assert.equal(config.secondaryAnchor,snapshot.secondaryAnchor);
  assert.equal(config.expectedSubjectId,snapshot.subject);
  assert.equal(config.expectedStageId,snapshot.stage);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,activity.id+" keeps learning spec");
  assert.equal(spec.subjectId,snapshot.subject);
  assert.equal(spec.stageId,snapshot.stage);
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:snapshot.skill,weight:1}],activity.id+" keeps exact skill evidence");

  const seed=(snapshot.subject==="logic"?logicAuthoring:mathAuthoring).get(activity.id);
  assert(seed,activity.id+" keeps canonical authoring seed");
  assert.equal(seed.packId,snapshot.pack);
  assert.equal(seed.lessonId,snapshot.lesson);
  assert.equal(seed.skillId,snapshot.skill);
  assert.deepEqual(seed.choices,snapshot.choices);
  assert.equal(seed.correctChoice,snapshot.correct);

  const pack=snapshot.subject==="logic"?logicPack:mathPack;
  const manifestActivity=pack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,activity.id+" remains in canonical content pack");
  assert.equal(manifestActivity.lessonId,snapshot.lesson);
  assert.equal(manifestActivity.mechanicId,"tap_choice");
  assert.equal(manifestActivity.assessment,"assessed");
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1");
  assert.deepEqual(manifestActivity.skills,[{skillId:snapshot.skill,weight:1}]);
}

const mathIds=[...expected.entries()].filter(([,value])=>value.subject==="math").map(([id])=>id);
assert.deepEqual(new Set(mathIds),new Set([
  "math-spatial-above","math-spatial-left","math-spatial-inside","math-spatial-near","math-spatial-between"
]));

for(const id of [
  "logic-spatial-halfturn-up",
  "logic-order-first-after-start",
  "logic-compare-longer-bars",
  "logic-pattern-aab-stars",
  "logic-odd-direction-right",
  "math-measure-longer",
  "math-review-pattern",
  "science-force-push-door"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,id+" remains in catalog");
  assert.equal(isSpatialRelationBoardActivity(activity),false,id+" stays outside spatial_relation_board scope");
  assert.notEqual(canonicalGameplayPattern(activity),"spatial_relation_board",id+" must not classify as spatial_relation_board");
}

for(const id of ["logic-spatial-star-left-circle","math-spatial-above","math-spatial-near"]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,id+" drift representative exists");
  assert.equal(spatialRelationBoardConfig({...activity,correctChoice:activity.choices?.[1]}),null,id+" changed correctChoice fails closed");
  assert.equal(spatialRelationBoardConfig({...activity,choices:[...(activity.choices??[])].reverse()}),null,id+" changed choice order fails closed");
  assert.equal(spatialRelationBoardConfig({...activity,prompt:activity.prompt+" "}),null,id+" changed prompt fails closed");
  assert.equal(spatialRelationBoardConfig({...activity,stageId:activity.stageId==="math-ukur-ruang"?"math-banding-bentuk":"logic-mixed-reasoning-challenge"}),null,id+" wrong stage fails closed");
  assert.equal(spatialRelationBoardConfig({...activity,subjectId:activity.subjectId==="math"?"logic":"math"}),null,id+" wrong subject fails closed");
  assert.equal(spatialRelationBoardConfig({...activity,runtime:"matching"}),null,id+" wrong runtime fails closed");
}

console.log("Spatial Relation Board regression passed: exact 11-ID Logic+Math reuse preserves runtime, authoring, manifest, skill and evidence ownership.");
