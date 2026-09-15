# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest gameplay implementation: PR #139 — Bahasa Syllable Assembly
- verified Pattern #30 implementation merge SHA: `c973dbc9e6010ff167a082cd6759728b590e7626`
- final implementation PR docs head: `ee891dc99c1f86831ba67b34ae39e71ec50ee886`
- final implementation PR CI: #647 / run `35001595648`, full success
- post-merge implementation CI: #648 / run `35003757463`, full success including Cloudflare production smoke
- post-merge closure: PR #140
- Pattern #30: **FULLY CLOSED after #140 exact-head merge/live verification**
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
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

Remaining distance: **20** patterns to minimum 50 and **30** to working target 60.

## Pattern #30 `syllable_assembly` — closure record

Exact scope:

```text
bahasa-gabung-baju
bahasa-gabung-buku
bahasa-gabung-meja
bahasa-gabung-bola
bahasa-gabung-susu
```

All five remain assessed `tap_choice` activities in stage `bahasa-suku-kata-kata`, lesson `bahasa-suku-kata-gabung`, pack `bahasa.pack.suku-kata-gabung`, canonical skill `bahasa.suku_kata.blending`, with exactly three canonical choices and unchanged `correctChoice`.

Explicit exclusions remain outside Pattern #30: Bahasa syllable recognition, picture-word, initial-sound, listening and matching families; English phonics; Math and Logic gameplay families.

Interaction/evidence contract:
- visualizes only the two canonical syllables already present in title/prompt content;
- masks the assembled result with `?` before a correct assessment;
- config validation requires the two syllables to concatenate exactly to canonical `correctChoice`;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the word;
- correct choice completes the canonical activity and may reveal the assembled word;
- no invented syllable, answer leakage, changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_syllable_assembly_interaction`;
- runtime metadata source `syllable-assembly-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance/closure history:
- CI #640 / run `34999759651` caught missing permanent central-test registration and forced a strict fix;
- CI #641 / run `35000289970` caught missing learning-test compile-manifest coverage and forced a strict fix;
- implementation QA head `d55c1deb54f1402c38d84417ca7ae8248c9d3b07` passed full CI #642 / run `35000557604`;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots;
- final canonical implementation docs head `ee891dc99c1f86831ba67b34ae39e71ec50ee886` passed full CI #647 / run `35001595648`;
- PR #139 exact-head squash merged as `c973dbc9e6010ff167a082cd6759728b590e7626` and `main` was independently verified at the exact SHA;
- post-merge `main` CI #648 / run `35003757463` passed all gates including Cloudflare production smoke;
- closure PR #140 records the final merged state and is the final Pattern #30 closure gate.

Deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Simulations and Batch17 remain clean.

## Pattern #29 closure state

Pattern #29 `relative_order_track` remains **FULLY CLOSED**. PR #137 implementation and PR #138 closure are merged and live-verified.

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

1. Finish closure PR #140 exact-head CI/gate/merge/live verification.
2. Run a fresh objective/evidence audit for Pattern #31 from the verified 30-pattern baseline; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
