# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `b61656662f8f6bad8545e7a6236c6bdd07f930ab`
- latest merged gameplay change: PR #121 — Science Healthy Habit Routine
- active gameplay branch: none
- active gameplay PR: none
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 22 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`.

```text
classified:               900 / 900
unclassified:               0
active patterns:           22
choice_grid               347 / 900 = 38.56%
healthy_habit_routine       4 / 900 = 0.44%
Science choice_grid         60 / 100
Logic choice_grid           77 / 100
```

Science is now exactly 60% `choice_grid` and no longer exceeds the `>60%` subject advisory threshold. Logic is the next subject hotspot.

### PR #121 Healthy Habit Routine — MERGED

Exact scope:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Explicit exclusion:

```text
science-match-body-care-c
```

The four scoped activities share stage `science-earth-body-environment`, lesson `science-body-health-habits`, skill `science.body.health_habits.basic`, assessed choice evidence, and the objective of recognizing a healthy everyday habit. The excluded activity remains canonical `matching` / `visible_matching`.

Interaction/evidence contract:
- visible health-focus/routine cue plus canonical three habit choices;
- keyboard and touch/pointer use accessible buttons; no drag-only requirement;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- runtime stays `tap_choice`;
- assessed fidelity `choice_healthy_habit_routine_interaction`;
- exact four-ID allowlist prevents unrelated Science activities from reclassification.

Accepted and merged evidence:
- accepted implementation head: `8086670711221dd077c64bdab2eb308040c3db86` after noisy formatting was removed;
- implementation CI #552 / run `34932904970` full green;
- final docs head `f530d88d9b94ccddbceb2ec6fba7c661ff252215` passed full CI #553 / run `34933560692`;
- gameplay-presentation and dedicated exact-family regressions pass for exactly four activities;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- distribution audit verifies 900/900 classified, 22 patterns, `choice_grid` 347/900 (38.56%), Science 60/100 and Logic 77/100;
- Batch17 remains PASS with canonical catalog totals; `physicalDeviceCertification` remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes legitimate Wave B progression, keyboard wrong-state, pointer completion, assessed evidence, touch sizing, overflow and CTA checks at 320/390/768;
- manual screenshot review accepted idle/error/success at 320x720, 390x844 and 768x1024;
- final review gate had 0 issue comments, 0 combined PR comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge is `b61656662f8f6bad8545e7a6236c6bdd07f930ab` and live `main` was verified at that SHA.

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

1. Close Healthy Habit Routine merge state through the docs-only closure branch created from verified `main` `b61656662f8f6bad8545e7a6236c6bdd07f930ab`.
2. Then audit **Logic** exact families from the verified 22-pattern baseline. Logic remains 77% `choice_grid`.
3. Promote only objective-coherent/evidence-safe mechanics; do not combine unrelated tasks merely to lower concentration counts.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
