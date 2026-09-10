import {
  iqroLetter,
  type IqroBatch10ActivitySeed,
  type IqroBatch10Letter,
  type IqroBatch10WaveDefinition
} from "./iqroBatch10Authoring";

const STAGE_ID = "iqro-recognition-basics";
const EARLY = ["ba", "ta", "tsa", "jim", "ha", "kha"].map(iqroLetter);
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan pengenalan Hijaiyah draft yang tetap memerlukan review pengajar kompeten.", emoji: options.emoji ?? "🌙", ageMin: options.ageMin ?? 3, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan label nama huruf lalu pilih bentuknya; audio dan materi tetap berstatus expert_required.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 3, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, letters: IqroBatch10Letter[], options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan bentuk Hijaiyah dengan label nama yang digunakan oleh registry Iqro Mainlagi.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: letters.flatMap((letter) => [{ label: letter.glyph, pair: letter.slug }, { label: letter.latin, pair: letter.slug }]) };
}

function visualChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [letter.glyph, EARLY[(index + 1) % EARLY.length]!.glyph, EARLY[(index + 2) % EARLY.length]!.glyph];
}

function listeningChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [EARLY[(index + 2) % EARLY.length]!.glyph, letter.glyph, EARLY[(index + 4) % EARLY.length]!.glyph];
}

const bowlFind = EARLY.slice(0, 3).map((letter, index) => choice(
  `iqro-find-${letter.slug}`,
  "iqro.pack.early-bowl-family",
  "iqro-early-bowl-family",
  `Cari ${letter.latin}`,
  `Mana huruf ${letter.latin}?`,
  visualChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.recognition.early_bowl",
  { required: index === 0, emoji: letter.glyph }
));

const curveFind = EARLY.slice(3).map((letter, localIndex) => {
  const index = localIndex + 3;
  return choice(
    `iqro-find-${letter.slug}`,
    "iqro.pack.early-curve-family",
    "iqro-early-curve-family",
    `Cari ${letter.latin}`,
    `Pilih bentuk ${letter.latin}.`,
    visualChoices(letter, index),
    letter.glyph,
    "iqro.hijaiyah.visual_discrimination.early_curve",
    { required: localIndex === 0, emoji: letter.glyph }
  );
});

const listening = EARLY.map((letter, index) => listen(
  `iqro-listen-${letter.slug}`,
  "iqro.pack.early-listening",
  "iqro-early-listening",
  `Dengar: ${letter.latin}`,
  letter.latin,
  listeningChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.listening.early",
  { required: index === 0 || index === 3, emoji: "🔊" }
));

const dotCount = EARLY.map((letter, index) => choice(
  `iqro-dots-${letter.slug}`,
  "iqro.pack.early-dots",
  "iqro-early-dots",
  `Titik ${letter.latin}`,
  `Berapa jumlah titik pada ${letter.glyph}?`,
  ["0 titik", "1 titik", "2 titik", "3 titik"],
  `${letter.dots} titik`,
  "iqro.hijaiyah.dot_count.early",
  { required: index === 1 || index === 4, difficulty: 2, ageMin: 4, emoji: "•" }
));

const nameMatching = [
  matching("iqro-match-name-ba-ta", "iqro.pack.early-name-matching", "iqro-early-name-matching", "Pasangkan Ba dan Ta", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.early", EARLY.slice(0, 2), { required: true }),
  matching("iqro-match-name-tsa-jim", "iqro.pack.early-name-matching", "iqro-early-name-matching", "Pasangkan Tsa dan Jim", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.early", EARLY.slice(2, 4)),
  matching("iqro-match-name-ha-kha", "iqro.pack.early-name-matching", "iqro-early-name-matching", "Pasangkan Ha dan Kha", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.early", EARLY.slice(4, 6), { required: true })
];

export const IQRO_BATCH10_WAVE_A: IqroBatch10WaveDefinition = {
  wave: "A",
  stage: { id: STAGE_ID, subjectId: "iqro", title: "Kenal Bentuk Hijaiyah Awal", subtitle: "Bedakan bentuk, label nama, dan jumlah titik pada kelompok awal setelah Alif.", emoji: "🌙" },
  lessons: [
    { id: "iqro-early-bowl-family", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Ba, Ta, Tsa", objective: "Membedakan bentuk dasar Ba, Ta, dan Tsa secara visual.", ageMin: 3, ageMax: 7 },
    { id: "iqro-early-curve-family", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Jim, Ha, Kha", objective: "Membedakan bentuk dasar Jim, Ha, dan Kha secara visual.", ageMin: 3, ageMax: 7 },
    { id: "iqro-early-listening", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Dengar nama huruf awal", objective: "Menghubungkan label nama huruf awal dengan bentuk yang sesuai; audio tetap memerlukan review pengajar.", ageMin: 3, ageMax: 7 },
    { id: "iqro-early-dots", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Hitung titik", objective: "Memperhatikan jumlah titik sebagai ciri visual pembeda huruf.", ageMin: 4, ageMax: 7 },
    { id: "iqro-early-name-matching", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Pasangkan nama dan bentuk", objective: "Memasangkan bentuk huruf dengan label nama dari registry Iqro Mainlagi.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "iqro.pack.early-bowl-family", title: "Ba Ta Tsa — Expert Review Required", lessonId: "iqro-early-bowl-family", ageMin: 3, ageMax: 7 },
    { id: "iqro.pack.early-curve-family", title: "Jim Ha Kha — Expert Review Required", lessonId: "iqro-early-curve-family", ageMin: 3, ageMax: 7 },
    { id: "iqro.pack.early-listening", title: "Early Letter Listening — Expert Review Required", lessonId: "iqro-early-listening", ageMin: 3, ageMax: 7 },
    { id: "iqro.pack.early-dots", title: "Early Dot Awareness — Expert Review Required", lessonId: "iqro-early-dots", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.early-name-matching", title: "Early Name Matching — Expert Review Required", lessonId: "iqro-early-name-matching", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "iqro.hijaiyah.recognition.early_bowl", subjectId: "iqro", title: "Kenali Ba Ta Tsa", description: "Membedakan bentuk Ba, Ta, dan Tsa pada latihan visual awal.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
    { id: "iqro.hijaiyah.visual_discrimination.early_curve", subjectId: "iqro", title: "Bedakan Jim Ha Kha", description: "Membedakan bentuk Jim, Ha, dan Kha dengan perhatian pada ciri visualnya.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
    { id: "iqro.hijaiyah.listening.early", subjectId: "iqro", title: "Dengar label huruf awal", description: "Menghubungkan label nama huruf awal dengan bentuk yang sesuai; memerlukan review audio pengajar.", domain: "religious_literacy", ageMin: 3, ageMax: 7 },
    { id: "iqro.hijaiyah.dot_count.early", subjectId: "iqro", title: "Jumlah titik huruf awal", description: "Menggunakan jumlah titik sebagai petunjuk visual pembeda huruf Hijaiyah awal.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.name_matching.early", subjectId: "iqro", title: "Pasangkan nama dan bentuk awal", description: "Memasangkan bentuk huruf dengan label nama kanonik yang digunakan Mainlagi.", domain: "religious_literacy", ageMin: 4, ageMax: 7 }
  ],
  activities: [...bowlFind, ...curveFind, ...listening, ...dotCount, ...nameMatching]
};