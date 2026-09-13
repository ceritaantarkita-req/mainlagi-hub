import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';

// Supplemental visual/interaction evidence; the full product crawl remains separate.
const base=process.env.MAINLAGI_GARDEN_QA_BASE_URL ?? 'http://127.0.0.1:3011';
const out=path.resolve('.qa-playroom/garden');
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const require=createRequire(import.meta.url);
const {getActivity}=require(path.resolve('.learning-test-dist/src/lib/learning/system.js'));
const report={status:'RUNNING',checks:[],screenshots:[]};
try {
  for(const viewport of [{width:1487,height:1058},{width:390,height:844},{width:360,height:800}]) {
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
    const capture=async(label)=>{
      await page.evaluate(()=>document.fonts.ready);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label}: no horizontal overflow`);
      assert(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),`${label}: images loaded`);
      const file=`${label}-${viewport.width}.png`;
      await page.screenshot({path:path.join(out,file),fullPage:true});
      report.screenshots.push(file);
    };
    await page.goto(base+'/child/demo-gian/activity/bahasa-cari-a');
    await page.getByRole('heading',{name:'Cari huruf A',exact:true}).waitFor();
    assert.equal(await page.getByRole('link',{name:'Kembali',exact:true}).count(),1,'back control retains an accessible name at compact widths');
    assert.equal(await page.getByRole('navigation',{name:'Navigasi anak'}).count(),0);
    const choices=page.locator('[data-choices] button');
    assert.equal(await choices.count(),3);
    const looks=await choices.evaluateAll(buttons=>buttons.map(el=>({bg:getComputedStyle(el).backgroundColor,height:el.getBoundingClientRect().height,font:parseFloat(getComputedStyle(el).fontSize)})));
    assert(looks.every(b=>b.height>=110&&b.font>=50),'large readable letter choices survive global CSS');
    assert.equal(new Set(looks.map(b=>b.bg)).size,1,'no correctness hint before selection');
    await capture('letters');
    await page.getByRole('button',{name:'B',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Belum tepat'}).waitFor();
    await page.getByRole('button',{name:'A',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Hebat!'}).waitFor();
    await page.getByRole('link',{name:'Pilih permainan lain'}).waitFor();
    await capture('letters-complete');
    report.checks.push(`letter sizing, neutral choices, wrong/correct feedback, completion navigation at ${viewport.width}`);
    await page.goto(base+'/child/demo-gian/activity/bahasa-pasang-awal');
    const matching=getActivity('bahasa-pasang-awal');
    const items=matching.matchItems;
    const cards=page.locator('button[aria-pressed]');
    await cards.first().waitFor();
    assert.equal(await cards.count(),items.length);
    await cards.nth(0).click();
    assert.equal(await cards.nth(0).getAttribute('aria-pressed'),'true');
    await cards.nth(0).click();
    assert.equal(await cards.nth(0).getAttribute('aria-pressed'),'false');
    const mismatch=items.findIndex(item=>item.pair!==items[0].pair);
    await cards.nth(0).click();await cards.nth(mismatch).click();
    await page.getByRole('status').filter({hasText:'Belum cocok'}).waitFor();
    for(const pair of new Set(items.map(item=>item.pair))) {
      for(const [index,item] of items.entries()) if(item.pair===pair) await cards.nth(index).click();
    }
    assert(await cards.evaluateAll(elements=>elements.every(el=>el.disabled)),'matched cards are complete and disabled');
    await page.getByRole('link',{name:'Pilih permainan lain'}).waitFor();
    await capture('matching-complete');
    report.checks.push(`matching selection, cancellation, mismatch, all pairs and completion at ${viewport.width}`);
    await page.goto(base+'/child/demo-gian/activity/math-count-3');
    await page.getByRole('button',{name:'3',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Kamu menemukan 3 apel'}).waitFor();
    await page.goto(base+'/child/demo-gian/activity/math-trace-5-touch');
    const trace=page.getByLabel('Area untuk menelusuri angka lima',{exact:true});
    await trace.waitFor();
    const bounds=await trace.boundingBox();
    const checkpoints=[[76,17],[61,17],[46,17],[32,19],[31,33],[31,47],[44,45],[59,46],[69,54],[71,66],[65,77],[53,83],[39,82],[29,75]];
    const xy=([x,y])=>({x:bounds.x+x*bounds.width/100,y:bounds.y+y*bounds.height/100});
    const first=xy(checkpoints[0]);await page.mouse.move(first.x,first.y);await page.mouse.down();
    for(const point of checkpoints.slice(1)){const p=xy(point);await page.mouse.move(p.x,p.y,{steps:12});}
    await page.mouse.up();
    await page.getByRole('status').filter({hasText:'Kamu mengikuti bentuk angka lima'}).waitFor();
    await capture('trace-complete');
    report.checks.push(`math count and measured digit trace pointer completion at ${viewport.width}`);
    await page.goto(base+'/child/demo-gian/activity/letters-trace-a');
    const writingCanvas=page.getByLabel('Area menulis huruf A',{exact:true});
    await writingCanvas.waitFor();
    const writingLayers=await writingCanvas.evaluate(canvas=>{
      const guide=canvas.previousElementSibling;
      const canvasStyle=getComputedStyle(canvas);
      const guideStyle=guide ? getComputedStyle(guide) : null;
      return {
        canvasZ:Number(canvasStyle.zIndex),
        guideZ:Number(guideStyle?.zIndex),
        canvasBackground:canvasStyle.backgroundColor,
      };
    });
    assert(writingLayers.canvasZ>writingLayers.guideZ,'writing stroke canvas stays above the letter guide');
    assert.equal(writingLayers.canvasBackground,'rgba(0, 0, 0, 0)','writing canvas stays transparent so the guide remains visible');
    const writingBounds=await writingCanvas.boundingBox();
    await page.mouse.move(writingBounds.x+writingBounds.width*.25,writingBounds.y+writingBounds.height*.8);
    await page.mouse.down();
    await page.mouse.move(writingBounds.x+writingBounds.width*.5,writingBounds.y+writingBounds.height*.18,{steps:12});
    await page.mouse.move(writingBounds.x+writingBounds.width*.75,writingBounds.y+writingBounds.height*.8,{steps:12});
    await page.mouse.up();
    assert.equal(await page.getByRole('button',{name:'Selesai',exact:true}).isEnabled(),true,'writing stroke enables completion');
    await capture('writing-layer');
    report.checks.push(`writing guide remains behind a visible child stroke at ${viewport.width}`);
    for(const [label,route] of [
      ['home','/child/demo-gian/home'],['subject','/child/demo-gian/subject/bahasa'],
      ['stage','/child/demo-gian/stage/bahasa-huruf'],['color','/child/demo-gian/activity/color-paca'],
      ['trace','/child/demo-gian/activity/math-trace-5-touch'],['math','/child/demo-gian/activity/math-count-3'],
      ['audio','/child/demo-gian/activity/bahasa-dengar-a'],['rewards','/child/demo-gian/rewards'],
      ['games','/child/demo-gian/games'],['parent','/parent'],['profiles','/child/select'],['account','/account']
    ]) {
      await page.goto(base+route);
      await page.locator('main').first().waitFor();
      await page.waitForTimeout(300);
      await capture(label);
    }
    assert.deepEqual(errors,[],'no browser console/page errors');
    report.checks.push(`12 additional page families, image health and overflow at ${viewport.width}`);
    await context.close();
  }
  report.status='PASS';
} catch(error) { report.status='FAIL';report.error=String(error.stack??error);process.exitCode=1; }
finally { await browser.close();writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2)); }
