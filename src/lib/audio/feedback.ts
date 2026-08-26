"use client";

/**
 * Audio and speech feedback.
 *
 * The only feedback the previous build gave was a line of Indonesian text in a
 * toast. A five-year-old cannot read it, which meant that for the youngest
 * player the game was effectively silent about whether anything had worked.
 *
 * Everything here degrades safely: if Web Audio or speech synthesis is
 * unavailable or blocked, the calls become no-ops rather than throwing.
 */

type Tone = "correct" | "wrong" | "tick" | "start" | "celebrate";

let context: AudioContext | null = null;
let muted = false;

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
  // [frequency, start offset, duration]
  correct: [
    [660, 0, 0.12],
    [880, 0.09, 0.16]
  ],
  wrong: [[220, 0, 0.2]],
  tick: [[520, 0, 0.05]],
  start: [
    [520, 0, 0.1],
    [660, 0.1, 0.1],
    [880, 0.2, 0.2]
  ],
  celebrate: [
    [660, 0, 0.1],
    [880, 0.08, 0.1],
    [1046, 0.16, 0.1],
    [1318, 0.24, 0.26]
  ]
};

export function playTone(tone: Tone): void {
  for (const [frequency, offset, duration] of TONES[tone]) {
    blip(frequency, offset, duration);
  }
}

/**
 * Speaks a short Indonesian phrase. Speech is cancelled first so feedback
 * never queues up behind a stale sentence during fast play.
 */
export function speak(text: string, lang = "id-ID", rate = 1): void {
  if (muted || typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech is optional.
  }
}

export function setMuted(value: boolean): void {
  muted = value;
  if (value && typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function isMuted(): boolean {
  return muted;
}

/**
 * Browsers only allow audio after a user gesture. Call this from the first
 * button press so later, gesture-driven feedback is actually audible.
 */
export function unlockAudio(): void {
  const ctx = audio();
  if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => undefined);
}
