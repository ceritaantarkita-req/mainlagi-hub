# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay implementation: Pattern #31 — Math Make Total
- Pattern #31 implementation PR: #141
- Pattern #31 closure PR: #142
- final implementation docs head: `7230d87fb5c53d6e164465aa3353531228b8f4c6`
- verified Pattern #31 implementation merge SHA: `de358c3e6610c3ae9b8669ce3df3b0f2a95e3136`
- final implementation PR CI: #662 / run `35043111245`, full success
- post-merge implementation CI: #663 / run `35044172180`, full success including Cloudflare production smoke
- Pattern #31: **MERGED / CLOSURE PR #142 PENDING**; becomes fully closed only after #142 exact-head merge/live verification
- Pattern #30 `syllable_assembly`: **FULLY CLOSED** via PR #139 + #140
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
syllable_assembly           5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            51 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Remaining distance: **19** patterns to minimum 50 and **29** to working target 60.

## Pattern #31 `make_total` — merged closure record

Exact scope:

```text
math-add-1-1
math-add-2-1
math-add-2-2
math-add-3-2
math-add-4-3
```

All five remain assessed `tap_choice` activities in stage `math-operasi-awal`, lesson `math-addition`, pack `math.pack.addition`, canonical skill `math.operation.addition.within_10`, with exactly three canonical numeric choices and unchanged `correctChoice`.

Explicit exclusions remain outside Pattern #31: Math subtraction, equal-group grouping, missing-number sequences, length/size comparisons, existing Math count/number-line/comparison/pattern families, and all non-Math families.

Interaction/evidence contract:
- visualizes two reviewed positive addend groups whose sum equals canonical `correctChoice`;
- masks the total with `?` before a correct assessment;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the total;
- correct choice completes the canonical activity and may reveal the total;
- total remains within the canonical `within_10` objective;
- no changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_make_total_interaction`;
- runtime metadata source `make-total-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance and merge evidence:
- CI #656 / run `35042089820` correctly caught the 320x720 idle-feedback visibility defect;
- the responsive fix preserved >=48px choice targets and the strict viewport assertion;
- implementation QA head `4b513676c9029fbb7a788a49175ed02954f0d2f7` passed full CI #657 / run `35042439233`;
- all nine 320/390/768 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `7230d87fb5c53d6e164465aa3353531228b8f4c6` passed full CI #662 / run `35043111245`;
- PR #141 had `mergeable=true`, zero reviews, zero review threads and exactly the intended 16 changed files at the final merge gate;
- PR #141 exact-head squash merged as `de358c3e6610c3ae9b8669ce3df3b0f2a95e3136`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #663 / run `35044172180` passed all gates including Cloudflare production smoke;
- deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Docs-only closure PR #142 is the final Pattern #31 closure gate. Pattern #31 becomes **FULLY CLOSED only after #142 exact-head CI, clean merge gate, exact-head merge, independent final `main` verification, and post-closure `main` CI including Cloudflare smoke all succeed**.

## Pattern #30 closure state

Pattern #30 `syllable_assembly` remains **FULLY CLOSED**. PR #139 implementation and PR #140 closure are merged and live-verified.

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

1. Finish Pattern #31 closure PR #142: exact final closure-head CI -> clean review/thread/mergeability gate -> exact-head merge -> independent `main` verification -> post-closure `main` CI + Cloudflare production smoke.
2. Only after Pattern #31 is fully closed, run a fresh objective/evidence audit for Pattern #32; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
