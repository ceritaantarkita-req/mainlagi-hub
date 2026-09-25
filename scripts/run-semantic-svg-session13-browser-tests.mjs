import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { assertLearningVisualContainment } from "./lib/assert-learning-visual-containment.mjs";

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
    assert(response&&response.status()<400,`Session 13 Bahasa gallery must load at ${viewport.width}`);
    await page.locator("[data-qa-unlock-all]").waitFor({state:"visible",timeout:6000});

    const card=page.locator('[data-activity-id="bahasa-baca-sari-hujan"]');
    assert.equal(await card.count(),1,`umbrella preview activity must remain unique at ${viewport.width}`);

    const token=card.locator('[data-learning-semantic-key="object.umbrella"][data-learning-visual-source="semantic-svg"]');
    assert.equal(await token.count(),1,`umbrella semantic SVG must render in the activity gallery at ${viewport.width}`);
    assert.equal(
      await token.locator('img[src="/artwork/learning-illustrations/object-umbrella-v1.svg"][data-learning-semantic-image]').count(),
      1,
      `umbrella gallery preview must use the canonical SVG at ${viewport.width}`
    );
    assert.equal(await card.getByText("☂️",{exact:true}).count(),0,`approved umbrella SVG replaces fallback glyph at ${viewport.width}`);

    const cardText=(await card.textContent())??"";
    assert(!cardText.toLowerCase().includes("merah"),`umbrella gallery preview must not expose the assessed color answer at ${viewport.width}`);
    assert(!cardText.toLowerCase().includes("biru"),`umbrella gallery preview must not expose distractor answers at ${viewport.width}`);
    assert(!cardText.toLowerCase().includes("kuning"),`umbrella gallery preview must not expose distractor answers at ${viewport.width}`);

    await assertLearningVisualContainment(page,'[data-activity-id="bahasa-baca-sari-hujan"]',`umbrella gallery semantic containment at ${viewport.width}`);

    const imageStyle=await token.locator("[data-learning-semantic-image]").evaluate(node=>({
      objectFit:getComputedStyle(node).objectFit,
      width:node.getBoundingClientRect().width,
      height:node.getBoundingClientRect().height
    }));
    assert.equal(imageStyle.objectFit,"contain",`umbrella SVG must preserve contain fitting at ${viewport.width}`);
    assert(imageStyle.width>=32&&imageStyle.height>=32,`umbrella SVG must remain child-readable at ${viewport.width}`);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`Session 13 Bahasa gallery must not overflow horizontally at ${viewport.width}`);

    mkdirSync(screenshotDir,{recursive:true});
    await card.screenshot({path:path.join(screenshotDir,`${viewport.width}-semantic-umbrella-gallery.png`)});

    assert.deepEqual(pageErrors,[],`umbrella gallery page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`umbrella gallery console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
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
    console.log(`Session 13 semantic umbrella gallery QA passed ${viewports.length} required viewports with canonical SVG decode, same-origin containment, no answer leak and no horizontal overflow.`);
  }finally{
    await browser.close();
  }
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
