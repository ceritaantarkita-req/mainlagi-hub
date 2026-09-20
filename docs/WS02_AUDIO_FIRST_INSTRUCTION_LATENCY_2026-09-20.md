# WS-02 / WS-13 — Audio First-Instruction Latency

Date: **20 September 2026**  
Status: **IMPLEMENTATION PR / VALIDATION PENDING**  
Base: `main` = `689b2d2fa8c5c381c6e75282ba3badf9857e089c`

## Problem

A pre-reader can enter an activity before hearing what to do. The existing AudioManager already had managed speech, queueing, voice selection, warmup, replay and request-to-start latency instrumentation, but the activity-entry path still had avoidable delay:

- activity-link gestures did not pre-warm the destination language;
- generic activity narration waited one extra animation frame after mount;
- listen-and-choose required a second explicit Dengar tap even when the navigation gesture had already unlocked audio;
- existing latency samples measured speech request -> start, not navigation intent -> first speech start.

## Runtime changes

### Correct-language pre-warm

`AudioRouteBridge` now detects same-origin activity links on pointer/keyboard activation.

Before navigation it:

1. stops stale speech from the previous screen;
2. records a privacy-safe activity intent timestamp;
3. warms the destination locale:
   - English -> `en-US`
   - other current learning subjects -> `id-ID`

The destination route preserves that warmup instead of cancelling it during route cleanup.

### Faster generic activity entry

Generic activity narration starts directly from the mounted route effect. The previous extra `requestAnimationFrame(narrate)` delay is removed.

Direct URL loads still respect browser autoplay rules. If audio has not been unlocked by a real gesture, narration waits for the first eligible pointer/keyboard gesture; it is not force-played around browser policy.

### Listen-and-choose

`AudioChoiceLearningActivity` owns its own entry narration instead of racing the global generic narrator.

If navigation already unlocked audio, the spoken-only prompt is requested automatically on mount and choices become usable when the managed speech request succeeds. If speech is unavailable/muted/error, the existing readable fallback remains and the hidden audio target is never exposed as visible answer text.

The Dengar button remains a replay/recovery control.

## Latency evidence

New local event:

`mainlagi-activity-audio-entry-latency`

It contains only:

- activity ID;
- locale;
- source: `navigation` or `direct`;
- speech status;
- intent -> request latency;
- request -> speech-start latency when available;
- total navigation-intent -> speech-start latency when available;
- warmed flag.

It does **not** contain child identity or spoken text.

## QA contract

390px browser QA navigates from the English subject catalog into:

1. a generic English activity;
2. a listen-and-choose English activity.

It verifies:

- destination language is `en-US`;
- activity-link navigation is correlated as `navigation`;
- intent -> request latency is measurable and bounded;
- privacy fields do not include child identity or narration text;
- supported speech produces start-latency evidence;
- unsupported speech reports an honest fallback instead of a silent dead state;
- listen-and-choose choices unlock after successful automatic narration.

Existing AudioManager unit contracts still cover queueing, dedupe, warmup, voice matching, route cancellation, fallback and request-to-start privacy.

## Non-goals

- no voice-provider replacement in this wave;
- no claim that current English browser voice quality is final;
- no mastery/evidence/curriculum/schema change;
- no autoplay-policy bypass;
- no recording or upload of microphone/audio data.

The separate English native-voice-quality/provider wave remains later in the approved product-UX plan.
