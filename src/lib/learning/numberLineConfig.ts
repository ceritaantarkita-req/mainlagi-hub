import type { LearningActivity } from "./system";

export type NumberLineDirection = "right" | "left" | "between";

export type NumberLineConfig = {
  min: number;
  max: number;
  contextValues: number[];
  direction: NumberLineDirection;
  cue: string;
};

const CONFIG: Record<string, NumberLineConfig> = {
  "math-order-next-1-2": {
    min: 1,
    max: 5,
    contextValues: [1, 2],
    direction: "right",
    cue: "Mulai dari 1, 2 lalu maju satu langkah."
  },
  "math-order-next-3-4": {
    min: 2,
    max: 6,
    contextValues: [3, 4],
    direction: "right",
    cue: "Mulai dari 3, 4 lalu maju satu langkah."
  },
  "math-order-before-6": {
    min: 3,
    max: 7,
    contextValues: [6],
    direction: "left",
    cue: "Cari angka tepat satu langkah sebelum 6."
  },
  "math-order-between-6-8": {
    min: 5,
    max: 9,
    contextValues: [6, 8],
    direction: "between",
    cue: "Cari angka yang berada di antara 6 dan 8."
  },
  "math-order-descend-5": {
    min: 2,
    max: 6,
    contextValues: [5, 4],
    direction: "left",
    cue: "Urutannya turun: 5, 4, lalu mundur satu langkah lagi."
  },
  "math-order-descend-10": {
    min: 7,
    max: 11,
    contextValues: [10, 9],
    direction: "left",
    cue: "Urutannya turun: 10, 9, lalu mundur satu langkah lagi."
  }
};

export function numberLineConfig(activity: LearningActivity | undefined): NumberLineConfig | null {
  if (!activity) return null;
  return CONFIG[activity.id] ?? null;
}

export function numberLineValues(config: NumberLineConfig): number[] {
  return Array.from({ length: config.max - config.min + 1 }, (_, index) => config.min + index);
}
