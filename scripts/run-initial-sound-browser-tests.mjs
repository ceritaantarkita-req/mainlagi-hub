import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { assertLearningVisualContainment } from "./lib/assert-learning-visual-containment.mjs";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_INITIAL_SOUND_QA_PORT??4036);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/bahasa-awal-bola";
const activityId="bahasa-awal-bola";
const correctLabel="Pilih huruf B";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024},{width:1280,height:800}];
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
  throw new Error(`Initial-sound QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const completedActivityIds=[
      "bahasa-cari-a",
      "bahasa-dengar-a",
      "bahasa-pasang-awal",
      "bahasa-cerita-teman"
    ];
    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds,stars:9,lastActivityId:"bahasa-cerita-teman"}
    }));
    const completedAt="2026-09-16T10:00:00.000Z";
    localStorage.setItem(attemptsKey,JSON.stringify({
      [childId]:[{
        id:"qa-initial-sound-story-prereq",
        childId,
        activityId:"bahasa-cerita-teman",
        subjectId:"bahasa",
        stageId:"bahasa-cerita",
        runtime:"story",
        difficulty:1,
        status:"completed",
        assessed:false,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"initial-sound-browser-prerequisite",evidenceFidelity:"completion_only"},
        evidence:[],
        masteryEligible:false
      }]
    }));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-initial-sound]");
    return scene?.getAttribute("data-initial-sound-ready")==="true"&&scene.querySelectorAll("[data-initial-sound-choice]").length===3&&scene.querySelectorAll("[data-initial-sound-result]").length===1;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function keyboardWrongChoice(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-initial-sound-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong initial-sound choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
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
    assert(response&&response.status()<400,`initial-sound bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    await assertLearningVisualContainment(page,"[data-initial-sound]",`initial-sound visual containment at ${viewport.width}`);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate prior Bahasa readiness at ${viewport.width}`);

    const board=page.locator("[data-initial-sound-board]");
    assert.equal(await board.count(),1,"initial-sound board renders");
    const semanticVisual=board.locator('[data-learning-semantic-key="object.ball"][data-learning-visual-source="semantic-svg"]');
    assert.equal(await semanticVisual.count(),1,"representative board activates approved semantic ball SVG");
    assert.equal(await semanticVisual.locator('img[src="/artwork/learning-illustrations/object-ball-v1.svg"][data-learning-semantic-image]').count(),1,"ball semantic visual comes from canonical registry-backed SVG path");
    assert.equal(await board.getByText("⚽").count(),0,"approved semantic SVG replaces the platform fallback glyph");
    assert.equal(await board.getByText("ola",{exact:true}).count(),1,"word remainder stays visible as canonical cue");
    assert.equal(await board.getByText("Ucapkan: bola",{exact:true}).count(),1,"board asks child to articulate the canonical word");

    const result=page.locator("[data-initial-sound-result]");
    assert.equal((await result.textContent())?.trim(),"?","initial sound stays hidden before assessment");
    assert.equal(await result.getAttribute("aria-label"),"Bunyi awal belum terisi");

    const choices=page.locator("[data-initial-sound-choice]");
    assert.equal(await choices.count(),3,"initial sound keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih huruf B","Pilih huruf D","Pilih huruf P"
    ]));
    assert.equal(await completed(page),false,"idle initial-sound state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`initial sound overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"initial-sound choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"initial-sound choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle initial-sound feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-initial-sound-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong initial letter cannot complete activity");
    assert.equal((await result.textContent())?.trim(),"?","wrong choice must not reveal initial sound");
    await assertFullyVisible(status,viewportHeight,`retry initial-sound feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-initial-sound-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct initial letter completes canonical activity");
    assert.equal((await result.textContent())?.trim(),"B","success may reveal canonical initial sound");
    assert.equal(await result.getAttribute("aria-label"),"Bunyi awal B");
    await assertFullyVisible(status,viewportHeight,`success initial-sound feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`initial-sound success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"initial sound records attempt evidence");
    assert.equal(state.assessed,true,"initial-sound activity remains assessed");
    assert.equal(state.metadata?.source,"initial-sound-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_initial_sound_interaction");
    assert.equal(state.metadata?.word,"bola");
    assert.equal(state.metadata?.initialSound,"B");
    assert.equal(state.metadata?.selectedChoice,"B");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-initial-sound-success.png`),fullPage:false});
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
  console.log(`Initial-sound browser QA passed ${viewports.length} viewports with legitimate Bahasa readiness, visible clue/word remainder, keyboard wrong-state, pointer completion, masked initial, feedback/CTA visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
