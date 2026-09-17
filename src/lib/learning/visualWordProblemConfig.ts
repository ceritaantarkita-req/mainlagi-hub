import type { LearningActivity } from "./system";

export type VisualWordProblemOperation = "add" | "subtract";

export type VisualWordProblemConfig = {
  startCount: number;
  changeCount: number;
  operation: VisualWordProblemOperation;
  token: string;
  startLabel: string;
  changeLabel: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, VisualWordProblemConfig> = {
  "math-problem-apples": {
    startCount: 2,
    changeCount: 2,
    operation: "add",
    token: "🍎",
    startLabel: "Apel Gian mula-mula",
    changeLabel: "Apel yang diberikan Naya",
    cue: "Lihat jumlah awal, lalu tambahkan apel yang datang.",
    successText: "2 apel + 2 apel = 4 apel."
  },
  "math-problem-birds": {
    startCount: 5,
    changeCount: 2,
    operation: "subtract",
    token: "🐦",
    startLabel: "Burung mula-mula",
    changeLabel: "Burung yang terbang pergi",
    cue: "Mulai dari semua burung, lalu kurangi yang terbang pergi.",
    successText: "5 burung − 2 burung = 3 burung."
  },
  "math-problem-cars": {
    startCount: 3,
    changeCount: 1,
    operation: "add",
    token: "🚗",
    startLabel: "Mobil Paca mula-mula",
    changeLabel: "Mobil yang ditemukan",
    cue: "Lihat mobil yang sudah ada, lalu tambahkan mobil yang ditemukan.",
    successText: "3 mobil + 1 mobil = 4 mobil."
  },
  "math-problem-cookies": {
    startCount: 6,
    changeCount: 2,
    operation: "subtract",
    token: "🍪",
    startLabel: "Biskuit mula-mula",
    changeLabel: "Biskuit yang dimakan",
    cue: "Mulai dari semua biskuit, lalu kurangi yang dimakan.",
    successText: "6 biskuit − 2 biskuit = 4 biskuit."
  },
  "math-problem-balloons": {
    startCount: 4,
    changeCount: 3,
    operation: "add",
    token: "🎈",
    startLabel: "Balon Zia mula-mula",
    changeLabel: "Balon yang didapat lagi",
    cue: "Lihat balon yang sudah ada, lalu tambahkan balon yang didapat.",
    successText: "4 balon + 3 balon = 7 balon."
  }
};

export function visualWordProblemConfig(activity: LearningActivity | undefined): VisualWordProblemConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "math" || activity.stageId !== "math-ukur-ruang" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (!activity.prompt || choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^\d+$/.test(choice)) || !/^\d+$/.test(correct)) return null;
  if (config.startCount < 1 || config.changeCount < 1 || config.startCount > 10 || config.changeCount > 10) return null;

  const result = config.operation === "add"
    ? config.startCount + config.changeCount
    : config.startCount - config.changeCount;

  if (result < 0 || String(result) !== correct) return null;
  if (!config.token || !config.startLabel || !config.changeLabel || !config.cue || !config.successText) return null;
  return config;
}

export function isVisualWordProblemActivity(activity: LearningActivity | undefined): boolean {
  return visualWordProblemConfig(activity) !== null;
}
