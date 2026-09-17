import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SENTENCE_COMPLETION_QA_PORT??4040);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/english-complete-cat-sleeps";
const activityId="english-complete-cat-sleeps";
const correctChoice="SLEEPS";
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
  throw new Error(`Sentence-completion QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["english-letter-a","english.alphabet.recognition","english-alphabet-basics","tap_choice"],
      ["english-letter-m","english.alphabet.recognition","english-alphabet-basics","tap_choice"],
      ["english-listen-letter-a","english.alphabet.listening","english-alphabet-basics","listen_and_choose"],
      ["english-match-case-ab","english.alphabet.recognition","english-alphabet-basics","matching"],
      ["english-initial-ball","english.phonics.initial_sound","english-alphabet-basics","tap_choice"],
      ["english-match-initial-bc","english.phonics.initial_sound","english-alphabet-basics","matching"],
      ["english-find-red","english.color.recognition","english-alphabet-basics","tap_choice"],
      ["english-listen-yellow","english.color.recognition","english-alphabet-basics","listen_and_choose"],
      ["english-number-one","english.number.1_5","english-alphabet-basics","tap_choice"],
      ["english-listen-three","english.number.1_5","english-alphabet-basics","listen_and_choose"],
      ["english-match-four-five","english.number.1_5","english-alphabet-basics","matching"],

      ["english-animal-dog","english.vocab.animals","english-everyday-words","tap_choice"],
      ["english-listen-bird","english.vocab.animals","english-everyday-words","listen_and_choose"],
      ["english-match-animals-dog-rabbit","english.vocab.animals","english-everyday-words","matching"],
      ["english-object-book","english.vocab.objects","english-everyday-words","tap_choice"],
      ["english-listen-bag","english.vocab.objects","english-everyday-words","listen_and_choose"],
      ["english-match-objects-book-ball","english.vocab.objects","english-everyday-words","matching"],
      ["english-body-head","english.vocab.body","english-everyday-words","tap_choice"],
      ["english-listen-eyes","english.vocab.body","english-everyday-words","listen_and_choose"],
      ["english-match-body-eyes-ears","english.vocab.body","english-everyday-words","matching"],
      ["english-family-mother","english.vocab.family","english-everyday-words","tap_choice"],
      ["english-listen-sister","english.vocab.family","english-everyday-words","listen_and_choose"],
      ["english-match-family-siblings","english.vocab.family","english-everyday-words","matching"],
      ["english-review-word-book","english.vocab.everyday_integration","english-everyday-words","tap_choice"],
      ["english-review-match-animal-object","english.vocab.everyday_integration","english-everyday-words","matching"],

      ["english-food-apple","english.vocab.food","english-words-actions","tap_choice"],
      ["english-listen-milk","english.vocab.food","english-words-actions","listen_and_choose"],
      ["english-match-food-rice-apple","english.vocab.food","english-words-actions","matching"],
      ["english-action-run","english.vocab.actions","english-words-actions","tap_choice"],
      ["english-listen-sleep","english.vocab.actions","english-words-actions","listen_and_choose"],
      ["english-match-actions-eat-read","english.vocab.actions","english-words-actions","matching"],
      ["english-category-food","english.vocab.category","english-words-actions","tap_choice"],
      ["english-match-category-body-object","english.vocab.category","english-words-actions","matching"],
      ["english-picture-pair-apple-banana","english.word.picture_matching.expanded","english-words-actions","matching"],
      ["english-picture-pair-eyes-hand","english.word.picture_matching.expanded","english-words-actions","matching"],
      ["english-listen-apple-review","english.word.listening","english-words-actions","listen_and_choose"],
      ["english-listen-hand-review","english.word.listening","english-words-actions","listen_and_choose"],

      ["english-opposite-big-small","english.relation.opposites","english-phrases-review","tap_choice"],
      ["english-match-opposites-fast-slow","english.relation.opposites","english-phrases-review","matching"],
      ["english-phrase-red-ball","english.phrase.literal","english-phrases-review","tap_choice"],
      ["english-phrase-yellow-banana","english.phrase.literal","english-phrases-review","tap_choice"],
      ["english-listen-phrase-blue-book","english.phrase.literal","english-phrases-review","listen_and_choose"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,stageId,runtime],index)=>{
      const attemptId=`qa-sentence-completion-prereq-${index}`;
      const completedAt=`2026-09-17T00:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"english",stageId,runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"sentence-completion-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-sentence-completion-slot]");
    return scene?.getAttribute("data-sentence-completion-slot-ready")==="true"&&scene.querySelectorAll("[data-sentence-completion-choice]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-sentence-completion-choice")),label:(document.activeElement?.textContent??"").trim()}));
    if(focused.choice&&focused.label!==correctChoice){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong sentence-completion choice");
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
    assert(response&&response.status()<400,`sentence-completion bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate English prerequisites at ${viewport.width}`);

    const sentence=page.locator("[data-sentence-completion-sentence]");
    const slot=page.locator("[data-sentence-completion-slot-target]");
    assert.equal(await sentence.count(),1,"fixed sentence context renders once");
    assert.equal(await slot.count(),1,"exactly one missing-word slot renders");
    assert.match((await sentence.textContent())??"",/The cat\s+___\s*\./,"idle sentence keeps canonical fixed context and blank");

    const choices=page.locator("[data-sentence-completion-choice]");
    assert.equal(await choices.count(),3,"sentence completion keeps three canonical choices");
    assert.deepEqual(await choices.allTextContents(),["SLEEPS","BOOK","YELLOW"],"choice order and labels remain canonical");
    assert.equal(await completed(page),false,"idle state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`sentence completion overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"choices keep minimum touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"choices remain inside viewport");
    }

    await assertFullyVisible(sentence,viewportHeight,`sentence card at ${viewport.width}`);
    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,`idle feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-completion-idle.png`),fullPage:false});

    const wrongChoice=await keyboardWrongChoice(page);
    assert.notEqual(wrongChoice,correctChoice);
    await status.filter({hasText:"Not yet"}).waitFor({state:"visible",timeout:2000});
    assert.equal((await slot.textContent())?.trim(),wrongChoice,"wrong selected word is shown in the fixed slot");
    assert.equal(await completed(page),false,"wrong word cannot complete activity");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-completion-try.png`),fullPage:false});

    await page.getByRole("button",{name:`Choose ${correctChoice}`,exact:true}).click();
    await status.filter({hasText:"Great"}).waitFor({state:"visible",timeout:2000});
    assert.equal((await slot.textContent())?.trim(),correctChoice,"correct word occupies the same fixed slot");
    assert.equal(await completed(page),true,"correct word completes canonical activity");
    const nextLink=page.getByRole("link",{name:"Choose another activity"});
    await assertFullyVisible(nextLink,viewportHeight,`success CTA at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"sentence completion records attempt evidence");
    assert.equal(state.assessed,true,"activity remains assessed");
    assert.equal(state.metadata?.source,"sentence-completion-slot-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_sentence_completion_slot_interaction");
    assert.equal(state.metadata?.selectedChoice,"SLEEPS");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-completion-success.png`),fullPage:false});
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
  console.log(`Sentence Completion Slot browser QA passed ${viewports.length} viewports with English readiness, canonical fixed-slot context, keyboard wrong-state, pointer completion, touch targets, screenshots and measured evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
