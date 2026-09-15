import type { LearningActivity } from "./system";

export type ComparePropertyKind = "length" | "temperature" | "fill";
export type ComparePropertyGoal = "shorter" | "lower" | "more";
export type ComparePropertyTarget = "left" | "right" | "other";
export type QualitativeLevel = "low" | "high";

export type ComparePropertiesConfig = {
  propertyKind: ComparePropertyKind;
  goal: ComparePropertyGoal;
  cue: string;
  left: { label: string; icon: string; level: QualitativeLevel; choice: string };
  right: { label: string; icon: string; level: QualitativeLevel; choice: string };
  otherChoice: string;
  correctTarget: ComparePropertyTarget;
  successText: string;
};

const CONFIGS: Record<string, ComparePropertiesConfig> = {
  "science-measure-longer-pencil": {
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
    propertyKind: "fill",
    goal: "more",
    cue: "Bandingkan isi kedua gelas. Pilih gelas yang berisi lebih banyak air.",
    left: { label: "Gelas A", icon: "🥛", level: "high", choice: "Gelas A" },
    right: { label: "Gelas B", icon: "🥛", level: "low", choice: "Gelas B" },
    otherChoice: "tidak ada air",
    correctTarget: "left",
    successText: "Gelas A berisi lebih banyak air daripada Gelas B."
  }
};

export function comparePropertiesConfig(activity: LearningActivity | undefined): ComparePropertiesConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const mappedChoices = [config.left.choice, config.right.choice, config.otherChoice];
  if (choices.length !== 3 || new Set(choices).size !== 3) return null;
  if (new Set(mappedChoices).size !== 3 || mappedChoices.some((choice) => !choices.includes(choice))) return null;
  const correctChoice = activity.correctChoice ?? "";
  const correctTarget = config.correctTarget === "left"
    ? config.left.choice
    : config.correctTarget === "right"
      ? config.right.choice
      : config.otherChoice;
  if (correctTarget !== correctChoice) return null;
  return config;
}

export function compareChoiceForTarget(config: ComparePropertiesConfig, target: ComparePropertyTarget): string {
  if (target === "left") return config.left.choice;
  if (target === "right") return config.right.choice;
  return config.otherChoice;
}
