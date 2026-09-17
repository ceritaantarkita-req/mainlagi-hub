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
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {isSpatialRelationBoardActivity,spatialRelationBoardConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/spatialRelationBoardConfig.js"));

const expected=new Map([
  ["logic-spatial-star-left-circle",{prompt:"Mana yang menunjukkan bintang di kiri lingkaran?",choices:["★ ○","○ ★","★ ★"],correct:"★ ○",kind:"left_of",anchor:"○",moving:"★"}],
  ["logic-spatial-circle-right-triangle",{prompt:"Mana yang menunjukkan lingkaran di kanan segitiga?",choices:["▲ ○","○ ▲","▲ ▲"],correct:"▲ ○",kind:"right_of",anchor:"▲",moving:"○"}],
  ["logic-spatial-circle-between-stars",{prompt:"Mana yang menaruh lingkaran di antara dua bintang?",choices:["★ ○ ★","○ ★ ★","★ ★ ○"],correct:"★ ○ ★",kind:"between",anchor:"★",moving:"○"}],
  ["logic-spatial-turn-right-from-up",{prompt:"Jika menghadap ↑ lalu belok kanan, menghadap ke mana?",choices:["→","←","↓"],correct:"→",kind:"turn_right",anchor:"↑",moving:"→"}],
  ["logic-spatial-turn-left-from-right",{prompt:"Jika menghadap → lalu belok kiri, menghadap ke mana?",choices:["↑","↓","←"],correct:"↑",kind:"turn_left",anchor:"→",moving:"↑"}],
  ["logic-spatial-opposite-left",{prompt:"Arah apa yang berlawanan dengan ← ?",choices:["→","↑","↓"],correct:"→",kind:"opposite",anchor:"←",moving:"→"}]
]);

const scoped=ACTIVITIES.filter(activity=>isSpatialRelationBoardActivity(activity));
assert.equal(scoped.length,6,"spatial-relation-board family must remain exactly six audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Logic spatial activities use Pattern 40");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["spatial_relation_board"]));

const authoring=new Map(
  LOGIC_BATCH12_WAVE_B.activities
    .filter(seed=>expected.has(seed.id))
    .map(seed=>[seed.id,seed])
);
assert.equal(authoring.size,6,"all Pattern 40 activities remain owned by Logic Wave B authoring");

const manifestPack=CONTENT_PACKS.find(pack=>pack.id==="logic.pack.spatial-relations");
assert(manifestPack,"canonical Pattern 40 content pack remains in manifest");
assert.equal(manifestPack.stageId,"logic-patterns-sequences-relations","Pattern 40 pack keeps canonical stage ownership");

for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,`${activity.id} remains in frozen Pattern 40 audit snapshot`);
  assert.equal(activity.subjectId,"logic",`${activity.id} remains Logic`);
  assert.equal(activity.stageId,"logic-patterns-sequences-relations",`${activity.id} remains in canonical Logic spatial stage`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.prompt,snapshot.prompt,`${activity.id} prompt remains byte-for-byte canonical`);
  assert.deepEqual(activity.choices,snapshot.choices,`${activity.id} choices remain canonical and ordered`);
  assert.equal(activity.correctChoice,snapshot.correct,`${activity.id} correctChoice remains canonical`);
  assert.equal(canonicalGameplayPattern(activity),"spatial_relation_board",`${activity.id} is canonical Pattern 40`);

  const config=spatialRelationBoardConfig(activity);
  assert(config,`${activity.id} has fail-closed explicit spatial config`);
  assert.equal(config.kind,snapshot.kind);
  assert.equal(config.anchor,snapshot.anchor);
  assert.equal(config.moving,snapshot.moving);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.subjectId,"logic",`${activity.id} learning spec keeps subject`);
  assert.equal(spec.stageId,"logic-patterns-sequences-relations",`${activity.id} learning spec keeps stage`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills,[{skillId:"logic.spatial.relation.basic",weight:1}],`${activity.id} keeps exact spatial-relation skill evidence`);

  const seed=authoring.get(activity.id);
  assert(seed,`${activity.id} keeps Logic Wave B authoring seed`);
  assert.equal(seed.packId,"logic.pack.spatial-relations",`${activity.id} keeps canonical pack`);
  assert.equal(seed.lessonId,"logic-spatial-relations",`${activity.id} keeps canonical lesson`);
  assert.equal(seed.skillId,"logic.spatial.relation.basic",`${activity.id} keeps canonical skill`);
  assert.deepEqual(seed.choices,snapshot.choices,`${activity.id} authoring choices remain canonical`);
  assert.equal(seed.correctChoice,snapshot.correct,`${activity.id} authoring correctChoice remains canonical`);

  const manifestActivity=manifestPack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,`${activity.id} remains in canonical spatial-relations pack`);
  assert.equal(manifestActivity.lessonId,"logic-spatial-relations",`${activity.id} manifest keeps canonical lesson`);
  assert.equal(manifestActivity.mechanicId,"tap_choice",`${activity.id} manifest keeps canonical mechanic`);
  assert.equal(manifestActivity.assessment,"assessed",`${activity.id} manifest keeps assessed contract`);
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1",`${activity.id} keeps canonical evidence contract`);
  assert.deepEqual(manifestActivity.skills,[{skillId:"logic.spatial.relation.basic",weight:1}],`${activity.id} manifest keeps exact skill evidence`);
}

assert.deepEqual(new Set(scoped.map(activity=>spatialRelationBoardConfig(activity)?.kind)),new Set(["left_of","right_of","between","turn_right","turn_left","opposite"]),"Pattern 40 covers every audited spatial relation branch exactly");

for(const id of [
  "logic-spatial-halfturn-up",
  "logic-order-first-after-start",
  "logic-compare-longer-bars",
  "logic-pattern-aab-stars",
  "logic-odd-direction-right",
  "math-spatial-above",
  "science-force-push-door"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isSpatialRelationBoardActivity(activity),false,`${id} stays outside Pattern 40 scope`);
  assert.notEqual(canonicalGameplayPattern(activity),"spatial_relation_board",`${id} must not classify as Pattern 40`);
}

const first=scoped[0];
assert(first,"Pattern 40 representative exists");
assert.equal(spatialRelationBoardConfig({...first,correctChoice:first.choices?.[1]}),null,"changed correctChoice fails closed");
assert.equal(spatialRelationBoardConfig({...first,choices:[...(first.choices??[])].reverse()}),null,"changed choice order fails closed");
assert.equal(spatialRelationBoardConfig({...first,prompt:`${first.prompt} `}),null,"changed canonical prompt fails closed");
assert.equal(spatialRelationBoardConfig({...first,stageId:"logic-mixed-reasoning-challenge"}),null,"wrong stage fails closed");
assert.equal(spatialRelationBoardConfig({...first,subjectId:"math"}),null,"wrong subject fails closed");
assert.equal(spatialRelationBoardConfig({...first,runtime:"matching"}),null,"wrong runtime fails closed");

console.log("Pattern 40 spatial relation board regression passed: exact six activities preserve runtime, authoring, manifest, skill and evidence ownership.");
