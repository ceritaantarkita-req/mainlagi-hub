"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getActivity } from "@/lib/learning/system";
import { getUnlockedStageIds } from "@/lib/learning/insights";
import { useLearningProgress } from "./LearningCommon";
import { useLearningAnalytics } from "./useLearningAnalytics";

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
  const progress = useLearningProgress(childId);
  const analytics = useLearningAnalytics(childId);

  useEffect(() => {
    const directStage = stageFromPath(pathname);
    const activityId = activityFromPath(pathname);
    const activityStage = activityId ? getActivity(activityId)?.stageId ?? null : null;
    const targetStage = directStage ?? activityStage;
    if (!targetStage) return;

    const unlocked = getUnlockedStageIds(progress, analytics);
    if (unlocked.has(targetStage)) return;
    router.replace(`/child/${childId}/learn`);
  }, [analytics, childId, pathname, progress, router]);

  return null;
}
