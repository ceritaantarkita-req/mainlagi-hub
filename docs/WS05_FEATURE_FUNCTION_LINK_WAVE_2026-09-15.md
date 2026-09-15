# WS-05 Science Feature Function Link Wave — 2026-09-15

Status: **IMPLEMENTATION COMPLETE / CI + VISUAL QA PENDING**

Baseline: `main` @ `e1082a5ab236e16fad5502155575109c342fbeed` (post-Material-Lab closure PR #117).

## Why this family

The remaining Science Wave D investigation/evidence choices stay intentionally ungrouped because they mix experiment design, fair variables, prediction and conclusion. The next exact family instead comes from `science-living-adaptations`: four assessed choice activities share the same stage, lesson objective and skill, and all ask the child to connect a visible organism feature with its function.

Exact scope:

```text
science-feature-duck-webbed-feet
science-feature-fish-gills
science-feature-bird-beak-seeds
science-feature-cactus-water
```

Explicit exclusion:

```text
science-match-feature-function-d
```

The excluded activity is already canonical `matching` / `visible_matching` and measures direct pair matching rather than selecting one function for one visible feature.

## Pattern #21

Proposed pattern: `feature_function_link`.

Interaction contract:
- show the familiar organism plus its reviewed feature as the source node;
- show the canonical three function choices as destination cards;
- child links the feature to one destination by keyboard or pointer/touch;
- wrong destination increments assessed error/retry evidence and cannot complete;
- correct destination completes through the existing activity identity;
- no drag-only requirement; accessible buttons remain the primary interaction.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, skill IDs, choices and `correctChoice` remain unchanged;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_feature_function_link_interaction`.

## Permanent guards added

- exact allowlist in `gameplayPresentation.ts`;
- explicit visual config for all four IDs;
- `run-feature-function-link-tests.mjs` locks exact family, stage, skill, canonical choices/config, and matching exclusion;
- gameplay-distribution expected set includes `feature_function_link`;
- browser QA covers 320x720, 390x844 and 768x1024 with legitimate Science Wave C readiness, keyboard wrong-state, pointer completion, evidence persistence, touch targets, overflow and success CTA visibility;
- browser QA is wired into the permanent `test:ui:mobile-routes` chain.

## Expected branch distribution

```text
900 / 900 classified
0 unclassified
21 active patterns
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

These are expected branch figures until CI verifies them. They are not merged product state.

## Remaining acceptance gates

1. Full GitHub CI green on current PR head.
2. Verify deterministic activity audit remains 900 KEEP / 0 flagged / structural 0.
3. Verify gameplay-distribution output matches the expected exact scope/counts.
4. Download and manually review 320/390/768 idle/error/success screenshots.
5. Fix any visual, evidence, progression, build, package or portability regression found by CI/review.
6. Update canonical NEXT/CURRENT/catalog/audit docs only after accepted QA.
7. Final docs-head CI, clean review-thread/comment check and exact-head squash merge.
8. Post-merge docs closure and verified `main` before calling pattern #21 shipped.
