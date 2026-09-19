import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_COMPARE_PROPERTIES_MATH_QA_PORT??4044);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/math-measure-more-capacity";
const activityId="math-measure-more-capacity";
const correctLabel="Pilih: ember";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
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
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Math compare-properties QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
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
      ["math-spatial-between","math.spatial.position","math-ukur-ruang","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-math-compare-prereq-${index}`;
      const completedAt=`2026-09-19T05:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"math",stageId,runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,
        correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"math-compare-properties-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-compare-properties]");
    return scene?.getAttribute("data-compare-properties-ready")==="true"
      && scene.getAttribute("data-compare-properties-variant")==="multi_candidate_compare"
      && scene.querySelectorAll("[data-compare-property-choice]").length===3;
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
      choice:Boolean(document.activeElement?.hasAttribute?.("data-compare-property-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong Math compare-properties choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true,isMobile:viewport.width<500});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`Math compare-properties bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard accepts legitimate prior Math readiness at ${viewport.width}`);

    assert.equal(await page.getByText("Bandingkan kapasitas ketiga benda. Pilih yang biasanya dapat menampung paling banyak air.").count(),1,"Math capacity comparison cue remains visible");
    const choices=page.locator("[data-compare-property-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),["Pilih: ember","Pilih: cangkir","Pilih: sendok"],"Math capacity choices remain canonical and first-class");
    assert.equal(await completed(page),false);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`Math compare-properties overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"Math compare-properties choices keep minimum touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"Math compare-properties choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle Math compare feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-compare-properties-math-capacity-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong Math compare-properties answer cannot complete");
    await assertFullyVisible(status,viewportHeight,`retry Math compare feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-compare-properties-math-capacity-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).tap();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"actual touch correct answer completes canonical Math measurement activity");
    await assertFullyVisible(status,viewportHeight,`success Math compare feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`Math compare success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"Math compare-properties records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"compare-properties-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_compare_properties_interaction");
    assert.equal(state.metadata?.propertyKind,"capacity");
    assert.equal(state.metadata?.comparisonGoal,"more");
    assert.equal(state.metadata?.variant,"multi_candidate_compare");
    assert.equal(state.metadata?.selectedChoice,"ember");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-compare-properties-math-capacity-success.png`),fullPage:false});
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
  console.log(`Math Compare Properties reuse browser QA passed ${viewports.length} viewports with three first-class capacity candidates, keyboard retry, actual-touch completion, canonical evidence, touch targets, feedback and CTA visibility.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
