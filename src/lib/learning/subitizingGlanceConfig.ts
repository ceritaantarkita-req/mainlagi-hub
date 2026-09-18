import type { LearningActivity } from "./system";

export type SubitizingGlanceMode = "pair" | "square" | "dice_five";

export type SubitizingGlanceConfig = {
  mode: SubitizingGlanceMode;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  dotCells: readonly number[];
  accessiblePatternLabel: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, SubitizingGlanceConfig> = {
  "math-subitize-2": {
    mode: "pair",
    expectedPrompt: "Tanpa menghitung lama, berapa titik yang terlihat: ● ● ?",
    expectedChoices: ["1", "2", "3"],
    expectedCorrectChoice: "2",
    dotCells: [3, 5],
    accessiblePatternLabel: "Dua titik berjajar mendatar.",
    cue: "Lihat dua titik sebagai satu pasangan.",
    successText: "Kamu mengenali dua titik sebagai satu pola."
  },
  "math-subitize-4": {
    mode: "square",
    expectedPrompt: "Lihat pola ● ● / ● ●. Ada berapa titik?",
    expectedChoices: ["3", "4", "5"],
    expectedCorrectChoice: "4",
    dotCells: [0, 2, 6, 8],
    accessiblePatternLabel: "Empat titik membentuk empat sudut persegi.",
    cue: "Lihat empat sudutnya sebagai satu bentuk persegi.",
    successText: "Kamu mengenali empat titik dari pola persegi."
  },
  "math-subitize-5": {
    mode: "dice_five",
    expectedPrompt: "Lihat pola seperti dadu lima. Berapa jumlah titiknya?",
    expectedChoices: ["4", "5", "6"],
    expectedCorrectChoice: "5",
    dotCells: [0, 2, 4, 6, 8],
    accessiblePatternLabel: "Lima titik seperti pola angka lima pada dadu.",
    cue: "Lihat empat sudut dan satu titik di tengah sebagai satu pola.",
    successText: "Kamu mengenali lima titik dari pola dadu lima."
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function subitizingGlanceConfig(activity: LearningActivity | undefined): SubitizingGlanceConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "math" || activity.stageId !== "math-jumlah-dasar" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;

  const target = Number(config.expectedCorrectChoice);
  const uniqueCells = new Set(config.dotCells);
  if (!Number.isInteger(target) || target < 1 || target > 9) return null;
  if (config.dotCells.length !== target || uniqueCells.size !== config.dotCells.length) return null;
  if (config.dotCells.some((cell) => !Number.isInteger(cell) || cell < 0 || cell > 8)) return null;
  if (!config.accessiblePatternLabel || !config.cue || !config.successText) return null;

  return config;
}

export function isSubitizingGlanceActivity(activity: LearningActivity | undefined): boolean {
  return subitizingGlanceConfig(activity) !== null;
}
