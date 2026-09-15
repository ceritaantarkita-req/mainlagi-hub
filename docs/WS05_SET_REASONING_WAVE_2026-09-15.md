# WS-05 Set Reasoning Wave — 2026-09-15

Status: **IMPLEMENTED / QA PENDING**

Branch: `agent/ws05-logic-set-reasoning-20260915`

Base: verified live `main` at `4a146b1f188eb90c612a8cf4dd0285363d5f6738` after Transitive Chain closure metadata PR #129.

## Objective

Add one meaningful Logic gameplay pattern for the exact Wave D set-reasoning family without changing canonical activity identity, runtime, assessment, mastery, progression, choices, or correct answers.

Pattern: `set_reasoning`.

## Exact scope

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

All five share:
- subject `logic`;
- stage `logic-mixed-reasoning-challenge`;
- lesson `logic-set-reasoning`;
- pack `logic.pack.set-reasoning`;
- canonical skill `logic.set.relation.basic`;
- assessed `tap_choice` runtime;
- exactly three canonical choices;
- objective: determine category membership, intersection of two properties, exclusion, or being outside two target sets.

## Explicit exclusions

These nearby families stay outside `set_reasoning`:

```text
logic-compose-red-circle-to-star
logic-transitive-height-abc
logic-spatial-halfturn-up
logic-infer-not-red
logic-classify-red-round
```

No other Logic family is reclassified by this wave.

## Interaction design

Use an explicit two-rule set board instead of a generic three-button quiz:
- each rule is visible as `harus masuk` or `harus di luar`;
- the operation is named (`Irisan A ∩ B`, `A tetapi bukan B`, or `Di luar A ∪ B`);
- the child evaluates all rules together and taps one of the unchanged canonical choices;
- wrong choice is retryable and cannot complete;
- correct choice completes the canonical assessed activity;
- no false Venn geometry is used for subset cases such as birds within animals;
- no drag-only dependency;
- no extra confirmation or invented intermediate assessment.

Assessed evidence fidelity: `choice_set_reasoning_interaction`.

Runtime metadata records:
- source `set-reasoning-runtime`;
- the two explicit set rules and their membership state;
- operation label;
- selected canonical member;
- rule count 2;
- standard assessed correct/incorrect/retry/accuracy fields.

## Expected PR-head distribution

If the exact five current Logic `choice_grid` activities are reclassified:

```text
classified:                900 / 900
unclassified:                0
active PR-head patterns:    26
choice_grid                327 / 900 = 36.33%
set_reasoning                5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

If merged unchanged, remaining distance becomes **24 patterns to minimum 50** and **34 to working target 60**.

## Required QA gates

Before this wave may be called QA accepted:
1. exact-family static regression proves exactly five IDs and preserves canonical skill/runtime/choices/correctChoice/assessment;
2. permanent gameplay-presentation regression includes exactly five `set_reasoning` activities;
3. gameplay-distribution audit reports 26 patterns, 900/900 classified, zero unclassified, `choice_grid` 327/900, Logic 57/100, Science 60/100;
4. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0;
5. five simulations remain `invariantErrors: 0`;
6. Batch17 totals remain unchanged and physical-device certification stays `PENDING_EXTERNAL_EVIDENCE`;
7. representative browser QA for `logic-set-both-red-round` passes 320x720, 390x844 and 768x1024 with canonical Wave C progression readiness, keyboard wrong-state, pointer completion, explicit two-rule board, touch target, overflow, CTA, assessed evidence and console/page-error checks;
8. generated idle/try/success screenshots are manually reviewed at all three viewports;
9. full implementation-head CI is green;
10. canonical docs are then finalized as QA accepted / unmerged, followed by a fresh exact docs-head CI and clean review gate before merge.

This document does not claim merge or acceptance until those gates have actually passed.
