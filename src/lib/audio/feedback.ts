"use client";

/**
 * Audio and speech feedback.
 *
 * Everything here degrades safely: if Web Audio or speech synthesis is
 * unavailable or blocked, calls return a status/no-op rather than throwing.
 */

type Tone = "correct" | "wrong" | "tick" | "start" | "celebrate";
export type SpeechStartStatus = "spoken" | "muted" | "unavailable" | "error";
export type SpeechLatencyPhase = "requested" | "started" | "ended" | "blocked" | "error";

export interface SpeechLatencySample {
  phase: SpeechLatencyPhase;
  status: SpeechStartStatus;
  lang: string;
  rate: number;
  textLength: number;
  requestedAtMs: number;
  startedAtMs?: number;
  startLatencyMs?: number;
}

export const SPEECH_LATENCY_EVENT = "mainlagi-speech-latency";

let context: AudioContext | null = null;
let muted = false;

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") return performance.now();
  return Date.now();
}

function emitSpeechLatency(sample: SpeechLatencySample): void {
  if (typeof window === "undefined" || typeof CustomEvent === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent<SpeechLatencySample>(SPEECH_LATENCY_EVENT, { detail: sample }));
  } catch {
    // Measurement must never interfere with learning audio.
  }
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (muted) return null;
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    context = new Ctor();
    return context;
  } catch {
    return null;
  }
}

function blip(
  frequency: number,
  startOffset: number,
  duration: number,
  volume = 0.16
): void {
  const ctx = audio();
  if (!ctx) return;
  const now = ctx.currentTime + startOffset;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

const TONES: Record<Tone, Array<[number, number, number]>> = {
  correct: [[660, 0, 0.12], [880, 0.09, 0.16]],
  wrong: [[220, 0, 0.2]],
  tick: [[520, 0, 0.05]],
  start: [[520, 0, 0.1], [660, 0.1, 0.1], [880, 0.2, 0.2]],
  celebrate: [[660, 0, 0.1], [880, 0.08, 0.1], [1046, 0.16, 0.1], [1318, 0.24, 0.26]]
};

export function playTone(tone: Tone): void {
  for (const [frequency, offset, duration] of TONES[tone]) blip(frequency, offset, duration);
}

export function speechCapability(): SpeechStartStatus {
  if (muted) return "muted";
  if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    return "unavailable";
  }
  return "spoken";
}

/**
 * Starts a short speech prompt and reports whether playback could be started.
 * The status lets learning UI provide readable fallback instructions instead
 * of silently doing nothing on unsupported/muted devices.
 *
 * Batch 0 expansion instrumentation emits local-only timing events. The event
 * intentionally contains prompt length, locale, rate, and timing only — never
 * the spoken prompt itself and never a child identifier. Batch 3 will use this
 * baseline to measure the AudioManager latency improvement.
 */
export function speakWithStatus(text: string, lang = "id-ID", rate = 1): SpeechStartStatus {
  const requestedAtMs = nowMs();
  const capability = speechCapability();
  if (capability !== "spoken") {
    emitSpeechLatency({
      phase: "blocked",
      status: capability,
      lang,
      rate,
      textLength: text.length,
      requestedAtMs
    });
    return capability;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    emitSpeechLatency({
      phase: "requested",
      status: "spoken",
      lang,
      rate,
      textLength: text.length,
      requestedAtMs
    });

    utterance.addEventListener("start", () => {
      const startedAtMs = nowMs();
      emitSpeechLatency({
        phase: "started",
        status: "spoken",
        lang,
        rate,
        textLength: text.length,
        requestedAtMs,
        startedAtMs,
        startLatencyMs: Math.max(0, startedAtMs - requestedAtMs)
      });
    }, { once: true });

    utterance.addEventListener("end", () => {
      emitSpeechLatency({
        phase: "ended",
        status: "spoken",
        lang,
        rate,
        textLength: text.length,
        requestedAtMs
      });
    }, { once: true });

    utterance.addEventListener("error", () => {
      emitSpeechLatency({
        phase: "error",
        status: "error",
        lang,
        rate,
        textLength: text.length,
        requestedAtMs
      });
    }, { once: true });

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return "spoken";
  } catch {
    emitSpeechLatency({
      phase: "error",
      status: "error",
      lang,
      rate,
      textLength: text.length,
      requestedAtMs
    });
    return "error";
  }
}

/** Backward-compatible fire-and-forget speech feedback. */
export function speak(text: string, lang = "id-ID", rate = 1): void {
  void speakWithStatus(text, lang, rate);
}

export function stopSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Speech is optional.
  }
}

export function setMuted(value: boolean): void {
  muted = value;
  if (value) stopSpeech();
}

export function isMuted(): boolean {
  return muted;
}

/**
 * Browsers only allow audio after a user gesture. Call this from the first
 * button press so later feedback is actually audible.
 */
export function unlockAudio(): void {
  const ctx = audio();
  if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => undefined);
}
