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

async function installQaState(context, speechMode="normal"){
  await context.addInitScript((speechMode)=>{
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

    const voices=speechMode==="unavailable" ? [] : [
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
        if(speechMode==="error"){
          setTimeout(()=>{
            if(this.current!==utterance)return;
            this.current=null;this.speaking=false;utterance.emit("error");
          },8);
          return;
        }
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
  },speechMode);
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
    assert.equal(await page.locator('[data-choices] button:not([disabled])').count(),0,
      "direct AudioChoice entry must not expose playable answers before speech");
    await page.screenshot({path:path.join(outDir,"390-idle-before-audio.png"),fullPage:false});
    await page.getByRole("button",{name:"Dengar petunjuk"}).click();

    const choices=page.locator("[data-choices] button");
    await page.waitForFunction(()=>Array.from(document.querySelectorAll("[data-choices] button")).every(button=>!button.disabled),null,{timeout:5000});
    assert.equal(await choices.count(),3,"AudioChoice must keep three canonical choices");
    assert.equal((await targetAttempts(page)).length,0,"AudioChoice starts without target attempt");

    await choices.filter({hasText:"🔴"}).click();
    await page.getByText("Belum tepat. Dengarkan lagi atau coba pilihan lain ya.").waitFor({state:"visible",timeout:3000});
    assert.equal((await targetAttempts(page)).length,0,"wrong AudioChoice answer must not complete");
    await page.screenshot({path:path.join(outDir,"390-wrong-feedback.png"),fullPage:false});

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

    // Real iPhone Chrome emulation report 13 Oct 2026: generic Garden
    // spacious mode used 110px desktop titles, busy-image text, 190px choice
    // offsets and massive empty space. Check real DOM geometry across forms.
    for (const viewport of [
      { width: 320, height: 720 }, { width: 390, height: 844 },
      { width: 430, height: 860 }, { width: 768, height: 1024 },
      { width: 844, height: 390 }, { width: 1280, height: 800 }, { width: 1440, height: 900 }
    ]) {
      const sceneContext=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width<=430});
      try {
        await installQaState(sceneContext);
        const scenePage=await sceneContext.newPage();
        const response=await scenePage.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
        assert(response&&response.status()<400,"AudioChoice QA route loads");
        const geometry=await scenePage.evaluate(()=>{
          const frame=document.querySelector('[data-activity-frame="garden"]');
          const stage=document.querySelector('[data-activity-presentation="audio-focus-v1"] [data-character-safe-content]');
          const title=stage?.querySelector("h1");
          const choices=stage?.querySelector("[data-choices]");
          const hint=stage?.lastElementChild;
          const header=frame?.querySelector("header");
          if(!frame||!stage||!title||!choices||!hint||!header)return null;
          const r=element=>element.getBoundingClientRect();
          const stageRect=r(stage),titleRect=r(title),choicesRect=r(choices);
          return {
            stageColor:getComputedStyle(stage).backgroundColor,
            titleSize:parseFloat(getComputedStyle(title).fontSize),
            titleText:title.textContent?.trim(),
            headerBottom:r(header).bottom,
            stageTop:stageRect.top,
            titleTop:titleRect.top,
            titleBottom:titleRect.bottom,
            choicesTop:choicesRect.top,
            choicesBottom:choicesRect.bottom,
            hintTop:r(hint).top,
            stageBottom:stageRect.bottom,
            maxButtonBottom:Math.max(...[...choices.querySelectorAll("button")].map(b=>r(b).bottom)),
            buttonCount:choices.querySelectorAll("button").length,
            overflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
            scrollHeight:document.documentElement.scrollHeight
          };
        });
        assert.ok(geometry,"AudioChoice stage geometry exists: "+JSON.stringify(viewport));
        assert.equal(geometry.titleText,"Listen, then choose the best answer.","visible instructions must remain answer-free");
        assert.match(geometry.stageColor,/rgba?\(255,\s*252,\s*240/, "audio panel needs opaque cream background");
        assert.ok(geometry.titleSize <= 46,"audio instruction text must not be oversized");
        assert.equal(geometry.buttonCount,3,"audio must preserve the three answer buttons");
        assert.ok(geometry.stageTop > geometry.headerBottom-3,"content must not collide with back/listen navigation");
        assert.ok(geometry.choicesTop >= geometry.titleBottom-1,"answers start after legible title");
        assert.ok(geometry.maxButtonBottom <= geometry.stageBottom+2,"all choices stay inside paper panel");
        assert.ok(geometry.hintTop >= geometry.choicesBottom-2,"hint must come after answers");
        assert.ok(geometry.overflowX <= 2,"no horizontal overflow at "+viewport.width+"px");
        assert.equal(await scenePage.locator('[data-choices] button:not([disabled])').count(),0,
          `AudioChoice ${viewport.width}px: first action must not bypass speech readiness`);
        await scenePage.screenshot({path:path.join(outDir,`audio-legibility-${viewport.width}x${viewport.height}.png`),fullPage:false});
        await scenePage.getByRole("button",{name:"Dengar petunjuk"}).click();
        await scenePage.waitForFunction(()=>[...document.querySelectorAll('[data-choices] button')].length===3 &&
          [...document.querySelectorAll('[data-choices] button')].every(button=>!button.disabled),null,{timeout:5000});
        await scenePage.screenshot({path:path.join(outDir,`audio-spoken-${viewport.width}x${viewport.height}.png`),fullPage:false});
      }finally{await sceneContext.close();}
    }

    // VQA-06: isolated device states must not bypass audio readiness.
    for (const speechMode of ["unavailable","error"]) {
      for (const viewport of [{width:320,height:720},{width:390,height:844}]) {
        const fallbackContext=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true});
        try {
          await installQaState(fallbackContext,speechMode);
          const fallbackPage=await fallbackContext.newPage();
          const response=await fallbackPage.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
          assert(response&&response.status()<400,`AudioChoice ${speechMode} route must load`);
          await fallbackPage.getByRole("button",{name:"Dengar petunjuk"}).click();
          const text=speechMode==="unavailable"?"Narasi dengan pelafalan":"Suara belum bisa diputar";
          await fallbackPage.getByRole("status").filter({hasText:text}).waitFor({state:"visible",timeout:5000});
          assert.equal(await fallbackPage.locator('[data-choices] button:not([disabled])').count(),0,
            `${speechMode} must not unlock audio-dependent answers at ${viewport.width}px`);
          assert.equal(await fallbackPage.getByRole("link",{name:"Pilih permainan lain"}).count(),1,
            `${speechMode} must offer a safe exit at ${viewport.width}px`);
          assert.equal((await targetAttempts(fallbackPage)).length,0,
            `${speechMode} must not emit an assessed attempt`);
          await assertNoOverflow(fallbackPage,`AudioChoice ${speechMode} ${viewport.width}px`);
          await fallbackPage.screenshot({path:path.join(outDir,`audio-${speechMode}-${viewport.width}.png`),fullPage:false});
        } finally { await fallbackContext.close(); }
      }
    }

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
