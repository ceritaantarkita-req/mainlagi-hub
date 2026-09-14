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

const expectedMemory=new Set([
  "letters-match-case-cd","letters-match-case-ef","letters-match-case-bce",
  "letters-match-case-gh","letters-match-case-ij","letters-match-case-klm",
  "letters-match-case-no","letters-match-case-pq","letters-match-case-rst",
  "letters-match-case-uv","letters-match-case-wx","letters-match-case-yz"
]);
const memory=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="memory_pairs");
assert.equal(memory.length,expectedMemory.size,"memory-pair family size must remain intentional");
assert.deepEqual(new Set(memory.map(activity=>activity.id)),expectedMemory,"only the 12 Latin upper/lower case matching activities use memory pairs");
for(const activity of memory){
  assert.equal(activity.runtime,"matching");
  assert.equal(activity.subjectId,"letters");
  assert((activity.matchItems??[]).length>=4,"memory activity has at least two pairs");
}

const expectedDragTargets=new Set([
  "science-match-living-nonliving","science-match-plant-parts","science-match-animal-homes-a",
  "science-match-senses-a","science-match-weather-signs-a"
]);
const dragTargets=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="drag_targets");
assert.equal(dragTargets.length,expectedDragTargets.size,"drag-target family size must remain intentional");
assert.deepEqual(new Set(dragTargets.map(activity=>activity.id)),expectedDragTargets,"only the five reviewed Science Wave A matching activities use drag targets");
for(const activity of dragTargets){
  assert.equal(activity.runtime,"matching");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-living-observation-basics");
  assert.equal((activity.matchItems??[]).length,6,"drag-target activity keeps three canonical pairs");
  const pairCounts=new Map();
  for(const item of activity.matchItems??[]) pairCounts.set(item.pair,(pairCounts.get(item.pair)??0)+1);
  assert.equal(pairCounts.size,3,"drag-target activity keeps exactly three pair ids");
  assert([...pairCounts.values()].every(count=>count===2),"each drag-target pair has one source and one target label");
}

const otherMatching=ACTIVITIES.filter(activity=>activity.runtime==="matching"&&!expectedMemory.has(activity.id)&&!expectedDragTargets.has(activity.id));
assert(otherMatching.length>0,"default matching family remains available for mechanic variety");
assert(otherMatching.every(activity=>matchingPresentation(activity)==="grid_pairs"),"unreviewed matching activities remain on the canonical visible grid");

const expectedSequence=new Set([
  "letters-order-after-g","letters-order-between-jl","letters-order-before-m",
  "letters-order-after-n","letters-order-between-pr","letters-order-before-t",
  "letters-order-after-u","letters-order-between-vx","letters-order-before-z","letters-order-end-wxyz"
]);
const sequence=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="sequence_slot");
assert.equal(sequence.length,expectedSequence.size,"sequence-slot family size must remain intentional");
assert.deepEqual(new Set(sequence.map(activity=>activity.id)),expectedSequence,"only the ten canonical alphabet-order activities use sequence slots");
for(const activity of sequence){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"letters");
  assert.equal((activity.choices??[]).length,3);
  assert((activity.choices??[]).includes(activity.correctChoice),"sequence slot preserves canonical correctChoice");
}

const expectedSorting=new Set([
  "logic-classify-animal","logic-classify-round","logic-classify-up-arrow","logic-classify-two-items","logic-classify-red"
]);
const sorting=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="sorting_buckets");
assert.equal(sorting.length,expectedSorting.size,"sorting-buckets family size must remain intentional");
assert.deepEqual(new Set(sorting.map(activity=>activity.id)),expectedSorting,"only the five basic Logic classification activities use sorting buckets");
for(const activity of sorting){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"logic");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"sorting cards remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"sorting buckets preserve canonical positive choice");
}

const expectedCountSelect=new Set([
  "math-count-2","math-count-3","math-count-4","math-count-5","math-count-6",
  "math-count-7","math-count-8","math-count-9","math-count-10"
]);
const countSelect=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="count_select");
assert.equal(countSelect.length,expectedCountSelect.size,"count-select family size must remain intentional");
assert.deepEqual(new Set(countSelect.map(activity=>activity.id)),expectedCountSelect,"only the nine reviewed Math counting activities use count-select presentation");
for(const activity of countSelect){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"math");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"count-select choices remain unique");
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),"count-select choices remain numeric");
  assert((activity.choices??[]).includes(activity.correctChoice),"count-select preserves canonical correctChoice");
}

const expectedNumberLine=new Set([
  "math-order-next-1-2","math-order-next-3-4","math-order-before-6",
  "math-order-between-6-8","math-order-descend-5","math-order-descend-10"
]);
const numberLine=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="number_line");
assert.equal(numberLine.length,expectedNumberLine.size,"number-line family size must remain intentional");
assert.deepEqual(new Set(numberLine.map(activity=>activity.id)),expectedNumberLine,"only the six reviewed Math ordering activities use number-line presentation");
for(const activity of numberLine){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-banding-bentuk");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"number-line choices remain unique");
  assert((activity.choices??[]).every(choice=>/^\d+$/.test(choice)),"number-line choices remain numeric");
  assert((activity.choices??[]).includes(activity.correctChoice),"number-line preserves canonical correctChoice");
  const config=numberLineConfig(activity);
  assert(config,`${activity.id} must have explicit number-line config`);
  assert.equal(numberLineValues(config).length,5,`${activity.id} uses a compact five-tick local line`);
  assert(Number(activity.correctChoice)>=config.min&&Number(activity.correctChoice)<=config.max,`${activity.id} correctChoice must be visible on line`);
  assert(config.contextValues.length>=1,`${activity.id} needs visible sequence context`);
  assert(config.contextValues.every(value=>value>=config.min&&value<=config.max),`${activity.id} context must remain inside line range`);
}

const otherChoice=ACTIVITIES.filter(activity=>activity.runtime==="tap_choice"&&!expectedSequence.has(activity.id)&&!expectedSorting.has(activity.id)&&!expectedCountSelect.has(activity.id)&&!expectedNumberLine.has(activity.id));
assert(otherChoice.length>0,"default choice activities remain available");
assert(otherChoice.every(activity=>choiceGameplayPresentation(activity)==="default"),"other choice families retain default presentation");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory_pair + ${dragTargets.length} drag_targets + ${sequence.length} sequence_slot + ${sorting.length} sorting_buckets + ${countSelect.length} count_select + ${numberLine.length} number_line activities.`);
