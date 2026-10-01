import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_JM_ENGLISH_QA_PORT??4082);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/subject/english";
const outDir=path.resolve(".mobile-route-qa/jm03-jm05-english");
const expectedStageIds=[
  "english-first-words",
  "english-alphabet-basics",
  "english-everyday-words",
  "english-words-actions",
  "english-phrases-review"
];

let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{
      ...process.env,
      NODE_ENV:"production",
      NEXT_PUBLIC_SITE_URL:baseUrl,
      NEXT_PUBLIC_DATA_BACKEND:"local",
      MAINLAGI_QA_UNLOCK_ALL:"1"
    },
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
      const response=await fetch(baseUrl+route);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`JM-03/04/05 English QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function seedEmptyProgress(context){
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
  });
}

async function assertNoOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.viewport+1&&metrics.body<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}

async function assertBaseMap(page,label){
  await page.locator('[data-english-journey-map="v1"]').waitFor({state:"visible",timeout:8000});
  assert.equal(await page.getByRole("heading",{name:"Bahasa Inggris",exact:true}).count(),1,`${label}: child-facing Bahasa Inggris title`);
  assert.equal(await page.locator("[data-activity-gallery]").count(),0,`${label}: legacy gallery is not the English default surface`);
  assert.equal(await page.locator("[data-stage-detail-open]").count(),0,`${label}: map opens without stage detail`);
  const nodes=page.locator("[data-journey-stage]");
  assert.equal(await nodes.count(),5,`${label}: exact five English stages`);
  assert.deepEqual(await nodes.evaluateAll(items=>items.map(item=>item.getAttribute("data-journey-stage"))),expectedStageIds,`${label}: canonical stage order`);
  assert.equal(await page.locator('[data-journey-stage][data-state="current"]').count(),1,`${label}: exactly one current stage`);
  assert.equal(await page.locator('[data-journey-stage][data-state="locked"]').count(),4,`${label}: remaining fresh stages locked`);
  assert.equal(await page.locator("[data-english-browse-all]").count(),1,`${label}: Browse All preserved`);
  const header=page.locator('[data-mainlagi-jm02-header="v1"]');
  assert.equal(await header.count(),1,`${label}: JM-02 shared header remains owner`);
  assert.equal(await header.locator('[data-mainlagi-header-back]').getAttribute("href"),"/child/demo-gian/home#choose-subject",`${label}: canonical Back route`);
  const firstBox=await nodes.first().boundingBox();
  assert(firstBox&&firstBox.height>=44&&firstBox.width>=44,`${label}: stage node respects touch target`);
  await assertNoOverflow(page,label);
}

async function desktopAndKeyboard(browser){
  const context=await browser.newContext({viewport:{width:1280,height:860},reducedMotion:"reduce"});
  await seedEmptyProgress(context);
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
  try{
    await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    await assertBaseMap(page,"desktop");

    const first=page.locator('[data-journey-stage="english-first-words"]');
    const dialog=page.locator("[data-stage-detail-open]");
    let opened=false;
    for(let attempt=0;attempt<2&&!opened;attempt++){
      await first.focus();
      assert.equal(await first.evaluate(element=>document.activeElement===element),true,"desktop: first Stage receives keyboard focus");
      await first.press("Enter");
      try{
        await dialog.waitFor({state:"visible",timeout:3000});
        opened=true;
      }catch(error){
        if(attempt===1)throw error;
        await page.waitForTimeout(500);
      }
    }
    assert.equal(await page.getByRole("dialog").count(),1,"desktop: contextual Stage detail opens");
    assert.equal(await page.locator("[data-stage-text-activity-list] img").count(),0,"desktop: Stage detail remains text-only");
    assert((await page.locator("[data-stage-text-activity-list] li").count())>0,"desktop: Stage detail lists activities");
    assert.equal(await page.locator("[data-stage-continue]").count(),1,"desktop: Continue learning CTA exists");
    await page.keyboard.press("Escape");
    await dialog.waitFor({state:"hidden",timeout:3000});

    const browse=page.locator("[data-english-browse-all]");
    await browse.locator("summary").click();
    assert.equal(await browse.locator("li").count(),100,"desktop: Browse All exposes exact 100-activity membership");

    mkdirSync(outDir,{recursive:true});
    await page.screenshot({path:path.join(outDir,"english-map-desktop-1280.png"),fullPage:false});
    assert.deepEqual(errors,[],"desktop: no unexpected browser errors");
  }finally{
    await context.close();
  }
}

async function responsiveAndRotation(browser){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce",hasTouch:true});
  await seedEmptyProgress(context);
  const page=await context.newPage();
  try{
    await page.goto(baseUrl+route+"?qa=unlock-all",{waitUntil:"domcontentloaded",timeout:30000});
    await page.locator('[data-english-journey-map="v1"]').waitFor({state:"visible",timeout:8000});

    const nodes=page.locator("[data-journey-stage]");
    assert.equal(await nodes.count(),5,"portrait: exact five stage nodes");
    assert.equal(await page.locator('[data-journey-stage="english-phrases-review"]').isEnabled(),true,"portrait QA: final stage can be inspected");

    await page.locator('[data-journey-stage="english-everyday-words"]').tap();
    const detail=page.locator("[data-stage-detail-open]");
    await detail.waitFor({state:"visible",timeout:3000});
    const titleBefore=await page.locator("#english-stage-detail-title").textContent();
    assert(titleBefore,"portrait: selected Stage title is visible");

    const portraitBox=await page.getByRole("dialog").boundingBox();
    assert(portraitBox&&portraitBox.y+portraitBox.height>=843,"portrait: Stage detail behaves as bottom sheet");

    await page.setViewportSize({width:844,height:390});
    await page.waitForTimeout(100);
    assert.equal(await detail.count(),1,"landscape rotation: Stage detail remains mounted");
    assert.equal(await page.locator("#english-stage-detail-title").textContent(),titleBefore,"landscape rotation: selected Stage state preserved");
    await assertNoOverflow(page,"landscape");
    await page.screenshot({path:path.join(outDir,"english-map-landscape-detail-844x390.png"),fullPage:false});

    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator("#english-stage-detail-title").textContent(),titleBefore,"portrait return: selected Stage state still preserved");
    await page.getByRole("button",{name:"Tutup detail stage"}).tap();
    await detail.waitFor({state:"hidden",timeout:3000});
    await assertNoOverflow(page,"portrait");
    await page.screenshot({path:path.join(outDir,"english-map-portrait-390.png"),fullPage:false});
  }finally{
    await context.close();
  }
}

async function tablet(browser){
  const context=await browser.newContext({viewport:{width:768,height:1024},reducedMotion:"reduce"});
  await seedEmptyProgress(context);
  const page=await context.newPage();
  try{
    await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    await assertBaseMap(page,"tablet");
    await page.locator('[data-journey-stage="english-first-words"]').click();
    await page.getByRole("dialog").waitFor({state:"visible",timeout:3000});
    await assertNoOverflow(page,"tablet detail");
    await page.screenshot({path:path.join(outDir,"english-map-tablet-768.png"),fullPage:false});
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
    await desktopAndKeyboard(browser);
    await responsiveAndRotation(browser);
    await tablet(browser);
    console.log("JM-03/JM-04/JM-05 English Journey Map browser QA PASS: clean map default, exact five-stage canonical order, contextual text-only detail + Continue, Browse All 100, JM-02 header ownership, portrait bottom sheet, landscape/tablet containment, keyboard/touch operation, and rotation state preservation.");
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
