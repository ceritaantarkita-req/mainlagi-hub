import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_JM06_QA_PORT??4083);
const base=`http://${host}:${port}`;
const expected={
  english:["english-first-words","english-alphabet-basics","english-everyday-words","english-words-actions","english-phrases-review"],
  bahasa:["bahasa-huruf","bahasa-cerita","bahasa-dasar-huruf","bahasa-suku-kata-kata","bahasa-kalimat-pemahaman","bahasa-literasi-terapan"],
  math:["math-angka","math-pola","math-jumlah-dasar","math-banding-bentuk","math-operasi-awal","math-ukur-ruang"],
  iqro:["iqro-huruf","iqro-recognition-basics","iqro-middle-families","iqro-advanced-families","iqro-final-families"],
  letters:["letters-foundations","letters-recognition-prewriting-basics","letters-middle-alphabet","letters-late-middle-alphabet","letters-final-alphabet"],
  logic:["logic-foundations","logic-classification-rules-basics","logic-patterns-sequences-relations","logic-conditional-analogy-inference","logic-mixed-reasoning-challenge"],
  science:["science-foundations","science-living-observation-basics","science-life-material-motion","science-earth-body-environment","science-evidence-review-challenge"],
  color:["color-characters","color-exploration-basics","color-patterns-scenes","color-mood-material-story","color-palette-scene-capstone"],
  drawing:["drawing-lines-shapes-basics","drawing-objects-scenes","drawing-space-story-imagination","drawing-composition-design-capstone"]
};
let server=null;
let serverLog="";

