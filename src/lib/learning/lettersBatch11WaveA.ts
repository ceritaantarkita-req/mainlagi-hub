import type {
  LettersBatch11ActivitySeed,
  LettersBatch11WaveDefinition
} from "./lettersBatch11Authoring";

const STAGE_ID = "letters-recognition-prewriting-basics";
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
    description: "Latihan visual singkat untuk mengenali dan membedakan bentuk huruf Latin.",
    emoji: options.emoji ?? "🔤",
    ageMin: options.ageMin ?? 3,
    ageMax: 7,
    difficulty: options.difficulty ?? 1,
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
    description: "Pasangkan bentuk huruf besar dengan huruf kecil yang sesuai.",
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
  options: SeedOptions = {}
): LettersBatch11ActivitySeed {
  return {
    kind: "trace",
    id,
    packId,
    lessonId,
    title,
    description: "Latihan motorik pra-menulis; penyelesaian tidak dinilai sebagai akurasi bentuk huruf.",
    emoji: options.emoji ?? "✍️",
    ageMin: options.ageMin ?? 3,
    ageMax: 7,
    difficulty: options.difficulty ?? 1,
    requiredForStage: false,
    skillId: "letters.prewriting.strokes.basic",
    prompt,
    traceGlyph
  };
}

const uppercase = [
  choice("letters-find-upper-b", "letters.pack.uppercase-b-f", "letters-uppercase-b-f", "Cari huruf B", "Mana huruf B?", ["D", "B", "P"], "B", "letters.latin.uppercase.recognition.early", { required: true, emoji: "B" }),
  choice("letters-find-upper-c", "letters.pack.uppercase-b-f", "letters-uppercase-b-f", "Cari huruf C", "Mana huruf C?", ["O", "G", "C"], "C", "letters.latin.uppercase.recognition.early", { emoji: "C" }),
  choice("letters-find-upper-d", "letters.pack.uppercase-b-f", "letters-uppercase-b-f", "Cari huruf D", "Mana huruf D?", ["B", "O", "D"], "D", "letters.latin.uppercase.recognition.early", { emoji: "D" }),
  choice("letters-find-upper-e", "letters.pack.uppercase-b-f", "letters-uppercase-b-f", "Cari huruf E", "Mana huruf E?", ["F", "E", "L"], "E", "letters.latin.uppercase.recognition.early", { required: true, emoji: "E" }),
  choice("letters-find-upper-f", "letters.pack.uppercase-b-f", "letters-uppercase-b-f", "Cari huruf F", "Mana huruf F?", ["T", "E", "F"], "F", "letters.latin.uppercase.recognition.early", { emoji: "F" })
];

const lowercase = [
  choice("letters-find-lower-b", "letters.pack.lowercase-b-f", "letters-lowercase-b-f", "Cari huruf b", "Mana huruf kecil b?", ["d", "p", "b"], "b", "letters.latin.lowercase.recognition.early", { required: true, emoji: "b" }),
  choice("letters-find-lower-c", "letters.pack.lowercase-b-f", "letters-lowercase-b-f", "Cari huruf c", "Mana huruf kecil c?", ["o", "e", "c"], "c", "letters.latin.lowercase.recognition.early", { emoji: "c" }),
  choice("letters-find-lower-d", "letters.pack.lowercase-b-f", "letters-lowercase-b-f", "Cari huruf d", "Mana huruf kecil d?", ["b", "q", "d"], "d", "letters.latin.lowercase.recognition.early", { emoji: "d" }),
  choice("letters-find-lower-e", "letters.pack.lowercase-b-f", "letters-lowercase-b-f", "Cari huruf e", "Mana huruf kecil e?", ["c", "a", "e"], "e", "letters.latin.lowercase.recognition.early", { required: true, emoji: "e" }),
  choice("letters-find-lower-f", "letters.pack.lowercase-b-f", "letters-lowercase-b-f", "Cari huruf f", "Mana huruf kecil f?", ["t", "l", "f"], "f", "letters.latin.lowercase.recognition.early", { emoji: "f" })
];

const caseMatching = [
  matching("letters-match-case-cd", "letters.pack.case-matching-early", "letters-case-matching-early", "Pasangkan C dan D", "Pasangkan huruf besar dan kecil.", "letters.latin.case_matching.early", [{ upper: "C", lower: "c" }, { upper: "D", lower: "d" }], { required: true }),
  matching("letters-match-case-ef", "letters.pack.case-matching-early", "letters-case-matching-early", "Pasangkan E dan F", "Pasangkan huruf besar dan kecil.", "letters.latin.case_matching.early", [{ upper: "E", lower: "e" }, { upper: "F", lower: "f" }]),
  matching("letters-match-case-bce", "letters.pack.case-matching-early", "letters-case-matching-early", "Pasangkan B, C, E", "Cari pasangan huruf besar dan kecil yang sama.", "letters.latin.case_matching.early", [{ upper: "B", lower: "b" }, { upper: "C", lower: "c" }, { upper: "E", lower: "e" }], { required: true })
];

