import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_ECOSYSTEM_RELATION_QA_PORT??4047);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-eco-plant-sun-water";
const activityId="science-eco-plant-sun-water";
const correctLabel="Pilih hubungan: air dan cahaya";
const screenshotDir=path.join(root,".mobile-route-qa");
const cases=[
  {viewport:{width:320,height:720},completionMode:"touch"},
  {viewport:{width:390,height:844},completionMode:"pointer"},
  {viewport:{width:768,height:1024},completionMode:"touch"}
];
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
    try{const response=await fetch(`${baseUrl}${route}`);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Ecosystem relation QA server did not become ready.\n${serverLog.slice(-4000)}`);
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seedPrerequisiteReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const requiredIds=[
      "science-cycle-butterfly","science-match-young-adult-b","science-animal-needs-food-water",
      "science-material-glass-transparent","science-water-ice-melts","science-force-push-door"
    ];
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      [childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}
    }));
    const seeds=[
      ["science-cycle-butterfly","science.life_cycles.basic"],
      ["science-animal-needs-food-water","science.organisms.needs_food.basic"],
      ["science-material-glass-transparent","science.materials.properties.basic"],
      ["science-water-ice-melts","science.water.state_changes.basic"],
      ["science-force-push-door","science.forces.motion.basic"]
    ];
    const attempts=seeds.map(([seedActivityId,skillId],index)=>{
      const attemptId=`qa-ecosystem-relation-prereq-${index}`;
      const completedAt=`2026-09-19T11:0${index}:00.000Z`;
      return {
        id:attemptId,childId,activityId:seedActivityId,subjectId:"science",
        stageId:"science-life-material-motion",runtime:"tap_choice",difficulty:2,status:"completed",
        assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,
        durationMs:1000,inputMode:"touch",startedAt:completedAt,completedAt,
        metadata:{source:"ecosystem-relation-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:completedAt,qualifiesForMastery:true}],
        masteryEligible:true
      };
    });
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function waitForScene(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-phenomenon-relation-board]");
    return scene?.getAttribute("data-phenomenon-relation-ready")==="true" &&
      scene?.getAttribute("data-relation-domain")==="ecosystem_dependency" &&
      scene.querySelectorAll("[data-phenomenon-relation-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(({id})=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return (progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },{id:activityId});
}

async function chooseWrongWithKeyboard(page){
  for(let step=0;step<96;step+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>({
      choice:Boolean(document.activeElement?.hasAttribute?.("data-phenomenon-relation-choice")),
      label:document.activeElement?.getAttribute?.("aria-label")??""
    }));
    if(focused.choice&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong ecosystem relation choice");
}

async function completeCorrect(page,mode){
  const button=page.getByRole("button",{name:correctLabel,exact:true});
  if(mode==="pointer"){await button.click();return;}
  const box=await button.boundingBox();
  assert(box,"ecosystem correct relation must have touchable box");
  await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);
}

async function assertVisible(locator,height,label){
  const box=await locator.boundingBox();
  assert(box,`${label} must render`);
  assert(box.y>=-1&&box.y+box.height<=height+1,`${label} must remain visible`);
}

async function inspect({viewport,completionMode}){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:true});
    await seedPrerequisiteReadiness(context);
    const page=await context.newPage();
    const pageErrors=[];const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(`${baseUrl}${route}`,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,`ecosystem relation bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname,route,`progression guard accepts ecosystem route at ${viewport.width}`);

    const scene=page.locator("[data-phenomenon-relation-board]");
    assert.equal(await scene.getAttribute("data-relation-domain"),"ecosystem_dependency");
    assert.equal(await scene.getAttribute("data-relation-mode"),"plant_resource_dependency");
    assert.equal(await scene.getAttribute("data-relation-resolved"),"false");
    assert.equal(await page.getByRole("heading",{name:"Hubungkan kebutuhan makhluk hidup"}).count(),1);
    assert.equal(await page.getByText("Hubungan ekosistem",{exact:true}).count(),1);
    assert.equal(await page.getByRole("group",{name:"Hubungan makhluk hidup dan kebutuhan lingkungan"}).count(),1);
    assert.equal(await page.getByText("Pola Bumi & langit",{exact:true}).count(),0,"ecosystem route must not show Earth/sky badge");
    assert.equal(await page.getByRole("heading",{name:"Hubungkan pengamatan"}).count(),0,"ecosystem route must not show Earth/sky heading");
    assert.equal(await page.locator("[data-relation-observation]").getByText("Tanaman di kebun",{exact:true}).count(),1);
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"Pilih hubungan");

    const choices=page.locator("[data-phenomenon-relation-choice]");
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),[
      "Pilih hubungan: air dan cahaya",
      "Pilih hubungan: plastik dan kaca",
      "Pilih hubungan: mainan dan kertas"
    ]);
    assert.equal(await completed(page),false);

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,`ecosystem relation overflows horizontally at ${viewport.width}`);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{width:r.width,height:r.height,left:r.left,right:r.right};}))){
      assert(box.width>=44&&box.height>=44,"ecosystem relation choice keeps minimum touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"ecosystem relation choice remains inside viewport");
    }

    const status=page.getByRole("status");
    await status.filter({hasText:"Perhatikan makhluk hidup atau perubahan di kiri"}).waitFor({state:"visible",timeout:2000});
    mkdirSync(screenshotDir,{recursive:true});
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-ecosystem-relation-idle.png`),fullPage:false});

    const wrong=await chooseWrongWithKeyboard(page);
    assert.notEqual(wrong,correctLabel);
    await status.filter({hasText:"Hubungan belum terisi"}).waitFor({state:"visible",timeout:2000});
    await assertVisible(status,viewportHeight,`ecosystem retry status at ${viewport.width}`);
    assert.equal(await completed(page),false,"wrong ecosystem relation cannot complete");
    assert.equal(await scene.getAttribute("data-relation-resolved"),"false");
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"Pilih hubungan");
    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-ecosystem-relation-try.png`),fullPage:false});

    await completeCorrect(page,completionMode);
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true);
    assert.equal(await scene.getAttribute("data-relation-resolved"),"true");
    assert.equal(await page.locator("[data-relation-result-label]").textContent(),"air dan cahaya");
    const nextLink=page.getByRole("link",{name:"Pilih permainan lain"});
    await assertVisible(status,viewportHeight,`ecosystem success status at ${viewport.width}`);
    await assertVisible(nextLink,viewportHeight,`ecosystem success CTA at ${viewport.width}`);

    const attempt=await page.evaluate(({id})=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      return [...(attempts["demo-gian"]??[])].reverse().find(item=>item.activityId===id);
    },{id:activityId});
    assert(attempt,"ecosystem relation board records attempt evidence");
    assert.equal(attempt.assessed,true);
    assert.equal(attempt.metadata?.source,"phenomenon-relation-board-runtime");
    assert.equal(attempt.metadata?.evidenceFidelity,"choice_ecosystem_dependency_relation_interaction");
    assert.equal(attempt.metadata?.domainVariant,"ecosystem_dependency");
    assert.equal(attempt.metadata?.relationMode,"plant_resource_dependency");
    assert.equal(attempt.metadata?.selectedChoice,"air dan cahaya");
    assert.equal(attempt.metadata?.observationLabel,"Tanaman di kebun");
    assert.equal(attempt.metadata?.relationLabel,"Sumber daya yang dibutuhkan");
    assert.equal(attempt.correctCount,1);
    assert.equal(attempt.incorrectCount,1);
    assert.equal(attempt.retryCount,1);
    assert.equal(attempt.accuracy,.5);

    await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-ecosystem-relation-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],`page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors,[],`console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  }finally{await browser.close();}
}

async function main(){
  startServer();
  await waitForServer();
  for(const item of cases)await inspect(item);
  console.log("Ecosystem Phenomenon Relation Board browser QA passed 3 viewports with domain copy, keyboard retry, pointer + actual touch, assessed evidence and nine screenshots.");
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
