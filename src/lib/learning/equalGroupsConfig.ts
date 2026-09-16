import type { LearningActivity } from "./system";

export type EqualGroupsConfig = {
  totalCount: number;
  groupSize: number;
  token: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, EqualGroupsConfig> = {
  "math-group-6-by-2": { totalCount: 6, groupSize: 2, token: "●", cue: "Buat kelompok dengan isi 2. Hitung berapa kelompok yang terbentuk.", successText: "6 benda menjadi 3 kelompok isi 2." },
  "math-group-8-by-2": { totalCount: 8, groupSize: 2, token: "●", cue: "Pisahkan 8 benda menjadi kelompok isi 2, lalu hitung kelompoknya.", successText: "8 benda menjadi 4 kelompok isi 2." },
  "math-group-9-by-3": { totalCount: 9, groupSize: 3, token: "●", cue: "Buat kelompok dengan isi 3. Hitung jumlah kelompok yang sama besar.", successText: "9 benda menjadi 3 kelompok isi 3." }
};

export function equalGroupsConfig(activity: LearningActivity | undefined): EqualGroupsConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^\d+$/.test(choice)) || !/^\d+$/.test(correct)) return null;
  if (config.totalCount < 2 || config.totalCount > 10) return null;
  if (config.groupSize < 1 || config.groupSize >= config.totalCount) return null;
  if (config.totalCount % config.groupSize !== 0) return null;
  if (String(config.totalCount / config.groupSize) !== correct) return null;
  if (!config.token || !config.cue || !config.successText) return null;
  return config;
}
