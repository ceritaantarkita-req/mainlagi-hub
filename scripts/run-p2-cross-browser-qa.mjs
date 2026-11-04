import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium, webkit } from "playwright";

/**
 * P2 QA-only responsive browser sampling. This is NOT iOS Safari certification:
 * Linux WebKit is browser-engine evidence, never physical camera/audio/touch
 * or VoiceOver evidence. Do not change production learning state or gate logic.
 */
const root=process.cwd();
const engineName=process.env.MAINLAGI_P2_QA_ENGINE??"chromium";
const browserType={chromium,webkit}[engineName];
if(!browserType)throw new Error("P2 QA engine must be chromium or webkit");
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_P2_QA_PORT??(engineName==="webkit"?4067:4066));
const baseUrl="http://"+host+":"+port;
const outDir=path.join(root,".qa","p2-cross-browser",engineName);
const viewports=[
  {width:320,height:720},
  {width:390,height:844},
  {width:430,height:860},
  {width:768,height:1024},
  {width:1024,height:768},
  {width:1280,height:800},
  {width:1440,height:900}
];
const landscape={width:844,height:390};
const routes=[
  {name:"public",path:"/"},
  {name:"child-select",path:"/child/select"},
  {name:"child-home",path:"/child/demo-gian/home"},
  {name:"math-journey",path:"/child/demo-gian/subject/math"},
  {name:"math-activity",path:"/child/demo-gian/activity/math-count-3",activity:true},
  {name:"parent-report",path:"/parent/children/demo-gian/reports"},
  {name:"shop",path:"/shop"},
  {name:"device-checklist",path:"/qa/device",deviceChecklist:true}
];
const landscapeRoutes=new Set(["child-home","math-activity","parent-report","shop"]);
const screenshotWidths=new Set([320,390,768,1280]);

