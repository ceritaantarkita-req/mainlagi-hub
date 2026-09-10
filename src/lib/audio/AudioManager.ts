"use client";

export type Tone = "correct" | "wrong" | "tick" | "start" | "celebrate";
export type SpeechStartStatus = "spoken" | "muted" | "unavailable" | "error";
export type SpeechChannel = "prompt" | "feedback" | "system";
export type SpeechLatencyPhase =
  | "requested"
  | "queued"
  | "deduped"
  | "started"
  | "ended"
  | "blocked"
  | "cancelled"
  | "warmup"
  | "error";

export interface SpeechLatencySample {
  phase: SpeechLatencyPhase;
  status: SpeechStartStatus;
  channel: SpeechChannel;
  lang: string;
  rate: number;
  textLength: number;
  requestedAtMs: number;
  startedAtMs?: number;
  startLatencyMs?: number;
  warmed: boolean;
  queueDepth: number;
  voiceLang?: string;
  voiceLocalService?: boolean;
}

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  key?: string;
  interrupt?: boolean;
  dedupeMs?: number;
}

export interface AudioManagerStatus {
  muted: boolean;
  unlocked: boolean;
  warmedSpeech: boolean;
  speech: SpeechStartStatus;
  audioState: AudioContextState | "unavailable" | "muted";
  speaking: boolean;
  queueDepth: number;
  voiceCount: number;
}

interface SpeechVoiceLike {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

interface SpeechUtteranceLike {
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
  voice: SpeechVoiceLike | null;
  addEventListener(
    type: "start" | "end" | "error",
    listener: () => void,
    options?: { once?: boolean }
  ): void;
}

interface SpeechSynthesisLike {
  speaking: boolean;
  pending: boolean;
  cancel(): void;
  getVoices(): SpeechVoiceLike[];
  speak(utterance: SpeechUtteranceLike): void;
  addEventListener?(type: "voiceschanged", listener: () => void): void;
}

interface AudioManagerDependencies {
  now?: () => number;
  getSpeechSynthesis?: () => SpeechSynthesisLike | null;
  createUtterance?: (text: string) => SpeechUtteranceLike | null;
  createAudioContext?: () => AudioContext | null;
  emitLatency?: (sample: SpeechLatencySample) => void;
  setTimer?: (callback: () => void, delayMs: number) => ReturnType<typeof setTimeout>;
  clearTimer?: (handle: ReturnType<typeof setTimeout>) => void;
}

interface SpeechRequest {
  id: number;
  text: string;
  key: string;
  channel: SpeechChannel;
  lang: string;
  rate: number;
  requestedAtMs: number;
}

const TONES: Record<Tone, Array<[number, number, number]>> = {
  correct: [[660, 0, 0.12], [880, 0.09, 0.16]],
  wrong: [[220, 0, 0.2]],
  tick: [[520, 0, 0.05]],
  start: [[520, 0, 0.1], [660, 0.1, 0.1], [880, 0.2, 0.2]],
  celebrate: [[660, 0, 0.1], [880, 0.08, 0.1], [1046, 0.16, 0.1], [1318, 0.24, 0.26]]
};

export const SPEECH_LATENCY_EVENT = "mainlagi-speech-latency";
export const DEFAULT_PROMPT_RATE = 0.96;
export const DEFAULT_FEEDBACK_RATE = 1.02;
export const DEFAULT_SYSTEM_RATE = 1;

const MAX_PENDING_SPEECH = 2;
const DEFAULT_DEDUPE_MS = 650;
const SPEECH_WARMUP_DELAY_MS = 140;

function browserNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") return performance.now();
  return Date.now();
}

function browserSpeechSynthesis(): SpeechSynthesisLike | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis as unknown as SpeechSynthesisLike;
}

function browserUtterance(text: string): SpeechUtteranceLike | null {
  if (typeof SpeechSynthesisUtterance === "undefined") return null;
  try {
    return new SpeechSynthesisUtterance(text) as unknown as SpeechUtteranceLike;
  } catch {
    return null;
  }
}

function browserAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

