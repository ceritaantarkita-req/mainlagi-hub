import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_PHENOMENON_RELATION_QA_PORT??4047);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-earth-sun-day";
const activityId="science-earth-sun-day";
const correctLabel="Pilih hubungan: siang hari";
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
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Phenomenon-relation QA server did not become ready.\n"+serverLog.slice(-4000));
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const requiredIds=["science-cycle-butterfly","science-match-young-adult-b","science-animal-needs-food-water","science-material-glass-transparent","science-water-ice-melts","science-force-push-door"];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["science-cycle-butterfly","science.life_cycles.basic"],
      ["science-animal-needs-food-water","science.organisms.needs_food.basic"],
      ["science-material-glass-transparent","science.materials.properties.basic"],
      ["science-water-ice-melts","science.water.state_changes.basic"],
      ["science-force-push-door","science.forces.motion.basic"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId="qa-phenomenon-prereq-"+index;
      const completedAt="2026-09-18T07:2"+index+":00.000Z";
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-life-material-motion",runtime:"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"phenomenon-relation-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}
async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-phenomenon-relation-board]");
    return scene?.getAttribute("data-phenomenon-relation-ready")==="true"&&scene.querySelectorAll("[data-phenomenon-relation-choice]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-phenomenon-relation-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong phenomenon-relation choice");
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
    assert(response&&response.status()<400,"phenomenon-relation bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route);

    const scene=page.locator("[data-phenomenon-relation-board]");
    assert.equal(await scene.getAttribute("data-relation-mode"),"sun_day_relation");
    assert.equal(await scene.getAttribute("data-relation-resolved"),"false");
    assert.equal(await page.locator("[data-relation-observation]").getByText("Tempat kita menghadap Matahari",{exact:true}).count(),1);
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"Pilih hubungan");

    const choices=page.locator("[data-phenomenon-relation-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label"))),[
      "Pilih hubungan: siang hari",
      "Pilih hubungan: malam hari",
      "Pilih hubungan: musim hujan selalu"
    ]);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false]);
    assert.equal(await completed(page),false);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"phenomenon-relation overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"phenomenon-relation choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"phenomenon-relation choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,"idle phenomen feedback");
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-phenomenon-relation-idle.png"),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong relation cannot complete");
    assert.equal(await scene.getAttribute("data-relation-resolved"),"false","wrong answer cannot resolve target slot");
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"Pilih hubungan","wrong answer cannot reveal canonical result");
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false],"choices remain retryable after wrong answer");
    await assertFullyVisible(status,viewportHeight,"retry phenomenon feedback");
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-phenomenon-relation-try.png"),fullPage:false});

    const correct=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correct.tap(); else await correct.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true);
    assert.equal(await scene.getAttribute("data-relation-resolved"),"true");
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"siang hari");
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,"success phenomen feedback");
    await assertFullyVisible(nextLink,viewportHeight,"phenomen success CTA");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"phenomenon relation board records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"phenomenon-relation-board-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_phenomenon_relation_interaction");
    assert.equal(state.metadata?.relationMode,"sun_day_relation");
    assert.equal(state.metadata?.selectedChoice,"siang hari");
    assert.equal(state.metadata?.observationLabel,"Tempat kita menghadap Matahari");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-phenomenon-relation-success.png"),fullPage:false});
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log("Pattern 46 phenomenon-relation browser QA passed 3 viewports with Science readiness, unresolved wrong-state, keyboard, pointer/actual-touch completion, touch targets and assessed evidence.");
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
