import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_DRAG_TARGET_QA_PORT??4016);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-match-animal-homes-a";
const activityId="science-match-animal-homes-a";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]});
  const append=(chunk)=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);server.stderr.on("data",append);
}
async function waitForServer(){const started=Date.now();while(Date.now()-started<60000){try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}await new Promise(r=>setTimeout(r,400));}throw new Error(`Drag-target QA server did not become ready.\n${serverLog.slice(-4000)}`);}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const completedActivityIds=["science-living-cat","science-match-habitat","science-find-plant"];
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({[childId]:{completedActivityIds,stars:0,lastActivityId:"science-find-plant"}}));
    const seeds=[
      {activityId:"science-living-cat",runtime:"tap_choice",skillId:"science.living.classification"},
      {activityId:"science-match-habitat",runtime:"matching",skillId:"science.animals.habitat"},
      {activityId:"science-find-plant",runtime:"tap_choice",skillId:"science.living.classification"}
    ];
    const attempts=seeds.map((seed,index)=>{const completedAt=`2026-09-14T12:0${index}:00.000Z`;const attemptId=`qa-drag-prereq-${index}`;return{id:attemptId,childId,activityId:seed.activityId,subjectId:"science",stageId:"science-foundations",runtime:seed.runtime,difficulty:1,status:"completed",assessed:true,score:1,accuracy:1,correctCount:seed.runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"drag-target-browser-prerequisite"},evidence:[{attemptId,activityId:seed.activityId,skillId:seed.skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};});
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function waitForHydratedBoard(page){await page.waitForLoadState("load");await page.waitForFunction(()=>{const scene=document.querySelector("[data-drag-target]");return scene?.getAttribute("data-drag-target-ready")==="true"&&scene.querySelectorAll("[data-drag-source-pair]").length===3&&scene.querySelectorAll("[data-drag-target-pair]").length===3;},undefined,{timeout:6000});await page.waitForTimeout(80);}

async function keyboardWrongPlacement(page){
  let selected=false;const trace=[];
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({label:document.activeElement?.getAttribute?.("aria-label")??"",tag:document.activeElement?.tagName??""}));
    trace.push(`${focused.tag}:${focused.label||"(no label)"}`);
    if(!selected&&focused.label.startsWith("🐟 ikan")){await page.keyboard.press("Enter");selected=true;continue;}
    if(selected&&focused.label.startsWith("Target sarang")){await page.keyboard.press("Enter");return;}
  }
  throw new Error(`Keyboard drag-target wrong path not reached. ${trace.join(" -> ")}`);
}

async function touchTap(locator,page){const box=await locator.boundingBox();assert(box,"touch target must have a box");await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();const pageErrors=[];const consoleErrors=[];
    page.on("pageerror",e=>pageErrors.push(e.message));page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text());});
    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`drag target bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science prerequisites at ${viewport.width}`);

    const sources=page.locator("[data-drag-source-pair]");const targets=page.locator("[data-drag-target-pair]");
    assert.equal(await sources.count(),3);assert.equal(await targets.count(),3);
    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`drag target overflow at ${viewport.width}`);
    for(const locator of [sources,targets]){const geometry=await locator.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{width:r.width,height:r.height,left:r.left,right:r.right};}));for(const item of geometry){assert(item.width>=44&&item.height>=44,"drag controls keep touch target");assert(item.left>=-1&&item.right<=viewportWidth+1,"drag controls remain inside viewport");}}

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-drag-target-idle.png`),fullPage:false});
    await keyboardWrongPlacement(page);
    await page.getByRole("status").filter({hasText:"Belum cocok"}).waitFor({state:"visible",timeout:2000});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-drag-target-try.png`),fullPage:false});

    await page.dragAndDrop('[data-drag-source-pair="fish"]','[data-drag-target-pair="fish"]');
    await page.waitForFunction(()=>document.querySelector('[data-drag-target-pair="fish"]')?.getAttribute("class")?.includes("targetMatched"));

    await touchTap(page.locator('[data-drag-source-pair="bird"]'),page);
    await touchTap(page.locator('[data-drag-target-pair="bird"]'),page);
    await page.locator('[data-drag-source-pair="rabbit"]').click();
    await page.locator('[data-drag-target-pair="rabbit"]').click();

    await page.getByRole("status").filter({hasText:"Semua pasangan"}).waitFor({state:"visible",timeout:2000});
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});const nextBox=await nextLink.boundingBox();const viewportHeight=await page.evaluate(()=>window.innerHeight);assert(nextBox,"drag target success CTA must render");assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`drag target success CTA must remain fully visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");const list=attempts["demo-gian"]??[];return{completed:(progress["demo-gian"]?.completedActivityIds??[]).includes(id),attempt:[...list].reverse().find(item=>item.activityId===id)};},{id:activityId});
    assert.equal(state.completed,true,"drag target completes canonical activity");assert(state.attempt,"drag target records attempt");assert.equal(state.attempt.assessed,true);assert.equal(state.attempt.metadata?.evidenceFidelity,"matching_drag_target_interaction");assert.equal(state.attempt.metadata?.matchedPairCount,3);assert.equal(state.attempt.correctCount,3);assert.equal(state.attempt.incorrectCount,1);assert.equal(state.attempt.retryCount,1);assert.equal(state.attempt.accuracy,0.75);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-drag-target-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{await browser.close();}
}

async function main(){startServer();await waitForServer();for(const viewport of viewports)await inspect(viewport);console.log(`Drag-target browser QA passed ${viewports.length} viewports with valid progression, keyboard wrong-state, mouse drag, touch fallback, responsive layout, in-viewport CTA, completion, and assessed evidence checks.`);}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