function browserEmitLatency(sample: SpeechLatencySample): void {
  if (typeof window === "undefined" || typeof CustomEvent === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent<SpeechLatencySample>(SPEECH_LATENCY_EVENT, { detail: sample }));
  } catch {
    // Local instrumentation must never interfere with child-facing audio.
  }
}

function normalizeLocale(locale: string): string {
  return locale.trim().replace(/_/g, "-").toLowerCase();
}

function localeBase(locale: string): string {
  return normalizeLocale(locale).split("-")[0] ?? normalizeLocale(locale);
}

function clampRate(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PROMPT_RATE;
  return Math.min(1.5, Math.max(0.5, value));
}

function defaultRate(channel: SpeechChannel): number {
  if (channel === "feedback") return DEFAULT_FEEDBACK_RATE;
  if (channel === "system") return DEFAULT_SYSTEM_RATE;
  return DEFAULT_PROMPT_RATE;
}

function requestKey(channel: SpeechChannel, lang: string, text: string, explicit?: string): string {
  if (explicit?.trim()) return `${channel}:${explicit.trim()}`;
  return `${channel}:${normalizeLocale(lang)}:${text}`;
}

export class AudioManager {
  private readonly deps: Required<Pick<AudioManagerDependencies, "now" | "getSpeechSynthesis" | "createUtterance" | "createAudioContext" | "emitLatency" | "setTimer" | "clearTimer">>;
  private audioContext: AudioContext | null = null;
  private muted = false;
  private unlocked = false;
  private warmedSpeech = false;
  private warmupTimer: ReturnType<typeof setTimeout> | null = null;
  private warmupUtterance: SpeechUtteranceLike | null = null;
  private active: SpeechRequest | null = null;
  private queue: SpeechRequest[] = [];
  private voices: SpeechVoiceLike[] = [];
  private voiceCache = new Map<string, SpeechVoiceLike | null>();
  private recentKeys = new Map<string, number>();
  private nextRequestId = 1;
  private generation = 0;
  private voicesHooked = false;

  constructor(dependencies: AudioManagerDependencies = {}) {
    this.deps = {
      now: dependencies.now ?? browserNow,
      getSpeechSynthesis: dependencies.getSpeechSynthesis ?? browserSpeechSynthesis,
      createUtterance: dependencies.createUtterance ?? browserUtterance,
      createAudioContext: dependencies.createAudioContext ?? browserAudioContext,
      emitLatency: dependencies.emitLatency ?? browserEmitLatency,
      setTimer: dependencies.setTimer ?? ((callback, delayMs) => setTimeout(callback, delayMs)),
      clearTimer: dependencies.clearTimer ?? ((handle) => clearTimeout(handle))
    };
  }

  private createUtterance(text: string): SpeechUtteranceLike | null {
    try {
      return this.deps.createUtterance(text);
    } catch {
      return null;
    }
  }

  speechCapability(): SpeechStartStatus {
    if (this.muted) return "muted";
    try {
      const synth = this.deps.getSpeechSynthesis();
      if (!synth || !this.createUtterance("")) return "unavailable";
      return "spoken";
    } catch {
      return "unavailable";
    }
  }

  status(): AudioManagerStatus {
    const synth = this.deps.getSpeechSynthesis();
    const audioState: AudioManagerStatus["audioState"] = this.muted
      ? "muted"
      : this.audioContext?.state ?? "unavailable";
    return {
      muted: this.muted,
      unlocked: this.unlocked,
      warmedSpeech: this.warmedSpeech,
      speech: this.speechCapability(),
      audioState,
      speaking: Boolean(this.active || synth?.speaking),
      queueDepth: this.queue.length,
      voiceCount: this.voices.length
    };
  }

  private synth(): SpeechSynthesisLike | null {
    const synth = this.deps.getSpeechSynthesis();
    if (!synth) return null;
    if (!this.voicesHooked) {
      this.voicesHooked = true;
      synth.addEventListener?.("voiceschanged", this.handleVoicesChanged);
    }
    return synth;
  }