mkdirSync(outDir,{recursive:true});
let server=null;
let serverLog="";
function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  const onData=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",onData);server.stderr.on("data",onData);
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}
async function waitReady(){
  const start=Date.now();
  while(Date.now()-start<60000){
    try{const r=await fetch(baseUrl+"/");if(r.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,450));
  }
  throw new Error("P2 QA server not ready\n"+serverLog.slice(-2500));
}
async function measure(page){
  return page.evaluate(()=>{
    const heading=document.querySelector("h1");
    const main=document.querySelector("main");
    const h=heading?.getBoundingClientRect();
    const body=document.body;
    const viewportWidth=document.documentElement.clientWidth;
    const maxDocumentWidth=Math.max(document.documentElement.scrollWidth,body.scrollWidth);
    const bounds=main?.getBoundingClientRect();
    return {
      viewportWidth,
      maxDocumentWidth,
      heading:(heading?.textContent??"").trim().slice(0,130),
      headingVisible:!!h&&h.width>0&&h.height>0&&h.right>0&&h.left<viewportWidth,
      mainVisible:!!bounds&&bounds.width>0&&bounds.height>0,
      bodyTextLength:(body.innerText??"").trim().length,
      imagesMissingAlt:document.querySelectorAll("img:not([alt])").length,
      focusableControls:document.querySelectorAll("a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)").length,
      reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches,
      numChecklistStatusControls:document.querySelectorAll('select,[role="radiogroup"]').length
    };
  });
}
async function inspect(browser,route,viewport,isLandscape=false){
  const phone=viewport.width<=430||isLandscape;
  const context=await browser.newContext({
    viewport,
    isMobile:viewport.width<=430,
    hasTouch:phone||viewport.width===768||viewport.width===1024,
    deviceScaleFactor:viewport.width<=430?2:1,
    reducedMotion:"reduce"
  });
  const page=await context.newPage();
  const pageErrors=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  let state={engine:engineName,route:route.path,viewport,landscape:isLandscape,pass:false};
  try{
    const response=await page.goto(baseUrl+route.path,{waitUntil:"domcontentloaded",timeout:45000});
    state.httpStatus=response?.status()??0;
    await page.locator("main").first().waitFor({state:"visible",timeout:13000});
    await page.locator("h1").first().waitFor({state:"visible",timeout:13000});
    await page.evaluate(()=>document.fonts?.ready);
    await page.waitForTimeout(100);
    const metrics=await measure(page);
    state={...state,...metrics,pageErrors};
    const capture=screenshotWidths.has(viewport.width)||(isLandscape&&landscapeRoutes.has(route.name));
    if(capture){
      const file=route.name+"-"+viewport.width+"x"+viewport.height+".png";
      await page.screenshot({path:path.join(outDir,file),fullPage:true,timeout:30000});
      state.screenshot=file;
    }
    assert.equal(state.httpStatus,200,"HTTP is not 200");
    assert.equal(new URL(page.url()).pathname,route.path,"redirect masks route");
    assert(metrics.mainVisible,"main landmark is hidden");
    assert(metrics.headingVisible,"primary heading is hidden");
    assert(metrics.bodyTextLength>=25,"page is effectively empty");
    assert(metrics.maxDocumentWidth<=metrics.viewportWidth+1,
      "horizontal document overflow "+metrics.maxDocumentWidth+"/"+metrics.viewportWidth);
    assert(metrics.reducedMotion,"reduced motion preference not applied");
    assert.deepEqual(pageErrors,[],"uncaught script error(s)");
    if(route.activity){
      assert.equal(await page.locator('[data-activity-frame="garden"]').count(),1,"Garden activity scene missing");
      const actions=page.locator('[data-activity-frame="garden"] header a, [data-activity-frame="garden"] header button');
      const boxes=await actions.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{width:r.width,height:r.height};}));
      assert(boxes.length>=2,"missing Garden header navigation/audio actions");
      for(const rect of boxes)assert(rect.width>=44&&rect.height>=44,
        "primary activity header controls must have >=44px hit targets");
    }
    if(route.deviceChecklist){
      assert((await page.getByRole("heading",{name:"Physical Device QA"}).count())===1,
        "manual evidence harness missing");
    }
    state.pass=true;
  }catch(error){
    state.error=String(error?.message??error);
    if(!state.screenshot){
      try{const file=route.name+"-"+viewport.width+"x"+viewport.height+"-failed.png";
        await page.screenshot({path:path.join(outDir,file),fullPage:true,timeout:8000});state.screenshot=file;
      }catch{}
    }
  }finally{await context.close();}
  return state;
}
async function main(){
  startServer();
  await waitReady();
  const browser=await browserType.launch({headless:true});
  const results=[];
  try{
    for(const viewport of viewports){
      for(const route of routes){
        const result=await inspect(browser,route,viewport);
        results.push(result);
        if(!result.pass)console.error("P2 QA "+engineName+" FAIL "+route.name+" @ "+viewport.width+": "+result.error);
      }
    }
    for(const route of routes.filter(r=>landscapeRoutes.has(r.name))){
      const result=await inspect(browser,route,landscape,true);
      results.push(result);
      if(!result.pass)console.error("P2 QA "+engineName+" FAIL "+route.name+" @ 844x390: "+result.error);
    }
  }finally{await browser.close();}
  const failures=results.filter(x=>!x.pass);
  const manifest={
    generatedAt:new Date().toISOString(),
    engine:engineName,
    browserEnvironment:"headless Linux "+engineName+" (not physical Safari/iPhone/Android)",
    source:process.env.GITHUB_SHA??"local",
    testedRoutes:routes.map(x=>x.path),
    testedViewports:[...viewports,landscape],
    totalCases:results.length,passed:results.length-failures.length,failed:failures.length,
    screenshots:results.filter(x=>x.screenshot).length,
    results
  };
  writeFileSync(path.join(outDir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
  console.log("P2 "+engineName+" responsive QA: "+manifest.passed+"/"+manifest.totalCases+
    " cases, "+manifest.screenshots+" screenshots; failed="+failures.length);
  if(failures.length)throw new Error("P2 QA failures: "+failures.map(x=>x.route+" @ "+x.viewport.width+"x"+x.viewport.height+": "+x.error).join(" | "));
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-2500));process.exitCode=1;}).finally(stopServer);
