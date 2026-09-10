import {
  iqroLetter,
  type IqroBatch10ActivitySeed,
  type IqroBatch10Letter,
  type IqroBatch10WaveDefinition
} from "./iqroBatch10Authoring";

const STAGE_ID = "iqro-middle-families";
const LETTERS = ["dal", "dzal", "ra", "zai", "sin", "syin"].map(iqroLetter);
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan diskriminasi visual Hijaiyah draft yang tetap memerlukan review pengajar kompeten.", emoji: options.emoji ?? "🌙", ageMin: options.ageMin ?? 3, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan label nama huruf lalu pilih bentuknya; audio dan materi tetap berstatus expert_required.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 3, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, title: string, letters: IqroBatch10Letter[], required = false): IqroBatch10ActivitySeed {
  return { kind: "matching", id, packId: "iqro.pack.middle-name-matching", lessonId: "iqro-middle-name-matching", title, description: "Pasangkan bentuk Hijaiyah dengan label nama yang digunakan registry Iqro Mainlagi.", emoji: "🧩", ageMin: 4, ageMax: 7, difficulty: 2, requiredForStage: required, skillId: "iqro.hijaiyah.name_matching.middle", prompt: "Pasangkan bentuk dengan label nama.", matchItems: letters.flatMap((letter) => [{ label: letter.glyph, pair: letter.slug }, { label: letter.latin, pair: letter.slug }]) };
}

function visualChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [letter.glyph, LETTERS[(index + 1) % LETTERS.length]!.glyph, LETTERS[(index + 3) % LETTERS.length]!.glyph];
}

function listeningChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [LETTERS[(index + 2) % LETTERS.length]!.glyph, letter.glyph, LETTERS[(index + 5) % LETTERS.length]!.glyph];
}

const recognition = LETTERS.map((letter, index) => choice(
  `iqro-find-${letter.slug}`,
  "iqro.pack.middle-recognition",
  "iqro-middle-recognition",
  `Cari ${letter.latin}`,
  `Mana huruf ${letter.latin}?`,
  visualChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.recognition.middle",
  { required: index === 0 || index === 4, emoji: letter.glyph }
));

const listening = LETTERS.map((letter, index) => listen(
  `iqro-listen-${letter.slug}`,
  "iqro.pack.middle-listening",
  "iqro-middle-listening",
  `Dengar: ${letter.latin}`,
  letter.latin,
  listeningChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.listening.middle",
  { required: index === 1 || index === 5 }
));

const dotCount = LETTERS.map((letter, index) => choice(
  `iqro-dots-${letter.slug}`,
  "iqro.pack.middle-dots",
  "iqro-middle-dots",
  `Titik ${letter.latin}`,
  `Berapa jumlah titik pada ${letter.glyph}?`,
  ["0 titik", "1 titik", "2 titik", "3 titik"],
  `${letter.dots} titik`,
  "iqro.hijaiyah.dot_count.middle",
  { required: index === 2, difficulty: 2, ageMin: 4, emoji: "•" }
));

const nameMatching = [
  matching("iqro-match-name-dal-dzal", "Pasangkan Dal dan Dzal", LETTERS.slice(0, 2), true),
  matching("iqro-match-name-ra-zai", "Pasangkan Ra dan Zai", LETTERS.slice(2, 4)),
  matching("iqro-match-name-sin-syin", "Pasangkan Sin dan Syin", LETTERS.slice(4, 6), true)
];

const familyFeatures: IqroBatch10ActivitySeed[] = [
  choice("iqro-family-dal-dzal", "iqro.pack.middle-families", "iqro-middle-families", "Keluarga Dal–Dzal", "Pasangan mana yang merupakan Dal dan Dzal?", ["د · ذ", "ر · ز", "س · ش"], "د · ذ", "iqro.hijaiyah.family_discrimination.middle", { required: true, difficulty: 2 }),
  choice("iqro-family-ra-zai", "iqro.pack.middle-families", "iqro-middle-families", "Keluarga Ra–Zai", "Pasangan mana yang merupakan Ra dan Zai?", ["س · ش", "ر · ز", "د · ذ"], "ر · ز", "iqro.hijaiyah.family_discrimination.middle", { difficulty: 2 }),
  choice("iqro-family-sin-syin", "iqro.pack.middle-families", "iqro-middle-families", "Keluarga Sin–Syin", "Pasangan mana yang merupakan Sin dan Syin?", ["د · ذ", "س · ش", "ر · ز"], "س · ش", "iqro.hijaiyah.family_discrimination.middle", { required: true, difficulty: 2 }),
  choice("iqro-family-three-dot-contrast", "iqro.pack.middle-families", "iqro-middle-families", "Kontras tiga titik", "Keluarga mana yang memuat bentuk tanpa titik dan bentuk dengan tiga titik?", ["Dal–Dzal", "Ra–Zai", "Sin–Syin"], "Sin–Syin", "iqro.hijaiyah.family_discrimination.middle", { difficulty: 3, ageMin: 5 })
];

