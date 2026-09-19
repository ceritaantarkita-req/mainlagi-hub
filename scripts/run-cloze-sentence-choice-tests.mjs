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
const { ENGLISH_BATCH9_WAVE_D } = require(path.join(outDir, "src", "lib", "learning", "englishBatch9WaveD.js"));
const { gameplayPattern } = require(path.join(outDir, "src", "lib", "learning", "gameplayPresentation.js"));
const {
  clozeSentenceChoiceConfig,
  isClozeSentenceChoiceActivity,
  parseClozeSentencePrompt
} = require(path.join(outDir, "src", "lib", "learning", "clozeSentenceChoiceConfig.js"));

const expected = new Map([
  ["bahasa-lengkap-ayah-minum", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", prompt: "Ayah minum ___ setelah berolahraga.", choices: ["air", "bantal", "sepatu"], correctChoice: "air", requiredForStage: true, before: "Ayah minum", after: "setelah berolahraga.", locale: "id-ID", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion" }],
  ["bahasa-lengkap-burung-terbang", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", prompt: "Burung ___ di langit.", choices: ["berenang", "terbang", "membaca"], correctChoice: "terbang", requiredForStage: false, before: "Burung", after: "di langit.", locale: "id-ID", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion" }],
  ["bahasa-lengkap-kucing-tidur", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", prompt: "Kucing tidur di atas ___.", choices: ["kursi", "hujan", "awan"], correctChoice: "kursi", requiredForStage: false, before: "Kucing tidur di atas", after: ".", locale: "id-ID", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion" }],
  ["bahasa-lengkap-ibu-pasar", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", prompt: "Ibu membeli sayur di ___.", choices: ["pasar", "langit", "sungai"], correctChoice: "pasar", requiredForStage: true, before: "Ibu membeli sayur di", after: ".", locale: "id-ID", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion" }],
  ["bahasa-lengkap-rina-payung", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", prompt: "Saat hujan, Rina memakai ___.", choices: ["payung", "sendok", "pensil"], correctChoice: "payung", requiredForStage: false, before: "Saat hujan, Rina memakai", after: ".", locale: "id-ID", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion" }],
  ["english-complete-cat-sleeps", { subjectId: "english", stageId: "english-phrases-review", prompt: "Complete: The cat ___.", choices: ["SLEEPS", "BOOK", "YELLOW"], correctChoice: "SLEEPS", requiredForStage: true, before: "Complete: The cat", after: ".", locale: "en-US", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion" }],
  ["english-complete-bird-flies", { subjectId: "english", stageId: "english-phrases-review", prompt: "Complete: The bird ___.", choices: ["FLIES", "MILK", "HAND"], correctChoice: "FLIES", requiredForStage: false, before: "Complete: The bird", after: ".", locale: "en-US", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion" }],
  ["english-complete-i-read", { subjectId: "english", stageId: "english-phrases-review", prompt: "Complete: I ___ a book.", choices: ["READ", "RED", "RABBIT"], correctChoice: "READ", requiredForStage: false, before: "Complete: I", after: "a book.", locale: "en-US", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion" }],
  ["english-complete-two-apples", { subjectId: "english", stageId: "english-phrases-review", prompt: "Complete: I see two ___.", choices: ["APPLES", "FATHER", "RUN"], correctChoice: "APPLES", requiredForStage: true, before: "Complete: I see two", after: ".", locale: "en-US", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion" }],
  ["english-complete-mother-family", { subjectId: "english", stageId: "english-phrases-review", prompt: "Complete: My ___ is here.", choices: ["MOTHER", "CHAIR", "FISH"], correctChoice: "MOTHER", requiredForStage: false, before: "Complete: My", after: "is here.", locale: "en-US", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion" }]
]);

const authoring = new Map([
  ...BAHASA_BATCH8_WAVE_D.activities.filter((seed) => expected.has(seed.id)).map((seed) => [seed.id, seed]),
  ...ENGLISH_BATCH9_WAVE_D.activities.filter((seed) => expected.has(seed.id)).map((seed) => [seed.id, seed])
]);

try {
  const scoped = ACTIVITIES.filter((activity) => gameplayPattern(activity) === "cloze_sentence_choice");
  assert.equal(scoped.length, 10, "cloze-sentence-choice family size must remain exactly ten");
  assert.deepEqual(new Set(scoped.map((activity) => activity.id)), new Set(expected.keys()), "cloze family scope must remain exact");
  assert.equal(authoring.size, 10, "all ten cloze activities must remain owned by their canonical authoring waves");

  for (const activity of scoped) {
    const fixture = expected.get(activity.id);
    assert(fixture, `${activity.id} must have a frozen canonical fixture`);
    assert.equal(activity.subjectId, fixture.subjectId, `${activity.id} keeps subject ownership`);
    assert.equal(activity.stageId, fixture.stageId, `${activity.id} keeps stage ownership`);
    assert.equal(activity.runtime, "tap_choice", `${activity.id} keeps tap_choice runtime`);
    assert.equal(activity.prompt, fixture.prompt, `${activity.id} prompt remains canonical`);
    assert.deepEqual(activity.choices, fixture.choices, `${activity.id} choice order remains canonical`);
    assert.equal(activity.correctChoice, fixture.correctChoice, `${activity.id} correctChoice remains canonical`);
    assert.equal(isClozeSentenceChoiceActivity(activity), true, `${activity.id} satisfies exact cloze contract`);
    assert.equal(gameplayPattern(activity), "cloze_sentence_choice", `${activity.id} receives Pattern #38`);

    const config = clozeSentenceChoiceConfig(activity);
    assert.deepEqual(config, { before: fixture.before, after: fixture.after, locale: fixture.locale }, `${activity.id} parses exactly one canonical blank and locale`);

    const spec = getActivityLearningSpec(activity.id);
    assert(spec, `${activity.id} keeps learning spec`);
    assert.equal(spec.subjectId, fixture.subjectId, `${activity.id} learning spec keeps subject`);
    assert.equal(spec.stageId, fixture.stageId, `${activity.id} learning spec keeps stage`);
    assert.equal(spec.assessment, "assessed", `${activity.id} remains assessed`);
    assert.equal(spec.requiredForStage, fixture.requiredForStage, `${activity.id} learning spec keeps required-for-stage contract`);
    assert.deepEqual(spec.skills, [{ skillId: fixture.skillId, weight: 1 }], `${activity.id} keeps exact skill mapping`);

    const seed = authoring.get(activity.id);
    assert(seed, `${activity.id} keeps authoring seed`);
    assert.equal(seed.packId, fixture.packId, `${activity.id} keeps canonical pack`);
    assert.equal(seed.lessonId, fixture.lessonId, `${activity.id} keeps canonical lesson`);
    assert.equal(seed.skillId, fixture.skillId, `${activity.id} keeps canonical skill`);
    assert.equal(seed.requiredForStage, fixture.requiredForStage, `${activity.id} authoring requiredForStage must not drift`);
    assert.deepEqual(seed.choices, fixture.choices, `${activity.id} authoring choices remain canonical`);
    assert.equal(seed.correctChoice, fixture.correctChoice, `${activity.id} authoring correctChoice remains canonical`);

    const manifestPack = CONTENT_PACKS.find((pack) => pack.id === fixture.packId);
    assert(manifestPack, `${activity.id} canonical content pack must remain in manifest`);
    assert.equal(manifestPack.stageId, fixture.stageId, `${activity.id} manifest pack keeps stage ownership`);
    const manifestActivity = manifestPack.activities.find((item) => item.activityId === activity.id);
    assert(manifestActivity, `${activity.id} remains in canonical cloze content pack`);
    assert.equal(manifestActivity.lessonId, fixture.lessonId, `${activity.id} manifest keeps canonical lesson`);
    assert.equal(manifestActivity.mechanicId, "tap_choice", `${activity.id} manifest keeps canonical mechanic`);
    assert.equal(manifestActivity.assessment, "assessed", `${activity.id} manifest keeps assessed contract`);
    assert.equal(manifestActivity.evidenceContractId, "choice_accuracy_v1", `${activity.id} keeps canonical evidence contract`);
    assert.equal(manifestActivity.requiredForStage, fixture.requiredForStage, `${activity.id} manifest keeps required-for-stage contract`);
    assert.deepEqual(manifestActivity.skills, [{ skillId: fixture.skillId, weight: 1 }], `${activity.id} manifest keeps exact skill evidence`);
  }

  assert.deepEqual(parseClozeSentencePrompt("Ibu ___ nasi."), { before: "Ibu", after: "nasi." });
  assert.equal(parseClozeSentencePrompt("Tanpa blank"), null, "prompt without blank must fail closed");
  assert.equal(parseClozeSentencePrompt("___ di awal"), null, "blank without prefix must fail closed");
  assert.equal(parseClozeSentencePrompt("blank di akhir ___"), null, "blank without suffix must fail closed");
  assert.equal(parseClozeSentencePrompt("A ___ B ___ C"), null, "multiple blanks must fail closed");

  const english = ACTIVITIES.find((activity) => activity.id === "english-complete-cat-sleeps");
  assert(english, "English cloze fixture must exist");
  assert.equal(isClozeSentenceChoiceActivity({ ...english, subjectId: "bahasa" }), false, "subject drift must fail closed");
  assert.equal(isClozeSentenceChoiceActivity({ ...english, stageId: "english-basics" }), false, "stage drift must fail closed");
  assert.equal(isClozeSentenceChoiceActivity({ ...english, prompt: "Complete: The cat ___!" }), false, "prompt drift must fail closed");
  assert.equal(isClozeSentenceChoiceActivity({ ...english, choices: [...(english.choices ?? [])].reverse() }), false, "choice order drift must fail closed");
  assert.equal(isClozeSentenceChoiceActivity({ ...english, correctChoice: "BOOK" }), false, "answer drift must fail closed");

  for (const id of ["bahasa-tanda-titik", "english-opposite-big-small", "english-detail-red-ball"]) {
    const unrelated = ACTIVITIES.find((activity) => activity.id === id);
    assert(unrelated, `${id} unrelated choice fixture must exist`);
    assert.equal(isClozeSentenceChoiceActivity(unrelated), false, `${id} must stay outside cloze family`);
    assert.notEqual(gameplayPattern(unrelated), "cloze_sentence_choice", `${id} must preserve its existing gameplay pattern`);
  }

  console.log("Cloze Sentence Choice regression passed: exact five Bahasa + five English sentence-completion activities preserve canonical content/evidence and fail closed on drift.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
