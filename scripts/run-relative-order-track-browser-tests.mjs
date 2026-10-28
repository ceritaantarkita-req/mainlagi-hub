import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_RELATIVE_ORDER_TRACK_QA_PORT??4031);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-order-first-after-start";
const activityId="logic-order-first-after-start";
const correctLabel="Pilih posisi: C";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vsg08-relative-order");
const viewports=[{width:320,height:720},{width:390,height:844},{width:430,height:860},{width:768,height:1024},{width:1280,height:800}];
async function captureEvidence(page,name){
  mkdirSync(screenshotDir,{recursive:true});
  mkdirSync(evidenceDir,{recursive:true});
  const shot=await page.screenshot({fullPage:true});
  writeFileSync(path.join(screenshotDir,name),shot);
  writeFileSync(path.join(evidenceDir,name),shot);
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
  throw new Error(`Relative-order-track QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      const attemptId=`qa-relative-order-prereq-${index}`;
      const completedAt=`2026-09-15T15:5${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-patterns-sequences-relations",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"relative-order-track-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-relative-order-track]");
    return scene?.getAttribute("data-relative-order-track-ready")==="true"&&scene.querySelectorAll("[data-relative-order-choice]").length===3&&scene.querySelectorAll("[data-relative-order-node]").length===4&&scene.querySelectorAll("[data-target-slot='true']").length===1;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-relative-order-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong relative-order choice");
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
    assert(response&&response.status()<400,`relative-order-track bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept canonical Logic Wave B readiness at ${viewport.width}`);

    const scene=page.locator('[data-relative-order-track][data-child-visual-hierarchy="relative-order-vsg08"]');
    assert.equal(await scene.count(),1,"Relative Order opts into the shared child first-action system");
    const question=scene.getByRole("heading",{level:1,name:"Apa isi tanda tanya?"});
    assert.equal(await question.count(),1,"one visible child-first question");
    const qbox=await question.boundingBox();
    assert(qbox&&qbox.y>=0&&qbox.y+qbox.height<=viewport.height&&
      qbox.x>=0&&qbox.x+qbox.width<=viewport.width+1,
      `primary question must be visible at ${viewport.width}px, including 320px`);
    assert.equal(await page.getByText("Ikuti jalur urutannya",{exact:true}).count(),0);
    assert.equal((await scene.locator(':scope > [role="status"]').textContent())?.trim(),"",
      "no duplicated instruction strip at idle");

    const help=page.getByRole("button",{name:"Cara main"});
    assert.equal(await help.getAttribute("aria-expanded"),"false");
    assert.equal(await page.locator("[data-relative-order-help]").count(),0);
    await help.click();
    assert.equal(await page.getByRole("button",{name:"Tutup bantuan"}).getAttribute("aria-expanded"),"true");
    assert.equal(await page.locator("[data-relative-order-help]").innerText(),
      "Gunakan posisi yang terlihat. Isi slot bertanda tanya sesuai petunjuk.");
    await captureEvidence(page,`${viewport.width}-relative-order-track-help.png`);
    await page.getByRole("button",{name:"Tutup bantuan"}).click();

    const nodes=page.locator("[data-relative-order-node]");
    assert.equal(await nodes.count(),4,"representative track keeps four canonical positions");
    assert.deepEqual(await nodes.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label"))),[
      "Posisi 1: A","Posisi 2: B","Posisi 3 disembunyikan","Posisi 4: D"
    ]);
    assert.equal(await page.locator("[data-target-slot='true']").getByText("?").count(),1,"queried position stays hidden before assessment");
    assert.equal(await page.locator("[data-relative-order-relation]").getByText("Tepat setelah B").count(),1,"board exposes prompt-supported relation only");

    const choices=page.locator("[data-relative-order-choice]");
    assert.equal(await choices.count(),3,"relative-order track keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih posisi: C","Pilih posisi: A","Pilih posisi: D"
    ]));
    assert.equal(await completed(page),false,"idle relative-order track cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`relative-order track overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"relative-order choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"relative-order choices remain inside viewport");
    }

    const status=scene.locator(':scope > [role="status"]');
    await captureEvidence(page,`${viewport.width}-relative-order-track-idle.png`);

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:2000});
    assert.equal((await status.textContent())?.trim(),"Belum tepat. Coba lagi!");
    assert.equal(await completed(page),false,"wrong relative position cannot complete activity");
    await captureEvidence(page,`${viewport.width}-relative-order-track-try.png`);

    await page.getByRole("button",{name:correctLabel}).click();
    await page.waitForFunction(()=>document.querySelector("[data-relative-order-track] > [role='status']")?.textContent?.includes("Tepat!"),
      undefined,{timeout:2000});
    assert.match((await status.textContent())??"",/C berada tepat setelah B/,
      "canonical success explanation is screen-reader accessible");
    assert.equal(await completed(page),true,"correct relative position completes canonical activity");
    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:2000});
    const completionBox=await completion.boundingBox();
    const completionViewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(completionBox,"relative-order-track canonical Completion must render");
    assert(completionBox.y>=-1&&completionBox.y+completionBox.height<=completionViewportHeight+1,"canonical Completion must remain fully visible");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"relative-order track records attempt evidence");
    assert.equal(state.assessed,true,"relative-order activity remains assessed");
    assert.equal(state.metadata?.source,"relative-order-track-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_relative_order_track_interaction");
    assert.equal(state.metadata?.relationLabel,"Tepat setelah B");
    assert.equal(state.metadata?.targetIndex,2);
    assert.equal(state.metadata?.trackLength,4);
    assert.equal(state.metadata?.selectedChoice,"C");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    assert.equal(await completion.getByText("Hebat!",{exact:true}).count(),1,
      "concise completion retains canonical three-star navigation");
    await captureEvidence(page,`${viewport.width}-relative-order-track-success.png`);
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
  console.log(`VSG-08 Relative Order QA passed ${viewports.length} viewports × idle/help/wrong/success; restored 320px question, masked slot, keyboard, evidence and completion.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
