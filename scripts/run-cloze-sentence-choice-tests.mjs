import assert from "node:assert/strict";
import { rmSync } from "node:fs";
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
const { ACTIVITIES } = require(path.join(outDir, "src", "lib", "learning", "system.js"));
const { getActivityLearningSpec } = require(path.join(outDir, "src", "lib", "learning", "catalog.js"));
const { CONTENT_PACKS } = require(path.join(outDir, "src", "lib", "learning", "contentManifest.js"));
const { BAHASA_BATCH8_WAVE_D } = require(path.join(outDir, "src", "lib", "learning", "bahasaBatch8WaveD.js"));
const { gameplayPattern } = require(path.join(outDir, "src", "lib", "learning", "gameplayPresentation.js"));
const {
  clozeSentenceChoiceConfig,
  isClozeSentenceChoiceActivity,
  parseClozeSentencePrompt
} = require(path.join(outDir, "src", "lib", "learning", "clozeSentenceChoiceConfig.js"));

const expected = new Map([
  ["bahasa-lengkap-ayah-minum", { prompt: "Ayah minum ___ setelah berolahraga.", choices: ["air", "bantal", "sepatu"], correctChoice: "air", requiredForStage: true, before: "Ayah minum", after: "setelah berolahraga." }],
  ["bahasa-lengkap-burung-terbang", { prompt: "Burung ___ di langit.", choices: ["berenang", "terbang", "membaca"], correctChoice: "terbang", requiredForStage: false, before: "Burung", after: "di langit." }],
  ["bahasa-lengkap-kucing-tidur", { prompt: "Kucing tidur di atas ___.", choices: ["kursi", "hujan", "awan"], correctChoice: "kursi", requiredForStage: false, before: "Kucing tidur di atas", after: "." }],
  ["bahasa-lengkap-ibu-pasar", { prompt: "Ibu membeli sayur di ___.", choices: ["pasar", "langit", "sungai"], correctChoice: "pasar", requiredForStage: true, before: "Ibu membeli sayur di", after: "." }],
  ["bahasa-lengkap-rina-payung", { prompt: "Saat hujan, Rina memakai ___.", choices: ["payung", "sendok", "pensil"], correctChoice: "payung", requiredForStage: false, before: "Saat hujan, Rina memakai", after: "." }]
]);

