# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `92664642287ecdd64ce408d3d08794a24aa2b588` (docs closure PR #120)
- latest merged gameplay change: PR #119 — Science Feature Function Link, merge `49850145a918afcba4f8279a6f5da12fe4a9c5b8`
- active gameplay branch: `agent/ws05-science-healthy-habit-routine-20260915`
- active gameplay PR: #121 — Healthy Habit Routine, QA accepted / unmerged
- accepted implementation head before canonical docs finalization: `8086670711221dd077c64bdab2eb308040c3db86`
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

### Merged on `main`: 21 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`.

```text
classified:             900 / 900
unclassified:             0
active patterns:         21
choice_grid             351 / 900 = 39.00%
feature_function_link     4 / 900 = 0.44%
Science choice_grid       64 / 100
Logic choice_grid         77 / 100
```

### Active PR #121: PR-head 22 patterns — QA ACCEPTED / UNMERGED

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

Accepted QA evidence on head `8086670711221dd077c64bdab2eb308040c3db86`:
- PR diff normalized to a reviewable **12 files, +372/-5** before acceptance;
- full CI #552 / run `34932904970` is green across Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium;
- gameplay-presentation regression includes exactly `4 healthy_habit_routine` activities;
- dedicated exact-family regression passes and keeps `science-match-body-care-c` as visible matching;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- distribution audit verifies **900/900 classified, 22 PR-head patterns, `choice_grid` 347/900 (38.56%), `healthy_habit_routine` 4/900, Science `choice_grid` 60/100, Logic `choice_grid` 77/100**;
- Batch17 final acceptance remains PASS with the canonical catalog totals; `physicalDeviceCertification` remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes legitimate Wave B progression, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence, touch sizing, overflow and CTA checks at 320/390/768;
- manual screenshot review of CI #552 accepted idle/error/success states at 320x720, 390x844 and 768x1024.

PR #121 is not merged yet. Final docs-head CI, review gate, exact-head merge, live `main` verification and docs closure remain required.

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

1. Finish PR #121 through final docs-head CI, clean review gate, exact-head merge, `main` verification and post-merge closure.
2. Then audit **Logic** exact families from the new baseline. Logic remains 77% `choice_grid`; if #121 merges, Science becomes exactly 60% and no longer exceeds the >60% advisory threshold.
3. Promote only objective-coherent/evidence-safe mechanics; do not combine unrelated tasks to lower concentration counts.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
