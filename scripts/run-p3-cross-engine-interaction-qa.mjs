import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium, webkit } from "playwright";

/**
 * P3: cross-engine interaction QA, not a replacement for physical iPhone Safari
 * or Android Chrome, child observation, VoiceOver/TalkBack, audio or camera QA.
 * All state is isolated in a fresh local browser context. No production writes.
 */
const root=process.cwd();
const engine=process.env.MAINLAGI_P3_ENGINE??"chromium";
const browserType={chromium,webkit}[engine];
if(!browserType)throw new Error("MAINLAGI_P3_ENGINE must be chromium or webkit");
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_P3_PORT??(engine==="webkit"?4085:4084));
const baseUrl="http://"+host+":"+port;
const outDir=path.join(root,".qa","p3-interaction",engine);
const viewports=[{width:390,height:844},{width:768,height:1024}];
const rotated={width:844,height:390};
const childId="demo-gian";
const englishId="english-find-blue";
const mathId="math-subitize-4";
const routes={
  choice:"/child/demo-gian/activity/"+englishId,
  subitizing:"/child/demo-gian/activity/"+mathId,
  harness:"/qa/device"
};
mkdirSync(outDir,{recursive:true});
let server=null,serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  const receive=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",receive);server.stderr.on("data",receive);
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}
async function waitServer(){
  const start=Date.now();
  while(Date.now()-start<60000){
    try{const r=await fetch(baseUrl+"/");if(r.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("P3 production server unavailable: "+serverLog.slice(-3500));
}
async function contextFor(browser,viewport,withMathPrerequisite=false){
  const context=await browser.newContext({
    viewport,reducedMotion:"reduce",hasTouch:true,isMobile:viewport.width<=430,
    deviceScaleFactor:viewport.width<=430?2:1
  });
  if(withMathPrerequisite){
    // Valid stage-readiness fixture copied from the canonical VSG-16 browser
    // regression; we do NOT bypass production stage locks via a global flag.
    await context.addInitScript(()=>{
      const child="demo-gian",prerequisiteId="math-pattern-touch";
      const completedAt="2026-09-18T02:00:00.000Z";
      const attemptId="p3-subitizing-prereq-0";
      localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
        [child]:{completedActivityIds:[prerequisiteId],stars:0,lastActivityId:prerequisiteId}
      }));
      localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({
        [child]:[{
          id:attemptId,childId:child,activityId:prerequisiteId,subjectId:"math",
          stageId:"math-pola",runtime:"matching",difficulty:2,status:"completed",
          assessed:true,score:1,accuracy:1,correctCount:2,incorrectCount:0,
          hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",
          startedAt:completedAt,completedAt,
          metadata:{source:"p3-legitimate-math-prerequisite"},
          evidence:[{attemptId,activityId:prerequisiteId,skillId:"math.pattern.matching",
            score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],
          masteryEligible:true
        }]
      }));
    });
  }
  return context;
}
async function readAttempts(page,id){
  return page.evaluate(key=>{
    const all=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return(all["demo-gian"]??[]).filter(item=>item.activityId===key);
  },id);
}
async function waitAttempt(page,id,count){
  await page.waitForFunction(({key,target})=>{
    const all=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return(all["demo-gian"]??[]).filter(item=>item.activityId===key).length===target;
  },{key:id,target:count},{timeout:7000});
}
async function completed(page,id){
  return page.evaluate(key=>{
    const all=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(all["demo-gian"]?.completedActivityIds??[]).includes(key);
  },id);
}
async function waitBridge(page){
  await page.waitForFunction(()=>
    document.documentElement.dataset.mainlagiAttemptBridgeReady==="demo-gian",
    undefined,{timeout:12000}
  );
}
async function screenshot(page,name){
  const file=name+".png";
  await page.screenshot({path:path.join(outDir,file),fullPage:true,timeout:25000});
  return file;
}
async function assertNoOverflow(page,label){
  const d=await page.evaluate(()=>({
    client:document.documentElement.clientWidth,
    scroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)
  }));
  assert(d.scroll<=d.client+1,label+" document overflow: "+JSON.stringify(d));
}
async function assertControlsVisible(page,locator,label){
  const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
  const rects=await locator.evaluateAll(nodes=>nodes.map(node=>{
    const r=node.getBoundingClientRect();
    return{x:r.x,right:r.right,width:r.width,height:r.height};
  }));
  assert(rects.length>=2,label+" controls missing");
  for(const r of rects){
    assert(r.width>=44&&r.height>=44,label+" control smaller than 44px "+JSON.stringify(r));
    assert(r.x>=-1&&r.right<=viewportWidth+1,label+" control horizontally clipped "+JSON.stringify(r));
  }
}
async function assertCompletion(page){
  const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
  await completion.waitFor({state:"visible",timeout:7000});
  assert.equal(await completion.getAttribute("data-completion-context"),"belajar");
  assert.equal(await completion.getAttribute("data-completion-stars"),"3");
  assert.deepEqual(
    await completion.locator("[data-completion-action]").evaluateAll(nodes=>
      nodes.map(node=>node.textContent?.trim())),
    ["Back","Again","Next","Share"]
  );
  return completion;
}
async function assertShareNoDuplicate(page,completion,id){
  await completion.locator('[data-completion-action="share"]').click();
  const share=page.locator('[data-canonical-share="v1"]');
  await share.waitFor({state:"visible",timeout:6000});
  await page.waitForFunction(()=>
    document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate")==="allowed",
    undefined,{timeout:6000});
  assert.equal(await share.getAttribute("data-share-public-path"),"/");
  assert.equal((await readAttempts(page,id)).length,1,"Share duplicated canonical attempt");
  await share.getByRole("button",{name:"Tutup"}).click();
}
async function rotateAndRestore(page,completion,id,viewport){
  await page.evaluate(()=>{window.__p3SameDocument="live";});
  await page.setViewportSize(rotated);
  await page.waitForTimeout(130);
  assert.equal(await page.evaluate(()=>window.__p3SameDocument),"live","rotation reloads document");
  assert(await completion.isVisible(),"completion lost on rotation");
  await assertNoOverflow(page,"landscape completion");
  assert.equal((await readAttempts(page,id)).length,1,"rotation duplicates attempt");
  const evidence=await screenshot(page,id+"-"+viewport.width+"-landscape");
  await page.setViewportSize(viewport);
  return evidence;
}
function assertAttempt(attempt,{id,source,incorrect=1}){
  assert(attempt,"no canonical attempt persisted for "+id);
  assert.equal(attempt.activityId,id);
  assert.equal(attempt.assessed,true,"assessment must be canonical");
  assert.equal(attempt.correctCount,1,"one correct answer");
  assert.equal(attempt.incorrectCount,incorrect,"wrong interaction must not be lost");
  assert.equal(attempt.retryCount,incorrect,"retry evidence must match wrong taps");
  assert.equal(attempt.accuracy,1/(1+incorrect),"do not manufacture mastery");
  assert.equal(attempt.metadata?.source,source,"unexpected runtime evidence source");
}
async function inspectEnglish(browser,viewport){
  const context=await contextFor(browser,viewport);
  const page=await context.newPage();
  const errors=[],captures=[];
  page.on("pageerror",error=>errors.push(error.message));
  try{
    const response=await page.goto(baseUrl+routes.choice,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(response?.status(),200);
    await waitBridge(page);
    const choices=page.locator("[data-choices] button");
    await choices.first().waitFor({state:"visible",timeout:10000});
    assert.equal(new URL(page.url()).pathname,routes.choice,"stage gate redirected English");
    assert.equal(await page.locator("[data-choices] button").count(),3);
    await assertControlsVisible(page,choices,"English choice");
    assert.equal(await completed(page,englishId),false);
    captures.push(await screenshot(page,"english-"+viewport.width+"-idle"));

    const wrong=page.getByRole("button",{name:"🔴",exact:true});
    if(viewport.width===390)await wrong.tap();else await wrong.click();
    await page.getByRole("status").filter({hasText:"Try another one!"}).waitFor({state:"visible",timeout:6000});
    assert.equal((await readAttempts(page,englishId)).length,0,"wrong answer must not complete");
    captures.push(await screenshot(page,"english-"+viewport.width+"-wrong"));

    const correct=page.getByRole("button",{name:"🔵",exact:true});
    await correct.focus();
    assert(await correct.evaluate(node=>document.activeElement===node),
      "correct English control not keyboard focusable");
    await page.keyboard.press("Enter");
    const completion=await assertCompletion(page);
    await waitAttempt(page,englishId,1);
    const attempts=await readAttempts(page,englishId);
    assert.equal(attempts.length,1);
    assertAttempt(attempts[0],{id:englishId,source:"runtime-evidence-bridge"});
    assert.equal(await completed(page,englishId),true);
    captures.push(await screenshot(page,"english-"+viewport.width+"-complete"));

    captures.push(await rotateAndRestore(page,completion,englishId,viewport));
    await assertShareNoDuplicate(page,completion,englishId);
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:5000});
    assert(await correct.isEnabled(),"Again didn't reenable answer");
    assert.equal((await readAttempts(page,englishId)).length,1,"Again must not create duplicate");
    assert.equal(errors.length,0,"English page JS exceptions: "+errors.join(" | "));
    await assertNoOverflow(page,"English complete/replay");
    captures.push(await screenshot(page,"english-"+viewport.width+"-again"));
    return{case:"english-choice",viewport,pass:true,screenshots:captures,
      attempt:{correct:attempts[0].correctCount,incorrect:attempts[0].incorrectCount,retry:attempts[0].retryCount,accuracy:attempts[0].accuracy}};
  }catch(error){
    try{await screenshot(page,"p3-failure-"+engine+"-"+viewport.width+"-"+Date.now());}catch{}
    throw error;
  }finally{await context.close();}
}
async function inspectSubitizing(browser,viewport){
  const context=await contextFor(browser,viewport,true);
  const page=await context.newPage();
  const errors=[],captures=[];
  page.on("pageerror",error=>errors.push(error.message));
  try{
    const response=await page.goto(baseUrl+routes.subitizing,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(response?.status(),200);
    await waitBridge(page);
    await page.waitForFunction(()=>
      document.querySelector("[data-subitizing-glance]")?.getAttribute("data-subitizing-glance-ready")==="true",
      undefined,{timeout:10000});
    const scene=page.locator('[data-subitizing-glance][data-child-visual-hierarchy="subitizing-vsg16"]');
    assert.equal(new URL(page.url()).pathname,routes.subitizing,"stage gate redirected Math");
    assert.equal(await scene.getAttribute("data-pattern-mode"),"square");
    assert.deepEqual(
      await scene.locator('[data-subitizing-dot="true"]').evaluateAll(nodes=>
        nodes.map(node=>Number(node.getAttribute("data-cell-index"))).sort((a,b)=>a-b)),
      [0,2,6,8],"pattern stimulus changed"
    );
    const choices=scene.locator("[data-subitizing-choice]");
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),
      ["Pilih jumlah 3","Pilih jumlah 4","Pilih jumlah 5"]);
    await assertControlsVisible(page,choices,"Subitizing");
    const help=page.getByRole("button",{name:"Cara main"});
    await help.click();
    const initialHelp=await page.locator("[data-subitizing-help]").innerText();
    assert.equal(initialHelp,"Lihat seluruh pola titik, lalu pilih angka yang cocok.",
      "help reveals answer before child's first try");
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal((await readAttempts(page,mathId)).length,0);
    captures.push(await screenshot(page,"subitizing-"+viewport.width+"-idle"));

    const wrong=page.getByRole("button",{name:"Pilih jumlah 3"});
    await wrong.focus();
    assert(await wrong.evaluate(node=>document.activeElement===node),"subitizing cannot keyboard focus wrong choice");
    await page.keyboard.press("Enter");
    const feedback=scene.getByRole("status");
    await feedback.filter({hasText:"Belum tepat. Coba lagi!"}).waitFor({state:"visible",timeout:6000});
    await page.getByRole("button",{name:"Cara main"}).click();
    assert.equal(await page.locator("[data-subitizing-help]").innerText(),
      "Lihat empat sudutnya sebagai satu bentuk persegi.","post-wrong canonical cue absent");
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal((await readAttempts(page,mathId)).length,0,"wrong answer cannot create attempt");
    assert.equal(await completed(page,mathId),false,"wrong answer cannot complete");
    captures.push(await screenshot(page,"subitizing-"+viewport.width+"-wrong"));

    // The success path must collapse supplementary help while preserving dots.
    await page.getByRole("button",{name:"Cara main"}).click();
    const correct=page.getByRole("button",{name:"Pilih jumlah 4"});
    if(viewport.width===390)await correct.tap();else await correct.click();
    const completion=await assertCompletion(page);
    await waitAttempt(page,mathId,1);
    const attempts=await readAttempts(page,mathId);
    assertAttempt(attempts[0],{id:mathId,source:"subitizing-glance-runtime"});
    assert.equal(attempts[0].metadata?.patternMode,"square");
    assert.equal(attempts[0].metadata?.visibleDotCount,4);
    assert.equal(attempts[0].metadata?.selectedChoice,"4");
    assert.equal(await completed(page,mathId),true);
    assert.equal(await page.locator("[data-subitizing-help]").count(),0);
    assert.equal(await scene.locator('[data-subitizing-dot="true"]').count(),4);
    captures.push(await screenshot(page,"subitizing-"+viewport.width+"-complete"));

    captures.push(await rotateAndRestore(page,completion,mathId,viewport));
    await assertShareNoDuplicate(page,completion,mathId);
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:5000});
    assert(await choices.evaluateAll(nodes=>nodes.every(node=>!node.disabled)),"Again failed");
    assert.equal((await readAttempts(page,mathId)).length,1,"Again duplicates attempt");
    assert.equal(errors.length,0,"Subitizing page JS exceptions: "+errors.join(" | "));
    await assertNoOverflow(page,"Subitizing complete/replay");
    captures.push(await screenshot(page,"subitizing-"+viewport.width+"-again"));
    return{case:"subitizing",viewport,pass:true,screenshots:captures,
      attempt:{correct:attempts[0].correctCount,incorrect:attempts[0].incorrectCount,retry:attempts[0].retryCount,accuracy:attempts[0].accuracy}};
  }catch(error){
    try{await screenshot(page,"p3-failure-"+engine+"-"+viewport.width+"-"+Date.now());}catch{}
    throw error;
  }finally{await context.close();}
}
async function inspectHarness(browser,viewport){
  const context=await contextFor(browser,viewport);
  const page=await context.newPage();
  const errors=[],captures=[];
  page.on("pageerror",error=>errors.push(error.message));
  try{
    const response=await page.goto(baseUrl+routes.harness,{waitUntil:"domcontentloaded",timeout:35000});
    assert.equal(response?.status(),200);
    const controls=page.locator('[data-mainlagi-route-boundary="device-qa"] select');
    await page.waitForFunction(()=>
      document.querySelectorAll('[data-mainlagi-route-boundary="device-qa"] select').length===22,
      undefined,{timeout:10000});
    assert.equal(await controls.count(),22);
    assert((await controls.evaluateAll(nodes=>nodes.every(x=>x.value==="PENDING"))),
      "new QA session falsely certifies physical checks");
    await assertControlsVisible(page,controls,"physical QA status");
    captures.push(await screenshot(page,"harness-"+viewport.width+"-pending"));

    const first=controls.first();
    await first.focus();
    assert(await first.evaluate(node=>document.activeElement===node),"QA status not keyboard focusable");
    await first.selectOption("FAIL");
    await page.waitForFunction(()=>localStorage.getItem("mainlagi:physical-device-qa:v1")?.includes('"status":"FAIL"'),
      undefined,{timeout:5000});
    await page.reload({waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>document.querySelectorAll('[data-mainlagi-route-boundary="device-qa"] select').length===22,
      undefined,{timeout:10000});
    await page.waitForFunction(()=>document.querySelector('[data-mainlagi-route-boundary="device-qa"] select')?.value==="FAIL",
      undefined,{timeout:5000});
    const resumed=page.locator('[data-mainlagi-route-boundary="device-qa"] select');
    assert.equal(await resumed.first().inputValue(),"FAIL","QA status lost on reload");
    assert.equal(await resumed.nth(1).inputValue(),"PENDING","other statuses incorrectly changed");
    captures.push(await screenshot(page,"harness-"+viewport.width+"-persisted"));

    await page.getByRole("button",{name:"Reset results"}).click();
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-mainlagi-route-boundary="device-qa"] select')).every(node=>node.value==="PENDING"),
      undefined,{timeout:5000});
    assert.equal(await resumed.count(),22);
    assert.equal(errors.length,0,"device QA JS errors: "+errors.join(" | "));
    await assertNoOverflow(page,"device evidence harness");
    captures.push(await screenshot(page,"harness-"+viewport.width+"-reset"));
    return{case:"device-evidence-harness",viewport,pass:true,screenshots:captures,
      note:"Automation tested FAIL/persistence/reset only. No physical-device PASS was issued."};
  }catch(error){
    try{await screenshot(page,"p3-failure-"+engine+"-"+viewport.width+"-"+Date.now());}catch{}
    throw error;
  }finally{await context.close();}
}
async function main(){
  startServer();await waitServer();
  const browser=await browserType.launch({headless:true});
  const results=[];
  const funcs=[inspectEnglish,inspectSubitizing,inspectHarness];
  try{
    for(const viewport of viewports){
      for(const run of funcs){
        try{
          const result=await run(browser,viewport);
          results.push(result);
          console.log("P3 "+engine+" PASS "+result.case+" @ "+viewport.width);
        }catch(error){
          const detail=String(error?.stack??error);
          results.push({case:run.name,viewport,pass:false,error:detail});
          console.error("P3 "+engine+" FAIL "+run.name+" @ "+viewport.width+": "+detail);
        }
      }
    }
  }finally{await browser.close();}
  const failed=results.filter(x=>!x.pass);
  const manifest={
    generatedAt:new Date().toISOString(),
    browserEnvironment:"headless Linux "+engine+" (NOT physical iPhone Safari/Android Chrome)",
    engine,source:process.env.GITHUB_SHA??"local",total:results.length,
    passed:results.length-failed.length,failed:failed.length,
    screenshots:results.flatMap(x=>x.screenshots??[]).length,results
  };
  writeFileSync(path.join(outDir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
  console.log("P3 "+engine+" interactive QA: "+manifest.passed+"/"+manifest.total+
    " workflows; "+manifest.screenshots+" screenshots; failures="+manifest.failed);
  if(failed.length)throw new Error("P3 cross-engine interaction gate FAILED: "+
    failed.map(x=>x.case+" at "+x.viewport.width+": "+x.error).join(" | ").slice(0,5000));
}
main().catch(e=>{console.error(e);console.error(serverLog.slice(-2200));process.exitCode=1;}).finally(stopServer);
