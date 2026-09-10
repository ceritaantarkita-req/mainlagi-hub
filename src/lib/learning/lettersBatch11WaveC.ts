import type { LettersBatch11ActivitySeed, LettersBatch11WaveDefinition } from "./lettersBatch11Authoring";

const STAGE_ID = "letters-late-middle-alphabet";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): LettersBatch11ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan terukur untuk mengenali, membedakan, dan mengurutkan huruf Latin.", emoji: options.emoji ?? "🔤", ageMin: 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, skillId: string, pairs: Array<[string, string]>, required = false): LettersBatch11ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan huruf besar dengan huruf kecil yang sesuai.", emoji: "🧩", ageMin: 4, ageMax: 7, difficulty: 2, requiredForStage: required, skillId, prompt: "Pasangkan huruf besar dan kecil yang sama.", matchItems: pairs.flatMap(([upper, lower]) => [{ label: upper, pair: lower }, { label: lower, pair: lower }]) };
}

function trace(id: string, glyph: string): LettersBatch11ActivitySeed {
  return { kind: "trace", id, packId: "letters.pack.formation-late-middle-practice", lessonId: "letters-formation-late-middle-practice", title: `Latihan bentuk ${glyph}`, description: "Latihan pembentukan huruf sebagai practice motorik; completion tidak dianggap akurasi bentuk atau mastery.", emoji: "✍️", ageMin: 4, ageMax: 7, difficulty: 2, requiredForStage: false, skillId: "letters.latin.formation.practice.late_middle", prompt: `Ikuti bentuk huruf ${glyph} dengan jari.`, traceGlyph: glyph };
}

const upperData: Array<[string, string[], boolean]> = [
  ["N", ["M", "H", "N"], true], ["O", ["Q", "C", "O"], false], ["P", ["R", "F", "P"], false], ["Q", ["O", "G", "Q"], true], ["R", ["P", "K", "R"], false], ["S", ["Z", "C", "S"], false], ["T", ["I", "F", "T"], true]
];
const lowerData: Array<[string, string[], boolean]> = [
  ["n", ["m", "h", "n"], true], ["o", ["a", "c", "o"], false], ["p", ["q", "b", "p"], false], ["q", ["g", "p", "q"], true], ["r", ["n", "v", "r"], false], ["s", ["z", "c", "s"], false], ["t", ["f", "l", "t"], true]
];

const uppercase = upperData.map(([letter, choices, required]) => choice(`letters-find-upper-${letter.toLowerCase()}`, "letters.pack.uppercase-n-t", "letters-uppercase-n-t", `Cari huruf ${letter}`, `Mana huruf ${letter}?`, choices, letter, "letters.latin.uppercase.recognition.late_middle", { required, emoji: letter }));
const lowercase = lowerData.map(([letter, choices, required]) => choice(`letters-find-lower-${letter}`, "letters.pack.lowercase-n-t", "letters-lowercase-n-t", `Cari huruf ${letter}`, `Mana huruf kecil ${letter}?`, choices, letter, "letters.latin.lowercase.recognition.late_middle", { required, emoji: letter }));

const caseMatching: LettersBatch11ActivitySeed[] = [
  matching("letters-match-case-no", "letters.pack.case-matching-late-middle", "letters-case-matching-late-middle", "Pasangkan N dan O", "letters.latin.case_matching.late_middle", [["N", "n"], ["O", "o"]], true),
  matching("letters-match-case-pq", "letters.pack.case-matching-late-middle", "letters-case-matching-late-middle", "Pasangkan P dan Q", "letters.latin.case_matching.late_middle", [["P", "p"], ["Q", "q"]]),
  matching("letters-match-case-rst", "letters.pack.case-matching-late-middle", "letters-case-matching-late-middle", "Pasangkan R, S, T", "letters.latin.case_matching.late_middle", [["R", "r"], ["S", "s"], ["T", "t"]], true)
];

const sequence: LettersBatch11ActivitySeed[] = [
  choice("letters-order-after-n", "letters.pack.sequence-n-t", "letters-sequence-n-t", "Setelah N", "Huruf apa setelah N?", ["M", "O", "P"], "O", "letters.latin.sequence.late_middle", { required: true, emoji: "➡️" }),
  choice("letters-order-between-pr", "letters.pack.sequence-n-t", "letters-sequence-n-t", "Di antara P dan R", "Huruf apa di antara P dan R?", ["O", "Q", "S"], "Q", "letters.latin.sequence.late_middle", { required: true, emoji: "↔️" }),
  choice("letters-order-before-t", "letters.pack.sequence-n-t", "letters-sequence-n-t", "Sebelum T", "Huruf apa tepat sebelum T?", ["R", "S", "U"], "S", "letters.latin.sequence.late_middle", { emoji: "⬅️" })
];

