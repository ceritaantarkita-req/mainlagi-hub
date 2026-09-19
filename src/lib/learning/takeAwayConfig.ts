import type { LearningActivity } from "./system";

type MathOperationStageId = "math-operasi-awal" | "math-ukur-ruang";

type TakeAwayIdentity = {
  expectedStageId: MathOperationStageId;
  expectedTitle: string;
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
};

export type TakeAwayConfig = TakeAwayIdentity & {
  startCount: number;
  removeCount: number;
  token: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, TakeAwayConfig> = {
  "math-sub-3-1": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "3 − 1",
    expectedPrompt: "Ada 3 buah, 1 diambil. Berapa sisa?",
    expectedChoices: ["1", "2", "3"],
    expectedCorrectChoice: "2",
    startCount: 3,
    removeCount: 1,
    token: "●",
    cue: "Mulai dengan 3 benda. Tandai 1 yang diambil, lalu hitung yang masih aktif.",
    successText: "3 − 1 = 2."
  },
  "math-sub-4-2": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "4 − 2",
    expectedPrompt: "Empat titik dikurangi dua titik. Berapa sisa?",
    expectedChoices: ["1", "2", "3"],
    expectedCorrectChoice: "2",
    startCount: 4,
    removeCount: 2,
    token: "●",
    cue: "Mulai dengan 4 titik. Dua diambil, lalu hitung yang masih aktif.",
    successText: "4 − 2 = 2."
  },
  "math-sub-5-1": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "5 − 1",
    expectedPrompt: "Lima bunga, satu diberikan. Berapa yang tersisa?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "4",
    startCount: 5,
    removeCount: 1,
    token: "🌼",
    cue: "Mulai dengan 5 bunga. Satu diberikan, lalu hitung yang masih ada.",
    successText: "5 − 1 = 4."
  },
  "math-sub-6-2": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "6 − 2",
    expectedPrompt: "6 dikurangi 2 hasilnya?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "4",
    startCount: 6,
    removeCount: 2,
    token: "●",
    cue: "Mulai dengan 6 benda. Dua diambil, lalu hitung sisanya.",
    successText: "6 − 2 = 4."
  },
  "math-sub-7-3": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "7 − 3",
    expectedPrompt: "Tujuh kelereng, tiga disimpan. Berapa yang masih terlihat?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "4",
    startCount: 7,
    removeCount: 3,
    token: "●",
    cue: "Mulai dengan 7 kelereng. Tiga disimpan, lalu hitung yang masih terlihat.",
    successText: "7 − 3 = 4."
  },
  "math-mixed-sub-6-1": {
    expectedStageId: "math-ukur-ruang",
    expectedTitle: "Campuran: 6 − 1",
    expectedPrompt: "6 − 1 = ?",
    expectedChoices: ["4", "5", "6"],
    expectedCorrectChoice: "5",
    startCount: 6,
    removeCount: 1,
    token: "●",
    cue: "Mulai dengan 6 benda. Ambil 1, lalu hitung sisanya.",
    successText: "6 − 1 = 5."
  },
  "math-mixed-sub-9-3": {
    expectedStageId: "math-ukur-ruang",
    expectedTitle: "Campuran: 9 − 3",
    expectedPrompt: "Sembilan dikurangi tiga hasilnya?",
    expectedChoices: ["5", "6", "7"],
    expectedCorrectChoice: "6",
    startCount: 9,
    removeCount: 3,
    token: "●",
    cue: "Mulai dengan 9 benda. Ambil 3, lalu hitung sisanya.",
    successText: "9 − 3 = 6."
  }
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function takeAwayConfig(activity: LearningActivity | undefined): TakeAwayConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (
    activity.subjectId !== "math" ||
    activity.stageId !== config.expectedStageId ||
    activity.runtime !== "tap_choice" ||
    activity.title !== config.expectedTitle ||
    activity.prompt !== config.expectedPrompt ||
    !arraysEqual(choices, config.expectedChoices) ||
    activity.correctChoice !== config.expectedCorrectChoice
  ) return null;

  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^\d+$/.test(choice)) || !/^\d+$/.test(correct)) return null;
  if (config.startCount < 2 || config.startCount > 10) return null;
  if (config.removeCount < 1 || config.removeCount >= config.startCount) return null;
  if (String(config.startCount - config.removeCount) !== correct) return null;
  if (!config.token || !config.cue || !config.successText) return null;
  return config;
}
