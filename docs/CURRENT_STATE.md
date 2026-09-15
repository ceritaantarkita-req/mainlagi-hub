# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest fully closed gameplay implementation on `main`: PR #135 — Science Investigation Board
- verified Pattern #28 implementation merge SHA: `790487b1672bcf1d1edce023c3f071a7f1175fbf`
- Pattern #28 closure: PR #136, fully closed after exact-head merge/live verification
- current accepted unmerged gameplay PR: #137 — Logic Relative Order Track
- accepted implementation QA head: `e91087aa1176723b0d90f310088b65a51d413ce7`
- accepted implementation QA: CI #626 / run `34992813094`
- Pattern #29: **QA ACCEPTED / UNMERGED** pending docs-head CI, merge/live verification and separate closure PR
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 28 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`.

Merged baseline remains:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    28
choice_grid               318 / 900 = 35.33%
investigation_board         4 / 900 = 0.44%
Science choice_grid         56 / 100
Logic choice_grid           52 / 100
```

### PR #137 accepted head: 29 patterns

Pattern #29 `relative_order_track` is QA accepted on PR #137 but not yet merged.

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   29
choice_grid               313 / 900 = 34.78%
relative_order_track        5 / 900 = 0.56%
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

If merged unchanged, remaining distance becomes **21** patterns to minimum 50 and **31** to working target 60.

## Pattern #29 `relative_order_track` — QA acceptance record

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

Acceptance evidence:
- accepted implementation QA head `e91087aa1176723b0d90f310088b65a51d413ce7` passed full CI #626 / run `34992813094`;
- deterministic audit: 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0;
- gameplay distribution: 900/900 classified, 0 unclassified, 29 patterns, `choice_grid` 313/900, `relative_order_track` 5/900, Logic 47/100, Science 56/100;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots with no clipping/overflow or answer leakage and with visible retry/success feedback + post-success CTA.

Pattern #29 is **not fully closed yet**. It still requires fresh exact docs-head CI, clean exact-head merge of PR #137, live-main verification, and a separate docs-only closure PR with its own exact-head CI/merge/live verification.

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

1. Finish Pattern #29 PR #137: canonical docs -> fresh exact docs-head CI -> clean merge gate -> exact-head merge -> live-main verification -> separate docs-only closure -> closure live verification.
2. After Pattern #29 is fully closed, run a fresh objective/evidence audit for Pattern #30; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
