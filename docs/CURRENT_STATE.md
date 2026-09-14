# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff for the current repository state. `main` is the merged implementation source of truth. Active PR work must be described explicitly as unmerged/QA and must not be presented as already shipped.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged main SHA: `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`
- latest merged product-quality change: PR #101 — WS-05 Memory Pair Wave
- active gameplay branch/PR: `agent/ws05-gameplay-sequence-slot-20260914` / PR #102
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

## Current engineering status

No known P0 engineering blocker is open on the merged baseline.

Current CI coverage includes:
- Ubuntu quality gate;
- Windows compatibility;
- production build;
- production dependency audit;
- mobile route QA in Chromium;
- secret-history scan;
- learning/mastery regression suites;
- build budgets and source/security audits.

External physical-device and expert acceptance is still incomplete; see `External acceptance still open`.

## Current learning/catalog baseline

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

Totals:
- 9 subjects / learning paths;
- 900 activities;
- 683 assessed / 217 practice;
- 46 stages;
- 197 lessons;
- 197 active content packs;
- 200 active skills.

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

**Important:** runtime count is not the same thing as gameplay-pattern count. One runtime may support multiple child-facing mechanics.

## Gameplay variation state

Canonical gameplay source of truth: **`docs/GAMEPLAY_VARIATION_CATALOG.md`**.

Product target:
- minimum **50** gameplay patterns;
- working target **60** meaningful patterns;
- use roughly 12–15 reusable interaction engines instead of 60 one-off implementations;
- distribute mechanics by learning objective and monitor concentration across all 900 activities.

### Merged patterns on `main`: 10

1. `choice_grid` — choose one option.
2. `symbol_hunt` — visually hunt a target symbol/letter.
3. `listen_choose` — hear a prompt and choose.
4. `visible_matching` — pair visible items.
5. `guided_trace` — follow a guide path/form.
6. `story_read` — read/listen to a short story.
7. `motion_game` — optional body-motion interaction.
8. `coloring_canvas` — fill authored coloring regions.
9. `drawing_canvas` — draw with activity-specific scaffolding.
10. `memory_pair` — reveal concealed cards and find pairs.

`symbol_hunt` is used by 74 direct-literacy activities. `memory_pair` is used by 12 Letters case-matching activities after PR #101.

### In QA, not merged: pattern #11

`missing_sequence_slot` on PR #102:
- covers exactly 10 Letters `letters-order-*` activities;
- shows an alphabet rail with one missing position plus three large candidate tiles;
- canonical runtime remains `tap_choice`; canonical choices, correctChoice, skill, assessment, stars, progression and completion semantics are unchanged;
- explicit assessed evidence uses `choice_sequence_interaction` and preserves correct/incorrect/retry counts;
- browser QA covers progression, keyboard wrong-state, pointer/touch completion, 320/390/768 layouts, persistence and evidence;
- manual visual QA found and fixed a clipped success CTA at 320×720; CI now asserts the success CTA remains fully inside the viewport;
- implementation-head CI #447 is full success and activity quality remains 900 KEEP / 0 flagged.

The next planned gameplay wave after PR #102 is `sorting_buckets` + `drag_to_target` for classification/matching objectives.

## Current frontend/product state

The child experience includes:
- Garden/Playroom visual system;
- persistent active-child state;
- continue-learning/recommendation flow;
- redesigned home/navigation/subject/stage/activity surfaces;
- Recommended Path + Stage Journey + Browse All product model;
- stage/progression route guard with hydration-safe readiness checks;
- redesigned coloring interaction with palettes, undo/reset, keyboard support and larger hit areas;
- 100/100 Drawing activities with functional activity-specific scaffold coverage;
- 100/100 Coloring activities with deterministic duplicate-geometry finding reduced to zero;
- Memory Pair presentation for the accepted Letters case-matching family;
- improved audio route/session handling;
- activity previews;
- Nunito UI typography and Phosphor icons.

Do not revert this product model or weaken stage/evidence rules merely to simplify a mechanic.

## Deterministic activity-quality baseline

The latest deterministic audit reached:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
Q101–Q108: 0
```

This means the current deterministic rules are clean. It does **not** mean human pedagogical, visual-art, narration, physical-device, or expert Iqro acceptance is complete.

Coloring WS-06 is complete. Drawing WS-07 is complete. Gameplay diversification WS-05 is now the primary implementation focus.

## Learning/mastery boundaries

These remain non-negotiable unless explicitly redesigned with tests and migration review:
- mastery states: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one qualifying perfect attempt remains at most `exploring`;
- retries/rapid replays cannot farm mastery;
- practice/completion-only activities cannot manufacture assessed mastery;
- Drawing and Coloring remain `practice` + completion-only semantics;
- legacy game scores remain separate from academic mastery;
- motion is optional input/context, not inherently stronger evidence;
- all active Iqro packs remain `expert_required`, not `expert_approved`.

Every new gameplay pattern must preserve these boundaries or explicitly migrate its evidence contract with tests and documentation.

## Adaptive/reporting state

Adaptive Learning V2 remains the active recommendation/reporting foundation across the nine subjects. Recommendation considers age compatibility, stage availability, incomplete core work, weak skills, replay avoidance and optional motion preference.

Parent reporting remains bounded and explainable. Creative-only subjects must not receive synthetic mastery percentages.

## Product-quality gaps now prioritized

The main remaining gap is **experience depth and interaction diversity**, not activity quantity or the core evidence engine.

Canonical next work is defined in `NEXT_PRODUCT_QUALITY_PLAN.md` and `GAMEPLAY_VARIATION_CATALOG.md`.

Priority order:
1. close Sequence Slot PR #102 safely;
2. implement `sorting_buckets` + `drag_to_target` as the next gameplay wave;
3. continue expanding toward 60 documented patterns with reusable mechanics;
4. maintain a catalog-wide mechanic-distribution audit so `tap_choice`/matching-style experiences do not dominate child sessions;
5. continue Art Bible/permanent human visual QA;
6. implement licensed/reviewed native-feeling Indonesian and English narration;
7. update public/parent surfaces;
8. finish physical-device/accessibility/Iqro acceptance;
9. harden repository governance.

Do **not** prioritize increasing activity count, OCR, large AI features, subscription/paywall work, or a mastery rewrite before this phase is substantially complete.

## Gameplay authoring rule

900 activity IDs do not count as 900 different experiences. Child-facing mechanic diversity must be measured separately from runtime/activity counts. New mechanics must be reusable, objective-appropriate, evidence-safe, responsive, keyboard-accessible, and visually reviewed before merge.
