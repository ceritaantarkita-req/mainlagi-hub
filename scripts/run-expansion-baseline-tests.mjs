import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
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
const system=require(path.join(outDir,"src","lib","learning","system.js"));
const curriculum=require(path.join(outDir,"src","lib","learning","curriculum.js"));
const catalog=require(path.join(outDir,"src","lib","learning","catalog.js"));
const manifest=require(path.join(outDir,"src","lib","learning","contentManifest.js"));
const batch7=require(path.join(outDir,"src","lib","learning","mathBatch7.js"));
const batch8=require(path.join(outDir,"src","lib","learning","bahasaBatch8.js"));
const batch9=require(path.join(outDir,"src","lib","learning","englishBatch9.js"));
const batch10=require(path.join(outDir,"src","lib","learning","iqroBatch10.js"));
const batch11=require(path.join(outDir,"src","lib","learning","lettersBatch11.js"));
const batch12=require(path.join(outDir,"src","lib","learning","logicBatch12.js"));
const batch13=require(path.join(outDir,"src","lib","learning","scienceBatch13.js"));
const batch14=require(path.join(outDir,"src","lib","learning","creativeBatch14.js"));

const targets=Object.freeze({bahasa:100,english:100,math:100,iqro:100,letters:100,logic:100,science:100,color:100,drawing:100});
const countBy=(items,key)=>items.reduce((c,i)=>{c[i[key]]=(c[i[key]]??0)+1;return c;},{});
const batch11PracticeIds=new Set(["letters-stroke-vertical","letters-stroke-horizontal","letters-stroke-diagonal","letters-trace-g-practice","letters-trace-i-practice","letters-trace-m-practice","letters-trace-n-practice","letters-trace-o-practice","letters-trace-t-practice","letters-trace-u-practice","letters-trace-w-practice","letters-trace-z-practice"]);

try {
  const coverage=curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds,[]);
  assert.deepEqual(coverage.uncoveredActivityIds,[]);
  const activityCounts=countBy(system.ACTIVITIES,"subjectId");
  const runtimeCounts=countBy(system.ACTIVITIES,"runtime");
  const assessmentCounts=countBy(Object.values(catalog.ACTIVITY_LEARNING_SPECS),"assessment");
  const packedContentById=new Map(manifest.CONTENT_PACKS.flatMap((pack)=>pack.activities.map((item)=>[item.activityId,item])));

  assert.equal(system.SUBJECTS.length,9);
  assert.equal(system.ACTIVITIES.length,900,"Batch 14 Wave D must close the catalog at 900 activities");
  assert.equal(system.STAGES.length,46,"Batch 14 Wave D must raise the catalog to 46 stages");
  assert.equal(curriculum.LEARNING_PATHS.length,9);
  assert.equal(curriculum.LEARNING_LESSONS.length,197);
  assert.equal(manifest.CONTENT_PACKS.length,197);
  assert.equal(catalog.LEARNING_SKILLS.length,200);

  for(const [id,target] of Object.entries(targets)) assert.equal(activityCounts[id],target,`${id} must close at exactly ${target}`);

  assert.deepEqual(batch7.MATH_BATCH7_WAVE_ACTIVITY_COUNTS,{A:18,B:25,C:25,D:25});
  assert.deepEqual(batch8.BAHASA_BATCH8_WAVE_ACTIVITY_COUNTS,{A:19,B:25,C:25,D:25});
  assert.deepEqual(batch9.ENGLISH_BATCH9_WAVE_ACTIVITY_COUNTS,{A:19,B:25,C:25,D:25});
  assert.deepEqual(batch10.IQRO_BATCH10_WAVE_ACTIVITY_COUNTS,{A:21,B:25,C:25,D:25});
  assert.deepEqual(batch11.LETTERS_BATCH11_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch12.LOGIC_BATCH12_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch13.SCIENCE_BATCH13_WAVE_ACTIVITY_COUNTS,{A:22,B:25,C:25,D:25});
  assert.deepEqual(batch14.CREATIVE_BATCH14_WAVE_ACTIVITY_COUNTS,{A:48,B:50,C:50,D:50});
  assert.equal(batch14.CREATIVE_BATCH14_ACTIVITY_IDS.length,198);
  assert.equal(batch14.CREATIVE_BATCH14_DRAWING_ACTIVITY_IDS.length,100);
  assert.equal(batch14.CREATIVE_BATCH14_COLOR_ACTIVITY_IDS.length,98);
  assert.equal(new Set(batch14.CREATIVE_BATCH14_ACTIVITY_IDS).size,198);

  assert.deepEqual(runtimeCounts,{tap_choice:481,listen_and_choose:76,matching:125,trace:14,story:1,motion_game:3,coloring:100,drawing:100});
  assert.deepEqual(assessmentCounts,{assessed:683,practice:217});

  for(const id of batch11.LETTERS_BATCH11_ACTIVITY_IDS){
    const spec=catalog.getActivityLearningSpec(id); assert.ok(spec,`${id} needs a learning spec`);
    if(batch11PracticeIds.has(id)){assert.equal(spec.assessment,"practice");assert.equal(spec.requiredForStage,false);}else assert.equal(spec.assessment,"assessed");
  }
  for(const id of batch12.LOGIC_BATCH12_ACTIVITY_IDS){const spec=catalog.getActivityLearningSpec(id);assert.ok(spec);assert.equal(spec.assessment,"assessed");}
  for(const id of batch13.SCIENCE_BATCH13_ACTIVITY_IDS){const spec=catalog.getActivityLearningSpec(id);assert.ok(spec);assert.equal(spec.assessment,"assessed");}
  for(const id of batch14.CREATIVE_BATCH14_ACTIVITY_IDS){
    const spec=catalog.getActivityLearningSpec(id);assert.ok(spec,`${id} needs a learning spec`);assert.equal(spec.assessment,"practice",`${id} must remain completion-only creative practice`);
    const packed=packedContentById.get(id);assert.ok(packed,`${id} must belong to a content pack`);assert.equal(packed.evidenceContractId,"completion_only_v1",`${id} must not manufacture mastery evidence`);
  }

  const drawing=system.ACTIVITIES.filter((activity)=>activity.subjectId==="drawing");
  const coloring=system.ACTIVITIES.filter((activity)=>activity.subjectId==="color");
  assert.equal(drawing.length,100);
  assert.equal(coloring.length,100);
  assert.ok(drawing.every((activity)=>String(activity.runtime)==="drawing"));
  assert.ok(coloring.every((activity)=>String(activity.runtime)==="coloring"));

  const audio=readFileSync(path.join(root,"src","lib","audio","AudioManager.ts"),"utf8");
  assert.match(audio,/mainlagi-speech-latency/);
  console.log("Mainlagi Expansion Batch 14 Creative Wave D contracts passed.");
} catch(error){console.error(error);process.exit(1);}
