import {
  iqroLetter,
  type IqroBatch10ActivitySeed,
  type IqroBatch10Letter,
  type IqroBatch10WaveDefinition
} from "./iqroBatch10Authoring";

const STAGE_ID = "iqro-advanced-families";
const LETTERS = ["shad", "dhad", "tha", "zha", "ain", "ghain", "fa", "qaf"].map(iqroLetter);
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan pengenalan dan diskriminasi Hijaiyah draft yang tetap memerlukan review pengajar kompeten.", emoji: options.emoji ?? "🌙", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan label nama huruf lalu pilih bentuknya; audio dan materi tetap berstatus expert_required.", emoji: "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, title: string, letters: IqroBatch10Letter[], required = false): IqroBatch10ActivitySeed {
  return { kind: "matching", id, packId: "iqro.pack.advanced-name-matching", lessonId: "iqro-advanced-name-matching", title, description: "Pasangkan bentuk Hijaiyah dengan label nama yang digunakan registry Iqro Mainlagi.", emoji: "🧩", ageMin: 5, ageMax: 7, difficulty: 2, requiredForStage: required, skillId: "iqro.hijaiyah.name_matching.advanced", prompt: "Pasangkan bentuk dengan label nama.", matchItems: letters.flatMap((letter) => [{ label: letter.glyph, pair: letter.slug }, { label: letter.latin, pair: letter.slug }]) };
}

function visualChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [letter.glyph, LETTERS[(index + 1) % LETTERS.length]!.glyph, LETTERS[(index + 4) % LETTERS.length]!.glyph];
}

function listeningChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [LETTERS[(index + 3) % LETTERS.length]!.glyph, letter.glyph, LETTERS[(index + 6) % LETTERS.length]!.glyph];
}

const recognition = LETTERS.map((letter, index) => choice(
  `iqro-find-${letter.slug}`,
  "iqro.pack.advanced-recognition",
  "iqro-advanced-recognition",
  `Cari ${letter.latin}`,
  `Pilih bentuk ${letter.latin}.`,
  visualChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.recognition.advanced",
  { required: index === 0 || index === 4 || index === 6, emoji: letter.glyph }
));

const listening = LETTERS.map((letter, index) => listen(
  `iqro-listen-${letter.slug}`,
  "iqro.pack.advanced-listening",
  "iqro-advanced-listening",
  `Dengar: ${letter.latin}`,
  letter.latin,
  listeningChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.listening.advanced",
  { required: index === 1 || index === 5 || index === 7 }
));

const dotFeatures: IqroBatch10ActivitySeed[] = [
  choice("iqro-dots-dhad", "iqro.pack.advanced-dots", "iqro-advanced-dots", "Titik Dhad", `Berapa jumlah titik pada ${iqroLetter("dhad").glyph}?`, ["0 titik", "1 titik", "2 titik", "3 titik"], "1 titik", "iqro.hijaiyah.dot_features.advanced", { required: true, emoji: "•" }),
  choice("iqro-dots-zha", "iqro.pack.advanced-dots", "iqro-advanced-dots", "Titik Zha", `Berapa jumlah titik pada ${iqroLetter("zha").glyph}?`, ["2 titik", "0 titik", "1 titik", "3 titik"], "1 titik", "iqro.hijaiyah.dot_features.advanced", { emoji: "•" }),
  choice("iqro-dots-ghain", "iqro.pack.advanced-dots", "iqro-advanced-dots", "Titik Ghain", `Berapa jumlah titik pada ${iqroLetter("ghain").glyph}?`, ["3 titik", "2 titik", "0 titik", "1 titik"], "1 titik", "iqro.hijaiyah.dot_features.advanced", { required: true, emoji: "•" }),
  choice("iqro-dots-qaf", "iqro.pack.advanced-dots", "iqro-advanced-dots", "Titik Qaf", `Berapa jumlah titik pada ${iqroLetter("qaf").glyph}?`, ["1 titik", "3 titik", "2 titik", "0 titik"], "2 titik", "iqro.hijaiyah.dot_features.advanced", { difficulty: 3, emoji: "•" })
];

const nameMatching = [
  matching("iqro-match-name-shad-zha", "Pasangkan Shad sampai Zha", LETTERS.slice(0, 4), true),
  matching("iqro-match-name-ain-qaf", "Pasangkan Ain sampai Qaf", LETTERS.slice(4, 8), true)
];

