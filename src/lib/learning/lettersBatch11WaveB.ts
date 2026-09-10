import type { LettersBatch11ActivitySeed, LettersBatch11WaveDefinition } from "./lettersBatch11Authoring";

const STAGE_ID = "letters-middle-alphabet";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(
  id: string,
  packId: string,
  lessonId: string,
  title: string,
  prompt: string,
  choices: string[],
  correctChoice: string,
  skillId: string,
  options: SeedOptions = {}
): LettersBatch11ActivitySeed {
  return {
    kind: "choice",
    id,
    packId,
    lessonId,
    title,
    description: "Latihan terukur untuk mengenali, membedakan, dan mengurutkan huruf Latin.",
    emoji: options.emoji ?? "🔤",
    ageMin: options.ageMin ?? 4,
    ageMax: 7,
    difficulty: options.difficulty ?? 2,
    requiredForStage: options.required ?? false,
    skillId,
    prompt,
    choices,
    correctChoice
  };
}

function matching(
  id: string,
  packId: string,
  lessonId: string,
  title: string,
  prompt: string,
  skillId: string,
  pairs: Array<{ upper: string; lower: string }>,
  options: SeedOptions = {}
): LettersBatch11ActivitySeed {
  return {
    kind: "matching",
    id,
    packId,
    lessonId,
    title,
    description: "Pasangkan huruf besar dengan bentuk huruf kecil yang sesuai.",
    emoji: options.emoji ?? "🧩",
    ageMin: options.ageMin ?? 4,
    ageMax: 7,
    difficulty: options.difficulty ?? 2,
    requiredForStage: options.required ?? false,
    skillId,
    prompt,
    matchItems: pairs.flatMap(({ upper, lower }) => [
      { label: upper, pair: lower },
      { label: lower, pair: lower }
    ])
  };
}

function trace(
  id: string,
  packId: string,
  lessonId: string,
  title: string,
  prompt: string,
  traceGlyph: string,
  skillId: string
): LettersBatch11ActivitySeed {
  return {
    kind: "trace",
    id,
    packId,
    lessonId,
    title,
    description: "Latihan pembentukan huruf sebagai practice motorik; completion tidak dianggap akurasi bentuk atau mastery.",
    emoji: "✍️",
    ageMin: 4,
    ageMax: 7,
    difficulty: 2,
    requiredForStage: false,
    skillId,
    prompt,
    traceGlyph
  };
}

