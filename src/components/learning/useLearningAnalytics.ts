"use client";

import { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import {
  emptyLearningAnalytics,
  readLearningAnalytics,
  type LearningAnalyticsSnapshot
} from "@/lib/learning/attempts";
import { readCloudLearningAnalytics } from "@/lib/learning/cloud";
import {
  LEARNING_OUTBOX_EVENT,
  overlayPendingLearningAnalytics,
  readPendingLearningAttemptsForCurrentUser
} from "@/lib/learning/outbox";

export function useLearningAnalytics(childId: string): LearningAnalyticsSnapshot {
  const [analytics, setAnalytics] = useState<LearningAnalyticsSnapshot>(() => emptyLearningAnalytics());

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setAnalytics(readLearningAnalytics(childId));
        return;
      }

      const [cloud, pending] = await Promise.all([
        readCloudLearningAnalytics(childId),
        readPendingLearningAttemptsForCurrentUser(childId)
      ]);
      if (cancelled) return;
      setAnalytics(cloud ? overlayPendingLearningAnalytics(cloud, pending) : readLearningAnalytics(childId));
    };

    const frame = window.requestAnimationFrame(() => void refresh());
    const onAnalytics = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void refresh();
    };

    window.addEventListener("mainlagi-learning-analytics", onAnalytics);
    window.addEventListener("mainlagi-learning-cloud", onAnalytics);
    window.addEventListener(LEARNING_OUTBOX_EVENT, onAnalytics);
    window.addEventListener("storage", onAnalytics);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-analytics", onAnalytics);
      window.removeEventListener("mainlagi-learning-cloud", onAnalytics);
      window.removeEventListener(LEARNING_OUTBOX_EVENT, onAnalytics);
      window.removeEventListener("storage", onAnalytics);
    };
  }, [childId]);

  return analytics;
}
