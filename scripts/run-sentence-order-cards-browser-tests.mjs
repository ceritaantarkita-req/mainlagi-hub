import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SENTENCE_ORDER_QA_PORT??4038);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/bahasa-urut-ibu-memasak";
const activityId="bahasa-urut-ibu-memasak";
const correctLabel="Pilih kalimat Ibu memasak nasi.";
const screenshotDir=path.join(root,".mobile-route-qa");
const evidenceDir=path.join(root,".vqa10-sentence-order");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]});
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append);
  server.stderr.on("data",append);
}

async function waitForServer(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Sentence-order QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const seeds=[
      ["bahasa-suku-ba","bahasa.suku_kata.recognition","tap_choice"],
      ["bahasa-suku-ka","bahasa.suku_kata.recognition","tap_choice"],
      ["bahasa-gabung-baju","bahasa.suku_kata.blending","tap_choice"],
      ["bahasa-gabung-bola","bahasa.suku_kata.blending","tap_choice"],
      ["bahasa-pasang-kata-benda-1","bahasa.kata.semantic_matching","matching"],
      ["bahasa-pasang-kata-tempat","bahasa.kata.semantic_matching","matching"],
      ["bahasa-dengar-buku","bahasa.kata.listening","listen_and_choose"],
      ["bahasa-dengar-bola","bahasa.kata.listening","listen_and_choose"],
      ["bahasa-gambar-apel","bahasa.kata.picture_matching","tap_choice"],
      ["bahasa-gambar-rumah","bahasa.kata.picture_matching","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-sentence-order-prereq-${index}`;
      const completedAt=`2026-09-16T12:${String(index).padStart(2,"0")}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"bahasa",stageId:"bahasa-suku-kata-kata",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:runtime==="matching"?2:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"sentence-order-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-sentence-order-cards]");
    return scene?.getAttribute("data-sentence-order-cards-ready")==="true"&&scene.querySelectorAll("[data-sentence-order-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function keyboardWrongChoice(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({choice:Boolean(document.activeElement?.hasAttribute?.("data-sentence-order-choice")),label:document.activeElement?.getAttribute?.("aria-label")??""}));
    if(focused.choice&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}
  }
  throw new Error("Keyboard navigation did not reach a wrong sentence-order choice");
}

async function assertFullyVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,`${label} must remain fully visible in viewport`);
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce"});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`sentence-order bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept legitimate Bahasa Wave B readiness at ${viewport.width}`);

    const guide=page.locator("[data-sentence-order-guide]");
    assert.equal(await guide.count(),1,"sentence-order guide renders");
    assert.deepEqual(
      (await guide.locator("span").allTextContents()).map(s=>s.trim()),
      ["1","2","3","…"],
      "visual directional 1→2→3→… learning guide is never removed"
    );
    assert.equal((await guide.locator("small").innerText()).trim(),"Baca dari kiri ke kanan",
      "canonical visual guide remains visible as task content");
    const choices=page.locator("[data-sentence-order-choice]");
    assert.equal(await choices.count(),3,"sentence-order keeps three canonical choices");
    assert.deepEqual(new Set(await choices.evaluateAll(items=>items.map(node=>node.getAttribute("aria-label")))),new Set([
      "Pilih kalimat Ibu memasak nasi.","Pilih kalimat Memasak nasi ibu.","Pilih kalimat Nasi ibu memasak."
    ]));
    assert.equal(await page.locator("[data-sentence-order-word]").count(),9,"representative choices render exactly nine canonical word cards");
    assert.equal(await completed(page),false,"idle sentence-order state cannot complete activity");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`sentence-order overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(items=>items.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"sentence-order choices keep touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"sentence-order choices remain inside viewport");
    }

    const status=page.getByRole("status");
    const help=page.locator('[data-sentence-order-help="v1"]');
    assert.equal(await help.count(),1,"sentence-order has one idle help");
    const summary=help.locator("summary");
    assert.equal((await summary.innerText()).trim(),"Cara main","sentence-order Help localized");
    assert.equal(await help.getAttribute("open"),null,"advice closed before attempting");
    assert.equal(await help.locator("p").isVisible(),false,"instructions are on demand");
    const target=await summary.boundingBox();
    assert(target&&target.width>=44&&target.height>=44,"Help touch target >=44px");
    assert.equal(await page.locator("[data-sentence-order-cards] h1").count(),1,
      "one visible main instruction heading");
    await assertFullyVisible(guide,viewportHeight,"visual 1-2-3 order guide");
    await assertFullyVisible(summary,viewportHeight,"Help trigger");
    await assertFullyVisible(status,viewportHeight,`idle sentence-order feedback at ${viewport.width}`);
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-order-idle.png`),fullPage:false});
    await summary.click();
    assert.equal(await help.getAttribute("open"),"","Help opens");
    const helpText=await help.locator("p").innerText();
    assert(helpText.includes("Baca kartu dari kiri ke kanan, lalu pilih kalimat yang paling masuk akal."),
      "canonical task instruction preserved in native Help");
    assert(helpText.includes("Perhatikan siapa yang melakukan apa, lalu cek urutan katanya."),
      "canonical idle guidance preserved without rewriting");
    assert.equal(await help.locator("p").isVisible(),true,"Help visible on demand");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-order-help.png`),fullPage:false});
    await summary.click();
    assert.equal(await help.getAttribute("open"),null,"Help closes before game input");

    const wrongLabel=await keyboardWrongChoice(page);
    assert.notEqual(wrongLabel,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong sentence cannot complete activity");
    await assertFullyVisible(status,viewportHeight,`retry sentence-order feedback at ${viewport.width}`);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-order-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct sentence completes canonical activity");
    await assertFullyVisible(status,viewportHeight,`success sentence-order feedback at ${viewport.width}`);
    const completion=page.locator("[data-activity-completion]");
    await assertFullyVisible(completion,viewportHeight,`sentence-order success CTA at ${viewport.width}`)

    const state=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(state,"sentence-order records attempt evidence");
    assert.equal(state.assessed,true,"sentence-order activity remains assessed");
    assert.equal(state.metadata?.source,"sentence-order-cards-runtime");
    assert.equal(state.metadata?.evidenceFidelity,"choice_sentence_order_cards_interaction");
    assert.equal(state.metadata?.selectedChoice,"Ibu memasak nasi.");
    assert.deepEqual(state.metadata?.selectedWords,["Ibu","memasak","nasi"]);
    assert.equal(state.correctCount,1);
    assert.equal(state.incorrectCount,1);
    assert.equal(state.retryCount,1);
    assert.equal(state.accuracy,0.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-sentence-order-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{
    await browser.close();
  }
}

function archiveOrderEvidence(){
  mkdirSync(evidenceDir,{recursive:true});
  const files=readdirSync(screenshotDir)
    .filter(file=>/^\d+-sentence-order-(?:idle|help|try|success)\.png$/.test(file));
  assert.equal(files.length,viewports.length*4,
    "Sentence Order evidence must include exactly 4 genuine states for every width");
  for(const file of files)copyFileSync(path.join(screenshotDir,file),path.join(evidenceDir,file));
}

async function main(){
  startServer();
  await waitForServer();
  for(const viewport of viewports)await inspect(viewport);
  archiveOrderEvidence();
  console.log(`Sentence Order Cards browser QA passed ${viewports.length} viewports with legitimate Bahasa Wave B readiness, canonical sentence choices, keyboard wrong-state, pointer completion, touch targets, feedback/canonical Completion visibility and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
