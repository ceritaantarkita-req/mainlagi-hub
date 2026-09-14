import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {matchingPresentation}=require(path.resolve(".learning-test-dist/src/lib/learning/gameplayPresentation.js"));

const expected=new Set([
  "letters-match-case-cd","letters-match-case-ef","letters-match-case-bce",
  "letters-match-case-gh","letters-match-case-ij","letters-match-case-klm",
  "letters-match-case-no","letters-match-case-pq","letters-match-case-rst",
  "letters-match-case-uv","letters-match-case-wx","letters-match-case-yz"
]);
const memory=ACTIVITIES.filter(activity=>matchingPresentation(activity)==="memory_pairs");
assert.equal(memory.length,expected.size,"memory-pair family size must remain intentional");
assert.deepEqual(new Set(memory.map(activity=>activity.id)),expected,"only the 12 Latin upper/lower case matching activities use memory pairs");
for(const activity of memory){
  assert.equal(activity.runtime,"matching");
  assert.equal(activity.subjectId,"letters");
  assert((activity.matchItems??[]).length>=4,"memory activity has at least two pairs");
}
const otherMatching=ACTIVITIES.filter(activity=>activity.runtime==="matching"&&!expected.has(activity.id));
assert(otherMatching.length>0,"default matching family remains available for mechanic variety");
assert(otherMatching.every(activity=>matchingPresentation(activity)==="grid_pairs"),"non-case matching remains on the canonical visible grid");
console.log(`Gameplay presentation regression PASS: ${memory.length} letter case activities use memory_pairs while ${otherMatching.length} matching activities keep grid_pairs.`);
