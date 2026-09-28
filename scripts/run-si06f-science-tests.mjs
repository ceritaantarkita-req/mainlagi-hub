import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const owners=[
  {name:"cause-effect",component:"CauseEffectActivity",fidelity:"choice_cause_effect_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"phenomenon-relation",component:"PhenomenonRelationBoardActivity",fidelity:"choice_phenomenon_relation_interaction",alternateFidelity:"choice_ecosystem_dependency_relation_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"healthy-habit",component:"HealthyHabitRoutineActivity",fidelity:"choice_healthy_habit_routine_interaction",alternateFidelity:"choice_environment_care_action_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"material-lab",component:"MaterialLabActivity",fidelity:"choice_material_lab_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"feature-function",component:"FeatureFunctionLinkActivity",fidelity:"choice_feature_function_link_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"investigation",component:"InvestigationBoardActivity",fidelity:"choice_investigation_board_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"compare-shared",component:"ComparePropertiesActivity",fidelity:"choice_compare_properties_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelectedTarget(null);",'setFeedback("idle");']},
  {name:"growth-shared",component:"GrowthStageTransitionActivity",fidelity:"choice_growth_stage_transition_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']}
];

const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

for(const owner of owners){
  const source=read(`src/components/learning/${owner.component}.tsx`);
  const css=read(`src/components/learning/${owner.component}.module.css`);
  has(source,'import { ActivityCompletion } from "./ActivityCompletion"',`${owner.name} imports canonical ActivityCompletion`);
  has(source,"emitLearningRuntimeMeasurement({",`${owner.name} keeps explicit runtime measurement`);
  has(source,owner.fidelity,`${owner.name} keeps primary evidence fidelity metadata`);
  if(owner.alternateFidelity)has(source,owner.alternateFidelity,`${owner.name} keeps domain-reuse evidence fidelity metadata`);
  has(source,"completeActivity(childId, activity.id)",`${owner.name} keeps renderer-owned progress write`);
  has(source,"<ActivityCompletion",`${owner.name} renders canonical Completion`);
  has(source,"onTryAgain={restart}",`${owner.name} binds Again to local restart`);
  lacks(source,'import Link from "next/link"',`${owner.name} has no local success navigation import`);
  lacks(source,"<Link className={styles.nextLink}",`${owner.name} has no local success CTA`);
  lacks(css,".nextLink",`${owner.name} has no orphaned success CTA CSS`);
  for(const literal of owner.resets)has(source,literal,`${owner.name} restart includes ${literal}`);
  assert.match(source,/emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);/,`${owner.name} preserves measurement -> progress ordering`);
  has(route,`<${owner.component}`,`${owner.component} remains production dispatcher owner`);
}

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation remains outside evidence ownership");

console.log("SI-06F Science static boundary PASS: six Science owners plus two previously migrated shared owners use canonical Completion with local Again replay while explicit evidence/progress ownership remains unchanged.");
