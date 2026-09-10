"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { stopSpeech, unlockAudio } from "@/lib/audio/feedback";

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

  return null;
}
