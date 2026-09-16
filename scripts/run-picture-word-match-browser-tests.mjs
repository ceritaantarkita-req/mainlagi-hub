import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_PICTURE_WORD_QA_PORT??4037);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/bahasa-gambar-apel";
const activityId="bahasa-gambar-apel";
const correctLabel="Pilih kata apel";
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
  throw new Error(`Picture-word QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["bahasa-vokal-i","bahasa.vokal.recognition","tap_choice"],
      ["bahasa-vokal-o","bahasa.vokal.recognition","tap_choice"],
      ["bahasa-dengar-i","bahasa.vokal.listening","listen_and_choose"],
      ["bahasa-dengar-o","bahasa.vokal.listening","listen_and_choose"],
      ["bahasa-pilih-vokal-ae","bahasa.huruf.classification","tap_choice"],
      ["bahasa-pilih-konsonan-ks","bahasa.huruf.classification","tap_choice"],
      ["bahasa-match-case-ai","bahasa.huruf.case_matching","matching"],
      ["bahasa-match-case-bm","bahasa.huruf.case_matching","matching"],
      ["bahasa-awal-bola","bahasa.bunyi.awal.recognition","tap_choice"],
      ["bahasa-match-awal-tas-susu","bahasa.bunyi.awal.recognition","matching"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-picture-word-prereq-${index}`;
      const completedAt=`2026-09-16T11:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"bahasa",stageId:"bahasa-dasar-huruf",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"picture-word-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-picture-word-match]");
    return scene?.getAttribute("data-picture-word-match-ready")==="true"&&scene.querySelectorAll("[data-picture-word-match-choice]").length===3&&scene.querySelectorAll("[data-picture-word-match-result]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-picture-word-match-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong picture-word choice");
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
    assert(response&&response.status()<400,`picture-word bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate Bahasa Wave A readiness at ${viewport.width}`);

    const board=page.locator("[data-picture-word-match-board]");
    assert.equal(await board.count(),1,"picture-word board renders");
    assert.equal(await board.getByText("🍎",{exact:true}).count(),1,"representative board exposes canonical apple clue");
    const result=page.locator("[data-picture-word-match-result]");
    assert.equal((await result.textContent())?.trim(),"?","word stays hidden before assessment");
    assert.equal(await result.getAttribute("aria-label"),"Kata belum dipilih");

    const choices=page.locator("[data-picture-word-match-choice]");
    assert.equal(await choices.count(),3,"picture-word keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih kata apel","Pilih kata ayam","Pilih kata awan"
    ]));
    assert.equal(await completed(page),false,"idle picture-word state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`picture-word overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"picture-word choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"picture-word choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle picture-word feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong word cannot complete activity");
    assert.equal((await result.textContent())?.trim(),"?","wrong choice must not reveal canonical word");
    await assertFullyVisible(status,viewportHeight,`retry picture-word feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct word completes canonical activity");
    assert.equal((await result.textContent())?.trim(),"apel","success reveals canonical word");
    assert.equal(await result.getAttribute("aria-label"),"Kata apel");
    await assertFullyVisible(status,viewportHeight,`success picture-word feedback at ${viewport.width}`);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(nextLink,viewportHeight,`picture-word success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"picture-word records attempt evidence");
    assert.equal(state.assessed,true,"picture-word activity remains assessed");
    assert.equal(state.metadata?.source,"picture-word-match-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_picture_word_match_interaction");
    assert.equal(state.metadata?.picture,"🍎");
    assert.equal(state.metadata?.word,"apel");
    assert.equal(state.metadata?.selectedChoice,"apel");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-success.png`),fullPage:false});
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
  console.log(`Picture Word Match browser QA passed ${viewports.length} viewports with legitimate Bahasa Wave A readiness, canonical picture/word choices, keyboard wrong-state, pointer completion, masked word, feedback/CTA visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
