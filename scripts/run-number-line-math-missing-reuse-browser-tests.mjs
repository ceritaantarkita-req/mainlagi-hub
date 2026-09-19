import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_NUMBER_LINE_MISSING_QA_PORT??4049);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/math-missing-descend-10-8";
const activityId="math-missing-descend-10-8";
const correctChoice="9";
const correctLabel="Pilih angka 9";
const screenshotDir=path.join(root,".mobile-route-qa");
const cases=[
  {viewport:{width:320,height:720},completionMode:"touch"},
  {viewport:{width:390,height:844},completionMode:"pointer"},
  {viewport:{width:768,height:1024},completionMode:"touch"}
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
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Missing-number Number Line QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      ["math-missing-after-8","math.sequence.missing_number","math-operasi-awal","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}
    }));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-number-line-missing-prereq-${index}`;
      const completedAt=`2026-09-19T16:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"math",stageId,runtime,difficulty:2,
        status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,
        incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",
        startedAt:completedAt,completedAt,
        metadata:{source:"number-line-missing-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],
        masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-number-line]");
    return scene?.getAttribute("data-number-line-ready")==="true"
      &&scene.querySelectorAll("[data-number-choice]").length===3;
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
      choice:Boolean(document.activeElement?.hasAttribute?.("data-number-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong missing-number Number Line choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
}

async function completeCorrect(page,completionMode){
  const button=page.getByRole("button",{name:correctLabel,exact:true});
  if(completionMode==="pointer"){await button.click();return;}
  const box=await button.boundingBox();
  assert(box,"correct missing-number choice must have a touchable box");
  await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);
}

async function inspect({viewport,completionMode}){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`missing-number Number Line bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate prior Math readiness at ${viewport.width}`);

    assert.equal(await page.getByRole("heading",{name:"Isi 10, _, 8",exact:true}).count(),1,"canonical activity title remains visible");
    assert.equal(await page.getByRole("heading",{name:"Temukan posisinya",exact:true}).count(),1,"Number Line interaction heading renders");
    assert.equal(await page.getByText("Urutannya turun dari 10 menuju 8. Cari angka di tengah.",{exact:true}).count(),1,"reviewed missing-number cue renders");

    const ticks=page.locator("[data-number-value]");
    assert.equal(await ticks.count(),5,"missing-number Number Line keeps five local ticks");
    assert.deepEqual(await ticks.evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute("data-number-value")))),[7,8,9,10,11],"local line spans exact reviewed range");

    const contextValues=await page.locator('[data-number-context="true"]').evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute("data-number-value"))));
    assert.deepEqual(contextValues,[8,10],"line highlights canonical known values 10 and 8");

    const choices=page.locator("[data-number-choice]");
    assert.deepEqual(await choices.allTextContents(),["7","9","11"],"missing-number choices keep canonical order");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih angka 7","Pilih angka 9","Pilih angka 11"
    ]));
    assert.equal(await completed(page),false,"idle missing-number state cannot complete");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`missing-number Number Line overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"missing-number choices keep minimum touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"missing-number choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`missing-number idle feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-number-line-missing-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong missing number cannot complete activity");
    await assertFullyVisible(status,viewportHeight,`missing-number retry feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-number-line-missing-try.png`),fullPage:false});

    await completeCorrect(page,completionMode);
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct missing number completes canonical activity");
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,`missing-number success feedback at ${viewport.width}`);
    await assertFullyVisible(nextLink,viewportHeight,`missing-number success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"missing-number Number Line records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"number-line-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_number_line_interaction");
    assert.equal(state.metadata?.lineDirection,"left");
    assert.equal(state.metadata?.lineMin,7);
    assert.equal(state.metadata?.lineMax,11);
    assert.deepEqual(state.metadata?.contextValues,[10,8]);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-number-line-missing-success.png`),fullPage:false});
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
  for(const item of cases)await inspect(item);
  console.log("Math missing-number Number Line browser QA passed 3 viewports with legitimate progression, keyboard retry, pointer + touchscreen completion, touch targets, screenshots and assessed evidence.");
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
