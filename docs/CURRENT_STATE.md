# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay implementation: PR #135 — Science Investigation Board
- verified implementation merge SHA: `790487b1672bcf1d1edce023c3f071a7f1175fbf`
- post-merge closure: PR #136
- Pattern #28: **FULLY CLOSED after #136 exact-head merge/live verification**
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

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    28
choice_grid               318 / 900 = 35.33%
investigation_board         4 / 900 = 0.44%
Science choice_grid         56 / 100
Logic choice_grid           52 / 100
```

Remaining distance: **22** patterns to minimum 50 and **32** to working target 60.

## Pattern #28 `investigation_board` — closure record

Exact scope:

```text
science-investigate-plant-light
science-investigate-fair-water
science-predict-ice-warm-place
science-evidence-shadow-times
```

All four remain assessed `tap_choice` activities in stage `science-evidence-review-challenge`, lesson `science-investigation-evidence`, pack `science.pack.investigation-evidence`, canonical skill `science.investigation.evidence.basic`, with exactly three canonical choices and unchanged `correctChoice`.

`science-match-observation-tools-d` remains canonical `matching` / `visible_matching` and outside this family.

Interaction/evidence contract:
- reusable inquiry rail Amati / Jaga tetap / Prediksi / Simpulkan;
- one reviewed inquiry mode per activity;
- only prompt-supported facts are shown;
- focus cue does not reveal the answer;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no invented result/measurement, answer leakage, extra confirmation, drag-only dependency, or intermediate assessment;
- assessed fidelity `choice_investigation_board_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance/closure history:
- CI #611 correctly rejected a real 320px feedback-visibility defect;
- final mobile fix head `837c3b8ec46ed4a9bfc17a777adeb86dcbffcdc4` passed CI #614 / run `34987172569` plus manual idle/try/success screenshot acceptance at 320x720, 390x844 and 768x1024;
- final implementation/docs head `a2b01b272c6dc42f819c43a74e8f52058ed0298d` passed CI #615 / run `34988108936`;
- PR #135 exact-head squash merge produced `790487b1672bcf1d1edce023c3f071a7f1175fbf`, independently verified live on `main`;
- closure PR #136 is the final docs-only closure for that verified merged state.

Deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Simulations and Batch17 acceptance remain clean.

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

1. Finish closure PR #136 exact-head CI/gate/merge/live verification.
2. Run a fresh objective/evidence audit for Pattern #29; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
