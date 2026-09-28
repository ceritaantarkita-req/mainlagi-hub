import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_MATH_TRACE_QA_PORT??4037);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/math-trace-5-touch";
const activityId="math-trace-5-touch";
const screenshotDir=path.join(root,".mobile-route-qa");
const checkpoints=[[76,17],[61,17],[46,17],[32,19],[31,33],[31,47],[44,45],[59,46],[69,54],[71,66],[65,77],[53,83],[39,82],[29,75]];
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
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

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`MathTrace QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function drawCanonicalFive(page){
  const trace=page.getByLabel("Area untuk menelusuri angka lima",{exact:true});
  await trace.waitFor({state:"visible",timeout:5000});
  const bounds=await trace.boundingBox();
  assert(bounds,"MathTrace board must have bounds");
  const xy=([x,y])=>({x:bounds.x+x*bounds.width/100,y:bounds.y+y*bounds.height/100});
  const first=xy(checkpoints[0]);
  await page.mouse.move(first.x,first.y);
  await page.mouse.down();
  for(const point of checkpoints.slice(1)){
    const p=xy(point);
    await page.mouse.move(p.x,p.y,{steps:12});
  }
  await page.mouse.up();
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce"});
    await context.addInitScript(()=>{
      localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({"demo-gian":{completedActivityIds:[],stars:0}}));
      localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({"demo-gian":[]}));
    });
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`MathTrace bad HTTP at ${viewport.width}`);
    await page.getByLabel("Area untuk menelusuri angka lima",{exact:true}).waitFor({state:"visible",timeout:5000});
    assert.equal(await page.locator('[aria-label="0% trace selesai"]').count(),1,"MathTrace starts at zero progress");

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-math-trace-idle.png`),fullPage:false});

    await drawCanonicalFive(page);
    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:3000});
    const completionBox=await completion.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(completionBox,"MathTrace canonical Completion must render");
    assert(completionBox.y>=-1&&completionBox.y+completionBox.height<=viewportHeight+1,`MathTrace Completion must remain visible at ${viewport.width}`);

    await page.waitForFunction(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return (attempts["demo-gian"]??[]).some(item=>item.activityId===id);
    },{id:activityId},{timeout:3000});

    const state=await page.evaluate(({id})=>{
      const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=(attempts["demo-gian"]??[]).filter(item=>item.activityId===id);
      return{
        completed:(progress["demo-gian"]?.completedActivityIds??[]).includes(id),
        attempts:list,
        attempt:list.at(-1)
      };
    },{id:activityId});

    assert.equal(state.completed,true,"MathTrace writes canonical progress");
    assert.equal(state.attempts.length,1,"MathTrace writes exactly one target attempt on first completion");
    assert(state.attempt,"MathTrace writes explicit attempt evidence");
    assert.equal(state.attempt.assessed,true);
    assert.equal(state.attempt.metadata?.source,"guided-trace-evaluator");
    assert.equal(state.attempt.metadata?.evidenceFidelity,"guided_trace_path_score");
    assert.equal(state.attempt.metadata?.digit,5);
    assert.equal(state.attempt.correctCount,1);
    assert.equal(state.attempt.retryCount,0);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-math-trace-success.png`),fullPage:false});

    await page.evaluate(()=>{window.__si06d2ReplayMarker="alive";});
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:2000});
    assert.equal(await page.evaluate(()=>window.__si06d2ReplayMarker),"alive","MathTrace Again must reset locally without reload");
    assert.equal(await page.locator('[aria-label="0% trace selesai"]').count(),1,"MathTrace Again resets checkpoint progress");
    assert.equal(await page.getByLabel("Area untuk menelusuri angka lima",{exact:true}).locator("polyline").getAttribute("points"),"","MathTrace Again clears visible stroke points");
    const targetAttemptCount=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return(attempts["demo-gian"]??[]).filter(item=>item.activityId===id).length;
    },{id:activityId});
    assert.equal(targetAttemptCount,1,"MathTrace Again reset alone must not create a second attempt");

    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  console.log(`SI-06D2 MathTrace browser QA passed ${viewports.length} viewports with guided pointer completion, canonical Completion, explicit guided-trace evidence, local Again reset, no reload, and no duplicate target attempt.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
