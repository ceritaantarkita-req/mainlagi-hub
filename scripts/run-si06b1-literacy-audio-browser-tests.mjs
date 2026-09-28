import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SI06B1_QA_PORT??4069);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/english-find-blue-audio";
const activityId="english-find-blue-audio";
const portrait={width:390,height:844};
const landscape={width:844,height:390};
const outDir=path.resolve(".mobile-route-qa/si06b1-literacy-audio");
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
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`SI-06B1 QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function installQaState(context){
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({"demo-gian":[]}));
    window.__si06b1DocumentMarker="si06b1-document";

    class QaSpeechUtterance{
      constructor(text){
        this.text=text;this.lang="";this.pitch=1;this.rate=1;this.volume=1;this.voice=null;this.listeners=new Map();
      }
      addEventListener(type,listener){
        const list=this.listeners.get(type)??[];
        list.push(listener);
        this.listeners.set(type,list);
      }
      emit(type){for(const listener of this.listeners.get(type)??[])listener();}
    }

    const voices=[
      {default:false,lang:"en-US",localService:true,name:"QA English",voiceURI:"qa-en"},
      {default:true,lang:"id-ID",localService:true,name:"QA Indonesia",voiceURI:"qa-id"}
    ];
    const qaSynth={
      speaking:false,pending:false,current:null,
      getVoices(){return voices;},
      addEventListener(){},
      cancel(){this.current=null;this.speaking=false;this.pending=false;},
      speak(utterance){
        this.current=utterance;
        this.speaking=true;
        setTimeout(()=>{if(this.current===utterance)utterance.emit("start");},8);
        setTimeout(()=>{
          if(this.current!==utterance)return;
          this.current=null;
          this.speaking=false;
          utterance.emit("end");
        },36);
      }
    };

    Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:QaSpeechUtterance});
    Object.defineProperty(window,"speechSynthesis",{configurable:true,value:qaSynth});
  });
}

async function targetAttempts(page){
  return page.evaluate(({id})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return (state["demo-gian"]??[]).filter(item=>item.activityId===id);
  },{id:activityId});
}

async function waitForAttemptCount(page,count){
  await page.waitForFunction(({id,expected})=>{
    const state=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return (state["demo-gian"]??[]).filter(item=>item.activityId===id).length===expected;
  },{id:activityId,expected:count},{timeout:5000});
}

async function assertNoOverflow(page,label){
  const metrics=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    html:document.documentElement.scrollWidth,
    body:document.body.scrollWidth
  }));
  assert(metrics.html<=metrics.viewport+1&&metrics.body<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}

async function main(){
  mkdirSync(outDir,{recursive:true});
  startServer();
  await waitForServer();

  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:portrait,reducedMotion:"reduce",hasTouch:true});
  await installQaState(context);
  const page=await context.newPage();
  const pageErrors=[];
  const consoleErrors=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

  try{
    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"AudioChoice production route must load");
    await page.getByRole("button",{name:"Dengar petunjuk"}).click();

    const choices=page.locator("[data-choices] button");
    await page.waitForFunction(()=>Array.from(document.querySelectorAll("[data-choices] button")).every(button=>!button.disabled),null,{timeout:5000});
    assert.equal(await choices.count(),3,"AudioChoice must keep three canonical choices");
    assert.equal((await targetAttempts(page)).length,0,"AudioChoice starts without target attempt");

    await choices.filter({hasText:"🔴"}).click();
    await page.getByText("Belum tepat. Dengarkan lagi atau coba pilihan lain ya.").waitFor({state:"visible",timeout:3000});
    assert.equal((await targetAttempts(page)).length,0,"wrong AudioChoice answer must not complete");

    await choices.filter({hasText:"🔵"}).click();
    const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({state:"visible",timeout:5000});
    await waitForAttemptCount(page,1);

    assert.deepEqual(
      await completion.locator("[data-completion-action]").evaluateAll(nodes=>nodes.map(node=>node.textContent?.trim())),
      ["Back","Again","Next","Share"],
      "AudioChoice must use canonical Completion action order"
    );

    let attempts=await targetAttempts(page);
    assert.equal(attempts.length,1,"AudioChoice success writes exactly one attempt");
    assert.equal(attempts[0].assessed,true,"AudioChoice remains assessed");
    assert.equal(attempts[0].metadata?.source,"runtime-evidence-bridge");
    assert.equal(attempts[0].metadata?.evidenceFidelity,"choice_interaction");
    assert.equal(attempts[0].correctCount,1);
    assert.equal(attempts[0].incorrectCount,1);
    assert.equal(attempts[0].retryCount,1);
    assert.equal(attempts[0].accuracy,0.5);

    await assertNoOverflow(page,"AudioChoice portrait completion");
    await page.screenshot({path:path.join(outDir,"390-completion.png"),fullPage:false});

    await completion.locator('[data-completion-action="share"]').click();
    const share=page.locator('[data-canonical-share="v1"]');
    await share.waitFor({state:"visible",timeout:5000});
    await page.waitForFunction(()=>document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate")==="allowed",null,{timeout:5000});
    assert.equal(await share.getAttribute("data-share-public-path"),"/","AudioChoice Share remains public-safe Belajar origin");
    assert.equal((await targetAttempts(page)).length,1,"opening Share must not duplicate AudioChoice attempt");

    await page.setViewportSize(landscape);
    await page.waitForFunction(()=>document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation")==="landscape",null,{timeout:5000});
    assert.equal(await page.evaluate(()=>window.__si06b1DocumentMarker),"si06b1-document","rotation must not reload AudioChoice document");
    assert.equal(await share.evaluate(node=>node.open),true,"Share stays open through AudioChoice rotation");
    assert.equal(await completion.isVisible(),true,"Completion stays mounted behind Share");
    assert.equal((await targetAttempts(page)).length,1,"rotation must not duplicate AudioChoice attempt");
    await assertNoOverflow(page,"AudioChoice landscape Share");
    await page.screenshot({path:path.join(outDir,"844x390-share.png"),fullPage:false});

    await share.getByRole("button",{name:"Tutup"}).click();
    await page.setViewportSize(portrait);
    await page.waitForFunction(()=>document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation")==="portrait",null,{timeout:5000});

    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    await page.waitForFunction(()=>Array.from(document.querySelectorAll("[data-choices] button")).every(button=>!button.disabled),null,{timeout:5000});
    assert.equal((await targetAttempts(page)).length,1,"Again reset alone must not create a second AudioChoice attempt");

    await page.screenshot({path:path.join(outDir,"390-again-reset.png"),fullPage:false});
    assert.deepEqual(pageErrors,[],`SI-06B1 page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`SI-06B1 console errors: ${consoleErrors.join(" | ")}`);

    console.log("SI-06B1 AudioChoice browser QA PASS: canonical Completion+Share, assessed choice evidence, orientation persistence and Again duplicate-attempt safety are preserved.");
  }finally{
    await context.close();
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