const familyFeatures: IqroBatch10ActivitySeed[] = [
  choice("iqro-family-shad-dhad", "iqro.pack.advanced-families", "iqro-advanced-families", "Keluarga Shad–Dhad", "Pasangan mana yang merupakan Shad dan Dhad?", ["ص · ض", "ط · ظ", "ع · غ"], "ص · ض", "iqro.hijaiyah.family_discrimination.advanced", { required: true }),
  choice("iqro-family-ain-ghain", "iqro.pack.advanced-families", "iqro-advanced-families", "Keluarga Ain–Ghain", "Pasangan mana yang merupakan Ain dan Ghain?", ["ف · ق", "ع · غ", "ص · ض"], "ع · غ", "iqro.hijaiyah.family_discrimination.advanced", { required: true }),
  choice("iqro-family-fa-qaf", "iqro.pack.advanced-families", "iqro-advanced-families", "Bedakan Fa dan Qaf", "Pasangan mana yang merupakan Fa dan Qaf?", ["ط · ظ", "ص · ض", "ف · ق"], "ف · ق", "iqro.hijaiyah.family_discrimination.advanced", { difficulty: 3 })
];

export const IQRO_BATCH10_WAVE_C: IqroBatch10WaveDefinition = {
  wave: "C",
  stage: { id: STAGE_ID, subjectId: "iqro", title: "Keluarga Hijaiyah Lanjutan", subtitle: "Kenali Shad sampai Qaf lewat bentuk, label nama, titik, dan pasangan keluarga.", emoji: "🌙" },
  lessons: [
    { id: "iqro-advanced-recognition", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Kenali Shad sampai Qaf", objective: "Mengenali bentuk Shad, Dhad, Tha, Zha, Ain, Ghain, Fa, dan Qaf.", ageMin: 4, ageMax: 7 },
    { id: "iqro-advanced-listening", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Dengar nama huruf lanjutan", objective: "Menghubungkan label nama kelompok lanjutan dengan bentuknya; audio tetap memerlukan review pengajar.", ageMin: 4, ageMax: 7 },
    { id: "iqro-advanced-dots", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Ciri titik kelompok lanjutan", objective: "Memperhatikan jumlah titik pada huruf bertitik di kelompok lanjutan.", ageMin: 4, ageMax: 7 },
    { id: "iqro-advanced-name-matching", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Pasangkan nama lanjutan", objective: "Memasangkan bentuk Shad sampai Qaf dengan label nama registry Mainlagi.", ageMin: 5, ageMax: 7 },
    { id: "iqro-advanced-families", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Bedakan pasangan bentuk", objective: "Membedakan keluarga Shad–Dhad, Ain–Ghain, dan Fa–Qaf secara visual.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "iqro.pack.advanced-recognition", title: "Advanced Recognition — Expert Review Required", lessonId: "iqro-advanced-recognition", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.advanced-listening", title: "Advanced Listening — Expert Review Required", lessonId: "iqro-advanced-listening", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.advanced-dots", title: "Advanced Dot Features — Expert Review Required", lessonId: "iqro-advanced-dots", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.advanced-name-matching", title: "Advanced Name Matching — Expert Review Required", lessonId: "iqro-advanced-name-matching", ageMin: 5, ageMax: 7 },
    { id: "iqro.pack.advanced-families", title: "Advanced Family Discrimination — Expert Review Required", lessonId: "iqro-advanced-families", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "iqro.hijaiyah.recognition.advanced", subjectId: "iqro", title: "Kenali huruf lanjutan", description: "Mengenali bentuk Shad, Dhad, Tha, Zha, Ain, Ghain, Fa, dan Qaf.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.listening.advanced", subjectId: "iqro", title: "Dengar label huruf lanjutan", description: "Menghubungkan label nama kelompok lanjutan dengan bentuk; memerlukan review audio pengajar.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.dot_features.advanced", subjectId: "iqro", title: "Ciri titik huruf lanjutan", description: "Menggunakan jumlah titik untuk membedakan beberapa huruf pada kelompok lanjutan.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.name_matching.advanced", subjectId: "iqro", title: "Pasangkan nama dan bentuk lanjutan", description: "Memasangkan bentuk kelompok lanjutan dengan label nama registry Mainlagi.", domain: "religious_literacy", ageMin: 5, ageMax: 7 },
    { id: "iqro.hijaiyah.family_discrimination.advanced", subjectId: "iqro", title: "Bedakan keluarga bentuk lanjutan", description: "Membedakan pasangan Shad–Dhad, Ain–Ghain, dan Fa–Qaf secara visual.", domain: "religious_literacy", ageMin: 5, ageMax: 7 }
  ],
  activities: [...recognition, ...listening, ...dotFeatures, ...nameMatching, ...familyFeatures]
};