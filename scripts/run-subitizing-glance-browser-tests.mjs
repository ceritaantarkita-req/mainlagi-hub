import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SUBITIZING_GLANCE_QA_PORT??4044);
const baseUrl="http://"+host+":"+port;
const route="/child/demo-gian/activity/math-subitize-4";
const activityId="math-subitize-4";
const correctLabel="Pilih jumlah 4";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);
  server.stderr.on("data",append);
}

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Subitizing-glance QA server did not become ready.\n"+serverLog.slice(-4000));
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const prerequisiteId="math-pattern-touch";
    const completedAt="2026-09-18T02:00:00.000Z";
    const attemptId="qa-subitizing-prereq-0";

    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds:[prerequisiteId],stars:0,lastActivityId:prerequisiteId}
    }));

    localStorage.setItem(attemptsKey,JSON.stringify({
      [childId]:[{
        id:attemptId,
        childId,
        activityId:prerequisiteId,
        subjectId:"math",
        stageId:"math-pola",
        runtime:"matching",
        difficulty:2,
        status:"completed",
        assessed:true,
        score:1,
        accuracy:1,
        correctCount:2,
        incorrectCount:0,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"subitizing-browser-prerequisite"},
        evidence:[{
          attemptId,
          activityId:prerequisiteId,
          skillId:"math.pattern.matching",
          score:1,
          weight:1,
          createdAt:completedAt,
          qualifiesForMastery:true
        }],
        masteryEligible:true
      }]
    }));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-subitizing-glance]");
    return scene?.getAttribute("data-subitizing-glance-ready")==="true"&&scene.querySelectorAll("[data-subitizing-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({
      choice:Boolean(document.activeElement?.hasAttribute?.("data-subitizing-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong subitizing choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,label+" must render");
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,label+" must remain fully visible");
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"subitizing bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,"progression guard must accept seeded Math readiness");
    assert.equal(await page.locator("[data-subitizing-glance]").getAttribute("data-pattern-mode"),"square");
    assert.equal(await completed(page),false,"idle subitizing cannot complete");

    const cells=page.locator("[data-cell-index]");
    const dots=page.locator('[data-subitizing-dot="true"]');
    assert.equal(await cells.count(),9,"subitizing uses a stable 3x3 spatial board");
    assert.equal(await dots.count(),4,"representative activity renders exactly four dots");
    const dotIndexes=(await dots.evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute("data-cell-index"))))).sort((a,b)=>a-b);
    assert.deepEqual(dotIndexes,[0,2,6,8],"four-dot activity keeps the audited square arrangement");
    assert.equal(await page.locator("[data-subitizing-pattern]").getAttribute("aria-label"),"Empat titik membentuk empat sudut persegi.");

    await page.waitForTimeout(320);
    assert.equal(await page.locator('[data-subitizing-dot="true"]').count(),4,"stimulus remains visible; Pattern 44 has no forced timer or auto-hide");

    const choices=page.locator("[data-subitizing-choice]");
    assert.equal(await choices.count(),3);
    const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));
    assert.deepEqual(labels,["Pilih jumlah 3","Pilih jumlah 4","Pilih jumlah 5"],"subitizing keeps canonical choice order");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"subitizing overflows horizontally at "+viewport.width);

    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"subitizing choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"subitizing choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,"idle subitizing feedback");
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-subitizing-idle.png"),fullPage:false});

    const wrong=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrong,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong subitizing answer cannot complete");
    assert.equal(await page.locator('[data-subitizing-dot="true"]').count(),4,"wrong answer does not hide or mutate the audited stimulus");
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-subitizing-try.png"),fullPage:false});

    const correct=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correct.tap();else await correct.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct subitizing answer completes canonical activity");

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,"success subitizing feedback");
    await assertFullyVisible(nextLink,viewportHeight,"subitizing success CTA");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});

    assert(state,"subitizing records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"subitizing-glance-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_subitizing_interaction");
    assert.equal(state.metadata?.patternMode,"square");
    assert.equal(state.metadata?.selectedChoice,"4");
    assert.equal(state.metadata?.visibleDotCount,4);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-subitizing-success.png"),fullPage:false});
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log("Pattern 44 browser QA passed 3 viewports with stable spatial stimulus, keyboard retry, pointer/actual-touch completion, touch targets and assessed evidence checks.");
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
