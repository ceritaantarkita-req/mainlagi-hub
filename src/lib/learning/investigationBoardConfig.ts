import type { LearningActivity } from "./system";

export type InvestigationMode = "observe" | "control" | "predict" | "conclude";

export type InvestigationBoardConfig = {
  mode: InvestigationMode;
  modeLabel: string;
  scenarioIcon: string;
  scenarioTitle: string;
  scenarioLines: string[];
  focusLabel: string;
  focusHint: string;
  choiceIcons: Record<string, string>;
  successText: string;
};

const CONFIGS: Record<string, InvestigationBoardConfig> = {
  "science-investigate-plant-light": {
    mode: "observe",
    modeLabel: "Amati",
    scenarioIcon: "🌱",
    scenarioTitle: "Bandingkan dua tanaman",
    scenarioLines: ["Tanaman A: air sama + mendapat cahaya", "Tanaman B: air sama + tanpa cahaya"],
    focusLabel: "Yang perlu dibandingkan",
    focusHint: "Pilih hasil yang benar-benar menunjukkan pengaruh cahaya.",
    choiceIcons: { "Pertumbuhan tanaman": "📏", "Warna pot": "🪴", "Nama pemilik": "🏷️" },
    successText: "Pertumbuhan tanaman adalah hasil yang relevan untuk dibandingkan setelah perlakuan cahaya berbeda."
  },
  "science-investigate-fair-water": {
    mode: "control",
    modeLabel: "Jaga tetap",
    scenarioIcon: "💧",
    scenarioTitle: "Uji pengaruh jumlah air",
    scenarioLines: ["Yang diuji: jumlah air", "Perbandingan harus tetap adil"],
    focusLabel: "Yang harus dibuat sama",
    focusHint: "Jaga hal lain tetap sama agar pengaruh jumlah air bisa dibandingkan.",
    choiceIcons: { "Jenis dan ukuran tanaman": "🌿", "Jumlah air": "💧", "Letak label nama": "🏷️" },
    successText: "Jenis dan ukuran tanaman perlu dibuat sama agar perbandingan jumlah air tetap adil."
  },
  "science-predict-ice-warm-place": {
    mode: "predict",
    modeLabel: "Prediksi",
    scenarioIcon: "🧊",
    scenarioTitle: "Es di tempat hangat",
    scenarioLines: ["Benda awal: es batu", "Kondisi: diletakkan di tempat hangat"],
    focusLabel: "Prediksi paling masuk akal",
    focusHint: "Gunakan pengalaman perubahan wujud yang sudah pernah diamati.",
    choiceIcons: { "Es akan mencair": "💧", "Es akan menjadi lebih keras": "🧊", "Es akan tumbuh daun": "🌱" },
    successText: "Di tempat hangat, es paling masuk akal diprediksi mencair menjadi air."
  },
  "science-evidence-shadow-times": {
    mode: "conclude",
    modeLabel: "Simpulkan",
    scenarioIcon: "☀️",
    scenarioTitle: "Bandingkan bukti bayangan",
    scenarioLines: ["Pagi: bayangan tongkat panjang", "Siang: bayangan tongkat lebih pendek"],
    focusLabel: "Kesimpulan dari bukti",
    focusHint: "Pilih pernyataan yang benar-benar didukung dua pengamatan.",
    choiceIcons: { "Bayangan dapat berubah sepanjang hari": "🕒", "Tongkat berubah menjadi lebih pendek": "📏", "Tanah selalu berpindah tempat": "🌍" },
    successText: "Dua pengamatan menunjukkan bahwa panjang bayangan dapat berubah sepanjang hari."
  }
};

export function investigationBoardConfig(activity: LearningActivity | undefined): InvestigationBoardConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (config.scenarioLines.length < 2 || !config.focusLabel || !config.focusHint) return null;
  if (new Set(Object.keys(config.choiceIcons)).size !== choices.length || choices.some((choice) => !config.choiceIcons[choice])) return null;
  return config;
}
