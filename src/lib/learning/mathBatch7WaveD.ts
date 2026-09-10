import type { MathBatch7ActivitySeed, MathBatch7WaveDefinition } from "./mathBatch7Authoring";

const STAGE_ID = "math-ukur-ruang";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Gunakan hubungan ruang, ukuran, dan operasi sederhana untuk memilih jawaban.", emoji: options.emoji ?? "🏁", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan konsep matematika yang saling berhubungan.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 5, ageMax: 7, difficulty: options.difficulty ?? 3, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const MATH_BATCH7_WAVE_D: MathBatch7WaveDefinition = {
  wave: "D",
  stage: { id: STAGE_ID, subjectId: "math", title: "Ruang, Ukuran & Tantangan Campuran", subtitle: "Gunakan posisi, perkiraan ukuran, operasi, dan cerita visual untuk menyelesaikan tantangan campuran.", emoji: "🏁" },
  lessons: [
    { id: "math-spatial-position", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Posisi dan ruang", objective: "Memahami kiri-kanan, atas-bawah, dalam-luar, dekat-jauh, dan di antara.", ageMin: 4, ageMax: 7 },
    { id: "math-measure-intuition", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Intuisi pengukuran", objective: "Membandingkan panjang, kapasitas, dan ukuran dari representasi yang jelas.", ageMin: 5, ageMax: 7 },
    { id: "math-mixed-operations", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Operasi campuran", objective: "Memilih dan menyelesaikan penjumlahan atau pengurangan sederhana.", ageMin: 5, ageMax: 7 },
    { id: "math-visual-problems", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Masalah visual", objective: "Mengubah cerita sehari-hari yang sederhana menjadi perhitungan kecil.", ageMin: 5, ageMax: 7 },
    { id: "math-review-challenge", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Review dan challenge", objective: "Menggabungkan pengenalan angka, jumlah, bentuk, pola, dan perbandingan.", ageMin: 5, ageMax: 7 }
  ],
  packs: [
    { id: "math.pack.spatial-position", title: "Posisi dan Ruang", lessonId: "math-spatial-position", ageMin: 4, ageMax: 7 },
    { id: "math.pack.measure-intuition", title: "Intuisi Pengukuran", lessonId: "math-measure-intuition", ageMin: 5, ageMax: 7 },
    { id: "math.pack.mixed-operations", title: "Operasi Campuran", lessonId: "math-mixed-operations", ageMin: 5, ageMax: 7 },
    { id: "math.pack.visual-problems", title: "Masalah Visual", lessonId: "math-visual-problems", ageMin: 5, ageMax: 7 },
    { id: "math.pack.review-challenge", title: "Review Matematika", lessonId: "math-review-challenge", ageMin: 5, ageMax: 7 }
  ],
  skills: [
    { id: "math.spatial.position", subjectId: "math", title: "Memahami posisi ruang", description: "Mengenali kiri-kanan, atas-bawah, dalam-luar, dekat-jauh, dan posisi di antara.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.measure.intuition", subjectId: "math", title: "Intuisi pengukuran", description: "Membandingkan panjang, kapasitas, dan ukuran dari representasi sederhana.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.operation.mixed", subjectId: "math", title: "Operasi campuran sederhana", description: "Menentukan dan menyelesaikan penjumlahan atau pengurangan sederhana sampai 10.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.problem.visual", subjectId: "math", title: "Masalah matematika visual", description: "Menalar cerita pendek dengan jumlah kecil dan memilih hasil yang tepat.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.review.integration", subjectId: "math", title: "Integrasi konsep numerasi", description: "Menggunakan beberapa konsep dasar matematika dalam review yang bervariasi.", domain: "numeracy", ageMin: 5, ageMax: 7 }
  ],
  activities: [
    choice("math-spatial-above", "math.pack.spatial-position", "math-spatial-position", "Di atas", "Bola berada di atas kotak. Posisi bola?", ["di atas", "di bawah", "di dalam"], "di atas", "math.spatial.position", { ageMin: 4, required: true, emoji: "⬆️" }),
    choice("math-spatial-left", "math.pack.spatial-position", "math-spatial-position", "Di kiri", "Kucing ada di kiri robot. Posisi kucing?", ["kiri", "kanan", "tengah"], "kiri", "math.spatial.position", { ageMin: 4, emoji: "⬅️" }),
    choice("math-spatial-inside", "math.pack.spatial-position", "math-spatial-position", "Di dalam", "Mainan dimasukkan ke kotak. Mainan sekarang berada di mana?", ["di dalam", "di atas", "di luar"], "di dalam", "math.spatial.position", { ageMin: 4 }),
    choice("math-spatial-near", "math.pack.spatial-position", "math-spatial-position", "Lebih dekat", "Paca berdiri dekat pintu dan jauh dari pohon. Apa yang lebih dekat ke Paca?", ["pintu", "pohon", "sama"], "pintu", "math.spatial.position", { ageMin: 4 }),
    choice("math-spatial-between", "math.pack.spatial-position", "math-spatial-position", "Di antara", "Urutannya Gavi — Paca — Zia. Siapa yang berada di antara Gavi dan Zia?", ["Gavi", "Paca", "Zia"], "Paca", "math.spatial.position", { ageMin: 4, required: true }),

    choice("math-measure-longer", "math.pack.measure-intuition", "math-measure-intuition", "Pita lebih panjang", "Pita A = ━━━━━━ dan pita B = ━━━. Mana lebih panjang?", ["A", "B", "Sama"], "A", "math.measure.intuition", { required: true, emoji: "📏" }),
    choice("math-measure-more-capacity", "math.pack.measure-intuition", "math-measure-intuition", "Wadah lebih besar", "Untuk menampung lebih banyak air, mana biasanya punya kapasitas lebih besar?", ["ember", "cangkir", "sendok"], "ember", "math.measure.intuition", { emoji: "🪣" }),
    choice("math-measure-fuller", "math.pack.measure-intuition", "math-measure-intuition", "Mana lebih penuh?", "Gelas A terisi 3 dari 4 bagian; gelas B terisi 1 dari 4 bagian. Mana lebih penuh?", ["A", "B", "Sama"], "A", "math.measure.intuition", { emoji: "🥛" }),
    matching("math-measure-match-length", "math.pack.measure-intuition", "math-measure-intuition", "Pasangkan ukuran", "Pasangkan kata ukuran dengan representasinya.", "math.measure.intuition", [["long", "lebih panjang", "━━━━━━"], ["short", "lebih pendek", "━━"]], { required: true, emoji: "📏" }),
    choice("math-measure-three-lengths", "math.pack.measure-intuition", "math-measure-intuition", "Urutan panjang", "A=━━, B=━━━━, C=━━━━━━. Mana yang paling pendek?", ["A", "B", "C"], "A", "math.measure.intuition", { emoji: "📏" }),

    choice("math-mixed-add-2-3", "math.pack.mixed-operations", "math-mixed-operations", "Campuran: 2 + 3", "2 + 3 = ?", ["4", "5", "6"], "5", "math.operation.mixed", { required: true, emoji: "➕" }),
    choice("math-mixed-sub-6-1", "math.pack.mixed-operations", "math-mixed-operations", "Campuran: 6 − 1", "6 − 1 = ?", ["4", "5", "6"], "5", "math.operation.mixed", { emoji: "➖" }),
    choice("math-mixed-choose-add", "math.pack.mixed-operations", "math-mixed-operations", "Pilih operasi tambah", "Ada 3 balok lalu ditambah 2 balok. Operasi mana yang cocok?", ["3 + 2", "3 − 2", "2 − 3"], "3 + 2", "math.operation.mixed"),
    choice("math-mixed-add-4-4", "math.pack.mixed-operations", "math-mixed-operations", "Campuran: 4 + 4", "Empat ditambah empat hasilnya?", ["6", "7", "8"], "8", "math.operation.mixed", { required: true }),
    choice("math-mixed-sub-9-3", "math.pack.mixed-operations", "math-mixed-operations", "Campuran: 9 − 3", "Sembilan dikurangi tiga hasilnya?", ["5", "6", "7"], "6", "math.operation.mixed"),

    choice("math-problem-apples", "math.pack.visual-problems", "math-visual-problems", "Apel untuk teman", "Gian punya 2 apel. Naya memberi 2 lagi. Berapa apel Gian sekarang?", ["3", "4", "5"], "4", "math.problem.visual", { required: true, emoji: "🍎" }),
    choice("math-problem-birds", "math.pack.visual-problems", "math-visual-problems", "Burung terbang", "Ada 5 burung. 2 terbang pergi. Berapa burung tersisa?", ["2", "3", "4"], "3", "math.problem.visual", { emoji: "🐦" }),
    choice("math-problem-cars", "math.pack.visual-problems", "math-visual-problems", "Mobil mainan", "Paca punya 3 mobil, lalu menemukan 1 lagi. Berapa semuanya?", ["3", "4", "5"], "4", "math.problem.visual", { emoji: "🚗" }),
    choice("math-problem-cookies", "math.pack.visual-problems", "math-visual-problems", "Biskuit dibagi", "Ada 6 biskuit. 2 dimakan. Berapa yang tersisa?", ["3", "4", "5"], "4", "math.problem.visual", { required: true, emoji: "🍪" }),
    choice("math-problem-balloons", "math.pack.visual-problems", "math-visual-problems", "Balon bertambah", "Zia punya 4 balon lalu mendapat 3 lagi. Berapa balon sekarang?", ["6", "7", "8"], "7", "math.problem.visual", { emoji: "🎈" }),

    choice("math-review-numeral-10", "math.pack.review-challenge", "math-review-challenge", "Review angka 10", "Mana simbol untuk sepuluh?", ["01", "10", "11"], "10", "math.review.integration", { required: true, emoji: "🔟" }),
    choice("math-review-quantity-7", "math.pack.review-challenge", "math-review-challenge", "Review jumlah 7", "●●●●●●● menunjukkan jumlah berapa?", ["6", "7", "8"], "7", "math.review.integration"),
    choice("math-review-shape-property", "math.pack.review-challenge", "math-review-challenge", "Review bentuk", "Bentuk mana memiliki 4 sisi sama panjang?", ["lingkaran", "segitiga", "persegi"], "persegi", "math.review.integration"),
    choice("math-review-pattern", "math.pack.review-challenge", "math-review-challenge", "Review pola", "★ ● ★ ● ★ ... apa berikutnya?", ["★", "●", "■"], "●", "math.review.integration"),
    matching("math-review-match-concepts", "math.pack.review-challenge", "math-review-challenge", "Final pasangan konsep", "Pasangkan tantangan dengan jawabannya.", "math.review.integration", [["add", "2 + 2", "4"], ["compare", "lebih besar: 7 atau 5", "7"]], { required: true })
  ]
};
