"use client";

import { useEffect, useState } from "react";
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

    const updateLocal = () => {
      if (!cancelled) setAnalytics(readLearningAnalytics(childId));
    };
    const updateCloud = async () => {
      const cloud = await readCloudLearningAnalytics(childId);
      if (!cancelled && cloud) setAnalytics(cloud);
    };
    const refresh = () => {
      updateLocal();
      void updateCloud();
    };

    const frame = window.requestAnimationFrame(refresh);
    const onAnalytics = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) refresh();
    };
    const onCloud = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void updateCloud();
    };

    window.addEventListener("mainlagi-learning-analytics", onAnalytics);
    window.addEventListener("mainlagi-learning-cloud", onCloud);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-analytics", onAnalytics);
      window.removeEventListener("mainlagi-learning-cloud", onCloud);
      window.removeEventListener("storage", refresh);
    };
  }, [childId]);

  return analytics;
}
