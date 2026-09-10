import type { MathBatch7ActivitySeed, MathBatch7WaveDefinition } from "./mathBatch7Authoring";

const STAGE_ID = "math-jumlah-dasar";

function choice(
  id: string,
  packId: string,
  lessonId: string,
  title: string,
  prompt: string,
  choices: string[],
  correctChoice: string,
  skillId: string,
  options: { ageMin?: number; difficulty?: 1 | 2 | 3; required?: boolean; emoji?: string; description?: string } = {}
): MathBatch7ActivitySeed {
  return {
    kind: "choice",
    id,
    packId,
    lessonId,
    title,
    description: options.description ?? "Pilih jawaban yang tepat lewat tantangan angka singkat.",
    emoji: options.emoji ?? "🔢",
    ageMin: options.ageMin ?? 3,
    ageMax: 7,
    difficulty: options.difficulty ?? 1,
    requiredForStage: options.required ?? false,
    skillId,
    prompt,
    choices,
    correctChoice
  };
}

function matching(
  id: string,
  title: string,
  prompt: string,
  pairs: Array<[string, string, string]>,
  options: { required?: boolean; difficulty?: 1 | 2 | 3 } = {}
): MathBatch7ActivitySeed {
  return {
    kind: "matching",
    id,
    packId: "math.pack.quantity-match",
    lessonId: "math-quantity-match",
    title,
    description: "Hubungkan simbol angka dengan jumlah benda yang sesuai.",
    emoji: "🧩",
    ageMin: 4,
    ageMax: 7,
    difficulty: options.difficulty ?? 2,
    requiredForStage: options.required ?? false,
    skillId: "math.quantity.matching",
    prompt,
    matchItems: pairs.flatMap(([pair, left, right]) => [
      { label: left, pair },
      { label: right, pair }
    ])
  };
}

