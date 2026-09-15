# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest gameplay implementation: PR #137 — Logic Relative Order Track
- verified Pattern #29 implementation merge SHA: `ec083b7206fdc7d8d2c21a1bbd6c2abbd1d44949`
- post-merge implementation CI: #632 / run `34994824331`, full success including Cloudflare production smoke
- post-merge closure: PR #138
- Pattern #29: **FULLY CLOSED after #138 exact-head merge/live verification**
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, permanent gameplay-distribution audit, simulations, Batch17 and production smoke on `main`.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 29 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    29
choice_grid               313 / 900 = 34.78%
relative_order_track        5 / 900 = 0.56%
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

Remaining distance: **21** patterns to minimum 50 and **31** to working target 60.

## Pattern #29 `relative_order_track` — closure record

Exact scope:

```text
logic-order-first-after-start
logic-order-before-d
logic-order-between-blue-green
logic-order-third-symbol
logic-order-two-steps-after
```

All five remain assessed `tap_choice` activities in stage `logic-conditional-analogy-inference`, lesson `logic-relative-ordering`, pack `logic.pack.relative-ordering`, canonical skill `logic.order.relative.basic`, with exactly three canonical choices and unchanged `correctChoice`.

Explicit exclusions remain outside Pattern #29: Logic conditional-rule, multi-classification and elimination-inference families; Logic analogies remain `visible_matching`; Math `math-order-*` remain `number_line`; Letters `letters-order-*` remain `missing_sequence_slot`.

Interaction/evidence contract:
- visualizes only canonical ordered context already present in each prompt;
- masks exactly the inferred target position with `?` until assessment;
- config validation requires hidden slot = canonical `correctChoice`;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no invented sequence fact, answer leakage, changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_relative_order_track_interaction`;
- runtime metadata source `relative-order-track-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance/closure history:
- implementation QA head `e91087aa1176723b0d90f310088b65a51d413ce7` passed full CI #626 / run `34992813094`;
- canonical docs head `48d92434d83b028d48821e270a025c3a08a859bc` passed full CI #631 / run `34994322707`;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots;
- PR #137 exact-head squash merged as `ec083b7206fdc7d8d2c21a1bbd6c2abbd1d44949` and `main` was verified at the exact SHA;
- post-merge `main` CI #632 / run `34994824331` passed all gates including Cloudflare production smoke;
- closure PR #138 records the final merged state and is the final closure gate.

Deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Simulations and Batch17 remain clean.

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

1. Finish closure PR #138 exact-head CI/gate/merge/live verification.
2. Run a fresh objective/evidence audit for Pattern #30 from the verified 29-pattern baseline; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
