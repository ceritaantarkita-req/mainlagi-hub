import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_ELIMINATION_BOARD_QA_PORT??4045);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-infer-not-red";
const activityId="logic-infer-not-red";
const correctLabel="Pilih kesimpulan: biru 🔵";
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
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Elimination-board QA server did not become ready.\n"+serverLog.slice(-4000));
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
      const attemptId="qa-elimination-prereq-"+index;
      const completedAt="2026-09-18T04:5"+index+":00.000Z";
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-patterns-sequences-relations",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"elimination-board-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}
async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-elimination-board]");
    return scene?.getAttribute("data-elimination-board-ready")==="true"&&scene.querySelectorAll("[data-elimination-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}
async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}
async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-elimination-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong elimination choice");
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
    assert(response&&response.status()<400,"elimination-board bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route);
    const scene=page.locator("[data-elimination-board]");
    assert.equal(await scene.getAttribute("data-elimination-mode"),"negative_exclusion");
    assert.equal(await scene.getAttribute("data-eliminated-count"),"0");
    assert.equal(await page.locator("[data-elimination-clue]").getByText("Cari yang bukan merah",{exact:true}).count(),1);

    const choices=page.locator("[data-elimination-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label"))),[
      "Pilih kesimpulan: biru 🔵",
      "Pilih kesimpulan: merah bulat 🔴",
      "Pilih kesimpulan: merah kotak 🟥"
    ]);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("data-elimination-state"))),["available","available","available"]);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false],"no canonical choice is pre-disabled");
    assert.equal(await completed(page),false);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"elimination-board overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"elimination choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"elimination choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertFullyVisible(status,viewportHeight,"idle elimination feedback");
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-elimination-board-idle.png"),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"tersisih"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong elimination cannot complete");
    assert.equal(await scene.getAttribute("data-eliminated-count"),"1");
    assert.equal(await page.locator('[data-elimination-state="eliminated"]').count(),1);
    assert.equal(await page.locator('[data-elimination-state="eliminated"]').getByText("Tersisih",{exact:true}).count(),1);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false],"wrong choice remains present and retryable");
    await assertFullyVisible(status,viewportHeight,"retry elimination feedback");
    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-elimination-board-try.png"),fullPage:false});

    const correct=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correct.tap(); else await correct.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct elimination conclusion completes activity");
    assert.equal(await page.locator('[data-elimination-state="correct"]').count(),1);
    assert.equal(await page.locator("[data-elimination-conclusion]").getByText("biru 🔵",{exact:true}).count(),1);
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertFullyVisible(status,viewportHeight,"success elimination feedback");
    await assertFullyVisible(nextLink,viewportHeight,"elimination success CTA");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"elimination board records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"elimination-board-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_elimination_board_interaction");
    assert.equal(state.metadata?.eliminationMode,"negative_exclusion");
    assert.equal(state.metadata?.selectedChoice,"biru 🔵");
    assert.equal(state.metadata?.eliminatedCount,1);
    assert.equal(Array.isArray(state.metadata?.eliminatedChoices),true);
    assert.equal(state.metadata.eliminatedChoices.length,1);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,String(viewport.width)+"-elimination-board-success.png"),fullPage:false});
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
  console.log("Pattern 45 elimination-board browser QA passed 3 viewports with Logic readiness, keyboard elimination, pointer/touch completion, touch targets, canonical choices and assessed evidence.");
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
