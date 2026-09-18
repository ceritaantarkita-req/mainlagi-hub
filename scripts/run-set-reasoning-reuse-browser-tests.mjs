import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SET_REASONING_REUSE_QA_PORT??4049);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-classify-red-round";
const activityId="logic-classify-red-round";
const correctLabel="Pilih jawaban: 🔴";
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
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Set-reasoning reuse QA server did not become ready.\n"+serverLog.slice(-4000));
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["logic-pattern-aab-stars","logic.pattern.repeat.intermediate","tap_choice"],
      ["logic-sequence-grow-dots","logic.sequence.position.intermediate","tap_choice"],
      ["logic-associate-object-use","logic.association.semantic.intermediate","matching"],
      ["logic-compare-longer-bars","logic.comparison.relation.intermediate","tap_choice"],
      ["logic-spatial-star-left-circle","logic.spatial.relation.basic","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId="qa-set-reasoning-reuse-prereq-"+index;
      const completedAt="2026-09-18T16:3"+index+":00.000Z";
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-patterns-sequences-relations",
        runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,
        hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"set-reasoning-reuse-browser-prerequisite"},
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
    const scene=document.querySelector("[data-set-reasoning]");
    return scene?.getAttribute("data-set-reasoning-ready")==="true" &&
      scene.querySelectorAll("[data-set-reasoning-choice]").length===3 &&
      scene.querySelectorAll("[data-set-rule]").length===2 &&
      scene.querySelectorAll("[data-set-operation]").length===1;
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
      choice:Boolean(document.activeElement?.hasAttribute?.("data-set-reasoning-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong reused set-reasoning choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,label+" must render");
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,label+" must remain fully visible");
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"set-reasoning reuse bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,"progression guard must accept Wave C prerequisites at "+viewport.width);

    assert.equal(await page.getByRole("heading",{name:"Cari pilihan yang cocok"}).count(),1);
    assert.equal(await page.getByText("Baca dua aturan, lalu pilih jawaban yang memenuhi keduanya.").count(),1);

    const rules=page.locator("[data-set-rule]");
    assert.equal(await rules.count(),2);
    assert.deepEqual(await rules.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("data-membership"))),["in","in"]);
    assert.equal(await rules.nth(0).getByText("Merah",{exact:true}).count(),1);
    assert.equal(await rules.nth(1).getByText("Bulat",{exact:true}).count(),1);
    assert.equal(await page.locator("[data-set-operation]").getByText("Dua syarat sekaligus",{exact:true}).count(),1);

    const choices=page.locator("[data-set-reasoning-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),[
      "Pilih jawaban: 🔴",
      "Pilih jawaban: 🟥",
      "Pilih jawaban: 🔵"
    ]);
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.disabled)),[false,false,false]);
    assert.equal(await completed(page),false,"idle reused set reasoning cannot complete");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"set-reasoning reuse overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"reused set-reasoning choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"reused set-reasoning choices stay in viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,"idle reused set-reasoning feedback at "+viewport.width);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-set-reasoning-reuse-idle.png"),fullPage:false});

    const wrong=await keyboardWrongChoice(page);
    assert.notEqual(wrong,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong reused set-reasoning answer cannot complete");
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.disabled)),[false,false,false],"wrong answer keeps choices retryable");
    await assertFullyVisible(status,viewportHeight,"retry reused set-reasoning feedback at "+viewport.width);
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-set-reasoning-reuse-try.png"),fullPage:false});

    const correct=page.getByRole("button",{name:correctLabel,exact:true});
    if(viewport.width===390)await correct.tap();else await correct.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct reused set reasoning completes canonical activity");

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,"success reused set-reasoning feedback at "+viewport.width);
    await assertFullyVisible(nextLink,viewportHeight,"reused set-reasoning success CTA at "+viewport.width);

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return[...(attempts["demo-gian"]??[])].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"reused set reasoning records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"set-reasoning-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_set_reasoning_interaction");
    assert.deepEqual(state.metadata?.setRules,[{label:"Merah",membership:"in"},{label:"Bulat",membership:"in"}]);
    assert.equal(state.metadata?.operationLabel,"Dua syarat sekaligus");
    assert.equal(state.metadata?.selectedMember,"🔴");
    assert.equal(state.metadata?.ruleCount,2);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-set-reasoning-reuse-success.png"),fullPage:false});
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log("Set-reasoning reuse browser QA passed 3 viewports with keyboard wrong-state, pointer/actual-touch completion, measured evidence and 9 screenshots.");
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
