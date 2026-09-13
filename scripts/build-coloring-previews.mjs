import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Rasterize the game's real paint regions; these previews do not invent art
// that differs from the activity the child will open.
const compiled=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','-p','tsconfig.learning-tests.json'],{stdio:'inherit'});
if(compiled.status!==0)process.exit(compiled.status??1);
const require=createRequire(import.meta.url);
const {ACTIVITIES}=require(path.resolve('.learning-test-dist/src/lib/learning/system.js'));
const {coloringScene}=require(path.resolve('.learning-test-dist/src/lib/learning/coloringScenes.js'));
const {drawingGuide,DRAWING_GUIDE_IDS}=require(path.resolve('.learning-test-dist/src/lib/learning/drawingGuides.js'));
const out=path.resolve('public/artwork/activity-previews');
mkdirSync(out,{recursive:true});
const palette=['#f6bd53','#7ac6c0','#f39576','#b7acd9','#99c987','#fffaf0'];
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const activity of ACTIVITIES.filter(a=>a.runtime==='coloring')) {
  const regions=coloringScene(activity.id);
  const content=regions.map((region,i)=>`<path d="${escape(region.path)}"${region.transform?` transform="${escape(region.transform)}"`:''} fill="${palette[i%palette.length]}" stroke="#284e50" stroke-width="4" stroke-linejoin="round"/>`).join('');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${content}</svg>`)).resize(480,360,{fit:'contain',background:{r:255,g:250,b:240,alpha:0}}).webp({quality:85}).toFile(path.join(out,`${activity.id}.webp`));
}
console.log('Rendered 100 coloring previews from the actual activity regions. This does not assert 100 unique illustrations.');
for(const id of DRAWING_GUIDE_IDS) {
  const guide=drawingGuide(id);
  const strokes=guide.paths.map(d=>`<path d="${escape(d)}" fill="none" stroke="#438781" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"${guide.mode==='dots'?' stroke-dasharray="5 12"':''}/>`).join('');
  const dots=(guide.dots??[]).map(([cx,cy],i)=>`<circle cx="${cx}" cy="${cy}" r="10" fill="${i===0?'#df704f':'#438781'}" stroke="white" stroke-width="3"/>`).join('');
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">${strokes}${dots}</svg>`)).resize(480,360,{fit:'contain',background:{r:255,g:250,b:240,alpha:0}}).webp({quality:85}).toFile(path.join(out,`${id}.webp`));
}
console.log(`Rendered ${DRAWING_GUIDE_IDS.length} drawing previews from real canvas scaffolds.`);
