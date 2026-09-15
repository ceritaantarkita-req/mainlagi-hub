# WS-05 Investigation Board Wave — 2026-09-15

Status: **IMPLEMENTATION IN PROGRESS / PR UNMERGED**

Branch: `agent/ws05-science-investigation-board-20260915`

Base: verified live `main` at `05abb5191159299ee75b7a00a46d9ae4cdba075a` after Spatial Transform closure PR #134.

## Audit decision

The verified 27-pattern baseline has Science at exactly 60/100 `choice_grid` while Logic is 52/100. Concentration is only advisory, so the fresh audit compared coherent families rather than mechanically choosing the largest count.

Logic Wave C relative ordering is a viable later candidate, but Science Wave D `science-investigation-evidence` has the stronger next objective fit: four assessed `tap_choice` activities share one lesson, pack and skill while asking the child to reason from visible evidence about what to observe, what to keep constant, what to predict, or what conclusion is supported.

Pattern #28: `investigation_board`.

## Exact choice scope

```text
science-investigate-plant-light
science-investigate-fair-water
science-predict-ice-warm-place
science-evidence-shadow-times
```

All four share:
- subject `science`;
- stage `science-evidence-review-challenge`;
- lesson `science-investigation-evidence`;
- pack `science.pack.investigation-evidence`;
- canonical skill `science.investigation.evidence.basic`;
- assessed `tap_choice` runtime;
- exactly three canonical choices and unchanged `correctChoice`.

The fifth lesson activity is explicitly excluded from this choice pattern:

```text
science-match-observation-tools-d
```

It remains canonical `matching` / `grid_pairs` / `visible_matching` because its objective is tool-to-measurement matching rather than selecting one evidence-based answer.

## Interaction design

The Investigation Board uses one reusable board with four reviewed inquiry modes:
- `observe` — **Amati**;
- `control` — **Jaga tetap**;
- `predict` — **Prediksi**;
- `conclude` — **Simpulkan**.

For each activity:
- the board shows only scenario facts already supported by the canonical prompt;
- one process step is highlighted;
- a focus card states the reasoning target without revealing the answer;
- the unchanged three canonical choices remain direct keyboard/touch/pointer buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the existing canonical activity;
- no extra confirmation step, invented experiment result, fabricated numeric measurement, drag-only dependency, or intermediate assessment is added.

Assessed evidence fidelity: `choice_investigation_board_interaction`.

Runtime metadata records:
- source `investigation-board-runtime`;
- investigation mode and label;
- scenario title;
- reasoning focus label;
- selected canonical choice;
- standard assessed correct/incorrect/retry/accuracy fields.

## Expected PR-head distribution

Promoting exactly four current Science `choice_grid` activities should produce:

```text
classified:                900 / 900
unclassified:                0
active PR-head patterns:    28
choice_grid                318 / 900 = 35.33%
investigation_board          4 / 900 = 0.44%
Science choice_grid          56 / 100
Logic choice_grid            52 / 100
```

If merged unchanged, remaining distance becomes **22 patterns to minimum 50** and **32 to working target 60**.

## Required QA gates

Before this wave may be called QA accepted:
1. exact-family static regression proves exactly four choice IDs and preserves canonical runtime, assessment, skill, choices and `correctChoice`;
2. `science-match-observation-tools-d` remains canonical `visible_matching`;
3. permanent gameplay-presentation regression includes exactly four `investigation_board` activities while all other unreviewed choices remain `default`;
4. gameplay-distribution audit reports 28 patterns, 900/900 classified, zero unclassified, `choice_grid` 318/900, Science 56/100 and Logic 52/100;
5. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0;
6. five simulations remain `invariantErrors: 0`;
7. Batch17 totals remain unchanged and physical-device certification stays `PENDING_EXTERNAL_EVIDENCE`;
8. representative browser QA for `science-investigate-plant-light` passes 320x720, 390x844 and 768x1024 with legitimate Science Wave C progression readiness, keyboard wrong-state, pointer completion, exact choices, >=44px touch targets, no horizontal overflow, fully visible idle/retry/success feedback and CTA, assessed evidence, and zero console/page errors;
9. generated idle/try/success screenshots are manually reviewed at all three viewports;
10. full implementation-head CI is green;
11. only then are canonical docs finalized as QA accepted / unmerged, followed by fresh exact docs-head CI and a clean review gate before merge;
12. post-merge docs-only closure must itself pass full CI, clean gate, exact-head merge and final live-main verification before Pattern #28 is called fully closed.

This document intentionally does not claim acceptance or merge before those gates pass.