export const MATH_BATCH7_WAVE_A: MathBatch7WaveDefinition = {
  wave: "A",
  stage: {
    id: STAGE_ID,
    subjectId: "math",
    title: "Jumlah & Angka 0–10",
    subtitle: "Kenali simbol angka, hitung benda, lalu hubungkan angka dengan jumlahnya.",
    emoji: "🔟"
  },
  lessons: [
    { id: "math-numeral-0-10", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Kenal angka 0–10", objective: "Membedakan simbol angka penting dari 0 sampai 10.", ageMin: 3, ageMax: 7 },
    { id: "math-count-4-10", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Hitung 4–10", objective: "Menghitung kumpulan benda dari empat sampai sepuluh secara bertahap.", ageMin: 3, ageMax: 7 },
    { id: "math-quantity-match", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Angka dan jumlah", objective: "Menghubungkan simbol angka dengan representasi jumlah yang sesuai.", ageMin: 4, ageMax: 7 },
    { id: "math-subitizing", subjectId: "math", pathId: "math-fondasi-numerasi", stageId: STAGE_ID, title: "Lihat jumlah cepat", objective: "Mengenali jumlah kecil dari susunan visual tanpa harus selalu menghitung satu per satu.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "math.pack.numeral-0-10", title: "Kenal Angka 0–10", lessonId: "math-numeral-0-10", ageMin: 3, ageMax: 7 },
    { id: "math.pack.count-4-10", title: "Hitung 4–10", lessonId: "math-count-4-10", ageMin: 3, ageMax: 7 },
    { id: "math.pack.quantity-match", title: "Angka dan Jumlah", lessonId: "math-quantity-match", ageMin: 4, ageMax: 7 },
    { id: "math.pack.subitizing", title: "Jumlah Sekilas", lessonId: "math-subitizing", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "math.numeral.recognition.0_10", subjectId: "math", title: "Mengenali angka 0–10", description: "Membedakan simbol angka dasar dari 0 sampai 10.", domain: "numeracy", ageMin: 3, ageMax: 7 },
    { id: "math.count.4_10", subjectId: "math", title: "Menghitung 4–10", description: "Menghitung kumpulan benda dari empat sampai sepuluh.", domain: "numeracy", ageMin: 3, ageMax: 7 },
    { id: "math.quantity.matching", subjectId: "math", title: "Mencocokkan angka dan jumlah", description: "Menghubungkan simbol angka dengan representasi jumlah yang setara.", domain: "numeracy", ageMin: 4, ageMax: 7 },
    { id: "math.quantity.subitizing", subjectId: "math", title: "Mengenali jumlah sekilas", description: "Mengenali jumlah kecil dari susunan visual dengan cepat.", domain: "numeracy", ageMin: 4, ageMax: 7 }
  ],
  activities: [
    choice("math-recognize-0", "math.pack.numeral-0-10", "math-numeral-0-10", "Temukan angka 0", "Mana angka nol?", ["0", "6", "9"], "0", "math.numeral.recognition.0_10", { required: true, emoji: "0️⃣" }),
    choice("math-recognize-1", "math.pack.numeral-0-10", "math-numeral-0-10", "Temukan angka 1", "Pilih angka satu.", ["7", "1", "4"], "1", "math.numeral.recognition.0_10", { emoji: "1️⃣" }),
    choice("math-recognize-4", "math.pack.numeral-0-10", "math-numeral-0-10", "Temukan angka 4", "Angka mana yang menunjukkan empat?", ["9", "4", "7"], "4", "math.numeral.recognition.0_10", { emoji: "4️⃣" }),
    choice("math-recognize-7", "math.pack.numeral-0-10", "math-numeral-0-10", "Temukan angka 7", "Cari simbol angka tujuh.", ["2", "7", "1"], "7", "math.numeral.recognition.0_10", { required: true, emoji: "7️⃣" }),

    choice("math-count-4", "math.pack.count-4-10", "math-count-4-10", "Hitung 4 bintang", "⭐ ⭐ ⭐ ⭐ Ada berapa bintang?", ["3", "4", "5"], "4", "math.count.4_10", { required: true, emoji: "⭐" }),
    choice("math-count-5", "math.pack.count-4-10", "math-count-4-10", "Hitung 5 ikan", "🐟 🐟 🐟 🐟 🐟 Ada berapa ikan?", ["4", "5", "6"], "5", "math.count.4_10", { emoji: "🐟" }),
    choice("math-count-6", "math.pack.count-4-10", "math-count-4-10", "Hitung 6 bunga", "🌼 🌼 🌼 🌼 🌼 🌼 Ada berapa bunga?", ["5", "6", "7"], "6", "math.count.4_10", { emoji: "🌼" }),
    choice("math-count-7", "math.pack.count-4-10", "math-count-4-10", "Hitung 7 kelereng", "● ● ● ● ● ● ● Ada berapa kelereng?", ["6", "7", "8"], "7", "math.count.4_10", { difficulty: 2, emoji: "🔵" }),
    choice("math-count-8", "math.pack.count-4-10", "math-count-4-10", "Hitung 8 daun", "🍃 🍃 🍃 🍃 🍃 🍃 🍃 🍃 Ada berapa daun?", ["7", "8", "9"], "8", "math.count.4_10", { required: true, difficulty: 2, emoji: "🍃" }),
    choice("math-count-9", "math.pack.count-4-10", "math-count-4-10", "Hitung 9 hati", "♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ Ada berapa hati?", ["8", "9", "10"], "9", "math.count.4_10", { difficulty: 2, emoji: "♥️" }),
    choice("math-count-10", "math.pack.count-4-10", "math-count-4-10", "Hitung sampai 10", "● ● ● ● ● ● ● ● ● ● Ada berapa titik?", ["8", "9", "10"], "10", "math.count.4_10", { required: true, difficulty: 2, emoji: "🔟" }),

    matching("math-match-number-quantity-1-2", "Pasangkan 1 dan 2", "Pasangkan angka dengan jumlah titiknya.", [["one", "1", "●"], ["two", "2", "●●"]], { required: true }),
    matching("math-match-number-quantity-3-4", "Pasangkan 3 dan 4", "Hubungkan angka 3 dan 4 dengan jumlah yang benar.", [["three", "3", "●●●"], ["four", "4", "●●●●"]]),
    matching("math-match-number-quantity-5-6", "Pasangkan 5 dan 6", "Hubungkan angka 5 dan 6 dengan kelompok titiknya.", [["five", "5", "●●●●●"], ["six", "6", "●●●●●●"]], { difficulty: 2 }),
    matching("math-match-number-quantity-7-8", "Pasangkan 7 dan 8", "Cari pasangan jumlah untuk angka 7 dan 8.", [["seven", "7", "●●●●●●●"], ["eight", "8", "●●●●●●●●"]], { difficulty: 2 }),

    choice("math-subitize-2", "math.pack.subitizing", "math-subitizing", "Lihat cepat: 2", "Tanpa menghitung lama, berapa titik yang terlihat: ● ● ?", ["1", "2", "3"], "2", "math.quantity.subitizing", { ageMin: 4, emoji: "👀" }),
    choice("math-subitize-4", "math.pack.subitizing", "math-subitizing", "Lihat cepat: 4", "Lihat pola ● ● / ● ●. Ada berapa titik?", ["3", "4", "5"], "4", "math.quantity.subitizing", { ageMin: 4, required: true, difficulty: 2, emoji: "👀" }),
    choice("math-subitize-5", "math.pack.subitizing", "math-subitizing", "Lihat cepat: 5", "Lihat pola seperti dadu lima. Berapa jumlah titiknya?", ["4", "5", "6"], "5", "math.quantity.subitizing", { ageMin: 4, difficulty: 2, emoji: "🎲" })
  ]
};
