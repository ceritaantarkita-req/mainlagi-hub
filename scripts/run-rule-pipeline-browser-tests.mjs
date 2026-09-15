import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_RULE_PIPELINE_QA_PORT??4026);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-compose-red-circle-to-star";
const activityId="logic-compose-red-circle-to-star";
const correctLabel="Pilih hasil akhir: bintang ★";
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
  throw new Error(`Rule-pipeline QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["logic-if-red-then-circle","logic.conditional.rule.basic"],
      ["logic-classify-red-round","logic.classification.multi_attribute"],
      ["logic-analogy-young-adult","logic.analogy.relation.basic"],
      ["logic-order-first-after-start","logic.order.relative.basic"],
      ["logic-infer-not-red","logic.inference.elimination.basic"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId=`qa-rule-pipeline-prereq-${index}`;
      const completedAt=`2026-09-15T06:1${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-conditional-analogy-inference",runtime:seedActivityId==="logic-analogy-young-adult"?"matching":"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"rule-pipeline-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForPipeline(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-rule-pipeline]");
    return scene?.getAttribute("data-rule-pipeline-ready")==="true"&&scene.querySelectorAll("[data-rule-pipeline-choice]").length===3&&Boolean(scene.querySelector("[data-rule-pipeline-step-one]"));
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function keyboardRunStepOne(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const text=await page.evaluate(()=>document.activeElement?.textContent?.trim()??"");
    if(text==="Jalankan aturan 1"){
      await page.keyboard.press("Enter");
      return;
    }
  }
  throw new Error("Keyboard navigation did not reach rule-pipeline step-one control");
}

async function keyboardWrongFinalChoice(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({
      choice:Boolean(document.activeElement?.hasAttribute?.("data-rule-pipeline-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong rule-pipeline final choice");
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
    assert(response&&response.status()<400,`rule-pipeline bad HTTP at ${viewport.width}`);
    await waitForPipeline(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Logic Wave C readiness at ${viewport.width}`);

    const choices=page.locator("[data-rule-pipeline-choice]");
    assert.equal(await choices.count(),3,"rule pipeline keeps three canonical final choices");
    assert.deepEqual(new Set(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih hasil akhir: bintang ★",
      "Pilih hasil akhir: lingkaran ●",
      "Pilih hasil akhir: kotak ■"
    ]));
    assert.equal(await choices.evaluateAll(nodes=>nodes.every(node=>node.disabled)),true,"final choices stay disabled before rule 1 is applied");
    assert.equal(await completed(page),false,"idle pipeline cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`rule pipeline overflows horizontally at ${viewport.width}`);
    const controls=page.locator("[data-rule-pipeline-step-one], [data-rule-pipeline-choice]");
    for(const box of await controls.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"rule-pipeline controls keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"rule-pipeline controls remain inside viewport");
    }

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-rule-pipeline-idle.png`),fullPage:false});

    await keyboardRunStepOne(page);
    await page.getByRole("status").filter({hasText:"hasil sementara"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await choices.evaluateAll(nodes=>nodes.every(node=>!node.disabled)),true,"final choices unlock only after rule 1");
    assert.equal(await page.locator("[data-rule-pipeline-intermediate]").textContent().then(text=>text?.includes("Lingkaran")),true,"canonical intermediate state becomes visible");
    assert.equal(await completed(page),false,"running rule 1 alone cannot complete activity");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-rule-pipeline-intermediate.png`),fullPage:false});

    const wrongLabel=await keyboardWrongFinalChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong final result cannot complete activity");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-rule-pipeline-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct final result completes canonical activity");

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    const nextBox=await nextLink.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(nextBox,"rule-pipeline success CTA must render");
    assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`rule-pipeline success CTA must remain fully visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"rule pipeline records attempt evidence");
    assert.equal(state.assessed,true,"composed-rule activity remains assessed");
    assert.equal(state.metadata?.source,"rule-pipeline-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_rule_pipeline_interaction");
    assert.equal(state.metadata?.startLabel,"Merah");
    assert.equal(state.metadata?.intermediateLabel,"Lingkaran");
    assert.equal(state.metadata?.selectedResult,"bintang ★");
    assert.equal(state.metadata?.pipelineStepsApplied,2);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-rule-pipeline-success.png`),fullPage:false});
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
  console.log(`Rule-pipeline browser QA passed ${viewports.length} viewports with legitimate Logic Wave C progression, keyboard step execution and wrong-state, pointer completion, false-completion guards, layout, CTA and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
