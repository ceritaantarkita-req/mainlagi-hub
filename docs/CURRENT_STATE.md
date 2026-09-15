# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest fully closed gameplay implementation: PR #137 — Logic Relative Order Track
- verified Pattern #29 implementation merge SHA: `ec083b7206fdc7d8d2c21a1bbd6c2abbd1d44949`
- Pattern #29 closure: PR #138, final verified `main` SHA `2a5e0f35725456e00b4cd85e64999f9f84a29c6c`
- final Pattern #29 live verification: CI #639 / run `34996162783`, full success including Cloudflare production smoke
- current accepted unmerged gameplay PR: #139 — Bahasa Syllable Assembly
- accepted Pattern #30 implementation head: `d55c1deb54f1402c38d84417ca7ae8248c9d3b07`
- accepted Pattern #30 implementation QA: CI #642 / run `35000557604`
- Pattern #30: **QA ACCEPTED / UNMERGED** pending final docs-head CI, merge/live verification and separate closure PR
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
Bahasa choice_grid          52 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

### PR #139 accepted head: 30 patterns

Pattern #30 `syllable_assembly` is QA accepted on PR #139 but not yet merged.

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   30
choice_grid               308 / 900 = 34.22%
syllable_assembly           5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
```

If merged unchanged, remaining distance becomes **20** patterns to minimum 50 and **30** to working target 60.

## Pattern #30 `syllable_assembly` — QA acceptance record

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

Acceptance evidence:
- implementation head `d55c1deb54f1402c38d84417ca7ae8248c9d3b07` passed full CI #642 / run `35000557604`;
- deterministic audit: 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0;
- gameplay distribution: 900/900 classified, 0 unclassified, 30 patterns, `choice_grid` 308/900, `syllable_assembly` 5/900, Bahasa 47/100, Logic 47/100, Science 56/100;
- manual idle/wrong/success review at 320x720, 390x844 and 768x1024 accepted all nine screenshots with no clipping/overflow or answer leakage and with visible retry/success feedback + post-success CTA;
- CI #640 and #641 caught and forced fixes for permanent-test registration and learning-test compile-manifest coverage before acceptance.

Pattern #30 is **not fully closed yet**. It still requires fresh exact docs-head CI, clean exact-head merge of PR #139, live-main verification, and a separate docs-only closure PR with its own exact-head CI/merge/live verification.

## Pattern #29 closure state

Pattern #29 `relative_order_track` is **FULLY CLOSED**. PR #137 was exact-head merged, closure PR #138 was merged, final `main` SHA is `2a5e0f35725456e00b4cd85e64999f9f84a29c6c`, and CI #639 / run `34996162783` passed the full matrix including Cloudflare production smoke.

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

1. Finish Pattern #30 PR #139: final canonical docs -> fresh exact docs-head CI -> clean merge gate -> exact-head merge -> live-main verification -> separate docs-only closure -> closure live verification.
2. After Pattern #30 is fully closed, run a fresh objective/evidence audit for Pattern #31; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
