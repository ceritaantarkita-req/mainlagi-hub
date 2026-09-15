import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {getActivityLearningSpec}=require(path.resolve(".learning-test-dist/src/lib/learning/catalog.js"));
const {choiceGameplayPresentation,matchingPresentation,gameplayPattern}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));
const {healthyHabitRoutineConfig}=require(path.resolve(".learning-test-dist/src/lib/learning/healthyHabitRoutineConfig.js"));

const expected=new Set(["science-body-wash-hands","science-body-teeth-brush","science-body-water-drink","science-body-sleep-rest"]);
const family=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="healthy_habit_routine");
assert.equal(family.length,expected.size,"healthy-habit family size must remain intentional");
assert.deepEqual(new Set(family.map(activity=>activity.id)),expected,"only the four reviewed Science body-health choices use Healthy Habit Routine");
for(const activity of family){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"science");
  assert.equal(activity.stageId,"science-earth-body-environment");
  const spec=getActivityLearningSpec(activity.id);
  assert(spec,`${activity.id} must keep its canonical learning spec`);
  assert.equal(spec.assessment,"assessed");
  assert.equal(spec.skills.length,1);
  assert.equal(spec.skills[0]?.skillId,"science.body.health_habits.basic");
  assert.equal((activity.choices??[]).length,3);
  assert.equal(new Set(activity.choices??[]).size,3);
  assert((activity.choices??[]).includes(activity.correctChoice));
  assert.equal(gameplayPattern(activity),"healthy_habit_routine");
  const config=healthyHabitRoutineConfig(activity);
  assert(config,`${activity.id} must have explicit Healthy Habit Routine config`);
  assert(config.routineIcon&&config.routineLabel&&config.cueIcon&&config.cueLabel);
  assert.deepEqual(new Set(Object.keys(config.choiceVisuals)),new Set(activity.choices??[]));
  assert(config.choiceVisuals[activity.correctChoice]);
}
const excluded=ACTIVITIES.find(activity=>activity.id==="science-match-body-care-c");
assert(excluded,"science-match-body-care-c remains in catalog");
assert.equal(excluded.runtime,"matching");
assert.equal(matchingPresentation(excluded),"grid_pairs");
assert.equal(gameplayPattern(excluded),"visible_matching");
console.log(`Healthy-habit routine regression passed for ${family.length} exact Science Wave C activities.`);
