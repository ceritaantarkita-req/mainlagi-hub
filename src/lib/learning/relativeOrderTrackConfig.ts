import type { LearningActivity } from "./system";

export type RelativeOrderTrackConfig = {
  items: string[];
  targetIndex: number;
  relationLabel: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, RelativeOrderTrackConfig> = {
  "logic-order-first-after-start": {
    items: ["A", "B", "C", "D"],
    targetIndex: 2,
    relationLabel: "Tepat setelah B",
    cue: "Mulai dari B, lalu maju satu tempat.",
    successText: "C berada tepat setelah B."
  },
  "logic-order-before-d": {
    items: ["A", "B", "C", "D"],
    targetIndex: 2,
    relationLabel: "Tepat sebelum D",
    cue: "Cari satu tempat sebelum D.",
    successText: "C berada tepat sebelum D."
  },
  "logic-order-between-blue-green": {
    items: ["merah", "biru", "kuning", "hijau"],
    targetIndex: 2,
    relationLabel: "Di antara biru dan hijau",
    cue: "Cari slot yang diapit biru dan hijau.",
    successText: "Kuning berada di antara biru dan hijau."
  },
  "logic-order-third-symbol": {
    items: ["★", "●", "▲", "■"],
    targetIndex: 2,
    relationLabel: "Posisi ketiga",
    cue: "Hitung posisi dari kiri mulai dari satu.",
    successText: "▲ berada di posisi ketiga."
  },
  "logic-order-two-steps-after": {
    items: ["1", "2", "3", "4", "5"],
    targetIndex: 3,
    relationLabel: "Dua langkah setelah 2",
    cue: "Dari 2, maju dua langkah di jalur.",
    successText: "Dua langkah setelah 2 adalah 4."
  }
};

export function relativeOrderTrackConfig(activity: LearningActivity | undefined): RelativeOrderTrackConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (config.items.length < 4 || config.targetIndex < 0 || config.targetIndex >= config.items.length) return null;
  if (config.items[config.targetIndex] !== activity.correctChoice) return null;
  if (config.items.filter((item) => item === activity.correctChoice).length !== 1) return null;
  if (!config.relationLabel || !config.cue || !config.successText) return null;

  return config;
}
