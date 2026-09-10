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
const compile = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const architecture = require(path.join(outDir, "src", "lib", "learning", "contentArchitecture.js"));
const manifest = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const system = require(path.join(outDir, "src", "lib", "learning", "system.js"));

const historicalActivityIds = [
  "bahasa-cari-a",
  "bahasa-cari-a-lagi",
  "bahasa-cerita-teman",
  "bahasa-dengar-a",
  "bahasa-pasang-awal",
  "bahasa-pasang-awal-lagi",
  "color-gavi",
  "color-paca",
  "english-find-blue",
  "english-find-blue-audio",
  "english-listen-cat",
  "english-listen-cat-2",
  "english-match-hello",
  "english-match-words-2",
  "iqro-cari-alif",
  "iqro-dengar-alif",
  "iqro-motion-existing",
  "iqro-pasang-alif",
  "math-count-2",
  "math-count-3",
  "math-number-trace-motion",
  "math-pattern-motion",
  "math-pattern-touch",
  "math-pattern-touch-2",
  "math-trace-5-touch"
].sort();

const batch6ActivityIds = [
  "letters-find-a",
  "letters-trace-a",
  "letters-match-case",
  "logic-match-pairs",
  "logic-odd-one-out",
  "logic-more-less",
  "science-living-cat",
  "science-match-habitat",
  "science-find-plant"
].sort();

const expectedCatalogActivityIds = [...historicalActivityIds, ...batch6ActivityIds].sort();

function codes(report) {
  return new Set(report.errors.map((item) => item.code));
}

function cloneModel() {
  return structuredClone(architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL);
}

