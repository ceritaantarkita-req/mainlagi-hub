import type { LogicBatch12ActivitySeed, LogicBatch12WaveDefinition } from "./logicBatch12Authoring";

const STAGE_ID = "logic-classification-rules-basics";
type SeedOptions = { required?: boolean; difficulty?: 1 | 2 | 3; ageMin?: number; emoji?: string };

function choice(
  id: string,
  packId: string,
  lessonId: string,
  title: string,
  description: string,
  prompt: string,
  choices: string[],
  correctChoice: string,
  skillId: string,
  options: SeedOptions = {}
): LogicBatch12ActivitySeed {
  return {
    kind: "choice",
    id,
    packId,
    lessonId,
    title,
    description,
    emoji: options.emoji ?? "🧠",
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
  packId: string,
  lessonId: string,
  title: string,
  description: string,
  prompt: string,
  skillId: string,
  pairs: Array<{ left: string; right: string; pair: string }>,
  options: SeedOptions = {}
): LogicBatch12ActivitySeed {
  return {
    kind: "matching",
    id,
    packId,
    lessonId,
    title,
    description,
    emoji: options.emoji ?? "🧩",
    ageMin: options.ageMin ?? 3,
    ageMax: 7,
    difficulty: options.difficulty ?? 1,
    requiredForStage: options.required ?? false,
    skillId,
    prompt,
    matchItems: pairs.flatMap(({ left, right, pair }) => [
      { label: left, pair },
      { label: right, pair }
    ])
  };
}

const relations = [
  matching(
    "logic-match-identical-shapes",
    "logic.pack.relations-basic",
    "logic-relations-basic",
    "Pasangan bentuk yang sama",
    "Cocokkan simbol dengan simbol yang benar-benar sama.",
    "Pasangkan bentuk yang sama.",
    "logic.relations.matching.basic",
    [
      { left: "●", right: "●", pair: "circle" },
      { left: "▲", right: "▲", pair: "triangle" },
      { left: "■", right: "■", pair: "square" }
    ],
    { required: true }
  ),
  matching(
    "logic-match-equal-counts",
    "logic.pack.relations-basic",
    "logic-relations-basic",
    "Pasangkan jumlah yang sama",
    "Temukan dua kelompok berbeda yang mempunyai jumlah simbol sama.",
    "Pasangkan kelompok dengan jumlah yang sama.",
    "logic.relations.matching.basic",
    [
      { left: "●", right: "★", pair: "one" },
      { left: "●●", right: "★★", pair: "two" },
      { left: "●●●", right: "★★★", pair: "three" }
    ],
    { difficulty: 2, ageMin: 4 }
  ),
  matching(
    "logic-match-related-items",
    "logic.pack.relations-basic",
    "logic-relations-basic",
    "Benda yang saling berhubungan",
    "Pasangkan benda sehari-hari yang biasa digunakan bersama.",
    "Cari benda yang cocok digunakan bersama.",
    "logic.relations.matching.basic",
    [
      { left: "🔑", right: "🔒", pair: "lock" },
      { left: "🪥", right: "🦷", pair: "teeth" },
      { left: "✏️", right: "📄", pair: "write" }
    ],
    { difficulty: 2, ageMin: 4 }
  )
];

const classification = [
  choice(
    "logic-classify-animal",
    "logic.pack.classification-basic",
    "logic-classification-basic",
    "Cari yang termasuk hewan",
    "Kelompokkan berdasarkan jenis benda sederhana.",
    "Mana yang termasuk hewan?",
    ["🚗", "🐱", "🍎"],
    "🐱",
    "logic.classification.visual.basic",
    { required: true, emoji: "🐱" }
  ),
  choice(
    "logic-classify-round",
    "logic.pack.classification-basic",
    "logic-classification-basic",
    "Cari bentuk bulat",
    "Kelompokkan simbol berdasarkan ciri bentuk visual.",
    "Mana yang bentuknya bulat?",
    ["▲", "●", "■"],
    "●",
    "logic.classification.visual.basic",
    { emoji: "●" }
  ),
  choice(
    "logic-classify-up-arrow",
    "logic.pack.classification-basic",
    "logic-classification-basic",
    "Cari arah ke atas",
    "Kelompokkan simbol berdasarkan arah yang ditunjukkan.",
    "Panah mana yang mengarah ke atas?",
    ["→", "↑", "↓"],
    "↑",
    "logic.classification.visual.basic",
    { difficulty: 2, ageMin: 4, emoji: "↑" }
  ),
  choice(
    "logic-classify-two-items",
    "logic.pack.classification-basic",
    "logic-classification-basic",
    "Cari kelompok berisi dua",
    "Kelompokkan berdasarkan banyaknya simbol pada kelompok kecil.",
    "Mana kelompok yang berisi dua bintang?",
    ["★★★", "★★", "★"],
    "★★",
    "logic.classification.visual.basic",
    { difficulty: 2, ageMin: 4, emoji: "⭐" }
  ),
  choice(
    "logic-classify-red",
    "logic.pack.classification-basic",
    "logic-classification-basic",
    "Cari yang berwarna merah",
    "Kelompokkan objek berdasarkan satu ciri warna yang terlihat jelas.",
    "Mana yang berwarna merah?",
    ["🔵", "🔴", "🟢"],
    "🔴",
    "logic.classification.visual.basic",
    { emoji: "🔴" }
  )
];

const oddOneOut = [
  choice(
    "logic-odd-category-animal-vehicle",
    "logic.pack.odd-one-out-basic",
    "logic-odd-one-out-basic",
    "Yang beda jenis",
    "Temukan satu pilihan dari kategori berbeda.",
    "Dua adalah hewan. Mana yang berbeda?",
    ["🐶", "🐱", "🚗"],
    "🚗",
    "logic.discrimination.odd_one_out.basic",
    { required: true, emoji: "🔎" }
  ),
  choice(
    "logic-odd-shape-angular",
    "logic.pack.odd-one-out-basic",
    "logic-odd-one-out-basic",
    "Yang beda bentuk",
    "Temukan bentuk yang tidak memiliki ciri visual sama dengan dua lainnya.",
    "Dua bentuk sama-sama bulat. Mana yang berbeda?",
    ["●", "○", "▲"],
    "▲",
    "logic.discrimination.odd_one_out.basic",
    { emoji: "🔎" }
  ),
  choice(
    "logic-odd-direction-right",
    "logic.pack.odd-one-out-basic",
    "logic-odd-one-out-basic",
    "Yang beda arah",
    "Temukan simbol yang menunjukkan arah berbeda.",
    "Dua panah menunjuk ke atas. Mana yang berbeda?",
    ["↑", "⬆️", "→"],
    "→",
    "logic.discrimination.odd_one_out.basic",
    { difficulty: 2, ageMin: 4, emoji: "🔎" }
  ),
  choice(
    "logic-odd-count-three",
    "logic.pack.odd-one-out-basic",
    "logic-odd-one-out-basic",
    "Yang beda jumlah",
    "Temukan kelompok yang jumlah anggotanya berbeda.",
    "Dua kelompok berisi dua simbol. Mana yang berbeda?",
    ["●●", "★★", "▲▲▲"],
    "▲▲▲",
    "logic.discrimination.odd_one_out.basic",
    { difficulty: 2, ageMin: 4, emoji: "🔎" }
  ),
  choice(
    "logic-odd-pattern-symmetry",
    "logic.pack.odd-one-out-basic",
    "logic-odd-one-out-basic",
    "Yang beda susunan",
    "Temukan susunan yang tidak mempunyai pola kiri-kanan yang sama.",
    "Dua susunan berbentuk A-B-A. Mana yang berbeda?",
    ["○●○", "▲■▲", "○○●"],
    "○○●",
    "logic.discrimination.odd_one_out.basic",
    { difficulty: 3, ageMin: 5, emoji: "🔎" }
  )
];

const comparison = [
  choice(
    "logic-compare-more-dots",
    "logic.pack.comparison-basic",
    "logic-comparison-basic",
    "Mana yang lebih banyak?",
    "Bandingkan tiga kelompok kecil lalu pilih yang jumlahnya paling banyak.",
    "Kelompok mana yang paling banyak?",
    ["●●●", "●", "●●"],
    "●●●",
    "logic.comparison.visual.basic",
    { required: true, difficulty: 2, ageMin: 4, emoji: "⚖️" }
  ),
  choice(
    "logic-compare-fewer-stars",
    "logic.pack.comparison-basic",
    "logic-comparison-basic",
    "Mana yang lebih sedikit?",
    "Bandingkan tiga kelompok kecil lalu pilih yang jumlahnya paling sedikit.",
    "Kelompok mana yang paling sedikit?",
    ["★★", "★", "★★★"],
    "★",
    "logic.comparison.visual.basic",
    { difficulty: 2, ageMin: 4, emoji: "⚖️" }
  ),
  choice(
    "logic-compare-longest-line",
    "logic.pack.comparison-basic",
    "logic-comparison-basic",
    "Cari garis paling panjang",
    "Bandingkan panjang beberapa garis sederhana secara visual.",
    "Mana garis yang paling panjang?",
    ["─", "──", "────"],
    "────",
    "logic.comparison.visual.basic",
    { difficulty: 2, ageMin: 4, emoji: "📏" }
  ),
  choice(
    "logic-compare-equal-three",
    "logic.pack.comparison-basic",
    "logic-comparison-basic",
    "Cari jumlah yang sama",
    "Bandingkan kelompok berbeda dan cari jumlah yang setara dengan contoh.",
    "Mana yang sama banyak dengan ●●●?",
    ["★★", "★★★", "★★★★"],
    "★★★",
    "logic.comparison.visual.basic",
    { difficulty: 2, ageMin: 4, emoji: "⚖️" }
  )
];

const rules = [
  choice(
    "logic-rule-alternate-shapes",
    "logic.pack.simple-rules-basic",
    "logic-simple-rules-basic",
    "Lanjutkan pola bergantian",
    "Ikuti aturan sederhana dua simbol yang bergantian.",
    "● ▲ ● ▲ ... selanjutnya apa?",
    ["●", "▲", "■"],
    "●",
    "logic.sequence.rules.basic",
    { required: true, difficulty: 2, ageMin: 4, emoji: "🔁" }
  ),
  choice(
    "logic-rule-cycle-directions",
    "logic.pack.simple-rules-basic",
    "logic-simple-rules-basic",
    "Lanjutkan tiga arah",
    "Ikuti urutan tiga simbol yang berulang.",
    "↑ → ↓ ↑ → ... selanjutnya apa?",
    ["←", "↓", "↑"],
    "↓",
    "logic.sequence.rules.basic",
    { difficulty: 2, ageMin: 4, emoji: "🔁" }
  ),
  choice(
    "logic-rule-aab-repeat",
    "logic.pack.simple-rules-basic",
    "logic-simple-rules-basic",
    "Temukan awal kelompok berikutnya",
    "Ikuti aturan dua simbol sama lalu satu simbol berbeda.",
    "★ ★ ○ ★ ★ ○ ... selanjutnya apa?",
    ["★", "○", "▲"],
    "★",
    "logic.sequence.rules.basic",
    { difficulty: 3, ageMin: 5, emoji: "🔁" }
  ),
  choice(
    "logic-rule-growing-dots",
    "logic.pack.simple-rules-basic",
    "logic-simple-rules-basic",
    "Tambah satu setiap langkah",
    "Ikuti aturan kelompok yang bertambah satu simbol setiap langkah.",
    "●, ●●, ●●●, ... selanjutnya apa?",
    ["●●", "●●●●", "●"],
    "●●●●",
    "logic.sequence.rules.basic",
    { difficulty: 3, ageMin: 5, emoji: "🔁" }
  ),
  choice(
    "logic-rule-turn-clockwise",
    "logic.pack.simple-rules-basic",
    "logic-simple-rules-basic",
    "Putar arah satu langkah",
    "Ikuti perubahan arah seperempat putaran searah jarum jam.",
    "↑ → ↓ ... selanjutnya apa?",
    ["←", "↑", "→"],
    "←",
    "logic.sequence.rules.basic",
    { difficulty: 3, ageMin: 5, emoji: "🔄" }
  )
];

export const LOGIC_BATCH12_WAVE_A: LogicBatch12WaveDefinition = {
  wave: "A",
  stage: {
    id: STAGE_ID,
    subjectId: "logic",
    title: "Kelompokkan, Bandingkan & Ikuti Aturan",
    subtitle: "Latih relasi, klasifikasi, beda-satu, perbandingan, dan aturan urutan sederhana.",
    emoji: "🧠"
  },
  lessons: [
    { id: "logic-relations-basic", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: STAGE_ID, title: "Pasangan & relasi", objective: "Mencocokkan objek berdasarkan kesamaan visual, jumlah setara, dan hubungan sederhana.", ageMin: 3, ageMax: 7 },
    { id: "logic-classification-basic", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: STAGE_ID, title: "Kelompokkan berdasarkan aturan", objective: "Memilih objek yang memenuhi satu aturan kategori atau ciri visual sederhana.", ageMin: 3, ageMax: 7 },
    { id: "logic-odd-one-out-basic", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: STAGE_ID, title: "Temukan yang berbeda", objective: "Menemukan satu pilihan yang berbeda berdasarkan kategori, bentuk, arah, jumlah, atau susunan.", ageMin: 3, ageMax: 7 },
    { id: "logic-comparison-basic", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: STAGE_ID, title: "Bandingkan", objective: "Membandingkan jumlah, kesetaraan, dan panjang melalui petunjuk visual sederhana.", ageMin: 4, ageMax: 7 },
    { id: "logic-simple-rules-basic", subjectId: "logic", pathId: "logic-thinking-foundations", stageId: STAGE_ID, title: "Ikuti aturan sederhana", objective: "Menentukan kelanjutan urutan dari aturan pengulangan, pertambahan, dan perubahan arah sederhana.", ageMin: 4, ageMax: 7 }
  ],
  packs: [
    { id: "logic.pack.relations-basic", title: "Basic Visual Relations", lessonId: "logic-relations-basic", ageMin: 3, ageMax: 7 },
    { id: "logic.pack.classification-basic", title: "Basic Classification", lessonId: "logic-classification-basic", ageMin: 3, ageMax: 7 },
    { id: "logic.pack.odd-one-out-basic", title: "Basic Odd One Out", lessonId: "logic-odd-one-out-basic", ageMin: 3, ageMax: 7 },
    { id: "logic.pack.comparison-basic", title: "Basic Comparison", lessonId: "logic-comparison-basic", ageMin: 4, ageMax: 7 },
    { id: "logic.pack.simple-rules-basic", title: "Basic Rule Following", lessonId: "logic-simple-rules-basic", ageMin: 4, ageMax: 7 }
  ],
  skills: [
    { id: "logic.relations.matching.basic", subjectId: "logic", title: "Mencocokkan relasi sederhana", description: "Mencocokkan berdasarkan kesamaan visual, jumlah setara, dan hubungan benda sederhana.", domain: "reasoning", ageMin: 3, ageMax: 7 },
    { id: "logic.classification.visual.basic", subjectId: "logic", title: "Klasifikasi visual dasar", description: "Memilih objek yang memenuhi satu aturan kategori atau ciri visual yang jelas.", domain: "reasoning", ageMin: 3, ageMax: 7 },
    { id: "logic.discrimination.odd_one_out.basic", subjectId: "logic", title: "Menemukan yang berbeda", description: "Menentukan satu pilihan yang berbeda dari kelompok berdasarkan aturan yang terlihat.", domain: "reasoning", ageMin: 3, ageMax: 7 },
    { id: "logic.comparison.visual.basic", subjectId: "logic", title: "Perbandingan visual dasar", description: "Membandingkan jumlah, kesetaraan, atau panjang melalui representasi visual sederhana.", domain: "reasoning", ageMin: 4, ageMax: 7 },
    { id: "logic.sequence.rules.basic", subjectId: "logic", title: "Mengikuti aturan urutan dasar", description: "Menentukan kelanjutan urutan dari pola pengulangan, pertambahan, atau perubahan arah sederhana.", domain: "reasoning", ageMin: 4, ageMax: 7 }
  ],
  activities: [...relations, ...classification, ...oddOneOut, ...comparison, ...rules]
};
