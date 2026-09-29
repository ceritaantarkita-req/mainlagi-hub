import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SI06G_CREATIVE_QA_PORT??4076);
const baseUrl=`http://${host}:${port}`;
const outDir=path.resolve(".mobile-route-qa/si06g-creative");
const viewport={width:390,height:844};
const drawingId="drawing-line-horizontal";
const coloringId="color-gavi";
const routes={
  drawing:`/child/demo-gian/activity/${drawingId}`,
  coloring:`/child/demo-gian/activity/${coloringId}`
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
      const response=await fetch(baseUrl+routes.drawing);
      if(response.status<500)return;
    }catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`SI-06G creative QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function newContext(browser){
  const context=await browser.newContext({viewport,reducedMotion:"reduce"});
  await context.addInitScript(()=>{
    if(!localStorage.getItem("mainlagi-learning-progress-v1")){
      localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
        "demo-gian":{
          completedActivityIds:["color-gavi","color-paca"],
          stars:4,
          lastActivityId:"color-paca"
        }
      }));
    }
  });
  return context;
}

async function completed(page,id){
  return page.evaluate(({activityId})=>{
    const all=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return (all["demo-gian"]?.completedActivityIds??[]).includes(activityId);
  },{activityId:id});
}

async function canonicalCompletion(page,label){
  const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
  await completion.waitFor({state:"visible",timeout:5000});
  assert.equal(await completion.getAttribute("data-completion-context"),"belajar",`${label}: completion context stays Belajar`);
  assert.equal(await completion.getAttribute("data-completion-stars"),"3",`${label}: canonical three-star completion`);
  const actions=completion.locator("[data-completion-action]");
  await page.waitForFunction(
    ()=>document.querySelectorAll('[data-canonical-completion="v1"][data-activity-completion] [data-completion-action]').length===4,
    null,
    {timeout:3000}
  );
  assert.deepEqual(
    await actions.evaluateAll(nodes=>nodes.map(node=>node.textContent?.trim())),
    ["Back","Again","Next","Share"],
    `${label}: canonical Back/Again/Next/Share order`
  );
  return completion;
}

async function assertNoHorizontalOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.viewport+1&&metrics.body<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}

async function inspectDrawing(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.drawing,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"Drawing creative route loads");
    const canvas=page.getByLabel("Kanvas menggambar",{exact:true});
    await canvas.waitFor({state:"visible",timeout:5000});
    assert.equal(await page.locator('[data-activity-completion]').count(),0,"fresh Drawing workspace is not covered by Completion");

    const box=await canvas.boundingBox();
    assert(box,"Drawing canvas has measurable geometry");
    await page.mouse.move(box.x+box.width*0.25,box.y+box.height*0.35);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width*0.72,box.y+box.height*0.62,{steps:10});
    await page.mouse.up();

    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    assert.equal(await finish.isEnabled(),true,"Drawing finish enables after a stroke");
    const artworkBefore=await canvas.evaluate(node=>node.toDataURL());
    assert(artworkBefore.length>100,"Drawing stroke produces canvas pixels");

    await finish.click();
    const completion=await canonicalCompletion(page,"Drawing");
    assert.equal(await completed(page,drawingId),true,"Drawing finish preserves progress completion");
    assert.equal(await canvas.evaluate(node=>node.toDataURL()),artworkBefore,"Drawing artwork survives while Completion overlays the workspace");
    assert.equal(await canvas.isVisible(),true,"Drawing canvas remains mounted under Completion");
    assert.equal(await page.getByRole("link",{name:"Pilih permainan lain"}).count(),0,"legacy Drawing success CTA is gone");

    await page.evaluate(()=>{window.__si06gReplayMarker="alive";});
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await page.evaluate(()=>window.__si06gReplayMarker),"alive","Drawing Again does not reload the document");
    assert.equal(await canvas.evaluate(node=>node.toDataURL()),artworkBefore,"Drawing Again preserves completed artwork");
    assert.equal(await finish.isEnabled(),true,"Drawing Again resumes the same editable workspace");
    await assertNoHorizontalOverflow(page,"Drawing replay");
    mkdirSync(outDir,{recursive:true});
    await page.screenshot({path:path.join(outDir,"drawing-390-again-preserved.png"),fullPage:false});

    await page.reload({waitUntil:"domcontentloaded",timeout:30000});
    await page.getByLabel("Kanvas menggambar",{exact:true}).waitFor({state:"visible",timeout:5000});
    assert.equal(await completed(page,drawingId),true,"Drawing completion remains persisted after reload");
    assert.equal(await page.locator('[data-activity-completion]').count(),0,"reopening an already-completed Drawing activity starts in workspace, not an auto-open Completion");
  }finally{
    await context.close();
  }
}

async function inspectColoring(browser){
  const context=await newContext(browser);
  const page=await context.newPage();
  try{
    const response=await page.goto(baseUrl+routes.coloring,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"Coloring creative route loads");
    const illustration=page.getByLabel(/Gambar untuk diwarnai:/);
    await illustration.waitFor({state:"visible",timeout:5000});
    await page.waitForFunction(()=>document.querySelector('[data-coloring-hit-areas="ready"]')!==null,null,{timeout:5000});

    const region=page.locator('[data-color-region="0"]');
    const pathNode=region.locator("path");
    const fillBefore=await pathNode.getAttribute("fill");
    await region.focus();
    await page.keyboard.press("Enter");
    const fillPainted=await pathNode.getAttribute("fill");
    assert.notEqual(fillPainted,fillBefore,"Coloring interaction changes the selected region fill");
    assert.equal(await region.getAttribute("data-color-filled"),"true","Coloring records region fill state");

    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    assert.equal(await finish.isEnabled(),true,"Coloring finish enables after paint");
    await finish.focus();
    await page.keyboard.press("Enter");
    const completion=await canonicalCompletion(page,"Coloring");
    assert.equal(await completed(page,coloringId),true,"Coloring finish preserves progress completion");
    assert.equal(new URL(page.url()).pathname,routes.coloring,"Coloring Completion stays on the creative activity route");
    assert.equal(await page.getByRole("link",{name:"Pilih permainan lain"}).count(),0,"legacy Coloring success CTA is gone");

    await page.evaluate(()=>{window.__si06gReplayMarker="alive";});
    const again=page.locator('[data-completion-action="again"]');
    assert.equal(await again.count(),1,"Coloring canonical Again remains mounted before replay");
    await again.evaluate(node=>(node).click());
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await page.evaluate(()=>window.__si06gReplayMarker),"alive","Coloring Again does not reload the document");
    const resumedIllustration=page.getByLabel(/Gambar untuk diwarnai:/);
    await resumedIllustration.waitFor({state:"visible",timeout:5000});
    const resumedRegion=page.locator('[data-color-region="0"]');
    const resumedPath=resumedRegion.locator("path");
    assert.equal(await resumedPath.getAttribute("fill"),fillPainted,"Coloring Again preserves completed fills");
    assert.equal(await resumedRegion.getAttribute("data-color-filled"),"true","Coloring Again resumes the same filled workspace");
    assert.equal(await page.getByRole("button",{name:"Selesai",exact:true}).isEnabled(),true,"Coloring Again keeps the finished artwork editable");
    await assertNoHorizontalOverflow(page,"Coloring replay");
    mkdirSync(outDir,{recursive:true});
    await page.screenshot({path:path.join(outDir,"coloring-390-again-preserved.png"),fullPage:false});
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
    await inspectDrawing(browser);
    await inspectColoring(browser);
    console.log("SI-06G Creative browser QA PASS: Drawing and Coloring reach canonical Completion, preserve artwork under the overlay and through local Again, keep progress, remove legacy exits, and reopened completed Drawing returns directly to its workspace.");
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
