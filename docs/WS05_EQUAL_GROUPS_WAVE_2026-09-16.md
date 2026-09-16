# WS-05 Pattern #33 — Math Equal Groups

Date: **16 September 2026**  
Implementation PR: **#145**  
Implementation branch: `agent/ws05-math-equal-groups-20260916`  
Implementation base `main`: `63285c6dd39b0cc1a521b042a492a83338bb2582`  
Final implementation docs head: `11f278a0150ff31b1ba89394c23b78fa244038aa`  
Implementation docs-head CI: **#692 / run `35053984870` — full success**  
Implementation merge: `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`  
Post-merge `main` CI: **#693 / run `35054346467` — full success including Cloudflare production smoke**  
Closure branch: `docs/ws05-equal-groups-closure-20260916`  
Closure PR: **PENDING**  
Status: **MERGED / LIVE VERIFIED / CLOSURE PENDING**

## Why this family was selected

Pattern #32 was fully closed before this wave started. A fresh objective/evidence review selected the Math equal-grouping choice family because the three reviewed activities share one precise learning objective: partition a small total into equal-size groups and identify the resulting number of groups.

This is semantically distinct from existing mechanics:
- addition remains `make_total`;
- subtraction remains `take_away`;
- missing-number activities remain sequence mechanics;
- the two canonical grouping matching activities remain `visible_matching`;
- length/size, count-select, number-line, comparison and pattern families remain separate;
- non-Math families remain outside scope.

The selection was based on objective/evidence fit, not concentration thresholds. Concentration remains advisory only.

## Exact canonical scope

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Canonical boundaries for all three:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-grouping`;
- pack `math.pack.grouping`;
- skill `math.grouping.equal_groups`;
- assessment `assessed`;
- runtime `tap_choice`;
- exactly three unique numeric choices including unchanged canonical `correctChoice`.

Explicit exclusions include `math-group-match-2s`, `math-group-match-3s`, missing-number, addition, subtraction, length/size, existing Math specialized mechanics, and all non-Math families. No catalog content, mastery, progression, schema or migration changed.

## Mechanic and evidence contract

`equal_groups`:
- renders the reviewed total as visibly separated equal-size groups;
- each visual group explicitly shows its position and `groupSize`;
- total is constrained to 2..10;
- group size must be positive and smaller than the total;
- total must divide evenly by group size;
- `totalCount / groupSize` must exactly equal numeric canonical `correctChoice`;
- result stays masked as `?` before a correct assessment;
- canonical keyboard/touch/pointer choice buttons remain the assessment interaction;
- wrong choice increments incorrect/retry evidence, cannot complete, and cannot reveal result;
- correct choice completes the canonical activity and reveals group count;
- no changed choices, extra confirmation, drag-only dependency or intermediate assessment;
- fidelity `choice_equal_groups_interaction`;
- metadata source `equal-groups-runtime` with `totalCount`, `groupSize`, `groupCount`, `selectedChoice`.

## CI defect history and acceptance

The browser gate caught two real responsive defects before acceptance.

### CI #685 / run `35052200287`

Implementation head before responsive fixes: `6bedc089b6ad3a6eca0480796a31c1e08b18f5cf`. Chromium failed because the success CTA at 320x720 was not fully visible. The viewport assertion was retained unchanged.

### CI #686 / run `35052577160`

First responsive fix head: `8c15144db99feb1620a2523d5ccd384510354cd5`. The 320 defect was fixed, but Chromium exposed idle Equal Groups feedback clipping at 390x844. The assertion again remained unchanged.

### CI #687 / run `35053008065` — accepted code head

Final accepted code head: `26c2b2355099c4097c015ba5767703035b33aa63`.

The final responsive adjustment compacted redundant spacing/content on shorter phone viewports while preserving explicit equal-group visual structure, idle/wrong cue information, masked result before success, >=48px phone choice targets, success feedback/CTA, and the original hard viewport assertions. CI #687 passed production build/budgets, dependency and secret scans, Ubuntu/Windows gates, complete learning regressions including exact Equal Groups regression, deterministic audits, simulations, Batch17 and Chromium specialized/browser QA.

## Manual visual acceptance

Nine screenshots were reviewed manually:

```text
320x720  idle / wrong / success
390x844  idle / wrong / success
768x1024 idle / wrong / success
```

Accepted observations:
- group separation is visually clear;
- representative `math-group-8-by-2` shows four groups of two;
- result remains `?` for idle and wrong states;
- wrong state does not complete or reveal the answer;
- success reveals canonical `4` only after correct selection;
- feedback and CTA remain visible;
- no visible clipping or horizontal overflow;
- compact phone treatment keeps the learning relationship understandable.

Manual screenshot acceptance is not external physical-device certification, accessibility-specialist review, or human pedagogical/art acceptance.

## Accepted audit state

```text
activities:               900
KEEP:                     900
flagged:                    0
structural findings:        0
classified:               900
unclassified:               0
active patterns:           33
choice_grid               295 / 900 = 32.78%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Math choice_grid            43 / 100
```

There is no global hotspot. Distance remaining is **17** patterns to minimum 50 and **27** to working target 60.

## Implementation merge/live verification

- canonical implementation docs were committed on PR #145;
- final docs head `11f278a0150ff31b1ba89394c23b78fa244038aa` passed fresh full CI #692 / run `35053984870`;
- final merge gate verified exact head, 15 exact changed files, `behind_by=0`, mergeable true, zero comments, zero reviews and zero review threads;
- PR #145 was exact-head squash merged as `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #693 / run `35054346467` passed every required job including Cloudflare production smoke.

This completes the implementation/live portion of Pattern #33.

## Remaining closure gates

Pattern #33 is **not fully closed** at this record. A docs-only closure branch now exists from exact implementation merge SHA `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`.

Remaining sequence:
1. bind the docs-only closure PR identity to the five canonical docs;
2. require fresh exact closure-head full CI success;
3. verify closure PR exact head, exactly five docs changed, `behind_by=0`, mergeability, comments, reviews and review threads;
4. exact-head squash merge the closure PR;
5. independently verify final `main` SHA;
6. require final post-closure `main` CI full success including Cloudflare production smoke.

Only after all remaining gates pass may Pattern #33 be marked **FULLY CLOSED**.

No family is pre-approved for Pattern #34; the next mechanic requires a fresh objective/evidence audit after Pattern #33 full closure.
