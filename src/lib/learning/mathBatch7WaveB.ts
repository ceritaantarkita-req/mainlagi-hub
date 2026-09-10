import type { MathBatch7ActivitySeed, MathBatch7WaveDefinition } from "./mathBatch7Authoring";

const STAGE_ID = "math-banding-bentuk";

type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(id: string, packId: string, lessonId: string, title: string, prompt: string, choices: string[], correctChoice: string, skillId: string, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "choice", id, packId, lessonId, title, description: "Pilih jawaban yang paling tepat dari tantangan visual matematika.", emoji: options.emoji ?? "🧠", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, choices, correctChoice };
}

function matching(id: string, packId: string, lessonId: string, title: string, prompt: string, skillId: string, pairs: Array<[string, string, string]>, options: SeedOptions = {}): MathBatch7ActivitySeed {
  return { kind: "matching", id, packId, lessonId, title, description: "Pasangkan representasi matematika yang memiliki hubungan yang sama.", emoji: options.emoji ?? "🧩", ageMin: options.ageMin ?? 4, ageMax: 7, difficulty: options.difficulty ?? 2, requiredForStage: options.required ?? false, skillId, prompt, matchItems: pairs.flatMap(([pair, left, right]) => [{ label: left, pair }, { label: right, pair }]) };
}

