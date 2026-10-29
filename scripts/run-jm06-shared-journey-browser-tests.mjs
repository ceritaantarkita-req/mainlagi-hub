import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
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
async function assertHeaderDropdowns(page){
  const product=page.locator("[data-mainlagi-product-nav]");
  const trigger=product.locator("[data-mainlagi-left-menu-trigger]");
  await trigger.click();
  const drawer=product.locator("[data-mainlagi-left-menu-drawer]");
  await drawer.waitFor({state:"visible",timeout:3000});
  const productMenu=drawer.locator("nav");
  const productMetrics=await drawer.evaluate(node=>{
    const rect=node.getBoundingClientRect();
    const labels=[...node.querySelectorAll("strong")].map(label=>{
      const labelRect=label.getBoundingClientRect();
      return {
        text:label.textContent?.trim()??"",
        width:labelRect.width,
        scrollWidth:label.scrollWidth
      };
    });
    return {
      x:rect.x,
      width:rect.width,
      height:rect.height,
      viewport:innerWidth,
      scrollWidth:node.scrollWidth,
      clientWidth:node.clientWidth,
      labels
    };
  });
  assert(productMetrics.x<=1,"JM-02 desktop product drawer must anchor to the left edge: "+JSON.stringify(productMetrics));
  assert(productMetrics.width>=300,"JM-02 desktop product drawer must remain readable: "+JSON.stringify(productMetrics));
  assert(productMetrics.scrollWidth<=productMetrics.clientWidth+1,"JM-02 product drawer must not overflow horizontally: "+JSON.stringify(productMetrics));
  assert(productMetrics.labels.every(label=>label.scrollWidth<=label.width+1),
    "JM-02 product drawer labels must stay readable: "+JSON.stringify(productMetrics.labels));
  assert.equal(await productMenu.locator('[data-mainlagi-shop-slot="parent-gated"]').count(),1,"JM-02 Shop parent gate remains visible");
  await page.keyboard.press("Escape");
  assert.equal(await product.locator("[data-mainlagi-left-menu-drawer]").count(),0,"JM-02 product drawer closes with Escape");

  const profile=page.locator("[data-mainlagi-profile-menu]");
  await profile.locator("summary").click();
  const profileMenu=profile.locator("div").first();
  await profileMenu.waitFor({state:"visible",timeout:3000});
  const profileWidth=await profileMenu.evaluate(node=>node.getBoundingClientRect().width);
  assert(profileWidth>=240,"JM-02 desktop profile menu must not collapse: "+profileWidth);
  await page.keyboard.press("Escape");
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
  assert.equal(await page.locator('[data-journey-map-track] svg[aria-hidden="true"]').count(),1,subject+" scenic trail must render once");
  const mapBackground=await page.locator('[data-journey-map-track]').evaluate(node=>getComputedStyle(node.parentElement).backgroundImage);
  assert.match(mapBackground,/\/artwork\/backgrounds\//,subject+" journey uses existing subject illustration, not a blank diagram");
  const browse=page.locator("[data-journey-browse-all]");
  assert.equal(await browse.locator("li").count(),100,subject+" exact 100 activities");
  assert.equal(await page.locator('[data-mainlagi-jm02-header="v1"]').count(),1,subject+" JM-02 header owner");
  assert.equal(await page.locator("[data-stage-detail-open]").count(),0,subject+" no detail initially");
  const opener=nodes.first();
  await opener.click();
  const dialog=page.getByRole("dialog");
  await dialog.waitFor({state:"visible",timeout:3000});
  assert.equal(await dialog.locator("[data-stage-text-activity-list] img").count(),0,subject+" detail is text-only");
  assert.equal(await dialog.locator("[data-stage-continue]").count(),1,subject+" Continue exists");
  const close=dialog.getByRole("button",{name:"Tutup detail stage"});
  await page.waitForFunction(()=>
    document.activeElement?.getAttribute("aria-label")==="Tutup detail stage",
    undefined,{timeout:3000});
  assert.equal(await close.evaluate(el=>el===document.activeElement),true,subject+" dialog receives keyboard focus");
  await page.keyboard.press("Shift+Tab");
  assert.equal(await dialog.locator("[data-stage-continue]").evaluate(el=>el===document.activeElement),true,
    subject+" Shift+Tab wraps to last available dialog action, not background controls");
  await page.keyboard.press("Tab");
  assert.equal(await close.evaluate(el=>el===document.activeElement),true,
    subject+" Tab wraps from final action to close button");
  await page.keyboard.press("Escape");
  await dialog.waitFor({state:"hidden",timeout:3000});
  await page.waitForFunction(()=>
    document.activeElement?.hasAttribute("data-journey-stage"),
    undefined,{timeout:3000});
  assert.equal(await opener.evaluate(el=>el===document.activeElement),true,
    subject+" closing returns focus to the exact selected Stage");
  await noOverflow(page,subject);
}
async function verifyDrawingStageSharedCatalog(browser) {
  const route="/child/demo-gian/stage/drawing-lines-shapes-basics";
  const screenshotDir=path.join(root,".drawing-stage-qa");
  mkdirSync(screenshotDir,{recursive:true});
  for(const viewport of [{width:320,height:720},{width:390,height:844},{width:768,height:1024},{width:1280,height:860}]) {
    const context=await browser.newContext({viewport,reducedMotion:"reduce",hasTouch:viewport.width<=390});
    await seed(context);
    try {
      const page=await context.newPage();
      const errors=[];
      page.on("pageerror",e=>errors.push(e.message));
      const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
      assert(response&&response.status()<400,"Drawing Stage route must load at "+viewport.width);
      const stage=page.locator('[data-mainlagi-stage-screen]');
      await stage.waitFor({state:"visible",timeout:8000});
      await page.waitForLoadState("load");
      assert.equal(new URL(page.url()).pathname,route,"Drawing Stage guard must preserve the stage route");
      assert.equal(await stage.locator("h1").count(),1,"Drawing Stage shares one canonical catalog title");
      assert.equal((await stage.locator("h1").innerText()).trim(),"Garis, Bentuk & Jalur","canonical Drawing title must not change");
      assert.equal(await stage.locator("[data-stage-readiness]").count(),1,"shared Stage progress/readiness visible for Drawing");
      const lessons=stage.locator("[data-stage-lesson]");
      assert(await lessons.count()>=1,"Drawing uses the shared lesson sections");
      const cards=stage.locator('[data-stage-activity-card="true"]');
      assert(await cards.count()>=1,"Drawing keeps actual playable activities");
      const hrefs=await cards.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")));
      assert(hrefs.every(href=>href?.startsWith("/child/demo-gian/activity/drawing-")),
        "Drawing Stage links must retain canonical creative activity routes: "+JSON.stringify(hrefs));
      const firstBox=await cards.first().boundingBox();
      assert(firstBox&&firstBox.width>=44&&firstBox.height>=44,"Drawing Stage first card remains touch accessible");
      if(viewport.width<=390) {
        assert(firstBox.y>=-1&&firstBox.y+Math.min(firstBox.height,80)<=viewport.height-40,
          `The first Drawing activity must appear with at least 80px of its card above the phone bottom edge *without scrolling* at ${viewport.width}px: ${JSON.stringify(firstBox)}`);
      }
      await noOverflow(page,"Drawing shared catalog "+viewport.width);
      await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-drawing-stage-catalog-idle.png`),fullPage:false});
      await cards.first().scrollIntoViewIfNeeded();
      const visible=await cards.first().boundingBox();
      assert(visible&&visible.x>=-1&&visible.x+visible.width<=viewport.width+1,
        "Drawing card must fit horizontally at "+viewport.width);
      await page.screenshot({path:path.join(screenshotDir,`${viewport.width}-drawing-stage-catalog-first-card.png`),fullPage:false});
      assert.deepEqual(errors,[],"Drawing Stage must not emit page errors at "+viewport.width);
    }finally{await context.close();}
  }
}

async function main(){
  startServer(); await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    const desktop=await browser.newContext({viewport:{width:1280,height:860},reducedMotion:"reduce"}); await seed(desktop);
    const page=await desktop.newPage();
    await inspectSubject(page,"english","Bahasa Inggris",expected.english);
    await assertHeaderDropdowns(page);
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
    await verifyDrawingStageSharedCatalog(browser);
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
    console.log("JM-06 through JM-13 shared Journey Map QA PASS: all nine Belajar subjects share one engine with exact canonical Stage order and 100 activities; Mewarnai keeps creative activity handoff, Menggambar keeps DrawingStageScreen route while using the shared Stage catalog, and shared text-only detail, JM-02 header, responsive bottom sheet and rotation state remain intact.");
  }finally{await browser.close();stopServer();}
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;stopServer();});