try {
  const scoped = ACTIVITIES.filter((activity) => gameplayPattern(activity) === "cloze_sentence_choice");
  assert.equal(scoped.length, 5, "cloze-sentence-choice family size must remain exactly five");
  assert.deepEqual(new Set(scoped.map((activity) => activity.id)), new Set(expected.keys()), "cloze family scope must remain exact");

  const authoring = new Map(
    BAHASA_BATCH8_WAVE_D.activities
      .filter((seed) => expected.has(seed.id))
      .map((seed) => [seed.id, seed])
  );
  assert.equal(authoring.size, 5, "all cloze activities must remain owned by Bahasa Wave D authoring");

  const manifestPack = CONTENT_PACKS.find((pack) => pack.id === "bahasa.pack.kalimat-lengkap");
  assert(manifestPack, "canonical cloze content pack must remain in content manifest");
  assert.equal(manifestPack.stageId, "bahasa-literasi-terapan", "cloze content pack keeps canonical stage ownership");

  for (const activity of scoped) {
    const fixture = expected.get(activity.id);
    assert(fixture, `${activity.id} must have a frozen canonical fixture`);
    assert.equal(activity.subjectId, "bahasa", `${activity.id} keeps Bahasa ownership`);
    assert.equal(activity.stageId, "bahasa-literasi-terapan", `${activity.id} keeps stage ownership`);
    assert.equal(activity.runtime, "tap_choice", `${activity.id} keeps tap_choice runtime`);
    assert.equal(activity.prompt, fixture.prompt, `${activity.id} prompt remains canonical`);
    assert.deepEqual(activity.choices, fixture.choices, `${activity.id} choice order remains canonical`);
    assert.equal(activity.correctChoice, fixture.correctChoice, `${activity.id} correctChoice remains canonical`);
    assert.equal(isClozeSentenceChoiceActivity(activity), true, `${activity.id} satisfies exact cloze contract`);
    assert.equal(gameplayPattern(activity), "cloze_sentence_choice", `${activity.id} receives Pattern #38`);

    const config = clozeSentenceChoiceConfig(activity);
    assert.deepEqual(config, { before: fixture.before, after: fixture.after }, `${activity.id} parses exactly one canonical blank`);

    const spec = getActivityLearningSpec(activity.id);
    assert(spec, `${activity.id} keeps learning spec`);
    assert.equal(spec.subjectId, "bahasa", `${activity.id} learning spec keeps subject`);
    assert.equal(spec.stageId, "bahasa-literasi-terapan", `${activity.id} learning spec keeps stage`);
    assert.equal(spec.assessment, "assessed", `${activity.id} remains assessed`);
    assert.equal(spec.requiredForStage, fixture.requiredForStage, `${activity.id} learning spec keeps required-for-stage contract`);
    assert.deepEqual(spec.skills, [{ skillId: "bahasa.kalimat.context_completion", weight: 1 }], `${activity.id} keeps exact skill mapping`);

    const seed = authoring.get(activity.id);
    assert(seed, `${activity.id} keeps authoring seed`);
    assert.equal(seed.packId, "bahasa.pack.kalimat-lengkap", `${activity.id} keeps canonical pack`);
    assert.equal(seed.lessonId, "bahasa-kalimat-lengkap", `${activity.id} keeps canonical lesson`);
    assert.equal(seed.skillId, "bahasa.kalimat.context_completion", `${activity.id} keeps canonical skill`);
    assert.equal(seed.requiredForStage, fixture.requiredForStage, `${activity.id} authoring requiredForStage must not drift`);
    assert.deepEqual(seed.choices, fixture.choices, `${activity.id} authoring choices remain canonical`);
    assert.equal(seed.correctChoice, fixture.correctChoice, `${activity.id} authoring correctChoice remains canonical`);

    const manifestActivity = manifestPack.activities.find((item) => item.activityId === activity.id);
    assert(manifestActivity, `${activity.id} remains in canonical cloze content pack`);
    assert.equal(manifestActivity.lessonId, "bahasa-kalimat-lengkap", `${activity.id} manifest keeps canonical lesson`);
    assert.equal(manifestActivity.mechanicId, "tap_choice", `${activity.id} manifest keeps canonical mechanic`);
    assert.equal(manifestActivity.assessment, "assessed", `${activity.id} manifest keeps assessed contract`);
    assert.equal(manifestActivity.evidenceContractId, "choice_accuracy_v1", `${activity.id} keeps canonical evidence contract`);
    assert.equal(manifestActivity.requiredForStage, fixture.requiredForStage, `${activity.id} manifest keeps required-for-stage contract`);
    assert.deepEqual(manifestActivity.skills, [{ skillId: "bahasa.kalimat.context_completion", weight: 1 }], `${activity.id} manifest keeps exact skill evidence`);
  }

  assert.deepEqual(parseClozeSentencePrompt("Ibu ___ nasi."), { before: "Ibu", after: "nasi." });
  assert.equal(parseClozeSentencePrompt("Tanpa blank"), null, "prompt without blank must fail closed");
  assert.equal(parseClozeSentencePrompt("___ di awal"), null, "blank without prefix must fail closed");
  assert.equal(parseClozeSentencePrompt("blank di akhir ___"), null, "blank without suffix must fail closed");
  assert.equal(parseClozeSentencePrompt("A ___ B ___ C"), null, "multiple blanks must fail closed");

  const unrelated = ACTIVITIES.find((activity) => activity.id === "bahasa-tanda-titik");
  assert(unrelated, "unrelated Bahasa choice fixture must exist");
  assert.equal(isClozeSentenceChoiceActivity(unrelated), false, "unrelated Bahasa choice must not enter cloze family");
  assert.notEqual(gameplayPattern(unrelated), "cloze_sentence_choice", "Pattern #38 may not absorb unrelated Bahasa choices");

  console.log("Cloze Sentence Choice regression passed: exact five Bahasa context-completion activities preserve canonical content/evidence.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
