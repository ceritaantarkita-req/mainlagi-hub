import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SEMANTIC_SESSION13_QA_PORT??4051);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/subject/bahasa?qa=unlock-all";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[
  {width:320,height:720},
  {width:390,height:844},
  {width:430,height:860},
  {width:768,height:1024},
  {width:1280,height:800}
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

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{
      const response=await fetch(`${baseUrl}${route}`);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Session 13 semantic gallery QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){
  if(server&&!server.killed)server.kill("SIGTERM");
}

async function inspect(browser,viewport){
  const context=await browser.newContext({viewport,reducedMotion:"reduce"});
  try{
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`Session 13 Bahasa Journey Map must load at ${viewport.width}`);
    const map=page.locator('[data-belajar-journey-map="v1"][data-journey-subject="bahasa"]');
    await map.waitFor({state:"visible",timeout:6000});

    const browse=page.locator("[data-journey-browse-all]");
    await browse.waitFor({state:"visible",timeout:6000});
    const item=browse.locator('[data-activity-id="bahasa-baca-sari-hujan"]');
    assert.equal(await item.count(),1,`umbrella-bound activity must remain unique in Browse All at ${viewport.width}`);
    assert.equal(await item.locator("img").count(),0,`JM-06 Browse All must stay text-only at ${viewport.width}`);
    assert.equal(await item.locator("[data-learning-semantic-key]").count(),0,`JM-06 must not reintroduce gallery semantic thumbnails at ${viewport.width}`);

    const itemText=(await item.textContent())??"";
    assert(!itemText.toLowerCase().includes("merah"),`Browse All must not expose the assessed color answer at ${viewport.width}`);
    assert(!itemText.toLowerCase().includes("biru"),`Browse All must not expose distractor answers at ${viewport.width}`);
    assert(!itemText.toLowerCase().includes("kuning"),`Browse All must not expose distractor answers at ${viewport.width}`);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`Session 13 Bahasa Journey Map must not overflow horizontally at ${viewport.width}`);

    mkdirSync(screenshotDir,{recursive:true});
    await item.screenshot({path:path.join(screenshotDir,`${viewport.width}-bahasa-journey-text-only.png`)});

    assert.deepEqual(pageErrors,[],`Bahasa Journey Map page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`Bahasa Journey Map console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
  }finally{
    await context.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    for(const viewport of viewports)await inspect(browser,viewport);
    console.log(`Session 13 Bahasa Journey Map migration QA passed ${viewports.length} required viewports with exact Browse All membership, text-only presentation, no answer leak and no horizontal overflow.`);
  }finally{
    await browser.close();
  }
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
