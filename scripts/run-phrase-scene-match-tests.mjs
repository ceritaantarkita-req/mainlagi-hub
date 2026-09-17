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
const {ENGLISH_BATCH9_WAVE_D}=require(path.resolve(".learning-test-dist/src/lib/learning/englishBatch9WaveD.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {isPhraseSceneMatchActivity,phraseSceneMatchConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/phraseSceneMatchConfig.js"));

const expected=new Map([
  ["english-phrase-red-ball",{prompt:"Which picture matches A RED BALL?",choices:["🔴⚽","🔵⚽","🔴📘"],correct:"🔴⚽",target:"A RED BALL",features:["color","noun","quantity"]}],
  ["english-phrase-two-books",{prompt:"Which choice shows TWO BOOKS?",choices:["📘","📘📘","📘📘📘"],correct:"📘📘",target:"TWO BOOKS",features:["quantity","noun"]}],
  ["english-phrase-small-cat",{prompt:"Which phrase means a small cat?",choices:["A SMALL CAT","A BIG DOG","TWO CATS"],correct:"A SMALL CAT",target:"A SMALL CAT",features:["size","noun","quantity"]}],
  ["english-phrase-yellow-banana",{prompt:"Which phrase matches 🍌?",choices:["A GREEN APPLE","A YELLOW BANANA","A RED BALL"],correct:"A YELLOW BANANA",target:"A YELLOW BANANA",features:["color","noun","quantity"]}]
]);

const scoped=ACTIVITIES.filter(activity=>isPhraseSceneMatchActivity(activity));
assert.equal(scoped.length,4,"phrase-scene-match family must remain exactly four audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited English simple-phrase choices use Pattern 41");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["phrase_scene_match"]));

const authoring=new Map(
  ENGLISH_BATCH9_WAVE_D.activities
    .filter(seed=>expected.has(seed.id))
    .map(seed=>[seed.id,seed])
);
assert.equal(authoring.size,4,"all Pattern 41 activities remain owned by English Wave D authoring");

const manifestPack=CONTENT_PACKS.find(pack=>pack.id==="english.pack.simple-phrases");
assert(manifestPack,"canonical Pattern 41 content pack remains in manifest");
assert.equal(manifestPack.stageId,"english-phrases-review","Pattern 41 pack keeps canonical stage ownership");

