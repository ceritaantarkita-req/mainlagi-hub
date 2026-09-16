import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_READING_PASSAGE_QA_PORT??4039);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/bahasa-baca-lala-kucing";
const activityId="bahasa-baca-lala-kucing";
const correctChoice="putih";
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
  throw new Error(`Reading-passage QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["bahasa-suku-ba","bahasa.suku_kata.recognition","tap_choice"],
      ["bahasa-suku-ka","bahasa.suku_kata.recognition","tap_choice"],
      ["bahasa-gabung-baju","bahasa.suku_kata.blending","tap_choice"],
      ["bahasa-gabung-bola","bahasa.suku_kata.blending","tap_choice"],
      ["bahasa-pasang-kata-benda-1","bahasa.kata.semantic_matching","matching"],
      ["bahasa-pasang-kata-tempat","bahasa.kata.semantic_matching","matching"],
      ["bahasa-dengar-buku","bahasa.kata.listening","listen_and_choose"],
      ["bahasa-dengar-bola","bahasa.kata.listening","listen_and_choose"],
      ["bahasa-gambar-apel","bahasa.kata.picture_matching","tap_choice"],
      ["bahasa-gambar-rumah","bahasa.kata.picture_matching","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-reading-passage-prereq-${index}`;
      const completedAt=`2026-09-16T13:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"bahasa",stageId:"bahasa-suku-kata-kata",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"reading-passage-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-reading-passage-question]");
    return scene?.getAttribute("data-reading-passage-question-ready")==="true"&&scene.querySelectorAll("[data-reading-answer]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-reading-answer")),label:(document.activeElement?.textContent??"").trim()}));
    if(focused.choice&&focused.label!==correctChoice){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong reading answer");
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
    assert(response&&response.status()<400,`reading-passage bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate Bahasa Wave B readiness at ${viewport.width}`);

    const passage=page.locator("[data-reading-passage]");
    const question=page.locator("[data-reading-question]");
    assert.equal(await passage.count(),1,"short passage renders as its own reading surface");
    assert.equal(await question.count(),1,"literal question renders separately from passage");
    assert.equal((await passage.textContent())?.includes("Lala punya kucing putih."),true,"passage keeps canonical text");
    assert.equal((await question.textContent())?.includes("Apa warna kucing Lala?"),true,"question keeps canonical text");

    const choices=page.locator("[data-reading-answer]");
    assert.equal(await choices.count(),3,"reading-passage keeps three canonical choices");
    assert.deepEqual(await choices.allTextContents(),["putih","hitam","cokelat"],"answer order and labels remain canonical");
    assert.equal(await completed(page),false,"idle reading-passage state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`reading-passage overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"reading-passage choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"reading-passage choices remain inside viewport");
    }

    await assertFullyVisible(passage,viewportHeight,`reading passage at ${viewport.width}`);
    await assertFullyVisible(question,viewportHeight,`reading question at ${viewport.width}`);
    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle reading feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-reading-passage-idle.png`),fullPage:false});

    const wrongChoice=await keyboardWrongChoice(page);
    assert.notEqual(wrongChoice,correctChoice);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong reading answer cannot complete activity");
    await assertFullyVisible(status,viewportHeight,`retry reading feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-reading-passage-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctChoice,exact:true}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct reading answer completes canonical activity");
    await assertFullyVisible(status,viewportHeight,`success reading feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`reading success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"reading-passage records attempt evidence");
    assert.equal(state.assessed,true,"reading-passage activity remains assessed");
    assert.equal(state.metadata?.source,"reading-passage-question-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_reading_passage_question_interaction");
    assert.equal(state.metadata?.selectedChoice,"putih");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-reading-passage-success.png`),fullPage:false});
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
  console.log(`Reading Passage Question browser QA passed ${viewports.length} viewports with legitimate Bahasa Wave B readiness, canonical passage/question/answers, keyboard wrong-state, pointer completion, touch targets, feedback/CTA visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
