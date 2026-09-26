import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root=process.cwd();
const manifest=JSON.parse(readFileSync(path.resolve("docs/data/MAINLAGI_APPROVED_SVG_SWEEP_SESSION14_2026-09-26.json"),"utf8"));
const characterRegistry=JSON.parse(readFileSync(path.resolve("src/lib/data/character-asset-provenance.json"),"utf8"));
const semanticRegistry=JSON.parse(readFileSync(path.resolve("src/lib/data/learning-illustration-asset-provenance.json"),"utf8"));

function walk(dir){
  const result=[];
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const absolute=path.join(dir,entry.name);
    if(entry.isDirectory()) result.push(...walk(absolute));
    else result.push(path.relative(root,absolute).replaceAll(path.sep,"/"));
  }
  return result;
}

const artworkFiles=walk(path.resolve("public/artwork"));
const publicArtworkSvg=artworkFiles.filter(file=>file.endsWith(".svg")).sort();
const publicArtworkWebp=artworkFiles.filter(file=>file.endsWith(".webp")).sort();

const approvedCharacterSvg=[];
for(const id of characterRegistry.characterIds){
  const record=characterRegistry.items[id];
  assert(record,`character provenance missing ${id}`);
  for(const state of characterRegistry.stateVocabulary){
    const variant=record.variants[state];
    assert(variant,`character variant missing ${id}/${state}`);
    assert.equal(variant.lifecycle,"approved",`${id}/${state} must remain approved`);
    assert.equal(variant.provenance?.redistributionAllowed,true,`${id}/${state} must retain redistribution approval`);
    assert.equal(variant.technical?.format,"svg",`${id}/${state} must remain vector-native`);
    assert(variant.productionPath?.endsWith(".svg"),`${id}/${state} production path must stay SVG`);
    const repoPath="public"+variant.productionPath;
    assert.equal(existsSync(path.resolve(repoPath)),true,`${repoPath} must exist`);
    approvedCharacterSvg.push(repoPath);
  }
}
assert.equal(approvedCharacterSvg.length,manifest.approvedVectorScope.characterStateSvg.count,"Session 14 character SVG count must match manifest");

const approvedSemanticSvg=[];
const heldSemantic=[];
for(const [semanticKey,record] of Object.entries(semanticRegistry.items)){
  if(record.lifecycle==="approved"){
    assert.equal(record.provenance?.redistributionAllowed,true,`${semanticKey} must retain redistribution approval`);
    assert.equal(record.productionAssets?.svg?.status,"approved",`${semanticKey} SVG must remain approved`);
    assert(record.productionAssets?.svg?.path?.endsWith(".svg"),`${semanticKey} production path must stay SVG`);
    const repoPath="public"+record.productionAssets.svg.path;
    assert.equal(existsSync(path.resolve(repoPath)),true,`${repoPath} must exist`);
    approvedSemanticSvg.push(repoPath);
  }else{
    heldSemantic.push(semanticKey);
    assert.equal(record.provenance?.redistributionAllowed,false,`${semanticKey} held key must remain redistribution-blocked`);
    assert.equal(record.productionAssets?.svg?.status,"held",`${semanticKey} held SVG status must remain held`);
    assert.equal(record.productionAssets?.svg?.path,null,`${semanticKey} held SVG must not gain a production path`);
  }
}
assert.equal(approvedSemanticSvg.length,manifest.approvedVectorScope.semanticSvg.count,"Session 14 semantic SVG count must match manifest");
assert.deepEqual(heldSemantic.sort(),[...manifest.heldSemanticVectors].sort(),"held semantic vector scope must remain exact");

const approvedArtworkSvg=[...approvedCharacterSvg,...approvedSemanticSvg].sort();
assert.deepEqual(
  publicArtworkSvg,
  approvedArtworkSvg,
  "every public artwork SVG must be provenance-approved and every approved artwork SVG must exist"
);
assert.equal(existsSync(path.resolve("src/app/icon.svg")),true,"app icon must remain a direct SVG");
assert.equal(publicArtworkSvg.length,49,"public artwork must contain exactly the 49 registry-approved SVGs at Session 14");

const semanticRollbackHistory=publicArtworkWebp.filter(file=>file.startsWith("public/artwork/learning-illustrations/"));
const legacyCharacterFallbackHistory=publicArtworkWebp.filter(file=>
  manifest.webpClassification.legacyCharacterFallbackHistory.paths.includes(file)
);
const categories={
  subjectBackgrounds:publicArtworkWebp.filter(file=>file.startsWith("public/artwork/backgrounds/")),
  activityPreviews:publicArtworkWebp.filter(file=>file.startsWith("public/artwork/activity-previews/")),
  referenceOnly:publicArtworkWebp.filter(file=>manifest.webpClassification.referenceOnly.paths.includes(file)),
  noApprovedCanonicalSvgSource:publicArtworkWebp.filter(file=>manifest.webpClassification.noApprovedCanonicalSvgSource.paths.includes(file))
};
const postProgramCoreThumbnails=publicArtworkWebp.filter(file=>file.startsWith("public/artwork/core-thumbnails/"));

