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
const {healthyHabitRoutineConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/healthyHabitRoutineConfig.js"));
const {materialLabConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/materialLabConfig.js"));
const {setReasoningConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/setReasoningConfig.js"));

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
for(const id of ["math-pattern-match-ab","math-pattern-match-aab","science-match-water-states-b","science-match-observation-tools-c","science-match-material-purpose-d"]){
  const activity=ACTIVITIES.find(item=>item.id===id);
  assert(activity,`${id} remains in catalog`);
  assert.equal(activity.runtime,"matching",`${id} remains a matching activity`);
  assert.equal(matchingPresentation(activity),"grid_pairs",`${id} stays on canonical visible matching`);
}

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

const expectedOddOneOut=new Set([
  "logic-odd-category-animal-vehicle","logic-odd-shape-angular","logic-odd-direction-right",
  "logic-odd-count-three","logic-odd-pattern-symmetry"
]);
const oddOneOut=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="odd_one_out");
assert.equal(oddOneOut.length,expectedOddOneOut.size,"odd-one-out family size must remain intentional");
assert.deepEqual(new Set(oddOneOut.map(activity=>activity.id)),expectedOddOneOut,"only the five reviewed Logic Wave A discrimination activities use Odd One Out");
for(const activity of oddOneOut){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-classification-rules-basics");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"odd-one-out choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"odd one out preserves canonical correctChoice");
}

const expectedRulePipeline=new Set([
  "logic-compose-red-circle-to-star","logic-compose-small-left-then-up","logic-compose-two-to-blue",
  "logic-compose-triangle-turn-right","logic-compose-swap-then-grow"
]);
const rulePipeline=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="rule_pipeline");
assert.equal(rulePipeline.length,expectedRulePipeline.size,"rule-pipeline family size must remain intentional");
assert.deepEqual(new Set(rulePipeline.map(activity=>activity.id)),expectedRulePipeline,"only the five reviewed Logic composed-rule activities use Rule Pipeline");
for(const activity of rulePipeline){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-mixed-reasoning-challenge");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"rule-pipeline choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"rule pipeline preserves canonical correctChoice");
}

const expectedSetReasoning=new Set([
  "logic-set-both-red-round","logic-set-animal-not-bird","logic-set-shape-not-square",
  "logic-set-only-blue-triangle","logic-set-outside-round-red"
]);
const setReasoning=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="set_reasoning");
assert.equal(setReasoning.length,expectedSetReasoning.size,"set-reasoning family size must remain intentional");
assert.deepEqual(new Set(setReasoning.map(activity=>activity.id)),expectedSetReasoning,"only the five reviewed Logic Wave D set-reasoning activities use Set Reasoning");
for(const activity of setReasoning){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-mixed-reasoning-challenge");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"set-reasoning choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"set reasoning preserves canonical correctChoice");
  const config=setReasoningConfig(activity);
  assert(config,`${activity.id} must have explicit Set Reasoning config`);
  assert.equal(config.rules.length,2,`${activity.id} keeps exactly two membership constraints`);
  assert(config.rules.every(rule=>rule.label&&["in","out"].includes(rule.membership)),`${activity.id} keeps valid set-membership rules`);
  assert.deepEqual(new Set(Object.keys(config.choiceLabels)),new Set(activity.choices??[]),`${activity.id} set board maps exactly canonical choices`);
}

const expectedTransitiveChain=new Set([
  "logic-transitive-height-abc","logic-transitive-shortest-xyz","logic-transitive-most-dots",
  "logic-transitive-lightest","logic-transitive-middle-order"
]);
const transitiveChain=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="transitive_chain");
assert.equal(transitiveChain.length,expectedTransitiveChain.size,"transitive-chain family size must remain intentional");
assert.deepEqual(new Set(transitiveChain.map(activity=>activity.id)),expectedTransitiveChain,"only the five reviewed Logic transitive-comparison activities use Transitive Chain");
for(const activity of transitiveChain){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"logic");
  assert.equal(activity.stageId,"logic-mixed-reasoning-challenge");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"transitive-chain choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"transitive chain preserves canonical correctChoice");
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

