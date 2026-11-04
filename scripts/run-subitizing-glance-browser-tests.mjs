import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SUBITIZING_GLANCE_QA_PORT??4044);
const baseUrl="http://"+host+":"+port;
const route="/child/demo-gian/activity/math-subitize-4";
const activityId="math-subitize-4";
const correctLabel="Pilih jumlah 4";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vsg16-subitizing");
const viewports=[{width:320,height:720},{width:390,height:844},{width:430,height:860},{width:768,height:1024},{width:1280,height:800}];
async function captureEvidence(page,filename){
  mkdirSync(screenshotDir,{recursive:true});
  mkdirSync(evidenceDir,{recursive:true});
  const png=await page.screenshot({fullPage:true});
  writeFileSync(path.join(screenshotDir,filename),png);
  writeFileSync(path.join(evidenceDir,filename),png);
}
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

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Subitizing-glance QA server did not become ready.\n"+serverLog.slice(-4000));
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const prerequisiteId="math-pattern-touch";
    const completedAt="2026-09-18T02:00:00.000Z";
    const attemptId="qa-subitizing-prereq-0";

    localStorage.setItem(progressKey,JSON.stringify({
      [childId]:{completedActivityIds:[prerequisiteId],stars:0,lastActivityId:prerequisiteId}
    }));

    localStorage.setItem(attemptsKey,JSON.stringify({
      [childId]:[{
        id:attemptId,
        childId,
        activityId:prerequisiteId,
        subjectId:"math",
        stageId:"math-pola",
        runtime:"matching",
        difficulty:2,
        status:"completed",
        assessed:true,
        score:1,
        accuracy:1,
        correctCount:2,
        incorrectCount:0,
        hintCount:0,
        retryCount:0,
        durationMs:1000,
        inputMode:"touch",
        startedAt:completedAt,
        completedAt,
        metadata:{source:"subitizing-browser-prerequisite"},
        evidence:[{
          attemptId,
          activityId:prerequisiteId,
          skillId:"math.pattern.matching",
          score:1,
          weight:1,
          createdAt:completedAt,
          qualifiesForMastery:true
        }],
        masteryEligible:true
      }]
    }));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-subitizing-glance]");
    return scene?.getAttribute("data-subitizing-glance-ready")==="true"&&scene.querySelectorAll("[data-subitizing-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function targetAttemptCount(page){
  return page.evaluate(({id})=>{
    const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
    return(attempts["demo-gian"]??[]).filter(item=>item.activityId===id).length;
  },{id:activityId});
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({
      choice:Boolean(document.activeElement?.hasAttribute?.("data-subitizing-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong subitizing choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,label+" must render");
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,label+" must remain fully visible");
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"subitizing bad HTTP at "+viewport.width);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,"progression guard must accept seeded Math readiness");
    const scene=page.locator('[data-subitizing-glance][data-child-visual-hierarchy="subitizing-vsg16"]');
    assert.equal(await scene.count(),1,"VSG-16 visual hierarchy opt-in");
    assert.equal(await scene.getAttribute("data-pattern-mode"),"square");
    const heading=scene.getByRole("heading",{name:"Lihat pola ● ● / ● ●. Ada berapa titik?",level:1,exact:true});
    assert.equal(await heading.count(),1,"canonical source question is the sole primary heading");
    assert.equal(await page.getByText("Lihat polanya",{exact:true}).count(),0,"no competing generic heading");
    const qBox=await heading.boundingBox();
    assert(qBox&&qBox.y>=0&&qBox.y+qBox.height<=viewport.height&&
      qBox.x>=0&&qBox.x+qBox.width<=viewport.width+1,
      "first-action question visible without horizontal clipping at "+viewport.width);
    const status=scene.locator(':scope > [role="status"]');
    assert.equal((await status.textContent())?.trim(),"","idle repeated guidance is hidden");
    const help=page.getByRole("button",{name:"Cara main"});
    assert.equal(await help.getAttribute("aria-expanded"),"false");
    await help.click();
    assert.equal(await page.locator("[data-subitizing-help]").innerText(),
      "Lihat seluruh pola titik, lalu pilih angka yang cocok.",
      "initial Help must not reveal the count");
    await captureEvidence(page,`${viewport.width}-subitizing-help.png`);
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal(await page.locator("[data-subitizing-help]").count(),0);
    assert.equal(await completed(page),false,"idle subitizing cannot complete");

    const cells=page.locator("[data-cell-index]");
    const dots=page.locator('[data-subitizing-dot="true"]');
    assert.equal(await cells.count(),9,"subitizing uses a stable 3x3 spatial board");
    assert.equal(await dots.count(),4,"representative activity renders exactly four dots");
    const dotIndexes=(await dots.evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute("data-cell-index"))))).sort((a,b)=>a-b);
    assert.deepEqual(dotIndexes,[0,2,6,8],"four-dot activity keeps the audited square arrangement");
    assert.equal(await page.locator("[data-subitizing-pattern]").getAttribute("aria-label"),"Empat titik membentuk empat sudut persegi.");

    await page.waitForTimeout(320);
    assert.equal(await page.locator('[data-subitizing-dot="true"]').count(),4,"stimulus remains visible; Pattern 44 has no forced timer or auto-hide");

    const choices=page.locator("[data-subitizing-choice]");
    assert.equal(await choices.count(),3);
    const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));
    assert.deepEqual(labels,["Pilih jumlah 3","Pilih jumlah 4","Pilih jumlah 5"],"subitizing keeps canonical choice order");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"subitizing overflows horizontally at "+viewport.width);

    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"subitizing choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"subitizing choices remain inside viewport");
    }

    assert.equal(await status.textContent(),"","idle status remains empty");
    await captureEvidence(page,`${viewport.width}-subitizing-idle.png`);

    const wrong=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrong,correctLabel);
    await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:2000});
    assert.equal((await status.textContent())?.trim(),"Belum tepat. Coba lagi!");
    await page.getByRole("button",{name:"Cara main"}).click();
    assert.equal(await page.locator("[data-subitizing-help]").innerText(),
      "Lihat empat sudutnya sebagai satu bentuk persegi.",
      "canonical variant cue remains available only after wrong");
    await page.getByRole("button",{name:"Tutup bantuan"}).click();
    assert.equal(await completed(page),false,"wrong subitizing answer cannot complete");
    assert.equal(await page.locator('[data-subitizing-dot="true"]').count(),4,"wrong answer does not hide or mutate the audited stimulus");
    await captureEvidence(page,`${viewport.width}-subitizing-try.png`);

    // Completing with Help still open must close the supplementary overlay.
    await page.getByRole("button",{name:"Cara main"}).click();
    assert.equal(await page.locator("[data-subitizing-help]").count(),1,"Help open before success");
    const correct=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correct.tap();else await correct.click();
    await page.waitForFunction(()=>document.querySelector('[data-subitizing-glance] > [role="status"]')?.textContent?.includes("Tepat!"),undefined,{timeout:2000});
    assert.match((await status.textContent())??"",/Kamu mengenali empat titik dari pola persegi/,
      "canonical success reasoning remains available to assistive tech");
    assert.equal(await completed(page),true,"correct subitizing answer completes canonical activity");

    assert.equal(await page.locator("[data-subitizing-help]").count(),0,
      "open Help closes immediately on correct answer");
    const completion=page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({state:"visible",timeout:3000});
    assert.deepEqual(
      await completion.locator("[data-completion-action]").evaluateAll(nodes=>nodes.map(node=>node.textContent?.trim())),
      ["Back","Again","Next","Share"],
      "subitizing success uses canonical action order"
    );
    assert.equal(await completion.getAttribute("data-completion-stars"),"3","subitizing success keeps exact three-star completion");
    await assertFullyVisible(completion,viewportHeight,"canonical subitizing completion");
    assert.equal(await completion.getByText("Hebat!",{exact:true}).count(),1,
      "succinct praise without repeated visible success explanation");

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});

    assert(state,"subitizing records attempt evidence");
    assert.equal(state.assessed,true);
    assert.equal(state.metadata?.source,"subitizing-glance-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_subitizing_interaction");
    assert.equal(state.metadata?.patternMode,"square");
    assert.equal(state.metadata?.selectedChoice,"4");
    assert.equal(state.metadata?.visibleDotCount,4);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);
    assert.equal(await targetAttemptCount(page),1,"subitizing success writes exactly one attempt/evidence record");

    await captureEvidence(page,`${viewport.width}-subitizing-success.png`);

    if(viewport.width===390){
      await page.evaluate(()=>{window.__mainlagiSi11SubitizingDocument="same-document";});
      await page.setViewportSize({width:844,height:390});
      await page.waitForTimeout(120);
      assert.equal(await page.evaluate(()=>window.__mainlagiSi11SubitizingDocument),"same-document","subitizing rotation must not reload the document");
      assert.equal(await completion.isVisible(),true,"subitizing Completion survives portrait→landscape reflow");
      assert.equal(await targetAttemptCount(page),1,"subitizing rotation must not duplicate attempt/evidence");
      await page.setViewportSize({width:390,height:844});
      await page.waitForTimeout(120);

      await completion.locator('[data-completion-action="share"]').click();
      const share=page.locator('[data-canonical-share="v1"]');
      await share.waitFor({state:"visible",timeout:3000});
      await page.waitForFunction(()=>document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate")==="allowed",undefined,{timeout:3000});
      assert.equal(await share.getAttribute("data-share-public-path"),"/","subitizing Share stays on the public Belajar origin");
      assert.equal(await targetAttemptCount(page),1,"opening Share must not duplicate attempt/evidence");
      await share.getByRole("button",{name:"Tutup"}).click();

      await completion.locator('[data-completion-action="again"]').click();
      await completion.waitFor({state:"hidden",timeout:3000});
      assert.equal(await choices.evaluateAll(nodes=>nodes.every(node=>!node.disabled)),true,"Again restores the same mounted subitizing board");
      assert.equal(await targetAttemptCount(page),1,"Again local reset does not emit a second attempt before another completion");
    }
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{
    await browser.close();
  }
}


