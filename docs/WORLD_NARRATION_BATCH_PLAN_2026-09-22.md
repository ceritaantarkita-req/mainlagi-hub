# Mainlagi World — Fixed Narration Stage Batch Plan — 22 September 2026

Status: **IMPLEMENTED / AUDIO GENERATION STILL BLOCKED BY VOICE-IDENTITY GATE**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave makes the remaining 88 fixed-narration cues operationally batchable without pretending that final voices are already approved.

## 1. Why generation is still blocked

Canonical narration speakers remain:

```text
Gian
Naya
```

Current runtime presentation while character development is paused remains:

```text
Gian role -> Gavi
Naya role -> Paca
```

Those are not the same thing as approving a final voice identity.

Generating/approving 88 permanent MP3 assets before that identity is decided would create a new replacement problem later. The repository therefore records an explicit fail-closed gate instead of silently choosing a voice.

## 2. Machine-readable production plan

Source:

```text
src/lib/learning/world/moneyWorldNarrationPlan.ts
MONEY_WORLD_NARRATION_PLAN_VERSION = money-world-narration-plan-v1
MONEY_WORLD_NARRATION_VOICE_POLICY.version = money-world-narration-voice-policy-v1
```

Current policy truth:

```text
finalHumanCharactersActivated: false
fixedAudioGenerationAuthorized: false
blockerId: voice-identity-not-approved
```

## 3. Stage batching

The 88 spoken cue slots are now grouped into exactly eight Stage production batches.

Rules:

- one batch per canonical Stage;
- Stage order must match the World;
- every narration cue appears exactly once;
- no cue may appear in two batches;
- no empty Stage batch;
- generation authorization is inherited from the explicit voice policy;
- approval state is derived from the production manifest, not maintained separately.

Current summary:

```text
Stage batches:               8
total cues:                 88
approved cues:              0
generation-authorized cues: 0
blocked cues:              88
```

Current status for all eight batches:

```text
blocked-voice-identity
```

## 4. Production packet tool

New utility:

```text
scripts/prepare-world-money-narration-batch.mjs
```

Examples:

```bash
node scripts/prepare-world-money-narration-batch.mjs --stage=1
node scripts/prepare-world-money-narration-batch.mjs --stage=money-stage-01-money-use
node scripts/prepare-world-money-narration-batch.mjs --stage=1 --out=tmp/stage-01-narration.json
```

The output contains:

- Stage/batch identity;
- generation authorization state;
- cue IDs;
- canonical speaker role;
- locale;
- canonical text;
- text fingerprint;
- deterministic expected MP3 path;
- current approval status;
- required approval metadata.

While the voice gate is closed, the packet prints an explicit stop instruction:

```text
STOP: audio generation is not authorized. Resolve and approve final voice identity first.
```

## 5. What unlocks generation

A future authorization must be explicit.

It must decide at minimum:

- whether final fixed audio represents Gian/Naya or a deliberately approved mascot narration identity;
- provider/recording source;
- voice identity/source;
- redistribution rights boundary;
- whether the voice may be reused across future Worlds;
- pronunciation/pacing baseline for Indonesian child-facing narration.

Only after that decision should:

```text
fixedAudioGenerationAuthorized
```

be changed to `true`.

Changing that flag is a product/production authorization, not a technical cleanup.

## 6. Existing approval gate remains unchanged

Even after generation becomes authorized, a generated MP3 does not become runtime production audio automatically.

Every cue still requires:

- deterministic source path;
- current copy fingerprint;
- matching speaker/locale;
- provider/source provenance;
- redistribution-approved rights;
- reviewer identity/timestamp;
- pronunciation review;
- pacing review;
- loudness review;
- mobile playback review.

Runtime remains fixed-audio-first only for approved cues, with browser speech fallback on failure.

## 7. QA

Static World QA now locks:

- narration-plan version;
- voice-policy version;
- human characters remain inactive;
- Gavi/Paca runtime presentation mapping remains unchanged;
- fixed audio generation authorization remains false;
- exactly eight Stage batches;
- exact 88-cue coverage;
- 0 approved / 0 generation-authorized / 88 blocked truth;
- batch order matches canonical Stage order;
- all batches remain `blocked-voice-identity`;
- the Stage packet tool emits an explicit STOP state while blocked.

## 8. Boundary

This wave does not:

- generate audio;
- choose a TTS vendor;
- choose a performer;
- approve a cloned/synthetic voice;
- approve rights;
- activate Gian/Naya visual production;
- change narration cue IDs;
- change World progression;
- change Belajar/evidence/mastery;
- touch Bermain/motion.

## 9. Safe next step

The technical pipeline is now ready for a **voice identity decision**.

Until that decision exists, the correct repository state is:

```text
0/88 approved
0/88 generation-authorized
browser speech fallback active
```

Do not create permanent narration binaries merely to make the counter move.