const discrimination: LettersBatch11ActivitySeed[] = [
  choice("letters-discriminate-upper-oq", "letters.pack.visual-discrimination-late-middle", "letters-visual-discrimination-late-middle", "Bedakan O dan Q", "Pilih huruf Q.", ["O", "Q", "G"], "Q", "letters.latin.visual_discrimination.late_middle", { required: true, emoji: "🔎" }),
  choice("letters-discriminate-lower-pq-late", "letters.pack.visual-discrimination-late-middle", "letters-visual-discrimination-late-middle", "Bedakan p dan q lanjut", "Pilih huruf kecil q.", ["p", "q", "g"], "q", "letters.latin.visual_discrimination.late_middle", { required: true, emoji: "🔎" })
];

export const LETTERS_BATCH11_WAVE_C: LettersBatch11WaveDefinition = {
  wave: "C",
  stage: { id: STAGE_ID, subjectId: "letters", title: "Huruf N–T & Urutan Lanjut", subtitle: "Kenali N–T, hubungkan bentuk besar-kecil, pahami urutan, bedakan bentuk mirip, dan praktikkan beberapa bentuk huruf.", emoji: "🔠" },
  lessons: [
    { id: "letters-uppercase-n-t", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf besar N–T", objective: "Mengenali bentuk huruf besar N sampai T.", ageMin: 4, ageMax: 7 },
    { id: "letters-lowercase-n-t", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf kecil n–t", objective: "Mengenali bentuk huruf kecil n sampai t.", ageMin: 4, ageMax: 7 },
    { id: "letters-case-matching-late-middle", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Pasangan N–T", objective: "Memasangkan bentuk huruf besar dan kecil N sampai T.", ageMin: 4, ageMax: 7 },
    { id: "letters-sequence-n-t", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Urutan N–T", objective: "Menentukan huruf sebelum, sesudah, dan di antara huruf pada rentang N sampai T.", ageMin: 4, ageMax: 7 },
    { id: "letters-visual-discrimination-late-middle", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Bedakan bentuk N–T", objective: "Membedakan bentuk O/Q dan p/q dalam konteks lanjutan.", ageMin: 4, ageMax: 7 },
    { id: "letters-formation-late-middle-practice", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Praktik bentuk N, O, T", objective: "Mempraktikkan gerakan membentuk N, O, dan T tanpa mengklaim akurasi bentuk atau mastery.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "letters.pack.uppercase-n-t", title: "Uppercase N–T", lessonId: "letters-uppercase-n-t", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.lowercase-n-t", title: "Lowercase n–t", lessonId: "letters-lowercase-n-t", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.case-matching-late-middle", title: "Late-middle Case Matching", lessonId: "letters-case-matching-late-middle", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.sequence-n-t", title: "Alphabet Sequence N–T", lessonId: "letters-sequence-n-t", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.visual-discrimination-late-middle", title: "Late-middle Visual Discrimination", lessonId: "letters-visual-discrimination-late-middle", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.formation-late-middle-practice", title: "Late-middle Formation Practice", lessonId: "letters-formation-late-middle-practice", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "letters.latin.uppercase.recognition.late_middle", subjectId: "letters", title: "Mengenali huruf besar N–T", description: "Mengenali bentuk huruf besar N sampai T.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.lowercase.recognition.late_middle", subjectId: "letters", title: "Mengenali huruf kecil n–t", description: "Mengenali bentuk huruf kecil n sampai t.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.case_matching.late_middle", subjectId: "letters", title: "Pasangan bentuk N–T", description: "Memasangkan huruf besar dan kecil pada rentang N sampai T.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.sequence.late_middle", subjectId: "letters", title: "Urutan alfabet N–T", description: "Menentukan posisi huruf pada rentang N sampai T.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.visual_discrimination.late_middle", subjectId: "letters", title: "Diskriminasi visual N–T", description: "Membedakan bentuk huruf yang mirip pada rentang pembelajaran N sampai T.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.formation.practice.late_middle", subjectId: "letters", title: "Praktik pembentukan N, O, T", description: "Praktik motorik membentuk N, O, dan T tanpa klaim akurasi atau mastery.", domain: "motor", ageMin: 4, ageMax: 7 }
  ],
  activities: [...uppercase, ...lowercase, ...caseMatching, ...sequence, ...discrimination, trace("letters-trace-n-practice", "N"), trace("letters-trace-o-practice", "O"), trace("letters-trace-t-practice", "T")]
};
