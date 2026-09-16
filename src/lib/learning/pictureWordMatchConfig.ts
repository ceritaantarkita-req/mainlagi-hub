import type { LearningActivity } from "./system";

export type PictureWordMatchConfig = {
  picture: string;
  spokenWord: string;
  successText: string;
};

const CONFIGS: Record<string, PictureWordMatchConfig> = {
  "bahasa-gambar-apel": { picture: "🍎", spokenWord: "apel", successText: "Gambar apel cocok dengan kata apel." },
  "bahasa-gambar-mobil": { picture: "🚗", spokenWord: "mobil", successText: "Gambar mobil cocok dengan kata mobil." },
  "bahasa-gambar-kucing": { picture: "🐱", spokenWord: "kucing", successText: "Gambar kucing cocok dengan kata kucing." },
  "bahasa-gambar-rumah": { picture: "🏠", spokenWord: "rumah", successText: "Gambar rumah cocok dengan kata rumah." },
  "bahasa-gambar-pisang": { picture: "🍌", spokenWord: "pisang", successText: "Gambar pisang cocok dengan kata pisang." }
};

export function pictureWordMatchConfig(activity: LearningActivity | undefined): PictureWordMatchConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (activity.runtime !== "tap_choice" || choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!choices.every((choice) => /^[a-z]+$/.test(choice)) || !/^[a-z]+$/.test(correct)) return null;
  if (!config.picture || !config.spokenWord || !config.successText || config.spokenWord !== correct) return null;
  return config;
}
