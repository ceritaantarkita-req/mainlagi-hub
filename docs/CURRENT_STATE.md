# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`
- latest merged product-quality change: PR #104 — WS-05 Drag-to-Target Wave
- active gameplay branch/PR: `agent/ws05-gameplay-distribution-audit-20260914` / PR #105
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`.

CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, and—on PR #105—the new gameplay-distribution audit.

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

Target: minimum **50**, working target **60 meaningful patterns**, built from reusable interaction engines and distributed by learning objective.

### Merged on `main`: 13 patterns

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
11. `missing_sequence_slot` — PR #102, 10 Letters order activities.
12. `sorting_buckets` — PR #103, 5 basic Logic classification activities.
13. `drag_to_target` — PR #104, 5 reviewed Science Wave A matching activities.

Accepted merge SHAs:
- PR #101 `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`
- PR #102 `f981d40fd55c1cdef3137600b4b44677e550b06d`
- PR #103 `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`
- PR #104 `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`

## Gameplay distribution audit — PR #105 QA

PR #105 adds the canonical gameplay-pattern classifier plus a permanent distribution report. CI #472 is full green at implementation head `d275dbb0f2b1acfa033fc0c99ecb77d0860d24bd`.

Measured coverage:

```text
classified:       900 / 900
unclassified:       0
active patterns:   13
```

Overall distribution:

| Pattern | Activities | Share |
| --- | ---: | ---: |
| `choice_grid` | 392 | 43.56% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

Global advisory hotspot: `choice_grid` **392/900 (43.56%)**, above the >35% planning threshold.

Subject-level advisory hotspots above 60%:
- Mewarnai: `coloring_canvas` 100/100 — expected creative-track specialization, not automatically a defect.
- Menggambar: `drawing_canvas` 100/100 — expected creative-track specialization, not automatically a defect.
- Matematika: `choice_grid` 82/100.
- Sains: `choice_grid` 79/100.
- Logika: `choice_grid` 77/100.
- Huruf & Menulis: `symbol_hunt` 64/100.

Hotspots are prioritization signals only. A mechanic must still fit the learning objective and preserve evidence/mastery semantics.

## Next gameplay decision

The audit changes the immediate ordering of WS-05 work. The next planned mechanic after PR #105 is **`count_and_select` for a reviewed Math counting family**, because Math is the strongest non-creative `choice_grid` hotspot at 82/100 and currently contains a coherent `math-count-*` family.

Do not blindly convert all Math choice activities. Review family-by-family. Follow-on candidates include `number_line`, `more_less_balance`, `pattern_completion`, then objective-appropriate Logic/Science/search/audio/ordering mechanics.

## Frontend/product state

The merged child experience includes Garden/Playroom UI, persistent active-child state, recommendation/continue flow, Recommended Path + Stage Journey + Browse All, hydration-safe stage guard, responsive Coloring/Drawing, Memory Pair, Sequence Slot, Sorting Buckets, Drag-to-Target, audio session handling, activity previews, Nunito UI typography, and Phosphor icons.

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

1. close gameplay-distribution audit PR #105 with canonical docs, docs-head CI, review-thread check, and exact-head merge;
2. implement reviewed Math `count_and_select` wave on a new branch from latest `main`;
3. continue Math diversification (`number_line`, `more_less_balance`, `pattern_completion`, `make_total`) where objective fit is real;
4. use the permanent audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
5. continue Art Bible/permanent visual QA;
6. native/reviewed narration;
7. public/parent frontend;
8. physical-device/accessibility/Iqro expert acceptance;
9. governance; technical cleanup after product quality stabilizes.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not equal 900 experiences. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, touch-friendly, visually reviewed, and reflected by the gameplay-distribution audit before merge.
