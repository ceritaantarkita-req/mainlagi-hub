import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SI06A_FALLBACK_QA_PORT??4069);
const baseUrl=`http://${host}:${port}`;
const outDir=path.resolve(".mobile-route-qa/si06a-fallback-belajar");
const portrait={width:390,height:844};
const landscape={width:844,height:390};

const routes={
  choice:"/child/demo-gian/activity/english-find-blue",
  matching:"/child/demo-gian/activity/english-match-hello",
  trace:"/child/demo-gian/activity/letters-trace-a",
  story:"/child/demo-gian/activity/bahasa-cerita-teman"
};

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

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function waitForServer(timeoutMs=60000){
  const started=Date.now();
  while(Date.now()-started<timeoutMs){
    try{
      const response=await fetch(baseUrl+routes.choice);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`SI-06A fallback QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function newContext(browser){
  const context=await browser.newContext({viewport:portrait,reducedMotion:"reduce",hasTouch:true});
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({"demo-gian":[]}));
    window.__si06aDocumentMarker="fallback-document";
  });
  return context;
}

async function attemptsFor(page,activityId){
  return page.evaluate(({id})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return (state["demo-gian"]??[]).filter(item=>item.activityId===id);
  },{id:activityId});
}

async function waitForAttemptCount(page,activityId,count){
  await page.waitForFunction(({id,expected})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return (state["demo-gian"]??[]).filter(item=>item.activityId===id).length===expected;
  },{id:activityId,expected:count},{timeout:5000});
}

async function completed(page,activityId){
  return page.evaluate(({id})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return (state["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function canonicalCompletion(page,label){
  const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
  await completion.waitFor({state:"visible",timeout:5000});
  assert.equal(await completion.getAttribute("data-completion-context"),"belajar",`${label}: Belajar context`);
  assert.equal(await completion.getAttribute("data-completion-stars"),"3",`${label}: three-star completion`);
  assert.deepEqual(
    await completion.locator("[data-completion-action]").evaluateAll(nodes=>nodes.map(node=>node.textContent?.trim())),
    ["Back","Again","Next","Share"],
    `${label}: canonical action order`
  );
  return completion;
}

async function assertNoOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.viewport+1&&metrics.body<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}

async function inspectChoice(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.choice,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"fallback choice route loads");
    const grid=page.locator("[data-choices]");
    await grid.waitFor({state:"visible",timeout:5000});
    assert.equal(await page.locator("[data-symbol-hunt]").count(),0,"english-find-blue stays on fallback choice owner");

    await page.getByRole("button",{name:"🔴",exact:true}).click();
    await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:3000});
    assert.equal(await completed(page,"english-find-blue"),false,"wrong fallback choice does not complete");
    assert.equal((await attemptsFor(page,"english-find-blue")).length,0,"wrong fallback choice writes no attempt");

    await page.getByRole("button",{name:"🔵",exact:true}).click();
    const completion=await canonicalCompletion(page,"choice");
    await waitForAttemptCount(page,"english-find-blue",1);
    assert.equal(await completed(page,"english-find-blue"),true,"correct fallback choice preserves progress write");

    const attempt=(await attemptsFor(page,"english-find-blue"))[0];
    assert(attempt,"choice attempt exists");
    assert.equal(attempt.incorrectCount,1,"choice attempt preserves wrong interaction count");
    assert.equal(attempt.correctCount,1,"choice attempt preserves correct interaction count");
    assert.equal(attempt.retryCount,1,"choice attempt preserves retry count");
    assert.equal(attempt.accuracy,0.5,"choice attempt preserves measured accuracy");

    await completion.locator('[data-completion-action="share"]').click();
    const share=page.locator('[data-canonical-share="v1"]');
    await share.waitFor({state:"visible",timeout:5000});
    await page.waitForFunction(()=>document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate")==="allowed",null,{timeout:5000});
    assert.equal(await share.getAttribute("data-share-public-path"),"/","fallback choice Share remains public-safe");
    assert.equal((await attemptsFor(page,"english-find-blue")).length,1,"opening Share does not duplicate fallback attempt");

    await page.setViewportSize(landscape);
    await page.waitForFunction(()=>document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation")==="landscape",null,{timeout:5000});
    assert.equal(await page.evaluate(()=>window.__si06aDocumentMarker),"fallback-document","fallback choice rotation does not reload");
    assert.equal(await share.evaluate(node=>node.open),true,"fallback Share stays open through rotation");
    assert.equal((await attemptsFor(page,"english-find-blue")).length,1,"rotation does not duplicate fallback attempt");
    await assertNoOverflow(page,"fallback choice landscape");
    await page.screenshot({path:path.join(outDir,"choice-844x390-share.png"),fullPage:false});

    await share.getByRole("button",{name:"Tutup"}).click();
    await page.setViewportSize(portrait);
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await grid.isVisible(),true,"Again returns to fallback choice board");
    assert.equal(await page.getByRole("button",{name:"🔵",exact:true}).isEnabled(),true,"Again re-enables choice input");
    assert.equal((await attemptsFor(page,"english-find-blue")).length,1,"Again alone does not write a second attempt");
    await page.screenshot({path:path.join(outDir,"choice-390-again.png"),fullPage:false});
  }finally{
    await context.close();
  }
}

async function inspectMatching(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.matching,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"fallback matching route loads");
    const board=page.locator("[data-visible-matching]");
    await board.waitFor({state:"visible",timeout:5000});

    for(const [left,right] of [["CAT","🐱"],["SUN","☀️"]]){
      await page.getByRole("button",{name:left,exact:true}).click();
      await page.getByRole("button",{name:right,exact:true}).click();
    }

    const completion=await canonicalCompletion(page,"matching");
    assert.equal(await completed(page,"english-match-hello"),true,"fallback matching preserves progress write");
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await board.isVisible(),true,"Again returns to matching board");
    assert.equal(await page.locator("[data-match-card]:not(:disabled)").count()>0,true,"Again resets matching cards");
  }finally{
    await context.close();
  }
}

async function inspectTrace(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.trace,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"fallback trace route loads");
    const canvas=page.getByLabel("Area menulis huruf A",{exact:true});
    await canvas.waitFor({state:"visible",timeout:5000});
    const box=await canvas.boundingBox();
    assert(box,"trace canvas geometry exists");
    await page.mouse.move(box.x+box.width*0.35,box.y+box.height*0.25);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*0.55,box.y+box.height*0.65,{steps:6});
    await page.mouse.up();

    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    assert.equal(await finish.isEnabled(),true,"trace finish enables after stroke");
    await finish.click();
    const completion=await canonicalCompletion(page,"trace");
    assert.equal(await completed(page,"letters-trace-a"),true,"fallback trace preserves progress write");

    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await finish.isDisabled(),true,"Again clears fallback trace stroke state");
    assert.equal(await canvas.isVisible(),true,"Again preserves trace canvas runtime");
  }finally{
    await context.close();
  }
}

async function inspectStory(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.story,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"fallback story route loads");
    await page.getByText("Paca melihat Gavi duduk sendiri di taman.",{exact:true}).waitFor({state:"visible",timeout:5000});
    const finish=page.getByRole("button",{name:/Selesai/});
    await finish.click();
    const completion=await canonicalCompletion(page,"story");
    assert.equal(await completed(page,"bahasa-cerita-teman"),true,"fallback story preserves progress write");
    assert.equal(await page.getByRole("link",{name:"Pilih permainan lain"}).count(),0,"legacy fallback subject-exit CTA is removed");

    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await finish.isVisible(),true,"Again returns to story finish affordance");
    assert.equal(await page.getByText("Paca melihat Gavi duduk sendiri di taman.",{exact:true}).isVisible(),true,"Again preserves story content");
  }finally{
    await context.close();
  }
}

async function main(){
  mkdirSync(outDir,{recursive:true});
  startServer();
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    await inspectChoice(browser);
    await inspectMatching(browser);
    await inspectTrace(browser);
    await inspectStory(browser);
    console.log("SI-06A fallback Belajar browser QA PASS: production fallback Choice/Matching/Trace/Story reach canonical Completion+Share, preserve progress/evidence, survive rotation, and Again resets local runtime without reload.");
  }finally{
    await browser.close();
    stopServer();
  }
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
  stopServer();
});
