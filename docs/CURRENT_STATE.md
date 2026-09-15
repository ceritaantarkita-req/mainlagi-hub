# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`
- latest merged gameplay change: PR #127 — Logic Transitive Chain
- active gameplay branch: none
- active gameplay PR: none
- post-merge closure branch: `docs/close-transitive-chain-20260915`
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

Remaining distance: **25** patterns to minimum 50 and **35** to working target 60.

Science is exactly 60% `choice_grid`. Logic remains above the `>60%` advisory threshold at 62%, but concentration alone does not justify a mechanic.

## PR #127 `transitive_chain` — MERGED

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

All five share stage `logic-mixed-reasoning-challenge`, lesson `logic-transitive-comparison`, canonical skill `logic.comparison.transitive.basic`, assessed choice evidence, and the objective of deriving a conclusion from two ordered comparison premises.

Nearby composed-rule, set-reasoning, spatial, inference/ordering and Wave B comparison families remain outside this scope.

Interaction/evidence contract:
- the three canonical entities are shown as a visible two-premise relation chain;
- keyboard and touch/pointer use accessible direct-selection buttons for the unchanged canonical choices;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- runtime stays `tap_choice`;
- canonical IDs, choices, `correctChoice`, skill, assessment, stars and progression remain unchanged;
- assessed fidelity `choice_transitive_chain_interaction`;
- no invented numeric values, extra assessed step, drag-only dependency or reordering requirement.

Accepted and merged evidence:
- CI #569 correctly exposed a stale Rule Pipeline sentinel; it was fixed without weakening the old exact-scope regression;
- CI #570 correctly exposed the 390x844 completed CTA overflow and was not accepted;
- accepted implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed CI #572 / run `34957824566`;
- manual screenshot review accepted #572 idle/try/success states at 320x720, 390x844 and 768x1024;
- final canonical-docs head `beb2e793ad3dfeb7ebb2b41c0f085b11d910f948` passed full CI #577 / run `34961404909`;
- final gate verified state open, draft false, mergeable true, 0 PR comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge produced `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`, verified live on `main`;
- deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay-distribution audit remains **900/900 classified, 25 patterns, `choice_grid` 332/900 (36.89%), `transitive_chain` 5/900, Logic 62/100, Science 60/100**;
- all five simulations report `invariantErrors: 0`;
- Batch17 passes with canonical totals unchanged and physical-device certification still `PENDING_EXTERNAL_EVIDENCE`.

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

1. Merge this Transitive Chain docs-only post-merge closure from verified live `main` `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6` after its own full CI and clean gate.
2. Run a fresh Logic exact-family audit from the verified 25-pattern baseline. No next family is pre-approved.
3. Promote only objective-coherent/evidence-safe mechanics; do not combine unrelated tasks merely to lower concentration counts.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
