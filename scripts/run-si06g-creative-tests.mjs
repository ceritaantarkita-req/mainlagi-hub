import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);
const block=(source,start,end)=>{
  const a=source.indexOf(start);
  const b=source.indexOf(end,a+start.length);
  assert(a>=0&&b>a,`cannot extract block ${start}`);
  return source.slice(a,b);
};

const creative=read("src/components/learning/CreativePracticeActivity.tsx");
const creativeCss=read("src/components/learning/CreativeStudio.module.css");
const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const fallback=read("src/components/learning/ChildLearningPlatform.tsx");
const fallbackColoring=block(fallback,"function ColoringActivity","function StoryActivity");

has(creative,'import { ActivityCompletion } from "./ActivityCompletion";',"CreativePractice imports canonical ActivityCompletion");
has(creative,"completeActivity(childId,activity.id);setCompletionOpen(true);","Creative finish preserves renderer-owned progress write before opening Completion");
has(creative,"const resumeWorkspace=()=>setCompletionOpen(false);","Again only dismisses creative Completion");
has(creative,'<ActivityCompletion childId={childId} activity={activity} onTryAgain={resumeWorkspace} />',"CreativePractice renders canonical Completion with local workspace resume");
has(creative,'<DrawingCanvas key={activity.id} activity={activity} onDone={finish}/>','Drawing workspace remains mounted independently of Completion');
has(creative,'<ColoringRegions key={activity.id} activity={activity} onDone={finish}/>','Coloring workspace remains mounted independently of Completion');
has(creative,"const [strokes,setStrokes]=useState<Stroke[]>([]);","Drawing stroke state remains owned by DrawingCanvas");
has(creative,"const [history,setHistory]=useState<Record<number,string>[]>([{}]);","Coloring fill history remains owned by ColoringRegions");
lacks(creative,'import Link from "next/link"',"CreativePractice has no legacy post-success Link");
lacks(creative,"useLearningProgress","Creative Completion is not auto-driven by persisted progress");
lacks(creative,"progress.completedActivityIds","Previously completed creative work reopens directly into workspace");
lacks(creative,"Pilih permainan lain","Legacy creative subject-exit CTA is removed");
lacks(creativeCss,".completed","Legacy creative completion-card CSS is removed");

const creativeBranch=route.indexOf('runtime === "drawing" || runtime === "coloring"');
const fallbackBranch=route.indexOf("<WorldActivityScreen");
assert(creativeBranch>=0&&fallbackBranch>creativeBranch,"production drawing/coloring remains intercepted by CreativePractice before fallback");
has(route,"<CreativePracticeActivity","production creative route stays CreativePractice-owned");

has(fallbackColoring,"<ActivityCompletion","legacy fallback Coloring remains canonical if invoked directly");
has(fallbackColoring,"onTryAgain={retry}","legacy fallback Coloring keeps its existing local replay behavior");
has(fallbackColoring,"onDone(completeActivity(childId, activity.id));","legacy fallback Coloring keeps renderer-owned progress write");

const completionIndex=creative.indexOf("{completionOpen ? <ActivityCompletion");
const drawingIndex=creative.indexOf('{activity.runtime==="drawing" ? <DrawingCanvas');
assert(drawingIndex>=0&&completionIndex>drawingIndex,"Completion overlays after the workspace instead of replacing it");

console.log("SI-06G Creative static boundary PASS: production Drawing/Coloring use canonical Completion as a dismissible overlay while strokes/fills stay mounted; persisted completion does not auto-cover a reopened workspace; fallback Coloring remains canonical and unreachable before CreativePractice.");
