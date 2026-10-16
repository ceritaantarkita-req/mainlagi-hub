import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

// VQA-07: new screenshot evidence only; NO runtime, scoring or creative semantics changes.
const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_VQA07_CREATIVE_PORT??4089);
const baseUrl="http://"+host+":"+port;
const outDir=path.join(root,".vqa07-creative-canvas");
const viewports=[
  {width:320,height:720},{width:390,height:844},
  {width:768,height:1024},{width:1280,height:860}
];
const cases=[
  {kind:"drawing",activityId:"drawing-line-horizontal",route:"/child/demo-gian/activity/drawing-line-horizontal"},
  {kind:"coloring",activityId:"color-gavi",route:"/child/demo-gian/activity/color-gavi"}
];
let server=null;
let serverLog="";
function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  server.stdout.on("data",part=>{serverLog+=part.toString();});
  server.stderr.on("data",part=>{serverLog+=part.toString();});
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}
async function waitForServer(){
  for(let i=0;i<120;i++){
    try{const res=await fetch(baseUrl+cases[0].route);if(res.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error("VQA-07 creative server not ready: "+serverLog.slice(-3200));
}
async function seed(context){
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
  });
}
async function assertNoOverflow(page,label){
  const v=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(v.html<=v.viewport+1&&v.body<=v.viewport+1,label+" overflow: "+JSON.stringify(v));
}
async function isCompleted(page,activityId){
  return page.evaluate(id=>{
    const all=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return Boolean(all["demo-gian"]?.completedActivityIds?.includes(id));
  },activityId);
}
async function capture(page,kind,width,state){
  const name=kind+"-"+width+"-"+state+".png";
  await page.screenshot({path:path.join(outDir,name),fullPage:false,animations:"disabled"});
}
async function verifyCompletion(page,kind,width){
  const overlay=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
  await overlay.waitFor({state:"visible",timeout:5000});
  assert.equal(await overlay.getAttribute("data-completion-stars"),"3",kind+" completion stars "+width);
  assert.equal(await overlay.getAttribute("data-completion-context"),"belajar",kind+" Belajar completion "+width);
  const actions=overlay.locator("[data-completion-action]");
  assert.deepEqual(await actions.evaluateAll(nodes=>nodes.map(n=>n.textContent?.trim())),
    ["Back","Again","Next","Share"],kind+" completion actions "+width);
  for(const action of await actions.all()){
    const size=await action.boundingBox();
    assert(size&&size.width>=44&&size.height>=44,
      kind+" completion touch area >=44px at "+width+": "+JSON.stringify(size));
  }
  return overlay;
}
async function inspect(browser,viewport,item){
  const context=await browser.newContext({
    viewport,reducedMotion:"reduce",hasTouch:viewport.width<=390
  });
  await seed(context);
  const page=await context.newPage();
  const jsErrors=[];
  page.on("pageerror",error=>jsErrors.push(error.message));
  try{
    const response=await page.goto(baseUrl+item.route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,item.kind+" route status "+viewport.width);
    assert.equal(new URL(page.url()).pathname,item.route,item.kind+" direct route retained");
    const artwork=item.kind==="drawing"
      ?page.getByLabel("Kanvas menggambar",{exact:true})
      :page.getByLabel(/Gambar untuk diwarnai:/);
    await artwork.waitFor({state:"visible",timeout:8000});
    if(item.kind==="coloring"){
      await page.waitForFunction(
        ()=>Boolean(document.querySelector('[data-coloring-hit-areas="ready"]')),
        undefined,{timeout:5000}
      );
      const instruction=page.locator('[data-creative-color-instruction="v1"]');
      await instruction.waitFor({state:"visible",timeout:5000});
      assert.equal((await instruction.innerText()).trim(),"Pilih warna. Sentuh gambarnya.",
        "Coloring keeps exact canonical child instruction");
      const appearance=await instruction.evaluate(node=>{
        const style=getComputedStyle(node),rect=node.getBoundingClientRect();
        return {color:style.color,backgroundColor:style.backgroundColor,
          gradient:style.backgroundImage,shadow:style.boxShadow,
          border:style.borderTopWidth,left:rect.left,right:rect.right,
          viewport:document.documentElement.clientWidth,height:rect.height};
      });
      assert.equal(appearance.color,"rgb(25, 59, 85)",
        "Coloring instruction keeps readable dark text "+viewport.width);
      assert.match(appearance.gradient,/radial-gradient.*closest-side/,
        "Coloring instruction needs a local warm contrast halo "+viewport.width);
      assert.match(appearance.gradient,/rgba\\(255, 252, 240, 0\\)/,
        "Coloring halo must dissolve without a rectangular box "+viewport.width);
      assert.equal(appearance.backgroundColor,"rgba(0, 0, 0, 0)",
        "Coloring instruction must not gain an opaque card "+viewport.width);
      assert.equal(appearance.border,"0px","Coloring instruction must stay unboxed");
      assert(appearance.left>=-1&&appearance.right<=appearance.viewport+1&&appearance.height>=24,
        "Coloring instruction must be fully in frame "+viewport.width+": "+JSON.stringify(appearance));
    }else{
      assert.equal(await page.locator('[data-creative-color-instruction]').count(),0,
        "Drawing scaffold must never inherit the Coloring-only instruction halo");
    }
    const palette=page.getByRole("group",{name:"Palet warna"}).getByRole("button");
    assert.equal(await palette.count(),10,item.kind+" maintains all canonical palette colors");
    const initial=await artwork.evaluate(node=>{
      const b=node.getBoundingClientRect();
      return {x:b.x,y:b.y,width:b.width,height:b.height,bottom:b.bottom,
        viewportWidth:document.documentElement.clientWidth,viewportHeight:innerHeight};
    });
    assert(initial.width>=160&&initial.height>=160,
      item.kind+" artwork must remain usable: "+JSON.stringify(initial));
    assert(initial.x>=-1&&initial.x+initial.width<=initial.viewportWidth+1,
      item.kind+" artwork must fit without horizontal clipping: "+JSON.stringify(initial));
    // A truthful first-action check before scrolling; mobile artwork must be
    // discoverable, not buried behind repeated instructions/decorative chrome.
    if(viewport.width<=390){
      const visible=Math.max(0,Math.min(initial.bottom,initial.viewportHeight)-Math.max(initial.y,0));
      assert(visible>=80,
        item.kind+" needs at least 80px of creative canvas visible before scroll at "+viewport.width+
        ": "+JSON.stringify(initial));
    }
    assert.equal(await page.locator("[data-activity-completion]").count(),0,
      item.kind+" idle cannot show completion");
    await assertNoOverflow(page,item.kind+" idle "+viewport.width);
    await capture(page,item.kind,viewport.width,"idle");

    await artwork.scrollIntoViewIfNeeded();
    let artBefore=null;
    if(item.kind==="drawing"){
      const box=await artwork.boundingBox();
      assert(box,"Drawing canvas geometry");
      await page.mouse.move(box.x+box.width*.25,box.y+box.height*.32);
      await page.mouse.down();
      await page.mouse.move(box.x+box.width*.75,box.y+box.height*.67,{steps:10});
      await page.mouse.up();
      artBefore=await artwork.evaluate(node=>node.toDataURL());
      assert(artBefore.length>100,"Drawing canvas records pixels");
    } else {
      const region=page.locator('[data-color-region="0"]');
      const pathNode=region.locator("path");
      const before=await pathNode.getAttribute("fill");
      await region.focus();
      await page.keyboard.press("Enter");
      artBefore=await pathNode.getAttribute("fill");
      assert.notEqual(artBefore,before,"Coloring one region must change fill");
      assert.equal(await region.getAttribute("data-color-filled"),"true",
        "Coloring region has evidence of paint");
    }
    await capture(page,item.kind,viewport.width,"worked");
    const finish=page.getByRole("button",{name:"Selesai",exact:true});
    assert.equal(await finish.isEnabled(),true,item.kind+" finish enabled by artwork");
    await finish.click();
    const completion=await verifyCompletion(page,item.kind,viewport.width);
    assert.equal(await isCompleted(page,item.activityId),true,item.kind+" completion persists");
    await capture(page,item.kind,viewport.width,"completion");
    if(item.kind==="drawing"){
      assert.equal(await artwork.evaluate(node=>node.toDataURL()),artBefore,
        "Drawing completion never changes artwork");
    }
    await page.evaluate(()=>{window.__vqa07Marker="alive";});
    await completion.locator('[data-completion-action="again"]').evaluate(node=>node.click());
    await completion.waitFor({state:"hidden",timeout:4000});
    assert.equal(await page.evaluate(()=>window.__vqa07Marker),"alive",
      item.kind+" Again must not reload page");
    if(item.kind==="drawing"){
      assert.equal(await artwork.evaluate(node=>node.toDataURL()),artBefore,
        "Drawing Again preserves same work");
    }else{
      const after=await page.locator('[data-color-region="0"] path').getAttribute("fill");
      assert.equal(after,artBefore,"Coloring Again preserves region fill");
    }
    await assertNoOverflow(page,item.kind+" again "+viewport.width);
    await capture(page,item.kind,viewport.width,"again");
    assert.deepEqual(jsErrors,[],item.kind+" Javascript console page errors "+viewport.width);
    console.log("VQA-07 "+item.kind+" "+viewport.width+" PASS: idle/work/completion/Again captured, first action and evidence intact.");
  } finally {await context.close();}
}
async function main(){
  mkdirSync(outDir,{recursive:true});
  startServer();await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    for(const viewport of viewports){
      for(const item of cases) await inspect(browser,viewport,item);
    }
    console.log("VQA-07 PASS: 32 creative screenshots: Coloring and Drawing x 4 widths x 4 states; no gameplay or answer changes.");
  }finally{await browser.close();stopServer();}
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-4500));process.exitCode=1;stopServer();});
