import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".learning-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], { cwd: root, stdio: "inherit" });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const architecture = require(path.join(outDir, "src", "lib", "learning", "contentArchitecture.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const batch7 = require(path.join(outDir, "src", "lib", "learning", "mathBatch7.js"));

const historicalActivityIds = [
  "bahasa-cari-a","bahasa-cari-a-lagi","bahasa-cerita-teman","bahasa-dengar-a","bahasa-pasang-awal","bahasa-pasang-awal-lagi",
  "color-gavi","color-paca","english-find-blue","english-find-blue-audio","english-listen-cat","english-listen-cat-2","english-match-hello","english-match-words-2",
  "iqro-cari-alif","iqro-dengar-alif","iqro-motion-existing","iqro-pasang-alif","math-count-2","math-count-3","math-number-trace-motion","math-pattern-motion","math-pattern-touch","math-pattern-touch-2","math-trace-5-touch"
].sort();
const batch6ActivityIds = ["letters-find-a","letters-trace-a","letters-match-case","logic-match-pairs","logic-odd-one-out","logic-more-less","science-living-cat","science-match-habitat","science-find-plant"].sort();
const expectedCatalogActivityIds = [...historicalActivityIds, ...batch6ActivityIds, ...batch7.MATH_BATCH7_ACTIVITY_IDS].sort();

function codes(report) { return new Set(report.errors.map((item) => item.code)); }
function cloneModel() { return structuredClone(architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL); }

try {
  const report = architecture.assertContentArchitectureValid();
  assert.deepEqual(report.errors, [], "canonical content architecture must have no validation errors");
  assert.deepEqual(report.stats, { subjects: 8, paths: 8, stages: 11, lessons: 20, packs: 20, activities: 52, skills: 22, mechanics: 7, assessedActivities: 45, practiceActivities: 7 });
  assert.equal(report.warnings.length, 2, "only the two Iqro expert-review-required packs should warn");
  assert.ok(report.warnings.every((item) => item.code === "EXPERT_REVIEW_REQUIRED"));

  const runtimeIds = system.ACTIVITIES.map((item) => item.id).sort();
  const packedIds = manifest.CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => activity.activityId)).sort();
  assert.deepEqual(runtimeIds, expectedCatalogActivityIds, "Wave A runtime catalog must contain baseline plus 18 reviewed Math activities");
  assert.deepEqual(packedIds, expectedCatalogActivityIds, "every playable activity must have exactly one content-pack owner");
  for (const activityId of historicalActivityIds) assert.ok(runtimeIds.includes(activityId), `historical activity ${activityId} must remain stable`);
  assert.equal(batch7.MATH_BATCH7_ACTIVITY_IDS.length, 18);
  assert.equal(new Set(batch7.MATH_BATCH7_ACTIVITY_IDS).size, 18);

  assert.equal(manifest.makeContentPackId("math", "Number Recognition"), "math.pack.number-recognition");
  assert.equal(manifest.makeGeneratedActivityId("math.pack.number-recognition", "Count 4"), "math-number-recognition-count-4");
  assert.throws(() => manifest.makeContentPackId("math", "---"), /slug/i);

  const reorderedDuplicate = cloneModel();
  const original = reorderedDuplicate.activities.find((item) => item.id === "math-count-3");
  assert.ok(original);
  reorderedDuplicate.activities.push({ ...original, id: "synthetic-reordered-duplicate", choices: [...original.choices].reverse() });
  assert.ok(codes(architecture.validateContentArchitecture(reorderedDuplicate)).has("DUPLICATE_CONTENT"));

  const badAnswer = cloneModel();
  badAnswer.activities = badAnswer.activities.map((activity) => activity.id === "math-count-3" ? { ...activity, correctChoice: "999" } : activity);
  assert.ok(codes(architecture.validateContentArchitecture(badAnswer)).has("INVALID_CORRECT_CHOICE"));

  const badAssessment = cloneModel();
  const storyPack = badAssessment.packs.find((pack) => pack.id === "bahasa.pack.cerita-teman");
  assert.ok(storyPack);
  storyPack.activities[0].assessment = "assessed";
  storyPack.activities[0].evidenceContractId = "choice_accuracy_v1";
  assert.ok(codes(architecture.validateContentArchitecture(badAssessment)).has("ASSESSMENT_MECHANIC_MISMATCH"));

  const badSkill = cloneModel();
  const mathPack = badSkill.packs.find((pack) => pack.id === "math.pack.count-small");
  assert.ok(mathPack);
  mathPack.activities[0].skills[0].skillId = "math.unknown.synthetic";
  assert.ok(codes(architecture.validateContentArchitecture(badSkill)).has("UNKNOWN_SKILL"));

  const badAsset = cloneModel();
  const assetPack = badAsset.packs.find((pack) => pack.id === "english.pack.blue");
  assert.ok(assetPack);
  assetPack.activities[0].assetRefs = ["../private/secret.png"];
  assert.ok(codes(architecture.validateContentArchitecture(badAsset)).has("INVALID_ASSET_REF"));

  for (const pack of architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL.packs) {
    for (const content of pack.activities) {
      for (const assetRef of content.assetRefs ?? []) {
        const resolved = path.join(root, "public", assetRef.replace(/^\/+/, ""));
        assert.ok(existsSync(resolved), `${content.activityId} references missing asset ${assetRef}`);
      }
    }
  }

  const architectureMigration = readFileSync(path.join(root, "supabase", "migrations", "0011_scalable_content_architecture.sql"), "utf8");
  const batch6Migration = readFileSync(path.join(root, "supabase", "migrations", "0013_new_subject_curriculum_foundations.sql"), "utf8");
  const waveAMigration = readFileSync(path.join(root, "supabase", "migrations", "0015_batch7_math_wave_a.sql"), "utf8");
  assert.match(architectureMigration, /create table if not exists public\.learning_content_packs/i);
  for (const activityId of batch6ActivityIds) assert.match(batch6Migration, new RegExp(`'${activityId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
  for (const activityId of batch7.MATH_BATCH7_ACTIVITY_IDS) assert.match(waveAMigration, new RegExp(`'${activityId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`), `Wave A migration must register ${activityId}`);
  for (const migration of [architectureMigration, batch6Migration, waveAMigration]) {
    for (const legacy of ["learning_attempts", "game_sessions", "game_scores", "progress"]) {
      assert.doesNotMatch(migration, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `content migrations must preserve ${legacy}`);
    }
  }

  console.log("Batch 7 Math Wave A content architecture, IDs, evidence, duplicate, asset, and DB contracts passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