let sceneCount=0;
const featureKinds=new Set();
for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,`${activity.id} remains in frozen Pattern 41 audit snapshot`);
  assert.equal(activity.subjectId,"english",`${activity.id} remains English`);
  assert.equal(activity.stageId,"english-phrases-review",`${activity.id} remains in canonical English phrase stage`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.prompt,snapshot.prompt,`${activity.id} prompt remains byte-for-byte canonical`);
  assert.deepEqual(activity.choices,snapshot.choices,`${activity.id} choices remain canonical and ordered`);
  assert.equal(activity.correctChoice,snapshot.correct,`${activity.id} correctChoice remains canonical`);
  assert.equal(canonicalGameplayPattern(activity),"phrase_scene_match",`${activity.id} is canonical Pattern 41`);

  const config=phraseSceneMatchConfig(activity);
  assert(config,`${activity.id} has fail-closed explicit phrase-scene config`);
  assert.equal(config.targetPhrase,snapshot.target,`${activity.id} keeps audited target phrase`);
  assert.deepEqual(config.featureKinds,snapshot.features,`${activity.id} keeps audited semantic feature set`);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);
  assert.deepEqual(config.scenes.map(scene=>scene.label),snapshot.choices,`${activity.id} maps every scene to canonical choice order`);
  assert.equal(config.scenes.length,3,`${activity.id} has exactly three deterministic scenes`);
  assert(config.scenes.every(scene=>scene.accessibleLabel&&scene.quantity>=1&&scene.quantity<=3),`${activity.id} scenes are accessible and bounded`);
  sceneCount+=config.scenes.length;
  for(const feature of config.featureKinds)featureKinds.add(feature);

  const correctScene=config.scenes.find(scene=>scene.label===snapshot.correct);
  assert(correctScene,`${activity.id} has scene for canonical correctChoice`);
  const semanticMatches=config.scenes.filter(scene=>config.featureKinds.every(kind=>{
    if(kind==="noun")return scene.noun===correctScene.noun;
    if(kind==="quantity")return scene.quantity===correctScene.quantity;
    if(kind==="color")return scene.color===correctScene.color;
    return scene.size===correctScene.size;
  }));
  assert.deepEqual(semanticMatches.map(scene=>scene.label),[snapshot.correct],`${activity.id} semantic target maps to one canonical choice only`);

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.subjectId,"english",`${activity.id} learning spec keeps subject`);
  assert.equal(spec.stageId,"english-phrases-review",`${activity.id} learning spec keeps stage`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills,[{skillId:"english.phrase.literal",weight:1}],`${activity.id} keeps exact phrase skill evidence`);

  const seed=authoring.get(activity.id);
  assert(seed,`${activity.id} keeps English Wave D authoring seed`);
  assert.equal(seed.packId,"english.pack.simple-phrases",`${activity.id} keeps canonical pack`);
  assert.equal(seed.lessonId,"english-simple-phrases",`${activity.id} keeps canonical lesson`);
  assert.equal(seed.skillId,"english.phrase.literal",`${activity.id} keeps canonical skill`);
  assert.deepEqual(seed.choices,snapshot.choices,`${activity.id} authoring choices remain canonical`);
  assert.equal(seed.correctChoice,snapshot.correct,`${activity.id} authoring correctChoice remains canonical`);

  const manifestActivity=manifestPack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,`${activity.id} remains in canonical simple-phrases pack`);
  assert.equal(manifestActivity.lessonId,"english-simple-phrases",`${activity.id} manifest keeps canonical lesson`);
  assert.equal(manifestActivity.mechanicId,"tap_choice",`${activity.id} manifest keeps canonical mechanic`);
  assert.equal(manifestActivity.assessment,"assessed",`${activity.id} manifest keeps assessed contract`);
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1",`${activity.id} keeps canonical evidence contract`);
  assert.deepEqual(manifestActivity.skills,[{skillId:"english.phrase.literal",weight:1}],`${activity.id} manifest keeps exact skill evidence`);
}

assert.equal(sceneCount,12,"Pattern 41 config deterministically covers all twelve canonical choices");
assert.deepEqual(featureKinds,new Set(["color","quantity","size","noun"]),"Pattern 41 covers audited color, quantity, size and noun composition");

for(const id of [
  "english-listen-phrase-blue-book",
  "english-complete-cat-sleeps",
  "english-food-apple",
  "english-opposite-big-small"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isPhraseSceneMatchActivity(activity),false,`${id} stays outside Pattern 41 scope`);
  assert.notEqual(canonicalGameplayPattern(activity),"phrase_scene_match",`${id} must not classify as Pattern 41`);
}

const first=scoped[0];
assert(first,"Pattern 41 representative exists");
assert.equal(phraseSceneMatchConfig({...first,correctChoice:first.choices?.[1]}),null,"changed correctChoice fails closed");
assert.equal(phraseSceneMatchConfig({...first,choices:[...(first.choices??[])].reverse()}),null,"changed choice order fails closed");
assert.equal(phraseSceneMatchConfig({...first,prompt:`${first.prompt} `}),null,"changed canonical prompt fails closed");
assert.equal(phraseSceneMatchConfig({...first,stageId:"english-words-actions"}),null,"wrong stage fails closed");
assert.equal(phraseSceneMatchConfig({...first,subjectId:"bahasa"}),null,"wrong subject fails closed");
assert.equal(phraseSceneMatchConfig({...first,runtime:"listen_and_choose"}),null,"wrong runtime fails closed");

console.log("Pattern 41 phrase scene match regression passed: exact four activities preserve content, authoring, manifest, skill and evidence ownership across twelve deterministic choice scenes.");
