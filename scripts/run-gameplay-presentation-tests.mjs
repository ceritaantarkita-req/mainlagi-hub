import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);

const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {choiceGameplayPresentation,matchingPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {numberLineConfig,numberLineValues}=require(path.resolve(".learning-test-dist/src/lib/learning/numberLineConfig.js"));
const {moreLessBalanceConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/moreLessBalanceConfig.js"));
const {patternCompletionConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/patternCompletionConfig.js"));
const {causeEffectConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/causeEffectConfig.js"));
const {comparePropertiesConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/comparePropertiesConfig.js"));

const sets={
  memory:new Set(["letters-match-case-cd","letters-match-case-ef","letters-match-case-bce","letters-match-case-gh","letters-match-case-ij","letters-match-case-klm","letters-match-case-no","letters-match-case-pq","letters-match-case-rst","letters-match-case-uv","letters-match-case-wx","letters-match-case-yz"]),
  drag:new Set(["science-match-living-nonliving","science-match-plant-parts","science-match-animal-homes-a","science-match-senses-a","science-match-weather-signs-a"]),
  sequence:new Set(["letters-order-after-g","letters-order-between-jl","letters-order-before-m","letters-order-after-n","letters-order-between-pr","letters-order-before-t","letters-order-after-u","letters-order-between-vx","letters-order-before-z","letters-order-end-wxyz"]),
  sorting:new Set(["logic-classify-animal","logic-classify-round","logic-classify-up-arrow","logic-classify-two-items","logic-classify-red"]),
  count:new Set(["math-count-2","math-count-3","math-count-4","math-count-5","math-count-6","math-count-7","math-count-8","math-count-9","math-count-10"]),
  numberLine:new Set(["math-order-next-1-2","math-order-next-3-4","math-order-before-6","math-order-between-6-8","math-order-descend-5","math-order-descend-10"]),
  balance:new Set(["math-compare-more-2-4","math-compare-less-5-3","math-compare-equal-4-4","math-compare-more-6-5","math-compare-less-7-9","math-compare-more-10-8"]),
  pattern:new Set(["math-pattern-ab-shapes","math-pattern-aab-colors","math-pattern-number-step-one","math-pattern-number-step-two","math-pattern-size"]),
  cause:new Set(["science-water-ice-melts","science-water-freezes","science-water-puddle-evaporates","science-water-cold-glass-droplets"]),
  compare:new Set(["science-measure-longer-pencil","science-measure-hot-cold","science-measure-more-water"])
};

function exactFamily({name,presentation,ids,kind="choice"}){
  const classifier=kind==="matching"?matchingPresentation:choiceGameplayPresentation;
  const activities=ACTIVITIES.filter(activity=>classifier(activity)===presentation);
  assert.equal(activities.length,ids.size,`${name} family size must remain intentional`);
  assert.deepEqual(new Set(activities.map(activity=>activity.id)),ids,`${name} exact activity scope changed`);
  return activities;
}

const memory=exactFamily({name:"memory-pair",presentation:"memory_pairs",ids:sets.memory,kind:"matching"});
for(const activity of memory){assert.equal(activity.runtime,"matching");assert.equal(activity.subjectId,"letters");assert((activity.matchItems??[]).length>=4);}

const drag=exactFamily({name:"drag-target",presentation:"drag_targets",ids:sets.drag,kind:"matching"});
for(const activity of drag){assert.equal(activity.runtime,"matching");assert.equal(activity.subjectId,"science");assert.equal(activity.stageId,"science-living-observation-basics");assert.equal((activity.matchItems??[]).length,6);assert.equal(new Set((activity.matchItems??[]).map(item=>item.pair)).size,3);}

const otherMatching=ACTIVITIES.filter(activity=>activity.runtime==="matching"&&!sets.memory.has(activity.id)&&!sets.drag.has(activity.id));
assert(otherMatching.length>0);assert(otherMatching.every(activity=>matchingPresentation(activity)==="grid_pairs"),"unreviewed matching activities remain visible matching");
for(const id of ["math-pattern-match-ab","math-pattern-match-aab","science-match-water-states-b","science-match-observation-tools-c"]){const activity=ACTIVITIES.find(item=>item.id===id);assert(activity);assert.equal(activity.runtime,"matching");assert.equal(matchingPresentation(activity),"grid_pairs");}

const sequence=exactFamily({name:"sequence-slot",presentation:"sequence_slot",ids:sets.sequence});
for(const activity of sequence){assert.equal(activity.subjectId,"letters");assert.equal((activity.choices??[]).length,3);assert((activity.choices??[]).includes(activity.correctChoice));}

const sorting=exactFamily({name:"sorting-buckets",presentation:"sorting_buckets",ids:sets.sorting});
for(const activity of sorting){assert.equal(activity.subjectId,"logic");assert.equal((activity.choices??[]).length,3);assert.equal(new Set(activity.choices??[]).size,3);assert((activity.choices??[]).includes(activity.correctChoice));}

const count=exactFamily({name:"count-select",presentation:"count_select",ids:sets.count});
for(const activity of count){assert.equal(activity.subjectId,"math");assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)));assert((activity.choices??[]).includes(activity.correctChoice));}

const numberLine=exactFamily({name:"number-line",presentation:"number_line",ids:sets.numberLine});
for(const activity of numberLine){const config=numberLineConfig(activity);assert(config);assert.equal(numberLineValues(config).length,5);assert(config.contextValues.length>=1);assert((activity.choices??[]).includes(activity.correctChoice));}

const balance=exactFamily({name:"more-less-balance",presentation:"more_less_balance",ids:sets.balance});
for(const activity of balance){const config=moreLessBalanceConfig(activity);assert(config);assert.deepEqual(new Set(Object.values(config.choiceToSide)),new Set(["left","equal","right"]));const expected=config.goal==="equal"?"equal":config.goal==="more"?(config.left.count>config.right.count?"left":"right"):(config.left.count<config.right.count?"left":"right");assert.equal(config.choiceToSide[activity.correctChoice],expected);}

const pattern=exactFamily({name:"pattern-completion",presentation:"pattern_completion",ids:sets.pattern});
for(const activity of pattern){const config=patternCompletionConfig(activity);assert(config);assert(config.sequence.length>=3);assert((activity.choices??[]).includes(activity.correctChoice));}

const cause=exactFamily({name:"cause-effect",presentation:"cause_effect",ids:sets.cause});
for(const activity of cause){const config=causeEffectConfig(activity);assert(config);assert.equal(activity.stageId,"science-life-material-motion");assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]));assert(config.choiceVisuals[activity.correctChoice]);}