const expectedBalance=new Set([
  "math-compare-more-2-4","math-compare-less-5-3","math-compare-equal-4-4",
  "math-compare-more-6-5","math-compare-less-7-9","math-compare-more-10-8"
]);
const balance=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="more_less_balance");
assert.equal(balance.length,expectedBalance.size,"more-less balance family size must remain intentional");
assert.deepEqual(new Set(balance.map(activity=>activity.id)),expectedBalance,"only the six reviewed Math comparison activities use balance presentation");
for(const activity of balance){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-banding-bentuk");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"balance choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"balance preserves canonical correctChoice");
  const config=moreLessBalanceConfig(activity);
  assert(config,`${activity.id} must have explicit balance config`);
  assert(config.left.count>0&&config.right.count>0,`${activity.id} keeps visible positive comparison quantities`);
  assert.deepEqual(new Set(Object.values(config.choiceToSide)),new Set(["left","equal","right"]),`${activity.id} maps canonical choices to all three comparison positions`);
  const expectedCorrectSide=config.goal==="equal"
    ? "equal"
    : config.goal==="more"
      ? (config.left.count>config.right.count?"left":"right")
      : (config.left.count<config.right.count?"left":"right");
  assert.equal(config.choiceToSide[activity.correctChoice],expectedCorrectSide,`${activity.id} canonical correctChoice must match the comparison objective`);
}

const expectedPatternCompletion=new Set([
  "math-pattern-ab-shapes","math-pattern-aab-colors","math-pattern-number-step-one",
  "math-pattern-number-step-two","math-pattern-size"
]);
const patternCompletion=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="pattern_completion");
assert.equal(patternCompletion.length,expectedPatternCompletion.size,"pattern-completion family size must remain intentional");
assert.deepEqual(new Set(patternCompletion.map(activity=>activity.id)),expectedPatternCompletion,"only the five reviewed Math pattern choice activities use Pattern Completion");
for(const activity of patternCompletion){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"math");
  assert.equal(activity.stageId,"math-banding-bentuk");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"pattern-completion choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"pattern completion preserves canonical correctChoice");
  const config=patternCompletionConfig(activity);
  assert(config,`${activity.id} must have explicit Pattern Completion config`);
  assert(config.sequence.length>=3,`${activity.id} exposes enough observed tokens to infer a pattern`);
  assert(config.sequence.every(token=>Boolean(token)),`${activity.id} observed sequence tokens stay non-empty`);
  if(config.unitLength) assert(config.unitLength>=2,`${activity.id} repeating unit remains meaningful`);
}

const expectedCauseEffect=new Set([
  "science-water-ice-melts","science-water-freezes","science-water-puddle-evaporates","science-water-cold-glass-droplets"
]);
const causeEffect=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="cause_effect");
assert.equal(causeEffect.length,expectedCauseEffect.size,"cause-effect family size must remain intentional");
assert.deepEqual(new Set(causeEffect.map(activity=>activity.id)),expectedCauseEffect,"only the four reviewed Science water-change choices use Cause Effect");
for(const activity of causeEffect){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-life-material-motion");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"cause-effect choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"cause effect preserves canonical correctChoice");
  const config=causeEffectConfig(activity);
  assert(config,`${activity.id} must have explicit Cause Effect config`);
  assert(config.startIcon&&config.conditionIcon&&config.conditionLabel,`${activity.id} keeps visible cause context`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} visual mapping covers exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical result keeps an explicit visual`);
}

const expectedCompareProperties=new Set([
  "science-measure-longer-pencil","science-measure-hot-cold","science-measure-more-water"
]);
const compareProperties=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="compare_properties");
assert.equal(compareProperties.length,expectedCompareProperties.size,"compare-properties family size must remain intentional");
assert.deepEqual(new Set(compareProperties.map(activity=>activity.id)),expectedCompareProperties,"only the three reviewed Science observation comparisons use Compare Properties");
for(const activity of compareProperties){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"compare-properties choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"compare properties preserves canonical correctChoice");
  const config=comparePropertiesConfig(activity);
  assert(config,`${activity.id} must have explicit Compare Properties config`);
  assert.deepEqual(new Set([config.left.choice,config.right.choice,config.otherChoice]),new Set(activity.choices??[]),`${activity.id} maps exactly the canonical three choices`);
  assert.notEqual(config.left.level,config.right.level,`${activity.id} exposes a meaningful qualitative contrast`);
  const configuredCorrect=config.correctTarget==="left"
    ? config.left.choice
    : config.correctTarget==="right"
      ? config.right.choice
      : config.otherChoice;
  assert.equal(configuredCorrect,activity.correctChoice,`${activity.id} configured comparison target must match canonical correctChoice`);
}

const recordingObservation=ACTIVITIES.find(activity=>activity.id==="science-observe-record-same-time");
assert(recordingObservation,"recording observation activity remains in catalog");
assert.equal(choiceGameplayPresentation(recordingObservation),"default","recording observation stays outside compare-properties scope");

const expectedHealthyHabitRoutine=new Set([
  "science-body-wash-hands","science-body-teeth-brush",
  "science-body-water-drink","science-body-sleep-rest"
]);
const healthyHabitRoutine=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="healthy_habit_routine");
assert.equal(healthyHabitRoutine.length,expectedHealthyHabitRoutine.size,"healthy-habit family size must remain intentional");
assert.deepEqual(new Set(healthyHabitRoutine.map(activity=>activity.id)),expectedHealthyHabitRoutine,"only the four reviewed Science body-health choices use Healthy Habit Routine");
for(const activity of healthyHabitRoutine){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"healthy-habit choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"healthy habit preserves canonical correctChoice");
  const config=healthyHabitRoutineConfig(activity);
  assert(config,`${activity.id} must have explicit Healthy Habit Routine config`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} habit visuals cover exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical correctChoice keeps an explicit habit visual`);
  assert(config.routineIcon&&config.routineLabel&&config.cueIcon&&config.cueLabel,`${activity.id} keeps visible health routine context`);
}

