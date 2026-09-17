import type { LearningActivity } from "./system";

export type SpatialRelationKind = "left_of" | "right_of" | "between" | "turn_right" | "turn_left" | "opposite";
export type SpatialRelationMode = "object_relation" | "turn" | "opposite";

export type SpatialRelationBoardConfig = {
  kind: SpatialRelationKind;
  mode: SpatialRelationMode;
  relationOrTurn: string;
  anchor: string;
  moving: string;
  cue: string;
  successText: string;
  expectedPrompt: string;
  expectedChoices: readonly [string, string, string];
  expectedCorrectChoice: string;
};

const CONFIGS: Record<string, SpatialRelationBoardConfig> = {
  "logic-spatial-star-left-circle": {
    kind: "left_of",
    mode: "object_relation",
    relationOrTurn: "left_of",
    anchor: "○",
    moving: "★",
    cue: "Cari susunan saat bintang berada di sebelah kiri lingkaran.",
    successText: "Bintang berada di kiri lingkaran.",
    expectedPrompt: "Mana yang menunjukkan bintang di kiri lingkaran?",
    expectedChoices: ["★ ○", "○ ★", "★ ★"],
    expectedCorrectChoice: "★ ○"
  },
  "logic-spatial-circle-right-triangle": {
    kind: "right_of",
    mode: "object_relation",
    relationOrTurn: "right_of",
    anchor: "▲",
    moving: "○",
    cue: "Cari susunan saat lingkaran berada di sebelah kanan segitiga.",
    successText: "Lingkaran berada di kanan segitiga.",
    expectedPrompt: "Mana yang menunjukkan lingkaran di kanan segitiga?",
    expectedChoices: ["▲ ○", "○ ▲", "▲ ▲"],
    expectedCorrectChoice: "▲ ○"
  },
  "logic-spatial-circle-between-stars": {
    kind: "between",
    mode: "object_relation",
    relationOrTurn: "between",
    anchor: "★",
    moving: "○",
    cue: "Cari susunan saat lingkaran berada tepat di antara dua bintang.",
    successText: "Lingkaran berada di antara dua bintang.",
    expectedPrompt: "Mana yang menaruh lingkaran di antara dua bintang?",
    expectedChoices: ["★ ○ ★", "○ ★ ★", "★ ★ ○"],
    expectedCorrectChoice: "★ ○ ★"
  },
  "logic-spatial-turn-right-from-up": {
    kind: "turn_right",
    mode: "turn",
    relationOrTurn: "right",
    anchor: "↑",
    moving: "→",
    cue: "Mulai menghadap atas, lalu bayangkan satu belokan ke kanan.",
    successText: "Dari atas, belok kanan mengarah ke kanan.",
    expectedPrompt: "Jika menghadap ↑ lalu belok kanan, menghadap ke mana?",
    expectedChoices: ["→", "←", "↓"],
    expectedCorrectChoice: "→"
  },
  "logic-spatial-turn-left-from-right": {
    kind: "turn_left",
    mode: "turn",
    relationOrTurn: "left",
    anchor: "→",
    moving: "↑",
    cue: "Mulai menghadap kanan, lalu bayangkan satu belokan ke kiri.",
    successText: "Dari kanan, belok kiri mengarah ke atas.",
    expectedPrompt: "Jika menghadap → lalu belok kiri, menghadap ke mana?",
    expectedChoices: ["↑", "↓", "←"],
    expectedCorrectChoice: "↑"
  },
  "logic-spatial-opposite-left": {
    kind: "opposite",
    mode: "opposite",
    relationOrTurn: "opposite",
    anchor: "←",
    moving: "→",
    cue: "Cari arah yang tepat berlawanan dari panah ke kiri.",
    successText: "Arah yang berlawanan dari kiri adalah kanan.",
    expectedPrompt: "Arah apa yang berlawanan dengan ← ?",
    expectedChoices: ["→", "↑", "↓"],
    expectedCorrectChoice: "→"
  }
};

export function spatialRelationBoardConfig(activity: LearningActivity | undefined): SpatialRelationBoardConfig | null {
  if (!activity) return null;
  if (activity.subjectId !== "logic" || activity.stageId !== "logic-patterns-sequences-relations" || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (activity.prompt !== config.expectedPrompt) return null;
  if (choices.length !== 3 || new Set(choices).size !== 3) return null;
  if (choices.some((choice, index) => choice !== config.expectedChoices[index])) return null;
  if (correct !== config.expectedCorrectChoice || !choices.includes(correct)) return null;
  if (!config.mode || !config.relationOrTurn || !config.anchor || !config.moving || !config.cue || !config.successText) return null;

  return config;
}

export function isSpatialRelationBoardActivity(activity: LearningActivity | undefined): boolean {
  return spatialRelationBoardConfig(activity) !== null;
}
