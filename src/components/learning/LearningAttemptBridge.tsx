"use client";

import { useEffect, useRef } from "react";
import { getActivity, readProgress } from "@/lib/learning/system";
import { getActivityLearningSpec } from "@/lib/learning/catalog";
import { readLearningAttempts, recordLearningAttempt, type LearningAttemptOutcome } from "@/lib/learning/attempts";
import { syncLearningAttemptCloud } from "@/lib/learning/cloud";

const DUPLICATE_GUARD_MS = 1500;

interface RuntimeStats {
  startedAt: number | null;
  correctCount: number;
  incorrectCount: number;
  retryCount: number;
  resetCount: number;
  selectedMatchPair: string | null;
}

function emptyStats(): RuntimeStats {
  return {
    startedAt: null,
    correctCount: 0,
    incorrectCount: 0,
    retryCount: 0,
    resetCount: 0,
    selectedMatchPair: null
  };
}

function activityIdFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  const index = parts.indexOf("activity");
  if (index < 0 || !parts[index + 1]) return null;
  try {
    return decodeURIComponent(parts[index + 1]);
  } catch {
    return parts[index + 1];
  }
}

function normalizedButtonLabel(button: HTMLButtonElement): string {
  return (button.textContent ?? "").replace(/^\s*✓\s*/, "").trim();
}

function measuredOutcome(activityId: string, stats: RuntimeStats): LearningAttemptOutcome {
  const activity = getActivity(activityId);
  const spec = getActivityLearningSpec(activityId);
  const completedAtMs = Date.now();
  const durationMs = stats.startedAt === null ? null : Math.max(0, completedAtMs - stats.startedAt);
  const base: LearningAttemptOutcome = {
    status: "completed",
    assessed: false,
    durationMs: durationMs ?? undefined,
    startedAt: stats.startedAt === null ? undefined : new Date(stats.startedAt).toISOString(),
    completedAt: new Date(completedAtMs).toISOString(),
    inputMode: activity?.preferredMobile,
    metadata: {
      source: "runtime-evidence-bridge",
      evidenceFidelity: "completion_only"
    }
  };

  if (!activity || spec?.assessment !== "assessed") return base;

  if (activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose") {
    const total = stats.correctCount + stats.incorrectCount;
    if (stats.correctCount < 1 || total < 1) return base;
    const accuracy = stats.correctCount / total;
    return {
      ...base,
      assessed: true,
      accuracy,
      score: accuracy,
      correctCount: stats.correctCount,
      incorrectCount: stats.incorrectCount,
      retryCount: stats.retryCount,
      metadata: {
        source: "runtime-evidence-bridge",
        evidenceFidelity: "choice_interaction"
      }
    };
  }

  if (activity.runtime === "matching") {
    const pairCount = Math.max(1, Math.ceil((activity.matchItems?.length ?? 0) / 2));
    const total = pairCount + stats.incorrectCount;
    const accuracy = pairCount / Math.max(1, total);
    return {
      ...base,
      assessed: true,
      accuracy,
      score: accuracy,
      correctCount: pairCount,
      incorrectCount: stats.incorrectCount,
      retryCount: stats.retryCount,
      metadata: {
        source: "runtime-evidence-bridge",
        evidenceFidelity: "matching_interaction"
      }
    };
  }

  if (activity.runtime === "trace" && activity.id === "math-trace-5-touch") {
    const accuracy = Math.max(0.5, 1 - Math.min(0.5, stats.resetCount * 0.1));
    return {
      ...base,
      assessed: true,
      accuracy,
      score: accuracy,
      correctCount: 1,
      incorrectCount: stats.resetCount,
      retryCount: stats.retryCount,
      metadata: {
        source: "runtime-evidence-bridge",
        evidenceFidelity: "guided_trace_completion_gate"
      }
    };
  }

  return base;
}

export function LearningAttemptBridge({ childId }: { childId: string }) {
  const statsRef = useRef<Map<string, RuntimeStats>>(new Map());

  useEffect(() => {
    const getStats = (activityId: string) => {
      const current = statsRef.current.get(activityId) ?? emptyStats();
      if (!statsRef.current.has(activityId)) statsRef.current.set(activityId, current);
      return current;
    };

    const touchStats = (stats: RuntimeStats) => {
      if (stats.startedAt === null) stats.startedAt = Date.now();
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest("button");
      if (!(button instanceof HTMLButtonElement)) return;
      const activityId = activityIdFromPath();
      if (!activityId) return;
      const activity = getActivity(activityId);
      if (!activity) return;
      const stats = getStats(activityId);
      const label = normalizedButtonLabel(button);

      if (activity.runtime === "tap_choice" || activity.runtime === "listen_and_choose") {
        if (!(activity.choices ?? []).includes(label)) return;
        touchStats(stats);
        if (label === activity.correctChoice) stats.correctCount += 1;
        else {
          stats.incorrectCount += 1;
          stats.retryCount += 1;
        }
        return;
      }

      if (activity.runtime === "matching") {
        if (button.className.includes("matchDone") || (button.textContent ?? "").trim().startsWith("✓")) return;
        const item = (activity.matchItems ?? []).find((candidate) => candidate.label === label);
        if (!item) return;
        touchStats(stats);
        if (button.className.includes("matchSelected")) {
          stats.selectedMatchPair = null;
          return;
        }
        if (stats.selectedMatchPair === null) {
          stats.selectedMatchPair = item.pair;
          return;
        }
        if (stats.selectedMatchPair === item.pair) stats.correctCount += 1;
        else {
          stats.incorrectCount += 1;
          stats.retryCount += 1;
        }
        stats.selectedMatchPair = null;
        return;
      }

      if (activity.runtime === "trace" && /^ulangi$/i.test(label)) {
        touchStats(stats);
        stats.resetCount += 1;
        stats.retryCount += 1;
      }
    };

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

      const stats = statsRef.current.get(activityId) ?? emptyStats();
      const attempt = recordLearningAttempt({
        childId,
        activityId,
        subjectId: activity.subjectId,
        stageId: activity.stageId,
        runtime: activity.runtime,
        outcome: measuredOutcome(activityId, stats)
      });
      statsRef.current.delete(activityId);

      void (async () => {
        const synced = await syncLearningAttemptCloud(attempt);
        if (synced) {
          window.dispatchEvent(new CustomEvent("mainlagi-learning-cloud", {
            detail: { childId, attemptId: attempt.id }
          }));
        }
      })();
    };

    document.addEventListener("click", onClickCapture, true);
    window.addEventListener("mainlagi-learning-progress", onProgress);
    return () => {
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("mainlagi-learning-progress", onProgress);
    };
  }, [childId]);

  return null;
}
