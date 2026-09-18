import type { LearningActivity } from "./system";

export type ShapeAttributeMode =
  | "identify_circle"
  | "identify_triangle"
  | "identify_square"
  | "identify_three_sides";

export type ShapeAttributeChoiceVisual = {
  accessibleLabel: string;
};

export type ShapeAttributeBoardConfig = {
  mode: ShapeAttributeMode;
  cue: string;
  successText: string;
  successInsight: string;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  choiceVisuals: Record<string, ShapeAttributeChoiceVisual>;
};

const CONFIGS: Record<string, ShapeAttributeBoardConfig> = {
  "math-shape-find-circle": {
    mode: "identify_circle",
    cue: "Bandingkan bentuknya. Cari yang bulat tanpa sudut.",
    successText: "Lingkaran tidak memiliki sudut.",
    successInsight: "Bentuk bulat yang tidak memiliki sudut adalah lingkaran.",
    expectedPrompt: "Bentuk mana yang bulat tanpa sudut?",
    expectedChoices: ["●", "▲", "■"],
    expectedCorrectChoice: "●",
    choiceVisuals: {
      "●": { accessibleLabel: "lingkaran" },
      "▲": { accessibleLabel: "segitiga" },
      "■": { accessibleLabel: "persegi" }
    }
  },
  "math-shape-find-triangle": {
    mode: "identify_triangle",
    cue: "Amati ketiga bentuk lalu pilih segitiga.",
    successText: "Segitiga memiliki tiga sisi.",
    successInsight: "Bentuk segitiga terlihat dari tiga sisinya.",
    expectedPrompt: "Mana bentuk segitiga?",
    expectedChoices: ["■", "▲", "●"],
    expectedCorrectChoice: "▲",
    choiceVisuals: {
      "■": { accessibleLabel: "persegi" },
      "▲": { accessibleLabel: "segitiga" },
      "●": { accessibleLabel: "lingkaran" }
    }
  },
  "math-shape-find-square": {
    mode: "identify_square",
    cue: "Amati ketiga bentuk lalu pilih persegi.",
    successText: "Persegi memiliki empat sisi yang sama panjang.",
    successInsight: "Bentuk persegi memiliki empat sisi yang sama panjang.",
    expectedPrompt: "Pilih bentuk persegi.",
    expectedChoices: ["▭", "■", "●"],
    expectedCorrectChoice: "■",
    choiceVisuals: {
      "▭": { accessibleLabel: "persegi panjang" },
      "■": { accessibleLabel: "persegi" },
      "●": { accessibleLabel: "lingkaran" }
    }
  },
  "math-shape-three-sides": {
    mode: "identify_three_sides",
    cue: "Amati sisi setiap bentuk. Pilih bentuk yang punya tiga sisi.",
    successText: "Segitiga adalah bentuk dengan tiga sisi.",
    successInsight: "Tiga sisi bertemu membentuk segitiga.",
    expectedPrompt: "Bentuk mana yang punya 3 sisi?",
    expectedChoices: ["●", "▲", "■"],
    expectedCorrectChoice: "▲",
    choiceVisuals: {
      "●": { accessibleLabel: "lingkaran" },
      "▲": { accessibleLabel: "segitiga" },
      "■": { accessibleLabel: "persegi" }
    }
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function shapeAttributeBoardConfig(activity: LearningActivity | undefined): ShapeAttributeBoardConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "math" || activity.stageId !== "math-banding-bentuk" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;

  const visualKeys = Object.keys(config.choiceVisuals);
  if (!sameStrings(visualKeys, choices)) return null;
  if (choices.some((choice) => !config.choiceVisuals[choice]?.accessibleLabel)) return null;
  if (!config.cue || !config.successText || !config.successInsight) return null;

  return config;
}

export function isShapeAttributeBoardActivity(activity: LearningActivity | undefined): boolean {
  return shapeAttributeBoardConfig(activity) !== null;
}
