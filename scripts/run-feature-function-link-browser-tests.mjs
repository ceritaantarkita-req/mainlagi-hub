import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { assertLearningVisualContainment } from "./lib/assert-learning-visual-containment.mjs";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_FEATURE_FUNCTION_QA_PORT??4024);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-feature-duck-webbed-feet";
const activityId="science-feature-duck-webbed-feet";
const correctLabel="Hubungkan fungsi: Berenang di air";
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
  throw new Error(`Feature-function QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      const attemptId=`qa-feature-function-prereq-${index}`;
      const completedAt=`2026-09-15T01:1${index}:00.000Z`;
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-earth-body-environment",runtime:"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"feature-function-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-feature-function-link]");
    return scene?.getAttribute("data-feature-function-link-ready")==="true"&&scene.querySelectorAll("[data-feature-function-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>{
      const element=document.activeElement;
      return{inScene:Boolean(element?.closest?.("[data-feature-function-link]")),choice:Boolean(element?.hasAttribute?.("data-feature-function-choice")),tag:element?.tagName??"",label:element?.getAttribute?.("aria-label")??""};
    });
    if(focused.inScene&&focused.choice&&focused.tag==="BUTTON"&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong feature-function choice");
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
    assert(response&&response.status()<400,`feature-function bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    await assertLearningVisualContainment(page,"[data-feature-function-link]",`feature-function visual containment at ${viewport.width}`);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science Wave C readiness at ${viewport.width}`);

    const choices=page.locator("[data-feature-function-choice]");
    assert.equal(await choices.count(),3);
    const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));
    assert.deepEqual(new Set(labels),new Set([
      "Hubungkan fungsi: Berenang di air",
      "Hubungkan fungsi: Menggali batu keras",
      "Hubungkan fungsi: Memanjat dinding licin"
    ]));

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`feature-function overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"feature-function choice keeps touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"feature-function choice remains inside viewport");
    }

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-feature-function-idle.png`),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByRole("status").filter({hasText:"belum cocok"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong feature-function link must not complete");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-feature-function-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    const nextBox=await nextLink.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(nextBox,"feature-function success CTA must render");
    assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`feature-function success CTA must remain visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return{completed:(progress["demo-gian"]?.completedActivityIds??[]).includes(id),attempt:[...list].reverse().find(item=>item.activityId===id)};
    },{id:activityId});
    assert.equal(state.completed,true);
    assert(state.attempt);
    assert.equal(state.attempt.assessed,true);
    assert.equal(state.attempt.metadata?.evidenceFidelity,"choice_feature_function_link_interaction");
    assert.equal(state.attempt.metadata?.subjectLabel,"Bebek");
    assert.equal(state.attempt.metadata?.featureLabel,"Kaki berselaput");
    assert.equal(state.attempt.metadata?.linkedFunction,"Berenang di air");
    assert.equal(state.attempt.correctCount,1);
    assert.equal(state.attempt.incorrectCount,1);
    assert.equal(state.attempt.retryCount,1);
    assert.equal(state.attempt.accuracy,.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-feature-function-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log(`Feature-function browser QA passed ${viewports.length} viewports with legitimate Science Wave C progression, keyboard wrong-state, pointer completion, layout, CTA and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
