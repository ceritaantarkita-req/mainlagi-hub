import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SPATIAL_TRANSFORM_QA_PORT??4030);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-spatial-halfturn-up";
const activityId="logic-spatial-halfturn-up";
const correctLabel="Pilih arah: bawah ↓";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vsg12-spatial-transform");
const viewports=[{width:320,height:720},{width:390,height:844},{width:430,height:860},{width:768,height:1024},{width:1280,height:800}];
async function captureEvidence(page,name){
  mkdirSync(screenshotDir,{recursive:true});
  mkdirSync(evidenceDir,{recursive:true});
  const bytes=await page.screenshot({fullPage:true});
  writeFileSync(path.join(screenshotDir,name),bytes);
  writeFileSync(path.join(evidenceDir,name),bytes);
}
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
  throw new Error(`Spatial-transform QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["logic-if-red-then-circle","logic.conditional.rule.basic"],
      ["logic-classify-red-round","logic.classification.multi_attribute"],
      ["logic-analogy-young-adult","logic.analogy.relation.basic"],
      ["logic-order-first-after-start","logic.order.relative.basic"],
      ["logic-infer-not-red","logic.inference.elimination.basic"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId=`qa-spatial-transform-prereq-${index}`;
      const completedAt=`2026-09-15T13:2${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-conditional-analogy-inference",runtime:seedActivityId==="logic-analogy-young-adult"?"matching":"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"spatial-transform-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-spatial-transform]");
    return scene?.getAttribute("data-spatial-transform-ready")==="true"&&scene.querySelectorAll("[data-spatial-transform-choice]").length===3&&scene.querySelectorAll("[data-transform-operation]").length===1&&scene.querySelectorAll("[data-transform-result-slot]").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-spatial-transform-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong spatial-transform choice");
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
    assert(response&&response.status()<400,`spatial-transform bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept canonical Logic Wave C readiness at ${viewport.width}`);

    const scene=page.locator('[data-spatial-transform][data-child-visual-hierarchy="spatial-transform-vsg12"]');
    assert.equal(await scene.count(),1,"Spatial Transform uses the same opt-in child visual hierarchy");
    const question=scene.getByRole("heading",{level:1,name:"Arah akhirnya ke mana?"});
    assert.equal(await question.count(),1,"one visible answer-safe primary question");
    const qbox=await question.boundingBox();
    assert(qbox && qbox.y>=0 && qbox.y+qbox.height<=viewport.height &&
      qbox.x>=0 && qbox.x+qbox.width<=viewport.width+1,
      `primary question must be visible at ${viewport.width}px`);
    assert.equal(await page.getByText("Putar arah di kepala",{exact:true}).count(),0,
      "old duplicated heading removed");
    assert.equal((await scene.locator(':scope > [role="status"]').textContent())?.trim(),"",
      "idle state has no duplicate instruction status");
    const help=page.getByRole("button",{name:"Cara main"});
    assert.equal(await help.getAttribute("aria-expanded"),"false");
    assert.equal(await page.locator("[data-spatial-transform-help]").count(),0);
    await help.click();
    assert.equal(await page.getByRole("button",{name:"Tutup bantuan"}).getAttribute("aria-expanded"),"true");
    assert.equal(await page.locator("[data-spatial-transform-help]").innerText(),
      "Lihat arah awal, ikuti putaran atau cermin, lalu pilih hasilnya.");
    const helpColor=await page.locator("[data-spatial-transform-help]").evaluate(node=>{
      const style=getComputedStyle(node);
      return {background:style.backgroundColor,color:style.color};
    });
    assert.equal(helpColor.background,"rgb(255, 253, 244)",
      "Spatial Transform help uses the shared solid high-contrast panel");
    assert.equal(helpColor.color,"rgb(25, 59, 85)");
    await captureEvidence(page,`${viewport.width}-spatial-transform-help.png`);
    await page.getByRole("button",{name:"Tutup bantuan"}).click();

    const choices=page.locator("[data-spatial-transform-choice]");
    assert.equal(await choices.count(),3,"spatial transform keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih arah: bawah ↓","Pilih arah: kanan →","Pilih arah: kiri ←"
    ]));
    assert.equal(await page.locator("[data-transform-start='up']").count(),1,"representative transform exposes canonical up start direction");
    const operation=page.locator("[data-transform-operation]");
    assert.equal(await operation.getAttribute("data-transform-kind"),"rotation");
    assert.equal(await operation.getByText("½ putaran · 180°").count(),1,"representative board exposes canonical half-turn operation");
    assert.equal(await page.locator("[data-transform-result-slot]").getByText("?").count(),1,"result stays hidden before assessment");
    assert.equal(await completed(page),false,"idle spatial-transform board cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`spatial-transform board overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"spatial-transform choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"spatial-transform choices remain inside viewport");
    }

    const status=scene.locator(':scope > [role="status"]');
    await captureEvidence(page,`${viewport.width}-spatial-transform-idle.png`);

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:2000});
    assert.equal((await status.textContent())?.trim(),"Belum tepat. Coba lagi!");
    assert.equal(await completed(page),false,"wrong transformed direction cannot complete activity");
    await captureEvidence(page,`${viewport.width}-spatial-transform-try.png`);

    await page.getByRole("button",{name:correctLabel}).click();
    await page.waitForFunction(()=>document.querySelector("[data-spatial-transform] > [role='status']")?.textContent?.includes("Tepat!"),
      undefined,{timeout:2000});
    assert.match((await status.textContent())??"",
      /Panah atas setelah setengah putaran mengarah ke bawah/,
      "canonical success explanation remains accessible");
    assert.equal(await completed(page),true,"correct transformed direction completes canonical activity");
    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:2000});
    const completionBox=await completion.boundingBox();
    const completionViewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(completionBox,"spatial-transform canonical Completion must render");
    assert(completionBox.y>=-1&&completionBox.y+completionBox.height<=completionViewportHeight+1,"canonical Completion must remain fully visible");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"spatial transform records attempt evidence");
    assert.equal(state.assessed,true,"spatial-transform activity remains assessed");
    assert.equal(state.metadata?.source,"spatial-transform-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_spatial_transform_interaction");
    assert.equal(state.metadata?.startDirection,"up");
    assert.equal(state.metadata?.transformKind,"rotation");
    assert.equal(state.metadata?.turnDirection,"right");
    assert.equal(state.metadata?.quarterTurns,2);
    assert.equal(state.metadata?.operationLabel,"½ putaran · 180°");
    assert.equal(state.metadata?.selectedChoice,"bawah ↓");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    assert.equal(await completion.getByText("Hebat!",{exact:true}).count(),1,
      "concise completion preserves canonical three-star navigation");
    await captureEvidence(page,`${viewport.width}-spatial-transform-success.png`);
    await page.evaluate(()=>{window.__si06eReplayMarker="alive";});
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:2000});
    assert.equal(await page.evaluate(()=>window.__si06eReplayMarker),"alive","Again must reset locally without document reload");
    const targetAttemptCount=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return(attempts["demo-gian"]??[]).filter(item=>item.activityId===id).length;
    },{id:activityId});
    assert.equal(targetAttemptCount,1,"Again reset alone must not create a second target attempt");
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
  console.log(`VSG-12 Spatial Transform browser QA passed ${viewports.length} viewports x idle/help/wrong/success, 320px question, transformation board, keyboard/retry, evidence and concise completion.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
