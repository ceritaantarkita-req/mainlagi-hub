import type { GameSlug } from "@/lib/data/games";

export type LearningSubjectId = "bahasa" | "english" | "math" | "iqro" | "letters" | "logic" | "science" | "color";
export type CharacterId = "naya" | "gian" | "zia" | "paca" | "gavi";
export type LearningRuntime =
  | "tap_choice"
  | "matching"
  | "trace"
  | "coloring"
  | "listen_and_choose"
  | "story"
  | "motion_game";

export type LearningInputMode = "touch" | "audio" | "motion" | "camera_capture";

export interface LearningSubject {
  id: LearningSubjectId;
  title: string;
  shortTitle: string;
  emoji: string;
  description: string;
  accent: string;
  soft: string;
}

export interface MatchItem {
  label: string;
  pair: string;
}

export interface LearningActivity {
  id: string;
  subjectId: LearningSubjectId;
  stageId: string;
  title: string;
  description: string;
  emoji: string;
  runtime: LearningRuntime;
  ageMin: number;
  ageMax: number;
  preferredMobile: LearningInputMode;
  inputModes: LearningInputMode[];
  motionOptional: boolean;
  stars: number;
  prompt?: string;
  choices?: string[];
  correctChoice?: string;
  matchItems?: MatchItem[];
  traceGlyph?: string;
  coloringCharacter?: "gavi" | "paca";
  storyLines?: string[];
  gameSlug?: GameSlug;
}

export interface LearningStage {
  id: string;
  subjectId: LearningSubjectId;
  title: string;
  subtitle: string;
  emoji: string;
  activityIds: string[];
}

export interface LearningChildProfile {
  id: string;
  name: string;
  age: number;
  guide: CharacterId;
  language: "id" | "en";
}

export interface LearningProgress {
  completedActivityIds: string[];
  stars: number;
  lastActivityId: string | null;
}

export interface LearningPreferences {
  allowMotionRecommendations: boolean;
  allowAiFeatures: boolean;
  reducedMotion: boolean;
  language: "id" | "en";
}

export const CHARACTERS: Record<CharacterId, { name: string; role: string; emoji: string }> = {
  naya: { name: "Kak Naya", role: "Kakak berhijab yang hangat dan membantu", emoji: "🧕" },
  gian: { name: "Gian", role: "Teman belajar yang aktif dan penasaran", emoji: "👦" },
  zia: { name: "Zia", role: "Adik kecil yang ceria dan suka mencoba", emoji: "👧" },
  paca: { name: "Paca", role: "Robot simpel untuk petunjuk dan penemuan", emoji: "🤖" },
  gavi: { name: "Gavi", role: "Kucing oren untuk humor dan hadiah", emoji: "🐱" }
};

export const SUBJECTS: LearningSubject[] = [
  {
    id: "bahasa",
    title: "Bahasa Indonesia",
    shortTitle: "Bahasa",
    emoji: "📖",
    description: "Kenal bunyi, huruf, kata, dan cerita sederhana.",
    accent: "#14b8a6",
    soft: "#dff8f3"
  },
  {
    id: "english",
    title: "English",
    shortTitle: "English",
    emoji: "💬",
    description: "Dengar dan kenal kata-kata English lewat aktivitas singkat.",
    accent: "#6c7df7",
    soft: "#e9ecff"
  },
  {
    id: "math",
    title: "Matematika",
    shortTitle: "Math",
    emoji: "🔢",
    description: "Angka, hitung, pola, dan logika dengan cara yang playful.",
    accent: "#f59e0b",
    soft: "#fff3cf"
  },
  {
    id: "iqro",
    title: "Iqro",
    shortTitle: "Iqro",
    emoji: "🌙",
    description: "Kenal dan latih huruf Hijaiyah dengan sentuh, audio, dan gerak opsional.",
    accent: "#22a884",
    soft: "#dff7ef"
  },
  {
    id: "letters",
    title: "Huruf & Menulis",
    shortTitle: "Menulis",
    emoji: "✍️",
    description: "Kenal bentuk huruf dan latih gerakan awal menulis dengan jari.",
    accent: "#7c6cf2",
    soft: "#eeebff"
  },
  {
    id: "logic",
    title: "Logika",
    shortTitle: "Logika",
    emoji: "🧠",
    description: "Cocokkan, bandingkan, dan temukan pola atau benda yang berbeda.",
    accent: "#ef7f45",
    soft: "#ffeadf"
  },
  {
    id: "science",
    title: "Sains",
    shortTitle: "Sains",
    emoji: "🔬",
    description: "Kenali makhluk hidup, alam, dan dunia sekitar lewat pengamatan sederhana.",
    accent: "#2f9f67",
    soft: "#e2f6e9"
  },
  {
    id: "color",
    title: "Mewarnai",
    shortTitle: "Warna",
    emoji: "🎨",
    description: "Kegiatan kreatif ringan untuk bereksplorasi dengan warna.",
    accent: "#ec6aa5",
    soft: "#ffe7f1"
  }
];

