import type { MathBatch7ActivitySeed, MathBatch7WaveDefinition } from "./mathBatch7Authoring";

const STAGE_ID = "math-operasi-awal";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Pecahkan tantangan numerasi singkat dengan sentuhan.", emoji: options.emoji ?? "➕", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Hubungkan dua representasi matematika yang setara.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const MATH_BATCH7_WAVE_C: MathBatch7WaveDefinition = {
  wave: "C",
  stage: { id: STAGE_ID, subjectId: "math", title: "Urutan, Kelompok & Operasi Awal", subtitle: "Isi angka yang hilang, buat kelompok, lalu coba tambah, kurang, dan bandingkan panjang.", emoji: "➕" },
  lessons: [
    { id: "math-missing-numbers", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Angka yang hilang", objective: "Menemukan angka yang hilang pada urutan pendek.", ageMin: 4, ageMax: 7 },
    { id: "math-grouping", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Buat kelompok", objective: "Memahami kumpulan sebagai kelompok kecil yang setara.", ageMin: 4, ageMax: 7 },
    { id: "math-addition", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Tambah sederhana", objective: "Menggabungkan dua kelompok kecil dan menentukan jumlahnya.", ageMin: 5, ageMax: 7 },
    { id: "math-subtraction", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Kurang sederhana", objective: "Mengambil sebagian dari kelompok kecil dan menentukan sisanya.", ageMin: 5, ageMax: 7 },
    { id: "math-size-length", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Panjang & ukuran", objective: "Membandingkan panjang dan ukuran secara visual tanpa alat ukur formal.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "math.pack.missing-numbers", title: "Angka yang Hilang", lessonId: "math-missing-numbers", ageMin: 4, ageMax: 7 },
    { id: "math.pack.grouping", title: "Kelompok Kecil", lessonId: "math-grouping", ageMin: 4, ageMax: 7 },
    { id: "math.pack.addition", title: "Tambah Sederhana", lessonId: "math-addition", ageMin: 5, ageMax: 7 },
    { id: "math.pack.subtraction", title: "Kurang Sederhana", lessonId: "math-subtraction", ageMin: 5, ageMax: 7 },
    { id: "math.pack.size-length", title: "Panjang dan Ukuran", lessonId: "math-size-length", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "math.sequence.missing_number", subjectId: "math", title: "Menemukan angka yang hilang", description: "Menentukan angka yang hilang pada urutan sederhana naik atau turun.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.grouping.equal_groups", subjectId: "math", title: "Mengenali kelompok setara", description: "Membagi atau membaca kumpulan sebagai kelompok kecil yang setara.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.operation.addition.within_10", subjectId: "math", title: "Penjumlahan sampai 10", description: "Menggabungkan dua kelompok kecil dengan hasil tidak lebih dari sepuluh.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.operation.subtraction.within_10", subjectId: "math", title: "Pengurangan sampai 10", description: "Mengurangi kelompok kecil dengan bilangan sampai sepuluh.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.measure.size_length", subjectId: "math", title: "Membandingkan panjang dan ukuran", description: "Menggunakan kata lebih panjang, lebih pendek, lebih besar, dan lebih kecil dari visual sederhana.", domain: "numeracy", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("math-missing-1-3", "math.pack.missing-numbers", "math-missing-numbers", "Isi 1, _, 3", "1, ..., 3. Angka yang hilang?", ["0", "2", "4"], "2", "math.sequence.missing_number", { required: true, emoji: "❓" }),
    choice("math-missing-3-5", "math.pack.missing-numbers", "math-missing-numbers", "Isi 3, _, 5", "3, ..., 5. Pilih angka di tengah.", ["2", "4", "6"], "4", "math.sequence.missing_number", { emoji: "❓" }),
    choice("math-missing-before-6", "math.pack.missing-numbers", "math-missing-numbers", "Isi _, 6, 7", "..., 6, 7. Angka apa yang hilang?", ["4", "5", "8"], "5", "math.sequence.missing_number"),
    choice("math-missing-after-8", "math.pack.missing-numbers", "math-missing-numbers", "Isi 7, 8, _", "7, 8, ... lanjutkan urutannya.", ["6", "9", "10"], "9", "math.sequence.missing_number", { required: true }),
    choice("math-missing-descend-10-8", "math.pack.missing-numbers", "math-missing-numbers", "Isi 10, _, 8", "10, ..., 8. Angka yang hilang saat turun?", ["7", "9", "11"], "9", "math.sequence.missing_number", { difficulty: 3 }),

    choice("math-group-6-by-2", "math.pack.grouping", "math-grouping", "Enam jadi pasangan", "Ada 6 benda. Jika dibuat pasangan berisi 2, ada berapa kelompok?", ["2", "3", "4"], "3", "math.grouping.equal_groups", { required: true, emoji: "👥" }),
    choice("math-group-8-by-2", "math.pack.grouping", "math-grouping", "Delapan jadi pasangan", "8 benda dibagi menjadi kelompok isi 2. Ada berapa kelompok?", ["3", "4", "5"], "4", "math.grouping.equal_groups", { emoji: "👥" }),
    choice("math-group-9-by-3", "math.pack.grouping", "math-grouping", "Sembilan jadi tiga-tiga", "9 titik dibuat kelompok berisi 3. Berapa kelompok?", ["2", "3", "4"], "3", "math.grouping.equal_groups", { difficulty: 3 }),
    matching("math-group-match-2s", "math.pack.grouping", "math-grouping", "Cocokkan kelompok isi 2", "Pasangkan gambaran kelompok dengan jumlah totalnya.", "math.grouping.equal_groups", [["two-pairs", "●● + ●●", "4"], ["three-pairs", "●● + ●● + ●●", "6"]]),
    matching("math-group-match-3s", "math.pack.grouping", "math-grouping", "Cocokkan kelompok isi 3", "Hubungkan kelompok tiga-tiga dengan jumlah keseluruhannya.", "math.grouping.equal_groups", [["two-threes", "●●● + ●●●", "6"], ["three-threes", "●●● + ●●● + ●●●", "9"]], { required: true, difficulty: 3 }),

    choice("math-add-1-1", "math.pack.addition", "math-addition", "1 + 1", "Ada 1 apel, lalu datang 1 apel lagi. Jadi berapa?", ["1", "2", "3"], "2", "math.operation.addition.within_10", { ageMin: 5, required: true, emoji: "🍎" }),
    choice("math-add-2-1", "math.pack.addition", "math-addition", "2 + 1", "●● ditambah ●. Berapa semuanya?", ["2", "3", "4"], "3", "math.operation.addition.within_10", { ageMin: 5 }),
    choice("math-add-2-2", "math.pack.addition", "math-addition", "2 + 2", "Dua bintang ditambah dua bintang. Berapa jumlahnya?", ["3", "4", "5"], "4", "math.operation.addition.within_10", { ageMin: 5 }),
    choice("math-add-3-2", "math.pack.addition", "math-addition", "3 + 2", "3 + 2 sama dengan berapa?", ["4", "5", "6"], "5", "math.operation.addition.within_10", { ageMin: 5, required: true }),
    choice("math-add-4-3", "math.pack.addition", "math-addition", "4 + 3", "Empat balok ditambah tiga balok. Ada berapa balok?", ["6", "7", "8"], "7", "math.operation.addition.within_10", { ageMin: 5, difficulty: 3 }),

    choice("math-sub-3-1", "math.pack.subtraction", "math-subtraction", "3 − 1", "Ada 3 buah, 1 diambil. Berapa sisa?", ["1", "2", "3"], "2", "math.operation.subtraction.within_10", { ageMin: 5, required: true, emoji: "➖" }),
    choice("math-sub-4-2", "math.pack.subtraction", "math-subtraction", "4 − 2", "Empat titik dikurangi dua titik. Berapa sisa?", ["1", "2", "3"], "2", "math.operation.subtraction.within_10", { ageMin: 5 }),
    choice("math-sub-5-1", "math.pack.subtraction", "math-subtraction", "5 − 1", "Lima bunga, satu diberikan. Berapa yang tersisa?", ["3", "4", "5"], "4", "math.operation.subtraction.within_10", { ageMin: 5 }),
    choice("math-sub-6-2", "math.pack.subtraction", "math-subtraction", "6 − 2", "6 dikurangi 2 hasilnya?", ["3", "4", "5"], "4", "math.operation.subtraction.within_10", { ageMin: 5, required: true }),
    choice("math-sub-7-3", "math.pack.subtraction", "math-subtraction", "7 − 3", "Tujuh kelereng, tiga disimpan. Berapa yang masih terlihat?", ["3", "4", "5"], "4", "math.operation.subtraction.within_10", { ageMin: 5, difficulty: 3 }),

    choice("math-length-longer-lines", "math.pack.size-length", "math-size-length", "Garis mana lebih panjang?", "Pilih garis yang lebih panjang: ━━━━━ atau ━━.", ["━━━━━", "━━", "Sama"], "━━━━━", "math.measure.size_length", { required: true, emoji: "📏" }),
    choice("math-length-shorter-lines", "math.pack.size-length", "math-size-length", "Garis mana lebih pendek?", "Pilih garis yang lebih pendek: ━━━ atau ━━━━━━.", ["━━━", "━━━━━━", "Sama"], "━━━", "math.measure.size_length", { emoji: "📏" }),
    choice("math-size-bigger-circles", "math.pack.size-length", "math-size-length", "Lingkaran mana lebih besar?", "Pilih ukuran yang lebih besar.", ["kecil ○", "besar ◯", "sama"], "besar ◯", "math.measure.size_length", { emoji: "⚪" }),
    matching("math-size-match-words", "math.pack.size-length", "math-size-length", "Pasangkan panjang-pendek", "Pasangkan kata dengan garis yang sesuai.", "math.measure.size_length", [["long", "panjang", "━━━━━━"], ["short", "pendek", "━━"]], { required: true }),
    choice("math-length-order-three", "math.pack.size-length", "math-size-length", "Pilih yang paling panjang", "Dari ━━, ━━━━, dan ━━━━━━, mana yang paling panjang?", ["━━", "━━━━", "━━━━━━"], "━━━━━━", "math.measure.size_length", { difficulty: 3 })
  ]
};
