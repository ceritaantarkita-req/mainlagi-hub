"use client";

import { useEffect, useState } from "react";
import {
  emptyLearningAnalytics,
  readLearningAnalytics,
  type LearningAnalyticsSnapshot
} from "@/lib/learning/attempts";

export function useLearningAnalytics(childId: string): LearningAnalyticsSnapshot {
  const [analytics, setAnalytics] = useState<LearningAnalyticsSnapshot>(() => emptyLearningAnalytics());

  useEffect(() => {
    const update = () => setAnalytics(readLearningAnalytics(childId));
    const frame = window.requestAnimationFrame(update);
    const onAnalytics = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) update();
    };
    window.addEventListener("mainlagi-learning-analytics", onAnalytics);
    window.addEventListener("storage", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-analytics", onAnalytics);
      window.removeEventListener("storage", update);
    };
  }, [childId]);

  return analytics;
}
