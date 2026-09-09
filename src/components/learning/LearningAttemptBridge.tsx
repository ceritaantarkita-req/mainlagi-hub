"use client";

import { useEffect } from "react";
import { getActivity, readProgress } from "@/lib/learning/system";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { readLearningAttempts, recordLearningAttempt } from "@/lib/learning/attempts";
import { syncLearningAttemptCloud } from "@/lib/learning/cloud";

const DUPLICATE_GUARD_MS = 1500;

export function LearningAttemptBridge({ childId }: { childId: string }) {
  useEffect(() => {
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (detail?.childId && detail.childId !== childId) return;
      const progress = readProgress(childId);
      const activityId = progress.lastActivityId;
      if (!activityId) return;
      const activity = getActivity(activityId);
      if (!activity) return;

      const now = Date.now();
      const recent = [...readLearningAttempts(childId)].reverse().find((attempt) => attempt.activityId === activityId);
      const recentAt = recent ? Date.parse(recent.completedAt) : Number.NaN;
      if (recent && Number.isFinite(recentAt) && now - recentAt >= 0 && now - recentAt < DUPLICATE_GUARD_MS) return;

      const spec = getActivityLearningSpec(activityId);
      const assessed = spec?.assessment === "assessed";
      const attempt = recordLearningAttempt({
        childId,
        activityId,
        subjectId: activity.subjectId,
        stageId: activity.stageId,
        runtime: activity.runtime,
        outcome: {
          status: "completed",
          assessed,
          accuracy: assessed ? 0.85 : null,
          score: assessed ? 0.85 : null,
          correctCount: assessed ? 1 : 0,
          inputMode: activity.preferredMobile,
          metadata: {
            source: "completion-bridge",
            evidenceFidelity: "completion_only"
          }
        }
      });
      void syncLearningAttemptCloud(attempt);
    };

    window.addEventListener("mainlagi-learning-progress", onProgress);
    return () => window.removeEventListener("mainlagi-learning-progress", onProgress);
  }, [childId]);

  return null;
}
