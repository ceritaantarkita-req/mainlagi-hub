# WS-05 Pattern #33 — Math Equal Groups

Date: **16 September 2026**  
Implementation PR: **#145**  
Branch: `agent/ws05-math-equal-groups-20260916`  
Base `main`: `63285c6dd39b0cc1a521b042a492a83338bb2582`  
Status: **QA ACCEPTED / UNMERGED**

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

Explicit exclusions include:

```text
math-group-match-2s
math-group-match-3s
math-missing-1-3
math-add-1-1
math-sub-3-1
math-length-longer-lines
science-living-dog
```

No catalog content, mastery, progression, schema or migration is changed by Pattern #33.

## Mechanic contract

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
- no changed choices, extra confirmation, drag-only dependency or intermediate assessment.

Assessed evidence:
- fidelity `choice_equal_groups_interaction`;
- metadata source `equal-groups-runtime`;
- metadata includes `totalCount`, `groupSize`, `groupCount`, `selectedChoice`;
- assessed accuracy/score/correct/incorrect/retry remain derived from canonical attempts.

## Implementation scope

Implementation adds/wires:
- `src/lib/learning/equalGroupsConfig.ts`;
- `src/components/learning/EqualGroupsActivity.tsx`;
- `src/components/learning/EqualGroupsActivity.module.css`;
- activity-route wiring;
- `gameplayPresentation` classifier and central regression;
- permanent gameplay-distribution registration;
- dedicated static Equal Groups regression;
- dedicated Chromium browser QA at 320x720, 390x844 and 768x1024;
- package and learning-test wiring.

No content/mastery/progression/schema/migration files are part of the implementation scope.

## CI defect history

The browser gate caught two real responsive defects before acceptance.

### CI #685 / run `35052200287`

Implementation head before responsive fixes: `6bedc089b6ad3a6eca0480796a31c1e08b18f5cf`.

All major non-browser gates passed, but Chromium failed because the Equal Groups **success CTA at 320x720 was not fully visible**. The viewport assertion was retained unchanged.

### CI #686 / run `35052577160`

First responsive fix head: `8c15144db99feb1620a2523d5ccd384510354cd5`.

The 320 success-state defect was fixed, but Chromium then exposed a second problem: **idle Equal Groups feedback at 390x844 was not fully visible**. The browser assertion again remained unchanged.

### CI #687 / run `35053008065` — accepted

Final accepted code head: `26c2b2355099c4097c015ba5767703035b33aa63`.

The final responsive adjustment compacts redundant spacing/content on shorter phone viewports while preserving:
- explicit equal-group visual structure;
- idle/wrong cue information;
- masked result before success;
- >=48px phone choice targets;
- success feedback and CTA;
- the original hard viewport assertions.

CI #687 passed:
- production build and build budgets;
- dependency audit;
- secret-history scan;
- Ubuntu structure/assets/source/security/device-harness/typecheck/lint;
- complete engine/learning regressions including exact Equal Groups regression;
- activity-quality audit;
- gameplay-distribution audit;
- simulations and Batch17;
- Windows typecheck/lint/engine tests;
- Chromium canonical mobile-route/accessibility/lazy-load matrix and every specialized browser suite including Equal Groups.

Cloudflare production smoke is correctly skipped on the PR event and is required after merge to `main`.

## Accepted audit state

Activity quality:

```text
activities:              900
KEEP:                    900
POLISH:                     0
REDESIGN:                   0
REPLACE:                    0
structural findings:        0
```

Gameplay distribution at accepted PR head:

```text
activities:               900
classified:               900
unclassified:               0
active patterns:           33
choice_grid               295 / 900 = 32.78%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Math choice_grid            43 / 100
```

The audit reports no global hotspot. Subject concentration signals remain advisory.

If merged unchanged, distance is **17** patterns to minimum 50 and **27** to working target 60.

## Manual visual acceptance

Nine screenshots were reviewed manually:

```text
320x720  idle / wrong / success
390x844  idle / wrong / success
768x1024 idle / wrong / success
```

Accepted observations:
- group separation is visually clear;
- reviewed activity `math-group-8-by-2` shows four groups of two;
- total/group-size context remains legible;
- result remains `?` for idle and wrong states;
- wrong state does not complete or reveal the answer;
- success reveals canonical `4` only after correct selection;
- feedback and CTA remain visible;
- no visible clipping or horizontal overflow;
- compact phone treatment keeps the learning relationship understandable.

Manual screenshot acceptance is not external physical-device certification, accessibility-specialist review, or human pedagogical/art acceptance.

## Remaining closure gates

Pattern #33 is **not fully closed** at this record.

Required remaining sequence:
1. commit this wave record and canonical docs on PR #145;
2. require fresh exact docs-head full CI success;
3. verify PR #145 exact head, changed-file scope, mergeability, comments, reviews and review threads;
4. squash merge PR #145 only with exact expected head;
5. independently verify exact implementation merge on `main`;
6. require post-merge `main` CI full success including Cloudflare production smoke;
7. create a docs-only closure branch from exact implementation merge SHA;
8. update canonical docs with implementation merge/live evidence and closure PR identity;
9. require fresh exact closure-head full CI success and clean docs-only merge gate;
10. exact-head squash merge the closure PR;
11. independently verify final `main` SHA and require final post-closure `main` CI full success including Cloudflare production smoke.

Only after all gates pass may Pattern #33 be marked **FULLY CLOSED**.

No family is pre-approved for Pattern #34; the next mechanic requires a fresh objective/evidence audit after Pattern #33 full closure.
