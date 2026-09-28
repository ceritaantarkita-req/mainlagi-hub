import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const owners=[
  {name:"count",component:"CountAndSelectActivity",source:read("src/components/learning/CountAndSelectActivity.tsx"),css:read("src/components/learning/CountAndSelectActivity.module.css"),fidelity:"choice_count_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"number-line",component:"NumberLineActivity",source:read("src/components/learning/NumberLineActivity.tsx"),css:read("src/components/learning/NumberLineActivity.module.css"),fidelity:"choice_number_line_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"balance",component:"MoreLessBalanceActivity",source:read("src/components/learning/MoreLessBalanceActivity.tsx"),css:read("src/components/learning/MoreLessBalanceActivity.module.css"),fidelity:"choice_balance_comparison_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelectedSide(null);",'setFeedback("idle");']},
  {name:"equal-groups",component:"EqualGroupsActivity",source:read("src/components/learning/EqualGroupsActivity.tsx"),css:read("src/components/learning/EqualGroupsActivity.module.css"),fidelity:"choice_equal_groups_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"make-total",component:"MakeTotalActivity",source:read("src/components/learning/MakeTotalActivity.tsx"),css:read("src/components/learning/MakeTotalActivity.module.css"),fidelity:"choice_make_total_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"take-away",component:"TakeAwayActivity",source:read("src/components/learning/TakeAwayActivity.tsx"),css:read("src/components/learning/TakeAwayActivity.module.css"),fidelity:"choice_take_away_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"compare",component:"ComparePropertiesActivity",source:read("src/components/learning/ComparePropertiesActivity.tsx"),css:read("src/components/learning/ComparePropertiesActivity.module.css"),fidelity:"choice_compare_properties_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelectedTarget(null);",'setFeedback("idle");']},
  {name:"word-problem",component:"VisualWordProblemActivity",source:read("src/components/learning/VisualWordProblemActivity.tsx"),css:read("src/components/learning/VisualWordProblemActivity.module.css"),fidelity:"choice_visual_word_problem_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']},
  {name:"spatial",component:"SpatialRelationBoardActivity",source:read("src/components/learning/SpatialRelationBoardActivity.tsx"),css:read("src/components/learning/SpatialRelationBoardActivity.module.css"),fidelity:"choice_spatial_relation_interaction",resets:["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']}
];

const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

for(const owner of owners){
  const {name,component,source,css,fidelity,resets}=owner;
  has(source,'import { ActivityCompletion } from "./ActivityCompletion"',`${name} imports canonical ActivityCompletion`);
  has(source,"emitLearningRuntimeMeasurement({",`${name} keeps explicit runtime measurement`);
  has(source,fidelity,`${name} keeps evidence fidelity metadata`);
  has(source,"completeActivity(childId, activity.id)",`${name} keeps renderer-owned progress write`);
  has(source,"<ActivityCompletion",`${name} renders canonical Completion`);
  has(source,"onTryAgain={restart}",`${name} binds Again to local restart`);
  lacks(source,'import Link from "next/link"',`${name} removes local success navigation`);
  lacks(source,"<Link className={styles.nextLink}",`${name} removes local success CTA`);
  lacks(css,".nextLink",`${name} removes orphaned success CTA CSS`);
  for(const literal of resets) has(source,literal,`${name} local restart includes ${literal}`);
  assert.match(source,/emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);/,`${name} preserves measurement -> progress ordering`);
  has(route,`<${component}`,`${component} remains production dispatcher owner`);
}

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation remains outside evidence ownership");

console.log("SI-06D1 Math choice/shared static boundary PASS: nine owners use canonical Completion with local Again replay while explicit evidence/progress ownership remains unchanged.");
