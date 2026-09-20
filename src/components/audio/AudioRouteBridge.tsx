"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  audioStatus,
  speakPrompt,
  stopSpeech,
  unlockAudio,
  warmAudio
} from "@/lib/audio/feedback";
import {
  markActivityAudioIntent,
  observeActivityEntrySpeech
} from "@/lib/audio/activityEntry";
import { getActivity } from "@/lib/learning/system";

function activityFromGestureTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return undefined;
  const anchor = target.closest<HTMLAnchorElement>('a[href*="/activity/"]');
  if (!anchor) return undefined;

  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return undefined;
    const match = url.pathname.match(/^\/child\/[^/]+\/activity\/([^/]+)$/);
    return match ? getActivity(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

function activityLocale(subjectId: string) {
  return subjectId === "english" ? "en-US" : "id-ID";
}

/**
 * Keeps speech lifecycle aligned with navigation and gives AudioManager one
 * product-level user-gesture warmup boundary.
 *
 * Activity-link gestures additionally warm the correct language before route
 * transition. Route changes stop stale queued speech so instructions from the
 * previous activity cannot leak into the next screen.
 */
export function AudioRouteBridge() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const prepareGesture = (event: Event) => {
      if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key)) return;
      const activity = activityFromGestureTarget(event.target);
      if (activity) {
        markActivityAudioIntent(activity.id);
        warmAudio(activityLocale(activity.subjectId));
        return;
      }
      if (!audioStatus().unlocked) unlockAudio();
    };

    window.addEventListener("pointerdown", prepareGesture, { capture: true });
    window.addEventListener("keydown", prepareGesture, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", prepareGesture, { capture: true });
      window.removeEventListener("keydown", prepareGesture, { capture: true });
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
    if (!activity || activity.runtime === "motion_game" || activity.runtime === "listen_and_choose") return;

    const lang = activityLocale(activity.subjectId);
    const narration = activity.creativePrompt ?? activity.prompt ?? activity.title;
    let narrated = false;

    const narrate = () => {
      if (narrated || !audioStatus().unlocked || audioStatus().muted) return;
      const status = observeActivityEntrySpeech({
        activityId: activity.id,
        lang,
        textLength: narration.trim().length,
        request: () => speakPrompt(narration, {
          lang,
          key: `activity-entry:${activity.id}`
        })
      });
      narrated = status === "spoken";
    };

    // useEffect already runs after the activity screen commits. Starting here
    // avoids an extra animation-frame delay on every activity entry.
    narrate();

    const afterGesture = () => {
      warmAudio(lang);
      narrate();
    };
    window.addEventListener("pointerdown", afterGesture, { once: true, capture: true });
    window.addEventListener("keydown", afterGesture, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", afterGesture, { capture: true });
      window.removeEventListener("keydown", afterGesture, { capture: true });
    };
  }, [pathname]);

  return null;
}
