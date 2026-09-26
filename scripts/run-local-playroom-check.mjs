import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright";
import { validateColoringArt } from "./validate-coloring-art.mjs";

const root=process.cwd();
// Product QA owns and recreates .qa/. Keep this suite's evidence independent.
const output=path.join(root,".qa-playroom");
mkdirSync(output,{recursive:true});
const base="http://127.0.0.1:4022";
const compile=spawnSync(process.execPath,["node_modules/typescript/bin/tsc","-p","tsconfig.learning-tests.json"],{cwd:root,stdio:"inherit"});
assert.equal(compile.status,0,"learning modules compile");
const require=createRequire(import.meta.url);
const system=require(path.join(root,".learning-test-dist/src/lib/learning/system.js"));
const {coloringScene}=require(path.join(root,".learning-test-dist/src/lib/learning/coloringScenes.js"));
const {drawingGuide,DRAWING_GUIDE_IDS}=require(path.join(root,".learning-test-dist/src/lib/learning/drawingGuides.js"));
const {childDestination}=require(path.join(root,".learning-test-dist/src/lib/learning/entry.js"));
const art=system.ACTIVITIES.filter(a=>a.runtime==="coloring").map(a=>({id:a.id,regions:coloringScene(a.id)}));
assert.equal(art.length,100);
assert.equal(childDestination("test","https://evil.example"),"/child/test/home");
assert.equal(childDestination("test","color"),"/child/test/subject/color");
assert.equal(childDestination("../escape","color"),"/child/..%2Fescape/subject/color");

