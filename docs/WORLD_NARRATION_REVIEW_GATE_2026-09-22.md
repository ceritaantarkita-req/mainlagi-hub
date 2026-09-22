# Mainlagi World — Narration Provider Pilot Human Review Gate — 22 September 2026

Status: **IMPLEMENTED / PROVIDER-NEUTRAL / GENERATION STILL BLOCKED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave defines the human listening gate that must be used after a future authorized four-cue provider/voice pilot is generated.

It does not select a provider, voice, performer, or synthetic voice.

## 1. Source contract

Machine-readable source:

```text
src/lib/learning/world/moneyWorldNarrationReview.ts
MONEY_WORLD_NARRATION_REVIEW_VERSION = money-world-narration-review-v1
```

The contract consumes the existing exact four-cue pilot scope and does not define a second narration cue registry.

## 2. Blocking review dimensions

Every pilot cue must pass all nine dimensions:

```text
exact_copy
pronunciation
child_comprehension
pacing
warmth
role_fit
loudness_consistency
artifact_free
mobile_playback
```

Every dimension is blocking.

There is no average score, weighted score, or "mostly good" override. One failed blocking dimension keeps the pilot unaccepted.

## 3. Exact four-cue scope

The review sheet is generated from the already-frozen provider-neutral pilot:

```text
money-s01-narrative-01       Gian · narrative
money-s01-concept-money      Naya · concept
money-s01-activity-01-prompt Naya · activity_prompt
money-s01-payoff-01          Gian · payoff
```

The review gate must cover all four cues exactly once.

Partial review is invalid.

## 4. Copy drift protection

Each review record carries the cue's current:

```text
textFingerprint
```

If canonical narration copy changes after review, the old review becomes stale and invalid.

A reviewer cannot approve a previously generated binary against a rewritten cue without a new review.

## 5. Human review identity

Every completed review record requires:

```text
reviewer
reviewedAt
```

This is separate from provider/source/rights approval.

The listening review does not replace the binary provenance gate.

## 6. Acceptance rule

The four-cue pilot is accepted only when:

```text
scope == exact four pilot cues
AND
every record fingerprint == current cue fingerprint
AND
reviewer metadata is complete
AND
every one of nine dimensions == pass
for every cue
```

Any `pending` or `fail` result means:

```text
accepted=false
```

## 7. Review-sheet utility

New utility:

```text
scripts/prepare-world-money-narration-review-sheet.mjs
```

Usage:

```bash
node scripts/prepare-world-money-narration-review-sheet.mjs
node scripts/prepare-world-money-narration-review-sheet.mjs --out=tmp/world-money-narration-review.json
```

The generated packet contains:

- pilot version;
- current provider status;
- current generation authorization;
- all blocking review dimensions;
- one pending record per exact pilot cue;
- current cue fingerprints.

The tool is provider-neutral and performs no network/API call.

## 8. Current truth

At this wave:

```text
provider selected:             NO
voice selected:                NO
generation authorized:         NO
pilot binaries generated:      NO
pilot human review completed:  NO
pilot accepted:                NO
runtime fixed audio activated: NO
```

This is expected.

The point of this wave is to make future human review deterministic before any provider is chosen.

## 9. Automated QA

World static QA now verifies:

- review contract version;
- exactly nine blocking dimensions;
- exact four-cue review template scope;
- pending records are valid but never accepted;
- all-pass four-cue fixture is accepted;
- one failed pronunciation dimension rejects acceptance;
- stale text fingerprint invalidates review;
- partial three-cue review fails closed;
- review-sheet tool remains offline/provider-neutral.

## 10. Boundary

This wave does not:

- authorize generation;
- select a provider;
- select a voice;
- create audio;
- write to `public/`;
- approve narration provenance;
- activate runtime fixed audio;
- resume Gian/Naya visual character development;
- modify Belajar, Bermain/motion, mastery/evidence, SQL schema, age migration, or World progression.

## 11. Next decision

The technical preparation for a small narration pilot is now complete through:

```text
cue scope
-> Stage batching
-> voice-identity gate
-> binary provenance gate
-> provider-neutral four-cue pilot
-> deterministic human listening review gate
```

The remaining blocker is a real product/production decision:

```text
voice identity + provider/source + rights boundary
```

Until that is explicitly approved, generation must remain blocked.
