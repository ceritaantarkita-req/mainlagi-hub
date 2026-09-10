# Mainlagi Voice Latency Baseline

Last reviewed: 10 September 2026

This document records the Batch 0 baseline for the user-observed complaint that Mainlagi voice feedback feels too slow. It does not claim that the problem is fixed yet; Batch 3 is responsible for the AudioManager rebuild.

## Current implementation shape

The current product has more than one speech path:

1. `src/lib/audio/feedback.ts` creates `SpeechSynthesisUtterance` and calls `speechSynthesis.cancel()` immediately before `speechSynthesis.speak()` for each prompt.
2. `src/components/learning/ChildLearningPlatform.tsx` still contains a separate direct speech helper with a hard-coded `utterance.rate = 0.85`.
3. `src/components/PreflightPanel.tsx` contains another direct `SpeechSynthesisUtterance` path for the ready announcement.

This fragmentation means voice selection, rate, cancellation/queue behavior, warm-up, and timing are not controlled by one product-level policy.

## Batch 0 instrumentation

`src/lib/audio/feedback.ts` now emits local browser events named:

```text
mainlagi-speech-latency
```

The event records only:

- phase (`requested`, `started`, `ended`, `blocked`, `error`);
- capability/status;
- language/locale;
- speech rate;
- prompt character length;
- request timestamp;
- start timestamp when the browser reports it;
- request-to-start latency when measurable.

It intentionally does **not** include:

- the spoken prompt text;
- a child/profile identifier;
- authentication/session data;
- a recording of the child's voice.

The event is local instrumentation only. Nothing in Batch 0 uploads these measurements.

## Why Batch 0 does not publish a fake millisecond number

Speech synthesis start latency is OS/browser/device dependent and the current execution environment is not a real child phone with the target browser/voice engine. A synthetic CI duration would not be a truthful production-device latency baseline.

The baseline therefore consists of:

- the known architecture and controllable delay sources;
- local timing hooks that allow real browser measurement;
- the user's observed production symptom;
- automated assurance that the measurement hook remains present until Batch 3 replaces it with the canonical AudioManager instrumentation.

## Batch 3 target architecture

```text
AudioManager
├── unlock()
├── warmup()
├── selectVoice(locale)
├── speakPrompt()
├── speakFeedback()
├── stop()
├── tone()
├── status()
└── latency metrics
```

Batch 3 must:

- remove duplicated direct `SpeechSynthesisUtterance` paths from product components;
- cache/select voices per locale;
- react to `voiceschanged`;
- warm audio/speech after a valid user gesture;
- remove unnecessary cancel-before-every-prompt behavior;
- apply a short, explicit queue/dedupe policy;
- stop stale speech on route/activity transition;
- standardize default rates around normal child-friendly speed rather than an unexplained global slow rate;
- retain readable fallback when speech is muted/unavailable/blocked;
- compare warmed request-to-start behavior against this baseline instrumentation.

## Privacy boundary

Batch 3 is TTS/output optimization only. Microphone pronunciation scoring, child voice capture, storage, transcription, or upload require a separate privacy/consent design and are not silently included in the latency work.
