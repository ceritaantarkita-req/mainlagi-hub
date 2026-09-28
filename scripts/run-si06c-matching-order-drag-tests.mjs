import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const owners=[
  {
    name:"memory",
    component:"MemoryMatchActivity",
    source:read("src/components/learning/MemoryMatchActivity.tsx"),
    css:read("src/components/learning/MemoryMatchActivity.module.css"),
    fidelity:"matching_memory_interaction",
    resets:[
      "incorrectRef.current = 0;",
      "retryRef.current = 0;",
      "setOpen([]);",
      "setMatched([]);",
      "setLocked(false);",
      "setDone(false);"
    ]
  },
  {
    name:"drag",
    component:"DragTargetMatchActivity",
    source:read("src/components/learning/DragTargetMatchActivity.tsx"),
    css:read("src/components/learning/DragTargetMatchActivity.module.css"),
    fidelity:"matching_drag_target_interaction",
    resets:[
      "pointerDragRef.current = null;",
      "incorrectRef.current = 0;",
      "retryRef.current = 0;",
      "setSelectedPair(null);",
      "setDraggingPair(null);",
      "setHoverTarget(null);",
      "setGhost(null);",
      "setMatched([]);",
      'setFeedback("idle");',
      "setDone(false);"
    ]
  },
  {
    name:"sequence",
    component:"SequenceSlotChoiceActivity",
    source:read("src/components/learning/SequenceSlotChoiceActivity.tsx"),
    css:read("src/components/learning/SequenceSlotChoiceActivity.module.css"),
    fidelity:"choice_sequence_interaction",
    resets:[
      "incorrectRef.current = 0;",
      "retryRef.current = 0;",
      "setPlaced(null);",
      'setFeedback("idle");'
    ]
  },
  {
    name:"sorting",
    component:"SortingBucketsChoiceActivity",
    source:read("src/components/learning/SortingBucketsChoiceActivity.tsx"),
    css:read("src/components/learning/SortingBucketsChoiceActivity.module.css"),
    fidelity:"choice_sorting_interaction",
    resets:[
      "incorrectRef.current = 0;",
      "retryRef.current = 0;",
      "setSelected(null);",
      "setPlaced({});",
      'setFeedback("idle");',
      "setDone(false);"
    ]
  },
  {
    name:"growth",
    component:"GrowthStageTransitionActivity",
    source:read("src/components/learning/GrowthStageTransitionActivity.tsx"),
    css:read("src/components/learning/GrowthStageTransitionActivity.module.css"),
    fidelity:"choice_growth_stage_transition_interaction",
    resets:[
      "incorrectRef.current = 0;",
      "retryRef.current = 0;",
      "setSelected(null);",
      'setFeedback("idle");'
    ]
  }
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
  lacks(source,'import Link from "next/link"',`${name} has no local success navigation owner`);
  lacks(source,"<Link className={styles.nextLink}",`${name} has no local success CTA`);
  lacks(css,".nextLink",`${name} has no orphaned local success CTA CSS`);
  for(const literal of resets) has(source,literal,`${name} local Again reset includes ${literal}`);
  assert.match(
    source,
    /emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);/,
    `${name} preserves measurement -> progress ordering`
  );
  has(route,`<${component}`,`${component} remains a production dispatcher owner`);
}

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation stays outside evidence ownership");

console.log("SI-06C matching/order/drag static boundary PASS: MemoryMatch is normalized and DragTarget, SequenceSlot, SortingBuckets, GrowthStage use canonical Completion with local Again replay while evidence/progress ownership remains unchanged.");
