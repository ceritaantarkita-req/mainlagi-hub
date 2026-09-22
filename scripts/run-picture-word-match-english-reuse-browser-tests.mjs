import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { assertLearningVisualContainment } from "./lib/assert-learning-visual-containment.mjs";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_PICTURE_WORD_ENGLISH_QA_PORT??4048);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/english-action-jump";
const activityId="english-action-jump";
const correctChoice="JUMP";
const correctLabel="Choose word JUMP";
const screenshotDir=path.join(root,".mobile-route-qa");
const cases=[
  {viewport:{width:320,height:720},completionMode:"touch"},
  {viewport:{width:390,height:844},completionMode:"pointer"},
  {viewport:{width:768,height:1024},completionMode:"touch"},
  {viewport:{width:1280,height:800},completionMode:"pointer"}
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
  throw new Error(`English picture-word QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["english-animal-dog","english.vocab.animals","tap_choice"],
      ["english-listen-bird","english.vocab.animals","listen_and_choose"],
      ["english-match-animals-dog-rabbit","english.vocab.animals","matching"],
      ["english-object-book","english.vocab.objects","tap_choice"],
      ["english-listen-bag","english.vocab.objects","listen_and_choose"],
      ["english-match-objects-book-ball","english.vocab.objects","matching"],
      ["english-body-head","english.vocab.body","tap_choice"],
      ["english-listen-eyes","english.vocab.body","listen_and_choose"],
      ["english-match-body-eyes-ears","english.vocab.body","matching"],
      ["english-family-mother","english.vocab.family","tap_choice"],
      ["english-listen-sister","english.vocab.family","listen_and_choose"],
      ["english-match-family-siblings","english.vocab.family","matching"],
      ["english-review-word-book","english.vocab.everyday_integration","tap_choice"],
      ["english-review-match-animal-object","english.vocab.everyday_integration","matching"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}
    }));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-picture-word-english-prereq-${index}`;
      const completedAt=`2026-09-19T14:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"english",stageId:"english-everyday-words",
        runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,
        correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",
        startedAt:completedAt,completedAt,
        metadata:{source:"picture-word-english-browser-prerequisite"},
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
    const scene=document.querySelector("[data-picture-word-match]");
    return scene?.getAttribute("data-picture-word-match-ready")==="true"
      &&scene?.getAttribute("data-picture-word-locale")==="en-US"
      &&scene?.getAttribute("data-picture-word-variant")==="english_word_picture"
      &&scene.querySelectorAll("[data-picture-word-match-choice]").length===3
      &&scene.querySelectorAll("[data-picture-word-match-result]").length===1;
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
      choice:Boolean(document.activeElement?.hasAttribute?.("data-picture-word-match-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong English picture-word choice");
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
  assert(box,"correct English picture-word choice must have a touchable box");
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
    assert(response&&response.status()<400,`English picture-word bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    await assertLearningVisualContainment(page,"[data-picture-word-match]",`picture-word English visual containment at ${viewport.width}`);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate English Wave B readiness at ${viewport.width}`);

    assert.equal(await page.getByRole("heading",{name:"Picture & Word",exact:true}).count(),1,"generic leak-free English frame title must render");
    assert.equal(await page.getByRole("heading",{name:"Look at the picture, find the word",exact:true}).count(),1,"English picture-word heading must render");
    assert.equal(await page.getByText("Look carefully, then choose the word that matches.",{exact:true}).count(),1,"English instruction must render");
    assert.equal(await page.getByText("Find JUMP",{exact:true}).count(),0,"answer-bearing canonical title must not render");
    assert.equal(await page.getByText("Choose the action JUMP.",{exact:true}).count(),0,"answer-bearing canonical prompt must not render");

    const board=page.locator("[data-picture-word-match-board]");
    assert.equal(await board.getByText("🤸",{exact:true}).count(),1,"canonical action visual renders");
    const result=page.locator("[data-picture-word-match-result]");
    assert.equal((await result.textContent())?.trim(),"?","English target word stays hidden before assessment");
    assert.equal(await result.getAttribute("aria-label"),"Word not chosen yet");

    const choices=page.locator("[data-picture-word-match-choice]");
    assert.deepEqual(await choices.allTextContents(),["EAT","JUMP","READ"],"English choices keep canonical order");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Choose word EAT","Choose word JUMP","Choose word READ"
    ]));
    assert.equal(await completed(page),false,"idle English picture-word state cannot complete");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`English picture-word overflows horizontally at ${viewport.width}`);

    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"English picture-word choices keep minimum touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"English picture-word choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`English idle feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-english-idle.png`),fullPage:false});

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Not quite"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong English word cannot complete activity");
    assert.equal((await result.textContent())?.trim(),"?","wrong English choice must not reveal canonical word");
    await assertFullyVisible(status,viewportHeight,`English retry feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-english-try.png`),fullPage:false});

    await completeCorrect(page,completionMode);
    await status.filter({hasText:"Correct!"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct English word completes canonical activity");
    assert.equal((await result.textContent())?.trim(),correctChoice,"success reveals canonical uppercase word");
    assert.equal(await result.getAttribute("aria-label"),`Word ${correctChoice}`);
    const nextLink=page.getByRole("link",{name:"Choose another activity"});
    await assertFullyVisible(status,viewportHeight,`English success feedback at ${viewport.width}`);
    await assertFullyVisible(nextLink,viewportHeight,`English success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"English picture-word records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"picture-word-match-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_picture_word_match_interaction");
    assert.equal(state.metadata?.picture,"🤸");
    assert.equal(state.metadata?.word,correctChoice);
    assert.equal(state.metadata?.selectedChoice,correctChoice);
    assert.equal(state.metadata?.domainVariant,"english_word_picture");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-picture-word-english-success.png`),fullPage:false});
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
  console.log("English Picture Word Match browser QA passed 3 viewports with leak-free English presentation, keyboard retry, pointer + touchscreen completion, touch targets, screenshots and assessed evidence.");
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