const uppercase: LettersBatch11ActivitySeed[] = [
  choice("letters-find-upper-g", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf G", "Mana huruf G?", ["C", "O", "G"], "G", "letters.latin.uppercase.recognition.middle", { required: true, emoji: "G" }),
  choice("letters-find-upper-h", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf H", "Mana huruf H?", ["N", "H", "A"], "H", "letters.latin.uppercase.recognition.middle", { emoji: "H" }),
  choice("letters-find-upper-i", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf I", "Mana huruf I?", ["J", "L", "I"], "I", "letters.latin.uppercase.recognition.middle", { emoji: "I" }),
  choice("letters-find-upper-j", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf J", "Mana huruf J?", ["I", "J", "L"], "J", "letters.latin.uppercase.recognition.middle", { required: true, emoji: "J" }),
  choice("letters-find-upper-k", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf K", "Mana huruf K?", ["X", "K", "R"], "K", "letters.latin.uppercase.recognition.middle", { emoji: "K" }),
  choice("letters-find-upper-l", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf L", "Mana huruf L?", ["I", "T", "L"], "L", "letters.latin.uppercase.recognition.middle", { emoji: "L" }),
  choice("letters-find-upper-m", "letters.pack.uppercase-g-m", "letters-uppercase-g-m", "Cari huruf M", "Mana huruf M?", ["W", "N", "M"], "M", "letters.latin.uppercase.recognition.middle", { required: true, emoji: "M" })
];

const lowercase: LettersBatch11ActivitySeed[] = [
  choice("letters-find-lower-g", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf g", "Mana huruf kecil g?", ["q", "p", "g"], "g", "letters.latin.lowercase.recognition.middle", { required: true, emoji: "g" }),
  choice("letters-find-lower-h", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf h", "Mana huruf kecil h?", ["n", "b", "h"], "h", "letters.latin.lowercase.recognition.middle", { emoji: "h" }),
  choice("letters-find-lower-i", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf i", "Mana huruf kecil i?", ["l", "j", "i"], "i", "letters.latin.lowercase.recognition.middle", { emoji: "i" }),
  choice("letters-find-lower-j", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf j", "Mana huruf kecil j?", ["i", "j", "l"], "j", "letters.latin.lowercase.recognition.middle", { required: true, emoji: "j" }),
  choice("letters-find-lower-k", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf k", "Mana huruf kecil k?", ["h", "x", "k"], "k", "letters.latin.lowercase.recognition.middle", { emoji: "k" }),
  choice("letters-find-lower-l", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf l", "Mana huruf kecil l?", ["i", "t", "l"], "l", "letters.latin.lowercase.recognition.middle", { emoji: "l" }),
  choice("letters-find-lower-m", "letters.pack.lowercase-g-m", "letters-lowercase-g-m", "Cari huruf m", "Mana huruf kecil m?", ["n", "h", "m"], "m", "letters.latin.lowercase.recognition.middle", { required: true, emoji: "m" })
];

const caseMatching: LettersBatch11ActivitySeed[] = [
  matching("letters-match-case-gh", "letters.pack.case-matching-middle", "letters-case-matching-middle", "Pasangkan G dan H", "Pasangkan huruf besar dan kecil yang sama.", "letters.latin.case_matching.middle", [{ upper: "G", lower: "g" }, { upper: "H", lower: "h" }], { required: true }),
  matching("letters-match-case-ij", "letters.pack.case-matching-middle", "letters-case-matching-middle", "Pasangkan I dan J", "Pasangkan huruf besar dan kecil yang sama.", "letters.latin.case_matching.middle", [{ upper: "I", lower: "i" }, { upper: "J", lower: "j" }]),
  matching("letters-match-case-klm", "letters.pack.case-matching-middle", "letters-case-matching-middle", "Pasangkan K, L, M", "Cari pasangan bentuk besar-kecil K, L, dan M.", "letters.latin.case_matching.middle", [{ upper: "K", lower: "k" }, { upper: "L", lower: "l" }, { upper: "M", lower: "m" }], { required: true })
];

const sequence: LettersBatch11ActivitySeed[] = [
  choice("letters-order-after-g", "letters.pack.sequence-g-m", "letters-sequence-g-m", "Setelah G", "Huruf apa setelah G?", ["F", "H", "I"], "H", "letters.latin.sequence.middle", { required: true, emoji: "➡️" }),
  choice("letters-order-between-jl", "letters.pack.sequence-g-m", "letters-sequence-g-m", "Di antara J dan L", "Huruf apa di antara J dan L?", ["I", "K", "M"], "K", "letters.latin.sequence.middle", { required: true, emoji: "↔️" }),
  choice("letters-order-before-m", "letters.pack.sequence-g-m", "letters-sequence-g-m", "Sebelum M", "Huruf apa tepat sebelum M?", ["K", "L", "N"], "L", "letters.latin.sequence.middle", { emoji: "⬅️" })
];

const discrimination: LettersBatch11ActivitySeed[] = [
  choice("letters-discriminate-upper-gc", "letters.pack.visual-discrimination-middle", "letters-visual-discrimination-middle", "Bedakan G dan C", "Pilih huruf G.", ["C", "G", "O"], "G", "letters.latin.visual_discrimination.middle", { required: true, difficulty: 2, emoji: "🔎" }),
  choice("letters-discriminate-lower-gq", "letters.pack.visual-discrimination-middle", "letters-visual-discrimination-middle", "Bedakan g dan q", "Pilih huruf kecil g.", ["q", "g", "p"], "g", "letters.latin.visual_discrimination.middle", { required: true, difficulty: 2, emoji: "🔎" })
];

const formationPractice: LettersBatch11ActivitySeed[] = [
  trace("letters-trace-g-practice", "letters.pack.formation-middle-practice", "letters-formation-middle-practice", "Latihan bentuk G", "Ikuti bentuk huruf G dengan jari.", "G", "letters.latin.formation.practice.middle"),
  trace("letters-trace-i-practice", "letters.pack.formation-middle-practice", "letters-formation-middle-practice", "Latihan bentuk I", "Ikuti bentuk huruf I dengan jari.", "I", "letters.latin.formation.practice.middle"),
  trace("letters-trace-m-practice", "letters.pack.formation-middle-practice", "letters-formation-middle-practice", "Latihan bentuk M", "Ikuti bentuk huruf M dengan jari.", "M", "letters.latin.formation.practice.middle")
];

export const LETTERS_BATCH11_WAVE_B: LettersBatch11WaveDefinition = {
  wave: "B",
  stage: {
    id: STAGE_ID,
    subjectId: "letters",
    title: "Huruf G–M & Urutan",
    subtitle: "Kenali G–M, pasangkan bentuk besar-kecil, urutkan alfabet, bedakan bentuk mirip, lalu praktikkan beberapa bentuk huruf.",
    emoji: "🔡"
  },
  lessons: [
    { id: "letters-uppercase-g-m", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf besar G–M", objective: "Mengenali bentuk huruf besar G sampai M.", ageMin: 4, ageMax: 7 },
    { id: "letters-lowercase-g-m", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf kecil g–m", objective: "Mengenali bentuk huruf kecil g sampai m.", ageMin: 4, ageMax: 7 },
    { id: "letters-case-matching-middle", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Pasangan G–M", objective: "Memasangkan bentuk huruf besar dan kecil G sampai M.", ageMin: 4, ageMax: 7 },
    { id: "letters-sequence-g-m", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Urutan G–M", objective: "Menentukan huruf sebelum, sesudah, dan di antara huruf pada rentang G sampai M.", ageMin: 4, ageMax: 7 },
    { id: "letters-visual-discrimination-middle", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Bedakan bentuk G–M", objective: "Membedakan beberapa bentuk huruf tengah yang mudah tertukar.", ageMin: 4, ageMax: 7 },
    { id: "letters-formation-middle-practice", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Praktik bentuk G, I, M", objective: "Mempraktikkan gerakan membentuk G, I, dan M tanpa mengklaim akurasi bentuk atau mastery.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "letters.pack.uppercase-g-m", title: "Uppercase G–M", lessonId: "letters-uppercase-g-m", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.lowercase-g-m", title: "Lowercase g–m", lessonId: "letters-lowercase-g-m", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.case-matching-middle", title: "Middle Case Matching", lessonId: "letters-case-matching-middle", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.sequence-g-m", title: "Alphabet Sequence G–M", lessonId: "letters-sequence-g-m", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.visual-discrimination-middle", title: "Middle Letter Visual Discrimination", lessonId: "letters-visual-discrimination-middle", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.formation-middle-practice", title: "Middle Letter Formation Practice", lessonId: "letters-formation-middle-practice", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "letters.latin.uppercase.recognition.middle", subjectId: "letters", title: "Mengenali huruf besar G–M", description: "Mengenali bentuk huruf besar G sampai M.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.lowercase.recognition.middle", subjectId: "letters", title: "Mengenali huruf kecil g–m", description: "Mengenali bentuk huruf kecil g sampai m.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.case_matching.middle", subjectId: "letters", title: "Pasangan bentuk G–M", description: "Memasangkan huruf besar dan kecil pada rentang G sampai M.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.sequence.middle", subjectId: "letters", title: "Urutan alfabet G–M", description: "Menentukan posisi sebelum, sesudah, dan di antara huruf pada rentang G sampai M.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.visual_discrimination.middle", subjectId: "letters", title: "Diskriminasi visual huruf tengah", description: "Membedakan bentuk huruf G–M yang memiliki ciri visual serupa.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.formation.practice.middle", subjectId: "letters", title: "Praktik pembentukan G, I, M", description: "Praktik motorik membentuk G, I, dan M tanpa klaim akurasi atau mastery.", domain: "motor", ageMin: 4, ageMax: 7 }
  ],
  activities: [...uppercase, ...lowercase, ...caseMatching, ...sequence, ...discrimination, ...formationPractice]
};