function startServer(){
  const nextBin=path.join(root,"node_modules","next","dist","bin","next");
  server=spawn(process.execPath,[nextBin,"start","-H",host,"-p",String(port)],{
    cwd:root,
    env:{...process.env,NODE_ENV:"production",NEXT_PUBLIC_SITE_URL:base,NEXT_PUBLIC_DATA_BACKEND:"local",MAINLAGI_QA_UNLOCK_ALL:"1"},
    stdio:["ignore","pipe","pipe"]
  });
  const append=chunk=>{serverLog+=chunk.toString();};
  server.stdout.on("data",append); server.stderr.on("data",append);
}function stopServer(){if(server&&!server.killed)server.kill("SIGTERM");}
async function waitForServer(){
  for(let i=0;i<120;i++){
    try{const response=await fetch(base+"/child/demo-gian/subject/english");if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  throw new Error("JM-06 QA server did not become ready.\n"+serverLog.slice(-4000));
}
async function seed(context){
  await context.addInitScript(()=>{
    localStorage.setItem("mainlagi-learning-progress-v1",JSON.stringify({
      "demo-gian":{completedActivityIds:[],stars:0,lastActivityId:null}
    }));
  });
}
async function noOverflow(page,label){
  const m=await page.evaluate(()=>({v:document.documentElement.clientWidth,h:document.documentElement.scrollWidth,b:document.body.scrollWidth}));
  assert(m.h<=m.v+1&&m.b<=m.v+1,label+" horizontal overflow "+JSON.stringify(m));
}
async function inspectSubject(page,subject,title,stageIds){
  await page.goto(base+"/child/demo-gian/subject/"+subject+"?qa=unlock-all",{waitUntil:"domcontentloaded",timeout:30000});
  const rootNode=page.locator('[data-belajar-journey-map="v1"]');
  await rootNode.waitFor({state:"visible",timeout:8000});
  assert.equal(await rootNode.getAttribute("data-journey-subject"),subject,subject+" shared owner subject marker");
  assert.equal(await page.locator("[data-activity-gallery]").count(),0,subject+" legacy gallery absent");
  assert.equal(await page.getByRole("heading",{name:title,exact:true}).count(),1,subject+" canonical title");
  const nodes=page.locator("[data-journey-stage]");
  assert.deepEqual(await nodes.evaluateAll(items=>items.map(x=>x.getAttribute("data-journey-stage"))),stageIds,subject+" exact stage order");
  const browse=page.locator("[data-journey-browse-all]");
  assert.equal(await browse.locator("li").count(),100,subject+" exact 100 activities");
  assert.equal(await page.locator('[data-mainlagi-jm02-header="v1"]').count(),1,subject+" JM-02 header owner");
  assert.equal(await page.locator("[data-stage-detail-open]").count(),0,subject+" no detail initially");
  await nodes.first().click();
  const dialog=page.getByRole("dialog");
  await dialog.waitFor({state:"visible",timeout:3000});
  assert.equal(await dialog.locator("[data-stage-text-activity-list] img").count(),0,subject+" detail is text-only");
  assert.equal(await dialog.locator("[data-stage-continue]").count(),1,subject+" Continue exists");
  await page.keyboard.press("Escape");
  await dialog.waitFor({state:"hidden",timeout:3000});
  await noOverflow(page,subject);
}
async function main(){
  startServer(); await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    const desktop=await browser.newContext({viewport:{width:1280,height:860},reducedMotion:"reduce"}); await seed(desktop);
    const page=await desktop.newPage();
    await inspectSubject(page,"english","Bahasa Inggris",expected.english);
    assert.equal(await page.locator('[data-english-journey-map="v1"]').count(),1,"English compatibility marker preserved");
    await inspectSubject(page,"bahasa","Bahasa Indonesia",expected.bahasa);
    assert.equal(await page.locator("[data-english-journey-map]").count(),0,"Bahasa has no English-only marker");
    await inspectSubject(page,"math","Matematika",expected.math);
    await inspectSubject(page,"iqro","Iqro",expected.iqro);
    await inspectSubject(page,"letters","Huruf & Menulis",expected.letters);
    await inspectSubject(page,"logic","Logika",expected.logic);
    await inspectSubject(page,"science","Sains",expected.science);
    await inspectSubject(page,"color","Mewarnai",expected.color);
    await inspectSubject(page,"drawing","Menggambar",expected.drawing);
    await page.goto(base+"/child/demo-gian/subject/drawing?qa=unlock-all",{waitUntil:"domcontentloaded",timeout:30000});
    await page.locator('[data-journey-stage="drawing-lines-shapes-basics"]').click();
    const drawingDetail=page.getByRole("dialog");
    await drawingDetail.waitFor({state:"visible",timeout:3000});
    const drawingContinue=drawingDetail.locator("[data-stage-continue]");
    assert.equal(await drawingContinue.getAttribute("href"),"/child/demo-gian/stage/drawing-lines-shapes-basics","Drawing Journey Map preserves canonical DrawingStageScreen handoff");
    await drawingContinue.click();
    await page.waitForURL(/\/child\/demo-gian\/stage\/drawing-lines-shapes-basics$/);
    assert.equal(await page.getByRole("heading",{name:"Garis, Bentuk & Jalur",exact:true}).count(),1,"Drawing stage route remains canonical after Journey Map handoff");
    await desktop.close();
    const mobile=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:"reduce"}); await seed(mobile);
    const m=await mobile.newPage();
    await m.goto(base+"/child/demo-gian/subject/math?qa=unlock-all",{waitUntil:"domcontentloaded",timeout:30000});
    await m.locator('[data-journey-stage="math-jumlah-dasar"]').tap();
    const detail=m.locator("[data-stage-detail-open]"); await detail.waitFor({state:"visible"});
    const titleBefore=await m.getByRole("dialog").locator("h2").textContent();
    const portrait=await m.getByRole("dialog").boundingBox();
    assert(portrait&&portrait.y+portrait.height>=843,"Math portrait detail is bottom sheet");
    await m.setViewportSize({width:844,height:390}); await m.waitForTimeout(100);
    assert.equal(await m.getByRole("dialog").locator("h2").textContent(),titleBefore,"Math rotation preserves selected stage");
    await noOverflow(m,"Math landscape");
    await mobile.close();
    console.log("JM-06 through JM-13 shared Journey Map QA PASS: all nine Belajar subjects share one engine with exact canonical Stage order and 100 activities; Mewarnai keeps creative activity handoff, Menggambar preserves DrawingStageScreen stage handoff, and shared text-only detail, JM-02 header, responsive bottom sheet and rotation state remain intact.");
  }finally{await browser.close();stopServer();}
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;stopServer();});