assert.deepEqual(semanticRollbackHistory,[],"Session 15 must remove all semantic WebP rollback binaries");
assert.deepEqual(legacyCharacterFallbackHistory,[],"Session 15 must remove both legacy Garden character WebP binaries");

const historicalClassified=new Set(Object.values(categories).flat());
const historicalRetained=publicArtworkWebp.filter(file=>historicalClassified.has(file));
const unclassified=publicArtworkWebp.filter(file=>!historicalClassified.has(file)&&!postProgramCoreThumbnails.includes(file));
assert.deepEqual(unclassified,[],"every WebP must stay inside the historical Session 14/15 classes or the explicit post-program core-thumbnail class");
for(const [name,files] of Object.entries(categories)){
  assert.equal(files.length,manifest.webpClassification[name].count,`${name} retained WebP count must preserve Session 14 classification`);
}
assert.equal(historicalRetained.length,247,"Session 15 historical cleanup baseline must remain exactly 247 justified WebPs");
assert.equal(postProgramCoreThumbnails.length,31,"Core Thumbnail Wave 01 must add exactly 31 explicitly classified WebPs");
assert.equal(publicArtworkWebp.length,278,"current public artwork WebPs must equal 247 historical retained + 31 Wave 01 thumbnails");

const runtimeFiles=walk(path.resolve("src")).filter(file=>/\.(?:ts|tsx|css)$/.test(file));
const legacyCharacterRefs=[];
const semanticWebpRefs=[];
for(const file of runtimeFiles){
  const source=readFileSync(path.resolve(file),"utf8");
  if(
    source.includes("/artwork/garden-gavi.webp") ||
    source.includes("/artwork/garden-paca.webp") ||
    source.includes("/artwork/garden-${id}.webp")
  ){
    legacyCharacterRefs.push(file);
  }
  if(/\/artwork\/learning-illustrations\/[^"'\x60\s]+\.webp/.test(source)){
    semanticWebpRefs.push(file);
  }
}
assert.deepEqual(
  [...new Set(legacyCharacterRefs)].sort(),
  [],
  "Session 15 must remove every legacy Garden character WebP source reference"
);
assert.deepEqual(semanticWebpRefs,[],"normal TypeScript/CSS runtime must not directly consume semantic WebP history");

for(const file of manifest.migratedLegacyCharacterConsumers){
  const source=readFileSync(path.resolve(file),"utf8");
  assert(!source.includes("/artwork/garden-gavi.webp"),`${file} must not consume legacy Gavi WebP`);
  assert(!source.includes("/artwork/garden-paca.webp"),`${file} must not consume legacy Paca WebP`);
  assert(!source.includes("/artwork/garden-${id}.webp"),`${file} must not construct legacy character WebP paths`);
}

const commonSource=readFileSync(path.resolve("src/components/learning/LearningCommon.tsx"),"utf8");
assert.match(commonSource,/approvedCharacterRuntimeAsset\(id, "hero"\)/,"CharacterAvatar must use the approved SVG state bank");
assert.match(commonSource,/data-character-avatar-source=/,"CharacterAvatar must expose its asset source for regression QA");

const worldCss=readFileSync(path.resolve("src/components/learning/world-v2/MoneyWorldExperience.module.css"),"utf8");
assert.match(worldCss,/\/artwork\/characters\/paca-hero-v1\.svg/,"World ambient Paca must use direct SVG");
assert.match(worldCss,/\/artwork\/characters\/gavi-hero-v1\.svg/,"World ambient Gavi must use direct SVG");

const worldAssets=readFileSync(path.resolve("src/lib/learning/world/moneyWorldAssets.ts"),"utf8");
assert.match(worldAssets,/MONEY_WORLD_ASSET_PLAN_VERSION = "money-world-assets-v2"/,"World asset plan must record the SVG sweep generation");
assert.match(worldAssets,/currentSource: "\/artwork\/characters\/paca-hero-v1\.svg"/);
assert.match(worldAssets,/currentSource: "\/artwork\/characters\/gavi-hero-v1\.svg"/);

console.log("Session 14 approved-SVG sweep invariant PASS after Wave 01: 49 approved artwork SVGs unchanged, 247 historical justified WebPs preserved, 31 post-program core thumbnails explicitly classified, and retired semantic/legacy character WebPs remain absent.");
