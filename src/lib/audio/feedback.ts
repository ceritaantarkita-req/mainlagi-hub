"use client";

import {
  audioManager,
  DEFAULT_FEEDBACK_RATE,
  DEFAULT_PROMPT_RATE,
  DEFAULT_SYSTEM_RATE,
  SPEECH_LATENCY_EVENT
} from "./AudioManager";
import type {
  AudioManagerStatus,
  SpeechLatencyPhase,
  SpeechLatencySample,
  SpeechOptions,
  SpeechStartStatus,
  Tone
} from "./AudioManager";

export {
  DEFAULT_FEEDBACK_RATE,
  DEFAULT_PROMPT_RATE,
  DEFAULT_SYSTEM_RATE,
  SPEECH_LATENCY_EVENT
};
export type {
  AudioManagerStatus,
  SpeechLatencyPhase,
  SpeechLatencySample,
  SpeechOptions,
  SpeechStartStatus,
  Tone
};

/**
 * Compatibility facade for existing games/components.
 *
 * Speech synthesis, voice selection, queueing, dedupe, warmup, cancellation,
 * latency instrumentation, mute state, and Web Audio tones now live in the
 * single AudioManager. Keeping this facade lets existing game runtimes migrate
 * without duplicating browser audio policy.
 */

export function playTone(tone: Tone): void {
  audioManager.tone(tone);
}

export function speechCapability(): SpeechStartStatus {
  return audioManager.speechCapability();
}

export function audioStatus(): AudioManagerStatus {
  return audioManager.status();
}

/**
 * Backward-compatible prompt API. An omitted rate uses the centralized
 * child-friendly prompt rate instead of forcing a component-local slow rate.
 */
export function speakWithStatus(text: string, lang = "id-ID", rate?: number): SpeechStartStatus {
  return audioManager.speakPrompt(text, { lang, rate });
}

export function speak(text: string, lang = "id-ID", rate?: number): void {
  void audioManager.speakPrompt(text, { lang, rate });
}

export function speakPrompt(text: string, options: SpeechOptions = {}): SpeechStartStatus {
  return audioManager.speakPrompt(text, options);
}

export function speakFeedback(text: string, options: SpeechOptions = {}): SpeechStartStatus {
  return audioManager.speakFeedback(text, options);
}

export function speakSystem(text: string, options: SpeechOptions = {}): SpeechStartStatus {
  return audioManager.speakSystem(text, options);
}

export function stopSpeech(): void {
  audioManager.stop();
}

export function setMuted(value: boolean): void {
  audioManager.setMuted(value);
}

export function isMuted(): boolean {
  return audioManager.isMuted();
}

/**
 * Call from a real user gesture. The manager resumes Web Audio immediately and
 * schedules a silent speech warmup only when no real prompt follows the same
 * gesture, avoiding an artificial queue delay on explicit "play audio" taps.
 */
export function unlockAudio(locale = "id-ID"): void {
  audioManager.unlock(locale);
}

export function warmAudio(locale = "id-ID"): void {
  audioManager.warmup(locale);
}
