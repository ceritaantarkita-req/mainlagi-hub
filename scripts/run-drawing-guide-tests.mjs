import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);

const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve(".learning-test-dist/src/lib/learning/system.js"));
const {drawingGuide,DRAWING_GUIDE_IDS}=require(path.resolve(".learning-test-dist/src/lib/learning/drawingGuides.js"));

const drawingActivities=ACTIVITIES.filter(activity=>activity.runtime==="drawing");
assert.equal(drawingActivities.length,100,"drawing catalog must stay at 100 activities");
assert.equal(DRAWING_GUIDE_IDS.length,75,"WS-07 Wave B must produce exactly 75 explicit drawing scaffolds total");
assert.equal(new Set(DRAWING_GUIDE_IDS).size,DRAWING_GUIDE_IDS.length,"drawing guide ids must be unique");
assert.equal(new Set(DRAWING_GUIDE_IDS.map(id=>JSON.stringify(drawingGuide(id)))).size,DRAWING_GUIDE_IDS.length,"drawing scaffold definitions must not be exact duplicates");

const waveAIds=new Set([
  "drawing-object-cup","drawing-object-boat","drawing-object-house","drawing-object-car","drawing-object-icecream",
  "drawing-animal-cat","drawing-animal-fish","drawing-animal-bird","drawing-animal-butterfly","drawing-animal-snail",
  "drawing-nature-tree","drawing-nature-flower","drawing-nature-leaf","drawing-nature-cloud-rain","drawing-nature-rainbow",
  "drawing-face-happy","drawing-face-surprised","drawing-face-hair","drawing-person-stick","drawing-people-friends",
  "drawing-scene-park","drawing-scene-beach","drawing-scene-road","drawing-scene-night","drawing-scene-garden"
]);
assert.equal(waveAIds.size,25,"WS-07 Wave A scope must remain 25 concrete drawing activities");

const waveBIds=new Set([
  "drawing-space-near-far","drawing-space-overlap","drawing-space-horizon","drawing-space-path-depth","drawing-space-window-view",
  "drawing-texture-fur","drawing-texture-scales","drawing-texture-brick","drawing-texture-grass","drawing-texture-water",
  "drawing-symmetry-butterfly","drawing-symmetry-mask","drawing-symmetry-flower","drawing-symmetry-robot","drawing-symmetry-kite",
  "drawing-story-seed-sprout","drawing-story-rain-sun","drawing-story-ball-roll","drawing-story-build-house","drawing-story-friend-wave",
  "drawing-focus-big-small","drawing-focus-center-side","drawing-focus-frame","drawing-focus-path","drawing-focus-crowd"
]);
assert.equal(waveBIds.size,25,"WS-07 Wave B scope must remain 25 structured-skill drawing activities");
for(const id of [...waveAIds,...waveBIds]){
  const activity=drawingActivities.find(item=>item.id===id);
  assert(activity,`WS-07 activity must exist: ${id}`);
  const guide=drawingGuide(id);
  assert(guide,`WS-07 activity must have a functional guide: ${id}`);
  assert.equal(guide.mode,"complete",`WS-07 authored guide must be a non-interactive starter: ${id}`);
  assert(guide.paths.length>0,`WS-07 guide must contain paths: ${id}`);
}

const remainingYoungWithoutGuide=drawingActivities.filter(activity=>activity.ageMin<=5 && !drawingGuide(activity.id));
assert.equal(remainingYoungWithoutGuide.length,25,"WS-07 Wave B must reduce Q106-equivalent missing scaffolds from 50 to 25");

const escape=value=>String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");
const previewDir=path.resolve(".mobile-route-qa/ws07-drawing-previews");
mkdirSync(previewDir,{recursive:true});
for(const id of waveBIds){
  const guide=drawingGuide(id);
  const strokes=guide.paths.map(d=>`<path d="${escape(d)}" fill="none" stroke="#438781" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${strokes}</svg>`))
    .resize(480,360,{fit:"contain",background:{r:255,g:250,b:240,alpha:0}})
    .webp({quality:85})
    .toFile(path.join(previewDir,`${id}.webp`));
}

const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  for(const id of DRAWING_GUIDE_IDS){
    const guide=drawingGuide(id);
    const paths=guide.paths.map((d,index)=>`<path data-i="${index}" d="${escape(d)}" fill="none" stroke="black"/>`).join("");
    await page.setContent(`<svg viewBox="0 0 480 480" width="480" height="480">${paths}</svg>`);
    const metrics=await page.locator("path").evaluateAll(nodes=>nodes.map(node=>{
      const bounds=node.getBBox();
      return {length:node.getTotalLength(),x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height};
    }));
    assert(metrics.length===guide.paths.length,`all scaffold paths must parse: ${id}`);
    for(const metric of metrics){
      assert(Number.isFinite(metric.length)&&metric.length>0,`scaffold path must have nonzero length: ${id}`);
      assert(metric.x>=-1&&metric.y>=-1&&metric.x+metric.width<=481&&metric.y+metric.height<=481,`scaffold path must remain inside 480x480 canvas: ${id} ${JSON.stringify(metric)}`);
    }
  }
  console.log(`Drawing scaffold regression PASS: ${DRAWING_GUIDE_IDS.length}/100 activities have explicit functional guides; Wave A ${waveAIds.size}; Wave B ${waveBIds.size}; ${remainingYoungWithoutGuide.length} Q106-equivalent activities remain; ${waveBIds.size} Wave B preview artifacts exported.`);
}finally{
  await browser.close();
}
