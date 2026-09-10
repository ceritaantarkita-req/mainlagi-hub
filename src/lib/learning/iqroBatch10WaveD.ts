import {
  iqroLetter,
  type IqroBatch10ActivitySeed,
  type IqroBatch10Letter,
  type IqroBatch10WaveDefinition
} from "./iqroBatch10Authoring";

const STAGE_ID = "iqro-final-families";
const FINAL = ["kaf", "lam", "mim", "nun", "ha-besar", "wawu", "ya", "hamzah"].map(iqroLetter);
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan Hijaiyah akhir pada Batch 10; materi tetap memerlukan review pengajar kompeten.", emoji: options.emoji ?? "🌙", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan label nama huruf lalu pilih bentuknya; audio tetap berstatus expert_required.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, letters: IqroBatch10Letter[], options: SeedOptions = {}): IqroBatch10ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan bentuk Hijaiyah akhir dengan label nama registry Mainlagi.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: letters.flatMap((letter) => [{ label: letter.glyph, pair: letter.slug }, { label: letter.latin, pair: letter.slug }]) };
}

function visualChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [letter.glyph, FINAL[(index + 1) % FINAL.length]!.glyph, FINAL[(index + 3) % FINAL.length]!.glyph];
}

function listeningChoices(letter: IqroBatch10Letter, index: number): string[] {
  return [FINAL[(index + 2) % FINAL.length]!.glyph, letter.glyph, FINAL[(index + 5) % FINAL.length]!.glyph];
}

const recognition = FINAL.map((letter, index) => choice(
  `iqro-find-${letter.slug}`,
  "iqro.pack.final-recognition",
  "iqro-final-recognition",
  `Cari ${letter.latin}`,
  `Mana huruf ${letter.latin}?`,
  visualChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.recognition.final",
  { required: index === 0 || index === 3 || index === 6, emoji: letter.glyph }
));

const listening = FINAL.map((letter, index) => listen(
  `iqro-listen-${letter.slug}`,
  "iqro.pack.final-listening",
  "iqro-final-listening",
  `Dengar: ${letter.latin}`,
  letter.latin,
  listeningChoices(letter, index),
  letter.glyph,
  "iqro.hijaiyah.listening.final",
  { required: index === 1 || index === 4 || index === 7 }
));

const dotFeatures = ["nun", "ya", "hamzah"].map(iqroLetter).map((letter, index) => choice(
  `iqro-dots-${letter.slug}-final`,
  "iqro.pack.final-dots",
  "iqro-final-dots",
  `Titik ${letter.latin}`,
  `Berapa jumlah titik pada ${letter.glyph}?`,
  ["0 titik", "1 titik", "2 titik", "3 titik"],
  `${letter.dots} titik`,
  "iqro.hijaiyah.dot_features.final",
  { required: index < 2, difficulty: index === 2 ? 3 : 2, ageMin: 5, emoji: "•" }
));

