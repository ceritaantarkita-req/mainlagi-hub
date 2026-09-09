"use client";

import { useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import {
  emptyLearningAnalytics,
  readLearningAnalytics,
  type LearningAnalyticsSnapshot
} from "@/lib/learning/attempts";
import { readCloudLearningAnalytics } from "@/lib/learning/cloud";

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

      const cloud = await readCloudLearningAnalytics(childId);
      if (!cancelled) setAnalytics(cloud ?? emptyLearningAnalytics());
    };

    const frame = window.requestAnimationFrame(() => void refresh());
    const onAnalytics = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void refresh();
    };

    window.addEventListener("mainlagi-learning-analytics", onAnalytics);
    window.addEventListener("mainlagi-learning-cloud", onAnalytics);
    window.addEventListener("storage", onAnalytics);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-analytics", onAnalytics);
      window.removeEventListener("mainlagi-learning-cloud", onAnalytics);
      window.removeEventListener("storage", onAnalytics);
    };
  }, [childId]);

  return analytics;
}
