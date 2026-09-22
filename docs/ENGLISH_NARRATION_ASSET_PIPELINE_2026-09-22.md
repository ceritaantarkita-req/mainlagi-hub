# English Narration Asset Pipeline — 22 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED PRODUCTION GATE / NO PRODUCTION AUDIO ACTIVATED**

This document defines the production gate for fixed English learning narration after English Narration Quality Wave 1.

It complements:

- `ENGLISH_NARRATION_QUALITY_WAVE_2026-09-22.md` for the reviewed 27-activity spoken-copy baseline;
- `ARCHITECTURE.md` and `MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md` for the provider-independent narration contract;
- `KNOWN_LIMITATIONS.md` for the remaining final production voice requirement.

## 1. Scope and non-negotiable boundaries

This wave creates an **asset/provenance gate only**.

It does not:

- activate a new narration binary;
- put any provider API key in browser/client code;
- hard-code OpenAI, Google, ElevenLabs, Azure, or another provider into the learning runtime;
- change the 27 reviewed English listening transcripts;
- change choices, correct answers, runtime, evidence, mastery, progression, schema, content ownership, Mainlagi World, or character development;
- claim a final production voice before human listening review.

Browser `speechSynthesis` remains the current fallback/runtime source until a separately reviewed audio asset is approved and a later runtime-activation wave explicitly consumes the approved registry.

## 2. Canonical production directory

Reserved production directory:

```text
public/audio/narration/en/
```

This directory is production-only.

A binary placed there is publicly redistributed by the repository. Therefore the validator fails closed when it finds an audio file that is not backed by an approved provenance record.

Canonical path per activity:

```text
/audio/narration/en/<activity-id>-v1.mp3
```

No production binary is committed by this wave.

## 3. Machine-readable registry

Canonical file:

```text
src/lib/data/english-narration-asset-provenance.json
```

The registry contains exactly the **27 reviewed English `listen_and_choose` activities** from Wave 1:

- 22 target-first vocabulary/letter/phrase narrations;
- 5 sentence-level listening-comprehension narrations.

Initial state is intentionally:

```text
27 review-required
0 approved
0 productionPath
0 production binary
```

Each record locks:

- activity ID;
- `en-US` language;
- exact reviewed transcript;
- fixed expected production path;
- lifecycle;
- provider/model/voice review;
- terms/rights basis;
- commercial-use decision;
- repository redistribution decision;
- AI-disclosure requirement decision;
- pronunciation review;
- child-learning suitability review;
- MP3 byte bounds;
- exact SHA-256 once approved.

## 4. Approval sequence

A fixed narration asset may move from `review-required` to `approved` only in this order:

1. select a provider/model/voice for a pilot;
2. generate the audio **outside client runtime** using a server-side/offline credential;
3. listen to the exact output;
4. confirm native-feeling pronunciation and child-friendly pacing;
5. confirm the audio matches the reviewed transcript exactly enough for the learning objective;
6. review provider terms, commercial-use rights, and repository redistribution rights;
7. record whether an AI-generated-voice disclosure is required;
8. compute the exact binary SHA-256;
9. update the registry with provider/review/provenance metadata;
10. add the exact MP3 binary at its canonical path;
11. pass `npm run validate:assets:narration`;
12. pass `npm run test:assets:narration`;
13. pass full repository CI;
14. only then open a separate runtime-activation wave.

Passing provenance validation does **not** silently activate audio at runtime.

## 5. Blocking validator

Canonical validator:

```text
scripts/validate-english-narration-assets.mjs
```

Permanent commands:

```bash
npm run validate:assets:narration
npm run test:assets:narration
npm run validate:assets
```

The validator blocks:

- registry drift away from the exact 27 reviewed activity IDs;
- wrong language or missing transcript;
- unsafe/non-canonical production paths;
- stray public narration binaries;
- non-MP3 production payloads;
- missing provider/model/voice/terms/rights metadata;
- missing commercial-use clearance;
- missing repository redistribution clearance;
- unresolved AI-disclosure decision;
- missing human pronunciation approval;
- missing child-learning suitability approval;
- missing or mismatched SHA-256;
- files outside the declared byte bounds.

## 6. Regression fixtures

`run-english-narration-asset-validator-tests.mjs` proves the gate against:

- clean review-required baseline;
- stray public narration file;
- commercial-use clearance missing;
- pronunciation review missing;
- checksum drift;
- fake/non-MP3 payload;
- valid fully approved fixture.

