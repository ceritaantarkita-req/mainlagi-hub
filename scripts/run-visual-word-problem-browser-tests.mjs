import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_VISUAL_WORD_PROBLEM_QA_PORT??4038);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/math-problem-birds";
const activityId="math-problem-birds";
const correctLabel="Pilih jawaban 3";
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
  throw new Error(`Visual-word-problem QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["math-recognize-0","math.numeral.recognition.0_10","math-jumlah-dasar","tap_choice"],
      ["math-recognize-7","math.numeral.recognition.0_10","math-jumlah-dasar","tap_choice"],
      ["math-count-4","math.count.4_10","math-jumlah-dasar","tap_choice"],
      ["math-count-8","math.count.4_10","math-jumlah-dasar","tap_choice"],
      ["math-count-10","math.count.4_10","math-jumlah-dasar","tap_choice"],
      ["math-match-number-quantity-1-2","math.quantity.matching","math-jumlah-dasar","matching"],
      ["math-subitize-4","math.quantity.subitizing","math-jumlah-dasar","tap_choice"],
      ["math-compare-more-2-4","math.quantity.comparison","math-banding-bentuk","tap_choice"],
      ["math-compare-less-7-9","math.quantity.comparison","math-banding-bentuk","tap_choice"],
      ["math-order-next-1-2","math.number.ordering","math-banding-bentuk","tap_choice"],
      ["math-order-between-6-8","math.number.ordering","math-banding-bentuk","tap_choice"],
      ["math-shape-find-circle","math.shape.recognition","math-banding-bentuk","tap_choice"],
      ["math-shape-three-sides","math.shape.properties","math-banding-bentuk","tap_choice"],
      ["math-pattern-ab-shapes","math.pattern.sequence","math-banding-bentuk","tap_choice"],
      ["math-missing-1-3","math.sequence.missing_number","math-operasi-awal","tap_choice"],
      ["math-missing-after-8","math.sequence.missing_number","math-operasi-awal","tap_choice"],
      ["math-group-6-by-2","math.grouping.equal_groups","math-operasi-awal","tap_choice"],
      ["math-group-match-3s","math.grouping.equal_groups","math-operasi-awal","matching"],
      ["math-add-1-1","math.operation.addition.within_10","math-operasi-awal","tap_choice"],
      ["math-add-3-2","math.operation.addition.within_10","math-operasi-awal","tap_choice"],
      ["math-sub-3-1","math.operation.subtraction.within_10","math-operasi-awal","tap_choice"],
      ["math-sub-6-2","math.operation.subtraction.within_10","math-operasi-awal","tap_choice"],
      ["math-length-longer-lines","math.measure.size_length","math-operasi-awal","tap_choice"],
      ["math-size-match-words","math.measure.size_length","math-operasi-awal","matching"],
      ["math-spatial-above","math.spatial.position","math-ukur-ruang","tap_choice"],
      ["math-spatial-between","math.spatial.position","math-ukur-ruang","tap_choice"],
      ["math-measure-longer","math.measure.intuition","math-ukur-ruang","tap_choice"],
      ["math-measure-match-length","math.measure.intuition","math-ukur-ruang","matching"],
      ["math-mixed-add-2-3","math.operation.mixed","math-ukur-ruang","tap_choice"],
      ["math-mixed-add-4-4","math.operation.mixed","math-ukur-ruang","tap_choice"],
      ["math-problem-apples","math.problem.visual","math-ukur-ruang","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-visual-word-problem-prereq-${index}`;
      const completedAt=`2026-09-17T04:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"math",stageId,runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"visual-word-problem-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-visual-word-problem]");
    return scene?.getAttribute("data-visual-word-problem-ready")==="true"&&scene.querySelectorAll("[data-visual-word-problem-choice]").length===3&&scene.querySelectorAll("[data-visual-word-problem-result]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-visual-word-problem-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong visual-word-problem choice");
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
    assert(response&&response.status()<400,`visual-word-problem bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate prior Math readiness at ${viewport.width}`);

    const story=page.locator("[data-visual-word-problem-story]");
    assert.equal(await story.getByText("Ada 5 burung. 2 terbang pergi. Berapa burung tersisa?").count(),1,"canonical story remains visible");
    const board=page.locator("[data-visual-word-problem-board]");
    assert.equal(await board.getAttribute("data-operation"),"subtract","representative story keeps subtraction branch");
    assert.equal(await board.getByLabel("Burung mula-mula: 5").count(),1,"board shows audited starting quantity");
    assert.equal(await board.getByLabel("Burung yang terbang pergi: −2").count(),1,"board shows audited story change");
    const result=page.locator("[data-visual-word-problem-result]");
    assert.equal((await result.textContent())?.replace(/\s+/g," ").trim(),"Sekarang ?","answer remains unknown before assessment");
    assert.equal(await result.getAttribute("aria-label"),"Jawaban akhir masih belum diketahui");

    const choices=page.locator("[data-visual-word-problem-choice]");
    assert.equal(await choices.count(),3,"visual word problem keeps three canonical choices");
    assert.deepEqual(await choices.allTextContents(),["2","3","4"],"canonical answer order remains unchanged");
    assert.equal(await completed(page),false,"idle visual word problem cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`visual word problem overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"visual-word-problem choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"visual-word-problem choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle visual-word-problem feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-visual-word-problem-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong story answer cannot complete activity");
    assert.equal(await result.getAttribute("aria-label"),"Jawaban akhir masih belum diketahui","wrong answer must not reveal result");
    await assertFullyVisible(status,viewportHeight,`retry visual-word-problem feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-visual-word-problem-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct story answer completes canonical activity");
    assert.equal(await result.getAttribute("aria-label"),"Jawaban akhir: 3","success reveals only canonical result");
    await assertFullyVisible(status,viewportHeight,`success visual-word-problem feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`visual-word-problem success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"visual word problem records attempt evidence");
    assert.equal(state.assessed,true,"visual word problem remains assessed");
    assert.equal(state.metadata?.source,"visual-word-problem-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_visual_word_problem_interaction");
    assert.equal(state.metadata?.startCount,5);
    assert.equal(state.metadata?.changeCount,2);
    assert.equal(state.metadata?.operation,"subtract");
    assert.equal(state.metadata?.selectedChoice,"3");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-visual-word-problem-success.png`),fullPage:false});
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
  console.log(`Visual-word-problem browser QA passed ${viewports.length} viewports with story-first subtraction board, keyboard retry, pointer completion, masked result, touch targets and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
