import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SPATIAL_RELATION_BOARD_QA_PORT??4039);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-spatial-turn-right-from-up";
const activityId="logic-spatial-turn-right-from-up";
const correctLabel="Pilih jawaban →";
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
  throw new Error(`Spatial-relation-board QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["logic-match-identical-shapes","logic.relations.matching.basic","matching"],
      ["logic-classify-animal","logic.classification.visual.basic","tap_choice"],
      ["logic-odd-category-animal-vehicle","logic.discrimination.odd_one_out.basic","tap_choice"],
      ["logic-compare-more-dots","logic.comparison.visual.basic","tap_choice"],
      ["logic-rule-alternate-shapes","logic.sequence.rules.basic","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-spatial-relation-prereq-${index}`;
      const completedAt=`2026-09-17T10:0${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-classification-rules-basics",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?3:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"spatial-relation-board-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-spatial-relation-board]");
    return scene?.getAttribute("data-spatial-relation-board-ready")==="true"&&scene.querySelectorAll("[data-spatial-relation-choice]").length===3&&scene.querySelectorAll("[data-spatial-relation-visual]").length===1&&scene.querySelectorAll("[data-spatial-relation-result]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-spatial-relation-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong spatial-relation choice");
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
    assert(response&&response.status()<400,`spatial-relation-board bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept canonical Logic Wave A readiness at ${viewport.width}`);

    assert.equal(await page.getByText("Jika menghadap ↑ lalu belok kanan, menghadap ke mana?").count(),1,"canonical prompt remains visible");
    const board=page.locator("[data-spatial-relation-visual]");
    assert.equal(await board.getAttribute("data-relation-kind"),"turn_right");
    assert.equal(await board.getAttribute("data-relation-mode"),"turn");
    const result=page.locator("[data-spatial-relation-result]");
    assert.equal((await result.textContent())?.trim(),"?","directional result remains hidden before answer");

    const choices=page.locator("[data-spatial-relation-choice]");
    assert.equal(await choices.count(),3,"spatial relation keeps three canonical choices");
    assert.deepEqual(await choices.allTextContents(),["→","←","↓"],"canonical answer order remains unchanged");
    assert.equal(await completed(page),false,"idle spatial-relation board cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`spatial relation board overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"spatial-relation choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"spatial-relation choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle spatial-relation feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-spatial-relation-board-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Coba lagi"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong spatial answer cannot complete activity");
    assert.equal((await result.textContent())?.trim(),"?","wrong answer must not reveal directional result");
    await assertFullyVisible(status,viewportHeight,`retry spatial-relation feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-spatial-relation-board-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct spatial answer completes canonical activity");
    assert.equal((await result.textContent())?.trim(),"→","success may reveal the canonical directional result");
    await assertFullyVisible(status,viewportHeight,`success spatial-relation feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`spatial-relation success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"spatial relation board records attempt evidence");
    assert.equal(state.assessed,true,"spatial relation remains assessed");
    assert.equal(state.metadata?.source,"spatial-relation-board-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_spatial_relation_interaction");
    assert.equal(state.metadata?.mode,"turn");
    assert.equal(state.metadata?.relationOrTurn,"right");
    assert.equal(state.metadata?.selectedChoice,"→");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-spatial-relation-board-success.png`),fullPage:false});
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
  console.log(`Pattern 40 browser QA passed ${viewports.length} viewports with hidden directional result, keyboard retry, pointer completion, touch targets and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
