"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/auth/supabase-client";
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

interface LearningAnalyticsState {
  childId: string;
  analytics: LearningAnalyticsSnapshot;
  ready: boolean;
  status: "loading" | "ready" | "unavailable";
}

export function useLearningAnalyticsState(childId: string) {
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [state, setState] = useState<LearningAnalyticsState>(() => ({
    childId,
    analytics: emptyLearningAnalytics(),
    ready: false,
    status: "loading"
  }));

  useEffect(() => {
    let cancelled = false;
    let generation = 0;
    const client = getBrowserClient();

    const refresh = async () => {
      const request = ++generation;
      const current = () => !cancelled && request === generation;
      setState({ childId, analytics: emptyLearningAnalytics(), ready: false, status: "loading" });
      try {
        // A failed session refresh is not a guest session. Keep cloud failures
        // distinct from intentional local-only play, including expired tokens.
        const session = client ? await client.auth.getSession() : null;
        if (!current()) return;
        if (session?.error) throw session.error;
        if (!session?.data.session) {
          setState({ childId, analytics: readLearningAnalytics(childId), ready: true, status: "ready" });
          return;
        }
        const [cloud, pending] = await Promise.all([
          readCloudLearningAnalytics(childId),
          readPendingLearningAttemptsForCurrentUser(childId)
        ]);
        if (!current()) return;
        if (!cloud) throw new Error("Learning analytics unavailable");
        setState({ childId, analytics: overlayPendingLearningAnalytics(cloud, pending), ready: true, status: "ready" });
      } catch {
        if (current()) setState({ childId, analytics: emptyLearningAnalytics(), ready: false, status: "unavailable" });
      }
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
    window.addEventListener("online", onAnalytics);
    // Defer auth work outside Supabase's callback/lock, and invalidate older
    // requests immediately so a prior account cannot publish a late result.
    let authFrame: number | null = null;
    const subscription = client?.auth.onAuthStateChange(() => {
      generation++;
      setState({ childId, analytics: emptyLearningAnalytics(), ready: false, status: "loading" });
      if (authFrame !== null) window.cancelAnimationFrame(authFrame);
      authFrame = window.requestAnimationFrame(() => void refresh());
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-analytics", onAnalytics);
      window.removeEventListener("mainlagi-learning-cloud", onAnalytics);
      window.removeEventListener(LEARNING_OUTBOX_EVENT, onAnalytics);
      window.removeEventListener("storage", onAnalytics);
      window.removeEventListener("online", onAnalytics);
      if (authFrame !== null) window.cancelAnimationFrame(authFrame);
      subscription?.data.subscription.unsubscribe();
    };
  }, [childId, refreshVersion]);

  const retry = () => setRefreshVersion((value) => value + 1);
  if (state.childId !== childId) {
    return { analytics: emptyLearningAnalytics(), ready: false, status: "loading" as const, retry };
  }
  return { analytics: state.analytics, ready: state.ready, status: state.status, retry };
}

export function useLearningAnalytics(childId: string): LearningAnalyticsSnapshot {
  return useLearningAnalyticsState(childId).analytics;
}
