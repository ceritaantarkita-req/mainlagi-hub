export const GAME_SLUGS = [
  "math-choice",
  "math-motion-battle",
  "number-trace",
  "shape-quest",
  "pattern-race",
  "math-warung",
  "iqro-motion",
  "airboard-presenter",
  "dodge-motion",
  "run-to-target"
] as const;

export type GameSlug = (typeof GAME_SLUGS)[number];
export type VisionMode = "hand" | "pose" | "hybrid";
export type GameCategory = "Belajar dengan tangan" | "Aktivitas tubuh" | "Alat kelas";

export interface GameDefinition {
  slug: GameSlug;
  title: string;
  shortTitle: string;
  description: string;
  category: GameCategory;
  age: string;
  playerOptions: readonly (1 | 2)[];
  visionMode: VisionMode;
  accent: string;
  accentSoft: string;
  icon: "math" | "choice" | "trace" | "shape" | "pattern" | "shop" | "iqro" | "board" | "dodge" | "target";
  capabilities: readonly string[];
  status: "ready" | "beta";
}

export const GAMES: Record<GameSlug, GameDefinition> = {
  /**
   * Listed first on purpose. It is the only maths game that does not also
   * require the player to form a numeral in mid-air, which makes it the one
   * to hand a five-year-old first.
   */
  "math-choice": {
    slug: "math-choice",
    title: "Math Pilih Jawaban",
    shortTitle: "Pilih Jawaban",
    description: "Jawab soal matematika dengan memilih salah satu dari empat kotak. Tidak perlu menulis angka, jadi paling mudah untuk anak kecil.",
    category: "Belajar dengan tangan",
    age: "TK–SD 2",
    playerOptions: [1, 2],
    visionMode: "hybrid",
    accent: "#12B981",
    accentSoft: "#D6F7EC",
    icon: "choice",
    capabilities: ["Tanpa menulis", "Pilihan ganda", "1–2 pemain", "Salah tidak dihukum"],
    status: "beta"
  },
  "math-motion-battle": {
    slug: "math-motion-battle",
    title: "Math Motion Battle",
    shortTitle: "Math Battle",
    description: "Jawab soal matematika dengan menulis angka di udara. Bisa dimainkan sendiri atau berdua dalam satu kamera.",
    category: "Belajar dengan tangan",
    age: "TK–SD 2",
    playerOptions: [1, 2],
    visionMode: "hybrid",
    accent: "#25C77A",
    accentSoft: "#DCF9EC",
    icon: "math",
    capabilities: ["Angka multi-digit", "1–2 pemain", "Soal acak", "Retry tanpa penalti"],
    status: "beta"
  },
  "number-trace": {
    slug: "number-trace",
    title: "Number Trace Adventure",
    shortTitle: "Number Trace",
    description: "Ikuti jalur angka dengan telunjuk. Sistem menilai kedekatan lintasan, arah, dan kelengkapan bentuk.",
    category: "Belajar dengan tangan",
    age: "TK A–TK B",
    playerOptions: [1],
    visionMode: "hand",
    accent: "#3E8BFF",
    accentSoft: "#E2EEFF",
    icon: "trace",
    capabilities: ["Guided tracing", "Skor lintasan", "Tangan kanan/kiri", "Mouse fallback"],
    status: "beta"
  },
  "shape-quest": {
    slug: "shape-quest",
    title: "Shape Quest",
    shortTitle: "Shape Quest",
    description: "Gambar lingkaran, segitiga, persegi, dan pola lain dengan satu atau beberapa stroke.",
    category: "Belajar dengan tangan",
    age: "TK–SD 1",
    playerOptions: [1],
    visionMode: "hand",
    accent: "#FF9A3D",
    accentSoft: "#FFF0DF",
    icon: "shape",
    capabilities: ["Multi-stroke", "Shape scoring", "Closure check", "Adaptive target"],
    status: "beta"
  },
  "pattern-race": {
    slug: "pattern-race",
    title: "Pattern Race",
    shortTitle: "Pattern Race",
    description: "Temukan angka berikutnya dari pola dan tulis jawabannya sebelum waktu habis atau sebelum lawan.",
    category: "Belajar dengan tangan",
    age: "TK B–SD 2",
    playerOptions: [1, 2],
    visionMode: "hybrid",
    accent: "#8C5CFF",
    accentSoft: "#EEE7FF",
    icon: "pattern",
    capabilities: ["Pola prosedural", "1–2 pemain", "Expected answer", "Speed bonus"],
    status: "beta"
  },
  "math-warung": {
    slug: "math-warung",
    title: "Math Warung",
    shortTitle: "Math Warung",
    description: "Simulasi jual beli: pilih barang, hitung total, bayar, dan cari kembalian dengan konteks warung Indonesia.",
    category: "Belajar dengan tangan",
    age: "TK–SD 2",
    playerOptions: [1, 2],
    visionMode: "hybrid",
    accent: "#F3B41B",
    accentSoft: "#FFF5D5",
    icon: "shop",
    capabilities: ["Pilih barang", "Total & kembalian", "Mode keluarga", "Rupiah"],
    status: "beta"
  },
  "iqro-motion": {
    slug: "iqro-motion",
    title: "Iqro Motion",
    shortTitle: "Iqro Motion",
    description: "Latihan huruf Hijaiyah melalui tracing, tulisan multi-stroke, titik, dan audio pendamping.",
    category: "Belajar dengan tangan",
    age: "TK–SD",
    playerOptions: [1, 2],
    visionMode: "hybrid",
    accent: "#22A884",
    accentSoft: "#DFF7F0",
    icon: "iqro",
    capabilities: ["Hijaiyah", "Titik & bentuk", "Audio", "Mode anak-orang tua"],
    status: "beta"
  },
  "airboard-presenter": {
    slug: "airboard-presenter",
    title: "AirBoard Presenter",
    shortTitle: "AirBoard",
    description: "Papan tulis dan presentasi tanpa sentuh: pointer, pena, penghapus, slide, undo, dan ekspor anotasi.",
    category: "Alat kelas",
    age: "Guru & presenter",
    playerOptions: [1],
    visionMode: "hand",
    accent: "#5476FF",
    accentSoft: "#E5EAFF",
    icon: "board",
    capabilities: ["Whiteboard", "PDF/image", "Gesture tools", "Export stroke"],
    status: "beta"
  },
  "dodge-motion": {
    slug: "dodge-motion",
    title: "Beat Motion",
    shortTitle: "Beat Motion",
    description: "Melangkah ke kiri, tengah, atau kanan untuk mengenai panah yang turun. Makin lama makin cepat, ada combo dan papan skor.",
    category: "Aktivitas tubuh",
    age: "SD–Keluarga",
    playerOptions: [1],
    visionMode: "pose",
    accent: "#F35E67",
    accentSoft: "#FFE4E6",
    icon: "dodge",
    capabilities: ["Body skeleton", "3 lajur", "Combo & akurasi", "1/3/5 menit"],
    status: "beta"
  },
  "run-to-target": {
    slug: "run-to-target",
    title: "Run to Target",
    shortTitle: "Run to Target",
    description: "Bergerak menuju target kiri, kanan, depan, atau belakang dengan kalibrasi posisi tubuh.",
    category: "Aktivitas tubuh",
    age: "SD–Keluarga",
    playerOptions: [1],
    visionMode: "pose",
    accent: "#19A8B7",
    accentSoft: "#DDF7FA",
    icon: "target",
    capabilities: ["Body zones", "Near/far calibration", "Hold confirm", "Keyboard fallback"],
    status: "beta"
  }
};

export const GAME_LIST = GAME_SLUGS.map((slug) => GAMES[slug]);

export function isGameSlug(value: string): value is GameSlug {
  return GAME_SLUGS.includes(value as GameSlug);
}
