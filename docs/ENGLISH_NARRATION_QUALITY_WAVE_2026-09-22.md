# English Narration Quality Wave 1 — 2026-09-22

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Scope

This wave improves English learning narration quality without changing learning mechanics, answers, mastery, progression, content ownership, Mainlagi World, or character production.

Main constraints:

- Mainlagi World is out of scope.
- Character development remains paused.
- WS-05 Logic `pattern_completion` remains closed.
- Existing assessed activity/evidence contracts remain canonical.
- This wave improves the current browser speech fallback and English listening presentation only.
- It does **not** claim final production-quality pre-generated/native character narration.

## Baseline problem

The previous voice-latency work made first narration faster and centralized speech in `AudioManager`, but quality remained explicitly deferred.

Two quality gaps were verified on current `main`:

1. Browser voice selection preferred exact/local voices but had no quality preference for browser voices labelled Natural, Neural, Premium, or Enhanced.
2. Many English `listen_and_choose` activities used spoken copy such as “Choose the bird” or “Choose MILK”. That is valid for task completion, but it mixes generic task instruction with the learning target instead of giving young learners a clean pronunciation model.

## Implementation

### 1. English browser voice policy

`src/lib/audio/AudioManager.ts` now:

- keeps exact locale matching as the strongest requirement;
- still fails closed when the requested language has no compatible voice;
- prefers exact-locale English voices whose browser/OS names include `Natural`, `Neural`, `Premium`, or `Enhanced`;
- de-prioritizes known low-quality hints such as `eSpeak`, `Festival`, `Flite`, or `Compact` when a better exact-locale alternative exists;
- preserves exact-locale priority over a higher-quality hint from a different English locale;
- uses `ENGLISH_PROMPT_RATE = 0.92` for English prompt speech while leaving the existing generic prompt rate and feedback/system rates unchanged.

This remains a browser-provided voice fallback. It does not ship or redistribute third-party voice assets.

### 2. Reviewed English listening copy

Presentation normalization now provides explicit spoken targets for 22 vocabulary/letter/phrase listening activities.

Examples:

- `english-find-blue-audio` -> “Blue.”
- `english-listen-letter-a` -> “Letter A.”
- `english-listen-bird` -> “Bird.”
- `english-listen-apple-review` -> “Apple.”
- `english-listen-phrase-blue-book` -> “A blue book.”
- `english-review-listen-yellow-ball` -> “A yellow ball.”

Five listening-comprehension activities keep their full sentence + question narration because sentence-level comprehension is the assessed objective.

All 27 English listening activities keep the existing visible leak-free instruction:

> Listen, then choose the best answer.

The spoken target remains audio-only.

## Evidence boundary

The narration override is presentation-only.

Regression coverage requires every canonical English listening activity to preserve:

- activity ID;
- stage ownership;
- runtime `listen_and_choose`;
- choices;
- correct answer.

No activity is added or removed.

Current reviewed distribution:

- English listening activities: **27**
- target-first vocabulary/letter/phrase narration: **22**
- sentence-level listening-comprehension narration: **5**

## Automated regression

New permanent gate:

`npm run test:learning:english-narration`

It verifies:

- all 27 current English listening activities are reviewed;
- all 22 target-first prompts match the reviewed spoken copy;
- generic “Choose / Find / Listen” prefixes do not reappear in target-first audio;
- all five comprehension scripts remain complete;
- visible and spoken prompts remain separated;
- canonical runtime, stage, choices, and correct answers remain unchanged.

`test:audio-manager` additionally verifies:

- English learning prompt rate;
- natural exact-locale English voice preference;
- exact-locale priority over a different-locale quality hint;
- low-quality English voice hints lose to enhanced exact-locale alternatives;
- Indonesian fail-closed behavior remains intact.

## What remains intentionally open

This wave does **not** close the final production narration requirement.

A later provider/audio-asset wave should evaluate reviewed pre-generated or cached English narration so output is stable across browsers/devices. That later decision still requires:

- provider/model quality review;
- child-learning pronunciation review;
- licensing/redistribution review;
- cost/storage/cache strategy;
- fallback behavior;
- human listening acceptance on physical devices.

Until that later wave closes, browser `speechSynthesis` remains a quality-improved fallback rather than the final production narration source.

## Verification record

Implementation branch:

`agent/english-narration-quality-20260922`

Base main:

`bda96275213368a8ec3d0a25bf6547ea1ba9efb1`

Verified implementation:

```text
PR:                       #278
Final PR head:            440f4864c1f4854747141706a5f4faac29ace376
Final PR CI:              #1366 / run 35697216106 — FULL SUCCESS
Merged main:              8d60a69a076cc6e5253650112f2ffe79add345ea
Merged-main CI:           #1367 / run 35697909785 — FULL SUCCESS
Cloudflare production:    SUCCESS — exact merged main SHA
English listening audit:  27 reviewed / 22 target-first / 5 comprehension
```

Merged-main production smoke explicitly verified that `https://mainlagihub.my.id` served release SHA `8d60a69a076cc6e5253650112f2ffe79add345ea` with the canonical production target.

Closure boundary: this wave closes the current browser-fallback/listening-copy quality improvement only. Final reviewed native/pre-generated production narration remains intentionally open as a later provider/audio-asset wave.
