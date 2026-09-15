import type { LearningActivity } from "./system";

export type TransitiveChainConfig = {
  nodes: [string, string, string];
  relationLabel: string;
  questionLabel: string;
  choiceLabels: Record<string, string>;
  successText: string;
};

const CONFIGS: Record<string, TransitiveChainConfig> = {
  "logic-transitive-height-abc": {
    nodes: ["A", "B", "C"],
    relationLabel: "lebih tinggi dari",
    questionLabel: "Siapa paling tinggi?",
    choiceLabels: { A: "A", B: "B", C: "C" },
    successText: "A lebih tinggi dari B, dan B lebih tinggi dari C. Jadi A paling tinggi."
  },
  "logic-transitive-shortest-xyz": {
    nodes: ["X", "Y", "Z"],
    relationLabel: "lebih panjang dari",
    questionLabel: "Siapa paling pendek?",
    choiceLabels: { Z: "Z", Y: "Y", X: "X" },
    successText: "X lebih panjang dari Y, dan Y lebih panjang dari Z. Jadi Z paling pendek."
  },
  "logic-transitive-most-dots": {
    nodes: ["P", "Q", "R"],
    relationLabel: "lebih banyak titik dari",
    questionLabel: "Kotak mana paling banyak?",
    choiceLabels: { P: "P", Q: "Q", R: "R" },
    successText: "P lebih banyak dari Q, dan Q lebih banyak dari R. Jadi P paling banyak."
  },
  "logic-transitive-lightest": {
    nodes: ["A", "B", "C"],
    relationLabel: "lebih berat dari",
    questionLabel: "Mana yang paling ringan?",
    choiceLabels: { C: "C", B: "B", A: "A" },
    successText: "A lebih berat dari B, dan B lebih berat dari C. Jadi C paling ringan."
  },
  "logic-transitive-middle-order": {
    nodes: ["Merah", "Kuning", "Hijau"],
    relationLabel: "lebih besar dari",
    questionLabel: "Mana ukuran tengah?",
    choiceLabels: { kuning: "Kuning", merah: "Merah", hijau: "Hijau" },
    successText: "Merah lebih besar dari kuning, dan kuning lebih besar dari hijau. Jadi kuning berada di tengah."
  }
};

export function transitiveChainConfig(activity: LearningActivity | undefined): TransitiveChainConfig | null {
  if (!activity) return null;
  return CONFIGS[activity.id] ?? null;
}
