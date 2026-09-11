import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".batch17-final-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [
  tscBin,
  "-p",
  "tsconfig.learning-tests.json",
  "--outDir",
  outDir
], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const curriculum = require(path.join(outDir, "src", "lib", "learning", "curriculum.js"));
const catalog = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const batch15 = require(path.join(outDir, "src", "lib", "learning", "batch15.js"));

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const workflow = readFileSync(path.join(root, ".github", "workflows", "ci.yml"), "utf8");
const deviceQa = readFileSync(path.join(root, "docs", "BATCH16_PHYSICAL_DEVICE_QA.md"), "utf8");

const countBy = (items, key) => items.reduce((counts, item) => {
  const value = item[key];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

try {
  // Final catalog / curriculum shape.
  assert.equal(system.SUBJECTS.length, 9, "final release must keep exactly 9 first-class subjects");
  assert.equal(system.ACTIVITIES.length, 900, "final release must keep exactly 900 playable activities");
  assert.equal(system.STAGES.length, 46, "final release must keep 46 stages");
  assert.equal(curriculum.LEARNING_PATHS.length, 9, "final release must keep 9 learning paths");
  assert.equal(curriculum.LEARNING_LESSONS.length, 197, "final release must keep 197 lessons");
  assert.equal(manifest.CONTENT_PACKS.length, 197, "final release must keep 197 content packs");
  assert.equal(catalog.LEARNING_SKILLS.length, 200, "final release must keep 200 active skills");

  const subjectCounts = countBy(system.ACTIVITIES, "subjectId");
  for (const subjectId of ["bahasa", "english", "math", "iqro", "letters", "logic", "science", "color", "drawing"]) {
    assert.equal(subjectCounts[subjectId], 100, `${subjectId} must remain exactly 100 activities`);
  }

  const activityIds = system.ACTIVITIES.map((activity) => activity.id);
  assert.equal(new Set(activityIds).size, activityIds.length, "activity IDs must remain globally unique");

  const stageIds = system.STAGES.map((stage) => stage.id);
  assert.equal(new Set(stageIds).size, stageIds.length, "stage IDs must remain globally unique");

  const lessonIds = curriculum.LEARNING_LESSONS.map((lesson) => lesson.id);
  assert.equal(new Set(lessonIds).size, lessonIds.length, "lesson IDs must remain globally unique");

  const packIds = manifest.CONTENT_PACKS.map((pack) => pack.id);
  assert.equal(new Set(packIds).size, packIds.length, "content-pack IDs must remain globally unique");

  const packedActivities = manifest.CONTENT_PACKS.flatMap((pack) => pack.activities.map((item) => ({ packId: pack.id, ...item })));
  const packedIds = packedActivities.map((item) => item.activityId);
  assert.equal(new Set(packedIds).size, packedIds.length, "an activity must not be duplicated across content packs");
  assert.equal(packedIds.length, system.ACTIVITIES.length, "every activity must have exactly one content-pack reference");
  assert.deepEqual(new Set(packedIds), new Set(activityIds), "content-pack references must exactly cover the playable catalog");

  for (const activity of system.ACTIVITIES) {
    const spec = catalog.ACTIVITY_LEARNING_SPECS[activity.id];
    assert.ok(spec, `${activity.id} must have a learning/evidence spec`);
    assert.ok(spec.assessment === "assessed" || spec.assessment === "practice", `${activity.id} has invalid assessment classification`);
  }

  const assessmentCounts = countBy(Object.values(catalog.ACTIVITY_LEARNING_SPECS), "assessment");
  assert.deepEqual(assessmentCounts, { assessed: 683, practice: 217 }, "final assessed/practice split must stay 683/217");

  const runtimeCounts = countBy(system.ACTIVITIES, "runtime");
  assert.deepEqual(runtimeCounts, {
    tap_choice: 481,
    listen_and_choose: 76,
    matching: 125,
    trace: 14,
    story: 1,
    motion_game: 3,
    coloring: 100,
    drawing: 100
  }, "final runtime inventory drifted");

  const packedById = new Map(packedActivities.map((item) => [item.activityId, item]));
  for (const activity of system.ACTIVITIES.filter((item) => item.subjectId === "drawing" || item.subjectId === "color")) {
    assert.equal(catalog.ACTIVITY_LEARNING_SPECS[activity.id]?.assessment, "practice", `${activity.id} must remain creative practice`);
    assert.equal(packedById.get(activity.id)?.evidenceContractId, "completion_only_v1", `${activity.id} must remain completion-only evidence`);
  }

  assert.deepEqual(batch15.batch15CatalogScaleSnapshot(), {
    subjects: 9,
    activities: 900,
    assessedActivities: 683,
    practiceActivities: 217,
    skills: 200
  }, "Batch 15 scale snapshot must still match the final catalog");

  const coverage = curriculum.getCurriculumCoverage();
  assert.deepEqual(coverage.uncoveredStageIds, [], "all stages must remain covered by curriculum");
  assert.deepEqual(coverage.uncoveredActivityIds, [], "all activities must remain covered by curriculum");

  // Final test wiring. These are behavior suites already exercised by the engine gate;
  // Batch 17 makes their presence part of the release contract so they cannot silently disappear.
  const requiredLearningScripts = [
    "test:learning:core",
    "test:learning:curriculum",
    "test:learning:content-architecture",
    "test:learning:mechanics",
    "test:learning:adaptive-v2",
    "test:learning:runtime-measurement",
    "test:learning:parent-insights",
    "test:learning:awards-report",
    "test:learning:outbox",
    "test:learning:schema",
    "test:learning:isolation",
    "test:learning:expansion-baseline",
    "test:learning:batch15",
    "test:batch16:security",
    "test:batch16:build"
  ];
  for (const script of requiredLearningScripts) {
    assert.equal(typeof packageJson.scripts?.[script], "string", `${script} must remain wired in package.json`);
  }
  assert.match(packageJson.scripts["test:learning"], /test:learning:outbox/);
  assert.match(packageJson.scripts["test:learning"], /test:learning:isolation/);
  assert.match(packageJson.scripts["test:learning"], /test:learning:expansion-baseline/);
  assert.match(packageJson.scripts["test:learning"], /test:learning:batch15/);

  // Required CI/release topology.
  for (const jobName of [
    "Secret history scan",
    "Quality gate (Ubuntu)",
    "Production build",
    "Mobile route QA (Chromium)",
    "Windows compatibility",
    "Production dependency audit",
    "Production smoke (Cloudflare)"
  ]) {
    assert.ok(workflow.includes(`name: ${jobName}`), `CI must retain ${jobName}`);
  }
  assert.match(workflow, /Batch 16 security boundary regressions[\s\S]*npm run test:batch16:security/);
  assert.match(workflow, /Batch 16 production JS and lazy-load budgets[\s\S]*npm run test:batch16:build/);
  assert.match(workflow, /Run canonical mobile route, accessibility, and lazy-load matrix[\s\S]*npm run test:ui:mobile-routes/);
  assert.match(workflow, /EXPECTED_SHA:\s*\$\{\{ github\.sha \}\}/);
  assert.match(workflow, /EXPECTED_SUPABASE_PROJECT_REF:\s*estvtgflwkebomsqlolv/);
  assert.match(workflow, /"dataBackend":"supabase"/);
  assert.match(workflow, /"siteUrl":"https:\/\/mainlagihub\.my\.id"/);

  // Physical-device evidence remains intentionally external to headless CI.
  const pendingMatches = deviceQa.match(/\bPENDING\b/g) ?? [];
  assert.ok(deviceQa.includes("physical iPhone"), "device matrix must retain physical iPhone coverage");
  assert.ok(deviceQa.includes("physical Android"), "device matrix must retain physical Android coverage");
  assert.ok(deviceQa.includes("VoiceOver") && deviceQa.includes("TalkBack"), "device matrix must retain assistive-tech coverage");
  assert.ok(deviceQa.includes("camera") && deviceQa.includes("Audio") && deviceQa.includes("Trace/touch"), "device matrix must retain camera/audio/touch coverage");

  console.log(JSON.stringify({
    status: "PASS",
    subjects: system.SUBJECTS.length,
    activities: system.ACTIVITIES.length,
    assessed: assessmentCounts.assessed,
    practice: assessmentCounts.practice,
    stages: system.STAGES.length,
    lessons: curriculum.LEARNING_LESSONS.length,
    packs: manifest.CONTENT_PACKS.length,
    skills: catalog.LEARNING_SKILLS.length,
    deviceMatrixPendingTokens: pendingMatches.length,
    physicalDeviceCertification: pendingMatches.length === 0 ? "RECORDED" : "PENDING_EXTERNAL_EVIDENCE"
  }));
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
