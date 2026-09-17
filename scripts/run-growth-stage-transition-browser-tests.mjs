import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_GROWTH_STAGE_QA_PORT??4042);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-cycle-chick";
const activityId="science-cycle-chick";
const correctLabel="Pilih tahap: ayam dewasa";
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
  throw new Error(`Growth-stage QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const requiredIds=["science-living-dog","science-match-living-nonliving","science-plant-needs-sunlight","science-animal-fur-cat","science-match-animal-homes-a","science-sense-eyes-see","science-weather-rain-clue"];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["science-living-dog","science.living.basic_classification"],
      ["science-plant-needs-sunlight","science.plants.parts_needs.basic"],
      ["science-animal-fur-cat","science.animals.features_habitat.basic"],
      ["science-sense-eyes-see","science.observation.senses.basic"],
      ["science-weather-rain-clue","science.weather.daynight.basic"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId=`qa-growth-stage-prereq-${index}`;
      const completedAt=`2026-09-18T00:0${index}:00.000Z`;
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-living-observation-basics",runtime:"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"growth-stage-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForBoard(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-growth-stage-transition]");
    return scene?.getAttribute("data-growth-stage-transition-ready")==="true"&&scene.querySelectorAll("[data-growth-stage-choice]").length===3&&scene.querySelectorAll("[data-growth-stage-choice-visual]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-growth-stage-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong growth-stage choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const touchMode=viewport.width===390;
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:touchMode});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`growth-stage bad HTTP at ${viewport.width}`);
    await waitForBoard(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science readiness at ${viewport.width}`);

    assert.equal(await page.locator("[data-growth-stage-prompt]").textContent(),"Anak ayam akan tumbuh menjadi apa?","canonical prompt remains byte-for-byte visible");
    assert.equal(await page.locator("[data-growth-stage-transition]").getAttribute("data-transition-mode"),"next_adult_stage");
    assert.match(await page.locator("[data-growth-known]").innerText(),/anak ayam/);
    const target=page.locator("[data-growth-target]");
    assert.equal(await target.getAttribute("data-growth-target-state"),"unknown","idle target remains unknown");
    assert.match(await target.innerText(),/Tahap dewasa berikutnya/);
    assert.doesNotMatch(await target.innerText(),/ayam dewasa/i,"idle target must not reveal correct answer");

    const choices=page.locator("[data-growth-stage-choice]");
    assert.equal(await choices.count(),3,"growth-stage keeps three canonical choices");
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.textContent?.trim()??"")),["🐔ayam dewasa","🦆bebek dewasa","🐦burung merpati"],"choice visuals keep canonical labels and order");
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("data-stage-key"))),["adult_chicken","adult_duck","adult_pigeon"],"representative board exposes deterministic stage keys");
    assert.equal(await completed(page),false,"idle growth-stage state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`growth-stage overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"growth-stage choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"growth-stage choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle growth-stage feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-growth-stage-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong growth-stage choice cannot complete activity");
    assert.equal(await target.getAttribute("data-growth-target-state"),"unknown","wrong answer keeps target unknown");
    assert.doesNotMatch(await target.innerText(),/ayam dewasa/i,"wrong feedback must not reveal correct answer");
    await assertFullyVisible(status,viewportHeight,`retry growth-stage feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-growth-stage-try.png`),fullPage:false});

    const correctChoice=page.getByRole("button",{name:correctLabel});
    if(touchMode)await correctChoice.tap();
    else await correctChoice.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct growth-stage choice completes canonical activity");
    assert.equal(await target.getAttribute("data-growth-target-state"),"complete","success fills target slot only after correct selection");
    assert.match(await target.innerText(),/ayam dewasa/);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`growth-stage success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"growth-stage records attempt evidence");
    assert.equal(state.assessed,true,"growth-stage activity remains assessed");
    assert.equal(state.metadata?.source,"growth-stage-transition-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_growth_stage_transition_interaction");
    assert.equal(state.metadata?.transitionMode,"next_adult_stage");
    assert.equal(state.metadata?.selectedChoice,"ayam dewasa");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-growth-stage-success.png`),fullPage:false});
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
  console.log(`Pattern 42 browser QA passed ${viewports.length} viewports with Science readiness, hidden target until correct, keyboard retry, pointer/touch completion, touch targets and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
