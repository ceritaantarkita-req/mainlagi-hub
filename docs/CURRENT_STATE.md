# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged product baseline: `e1082a5ab236e16fad5502155575109c342fbeed` (post-Material-Lab docs closure PR #117)
- latest merged gameplay change: PR #116 — Science Material Lab, gameplay merge `5d6b429b64681bc6f2aa055a643a607cf54b1102`
- active gameplay branch: `agent/ws05-science-feature-function-link-20260915`
- active gameplay PR: **#119 — Science Feature Function Link, accepted implementation QA / unmerged**
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

PR #119 implementation head `94effe387912f27d0667e36fbf1d2351d612b62d` is full-green on CI #545 after CI intentionally caught and forced fixes for regression-set coverage, pointer interception, canonical skill-test location, and 320px success CTA visibility. The PR is still unmerged until final docs-head CI + review check + exact-head merge.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 20 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`.

```text
classified:           900 / 900
unclassified:           0
active patterns:       20
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

### PR #119 Feature Function Link — ACCEPTED IMPLEMENTATION QA / UNMERGED

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

The four scoped activities share the same Science Wave D stage/lesson/skill and ask which function matches one familiar organism feature. The excluded activity remains canonical `matching` / `visible_matching`.

Interaction/evidence contract:
- visible organism/feature source plus canonical three function destinations;
- keyboard and touch/pointer use accessible buttons; no drag-only requirement;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- runtime stays `tap_choice`;
- assessed fidelity `choice_feature_function_link_interaction`;
- exact four-ID allowlist prevents unrelated activities from reclassification.

Accepted implementation evidence:
- CI #541 caught and blocked stale default-choice regression coverage plus pointer interception by a decorative connector;
- the regression family set was fixed without weakening the default-family guard and the connector was made non-interactive;
- CI #543 caught an incorrect test assumption about `skillId`; static QA now checks the canonical catalog learning spec instead of changing the runtime model;
- CI #544 caught 320px success CTA visibility while all non-mobile core gates were green;
- success-only phone layout was compacted without shrinking canonical answer controls;
- head `94effe387912f27d0667e36fbf1d2351d612b62d` passed full CI #545;
- activity-quality remains **900 KEEP / 0 flagged / structural 0**;
- gameplay distribution on PR head is **21 patterns**, `choice_grid` 351/900 (39.00%), `feature_function_link` 4/900;
- browser QA passes progression, keyboard wrong-state, pointer completion, assessed evidence, >=44px controls, overflow and success CTA checks at 320/390/768;
- manual review of the green #545 screenshots accepted idle/error/success at 320x720, 390x844 and 768x1024.

PR-head distribution, not yet merged product state:

```text
classified:             900 / 900
unclassified:             0
active patterns:         21
choice_grid             351 / 900 = 39.00%
feature_function_link     4 / 900 = 0.44%
Science choice_grid       64 / 100
Logic choice_grid         77 / 100
```

## Deterministic activity-quality baseline

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
Q101–Q108: 0
```

This is deterministic engineering triage, not human pedagogical/art/expert approval.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Final docs-head CI for PR #119.
2. Check review threads/comments/reviews, re-fetch exact head, squash merge with `expected_head_sha`, and verify `main`.
3. Complete post-merge docs closure so 21 patterns become the canonical merged baseline.
4. Re-audit Science exact families while Science remains above the >60% advisory hotspot threshold; do not combine heterogeneous investigation/evidence tasks just to add a pattern.
5. Audit Logic after the Science pass; Logic remains the largest hotspot at 77% `choice_grid` on merged baseline.
6. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
7. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
