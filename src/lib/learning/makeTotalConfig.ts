import type { LearningActivity } from "./system";

export type MakeTotalConfig = {
  leftCount: number;
  rightCount: number;
  token: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, MakeTotalConfig> = {
  "math-add-1-1": { leftCount: 1, rightCount: 1, token: "🍎", cue: "Gabungkan 1 benda dengan 1 benda.", successText: "1 + 1 = 2." },
  "math-add-2-1": { leftCount: 2, rightCount: 1, token: "●", cue: "Hitung dua kelompok setelah digabung.", successText: "2 + 1 = 3." },
  "math-add-2-2": { leftCount: 2, rightCount: 2, token: "★", cue: "Satukan dua bintang dan dua bintang.", successText: "2 + 2 = 4." },
  "math-add-3-2": { leftCount: 3, rightCount: 2, token: "●", cue: "Gabungkan kelompok 3 dan kelompok 2.", successText: "3 + 2 = 5." },
  "math-add-4-3": { leftCount: 4, rightCount: 3, token: "■", cue: "Satukan 4 balok dan 3 balok.", successText: "4 + 3 = 7." }
};

export function makeTotalConfig(activity: LearningActivity | undefined): MakeTotalConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^\d+$/.test(choice)) || !/^\d+$/.test(correct)) return null;
  if (config.leftCount < 1 || config.rightCount < 1 || config.leftCount + config.rightCount > 10) return null;
  if (String(config.leftCount + config.rightCount) !== correct) return null;
  if (!config.token || !config.cue || !config.successText) return null;
  return config;
}
