import type { LearningActivity } from "./systemBase";

function choice(args: {
  id: string;
  title: string;
  description: string;
  emoji: string;
  prompt: string;
  choices: [string, string, string];
  correctChoice: string;
  ageMin?: number;
  stars?: number;
}): LearningActivity {
  return {
    id: args.id,
    subjectId: "math",
    stageId: "math-angka",
    title: args.title,
    description: args.description,
    emoji: args.emoji,
    runtime: "tap_choice",
    ageMin: args.ageMin ?? 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: args.stars ?? 2,
    prompt: args.prompt,
    choices: args.choices,
    correctChoice: args.correctChoice
  };
}

function matching(args: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  pairs: [[string, string], [string, string]];
}): LearningActivity {
  return {
    id: args.id,
    subjectId: "math",
    stageId: "math-angka",
    title: args.title,
    description: args.description,
    emoji: "🧩",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: args.prompt,
    matchItems: args.pairs.flatMap(([numeral, quantity], index) => [
      { label: numeral, pair: `quantity-${args.id}-${index}` },
      { label: quantity, pair: `quantity-${args.id}-${index}` }
    ])
  };
}

export const MATH_WAVE_A_ACTIVITIES: LearningActivity[] = [
  choice({ id: "math-numeral-find-1", title: "Temukan angka 1", description: "Kenali simbol angka satu dari bentuk angka lain.", emoji: "1️⃣", prompt: "Mana angka 1?", choices: ["1", "7", "4"], correctChoice: "1" }),
  choice({ id: "math-numeral-find-2", title: "Temukan angka 2", description: "Kenali simbol angka dua dari pilihan sederhana.", emoji: "2️⃣", prompt: "Mana angka 2?", choices: ["5", "2", "3"], correctChoice: "2" }),
  choice({ id: "math-numeral-find-3", title: "Temukan angka 3", description: "Kenali simbol angka tiga dari bentuk yang berbeda.", emoji: "3️⃣", prompt: "Mana angka 3?", choices: ["8", "6", "3"], correctChoice: "3" }),
  choice({ id: "math-numeral-find-4", title: "Temukan angka 4", description: "Kenali simbol angka empat dalam pilihan angka.", emoji: "4️⃣", prompt: "Mana angka 4?", choices: ["9", "4", "1"], correctChoice: "4" }),
  choice({ id: "math-numeral-find-5", title: "Temukan angka 5", description: "Kenali simbol angka lima tanpa perlu tracing.", emoji: "5️⃣", prompt: "Mana angka 5?", choices: ["2", "5", "8"], correctChoice: "5" }),

  choice({ id: "math-count-1", title: "Hitung satu bintang", description: "Hubungkan satu benda dengan jumlah satu.", emoji: "⭐", prompt: "⭐ Ada berapa bintang?", choices: ["1", "2", "3"], correctChoice: "1" }),
  choice({ id: "math-count-4", title: "Hitung empat ikan", description: "Hitung kumpulan empat benda satu per satu.", emoji: "🐟", prompt: "🐟 🐟 🐟 🐟 Ada berapa ikan?", choices: ["3", "4", "5"], correctChoice: "4" }),
  choice({ id: "math-count-5", title: "Hitung lima titik", description: "Hitung kumpulan lima benda dan pilih jumlahnya.", emoji: "⚫", prompt: "● ● ● ● ● Ada berapa titik?", choices: ["4", "5", "6"], correctChoice: "5", ageMin: 4 }),

  matching({ id: "math-match-quantity-1-2", title: "Pasangkan jumlah 1 dan 2", description: "Pasangkan simbol angka dengan banyak titik yang sesuai.", prompt: "Pasangkan angka dengan jumlah titik", pairs: [["1", "●"], ["2", "●●"]] }),
  matching({ id: "math-match-quantity-3-4", title: "Pasangkan jumlah 3 dan 4", description: "Hubungkan angka tiga dan empat dengan jumlah yang tepat.", prompt: "Pasangkan 3 dan 4 dengan jumlahnya", pairs: [["3", "●●●"], ["4", "●●●●"]] }),
  matching({ id: "math-match-quantity-4-5", title: "Bintang berjumlah 4 dan 5", description: "Pasangkan angka dengan kelompok bintang berjumlah empat atau lima.", prompt: "Pasangkan angka dengan kelompok bintang", pairs: [["4", "★★★★"], ["5", "★★★★★"]] }),
  matching({ id: "math-match-quantity-1-5", title: "Bandingkan jumlah 1 dan 5", description: "Hubungkan dua jumlah yang berjauhan untuk memperkuat intuisi kuantitas.", prompt: "Pasangkan angka 1 dan 5 dengan kelompok segitiga", pairs: [["1", "▲"], ["5", "▲▲▲▲▲"]] }),

  choice({ id: "math-quick-2", title: "Lihat cepat: dua", description: "Kenali jumlah dua dari susunan kecil tanpa menghitung lama.", emoji: "👀", prompt: "Lihat cepat: • • Ada berapa?", choices: ["1", "2", "3"], correctChoice: "2" }),
  choice({ id: "math-quick-3", title: "Lihat cepat: tiga", description: "Kenali tiga titik dalam susunan segitiga sederhana.", emoji: "👀", prompt: "Lihat cepat: • / • • — ada berapa titik?", choices: ["2", "3", "4"], correctChoice: "3" }),
  choice({ id: "math-quick-4", title: "Lihat cepat: empat", description: "Kenali empat titik dalam susunan persegi.", emoji: "👀", prompt: "Lihat cepat: • • / • • — ada berapa titik?", choices: ["3", "4", "5"], correctChoice: "4", ageMin: 4 }),
  choice({ id: "math-quick-5", title: "Lihat cepat: lima", description: "Kenali lima titik dalam pola seperti sisi dadu.", emoji: "🎲", prompt: "Pola dadu: • • / • / • • — ada berapa?", choices: ["4", "5", "6"], correctChoice: "5", ageMin: 4 }),

  choice({ id: "math-find-group-3", title: "Cari kelompok tepat 3", description: "Pilih kelompok yang berisi tepat tiga benda.", emoji: "🎯", prompt: "Pilih kelompok yang berisi tepat 3 titik.", choices: ["●●", "●●●", "●●●●"], correctChoice: "●●●", ageMin: 4 }),
  choice({ id: "math-find-group-5", title: "Cari kelompok tepat 5", description: "Pilih kelompok yang berisi tepat lima bentuk.", emoji: "🎯", prompt: "Pilih kelompok yang berisi tepat 5 segitiga.", choices: ["▲▲▲▲", "▲▲▲▲▲", "▲▲▲▲▲▲"], correctChoice: "▲▲▲▲▲", ageMin: 4 })
];

export const MATH_WAVE_A_ACTIVITY_IDS = MATH_WAVE_A_ACTIVITIES.map((activity) => activity.id);
