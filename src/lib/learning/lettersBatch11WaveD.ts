import type { LettersBatch11ActivitySeed, LettersBatch11WaveDefinition } from "./lettersBatch11Authoring";

const STAGE_ID = "letters-final-alphabet";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): LettersBatch11ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan terukur untuk mengenali, membedakan, dan mengurutkan huruf Latin.", emoji: options.emoji ?? "🔤", ageMin: 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, skillId: string, pairs: Array<[string, string]>, required = false): LettersBatch11ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan huruf besar dengan huruf kecil yang sesuai.", emoji: "🧩", ageMin: 4, ageMax: 7, difficulty: 2, requiredForStage: required, skillId, prompt: "Pasangkan huruf besar dan kecil yang sama.", matchItems: pairs.flatMap(([upper, lower]) => [{ label: upper, pair: lower }, { label: lower, pair: lower }]) };
}

function trace(id: string, glyph: string): LettersBatch11ActivitySeed {
  return { kind: "trace", id, packId: "letters.pack.formation-final-practice", lessonId: "letters-formation-final-practice", title: `Latihan bentuk ${glyph}`, description: "Latihan pembentukan huruf sebagai practice motorik; completion tidak dianggap akurasi bentuk atau mastery.", emoji: "✍️", ageMin: 4, ageMax: 7, difficulty: 2, requiredForStage: false, skillId: "letters.latin.formation.practice.final", prompt: `Ikuti bentuk huruf ${glyph} dengan jari.`, traceGlyph: glyph };
}

const upperData: Array<[string, string[], boolean]> = [
  ["U", ["V", "J", "U"], true], ["V", ["U", "Y", "V"], false], ["W", ["M", "V", "W"], true], ["X", ["K", "Y", "X"], false], ["Y", ["V", "T", "Y"], false], ["Z", ["N", "S", "Z"], true]
];
const lowerData: Array<[string, string[], boolean]> = [
  ["u", ["v", "n", "u"], true], ["v", ["u", "y", "v"], false], ["w", ["m", "v", "w"], true], ["x", ["k", "y", "x"], false], ["y", ["v", "g", "y"], false], ["z", ["s", "n", "z"], true]
];

const uppercase = upperData.map(([letter, choices, required]) => choice(`letters-find-upper-${letter.toLowerCase()}`, "letters.pack.uppercase-u-z", "letters-uppercase-u-z", `Cari huruf ${letter}`, `Mana huruf ${letter}?`, choices, letter, "letters.latin.uppercase.recognition.final", { required, emoji: letter }));
const lowercase = lowerData.map(([letter, choices, required]) => choice(`letters-find-lower-${letter}`, "letters.pack.lowercase-u-z", "letters-lowercase-u-z", `Cari huruf ${letter}`, `Mana huruf kecil ${letter}?`, choices, letter, "letters.latin.lowercase.recognition.final", { required, emoji: letter }));

const caseMatching: LettersBatch11ActivitySeed[] = [
  matching("letters-match-case-uv", "letters.pack.case-matching-final", "letters-case-matching-final", "Pasangkan U dan V", "letters.latin.case_matching.final", [["U", "u"], ["V", "v"]], true),
  matching("letters-match-case-wx", "letters.pack.case-matching-final", "letters-case-matching-final", "Pasangkan W dan X", "letters.latin.case_matching.final", [["W", "w"], ["X", "x"]]),
  matching("letters-match-case-yz", "letters.pack.case-matching-final", "letters-case-matching-final", "Pasangkan Y dan Z", "letters.latin.case_matching.final", [["Y", "y"], ["Z", "z"]], true)
];

const sequence: LettersBatch11ActivitySeed[] = [
  choice("letters-order-after-u", "letters.pack.sequence-u-z", "letters-sequence-u-z", "Setelah U", "Huruf apa setelah U?", ["T", "V", "W"], "V", "letters.latin.sequence.final", { required: true, emoji: "➡️" }),
  choice("letters-order-between-vx", "letters.pack.sequence-u-z", "letters-sequence-u-z", "Di antara V dan X", "Huruf apa di antara V dan X?", ["U", "W", "Y"], "W", "letters.latin.sequence.final", { required: true, emoji: "↔️" }),
  choice("letters-order-before-z", "letters.pack.sequence-u-z", "letters-sequence-u-z", "Sebelum Z", "Huruf apa tepat sebelum Z?", ["X", "Y", "W"], "Y", "letters.latin.sequence.final", { required: true, emoji: "⬅️" }),
  choice("letters-order-end-wxyz", "letters.pack.sequence-u-z", "letters-sequence-u-z", "Lengkapi W X _ Z", "Huruf apa yang melengkapi urutan W, X, _, Z?", ["V", "Y", "U"], "Y", "letters.latin.sequence.final", { emoji: "🔡" })
];

