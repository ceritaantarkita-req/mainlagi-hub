import type { BahasaBatch8ActivitySeed, BahasaBatch8WaveDefinition } from "./bahasaBatch8Authoring";

const STAGE_ID = "bahasa-dasar-huruf";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Latihan literasi awal Bahasa Indonesia dengan pilihan yang jelas dan ramah anak.", emoji: options.emoji ?? "🔤", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan petunjuk lalu pilih huruf yang sesuai.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 1, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan bentuk atau bunyi huruf yang saling berhubungan.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const BAHASA_BATCH8_WAVE_A: BahasaBatch8WaveDefinition = {
  wave: "A",
  stage: { id: STAGE_ID, subjectId: "bahasa", title: "Dasar Huruf & Bunyi", subtitle: "Kenali vokal, bedakan konsonan, pasangkan huruf besar-kecil, dan dengarkan bunyi awal kata.", emoji: "🔤" },
  lessons: [
    { id: "bahasa-vokal-visual", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Kenal huruf vokal", objective: "Mengenali I, U, E, dan O sebagai perluasan dari pengenalan A yang sudah ada.", ageMin: 3, ageMax: 7 },
    { id: "bahasa-vokal-audio", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Dengar huruf vokal", objective: "Menghubungkan petunjuk audio dengan huruf vokal I, U, E, dan O.", ageMin: 3, ageMax: 7 },
    { id: "bahasa-klasifikasi-huruf", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Vokal atau konsonan", objective: "Membedakan contoh sederhana huruf vokal dan konsonan.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-huruf-besar-kecil", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Huruf besar dan kecil", objective: "Memasangkan bentuk huruf besar dengan huruf kecil yang sama.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-bunyi-awal", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Bunyi awal kata", objective: "Menentukan huruf awal pada kata benda sehari-hari yang familiar.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "bahasa.pack.vokal-visual", title: "Kenal Vokal", lessonId: "bahasa-vokal-visual", ageMin: 3, ageMax: 7 },
    { id: "bahasa.pack.vokal-audio", title: "Dengar Vokal", lessonId: "bahasa-vokal-audio", ageMin: 3, ageMax: 7 },
    { id: "bahasa.pack.klasifikasi-huruf", title: "Vokal & Konsonan", lessonId: "bahasa-klasifikasi-huruf", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.huruf-besar-kecil", title: "Huruf Besar-Kecil", lessonId: "bahasa-huruf-besar-kecil", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.bunyi-awal", title: "Bunyi Awal", lessonId: "bahasa-bunyi-awal", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "bahasa.vokal.recognition", subjectId: "bahasa", title: "Mengenali huruf vokal", description: "Mengenali A, I, U, E, dan O melalui bentuk visual yang berbeda.", domain: "literacy", ageMin: 3, ageMax: 7 },
    { id: "bahasa.vokal.listening", subjectId: "bahasa", title: "Menyimak huruf vokal", description: "Menghubungkan petunjuk audio dengan simbol huruf vokal yang tepat.", domain: "literacy", ageMin: 3, ageMax: 7 },
    { id: "bahasa.huruf.classification", subjectId: "bahasa", title: "Membedakan vokal dan konsonan", description: "Membedakan huruf vokal dari konsonan pada contoh sederhana.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "bahasa.huruf.case_matching", subjectId: "bahasa", title: "Memasangkan huruf besar-kecil", description: "Menghubungkan huruf kapital dengan bentuk huruf kecil yang sama.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "bahasa.bunyi.awal.recognition", subjectId: "bahasa", title: "Mengenali bunyi awal kata", description: "Menentukan huruf awal pada kata benda sehari-hari yang familiar.", domain: "language", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("bahasa-vokal-i", "bahasa.pack.vokal-visual", "bahasa-vokal-visual", "Cari huruf I", "Mana huruf I?", ["I", "L", "T"], "I", "bahasa.vokal.recognition", { ageMin: 3, required: true, emoji: "🇮" }),
    choice("bahasa-vokal-u", "bahasa.pack.vokal-visual", "bahasa-vokal-visual", "Cari huruf U", "Pilih huruf U.", ["V", "U", "Y"], "U", "bahasa.vokal.recognition", { ageMin: 3, emoji: "🔎" }),
    choice("bahasa-vokal-e", "bahasa.pack.vokal-visual", "bahasa-vokal-visual", "Cari huruf E", "Di mana huruf E?", ["F", "E", "P"], "E", "bahasa.vokal.recognition", { ageMin: 3, emoji: "🔤" }),
    choice("bahasa-vokal-o", "bahasa.pack.vokal-visual", "bahasa-vokal-visual", "Cari huruf O", "Temukan huruf O.", ["Q", "C", "O"], "O", "bahasa.vokal.recognition", { ageMin: 3, required: true, emoji: "⭕" }),

    listen("bahasa-dengar-i", "bahasa.pack.vokal-audio", "bahasa-vokal-audio", "Dengar huruf I", "Pilih huruf I", ["E", "I", "U"], "I", "bahasa.vokal.listening", { ageMin: 3, required: true }),
    listen("bahasa-dengar-u", "bahasa.pack.vokal-audio", "bahasa-vokal-audio", "Dengar huruf U", "Pilih huruf U", ["A", "O", "U"], "U", "bahasa.vokal.listening", { ageMin: 3 }),
    listen("bahasa-dengar-e", "bahasa.pack.vokal-audio", "bahasa-vokal-audio", "Dengar huruf E", "Pilih huruf E", ["I", "E", "A"], "E", "bahasa.vokal.listening", { ageMin: 3 }),
    listen("bahasa-dengar-o", "bahasa.pack.vokal-audio", "bahasa-vokal-audio", "Dengar huruf O", "Pilih huruf O", ["U", "A", "O"], "O", "bahasa.vokal.listening", { ageMin: 3, required: true }),

    choice("bahasa-pilih-vokal-ae", "bahasa.pack.klasifikasi-huruf", "bahasa-klasifikasi-huruf", "Mana yang vokal?", "Huruf mana yang termasuk vokal?", ["B", "A", "D"], "A", "bahasa.huruf.classification", { required: true }),
    choice("bahasa-pilih-vokal-io", "bahasa.pack.klasifikasi-huruf", "bahasa-klasifikasi-huruf", "Temukan vokal", "Pilih satu huruf vokal.", ["K", "I", "M"], "I", "bahasa.huruf.classification"),
    choice("bahasa-pilih-konsonan-bd", "bahasa.pack.klasifikasi-huruf", "bahasa-klasifikasi-huruf", "Mana yang konsonan?", "Huruf mana yang termasuk konsonan?", ["E", "B", "O"], "B", "bahasa.huruf.classification"),
    choice("bahasa-pilih-konsonan-ks", "bahasa.pack.klasifikasi-huruf", "bahasa-klasifikasi-huruf", "Cari konsonan", "Pilih huruf konsonan.", ["U", "S", "A"], "S", "bahasa.huruf.classification", { required: true }),

    matching("bahasa-match-case-ai", "bahasa.pack.huruf-besar-kecil", "bahasa-huruf-besar-kecil", "Pasangkan A dan I", "Pasangkan huruf besar dengan huruf kecilnya.", "bahasa.huruf.case_matching", [["a", "A", "a"], ["i", "I", "i"]], { required: true }),
    matching("bahasa-match-case-uo", "bahasa.pack.huruf-besar-kecil", "bahasa-huruf-besar-kecil", "Pasangkan U dan O", "Cari pasangan bentuk besar-kecil yang sama.", "bahasa.huruf.case_matching", [["u", "U", "u"], ["o", "O", "o"]]),
    matching("bahasa-match-case-bm", "bahasa.pack.huruf-besar-kecil", "bahasa-huruf-besar-kecil", "Pasangkan B dan M", "Hubungkan huruf kapital dengan huruf kecilnya.", "bahasa.huruf.case_matching", [["b", "B", "b"], ["m", "M", "m"]], { required: true }),

    choice("bahasa-awal-bola", "bahasa.pack.bunyi-awal", "bahasa-bunyi-awal", "Awal kata bola", "Kata 'bola' dimulai dengan huruf apa?", ["B", "D", "P"], "B", "bahasa.bunyi.awal.recognition", { required: true, emoji: "⚽" }),
    choice("bahasa-awal-kucing", "bahasa.pack.bunyi-awal", "bahasa-bunyi-awal", "Awal kata kucing", "Huruf awal kata 'kucing' adalah?", ["G", "K", "T"], "K", "bahasa.bunyi.awal.recognition", { emoji: "🐱" }),
    choice("bahasa-awal-pisang", "bahasa.pack.bunyi-awal", "bahasa-bunyi-awal", "Awal kata pisang", "Pilih huruf pertama pada kata 'pisang'.", ["P", "B", "S"], "P", "bahasa.bunyi.awal.recognition", { emoji: "🍌" }),
    matching("bahasa-match-awal-tas-susu", "bahasa.pack.bunyi-awal", "bahasa-bunyi-awal", "Pasangan bunyi awal", "Pasangkan huruf awal dengan kata yang cocok.", "bahasa.bunyi.awal.recognition", [["t", "T", "Tas"], ["s", "S", "Susu"]], { required: true, emoji: "🎒" })
  ]
};
