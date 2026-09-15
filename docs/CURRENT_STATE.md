# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `a961be0e61055f7347244b58b9dc252d5ed6f382`
- latest merged gameplay change: PR #125 — Logic Odd One Out
- latest closure: PR #126 — Odd One Out docs closure
- active gameplay branch: `agent/ws05-logic-transitive-chain-20260915`
- active gameplay PR: PR #127 — Logic Transitive Chain — **QA ACCEPTED / UNMERGED**
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

### Merged on `main`: 24 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    24
choice_grid               337 / 900 = 37.44%
odd_one_out                 5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           67 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the `>60%` advisory threshold.

### PR #127 head: 25 patterns — QA ACCEPTED / UNMERGED

Pattern #25: `transitive_chain`.

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   25
choice_grid               332 / 900 = 36.89%
transitive_chain            5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           62 / 100
```

Because PR #127 remains open, these 25-pattern numbers are not yet the merged product baseline. If merged unchanged, remaining distance becomes 25 patterns to minimum 50 and 35 to working target 60.

## PR #127 `transitive_chain` — QA ACCEPTED / UNMERGED

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

QA history and accepted evidence:
- CI #569 correctly failed because a Rule Pipeline regression still named `logic-transitive-height-abc` as a default sentinel; that stale sentinel was replaced with unrelated `logic-infer-not-red` while the old exact-scope guard stayed active;
- CI #570 passed Ubuntu, Windows, build, dependency, secret, activity-quality, distribution, simulations and Batch17 but Mobile correctly blocked the 390x844 completed layout because the success CTA was below the viewport;
- the phone-sized success state was compacted by hiding only the already-consumed prompt + premise chain after completion; answer choices, success explanation and CTA remain visible, while idle/retry still show the complete chain;
- accepted implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed full CI #572 / run `34957824566`;
- Ubuntu and Windows typecheck/lint/engine gates passed;
- production build/budgets, dependency audit and secret-history scan passed;
- gameplay-presentation regression reports exactly `5 transitive_chain` activities; dedicated exact-family regression also passes;
- deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay-distribution audit verifies **900/900 classified, 25 patterns, `choice_grid` 332/900 (36.89%), `transitive_chain` 5/900, Logic 62/100, Science 60/100**;
- all five simulations report `invariantErrors: 0`;
- Batch17 passes with canonical totals unchanged and physical-device certification still `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes canonical Logic Wave C readiness, keyboard wrong-state, pointer completion, two-premise layout, assessed evidence, touch sizing, overflow and CTA checks at 320x720, 390x844 and 768x1024;
- manual screenshot review accepted #572 idle/try/success states at 320/390/768; the 390 CTA regression is resolved, 320 success remains unclipped, and 768 success intentionally keeps the full chain.

Implementation QA is accepted, but the next docs commit changes the PR head. Full final docs-head CI is therefore required before merge; CI #572 is implementation acceptance evidence, not permission to merge a later SHA.

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

1. Finish canonical docs finalization on PR #127 while keeping its state labeled unmerged.
2. Run full CI on the exact resulting docs head; do not reuse #572 after the SHA changes.
3. Recheck PR state, mergeability, comments, reviews and review threads.
4. Exact-head squash merge #127 only after the final docs head is green, then verify live `main` at the exact merge SHA.
5. Create a docs-only Transitive Chain closure PR from verified live `main`, run full closure CI, clean gate, exact-head squash merge and verify live `main` again.
6. Only then run a fresh Logic exact-family audit. Logic will still be an advisory hotspot at 62%, but no next family is pre-approved.
7. Continue objective-fit search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
8. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
