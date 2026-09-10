import type { BahasaBatch8ActivitySeed, BahasaBatch8WaveDefinition } from "./bahasaBatch8Authoring";

const STAGE_ID = "bahasa-suku-kata-kata";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Bangun kemampuan membaca awal melalui suku kata dan kata sederhana yang familiar.", emoji: options.emoji ?? "📖", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Dengarkan kata sederhana lalu pilih bentuk tertulis yang sesuai.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan suku kata, kata, atau simbol yang memiliki hubungan makna yang tepat.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const BAHASA_BATCH8_WAVE_B: BahasaBatch8WaveDefinition = {
  wave: "B",
  stage: { id: STAGE_ID, subjectId: "bahasa", title: "Suku Kata & Kata", subtitle: "Kenali suku kata, gabungkan bunyi menjadi kata, cocokkan makna, dan dengarkan kata sehari-hari.", emoji: "📖" },
  lessons: [
    { id: "bahasa-suku-kata-kenal", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Kenal suku kata", objective: "Mengenali bentuk suku kata terbuka sederhana seperti ba, ma, sa, ka, dan pa.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-suku-kata-gabung", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Gabungkan suku kata", objective: "Menggabungkan dua suku kata menjadi kata sederhana yang bermakna.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-kata-pasangan", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Pasangkan kata", objective: "Menghubungkan kata sederhana dengan objek atau pasangan maknanya.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-kata-dengar", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Dengar dan pilih kata", objective: "Menghubungkan kata yang didengar dengan bentuk tertulis yang tepat.", ageMin: 4, ageMax: 7 },
    { id: "bahasa-kata-gambar", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Gambar dan kata", objective: "Memilih kata yang sesuai dengan representasi objek sehari-hari.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "bahasa.pack.suku-kata-kenal", title: "Kenal Suku Kata", lessonId: "bahasa-suku-kata-kenal", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.suku-kata-gabung", title: "Gabung Suku Kata", lessonId: "bahasa-suku-kata-gabung", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.kata-pasangan", title: "Pasangan Kata", lessonId: "bahasa-kata-pasangan", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.kata-dengar", title: "Dengar Kata", lessonId: "bahasa-kata-dengar", ageMin: 4, ageMax: 7 },
    { id: "bahasa.pack.kata-gambar", title: "Gambar & Kata", lessonId: "bahasa-kata-gambar", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "bahasa.suku_kata.recognition", subjectId: "bahasa", title: "Mengenali suku kata", description: "Mengenali suku kata terbuka sederhana pada bentuk tertulis.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "bahasa.suku_kata.blending", subjectId: "bahasa", title: "Menggabungkan suku kata", description: "Menggabungkan dua suku kata menjadi kata sederhana yang familiar.", domain: "literacy", ageMin: 4, ageMax: 7 },
    { id: "bahasa.kata.semantic_matching", subjectId: "bahasa", title: "Memasangkan kata dan makna", description: "Menghubungkan kata sederhana dengan objek atau pasangan maknanya.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "bahasa.kata.listening", subjectId: "bahasa", title: "Menyimak kata sederhana", description: "Memilih bentuk tertulis berdasarkan kata sederhana yang didengar.", domain: "language", ageMin: 4, ageMax: 7 },
    { id: "bahasa.kata.picture_matching", subjectId: "bahasa", title: "Mencocokkan gambar dan kata", description: "Memilih kata yang tepat untuk objek sehari-hari yang direpresentasikan secara visual.", domain: "language", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("bahasa-suku-ba", "bahasa.pack.suku-kata-kenal", "bahasa-suku-kata-kenal", "Cari suku kata ba", "Mana yang berbunyi 'ba'?", ["ba", "ma", "sa"], "ba", "bahasa.suku_kata.recognition", { required: true }),
    choice("bahasa-suku-ma", "bahasa.pack.suku-kata-kenal", "bahasa-suku-kata-kenal", "Cari suku kata ma", "Pilih suku kata 'ma'.", ["na", "ma", "ka"], "ma", "bahasa.suku_kata.recognition"),
    choice("bahasa-suku-sa", "bahasa.pack.suku-kata-kenal", "bahasa-suku-kata-kenal", "Cari suku kata sa", "Temukan bentuk 'sa'.", ["ca", "ta", "sa"], "sa", "bahasa.suku_kata.recognition"),
    choice("bahasa-suku-ka", "bahasa.pack.suku-kata-kenal", "bahasa-suku-kata-kenal", "Cari suku kata ka", "Suku kata mana yang tertulis 'ka'?", ["pa", "ka", "ga"], "ka", "bahasa.suku_kata.recognition", { required: true }),
    choice("bahasa-suku-pa", "bahasa.pack.suku-kata-kenal", "bahasa-suku-kata-kenal", "Cari suku kata pa", "Pilih tulisan 'pa'.", ["ba", "da", "pa"], "pa", "bahasa.suku_kata.recognition"),

    choice("bahasa-gabung-baju", "bahasa.pack.suku-kata-gabung", "bahasa-suku-kata-gabung", "ba + ju", "'ba' + 'ju' menjadi kata apa?", ["baju", "buku", "bola"], "baju", "bahasa.suku_kata.blending", { required: true, emoji: "👕" }),
    choice("bahasa-gabung-buku", "bahasa.pack.suku-kata-gabung", "bahasa-suku-kata-gabung", "bu + ku", "Gabungkan 'bu' dan 'ku'.", ["batu", "buku", "baju"], "buku", "bahasa.suku_kata.blending", { emoji: "📚" }),
    choice("bahasa-gabung-meja", "bahasa.pack.suku-kata-gabung", "bahasa-suku-kata-gabung", "me + ja", "Kata apa terbentuk dari 'me' + 'ja'?", ["mata", "meja", "madu"], "meja", "bahasa.suku_kata.blending"),
    choice("bahasa-gabung-bola", "bahasa.pack.suku-kata-gabung", "bahasa-suku-kata-gabung", "bo + la", "'bo' dan 'la' jika digabung menjadi?", ["bola", "bila", "bulu"], "bola", "bahasa.suku_kata.blending", { required: true, emoji: "⚽" }),
    choice("bahasa-gabung-susu", "bahasa.pack.suku-kata-gabung", "bahasa-suku-kata-gabung", "su + su", "Gabungkan dua suku kata 'su'.", ["sapu", "susu", "siku"], "susu", "bahasa.suku_kata.blending", { emoji: "🥛" }),

    matching("bahasa-pasang-kata-benda-1", "bahasa.pack.kata-pasangan", "bahasa-kata-pasangan", "Pasangan kata benda 1", "Pasangkan kata dengan simbol objek yang sesuai.", "bahasa.kata.semantic_matching", [["bola", "bola", "⚽"], ["buku", "buku", "📚"]], { required: true }),
    matching("bahasa-pasang-kata-benda-2", "bahasa.pack.kata-pasangan", "bahasa-kata-pasangan", "Pasangan kata benda 2", "Hubungkan kata dengan objek yang tepat.", "bahasa.kata.semantic_matching", [["kucing", "kucing", "🐱"], ["pisang", "pisang", "🍌"]]),
    matching("bahasa-pasang-kata-benda-3", "bahasa.pack.kata-pasangan", "bahasa-kata-pasangan", "Pasangan kata benda 3", "Cari pasangan kata dan gambar bendanya.", "bahasa.kata.semantic_matching", [["mobil", "mobil", "🚗"], ["apel", "apel", "🍎"]]),
    matching("bahasa-pasang-kata-tempat", "bahasa.pack.kata-pasangan", "bahasa-kata-pasangan", "Pasangan tempat", "Pasangkan tempat dengan hal yang biasa ditemukan di sana.", "bahasa.kata.semantic_matching", [["rumah", "rumah", "🏠"], ["sekolah", "sekolah", "🏫"]], { required: true }),
    matching("bahasa-pasang-kata-alam", "bahasa.pack.kata-pasangan", "bahasa-kata-pasangan", "Pasangan alam", "Hubungkan kata alam dengan simbolnya.", "bahasa.kata.semantic_matching", [["matahari", "matahari", "☀️"], ["hujan", "hujan", "🌧️"]]),

    listen("bahasa-dengar-buku", "bahasa.pack.kata-dengar", "bahasa-kata-dengar", "Dengar: buku", "Pilih kata buku", ["buku", "baju", "bola"], "buku", "bahasa.kata.listening", { required: true, emoji: "🎧" }),
    listen("bahasa-dengar-meja", "bahasa.pack.kata-dengar", "bahasa-kata-dengar", "Dengar: meja", "Pilih kata meja", ["mata", "meja", "madu"], "meja", "bahasa.kata.listening"),
    listen("bahasa-dengar-susu", "bahasa.pack.kata-dengar", "bahasa-kata-dengar", "Dengar: susu", "Pilih kata susu", ["susu", "sapu", "siku"], "susu", "bahasa.kata.listening"),
    listen("bahasa-dengar-bola", "bahasa.pack.kata-dengar", "bahasa-kata-dengar", "Dengar: bola", "Pilih kata bola", ["bila", "bola", "bulu"], "bola", "bahasa.kata.listening", { required: true }),
    listen("bahasa-dengar-kucing", "bahasa.pack.kata-dengar", "bahasa-kata-dengar", "Dengar: kucing", "Pilih kata kucing", ["kucing", "kunci", "kuning"], "kucing", "bahasa.kata.listening"),

    choice("bahasa-gambar-apel", "bahasa.pack.kata-gambar", "bahasa-kata-gambar", "🍎 adalah...", "Kata mana yang cocok dengan gambar 🍎?", ["apel", "ayam", "awan"], "apel", "bahasa.kata.picture_matching", { required: true, emoji: "🍎" }),
    choice("bahasa-gambar-mobil", "bahasa.pack.kata-gambar", "bahasa-kata-gambar", "🚗 adalah...", "Pilih nama untuk gambar 🚗.", ["motor", "mobil", "meja"], "mobil", "bahasa.kata.picture_matching", { emoji: "🚗" }),
    choice("bahasa-gambar-kucing", "bahasa.pack.kata-gambar", "bahasa-kata-gambar", "🐱 adalah...", "Apa kata yang sesuai dengan 🐱?", ["kuda", "kucing", "kelinci"], "kucing", "bahasa.kata.picture_matching", { emoji: "🐱" }),
    choice("bahasa-gambar-rumah", "bahasa.pack.kata-gambar", "bahasa-kata-gambar", "🏠 adalah...", "Gambar 🏠 menunjukkan apa?", ["rumah", "roda", "rumput"], "rumah", "bahasa.kata.picture_matching", { required: true, emoji: "🏠" }),
    choice("bahasa-gambar-pisang", "bahasa.pack.kata-gambar", "bahasa-kata-gambar", "🍌 adalah...", "Pilih kata untuk 🍌.", ["pepaya", "pisang", "pir"], "pisang", "bahasa.kata.picture_matching", { emoji: "🍌" })
  ]
};
