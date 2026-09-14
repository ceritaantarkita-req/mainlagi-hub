"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getActivity, getStage } from "@/lib/learning/system";
import { getUnlockedStageIds } from "@/lib/learning/insights";
import { useLearningProgressState } from "./LearningCommon";
import { useLearningAnalyticsState } from "./useLearningAnalytics";

function stageFromPath(pathname: string): string | null {
  const match = pathname.match(/\/stage\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function activityFromPath(pathname: string): string | null {
  const match = pathname.match(/\/activity\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function LearningProgressionGuard({ childId }: { childId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const progressState = useLearningProgressState(childId);
  const analyticsState = useLearningAnalyticsState(childId);

  useEffect(() => {
    if (!progressState.ready || !analyticsState.ready) return;

    const directStage = stageFromPath(pathname);
    const activityId = activityFromPath(pathname);
    const activityStage = activityId ? getActivity(activityId)?.stageId ?? null : null;
    const targetStage = directStage ?? activityStage;
    if (!targetStage) return;

    const unlocked = getUnlockedStageIds(progressState.progress, analyticsState.analytics);
    if (unlocked.has(targetStage)) return;
    const subjectId = getStage(targetStage)?.subjectId ?? (activityId ? getActivity(activityId)?.subjectId : null);
    router.replace(subjectId ? `/child/${childId}/subject/${subjectId}` : `/child/${childId}/home#choose-subject`);
  }, [analyticsState.analytics, analyticsState.ready, childId, pathname, progressState.progress, progressState.ready, router]);

  return null;
}
