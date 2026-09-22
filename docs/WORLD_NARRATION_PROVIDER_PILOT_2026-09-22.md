# Mainlagi World — Narration Provider/Voice Pilot Scope — 22 September 2026

Status: **VALIDATED GREEN / DECISION-READY / GENERATION BLOCKED / NO PROVIDER SELECTED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave prepares the smallest useful narration listening pilot without choosing a provider or voice on the project owner's behalf.

## 1. Exact pilot scope

Machine-readable source:

```text
src/lib/learning/world/moneyWorldNarrationPilot.ts
MONEY_WORLD_NARRATION_PROVIDER_PILOT_VERSION = money-world-narration-provider-pilot-v1
```

The pilot contains exactly four Stage-1 cues:

```text
money-s01-narrative-01       Gian · narrative
money-s01-concept-money      Naya · concept
money-s01-activity-01-prompt Naya · activity_prompt
money-s01-payoff-01          Gian · payoff
```

This gives:

```text
2 Gian-role samples
2 Naya-role samples
4 different spoken-use cases
1 Stage only
```

The pilot is intentionally small enough for human listening comparison before any bulk generation.

## 2. Provider-neutral boundary

Current machine state:

```text
state: voice-decision-required
providerStatus: unselected
generationAuthorized: false
publicOutput: false
productionOutput: false
runtimeActive: false
registryAutoApproval: false
```

No OpenAI, Google, ElevenLabs, Azure, local TTS, performer, cloned voice, or other source is selected by this contract.

## 3. Pilot packet

Utility:

```text
scripts/prepare-world-money-narration-provider-pilot.mjs
```

Usage:

```bash
node scripts/prepare-world-money-narration-provider-pilot.mjs
node scripts/prepare-world-money-narration-provider-pilot.mjs --out=tmp/world-narration-provider-pilot.json
```

The packet contains canonical copy, cue identity, speaker role, fingerprint and expected production path, plus the exact production decisions that still need approval.

It deliberately contains no API call and no provider credential path.

## 4. Required decision before generation

Generation stays blocked until an explicit decision covers:

- final narration identity: Gian/Naya role voices or an explicitly approved mascot/narrator identity;
- provider or recording source;
- provider model / recording method;
- voice identity;
- source terms;
- commercial-use clearance;
- redistribution clearance;
- AI disclosure decision;
- reuse boundary across future Worlds.

## 5. Why these four cues

The pilot is designed to expose voice-quality problems early:

- Gian narrative tests natural child-character dialogue;
- Naya concept tests explanation clarity;
- activity prompt tests concise instructional delivery;
- Gian payoff tests energetic closure without becoming overly theatrical.

If a voice/source cannot handle these four cleanly, bulk generation of 88 cues should not start.

## 6. Human review after a future authorized generation

A future generated pilot should remain outside `public/` and outside runtime activation until reviewed for:

- Indonesian pronunciation;
- age-appropriate warmth and clarity;
- role distinction;
- pacing;
- loudness consistency;
- instruction intelligibility;
- unwanted additions/paraphrasing;
- device playback;
- provider/source provenance and rights.

Only after pilot acceptance should Stage 1 production generation be considered.

## 7. Current truth

```text
pilot cues:                   4
provider selected:            NO
voice selected:               NO
generation authorized:        NO
production binary created:    NO
runtime fixed audio activated:NO
88-cue bulk generation:       BLOCKED
```

This is a decision-ready handoff, not an implicit authorization.


## 8. Green validation / checkpoint

Exact validated head:

```text
76443c05dcf6f50a0e65787180f7c13542ca87f9
```

Draft PR / CI:

```text
PR #282
Mainlagi TV V3 CI #1414
run 35725346949

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Frozen immutable checkpoint:

```text
checkpoint/world-petualangan-uang-provider-pilot-green-20260922
@ 76443c05dcf6f50a0e65787180f7c13542ca87f9
```

Do not move or force-push this checkpoint branch.

This checkpoint freezes only the four-cue provider-neutral pilot scope and its fail-closed decision boundary. It does not select or authorize any provider/voice.


## 9. Human-review gate follow-through

Production wave 11 adds a deterministic provider-neutral listening review contract:

```text
src/lib/learning/world/moneyWorldNarrationReview.ts
scripts/prepare-world-money-narration-review-sheet.mjs
docs/WORLD_NARRATION_REVIEW_GATE_2026-09-22.md
```

All four pilot cues must pass all nine blocking dimensions. Partial review, stale copy fingerprints, any pending dimension, or any failed dimension keeps the pilot unaccepted.

This does not change the current provider/voice/generation state.
