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
const {SCIENCE_BATCH13_WAVE_B}=require(path.resolve(".learning-test-dist/src/lib/learning/scienceBatch13WaveB.js"));
const {canonicalGameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPatternClassifier.js"));
const {growthStageTransitionConfig,isGrowthStageTransitionActivity}=require(path.resolve(".learning-test-dist/src/lib/learning/growthStageTransitionConfig.js"));

const expected=new Map([
  ["science-cycle-frog",{prompt:"Sebelum menjadi katak dewasa, anak katak hidup di air sebagai apa?",choices:["berudu","ulat","anak ayam"],correct:"berudu",mode:"previous_stage",direction:"backward",known:"adult_frog",target:"tadpole"}],
  ["science-cycle-chick",{prompt:"Anak ayam akan tumbuh menjadi apa?",choices:["ayam dewasa","bebek dewasa","burung merpati"],correct:"ayam dewasa",mode:"next_adult_stage",direction:"forward",known:"chick",target:"adult_chicken"}],
  ["science-cycle-seed-sprout",{prompt:"Setelah biji mulai tumbuh, tahap muda yang muncul disebut apa?",choices:["kecambah","batu","buah matang"],correct:"kecambah",mode:"next_young_stage",direction:"forward",known:"seed",target:"sprout"}]
]);

const scoped=ACTIVITIES.filter(activity=>isGrowthStageTransitionActivity(activity));
assert.equal(scoped.length,3,"growth-stage-transition family must remain exactly three audited activities");
assert.deepEqual(new Set(scoped.map(activity=>activity.id)),new Set(expected.keys()),"only audited Science life-cycle choices use Pattern 42");
assert.deepEqual(new Set(scoped.map(activity=>canonicalGameplayPattern(activity))),new Set(["growth_stage_transition"]));

const authoring=new Map(
  SCIENCE_BATCH13_WAVE_B.activities
    .filter(seed=>expected.has(seed.id))
    .map(seed=>[seed.id,seed])
);
assert.equal(authoring.size,3,"all Pattern 42 activities remain owned by Science Wave B authoring");

const manifestPack=CONTENT_PACKS.find(pack=>pack.id==="science.pack.life-cycles");
assert(manifestPack,"canonical Pattern 42 content pack remains in manifest");
assert.equal(manifestPack.stageId,"science-life-material-motion","Pattern 42 pack keeps canonical stage ownership");

const seenModes=new Set();
let sceneCount=0;
for(const activity of scoped){
  const snapshot=expected.get(activity.id);
  assert(snapshot,`${activity.id} remains in frozen Pattern 42 audit snapshot`);
  assert.equal(activity.subjectId,"science",`${activity.id} remains Science`);
  assert.equal(activity.stageId,"science-life-material-motion",`${activity.id} remains in canonical Science stage`);
  assert.equal(activity.runtime,"tap_choice",`${activity.id} keeps canonical tap_choice runtime`);
  assert.equal(activity.prompt,snapshot.prompt,`${activity.id} prompt remains byte-for-byte canonical`);
  assert.deepEqual(activity.choices,snapshot.choices,`${activity.id} choices remain canonical and ordered`);
  assert.equal(activity.correctChoice,snapshot.correct,`${activity.id} correctChoice remains canonical`);
  assert.equal(canonicalGameplayPattern(activity),"growth_stage_transition",`${activity.id} is canonical Pattern 42`);

  const config=growthStageTransitionConfig(activity);
  assert(config,`${activity.id} has fail-closed explicit transition config`);
  assert.equal(config.mode,snapshot.mode,`${activity.id} keeps audited transition mode`);
  assert.equal(config.direction,snapshot.direction,`${activity.id} keeps audited transition direction`);
  assert.equal(config.knownStageKey,snapshot.known,`${activity.id} keeps audited known stage`);
  assert.equal(config.targetStageKey,snapshot.target,`${activity.id} keeps audited target stage`);
  assert.equal(config.expectedPrompt,snapshot.prompt);
  assert.deepEqual([...config.expectedChoices],snapshot.choices);
  assert.equal(config.expectedCorrectChoice,snapshot.correct);
  assert.deepEqual(config.choiceScenes.map(scene=>scene.label),snapshot.choices,`${activity.id} maps visuals to canonical choice order`);
  assert.equal(config.choiceScenes.length,3,`${activity.id} has exactly three deterministic choice scenes`);
  assert(config.choiceScenes.every(scene=>scene.stageKey&&scene.icon&&scene.accessibleLabel),`${activity.id} choice scenes remain explicit and accessible`);
  const targetScenes=config.choiceScenes.filter(scene=>scene.stageKey===config.targetStageKey);
  assert.deepEqual(targetScenes.map(scene=>scene.label),[snapshot.correct],`${activity.id} target stage maps to one canonical correct choice only`);
  seenModes.add(config.mode);
  sceneCount+=config.choiceScenes.length;

  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} keeps learning spec`);
  assert.equal(spec.subjectId,"science",`${activity.id} learning spec keeps subject`);
  assert.equal(spec.stageId,"science-life-material-motion",`${activity.id} learning spec keeps stage`);
  assert.equal(spec.assessment,"assessed",`${activity.id} remains assessed`);
  assert.deepEqual(spec.skills,[{skillId:"science.life_cycles.basic",weight:1}],`${activity.id} keeps exact life-cycle skill evidence`);

  const seed=authoring.get(activity.id);
  assert(seed,`${activity.id} keeps Science Wave B authoring seed`);
  assert.equal(seed.packId,"science.pack.life-cycles",`${activity.id} keeps canonical pack`);
  assert.equal(seed.lessonId,"science-life-cycles",`${activity.id} keeps canonical lesson`);
  assert.equal(seed.skillId,"science.life_cycles.basic",`${activity.id} keeps canonical skill`);
  assert.deepEqual(seed.choices,snapshot.choices,`${activity.id} authoring choices remain canonical`);
  assert.equal(seed.correctChoice,snapshot.correct,`${activity.id} authoring correctChoice remains canonical`);

  const manifestActivity=manifestPack.activities.find(item=>item.activityId===activity.id);
  assert(manifestActivity,`${activity.id} remains in canonical life-cycle pack`);
  assert.equal(manifestActivity.lessonId,"science-life-cycles",`${activity.id} manifest keeps canonical lesson`);
  assert.equal(manifestActivity.mechanicId,"tap_choice",`${activity.id} manifest keeps canonical mechanic`);
  assert.equal(manifestActivity.assessment,"assessed",`${activity.id} manifest keeps assessed contract`);
  assert.equal(manifestActivity.evidenceContractId,"choice_accuracy_v1",`${activity.id} keeps canonical evidence contract`);
  assert.deepEqual(manifestActivity.skills,[{skillId:"science.life_cycles.basic",weight:1}],`${activity.id} manifest keeps exact skill evidence`);
}

assert.equal(sceneCount,9,"Pattern 42 config deterministically covers all nine canonical choices");
assert.deepEqual(seenModes,new Set(["previous_stage","next_adult_stage","next_young_stage"]),"Pattern 42 covers all three audited transition modes");

for(const id of [
  "science-cycle-butterfly",
  "science-match-young-adult-b",
  "science-water-ice-melts",
  "logic-order-first-after-start"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(isGrowthStageTransitionActivity(activity),false,`${id} stays outside Pattern 42 scope`);
  assert.notEqual(canonicalGameplayPattern(activity),"growth_stage_transition",`${id} must not classify as Pattern 42`);
}

assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="science-water-ice-melts")),"cause_effect","existing cause_effect family stays unchanged");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="logic-order-first-after-start")),"relative_order_track","existing relative_order_track family stays unchanged");
assert.equal(canonicalGameplayPattern(ACTIVITIES.find(item=>item.id==="science-match-young-adult-b")),"visible_matching","life-cycle matching keeps canonical matching pattern");

const first=scoped[0];
assert(first,"Pattern 42 representative exists");
assert.equal(growthStageTransitionConfig({...first,correctChoice:first.choices?.[1]}),null,"changed correctChoice fails closed");
assert.equal(growthStageTransitionConfig({...first,choices:[...(first.choices??[])].reverse()}),null,"changed choice order fails closed");
assert.equal(growthStageTransitionConfig({...first,prompt:`${first.prompt} `}),null,"changed canonical prompt fails closed");
assert.equal(growthStageTransitionConfig({...first,stageId:"science-living-observation-basics"}),null,"wrong stage fails closed");
assert.equal(growthStageTransitionConfig({...first,subjectId:"math"}),null,"wrong subject fails closed");
assert.equal(growthStageTransitionConfig({...first,runtime:"listen_and_choose"}),null,"wrong runtime fails closed");

console.log("Pattern 42 growth stage transition regression passed: exact three activities preserve content, authoring, manifest, skill and evidence ownership across nine deterministic choice scenes and three transition modes.");
