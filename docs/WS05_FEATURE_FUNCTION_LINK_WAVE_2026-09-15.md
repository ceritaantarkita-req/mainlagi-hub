# WS-05 Science Feature Function Link Wave — 2026-09-15

Status: **ACCEPTED IMPLEMENTATION QA / PR #119 / UNMERGED**

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

Pattern: `feature_function_link`.

Interaction contract:
- show the familiar organism plus its reviewed feature as the source node;
- show the canonical three function choices as destination cards;
- child links the feature to one destination by keyboard or pointer/touch;
- wrong destination increments assessed error/retry evidence and cannot complete;
- correct destination completes through the existing activity identity;
- no drag-only requirement; accessible buttons remain the primary interaction.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, choices and `correctChoice` remain unchanged;
- canonical skill remains `science.living.features_function.basic` through the learning spec;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_feature_function_link_interaction`.

## Permanent guards added

- exact allowlist in `gameplayPresentation.ts`;
- explicit visual config for all four IDs;
- `run-feature-function-link-tests.mjs` locks exact family, stage, canonical learning-spec skill, choices/config, and matching exclusion;
- existing default-choice regression remains active and explicitly excludes only the reviewed specialized families;
- gameplay-distribution expected set includes `feature_function_link`;
- browser QA covers 320x720, 390x844 and 768x1024 with legitimate Science readiness, keyboard wrong-state, pointer completion, evidence persistence, touch targets, overflow and success CTA visibility;
- browser QA is wired into the permanent `test:ui:mobile-routes` chain.

## Regression history and fixes

The wave was not accepted on first pass. CI was used as a real blocker rather than bypassed.

- **CI #541:** failed engine tests because the old “all other tap-choice activities remain default” regression did not yet exclude the new exact specialized family. Mobile QA also failed because a decorative connector intercepted pointer events. The specialized-set regression was updated while preserving the old default-family assertion; the connector became `pointer-events: none`.
- **CI #543:** caught a mistake in the new static test: it asserted `activity.skillId`, but canonical skill identity belongs to the learning spec. The test was corrected to use `getActivityLearningSpec`; the runtime model was not changed just to satisfy the test.
- **CI #544:** Ubuntu, Windows, build, dependency and security gates passed, but Mobile Chromium correctly rejected the 320px success state because the success CTA was below the viewport. Phone success state was compacted only after completion; idle/error layout and >=44px answer controls were preserved.
- **CI #545:** full green on accepted implementation head `94effe387912f27d0667e36fbf1d2351d612b62d`.

## Accepted implementation QA

CI #545 verifies:

```text
900 / 900 classified
0 unclassified
21 active patterns on PR head
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

Additional accepted evidence:
- gameplay-presentation regression reports exactly 4 `feature_function_link` activities;
- dedicated static regression passes the exact four-ID family and canonical learning-spec skill;
- `science-match-feature-function-d` stays canonical `visible_matching`;
- deterministic activity quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0;
- five simulations complete with invariant errors 0;
- Batch17 final acceptance remains PASS: 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills; physical-device certification correctly remains `PENDING_EXTERNAL_EVIDENCE`;
- Ubuntu quality gate, Windows compatibility, production build, production dependency audit, secret history scan and Mobile Chromium all pass;
- browser QA passes legitimate progression, keyboard wrong-state, pointer completion, evidence persistence, >=44px controls, no horizontal overflow and in-viewport success CTA at 320/390/768;
- manual review of the **green #545 artifact** accepted idle/error/success at 320x720, 390x844 and 768x1024: no clipping, no control overlap, readable hierarchy, and the 320px success CTA is visible after the targeted compact-state fix.

These are PR-head QA figures until #119 merges. Pattern #21 is not yet shipped.

## Remaining acceptance gates

1. Final docs-head CI on the current PR #119 head after canonical docs synchronization.
2. Clean issue-comment/review-comment/submitted-review/thread check.
3. Re-fetch exact current PR head and confirm mergeability/base state.
4. Squash merge using exact `expected_head_sha`.
5. Verify live `main` contains the merge.
6. Docs-only post-merge closure: mark #119/`feature_function_link` MERGED, canonicalize 21-pattern distribution, then verify closure on `main`.
7. Resume fresh Science exact-family audit while Science remains above the >60% advisory hotspot; if no coherent family remains, proceed to Logic.
