/**
 * VSG-11 Drawing-only browser evidence. No runtime/curriculum changes.
 * Tests Chromium touch emulation, NOT physical iPhone Safari acceptance.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_VSG11_DRAWING_PORT??4097);
const origin=`http://${host}:${port}`;
const route="/child/demo-gian/activity/drawing-line-horizontal";
const output=path.join(root,".vsg11-drawing-workspace");
const sizes=[
  {width:320,height:720},
  {width:390,height:844},
  {width:430,height:860},
  {width:768,height:1024},
  {width:1280,height:800},
  {width:568,height:320,landscape:true}
];
let server,serverLog="";
function launchServer(){
  const next=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[next,"start","-H",host,"-p",String(port)],{
    cwd:root,env:{...process.env,NODE_ENV:"production",
      NEXT_PUBLIC_SITE_URL:origin,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  server.stdout.on("data",chunk=>{serverLog+=chunk.toString();});
  server.stderr.on("data",chunk=>{serverLog+=chunk.toString();});
}
async function ready(){
  for(let i=0;i<130;i++){
    try{const r=await fetch(origin+route);if(r.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("VSG-11 server unavailable: "+serverLog.slice(-2500));
}
function stop(){if(server&&!server.killed)server.kill("SIGTERM");}
async function shot(page,size,state){
  const name=`${size.width}x${size.height}-drawing-${state}.png`;
  await page.screenshot({path:path.join(output,name),fullPage:true,animations:"disabled"});
}
async function noOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    width:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.width+1&&metrics.body<=metrics.width+1,
    label+" horizontal page overflow "+JSON.stringify(metrics));
}
async function pixels(canvas){return canvas.evaluate(node=>node.toDataURL("image/png"));}
async function isCompleted(page){
  return page.evaluate(()=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return Boolean(progress["demo-gian"]?.completedActivityIds?.includes("drawing-line-horizontal"));
  });
}
async function checkButtons(page,size){
  const palette=page.getByRole("group",{name:"Palet warna"}).getByRole("button");
  assert.equal(await palette.count(),10,"ten palette colors stay available");
  const tools=page.getByRole("complementary",{name:"Alat menggambar"});
  await tools.waitFor({state:"visible"});
  for(const element of [...await palette.all(),...await tools.locator("button").all()]){
    const box=await element.boundingBox();
    assert(box&&box.width>=44&&box.height>=44,
      `Drawing touch button at ${size.width}x${size.height} is >=44px: ${JSON.stringify(box)}`);
    assert(box.x>=-1&&box.x+box.width<=size.width+1,
      "Drawing tool may not be horizontally clipped: "+JSON.stringify(box));
  }
}
async function testViewport(browser,size){
  const context=await browser.newContext({
    viewport:{width:size.width,height:size.height},
    hasTouch:true,reducedMotion:"reduce"
  });
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const tag=`${size.width}x${size.height}`;
  try{
    const response=await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,tag+" Drawing activity must load");
    const canvas=page.getByLabel("Kanvas menggambar",{exact:true});
    await canvas.waitFor({state:"visible",timeout:8000});
    const geometry=await canvas.evaluate(node=>{
      const b=node.getBoundingClientRect();
      const css=getComputedStyle(node);
      return {logicalWidth:node.width,logicalHeight:node.height,
        width:b.width,height:b.height,left:b.left,right:b.right,
        top:b.top,bottom:b.bottom,touchAction:css.touchAction};
    });
    assert.equal(geometry.logicalWidth,480,"preserve 480 logical canvas width");
    assert.equal(geometry.logicalHeight,480,"preserve 480 logical canvas height");
    assert.equal(geometry.touchAction,"none","prevent scrolling while painting");
    assert(Math.abs(geometry.width-geometry.height)<=2&&geometry.width>=160,
      tag+" canvas must be square and drawable: "+JSON.stringify(geometry));
    assert(geometry.left>=-1&&geometry.right<=size.width+1,
      tag+" canvas clipped horizontally: "+JSON.stringify(geometry));
    if(!size.landscape&&size.width<=430){
      const visible=Math.max(0,Math.min(geometry.bottom,size.height)-Math.max(0,geometry.top));
      assert(visible>=80,tag+" canvas first action must be discoverable before scroll");
    }
    await checkButtons(page,size);
    await noOverflow(page,tag+" idle");
    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    const undo=page.getByRole("button",{name:"Urungkan",exact:true});
    const reset=page.getByRole("button",{name:"Mulai ulang",exact:true});
    assert.equal(await finish.isEnabled(),false,"cannot finish an empty canvas");
    const empty=await pixels(canvas);
    await shot(page,size,"idle");

    await canvas.scrollIntoViewIfNeeded();
    let b=await canvas.boundingBox();assert(b,tag+" canvas should have geometry after scroll");
    await page.touchscreen.tap(b.x+b.width*.32,b.y+b.height*.4);
    await page.waitForFunction(()=>{
      const b=[...document.querySelectorAll("button")].find(x=>x.textContent?.trim()==="Selesai");
      return Boolean(b&&!b.disabled);
    },undefined,{timeout:3000});
    assert.notEqual(await pixels(canvas),empty,"single touch point must paint pixels");
    await shot(page,size,"single-tap");

    await undo.click();
    await page.waitForFunction(before=>{
      const canvas=document.querySelector('canvas[aria-label="Kanvas menggambar"]');
      return Boolean(canvas&&canvas.toDataURL("image/png")===before);
    },empty,{timeout:3500});
    assert.equal(await finish.isEnabled(),false,"Undo restores an empty canvas");
    assert.equal(await isCompleted(page),false,"Undo must not complete the activity");
    await shot(page,size,"undo");

    await canvas.scrollIntoViewIfNeeded();
    b=await canvas.boundingBox();assert(b);
    await page.touchscreen.tap(b.x+b.width*.20,b.y+b.height*.22);
    await page.touchscreen.tap(b.x+b.width*.67,b.y+b.height*.70);
    assert.equal(await finish.isEnabled(),true,"two touch strokes enable Finish");
    await reset.click();
    await page.waitForFunction(before=>{
      const canvas=document.querySelector('canvas[aria-label="Kanvas menggambar"]');
      return Boolean(canvas&&canvas.toDataURL("image/png")===before);
    },empty,{timeout:3500});
    assert.equal(await finish.isEnabled(),false,"Reset clears all strokes");
    await shot(page,size,"reset");

    const guideOff=page.getByRole("button",{name:"Sembunyikan panduan"});
    if(await guideOff.count()){
      await guideOff.click();
      assert.equal(await page.getByRole("button",{name:"Lihat panduan"}).getAttribute("aria-pressed"),"false");
      assert.equal(await pixels(canvas),empty,"guide visibility never alters recorded art");
      await shot(page,size,"guide-off");
      await page.getByRole("button",{name:"Lihat panduan"}).click();
    }else{
      await shot(page,size,"no-guide");
    }

    await canvas.scrollIntoViewIfNeeded();
    b=await canvas.boundingBox();assert(b);
    // On short landscape (568×320) the canvas is taller than the viewport.
    // Compute a stroke within its *visible intersection*, not from
    // percentages of a partially offscreen bounding box. Offscreen mouse
    // coordinates do not dispatch the drawing pointer events in Chromium.
    const top=Math.max(b.y,0);
    const bottom=Math.min(b.y+b.height,size.height);
    const left=Math.max(b.x,0);
    const right=Math.min(b.x+b.width,size.width);
    assert(bottom-top>=60&&right-left>=100,
      tag+" canvas must expose an actual drawable intersection");
    const startX=left+(right-left)*.22;
    const endX=left+(right-left)*.78;
    const startY=top+(bottom-top)*.32;
    const endY=top+(bottom-top)*.68;
    await page.mouse.move(startX,startY);
    await page.mouse.down();
    await page.mouse.move(endX,endY,{steps:12});
    await page.mouse.up();
    assert.equal(await finish.isEnabled(),true,"pointer stroke enables Finish");
    const artwork=await pixels(canvas);
    assert.notEqual(artwork,empty,"full line produces ink");
    await shot(page,size,"worked");
    await finish.click();
    const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({state:"visible",timeout:4500});
    assert.equal(await completion.getAttribute("data-completion-stars"),"3");
    assert.equal(await isCompleted(page),true,"Finish writes one completed activity");
    assert.equal(await pixels(canvas),artwork,"completion overlay preserves drawing");
    await shot(page,size,"completion");
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:4000});
    assert.equal(await pixels(canvas),artwork,"Again preserves drawing without reload");
    await noOverflow(page,tag+" after replay");
    assert.deepEqual(errors,[],tag+" browser errors");
    console.log("VSG-11 Drawing "+tag+" PASS: touch tap, undo, reset, guide, stroke, finish, replay.");
  }finally{await context.close();}
}
async function main(){
  mkdirSync(output,{recursive:true});
  launchServer();await ready();
  const browser=await chromium.launch({headless:true});
  try{
    for(const size of sizes) await testViewport(browser,size);
    console.log("VSG-11 Drawing audit PASS: six viewports incl. short landscape; 42 screenshots, no runtime changes.");
  }finally{await browser.close();stop();}
}
main().catch(err=>{console.error(err);console.error(serverLog.slice(-4000));process.exitCode=1;stop();});
