"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { audioStatus, speakPrompt, stopSpeech, unlockAudio } from "@/lib/audio/feedback";
import { getActivity } from "@/lib/learning/system";

/**
 * Keeps speech lifecycle aligned with navigation and gives AudioManager one
 * product-level user-gesture warmup boundary.
 *
 * The first pointer/keyboard gesture only unlocks and schedules silent warmup;
 * it never captures microphone input or uploads audio. Route changes stop stale
 * queued speech so instructions from the previous activity cannot leak into the
 * next screen.
 */
export function AudioRouteBridge() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true, capture: true });
    window.addEventListener("keydown", unlock, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      stopSpeech();
      previousPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const match = pathname.match(/^\/child\/[^/]+\/activity\/([^/]+)$/);
    const activity = match ? getActivity(match[1]) : undefined;
    if (!activity || activity.runtime === "motion_game") return;
    // Route cancellation above runs first. Defer until the new screen has
    // mounted, and never attempt autoplay before a real browser gesture.
    let narrated = false;
    const narrate = () => {
      if (narrated || !audioStatus().unlocked || audioStatus().muted) return;
      narrated = true;
      speakPrompt(activity.creativePrompt ?? activity.prompt ?? activity.title, {
        lang: activity.subjectId === "english" ? "en-US" : "id-ID",
        key: `activity-entry:${activity.id}`
      });
    };
    const frame = requestAnimationFrame(narrate);
    const afterGesture = () => { unlockAudio(); narrate(); };
    window.addEventListener("pointerdown", afterGesture, { once: true });
    window.addEventListener("keydown", afterGesture, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", afterGesture);
      window.removeEventListener("keydown", afterGesture);
    };
  }, [pathname]);

  return null;
}
