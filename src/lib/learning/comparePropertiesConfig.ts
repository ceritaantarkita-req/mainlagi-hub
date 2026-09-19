import type { LearningActivity } from "./system";

export type ComparePropertyKind = "length" | "temperature" | "fill" | "capacity";
export type ComparePropertyGoal = "shorter" | "longer" | "lower" | "more" | "fuller";
export type QualitativeLevel = "low" | "medium" | "high";
export type ComparePropertyTarget = "left" | "right" | "other" | `candidate-${number}`;

type CompareCandidate = {
  label: string;
  icon: string;
  level: QualitativeLevel;
  choice: string;
};

type ExactIdentity = {
  expectedSubjectId: "science" | "math";
  expectedStageId: "science-earth-body-environment" | "math-ukur-ruang";
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
};

export type BinaryComparePropertiesConfig = ExactIdentity & {
  variant: "binary_compare";
  propertyKind: ComparePropertyKind;
  goal: ComparePropertyGoal;
  cue: string;
  left: CompareCandidate;
  right: CompareCandidate;
  otherChoice: string;
  correctTarget: "left" | "right" | "other";
  successText: string;
};

export type MultiCandidateComparePropertiesConfig = ExactIdentity & {
  variant: "multi_candidate_compare";
  propertyKind: ComparePropertyKind;
  goal: ComparePropertyGoal;
  cue: string;
  candidates: readonly [CompareCandidate, CompareCandidate, CompareCandidate];
  correctTarget: `candidate-${0 | 1 | 2}`;
  successText: string;
};

export type ComparePropertiesConfig = BinaryComparePropertiesConfig | MultiCandidateComparePropertiesConfig;