const nameMatching = [
  matching("iqro-match-name-kaf-lam-mim", "iqro.pack.final-name-matching", "iqro-final-name-matching", "Pasangkan Kaf Lam Mim", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.final", FINAL.slice(0, 3), { required: true }),
  matching("iqro-match-name-nun-ha-wawu", "iqro.pack.final-name-matching", "iqro-final-name-matching", "Pasangkan Nun Ha Wawu", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.final", FINAL.slice(3, 6), { required: true }),
  matching("iqro-match-name-ya-hamzah", "iqro.pack.final-name-matching", "iqro-final-name-matching", "Pasangkan Ya dan Hamzah", "Pasangkan bentuk dengan label nama.", "iqro.hijaiyah.name_matching.final", FINAL.slice(6, 8), { required: true })
];

const integration = [
  choice("iqro-review-order-kaf-lam", "iqro.pack.final-integration", "iqro-final-integration", "Urutan Kaf lalu Lam", "Pilih pasangan yang menunjukkan Kaf lalu Lam.", ["ك → ل", "ل → ك", "م → ن"], "ك → ل", "iqro.hijaiyah.integration.final", { required: true, difficulty: 3, ageMin: 5, emoji: "🧠" }),
  choice("iqro-review-distinguish-ha-wawu", "iqro.pack.final-integration", "iqro-final-integration", "Bedakan Ha besar dan Wawu", "Mana pasangan yang berisi Ha besar dan Wawu?", ["ه + و", "ن + ي", "ك + ل"], "ه + و", "iqro.hijaiyah.integration.final", { required: true, difficulty: 3, ageMin: 5, emoji: "🧠" }),
  choice("iqro-review-hamzah-identity", "iqro.pack.final-integration", "iqro-final-integration", "Kenali Hamzah", "Pilih Hamzah dari tiga bentuk ini.", ["ء", "ي", "و"], "ء", "iqro.hijaiyah.integration.final", { required: true, difficulty: 3, ageMin: 5, emoji: "🧠" })
];

export const IQRO_BATCH10_WAVE_D: IqroBatch10WaveDefinition = {
  wave: "D",
  stage: { id: STAGE_ID, subjectId: "iqro", title: "Hijaiyah Akhir & Review", subtitle: "Kenali kelompok Kaf sampai Ya, standalone Hamzah, lalu review integratif bentuk dan nama.", emoji: "🌟" },
  lessons: [
    { id: "iqro-final-recognition", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Kenal bentuk akhir", objective: "Mengenali Kaf, Lam, Mim, Nun, Ha besar, Wawu, Ya, dan standalone Hamzah pada registry Mainlagi.", ageMin: 4, ageMax: 7 },
    { id: "iqro-final-listening", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Dengar nama huruf akhir", objective: "Menghubungkan label nama huruf akhir dengan bentuk yang sesuai; audio tetap memerlukan review pengajar.", ageMin: 4, ageMax: 7 },
    { id: "iqro-final-dots", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Ciri titik akhir", objective: "Menggunakan jumlah titik sebagai ciri visual Nun, Ya, dan Hamzah.", ageMin: 5, ageMax: 7 },
    { id: "iqro-final-name-matching", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Pasangkan nama akhir", objective: "Memasangkan bentuk huruf akhir dengan label nama kanonik Mainlagi.", ageMin: 5, ageMax: 7 },
    { id: "iqro-final-integration", subjectId: "iqro", pathId: "iqro-fondasi-hijaiyah", stageId: STAGE_ID, title: "Review integratif Hijaiyah", objective: "Menggabungkan pengenalan urutan, pasangan bentuk, dan identitas huruf pada review akhir Batch 10.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "iqro.pack.final-recognition", title: "Final Recognition — Expert Review Required", lessonId: "iqro-final-recognition", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.final-listening", title: "Final Listening — Expert Review Required", lessonId: "iqro-final-listening", ageMin: 4, ageMax: 7 },
    { id: "iqro.pack.final-dots", title: "Final Dot Features — Expert Review Required", lessonId: "iqro-final-dots", ageMin: 5, ageMax: 7 },
    { id: "iqro.pack.final-name-matching", title: "Final Name Matching — Expert Review Required", lessonId: "iqro-final-name-matching", ageMin: 5, ageMax: 7 },
    { id: "iqro.pack.final-integration", title: "Final Integrated Review — Expert Review Required", lessonId: "iqro-final-integration", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "iqro.hijaiyah.recognition.final", subjectId: "iqro", title: "Kenali huruf akhir", description: "Mengenali bentuk kelompok Kaf sampai Ya dan standalone Hamzah.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.listening.final", subjectId: "iqro", title: "Dengar label huruf akhir", description: "Menghubungkan label nama huruf akhir dengan bentuk; memerlukan review audio pengajar.", domain: "religious_literacy", ageMin: 4, ageMax: 7 },
    { id: "iqro.hijaiyah.dot_features.final", subjectId: "iqro", title: "Ciri titik akhir", description: "Menggunakan ciri jumlah titik untuk membedakan beberapa bentuk akhir.", domain: "religious_literacy", ageMin: 5, ageMax: 7 },
    { id: "iqro.hijaiyah.name_matching.final", subjectId: "iqro", title: "Pasangkan nama dan bentuk akhir", description: "Memasangkan bentuk huruf akhir dengan label nama kanonik Mainlagi.", domain: "religious_literacy", ageMin: 5, ageMax: 7 },
    { id: "iqro.hijaiyah.integration.final", subjectId: "iqro", title: "Review integratif Hijaiyah", description: "Menggabungkan beberapa petunjuk visual dan label nama pada review akhir Batch 10.", domain: "religious_literacy", ageMin: 5, ageMax: 7 }
  ],
  activities: [...recognition, ...listening, ...dotFeatures, ...nameMatching, ...integration]
};