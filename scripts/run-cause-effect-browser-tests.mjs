import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_CAUSE_EFFECT_QA_PORT??4021);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-water-ice-melts";
const activityId="science-water-ice-melts";
const correctLabel="Pilih hasil: mencair menjadi air";
const screenshotDir=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;let serverLog="";

function startServer(){const nextBin=path.join(root,"node_modules","next","dist","bin","next");server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]});const append=(chunk)=>{serverLog+=chunk.toString();};server.stdout.on("data",append);server.stderr.on("data",append);}
async function waitForServer(){const started=Date.now();while(Date.now()-started<60000){try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}await new Promise(resolve=>setTimeout(resolve,400));}throw new Error(`Cause-effect QA server did not become ready.\n${serverLog.slice(-4000)}`);}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";const progressKey="mainlagi-learning-progress-v1";const attemptsKey="mainlagi-learning-attempts-v1";
    const requiredIds=["science-living-dog","science-match-living-nonliving","science-plant-needs-sunlight","science-animal-fur-cat","science-match-animal-homes-a","science-sense-eyes-see","science-weather-rain-clue"];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const seeds=[
      ["science-living-dog","science.living.basic_classification"],
      ["science-plant-needs-sunlight","science.plants.parts_needs.basic"],
      ["science-animal-fur-cat","science.animals.features_habitat.basic"],
      ["science-sense-eyes-see","science.observation.senses.basic"],
      ["science-weather-rain-clue","science.weather.daynight.basic"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{const attemptId=`qa-cause-effect-prereq-${index}`;const completedAt=`2026-09-15T00:0${index}:00.000Z`;return{id:attemptId,childId,activityId:seedActivityId,subjectId:"science",stageId:"science-living-observation-basics",runtime:"tap_choice",difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,metadata:{source:"cause-effect-browser-prerequisite"},evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],masteryEligible:true};});
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}

async function waitForBoard(page){await page.waitForLoadState("load");await page.waitForFunction(()=>{const scene=document.querySelector("[data-cause-effect]");return scene?.getAttribute("data-cause-effect-ready")==="true"&&scene.querySelectorAll("[data-cause-effect-choice]").length===3;},undefined,{timeout:6000});await page.waitForTimeout(80);}

async function chooseWrongWithKeyboard(page){for(let step=0;step<96;step+=1){await page.keyboard.press("Tab");const focused=await page.evaluate(()=>{const element=document.activeElement;return{inScene:Boolean(element?.closest?.("[data-cause-effect]")),choice:Boolean(element?.hasAttribute?.("data-cause-effect-choice")),tag:element?.tagName??"",label:element?.getAttribute?.("aria-label")??""};});if(focused.inScene&&focused.choice&&focused.tag==="BUTTON"&&focused.label!==correctLabel){await page.keyboard.press("Enter");return focused.label;}}throw new Error("Keyboard navigation did not reach a wrong cause-effect choice");}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce"});await seedPrerequisiteReadiness(context);const page=await context.newPage();const pageErrors=[];const consoleErrors=[];page.on("pageerror",error=>pageErrors.push(error.message));page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});
    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});assert(response&&response.status()<400,`cause-effect bad HTTP at ${viewport.width}`);await waitForBoard(page);assert.equal(new URL(page.url()).pathname,route,`progression guard must accept seeded Science Wave A readiness at ${viewport.width}`);
    assert.match(await page.locator("[data-cause-start]").innerText(),/Es batu/);assert.match(await page.locator("[data-cause-condition]").innerText(),/lebih hangat/);assert.match(await page.locator("[data-cause-result]").innerText(),/Pilih hasil/);
    const choices=page.locator("[data-cause-effect-choice]");assert.equal(await choices.count(),3);const labels=await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label")));assert.deepEqual(new Set(labels),new Set(["Pilih hasil: mencair menjadi air","Pilih hasil: membeku lebih keras","Pilih hasil: berubah menjadi batu"]));
    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));assert(scrollWidth<=viewportWidth+1,`cause-effect overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return{width:rect.width,height:rect.height,left:rect.left,right:rect.right};}))){assert(box.width>=44&&box.height>=44,"cause-effect choice keeps touch target");assert(box.left>=-1&&box.right<=viewportWidth+1,"cause-effect choice remains inside viewport");}
    mkdirSync(screenshotDir,{recursive:true});await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-cause-effect-idle.png`),fullPage:false});
    const wrongLabel=await chooseWrongWithKeyboard(page);assert.notEqual(wrongLabel,correctLabel);await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    const afterWrong=await page.evaluate(({activityId:id})=>{const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);},{activityId});assert.equal(afterWrong,false,"wrong cause-effect answer must not complete");await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-cause-effect-try.png`),fullPage:false});
    await page.getByRole("button",{name:correctLabel}).click();await page.getByRole("status").filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});const nextBox=await nextLink.boundingBox();const viewportHeight=await page.evaluate(()=>window.innerHeight);assert(nextBox,"cause-effect success CTA must render");assert(nextBox.y>=-1&&nextBox.y+nextBox.height<=viewportHeight+1,`cause-effect success CTA must remain visible at ${viewport.width}`);
    const state=await page.evaluate(({activityId:id})=>{const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");const list=attempts["demo-gian"]??[];return{completed:(progress["demo-gian"]?.completedActivityIds??[]).includes(id),attempt:[...list].reverse().find(item=>item.activityId===id)};},{activityId});
    assert.equal(state.completed,true);assert(state.attempt);assert.equal(state.attempt.assessed,true);assert.equal(state.attempt.metadata?.evidenceFidelity,"choice_cause_effect_interaction");assert.equal(state.attempt.metadata?.effectKind,"melting");assert.equal(state.attempt.metadata?.causeKey,"warm-place");assert.equal(state.attempt.correctCount,1);assert.equal(state.attempt.incorrectCount,1);assert.equal(state.attempt.retryCount,1);assert.equal(state.attempt.accuracy,0.5);
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-cause-effect-success.png`),fullPage:false});assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);await context.close();
  }finally{await browser.close();}
}

async function main(){startServer();await waitForServer();for(const viewport of viewports)await inspect(viewport);console.log(`Cause-effect browser QA passed ${viewports.length} viewports with legitimate Science progression, keyboard wrong-state, false-completion guard, pointer completion, layout, CTA and assessed evidence checks.`);}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
