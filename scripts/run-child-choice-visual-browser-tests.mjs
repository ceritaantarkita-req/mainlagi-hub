import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_CHILD_CHOICE_QA_PORT??4072);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/science-seed-grows-plant";
const activityId="science-seed-grows-plant";
const prompt="Dengan air dan kondisi yang sesuai, biji dapat tumbuh menjadi apa?";
const choices=["🌱 tanaman","🪨 batu","🥛 gelas"];
const screenshots=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024},{width:1280,height:800}];
let server=null,serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},stdio:["ignore","pipe","pipe"]
  });
  const log=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",log);server.stderr.on("data",log);
}
async function waitForServer(){
  const start=Date.now();
  while(Date.now()-start<60000){
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Choice QA server failed: "+serverLog.slice(-4000));
}
function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}
async function seedReadiness(context){
  await context.addInitScript(()=>{
    const childId="demo-gian",progressKey="mainlagi-learning-progress-v1",attemptsKey="mainlagi-learning-attempts-v1";
    const ids=["science-living-dog","science-match-living-nonliving","science-plant-needs-sunlight","science-animal-fur-cat","science-match-animal-homes-a","science-sense-eyes-see","science-weather-rain-clue"];
    localStorage.setItem(progressKey,JSON.stringify({[childId]:{completedActivityIds:ids,stars:0,lastActivityId:ids.at(-1)}}));
    const seeds=[
      ["science-living-dog","science.living.basic_classification"],
      ["science-plant-needs-sunlight","science.plants.parts_needs.basic"],
      ["science-animal-fur-cat","science.animals.features_habitat.basic"],
      ["science-sense-eyes-see","science.observation.senses.basic"],
      ["science-weather-rain-clue","science.weather.daynight.basic"]
    ];
    const attempts=seeds.map(([id,skillId],index)=>{
      const attemptId=`qa-choice-prereq-${index}`,at="2026-09-15T00:00:00.000Z";
      return {id:attemptId,childId,activityId:id,subjectId:"science",stageId:"science-living-observation-basics",runtime:"tap_choice",
        difficulty:2,status:"completed",assessed:true,score:1,accuracy:1,correctCount:1,incorrectCount:0,hintCount:0,retryCount:0,
        durationMs:1000,inputMode:"touch",startedAt:at,completedAt:at,metadata:{source:"choice-browser-prerequisite"},
        evidence:[{attemptId,activityId:id,skillId,score:1,weight:1,createdAt:at,qualifiesForMastery:true}],masteryEligible:true};
    });
    localStorage.setItem(attemptsKey,JSON.stringify({[childId]:attempts}));
  });
}
async function verify(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
    await seedReadiness(context);
    try{
      const page=await context.newPage(),errors=[];
      page.on("pageerror",e=>errors.push(e.message));
      const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
      assert(response&&response.status()<400,`HTTP error at ${viewport.width}px`);
      const experience=page.locator('[data-child-visual-hierarchy="choice-v1"]');
      await experience.waitFor({state:"visible",timeout:6000});
      assert.equal(new URL(page.url()).pathname,route,"canonical Science readiness must allow this exact route");
      assert.equal(await page.locator('[data-activity-frame="garden"] h1').count(),1,"one main activity instruction, not a second giant title");
      assert.equal((await experience.locator('[data-child-choice-question]').textContent())?.trim(),prompt,
        "preserve canonical Science question without editorial changes");
      const buttons=experience.locator("[data-choices] button");
      assert.equal(await buttons.count(),3);
      assert.deepEqual(await buttons.allTextContents(),choices,"retain full canonical choice content/order");
      assert.equal(await experience.locator("[data-child-choice-help]").count(),0,"secondary help remains hidden initially");
      const labelBox=await experience.locator("[data-choice-label]").first().evaluate(node=>{
        const value=node.textContent??"",start=value.indexOf("tanaman");
        if(start<0||!node.firstChild)return null;
        const range=document.createRange();
        range.setStart(node.firstChild,start);range.setEnd(node.firstChild,start+"tanaman".length);
        return {fragments:range.getClientRects().length,height:range.getBoundingClientRect().height};
      });
      assert(labelBox&&labelBox.fragments===1&&labelBox.height>0,
        `The entire word tanaman must stay on one rendered line at ${viewport.width}px: ${JSON.stringify(labelBox)}`);
      const vw=await page.evaluate(()=>document.documentElement.clientWidth);
      const sw=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth));
      assert(sw<=vw+1,`horizontal overflow at ${viewport.width}px`);
      const rects=await buttons.evaluateAll(nodes=>nodes.map(node=>{
        const x=node.getBoundingClientRect();
        return {x:x.x,y:x.y,width:x.width,height:x.height,right:x.right};
      }));
      for(const box of rects){
        assert(box.width>=44&&box.height>=44,`Choice touch target too small at ${viewport.width}px`);
        assert(box.x>=-1&&box.right<=vw+1,`Choice outside visible width at ${viewport.width}px`);
      }
      assert(rects[0].y<viewport.height-40,`First choice below fold at ${viewport.width}px`);
      mkdirSync(screenshots,{recursive:true});
      const shot=async state=>page.screenshot({path:path.join(screenshots,`${viewport.width}-child-choice-science-${state}.png`),fullPage:false});
      await shot("idle");
      await experience.getByRole("button",{name:"Cara main"}).click();
      assert.match(await experience.locator("[data-child-choice-help]").innerText(),/Sentuh pilihanmu/);
      await shot("help");
      await experience.getByRole("button",{name:"Tutup bantuan"}).click();
      await page.getByRole("button",{name:"🪨 batu"}).click();
      await page.getByRole("status").filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:3000});
      await shot("wrong");
      assert.equal(await page.locator("[data-activity-completion]").count(),0,"wrong answer must not complete");
      await page.getByRole("button",{name:"🌱 tanaman"}).click();
      const completion=page.locator("[data-activity-completion]");
      await completion.waitFor({state:"visible",timeout:3000});
      await shot("success");
      const before=await page.evaluate(id=>{
        const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}")["demo-gian"]??[];
        return attempts.filter(a=>a.activityId===id).length;
      },activityId);
      await completion.locator('[data-completion-action="again"]').click();
      await completion.waitFor({state:"hidden",timeout:3000});
      assert.equal(await buttons.filter({hasText:"🌱 tanaman"}).count(),1,"Again retains the canonical answer");
      assert.equal(await buttons.locator(":disabled").count(),0,"Again re-enables all choices");
      const after=await page.evaluate(id=>{
        const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}")["demo-gian"]??[];
        return attempts.filter(a=>a.activityId===id).length;
      },activityId);
      assert.equal(after,before,"Again itself cannot emit additional assessed evidence");
      assert.deepEqual(errors,[],`Page errors at ${viewport.width}px`);
    }finally{await context.close();}
  }finally{await browser.close();}
}
async function main(){
  startServer();await waitForServer();
  for(const viewport of viewports)await verify(viewport);
  console.log(`Child tap-choice visual QA PASS ${viewports.length} viewports: full-word tanaman, canonical question/choices, touch, wrong/success, Help, Again, no overflow.`);
}
main().catch(e=>{console.error(e);console.error(serverLog.slice(-5000));process.exitCode=1;}).finally(stopServer);
