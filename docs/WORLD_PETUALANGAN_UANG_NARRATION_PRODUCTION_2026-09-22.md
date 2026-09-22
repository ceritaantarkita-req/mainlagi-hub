# Mainlagi World — Petualangan Uang Fixed Narration Production Pass — 22 September 2026

Status: **PIPELINE IMPLEMENTED ON ISOLATED WORLD BRANCH / 0 OF 88 FIXED AUDIO CUES APPROVED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave turns the earlier stable narration-ID contract into a fail-closed fixed-audio production/review/runtime pipeline. It does **not** claim that final MP3 binaries or final character voices already exist.

## 1. Canonical cue registry remains stable

Base registry:

```text
src/lib/learning/world/moneyWorldNarration.ts
MONEY_WORLD_NARRATION_CONTRACT_VERSION = money-world-narration-v1
locale = id-ID
```

Current pilot has:

```text
89 total Segments
1 visual-only recap Segment
88 spoken cue slots
```

Cue IDs, Stage IDs, activity IDs and Segment IDs remain unchanged.

## 2. Production/review manifest

New source of truth:

```text
src/lib/learning/world/moneyWorldNarrationProduction.ts
MONEY_WORLD_NARRATION_PRODUCTION_VERSION = money-world-narration-production-v1
```

Every canonical cue receives a deterministic production entry containing:

- cue ID;
- Stage ID;
- kind;
- canonical speaker role;
- locale;
- canonical copy;
- copy/speaker/kind fingerprint;
- deterministic expected MP3 path;
- review status;
- production source when approved;
- browser-speech fallback.

Current summary:

```text
total:           88
approved:         0
pending:         88
productionReady: false
```

This is deliberate. No generated audio is allowed to become production audio merely because a file exists.

## 3. Deterministic asset path

Approved files must use:

```text
/audio/world/money-festival/id-ID/<cue-id>.mp3
```

Example:

```text
/audio/world/money-festival/id-ID/money-s01-narrative-01.mp3
/audio/world/money-festival/id-ID/money-s08-activity-02-prompt.mp3
```

An approval record whose `src` differs from the deterministic path fails validation.

## 4. Copy drift protection

Each cue gets a deterministic fingerprint:

```text
fnv1a32-xxxxxxxx
```

Fingerprint input contains:

```text
locale
speaker role
cue kind
canonical text
```

If copy, speaker or kind changes after audio review, the old approval becomes stale and fixed playback fails closed until the cue is reviewed again.

This prevents a previously approved MP3 from silently surviving a content rewrite.

## 5. Approval gate

A fixed asset becomes runtime-eligible only when an explicit approval record matches the canonical cue and contains:

- exact deterministic path;
- current text fingerprint;
- matching canonical speaker;
- matching locale;
- provider/recording source;
- `redistribution-approved` rights state;
- reviewer identity;
- valid review timestamp;
- pronunciation review;
- pacing review;
- loudness review;
- mobile playback review.

The approval registry is intentionally empty in this wave.

## 6. Runtime resolution

New playback adapter:

```text
src/lib/learning/world/moneyWorldNarrationPlayback.ts
```

Runtime order:

```text
1. resolve cue ID
2. check explicit production approval
3. if approved -> attempt deterministic fixed MP3
4. if fixed playback fails -> browser speech
5. if not approved -> browser speech
```

The World UI no longer calls `speakPrompt(...)` directly for narration/prompt playback. It routes through `playMoneyWorldNarration(...)`.

The rendered cue exposes:

```text
data-world-narration-mode="idle | fixed-audio | browser-speech"
```

At the current checkpoint every cue resolves to `browser-speech`, because no fixed binary has passed approval.

## 7. Failure behavior

Fixed narration remains optional and fail-safe.

If an approved MP3:

- cannot be constructed;
- fails to load;
- rejects playback;
- emits an audio error;

the adapter immediately falls back to the same browser-speech path used before this production wave.

Text stays visible even if both fixed audio and browser speech are unavailable.

Mute state remains respected.

## 8. Dummy-character boundary

Character development is still paused.

Rendered World characters remain:

```text
Gian canonical role -> Gavi runtime dummy
Naya canonical role -> Paca runtime dummy
```

The fixed-audio approval gate must not be used to smuggle in an unapproved final Gian/Naya voice identity. Provider/voice/source and rights still require explicit review.

Until final voice identity is approved, browser speech remains the safe production fallback.

## 9. Cue-sheet export and asset audit

Utility:

```text
scripts/export-world-money-narration-cue-sheet.mjs
```

Default usage:

```bash
node scripts/export-world-money-narration-cue-sheet.mjs
```

Write a review/generation handoff file:

```bash
node scripts/export-world-money-narration-cue-sheet.mjs --out=tmp/world-money-narration-cue-sheet.json
```

The export is generated from the canonical repository contract, not maintained as a second hand-written source of truth.

The utility also fails if an **approved** narration record points to a missing asset.

## 10. Automated gates

`scripts/run-world-money-tests.mjs` now checks:

- production manifest version;
- clean production validation;
- exactly 88 cue entries;
- current 0/88 approved truth;
- deterministic path compatibility;
- copy fingerprints;
- no unreviewed cue exposes `productionSrc`;
- runtime uses the fixed-audio resolver;
- World runtime does not bypass the resolver with direct `speakPrompt(...)`;
- playback adapter retains fixed-file -> browser-speech fallback.

Mobile browser QA checks that current unapproved narrative and activity-prompt cues resolve to:

```text
data-world-narration-mode="browser-speech"
```

## 11. What this wave does not do

This wave does not:

- create or pretend to create final MP3 binaries;
- select a TTS/recording provider;
- approve a voice performer or cloned voice;
- approve redistribution/licensing;
- resume Gian/Naya human-character production;
- modify World progression;
- activate World -> Belajar evidence;
- change SQL schemas;
- change the global age boundary.

## 12. Fixed narration completion condition

The production gap `fixed-narration` remains open until:

```text
approved == total == 88
validation == clean
every approved MP3 exists
mobile playback QA passes
productionReady == true
```

Until then browser speech remains the authoritative fail-safe runtime path.

## 13. Scene-layer follow-through

The reusable Scene presentation/renderer system is now implemented separately from narration:

```text
src/lib/learning/world/worldScenePresentation.ts
src/components/learning/world/WorldSceneRenderer.tsx
```

Narration continues to bind by stable cue ID inside those Scene surfaces. The next branch task is end-to-end production QA and responsive cleanup before freezing a new green checkpoint.


## 14. Production wave 08 — Stage batch readiness / voice gate

The 88 cue slots are now grouped into eight canonical Stage batches by:

```text
src/lib/learning/world/moneyWorldNarrationPlan.ts
```

Current voice-production policy is deliberately fail-closed:

```text
fixedAudioGenerationAuthorized=false
blockerId=voice-identity-not-approved
```

This prevents the temporary Gavi/Paca runtime presentation mapping from silently becoming a permanent Gian/Naya voice decision.

A provider-neutral Stage packet tool is available at:

```text
scripts/prepare-world-money-narration-batch.mjs
```

Detailed plan: `WORLD_NARRATION_BATCH_PLAN_2026-09-22.md`.

Current truth remains:

```text
8 Stage batches
88 total cues
0 approved
0 generation-authorized
88 blocked
```
