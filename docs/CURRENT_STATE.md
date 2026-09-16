# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest fully closed gameplay: Pattern #31 — Math Make Total
- Pattern #31 implementation PR: #141
- Pattern #31 closure PR: #142
- final verified Pattern #31 `main` SHA: `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`
- final Pattern #31 live verification: CI #670 / run `35045153104`, full success including Cloudflare production smoke
- current accepted unmerged gameplay PR: #143 — Math Take Away
- accepted Pattern #32 implementation code head: `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7`
- accepted Pattern #32 implementation QA: CI #671 / run `35047494614`
- Pattern #32: **QA ACCEPTED / UNMERGED** pending final docs-head CI, exact-head merge/live verification and separate closure PR
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

### Verified merged on `main`: 31 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`, `syllable_assembly`, `make_total`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    31
choice_grid               303 / 900 = 33.67%
make_total                  5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            51 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Merged-baseline distance: **19** patterns to minimum 50 and **29** to working target 60.

### PR #143 accepted head: 32 patterns

Pattern #32 `take_away` is QA accepted on PR #143 but not yet merged.

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   32
choice_grid               298 / 900 = 33.11%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            46 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

If merged unchanged, remaining distance becomes **18** patterns to minimum 50 and **28** to working target 60.

## Pattern #32 `take_away` — QA acceptance record

Exact scope:

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
```

All five remain assessed `tap_choice` activities in stage `math-operasi-awal`, lesson `math-subtraction`, pack `math.pack.subtraction`, canonical skill `math.operation.subtraction.within_10`, with exactly three canonical numeric choices and unchanged `correctChoice`.

Explicit exclusions remain outside Pattern #32: Math addition (`make_total` remains separate), equal-group grouping, missing-number sequences, length/size comparisons, existing Math count/number-line/comparison/pattern families, and all non-Math families.

Interaction/evidence contract:
- shows one reviewed positive starting group and visibly marks exactly the reviewed `removeCount` subset as taken away;
- keeps the numeric remainder masked as `?` before a correct assessment;
- config validates `startCount - removeCount === Number(correctChoice)` and keeps the operation within 10;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the numeric remainder;
- correct choice completes the canonical activity and may reveal the remainder;
- no changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_take_away_interaction`;
- runtime metadata source `take-away-runtime` with `startCount`, `removeCount` and `selectedChoice`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance evidence:
- implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on the first run;
- CI #671 passed Ubuntu, Windows, production build, dependency audit, secret-history scan, central + dedicated Take Away regressions, deterministic quality/distribution audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution is 900/900 classified, 0 unclassified, 32 patterns, `choice_grid` 298/900, `take_away` 5/900 and Math `choice_grid` 46/100;
- no global advisory hotspot exists; subject advisory hotspots remain Coloring 100%, Drawing 100% and Letters `symbol_hunt` 64%;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots with no clipping/overflow, clear removed-object state, masked wrong-state remainder, canonical success reveal, visible feedback and success CTA.

Pattern #32 is **not fully closed yet**. It still requires fresh exact docs-head CI, clean exact-head merge of PR #143, live-main verification, and a separate docs-only closure PR with its own exact-head CI/merge/live verification.

## Pattern #31 closure state

Pattern #31 `make_total` is **FULLY CLOSED**. Implementation PR #141 and closure PR #142 are merged; closure merge SHA `79a1b3871e7494a7f9580ca26e56f4f30d5874b4` was independently verified on `main`, and final CI #670 / run `35045153104` passed the full matrix including Cloudflare production smoke.

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

1. Finish Pattern #32 PR #143: fresh exact docs-head CI -> clean merge/review gate -> exact-head merge -> live-main verification -> separate docs-only closure -> closure live verification.
2. After Pattern #32 is fully closed, run a fresh objective/evidence audit for Pattern #33; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
