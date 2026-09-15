import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_TRANSITIVE_CHAIN_QA_PORT??4028);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-transitive-height-abc";
const activityId="logic-transitive-height-abc";
const correctLabel="Pilih kesimpulan: A";
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
  throw new Error(`Transitive-chain QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      const attemptId=`qa-transitive-chain-prereq-${index}`;
      const completedAt=`2026-09-15T10:0${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-conditional-analogy-inference",runtime:seedActivityId==="logic-analogy-young-adult"?"matching":"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"transitive-chain-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-transitive-chain]");
    return scene?.getAttribute("data-transitive-chain-ready")==="true"&&scene.querySelectorAll("[data-transitive-chain-choice]").length===3&&scene.querySelectorAll("[data-transitive-node]").length===3&&scene.querySelectorAll("[data-transitive-relation]").length===2;
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
    const focused=await page.evaluate(()=>({
      choice:Boolean(document.activeElement?.hasAttribute?.("data-transitive-chain-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong transitive-chain choice");
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
    assert(response&&response.status()<400,`transitive-chain bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept canonical Logic Wave C readiness at ${viewport.width}`);

    const choices=page.locator("[data-transitive-chain-choice]");
    assert.equal(await choices.count(),3,"transitive chain keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih kesimpulan: A","Pilih kesimpulan: B","Pilih kesimpulan: C"
    ]));
    assert.equal(await page.locator("[data-transitive-node]").count(),3,"chain exposes three ordered nodes");
    assert.equal(await page.locator("[data-transitive-relation]").count(),2,"chain exposes exactly two premises");
    assert.equal(await completed(page),false,"idle chain cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`transitive chain overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"transitive-chain choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"transitive-chain choices remain inside viewport");
    }

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-transitive-chain-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong conclusion cannot complete activity");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-transitive-chain-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct conclusion completes canonical activity");

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    const nextBox=await nextLink.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(nextBox,"transitive-chain success CTA must render");
    assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`transitive-chain success CTA must remain fully visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"transitive chain records attempt evidence");
    assert.equal(state.assessed,true,"transitive-comparison activity remains assessed");
    assert.equal(state.metadata?.source,"transitive-chain-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_transitive_chain_interaction");
    assert.deepEqual(state.metadata?.chainNodes,["A","B","C"]);
    assert.equal(state.metadata?.relationLabel,"lebih tinggi dari");
    assert.equal(state.metadata?.selectedConclusion,"A");
    assert.equal(state.metadata?.premiseCount,2);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-transitive-chain-success.png`),fullPage:false});
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
  console.log(`Transitive-chain browser QA passed ${viewports.length} viewports with canonical Logic Wave C progression, keyboard wrong-state, pointer completion, two-premise chain layout, CTA and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
