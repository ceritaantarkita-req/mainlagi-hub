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

const expectedMemory=new Set([
  "letters-match-case-cd","letters-match-case-ef","letters-match-case-bce",
  "letters-match-case-gh","letters-match-case-ij","letters-match-case-klm",
  "letters-match-case-no","letters-match-case-pq","letters-match-case-rst",
  "letters-match-case-uv","letters-match-case-wx","letters-match-case-yz"
]);
const memory=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="memory_pairs");
assert.equal(memory.length,expectedMemory.size,"memory-pair family size must remain intentional");
assert.deepEqual(new Set(memory.map(activity=>activity.id)),expectedMemory,"only the 12 Latin upper/lower case matching activities use memory pairs");
for(const activity of memory){assert.equal(activity.runtime,"matching");assert.equal(activity.subjectId,"letters");assert((activity.matchItems??[]).length>=4,"memory activity has at least two pairs");}

const expectedDragTargets=new Set([
  "science-match-living-nonliving","science-match-plant-parts","science-match-animal-homes-a",
  "science-match-senses-a","science-match-weather-signs-a"
]);
const dragTargets=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="drag_targets");
assert.equal(dragTargets.length,expectedDragTargets.size,"drag-target family size must remain intentional");
assert.deepEqual(new Set(dragTargets.map(activity=>activity.id)),expectedDragTargets,"only the five reviewed Science Wave A matching activities use drag targets");
for(const activity of dragTargets){
  assert.equal(activity.runtime,"matching");assert.equal(activity.subjectId,"science");assert.equal(activity.stageId,"science-living-observation-basics");
  assert.equal((activity.matchItems??[]).length,6,"drag-target activity keeps three canonical pairs");
  const pairCounts=new Map();for(const item of activity.matchItems??[]) pairCounts.set(item.pair,(pairCounts.get(item.pair)??0)+1);
  assert.equal(pairCounts.size,3,"drag-target activity keeps exactly three pair ids");assert([...pairCounts.values()].every(count=>count===2),"each drag-target pair has one source and one target label");
}
const otherMatching=ACTIVITIES.filter(activity=>activity.runtime==="matching"&&!expectedMemory.has(activity.id)&&!expectedDragTargets.has(activity.id));
assert(otherMatching.length>0,"default matching family remains available for mechanic variety");
assert(otherMatching.every(activity=>matchingPresentation(activity)==="grid_pairs"),"unreviewed matching activities remain on the canonical visible grid");
for(const id of ["math-pattern-match-ab","math-pattern-match-aab","science-match-water-states-b"]){
  const activity=ACTIVITIES.find(item=>item.id===id);assert(activity,`${id} remains in catalog`);assert.equal(activity.runtime,"matching",`${id} remains matching`);assert.equal(matchingPresentation(activity),"grid_pairs",`${id} stays on visible matching`);
}

const expectedSequence=new Set(["letters-order-after-g","letters-order-between-jl","letters-order-before-m","letters-order-after-n","letters-order-between-pr","letters-order-before-t","letters-order-after-u","letters-order-between-vx","letters-order-before-z","letters-order-end-wxyz"]);
const sequence=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="sequence_slot");
assert.equal(sequence.length,expectedSequence.size);assert.deepEqual(new Set(sequence.map(activity=>activity.id)),expectedSequence);
for(const activity of sequence){assert.equal(activity.runtime,"tap_choice");assert.equal(activity.subjectId,"letters");assert.equal((activity.choices??[]).length,3);assert((activity.choices??[]).includes(activity.correctChoice));}

const expectedSorting=new Set(["logic-classify-animal","logic-classify-round","logic-classify-up-arrow","logic-classify-two-items","logic-classify-red"]);
const sorting=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="sorting_buckets");
assert.equal(sorting.length,expectedSorting.size);assert.deepEqual(new Set(sorting.map(activity=>activity.id)),expectedSorting);
for(const activity of sorting){assert.equal(activity.runtime,"tap_choice");assert.equal(activity.subjectId,"logic");assert.equal((activity.choices??[]).length,3);assert.equal(new Set(activity.choices??[]).size,3);assert((activity.choices??[]).includes(activity.correctChoice));}

const expectedCountSelect=new Set(["math-count-2","math-count-3","math-count-4","math-count-5","math-count-6","math-count-7","math-count-8","math-count-9","math-count-10"]);
const countSelect=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="count_select");
assert.equal(countSelect.length,expectedCountSelect.size);assert.deepEqual(new Set(countSelect.map(activity=>activity.id)),expectedCountSelect);
for(const activity of countSelect){assert.equal(activity.runtime,"tap_choice");assert.equal(activity.subjectId,"math");assert.equal((activity.choices??[]).length,3);assert.equal(new Set(activity.choices??[]).size,3);assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)));assert((activity.choices??[]).includes(activity.correctChoice));}

