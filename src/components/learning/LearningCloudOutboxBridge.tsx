"use client";

import { useEffect } from "react";
import { flushLearningAttemptOutbox } from "@/lib/learning/outbox";

const FLUSH_INTERVAL_MS = 60_000;

/**
 * Runs outside individual child activities so queued attempts continue syncing
 * after navigation. It never stores credentials; the outbox is bound to the
 * current Supabase session user id and sync uses the normal auth facade.
 */
export function LearningCloudOutboxBridge() {
  useEffect(() => {
    const flush = (force = false) => {
      void flushLearningAttemptOutbox({ force });
    };

    const frame = window.requestAnimationFrame(() => flush(false));
    const onOnline = () => flush(true);
    const onFocus = () => flush(false);
    const onVisibility = () => {
      if (document.visibilityState === "visible") flush(false);
    };
    const interval = window.setInterval(() => flush(false), FLUSH_INTERVAL_MS);

    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
