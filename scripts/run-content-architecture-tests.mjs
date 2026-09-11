import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root=process.cwd();
const outDir=path.join(root,".learning-test-dist");
rmSync(outDir,{recursive:true,force:true});
const tscBin=path.join(root,"node_modules","typescript","bin","tsc");
const compile=spawnSync(process.execPath,[tscBin,"-p","tsconfig.learning-tests.json"],{cwd:root,stdio:"inherit"});
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const architecture=require(path.join(outDir,"src","lib","learning","contentArchitecture.js"));
const manifest=require(path.join(outDir,"src","lib","learning","contentManifest.js"));
const system=require(path.join(outDir,"src","lib","learning","system.js"));
const batch7=require(path.join(outDir,"src","lib","learning","mathBatch7.js"));
const batch8=require(path.join(outDir,"src","lib","learning","bahasaBatch8.js"));
const batch9=require(path.join(outDir,"src","lib","learning","englishBatch9.js"));
const batch10=require(path.join(outDir,"src","lib","learning","iqroBatch10.js"));
const batch10Authoring=require(path.join(outDir,"src","lib","learning","iqroBatch10Authoring.js"));
const batch11=require(path.join(outDir,"src","lib","learning","lettersBatch11.js"));
const batch12=require(path.join(outDir,"src","lib","learning","logicBatch12.js"));
const batch13=require(path.join(outDir,"src","lib","learning","scienceBatch13.js"));
const batch14=require(path.join(outDir,"src","lib","learning","creativeBatch14.js"));
const hijaiyah=require(path.join(outDir,"src","lib","engine","hijaiyah.js"));

const historical=["bahasa-cari-a","bahasa-cari-a-lagi","bahasa-cerita-teman","bahasa-dengar-a","bahasa-pasang-awal","bahasa-pasang-awal-lagi","color-gavi","color-paca","english-find-blue","english-find-blue-audio","english-listen-cat","english-listen-cat-2","english-match-hello","english-match-words-2","iqro-cari-alif","iqro-dengar-alif","iqro-motion-existing","iqro-pasang-alif","math-count-2","math-count-3","math-number-trace-motion","math-pattern-motion","math-pattern-touch","math-pattern-touch-2","math-trace-5-touch"].sort();
const batch6=["letters-find-a","letters-trace-a","letters-match-case","logic-match-pairs","logic-odd-one-out","logic-more-less","science-living-cat","science-match-habitat","science-find-plant"].sort();
const expected=[...historical,...batch6,...batch7.MATH_BATCH7_ACTIVITY_IDS,...batch8.BAHASA_BATCH8_ACTIVITY_IDS,...batch9.ENGLISH_BATCH9_ACTIVITY_IDS,...batch10.IQRO_BATCH10_ACTIVITY_IDS,...batch11.LETTERS_BATCH11_ACTIVITY_IDS,...batch12.LOGIC_BATCH12_ACTIVITY_IDS,...batch13.SCIENCE_BATCH13_ACTIVITY_IDS,...batch14.CREATIVE_BATCH14_ACTIVITY_IDS].sort();
const codes=(report)=>new Set(report.errors.map((item)=>item.code));
const clone=()=>structuredClone(architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL);
const batch11PracticeIds=new Set(["letters-stroke-vertical","letters-stroke-horizontal","letters-stroke-diagonal","letters-trace-g-practice","letters-trace-i-practice","letters-trace-m-practice","letters-trace-n-practice","letters-trace-o-practice","letters-trace-t-practice","letters-trace-u-practice","letters-trace-w-practice","letters-trace-z-practice"]);

function migration(name){return readFileSync(path.join(root,"supabase","migrations",name),"utf8");}
function assertWaveMigrationIds(waves,names){
  const migrations=names.map(migration);
  for(let waveIndex=0;waveIndex<waves.length;waveIndex++) for(const id of waves[waveIndex].activities.map((activity)=>activity.id)) assert.match(migrations[waveIndex],new RegExp(`'${id}'`));
  return migrations;
}