export const IQRO_BATCH10_WAVE_B: IqroBatch10WaveDefinition = {
  wave: "B",
  stage: { id: STAGE_ID, subjectId: "iqro", title: "Keluarga Bentuk Hijaiyah Menengah", subtitle: "Kenali Dal–Dzal, Ra–Zai, dan Sin–Syin lewat bentuk, nama, dan titik.", emoji: "🌙" },
  lessons: [
    { id: "iqro-middle-recognition", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Kenali enam huruf menengah", objective: "Mengenali bentuk Dal, Dzal, Ra, Zai, Sin, dan Syin.", ageMin: 3, ageMax: 7 },
    { id: "iqro-middle-listening", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Dengar nama huruf menengah", objective: "Menghubungkan label nama enam huruf menengah dengan bentuknya; audio tetap memerlukan review pengajar.", ageMin: 3, ageMax: 7 },
    { id: "iqro-middle-dots", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Titik pada huruf menengah", objective: "Menggunakan jumlah titik sebagai petunjuk visual pembeda huruf.", ageMin: 4, ageMax: 7 },
    { id: "iqro-middle-name-matching", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Pasangkan nama dan bentuk", objective: "Memasangkan bentuk dengan label nama kanonik Mainlagi.", ageMin: 4, ageMax: 7 },
    { id: "iqro-middle-families", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Bedakan keluarga bentuk", objective: "Mengelompokkan pasangan bentuk Dal–Dzal, Ra–Zai, dan Sin–Syin.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "iqro.pack.middle-recognition", title: "Middle Recognition — Expert Review Required", lessonId: "iqro-middle-recognition", ageMin: 3, ageMax: 7 },
    { id: "iqro.pack.middle-listening", title: "Middle Listening — Expert Review Required", lessonId: "iqro-middle-listening", ageMin: 3, ageMax: 7 },
    { id: "iqro.pack.middle-dots", title: "Middle Dot Awareness — Expert Review Required", lessonId: "iqro-middle-dots", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.middle-name-matching", title: "Middle Name Matching — Expert Review Required", lessonId: "iqro-middle-name-matching", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.middle-families", title: "Middle Family Discrimination — Expert Review Required", lessonId: "iqro-middle-families", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "iqro.hijaiyah.recognition.middle", subjectId: "iqro", title: "Kenali huruf menengah", description: "Mengenali bentuk Dal, Dzal, Ra, Zai, Sin, dan Syin.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
    { id: "iqro.hijaiyah.listening.middle", subjectId: "iqro", title: "Dengar label huruf menengah", description: "Menghubungkan label nama huruf menengah dengan bentuk; memerlukan review audio pengajar.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
    { id: "iqro.hijaiyah.dot_count.middle", subjectId: "iqro", title: "Jumlah titik huruf menengah", description: "Menggunakan jumlah titik sebagai petunjuk visual pada kelompok menengah.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.name_matching.middle", subjectId: "iqro", title: "Pasangkan nama dan bentuk menengah", description: "Memasangkan bentuk kelompok menengah dengan label nama registry Mainlagi.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.family_discrimination.middle", subjectId: "iqro", title: "Bedakan keluarga bentuk menengah", description: "Membedakan pasangan keluarga Dal–Dzal, Ra–Zai, dan Sin–Syin.", domain: "religious_literacy", ageMin: 4, ageMax: 7 }
  ],
  activities: [...recognition, ...listening, ...dotCount, ...nameMatching, ...familyFeatures]
};