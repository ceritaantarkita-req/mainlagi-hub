"use client";

import {
  audioStatus,
  speakPrompt,
  type SpeechOptions,
  type SpeechStartStatus
} from "@/lib/audio/feedback";
import { resolveMoneyWorldNarrationProductionSrc } from "./moneyWorldNarrationProduction";

export type MoneyWorldNarrationPlaybackMode = "fixed-audio" | "browser-speech";

export interface MoneyWorldNarrationPlaybackResult {
  cueId: string;
  mode: MoneyWorldNarrationPlaybackMode;
  status: SpeechStartStatus;
  src: string | null;
}

export interface PlayMoneyWorldNarrationOptions {
  cueId: string;
  fallbackText: string;
  speech?: SpeechOptions;
  onFixedAudioFallback?: (result: MoneyWorldNarrationPlaybackResult) => void;
}

let activeFixedAudio: HTMLAudioElement | null = null;
let playbackGeneration = 0;

export function stopMoneyWorldFixedNarration(): void {
  playbackGeneration += 1;
  if (!activeFixedAudio) return;
  try {
    activeFixedAudio.pause();
    activeFixedAudio.currentTime = 0;
  } catch {
    // Fixed narration is optional. Failure to stop must not break the Stage.
  }
  activeFixedAudio = null;
}

function browserSpeechFallback(
  cueId: string,
  fallbackText: string,
  speech: SpeechOptions
): MoneyWorldNarrationPlaybackResult {
  const status = speakPrompt(fallbackText, speech);
  return {
    cueId,
    mode: "browser-speech",
    status,
    src: null
  };
}

export function playMoneyWorldNarration(
  options: PlayMoneyWorldNarrationOptions
): MoneyWorldNarrationPlaybackResult {
  const speech = options.speech ?? {};
  const fallbackText = options.fallbackText.trim();
  const productionSrc = resolveMoneyWorldNarrationProductionSrc(options.cueId);

  stopMoneyWorldFixedNarration();

  if (audioStatus().muted) {
    return {
      cueId: options.cueId,
      mode: "browser-speech",
      status: "muted",
      src: null
    };
  }

  if (!productionSrc || typeof Audio === "undefined") {
    return browserSpeechFallback(options.cueId, fallbackText, speech);
  }

  const generation = playbackGeneration;
  let fallbackStarted = false;

  const startFallback = () => {
    if (fallbackStarted || generation !== playbackGeneration) return;
    fallbackStarted = true;
    if (activeFixedAudio) {
      try {
        activeFixedAudio.pause();
      } catch {
        // Continue to browser speech even if the failed element cannot pause.
      }
      activeFixedAudio = null;
    }
    const result = browserSpeechFallback(options.cueId, fallbackText, speech);
    options.onFixedAudioFallback?.(result);
  };

  try {
    const audio = new Audio(productionSrc);
    activeFixedAudio = audio;
    audio.preload = "auto";
    audio.addEventListener("ended", () => {
      if (generation === playbackGeneration && activeFixedAudio === audio) {
        activeFixedAudio = null;
      }
    }, { once: true });
    audio.addEventListener("error", startFallback, { once: true });

    const started = audio.play();
    if (started && typeof started.catch === "function") {
      void started.catch(startFallback);
    }

    return {
      cueId: options.cueId,
      mode: "fixed-audio",
      status: "spoken",
      src: productionSrc
    };
  } catch {
    return browserSpeechFallback(options.cueId, fallbackText, speech);
  }
}