try {
  const report=architecture.assertContentArchitectureValid();
  assert.deepEqual(report.errors,[]);
  assert.deepEqual(report.stats,{subjects:9,paths:9,stages:46,lessons:197,packs:197,activities:900,skills:200,mechanics:8,assessedActivities:683,practiceActivities:217});
  assert.equal(report.warnings.length,22);
  assert.ok(report.warnings.every((item)=>item.code==="EXPERT_REVIEW_REQUIRED"));

  const runtimeIds=system.ACTIVITIES.map((item)=>item.id).sort();
  const packedIds=manifest.CONTENT_PACKS.flatMap((pack)=>pack.activities.map((activity)=>activity.activityId)).sort();
  assert.deepEqual(runtimeIds,expected);
  assert.deepEqual(packedIds,expected);
  assert.equal(new Set(runtimeIds).size,runtimeIds.length);

  assert.deepEqual(batch10.IQRO_BATCH10_WAVE_ACTIVITY_COUNTS,{A:21,B:25,C:25,D:25});
  assert.deepEqual(batch11.LETTERS_BATCH11_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch12.LOGIC_BATCH12_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch13.SCIENCE_BATCH13_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch14.CREATIVE_BATCH14_WAVE_ACTIVITY_COUNTS,{A:48,B:50,C:50,D:50});
  assert.equal(batch14.CREATIVE_BATCH14_ACTIVITY_IDS.length,198);
  assert.equal(batch14.CREATIVE_BATCH14_DRAWING_ACTIVITY_IDS.length,100);
  assert.equal(batch14.CREATIVE_BATCH14_COLOR_ACTIVITY_IDS.length,98);

  const canonicalByGlyph=new Map(hijaiyah.HIJAIYAH_TEMPLATES.map((letter)=>[letter.letter,letter]));
  assert.equal(batch10Authoring.IQRO_BATCH10_LETTERS.length,29);
  for(const letter of batch10Authoring.IQRO_BATCH10_LETTERS){
    const canonical=canonicalByGlyph.get(letter.glyph); assert.ok(canonical);
    assert.equal(canonical.latin,letter.latin); assert.equal(canonical.dots,letter.dots); assert.equal(canonical.dotZone,letter.dotZone);
  }

  const iqroPacks=manifest.CONTENT_PACKS.filter((pack)=>batch10.IQRO_BATCH10_CONTENT_PACKS.some((item)=>item.id===pack.id));
  assert.equal(iqroPacks.length,20); assert.ok(iqroPacks.every((pack)=>pack.reviewStatus==="expert_required"));
  const lettersPacks=manifest.CONTENT_PACKS.filter((pack)=>batch11.LETTERS_BATCH11_CONTENT_PACKS.some((item)=>item.id===pack.id));
  assert.equal(lettersPacks.length,23); assert.ok(lettersPacks.every((pack)=>pack.reviewStatus==="internal"));
  for(const pack of lettersPacks) for(const item of pack.activities){
    if(batch11PracticeIds.has(item.activityId)){assert.equal(item.assessment,"practice");assert.equal(item.evidenceContractId,"completion_only_v1");assert.equal(item.requiredForStage,false);}
    else {assert.equal(item.assessment,"assessed");assert.ok(["choice_accuracy_v1","matching_accuracy_v1"].includes(item.evidenceContractId));}
  }
  const logicPacks=manifest.CONTENT_PACKS.filter((pack)=>batch12.LOGIC_BATCH12_CONTENT_PACKS.some((item)=>item.id===pack.id));
  assert.equal(logicPacks.length,20); assert.ok(logicPacks.every((pack)=>pack.reviewStatus==="internal"));
  for(const pack of logicPacks) for(const item of pack.activities){assert.equal(item.assessment,"assessed");assert.ok(["choice_accuracy_v1","matching_accuracy_v1"].includes(item.evidenceContractId));}
  const sciencePacks=manifest.CONTENT_PACKS.filter((pack)=>batch13.SCIENCE_BATCH13_CONTENT_PACKS.some((item)=>item.id===pack.id));
  assert.equal(sciencePacks.length,20); assert.ok(sciencePacks.every((pack)=>pack.reviewStatus==="internal"));
  for(const pack of sciencePacks) for(const item of pack.activities){assert.equal(item.assessment,"assessed");assert.ok(["choice_accuracy_v1","matching_accuracy_v1"].includes(item.evidenceContractId));}

  const creativePacks=manifest.CONTENT_PACKS.filter((pack)=>batch14.CREATIVE_BATCH14_CONTENT_PACKS.some((item)=>item.id===pack.id));
  assert.equal(creativePacks.length,40); assert.ok(creativePacks.every((pack)=>pack.reviewStatus==="internal"));
  for(const pack of creativePacks) for(const item of pack.activities){
    assert.equal(item.assessment,"practice");
    assert.equal(item.evidenceContractId,"completion_only_v1");
    assert.ok(["drawing","coloring"].includes(item.mechanicId));
    assert.equal(item.mechanicId,pack.subjectId==="drawing"?"drawing":"coloring");
    assert.ok(item.skills.every((link)=>link.weight<1),`${item.activityId} creative practice weight must stay below assessed evidence weight`);
  }

  const dup=clone();
  const original=dup.activities.find((item)=>item.id==="math-count-3"); assert.ok(original);
  dup.activities.push({...original,id:"synthetic-reordered-duplicate",choices:[...original.choices].reverse()});
  assert.ok(codes(architecture.validateContentArchitecture(dup)).has("DUPLICATE_CONTENT"));
  const bad=clone();
  bad.activities=bad.activities.map((activity)=>activity.id==="math-count-3"?{...activity,correctChoice:"999"}:activity);
  assert.ok(codes(architecture.validateContentArchitecture(bad)).has("INVALID_CORRECT_CHOICE"));
  const badDrawing=clone();
  badDrawing.activities=badDrawing.activities.map((activity)=>activity.id==="drawing-line-vertical"?{...activity,drawingGuide:""}:activity);
  assert.ok(codes(architecture.validateContentArchitecture(badDrawing)).has("MISSING_DRAWING_GUIDE"));
  for(const pack of architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL.packs) for(const content of pack.activities) for(const assetRef of content.assetRefs??[]) assert.ok(existsSync(path.join(root,"public",assetRef.replace(/^\/+/,""))));

  const allMigrations=[];
  allMigrations.push(...assertWaveMigrationIds(batch7.MATH_BATCH7_WAVES,["0015_batch7_math_wave_a.sql","0016_batch7_math_wave_b.sql","0017_batch7_math_wave_c.sql","0018_batch7_math_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch8.BAHASA_BATCH8_WAVES,["0019_batch8_bahasa_wave_a.sql","0020_batch8_bahasa_wave_b.sql","0021_batch8_bahasa_wave_c.sql","0022_batch8_bahasa_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch9.ENGLISH_BATCH9_WAVES,["0023_batch9_english_wave_a.sql","0024_batch9_english_wave_b.sql","0025_batch9_english_wave_c.sql","0026_batch9_english_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch10.IQRO_BATCH10_WAVES,["0027_batch10_iqro_wave_a.sql","0028_batch10_iqro_wave_b.sql","0029_batch10_iqro_wave_c.sql","0030_batch10_iqro_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch11.LETTERS_BATCH11_WAVES,["0031_batch11_letters_wave_a.sql","0032_batch11_letters_wave_b.sql","0033_batch11_letters_wave_c.sql","0034_batch11_letters_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch12.LOGIC_BATCH12_WAVES,["0035_batch12_logic_wave_a.sql","0036_batch12_logic_wave_b.sql","0037_batch12_logic_wave_c.sql","0038_batch12_logic_wave_d.sql"]));
  allMigrations.push(...assertWaveMigrationIds(batch13.SCIENCE_BATCH13_WAVES,["0039_batch13_science_wave_a.sql","0040_batch13_science_wave_b.sql","0041_batch13_science_wave_c.sql","0042_batch13_science_wave_d.sql"]));
  const creativeMigrations=assertWaveMigrationIds(batch14.CREATIVE_BATCH14_WAVES,["0043_batch14_creative_wave_a.sql","0044_batch14_creative_wave_b.sql","0045_batch14_creative_wave_c.sql","0046_batch14_creative_wave_d.sql"]);
  assert.match(creativeMigrations[0],/subject_id in \('bahasa','english','math','iqro','letters','logic','science','color','drawing'\)/);
  for(const migrationText of creativeMigrations) assert.match(migrationText,/completion_only_v1/);
  allMigrations.push(...creativeMigrations);
  for(const migrationText of allMigrations) for(const legacy of ["learning_attempts","game_sessions","game_scores","progress"]) assert.doesNotMatch(migrationText,new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`,"i"));

  console.log("Batch 14 Creative Wave D content architecture and DB contracts passed.");
} catch(error){console.error(error);process.exit(1);} finally{rmSync(outDir,{recursive:true,force:true});}
