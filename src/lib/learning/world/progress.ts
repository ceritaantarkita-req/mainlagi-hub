"use client";

import { MONEY_WORLD_ID, MONEY_WORLD_STAGES, getMoneyWorldStage } from "./moneyWorld";

const WORLD_PROGRESS_KEY = "mainlagi-world-progress-v1";
export const WORLD_PROGRESS_EVENT = "mainlagi-world-progress";

export interface MoneyWorldProgress {
  worldId: typeof MONEY_WORLD_ID;
  completedStageIds: string[];
  currentStageId: string | null;
  currentSegmentIndex: number;
  updatedAt: string;
}

const EMPTY_PROGRESS: MoneyWorldProgress = {
  worldId: MONEY_WORLD_ID,
  completedStageIds: [],
  currentStageId: null,
  currentSegmentIndex: 0,
  updatedAt: ""
};

type WorldProgressStore = Record<string, Record<string, MoneyWorldProgress>>;

function readStore(): WorldProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WORLD_PROGRESS_KEY) ?? "{}") as WorldProgressStore;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeProgress(value: MoneyWorldProgress | undefined): MoneyWorldProgress {
  if (!value || value.worldId !== MONEY_WORLD_ID) return { ...EMPTY_PROGRESS };
  const validStageIds = new Set(MONEY_WORLD_STAGES.map((stage) => stage.id));
  const completedStageIds = Array.isArray(value.completedStageIds)
    ? [...new Set(value.completedStageIds.filter((stageId) => validStageIds.has(stageId)))]
    : [];
  return {
    worldId: MONEY_WORLD_ID,
    completedStageIds,
    currentStageId: value.currentStageId && validStageIds.has(value.currentStageId) ? value.currentStageId : null,
    currentSegmentIndex: Number.isInteger(value.currentSegmentIndex) && value.currentSegmentIndex >= 0 ? value.currentSegmentIndex : 0,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : ""
  };
}

function writeProgress(childId: string, progress: MoneyWorldProgress): MoneyWorldProgress {
  if (typeof window === "undefined") return progress;
  const store = readStore();
  const child = store[childId] ?? {};
  child[MONEY_WORLD_ID] = progress;
  store[childId] = child;
  window.localStorage.setItem(WORLD_PROGRESS_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(WORLD_PROGRESS_EVENT, {
    detail: { childId, worldId: MONEY_WORLD_ID }
  }));
  return progress;
}

export function readMoneyWorldProgress(childId: string): MoneyWorldProgress {
  if (!childId || typeof window === "undefined") return { ...EMPTY_PROGRESS };
  return normalizeProgress(readStore()[childId]?.[MONEY_WORLD_ID]);
}

export function checkpointMoneyWorldStage(
  childId: string,
  stageId: string,
  segmentIndex: number
): MoneyWorldProgress {
  const current = readMoneyWorldProgress(childId);
  return writeProgress(childId, {
    ...current,
    currentStageId: stageId,
    currentSegmentIndex: Math.max(0, Math.round(segmentIndex)),
    updatedAt: new Date().toISOString()
  });
}

export function completeMoneyWorldStage(childId: string, stageId: string): MoneyWorldProgress {
  const current = readMoneyWorldProgress(childId);
  const completedStageIds = current.completedStageIds.includes(stageId)
    ? current.completedStageIds
    : [...current.completedStageIds, stageId];
  return writeProgress(childId, {
    ...current,
    completedStageIds,
    currentStageId: null,
    currentSegmentIndex: 0,
    updatedAt: new Date().toISOString()
  });
}

export function restartMoneyWorldStage(childId: string, stageId: string): MoneyWorldProgress {
  const current = readMoneyWorldProgress(childId);
  return writeProgress(childId, {
    ...current,
    currentStageId: stageId,
    currentSegmentIndex: 0,
    updatedAt: new Date().toISOString()
  });
}

export function isMoneyWorldStageUnlocked(progress: MoneyWorldProgress, stageId: string): boolean {
  const stage = getMoneyWorldStage(stageId);
  if (!stage) return false;
  if (stage.order === 1) return true;
  const previous = MONEY_WORLD_STAGES.find((item) => item.order === stage.order - 1);
  return Boolean(previous && progress.completedStageIds.includes(previous.id));
}

export function moneyWorldStars(progress: MoneyWorldProgress, stageId: string): 0 | 3 {
  return progress.completedStageIds.includes(stageId) ? 3 : 0;
}
