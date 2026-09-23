# Mainlagi World — Fixed Narration Binary Provenance Gate — 22 September 2026

Status: **VALIDATED GREEN / NO WORLD FIXED NARRATION BINARY APPROVED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave hardens the fixed-narration pipeline before any permanent World MP3 is allowed into the public production tree.

## 1. Why this gate exists

The narration runtime already fails closed and the 88 cues already have deterministic IDs and approval records.

That alone is not enough once real binaries start appearing.

A permanent audio asset also needs to prove:

- the provider/model/voice identity is documented;
- source terms and rights basis are documented;
- commercial use is explicitly allowed;
- redistribution is explicitly allowed;
- AI-disclosure handling has an explicit decision;
- human pronunciation review is complete;
- child-learning review is complete;
- pacing/loudness/mobile playback review is complete;
- the committed MP3 is the exact reviewed binary;
- no unapproved/stray narration file appears in `public/`.

## 2. Approval contract hardened

`MoneyWorldNarrationApproval` now additionally requires:

```text
providerModel
voiceIdentity
sourceTerms
rightsBasis
commercialUseAllowed=true
redistributionAllowed=true
aiDisclosureRequired=<explicit boolean>
childLearningReviewed=true
technicalSha256=<64-char SHA-256>
```

Existing required fields remain:

```text
cueId
src
textFingerprint
speaker
locale
providerOrSource
rightsStatus
reviewedBy
reviewedAt
pronunciationReviewed
pacingReviewed
loudnessReviewed
mobilePlaybackReviewed
```

Current approvals remain intentionally empty.

## 3. Binary gate

New reusable validator:

```text
scripts/world-money-narration-asset-gate.mjs
```

CLI audit:

```text
scripts/validate-world-money-narration-assets.mjs
```

The gate validates each approved cue against:

```text
/audio/world/money-festival/id-ID/<cue-id>.mp3
```

and requires:

- deterministic path equality;
- safe normalized path;
- .mp3 extension;
- real file existence;
- 512–500000 byte technical range;
- MP3 signature;
- exact SHA-256 match;
- no duplicate production path.

## 4. Stray-public-audio rule

The validator scans:

```text
public/audio/world/money-festival/id-ID/
```

Any supported audio binary found there without a matching approved production record is rejected.

This prevents generated/test/unreviewed audio from becoming publicly shipped merely because somebody copied it under `public/`.

## 5. Regression fixtures

New permanent regression suite:

```text
scripts/run-world-money-narration-asset-validator-tests.mjs
```

It verifies fail-closed behavior for:

- review-pending baseline;
- stray public binary;
- missing commercial-use clearance;
- unresolved AI-disclosure decision;
- missing child-learning review;
- non-MP3 payload;
- SHA-256 drift;
- valid approved fixture.

The suite runs from the existing World money test path, so it is part of the normal World CI contract without adding a new package-level script surface.

## 6. Current truth

At this checkpoint candidate:

```text
canonical spoken cues:       88
approved fixed binaries:      0
public approved MP3s:          0
generation-authorized cues:    0
voice-gated cues:             88
browser speech fallback: ACTIVE
```

The correct result is therefore a clean asset gate with zero approved assets.

## 7. Boundary

This wave does not:

- generate a provider pilot;
- select a provider/model/voice;
- approve a voice identity;
- create permanent MP3 files;
- resume Gian/Naya character development;
- change narration copy;
- change cue IDs;
- change Stage/Scene/Segment progression;
- touch Belajar, Bermain/motion, evidence/mastery or database schemas.

## 8. Green validation / checkpoint

Exact validated head:

```text
31a2bdd41add5bca57e1606e875519cb83704bbe
```

Draft PR / CI:

```text
PR #282
Mainlagi TV V3 CI #1411
run 35723689117

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
checkpoint/world-petualangan-uang-narration-gate-green-20260922
@ 31a2bdd41add5bca57e1606e875519cb83704bbe
```

Do not move or force-push that checkpoint branch.

The next product decision remains:

```text
approve voice identity / source / rights boundary
```

Only after that decision should a small Stage-1 narration pilot be generated outside the public production tree for human listening review.
