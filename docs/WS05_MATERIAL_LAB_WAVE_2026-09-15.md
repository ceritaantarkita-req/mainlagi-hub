# WS-05 Science Material Lab Wave — 2026-09-15

Status: **implementation / QA pending**.

## Objective review

The next Science mechanic was selected from exact objective/evidence review, not from pattern-count pressure.

Wave D investigation/evidence was reviewed first, but its four choice activities mix experiment design, control variables, prediction, and conclusion. They are not one sufficiently coherent interaction family and remain outside this wave.

The Wave D material-design family is coherent: each activity asks the child to choose a material property that makes a familiar object fit its purpose.

## Exact scope

Only these four canonical `tap_choice` activities may use `material_lab`:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Explicit exclusion:

```text
science-match-material-purpose-d
```

The excluded activity remains canonical `matching` / `visible_matching` because it measures property-purpose pairing rather than selecting and testing one material property for an object.

## Interaction contract

`material_lab` uses a deliberate two-step interaction:

1. choose one canonical material-property sample;
2. explicitly test that sample against the visible object purpose.

Selection alone cannot complete the activity. A wrong tested sample is retryable and cannot complete. A correct tested sample records measured evidence and then completes.

The engine preserves:
- runtime `tap_choice`;
- exact activity IDs;
- canonical choices and `correctChoice`;
- canonical assessment/stars/progression identity;
- existing skill IDs;
- stage identity `science-evidence-review-challenge`.

Assessed evidence fidelity is `choice_material_lab_interaction`.

## Implementation surface

- `src/lib/learning/materialLabConfig.ts`
- `src/components/learning/MaterialLabActivity.tsx`
- `src/components/learning/MaterialLabActivity.module.css`
- exact classifier/routing in `gameplayPresentation.ts` and the child activity route
- static scope regression in `run-gameplay-presentation-tests.mjs`
- permanent distribution recognition in `audit-gameplay-distribution.mjs`
- browser/mobile QA in `run-material-lab-browser-tests.mjs`
- mobile CI chain integration through `package.json`

## Expected distribution if accepted

Starting from the merged 19-pattern PR #114 baseline:

```text
900 / 900 classified
0 unclassified
20 active patterns
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

These are expected branch figures until the distribution audit and CI verify them. They must not be presented as merged production figures before exact-head merge verification.

## Acceptance requirements

Before merge:
- typecheck/lint/build green;
- learning/gameplay regression green;
- deterministic activity-quality audit remains clean;
- gameplay-distribution audit confirms exact 20-pattern set and 900/900 coverage;
- legitimate Wave C readiness unlocks the representative Wave D route;
- keyboard can select a sample;
- selecting a sample alone cannot complete;
- wrong explicit test cannot complete;
- pointer correct selection + explicit test completes;
- assessed attempt persists `choice_material_lab_interaction` evidence;
- touch targets remain >=44px and no horizontal overflow at 320/390/768;
- success CTA remains visible at compact phone height;
- idle/error/success screenshots receive manual visual review;
- canonical docs are updated at the accepted implementation head;
- final docs-head CI is green;
- review threads/comments are clean;
- squash merge uses the exact current head SHA and `main` is verified afterward.
