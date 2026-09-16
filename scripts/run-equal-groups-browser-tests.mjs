import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_EQUAL_GROUPS_QA_PORT??4035);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/math-group-8-by-2";
const activityId="math-group-8-by-2";
const correctLabel="Pilih 4 kelompok";
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
  throw new Error(`Equal-groups QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      ["math-group-6-by-2","math.grouping.equal_groups","math-operasi-awal","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-equal-groups-prereq-${index}`;
      const completedAt=`2026-09-16T09:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"math",stageId,runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"equal-groups-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-equal-groups]");
    return scene?.getAttribute("data-equal-groups-ready")==="true"&&scene.querySelectorAll("[data-equal-groups-choice]").length===3&&scene.querySelectorAll("[data-equal-groups-result]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-equal-groups-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong equal-groups choice");
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
    assert(response&&response.status()<400,`equal-groups bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate prior Math readiness at ${viewport.width}`);

    const board=page.locator("[data-equal-groups-board]");
    assert.equal(await board.count(),1,"equal-groups board renders");
    assert.equal(await board.getAttribute("aria-label"),"8 benda dibagi menjadi kelompok yang masing-masing berisi 2");
    assert.equal(await page.locator("[data-equal-groups-group]").count(),4,"board renders four equal groups");
    assert.equal(await page.locator("[data-equal-groups-token]").count(),8,"board renders eight canonical objects");
    for(let group=1;group<=4;group+=1){
      assert.equal(await page.getByLabel(`Kelompok ${group}, berisi 2 benda`).count(),1,`group ${group} exposes equal size`);
    }
    const result=page.locator("[data-equal-groups-result]");
    assert.equal((await result.textContent())?.trim(),"?","group count stays hidden before assessment");
    assert.equal(await result.getAttribute("aria-label"),"Jumlah kelompok masih disembunyikan");
    assert.equal(await page.locator("[data-equal-groups-cue]").getByText("Pisahkan 8 benda menjadi kelompok isi 2, lalu hitung kelompoknya.").count(),1,"board exposes reviewed grouping cue");

    const choices=page.locator("[data-equal-groups-choice]");
    assert.equal(await choices.count(),3,"equal groups keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih 3 kelompok","Pilih 4 kelompok","Pilih 5 kelompok"
    ]));
    assert.equal(await completed(page),false,"idle equal-groups cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`equal groups overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"equal-groups choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"equal-groups choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle equal-groups feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-equal-groups-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong group count cannot complete activity");
    assert.equal((await result.textContent())?.trim(),"?","wrong choice must not reveal group count");
    await assertFullyVisible(status,viewportHeight,`retry equal-groups feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-equal-groups-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct group count completes canonical activity");
    assert.equal((await result.textContent())?.trim(),"4","success may reveal canonical group count");
    await assertFullyVisible(status,viewportHeight,`success equal-groups feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`equal-groups success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"equal groups records attempt evidence");
    assert.equal(state.assessed,true,"equal-groups activity remains assessed");
    assert.equal(state.metadata?.source,"equal-groups-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_equal_groups_interaction");
    assert.equal(state.metadata?.totalCount,8);
    assert.equal(state.metadata?.groupSize,2);
    assert.equal(state.metadata?.groupCount,4);
    assert.equal(state.metadata?.selectedChoice,"4");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-equal-groups-success.png`),fullPage:false});
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
  console.log(`Equal-groups browser QA passed ${viewports.length} viewports with legitimate Math readiness, four visible equal groups, keyboard wrong-state, pointer completion, masked group count, feedback/CTA visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