const CONFIGS: Record<string, ComparePropertiesConfig> = {
  "science-measure-longer-pencil": {
    variant: "binary_compare",
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Pensil A lebih panjang dari Pensil B. Mana yang lebih pendek?",
    expectedChoices: ["Pensil B", "Pensil A", "keduanya pasti sama"],
    expectedCorrectChoice: "Pensil B",
    propertyKind: "length",
    goal: "shorter",
    cue: "Bandingkan panjang kedua pensil. Pilih yang lebih pendek.",
    left: { label: "Pensil A", icon: "✏️", level: "high", choice: "Pensil A" },
    right: { label: "Pensil B", icon: "✏️", level: "low", choice: "Pensil B" },
    otherChoice: "keduanya pasti sama",
    correctTarget: "right",
    successText: "Pensil B lebih pendek daripada Pensil A."
  },
  "science-measure-hot-cold": {
    variant: "binary_compare",
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Es terasa dingin dan teh hangat terasa hangat. Mana yang suhunya lebih rendah?",
    expectedChoices: ["es", "teh hangat", "keduanya selalu sama"],
    expectedCorrectChoice: "es",
    propertyKind: "temperature",
    goal: "lower",
    cue: "Bandingkan suhu kedua benda. Pilih yang suhunya lebih rendah.",
    left: { label: "Es", icon: "🧊", level: "low", choice: "es" },
    right: { label: "Teh hangat", icon: "🍵", level: "high", choice: "teh hangat" },
    otherChoice: "keduanya selalu sama",
    correctTarget: "left",
    successText: "Es memiliki suhu lebih rendah daripada teh hangat."
  },
  "science-measure-more-water": {
    variant: "binary_compare",
    expectedSubjectId: "science",
    expectedStageId: "science-earth-body-environment",
    expectedPrompt: "Gelas A berisi lebih banyak air daripada Gelas B. Mana yang isinya lebih banyak?",
    expectedChoices: ["Gelas A", "Gelas B", "tidak ada air"],
    expectedCorrectChoice: "Gelas A",
    propertyKind: "fill",
    goal: "more",
    cue: "Bandingkan isi kedua gelas. Pilih gelas yang berisi lebih banyak air.",
    left: { label: "Gelas A", icon: "🥛", level: "high", choice: "Gelas A" },
    right: { label: "Gelas B", icon: "🥛", level: "low", choice: "Gelas B" },
    otherChoice: "tidak ada air",
    correctTarget: "left",
    successText: "Gelas A berisi lebih banyak air daripada Gelas B."
  },
  "math-measure-longer": {
    variant: "binary_compare",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Pita A = ━━━━━━ dan pita B = ━━━. Mana lebih panjang?",
    expectedChoices: ["A", "B", "Sama"],
    expectedCorrectChoice: "A",
    propertyKind: "length",
    goal: "longer",
    cue: "Bandingkan panjang pita A dan B. Pilih pita yang lebih panjang.",
    left: { label: "Pita A", icon: "🎀", level: "high", choice: "A" },
    right: { label: "Pita B", icon: "🎀", level: "low", choice: "B" },
    otherChoice: "Sama",
    correctTarget: "left",
    successText: "Pita A lebih panjang daripada Pita B."
  },
  "math-measure-fuller": {
    variant: "binary_compare",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Gelas A terisi 3 dari 4 bagian; gelas B terisi 1 dari 4 bagian. Mana lebih penuh?",
    expectedChoices: ["A", "B", "Sama"],
    expectedCorrectChoice: "A",
    propertyKind: "fill",
    goal: "fuller",
    cue: "Bandingkan isi kedua gelas. Pilih gelas yang lebih penuh.",
    left: { label: "Gelas A", icon: "🥛", level: "high", choice: "A" },
    right: { label: "Gelas B", icon: "🥛", level: "low", choice: "B" },
    otherChoice: "Sama",
    correctTarget: "left",
    successText: "Gelas A lebih penuh daripada Gelas B."
  },
  "math-measure-more-capacity": {
    variant: "multi_candidate_compare",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Untuk menampung lebih banyak air, mana biasanya punya kapasitas lebih besar?",
    expectedChoices: ["ember", "cangkir", "sendok"],
    expectedCorrectChoice: "ember",
    propertyKind: "capacity",
    goal: "more",
    cue: "Bandingkan kapasitas ketiga benda. Pilih yang biasanya dapat menampung paling banyak air.",
    candidates: [
      { label: "Ember", icon: "🪣", level: "high", choice: "ember" },
      { label: "Cangkir", icon: "☕", level: "medium", choice: "cangkir" },
      { label: "Sendok", icon: "🥄", level: "low", choice: "sendok" }
    ],
    correctTarget: "candidate-0",
    successText: "Ember biasanya dapat menampung lebih banyak air daripada cangkir atau sendok."
  },
  "math-measure-three-lengths": {
    variant: "multi_candidate_compare",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "A=━━, B=━━━━, C=━━━━━━. Mana yang paling pendek?",
    expectedChoices: ["A", "B", "C"],
    expectedCorrectChoice: "A",
    propertyKind: "length",
    goal: "shorter",
    cue: "Bandingkan tiga panjang. Pilih yang paling pendek.",
    candidates: [
      { label: "A", icon: "📏", level: "low", choice: "A" },
      { label: "B", icon: "📏", level: "medium", choice: "B" },
      { label: "C", icon: "📏", level: "high", choice: "C" }
    ],
    correctTarget: "candidate-0",
    successText: "A adalah yang paling pendek."
  }
};

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function comparePropertiesConfig(activity: LearningActivity | undefined): ComparePropertiesConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  if (
    activity.subjectId !== config.expectedSubjectId ||
    activity.stageId !== config.expectedStageId ||
    activity.runtime !== "tap_choice" ||
    activity.prompt !== config.expectedPrompt ||
    activity.correctChoice !== config.expectedCorrectChoice ||
    !arraysEqual(activity.choices ?? [], config.expectedChoices)
  ) return null;

  if (config.variant === "binary_compare") {
    const mappedChoices = [config.left.choice, config.right.choice, config.otherChoice];
    if (new Set(mappedChoices).size !== 3 || mappedChoices.some((choice) => !config.expectedChoices.includes(choice))) return null;
    const correctChoice = compareChoiceForTarget(config, config.correctTarget);
    if (correctChoice !== config.expectedCorrectChoice) return null;
    return config;
  }

  const mappedChoices = config.candidates.map((candidate) => candidate.choice);
  if (!arraysEqual(mappedChoices, config.expectedChoices)) return null;
  const correctChoice = compareChoiceForTarget(config, config.correctTarget);
  if (correctChoice !== config.expectedCorrectChoice) return null;
  return config;
}

export function compareChoiceForTarget(config: ComparePropertiesConfig, target: ComparePropertyTarget): string | null {
  if (config.variant === "binary_compare") {
    if (target === "left") return config.left.choice;
    if (target === "right") return config.right.choice;
    if (target === "other") return config.otherChoice;
    return null;
  }

  const match = /^candidate-(0|1|2)$/.exec(target);
  if (!match) return null;
  return config.candidates[Number(match[1])]?.choice ?? null;
}
