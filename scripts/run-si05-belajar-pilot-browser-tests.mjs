import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SI05_PILOT_QA_PORT??4068);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-odd-category-animal-vehicle";
const activityId="logic-odd-category-animal-vehicle";
const portrait={width:390,height:844};
const landscape={width:844,height:390};
const outDir=path.resolve(".mobile-route-qa/si05-belajar-pilot");
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

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function waitForServer(timeoutMs=60000){
  const started=Date.now();
  while(Date.now()-started<timeoutMs){
    try{
      const response=await fetch(baseUrl+route);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`SI-05 pilot QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function seedPrerequisites(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const completedActivityIds=["logic-match-pairs","logic-odd-one-out"];
    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds,stars:0,lastActivityId:"logic-odd-one-out"}
    }));

    const seeds=[
      {activityId:"logic-match-pairs",runtime:"matching",skillId:"logic.visual.matching"},
      {activityId:"logic-odd-one-out",runtime:"tap_choice",skillId:"logic.visual.discrimination"}
    ];
    const attempts=seeds.map((seed,index)=>{
      const attemptId=`si05-pilot-prereq-${index}`;
      const completedAt=`2026-09-28T00:0${index}:00.000Z`;
      return{
        id:attemptId,
        childId,
        activityId:seed.activityId,
        subjectId:"logic",
        stageId:"logic-foundations",
        runtime:seed.runtime,
        difficulty:1,
        status:"completed",
        assessed:true,
        score:1,
        accuracy:1,
        correctCount:1,
        incorrectCount:0,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"si05-pilot-prerequisite"},
        evidence:[{
          attemptId,
          activityId:seed.activityId,
          skillId:seed.skillId,
          score:1,
          weight:1,
          createdAt:completedAt,
          qualifiesForMastery:true
        }],
        masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
    window.__si05DocumentMarker="pilot-document";
  });
}

async function waitForBoard(page){
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-odd-one-out]");
    return scene?.getAttribute("data-odd-one-out-ready")==="true"
      && scene.querySelectorAll("[data-odd-one-out-choice]").length===3;
  },null,{timeout:8000});
}

async function targetAttempts(page){
  return page.evaluate(({id})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return (state["demo-gian"]??[]).filter(item=>item.activityId===id);
  },{id:activityId});
}

async function waitForTargetAttemptCount(page,count){
  await page.waitForFunction(({id,expected})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    const list=(state["demo-gian"]??[]).filter(item=>item.activityId===id);
    return list.length===expected;
  },{id:activityId,expected:count},{timeout:5000});
}

async function assertNoOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.viewport+1&&metrics.body<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}

async function main(){
  mkdirSync(outDir,{recursive:true});
  startServer();
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:portrait,reducedMotion:"reduce",hasTouch:true});
  await seedPrerequisites(context);
  const page=await context.newPage();
  const pageErrors=[];
  const consoleErrors=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

  try{
    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"SI-05 pilot route must load");
    await waitForBoard(page);
    assert.equal((await targetAttempts(page)).length,0,"pilot target starts without an attempt");

    await page.getByRole("button",{name:"Pilih yang berbeda: Anjing"}).click();
    await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:3000});
    assert.equal((await targetAttempts(page)).length,0,"wrong answer must not write completion attempt");

    await page.getByRole("button",{name:"Pilih yang berbeda: Mobil"}).click();

    const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({state:"visible",timeout:5000});
    await waitForTargetAttemptCount(page,1);

    assert.equal(await completion.getAttribute("data-completion-context"),"belajar","pilot uses Belajar canonical Completion");
    assert.equal(await completion.getAttribute("data-completion-stars"),"3","pilot keeps three-star Completion");
    assert.deepEqual(
      await completion.locator("[data-completion-action]").evaluateAll(nodes=>nodes.map(node=>node.textContent?.trim())),
      ["Back","Again","Next","Share"],
      "pilot action order remains canonical"
    );

    let attempts=await targetAttempts(page);
    assert.equal(attempts.length,1,"successful pilot writes exactly one attempt");
    const attempt=attempts[0];
    assert.equal(attempt.assessed,true,"pilot attempt remains assessed");
    assert.equal(attempt.metadata?.evidenceFidelity,"choice_odd_one_out_interaction","pilot preserves explicit evidence fidelity");
    assert.equal(attempt.metadata?.commonTrait,"Dua pilihan sama-sama hewan");
    assert.equal(attempt.metadata?.outsiderChoice,"🚗");
    assert.equal(attempt.metadata?.selectedChoice,"🚗");
    assert.equal(attempt.correctCount,1);
    assert.equal(attempt.incorrectCount,1);
    assert.equal(attempt.retryCount,1);
    assert.equal(attempt.accuracy,0.5);

    const progress=await page.evaluate(({id})=>{
      const state=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
      return (state["demo-gian"]?.completedActivityIds??[]).includes(id);
    },{id:activityId});
    assert.equal(progress,true,"pilot keeps existing completeActivity progression write");

    await assertNoOverflow(page,"pilot portrait completion");
    await page.screenshot({path:path.join(outDir,"390-completion.png"),fullPage:false});

    await completion.locator('[data-completion-action="share"]').click();
    const share=page.locator('[data-canonical-share="v1"]');
    await share.waitFor({state:"visible",timeout:5000});
    await page.waitForFunction(()=>document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate")==="allowed",null,{timeout:5000});
    assert.equal(await share.getAttribute("data-share-public-path"),"/","pilot Share remains public-safe Belajar origin");
    assert.equal((await targetAttempts(page)).length,1,"opening Share must not create another attempt");

    await page.setViewportSize(landscape);
    await page.waitForFunction(()=>document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation")==="landscape",null,{timeout:5000});
    assert.equal(await page.evaluate(()=>window.__si05DocumentMarker),"pilot-document","rotation must not reload the pilot document");
    assert.equal(await share.evaluate(node=>node.open),true,"Share stays open through pilot rotation");
    assert.equal(await completion.isVisible(),true,"Completion stays mounted through pilot rotation");
    assert.equal((await targetAttempts(page)).length,1,"rotation with Share open must not duplicate attempt/evidence");
    await assertNoOverflow(page,"pilot landscape Share");
    await page.screenshot({path:path.join(outDir,"844x390-share.png"),fullPage:false});

    await share.getByRole("button",{name:"Tutup"}).click();
    await page.setViewportSize(portrait);
    await page.waitForFunction(()=>document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation")==="portrait",null,{timeout:5000});
    assert.equal((await targetAttempts(page)).length,1,"closing Share and portrait recovery must not duplicate attempt");

    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    await waitForBoard(page);
    const choices=page.locator("[data-odd-one-out-choice]");
    assert.equal(await choices.count(),3,"Again returns to the same pilot board");
    assert.equal(await choices.evaluateAll(nodes=>nodes.every(node=>!node.disabled)),true,"Again re-enables pilot choices");
    assert.equal((await targetAttempts(page)).length,1,"Again local reset must not create a second attempt before another completion");

    await page.screenshot({path:path.join(outDir,"390-again-reset.png"),fullPage:false});
    assert.deepEqual(pageErrors,[],`SI-05 page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`SI-05 console errors: ${consoleErrors.join(" | ")}`);

    console.log("SI-05 Belajar pilot browser QA PASS: OddOneOut preserves assessed evidence, writes one completion attempt, uses canonical Completion+Share, survives rotation, and Again resets only local presentation state.");
  }finally{
    await context.close();
    await browser.close();
    stopServer();
  }
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
  stopServer();
});
