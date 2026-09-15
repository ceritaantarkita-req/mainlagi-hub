# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay change: PR #127 — Logic Transitive Chain
- latest gameplay closure: PR #128 — Transitive Chain docs closure
- latest closure metadata: PR #129
- verified current `main` before Pattern #26: `4a146b1f188eb90c612a8cf4dd0285363d5f6738`
- active gameplay branch: `agent/ws05-logic-set-reasoning-20260915`
- active gameplay PR: #130 — **QA ACCEPTED / UNMERGED**
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

### Merged on `main`: 25 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    25
choice_grid               332 / 900 = 36.89%
transitive_chain            5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           62 / 100
```

Remaining distance from merged baseline: **25** patterns to minimum 50 and **35** to working target 60.

### PR #130 accepted QA state: 26 patterns if merged unchanged

Pattern #26 is `set_reasoning` for exactly:

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

All five remain assessed `tap_choice` activities in stage `logic-mixed-reasoning-challenge`, lesson `logic-set-reasoning`, pack `logic.pack.set-reasoning`, canonical skill `logic.set.relation.basic`, with exactly three canonical choices and unchanged `correctChoice`.

Interaction/evidence contract:
- explicit two-rule set board;
- rule membership visible as `harus masuk` / `harus di luar`;
- operation visible as intersection, exclusion, or outside-union;
- keyboard and touch/pointer use accessible direct-selection buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- no false Venn geometry, invented intermediate assessment, extra confirmation, or drag-only dependency;
- assessed fidelity `choice_set_reasoning_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression are unchanged.

Accepted CI #586 / run `34969198343` on implementation head `acc5ce9d5661818842effcd120346ded3891dd50` reports:

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:    26
choice_grid               327 / 900 = 36.33%
set_reasoning               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           57 / 100
```

If merged unchanged, remaining distance becomes **24** patterns to minimum 50 and **34** to working target 60.

Acceptance history is intentionally retained:
- CI #583 failed because a stale Rule Pipeline sentinel still expected `logic-set-both-red-round` to be `default`; the guard was corrected narrowly without weakening Rule Pipeline exact scope.
- CI #584 passed automated jobs but was rejected by manual visual QA because 320x720 idle/try feedback was clipped below the viewport.
- narrow-phone layout was corrected and browser QA now requires idle/retry/success feedback plus success CTA to be fully visible.
- CI #586 is full green across Ubuntu, Windows, build, dependency, secret and Chromium jobs; production smoke is skipped by normal workflow condition.
- new 320x720, 390x844 and 768x1024 idle/try/success screenshots were manually accepted with no clipping, overlap or horizontal overflow.
- deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.
- five simulations remain zero invariant errors; Batch17 totals remain unchanged; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

PR #130 is still **unmerged**. Pattern #26 is not shipped/fully closed until final docs-head CI, clean PR gate, exact-head merge, live-main verification and docs-only closure are complete.

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

1. Finish PR #130 canonical-docs head CI and clean review gate.
2. Exact-head merge #130 and verify live `main` independently.
3. Merge the required docs-only Pattern #26 closure.
4. Only then run a fresh exact-family audit for Pattern #27; no next family is pre-approved.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
6. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
