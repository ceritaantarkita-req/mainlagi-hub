import type { LearningActivity } from "./system";

export type SpatialRelationKind = "left_of" | "right_of" | "between" | "turn_right" | "turn_left" | "opposite";

export type SpatialRelationBoardConfig = {
  kind: SpatialRelationKind;
  anchor: string;
  moving: string;
  cue: string;
  successText: string;
};

const CONFIGS: Record<string, SpatialRelationBoardConfig> = {
  "logic-spatial-star-left-circle": {
    kind: "left_of",
    anchor: "○",
    moving: "★",
    cue: "Cari susunan saat bintang berada di sebelah kiri lingkaran.",
    successText: "Bintang berada di kiri lingkaran."
  },
  "logic-spatial-circle-right-triangle": {
    kind: "right_of",
    anchor: "▲",
    moving: "○",
    cue: "Cari susunan saat lingkaran berada di sebelah kanan segitiga.",
    successText: "Lingkaran berada di kanan segitiga."
  },
  "logic-spatial-circle-between-stars": {
    kind: "between",
    anchor: "★",
    moving: "○",
    cue: "Cari susunan saat lingkaran berada tepat di antara dua bintang.",
    successText: "Lingkaran berada di antara dua bintang."
  },
  "logic-spatial-turn-right-from-up": {
    kind: "turn_right",
    anchor: "↑",
    moving: "→",
    cue: "Mulai menghadap atas, lalu bayangkan satu belokan ke kanan.",
    successText: "Dari atas, belok kanan mengarah ke kanan."
  },
  "logic-spatial-turn-left-from-right": {
    kind: "turn_left",
    anchor: "→",
    moving: "↑",
    cue: "Mulai menghadap kanan, lalu bayangkan satu belokan ke kiri.",
    successText: "Dari kanan, belok kiri mengarah ke atas."
  },
  "logic-spatial-opposite-left": {
    kind: "opposite",
    anchor: "←",
    moving: "→",
    cue: "Cari arah yang tepat berlawanan dari panah ke kiri.",
    successText: "Arah yang berlawanan dari kiri adalah kanan."
  }
};

export function spatialRelationBoardConfig(activity: LearningActivity | undefined): SpatialRelationBoardConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "logic" || activity.stageId !== "logic-patterns-sequences-relations" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (!activity.prompt || choices.length !== 3 || new Set(choices).size !== 3 || !choices.includes(correct)) return null;
  if (!config.anchor || !config.moving || !config.cue || !config.successText) return null;

  return config;
}

export function isSpatialRelationBoardActivity(activity: LearningActivity | undefined): boolean {
  return spatialRelationBoardConfig(activity) !== null;
}
