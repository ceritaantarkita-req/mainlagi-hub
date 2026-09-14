# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- latest merged product-quality change: PR #105 — WS-05 Gameplay Distribution Audit
- active gameplay branch/PR: `agent/ws05-gameplay-count-select-20260914` / PR #106
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`.

CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, activity-quality audit, and the permanent gameplay-distribution audit.

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
- PR #105 `02d4696760d7b697cfd319804cd655c0d2bfec4c`

## Permanent gameplay-distribution baseline on `main`

PR #105 added canonical child-facing classification and permanent reports:

```text
.qa/gameplay-distribution/report.json
.qa/gameplay-distribution/report.md
```

Merged baseline:

```text
classified:       900 / 900
unclassified:       0
active patterns:   13
```

Main baseline global hotspot is `choice_grid` **392/900 (43.56%)**. Subject hotspots include Math 82/100, Science 79/100, Logic 77/100 `choice_grid`, plus Letters `symbol_hunt` 64/100. Coloring/Drawing remain 100% canvas by design and are not automatic defects.

Hotspots are prioritization signals only. A mechanic must still fit the learning objective and preserve evidence/mastery semantics.

## PR #106 QA — pattern #14 `count_and_select`

PR #106 routes exactly these 9 reviewed Math counting activities to one reusable child-facing renderer:

- `math-count-2`
- `math-count-3`
- `math-count-4`
- `math-count-5`
- `math-count-6`
- `math-count-7`
- `math-count-8`
- `math-count-9`
- `math-count-10`

Behavior and boundaries:
- visible object set is the primary counting surface;
- child counts, then chooses one of the existing three canonical numeric answers;
- runtime stays `tap_choice`;
- activity IDs, choices, correctChoice, skills, assessment, stars, progression, and completion identity remain canonical;
- wrong answer increments incorrect/retry and does not complete the activity;
- explicit assessed evidence uses `choice_count_interaction`, including correct/incorrect/retry/accuracy and `countTarget` metadata;
- exact 9-ID allowlist prevents unrelated Math choice families from being reclassified.

PR #106 also corrects one semantic underclassification in the first distribution baseline: `math-count-3` already had a specialized counting renderer historically, but the audit still called it `choice_grid`. The new canonical family classifier makes all nine reviewed count activities explicit under the same child-facing pattern.

Implementation-head QA:
- PR head reviewed: `871677650ecc9e2e86618fb5f81b342b0b370c85`;
- CI #480 full success across Ubuntu, Windows, production build, dependency audit, secret-history scan, and mobile Chromium;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural findings 0;
- browser QA uses legitimate `math-pola` readiness, tests keyboard wrong-state + pointer completion, canonical four-star rendering for `math-count-4`, evidence persistence, >=44px choices, no horizontal overflow, and success CTA visibility;
- manual visual review accepted idle/error/success at 320, 390, and 768.

Measured QA distribution after the 9-activity family is routed:

| Pattern | Activities | Share |
| --- | ---: | ---: |
| `choice_grid` | 383 | 42.56% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `count_and_select` | 9 | 1.00% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

Math `choice_grid` falls **82 -> 73** while all 900 activities remain classified. If PR #106 merges, active gameplay-pattern count becomes **14**.

## Frontend/product state

The merged child experience includes Garden/Playroom UI, persistent active-child state, recommendation/continue flow, Recommended Path + Stage Journey + Browse All, hydration-safe stage guard, responsive Coloring/Drawing, Memory Pair, Sequence Slot, Sorting Buckets, Drag-to-Target, audio session handling, activity previews, Nunito UI typography, and Phosphor icons.

Count-and-Select is **QA/unmerged** on PR #106 and must not be presented as shipped before merge.

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

1. close Count-and-Select PR #106 with canonical docs, docs-head CI, review-thread check, and exact-head merge;
2. continue Math diversification by reviewed coherent family; strongest candidates are `number_line`, `more_less_balance`, `pattern_completion`, then `make_total` where the objective fits;
3. use the permanent distribution audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
4. continue Art Bible/permanent visual QA;
5. native/reviewed narration;
6. public/parent frontend;
7. physical-device/accessibility/Iqro expert acceptance;
8. governance; technical cleanup after product quality stabilizes.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not equal 900 experiences. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, touch-friendly, visually reviewed, and reflected by the gameplay-distribution audit before merge.
