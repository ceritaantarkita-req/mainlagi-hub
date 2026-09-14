import type { LearningActivity } from "./system";

export type BalanceSide = "left" | "equal" | "right";
export type ComparisonGoal = "more" | "less" | "equal";

export interface MoreLessBalanceConfig {
  goal: ComparisonGoal;
  cue: string;
  left: { label: string; token: string; count: number };
  right: { label: string; token: string; count: number };
  choiceToSide: Record<string, BalanceSide>;
}

const CONFIGS: Record<string, MoreLessBalanceConfig> = {
  "math-compare-more-2-4": {
    goal: "more",
    cue: "Pilih sisi yang punya benda lebih banyak.",
    left: { label: "2", token: "●", count: 2 },
    right: { label: "4", token: "●", count: 4 },
    choiceToSide: { "●●": "left", "●●●●": "right", "Sama": "equal" }
  },
  "math-compare-less-5-3": {
    goal: "less",
    cue: "Pilih sisi yang punya benda lebih sedikit.",
    left: { label: "5", token: "★", count: 5 },
    right: { label: "3", token: "★", count: 3 },
    choiceToSide: { "★★★★★": "left", "★★★": "right", "Sama": "equal" }
  },
  "math-compare-equal-4-4": {
    goal: "equal",
    cue: "Bandingkan kedua sisi. Apakah jumlahnya sama?",
    left: { label: "4 apel", token: "🍎", count: 4 },
    right: { label: "4 pisang", token: "🍌", count: 4 },
    choiceToSide: { "Kiri lebih banyak": "left", "Sama": "equal", "Kanan lebih banyak": "right" }
  },
  "math-compare-more-6-5": {
    goal: "more",
    cue: "Pilih sisi dengan jumlah lebih besar.",
    left: { label: "6", token: "●", count: 6 },
    right: { label: "5", token: "●", count: 5 },
    choiceToSide: { "6": "left", "5": "right", "Sama": "equal" }
  },
  "math-compare-less-7-9": {
    goal: "less",
    cue: "Pilih sisi dengan jumlah lebih kecil.",
    left: { label: "7", token: "●", count: 7 },
    right: { label: "9", token: "●", count: 9 },
    choiceToSide: { "7": "left", "9": "right", "Sama": "equal" }
  },
  "math-compare-more-10-8": {
    goal: "more",
    cue: "Pilih sisi dengan jumlah lebih besar.",
    left: { label: "10", token: "●", count: 10 },
    right: { label: "8", token: "●", count: 8 },
    choiceToSide: { "10": "left", "8": "right", "Sama": "equal" }
  }
};

export function moreLessBalanceConfig(activity: LearningActivity | undefined): MoreLessBalanceConfig | null {
  if (!activity) return null;
  const config = CONFIGS[activity.id];
  if (!config) return null;
  const choices = activity.choices ?? [];
  if (choices.length !== 3 || !activity.correctChoice || !choices.includes(activity.correctChoice)) return null;
  if (choices.some((choice) => !config.choiceToSide[choice])) return null;
  return config;
}

export function balanceChoiceForSide(activity: LearningActivity, config: MoreLessBalanceConfig, side: BalanceSide): string | null {
  return (activity.choices ?? []).find((choice) => config.choiceToSide[choice] === side) ?? null;
}