These fixtures use generated test bytes only. They do not introduce production narration.

## 7. Provider pilot evidence snapshot

Provider choice remains **open**. The pipeline is deliberately provider-independent.

Current official-product evidence reviewed on 22 September 2026 suggests these pilot candidates:

### OpenAI GPT-4o mini TTS

- current Speech API supports GPT-4o mini TTS;
- built-in voices are optimized for English;
- voice delivery can be instructed for accent, tone, speed, and intonation;
- official guidance requires clear disclosure that the TTS voice is AI-generated;
- MP3 is a supported output format.

### Google Cloud Text-to-Speech

- supports a large voice/language catalog;
- supports speaking-rate and SSML controls;
- Neural2 public pricing is listed at US$16 per 1 million characters after the free allowance.

### ElevenLabs

- useful as a quality benchmark for expressive voice output;
- API v3 pricing is listed at US$0.10 per 1,000 characters;
- paid plans provide commercial usage rights according to current product documentation.

These facts are a **pilot shortlist, not production approval**. Provider/model/voice terms and prices must be rechecked at generation time.

## 8. Recommended pilot order

The first production-audio pilot should be small and reversible:

```text
english-listen-bird        -> "Bird."
english-listen-letter-a    -> "Letter A."
english-listen-phrase-blue-book -> "A blue book."
english-detail-red-ball    -> "The ball is red. What color is the ball?"
```

This four-item sample covers:

- one simple noun;
- one letter name;
- one short phrase;
- one sentence-level comprehension prompt.

A provider/voice is not selected by code in this wave. Human listening acceptance is required before any of the four can become `approved`.

## 9. Verification record

```text
PR:                         #280
final PR head:              6d66ce14847440d54c6778a35cc6f116d4b9cb24
final PR CI:                #1371 / run 35700739978 — FULL SUCCESS
merged main:                2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48
merged-main CI:             #1372 / run 35701448136 — FULL SUCCESS
Cloudflare production:      SUCCESS — exact merged main SHA
approved production audio:  0
review-required slots:      27
runtime static audio:       NOT ACTIVATED
```

Merged CI explicitly proved the fail-closed state:

```text
narration assets OK: 0 approved English production asset(s); 27 review-required slot(s)
English narration asset validator regression passed
English narration quality regression passed: 27 reviewed / 22 target-first / 5 comprehension / asset registry transcripts synchronized
```

Production smoke verified `https://mainlagihub.my.id` serving exact SHA `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48` with the canonical Supabase target.

## 10. Current boundary after this wave

Merged/live-verified state:

```text
Wave 1 browser fallback/listening copy: closed/live verified
Narration production asset gate:        implemented
Approved pre-generated English audio:   0
Runtime static-audio activation:         not started
Browser speech fallback:                 preserved
Mainlagi World:                          untouched
Character development:                   paused
```

The provider-pilot **harness** is now merged/live verified via PR #283 -> implementation baseline `4b975130...`. The next safe step is actual local/server-side four-item candidate generation + human listening review, not bulk generation of all 27 assets and not runtime activation. The primary pilot candidate remains OpenAI API with pinned `gpt-4o-mini-tts-2025-12-15` and `marin`/`cedar`; this is a pilot choice, not a production-provider lock. See `ENGLISH_NARRATION_PROVIDER_PILOT_2026-09-22.md` and `ENGLISH_NARRATION_PROVIDER_PILOT_HARNESS_CLOSURE_2026-09-22.md`. Safe handoff: `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`.


## 11. Provider-pilot harness prepared after asset-gate closure

The four-item pilot now has a machine-readable spec and an offline/server-side generation harness:

```text
src/lib/data/english-narration-pilot-spec.json
scripts/generate-english-narration-openai-pilot.mjs
scripts/run-english-narration-pilot-tests.mjs
docs/ENGLISH_NARRATION_PROVIDER_PILOT_2026-09-22.md
```

The harness defaults to dry-run, writes real candidates only under gitignored `internal/`, requires `OPENAI_API_KEY` only for explicit `--generate`, never auto-updates the production registry, and never activates runtime audio. `npm run validate:assets` includes the provider-pilot regression. PR #283 merged this harness to implementation baseline `4b975130bf6e5fc28cecbf6aea5373b7a1430c65`; merged-main CI #1396 / run `35719862989` and exact-SHA Cloudflare production smoke passed. No pilot audio was generated by that wave.
