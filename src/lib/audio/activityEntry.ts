"use client";

import {
  SPEECH_LATENCY_EVENT,
  stopSpeech,
  type SpeechLatencySample,
  type SpeechStartStatus
} from "./feedback";

export const ACTIVITY_AUDIO_ENTRY_LATENCY_EVENT = "mainlagi-activity-audio-entry-latency";

const INTENT_KEY = "mainlagi-audio-entry-intent-v1";
const INTENT_TTL_MS = 15_000;
const OBSERVER_TTL_MS = 3_500;

interface StoredIntent {
  activityId: string;
  atMs: number;
}

export interface ActivityAudioEntryLatencyDetail {
  activityId: string;
  lang: string;
  source: "navigation" | "direct";
  status: SpeechStartStatus;
  intentToRequestMs?: number;
  requestToStartMs?: number;
  totalStartLatencyMs?: number;
  warmed: boolean;
}

function nowEpochMs() {
  return Date.now();
}

export function markActivityAudioIntent(activityId: string): void {
  if (typeof window === "undefined") return;
  const payload: StoredIntent = { activityId, atMs: nowEpochMs() };
  try {
    sessionStorage.setItem(INTENT_KEY, JSON.stringify(payload));
  } catch {
    // Navigation audio remains functional even when storage is unavailable.
  }
}

function readIntent(activityId: string): StoredIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredIntent>;
    if (parsed.activityId !== activityId || typeof parsed.atMs !== "number") return null;
    if (nowEpochMs() - parsed.atMs > INTENT_TTL_MS) return null;
    return { activityId, atMs: parsed.atMs };
  } catch {
    return null;
  }
}

export function hasActivityAudioIntent(activityId: string): boolean {
  return readIntent(activityId) !== null;
}

function clearIntent(activityId: string): void {
  if (typeof window === "undefined") return;
  try {
    const intent = readIntent(activityId);
    if (intent) sessionStorage.removeItem(INTENT_KEY);
  } catch {
    // Best-effort instrumentation only.
  }
}

function emitEntryLatency(detail: ActivityAudioEntryLatencyDetail): void {
  if (typeof window === "undefined" || typeof CustomEvent === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent<ActivityAudioEntryLatencyDetail>(
      ACTIVITY_AUDIO_ENTRY_LATENCY_EVENT,
      { detail }
    ));
  } catch {
    // Measurement must never block narration.
  }
}

/**
 * Wrap one entry narration request and correlate AudioManager's privacy-safe
 * request→start sample with the earlier navigation intent timestamp.
 *
 * No child identity or spoken text is stored/emitted.
 */
export function observeActivityEntrySpeech({
  activityId,
  lang,
  textLength,
  request
}: {
  activityId: string;
  lang: string;
  textLength: number;
  request: () => SpeechStartStatus;
}): SpeechStartStatus {
  if (typeof window === "undefined") return request();

  const intent = readIntent(activityId);
  const source: ActivityAudioEntryLatencyDetail["source"] = intent ? "navigation" : "direct";
  const requestedAtEpochMs = nowEpochMs();
  const intentToRequestMs = intent ? Math.max(0, requestedAtEpochMs - intent.atMs) : undefined;
  let settled = false;
  let lastWarmed = false;

  const resolve = (detail: ActivityAudioEntryLatencyDetail) => {
    if (settled) return;
    settled = true;
    window.removeEventListener(SPEECH_LATENCY_EVENT, onLatency as EventListener);
    clearTimeout(timeout);
    clearIntent(activityId);
    emitEntryLatency(detail);
  };

  const onLatency = (event: Event) => {
    const sample = (event as CustomEvent<SpeechLatencySample>).detail;
    if (sample.channel !== "prompt" || sample.lang !== lang || sample.textLength !== textLength) return;
    lastWarmed = sample.warmed;
    if (!["started", "blocked", "error"].includes(sample.phase)) return;

    const requestToStartMs = sample.phase === "started" ? sample.startLatencyMs : undefined;
    resolve({
      activityId,
      lang,
      source,
      status: sample.status,
      intentToRequestMs,
      requestToStartMs,
      totalStartLatencyMs: requestToStartMs === undefined
        ? undefined
        : (intentToRequestMs ?? 0) + requestToStartMs,
      warmed: sample.warmed
    });
  };

  window.addEventListener(SPEECH_LATENCY_EVENT, onLatency as EventListener);
  const timeout = window.setTimeout(() => {
    if (settled) return;
    // A browser can accept speech synthesis yet never dispatch "start".
    // Fail closed instead of leaving a pre-reader in a silent waiting state.
    stopSpeech();
    resolve({
      activityId,
      lang,
      source,
      status: "error",
      intentToRequestMs,
      warmed: lastWarmed
    });
  }, OBSERVER_TTL_MS);

  return request();
}