export const MATH_BATCH7_WAVE_B: MathBatch7WaveDefinition = {
  wave: "B",
  stage: { id: STAGE_ID, subjectId: "math", title: "Bandingkan, Urutkan & Bentuk", subtitle: "Bandingkan jumlah, urutkan angka, kenali bentuk, lalu lanjutkan pola.", emoji: "📐" },
  lessons: [
    { id: "math-compare-quantities", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Lebih banyak, lebih sedikit, sama", objective: "Membandingkan dua jumlah sederhana secara visual.", ageMin: 4, ageMax: 7 },
    { id: "math-order-numbers", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Urutkan angka", objective: "Mengenali urutan angka naik dan turun sampai 10.", ageMin: 4, ageMax: 7 },
    { id: "math-shapes", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Kenali bentuk", objective: "Mengenali bentuk dasar dan sifat visual sederhananya.", ageMin: 3, ageMax: 7 },
    { id: "math-pattern-sequences", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Lanjutkan pola", objective: "Menemukan aturan pola sederhana dan memilih bagian berikutnya.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "math.pack.compare-quantities", title: "Bandingkan Jumlah", lessonId: "math-compare-quantities", ageMin: 4, ageMax: 7 },
    { id: "math.pack.order-numbers", title: "Urutan Angka", lessonId: "math-order-numbers", ageMin: 4, ageMax: 7 },
    { id: "math.pack.shapes", title: "Bentuk Dasar", lessonId: "math-shapes", ageMin: 3, ageMax: 7 },
    { id: "math.pack.pattern-sequences", title: "Pola Berulang", lessonId: "math-pattern-sequences", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "math.quantity.comparison", subjectId: "math", title: "Membandingkan jumlah", description: "Menentukan kelompok yang lebih banyak, lebih sedikit, atau sama.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.number.ordering", subjectId: "math", title: "Mengurutkan angka", description: "Mengenali urutan angka naik dan turun sampai 10.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.shape.recognition", subjectId: "math", title: "Mengenali bentuk dasar", description: "Membedakan lingkaran, segitiga, persegi, persegi panjang, dan bentuk dasar lain.", domain: "numeracy", ageMin: 3, ageMax: 7 },
    { id: "math.shape.properties", subjectId: "math", title: "Sifat bentuk sederhana", description: "Mengamati sisi dan sudut pada bentuk dasar secara visual.", domain: "numeracy", ageMin: 5, ageMax: 7 },
    { id: "math.pattern.sequence", subjectId: "math", title: "Melanjutkan pola", description: "Menentukan elemen berikutnya pada pola warna, bentuk, atau jumlah sederhana.", domain: "numeracy", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("math-compare-more-2-4", "math.pack.compare-quantities", "math-compare-quantities", "Mana lebih banyak: 2 atau 4?", "Kelompok mana yang lebih banyak: ●● atau ●●●●?", ["●●", "●●●●", "Sama"], "●●●●", "math.quantity.comparison", { required: true }),
    choice("math-compare-less-5-3", "math.pack.compare-quantities", "math-compare-quantities", "Mana lebih sedikit: 5 atau 3?", "Kelompok mana yang lebih sedikit: ★★★★★ atau ★★★?", ["★★★★★", "★★★", "Sama"], "★★★", "math.quantity.comparison"),
    choice("math-compare-equal-4-4", "math.pack.compare-quantities", "math-compare-quantities", "Apakah jumlahnya sama?", "🍎🍎🍎🍎 dibanding 🍌🍌🍌🍌. Bagaimana jumlahnya?", ["Kiri lebih banyak", "Sama", "Kanan lebih banyak"], "Sama", "math.quantity.comparison"),
    choice("math-compare-more-6-5", "math.pack.compare-quantities", "math-compare-quantities", "Bandingkan 6 dan 5", "Mana yang lebih besar jumlahnya: 6 atau 5?", ["5", "6", "Sama"], "6", "math.quantity.comparison"),
    choice("math-compare-less-7-9", "math.pack.compare-quantities", "math-compare-quantities", "Bandingkan 7 dan 9", "Pilih angka yang lebih kecil.", ["7", "9", "Sama"], "7", "math.quantity.comparison", { required: true }),
    choice("math-compare-more-10-8", "math.pack.compare-quantities", "math-compare-quantities", "Bandingkan 10 dan 8", "Pilih angka yang lebih besar.", ["8", "10", "Sama"], "10", "math.quantity.comparison", { difficulty: 2 }),

    choice("math-order-next-1-2", "math.pack.order-numbers", "math-order-numbers", "Setelah 1, 2", "1, 2, ... angka berikutnya apa?", ["3", "4", "5"], "3", "math.number.ordering", { required: true }),
    choice("math-order-next-3-4", "math.pack.order-numbers", "math-order-numbers", "Setelah 3, 4", "3, 4, ... lanjutkan urutannya.", ["2", "5", "6"], "5", "math.number.ordering"),
    choice("math-order-before-6", "math.pack.order-numbers", "math-order-numbers", "Sebelum 6", "Angka apa tepat sebelum 6?", ["4", "5", "7"], "5", "math.number.ordering"),
    choice("math-order-between-6-8", "math.pack.order-numbers", "math-order-numbers", "Di antara 6 dan 8", "6, ..., 8. Angka yang hilang?", ["5", "7", "9"], "7", "math.number.ordering", { required: true }),
    choice("math-order-descend-5", "math.pack.order-numbers", "math-order-numbers", "Urutan turun dari 5", "5, 4, ... angka berikutnya?", ["2", "3", "6"], "3", "math.number.ordering", { difficulty: 2 }),
    choice("math-order-descend-10", "math.pack.order-numbers", "math-order-numbers", "Urutan turun dari 10", "10, 9, ... lanjutkan.", ["7", "8", "11"], "8", "math.number.ordering", { difficulty: 2 }),

    choice("math-shape-find-circle", "math.pack.shapes", "math-shapes", "Temukan lingkaran", "Bentuk mana yang bulat tanpa sudut?", ["●", "▲", "■"], "●", "math.shape.recognition", { ageMin: 3, required: true, emoji: "⚪" }),
    choice("math-shape-find-triangle", "math.pack.shapes", "math-shapes", "Temukan segitiga", "Mana bentuk segitiga?", ["■", "▲", "●"], "▲", "math.shape.recognition", { ageMin: 3, emoji: "🔺" }),
    choice("math-shape-find-square", "math.pack.shapes", "math-shapes", "Temukan persegi", "Pilih bentuk persegi.", ["▭", "■", "●"], "■", "math.shape.recognition", { ageMin: 3, emoji: "🟧" }),
    matching("math-shape-match-circle-square", "math.pack.shapes", "math-shapes", "Pasangan bentuk 1", "Pasangkan nama dengan bentuknya.", "math.shape.recognition", [["circle", "Lingkaran", "●"], ["square", "Persegi", "■"]], { ageMin: 4 }),
    matching("math-shape-match-triangle-rectangle", "math.pack.shapes", "math-shapes", "Pasangan bentuk 2", "Hubungkan nama bentuk dengan simbolnya.", "math.shape.recognition", [["triangle", "Segitiga", "▲"], ["rectangle", "Persegi panjang", "▭"]], { ageMin: 4 }),
    choice("math-shape-three-sides", "math.pack.shapes", "math-shapes", "Bentuk dengan 3 sisi", "Bentuk mana yang punya 3 sisi?", ["Lingkaran", "Segitiga", "Persegi"], "Segitiga", "math.shape.properties", { ageMin: 5, required: true }),

    choice("math-pattern-ab-shapes", "math.pack.pattern-sequences", "math-pattern-sequences", "Pola ▲ ●", "▲ ● ▲ ● ... apa berikutnya?", ["▲", "●", "■"], "▲", "math.pattern.sequence", { required: true, emoji: "🔁" }),
    choice("math-pattern-aab-colors", "math.pack.pattern-sequences", "math-pattern-sequences", "Pola merah merah biru", "🔴 🔴 🔵 🔴 🔴 ... warna berikutnya?", ["🔴", "🔵", "🟡"], "🔵", "math.pattern.sequence", { emoji: "🎨" }),
    choice("math-pattern-number-step-one", "math.pack.pattern-sequences", "math-pattern-sequences", "Pola angka naik", "2, 3, 4, ... angka berikutnya?", ["5", "6", "7"], "5", "math.pattern.sequence"),
    choice("math-pattern-number-step-two", "math.pack.pattern-sequences", "math-pattern-sequences", "Lompat dua", "2, 4, 6, ... angka berikutnya?", ["7", "8", "10"], "8", "math.pattern.sequence", { ageMin: 5, difficulty: 3 }),
    choice("math-pattern-size", "math.pack.pattern-sequences", "math-pattern-sequences", "Pola kecil-besar", "kecil, besar, kecil, besar, ... apa berikutnya?", ["kecil", "besar", "sama"], "kecil", "math.pattern.sequence"),
    matching("math-pattern-match-ab", "math.pack.pattern-sequences", "math-pattern-sequences", "Cocokkan pola AB", "Pasangkan pola dengan kelanjutannya.", "math.pattern.sequence", [["ab1", "▲●▲●", "▲"], ["ab2", "■★■★", "■"]], { difficulty: 2 }),
    matching("math-pattern-match-aab", "math.pack.pattern-sequences", "math-pattern-sequences", "Cocokkan pola AAB", "Hubungkan pola dengan simbol berikutnya.", "math.pattern.sequence", [["aab1", "●●▲●●", "▲"], ["aab2", "★★■★★", "■"]], { ageMin: 5, difficulty: 3 })
  ]
};
