# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `c0583c8e07907f02e9671e8254bc35353cf64d24`
- latest merged gameplay change: PR #123 — Logic Rule Pipeline
- latest docs closure: PR #124
- active gameplay branch: `agent/ws05-logic-odd-one-out-20260915`
- active gameplay PR: #125 — Logic Odd One Out
- accepted implementation head: `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`
- active PR status: **implementation + CI + visual QA accepted; UNMERGED**
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

### Merged on `main`: 23 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`.

```text
classified:               900 / 900
unclassified:               0
active patterns:           23
choice_grid               342 / 900 = 38.00%
rule_pipeline               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           72 / 100
```

### PR #125 `odd_one_out` — ACCEPTED QA / UNMERGED

Exact scope:

```text
logic-odd-category-animal-vehicle
logic-odd-shape-angular
logic-odd-direction-right
logic-odd-count-three
logic-odd-pattern-symmetry
```

All five share stage `logic-classification-rules-basics`, lesson `logic-odd-one-out-basic`, canonical skill `logic.discrimination.odd_one_out.basic`, assessed choice evidence, and the objective of identifying the one member of a trio that does not share the visible relation of the other two.

Nearby Logic classification, comparison, simple sequence-rule, set, spatial, inference and composed-rule activities remain outside this family.

Interaction/evidence contract:
- the three canonical choices are presented as one comparison trio;
- `2 mirip • 1 beda` frames the relation without revealing the answer;
- keyboard and touch/pointer use accessible direct-selection buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- runtime stays `tap_choice`;
- canonical IDs, choices, `correctChoice`, skill, assessment, stars and progression remain unchanged;
- assessed fidelity `choice_odd_one_out_interaction`.

Accepted implementation evidence at `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`:
- CI #562 identified one stale Rule Pipeline exclusion sentinel and was not accepted; the sentinel was updated to an unrelated Logic comparison activity that must remain `choice_grid`, preserving the old scope guard;
- CI #563 passed non-browser gates but Mobile exposed an incorrect test assumption about natural unlock; the progression guard correctly required preceding `logic-foundations` readiness;
- browser QA now uses canonical qualifying foundation evidence matching the existing Sorting Buckets readiness path, with progression guards still active;
- CI #564 / run `34951235607` completed success for all required jobs: Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium; production smoke was normally skipped by workflow condition;
- exact-family and gameplay-presentation regressions pass for exactly five `odd_one_out` activities;
- deterministic activity-quality artifact remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay-distribution audit verifies **900/900 classified, 24 PR-head patterns, `choice_grid` 337/900 (37.44%), `odd_one_out` 5/900, Logic 67/100, Science 60/100**;
- simulations and Batch17 pass with canonical totals unchanged; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes canonical Logic foundation progression, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence, touch sizing, overflow and CTA checks at 320/390/768;
- manual screenshot review accepted idle/error/success states at 320x720, 390x844 and 768x1024; no polish commit was required.

PR-head distribution, **not yet merged**:

```text
classified:               900 / 900
unclassified:               0
active patterns:           24
choice_grid               337 / 900 = 37.44%
odd_one_out                 5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           67 / 100
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

1. Run final full CI on PR #125 after canonical docs are finalized on the exact current head.
2. Re-check comments, reviews, review threads, exact head and mergeability.
3. Exact-head squash merge only if all gates remain green, then verify live `main`.
4. Complete a docs-only post-merge closure so pattern #24 becomes the canonical merged baseline.
5. Continue a fresh Logic exact-family audit from the verified 24-pattern baseline; Logic would remain 67% `choice_grid`.
6. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns plus Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