const expectedNumberLine=new Set(["math-order-next-1-2","math-order-next-3-4","math-order-before-6","math-order-between-6-8","math-order-descend-5","math-order-descend-10"]);
const numberLine=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="number_line");
assert.equal(numberLine.length,expectedNumberLine.size);assert.deepEqual(new Set(numberLine.map(activity=>activity.id)),expectedNumberLine);
for(const activity of numberLine){const config=numberLineConfig(activity);assert(config);assert.equal(activity.stageId,"math-banding-bentuk");assert.equal(numberLineValues(config).length,5);assert(Number(activity.correctChoice)>=config.min&&Number(activity.correctChoice)<=config.max);}

const expectedBalance=new Set(["math-compare-more-2-4","math-compare-less-5-3","math-compare-equal-4-4","math-compare-more-6-5","math-compare-less-7-9","math-compare-more-10-8"]);
const balance=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="more_less_balance");
assert.equal(balance.length,expectedBalance.size);assert.deepEqual(new Set(balance.map(activity=>activity.id)),expectedBalance);
for(const activity of balance){const config=moreLessBalanceConfig(activity);assert(config);assert.equal(activity.stageId,"math-banding-bentuk");assert.deepEqual(new Set(Object.values(config.choiceToSide)),new Set(["left","equal","right"]));const expectedCorrectSide=config.goal==="equal"?"equal":config.goal==="more"?(config.left.count>config.right.count?"left":"right"):(config.left.count<config.right.count?"left":"right");assert.equal(config.choiceToSide[activity.correctChoice],expectedCorrectSide);}

const expectedPatternCompletion=new Set(["math-pattern-ab-shapes","math-pattern-aab-colors","math-pattern-number-step-one","math-pattern-number-step-two","math-pattern-size"]);
const patternCompletion=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="pattern_completion");
assert.equal(patternCompletion.length,expectedPatternCompletion.size);assert.deepEqual(new Set(patternCompletion.map(activity=>activity.id)),expectedPatternCompletion);
for(const activity of patternCompletion){const config=patternCompletionConfig(activity);assert(config);assert.equal(activity.stageId,"math-banding-bentuk");assert(config.sequence.length>=3);assert(config.sequence.every(token=>Boolean(token)));if(config.unitLength)assert(config.unitLength>=2);}

const expectedCauseEffect=new Set(["science-water-ice-melts","science-water-freezes","science-water-puddle-evaporates","science-water-cold-glass-droplets"]);
const causeEffect=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="cause_effect");
assert.equal(causeEffect.length,expectedCauseEffect.size,"cause-effect family size must remain intentional");
assert.deepEqual(new Set(causeEffect.map(activity=>activity.id)),expectedCauseEffect,"only four reviewed Science water-change choices use cause-effect");
for(const activity of causeEffect){
  assert.equal(activity.runtime,"tap_choice");assert.equal(activity.subjectId,"science");assert.equal(activity.stageId,"science-life-material-motion");
  assert.equal((activity.choices??[]).length,3);assert.equal(new Set(activity.choices??[]).size,3);assert((activity.choices??[]).includes(activity.correctChoice));
  const config=causeEffectConfig(activity);assert(config,`${activity.id} must have explicit cause-effect config`);
  assert(config.startIcon&&config.conditionIcon&&config.conditionLabel,`${activity.id} keeps visible cause context`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} visual mapping must cover exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} correctChoice keeps an explicit result visual`);
}

const specializedChoiceIds=new Set([...expectedSequence,...expectedSorting,...expectedCountSelect,...expectedNumberLine,...expectedBalance,...expectedPatternCompletion,...expectedCauseEffect]);
const otherChoice=ACTIVITIES.filter(activity=>activity.runtime==="tap_choice"&&!specializedChoiceIds.has(activity.id));
assert(otherChoice.length>0,"default choice activities remain available");
assert(otherChoice.every(activity=>choiceGameplayPresentation(activity)==="default"),"other choice families retain default presentation");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory_pair + ${dragTargets.length} drag_targets + ${sequence.length} sequence_slot + ${sorting.length} sorting_buckets + ${countSelect.length} count_select + ${numberLine.length} number_line + ${balance.length} more_less_balance + ${patternCompletion.length} pattern_completion + ${causeEffect.length} cause_effect activities.`);
