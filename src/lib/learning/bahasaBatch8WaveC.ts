import type { BahasaBatch8ActivitySeed, BahasaBatch8WaveDefinition } from "./bahasaBatch8Authoring";

const STAGE_ID = "bahasa-kalimat-pemahaman";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Bangun kemampuan memahami kalimat, instruksi, hubungan kosakata, dan bacaan pendek.", emoji: options.emoji ?? "📝", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function listen(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "listen", id, packId, lessonId, title, description: "Simak instruksi sederhana lalu pilih respons yang sesuai.", emoji: options.emoji ?? "🎧", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): BahasaBatch8ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Hubungkan kosakata yang memiliki hubungan makna yang tepat.", emoji: options.emoji ?? "🔗", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const BAHASA_BATCH8_WAVE_C: BahasaBatch8WaveDefinition = {
  wave: "C",
  stage: { id: STAGE_ID, subjectId: "bahasa", title: "Kalimat & Pemahaman", subtitle: "Susun kalimat, pahami makna, ikuti instruksi, kenali hubungan kata, dan jawab bacaan singkat.", emoji: "📝" },
  lessons: [
    { id: "bahasa-kalimat-urutan", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Urutan kalimat", objective: "Memilih urutan kata yang membentuk kalimat sederhana dan masuk akal.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-kalimat-makna", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Makna kalimat", objective: "Menentukan informasi yang dinyatakan langsung dalam kalimat sederhana.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-instruksi-dengar", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Dengar instruksi", objective: "Memahami instruksi lisan satu langkah dengan kosakata sehari-hari.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-hubungan-kata", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Hubungan kata", objective: "Mengenali pasangan lawan kata dan kata bermakna dekat pada konteks dasar.", ageMin: 5, ageMax: 7 },
    { id: "bahasa-bacaan-pendek", subjectId: "bahasa", pathId: "bahasa-fondasi-literasi", stageId: STAGE_ID, title: "Bacaan pendek", objective: "Menjawab pertanyaan literal dari satu atau dua kalimat pendek.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "bahasa.pack.kalimat-urutan", title: "Urutan Kalimat", lessonId: "bahasa-kalimat-urutan", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.kalimat-makna", title: "Makna Kalimat", lessonId: "bahasa-kalimat-makna", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.instruksi-dengar", title: "Dengar Instruksi", lessonId: "bahasa-instruksi-dengar", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.hubungan-kata", title: "Hubungan Kata", lessonId: "bahasa-hubungan-kata", ageMin: 5, ageMax: 7 },
    { id: "bahasa.pack.bacaan-pendek", title: "Bacaan Pendek", lessonId: "bahasa-bacaan-pendek", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "bahasa.kalimat.order", subjectId: "bahasa", title: "Menyusun urutan kalimat", description: "Memilih urutan kata yang membentuk kalimat sederhana dan masuk akal.", domain: "literacy", ageMin: 5, ageMax: 7 },
    { id: "bahasa.kalimat.comprehension", subjectId: "bahasa", title: "Memahami makna kalimat", description: "Mengambil informasi literal dari kalimat sederhana.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.instruksi.listening", subjectId: "bahasa", title: "Memahami instruksi lisan", description: "Mengikuti instruksi lisan satu langkah dengan kosakata familiar.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.kosakata.relations", subjectId: "bahasa", title: "Mengenali hubungan kosakata", description: "Mengenali lawan kata dan kata bermakna dekat pada level dasar.", domain: "language", ageMin: 5, ageMax: 7 },
    { id: "bahasa.bacaan.short_comprehension", subjectId: "bahasa", title: "Memahami bacaan pendek", description: "Menjawab pertanyaan literal dari bacaan satu atau dua kalimat.", domain: "literacy", ageMin: 5, ageMax: 7 }
  ],
  activities: [
    choice("bahasa-urut-ibu-memasak", "bahasa.pack.kalimat-urutan", "bahasa-kalimat-urutan", "Susun: Ibu memasak", "Pilih kalimat dengan urutan yang benar.", ["Ibu memasak nasi.", "Memasak nasi ibu.", "Nasi ibu memasak."], "Ibu memasak nasi.", "bahasa.kalimat.order", { required: true }),
    choice("bahasa-urut-adi-berlari", "bahasa.pack.kalimat-urutan", "bahasa-kalimat-urutan", "Susun: Adi berlari", "Mana kalimat yang tersusun benar?", ["Cepat Adi berlari.", "Adi berlari cepat.", "Berlari cepat Adi."], "Adi berlari cepat.", "bahasa.kalimat.order"),
    choice("bahasa-urut-kucing-tidur", "bahasa.pack.kalimat-urutan", "bahasa-kalimat-urutan", "Susun: Kucing tidur", "Pilih urutan kata yang menjadi kalimat.", ["Tidur kursi kucing di.", "Kucing di kursi tidur.", "Kucing tidur di kursi."], "Kucing tidur di kursi.", "bahasa.kalimat.order"),
    choice("bahasa-urut-siti-membaca", "bahasa.pack.kalimat-urutan", "bahasa-kalimat-urutan", "Susun: Siti membaca", "Kalimat mana yang paling tepat?", ["Siti membaca buku.", "Buku membaca Siti.", "Membaca Siti buku."], "Siti membaca buku.", "bahasa.kalimat.order", { required: true }),
    choice("bahasa-urut-burung-terbang", "bahasa.pack.kalimat-urutan", "bahasa-kalimat-urutan", "Susun: Burung terbang", "Temukan kalimat dengan susunan yang benar.", ["Langit burung di terbang.", "Burung terbang di langit.", "Terbang langit di burung."], "Burung terbang di langit.", "bahasa.kalimat.order"),

    choice("bahasa-makna-rina-apel", "bahasa.pack.kalimat-makna", "bahasa-kalimat-makna", "Rina makan apel", "Rina makan apel. Apa yang dimakan Rina?", ["apel", "roti", "pisang"], "apel", "bahasa.kalimat.comprehension", { required: true, emoji: "🍎" }),
    choice("bahasa-makna-budi-sekolah", "bahasa.pack.kalimat-makna", "bahasa-kalimat-makna", "Budi pergi sekolah", "Budi pergi ke sekolah. Budi pergi ke mana?", ["pasar", "sekolah", "taman"], "sekolah", "bahasa.kalimat.comprehension"),
    choice("bahasa-makna-ikan-air", "bahasa.pack.kalimat-makna", "bahasa-kalimat-makna", "Ikan berenang", "Ikan berenang di air. Di mana ikan berenang?", ["air", "pohon", "jalan"], "air", "bahasa.kalimat.comprehension"),
    choice("bahasa-makna-ayah-koran", "bahasa.pack.kalimat-makna", "bahasa-kalimat-makna", "Ayah membaca koran", "Ayah membaca koran pagi ini. Apa yang dibaca Ayah?", ["koran", "buku tulis", "peta"], "koran", "bahasa.kalimat.comprehension", { required: true }),
    choice("bahasa-makna-dina-payung", "bahasa.pack.kalimat-makna", "bahasa-kalimat-makna", "Dina membawa payung", "Dina membawa payung karena hujan. Apa yang dibawa Dina?", ["tas", "payung", "topi"], "payung", "bahasa.kalimat.comprehension"),

    listen("bahasa-instruksi-ambil-buku", "bahasa.pack.instruksi-dengar", "bahasa-instruksi-dengar", "Instruksi: ambil buku", "Dengarkan: ambil buku. Apa yang harus kamu ambil?", ["buku", "gelas", "bola"], "buku", "bahasa.instruksi.listening", { required: true }),
    listen("bahasa-instruksi-tutup-pintu", "bahasa.pack.instruksi-dengar", "bahasa-instruksi-dengar", "Instruksi: tutup pintu", "Dengarkan: tutup pintu. Apa yang harus ditutup?", ["jendela", "pintu", "kotak"], "pintu", "bahasa.instruksi.listening"),
    listen("bahasa-instruksi-duduk-kursi", "bahasa.pack.instruksi-dengar", "bahasa-instruksi-dengar", "Instruksi: duduk di kursi", "Dengarkan: duduk di kursi. Di mana kamu harus duduk?", ["kursi", "meja", "lantai"], "kursi", "bahasa.instruksi.listening"),
    listen("bahasa-instruksi-angkat-tangan", "bahasa.pack.instruksi-dengar", "bahasa-instruksi-dengar", "Instruksi: angkat tangan", "Dengarkan: angkat tangan. Apa yang harus diangkat?", ["kaki", "tangan", "buku"], "tangan", "bahasa.instruksi.listening", { required: true }),
    listen("bahasa-instruksi-taruh-pensil", "bahasa.pack.instruksi-dengar", "bahasa-instruksi-dengar", "Instruksi: taruh pensil", "Dengarkan: taruh pensil di meja. Benda apa yang harus ditaruh?", ["pensil", "sepatu", "piring"], "pensil", "bahasa.instruksi.listening"),

    matching("bahasa-relasi-panas-dingin", "bahasa.pack.hubungan-kata", "bahasa-hubungan-kata", "Lawan kata 1", "Pasangkan kata dengan lawannya.", "bahasa.kosakata.relations", [["suhu", "panas", "dingin"], ["ukuran", "besar", "kecil"]], { required: true }),
    matching("bahasa-relasi-atas-bawah", "bahasa.pack.hubungan-kata", "bahasa-hubungan-kata", "Lawan kata 2", "Hubungkan pasangan lawan kata.", "bahasa.kosakata.relations", [["posisi", "atas", "bawah"], ["arah", "masuk", "keluar"]]),
    matching("bahasa-relasi-cepat-lambat", "bahasa.pack.hubungan-kata", "bahasa-hubungan-kata", "Lawan kata 3", "Cari pasangan yang berlawanan makna.", "bahasa.kosakata.relations", [["kecepatan", "cepat", "lambat"], ["waktu", "siang", "malam"]]),
    matching("bahasa-relasi-senang-gembira", "bahasa.pack.hubungan-kata", "bahasa-hubungan-kata", "Makna dekat 1", "Pasangkan kata yang bermakna dekat.", "bahasa.kosakata.relations", [["bahagia", "senang", "gembira"], ["pandai", "pintar", "cerdas"]], { required: true }),
    matching("bahasa-relasi-indah-cantik", "bahasa.pack.hubungan-kata", "bahasa-hubungan-kata", "Makna dekat 2", "Hubungkan kata dengan pasangan makna dekatnya.", "bahasa.kosakata.relations", [["elok", "indah", "cantik"], ["lekas", "cepat", "segera"]]),

    choice("bahasa-baca-lala-kucing", "bahasa.pack.bacaan-pendek", "bahasa-bacaan-pendek", "Bacaan: Lala dan kucing", "Baca: 'Lala punya kucing putih.' Apa warna kucing Lala?", ["putih", "hitam", "cokelat"], "putih", "bahasa.bacaan.short_comprehension", { required: true, difficulty: 3, emoji: "🐱" }),
    choice("bahasa-baca-dodi-sepeda", "bahasa.pack.bacaan-pendek", "bahasa-bacaan-pendek", "Bacaan: Dodi bersepeda", "Baca: 'Dodi naik sepeda ke taman.' Dodi naik apa?", ["sepeda", "mobil", "bus"], "sepeda", "bahasa.bacaan.short_comprehension", { difficulty: 3, emoji: "🚲" }),
    choice("bahasa-baca-nina-bunga", "bahasa.pack.bacaan-pendek", "bahasa-bacaan-pendek", "Bacaan: Nina menyiram", "Baca: 'Nina menyiram bunga setiap pagi.' Apa yang disiram Nina?", ["bunga", "buku", "sepatu"], "bunga", "bahasa.bacaan.short_comprehension", { difficulty: 3, emoji: "🌷" }),
    choice("bahasa-baca-raka-sarapan", "bahasa.pack.bacaan-pendek", "bahasa-bacaan-pendek", "Bacaan: Raka sarapan", "Baca: 'Raka makan roti dan minum susu saat sarapan.' Apa yang diminum Raka?", ["air", "susu", "jus"], "susu", "bahasa.bacaan.short_comprehension", { required: true, difficulty: 3, emoji: "🥛" }),
    choice("bahasa-baca-sari-hujan", "bahasa.pack.bacaan-pendek", "bahasa-bacaan-pendek", "Bacaan: Sari saat hujan", "Baca: 'Hujan turun. Sari memakai payung merah.' Apa warna payung Sari?", ["merah", "biru", "kuning"], "merah", "bahasa.bacaan.short_comprehension", { difficulty: 3, emoji: "☂️" })
  ]
};