const discrimination = [
  choice("letters-discriminate-upper-b", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan B", "Pilih huruf B di antara bentuk yang mirip.", ["P", "R", "B"], "B", "letters.latin.visual_discrimination.early", { required: true, difficulty: 2, ageMin: 4, emoji: "🔎" }),
  choice("letters-discriminate-upper-c", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan C", "Pilih huruf C.", ["G", "O", "C"], "C", "letters.latin.visual_discrimination.early", { difficulty: 2, ageMin: 4, emoji: "🔎" }),
  choice("letters-discriminate-upper-e", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan E", "Pilih huruf E.", ["F", "L", "E"], "E", "letters.latin.visual_discrimination.early", { difficulty: 2, ageMin: 4, emoji: "🔎" }),
  choice("letters-discriminate-lower-bd", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan b dan d", "Pilih huruf kecil b.", ["d", "b", "p"], "b", "letters.latin.visual_discrimination.early", { required: true, difficulty: 2, ageMin: 4, emoji: "🔎" }),
  choice("letters-discriminate-lower-pq", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan p dan q", "Pilih huruf kecil p.", ["q", "g", "p"], "p", "letters.latin.visual_discrimination.early", { difficulty: 2, ageMin: 4, emoji: "🔎" }),
  choice("letters-discriminate-lower-mn", "letters.pack.visual-discrimination-early", "letters-visual-discrimination-early", "Bedakan m dan n", "Pilih huruf kecil m.", ["n", "m", "h"], "m", "letters.latin.visual_discrimination.early", { difficulty: 2, ageMin: 4, emoji: "🔎" })
];

const prewriting = [
  trace("letters-stroke-vertical", "letters.pack.prewriting-strokes", "letters-prewriting-strokes", "Garis turun", "Ikuti garis dari atas ke bawah.", "|"),
  trace("letters-stroke-horizontal", "letters.pack.prewriting-strokes", "letters-prewriting-strokes", "Garis ke samping", "Ikuti garis dari kiri ke kanan.", "—"),
  trace("letters-stroke-diagonal", "letters.pack.prewriting-strokes", "letters-prewriting-strokes", "Garis miring", "Ikuti garis miring dengan jari.", "/")
];

export const LETTERS_BATCH11_WAVE_A: LettersBatch11WaveDefinition = {
  wave: "A",
  stage: {
    id: STAGE_ID,
    subjectId: "letters",
    title: "Kenal Huruf & Gerak Awal Menulis",
    subtitle: "Kenali B–F, pasangkan huruf besar-kecil, bedakan bentuk mirip, lalu latih garis dasar pra-menulis.",
    emoji: "✍️"
  },
  lessons: [
    { id: "letters-uppercase-b-f", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf besar B–F", objective: "Mengenali bentuk huruf besar B sampai F dari pilihan visual sederhana.", ageMin: 3, ageMax: 7 },
    { id: "letters-lowercase-b-f", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Huruf kecil b–f", objective: "Mengenali bentuk huruf kecil b sampai f dan membedakan bentuk yang mudah tertukar.", ageMin: 3, ageMax: 7 },
    { id: "letters-case-matching-early", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Pasangan besar & kecil", objective: "Memasangkan bentuk huruf besar dengan huruf kecil yang sesuai.", ageMin: 4, ageMax: 7 },
    { id: "letters-visual-discrimination-early", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Bedakan bentuk mirip", objective: "Membedakan huruf Latin awal yang memiliki ciri visual mirip.", ageMin: 4, ageMax: 7 },
    { id: "letters-prewriting-strokes", subjectId: "letters", pathId: "letters-writing-foundations", stageId: STAGE_ID, title: "Garis dasar pra-menulis", objective: "Melatih gerakan vertikal, horizontal, dan diagonal sebagai latihan motorik pra-menulis tanpa klaim akurasi bentuk huruf.", ageMin: 3, ageMax: 7 }
  ],
  packs: [
    { id: "letters.pack.uppercase-b-f", title: "Uppercase B–F", lessonId: "letters-uppercase-b-f", ageMin: 3, ageMax: 7 },
    { id: "letters.pack.lowercase-b-f", title: "Lowercase b–f", lessonId: "letters-lowercase-b-f", ageMin: 3, ageMax: 7 },
    { id: "letters.pack.case-matching-early", title: "Early Case Matching", lessonId: "letters-case-matching-early", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.visual-discrimination-early", title: "Early Letter Visual Discrimination", lessonId: "letters-visual-discrimination-early", ageMin: 4, ageMax: 7 },
    { id: "letters.pack.prewriting-strokes", title: "Basic Pre-writing Strokes", lessonId: "letters-prewriting-strokes", ageMin: 3, ageMax: 7 }
  ],
  skills: [
    { id: "letters.latin.uppercase.recognition.early", subjectId: "letters", title: "Mengenali huruf besar awal", description: "Mengenali bentuk huruf besar B sampai F pada pilihan visual sederhana.", domain: "literacy", ageMin: 3, ageMax: 7 },
    { id: "letters.latin.lowercase.recognition.early", subjectId: "letters", title: "Mengenali huruf kecil awal", description: "Mengenali bentuk huruf kecil b sampai f pada pilihan visual sederhana.", domain: "literacy", ageMin: 3, ageMax: 7 },
    { id: "letters.latin.case_matching.early", subjectId: "letters", title: "Pasangan huruf besar dan kecil", description: "Memasangkan huruf besar dengan huruf kecil yang sesuai.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.latin.visual_discrimination.early", subjectId: "letters", title: "Membedakan bentuk huruf mirip", description: "Membedakan beberapa bentuk huruf Latin yang tampak mirip secara visual.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "letters.prewriting.strokes.basic", subjectId: "letters", title: "Gerak dasar pra-menulis", description: "Melatih garis vertikal, horizontal, dan diagonal sebagai kesiapan motorik menulis.", domain: "motor", ageMin: 3, ageMax: 7 }
  ],
  activities: [...uppercase, ...lowercase, ...caseMatching, ...discrimination, ...prewriting]
};
