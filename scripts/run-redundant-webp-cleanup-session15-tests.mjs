import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root=process.cwd();
const manifest=JSON.parse(readFileSync(path.resolve("docs/data/MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_2026-09-26.json"),"utf8"));
const semanticRegistry=JSON.parse(readFileSync(path.resolve("src/lib/data/learning-illustration-asset-provenance.json"),"utf8"));
const session14Manifest=JSON.parse(readFileSync(path.resolve("docs/data/MAINLAGI_APPROVED_SVG_SWEEP_SESSION14_2026-09-26.json"),"utf8"));

function walk(dir){
  if(!existsSync(dir)) return [];
  const result=[];
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const absolute=path.join(dir,entry.name);
    if(entry.isDirectory()) result.push(...walk(absolute));
    else result.push(path.relative(root,absolute).replaceAll(path.sep,"/"));
  }
  return result;
}

assert.equal(manifest.session,"15");
assert.equal(manifest.totalRemovedFiles,16);
assert.equal(manifest.deletionCandidates.semanticWebpHistory.count,14);
assert.equal(manifest.deletionCandidates.legacyCharacterWebpFallback.count,2);
assert.equal(manifest.retainedWebp.total,247);

const removedPaths=[
  ...manifest.deletionCandidates.semanticWebpHistory.items.map(item=>item.path),
  ...manifest.deletionCandidates.legacyCharacterWebpFallback.items.map(item=>item.path)
].sort();
assert.equal(new Set(removedPaths).size,16,"Session 15 deletion candidates must remain unique");
for(const file of removedPaths){
  assert.equal(existsSync(path.resolve(file)),false,`${file} must be physically absent after Session 15`);
}

const semanticDir=path.resolve("public/artwork/learning-illustrations");
const semanticFiles=walk(semanticDir);
assert.equal(semanticFiles.filter(file=>file.endsWith(".webp")).length,0,"semantic production directory must contain zero WebP binaries after Session 15");
assert.equal(semanticFiles.filter(file=>file.endsWith(".svg")).length,14,"semantic production directory must retain exactly 14 approved SVG binaries");

const cleanupByKey=new Map(manifest.deletionCandidates.semanticWebpHistory.items.map(item=>[item.semanticKey,item]));
let approvedCount=0;
let retiredCount=0;
for(const [key,record] of Object.entries(semanticRegistry.items)){
  if(record.lifecycle!=="approved") continue;
  approvedCount++;
  const history=record.productionAssets?.webp;
  const svg=record.productionAssets?.svg;
  const cleanup=cleanupByKey.get(key);
  assert(cleanup,`${key} must exist in Session 15 cleanup manifest`);
  assert(history,`${key} must retain WebP history metadata`);
  assert.equal(history.status,"retired",`${key} WebP history status must be retired`);
  assert.equal(history.format,"webp");
  assert.equal("public"+history.path,cleanup.path,`${key} historical WebP path must remain exact`);
  assert.equal(history.sha256,cleanup.registrySha256,`${key} historical WebP SHA must remain exact`);
  assert.equal(history.retiredAt,"2026-09-26",`${key} retiredAt must remain exact`);
  assert.match(history.retirementReason??"",/Session 15/,`${key} must explain Session 15 retirement`);
  assert.equal(existsSync(path.resolve("public"+history.path)),false,`${key} retired WebP binary must stay absent`);
  retiredCount++;

  assert.equal(svg?.status,"approved",`${key} SVG must remain approved`);
  assert(svg?.path?.endsWith(".svg"),`${key} SVG path must remain direct`);
  assert.equal(existsSync(path.resolve("public"+svg.path)),true,`${key} approved SVG must remain present`);
}
assert.equal(approvedCount,14);
assert.equal(retiredCount,14);

for(const key of manifest.heldSemanticVectors){
  const record=semanticRegistry.items[key];
  assert.equal(record.lifecycle,"review-required",`${key} must remain held`);
  assert.equal(record.productionAssets?.webp,null,`${key} must not gain WebP history/production binding`);
  assert.equal(record.productionAssets?.svg?.status,"held",`${key} SVG must remain held`);
  assert.equal(record.productionAssets?.svg?.path,null,`${key} held SVG path must remain null`);
}

const artworkWebps=walk(path.resolve("public/artwork")).filter(file=>file.endsWith(".webp")).sort();
const subjectBackgrounds=artworkWebps.filter(file=>file.startsWith("public/artwork/backgrounds/"));
const activityPreviews=artworkWebps.filter(file=>file.startsWith("public/artwork/activity-previews/"));
const referenceOnly=artworkWebps.filter(file=>manifest.retainedWebp.referenceOnly.paths.includes(file));
const noApprovedVector=artworkWebps.filter(file=>session14Manifest.webpClassification.noApprovedCanonicalSvgSource.paths.includes(file));
assert.equal(subjectBackgrounds.length,manifest.retainedWebp.subjectBackgrounds.count);
assert.equal(activityPreviews.length,manifest.retainedWebp.activityPreviews.count);
assert.equal(referenceOnly.length,manifest.retainedWebp.referenceOnly.count);
assert.equal(noApprovedVector.length,manifest.retainedWebp.noApprovedCanonicalSvgSource.count);

const retainedSet=new Set([...subjectBackgrounds,...activityPreviews,...referenceOnly,...noApprovedVector]);
const unclassified=artworkWebps.filter(file=>!retainedSet.has(file));
assert.deepEqual(unclassified,[],"no retained WebP may sit outside a justified Session 15 class");
assert.equal(artworkWebps.length,247,"Session 15 must leave exactly 247 justified public artwork WebPs");

const runtimeFiles=walk(path.resolve("src")).filter(file=>/\.(?:ts|tsx|css)$/.test(file));
const forbiddenRuntimeRefs=[];
for(const file of runtimeFiles){
  const source=readFileSync(path.resolve(file),"utf8");
  if(
    source.includes("/artwork/garden-gavi.webp") ||
    source.includes("/artwork/garden-paca.webp") ||
    /\/artwork\/learning-illustrations\/[^"'\x60\s]+\.webp/.test(source) ||
    source.includes("legacy-webp") ||
    source.includes("approvedLegacyCharacterRuntimeAsset") ||
    source.includes("approvedCharacterRuntimeSrc")
  ){
    forbiddenRuntimeRefs.push(file);
  }
}
assert.deepEqual(forbiddenRuntimeRefs,[],"runtime source must contain zero retired character/semantic WebP dependencies");

const characterAssets=readFileSync(path.resolve("src/lib/learning/characterAssets.ts"),"utf8");
assert.doesNotMatch(characterAssets,/CHARACTER_ASSET_REGISTRY|runtimeSrc|legacy-webp|garden-(gavi|paca)\.webp/);
assert.match(characterAssets,/requested approved state -> hero -> welcome -> null/);

const publicArtworkSvg=walk(path.resolve("public/artwork")).filter(file=>file.endsWith(".svg"));
assert.equal(publicArtworkSvg.length,49,"Session 15 must preserve all 49 approved public artwork SVGs");
assert.equal(semanticRegistry.runtimeActivation,"controlled-svg");

console.log("Session 15 redundant-WebP cleanup PASS: 16 redundant binaries absent, 14 semantic WebP histories retired as metadata, 49 approved public artwork SVGs preserved, 3 semantic keys held, and exactly 247 justified WebPs retained.");
