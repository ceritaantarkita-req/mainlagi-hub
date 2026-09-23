# Mainlagi World — Petualangan Uang Narration Contract — 22 September 2026

Status: **ACTIVE CONTRACT / FIXED-AUDIO PIPELINE IMPLEMENTED / 0 OF 88 CUES APPROVED**

This contract defines the stable cue layer. Production wave 04 now adds a fail-closed generation/review/playback pipeline without pretending that final audio binaries already exist.

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

## 6. Current fallback and production resolver

Canonical cues still declare:

```text
status: fallback-runtime
productionSrc: null
fallback: browser-speech
```

Production approval is now tracked separately in:

```text
src/lib/learning/world/moneyWorldNarrationProduction.ts
version: money-world-narration-production-v1
```

Current production truth is **88 total / 0 approved / 88 pending / productionReady=false**.

World narration/prompt runtime now goes through `moneyWorldNarrationPlayback.ts`. An explicitly approved deterministic MP3 is attempted first; construction/load/playback failure falls back to browser speech. Unapproved cues go directly to browser speech.

The existing AudioManager remains responsible for browser-speech locale, replay, unlock/warmup, mute state and unavailable-speech behavior.

## 7. Production acceptance gate

A cue may become fixed-audio eligible only after:

1. final Indonesian copy is reviewed;
2. the approval fingerprint matches current locale + speaker + cue kind + copy;
3. speaker/voice identity is approved;
4. provider or recording source is documented;
5. redistribution rights are explicitly approved;
6. pronunciation is reviewed;
7. loudness and pacing are reviewed;
8. mobile playback is verified;
9. caption text matches spoken semantic content;
10. browser-speech fallback still works if the fixed file fails;
11. the file exists at the deterministic expected path.

Do not add an approval record merely because an MP3 has been generated. Generated files are inert until the review record passes validation.

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

## 10. Production wave 04 implementation

Completed on the isolated World branch:

1. deterministic production/review manifest for all 88 spoken cue slots;
2. copy/speaker/kind fingerprint drift protection;
3. explicit provider/source + redistribution-rights review fields;
4. fixed-file runtime resolver;
5. fixed-file playback failure -> browser-speech fallback;
6. cue-sheet export + approved-asset audit utility;
7. static QA for 88/88 manifest coverage and current 0/88 approval truth;
8. browser QA proving current unapproved narrative/activity prompts resolve to browser speech.

Detailed record:

```text
docs/WORLD_PETUALANGAN_UANG_NARRATION_PRODUCTION_2026-09-22.md
```

The branch still intentionally stops before claiming final audio binaries or final voices.


## Runtime-character dummy note — production wave 01

Character development is currently paused. The canonical World story/narration metadata still uses the future story roles **Gian** and **Naya**, but the rendered pilot maps those roles to approved mascot production assets:

```text
Gian -> Gavi
Naya -> Paca
```

Browser-speech fallback uses the temporary presented copy, so visible/spoken names stay consistent during the dummy phase. Stable cue IDs do **not** change.

This does not approve final Gian/Naya artwork or voices, and it does not make `productionReady=true`.


## Production artifact boundary

Use:

```text
node scripts/export-world-money-narration-cue-sheet.mjs
```

to generate the current cue sheet for a recording/TTS handoff. The generated export is not a second source of truth and should not be used to bypass repository review metadata.
