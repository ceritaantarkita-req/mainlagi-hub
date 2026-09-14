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
const browser=await chromium.launch({headless:true});
try {
  await validateColoringArt(await browser.newPage(),art);
  console.log(`Coloring SVG parser regression PASS: ${art.length}/100 illustrations.`);
}finally{await browser.close();}
