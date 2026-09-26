import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root=process.cwd();
const host="127.0.0.1";
const port=Number(process.env.MAINLAGI_SVG_SWEEP_SESSION14_QA_PORT??4062);
const baseUrl=`http://${host}:${port}`;
const outDir=path.join(root,".mobile-route-qa","svg-sweep-session14");
const viewports=[{width:390,height:844},{width:1280,height:900}];
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
    try{const response=await fetch(baseUrl);if(response.status<500)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,400));
  }
  throw new Error(`Session 14 browser server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function assertHeroCast(page,selector,label){
  const cast=page.locator(selector);
  await cast.waitFor({state:"visible",timeout:8000});
  const images=cast.locator("img[data-character-asset-source]");
  assert.equal(await images.count(),2,`${label} must render Gavi + Paca`);
  await images.evaluateAll(nodes=>Promise.all(nodes.map(node=>node.decode())));
  const snapshot=await images.evaluateAll(nodes=>nodes.map(node=>({
    id:node.getAttribute("data-character-id"),
    state:node.getAttribute("data-character-state"),
    source:node.getAttribute("data-character-asset-source"),
    src:node.getAttribute("src"),
    naturalWidth:node.naturalWidth,
    naturalHeight:node.naturalHeight
  })));
  assert.deepEqual(snapshot.map(item=>item.id),["gavi","paca"],`${label} keeps canonical pair order`);
  assert(snapshot.every(item=>item.state==="hero"),`${label} uses hero state`);
  assert(snapshot.every(item=>item.source==="svg-state"),`${label} must use SVG state assets`);
  assert.deepEqual(
    snapshot.map(item=>item.src),
    ["/artwork/characters/gavi-hero-v1.svg","/artwork/characters/paca-hero-v1.svg"],
    `${label} must use approved direct SVG paths`
  );
  assert(snapshot.every(item=>item.naturalWidth>0&&item.naturalHeight>0),`${label} SVGs must decode`);
}

async function runViewport(browser,viewport){
  const context=await browser.newContext({viewport,reducedMotion:"reduce"});
  const page=await context.newPage();
  const pageErrors=[];
  const consoleErrors=[];
  const legacyRequests=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text());});
  page.on("request",request=>{
    const pathname=new URL(request.url()).pathname;
    if(pathname==="/artwork/garden-gavi.webp"||pathname==="/artwork/garden-paca.webp")legacyRequests.push(pathname);
  });

  await page.goto(baseUrl+"/",{waitUntil:"domcontentloaded",timeout:30000});
  await assertHeroCast(page,'[data-session14-vector-cast="public-home"]',`public home ${viewport.width}`);
  mkdirSync(outDir,{recursive:true});
  await page.screenshot({path:path.join(outDir,`${viewport.width}-public-home.png`),fullPage:false});

  await page.goto(baseUrl+"/login",{waitUntil:"domcontentloaded",timeout:30000});
  await assertHeroCast(page,'[data-session14-vector-cast="auth"]',`auth shell ${viewport.width}`);

  await page.goto(baseUrl+"/child/select",{waitUntil:"domcontentloaded",timeout:30000});
  const avatars=page.locator("[data-character-avatar-id]");
  await avatars.first().waitFor({state:"visible",timeout:8000});
  const avatarSnapshot=await avatars.evaluateAll(nodes=>nodes.map(node=>({
    id:node.getAttribute("data-character-avatar-id"),
    state:node.getAttribute("data-character-avatar-state"),
    source:node.getAttribute("data-character-avatar-source"),
    src:node.querySelector("img")?.getAttribute("src")??null
  })));
  assert(avatarSnapshot.length>0,`child select must expose guide avatars at ${viewport.width}`);
  assert(avatarSnapshot.every(item=>item.state==="hero"&&item.source==="svg-state"),`all visible guide avatars must resolve approved hero SVGs at ${viewport.width}`);
  assert(avatarSnapshot.every(item=>item.src?.startsWith("/artwork/characters/")&&item.src.endsWith("-hero-v1.svg")),`guide avatar paths must be canonical SVG at ${viewport.width}`);

  await page.goto(baseUrl+"/child/demo-gian/rewards",{waitUntil:"domcontentloaded",timeout:30000});
  await assertHeroCast(page,'[data-session14-vector-cast="rewards"]',`rewards ${viewport.width}`);

  await page.goto(baseUrl+"/child/demo-gian/world/money-festival/stage/money-stage-01-money-use",{waitUntil:"domcontentloaded",timeout:30000});
  const decor=page.locator("[data-world-ambience-stage]").first();
  await decor.waitFor({state:"visible",timeout:10000});
  const pseudo=await decor.evaluate(node=>({
    before:getComputedStyle(node,"::before").backgroundImage,
    after:getComputedStyle(node,"::after").backgroundImage
  }));
  assert.match(pseudo.before,/\/artwork\/characters\/paca-hero-v1\.svg/,`World ambient Paca must use direct SVG at ${viewport.width}`);
  assert.match(pseudo.after,/\/artwork\/characters\/gavi-hero-v1\.svg/,`World ambient Gavi must use direct SVG at ${viewport.width}`);
  await page.screenshot({path:path.join(outDir,`${viewport.width}-world-stage.png`),fullPage:false});

  assert.deepEqual(legacyRequests,[],`Session 14 surfaces must not request legacy Garden character WebPs at ${viewport.width}: ${legacyRequests.join(", ")}`);
  assert.deepEqual(pageErrors,[],`Session 14 page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors,[],`Session 14 console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
  await context.close();
}

async function main(){
  startServer();
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    for(const viewport of viewports)await runViewport(browser,viewport);
    console.log("Session 14 approved-SVG browser QA passed at 390/1280: public/auth/profile/rewards/World ambient character surfaces use approved direct SVGs with zero legacy Garden character WebP requests.");
  }finally{
    await browser.close();
    stopServer();
  }
}
main().catch(error=>{console.error(error);console.error(serverLog.slice(-6000));process.exitCode=1;}).finally(stopServer);
