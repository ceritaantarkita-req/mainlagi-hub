import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_ODD_ONE_OUT_QA_PORT??4027);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-odd-category-animal-vehicle";
const activityId="logic-odd-category-animal-vehicle";
const correctLabel="Pilih yang berbeda: Mobil";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]});
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);
  server.stderr.on("data",append);
}

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Odd-one-out QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const completedActivityIds=["logic-match-pairs","logic-odd-one-out"];

    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{
        completedActivityIds,
        stars:0,
        lastActivityId:"logic-odd-one-out"
      }
    }));

    const seeds=[
      {activityId:"logic-match-pairs",runtime:"matching",skillId:"logic.visual.matching"},
      {activityId:"logic-odd-one-out",runtime:"tap_choice",skillId:"logic.visual.discrimination"}
    ];
    const attempts=seeds.map((seed,index)=>{
      const attemptId=`qa-odd-one-out-prereq-${index}`;
      const completedAt=`2026-09-14T11:1${index}:00.000Z`;
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
        correctCount:2,
        incorrectCount:0,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"odd-one-out-browser-prerequisite"},
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
  });
}

async function waitForBoard(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-odd-one-out]");
    return scene?.getAttribute("data-odd-one-out-ready")==="true"&&scene.querySelectorAll("[data-odd-one-out-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>{
      const element=document.activeElement;
      return{inScene:Boolean(element?.closest?.("[data-odd-one-out]")),choice:Boolean(element?.hasAttribute?.("data-odd-one-out-choice")),tag:element?.tagName??"",label:element?.getAttribute?.("aria-label")??""};
    });
    if(focused.inScene&&focused.choice&&focused.tag==="BUTTON"&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong odd-one-out choice");
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce"});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`odd-one-out bad HTTP at ${viewport.width}`);
    await waitForBoard(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept canonical Logic foundation prerequisites at ${viewport.width}`);

    const choices=page.locator("[data-odd-one-out-choice]");
    assert.equal(await choices.count(),3,"representative odd-one-out keeps canonical trio");
    const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));
    assert.deepEqual(new Set(labels),new Set([
      "Pilih yang berbeda: Anjing",
      "Pilih yang berbeda: Kucing",
      "Pilih yang berbeda: Mobil"
    ]));

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`odd-one-out overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"odd-one-out cards keep touch targets");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"odd-one-out cards remain inside viewport");
    }

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-odd-one-out-idle.png`),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong outsider must not complete canonical activity");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-odd-one-out-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct outsider completes canonical activity");
    assert.equal(await page.locator("[data-odd-one-out-summary]").count(),1,"success reveals common-pair summary");

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    const nextBox=await nextLink.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(nextBox,"odd-one-out success CTA must render");
    assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`odd-one-out success CTA must remain fully visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"odd-one-out records attempt evidence");
    assert.equal(state.assessed,true,"Logic odd-one-out remains assessed");
    assert.equal(state.metadata?.evidenceFidelity,"choice_odd_one_out_interaction");
    assert.equal(state.metadata?.commonTrait,"Dua pilihan sama-sama hewan");
    assert.equal(state.metadata?.outsiderChoice,"🚗");
    assert.equal(state.metadata?.selectedChoice,"🚗");
    assert.equal(state.metadata?.comparedItemCount,3);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-odd-one-out-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log(`Odd-one-out browser QA passed ${viewports.length} viewports with canonical Logic foundation progression, keyboard wrong-state, pointer completion, trio layout, CTA and assessed evidence checks.`);
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
