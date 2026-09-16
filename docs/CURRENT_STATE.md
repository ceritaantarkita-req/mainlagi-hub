# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay: Pattern #32 — Math Take Away
- Pattern #32 implementation PR: #143
- Pattern #32 closure PR: #144
- final implementation docs head: `061b004188e827ff62bd1e5c48377a087f0f9144`
- final implementation PR CI: #676 / run `35048147580`, full success
- verified implementation merge SHA: `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`
- post-merge implementation CI: #677 / run `35048981508`, full success including Cloudflare production smoke
- Pattern #32: **MERGED / LIVE VERIFIED / CLOSURE PR #144 PENDING**
- Pattern #31 `make_total`: **FULLY CLOSED** via PR #141 + #142; final verified `main` SHA `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`; final CI #670 / run `35045153104`
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

### Verified merged on `main`: 32 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`, `syllable_assembly`, `make_total`, `take_away`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    32
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

Remaining distance: **18** patterns to minimum 50 and **28** to working target 60.

## Pattern #32 `take_away` — merged/live closure record

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
- validates `startCount - removeCount === Number(correctChoice)` and keeps the operation within 10;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the numeric remainder;
- correct choice completes the canonical activity and may reveal the remainder;
- no changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_take_away_interaction`;
- runtime metadata source `take-away-runtime` with `startCount`, `removeCount` and `selectedChoice`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance and merge evidence:
- implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on the first run;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic quality remained **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- final canonical implementation docs head `061b004188e827ff62bd1e5c48377a087f0f9144` passed full CI #676 / run `35048147580`;
- PR #143 passed exact-head clean gate: mergeable, zero comments, zero reviews, zero review threads;
- PR #143 exact-head squash merged as `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #677 / run `35048981508` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke.

Docs-only closure PR #144 is the final Pattern #32 gate. Pattern #32 is **not fully closed yet**; full closure requires #144 exact closure-head CI, clean closure merge gate, exact-head closure merge, independent final `main` verification, and final post-closure `main` CI including Cloudflare production smoke.

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

1. Finish Pattern #32 closure PR #144: exact closure-head CI -> clean review/thread/mergeability gate -> exact-head merge -> independent `main` verification -> final post-closure `main` CI + Cloudflare production smoke.
2. Only after Pattern #32 is fully closed, run a fresh objective/evidence audit for Pattern #33; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
