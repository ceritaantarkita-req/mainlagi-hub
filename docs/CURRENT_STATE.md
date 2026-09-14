# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `f981d40fd55c1cdef3137600b4b44677e550b06d`
- latest merged product-quality change: PR #102 — WS-05 Sequence Slot Wave
- active gameplay branch/PR: `agent/ws05-gameplay-sorting-buckets-20260914` / PR #103
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`.

CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, and source/security audits.

External physical-device and expert acceptance remain separate and incomplete.

## Learning/catalog baseline

| Subject | Activities | Assessed | Practice |
| --- | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 |
| English | 100 | 100 | 0 |
| Matematika | 100 | 98 | 2 |
| Iqro | 100 | 99 | 1 |
| Huruf & Menulis | 100 | 87 | 13 |
| Logika | 100 | 100 | 0 |
| Sains | 100 | 100 | 0 |
| Mewarnai | 100 | 0 | 100 |
| Menggambar | 100 | 0 | 100 |

Totals: **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.**

Canonical runtime inventory remains:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 100 |
| `drawing` | 100 |

**Runtime count is not gameplay-pattern count.** One runtime may expose multiple child-facing mechanics.

## Gameplay variation state

Canonical source: `docs/GAMEPLAY_VARIATION_CATALOG.md`.

Target: minimum **50**, working target **60 meaningful patterns**, built from roughly 12–15 reusable interaction engines and distributed by learning objective.

### Merged on `main`: 11 patterns

1. `choice_grid`
2. `symbol_hunt`
3. `listen_choose`
4. `visible_matching`
5. `guided_trace`
6. `story_read`
7. `motion_game`
8. `coloring_canvas`
9. `drawing_canvas`
10. `memory_pair` — PR #101, 12 Letters case-matching activities.
11. `missing_sequence_slot` — PR #102, 10 Letters `letters-order-*` activities.

`symbol_hunt` covers 74 direct-literacy activities. Memory and Sequence remain presentation diversification over existing canonical runtimes/evidence contracts.

### In QA, not merged: `sorting_buckets`

PR #103 routes exactly these 5 basic Logic activities:
- `logic-classify-animal`
- `logic-classify-round`
- `logic-classify-up-arrow`
- `logic-classify-two-items`
- `logic-classify-red`

Behavior:
- child sorts all 3 canonical cards into **Sesuai aturan** vs **Tidak sesuai**;
- runtime stays `tap_choice`;
- activity IDs, choices, `correctChoice`, skill links, assessment, stars, progression, and completion identity stay canonical;
- explicit assessed evidence uses `choice_sorting_interaction`;
- keyboard and touch/pointer use select-card -> select-bucket;
- advanced multi-attribute `logic-classify-*` activities are deliberately excluded.

QA status:
- implementation head `97ae2e4d4b76e64865abb634216c5d8ce94dc8f8`;
- CI #457 full success across Ubuntu, Windows, build, dependency audit, secret scan, and mobile Chromium;
- static regression: 12 `memory_pair` + 10 `sequence_slot` + 5 `sorting_buckets` activities;
- browser QA checks legitimate progression readiness, keyboard wrong-state, pointer completion, persistence/evidence, no overflow, >=44px controls, and 320/390/768 screenshots;
- manual visual QA accepted idle/error/success states after fixing the first 320×720 success CTA clipping issue;
- activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

If PR #103 merges, active gameplay-pattern count becomes **12**.

## Frontend/product state

The child experience includes Garden/Playroom UI, persistent active-child state, recommendation/continue flow, Recommended Path + Stage Journey + Browse All, hydration-safe stage guard, responsive Coloring/Drawing, Memory Pair, Sequence Slot, audio session handling, activity previews, Nunito UI typography, and Phosphor icons.

Do not weaken stage/evidence rules or revert this product model merely to simplify a mechanic.

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

1. close Sorting Buckets PR #103 with canonical docs + docs-head CI + merge;
2. implement `drag_to_target` on a new branch, with real drag and tap/keyboard fallback;
3. add the gameplay-distribution audit across all 900 activities and use it to prioritize concentration hotspots;
4. continue `reorder_cards`, `tap_in_order`, search/scene, Math, audio, puzzle/path, literacy, science, creative, and story patterns toward 60;
5. continue Art Bible/permanent visual QA;
6. native/reviewed narration;
7. public/parent frontend;
8. physical-device/accessibility/Iqro expert acceptance;
9. governance; technical cleanup after product quality stabilizes.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not equal 900 experiences. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, touch-friendly, and visually reviewed before merge.