const discrimination: LettersBatch11ActivitySeed[] = [
  choice("letters-discriminate-upper-vy-final", "letters.pack.visual-discrimination-final", "letters-visual-discrimination-final", "Bedakan V dan Y", "Pilih huruf Y.", ["V", "Y", "T"], "Y", "letters.latin.visual_discrimination.final", { required: true, emoji: "🔎" }),
  choice("letters-discriminate-lower-uv-final", "letters.pack.visual-discrimination-final", "letters-visual-discrimination-final", "Bedakan u dan v", "Pilih huruf kecil u.", ["v", "u", "n"], "u", "letters.latin.visual_discrimination.final", { required: true, emoji: "🔎" }),
  choice("letters-discriminate-lower-wm-final", "letters.pack.visual-discrimination-final", "letters-visual-discrimination-final", "Bedakan w dan m", "Pilih huruf kecil w.", ["m", "w", "v"], "w", "letters.latin.visual_discrimination.final", { emoji: "🔎" })
];

export const LETTERS_BATCH11_WAVE_D: LettersBatch11WaveDefinition = {
  wave: "D",
  stage: { id: STAGE_ID, subjectId: "letters", title: "Huruf U–Z & Penutup Alfabet", subtitle: "Kenali U–Z, hubungkan bentuk besar-kecil, pahami urutan akhir alfabet, bedakan bentuk mirip, dan praktikkan beberapa bentuk huruf.", emoji: "🔤" },
  lessons: [
    { id: "letters-uppercase-u-z", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf besar U–Z", objective: "Mengenali bentuk huruf besar U sampai Z.", ageMin: 4, ageMax: 7 },
    { id: "letters-lowercase-u-z", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf kecil u–z", objective: "Mengenali bentuk huruf kecil u sampai z.", ageMin: 4, ageMax: 7 },
    { id: "letters-case-matching-final", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Pasangan U–Z", objective: "Memasangkan bentuk huruf besar dan kecil U sampai Z.", ageMin: 4, ageMax: 7 },
    { id: "letters-sequence-u-z", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Urutan U–Z", objective: "Menentukan huruf sebelum, sesudah, dan di antara huruf pada bagian akhir alfabet.", ageMin: 4, ageMax: 7 },
    { id: "letters-visual-discrimination-final", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Bedakan bentuk U–Z", objective: "Membedakan bentuk huruf yang mirip pada rentang U sampai Z.", ageMin: 4, ageMax: 7 },
    { id: "letters-formation-final-practice", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Praktik bentuk U, W, Z", objective: "Mempraktikkan gerakan membentuk U, W, dan Z tanpa mengklaim akurasi bentuk atau mastery.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "letters.pack.uppercase-u-z", title: "Uppercase U–Z", lessonId: "letters-uppercase-u-z", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.lowercase-u-z", title: "Lowercase u–z", lessonId: "letters-lowercase-u-z", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.case-matching-final", title: "Final Case Matching", lessonId: "letters-case-matching-final", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.sequence-u-z", title: "Alphabet Sequence U–Z", lessonId: "letters-sequence-u-z", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.visual-discrimination-final", title: "Final Visual Discrimination", lessonId: "letters-visual-discrimination-final", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.formation-final-practice", title: "Final Formation Practice", lessonId: "letters-formation-final-practice", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "letters.latin.uppercase.recognition.final", subjectId: "letters", title: "Mengenali huruf besar U–Z", description: "Mengenali bentuk huruf besar U sampai Z.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.lowercase.recognition.final", subjectId: "letters", title: "Mengenali huruf kecil u–z", description: "Mengenali bentuk huruf kecil u sampai z.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.case_matching.final", subjectId: "letters", title: "Pasangan bentuk U–Z", description: "Memasangkan huruf besar dan kecil pada rentang U sampai Z.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.sequence.final", subjectId: "letters", title: "Urutan alfabet U–Z", description: "Menentukan posisi huruf pada bagian akhir alfabet U sampai Z.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.visual_discrimination.final", subjectId: "letters", title: "Diskriminasi visual U–Z", description: "Membedakan bentuk huruf yang mirip pada rentang U sampai Z.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.formation.practice.final", subjectId: "letters", title: "Praktik pembentukan U, W, Z", description: "Praktik motorik membentuk U, W, dan Z tanpa klaim akurasi atau mastery.", domain: "motor", ageMin: 4, ageMax: 7 }
  ],
  activities: [...uppercase, ...lowercase, ...caseMatching, ...sequence, ...discrimination, trace("letters-trace-u-practice", "U"), trace("letters-trace-w-practice", "W"), trace("letters-trace-z-practice", "Z")]
};
