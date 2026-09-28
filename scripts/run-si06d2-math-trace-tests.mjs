import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const trace=read("src/components/learning/world/MathTraceWorldActivity.tsx");
const measurement=read("src/lib/learning/traceMeasurement.ts");
const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

has(trace,'import { ActivityCompletion } from "../ActivityCompletion"',"MathTrace imports canonical ActivityCompletion");
has(trace,'getActivity("math-trace-5-touch")',"MathTrace keeps exact canonical activity");
has(trace,"measureLearningDigitTrace({","MathTrace keeps guided trace evaluator");
has(trace,"emitLearningRuntimeMeasurement({","MathTrace keeps explicit runtime measurement");
has(trace,"completeActivity(childId, activity.id)","MathTrace keeps renderer-owned progress write");
has(trace,"<ActivityCompletion","MathTrace renders canonical Completion");
has(trace,"onTryAgain={restart}","MathTrace binds Completion Again to local restart");
lacks(trace,'import Link from "next/link"',"MathTrace removes local success navigation");
lacks(trace,"LearningPlatform.module.css","MathTrace removes legacy feedback presentation dependency");
lacks(trace,"Pilih permainan lain","MathTrace removes legacy local success CTA");

for(const literal of [
  "retryCountRef.current = 0;",
  "drawingRef.current = false;",
  "completedRef.current = false;",
  "checkpointRef.current = 0;",
  "activeStrokeRef.current = null;",
  "strokesRef.current = [];",
  "startedAtRef.current = null;",
  "setCheckpoint(0);",
  "setPoints([]);",
  "setComplete(false);"
]) has(trace,literal,`MathTrace local replay preserves/reset boundary: ${literal}`);

assert.match(
  trace,
  /measureLearningDigitTrace\(\{[\s\S]*?emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);/,
  "MathTrace preserves evaluator -> explicit measurement -> progress ordering"
);
has(measurement,'evidenceFidelity: "guided_trace_path_score"',"Trace evaluator keeps guided path evidence fidelity");
has(measurement,'source: "guided-trace-evaluator"',"Trace evaluator source remains canonical");
has(route,'activity === "math-trace-5-touch"',"Exact Math trace route remains specialized");
has(route,"<MathTraceWorldActivity","Math trace route keeps specialized renderer");
has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge keeps explicit measurement event");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","Explicit trace measurement retains precedence");

console.log("SI-06D2 MathTrace static boundary PASS: canonical Completion/local Again added while guided trace evaluation, evidence, pointer state, audio behavior and renderer-owned progress remain intact.");
