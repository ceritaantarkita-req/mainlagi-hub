import {
  MONEY_WORLD_CHAPTERS,
  MONEY_WORLD_ID,
  MONEY_WORLD_STAGES
} from "./moneyWorld";
import {
  isMoneyWorldStageUnlocked,
  moneyWorldStars,
  normalizeMoneyWorldProgress,
  type MoneyWorldProgress
} from "./progress";

export const MONEY_WORLD_JOURNEY_MAP_VERSION = "money-world-journey-map-v1";

export type MoneyWorldJourneyStageState = "completed" | "current" | "open" | "locked";

export interface MoneyWorldJourneyChapter {
  id: string;
  order: number;
  title: string;
  stageIds: readonly string[];
  completedStageCount: number;
  totalStageCount: number;
  completed: boolean;
}

export interface MoneyWorldJourneyStage {
  id: string;
  order: number;
  chapterId: string;
  title: string;
  subtitle: string;
  locationLabel: string;
  emoji: string;
  href: string;
  playable: boolean;
  completed: boolean;
  current: boolean;
  open: boolean;
  locked: boolean;
  stars: 0 | 3;
  canonicalSourceState: MoneyWorldJourneyStageState;
}

export interface MoneyWorldJourneyMapModel {
  version: typeof MONEY_WORLD_JOURNEY_MAP_VERSION;
  worldId: typeof MONEY_WORLD_ID;
  title: "Petualangan Uang";
  href: string;
  completed: boolean;
  completedStageCount: number;
  totalStageCount: number;
  nextStageId: string | null;
  resumeStageId: string | null;
  resumeSegmentIndex: number;
  chapters: MoneyWorldJourneyChapter[];
  stages: MoneyWorldJourneyStage[];
}

export function buildMoneyWorldJourneyMap({
  childId,
  progress
}: {
  childId: string;
  progress: MoneyWorldProgress;
}): MoneyWorldJourneyMapModel {
  const canonicalProgress = normalizeMoneyWorldProgress(progress);
  const completedStageIds = new Set(canonicalProgress.completedStageIds);
  const nextStage = MONEY_WORLD_STAGES.find((stage) => !completedStageIds.has(stage.id)) ?? null;
  const mapBase = "/child/" + encodeURIComponent(childId) + "/world/" + MONEY_WORLD_ID;

  const stages = MONEY_WORLD_STAGES.map((stage): MoneyWorldJourneyStage => {
    const completed = completedStageIds.has(stage.id);
    const current = stage.id === nextStage?.id;
    const open = isMoneyWorldStageUnlocked(canonicalProgress, stage.id);
    const locked = !open && !completed;
    const canonicalSourceState: MoneyWorldJourneyStageState = completed
      ? "completed"
      : current
        ? "current"
        : locked
          ? "locked"
          : "open";

    return {
      ...stage,
      href: mapBase + "/stage/" + encodeURIComponent(stage.id),
      completed,
      current,
      open,
      locked,
      stars: moneyWorldStars(canonicalProgress, stage.id),
      canonicalSourceState
    };
  });

  const chapters = MONEY_WORLD_CHAPTERS.map((chapter, index): MoneyWorldJourneyChapter => {
    const completedStageCount = chapter.stageIds.filter((stageId) => completedStageIds.has(stageId)).length;
    return {
      id: chapter.id,
      order: index + 1,
      title: chapter.title,
      stageIds: chapter.stageIds,
      completedStageCount,
      totalStageCount: chapter.stageIds.length,
      completed: completedStageCount === chapter.stageIds.length
    };
  });

  return {
    version: MONEY_WORLD_JOURNEY_MAP_VERSION,
    worldId: MONEY_WORLD_ID,
    title: "Petualangan Uang",
    href: mapBase,
    completed: canonicalProgress.completedStageIds.length === MONEY_WORLD_STAGES.length,
    completedStageCount: canonicalProgress.completedStageIds.length,
    totalStageCount: MONEY_WORLD_STAGES.length,
    nextStageId: nextStage?.id ?? null,
    resumeStageId: canonicalProgress.currentStageId,
    resumeSegmentIndex: canonicalProgress.currentSegmentIndex,
    chapters,
    stages
  };
}
