import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);

const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {ACTIVITY_LEARNING_SPECS}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {patternCompletionConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/patternCompletionConfig.js"));

const legacyMathIds=[
  "math-pattern-ab-shapes",
  "math-pattern-aab-colors",
  "math-pattern-number-step-one",
  "math-pattern-number-step-two",
  "math-pattern-size"
];

const logicIds=[
  "logic-pattern-aab-stars",
  "logic-pattern-abb-shapes",
  "logic-pattern-abc-shapes",
  "logic-pattern-paired-blocks",
  "logic-pattern-abba"
];

const exactIds=[...legacyMathIds,...logicIds];
const family=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="pattern_completion");

assert.equal(family.length,10,"pattern_completion must contain exactly ten activities");
assert.deepEqual(new Set(family.map(activity=>activity.id)),new Set(exactIds),"pattern_completion membership must stay exact");

for(const id of legacyMathIds){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} exists`);
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-banding-bentuk");
  assert.equal(choiceGameplayPresentation(activity),"pattern_completion");
  const config=patternCompletionConfig(activity);
  assert(config,`${id} keeps explicit config`);
  assert.equal(config.nextValue,activity.correctChoice,`${id} unresolved slot remains canonical`);
}

for(const id of logicIds){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} exists`);
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-patterns-sequences-relations");
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(choiceGameplayPresentation(activity),"pattern_completion");

  const config=patternCompletionConfig(activity);
  assert(config,`${id} has explicit fail-closed config`);
  assert.equal(config.nextValue,activity.correctChoice,`${id} unresolved slot maps to canonical answer`);
  assert.deepEqual(activity.choices, [...activity.choices],`${id} keeps canonical choice order`);

  const spec=ACTIVITY_LEARNING_SPECS[id];
  assert(spec,`${id} has learning spec`);
  assert.equal(spec.subjectId,"logic");
  assert.equal(spec.stageId,"logic-patterns-sequences-relations");
  assert.equal(spec.assessment,"assessed");
  assert.deepEqual(spec.skills,[{skillId:"logic.pattern.repeat.intermediate",weight:1}],`${id} keeps canonical Logic repeating-pattern skill`);

  const driftCases=[
    {...activity,id:`${id}-drift`},
    {...activity,subjectId:"math"},
    {...activity,stageId:"logic-mixed-reasoning-challenge"},
    {...activity,runtime:"matching"},
    {...activity,title:`${activity.title} drift`},
    {...activity,prompt:`${activity.prompt} drift`},
    {...activity,choices:[activity.choices[1],activity.choices[0],activity.choices[2]]},
    {...activity,correctChoice:activity.choices.find(choice=>choice!==activity.correctChoice)}
  ];
  for(const drift of driftCases){
    assert.equal(patternCompletionConfig(drift),null,`${id} must fail closed on canonical identity/payload drift`);
    assert.notEqual(choiceGameplayPresentation(drift),"pattern_completion",`${id} drift must not retain pattern_completion presentation`);
  }
}

const paired=ACTIVITIES.find(item=>item.id==="logic-pattern-paired-blocks");
assert(paired,"grouped-token activity exists");
assert.deepEqual(paired.choices,["● ●","▲ ●","■ ■"],"grouped-token choices remain one-step canonical groups");
assert.equal(paired.correctChoice,"● ●","grouped-token answer remains one canonical choice");
const pairedConfig=patternCompletionConfig(paired);
assert(pairedConfig,"grouped-token config exists");
assert.deepEqual(pairedConfig.sequence,["▲ ▲","● ●","▲ ▲"],"grouped-token visible sequence remains grouped");
assert.equal(pairedConfig.nextValue,"● ●","grouped-token unresolved slot remains one grouped answer");

for(const id of [
  "logic-sequence-grow-dots",
  "logic-sequence-shrink-stars",
  "logic-sequence-clockwise-full",
  "logic-compare-longer-bars",
  "logic-spatial-star-left-circle",
  "logic-compose-red-circle-to-star"
]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} exclusion exists`);
  assert.equal(patternCompletionConfig(activity),null,`${id} remains excluded from pattern_completion config`);
  assert.notEqual(choiceGameplayPresentation(activity),"pattern_completion",`${id} remains excluded from pattern_completion presentation`);
}

console.log("Logic pattern_completion reuse regression PASS: exact 10-ID family, 5 Logic IDs, fail-closed drift, grouped-token one-step evidence and neighboring exclusions.");