const bodyCareMatching=ACTIVITIES.find(activity=>activity.id==="science-match-body-care-c");
assert(bodyCareMatching,"body-care matching activity remains in catalog");
assert.equal(bodyCareMatching.runtime,"matching");
assert.equal(matchingPresentation(bodyCareMatching),"grid_pairs","body-care matching stays outside healthy-habit scope");

const expectedMaterialLab=new Set([
  "science-material-raincoat-waterproof","science-material-window-transparent",
  "science-material-towel-absorbent","science-material-toy-block-rigid"
]);
const materialLab=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="material_lab");
assert.equal(materialLab.length,expectedMaterialLab.size,"material-lab family size must remain intentional");
assert.deepEqual(new Set(materialLab.map(activity=>activity.id)),expectedMaterialLab,"only the four reviewed Science material-purpose choices use Material Lab");
for(const activity of materialLab){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-evidence-review-challenge");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3,"material-lab choices remain unique");
  assert((activity.choices??[]).includes(activity.correctChoice),"material lab preserves canonical correctChoice");
  const config=materialLabConfig(activity);
  assert(config,`${activity.id} must have explicit Material Lab config`);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]),`${activity.id} material samples map exactly canonical choices`);
  assert(config.choiceVisuals[activity.correctChoice],`${activity.id} canonical correctChoice keeps an explicit material sample`);
  assert(config.objectLabel&&config.purposeLabel&&config.testLabel,`${activity.id} keeps object, purpose and test context`);
}

const materialMatching=ACTIVITIES.find(activity=>activity.id==="science-match-material-purpose-d");
assert(materialMatching,"material-purpose matching activity remains in catalog");
assert.equal(materialMatching.runtime,"matching");
assert.equal(matchingPresentation(materialMatching),"grid_pairs","material-purpose matching stays outside material-lab scope");

const expectedFeatureFunctionLink=new Set([
  "science-feature-duck-webbed-feet","science-feature-fish-gills",
  "science-feature-bird-beak-seeds","science-feature-cactus-water"
]);
const featureFunctionLink=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="feature_function_link");
assert.equal(featureFunctionLink.length,expectedFeatureFunctionLink.size,"feature-function-link family size must remain intentional");
assert.deepEqual(new Set(featureFunctionLink.map(activity=>activity.id)),expectedFeatureFunctionLink,"only the four reviewed Science living feature/function choices use Feature Function Link");

const specializedChoiceIds=new Set([...expectedSequence,...expectedSorting,...expectedOddOneOut,...expectedRulePipeline,...expectedSetReasoning,...expectedTransitiveChain,...expectedCountSelect,...expectedNumberLine,...expectedBalance,...expectedPatternCompletion,...expectedCauseEffect,...expectedCompareProperties,...expectedHealthyHabitRoutine,...expectedMaterialLab,...expectedFeatureFunctionLink]);
const otherChoice=ACTIVITIES.filter(activity=>activity.runtime==="tap_choice"&&!specializedChoiceIds.has(activity.id));
assert(otherChoice.length>0,"default choice activities remain available");
assert(otherChoice.every(activity=>choiceGameplayPresentation(activity)==="default"),"other choice families retain default presentation");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory_pair + ${dragTargets.length} drag_targets + ${sequence.length} sequence_slot + ${sorting.length} sorting_buckets + ${oddOneOut.length} odd_one_out + ${rulePipeline.length} rule_pipeline + ${setReasoning.length} set_reasoning + ${transitiveChain.length} transitive_chain + ${countSelect.length} count_select + ${numberLine.length} number_line + ${balance.length} more_less_balance + ${patternCompletion.length} pattern_completion + ${causeEffect.length} cause_effect + ${compareProperties.length} compare_properties + ${healthyHabitRoutine.length} healthy_habit_routine + ${materialLab.length} material_lab + ${featureFunctionLink.length} feature_function_link activities.`);
