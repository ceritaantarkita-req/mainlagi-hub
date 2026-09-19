import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_MIXED_OPERATION_REUSE_QA_PORT??4052);
const baseUrl=`http://${host}:${port}`;
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[
  {viewport:{width:320,height:720},completionMode:"touch"},
  {viewport:{width:390,height:844},completionMode:"pointer"},
  {viewport:{width:768,height:1024},completionMode:"touch"}
];

const scenarios=[
  {
    kind:"add",
    activityId:"math-mixed-add-4-4",
    route:"/child/demo-gian/activity/math-mixed-add-4-4",
    correctLabel:"Pilih jumlah 8",
    choices:["6","7","8"],
    cue:"Gabungkan 4 benda dengan 4 benda.",
    firstCount:4,
    secondCount:4,
    result:"8"
  },
  {
    kind:"sub",
    activityId:"math-mixed-sub-9-3",
    route:"/child/demo-gian/activity/math-mixed-sub-9-3",
    correctLabel:"Pilih sisa 6",
    choices:["5","6","7"],
    cue:"Mulai dengan 9 benda. Ambil 3, lalu hitung sisanya.",
    startCount:9,
    removeCount:3,
    result:"6"
  }
];

let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);
  server.stderr.on("data",append);
}

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{
      const response=await fetch(`${baseUrl}${scenarios[0].route}`);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Mixed-operation reuse QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){
  if(server&&!server.killed)server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context,scenario){
  await context.addInitScript(({kind})=>{
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
      ["math-mixed-add-2-3","math.operation.mixed","math-ukur-ruang","tap_choice"]
    ];
    if(kind==="sub"){
      seeds.push(["math-mixed-add-4-4","math.operation.mixed","math-ukur-ruang","tap_choice"]);
    }
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}
    }));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-mixed-operation-reuse-prereq-${kind}-${index}`;
      const completedAt=`2026-09-20T00:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,
        childId,
        activityId:seedActivityId,
        subjectId:"math",
        stageId,
        runtime,
        difficulty:2,
        status:"completed",
        assessed:true,
        score:1,
        accuracy:1,
        correctCount:runtime==="matching"?2:1,
        incorrectCount:0,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"mixed-operation-reuse-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],
        masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  },{kind:scenario.kind});
}

