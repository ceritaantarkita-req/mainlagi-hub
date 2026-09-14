import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { validateColoringArt } from "./validate-coloring-art.mjs";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {coloringScene}=require(path.resolve(".learning-test-dist/src/lib/learning/coloringScenes.js"));
const art=ACTIVITIES.filter(activity=>activity.runtime==="coloring").map(activity=>({id:activity.id,regions:coloringScene(activity.id)}));

assert.equal(art.length,100,"coloring catalog must stay at 100 activities");
const geometryGroups=new Map();
for(const item of art){
  const fingerprint=JSON.stringify(item.regions);
  const group=geometryGroups.get(fingerprint)??[];
  group.push(item.id);
  geometryGroups.set(fingerprint,group);
}
const duplicates=[...geometryGroups.values()].filter(group=>group.length>1);
assert.equal(duplicates.length,0,"WS-06 must leave zero exact coloring geometry duplicate groups");

const waveAIds=new Set([
  "color-scene-sunset","color-neighbor-sky","color-mood-cheerful","color-story-morning","color-time-morning","color-time-noon","color-time-evening",
  "color-paca","color-parts-robot","color-fantasy-robot","color-material-metal","color-limited-three-robot","color-character-space",
  "color-mood-adventure","color-scene-search","color-scene-journey","color-scene-discovery",
  "color-scene-meadow","color-scene-forest","color-neighbor-flowers","color-capstone-fantasy-garden",
  "color-mood-dreamy","color-story-night-camp","color-time-night",
  "color-object-flower","color-limited-two-flower","color-capstone-free-palette",
  "color-palette-fish","color-neighbor-fish","color-limited-three-fish",
  "color-pattern-checker","color-material-fabric","color-limited-three-pattern",
  "color-scene-rainy","color-story-rain-trip","color-season-rainy",
  "color-warm-cool-balloons","color-story-party","color-scene-celebrate"
]);
const waveBIds=new Set([
  "color-parts-cat","color-contrast-umbrella","color-limited-two-house","color-transport-car","color-contrast-kite",
  "color-warm-sun","color-scene-pond","color-pattern-circles","color-character-creature","color-capstone-dream-room"
]);
assert.equal(waveAIds.size,39,"Wave A authored ID count changed unexpectedly");
assert.equal(waveBIds.size,10,"Wave B must author one side of each remaining pair");
const previewIds=new Set([...waveAIds,...waveBIds]);
assert.equal(previewIds.size,49,"authored coloring preview count must be 49");

const previewDir=path.resolve(".mobile-route-qa/ws06-coloring-previews");
mkdirSync(previewDir,{recursive:true});
const palette=["#f6bd53","#7ac6c0","#f39576","#b7acd9","#99c987","#fffaf0"];
const escape=value=>String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");
for(const activity of art.filter(item=>previewIds.has(item.id))){
  const content=activity.regions.map((region,index)=>`<path d="${escape(region.path)}"${region.transform?` transform="${escape(region.transform)}"`:""} fill="${palette[index%palette.length]}" stroke="#284e50" stroke-width="4" stroke-linejoin="round"/>`).join("");
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${content}</svg>`))
    .resize(480,360,{fit:"contain",background:{r:255,g:250,b:240,alpha:0}})
    .webp({quality:85})
    .toFile(path.join(previewDir,`${activity.id}.webp`));
}

const browser=await chromium.launch({headless:true});
try {
  await validateColoringArt(await browser.newPage(),art);
  console.log(`Coloring SVG parser regression PASS: ${art.length}/100 illustrations; exact duplicate geometry = 0; ${previewIds.size} authored previews exported.`);
}finally{
  await browser.close();
}
