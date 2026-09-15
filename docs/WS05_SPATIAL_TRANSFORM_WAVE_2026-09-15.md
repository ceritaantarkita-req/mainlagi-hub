# WS-05 Spatial Transform Wave — 2026-09-15

Status: **IMPLEMENTED / QA PENDING**

Branch: `agent/ws05-logic-spatial-transform-20260915`

Base: verified live `main` at `7e3192898e37743826266c92c6c12a918d72e508` after Set Reasoning metadata PR #132.

## Objective

Add one meaningful Logic gameplay pattern for the exact Wave D spatial-transform family without changing canonical activity identity, runtime, assessment, mastery, progression, choices, or correct answers.

Pattern: `spatial_transform`.

## Exact scope

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

All five share:
- subject `logic`;
- stage `logic-mixed-reasoning-challenge`;
- lesson `logic-spatial-transform`;
- pack `logic.pack.spatial-transform`;
- canonical skill `logic.spatial.transform.basic`;
- assessed `tap_choice` runtime;
- exactly three canonical choices;
- objective: determine final direction after a visible rotation or left-right mirror transformation.

## Explicit exclusions

Nearby but distinct families remain outside this pattern:

```text
logic-compose-triangle-turn-right
logic-set-both-red-round
logic-transitive-height-abc
logic-order-first-after-start
logic-infer-not-red
logic-spatial-star-left-circle
```

Wave B spatial-relation activities ask where objects are relative to one another; this Wave D family specifically transforms one direction through rotation or reflection. Those objectives are not bundled.

## Interaction design

Use a three-part direction-transform board:
- left card shows the canonical starting direction;
- center card shows only the canonical operation (quarter turn, half turn, two right turns, or left-right mirror);
- right result slot stays hidden as `?` until the child chooses;
- canonical answer choices remain accessible direct-selection buttons;
- wrong choice is retryable and cannot complete;
- correct choice completes the existing assessed activity;
- no drag-only dependency, extra confirmation, or invented intermediate assessment;
- the transform board must not reveal the correct final direction before assessment.

Assessed evidence fidelity: `choice_spatial_transform_interaction`.

Runtime metadata records:
- source `spatial-transform-runtime`;
- starting direction;
- transform kind (`rotation` or `mirror`);
- turn direction and quarter-turn count when applicable;
- mirror axis when applicable;
- operation label;
- selected canonical choice;
- standard assessed correct/incorrect/retry/accuracy fields.

## Expected PR-head distribution

If the exact five current Logic `choice_grid` activities are reclassified:

```text
classified:                900 / 900
unclassified:                0
active PR-head patterns:    27
choice_grid                322 / 900 = 35.78%
spatial_transform            5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            52 / 100
```

If merged unchanged, remaining distance becomes **23 patterns to minimum 50** and **33 to working target 60**.

## Required QA gates

Before this wave may be called QA accepted:
1. exact-family static regression proves exactly five IDs and preserves canonical skill/runtime/choices/correctChoice/assessment;
2. permanent gameplay-presentation regression includes exactly five `spatial_transform` activities while unrelated spatial-relation activities remain default;
3. gameplay-distribution audit reports 27 patterns, 900/900 classified, zero unclassified, `choice_grid` 322/900, Logic 52/100, Science 60/100;
4. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0;
5. five simulations remain `invariantErrors: 0`;
6. Batch17 totals remain unchanged and physical-device certification stays `PENDING_EXTERNAL_EVIDENCE`;
7. representative browser QA for `logic-spatial-halfturn-up` passes 320x720, 390x844 and 768x1024 with canonical Wave C progression readiness, keyboard wrong-state, pointer completion, hidden result slot, >=44px touch targets, overflow, feedback/CTA visibility, assessed evidence, and console/page-error checks;
8. generated idle/try/success screenshots are manually reviewed at all three viewports;
9. full implementation-head CI is green;
10. canonical docs are then finalized as QA accepted / unmerged, followed by a fresh exact docs-head CI and clean review gate before merge.

This document does not claim merge or acceptance until those gates have actually passed.