const compare=exactFamily({name:"compare-properties",presentation:"compare_properties",ids:sets.compare});
for(const activity of compare){
  assert.equal(activity.runtime,"tap_choice");assert.equal(activity.subjectId,"science");assert.equal(activity.stageId,"science-earth-body-environment");assert.equal(activity.skillIds?.[0]??activity.skillId,"science.observation.measurement.basic");
  assert.equal((activity.choices??[]).length,3);assert.equal(new Set(activity.choices??[]).size,3);assert((activity.choices??[]).includes(activity.correctChoice));
  const config=comparePropertiesConfig(activity);assert(config,`${activity.id} must have explicit compare-properties config`);
  assert.deepEqual(new Set([config.left.choice,config.right.choice,config.otherChoice]),new Set(activity.choices??[]),`${activity.id} maps exactly canonical choices`);
  assert.notEqual(config.left.level,config.right.level,`${activity.id} must expose a meaningful qualitative contrast`);
  const correct=config.correctTarget==="left"?config.left.choice:config.correctTarget==="right"?config.right.choice:config.otherChoice;
  assert.equal(correct,activity.correctChoice,`${activity.id} config target must match canonical correctChoice`);
}

const specializedChoiceIds=new Set([...sets.sequence,...sets.sorting,...sets.count,...sets.numberLine,...sets.balance,...sets.pattern,...sets.cause,...sets.compare]);
const otherChoice=ACTIVITIES.filter(activity=>activity.runtime==="tap_choice"&&!specializedChoiceIds.has(activity.id));
assert(otherChoice.length>0);assert(otherChoice.every(activity=>choiceGameplayPresentation(activity)==="default"),"unreviewed tap-choice families must remain default");
assert.equal(choiceGameplayPresentation(ACTIVITIES.find(activity=>activity.id==="science-observe-record-same-time")),"default","recording-observation activity stays out of compare-properties");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory_pair + ${drag.length} drag_targets + ${sequence.length} sequence_slot + ${sorting.length} sorting_buckets + ${count.length} count_select + ${numberLine.length} number_line + ${balance.length} more_less_balance + ${pattern.length} pattern_completion + ${cause.length} cause_effect + ${compare.length} compare_properties activities.`);