try {
  const report = architecture.assertContentArchitectureValid();
  assert.deepEqual(report.errors, [], "canonical content architecture must have no validation errors");
  assert.deepEqual(report.stats, {
    subjects: 8,
    paths: 8,
    stages: 10,
    lessons: 16,
    packs: 16,
    activities: 34,
    skills: 18,
    mechanics: 7,
    assessedActivities: 28,
    practiceActivities: 6
  });
  assert.equal(report.warnings.length, 2, "only the two explicit Iqro expert-review-required packs should warn after Batch 6");
  assert.ok(report.warnings.every((item) => item.code === "EXPERT_REVIEW_REQUIRED"));

  const runtimeIds = system.ACTIVITIES.map((item) => item.id).sort();
  const packedIds = manifest.CONTENT_PACKS.flatMap((pack) => pack.activities.map((activity) => activity.activityId)).sort();
  assert.deepEqual(runtimeIds, expectedCatalogActivityIds, "Batch 6 catalog must contain the 25 historical IDs plus nine intentional starter activities");
  assert.deepEqual(packedIds, expectedCatalogActivityIds, "every playable activity must have exactly one content-pack owner");
  for (const activityId of historicalActivityIds) {
    assert.ok(runtimeIds.includes(activityId), `historical activity ${activityId} must remain stable`);
  }

  assert.equal(manifest.makeContentPackId("math", "Number Recognition"), "math.pack.number-recognition");
  assert.equal(manifest.makeGeneratedActivityId("math.pack.number-recognition", "Count 4"), "math-number-recognition-count-4");
  assert.equal(
    manifest.makeGeneratedActivityId("math.pack.number-recognition", "Count 4"),
    manifest.makeGeneratedActivityId("math.pack.number-recognition", "Count 4"),
    "generated IDs must be deterministic"
  );
  assert.throws(() => manifest.makeContentPackId("math", "---"), /slug/i);

  const reorderedDuplicate = cloneModel();
  const original = reorderedDuplicate.activities.find((item) => item.id === "math-count-3");
  assert.ok(original);
  reorderedDuplicate.activities.push({
    ...original,
    id: "synthetic-reordered-duplicate",
    choices: [...original.choices].reverse()
  });
  const duplicateReport = architecture.validateContentArchitecture(reorderedDuplicate);
  assert.ok(codes(duplicateReport).has("DUPLICATE_CONTENT"), "reordering the same playable answers must be detected as duplicate content");

  const badAnswer = cloneModel();
  badAnswer.activities = badAnswer.activities.map((activity) =>
    activity.id === "math-count-3" ? { ...activity, correctChoice: "999" } : activity
  );
  assert.ok(codes(architecture.validateContentArchitecture(badAnswer)).has("INVALID_CORRECT_CHOICE"), "answer validation must reject an answer outside choices");

  const badAssessment = cloneModel();
  const storyPack = badAssessment.packs.find((pack) => pack.id === "bahasa.pack.cerita-teman");
  assert.ok(storyPack);
  storyPack.activities[0].assessment = "assessed";
  storyPack.activities[0].evidenceContractId = "choice_accuracy_v1";
  assert.ok(codes(architecture.validateContentArchitecture(badAssessment)).has("ASSESSMENT_MECHANIC_MISMATCH"), "completion-only mechanics must not silently become assessed");

  const badSkill = cloneModel();
  const mathPack = badSkill.packs.find((pack) => pack.id === "math.pack.count-small");
  assert.ok(mathPack);
  mathPack.activities[0].skills[0].skillId = "math.unknown.synthetic";
  assert.ok(codes(architecture.validateContentArchitecture(badSkill)).has("UNKNOWN_SKILL"), "skill links must resolve to the canonical taxonomy");

  const badAsset = cloneModel();
  const assetPack = badAsset.packs.find((pack) => pack.id === "english.pack.blue");
  assert.ok(assetPack);
  assetPack.activities[0].assetRefs = ["../private/secret.png"];
  assert.ok(codes(architecture.validateContentArchitecture(badAsset)).has("INVALID_ASSET_REF"), "content assets must stay within safe public-root references");

  for (const pack of architecture.DEFAULT_CONTENT_ARCHITECTURE_MODEL.packs) {
    for (const content of pack.activities) {
      for (const assetRef of content.assetRefs ?? []) {
        const resolved = path.join(root, "public", assetRef.replace(/^\/+/, ""));
        assert.ok(existsSync(resolved), `${content.activityId} references missing asset ${assetRef}`);
      }
    }
  }

  const architectureMigration = readFileSync(path.join(root, "supabase", "migrations", "0011_scalable_content_architecture.sql"), "utf8");
  assert.match(architectureMigration, /create table if not exists public\.learning_content_packs/i, "content-pack DB catalog must be additive");
  assert.match(architectureMigration, /add column if not exists content_pack_id/i);
  assert.match(architectureMigration, /add column if not exists lesson_id/i);
  assert.match(architectureMigration, /add column if not exists mechanic_id/i);
  assert.match(architectureMigration, /add column if not exists evidence_contract/i);
  assert.match(architectureMigration, /add column if not exists content_revision/i);
  assert.match(architectureMigration, /review_status in \('internal','expert_required','expert_approved'\)/i, "DB must preserve explicit review state");
  for (const activityId of historicalActivityIds) {
    assert.match(architectureMigration, new RegExp(`'${activityId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`), `Batch 4 DB migration must backfill historical activity ${activityId}`);
  }
  assert.doesNotMatch(architectureMigration, /alter\s+table\s+public\.learning_activities[\s\S]*drop\s+column/i, "Batch 4 must not destructively drop learning activity columns");

  const batch6Migration = readFileSync(path.join(root, "supabase", "migrations", "0013_new_subject_curriculum_foundations.sql"), "utf8");
  for (const activityId of batch6ActivityIds) {
    assert.match(batch6Migration, new RegExp(`'${activityId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`), `Batch 6 migration must register ${activityId}`);
  }
  for (const subjectId of ["letters", "logic", "science"]) {
    assert.match(batch6Migration, new RegExp(`'${subjectId}'`), `Batch 6 migration must include subject ${subjectId}`);
  }

  for (const migration of [architectureMigration, batch6Migration]) {
    for (const legacy of ["learning_attempts", "game_sessions", "game_scores", "progress"]) {
      assert.doesNotMatch(migration, new RegExp(`drop\\s+table(?:\\s+if\\s+exists)?\\s+public\\.${legacy}`, "i"), `content migrations must preserve ${legacy}`);
    }
  }

  console.log("Scalable content manifest, Batch 6 subjects, IDs, hierarchy, mechanics, evidence, duplicate, asset, and DB contracts passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
