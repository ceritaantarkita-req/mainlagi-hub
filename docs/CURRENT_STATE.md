# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `7c1a679c156c623a318cb9640880374eedc7e149`
- latest merged gameplay change: PR #106 — WS-05 Count-and-Select Math Wave
- latest canonical docs closure: PR #107
- active gameplay branch/PR: `agent/ws05-gameplay-number-line-20260914` / PR #108
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, activity-quality audit, and permanent gameplay-distribution audit.

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

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`.

Accepted WS-05 merges:
- PR #101 `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`
- PR #102 `f981d40fd55c1cdef3137600b4b44677e550b06d`
- PR #103 `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`
- PR #104 `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`
- PR #105 `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- PR #106 `18beb9bc676d529cc5701bc964bdef26bea33132`

## Merged gameplay-distribution baseline

```text
classified:         900 / 900
unclassified:         0
active patterns:     14
choice_grid         383 / 900 = 42.56%
count_and_select      9 / 900 = 1.00%
Math choice_grid     73 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

`choice_grid` remains the only global hotspot above the >35% advisory threshold. Hotspots are planning signals, not automatic quality failures.

## PR #108 QA — pattern #15 `number_line`

PR #108 routes exactly six reviewed Math Wave B ordering activities:

```text
math-order-next-1-2
math-order-next-3-4
math-order-before-6
math-order-between-6-8
math-order-descend-5
math-order-descend-10
```

These six share stage `math-banding-bentuk`, lesson/objective `math-order-numbers`, and skill `math.number.ordering`. Wave C `math-missing-*` is intentionally excluded pending separate family review.

Behavior and boundaries:
- local five-tick number line makes relative position visible;
- only the existing three canonical choices are interactive;
- explicit sequence context is configured per activity rather than parsed from prompt text;
- runtime remains `tap_choice`;
- activity IDs, choices, correctChoice, skill, assessment, stars, progression and completion identity remain canonical;
- wrong answer increments incorrect/retry and does not complete;
- assessed fidelity is `choice_number_line_interaction` with line direction/range/context metadata;
- exact six-ID allowlist prevents unrelated Math choice families from being reclassified.

Implementation-head QA at `6b92ff922b6878d6ff1a88b1162f6adc9beee05f`:
- CI #489 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan and mobile Chromium;
- activity quality remains **900 KEEP / 0 flagged**, structural findings 0;
- browser representative `math-order-between-6-8` uses legitimate Wave A readiness with progression guard enabled;
- browser QA tests five local ticks 5–9, context 6/8, canonical choices 5/7/9, keyboard wrong-state, pointer completion, evidence persistence, >=44px controls, no horizontal overflow, and success CTA visibility;
- manual visual review accepted idle/error/success at 320x720, 390x844 and 768x1024.

Measured PR #108 distribution:

```text
900 / 900 classified
0 unclassified
15 active patterns
choice_grid       377 / 900 = 41.89%
number_line         6 / 900 = 0.67%
Math choice_grid   67 / 100
```

PR #108 is **QA/unmerged** until canonical docs, final docs-head CI, clean review surface and exact-head merge are complete.

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

1. close PR #108 Number Line safely;
2. next exact Math family candidate: `more_less_balance` for six reviewed Wave B compare activities;
3. then review `pattern_completion`, Wave C missing-number family, and `make_total` separately;
4. continue audit-guided Logic, Science, search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 60;
5. continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall or mastery/backend rewrites before this quality phase is substantially complete.
