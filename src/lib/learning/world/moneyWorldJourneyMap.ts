import {
  MONEY_WORLD_CHAPTERS,
  MONEY_WORLD_ID,
  MONEY_WORLD_STAGES
} from "./moneyWorld";
import {
  isMoneyWorldStageUnlocked,
  moneyWorldStars,
  type MoneyWorldProgress
} from "./progress";

export const MONEY_WORLD_JOURNEY_MAP_VERSION = "money-world-journey-map-v1";

export type MoneyWorldJourneyStageState = "completed" | "current" | "open" | "locked";

export interface MoneyWorldJourneyMapStage {
  id: string;
  order: number;
  chapterId: string;
  title: string;
  subtitle: string;
  emoji: string;
  locationLabel: string;
  href: string;
  playable: boolean;
  completed: boolean;
  current: boolean;
  open: boolean;
  locked: boolean;
  stars: 0 | 3;
  canonicalSourceState: MoneyWorldJourneyStageState;
}

export interface MoneyWorldJourneyMapChapter {
  id: string;
  order: number;
  title: string;
  stageIds: readonly string[];
  completedStageCount: number;
  totalStageCount: number;
  completed: boolean;
}

export interface MoneyWorldJourneyMapModel {
  version: typeof MONEY_WORLD_JOURNEY_MAP_VERSION;
  worldId: typeof MONEY_WORLD_ID;
  title: "Petualangan Uang";
  href: string;
  ready: boolean;
  completed: boolean;
  completedStageCount: number;
  totalStageCount: number;
  nextStageId: string | null;
  resumeStageId: string | null;
  resumeSegmentIndex: number;
  chapters: MoneyWorldJourneyMapChapter[];
  stages: MoneyWorldJourneyMapStage[];
}

export function buildMoneyWorldJourneyMap(args: {
  childId: string;
  progress: MoneyWorldProgress;
  ready: boolean;
}): MoneyWorldJourneyMapModel {
  const mapHref = "/child/" + encodeURIComponent(args.childId) + "/world/" + MONEY_WORLD_ID;
  const completedStageIds = new Set(args.progress.completedStageIds);
  const nextStageId = args.ready
    ? MONEY_WORLD_STAGES.find((stage) => !completedStageIds.has(stage.id))?.id ?? null
    : null;

  const chapters = MONEY_WORLD_CHAPTERS.map((chapter, index) => {
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

  const stages = MONEY_WORLD_STAGES.map((stage) => {
    const completed = completedStageIds.has(stage.id);
    const unlocked = args.ready && isMoneyWorldStageUnlocked(args.progress, stage.id);
    const current = Boolean(args.ready && !completed && stage.id === nextStageId);
    const open = Boolean(unlocked && !completed && !current);
    const locked = !unlocked;
    const canonicalSourceState: MoneyWorldJourneyStageState = completed
      ? "completed"
      : current
        ? "current"
        : open
          ? "open"
          : "locked";

    return {
      ...stage,
      href: mapHref + "/stage/" + encodeURIComponent(stage.id),
      completed,
      current,
      open,
      locked,
      stars: moneyWorldStars(args.progress, stage.id),
      canonicalSourceState
    };
  });

  return {
    version: MONEY_WORLD_JOURNEY_MAP_VERSION,
    worldId: MONEY_WORLD_ID,
    title: "Petualangan Uang",
    href: mapHref,
    ready: args.ready,
    completed: args.ready && completedStageIds.size === MONEY_WORLD_STAGES.length,
    completedStageCount: args.ready ? completedStageIds.size : 0,
    totalStageCount: MONEY_WORLD_STAGES.length,
    nextStageId,
    resumeStageId: args.ready ? args.progress.currentStageId : null,
    resumeSegmentIndex: args.ready ? args.progress.currentSegmentIndex : 0,
    chapters,
    stages
  };
}
