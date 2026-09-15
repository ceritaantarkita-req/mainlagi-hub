import type { LearningActivity } from "./system";

export type SpatialTransformConfig = {
  startDirection: "up" | "right" | "down" | "left";
  startArrow: string;
  transformKind: "rotation" | "mirror";
  turnDirection?: "left" | "right";
  quarterTurns?: 1 | 2;
  mirrorAxis?: "vertical";
  operationLabel: string;
  operationHint: string;
  choiceArrows: Record<string, string>;
  successText: string;
};

const CONFIGS: Record<string, SpatialTransformConfig> = {
  "logic-spatial-halfturn-up": {
    startDirection: "up",
    startArrow: "↑",
    transformKind: "rotation",
    turnDirection: "right",
    quarterTurns: 2,
    operationLabel: "½ putaran · 180°",
    operationHint: "Dua seperempat putaran",
    choiceArrows: { "bawah ↓": "↓", "kanan →": "→", "kiri ←": "←" },
    successText: "Panah atas setelah setengah putaran mengarah ke bawah."
  },
  "logic-spatial-quarterturn-left": {
    startDirection: "up",
    startArrow: "↑",
    transformKind: "rotation",
    turnDirection: "left",
    quarterTurns: 1,
    operationLabel: "¼ putaran ke kiri · 90°",
    operationHint: "Belok satu langkah ke kiri",
    choiceArrows: { "kiri ←": "←", "kanan →": "→", "bawah ↓": "↓" },
    successText: "Panah atas yang diputar seperempat ke kiri mengarah ke kiri."
  },
  "logic-spatial-quarterturn-right-down": {
    startDirection: "down",
    startArrow: "↓",
    transformKind: "rotation",
    turnDirection: "right",
    quarterTurns: 1,
    operationLabel: "¼ putaran ke kanan · 90°",
    operationHint: "Belok satu langkah ke kanan",
    choiceArrows: { "kiri ←": "←", "kanan →": "→", "atas ↑": "↑" },
    successText: "Dari arah bawah, seperempat putaran ke kanan berakhir ke kiri."
  },
  "logic-spatial-two-right-turns": {
    startDirection: "left",
    startArrow: "←",
    transformKind: "rotation",
    turnDirection: "right",
    quarterTurns: 2,
    operationLabel: "Belok kanan ×2",
    operationHint: "Dua kali seperempat putaran",
    choiceArrows: { "kanan →": "→", "atas ↑": "↑", "bawah ↓": "↓" },
    successText: "Dua belokan kanan dari kiri berakhir menghadap kanan."
  },
  "logic-spatial-mirror-left-right": {
    startDirection: "right",
    startArrow: "→",
    transformKind: "mirror",
    mirrorAxis: "vertical",
    operationLabel: "Cermin kiri ↔ kanan",
    operationHint: "Pantulkan melewati garis tegak",
    choiceArrows: { "kiri ←": "←", "atas ↑": "↑", "bawah ↓": "↓" },
    successText: "Pantulan kiri-kanan membalik panah kanan menjadi panah kiri."
  }
};

export function spatialTransformConfig(activity: LearningActivity | undefined): SpatialTransformConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || new Set(choices).size !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (new Set(Object.keys(config.choiceArrows)).size !== choices.length || choices.some((choice) => !config.choiceArrows[choice])) return null;
  if (config.transformKind === "rotation" && (!config.turnDirection || !config.quarterTurns)) return null;
  if (config.transformKind === "mirror" && config.mirrorAxis !== "vertical") return null;
  return config;
}
