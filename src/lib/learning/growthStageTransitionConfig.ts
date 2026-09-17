import type { LearningActivity } from "./system";

export type GrowthStageTransitionMode = "previous_stage" | "next_adult_stage" | "next_young_stage";
export type GrowthStageTransitionDirection = "backward" | "forward";

export type GrowthStageChoiceScene = {
  label: string;
  stageKey: string;
  icon: string;
  accessibleLabel: string;
};

export type GrowthStageTransitionConfig = {
  mode: GrowthStageTransitionMode;
  direction: GrowthStageTransitionDirection;
  knownStageKey: string;
  knownStageLabel: string;
  knownIcon: string;
  knownAccessibleLabel: string;
  targetStageKey: string;
  targetSlotLabel: string;
  expectedPrompt: string;
  expectedChoices: [string, string, string];
  expectedCorrectChoice: string;
  choiceScenes: [GrowthStageChoiceScene, GrowthStageChoiceScene, GrowthStageChoiceScene];
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, GrowthStageTransitionConfig> = {
  "science-cycle-frog": {
    mode: "previous_stage",
    direction: "backward",
    knownStageKey: "adult_frog",
    knownStageLabel: "katak dewasa",
    knownIcon: "🐸",
    knownAccessibleLabel: "katak dewasa",
    targetStageKey: "tadpole",
    targetSlotLabel: "Tahap sebelumnya",
    expectedPrompt: "Sebelum menjadi katak dewasa, anak katak hidup di air sebagai apa?",
    expectedChoices: ["berudu", "ulat", "anak ayam"],
    expectedCorrectChoice: "berudu",
    choiceScenes: [
      { label: "berudu", stageKey: "tadpole", icon: "🫧〰️", accessibleLabel: "berudu di air" },
      { label: "ulat", stageKey: "caterpillar", icon: "🐛", accessibleLabel: "ulat" },
      { label: "anak ayam", stageKey: "chick", icon: "🐥", accessibleLabel: "anak ayam" }
    ],
    cue: "Cari tahap muda katak yang hidup di air sebelum menjadi katak dewasa.",
    successText: "Berudu adalah tahap muda katak sebelum menjadi katak dewasa."
  },
  "science-cycle-chick": {
    mode: "next_adult_stage",
    direction: "forward",
    knownStageKey: "chick",
    knownStageLabel: "anak ayam",
    knownIcon: "🐥",
    knownAccessibleLabel: "anak ayam",
    targetStageKey: "adult_chicken",
    targetSlotLabel: "Tahap dewasa berikutnya",
    expectedPrompt: "Anak ayam akan tumbuh menjadi apa?",
    expectedChoices: ["ayam dewasa", "bebek dewasa", "burung merpati"],
    expectedCorrectChoice: "ayam dewasa",
    choiceScenes: [
      { label: "ayam dewasa", stageKey: "adult_chicken", icon: "🐔", accessibleLabel: "ayam dewasa" },
      { label: "bebek dewasa", stageKey: "adult_duck", icon: "🦆", accessibleLabel: "bebek dewasa" },
      { label: "burung merpati", stageKey: "adult_pigeon", icon: "🐦", accessibleLabel: "burung merpati dewasa" }
    ],
    cue: "Ikuti pertumbuhan anak ayam menuju bentuk dewasanya.",
    successText: "Anak ayam tumbuh menjadi ayam dewasa."
  },
  "science-cycle-seed-sprout": {
    mode: "next_young_stage",
    direction: "forward",
    knownStageKey: "seed",
    knownStageLabel: "biji",
    knownIcon: "🫘",
    knownAccessibleLabel: "biji tanaman",
    targetStageKey: "sprout",
    targetSlotLabel: "Tahap muda berikutnya",
    expectedPrompt: "Setelah biji mulai tumbuh, tahap muda yang muncul disebut apa?",
    expectedChoices: ["kecambah", "batu", "buah matang"],
    expectedCorrectChoice: "kecambah",
    choiceScenes: [
      { label: "kecambah", stageKey: "sprout", icon: "🌱", accessibleLabel: "kecambah muda" },
      { label: "batu", stageKey: "stone", icon: "🪨", accessibleLabel: "batu" },
      { label: "buah matang", stageKey: "ripe_fruit", icon: "🍎", accessibleLabel: "buah matang" }
    ],
    cue: "Cari tahap muda yang muncul ketika biji mulai tumbuh.",
    successText: "Biji yang mulai tumbuh memunculkan kecambah."
  }
};

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function growthStageTransitionConfig(activity: LearningActivity | undefined): GrowthStageTransitionConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "science" || activity.stageId !== "science-life-material-motion" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  if (activity.prompt !== config.expectedPrompt) return null;
  if (!sameStrings(choices, config.expectedChoices)) return null;
  if (activity.correctChoice !== config.expectedCorrectChoice) return null;
  if (new Set(choices).size !== 3 || !choices.includes(config.expectedCorrectChoice)) return null;
  if (config.choiceScenes.length !== 3 || !sameStrings(config.choiceScenes.map((scene) => scene.label), choices)) return null;
  if (new Set(config.choiceScenes.map((scene) => scene.stageKey)).size !== 3) return null;
  if (config.choiceScenes.some((scene) => !scene.stageKey || !scene.icon || !scene.accessibleLabel)) return null;

  const expectedDirection = config.mode === "previous_stage" ? "backward" : "forward";
  if (config.direction !== expectedDirection) return null;
  if (!config.knownStageKey || !config.knownStageLabel || !config.knownIcon || !config.knownAccessibleLabel) return null;
  if (!config.targetStageKey || config.targetStageKey === config.knownStageKey || !config.targetSlotLabel) return null;

  const targetScenes = config.choiceScenes.filter((scene) => scene.stageKey === config.targetStageKey);
  if (targetScenes.length !== 1 || targetScenes[0]?.label !== config.expectedCorrectChoice) return null;
  if (!config.cue || !config.successText) return null;

  return config;
}

export function isGrowthStageTransitionActivity(activity: LearningActivity | undefined): boolean {
  return growthStageTransitionConfig(activity) !== null;
}
