# Mainlagi World — Petualangan Uang Narration Contract — 22 September 2026

Status: **ACTIVE CONTRACT / FIXED AUDIO NOT YET PRODUCED**

This wave prepares Petualangan Uang for reviewed fixed narration without pretending that final audio binaries already exist.

## 1. Current production truth

The World pilot is audio-first, but current runtime speech still uses the existing Mainlagi AudioManager/browser speech fallback.

Canonical registry:

```text
src/lib/learning/world/moneyWorldNarration.ts
version: money-world-narration-v1
locale: id-ID
productionReady: false
```

Every currently spoken World unit now has a stable cue ID.

## 2. Covered spoken units

The registry covers:

- every narrative line;
- every concept line;
- every payoff line;
- every mini-game activity prompt;
- the final narrative-choice prompt.

The final recap stays visual-only at this checkpoint and is not silently counted as fixed narration.

## 3. Stable IDs

Narrative, concept and payoff cues reuse the stable Segment ID:

```text
money-s01-narrative-01
money-s01-concept-money
money-s01-payoff-01
```

Activity prompts use the stable activity placement ID plus `-prompt`:

```text
money-s01-activity-01-prompt
money-s01-activity-02-prompt
```

The narrative-choice prompt uses its Segment ID plus `-prompt`.

Runtime speech dedupe/replay keys now use these stable IDs instead of spoken copy. Text review therefore no longer changes the identity of the future audio slot.

## 4. Deterministic production path

Future reviewed files use:

```text
/audio/world/money-festival/id-ID/<cue-id>.mp3
```

Examples:

```text
/audio/world/money-festival/id-ID/money-s01-narrative-01.mp3
/audio/world/money-festival/id-ID/money-s08-activity-02-prompt.mp3
```

No file at these paths is claimed to exist yet.

## 5. Speaker contract

- Gian owns Gian story lines.
- Naya owns Naya story, concept and payoff lines.
- Naya is the current guide voice for mini-game prompts and the final narrative-choice prompt.

This is a role contract, not approval of a final voice provider, performer, cloned voice, license or distribution model.

## 6. Current fallback

All cues currently declare:

```text
status: fallback-runtime
productionSrc: null
fallback: browser-speech
```

The existing AudioManager remains responsible for locale, replay, unlock/warmup, mute state and unavailable-speech fallback.

## 7. Production acceptance gate

A cue may become `production-ready` only after:

1. final Indonesian copy is reviewed;
2. speaker/voice identity is approved;
3. provider or recording source is documented;
4. rights and redistribution boundary are explicit;
5. pronunciation is reviewed;
6. loudness, trim and pacing are consistent;
7. mobile playback is verified;
8. caption text matches spoken semantic content;
9. browser-speech fallback still works if the fixed file fails;
10. automated tests verify every production-ready cue has a real asset.

Do not set `productionSrc` merely because an MP3 has been generated.

## 8. Child-language rules

For the 6–8 pilot:

- one spoken unit = one idea;
- avoid paragraph narration;
- concrete example before jargon;
- Indonesian should sound natural and conversational;
- no promise of investment return;
- terms such as inflasi and investasi require pronunciation/context review.

## 9. Character artwork is a separate gate

Naya/Gian foreground production remains governed by:

```text
src/lib/learning/characterAssets.ts
src/lib/data/character-asset-provenance.json
docs/CHARACTER_ASSET_PIPELINE.md
```

Approving narration must not auto-approve human foreground artwork, and fallback avatars must not be treated as final World production art.

## 10. Safe next production wave

1. review/freeze the Indonesian cue sheet;
2. decide recording/TTS provider and rights boundary;
3. produce **Stage 1 only** first;
4. review pronunciation, pacing, loudness and child comprehension;
5. wire fixed-file playback with AudioManager/browser speech fallback;
6. run 320/390/430 mobile plus audio-failure QA;
7. only then produce all eight Stages.

This branch intentionally stops before claiming final audio binaries.
