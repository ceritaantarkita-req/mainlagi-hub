import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {choiceGameplayPresentation,matchingPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));

const expectedMemory=new Set([
  "letters-match-case-cd","letters-match-case-ef","letters-match-case-bce",
  "letters-match-case-gh","letters-match-case-ij","letters-match-case-klm",
  "letters-match-case-no","letters-match-case-pq","letters-match-case-rst",
  "letters-match-case-uv","letters-match-case-wx","letters-match-case-yz"
]);
const memory=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="memory_pairs");
assert.equal(memory.length,expectedMemory.size,"memory-pair family size must remain intentional");
assert.deepEqual(new Set(memory.map(activity=>activity.id)),expectedMemory,"only the 12 Latin upper/lower case matching activities use memory pairs");
for(const activity of memory){
  assert.equal(activity.runtime,"matching");
  assert.equal(activity.subjectId,"letters");
  assert((activity.matchItems??[]).length>=4,"memory activity has at least two pairs");
}
const otherMatching=ACTIVITIES.filter(activity=>activity.runtime==="matching"&&!expectedMemory.has(activity.id));
assert(otherMatching.length>0,"default matching family remains available for mechanic variety");
assert(otherMatching.every(activity=>matchingPresentation(activity)==="grid_pairs"),"non-case matching remains on the canonical visible grid");

const expectedSequence=new Set([
  "letters-order-after-g","letters-order-between-jl","letters-order-before-m",
  "letters-order-after-n","letters-order-between-pr","letters-order-before-t",
  "letters-order-after-u","letters-order-between-vx","letters-order-before-z","letters-order-end-wxyz"
]);
const sequence=ACTIVITIES.filter(activity=>choiceGameplayPresentation(activity)==="sequence_slot");
assert.equal(sequence.length,expectedSequence.size,"sequence-slot family size must remain intentional");
assert.deepEqual(new Set(sequence.map(activity=>activity.id)),expectedSequence,"only the ten canonical alphabet-order activities use sequence slots");
for(const activity of sequence){
  assert.equal(activity.runtime,"tap_choice");
  assert.equal(activity.subjectId,"letters");
  assert.equal((activity.choices??[]).length,3);
  assert((activity.choices??[]).includes(activity.correctChoice),"sequence slot preserves canonical correctChoice");
}
const otherChoice=ACTIVITIES.filter(activity=>activity.runtime==="tap_choice"&&!expectedSequence.has(activity.id));
assert(otherChoice.length>0,"default choice activities remain available");
assert(otherChoice.every(activity=>choiceGameplayPresentation(activity)==="default"),"non-sequence choice families must not be silently reclassified");

console.log(`Gameplay presentation regression PASS: ${memory.length} memory_pair + ${sequence.length} sequence_slot activities; ${otherMatching.length} matching and ${otherChoice.length} choice activities retain their existing presentations.`);
