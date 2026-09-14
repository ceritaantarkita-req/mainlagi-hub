# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`
- latest merged gameplay change: PR #108 — WS-05 Number Line Math Wave
- active gameplay branch/PR: `agent/ws05-gameplay-more-less-balance-20260915` / PR #109
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

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 15 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`.

Accepted WS-05 merges:
- PR #101 `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`
- PR #102 `f981d40fd55c1cdef3137600b4b44677e550b06d`
- PR #103 `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`
- PR #104 `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`
- PR #105 `02d4696760d7b697cfd319804cd655c0d2bfec4c`
- PR #106 `18beb9bc676d529cc5701bc964bdef26bea33132`
- PR #108 `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`

## Merged gameplay-distribution baseline after PR #108

```text
classified:         900 / 900
unclassified:         0
active patterns:     15
choice_grid         377 / 900 = 41.89%
number_line           6 / 900 = 0.67%
count_and_select      9 / 900 = 1.00%
Math choice_grid     67 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

`choice_grid` remains the only global hotspot above the >35% advisory threshold. Hotspots are planning signals, not automatic quality failures.

## Number Line — DONE / PR #108

Exactly six reviewed Math Wave B ordering activities now use `number_line`:

`math-order-next-1-2`, `math-order-next-3-4`, `math-order-before-6`, `math-order-between-6-8`, `math-order-descend-5`, `math-order-descend-10`.

Preserved contracts:
- runtime remains `tap_choice`;
- IDs, choices, correctChoice, skill `math.number.ordering`, assessment, stars, progression and completion identity stay canonical;
- explicit assessed fidelity is `choice_number_line_interaction`;
- exact six-ID allowlist excludes Wave C `math-missing-*`.

Accepted QA:
- implementation CI #489 full green;
- final docs-head CI #494 full green;
- manual visual review accepted idle/error/success at 320, 390 and 768;
- deterministic activity quality remained **900 KEEP / 0 flagged**.

## PR #109 QA — pattern #16 `more_less_balance`

Exact scope: six reviewed Math Wave B comparison activities:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

Behavior and boundaries:
- visible left/right quantities are compared on a balance board;
- canonical three choices map explicitly to left / equal / right;
- beam remains neutral before completion so UI feedback does not reveal the answer;
- runtime remains `tap_choice`;
- IDs, choices, correctChoice, skill `math.quantity.comparison`, assessment, stars, progression and completion identity remain canonical;
- wrong answer increments incorrect/retry and does not complete;
- assessed fidelity is `choice_balance_comparison_interaction` with comparison goal, left/right counts and correct-side metadata;
- exact six-ID allowlist prevents unrelated Math families from reclassification.

Implementation-head QA at `9c71560e37a5dace1c79abea56d4cda625eb27c0`:
- CI #496 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan and mobile Chromium;
- browser representative `math-compare-equal-4-4` keeps progression guard enabled with legitimate Wave A readiness;
- keyboard wrong-state, pointer completion through `Sama`, evidence persistence, >=44px controls, no horizontal overflow and success CTA visibility pass at 320/390/768;
- manual visual review accepted idle/error/success at 320, 390 and 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

Measured PR #109 distribution:

```text
900 / 900 classified
0 unclassified
16 active patterns
choice_grid          371 / 900 = 41.22%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       61 / 100
```

PR #109 is **QA/unmerged** until final docs-head CI, clean review surface and exact-head merge are complete.

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

1. close PR #109 More/Less Balance safely;
2. next exact Math candidate: `pattern_completion` for reviewed Wave B pattern activities;
3. review Wave C missing-number family separately; do not assume it should reuse Number Line;
4. review `make_total` only for genuine number-composition/addition objectives;
5. continue audit-guided Logic, Science, search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 60;
6. continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall or mastery/backend rewrites before this quality phase is substantially complete.
