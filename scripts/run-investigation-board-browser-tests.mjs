import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_INVESTIGATION_BOARD_QA_PORT??4032);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-investigate-plant-light";
const activityId="science-investigate-plant-light";
const correctLabel="Pilih jawaban: Pertumbuhan tanaman";
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
  throw new Error(`Investigation-board QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const requiredIds=[
      "science-earth-sun-day",
      "science-match-sky-observation-c",
      "science-body-wash-hands",
      "science-eco-plant-sun-water",
      "science-env-trash-bin",
      "science-measure-longer-pencil"
    ];
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["science-earth-sun-day","science.earth.sky_patterns.basic"],
      ["science-body-wash-hands","science.body.health_habits.basic"],
      ["science-eco-plant-sun-water","science.ecosystem.dependencies.basic"],
      ["science-env-trash-bin","science.environment.care.basic"],
      ["science-measure-longer-pencil","science.observation.measurement.basic"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId=`qa-investigation-board-prereq-${index}`;
      const completedAt=`2026-09-15T14:2${index}:00.000Z`;
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-earth-body-environment",runtime:"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"investigation-board-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-investigation-board]");
    return scene?.getAttribute("data-investigation-board-ready")==="true"&&scene.querySelectorAll("[data-investigation-choice]").length===3&&scene.querySelectorAll("[data-investigation-step]").length===4&&scene.querySelectorAll("[data-investigation-focus]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-investigation-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong investigation-board choice");
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
    assert(response&&response.status()<400,`investigation-board bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science Wave C readiness at ${viewport.width}`);

    const scene=page.locator("[data-investigation-board]");
    assert.equal(await scene.getAttribute("data-investigation-mode"),"observe");
    assert.equal(await page.locator("[data-investigation-step='observe'][aria-current='step']").count(),1,"representative activity highlights observe step");
    assert.equal(await page.getByText("Tanaman A: air sama + mendapat cahaya").count(),1);
    assert.equal(await page.getByText("Tanaman B: air sama + tanpa cahaya").count(),1);
    assert.equal(await page.getByText("Yang perlu dibandingkan").count(),1);

    const choices=page.locator("[data-investigation-choice]");
    assert.equal(await choices.count(),3,"investigation board keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih jawaban: Pertumbuhan tanaman",
      "Pilih jawaban: Warna pot",
      "Pilih jawaban: Nama pemilik"
    ]));
    assert.equal(await completed(page),false,"idle investigation board cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`investigation board overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"investigation-board choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"investigation-board choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle investigation feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-investigation-board-idle.png`),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong investigation answer cannot complete activity");
    await assertFullyVisible(status,viewportHeight,`retry investigation feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-investigation-board-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct investigation answer completes canonical activity");
    await assertFullyVisible(status,viewportHeight,`success investigation feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`investigation success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"investigation board records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"investigation-board-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_investigation_board_interaction");
    assert.equal(state.metadata?.investigationMode,"observe");
    assert.equal(state.metadata?.modeLabel,"Amati");
    assert.equal(state.metadata?.scenarioTitle,"Bandingkan dua tanaman");
    assert.equal(state.metadata?.focusLabel,"Yang perlu dibandingkan");
    assert.equal(state.metadata?.selectedChoice,"Pertumbuhan tanaman");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-investigation-board-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log(`Investigation-board browser QA passed ${viewports.length} viewports with Science Wave C progression, keyboard wrong-state, pointer completion, responsive visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