let log="";
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-H","127.0.0.1","-p","4022"],{cwd:root,env:{...process.env,MAINLAGI_QA_UNLOCK_ALL:"1"},stdio:["ignore","pipe","pipe"]});
server.stdout.on("data",chunk=>{log+=chunk;});
server.stderr.on("data",chunk=>{log+=chunk;});
let browser;
const result={status:"RUNNING",coloringArt:100,viewports:[],checks:[],screenshots:[]};
try {
  let ready=false;
  for(let i=0;i<120;i++){
    if(server.exitCode!==null)throw Error("Local server exited: "+log);
    try{if((await fetch(base)).ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  assert(ready,"local server starts");
  browser=await chromium.launch({headless:true});
  for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:1505,height:1045}]){
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
    await page.goto(base);
    assert.equal(await page.getByText("100 aktivitas",{exact:true}).count(),0,"subject cards do not expose activity-count subtitles");
    await page.getByRole("link",{name:"Mewarnai",exact:true}).click();
    await page.waitForURL(/child\/select\?continue=1&subject=color/);
    await page.getByRole("link",{name:/Gian — Demo/}).click();
    await page.waitForURL(/child\/demo-gian\/subject\/color$/);
    assert.equal(await page.getByRole("link",{name:"Jelajahi",exact:true}).count(),0);
    assert.equal(await page.getByLabel("Area belajar").count(),0);
    await page.locator("[data-activity-gallery]").waitFor();
    assert.equal(await page.locator("[data-activity-id]").count(),100,"complete 100-card catalog remains present across playable + browse-all areas");
    assert(await page.locator('a[href^="/child/demo-gian/stage/"]').count()>0,"open stage journey is visible");
    assert.equal(await page.locator("[data-recommended-activity]").count(),1,"one recommended next activity is prominent");
    assert(await page.locator('[data-playable-activity-gallery] a[href^="/child/demo-gian/activity/"]').count()>0,"playable activities are immediately visible");
    await page.locator('[data-playable-activity-gallery] a[href^="/child/demo-gian/activity/"]').first().waitFor();
    await page.getByText(/Lihat semua 100 permainan/).click();
    await page.getByRole("button",{name:"Lingkaran besar, belum terbuka",exact:true}).click();
    await page.getByRole("dialog",{name:"Ikuti perjalanan belajarmu"}).waitFor();
    await page.getByRole("button",{name:"Oke, pilih lagi",exact:true}).click();
    assert.equal(await page.locator("dialog[open]").count(),0,"availability dialog closes");
    assert(await page.locator("[data-activity-stage-group]").count()>0,"catalog is grouped by learning stage");
    assert.equal(await page.locator("[data-preview-kind]").count(),100,"every catalog card has a visual preview");

    await page.goto(base+"/child/demo-gian/subject/color?qa=unlock-all");
    await page.locator("[data-qa-unlock-all]").waitFor();
    assert.equal(await page.locator("[data-activity-id]").count(),100,"QA unlock-all keeps the complete catalog visible");
    assert.equal(await page.locator('[data-activity-id] a[href^="/child/demo-gian/activity/"]').count(),100,"QA unlock-all makes all demo catalog cards directly playable");
    assert.equal(await page.locator("[data-all-activity-gallery]").count(),0,"QA unlock-all has no locked browse-all remainder");
    assert(await page.locator("[data-activity-stage-group]").count()>1,"QA catalog remains grouped instead of becoming one wall");
    const stageItems=await page.locator("[data-stage-journey-item]").count();
    assert.equal(await page.locator('[data-stage-journey] a[href^="/child/demo-gian/stage/"]').count(),stageItems,"QA unlock-all exposes every stage journey link");
    const qaShot=`color-gallery-qa-${viewport.width}.png`;
    await page.screenshot({path:path.join(output,qaShot),fullPage:false});
    result.screenshots.push(qaShot);

    result.checks.push("subject intent preserved "+viewport.width);
    result.checks.push("recommended path + grouped browse all + isolated QA unlock "+viewport.width);
    await page.goto(base+"/child/demo-gian/learn");
    await page.waitForURL(/child\/demo-gian\/home#choose-subject$/);
    result.checks.push("legacy learn route returns home "+viewport.width);
    await page.goto(base);
    await page.waitForURL(/child\/demo-gian\/home$/);
    assert.equal(await page.getByRole("heading",{name:"Belajar sambil bermain.",exact:true}).count(),1);
    assert.equal(await page.getByRole("link",{name:"Belajar",exact:true}).count(),1);
    assert.equal(await page.getByRole("link",{name:"Bermain",exact:true}).count(),1);
    const subjectLinks=page.locator('[data-core-thumbnail-card="subject"]');
    assert.equal(await subjectLinks.count(),9);
    assert.equal(await page.getByText(/\b100 aktivitas\b/).count(),0,"child home hides activity-count subtitles");
    const subjectGridColumns=await subjectLinks.first().evaluate(element=>getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length);
    assert.equal(subjectGridColumns,viewport.width<=760?2:3,"subject directory uses responsive 2/3-column thumbnail grid at "+viewport.width+"px");
    const homeHero=page.locator("[data-mainlagi-home-hero] img").first();
    await homeHero.waitFor();
    await homeHero.evaluate(image=>image.decode());
    const heroLayout=await homeHero.evaluate(image=>{
      const rect=image.getBoundingClientRect();
      return {width:rect.width,height:rect.height,src:image.currentSrc||image.getAttribute("src")||""};
    });
    assert(heroLayout.src.includes("core-thumbnails"),"child home hero uses core thumbnail asset");
    assert(Math.abs(heroLayout.width/heroLayout.height-4/3)<.04,"child home hero stays 4:3 at "+viewport.width+"px: "+JSON.stringify(heroLayout));
    await page.screenshot({path:path.join(output,`home-${viewport.width}.png`),fullPage:true});
    result.screenshots.push(`home-${viewport.width}.png`);
    result.checks.push("returning child bypasses setup "+viewport.width);
    await page.goto(base+"/child/demo-gian/activity/color-paca");
    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    assert(await finish.isDisabled());
    await page.getByRole("button",{name:"Biru",exact:true}).click();
    await page.getByRole("button",{name:"Warnai panel perut",exact:true}).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator('[data-color-region="12"]').getAttribute("fill"),"#7cb9dd");
    assert(await finish.isEnabled());
    await page.getByRole("button",{name:"Urungkan",exact:true}).click();
    assert(await finish.isDisabled());
    await page.getByRole("button",{name:"Warnai panel perut",exact:true}).click();
    await page.getByRole("button",{name:"Mulai ulang",exact:true}).click();
    assert(await finish.isDisabled());
    await page.getByRole("button",{name:"Urungkan",exact:true}).click();
    assert(await finish.isEnabled(),"reset can itself be undone");
    await finish.click();
    await page.getByRole("status").filter({hasText:"Karyamu selesai"}).waitFor();
    await page.screenshot({path:path.join(output,`color-${viewport.width}.png`),fullPage:true});
    result.screenshots.push(`color-${viewport.width}.png`);
    const width=await page.evaluate(()=>({viewport:innerWidth,body:document.body.scrollWidth}));
    assert(width.body<=width.viewport+1,"creative view does not overflow horizontally");
    result.checks.push("color choice, keyboard fill, undo, recoverable reset, completion "+viewport.width);
    await page.goto(base+"/child/demo-gian/activity/drawing-line-vertical");
    const canvas=page.getByLabel("Kanvas menggambar");
    await canvas.waitFor();
    await page.locator('[data-drawing-guide="trace"]').waitFor();
    await page.getByRole("button",{name:"Sembunyikan panduan",exact:true}).click();
    assert.equal(await page.locator("[data-drawing-guide]").count(),0);
    await page.getByRole("button",{name:"Lihat panduan",exact:true}).click();
    await page.locator('[data-drawing-guide="trace"]').waitFor();
    const bounds=await canvas.boundingBox();
    await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+bounds.height*.2);
    await page.mouse.down();
    await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+bounds.height*.8,{steps:12});
    await page.mouse.up();
    assert(await page.getByRole("button",{name:"Selesai",exact:true}).isEnabled());
    await page.getByRole("button",{name:"Urungkan",exact:true}).click();
    assert(await page.getByRole("button",{name:"Selesai",exact:true}).isDisabled());
    result.checks.push("drawing stroke and undo "+viewport.width);
    for(const id of ["drawing-dots-star","drawing-compose-face-features"]) {
      await page.goto(base+"/child/demo-gian/activity/"+id);
      await page.locator("[data-drawing-guide]").waitFor();
      const shot=`${id}-${viewport.width}.png`;
      await page.screenshot({path:path.join(output,shot),fullPage:false});
      result.screenshots.push(shot);
    }
    await page.goto(base+"/child/demo-gian/subject/drawing");
    await page.locator("[data-activity-gallery]").waitFor();
    assert.equal(await page.locator("[data-activity-id]").count(),100);
    assert(await page.locator('a[href^="/child/demo-gian/stage/"]').count()>0);
    const galleryShot=`drawing-gallery-${viewport.width}.png`;
    await page.screenshot({path:path.join(output,galleryShot),fullPage:false});
    result.screenshots.push(galleryShot);
    assert.deepEqual(errors,[],"no console or runtime errors");
    result.viewports.push(viewport);
    await context.close();
  }
  const page=await browser.newPage();
  const guideErrors=[];
  page.on("pageerror",error=>guideErrors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")guideErrors.push(message.text());});
  assert.equal(DRAWING_GUIDE_IDS.length,100,"100 explicit drawing scaffolds after final WS-07 wave");
  assert.equal(new Set(DRAWING_GUIDE_IDS.map(id=>JSON.stringify(drawingGuide(id)))).size,100,"scaffolds are not identical");
  for(const id of DRAWING_GUIDE_IDS) {
    await page.goto(base+"/child/demo-gian/activity/"+id);
    await page.locator("[data-drawing-guide]").waitFor();
    assert.equal(new URL(page.url()).pathname,"/child/demo-gian/activity/"+id,"guide route must not redirect");
    assert.equal(await page.locator("[data-drawing-guide]").getAttribute("data-drawing-guide"),drawingGuide(id).mode);
    assert(await page.locator("[data-drawing-guide] path").evaluateAll(paths=>paths.every(path=>Number.isFinite(path.getTotalLength())&&path.getTotalLength()>0)),"guide paths parse with nonzero length");
    assert(await page.getByRole("button",{name:"Selesai",exact:true}).isDisabled(),"guide is not counted as the child's stroke");
    const response=await page.request.get(base+"/artwork/activity-previews/"+id+".webp");
    assert(response.ok(),"drawing thumbnail exists: "+id);
  }
  assert.deepEqual(guideErrors,[],"all drawing guide routes have no runtime or parser errors");
  result.checks.push("100 real drawing scaffolds, direct routes, matching thumbnails, no synthetic completion");
  await validateColoringArt(page,art);
  result.checks.push("100 coloring illustrations parsed by Chromium");
  result.status="PASS";
}catch(error){result.status="FAIL";result.error=String(error);process.exitCode=1;}
finally{
  await browser?.close();
  if(!server.killed)server.kill("SIGTERM");
  writeFileSync(path.join(output,"report.json"),JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify(result,null,2));
}