async function waitForScene(page,kind){
  await page.waitForLoadState("load");
  await page.waitForFunction(({kind})=>{
    const selector=kind==="add"?"[data-make-total]":"[data-take-away]";
    const choiceSelector=kind==="add"?"[data-make-total-choice]":"[data-take-away-choice]";
    const readyAttr=kind==="add"?"data-make-total-ready":"data-take-away-ready";
    const scene=document.querySelector(selector);
    return scene?.getAttribute(readyAttr)==="true"&&scene.querySelectorAll(choiceSelector).length===3;
  },{kind},{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page,activityId){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function keyboardWrongChoice(page,scenario){
  const dataAttr=scenario.kind==="add"?"data-make-total-choice":"data-take-away-choice";
  for(let step=0;step<128;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(({dataAttr})=>({
      choice:Boolean(document.activeElement?.hasAttribute?.(dataAttr)),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }),{dataAttr});
    if(focused.choice&&focused.label!==scenario.correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error(`Keyboard navigation did not reach a wrong ${scenario.kind} mixed-operation choice`);
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
}

async function completeCorrect(page,scenario,completionMode){
  const button=page.getByRole("button",{name:scenario.correctLabel,exact:true});
  if(completionMode==="pointer"){
    await button.click();
    return;
  }
  const box=await button.boundingBox();
  assert(box,`${scenario.kind} correct choice must have a touchable box`);
  await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);
}

async function inspect(scenario,{viewport,completionMode}){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true});
    await seedPrerequisiteReadiness(context,scenario);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${scenario.route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`${scenario.kind} mixed-operation bad HTTP at ${viewport.width}`);
    await waitForScene(page,scenario.kind);
    assert.equal(new URL(page.url()).pathname,scenario.route,`progression guard accepts legitimate Math readiness for ${scenario.activityId} at ${viewport.width}`);
    assert.equal(await completed(page,scenario.activityId),false,`seed data must not pre-complete ${scenario.activityId}`);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`${scenario.activityId} overflows horizontally at ${viewport.width}`);

    let choices;
    let result;
    if(scenario.kind==="add"){
      const board=page.locator("[data-make-total-board]");
      assert.equal(await board.getByLabel(`Kelompok pertama berisi ${scenario.firstCount}`).count(),1,"mixed add board renders first canonical addend");
      assert.equal(await board.getByLabel(`Kelompok kedua berisi ${scenario.secondCount}`).count(),1,"mixed add board renders second canonical addend");
      result=page.locator("[data-make-total-result]");
      assert.equal((await result.textContent())?.trim(),"?","mixed add result stays hidden before assessment");
      assert.equal(await page.locator("[data-make-total-cue]").getByText(scenario.cue,{exact:true}).count(),1,"mixed add cue renders");
      choices=page.locator("[data-make-total-choice]");
    }else{
      const board=page.locator("[data-take-away-board]");
      assert.equal(await board.getByLabel(`Kelompok awal berisi ${scenario.startCount}. ${scenario.removeCount} benda ditandai diambil.`).count(),1,"mixed sub board renders canonical start/removal");
      assert.equal(await page.locator("[data-take-away-token]").count(),scenario.startCount,"mixed sub board renders canonical starting quantity");
      assert.equal(await page.locator('[data-take-away-removed="true"]').count(),scenario.removeCount,"mixed sub board marks canonical removed subset");
      assert.equal(await page.locator('[data-take-away-removed="false"]').count(),scenario.startCount-scenario.removeCount,"mixed sub board keeps canonical remainder visible");
      result=page.locator("[data-take-away-result]");
      assert.equal((await result.textContent())?.trim(),"?","mixed sub result stays hidden before assessment");
      assert.equal(await page.locator("[data-take-away-cue]").getByText(scenario.cue,{exact:true}).count(),1,"mixed sub cue renders");
      choices=page.locator("[data-take-away-choice]");
    }

    assert.equal(await choices.count(),3,`${scenario.activityId} keeps three canonical choices`);
    assert.deepEqual(await choices.allTextContents(),scenario.choices,`${scenario.activityId} keeps canonical choice order`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,`${scenario.activityId} choices keep >=44px touch target`);
      assert(box.left>=-1&&box.right<=viewportWidth+1,`${scenario.activityId} choices remain inside viewport`);
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`${scenario.activityId} idle feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-mixed-${scenario.kind}-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page,scenario);
    assert.notEqual(wrongLabel,scenario.correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page,scenario.activityId),false,`${scenario.activityId} wrong answer cannot complete`);
    assert.equal((await result.textContent())?.trim(),"?","${scenario.activityId} wrong answer cannot reveal result");
    await assertFullyVisible(status,viewportHeight,`${scenario.activityId} retry feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-mixed-${scenario.kind}-try.png`),fullPage:false});

    await completeCorrect(page,scenario,completionMode);
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page,scenario.activityId),true,`${scenario.activityId} correct answer completes`);
    assert.equal((await result.textContent())?.trim(),scenario.result,`${scenario.activityId} reveals only canonical result`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,`${scenario.activityId} success feedback at ${viewport.width}`);
    await assertFullyVisible(nextLink,viewportHeight,`${scenario.activityId} success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:scenario.activityId});
    assert(state,`${scenario.activityId} records attempt evidence`);
    assert.equal(state.assessed,true,`${scenario.activityId} remains assessed`);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);
    if(scenario.kind==="add"){
      assert.equal(state.metadata?.source,"make-total-runtime");
      assert.equal(state.metadata?.evidenceFidelity,"choice_make_total_interaction");
      assert.equal(state.metadata?.leftCount,scenario.firstCount);
      assert.equal(state.metadata?.rightCount,scenario.secondCount);
    }else{
      assert.equal(state.metadata?.source,"take-away-runtime");
      assert.equal(state.metadata?.evidenceFidelity,"choice_take_away_interaction");
      assert.equal(state.metadata?.startCount,scenario.startCount);
      assert.equal(state.metadata?.removeCount,scenario.removeCount);
    }
    assert.equal(state.metadata?.selectedChoice,scenario.result);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-mixed-${scenario.kind}-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors for ${scenario.activityId} at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors for ${scenario.activityId} at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{
    await browser.close();
  }
}

async function assertOperationSelectionExcluded(){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
    const page=await context.newPage();
    await seedPrerequisiteReadiness(context,{kind:"add"});
    const route="/child/demo-gian/activity/math-mixed-choose-add";
    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"operation-selection exclusion route returns healthy response");
    await page.waitForLoadState("load");
    assert.equal(await page.locator("[data-make-total]").count(),0,"operation-selection activity must not render Make Total");
    assert.equal(await page.locator("[data-take-away]").count(),0,"operation-selection activity must not render Take Away");
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  for(const scenario of scenarios){
    for(const item of viewports)await inspect(scenario,item);
  }
  await assertOperationSelectionExcluded();
  console.log("Math mixed-operation reuse browser QA passed add + subtract routes across 320/390/768 with keyboard retry, pointer/touch completion, canonical evidence, exclusion guard and 18 screenshots.");
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
