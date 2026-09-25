import type { LearningSemanticIllustrationKey } from "./semanticIllustrationRuntime";
import type { LearningActivity } from "./system";

export type InitialSoundConfig = {
  word: string;
  clue: string;
  successText: string;
  semanticKey?: LearningSemanticIllustrationKey;
};

const CONFIGS: Record<string, InitialSoundConfig> = {
  "bahasa-awal-bola": { word: "bola", clue: "⚽", semanticKey: "object.ball", successText: "Bola dimulai dengan bunyi B." },
  "bahasa-awal-kucing": { word: "kucing", clue: "🐱", semanticKey: "animal.cat", successText: "Kucing dimulai dengan bunyi K." },
  "bahasa-awal-pisang": { word: "pisang", clue: "🍌", successText: "Pisang dimulai dengan bunyi P." }
};

export function initialSoundConfig(activity: LearningActivity | undefined): InitialSoundConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^[A-Z]$/.test(choice)) || !/^[A-Z]$/.test(correct)) return null;
  if (!config.word || !config.clue || !config.successText) return null;
  if (config.word[0]?.toUpperCase() !== correct) return null;
  return config;
}
