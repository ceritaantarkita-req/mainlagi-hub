# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay change: PR #130 — Logic Set Reasoning
- verified gameplay merge SHA: `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`
- live `main`: independently verified at the exact merge SHA
- Pattern #26 closure branch: `agent/ws05-set-reasoning-closure-20260915`
- Pattern #26 closure: **IN PROGRESS**
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

### Merged on `main`: 26 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    26
choice_grid               327 / 900 = 36.33%
set_reasoning               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           57 / 100
```

Remaining distance: **24** patterns to minimum 50 and **34** to working target 60.

Science remains exactly 60% `choice_grid`; Logic is 57%. Concentration remains advisory only and cannot pre-approve the next mechanic.

## Pattern #26 `set_reasoning` — MERGED / CLOSURE IN PROGRESS

Exact scope:

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
- membership visible as `harus masuk` / `harus di luar`;
- operation visible as intersection, exclusion, or outside-union;
- accessible direct-selection buttons for keyboard and touch/pointer;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- no false Venn geometry, invented intermediate assessment, extra confirmation, or drag-only dependency;
- assessed fidelity `choice_set_reasoning_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance/merge history:
- CI #583 failed on a stale Rule Pipeline sentinel and was correctly rejected.
- CI #584 passed automation but manual visual QA rejected a real 320x720 idle/try clipping defect.
- responsive layout and browser assertions were corrected.
- implementation head `acc5ce9d5661818842effcd120346ded3891dd50` passed CI #586 / run `34969198343` plus manual screenshot acceptance at 320x720, 390x844 and 768x1024.
- final docs head `a725e567898a07bfd4977d5015a179c7a6d88ab2` passed CI #591 / run `34971570563`.
- final PR #130 gate: open, non-draft, mergeable, 0 comments, 0 reviews, 0 review threads.
- exact-head squash merge #130 -> `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`.
- live `main` independently verified at the exact same SHA.

Deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Five simulations remain zero invariant errors; Batch17 totals remain unchanged and physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

Pattern #26 is merged but not yet fully closed until this docs-only closure passes full CI, clean review gate, exact-head merge and live-main verification.

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

1. Finish and merge Pattern #26 docs-only closure.
2. Only after closure is live-verified, run a fresh exact-family audit for Pattern #27; no next family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
