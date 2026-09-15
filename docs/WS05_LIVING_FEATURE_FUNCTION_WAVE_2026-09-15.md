# WS-05 Science Living Feature Function Wave — 2026-09-15

Status: **implementation / QA pending**.

Branch: `agent/ws05-science-living-feature-function-20260915`  
Base `main`: `e1082a5ab236e16fad5502155575109c342fbeed`.

## Objective review

Pattern #21 is selected from a fresh exact-family audit after Material Lab became the canonical 20th merged gameplay pattern.

The Wave D investigation/evidence lesson remains intentionally ungrouped because its choice activities mix observation target selection, fair-variable control, prediction and conclusion. The two obvious prediction activities are also too small and spread across different lesson contexts to justify forcing the next wave around pattern-count pressure.

The strongest remaining exact family is the Wave D living-adaptation choice set. All four activities ask the child to connect a visible animal/plant feature to the function or advantage that feature provides.

## Exact scope

Only these four canonical `tap_choice` activities may use `living_feature_function`:

```text
science-feature-duck-webbed-feet
science-feature-fish-gills
science-feature-bird-beak-seeds
science-feature-cactus-water
```

Explicit exclusions:

```text
science-match-feature-function-d
science-animal-fins-fish
```

`science-match-feature-function-d` remains canonical `matching` / `visible_matching`. The Wave A `science-animal-fins-fish` activity is related conceptually but asks the inverse direction (function -> feature), belongs to a different stage/lesson/skill, and remains default choice gameplay in this wave.

## Interaction contract

`living_feature_function` makes the semantic relation visible as:

```text
organism -> feature -> function
```

The child sees the organism and highlighted feature before choosing among the canonical three function answers. A wrong function is retryable and cannot complete. A correct function records measured evidence and completes the canonical activity.

Preserved:
- runtime `tap_choice`;
- exact activity IDs;
- canonical choices and `correctChoice`;
- assessment/stars/progression identity;
- existing Wave D skill `science.living.features_function.basic`;
- stage identity `science-evidence-review-challenge`.

Proposed assessed evidence fidelity: `choice_living_feature_function_interaction`.

## Implementation surface

- `src/lib/learning/livingFeatureFunctionConfig.ts`
- `src/components/learning/LivingFeatureFunctionActivity.tsx`
- `src/components/learning/LivingFeatureFunctionActivity.module.css`
- exact classifier/routing in `gameplayPresentation.ts` and child activity route
- learning-test compilation inclusion
- static exact-scope regression including matching and Wave A exclusions
- permanent distribution recognition
- browser QA at 320/390/768 plus compact long-copy check for the cactus activity
- mobile CI-chain integration

## Expected branch distribution

Starting from the merged 20-pattern baseline:

```text
900 / 900 classified
0 unclassified
21 active patterns
choice_grid                    351 / 900 = 39.00%
living_feature_function          4 / 900 = 0.44%
Science choice_grid              64 / 100
Logic choice_grid                77 / 100
```

These are expected branch figures until CI verifies them. They are not merged production figures.

## Acceptance requirements

Before merge:
- typecheck/lint/build green;
- exact four-ID static scope regression green;
- `science-match-feature-function-d` remains visible matching;
- `science-animal-fins-fish` remains default choice gameplay;
- activity-quality remains 900 KEEP / 0 flagged;
- gameplay distribution confirms 21 patterns and 900/900 classification;
- legitimate Wave C readiness unlocks the Wave D representative route;
- keyboard wrong-state cannot complete;
- pointer correct relation completes;
- assessed attempt persists `choice_living_feature_function_interaction` evidence;
- >=44px controls and no horizontal overflow at 320/390/768;
- cactus long-copy stays bounded at compact phone width;
- success CTA remains visible at compact phone height;
- idle/error/success screenshots receive manual visual review;
- canonical docs update on accepted head;
- final docs-head CI is green;
- review threads/comments are clean;
- squash merge uses exact current head SHA and `main` is verified afterward.
