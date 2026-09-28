import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);
const block=(source,start,end)=>{
  const i=source.indexOf(start);
  const j=source.indexOf(end,i+start.length);
  assert(i>=0&&j>i,`missing source block ${start} -> ${end}`);
  return source.slice(i,j);
};

const fallback=read("src/components/learning/ChildLearningPlatform.tsx");
const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const gameplay=read("src/lib/learning/gameplayPresentation.ts");
const world=read("src/components/learning/world/WorldExperience.tsx");

const choice=block(fallback,"function ChoiceActivity","function MatchingActivity");
const matching=block(fallback,"function MatchingActivity","function TraceActivity");
const trace=block(fallback,"function TraceActivity","function ColoringActivity");
const coloring=block(fallback,"function ColoringActivity","function StoryActivity");
const story=block(fallback,"function StoryActivity","function MotionActivity");
const motion=block(fallback,"function MotionActivity","export function ActivityScreen");
const screen=block(fallback,"export function ActivityScreen","export function GamesScreen");

for(const [name,source] of [["choice",choice],["matching",matching],["trace",trace],["coloring",coloring],["story",story]]){
  has(source,"<ActivityCompletion",`${name} fallback owner uses shared ActivityCompletion`);
}

has(choice,"onDone(completeActivity(childId, activity.id));","choice preserves renderer-owned completion write");
has(choice,'setFeedback("good");',"choice completion presentation follows completion write");
has(choice,"const retry = () => setFeedback(null);","choice Again resets only local feedback");
lacks(choice,"Hebat! Aktivitas selesai.","choice removes local success presentation");

has(matching,"onDone(completeActivity(childId, activity.id));","matching keeps existing completion write");
has(matching,"onTryAgain={retry}","matching keeps existing local replay owner");

has(trace,"onDone(completeActivity(childId, activity.id));","trace preserves renderer-owned completion write");
has(trace,"setDone(true);","trace local success state remains renderer-owned");
has(trace,"onTryAgain={reset}","trace Again reuses existing canvas reset");
lacks(trace,"Bagus! Latihan menulismu selesai.","trace removes local success banner");

has(coloring,"onDone(completeActivity(childId, activity.id));","legacy coloring code is normalized if invoked directly");
has(coloring,"onTryAgain={retry}","legacy coloring has local replay reset");

has(story,"onDone(completeActivity(childId, activity.id));","story preserves renderer-owned completion write");
has(story,"const retry = () => setDone(false);","story Again resets only local completion state");
has(story,"<ActivityCompletion","story replaces local subject exit with canonical completion");

lacks(screen,"Pilih permainan lain","fallback ActivityScreen no longer adds a second post-success exit");
lacks(screen,"const done =","fallback screen no longer derives presentation from persisted completion");
has(screen,'activity.runtime === "motion_game" ? <MotionActivity',"motion redirect stays outside Completion migration");
has(motion,"/play/${activity.gameSlug}","motion owner remains a redirect to Main Gerak");
lacks(motion,"ActivityCompletion","SI-06A does not invent motion completion semantics");

const coloringBranch=route.indexOf('runtime === "drawing" || runtime === "coloring"');
const fallbackBranch=route.lastIndexOf("<WorldActivityScreen");
assert(coloringBranch>=0&&fallbackBranch>coloringBranch,"production coloring is intercepted by CreativePractice before fallback owner");
has(route,"<CreativePracticeActivity","production coloring/drawing remains CreativePractice-owned until SI-06G");

const countBranch=route.indexOf("isCountAndSelectActivity(definition)");
assert(countBranch>=0&&fallbackBranch>countBranch,"count/select classifier runs before WorldActivityScreen fallback");
has(gameplay,'"math-count-3"',"math-count-3 remains in count/select presentation family");
has(route,"<CountAndSelectActivity","math-count-3 production path remains specialized CountAndSelect");
lacks(world,'import { ActivityCompletion } from "../ActivityCompletion"',"SI-06A leaves superseded MathCount fallback untouched");

console.log("SI-06A fallback Belajar static boundary PASS: reachable Choice/Matching/Trace/Story use canonical Completion; Motion stays redirect-only; Coloring and MathCount superseded production routes stay with their current owners.");
