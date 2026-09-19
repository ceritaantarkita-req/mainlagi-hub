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
  ["bahasa-lengkap-ayah-minum", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion", prompt: "Ayah minum ___ setelah berolahraga.", choices: ["air", "bantal", "sepatu"], correctChoice: "air", requiredForStage: true, before: "Ayah minum", after: "setelah berolahraga.", lang: "id-ID" }],
  ["bahasa-lengkap-burung-terbang", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion", prompt: "Burung ___ di langit.", choices: ["berenang", "terbang", "membaca"], correctChoice: "terbang", requiredForStage: false, before: "Burung", after: "di langit.", lang: "id-ID" }],
  ["bahasa-lengkap-kucing-tidur", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion", prompt: "Kucing tidur di atas ___.", choices: ["kursi", "hujan", "awan"], correctChoice: "kursi", requiredForStage: false, before: "Kucing tidur di atas", after: ".", lang: "id-ID" }],
  ["bahasa-lengkap-ibu-pasar", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion", prompt: "Ibu membeli sayur di ___.", choices: ["pasar", "langit", "sungai"], correctChoice: "pasar", requiredForStage: true, before: "Ibu membeli sayur di", after: ".", lang: "id-ID" }],
  ["bahasa-lengkap-rina-payung", { subjectId: "bahasa", stageId: "bahasa-literasi-terapan", packId: "bahasa.pack.kalimat-lengkap", lessonId: "bahasa-kalimat-lengkap", skillId: "bahasa.kalimat.context_completion", prompt: "Saat hujan, Rina memakai ___.", choices: ["payung", "sendok", "pensil"], correctChoice: "payung", requiredForStage: false, before: "Saat hujan, Rina memakai", after: ".", lang: "id-ID" }],
  ["english-complete-cat-sleeps", { subjectId: "english", stageId: "english-phrases-review", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion", prompt: "Complete: The cat ___.", choices: ["SLEEPS", "BOOK", "YELLOW"], correctChoice: "SLEEPS", requiredForStage: true, before: "Complete: The cat", after: ".", lang: "en-US" }],
  ["english-complete-bird-flies", { subjectId: "english", stageId: "english-phrases-review", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion", prompt: "Complete: The bird ___.", choices: ["FLIES", "MILK", "HAND"], correctChoice: "FLIES", requiredForStage: false, before: "Complete: The bird", after: ".", lang: "en-US" }],
  ["english-complete-i-read", { subjectId: "english", stageId: "english-phrases-review", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion", prompt: "Complete: I ___ a book.", choices: ["READ", "RED", "RABBIT"], correctChoice: "READ", requiredForStage: false, before: "Complete: I", after: "a book.", lang: "en-US" }],
  ["english-complete-two-apples", { subjectId: "english", stageId: "english-phrases-review", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion", prompt: "Complete: I see two ___.", choices: ["APPLES", "FATHER", "RUN"], correctChoice: "APPLES", requiredForStage: true, before: "Complete: I see two", after: ".", lang: "en-US" }],
  ["english-complete-mother-family", { subjectId: "english", stageId: "english-phrases-review", packId: "english.pack.sentence-completion", lessonId: "english-sentence-completion", skillId: "english.sentence.completion", prompt: "Complete: My ___ is here.", choices: ["MOTHER", "CHAIR", "FISH"], correctChoice: "MOTHER", requiredForStage: false, before: "Complete: My", after: "is here.", lang: "en-US" }]
]);

const authoringById = new Map(
  [...BAHASA_BATCH8_WAVE_D.activities, ...ENGLISH_BATCH9_WAVE_D.activities]
    .filter((seed) => expected.has(seed.id))
    .map((seed) => [seed.id, seed])
);

try {
  const scoped = ACTIVITIES.filter((activity) => gameplayPattern(activity) === "cloze_sentence_choice");
  assert.equal(scoped.length, 10, "cloze-sentence-choice family size must be exact five Bahasa + five English");
  assert.deepEqual(new Set(scoped.map((activity) => activity.id)), new Set(expected.keys()), "cloze family scope must remain exact");
  assert.equal(authoringById.size, 10, "all ten cloze activities must remain in canonical Bahasa/English authoring");

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
    assert.equal(gameplayPattern(activity), "cloze_sentence_choice", `${activity.id} receives existing Pattern #38`);

    const config = clozeSentenceChoiceConfig(activity);
    assert(config, `${activity.id} exposes cloze config`);
    assert.equal(config.before, fixture.before, `${activity.id} keeps exact prefix`);
    assert.equal(config.after, fixture.after, `${activity.id} keeps exact suffix`);
    assert.equal(config.presentation.lang, fixture.lang, `${activity.id} uses subject-aware locale`);

    const spec = getActivityLearningSpec(activity.id);
    assert(spec, `${activity.id} keeps learning spec`);
    assert.equal(spec.subjectId, fixture.subjectId, `${activity.id} learning spec keeps subject`);
    assert.equal(spec.stageId, fixture.stageId, `${activity.id} learning spec keeps stage`);
    assert.equal(spec.assessment, "assessed", `${activity.id} remains assessed`);
    assert.equal(spec.requiredForStage, fixture.requiredForStage, `${activity.id} keeps required-for-stage contract`);
    assert.deepEqual(spec.skills, [{ skillId: fixture.skillId, weight: 1 }], `${activity.id} keeps exact skill mapping`);

    const seed = authoringById.get(activity.id);
    assert(seed, `${activity.id} keeps authoring seed`);
    assert.equal(seed.packId, fixture.packId, `${activity.id} keeps canonical pack`);
    assert.equal(seed.lessonId, fixture.lessonId, `${activity.id} keeps canonical lesson`);
    assert.equal(seed.skillId, fixture.skillId, `${activity.id} keeps canonical skill`);
    assert.equal(seed.requiredForStage, fixture.requiredForStage, `${activity.id} authoring requiredForStage must not drift`);
    assert.deepEqual(seed.choices, fixture.choices, `${activity.id} authoring choices remain canonical`);
    assert.equal(seed.correctChoice, fixture.correctChoice, `${activity.id} authoring correctChoice remains canonical`);

    const manifestPack = CONTENT_PACKS.find((pack) => pack.id === fixture.packId);
    assert(manifestPack, `${activity.id} canonical content pack must remain in manifest`);
    assert.equal(manifestPack.stageId, fixture.stageId, `${activity.id} content pack keeps stage ownership`);
    const manifestActivity = manifestPack.activities.find((item) => item.activityId === activity.id);
    assert(manifestActivity, `${activity.id} remains in canonical content pack`);
    assert.equal(manifestActivity.lessonId, fixture.lessonId, `${activity.id} manifest keeps canonical lesson`);
    assert.equal(manifestActivity.mechanicId, "tap_choice", `${activity.id} manifest keeps canonical mechanic`);
    assert.equal(manifestActivity.assessment, "assessed", `${activity.id} manifest keeps assessed contract`);
    assert.equal(manifestActivity.evidenceContractId, "choice_accuracy_v1", `${activity.id} keeps canonical evidence contract`);
    assert.deepEqual(manifestActivity.skills, [{ skillId: fixture.skillId, weight: 1 }], `${activity.id} manifest keeps exact skill evidence`);

    const wrongChoice = fixture.choices.find((choice) => choice !== fixture.correctChoice);
    const mutations = [
      { ...activity, subjectId: fixture.subjectId === "english" ? "bahasa" : "english" },
      { ...activity, stageId: "drifted-stage" },
      { ...activity, runtime: "listen_and_choose" },
      { ...activity, prompt: fixture.prompt.replace("___", "__") },
      { ...activity, choices: [...fixture.choices].reverse() },
      { ...activity, correctChoice: wrongChoice }
    ];
    for (const mutated of mutations) {
      assert.equal(isClozeSentenceChoiceActivity(mutated), false, `${activity.id} must fail closed on canonical contract drift`);
    }
  }

  assert.deepEqual(parseClozeSentencePrompt("Ibu ___ nasi."), { before: "Ibu", after: "nasi." });
  assert.equal(parseClozeSentencePrompt("Tanpa blank"), null, "prompt without blank must fail closed");
  assert.equal(parseClozeSentencePrompt("___ di awal"), null, "blank without prefix must fail closed");
  assert.equal(parseClozeSentencePrompt("blank di akhir ___"), null, "blank without suffix must fail closed");
  assert.equal(parseClozeSentencePrompt("A ___ B ___ C"), null, "multiple blanks must fail closed");

  for (const unrelatedId of ["bahasa-tanda-titik", "english-opposite-big-small", "english-listen-phrase-blue-book"]) {
    const unrelated = ACTIVITIES.find((activity) => activity.id === unrelatedId);
    assert(unrelated, `${unrelatedId} unrelated fixture must exist`);
    assert.equal(isClozeSentenceChoiceActivity(unrelated), false, `${unrelatedId} must stay outside cloze family`);
    assert.notEqual(gameplayPattern(unrelated), "cloze_sentence_choice", `${unrelatedId} may not be absorbed into Pattern #38`);
  }

  console.log("Cloze Sentence Choice regression passed: exact ten Bahasa/English activities preserve canonical content, evidence, fail-closed identity and subject-aware locale.");
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
