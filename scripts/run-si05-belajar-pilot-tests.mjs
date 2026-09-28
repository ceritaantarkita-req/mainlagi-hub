import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const pilot=read("src/components/learning/OddOneOutActivity.tsx");
const pilotCss=read("src/components/learning/OddOneOutActivity.module.css");
const completion=read("src/components/learning/ActivityCompletion.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

has(pilot,'import { ActivityCompletion } from "./ActivityCompletion"',"SI-05 pilot consumes existing shared ActivityCompletion adapter");
has(pilot,'emitLearningRuntimeMeasurement({',"SI-05 preserves explicit assessed runtime measurement owner");
has(pilot,'completeActivity(childId, activity.id);',"SI-05 preserves existing completeActivity write");
has(pilot,'setFeedback("good");',"SI-05 preserves local success state trigger");
assert.match(
  pilot,
  /emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);[\s\S]*?setFeedback\("good"\);/,
  "SI-05 must keep measurement -> completeActivity -> presentation ordering"
);

has(pilot,"const restart = () => {","SI-05 provides local replay reset without route reload");
for(const literal of [
  "incorrectRef.current = 0;",
  "retryRef.current = 0;",
  "setSelected(null);",
  'setFeedback("idle");'
]){
  has(pilot,literal,`SI-05 replay reset keeps local state contract: ${literal}`);
}

assert.match(
  pilot,
  /feedback === "good"[\s\S]*?<ActivityCompletion[\s\S]*?childId=\{childId\}[\s\S]*?activity=\{activity\}[\s\S]*?onTryAgain=\{restart\}/,
  "SI-05 mounts canonical Completion only from the existing success state"
);

lacks(pilot,'import Link from "next/link"',"SI-05 removes legacy local success navigation owner");
lacks(pilot,"Pilih permainan lain","SI-05 removes legacy post-success CTA copy");
lacks(pilot,"styles.nextLink","SI-05 removes legacy local success CTA styling usage");
lacks(pilotCss,".nextLink","SI-05 removes orphaned local success CTA CSS");

has(completion,'<CanonicalCompletion',"SI-05 reuses live SI-03 canonical Completion");
has(completion,'<CanonicalShareDialog',"SI-05 inherits live SI-04 canonical Share through ActivityCompletion");
has(completion,'input={{ context: "belajar" }}',"SI-05 Share remains public-safe Belajar context");

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge still consumes explicit runtime measurement");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit SI-05 measurement still takes precedence");
has(bridge,"DUPLICATE_GUARD_MS = 1500","existing duplicate-attempt guard remains unchanged");
lacks(bridge,"ActivityCompletion","SI-05 does not move presentation into attempt/evidence ownership");

console.log("SI-05 Belajar pilot static boundary PASS: OddOneOut keeps measurement/completeActivity ownership and replaces only post-success UI with canonical Completion + Share.");
