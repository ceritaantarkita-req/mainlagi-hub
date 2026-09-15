import type { LearningActivity } from "./system";

export type RulePipelineConfig = {
  startIcon: string;
  startLabel: string;
  ruleOne: string;
  intermediateIcon: string;
  intermediateLabel: string;
  ruleTwo: string;
  choiceVisuals: Record<string, { icon: string; label: string }>;
  successText: string;
};

const CONFIGS: Record<string, RulePipelineConfig> = {
  "logic-compose-red-circle-to-star": {
    startIcon: "🔴",
    startLabel: "Merah",
    ruleOne: "Merah berubah menjadi lingkaran.",
    intermediateIcon: "●",
    intermediateLabel: "Lingkaran",
    ruleTwo: "Lingkaran berubah menjadi bintang.",
    choiceVisuals: {
      "bintang ★": { icon: "★", label: "Bintang" },
      "lingkaran ●": { icon: "●", label: "Lingkaran" },
      "kotak ■": { icon: "■", label: "Kotak" }
    },
    successText: "Dua aturan dijalankan berurutan: merah → lingkaran → bintang."
  },
  "logic-compose-small-left-then-up": {
    startIcon: "•",
    startLabel: "Benda kecil",
    ruleOne: "Benda kecil bergerak ke kiri.",
    intermediateIcon: "←",
    intermediateLabel: "Kiri",
    ruleTwo: "Panah kiri diputar menjadi atas.",
    choiceVisuals: {
      "atas ↑": { icon: "↑", label: "Atas" },
      "kiri ←": { icon: "←", label: "Kiri" },
      "kanan →": { icon: "→", label: "Kanan" }
    },
    successText: "Langkah pertama menghasilkan kiri, lalu aturan kedua mengubahnya menjadi atas."
  },
  "logic-compose-two-to-blue": {
    startIcon: "●●",
    startLabel: "Dua titik",
    ruleOne: "Dua titik berubah menjadi kotak.",
    intermediateIcon: "■",
    intermediateLabel: "Kotak",
    ruleTwo: "Kotak berubah menjadi biru.",
    choiceVisuals: {
      "biru": { icon: "🔵", label: "Biru" },
      "kotak": { icon: "■", label: "Kotak" },
      "dua titik": { icon: "●●", label: "Dua titik" }
    },
    successText: "Dua titik → kotak → biru. Kedua aturan dipakai sampai selesai."
  },
  "logic-compose-triangle-turn-right": {
    startIcon: "▲",
    startLabel: "Segitiga",
    ruleOne: "Segitiga berarti panah atas.",
    intermediateIcon: "↑",
    intermediateLabel: "Atas",
    ruleTwo: "Panah atas diputar ke kanan.",
    choiceVisuals: {
      "kanan →": { icon: "→", label: "Kanan" },
      "atas ↑": { icon: "↑", label: "Atas" },
      "bawah ↓": { icon: "↓", label: "Bawah" }
    },
    successText: "Segitiga menjadi atas, lalu panah diputar ke kanan."
  },
  "logic-compose-swap-then-grow": {
    startIcon: "● ▲",
    startLabel: "● ▲",
    ruleOne: "Tukar posisi kedua simbol.",
    intermediateIcon: "▲ ●",
    intermediateLabel: "▲ ●",
    ruleTwo: "Tambahkan satu ● di akhir.",
    choiceVisuals: {
      "▲ ● ●": { icon: "▲ ● ●", label: "▲ ● ●" },
      "● ▲ ●": { icon: "● ▲ ●", label: "● ▲ ●" },
      "▲ ▲ ●": { icon: "▲ ▲ ●", label: "▲ ▲ ●" }
    },
    successText: "Urutan ditukar dulu, lalu satu lingkaran ditambahkan di akhir."
  }
};

export function rulePipelineConfig(activity: LearningActivity | undefined): RulePipelineConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
