import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SHAPE_ATTRIBUTE_QA_PORT??4048);
const baseUrl="http://"+host+":"+port;
const route="/child/demo-gian/activity/math-shape-find-circle";
const activityId="math-shape-find-circle";
const correctLabel="Pilih bentuk: lingkaran";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vsg13-shape-attribute");
const viewports=[{width:320,height:720},{width:390,height:844},{width:430,height:860},{width:768,height:1024},{width:1280,height:800}];
async function captureEvidence(page,name){
  mkdirSync(screenshotDir,{recursive:true});
  mkdirSync(evidenceDir,{recursive:true});
  const screenshot=await page.screenshot({fullPage:true});
  writeFileSync(path.join(screenshotDir,name),screenshot);
  writeFileSync(path.join(evidenceDir,name),screenshot);
}
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]});
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);server.stderr.on("data",append);
}
async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Shape-attribute QA server did not become ready.\n"+serverLog.slice(-4000));
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const requiredIds=["math-recognize-0","math-recognize-7","math-count-4","math-count-8","math-count-10","math-match-number-quantity-1-2","math-subitize-4"];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["math-recognize-0","math.numeral.recognition.0_10","tap_choice"],
      ["math-count-4","math.count.4_10","tap_choice"],
      ["math-match-number-quantity-1-2","math.quantity.matching","matching"],
      ["math-subitize-4","math.quantity.subitizing","tap_choice"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId="qa-shape-attribute-prereq-"+index;
      const completedAt="2026-09-18T13:0"+index+":00.000Z";
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"math",stageId:"math-jumlah-dasar",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"shape-attribute-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-shape-attribute-board]");
    return scene?.getAttribute("data-shape-attribute-ready")==="true"&&scene.querySelectorAll("[data-shape-attribute-choice]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-shape-attribute-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong shape choice");
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
    const pageErrors=[];const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"shape-attribute bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,"progression guard must accept prior Math readiness at "+viewport.width);

    const scene=page.locator('[data-shape-attribute-board][data-child-visual-hierarchy="shape-attribute-vsg13"]');
    assert.equal(await scene.count(),1,"shape board adopts shared child hierarchy");
    assert.equal(await scene.getAttribute("data-shape-mode"),"identify_circle");
    assert.equal(await scene.getAttribute("data-shape-resolved"),"false");
    const question=scene.getByRole("heading",{level:1,name:"Bentuk mana yang bulat tanpa sudut?"});
    assert.equal(await question.count(),1,"the original question is the single primary heading");
    const qbox=await question.boundingBox();
    assert(qbox&&qbox.x>=0&&qbox.x+qbox.width<=viewport.width+1&&
      qbox.y>=0&&qbox.y+qbox.height<=viewport.height,
      "visible first question must fit 320/390/430/768/1280 viewport");
    assert.equal(await page.getByText("Amati bentuknya",{exact:true}).count(),0,
      "redundant generic heading is removed");
    assert.equal(await page.locator("[data-shape-cue]").count(),0,
      "original explanatory cue is initially on demand, not a duplicate panel");
    assert.equal((await scene.locator(':scope > [role="status"]').textContent())?.trim(),"",
      "no repeated idle status instruction");
    const help=page.getByRole("button",{name:"Cara main"});
    assert.equal(await help.getAttribute("aria-expanded"),"false");
    await help.click();
    assert.equal(await page.getByRole("button",{name:"Tutup bantuan"}).getAttribute("aria-expanded"),"true");
    assert.equal(await page.locator("[data-shape-cue]").innerText(),
      "Bandingkan bentuknya. Cari yang bulat tanpa sudut.");
    await captureEvidence(page,`${viewport.width}-shape-attribute-help.png`);
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal(await page.locator("[data-shape-cue]").count(),0);

    const choices=page.locator("[data-shape-attribute-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("data-shape-choice-value"))),["●","▲","■"]);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label"))),["Pilih bentuk: lingkaran","Pilih bentuk: segitiga","Pilih bentuk: persegi"]);
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false]);
    assert.equal(await completed(page),false,"idle shape board cannot complete");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"shape-attribute overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"shape choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"shape choices remain inside viewport");
    }

    const status=scene.locator(':scope > [role="status"]');
    await captureEvidence(page,`${viewport.width}-shape-attribute-idle.png`);

    await chooseWrongWithKeyboard(page);
    await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:2000});
    assert.equal((await status.textContent())?.trim(),"Belum tepat. Coba lagi!");
    assert.equal(await completed(page),false,"wrong shape choice cannot complete");
    assert.equal(await scene.getAttribute("data-shape-resolved"),"false");
    assert.deepEqual(await choices.evaluateAll(items=>items.map(node=>node.disabled)),[false,false,false],"wrong choice keeps all canonical choices retryable");
    await captureEvidence(page,`${viewport.width}-shape-attribute-try.png`);

    const correct=page.getByRole("button",{name:correctLabel,exact:true});
    if(viewport.width===390)await correct.tap();else await correct.click();
    await page.waitForFunction(()=>document.querySelector('[data-shape-attribute-board] > [role="status"]')?.textContent?.includes("Tepat!"),undefined,{timeout:2000});
    assert.match((await status.textContent())??"",/Lingkaran tidak memiliki sudut/,
      "canonical full success explanation must remain accessible");
    assert.equal(await completed(page),true);
    assert.equal(await scene.getAttribute("data-shape-resolved"),"true");
    const successDetail=page.locator("[data-shape-success-detail]");
    await successDetail.waitFor({state:"visible"});
    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:2000});
    const completionBox=await completion.boundingBox();
    const completionViewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(completionBox,"shape-attribute-board canonical Completion must render");
    assert(completionBox.y>=-1&&completionBox.y+completionBox.height<=completionViewportHeight+1,"canonical Completion must remain fully visible");

    const attempt=await page.evaluate(({id})=>{
      const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return[...(state["demo-gian"]??[])].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(attempt,"shape board records attempt evidence");
    assert.equal(attempt.assessed,true);
    assert.equal(attempt.correctCount,1);
    assert.equal(attempt.incorrectCount,1);
    assert.equal(attempt.retryCount,1);
    assert.equal(attempt.accuracy,0.5);
    assert.equal(attempt.metadata?.source,"shape-attribute-board-runtime");
    assert.equal(attempt.metadata?.evidenceFidelity,"choice_shape_attribute_interaction");
    assert.equal(attempt.metadata?.shapeMode,"identify_circle");
    assert.equal(attempt.metadata?.selectedChoice,"●");

    assert.equal(await completion.getByText("Hebat!",{exact:true}).count(),1,
      "canonical concise completion preserves three-star navigation");
    await captureEvidence(page,`${viewport.width}-shape-attribute-success.png`);
    await page.evaluate(()=>{window.__si06eReplayMarker="alive";});
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:2000});
    assert.equal(await page.evaluate(()=>window.__si06eReplayMarker),"alive","Again must reset locally without document reload");
    const targetAttemptCount=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return(attempts["demo-gian"]??[]).filter(item=>item.activityId===id).length;
    },{id:activityId});
    assert.equal(targetAttemptCount,1,"Again reset alone must not create a second target attempt");
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log("VSG-13 Shape Attribute QA passed 5 viewports × idle/help/wrong/success with canonical question, 3 shapes, keyboard/assessment, accessible explanation and 20 screenshots.");
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
