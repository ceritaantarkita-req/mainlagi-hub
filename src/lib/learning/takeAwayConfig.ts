import type { LearningActivity } from "./system";

export type TakeAwayConfig = {
  startCount: number;
  removeCount: number;
  token: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, TakeAwayConfig> = {
  "math-sub-3-1": { startCount: 3, removeCount: 1, token: "●", cue: "Mulai dengan 3 benda. Tandai 1 yang diambil, lalu hitung yang masih aktif.", successText: "3 − 1 = 2." },
  "math-sub-4-2": { startCount: 4, removeCount: 2, token: "●", cue: "Mulai dengan 4 titik. Dua diambil, lalu hitung yang masih aktif.", successText: "4 − 2 = 2." },
  "math-sub-5-1": { startCount: 5, removeCount: 1, token: "🌼", cue: "Mulai dengan 5 bunga. Satu diberikan, lalu hitung yang masih ada.", successText: "5 − 1 = 4." },
  "math-sub-6-2": { startCount: 6, removeCount: 2, token: "●", cue: "Mulai dengan 6 benda. Dua diambil, lalu hitung sisanya.", successText: "6 − 2 = 4." },
  "math-sub-7-3": { startCount: 7, removeCount: 3, token: "●", cue: "Mulai dengan 7 kelereng. Tiga disimpan, lalu hitung yang masih terlihat.", successText: "7 − 3 = 4." }
};

export function takeAwayConfig(activity: LearningActivity | undefined): TakeAwayConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^\d+$/.test(choice)) || !/^\d+$/.test(correct)) return null;
  if (config.startCount < 2 || config.startCount > 10) return null;
  if (config.removeCount < 1 || config.removeCount >= config.startCount) return null;
  if (String(config.startCount - config.removeCount) !== correct) return null;
  if (!config.token || !config.cue || !config.successText) return null;
  return config;
}
