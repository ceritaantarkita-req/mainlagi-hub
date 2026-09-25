"use client";

import { useEffect, useState } from "react";
import {
  readCloudMoneyWorldProgress,
  syncMoneyWorldProgressCloud
} from "@/lib/learning/world/cloud";
import { MONEY_WORLD_ID } from "@/lib/learning/world/moneyWorld";
import {
  WORLD_PROGRESS_EVENT,
  moneyWorldProgressTimestamp,
  readMoneyWorldProgress,
  replaceMoneyWorldProgress,
  type MoneyWorldProgress
} from "@/lib/learning/world/progress";

const EMPTY_PROGRESS: MoneyWorldProgress = {
  worldId: MONEY_WORLD_ID,
  completedStageIds: [],
  currentStageId: null,
  currentSegmentIndex: 0,
  updatedAt: ""
};

export function useMoneyWorldProgress(childId: string) {
  const [progress, setProgress] = useState<MoneyWorldProgress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      setProgress(readMoneyWorldProgress(childId));
      setReady(true);
    };

    const hydrateCloud = async () => {
      try {
        const cloud = await readCloudMoneyWorldProgress(childId);
        if (cancelled || !cloud) return;

        const local = readMoneyWorldProgress(childId);
        const cloudCompleted = cloud.completedStageIds.length;
        const localCompleted = local.completedStageIds.length;
        const cloudIsNewer = cloudCompleted > localCompleted
          || (cloudCompleted === localCompleted && moneyWorldProgressTimestamp(cloud) > moneyWorldProgressTimestamp(local));

        if (cloudIsNewer) {
          replaceMoneyWorldProgress(childId, cloud);
          return;
        }

        const localIsNewer = localCompleted > cloudCompleted
          || (localCompleted === cloudCompleted && moneyWorldProgressTimestamp(local) > moneyWorldProgressTimestamp(cloud));
        if (localIsNewer) void syncMoneyWorldProgressCloud(childId, local);
      } finally {
        if (!cancelled) setSettled(true);
      }
    };

    const frame = window.requestAnimationFrame(() => {
      setSettled(false);
      refresh();
      void hydrateCloud();
    });
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) refresh();
    };
    const onOnline = () => { void hydrateCloud(); };
    window.addEventListener(WORLD_PROGRESS_EVENT, onProgress);
    window.addEventListener("storage", refresh);
    window.addEventListener("online", onOnline);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener(WORLD_PROGRESS_EVENT, onProgress);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("online", onOnline);
    };
  }, [childId]);

  return { progress, ready, settled };
}
