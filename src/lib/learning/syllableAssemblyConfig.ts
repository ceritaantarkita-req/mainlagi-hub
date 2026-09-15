import type { LearningActivity } from "./system";

export type SyllableAssemblyConfig = {
  syllables: [string, string];
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, SyllableAssemblyConfig> = {
  "bahasa-gabung-baju": {
    syllables: ["ba", "ju"],
    cue: "Baca dari kiri ke kanan: ba lalu ju.",
    successText: "ba + ju menjadi baju."
  },
  "bahasa-gabung-buku": {
    syllables: ["bu", "ku"],
    cue: "Satukan bunyi bu lalu ku.",
    successText: "bu + ku menjadi buku."
  },
  "bahasa-gabung-meja": {
    syllables: ["me", "ja"],
    cue: "Satukan bunyi me lalu ja.",
    successText: "me + ja menjadi meja."
  },
  "bahasa-gabung-bola": {
    syllables: ["bo", "la"],
    cue: "Satukan bunyi bo lalu la.",
    successText: "bo + la menjadi bola."
  },
  "bahasa-gabung-susu": {
    syllables: ["su", "su"],
    cue: "Baca su dua kali lalu satukan.",
    successText: "su + su menjadi susu."
  }
};

export function syllableAssemblyConfig(activity: LearningActivity | undefined): SyllableAssemblyConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (choices.length !== 3 || new Set(choices).size !== 3 || !correct || !choices.includes(correct)) return null;
  if (!config.syllables.every((syllable) => /^[a-z]+$/.test(syllable))) return null;
  if (config.syllables.join("") !== correct.toLowerCase()) return null;

  const sourceText = `${activity.title ?? ""} ${activity.prompt ?? ""}`.toLowerCase();
  if (!config.syllables.every((syllable) => sourceText.includes(syllable))) return null;
  if (!config.cue || !config.successText) return null;

  return config;
}
