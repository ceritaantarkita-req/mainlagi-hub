import type { LearningActivity } from "./system";

type MathOperationStageId = "math-operasi-awal" | "math-ukur-ruang";

type MakeTotalIdentity = {
  expectedStageId: MathOperationStageId;
  expectedTitle: string;
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
};

export type MakeTotalConfig = MakeTotalIdentity & {
  leftCount: number;
  rightCount: number;
  token: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, MakeTotalConfig> = {
  "math-add-1-1": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "1 + 1",
    expectedPrompt: "Ada 1 apel, lalu datang 1 apel lagi. Jadi berapa?",
    expectedChoices: ["1", "2", "3"],
    expectedCorrectChoice: "2",
    leftCount: 1,
    rightCount: 1,
    token: "🍎",
    cue: "Gabungkan 1 benda dengan 1 benda.",
    successText: "1 + 1 = 2."
  },
  "math-add-2-1": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "2 + 1",
    expectedPrompt: "●● ditambah ●. Berapa semuanya?",
    expectedChoices: ["2", "3", "4"],
    expectedCorrectChoice: "3",
    leftCount: 2,
    rightCount: 1,
    token: "●",
    cue: "Hitung dua kelompok setelah digabung.",
    successText: "2 + 1 = 3."
  },
  "math-add-2-2": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "2 + 2",
    expectedPrompt: "Dua bintang ditambah dua bintang. Berapa jumlahnya?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "4",
    leftCount: 2,
    rightCount: 2,
    token: "★",
    cue: "Satukan dua bintang dan dua bintang.",
    successText: "2 + 2 = 4."
  },
  "math-add-3-2": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "3 + 2",
    expectedPrompt: "3 + 2 sama dengan berapa?",
    expectedChoices: ["4", "5", "6"],
    expectedCorrectChoice: "5",
    leftCount: 3,
    rightCount: 2,
    token: "●",
    cue: "Gabungkan kelompok 3 dan kelompok 2.",
    successText: "3 + 2 = 5."
  },
  "math-add-4-3": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "4 + 3",
    expectedPrompt: "Empat balok ditambah tiga balok. Ada berapa balok?",
    expectedChoices: ["6", "7", "8"],
    expectedCorrectChoice: "7",
    leftCount: 4,
    rightCount: 3,
    token: "■",
    cue: "Satukan 4 balok dan 3 balok.",
    successText: "4 + 3 = 7."
  },
  "math-mixed-add-2-3": {
    expectedStageId: "math-ukur-ruang",
    expectedTitle: "Campuran: 2 + 3",
    expectedPrompt: "2 + 3 = ?",
    expectedChoices: ["4", "5", "6"],
    expectedCorrectChoice: "5",
    leftCount: 2,
    rightCount: 3,
    token: "●",
    cue: "Gabungkan 2 benda dengan 3 benda.",
    successText: "2 + 3 = 5."
  },
  "math-mixed-add-4-4": {
    expectedStageId: "math-ukur-ruang",
    expectedTitle: "Campuran: 4 + 4",
    expectedPrompt: "Empat ditambah empat hasilnya?",
    expectedChoices: ["6", "7", "8"],
    expectedCorrectChoice: "8",
    leftCount: 4,
    rightCount: 4,
    token: "■",
    cue: "Gabungkan 4 benda dengan 4 benda.",
    successText: "4 + 4 = 8."
  }
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function makeTotalConfig(activity: LearningActivity | undefined): MakeTotalConfig | null {
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
  if (config.leftCount < 1 || config.rightCount < 1 || config.leftCount + config.rightCount > 10) return null;
  if (String(config.leftCount + config.rightCount) !== correct) return null;
  if (!config.token || !config.cue || !config.successText) return null;
  return config;
}
