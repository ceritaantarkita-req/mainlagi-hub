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

function exact(classifier,presentation,ids,label){const list=ACTIVITIES.filter(a=>classifier(a)===presentation);assert.equal(list.length,ids.size,`${label} family size changed`);assert.deepEqual(new Set(list.map(a=>a.id)),ids,`${label} exact scope changed`);return list;}

const memory=exact(matchingPresentation,"memory_pairs",sets.memory,"memory-pair");
const drag=exact(matchingPresentation,"drag_targets",sets.drag,"drag-target");
for(const a of memory){assert.equal(a.runtime,"matching");assert.equal(a.subjectId,"letters");assert((a.matchItems??[]).length>=4);}
for(const a of drag){assert.equal(a.runtime,"matching");assert.equal(a.subjectId,"science");assert.equal(a.stageId,"science-living-observation-basics");assert.equal((a.matchItems??[]).length,6);assert.equal(new Set((a.matchItems??[]).map(i=>i.pair)).size,3);}
const otherMatching=ACTIVITIES.filter(a=>a.runtime==="matching"&&!sets.memory.has(a.id)&&!sets.drag.has(a.id));assert(otherMatching.every(a=>matchingPresentation(a)==="grid_pairs"));
for(const id of ["math-pattern-match-ab","math-pattern-match-aab","science-match-water-states-b","science-match-observation-tools-c"]){const a=ACTIVITIES.find(x=>x.id===id);assert(a);assert.equal(matchingPresentation(a),"grid_pairs");}

const sequence=exact(choiceGameplayPresentation,"sequence_slot",sets.sequence,"sequence-slot");
const sorting=exact(choiceGameplayPresentation,"sorting_buckets",sets.sorting,"sorting-buckets");
const count=exact(choiceGameplayPresentation,"count_select",sets.count,"count-select");
const numberLine=exact(choiceGameplayPresentation,"number_line",sets.numberLine,"number-line");
const balance=exact(choiceGameplayPresentation,"more_less_balance",sets.balance,"more-less-balance");
const pattern=exact(choiceGameplayPresentation,"pattern_completion",sets.pattern,"pattern-completion");
const cause=exact(choiceGameplayPresentation,"cause_effect",sets.cause,"cause-effect");
const compare=exact(choiceGameplayPresentation,"compare_properties",sets.compare,"compare-properties");

for(const list of [sequence,sorting,count,numberLine,balance,pattern,cause,compare])for(const a of list){assert.equal(a.runtime,"tap_choice");assert.equal((a.choices??[]).length,3);assert.equal(new Set(a.choices??[]).size,3);assert((a.choices??[]).includes(a.correctChoice));}
for(const a of numberLine){const c=numberLineConfig(a);assert(c);assert.equal(numberLineValues(c).length,5);assert(c.contextValues.length>=1);}
for(const a of balance){const c=moreLessBalanceConfig(a);assert(c);assert.deepEqual(new Set(Object.values(c.choiceToSide)),new Set(["left","equal","right"]));const target=c.goal==="equal"?"equal":c.goal==="more"?(c.left.count>c.right.count?"left":"right"):(c.left.count<c.right.count?"left":"right");assert.equal(c.choiceToSide[a.correctChoice],target);}
for(const a of pattern){const c=patternCompletionConfig(a);assert(c);assert(c.sequence.length>=3);}
for(const a of cause){const c=causeEffectConfig(a);assert(c);assert.equal(a.stageId,"science-life-material-motion");assert.deepEqual(new Set(Object.keys(c.choiceVisuals)),new Set(a.choices??[]));}
for(const a of compare){const c=comparePropertiesConfig(a);assert(c);assert.equal(a.subjectId,"science");assert.equal(a.stageId,"science-earth-body-environment");assert.deepEqual(new Set([c.left.choice,c.right.choice,c.otherChoice]),new Set(a.choices??[]));assert.notEqual(c.left.level,c.right.level);const choice=c.correctTarget==="left"?c.left.choice:c.correctTarget==="right"?c.right.choice:c.otherChoice;assert.equal(choice,a.correctChoice);}

const specialized=new Set([...sets.sequence,...sets.sorting,...sets.count,...sets.numberLine,...sets.balance,...sets.pattern,...sets.cause,...sets.compare]);
const defaults=ACTIVITIES.filter(a=>a.runtime==="tap_choice"&&!specialized.has(a.id));assert(defaults.length>0);assert(defaults.every(a=>choiceGameplayPresentation(a)==="default"),"unreviewed tap-choice families remain default");
assert.equal(choiceGameplayPresentation(ACTIVITIES.find(a=>a.id==="science-observe-record-same-time")),"default");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory + ${drag.length} drag + ${sequence.length} sequence + ${sorting.length} sorting + ${count.length} count + ${numberLine.length} number-line + ${balance.length} balance + ${pattern.length} pattern + ${cause.length} cause-effect + ${compare.length} compare-properties.`);
