# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`
- latest merged product-quality change: PR #103 — WS-05 Sorting Buckets Wave
- active gameplay branch/PR: `agent/ws05-gameplay-drag-target-20260914` / PR #104
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

### Merged on `main`: 12 patterns

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
12. `sorting_buckets` — PR #103, 5 basic Logic classification activities.

`symbol_hunt` covers 74 direct-literacy activities. Memory, Sequence, and Sorting are presentation diversification over existing canonical runtimes/evidence contracts rather than new activity identities.

### In QA, not merged: pattern #13 `drag_to_target`

PR #104 routes exactly these 5 Science Wave A matching activities:
- `science-match-living-nonliving`
- `science-match-plant-parts`
- `science-match-animal-homes-a`
- `science-match-senses-a`
- `science-match-weather-signs-a`

Behavior and boundaries:
- child pairs each source card with one target;
- desktop supports real drag/drop; touch/pen supports pointer-drag; tap/select -> target and keyboard remain available;
- runtime stays `matching`;
- activity IDs, `matchItems`, pair ids, skills, assessment, stars, progression, and completion identity remain canonical;
- exactly three canonical pairs must be completed;
- explicit assessed evidence uses `matching_drag_target_interaction`, including correct/incorrect/retry and `matchedPairCount`;
- all non-reviewed matching activities remain on `memory_pairs` or `grid_pairs`.

QA status:
- implementation head `722391fe049b3e055ab69e16140141bdf971268b`;
- CI #465 full success across Ubuntu, Windows, production build, dependency audit, secret scan, and mobile Chromium;
- static regression reports **12 memory_pair + 5 drag_targets + 10 sequence_slot + 5 sorting_buckets**;
- browser QA uses valid Science foundation prerequisites and checks keyboard wrong-state, real mouse drag, touch fallback, completion/evidence persistence, no horizontal overflow, >=44px controls, and 320/390/768 screenshots;
- manual visual QA accepted idle/error/success at 320, 390 and 768; the 320 success CTA remains fully visible;
- activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

If PR #104 merges, active gameplay-pattern count becomes **13**.

## Frontend/product state

The merged child experience includes Garden/Playroom UI, persistent active-child state, recommendation/continue flow, Recommended Path + Stage Journey + Browse All, hydration-safe stage guard, responsive Coloring/Drawing, Memory Pair, Sequence Slot, Sorting Buckets, audio session handling, activity previews, Nunito UI typography, and Phosphor icons.

Drag-to-Target is currently **QA/unmerged** on PR #104 and must not be presented as shipped before merge.

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

1. close Drag-to-Target PR #104 with canonical docs, docs-head CI, review-thread check, and exact-head merge;
2. add/maintain the gameplay-distribution audit across all 900 activities and use it to identify concentration hotspots;
3. implement `reorder_cards` and `tap_in_order` as separate mechanic waves only where objective requires multi-step ordering;
4. continue search/scene, Math, audio, puzzle/path, literacy, science, creative, and story patterns toward 60;
5. continue Art Bible/permanent visual QA;
6. native/reviewed narration;
7. public/parent frontend;
8. physical-device/accessibility/Iqro expert acceptance;
9. governance; technical cleanup after product quality stabilizes.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not equal 900 experiences. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, touch-friendly, and visually reviewed before merge.
