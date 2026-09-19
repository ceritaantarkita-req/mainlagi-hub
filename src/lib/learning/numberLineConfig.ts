import type { LearningActivity } from "./system";

export type NumberLineDirection = "right" | "left" | "between";

type NumberLineIdentity = {
  expectedStageId: "math-banding-bentuk" | "math-operasi-awal";
  expectedTitle: string;
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
};

export type NumberLineConfig = NumberLineIdentity & {
  min: number;
  max: number;
  contextValues: number[];
  direction: NumberLineDirection;
  cue: string;
};

const CONFIG: Record<string, NumberLineConfig> = {
  "math-order-next-1-2": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Setelah 1, 2",
    expectedPrompt: "1, 2, ... angka berikutnya apa?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "3",
    min: 1,
    max: 5,
    contextValues: [1, 2],
    direction: "right",
    cue: "Mulai dari 1, 2 lalu maju satu langkah."
  },
  "math-order-next-3-4": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Setelah 3, 4",
    expectedPrompt: "3, 4, ... lanjutkan urutannya.",
    expectedChoices: ["2", "5", "6"],
    expectedCorrectChoice: "5",
    min: 2,
    max: 6,
    contextValues: [3, 4],
    direction: "right",
    cue: "Mulai dari 3, 4 lalu maju satu langkah."
  },
  "math-order-before-6": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Sebelum 6",
    expectedPrompt: "Angka apa tepat sebelum 6?",
    expectedChoices: ["4", "5", "7"],
    expectedCorrectChoice: "5",
    min: 3,
    max: 7,
    contextValues: [6],
    direction: "left",
    cue: "Cari angka tepat satu langkah sebelum 6."
  },
  "math-order-between-6-8": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Di antara 6 dan 8",
    expectedPrompt: "6, ..., 8. Angka yang hilang?",
    expectedChoices: ["5", "7", "9"],
    expectedCorrectChoice: "7",
    min: 5,
    max: 9,
    contextValues: [6, 8],
    direction: "between",
    cue: "Cari angka yang berada di antara 6 dan 8."
  },
  "math-order-descend-5": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Urutan turun dari 5",
    expectedPrompt: "5, 4, ... angka berikutnya?",
    expectedChoices: ["2", "3", "6"],
    expectedCorrectChoice: "3",
    min: 2,
    max: 6,
    contextValues: [5, 4],
    direction: "left",
    cue: "Urutannya turun: 5, 4, lalu mundur satu langkah lagi."
  },
  "math-order-descend-10": {
    expectedStageId: "math-banding-bentuk",
    expectedTitle: "Urutan turun dari 10",
    expectedPrompt: "10, 9, ... lanjutkan.",
    expectedChoices: ["7", "8", "11"],
    expectedCorrectChoice: "8",
    min: 7,
    max: 11,
    contextValues: [10, 9],
    direction: "left",
    cue: "Urutannya turun: 10, 9, lalu mundur satu langkah lagi."
  },
  "math-missing-1-3": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "Isi 1, _, 3",
    expectedPrompt: "1, ..., 3. Angka yang hilang?",
    expectedChoices: ["0", "2", "4"],
    expectedCorrectChoice: "2",
    min: 0,
    max: 4,
    contextValues: [1, 3],
    direction: "between",
    cue: "Cari angka yang berada di antara 1 dan 3."
  },
  "math-missing-3-5": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "Isi 3, _, 5",
    expectedPrompt: "3, ..., 5. Pilih angka di tengah.",
    expectedChoices: ["2", "4", "6"],
    expectedCorrectChoice: "4",
    min: 2,
    max: 6,
    contextValues: [3, 5],
    direction: "between",
    cue: "Cari angka yang berada di antara 3 dan 5."
  },
  "math-missing-before-6": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "Isi _, 6, 7",
    expectedPrompt: "..., 6, 7. Angka apa yang hilang?",
    expectedChoices: ["4", "5", "8"],
    expectedCorrectChoice: "5",
    min: 4,
    max: 8,
    contextValues: [6, 7],
    direction: "left",
    cue: "Urutan menuju 6 dan 7. Cari angka tepat sebelumnya."
  },
  "math-missing-after-8": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "Isi 7, 8, _",
    expectedPrompt: "7, 8, ... lanjutkan urutannya.",
    expectedChoices: ["6", "9", "10"],
    expectedCorrectChoice: "9",
    min: 6,
    max: 10,
    contextValues: [7, 8],
    direction: "right",
    cue: "Mulai dari 7, 8 lalu maju satu langkah."
  },
  "math-missing-descend-10-8": {
    expectedStageId: "math-operasi-awal",
    expectedTitle: "Isi 10, _, 8",
    expectedPrompt: "10, ..., 8. Angka yang hilang saat turun?",
    expectedChoices: ["7", "9", "11"],
    expectedCorrectChoice: "9",
    min: 7,
    max: 11,
    contextValues: [10, 8],
    direction: "left",
    cue: "Urutannya turun dari 10 menuju 8. Cari angka di tengah."
  }
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function numberLineConfig(activity: LearningActivity | undefined): NumberLineConfig | null {
  if (!activity) return null;
  const config = CONFIG[activity.id];
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

  if (config.max - config.min !== 4) return null;
  if (!["right", "left", "between"].includes(config.direction)) return null;
  if (config.contextValues.length < 1 || config.contextValues.some((value) => value < config.min || value > config.max)) return null;
  if (choices.some((choice) => !/^\d+$/.test(choice))) return null;
  const numericChoices = choices.map(Number);
  if (numericChoices.some((value) => value < config.min || value > config.max)) return null;
  if (!choices.includes(activity.correctChoice ?? "")) return null;

  return config;
}

export function numberLineValues(config: NumberLineConfig): number[] {
  return Array.from({ length: config.max - config.min + 1 }, (_, index) => config.min + index);
}
