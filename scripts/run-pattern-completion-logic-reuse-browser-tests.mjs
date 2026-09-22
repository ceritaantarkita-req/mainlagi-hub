import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdirSync} from "node:fs";
import path from "node:path";
import process from "node:process";
import {chromium} from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_PATTERN_COMPLETION_LOGIC_REUSE_QA_PORT??4067);
const baseUrl=`http://${host}:${port}`;
const route="/child/demo-gian/activity/logic-pattern-paired-blocks";
const activityId="logic-pattern-paired-blocks";
const correct="● ●";
const correctLabel=`Pilih ${correct}`;
const out=path.join(root,".mobile-route-qa");
const viewports=[{width:320,height:720},{width:390,height:844},{width:768,height:1024}];
let server=null;
let serverLog="";

function start(){
  const bin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[bin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:baseUrl,NEXT_PUBLIC_DATA_BACKEND:"local"},
    stdio:["ignore","pipe","pipe"]
  });
  const add=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",add);
  server.stderr.on("data",add);
}

async function ready(){
  const started=Date.now();
  while(Date.now()-started<60000){
    try{const response=await fetch(baseUrl+route);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error("Logic Pattern Completion server not ready\n"+serverLog.slice(-4000));
}

function stop(){if(server&&!server.killed)server.kill("SIGTERM");}

async function seed(context){
  await context.addInitScript(()=>{
    const childId="demo-gian";
    const seeds=[
      ["logic-match-identical-shapes","logic.relations.matching.basic","matching"],
      ["logic-classify-animal","logic.classification.visual.basic","tap_choice"],
      ["logic-odd-category-animal-vehicle","logic.discrimination.odd_one_out.basic","tap_choice"],
      ["logic-compare-more-dots","logic.comparison.visual.basic","tap_choice"],
      ["logic-rule-alternate-shapes","logic.sequence.rules.basic","tap_choice"]
    ];
    const requiredIds=seeds.map(([id])=>id);
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({[childId]:{completedActivityIds:requiredIds,stars:0,lastActivityId:requiredIds.at(-1)}}));
    const attempts=seeds.map(([seedActivityId,skillId,runtime],index)=>{
      const attemptId="qa-logic-pattern-prereq-"+index;
      const at="2026-09-22T02:0"+index+":00.000Z";
      return{
        id:attemptId,childId,activityId:seedActivityId,subjectId:"logic",
        stageId:"logic-classification-rules-basics",runtime,difficulty:2,status:"completed",assessed:true,
        score:1,accuracy:1,correctCount:runtime==="matching"?3:1,incorrectCount:0,hintCount:0,retryCount:0,
        durationMs:1000,inputMode:"touch",startedAt:at,completedAt:at,
        metadata:{source:"logic-pattern-completion-browser-prerequisite"},
        evidence:[{attemptId,activityId:seedActivityId,skillId,score:1,weight:1,createdAt:at,qualifiesForMastery:true}],
        masteryEligible:true
      };
    });
    localStorage.setItem("mainlagi-learning-attempts-v1",JSON.stringify({[childId]:attempts}));
  });
}

async function hydrated(page){
  await page.waitForLoadState("load");
  await page.waitForFunction(()=>{
    const scene=document.querySelector("[data-pattern-completion]");
    return scene?.getAttribute("data-pattern-completion-ready")==="true"&&scene.querySelectorAll("[data-pattern-choice]").length===3;
  },undefined,{timeout:6000});
  await page.waitForTimeout(80);
}

async function completed(page){
  return page.evaluate(id=>{
    const progress=JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1")??"{}");
    return(progress["demo-gian"]?.completedActivityIds??[]).includes(id);
  },activityId);
}

async function wrongKeyboard(page){
  for(let i=0;i<96;i+=1){
    await page.keyboard.press("Tab");
    const focused=await page.evaluate(()=>{
      const el=document.activeElement;
      return{
        inside:Boolean(el?.closest?.("[data-pattern-completion]")),
        choice:el?.getAttribute?.("data-pattern-choice")??"",
        tag:el?.tagName??"",
        label:el?.getAttribute?.("aria-label")??""
      };
    });
    if(focused.inside&&focused.choice&&focused.tag==="BUTTON"&&focused.label!==correctLabel){
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong Logic pattern candidate");
}

async function assertVisible(locator,viewportHeight,label){
  const box=await locator.boundingBox();
  assert(box,label+" must render");
  assert(box.y>=-1&&box.y+box.height<=viewportHeight+1,label+" must remain fully visible");
}

async function inspect(viewport){
  const browser=await chromium.launch({headless:true});
  try{
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width===390});
    await seed(context);
    const page=await context.newPage();
    const pageErrors=[];
    const consoleErrors=[];
    page.on("pageerror",error=>pageErrors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});

    const response=await page.goto(baseUrl+route,{waitUntil:"domcontentloaded",timeout:30000});
    assert(response&&response.status()<400,"Logic pattern completion bad HTTP at "+viewport.width);
    await hydrated(page);
    assert.equal(new URL(page.url()).pathname,route);

    const tokens=page.locator("[data-pattern-token]");
    assert.equal(await tokens.count(),3,"grouped-token activity renders three observed groups");
    assert.deepEqual(await tokens.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("data-pattern-token"))),["▲ ▲","● ●","▲ ▲"]);
    assert.equal(await page.locator("[data-pattern-slot]").getAttribute("aria-label"),"Slot berikutnya masih kosong");
    assert.equal(await completed(page),false,"idle Logic pattern activity cannot complete");

    const choices=page.locator("[data-pattern-choice]");
    assert.equal(await choices.count(),3);
    assert.deepEqual(await choices.evaluateAll(nodes=>nodes.map(node=>node.getAttribute("aria-label"))),["Pilih ● ●","Pilih ▲ ●","Pilih ■ ■"],"canonical grouped choice order is preserved");

    const viewportWidth=await page.evaluate(()=>document.documentElement.clientWidth);
    const viewportHeight=await page.evaluate(()=>window.innerHeight);
    const scrollWidth=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth));
    assert(scrollWidth<=viewportWidth+1,"Logic pattern activity overflows horizontally at "+viewport.width);
    for(const box of await choices.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{width:r.width,height:r.height,left:r.left,right:r.right};}))){
      assert(box.width>=44&&box.height>=44,"Logic pattern choices keep >=44px touch target");
      assert(box.left>=-1&&box.right<=viewportWidth+1,"Logic pattern choices remain inside viewport");
    }

    const status=page.getByRole("status");
    await assertVisible(status,viewportHeight,"idle Logic pattern feedback");
    mkdirSync(out,{recursive:true});
    await page.screenshot({path:path.join(out,`${viewport.width}-logic-pattern-completion-idle.png`),fullPage:false});

    const wrong=await wrongKeyboard(page);
    assert.notEqual(wrong,correctLabel);
    await status.filter({hasText:"Belum tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),false,"wrong grouped answer cannot complete");
    assert.equal(await page.locator("[data-pattern-slot]").getAttribute("aria-label"),wrong.replace(/^Pilih /,"Slot berikutnya berisi "));
    await page.screenshot({path:path.join(out,`${viewport.width}-logic-pattern-completion-try.png`),fullPage:false});

    const correctButton=page.getByRole("button",{name:correctLabel});
    if(viewport.width===390)await correctButton.tap(); else await correctButton.click();
    await status.filter({hasText:"Tepat"}).waitFor({state:"visible",timeout:2000});
    assert.equal(await completed(page),true,"correct grouped answer completes canonical Logic activity");
    assert.equal(await page.locator("[data-pattern-slot]").getAttribute("aria-label"),"Slot berikutnya berisi ● ●");

    const completion=page.locator("[data-activity-completion]");
    await completion.waitFor({state:"visible",timeout:2000});
    await assertVisible(status,viewportHeight,"success Logic pattern feedback");

    const attempt=await page.evaluate(id=>{
      const attempts=JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1")??"{}");
      const list=attempts["demo-gian"]??[];
      return[...list].reverse().find(item=>item.activityId===id);
    },activityId);
    assert(attempt,"Logic pattern completion records attempt evidence");
    assert.equal(attempt.assessed,true);
    assert.equal(attempt.metadata?.source,"pattern-completion-runtime");
    assert.equal(attempt.metadata?.evidenceFidelity,"choice_pattern_completion_interaction");
    assert.equal(attempt.metadata?.patternKind,"repeat_group_pairs");
    assert.equal(attempt.metadata?.visualMode,"symbol");
    assert.equal(attempt.metadata?.observedSequence,"▲ ▲|● ●|▲ ▲");
    assert.equal(attempt.correctCount,1);
    assert.equal(attempt.incorrectCount,1);
    assert.equal(attempt.retryCount,1);
    assert.equal(attempt.accuracy,0.5);
    assert(attempt.evidence?.some(item=>item.skillId==="logic.pattern.repeat.intermediate"),"Logic repeating-pattern skill evidence remains canonical");

    await page.screenshot({path:path.join(out,`${viewport.width}-logic-pattern-completion-success.png`),fullPage:false});
    assert.deepEqual(pageErrors,[],"page errors at "+viewport.width+": "+pageErrors.join(" | "));
    assert.deepEqual(consoleErrors,[],"console errors at "+viewport.width+": "+consoleErrors.join(" | "));
    await context.close();
  }finally{
    await browser.close();
  }
}

async function main(){
  start();
  await ready();
  for(const viewport of viewports)await inspect(viewport);
  console.log("Logic Pattern Completion reuse browser QA passed 320/390/768 with grouped-token order, keyboard retry, touch/pointer completion, touch targets and assessed evidence.");
}

main().catch(error=>{
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode=1;
}).finally(stop);
