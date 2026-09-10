import type { BahasaBatch8ActivitySeed, BahasaBatch8WaveDefinition } from "./bahasaBatch8Authoring";

const STAGE_ID = "bahasa-literasi-terapan";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Terapkan kemampuan literasi dasar pada kalimat, kosakata, dan bacaan sederhana.", emoji: options.emoji ?? "✍️", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Simak kalimat sederhana dan temukan detail yang dinyatakan secara langsung.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Kelompokkan kosakata sederhana berdasarkan kategori maknanya.", emoji: options.emoji ?? "🗂️", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const BAHASA_BATCH8_WAVE_D: BahasaBatch8WaveDefinition = {
  wave: "D",
  stage: { id: STAGE_ID, subjectId: "bahasa", title: "Literasi Terapan", subtitle: "Gunakan tanda baca, lengkapi kalimat, kelompokkan kata, simak detail, dan pahami bacaan terpadu.", emoji: "📚" },
  lessons: [
    { id: "bahasa-ejaan-dasar", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Ejaan & tanda baca", objective: "Mengenali penggunaan tanda baca dasar dan huruf kapital pada kalimat sederhana.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-kalimat-lengkap", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Lengkapi kalimat", objective: "Memilih kata yang melengkapi kalimat sesuai konteks sederhana.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-kategori-kata", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Kategori kata", objective: "Mengelompokkan kosakata sehari-hari ke kategori makna yang tepat.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-detail-dengar", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Simak detail", objective: "Menangkap detail literal dari kalimat pendek yang didengar.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-bacaan-terapan", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Bacaan terpadu", objective: "Menggabungkan pemahaman urutan dan detail dari bacaan pendek dua atau tiga kalimat.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "bahasa.pack.ejaan-dasar", title: "Ejaan & Tanda Baca", lessonId: "bahasa-ejaan-dasar", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.kalimat-lengkap", title: "Lengkapi Kalimat", lessonId: "bahasa-kalimat-lengkap", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.kategori-kata", title: "Kategori Kata", lessonId: "bahasa-kategori-kata", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.detail-dengar", title: "Simak Detail", lessonId: "bahasa-detail-dengar", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.bacaan-terapan", title: "Bacaan Terpadu", lessonId: "bahasa-bacaan-terapan", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "bahasa.kalimat.punctuation_capitalization", subjectId: "bahasa", title: "Tanda baca dan huruf kapital", description: "Mengenali tanda titik, tanya, seru, dan penggunaan huruf kapital dasar.", domain: "literacy", ageMin: 5, ageMax: 7 },
    { id: "bahasa.kalimat.context_completion", subjectId: "bahasa", title: "Melengkapi kalimat sesuai konteks", description: "Memilih kata yang membuat kalimat sederhana lengkap dan masuk akal.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.kosakata.category", subjectId: "bahasa", title: "Mengelompokkan kosakata", description: "Menghubungkan kosakata sehari-hari dengan kategori maknanya.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.kalimat.listening_detail", subjectId: "bahasa", title: "Menangkap detail dari kalimat lisan", description: "Menentukan detail literal dari kalimat pendek yang didengar.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.bacaan.integrated", subjectId: "bahasa", title: "Pemahaman bacaan terpadu", description: "Menggunakan detail dan urutan kejadian untuk memahami bacaan pendek.", domain: "literacy", ageMin: 5, ageMax: 7 }
  ],
  activities: [
    choice("bahasa-tanda-titik", "bahasa.pack.ejaan-dasar", "bahasa-ejaan-dasar", "Pakai tanda titik", "Kalimat berita mana yang memakai tanda akhir dengan tepat?", ["Ibu memasak nasi.", "Ibu memasak nasi?", "Ibu memasak nasi!"], "Ibu memasak nasi.", "bahasa.kalimat.punctuation_capitalization", { required: true }),
    choice("bahasa-tanda-tanya", "bahasa.pack.ejaan-dasar", "bahasa-ejaan-dasar", "Pakai tanda tanya", "Kalimat tanya mana yang memakai tanda akhir dengan tepat?", ["Di mana bukumu.", "Di mana bukumu?", "Di mana bukumu!"], "Di mana bukumu?", "bahasa.kalimat.punctuation_capitalization"),
    choice("bahasa-tanda-seru", "bahasa.pack.ejaan-dasar", "bahasa-ejaan-dasar", "Pakai tanda seru", "Pilih kalimat peringatan dengan tanda akhir yang tepat.", ["Awas, lantainya licin!", "Awas, lantainya licin.", "Awas, lantainya licin?"], "Awas, lantainya licin!", "bahasa.kalimat.punctuation_capitalization"),
    choice("bahasa-kapital-awal", "bahasa.pack.ejaan-dasar", "bahasa-ejaan-dasar", "Huruf besar di awal", "Kalimat mana yang memakai huruf kapital di awal dengan tepat?", ["kucing itu tidur.", "Kucing itu tidur.", "KUCING itu tidur."], "Kucing itu tidur.", "bahasa.kalimat.punctuation_capitalization", { required: true }),
    choice("bahasa-kapital-nama", "bahasa.pack.ejaan-dasar", "bahasa-ejaan-dasar", "Huruf besar pada nama", "Pilih penulisan nama orang yang tepat.", ["beni bermain bola.", "Beni bermain bola.", "BENI bermain bola."], "Beni bermain bola.", "bahasa.kalimat.punctuation_capitalization"),

    choice("bahasa-lengkap-ayah-minum", "bahasa.pack.kalimat-lengkap", "bahasa-kalimat-lengkap", "Lengkapi: Ayah minum", "Ayah minum ___ setelah berolahraga.", ["air", "bantal", "sepatu"], "air", "bahasa.kalimat.context_completion", { required: true, emoji: "💧" }),
    choice("bahasa-lengkap-burung-terbang", "bahasa.pack.kalimat-lengkap", "bahasa-kalimat-lengkap", "Lengkapi: Burung", "Burung ___ di langit.", ["berenang", "terbang", "membaca"], "terbang", "bahasa.kalimat.context_completion", { emoji: "🐦" }),
    choice("bahasa-lengkap-kucing-tidur", "bahasa.pack.kalimat-lengkap", "bahasa-kalimat-lengkap", "Lengkapi: Kucing tidur", "Kucing tidur di atas ___.", ["kursi", "hujan", "awan"], "kursi", "bahasa.kalimat.context_completion"),
    choice("bahasa-lengkap-ibu-pasar", "bahasa.pack.kalimat-lengkap", "bahasa-kalimat-lengkap", "Lengkapi: Ibu belanja", "Ibu membeli sayur di ___.", ["pasar", "langit", "sungai"], "pasar", "bahasa.kalimat.context_completion", { required: true, emoji: "🥬" }),
    choice("bahasa-lengkap-rina-payung", "bahasa.pack.kalimat-lengkap", "bahasa-kalimat-lengkap", "Lengkapi: Saat hujan", "Saat hujan, Rina memakai ___.", ["payung", "sendok", "pensil"], "payung", "bahasa.kalimat.context_completion", { emoji: "☂️" }),

    matching("bahasa-kategori-hewan-buah", "bahasa.pack.kategori-kata", "bahasa-kategori-kata", "Hewan & buah", "Pasangkan kategori dengan contoh yang tepat.", "bahasa.kosakata.category", [["hewan", "hewan", "kucing"], ["buah", "buah", "pisang"]], { required: true }),
    matching("bahasa-kategori-transport-tempat", "bahasa.pack.kategori-kata", "bahasa-kategori-kata", "Kendaraan & tempat", "Hubungkan kategori dengan contoh sehari-hari.", "bahasa.kosakata.category", [["kendaraan", "kendaraan", "mobil"], ["tempat", "tempat", "sekolah"]]),
    matching("bahasa-kategori-warna-bentuk", "bahasa.pack.kategori-kata", "bahasa-kategori-kata", "Warna & bentuk", "Pasangkan kelompok kata dengan contoh yang sesuai.", "bahasa.kosakata.category", [["warna", "warna", "merah"], ["bentuk", "bentuk", "lingkaran"]]),
    matching("bahasa-kategori-sekolah-dapur", "bahasa.pack.kategori-kata", "bahasa-kategori-kata", "Sekolah & dapur", "Pasangkan tempat dengan benda yang biasa ditemukan di sana.", "bahasa.kosakata.category", [["sekolah", "sekolah", "pensil"], ["dapur", "dapur", "panci"]], { required: true }),
    matching("bahasa-kategori-tubuh-pakaian", "bahasa.pack.kategori-kata", "bahasa-kategori-kata", "Tubuh & pakaian", "Hubungkan kategori dengan contoh yang tepat.", "bahasa.kosakata.category", [["tubuh", "tubuh", "tangan"], ["pakaian", "pakaian", "baju"]]),

    listen("bahasa-dengar-detail-bola-merah", "bahasa.pack.detail-dengar", "bahasa-detail-dengar", "Dengar detail warna", "Dengarkan: bola merah ada di meja. Apa warna bolanya?", ["merah", "biru", "hijau"], "merah", "bahasa.kalimat.listening_detail", { required: true, emoji: "🔴" }),
    listen("bahasa-dengar-detail-dua-buku", "bahasa.pack.detail-dengar", "bahasa-detail-dengar", "Dengar detail jumlah", "Dengarkan: Dita membawa dua buku. Berapa buku yang dibawa Dita?", ["satu", "dua", "tiga"], "dua", "bahasa.kalimat.listening_detail", { emoji: "📚" }),
    listen("bahasa-dengar-detail-bawah-kursi", "bahasa.pack.detail-dengar", "bahasa-detail-dengar", "Dengar detail posisi", "Dengarkan: bola ada di bawah kursi. Di mana bolanya?", ["di atas kursi", "di bawah kursi", "di dalam tas"], "di bawah kursi", "bahasa.kalimat.listening_detail"),
    listen("bahasa-dengar-detail-pagi-pasar", "bahasa.pack.detail-dengar", "bahasa-detail-dengar", "Dengar detail waktu", "Dengarkan: pagi hari Ibu pergi ke pasar. Kapan Ibu pergi?", ["pagi", "siang", "malam"], "pagi", "bahasa.kalimat.listening_detail", { required: true, emoji: "🌅" }),
    listen("bahasa-dengar-detail-pisang", "bahasa.pack.detail-dengar", "bahasa-detail-dengar", "Dengar detail benda", "Dengarkan: Riko makan pisang setelah bermain. Apa yang dimakan Riko?", ["pisang", "apel", "roti"], "pisang", "bahasa.kalimat.listening_detail", { emoji: "🍌" }),

    choice("bahasa-terapan-mila-pagi", "bahasa.pack.bacaan-terapan", "bahasa-bacaan-terapan", "Bacaan: pagi Mila", "Baca: 'Mila bangun pagi. Ia merapikan tempat tidur. Setelah itu Mila sarapan.' Apa yang dilakukan Mila setelah merapikan tempat tidur?", ["sarapan", "tidur lagi", "bermain bola"], "sarapan", "bahasa.bacaan.integrated", { required: true, emoji: "🌅" }),
    choice("bahasa-terapan-tono-ikan", "bahasa.pack.bacaan-terapan", "bahasa-bacaan-terapan", "Bacaan: ikan Tono", "Baca: 'Tono punya dua ikan. Ikan itu hidup di akuarium. Tono memberi makan ikan setiap sore.' Di mana ikan Tono hidup?", ["akuarium", "kandang", "taman"], "akuarium", "bahasa.bacaan.integrated", { emoji: "🐟" }),
    choice("bahasa-terapan-nisa-hujan", "bahasa.pack.bacaan-terapan", "bahasa-bacaan-terapan", "Bacaan: Nisa kehujanan", "Baca: 'Langit menjadi gelap. Hujan mulai turun. Nisa membuka payung sebelum berjalan pulang.' Mengapa Nisa membuka payung?", ["karena hujan turun", "karena hari panas", "karena ingin tidur"], "karena hujan turun", "bahasa.bacaan.integrated", { emoji: "🌧️" }),
    choice("bahasa-terapan-beni-perpus", "bahasa.pack.bacaan-terapan", "bahasa-bacaan-terapan", "Bacaan: Beni di perpustakaan", "Baca: 'Beni pergi ke perpustakaan. Ia memilih buku tentang hewan lalu membacanya di meja.' Buku tentang apa yang dipilih Beni?", ["hewan", "kendaraan", "buah"], "hewan", "bahasa.bacaan.integrated", { required: true, emoji: "📖" }),
    choice("bahasa-terapan-lani-tunas", "bahasa.pack.bacaan-terapan", "bahasa-bacaan-terapan", "Bacaan: tanaman Lani", "Baca: 'Lani menanam biji di pot. Setiap hari ia menyiramnya. Beberapa hari kemudian muncul tunas kecil.' Apa yang muncul setelah beberapa hari?", ["tunas kecil", "buah besar", "batu"], "tunas kecil", "bahasa.bacaan.integrated", { emoji: "🌱" })
  ]
};
