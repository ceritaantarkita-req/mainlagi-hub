import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";
import { validateColoringArt } from "./validate-coloring-art.mjs";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {coloringScene}=require(path.resolve(".learning-test-dist/src/lib/learning/coloringScenes.js"));
const art=ACTIVITIES.filter(activity=>activity.runtime==="coloring").map(activity=>({id:activity.id,regions:coloringScene(activity.id)}));

assert.equal(art.length,100,"coloring catalog must stay at 100 activities");
const geometryGroups=new Map();
for(const scene of art){
  const fingerprint=JSON.stringify(scene.regions);
  const group=geometryGroups.get(fingerprint)??[];
  group.push(scene.id);
  geometryGroups.set(fingerprint,group);
}
const duplicates=[...geometryGroups.values()].filter(group=>group.length>1);
assert.ok(duplicates.every(group=>group.length===2),`WS-06 Wave A must eliminate all 3+ duplicate geometry groups: ${JSON.stringify(duplicates.filter(group=>group.length>2))}`);
assert.equal(duplicates.length,10,"Wave A intentionally leaves exactly ten medium duplicate pairs for WS-06 Wave B");
assert.equal(duplicates.reduce((sum,group)=>sum+group.length,0),20,"Wave A must reduce duplicate-geometry findings from 59 to the 20 medium-pair activities only");

const browser=await chromium.launch({headless:true});
try {
  await validateColoringArt(await browser.newPage(),art);
  console.log(`Coloring SVG parser regression PASS: ${art.length}/100 illustrations; high-severity duplicate geometry groups eliminated, ${duplicates.length} medium pairs remain.`);
}finally{await browser.close();}