  private readonly handleVoicesChanged = (): void => {
    this.refreshVoices();
  };

  refreshVoices(): SpeechVoiceLike[] {
    const synth = this.deps.getSpeechSynthesis();
    if (!synth) {
      this.voices = [];
      this.voiceCache.clear();
      return [];
    }
    try {
      this.voices = [...synth.getVoices()];
    } catch {
      this.voices = [];
    }
    this.voiceCache.clear();
    return [...this.voices];
  }

  selectVoice(locale: string): SpeechVoiceLike | null {
    const key = normalizeLocale(locale || "id-ID");
    if (this.voiceCache.has(key)) return this.voiceCache.get(key) ?? null;
    if (this.voices.length === 0) this.refreshVoices();

    const base = localeBase(key);
    const scored = this.voices
      .map((voice) => {
        const voiceLocale = normalizeLocale(voice.lang);
        let score = 0;
        if (voiceLocale === key) score += 100;
        else if (localeBase(voiceLocale) === base) score += 60;
        if (voice.localService) score += 12;
        if (voice.default) score += 5;
        return { voice, score };
      })
      .filter((entry) => entry.score >= 60)
      .sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name));

    const selected = scored[0]?.voice ?? null;
    this.voiceCache.set(key, selected);
    return selected;
  }

  unlock(locale = "id-ID"): void {
    this.unlocked = true;
    const context = this.audio();
    if (context?.state === "suspended") void context.resume().catch(() => undefined);
    this.refreshVoices();
    this.scheduleSpeechWarmup(locale);
  }

  warmup(locale = "id-ID"): void {
    this.unlocked = true;
    const context = this.audio();
    if (context?.state === "suspended") void context.resume().catch(() => undefined);
    this.refreshVoices();
    this.scheduleSpeechWarmup(locale, 0);
  }

  private scheduleSpeechWarmup(locale: string, delayMs = SPEECH_WARMUP_DELAY_MS): void {
    if (
      this.muted ||
      this.warmedSpeech ||
      this.active ||
      this.queue.length > 0 ||
      this.warmupTimer !== null ||
      this.warmupUtterance
    ) return;
    if (this.speechCapability() !== "spoken") return;
    this.warmupTimer = this.deps.setTimer(() => {
      this.warmupTimer = null;
      this.runSpeechWarmup(locale);
    }, delayMs);
  }

  private runSpeechWarmup(locale: string): void {
    if (this.muted || this.warmedSpeech || this.active || this.queue.length > 0 || this.warmupUtterance) return;
    const synth = this.synth();
    const utterance = this.createUtterance(".");
    if (!synth || !utterance) return;

    utterance.lang = locale;
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 0;
    utterance.voice = this.selectVoice(locale);
    this.warmupUtterance = utterance;
    const generation = this.generation;

    const finish = () => {
      if (generation !== this.generation || this.warmupUtterance !== utterance) return;
      this.warmupUtterance = null;
      this.warmedSpeech = true;
    };
    utterance.addEventListener("end", finish, { once: true });
    utterance.addEventListener("error", finish, { once: true });

    try {
      synth.speak(utterance);
      this.deps.emitLatency({
        phase: "warmup",
        status: "spoken",
        channel: "system",
        lang: locale,
        rate: utterance.rate,
        textLength: 0,
        requestedAtMs: this.deps.now(),
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length,
        voiceLang: utterance.voice?.lang,
        voiceLocalService: utterance.voice?.localService
      });
    } catch {
      this.warmupUtterance = null;
    }
  }

  speakPrompt(text: string, options: SpeechOptions = {}): SpeechStartStatus {
    return this.requestSpeech("prompt", text, options);
  }

  speakFeedback(text: string, options: SpeechOptions = {}): SpeechStartStatus {
    return this.requestSpeech("feedback", text, { ...options, interrupt: options.interrupt ?? true });
  }

  speakSystem(text: string, options: SpeechOptions = {}): SpeechStartStatus {
    return this.requestSpeech("system", text, options);
  }

  private requestSpeech(channel: SpeechChannel, rawText: string, options: SpeechOptions): SpeechStartStatus {
    const text = rawText.trim();
    const lang = options.lang?.trim() || "id-ID";
    const rate = clampRate(options.rate ?? defaultRate(channel));
    const requestedAtMs = this.deps.now();
    const capability = this.speechCapability();
    if (!text || capability !== "spoken") {
      this.deps.emitLatency({
        phase: text ? "blocked" : "error",
        status: text ? capability : "error",
        channel,
        lang,
        rate,
        textLength: text.length,
        requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      return text ? capability : "error";
    }

    this.cancelPendingWarmup();
    const key = requestKey(channel, lang, text, options.key);
    const dedupeMs = Math.max(0, options.dedupeMs ?? DEFAULT_DEDUPE_MS);
    const recentAt = this.recentKeys.get(key);
    const alreadyActive = this.active?.key === key;
    const alreadyQueued = this.queue.some((request) => request.key === key);
    if (alreadyActive || alreadyQueued || (recentAt !== undefined && requestedAtMs - recentAt < dedupeMs)) {
      this.deps.emitLatency({
        phase: "deduped",
        status: "spoken",
        channel,
        lang,
        rate,
        textLength: text.length,
        requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      return "spoken";
    }

    this.recentKeys.set(key, requestedAtMs);
    this.pruneRecentKeys(requestedAtMs);
    const request: SpeechRequest = {
      id: this.nextRequestId++,
      text,
      key,
      channel,
      lang,
      rate,
      requestedAtMs
    };

    this.deps.emitLatency({
      phase: "requested",
      status: "spoken",
      channel,
      lang,
      rate,
      textLength: text.length,
      requestedAtMs,
      warmed: this.warmedSpeech,
      queueDepth: this.queue.length
    });

    if (options.interrupt) this.interruptActiveSpeech();
    if (!this.active) {
      this.startRequest(request);
      return "spoken";
    }

    this.enqueueLatest(request);
    return "spoken";
  }

  private enqueueLatest(request: SpeechRequest): void {
    this.queue = this.queue.filter((queued) => queued.channel !== request.channel);
    this.queue.push(request);
    while (this.queue.length > MAX_PENDING_SPEECH) this.queue.shift();
    this.deps.emitLatency({
      phase: "queued",
      status: "spoken",
      channel: request.channel,
      lang: request.lang,
      rate: request.rate,
      textLength: request.text.length,
      requestedAtMs: request.requestedAtMs,
      warmed: this.warmedSpeech,
      queueDepth: this.queue.length
    });
  }

  private startRequest(request: SpeechRequest): void {
    const synth = this.synth();
    const utterance = this.createUtterance(request.text);
    if (!synth || !utterance) {
      this.deps.emitLatency({
        phase: "error",
        status: "error",
        channel: request.channel,
        lang: request.lang,
        rate: request.rate,
        textLength: request.text.length,
        requestedAtMs: request.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      this.drainQueue();
      return;
    }

    utterance.lang = request.lang;
    utterance.rate = request.rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.voice = this.selectVoice(request.lang);
    this.active = request;
    const generation = this.generation;

    utterance.addEventListener("start", () => {
      if (generation !== this.generation || this.active?.id !== request.id) return;
      const startedAtMs = this.deps.now();
      this.warmedSpeech = true;
      this.deps.emitLatency({
        phase: "started",
        status: "spoken",
        channel: request.channel,
        lang: request.lang,
        rate: request.rate,
        textLength: request.text.length,
        requestedAtMs: request.requestedAtMs,
        startedAtMs,
        startLatencyMs: Math.max(0, startedAtMs - request.requestedAtMs),
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length,
        voiceLang: utterance.voice?.lang,
        voiceLocalService: utterance.voice?.localService
      });
    }, { once: true });

    utterance.addEventListener("end", () => {
      if (generation !== this.generation || this.active?.id !== request.id) return;
      this.deps.emitLatency({
        phase: "ended",
        status: "spoken",
        channel: request.channel,
        lang: request.lang,
        rate: request.rate,
        textLength: request.text.length,
        requestedAtMs: request.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      this.active = null;
      this.drainQueue();
    }, { once: true });

    utterance.addEventListener("error", () => {
      if (generation !== this.generation || this.active?.id !== request.id) return;
      this.deps.emitLatency({
        phase: "error",
        status: "error",
        channel: request.channel,
        lang: request.lang,
        rate: request.rate,
        textLength: request.text.length,
        requestedAtMs: request.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      this.active = null;
      this.drainQueue();
    }, { once: true });

    try {
      synth.speak(utterance);
    } catch {
      if (this.active?.id === request.id) this.active = null;
      this.deps.emitLatency({
        phase: "error",
        status: "error",
        channel: request.channel,
        lang: request.lang,
        rate: request.rate,
        textLength: request.text.length,
        requestedAtMs: request.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: this.queue.length
      });
      this.drainQueue();
    }
  }

  private drainQueue(): void {
    if (this.active || this.queue.length === 0) return;
    const next = this.queue.shift();
    if (next) this.startRequest(next);
  }

  private interruptActiveSpeech(): void {
    const synth = this.deps.getSpeechSynthesis();
    const previous = this.active;
    this.generation += 1;
    this.active = null;
    this.queue = [];
    if (synth && (previous || synth.speaking || synth.pending)) {
      try {
        synth.cancel();
      } catch {
        // Speech is optional; immediately starting the new item can still work.
      }
    }
    if (previous) {
      this.deps.emitLatency({
        phase: "cancelled",
        status: "spoken",
        channel: previous.channel,
        lang: previous.lang,
        rate: previous.rate,
        textLength: previous.text.length,
        requestedAtMs: previous.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: 0
      });
    }
  }

  stop(): void {
    this.clearWarmupTimer();
    const synth = this.deps.getSpeechSynthesis();
    const previous = this.active;
    const hadWarmup = Boolean(this.warmupUtterance);
    this.generation += 1;
    this.active = null;
    this.queue = [];
    this.warmupUtterance = null;
    if (synth && (previous || hadWarmup || synth.speaking || synth.pending)) {
      try {
        synth.cancel();
      } catch {
        // Optional capability.
      }
    }
    if (previous) {
      this.deps.emitLatency({
        phase: "cancelled",
        status: "spoken",
        channel: previous.channel,
        lang: previous.lang,
        rate: previous.rate,
        textLength: previous.text.length,
        requestedAtMs: previous.requestedAtMs,
        warmed: this.warmedSpeech,
        queueDepth: 0
      });
    }
  }

  setMuted(value: boolean): void {
    this.muted = value;
    if (value) this.stop();
  }

  isMuted(): boolean {
    return this.muted;
  }

  tone(tone: Tone): void {
    if (this.muted) return;
    for (const [frequency, offset, duration] of TONES[tone]) {
      this.blip(frequency, offset, duration);
    }
  }

  private audio(): AudioContext | null {
    if (this.muted) return null;
    if (this.audioContext) return this.audioContext;
    this.audioContext = this.deps.createAudioContext();
    return this.audioContext;
  }

  private blip(frequency: number, startOffset: number, duration: number, volume = 0.16): void {
    const context = this.audio();
    if (!context) return;
    try {
      const start = context.currentTime + startOffset;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch {
      // Tone feedback must never block the learning interaction.
    }
  }

  private cancelPendingWarmup(): void {
    this.clearWarmupTimer();
    if (!this.warmupUtterance) return;
    const synth = this.deps.getSpeechSynthesis();
    this.generation += 1;
    this.warmupUtterance = null;
    try {
      synth?.cancel();
    } catch {
      // Continue with the real prompt.
    }
  }

  private clearWarmupTimer(): void {
    if (this.warmupTimer === null) return;
    this.deps.clearTimer(this.warmupTimer);
    this.warmupTimer = null;
  }

  private pruneRecentKeys(now: number): void {
    for (const [key, requestedAt] of this.recentKeys) {
      if (now - requestedAt > 5_000) this.recentKeys.delete(key);
    }
  }
}

export const audioManager = new AudioManager();
