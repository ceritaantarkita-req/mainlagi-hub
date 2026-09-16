# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest fully closed gameplay implementation: Pattern #30 — Bahasa Syllable Assembly
- Pattern #30 implementation PR: #139
- Pattern #30 closure PR: #140
- final verified Pattern #30 `main` SHA: `53667560d72ca4cfe3556bc59411a71c53a84834`
- final Pattern #30 live verification: CI #655 / run `35005253923`, full success including Cloudflare production smoke
- current accepted unmerged gameplay PR: #141 — Math Make Total
- accepted Pattern #31 implementation head: `4b513676c9029fbb7a788a49175ed02954f0d2f7`
- accepted Pattern #31 implementation QA: CI #657 / run `35042439233`
- Pattern #31: **QA ACCEPTED / UNMERGED** pending final docs-head CI, merge/live verification and separate closure PR
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

### Merged on `main`: 30 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`, `syllable_assembly`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    30
choice_grid               308 / 900 = 34.22%
syllable_assembly           5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            56 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

Merged-baseline distance: **20** patterns to minimum 50 and **30** to working target 60.

### PR #141 accepted head: 31 patterns

Pattern #31 `make_total` is QA accepted on PR #141 but not yet merged.

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   31
choice_grid               303 / 900 = 33.67%
make_total                  5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            51 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

If merged unchanged, remaining distance becomes **19** patterns to minimum 50 and **29** to working target 60.

## Pattern #31 `make_total` — QA acceptance record

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

Acceptance evidence:
- initial CI #656 / run `35042089820` passed every non-browser gate but correctly failed the new 320x720 visibility assertion because idle feedback extended below the viewport;
- the fix compacted only the <=340px / <=760px presentation while retaining >=48px choice targets and all evidence assertions; the visibility assertion was not weakened;
- accepted implementation head `4b513676c9029fbb7a788a49175ed02954f0d2f7` passed full CI #657 / run `35042439233`;
- deterministic audit: 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0;
- gameplay distribution: 900/900 classified, 0 unclassified, 31 patterns, `choice_grid` 303/900, `make_total` 5/900, Math `choice_grid` 51/100;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots with no clipping/overflow or answer leakage and with visible retry/success feedback + post-success CTA.

Pattern #31 is **not fully closed yet**. It still requires fresh exact docs-head CI, clean exact-head merge of PR #141, live-main verification, and a separate docs-only closure PR with its own exact-head CI/merge/live verification.

## Pattern #30 closure state

Pattern #30 `syllable_assembly` is **FULLY CLOSED**. PR #139 implementation and PR #140 closure are merged; final verified `main` SHA is `53667560d72ca4cfe3556bc59411a71c53a84834`, and CI #655 / run `35005253923` passed the full matrix including Cloudflare production smoke.

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

1. Finish Pattern #31 PR #141: fresh exact docs-head CI -> clean merge/review gate -> exact-head merge -> live-main verification -> separate docs-only closure -> closure live verification.
2. After Pattern #31 is fully closed, run a fresh objective/evidence audit for Pattern #32; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