export const ACTIVITIES: LearningActivity[] = [
  {
    id: "bahasa-cari-a",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    title: "Cari huruf A",
    description: "Pilih huruf A dari tiga pilihan besar.",
    emoji: "🅰️",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana huruf A?",
    choices: ["A", "B", "D"],
    correctChoice: "A"
  },
  {
    id: "bahasa-dengar-a",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    title: "Dengar & pilih",
    description: "Dengarkan petunjuk lalu pilih hurufnya.",
    emoji: "🔊",
    runtime: "listen_and_choose",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "audio",
    inputModes: ["audio", "touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Pilih huruf A",
    choices: ["U", "A", "I"],
    correctChoice: "A"
  },
  {
    id: "bahasa-cari-a-lagi",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    title: "Temukan A lagi",
    description: "Latihan variasi untuk mengenali huruf A tanpa mengulang pilihan yang sama.",
    emoji: "🔎",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Di mana huruf A?",
    choices: ["R", "A", "N"],
    correctChoice: "A"
  },
  {
    id: "bahasa-pasang-awal",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    title: "Pasangkan huruf",
    description: "Pasangkan huruf dengan kata contoh.",
    emoji: "🧩",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Cari pasangan yang cocok",
    matchItems: [
      { label: "A", pair: "a" },
      { label: "Ayam", pair: "a" },
      { label: "B", pair: "b" },
      { label: "Bola", pair: "b" }
    ]
  },
  {
    id: "bahasa-pasang-awal-lagi",
    subjectId: "bahasa",
    stageId: "bahasa-huruf",
    title: "Pasangan huruf baru",
    description: "Latih huruf awal memakai pasangan kata yang berbeda.",
    emoji: "🧠",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Pasangkan huruf dengan kata awalnya",
    matchItems: [
      { label: "M", pair: "m" },
      { label: "Mata", pair: "m" },
      { label: "S", pair: "s" },
      { label: "Sapi", pair: "s" }
    ]
  },
  {
    id: "bahasa-cerita-teman",
    subjectId: "bahasa",
    stageId: "bahasa-cerita",
    title: "Cerita teman baru",
    description: "Cerita pendek untuk dibaca bersama orang tua.",
    emoji: "📚",
    runtime: "story",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch", "audio"],
    motionOptional: false,
    stars: 2,
    storyLines: [
      "Paca melihat Gavi duduk sendiri di taman.",
      "Paca menyapa dengan ramah: Hai, mau bermain bersama?",
      "Gavi tersenyum. Mereka pun bermain bersama."
    ]
  },
  {
    id: "english-find-blue",
    subjectId: "english",
    stageId: "english-first-words",
    title: "Find blue",
    description: "Pilih warna sesuai kata yang didengar.",
    emoji: "🔵",
    runtime: "tap_choice",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch", "audio"],
    motionOptional: false,
    stars: 2,
    prompt: "Which one is BLUE?",
    choices: ["RED", "BLUE", "GREEN"],
    correctChoice: "BLUE"
  },
  {
    id: "english-find-blue-audio",
    subjectId: "english",
    stageId: "english-first-words",
    title: "Listen & find blue",
    description: "Dengarkan kata blue lalu pilih lingkaran warna yang sesuai.",
    emoji: "🎧",
    runtime: "listen_and_choose",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "audio",
    inputModes: ["audio", "touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Choose blue",
    choices: ["🔴", "🔵", "🟡"],
    correctChoice: "🔵"
  },
  {
    id: "english-listen-cat",
    subjectId: "english",
    stageId: "english-first-words",
    title: "Listen: cat",
    description: "Dengarkan kata lalu pilih gambar yang cocok.",
    emoji: "🐱",
    runtime: "listen_and_choose",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "audio",
    inputModes: ["audio", "touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Choose the cat",
    choices: ["🐶", "🐱", "🐰"],
    correctChoice: "🐱"
  },
  {
    id: "english-listen-cat-2",
    subjectId: "english",
    stageId: "english-first-words",
    title: "Listen again: cat",
    description: "Variasi listening dengan pilihan gambar berbeda.",
    emoji: "👂",
    runtime: "listen_and_choose",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "audio",
    inputModes: ["audio", "touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Find the cat",
    choices: ["🐻", "🐱", "🐸"],
    correctChoice: "🐱"
  },
  {
    id: "english-match-hello",
    subjectId: "english",
    stageId: "english-first-words",
    title: "Match the words",
    description: "Pasangkan kata sederhana dengan gambar.",
    emoji: "✨",
    runtime: "matching",
    ageMin: 5,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Find the pairs",
    matchItems: [
      { label: "CAT", pair: "cat" },
      { label: "🐱", pair: "cat" },
      { label: "SUN", pair: "sun" },
      { label: "☀️", pair: "sun" }
    ]
  },
  {
    id: "english-match-words-2",
    subjectId: "english",
    stageId: "english-first-words",
    title: "More word pairs",
    description: "Pasangkan dua kata English baru dengan gambarnya.",
    emoji: "🧩",
    runtime: "matching",
    ageMin: 5,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Match each word to its picture",
    matchItems: [
      { label: "DOG", pair: "dog" },
      { label: "🐶", pair: "dog" },
      { label: "MOON", pair: "moon" },
      { label: "🌙", pair: "moon" }
    ]
  },
  {
    id: "math-count-3",
    subjectId: "math",
    stageId: "math-angka",
    title: "Hitung sampai 3",
    description: "Hitung benda lalu pilih jawabannya.",
    emoji: "🍎",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "🍎 🍎 🍎 Ada berapa?",
    choices: ["2", "3", "4"],
    correctChoice: "3"
  },
  {
    id: "math-count-2",
    subjectId: "math",
    stageId: "math-angka",
    title: "Hitung dua benda",
    description: "Variasi hitung jumlah kecil dengan objek berbeda.",
    emoji: "🍌",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "🍌 🍌 Ada berapa?",
    choices: ["1", "2", "3"],
    correctChoice: "2"
  },
  {
    id: "math-trace-5-touch",
    subjectId: "math",
    stageId: "math-angka",
    title: "Telusuri angka 5",
    description: "Gunakan jari di layar. Kamera tidak diperlukan.",
    emoji: "✍️",
    runtime: "trace",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    traceGlyph: "5"
  },
  {
    id: "math-number-trace-motion",
    subjectId: "math",
    stageId: "math-angka",
    title: "Number Trace — mode gerak",
    description: "Versi kamera yang sudah ada. Pilih kalau perangkat dan ruang nyaman.",
    emoji: "📷",
    runtime: "motion_game",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "motion",
    inputModes: ["motion"],
    motionOptional: true,
    stars: 3,
    gameSlug: "number-trace"
  },
  {
    id: "math-pattern-touch",
    subjectId: "math",
    stageId: "math-pola",
    title: "Pasangkan pola",
    description: "Cari pasangan pola dengan sentuhan.",
    emoji: "🔷",
    runtime: "matching",
    ageMin: 5,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Pasangkan bentuk yang sama",
    matchItems: [
      { label: "▲", pair: "triangle" },
      { label: "▲", pair: "triangle" },
      { label: "●", pair: "circle" },
      { label: "●", pair: "circle" }
    ]
  },
  {
    id: "math-pattern-touch-2",
    subjectId: "math",
    stageId: "math-pola",
    title: "Pola bentuk baru",
    description: "Latihan variasi untuk memasangkan bentuk yang sama.",
    emoji: "⭐",
    runtime: "matching",
    ageMin: 5,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Cari pasangan bentuk yang sama",
    matchItems: [
      { label: "■", pair: "square" },
      { label: "■", pair: "square" },
      { label: "★", pair: "star" },
      { label: "★", pair: "star" }
    ]
  },
  {
    id: "math-pattern-motion",
    subjectId: "math",
    stageId: "math-pola",
    title: "Pattern Race — mode gerak",
    description: "Challenge kamera opsional dari game Mainlagi yang sudah ada.",
    emoji: "🏁",
    runtime: "motion_game",
    ageMin: 5,
    ageMax: 7,
    preferredMobile: "motion",
    inputModes: ["motion"],
    motionOptional: true,
    stars: 3,
    gameSlug: "pattern-race"
  },
  {
    id: "iqro-cari-alif",
    subjectId: "iqro",
    stageId: "iqro-huruf",
    title: "Cari Alif",
    description: "Pilih huruf Alif dengan sentuhan.",
    emoji: "ا",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana huruf Alif?",
    choices: ["ب", "ا", "ت"],
    correctChoice: "ا"
  },
  {
    id: "iqro-dengar-alif",
    subjectId: "iqro",
    stageId: "iqro-huruf",
    title: "Dengar Alif",
    description: "Dengarkan petunjuk dan pilih hurufnya.",
    emoji: "🔊",
    runtime: "listen_and_choose",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "audio",
    inputModes: ["audio", "touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Pilih huruf Alif",
    choices: ["ث", "ا", "ن"],
    correctChoice: "ا"
  },
  {
    id: "iqro-pasang-alif",
    subjectId: "iqro",
    stageId: "iqro-huruf",
    title: "Pasangkan Alif",
    description: "Pasangkan nama huruf dengan bentuk Hijaiyah yang sesuai.",
    emoji: "🧩",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Pasangkan nama dan bentuk huruf",
    matchItems: [
      { label: "Alif", pair: "alif" },
      { label: "ا", pair: "alif" },
      { label: "Ba", pair: "ba" },
      { label: "ب", pair: "ba" }
    ]
  },
  {
    id: "iqro-motion-existing",
    subjectId: "iqro",
    stageId: "iqro-huruf",
    title: "Iqro Motion — mode gerak",
    description: "Game Hijaiyah kamera yang tetap dipertahankan sebagai opsi.",
    emoji: "📷",
    runtime: "motion_game",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "motion",
    inputModes: ["motion"],
    motionOptional: true,
    stars: 3,
    gameSlug: "iqro-motion"
  },
  {
    id: "letters-find-a",
    subjectId: "letters",
    stageId: "letters-foundations",
    title: "Temukan huruf A",
    description: "Kenali bentuk huruf A sebelum mulai menulisnya.",
    emoji: "A",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana huruf A?",
    choices: ["O", "A", "M"],
    correctChoice: "A"
  },
  {
    id: "letters-trace-a",
    subjectId: "letters",
    stageId: "letters-foundations",
    title: "Telusuri huruf A",
    description: "Ikuti bentuk huruf A dengan jari di layar.",
    emoji: "✍️",
    runtime: "trace",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    traceGlyph: "A"
  },
  {
    id: "letters-match-case",
    subjectId: "letters",
    stageId: "letters-foundations",
    title: "Pasangkan huruf besar dan kecil",
    description: "Pasangkan huruf besar dengan bentuk huruf kecilnya.",
    emoji: "🔤",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Pasangkan huruf besar dan huruf kecil",
    matchItems: [
      { label: "A", pair: "a" },
      { label: "a", pair: "a" },
      { label: "B", pair: "b" },
      { label: "b", pair: "b" }
    ]
  },
  {
    id: "logic-match-pairs",
    subjectId: "logic",
    stageId: "logic-foundations",
    title: "Cari pasangan yang sama",
    description: "Cocokkan dua gambar yang sama untuk melatih perhatian visual.",
    emoji: "🧩",
    runtime: "matching",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Pasangkan gambar yang sama",
    matchItems: [
      { label: "🍎", pair: "apple" },
      { label: "🍎", pair: "apple" },
      { label: "🚗", pair: "car" },
      { label: "🚗", pair: "car" }
    ]
  },
  {
    id: "logic-odd-one-out",
    subjectId: "logic",
    stageId: "logic-foundations",
    title: "Mana yang berbeda?",
    description: "Temukan satu benda yang tidak sama dengan yang lain.",
    emoji: "🔎",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana yang berbeda?",
    choices: ["🍎", "🚗", "🍎"],
    correctChoice: "🚗"
  },
  {
    id: "logic-more-less",
    subjectId: "logic",
    stageId: "logic-foundations",
    title: "Mana yang lebih banyak?",
    description: "Bandingkan tiga kelompok kecil secara visual.",
    emoji: "⚖️",
    runtime: "tap_choice",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Kelompok mana yang lebih banyak?",
    choices: ["●●", "●●●", "●"],
    correctChoice: "●●●"
  },
  {
    id: "science-living-cat",
    subjectId: "science",
    stageId: "science-foundations",
    title: "Mana yang hidup?",
    description: "Kenali contoh sederhana makhluk hidup di sekitar anak.",
    emoji: "🐱",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana yang merupakan makhluk hidup?",
    choices: ["🪨", "🐱", "🚗"],
    correctChoice: "🐱"
  },
  {
    id: "science-match-habitat",
    subjectId: "science",
    stageId: "science-foundations",
    title: "Hewan dan tempatnya",
    description: "Pasangkan hewan dengan tempat yang cocok secara sederhana.",
    emoji: "🌿",
    runtime: "matching",
    ageMin: 4,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 3,
    prompt: "Pasangkan hewan dengan tempat yang cocok",
    matchItems: [
      { label: "🐟", pair: "water" },
      { label: "💧", pair: "water" },
      { label: "🐦", pair: "tree" },
      { label: "🌳", pair: "tree" }
    ]
  },
  {
    id: "science-find-plant",
    subjectId: "science",
    stageId: "science-foundations",
    title: "Temukan tumbuhan",
    description: "Pilih gambar tumbuhan dari benda-benda yang berbeda.",
    emoji: "🌱",
    runtime: "tap_choice",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    prompt: "Mana yang merupakan tumbuhan?",
    choices: ["🧸", "🌱", "🚲"],
    correctChoice: "🌱"
  },
  {
    id: "color-gavi",
    subjectId: "color",
    stageId: "color-characters",
    title: "Warnai Gavi",
    description: "Pilih warna lalu sentuh Gavi.",
    emoji: "🐱",
    runtime: "coloring",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    coloringCharacter: "gavi"
  },
  {
    id: "color-paca",
    subjectId: "color",
    stageId: "color-characters",
    title: "Warnai Paca",
    description: "Eksperimen warna pada robot Paca.",
    emoji: "🤖",
    runtime: "coloring",
    ageMin: 3,
    ageMax: 7,
    preferredMobile: "touch",
    inputModes: ["touch"],
    motionOptional: false,
    stars: 2,
    coloringCharacter: "paca"
  }
];

export const STAGES: LearningStage[] = [
  {
    id: "bahasa-huruf",
    subjectId: "bahasa",
    title: "Kenal Huruf",
    subtitle: "Kenali huruf lewat sentuh, audio, dan pasangan kata.",
    emoji: "🔤",
    activityIds: ["bahasa-cari-a", "bahasa-dengar-a", "bahasa-cari-a-lagi", "bahasa-pasang-awal", "bahasa-pasang-awal-lagi"]
  },
  {
    id: "bahasa-cerita",
    subjectId: "bahasa",
    title: "Cerita Pendek",
    subtitle: "Cerita pendek untuk dibaca atau didengarkan bersama.",
    emoji: "📚",
    activityIds: ["bahasa-cerita-teman"]
  },
  {
    id: "english-first-words",
    subjectId: "english",
    title: "First Words",
    subtitle: "Kenal kata lewat visual, audio, dan word-picture matching.",
    emoji: "💬",
    activityIds: ["english-find-blue", "english-find-blue-audio", "english-listen-cat", "english-listen-cat-2", "english-match-hello", "english-match-words-2"]
  },
  {
    id: "math-angka",
    subjectId: "math",
    title: "Kenal Angka",
    subtitle: "Hitung dan trace sebagai default, mode gerak tetap tersedia.",
    emoji: "🔢",
    activityIds: ["math-count-3", "math-count-2", "math-trace-5-touch", "math-number-trace-motion"]
  },
  {
    id: "math-pola",
    subjectId: "math",
    title: "Pola & Logika",
    subtitle: "Variasi pola touch-first dengan challenge gerak opsional.",
    emoji: "🧩",
    activityIds: ["math-pattern-touch", "math-pattern-touch-2", "math-pattern-motion"]
  },
  {
    id: "iqro-huruf",
    subjectId: "iqro",
    title: "Kenal Hijaiyah",
    subtitle: "Sentuh, audio, dan matching untuk belajar inti; motion sebagai opsi.",
    emoji: "🌙",
    activityIds: ["iqro-cari-alif", "iqro-dengar-alif", "iqro-pasang-alif", "iqro-motion-existing"]
  },
  {
    id: "letters-foundations",
    subjectId: "letters",
    title: "Huruf & Gerak Menulis",
    subtitle: "Kenali bentuk huruf, telusuri dengan jari, lalu cocokkan huruf besar dan kecil.",
    emoji: "✍️",
    activityIds: ["letters-find-a", "letters-trace-a", "letters-match-case"]
  },
  {
    id: "logic-foundations",
    subjectId: "logic",
    title: "Cocok, Beda & Bandingkan",
    subtitle: "Latihan visual sederhana untuk mencocokkan, menemukan perbedaan, dan membandingkan.",
    emoji: "🧠",
    activityIds: ["logic-match-pairs", "logic-odd-one-out", "logic-more-less"]
  },
  {
    id: "science-foundations",
    subjectId: "science",
    title: "Kenali Dunia Sekitar",
    subtitle: "Mulai dari makhluk hidup, tumbuhan, hewan, dan tempat hidupnya.",
    emoji: "🔬",
    activityIds: ["science-living-cat", "science-match-habitat", "science-find-plant"]
  },
  {
    id: "color-characters",
    subjectId: "color",
    title: "Karakter Mainlagi",
    subtitle: "Aktivitas kreatif sederhana untuk layar sentuh.",
    emoji: "🎨",
    activityIds: ["color-gavi", "color-paca"]
  }
];

const SUBJECT_MAP = new Map(SUBJECTS.map((item) => [item.id, item]));
const STAGE_MAP = new Map(STAGES.map((item) => [item.id, item]));
const ACTIVITY_MAP = new Map(ACTIVITIES.map((item) => [item.id, item]));

export function getSubject(id: string): LearningSubject | undefined {
  return SUBJECT_MAP.get(id as LearningSubjectId);
}

export function getStage(id: string): LearningStage | undefined {
  return STAGE_MAP.get(id);
}

export function getActivity(id: string): LearningActivity | undefined {
  return ACTIVITY_MAP.get(id);
}

export function getStagesForSubject(subjectId: LearningSubjectId): LearningStage[] {
  return STAGES.filter((stage) => stage.subjectId === subjectId);
}

export function getActivitiesForStage(stageId: string): LearningActivity[] {
  const stage = getStage(stageId);
  if (!stage) return [];
  return stage.activityIds.map((id) => getActivity(id)).filter((item): item is LearningActivity => Boolean(item));
}

const PROFILE_KEY = "mainlagi-learning-profiles-v1";
const PROGRESS_KEY = "mainlagi-learning-progress-v1";
const PREF_KEY = "mainlagi-learning-preferences-v1";

export const DEMO_PROFILE: LearningChildProfile = {
  id: "demo-gian",
  name: "Gian",
  age: 5,
  guide: "paca",
  language: "id"
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function readProfiles(): LearningChildProfile[] {
  if (typeof window === "undefined") return [];
  return safeParse<LearningChildProfile[]>(window.localStorage.getItem(PROFILE_KEY), []);
}

export function readProfile(id: string): LearningChildProfile | undefined {
  if (id === DEMO_PROFILE.id) return DEMO_PROFILE;
  return readProfiles().find((profile) => profile.id === id);
}

export function saveProfile(profile: LearningChildProfile): void {
  if (typeof window === "undefined") return;
  const current = readProfiles();
  const next = [...current.filter((item) => item.id !== profile.id), profile];
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
}

export function readProgress(childId: string): LearningProgress {
  const fallback: LearningProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };
  if (typeof window === "undefined") return fallback;
  const all = safeParse<Record<string, LearningProgress>>(window.localStorage.getItem(PROGRESS_KEY), {});
  return all[childId] ?? fallback;
}

export function completeActivity(childId: string, activityId: string): LearningProgress {
  const current = readProgress(childId);
  const alreadyDone = current.completedActivityIds.includes(activityId);
  const activity = getActivity(activityId);
  const next: LearningProgress = {
    completedActivityIds: alreadyDone
      ? current.completedActivityIds
      : [...current.completedActivityIds, activityId],
    stars: current.stars + (!alreadyDone && activity ? activity.stars : 0),
    lastActivityId: activityId
  };
  if (typeof window !== "undefined") {
    const all = safeParse<Record<string, LearningProgress>>(window.localStorage.getItem(PROGRESS_KEY), {});
    all[childId] = next;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("mainlagi-learning-progress", { detail: { childId } }));
  }
  return next;
}

export function getRecommendedActivities(age: number): LearningActivity[] {
  const inAge = ACTIVITIES.filter((activity) => age >= activity.ageMin && age <= activity.ageMax);
  return [
    ...inAge.filter((activity) => activity.runtime !== "motion_game"),
    ...inAge.filter((activity) => activity.runtime === "motion_game")
  ];
}

export function getNextActivity(age: number, progress: LearningProgress): LearningActivity | undefined {
  const recommended = getRecommendedActivities(age);
  return recommended.find((activity) => !progress.completedActivityIds.includes(activity.id)) ?? recommended[0];
}

export function readPreferences(): LearningPreferences {
  const fallback: LearningPreferences = {
    allowMotionRecommendations: false,
    allowAiFeatures: false,
    reducedMotion: false,
    language: "id"
  };
  if (typeof window === "undefined") return fallback;
  return safeParse<LearningPreferences>(window.localStorage.getItem(PREF_KEY), fallback);
}

export function savePreferences(value: LearningPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREF_KEY, JSON.stringify(value));
}
