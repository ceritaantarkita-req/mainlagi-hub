import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const has=(source,literal,message)=>assert(source.includes(literal),message);
const lacks=(source,literal,message)=>assert(!source.includes(literal),message);

const owners=[
  ["phrase",read("src/components/learning/PhraseSceneMatchActivity.tsx"),read("src/components/learning/PhraseSceneMatchActivity.module.css"),"choice_phrase_scene_interaction"],
  ["picture",read("src/components/learning/PictureWordMatchActivity.tsx"),read("src/components/learning/PictureWordMatchActivity.module.css"),"choice_picture_word_match_interaction"],
  ["sentence",read("src/components/learning/SentenceOrderCardsActivity.tsx"),read("src/components/learning/SentenceOrderCardsActivity.module.css"),"choice_sentence_order_cards_interaction"],
  ["reading",read("src/components/learning/ReadingPassageQuestionActivity.tsx"),read("src/components/learning/ReadingPassageQuestionActivity.module.css"),"choice_reading_passage_question_interaction"],
  ["cloze",read("src/components/learning/ClozeSentenceChoiceActivity.tsx"),read("src/components/learning/ClozeSentenceChoiceActivity.module.css"),"choice_cloze_sentence_interaction"]
];
const route=read("src/app/child/[childId]/activity/[activity]/page.tsx");
const bridge=read("src/components/learning/LearningAttemptBridge.tsx");

for(const [name,source,css,fidelity] of owners){
  has(source,'import { ActivityCompletion } from "./ActivityCompletion"',`${name} imports canonical ActivityCompletion`);
  has(source,"emitLearningRuntimeMeasurement({",`${name} keeps explicit runtime measurement`);
  has(source,fidelity,`${name} keeps evidence fidelity metadata`);
  has(source,"completeActivity(childId, activity.id)",`${name} keeps renderer-owned progress write`);
  has(source,"<ActivityCompletion",`${name} renders canonical Completion on success`);
  lacks(source,'import Link from "next/link"',`${name} removes local success navigation owner`);
  lacks(source,"<Link className={styles.nextLink}",`${name} removes local success CTA`);
  lacks(css,".nextLink",`${name} removes orphaned local success CTA CSS`);
  for(const literal of [
    "incorrectRef.current = 0;",
    "retryRef.current = 0;",
    "setSelected(null);",
    'setFeedback("idle");'
  ]){
    has(source,literal,`${name} Again resets local interaction state: ${literal}`);
  }
  assert.match(
    source,
    /emitLearningRuntimeMeasurement\(\{[\s\S]*?completeActivity\(childId, activity\.id\);[\s\S]*?setFeedback\("good"\);/,
    `${name} preserves measurement -> progress -> presentation ordering`
  );
}

for(const component of [
  "PhraseSceneMatchActivity",
  "PictureWordMatchActivity",
  "SentenceOrderCardsActivity",
  "ReadingPassageQuestionActivity",
  "ClozeSentenceChoiceActivity"
]){
  has(route,`<${component}`,`${component} remains a production dispatcher owner`);
}

has(bridge,"LEARNING_MEASUREMENT_EVENT","LearningAttemptBridge remains measurement event owner");
has(bridge,"explicit ?? measuredOutcome(activityId, stats)","explicit measured outcomes keep precedence");
lacks(bridge,"ActivityCompletion","Completion presentation does not move into evidence ownership");

console.log("SI-06B2 sentence/reading static boundary PASS: five specialized owners use canonical Completion, keep explicit evidence/progress ownership, and expose local Again reset semantics.");
