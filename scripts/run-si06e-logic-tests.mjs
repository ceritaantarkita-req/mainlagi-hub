import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const owners=[
  {name:"odd-one-out",component:"OddOneOutActivity",fidelity:"choice_odd_one_out_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"rule-pipeline",component:"RulePipelineActivity",fidelity:"choice_rule_pipeline_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setStepOneApplied(false);","setSelected(null);",'setFeedback("idle");']},
  {name:"set-reasoning",component:"SetReasoningActivity",fidelity:"choice_set_reasoning_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"transitive-chain",component:"TransitiveChainActivity",fidelity:"choice_transitive_chain_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"spatial-transform",component:"SpatialTransformActivity",fidelity:"choice_spatial_transform_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"relative-order",component:"RelativeOrderTrackActivity",fidelity:"choice_relative_order_track_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"elimination",component:"EliminationBoardActivity",fidelity:"choice_elimination_board_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);","setEliminatedChoices([]);",'setFeedback("idle");']},
  {name:"shape-attribute",component:"ShapeAttributeBoardActivity",fidelity:"choice_shape_attribute_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"pattern-completion",component:"PatternCompletionActivity",fidelity:"choice_pattern_completion_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"single-rule",component:"SingleRuleApplyActivity",fidelity:"choice_single_rule_apply_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']}
];

const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

for(const owner of owners){
  const source=read(`src/components/learning/${owner.component}.tsx`);
  const css=read(`src/components/learning/${owner.component}.module.css`);
  has(source,'import { ActivityCompletion } from "./ActivityCompletion"',`${owner.name} imports canonical ActivityCompletion`);
  has(source,"emitLearningRuntimeMeasurement({",`${owner.name} keeps explicit runtime measurement`);
  has(source,owner.fidelity,`${owner.name} keeps evidence fidelity metadata`);
  has(source,"completeActivity(childId, activity.id)",`${owner.name} keeps renderer-owned progress write`);
  has(source,"<ActivityCompletion",`${owner.name} renders canonical Completion`);
  has(source,"onTryAgain={restart}",`${owner.name} binds Again to local restart`);
  lacks(source,'import Link from "next/link"',`${owner.name} removes local success navigation`);
  lacks(source,"<Link className={styles.nextLink}",`${owner.name} removes local success CTA`);
  lacks(css,".nextLink",`${owner.name} removes orphaned success CTA CSS`);
  for(const literal of owner.resets) has(source,literal,`${owner.name} restart includes ${literal}`);
  assert.match(source,/emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);/,`${owner.name} preserves measurement -> progress ordering`);
  has(route,`<${owner.component}`,`${owner.component} remains production dispatcher owner`);
}

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation remains outside evidence ownership");

console.log("SI-06E Logic static boundary PASS: ten Logic owners use canonical Completion with local Again replay while explicit evidence/progress ownership remains unchanged.");
