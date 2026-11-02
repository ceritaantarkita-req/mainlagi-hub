import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SINGLE_RULE_APPLY_QA_PORT??4043);
const baseUrl="http://"+host+":"+port;
const route="/child/demo-gian/activity/logic-if-red-then-circle";
const activityId="logic-if-red-then-circle";
const correctLabel="Pilih hasil: 🔴 lingkaran";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vsg15-single-rule");
const viewports=[{width:320,height:720},{width:390,height:844},{width:430,height:860},{width:768,height:1024},{width:1280,height:800}];
async function captureEvidence(page,name) {
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
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Single-rule QA server did not become ready.\n"+serverLog.slice(-4000));
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
      const attemptId="qa-single-rule-prereq-"+index;
      const completedAt="2026-09-18T01:0"+index+":00.000Z";
      return{id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",stageId:"logic-patterns-sequences-relations",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"single-rule-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}
async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-single-rule-apply]");
    return scene?.getAttribute("data-single-rule-apply-ready")==="true"&&scene.querySelectorAll("[data-single-rule-choice]").length===3;
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
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-single-rule-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong single-rule choice");
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
    assert(response&&response.status()<400,"single-rule bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route);
    const scene=page.locator('[data-single-rule-apply][data-child-visual-hierarchy="single-rule-vsg15"]');
    assert.equal(await scene.count(),1,"uses existing child-first hierarchy");
    const heading=scene.getByRole("heading",{level:1,name:"Aturannya: jika merah, pilih lingkaran. Mana yang benar?"});
    assert.equal(await heading.count(),1,"canonical original question remains prominent");
    const qbox=await heading.boundingBox();
    assert(qbox&&qbox.y>=0&&qbox.y+qbox.height<=viewport.height&&
      qbox.x>=0&&qbox.x+qbox.width<=viewport.width+1,
      "first action visible at 320/390/430/768/1280px");
    assert.equal(await page.getByText("Terapkan aturannya",{exact:true}).count(),0);
    const status=scene.locator(':scope > [role="status"]');
    assert.equal((await status.textContent())?.trim(),"","no repeated idle status");
    const help=page.getByRole("button",{name:"Cara main"});
    assert.equal(await help.getAttribute("aria-expanded"),"false");
    assert.equal(await page.locator("[data-single-rule-help]").count(),0);
    await help.click();
    assert.equal(await page.getByRole("button",{name:"Tutup bantuan"}).getAttribute("aria-expanded"),"true");
    assert.equal(await page.locator("[data-single-rule-help]").innerText(),
      "Cocokkan kondisi merah dengan bentuk yang diminta aturan.");
    await captureEvidence(page,`${viewport.width}-single-rule-help.png`);
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal(await page.locator("[data-single-rule-help]").count(),0);
    assert.equal(await page.locator("[data-single-rule-rule]").count(),1);
    assert.equal(await page.locator("[data-single-rule-input]").count(),1);
    assert.equal(await page.locator("[data-single-rule-target]").getAttribute("data-single-rule-target-state"),"unknown");
    assert.equal(await page.locator("[data-single-rule-target]").getByText("?").count(),1);
    assert.equal(await page.locator("[data-single-rule-rule]").getByText("Jika merah, pilih lingkaran.").count(),1);
    assert.equal(await completed(page),false,"idle single-rule cannot complete");

    const choices=page.locator("[data-single-rule-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set(["Pilih hasil: 🔴 lingkaran","Pilih hasil: 🔴 segitiga","Pilih hasil: 🔵 lingkaran"]));
    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"single-rule overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"single-rule choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"single-rule choices remain inside viewport");
    }

    await captureEvidence(page,`${viewport.width}-single-rule-idle.png`);

    const wrong=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrong,correctLabel);
    await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:2000});
    assert.equal((await status.textContent())?.trim(),"Belum tepat. Coba lagi!");
    assert.equal(await completed(page),false,"wrong single-rule answer cannot complete");
    assert.equal(await page.locator("[data-single-rule-target]").getAttribute("data-single-rule-target-state"),"unknown");
    await captureEvidence(page,`${viewport.width}-single-rule-try.png`);

    const correct=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correct.tap(); else await correct.click();
    await page.waitForFunction(()=>document.querySelector('[data-single-rule-apply] > [role="status"]')?.textContent?.includes("Tepat!"),
      undefined,{timeout:2000});
    assert.match((await status.textContent())??"",/Pilihan merah berbentuk lingkaran memenuhi satu aturan/,
      "full canonical success explanation remains accessible");
    assert.equal(await completed(page),true,"correct single-rule answer completes canonical activity");
    assert.equal(await page.locator("[data-single-rule-target]").getAttribute("data-single-rule-target-state"),"complete");
    assert.equal(await page.locator("[data-single-rule-target]").getByText("🔴 lingkaran",{exact:true}).count(),1);
    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:2000});
    const completionBox=await completion.boundingBox();
    const completionViewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(completionBox,"single-rule-apply canonical Completion must render");
    assert(completionBox.y>=-1&&completionBox.y+completionBox.height<=completionViewportHeight+1,"canonical Completion must remain fully visible");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"single-rule records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"single-rule-apply-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_single_rule_apply_interaction");
    assert.equal(state.metadata?.ruleMode,"constraint_match");
    assert.equal(state.metadata?.selectedChoice,"🔴 lingkaran");
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    assert.equal(await completion.getByText("Hebat!",{exact:true}).count(),1,
      "concise completion preserves canonical star navigation");
    await captureEvidence(page,`${viewport.width}-single-rule-success.png`);
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
  }finally{
    await browser.close();
  }
}
async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log("VSG-15 Single Rule Apply QA passed 5 viewports × idle/help/wrong/success with hidden target, canonical rule/condition, keyboard retry, assessed evidence and concise completion.");
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
