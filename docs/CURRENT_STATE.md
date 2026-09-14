# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `18beb9bc676d529cc5701bc964bdef26bea33132`
- latest merged product-quality change: PR #106 — WS-05 Count-and-Select Math Wave
- active gameplay branch/PR: none; next mechanic requires exact-family review before implementation
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`.

CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, activity-quality audit, and the permanent gameplay-distribution audit.

External physical-device and expert acceptance remain separate and incomplete.

## Learning/catalog baseline

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

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 14 patterns

1. `choice_grid`
2. `symbol_hunt`
3. `listen_choose`
4. `visible_matching`
5. `guided_trace`
6. `story_read`
7. `motion_game`
8. `coloring_canvas`
9. `drawing_canvas`
10. `memory_pair` — PR #101
11. `missing_sequence_slot` — PR #102
12. `sorting_buckets` — PR #103
13. `drag_to_target` — PR #104
14. `count_and_select` — PR #106

Accepted merge SHAs:
- PR #101 `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`
- PR #102 `f981d40fd55c1cdef3137600b4b44677e550b06d`
- PR #103 `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`
- PR #104 `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`
- PR #105 `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- PR #106 `18beb9bc676d529cc5701bc964bdef26bea33132`

## Permanent gameplay-distribution baseline

Current merged distribution after PR #106:

```text
classified:       900 / 900
unclassified:       0
active patterns:   14
choice_grid       383 / 900 = 42.56%
count_and_select    9 / 900 = 1.00%
Math choice_grid   73 / 100
Science choice_grid 79 / 100
Logic choice_grid   77 / 100
```

`choice_grid` remains the only global hotspot above the >35% advisory threshold. Hotspots are planning signals, not automatic quality failures.

## Count-and-Select — DONE / PR #106

Exactly 9 reviewed Math counting activities (`math-count-2` through `math-count-10`) now use one reusable counting renderer.

Preserved contracts:
- runtime stays `tap_choice`;
- choices/correctChoice, skill, assessment, stars, progression, activity ID, and completion identity stay canonical;
- explicit assessed evidence fidelity is `choice_count_interaction`;
- wrong answer increments incorrect/retry and does not complete;
- exact 9-ID allowlist prevents unrelated Math families from being reclassified.

QA accepted:
- implementation CI #480 full green;
- final docs-head CI #485 full green;
- manual visual review accepted idle/error/success at 320, 390, 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

PR #106 also fixed semantic underclassification from the first distribution baseline: `math-count-3` historically had a counting-specific renderer but was still counted as `choice_grid`; the canonical family classifier now makes the reviewed 2–10 family explicit.

## Frontend/product state

The merged child experience includes Garden/Playroom UI, persistent active-child state, recommendation/continue flow, Recommended Path + Stage Journey + Browse All, hydration-safe stage guard, responsive Coloring/Drawing, Memory Pair, Sequence Slot, Sorting Buckets, Drag-to-Target, Count-and-Select, audio session handling, activity previews, Nunito UI typography, and Phosphor icons.

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

1. review exact Math families for the next objective-appropriate mechanic; current candidates: `number_line`, `more_less_balance`, `pattern_completion`, then `make_total`;
2. use the permanent distribution audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy, creative, and story mechanics toward 60;
3. continue Art Bible/permanent visual QA;
4. native/reviewed narration;
5. public/parent frontend;
6. physical-device/accessibility/Iqro expert acceptance;
7. governance; technical cleanup after product quality stabilizes.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not equal 900 experiences. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, touch-friendly, visually reviewed, and reflected by the gameplay-distribution audit before merge.
