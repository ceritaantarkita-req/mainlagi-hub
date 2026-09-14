# WS-05 Gameplay Distribution Audit — 2026-09-14

## Purpose

This wave does not add or alter a child-facing mechanic. It makes current gameplay diversity measurable and regression-safe before the next mechanic wave.

Branch: `agent/ws05-gameplay-distribution-audit-20260914`  
PR: #105  
Base `main`: `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`

## Implementation

The canonical child-facing classifier lives in:

```text
src/lib/learning/gameplayPresentation.ts
```

`gameplayPattern(activity)` maps every playable activity to one of the currently implemented patterns:

```text
choice_grid
symbol_hunt
listen_choose
visible_matching
memory_pair
drag_to_target
missing_sequence_slot
sorting_buckets
guided_trace
story_read
motion_game
coloring_canvas
drawing_canvas
```

The audit script is:

```text
scripts/audit-gameplay-distribution.mjs
```

Run with:

```bash
npm run qa:gameplay-distribution
```

Outputs:

```text
.qa/gameplay-distribution/report.json
.qa/gameplay-distribution/report.md
```

CI uploads these as `gameplay-distribution-audit`.

## Blocking contracts

The audit fails if:
- the current product baseline is no longer exactly 900 activities without an intentional audit update;
- any activity is unclassified;
- classified totals do not sum to the catalog;
- the active child-facing pattern set changes without updating the intentional expected set.

Concentration thresholds are **not** blocking quality failures. They are planning signals.

Current thresholds:
- global hotspot: more than 35% of all activities in one pattern;
- subject hotspot: more than 60% of one subject in one pattern.

## QA result

Implementation-head CI #472 on `d275dbb0f2b1acfa033fc0c99ecb77d0860d24bd` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, mobile Chromium, activity-quality audit, gameplay-distribution audit, simulations, and Batch 17 acceptance.

Coverage:

```text
900 / 900 classified
0 unclassified
13 active patterns
```

Overall distribution:

| Pattern | Count | Share |
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

The only global hotspot is `choice_grid` at 392/900 (43.56%).

Subject hotspots:
- Mewarnai `coloring_canvas`: 100/100.
- Menggambar `drawing_canvas`: 100/100.
- Matematika `choice_grid`: 82/100.
- Sains `choice_grid`: 79/100.
- Logika `choice_grid`: 77/100.
- Huruf & Menulis `symbol_hunt`: 64/100.

Coloring and Drawing concentration is expected because the canvas is the defining creative medium; do not diversify them merely to lower a percentage. Any creative sub-pattern must provide a genuine new learning/creative interaction.

## Family review for the next wave

The strongest non-creative concentration is Math `choice_grid` at 82/100.

A review of the current Math choice-grid activity IDs shows useful candidate families. The counts below are planning groupings derived from current ID prefixes, not new canonical taxonomy fields:
- `math-count-*`: 9 activities;
- `math-compare-*`: 6 activities;
- `math-order-*`: 6 activities;
- `math-pattern-*`: 5 activities;
- `math-missing-*`: 5 activities;
- additional arithmetic, spatial, mixed, problem, recognition, shape, measure and review families remain for later review.

Decision: next planned mechanic is **`count_and_select`** for a reviewed Math counting family.

This is not a mass conversion. The next branch must confirm exact IDs, stage/progression prerequisites, canonical choices/correctChoice, skill/evidence mapping, and age fit before routing activities.

Candidate later Math mechanics:
- `number_line` for number-position/order objectives;
- `more_less_balance` for comparison objectives;
- `pattern_completion` for pattern/missing objectives;
- `make_total` for composition/addition objectives where appropriate.

## Non-negotiable handoff

Before merging PR #105:
- canonical docs must reflect PR #104 as merged and PR #105 as QA;
- final docs-head CI must be fully green;
- review threads/comments must be checked;
- merge must use exact current head SHA.

After merge:
- verify `main` contains the audit;
- start the Math `count_and_select` wave on a fresh branch from latest `main`;
- rerun the gameplay-distribution audit after the mechanic is implemented and record the measured delta rather than estimating it.
