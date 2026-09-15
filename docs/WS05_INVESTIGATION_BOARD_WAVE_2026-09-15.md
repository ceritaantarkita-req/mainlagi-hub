# WS-05 Investigation Board Wave — 2026-09-15

Status: **IMPLEMENTATION IN PROGRESS / PR #135 UNMERGED**

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

All four share subject `science`, stage `science-evidence-review-challenge`, lesson `science-investigation-evidence`, pack `science.pack.investigation-evidence`, canonical skill `science.investigation.evidence.basic`, assessed `tap_choice` runtime, exactly three canonical choices and unchanged `correctChoice`.

The fifth lesson activity, `science-match-observation-tools-d`, is explicitly excluded. It remains canonical `matching` / `grid_pairs` / `visible_matching` because its objective is tool-to-measurement matching rather than selecting one evidence-based answer.

## Interaction design

The Investigation Board uses one reusable board with four reviewed inquiry modes: `observe` / **Amati**, `control` / **Jaga tetap**, `predict` / **Prediksi**, and `conclude` / **Simpulkan**.

For each activity the board shows only prompt-supported scenario facts, highlights one process step, gives a focus cue without revealing the answer, and preserves the unchanged three canonical direct-selection choices. Wrong choice increments assessed error/retry and cannot complete; correct choice completes the existing canonical activity. No extra confirmation, invented experiment result, fabricated numeric measurement, drag-only dependency, or intermediate assessment is added.

Assessed evidence fidelity: `choice_investigation_board_interaction`. Runtime metadata source: `investigation-board-runtime`.

## Expected PR-head distribution

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

## Acceptance history

### CI #611 / run `34983143311` — rejected on real 320px layout defect

All non-browser gates passed: Ubuntu engine/static regressions, deterministic activity-quality, gameplay distribution, simulations, Batch17, Windows compatibility, production build, dependency audit, and secret scan. The permanent classifier/test coverage therefore validated the exact four-ID scope and matching exclusion.

Mobile Chromium correctly blocked acceptance at the dedicated Investigation Board browser regression. At 320x720 the idle feedback card was not fully inside the viewport. The failure happened before wrong/correct interaction, so CI #611 is diagnosis evidence only and is not an accepted implementation run.

Correct fix:
- keep process rail, scenario board, focus cue, all three canonical choices, feedback and evidence semantics unchanged;
- at phone widths <=360px hide only the redundant intro card because the Garden activity frame already exposes the canonical activity title/narration;
- keep touch targets unchanged;
- compact board spacing slightly;
- retain the strict idle/retry/success visibility assertions rather than weakening the test.

Responsive fix commit: `062e451a062c2df827c4b44e8c61e216c3376029`.

## Required QA gates

Before this wave may be called QA accepted:
1. exact-family static regression proves exactly four choice IDs and preserves canonical runtime, assessment, skill, choices and `correctChoice`;
2. `science-match-observation-tools-d` remains canonical `visible_matching`;
3. permanent gameplay-presentation regression keeps the exact four-ID allowlist and default-family guard;
4. gameplay-distribution audit verifies 28 patterns, 900/900 classified, zero unclassified, `choice_grid` 318/900, Science 56/100 and Logic 52/100;
5. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0;
6. simulations and Batch17 remain clean;
7. representative browser QA passes 320x720, 390x844 and 768x1024 with legitimate progression readiness, keyboard wrong-state, pointer completion, exact choices, >=44px touch targets, no horizontal overflow, fully visible idle/retry/success feedback + CTA, assessed evidence, and zero console/page errors;
8. generated idle/try/success screenshots are manually reviewed at all three viewports;
9. full implementation-head CI is green;
10. canonical docs are then finalized as QA accepted / unmerged and re-tested on a fresh exact docs-head CI;
11. implementation exact-head merge + live-main verification and a separate docs-only closure CI/gate/merge are required before Pattern #28 is called fully closed.

This document intentionally does not claim acceptance or merge before those gates pass.
