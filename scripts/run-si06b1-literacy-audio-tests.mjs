import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const audio=read("src/components/learning/AudioChoiceLearningActivity.tsx");
const symbol=read("src/components/learning/SymbolHuntChoiceActivity.tsx");
const syllable=read("src/components/learning/SyllableAssemblyActivity.tsx");
const initial=read("src/components/learning/InitialSoundActivity.tsx");
const syllableCss=read("src/components/learning/SyllableAssemblyActivity.module.css");
const initialCss=read("src/components/learning/InitialSoundActivity.module.css");
const symbolCss=read("src/components/learning/SymbolHuntChoiceActivity.module.css");
const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");
for(const [name,source] of [["audio",audio],["symbol",symbol],["syllable",syllable],["initial",initial]]){
  has(source,'import { ActivityCompletion } from "./ActivityCompletion"',`${name} B1 owner imports ActivityCompletion`);
  has(source,"completeActivity(childId, activity.id)",`${name} keeps renderer-owned completeActivity write`);
  has(source,"<ActivityCompletion",`${name} success renders canonical Completion`);
  lacks(source,"Hebat! Aktivitas selesai.",`${name} removes generic local success banner`);
}

has(audio,"const retry = () => setFeedback(null);","AudioChoice Again resets local feedback only");
lacks(audio,"useLearningProgress","AudioChoice no longer derives success presentation from persisted progress");
lacks(audio,"const done =","AudioChoice removes persisted-progress success exit");
has(audio,"audioFallback","AudioChoice keeps audio availability/fallback ownership");
has(audio,"Pilih permainan lain dulu.","AudioChoice keeps non-success unavailable-audio escape copy");
has(audio,"observeActivityEntrySpeech","AudioChoice keeps managed entry speech");
has(audio,"speakPrompt","AudioChoice keeps canonical audio manager facade");

has(symbol,'const retry = () => setFeedback("idle");',"SymbolHunt Again resets local feedback");
lacks(symbol,'import Link from "next/link"',"SymbolHunt removes local success navigation owner");
lacks(symbol,"Ketemu! ⭐","SymbolHunt removes local success card");
lacks(symbolCss,".feedbackGood","SymbolHunt removes orphaned local success CSS");

for(const [name,source,fidelity] of [
  ["syllable",syllable,"choice_syllable_assembly_interaction"],
  ["initial",initial,"choice_initial_sound_interaction"]
]){
  has(source,"emitLearningRuntimeMeasurement({",`${name} keeps explicit runtime measurement`);
  has(source,fidelity,`${name} keeps evidence fidelity metadata`);
  assert.match(
    source,
    /emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);[\s\S]*?setFeedback\("good"\);/,
    `${name} preserves measurement -> progress -> presentation ordering`
  );
  for(const literal of ["incorrectRef.current = 0;","retryRef.current = 0;","setSelected(null);",'setFeedback("idle");']){
    has(source,literal,`${name} Again resets local measured interaction state: ${literal}`);
  }
  lacks(source,'import Link from "next/link"',`${name} removes local success navigation owner`);
  lacks(source,"Pilih permainan lain",`${name} removes local success exit copy`);
}

lacks(syllableCss,".nextLink","SyllableAssembly removes orphaned success CTA CSS");
lacks(initialCss,".nextLink","InitialSound removes orphaned success CTA CSS");

assert(
  route.indexOf('runtime === "listen_and_choose"') < route.indexOf('definition?.choicePresentation === "symbol_hunt"'),
  "dispatcher keeps AudioChoice before symbol-hunt specialization"
);
has(route,"<AudioChoiceLearningActivity","AudioChoice remains current production owner for listen_and_choose");
has(route,"<SymbolHuntChoiceActivity","SymbolHunt remains current production symbol owner");
has(route,"<SyllableAssemblyActivity","SyllableAssembly remains current production owner");
has(route,"<InitialSoundActivity","InitialSound remains current production owner");

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation does not move into evidence ownership");

console.log("SI-06B1 literacy/audio static boundary PASS: AudioChoice, SymbolHunt, SyllableAssembly and InitialSound keep canonical Completion while audio/evidence ownership stays local; later SI batches may migrate their own owners independently.");