// The additional two canonical dot layouts are distinct visual/semantic variants.
// Independent 320/390/768 QA prevents four-dot representative success from
// being mistaken for full three-variant release acceptance.
const additionalVariants=[
  {id:"math-subitize-2",slug:"two-dots",mode:"pair",
    prompt:"Tanpa menghitung lama, berapa titik yang terlihat: ● ● ?",
    dots:[3,5],choiceLabels:["1","2","3"],correct:"2",
    cue:"Lihat dua titik sebagai satu pasangan.",
    accessiblePattern:"Dua titik berjajar mendatar."},
  {id:"math-subitize-5",slug:"five-dots",mode:"dice_five",
    prompt:"Lihat pola seperti dadu lima. Berapa jumlah titiknya?",
    dots:[0,2,4,6,8],choiceLabels:["4","5","6"],correct:"5",
    cue:"Lihat empat sudut dan satu titik di tengah sebagai satu pola.",
    accessiblePattern:"Lima titik seperti pola angka lima pada dadu."}
];
async function inspectAdditionalVariants(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    for(const variant of additionalVariants){
      const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
      try{
        await seedPrerequisiteReadiness(context);
        const page=await context.newPage();
        const pageErrors=[];
        page.on("pageerror",e=>pageErrors.push(e.message));
        const path="/child/demo-gian/activity/"+variant.id;
        const response=await page.goto(baseUrl+path,{waitUntil:"domcontentloaded",timeout:30000});
        assert(response&&response.status()<400,"route resolves: "+variant.id);
        await waitForScene(page);
        assert.equal(new URL(page.url()).pathname,path,"canonical stage guard: "+variant.id);
        const scene=page.locator('[data-subitizing-glance][data-child-visual-hierarchy="subitizing-vsg16"]');
        assert.equal(await scene.getAttribute("data-pattern-mode"),variant.mode);
        const heading=scene.getByRole("heading",{level:1,name:variant.prompt,exact:true});
        assert.equal(await heading.count(),1,"original canonical question shown: "+variant.id);
        const box=await heading.boundingBox();
        assert(box&&box.y>=0&&box.y+box.height<=viewport.height&&box.x>=0&&box.x+box.width<=viewport.width+1,"first fold: "+variant.id);
        const pattern=scene.locator("[data-subitizing-pattern]");
        assert.equal(await pattern.getAttribute("aria-label"),variant.accessiblePattern);
        const dots=scene.locator('[data-subitizing-dot="true"]');
        assert.deepEqual((await dots.evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute("data-cell-index"))))).sort((a,b)=>a-b),
          variant.dots,"canonical dot arrangement: "+variant.id);
        const choices=scene.locator("[data-subitizing-choice]");
        assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),
          variant.choiceLabels.map(x=>"Pilih jumlah "+x),"canonical choice ordering: "+variant.id);
        const width=await page.evaluate(()=>document.documentElement.clientWidth);
        const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
        assert(scrollWidth<=width+1,"horizontal overflow: "+variant.id);
        for(const rect of await choices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{width:r.width,height:r.height,x:r.x,right:r.right};}))){
          assert(rect.width>=44&&rect.height>=44&&rect.x>=-1&&rect.right<=width+1,"min touch target: "+variant.id);
        }
        const status=scene.locator(':scope > [role="status"]');
        assert.equal((await status.textContent())?.trim(),"");
        const prefix=String(viewport.width)+"-subitizing-"+variant.slug+"-";
        await captureEvidence(page,prefix+"idle.png");
        await page.getByRole("button",{name:"Cara main"}).click();
        assert.equal(await page.locator("[data-subitizing-help]").innerText(),
          "Lihat seluruh pola titik, lalu pilih angka yang cocok.",
          "initial Help must remain answer-safe: "+variant.id);
        await captureEvidence(page,prefix+"help.png");
        await page.getByRole("button",{name:"Tutup bantuan"}).click();
        const wrong=variant.choiceLabels.find(x=>x!==variant.correct);
        const wrongButton=page.getByRole("button",{name:"Pilih jumlah "+wrong,exact:true});
        await wrongButton.focus();await page.keyboard.press("Enter");
        await page.getByText("Belum tepat. Coba lagi!",{exact:true}).waitFor({state:"visible",timeout:3000});
        assert.equal(await scene.locator('[data-subitizing-dot="true"]').count(),variant.dots.length);
        await page.getByRole("button",{name:"Cara main"}).click();
        assert.equal(await page.locator("[data-subitizing-help]").innerText(),variant.cue,
          "canonical specific cue only after wrong: "+variant.id);
        await page.getByRole("button",{name:"Tutup bantuan"}).click();
        await captureEvidence(page,prefix+"try.png");
        await page.getByRole("button",{name:"Cara main"}).click();
        assert.equal(await page.locator("[data-subitizing-help]").count(),1,
          "variant Help may be reopened before completion: "+variant.id);
        const correctButton=page.getByRole("button",{name:"Pilih jumlah "+variant.correct,exact:true});
        if(viewport.width===390)await correctButton.tap(); else await correctButton.click();
        const completion=page.locator('[data-activity-completion]');
        await completion.waitFor({state:"visible",timeout:3000});
        assert.equal(await page.locator("[data-subitizing-help]").count(),0,
          "variant Help closes on success: "+variant.id);
        const record=await page.evaluate(id=>{
          const all=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
          return (all["demo-gian"]??[]).filter(a=>a.activityId===id);
        },variant.id);
        assert.equal(record.length,1,"one assessed completion attempt");
        assert.equal(record[0].accuracy,0.5);
        assert.equal(record[0].retryCount,1);
        assert.equal(record[0].metadata?.selectedChoice,variant.correct);
        assert.equal(record[0].metadata?.visibleDotCount,variant.dots.length);
        assert.equal(record[0].metadata?.patternMode,variant.mode);
        await captureEvidence(page,prefix+"success.png");
        await completion.locator('[data-completion-action="again"]').click();
        await completion.waitFor({state:"hidden",timeout:3000});
        assert.equal(await choices.evaluateAll(nodes=>nodes.every(n=>!n.disabled)),true,"Again restores choices");
        assert.deepEqual(pageErrors,[],"no browser exceptions");
      }finally{await context.close();}
    }
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports){
    await inspect(viewport);
    if([320,390,768].includes(viewport.width))await inspectAdditionalVariants(viewport);
  }
  console.log("VSG-16 Subitizing QA passed all 3 canonical dot patterns, 44 screenshots, five main viewports, 320/390/768 variant sampling, keyboard/touch, evidence and Again.");
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stopServer);
