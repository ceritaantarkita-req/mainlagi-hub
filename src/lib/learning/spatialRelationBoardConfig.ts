import type { LearningActivity } from "./system";

export type SpatialRelationKind =
  | "left_of"
  | "right_of"
  | "above"
  | "inside"
  | "near"
  | "between"
  | "turn_right"
  | "turn_left"
  | "opposite";

export type SpatialRelationMode = "object_relation" | "containment" | "proximity" | "turn" | "opposite";

export type SpatialRelationBoardConfig = {
  kind: SpatialRelationKind;
  mode: SpatialRelationMode;
  relationOrTurn: string;
  anchor: string;
  moving: string;
  secondaryAnchor?: string;
  cue: string;
  successText: string;
  expectedSubjectId: "logic" | "math";
  expectedStageId: "logic-patterns-sequences-relations" | "math-ukur-ruang";
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
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
    expectedSubjectId: "logic",
    expectedStageId: "logic-patterns-sequences-relations",
    expectedPrompt: "Arah apa yang berlawanan dengan ← ?",
    expectedChoices: ["→", "↑", "↓"],
    expectedCorrectChoice: "→"
  },
  "math-spatial-above": {
    kind: "above",
    mode: "object_relation",
    relationOrTurn: "above",
    anchor: "📦",
    moving: "⚽",
    cue: "Perhatikan posisi bola terhadap kotak.",
    successText: "Bola berada di atas kotak.",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Bola berada di atas kotak. Posisi bola?",
    expectedChoices: ["di atas", "di bawah", "di dalam"],
    expectedCorrectChoice: "di atas"
  },
  "math-spatial-left": {
    kind: "left_of",
    mode: "object_relation",
    relationOrTurn: "left_of",
    anchor: "🤖",
    moving: "🐱",
    cue: "Perhatikan posisi kucing terhadap robot.",
    successText: "Kucing berada di kiri robot.",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Kucing ada di kiri robot. Posisi kucing?",
    expectedChoices: ["kiri", "kanan", "tengah"],
    expectedCorrectChoice: "kiri"
  },
  "math-spatial-inside": {
    kind: "inside",
    mode: "containment",
    relationOrTurn: "inside",
    anchor: "📦",
    moving: "🧸",
    cue: "Perhatikan posisi mainan terhadap kotak.",
    successText: "Mainan berada di dalam kotak.",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Mainan dimasukkan ke kotak. Mainan sekarang berada di mana?",
    expectedChoices: ["di dalam", "di atas", "di luar"],
    expectedCorrectChoice: "di dalam"
  },
  "math-spatial-near": {
    kind: "near",
    mode: "proximity",
    relationOrTurn: "near",
    anchor: "Paca",
    moving: "🚪 Pintu",
    secondaryAnchor: "🌳 Pohon",
    cue: "Bandingkan jarak Paca ke pintu dan ke pohon.",
    successText: "Pintu lebih dekat ke Paca daripada pohon.",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Paca berdiri dekat pintu dan jauh dari pohon. Apa yang lebih dekat ke Paca?",
    expectedChoices: ["pintu", "pohon", "sama"],
    expectedCorrectChoice: "pintu"
  },
  "math-spatial-between": {
    kind: "between",
    mode: "object_relation",
    relationOrTurn: "between",
    anchor: "Gavi",
    moving: "Paca",
    secondaryAnchor: "Zia",
    cue: "Perhatikan siapa yang berada di tengah susunan.",
    successText: "Paca berada di antara Gavi dan Zia.",
    expectedSubjectId: "math",
    expectedStageId: "math-ukur-ruang",
    expectedPrompt: "Urutannya Gavi — Paca — Zia. Siapa yang berada di antara Gavi dan Zia?",
    expectedChoices: ["Gavi", "Paca", "Zia"],
    expectedCorrectChoice: "Paca"
  }
};

export function spatialRelationBoardConfig(activity: LearningActivity | undefined): SpatialRelationBoardConfig | null {
  if (!activity || activity.runtime !== "tap_choice") return null;

  const config = CONFIGS[activity.id];
  if (!config) return null;

  if (activity.subjectId !== config.expectedSubjectId || activity.stageId !== config.expectedStageId) return null;

  const choices = activity.choices ?? [];
  const correct = activity.correctChoice ?? "";
  if (activity.prompt !== config.expectedPrompt) return null;
  if (choices.length !== 3 || new Set(choices).size !== 3) return null;
  if (choices.some((choice, index) => choice !== config.expectedChoices[index])) return null;
  if (correct !== config.expectedCorrectChoice || !choices.includes(correct)) return null;
  if (!config.mode || !config.relationOrTurn || !config.anchor || !config.moving || !config.cue || !config.successText) return null;
  if ((config.kind === "near" || (config.kind === "between" && config.expectedSubjectId === "math")) && !config.secondaryAnchor) return null;

  return config;
}

export function isSpatialRelationBoardActivity(activity: LearningActivity | undefined): boolean {
  return spatialRelationBoardConfig(activity) !== null;
}
