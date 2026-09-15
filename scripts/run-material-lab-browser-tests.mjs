import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_MATERIAL_LAB_QA_PORT??4023);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-material-raincoat-waterproof";
const activityId="science-material-raincoat-waterproof";
const correctLabel="Pilih sifat: Tidak mudah ditembus air";
const screenshotDir=path.join(root,".mobile-route-qa");
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
  throw new Error(`Material-lab QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const progressKey="mainlagi-learning-progress-v1";
    const attemptsKey="mainlagi-learning-attempts-v1";
    const requiredIds=[
      "science-earth-sun-day",
      "science-match-sky-observation-c",
      "science-body-wash-hands",
      "science-eco-plant-sun-water",
      "science-env-trash-bin",
      "science-measure-longer-pencil"
    ];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["science-earth-sun-day","science.earth.sky_patterns.basic","tap_choice"],
      ["science-body-wash-hands","science.body.health_habits.basic","tap_choice"],
      ["science-eco-plant-sun-water","science.ecosystem.dependencies.basic","tap_choice"],
      ["science-env-trash-bin","science.environment.care.basic","tap_choice"],
      ["science-measure-longer-pencil","science.observation.measurement.basic","tap_choice"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId=`qa-material-lab-prereq-${index}`;
      const completedAt=`2026-09-15T00:2${index}:00.000Z`;
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-earth-body-environment",runtime,difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"material-lab-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true
      };
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForLab(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-material-lab]");
    return scene?.getAttribute("data-material-lab-ready")==="true"&&scene.querySelectorAll("[data-material-lab-choice]").length===3&&Boolean(scene.querySelector("[data-material-lab-test]"));
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>{
      const element=document.activeElement;
      return{inScene:Boolean(element?.closest?.("[data-material-lab]")),choice:Boolean(element?.hasAttribute?.("data-material-lab-choice")),tag:element?.tagName??"",label:element?.getAttribute?.("aria-label")??""};
    });
    if(focused.inScene&&focused.choice&&focused.tag==="BUTTON"&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong material-lab choice");
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
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
    assert(response&&response.status()<400,`material-lab bad HTTP at ${viewport.width}`);
    await waitForLab(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science Wave C readiness at ${viewport.width}`);

    const choices=page.locator("[data-material-lab-choice]");
    assert.equal(await choices.count(),3);
    const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));
    assert.deepEqual(new Set(labels),new Set([
      "Pilih sifat: Tidak mudah ditembus air",
      "Pilih sifat: Mudah menyerap air",
      "Pilih sifat: Mudah hancur saat basah"
    ]));

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`material-lab overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){
      assert(box.width>=44&&box.height>=44,"material-lab choice keeps touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"material-lab choice remains inside viewport");
    }
    const testButton=page.locator("[data-material-lab-test]");
    const testBox=await testButton.boundingBox();
    assert(testBox&&testBox.width>=44&&testBox.height>=44,"material-lab test button keeps touch target");

    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-material-lab-idle.png`),fullPage:false});

    const wrongLabel=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel,correctLabel);
    assert.equal(await completed(page),false,"selecting a material sample alone must not complete");
    await testButton.click();
    await page.getByRole("status").filter({hasText:"Hasil uji belum cocok"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong material test must not complete");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-material-lab-try.png`),fullPage:false});

    await page.getByRole("button",{name:correctLabel}).click();
    assert.equal(await completed(page),false,"correct sample selection still requires explicit test action");
    await testButton.click();
    await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});

    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    const nextBox=await nextLink.boundingBox();
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    assert(nextBox,"material-lab success CTA must render");
    assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`material-lab success CTA must remain visible at ${viewport.width}`);

    const state=await page.evaluate(({id})=>{
      const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return{completed:(progress["demo-gian"]?.completedActivityIds??[]).includes(id),attempt:[...list].reverse().find(item=>item.activityId===id)};
    },{id:activityId});
    assert.equal(state.completed,true);
    assert(state.attempt);
    assert.equal(state.attempt.assessed,true);
    assert.equal(state.attempt.metadata?.evidenceFidelity,"choice_material_lab_interaction");
    assert.equal(state.attempt.metadata?.materialTestKind,"waterproof");
    assert.equal(state.attempt.metadata?.objectLabel,"Jas hujan");
    assert.equal(state.attempt.metadata?.testedChoice,"Tidak mudah ditembus air");
    assert.equal(state.attempt.correctCount,1);
    assert.equal(state.attempt.incorrectCount,1);
    assert.equal(state.attempt.retryCount,1);
    assert.equal(state.attempt.accuracy,.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-material-lab-success.png`),fullPage:false});
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
  console.log(`Material-lab browser QA passed ${viewports.length} viewports with legitimate Science Wave C progression, keyboard selection, explicit test action, false-completion guards, pointer completion, layout, CTA and assessed evidence checks.`);
}

main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
