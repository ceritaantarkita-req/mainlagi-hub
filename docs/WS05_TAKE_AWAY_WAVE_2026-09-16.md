# WS-05 Pattern #32 — Math Take Away

Date: **16 September 2026**  
Status: **QA ACCEPTED / UNMERGED**  
Implementation PR: **#143**  
Branch: `agent/ws05-math-take-away-20260916`  
Verified merged base: `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`

## Why this family

Pattern #32 was selected from a fresh objective/evidence audit only after Pattern #31 was fully closed. Distribution concentration was used only as a planning signal.

The reviewed Math Wave C subtraction family is the strongest fit because all five activities share one explicit objective: take away part of a small group and determine the remainder within 10. `take_away` externalizes the removal action with one visible starting group, a reviewed subset visibly marked as removed, and a masked numeric remainder while preserving the existing assessed three-choice evidence contract.

Nearby candidates were not selected for this wave:
- Math addition already has the distinct `make_total` composition mechanic;
- Math grouping asks about equal groups rather than removal;
- Math missing-number activities remain sequence tasks;
- Bahasa picture-word activities were reviewed but a specialized screen currently risks becoming a mostly cosmetic visual-choice restyle;
- English initial-sound activities were reviewed but the candidate family is heterogeneous across two direct-choice activities and one matching activity, making it weaker for one exact reusable mechanic.

## Exact scope

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
```

Canonical family boundaries:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-subtraction`;
- pack `math.pack.subtraction`;
- skill `math.operation.subtraction.within_10`;
- runtime remains `tap_choice`;
- assessment remains assessed;
- exactly three canonical numeric choices and unchanged `correctChoice`.

Explicit exclusions:
- all addition activities, including the `make_total` family;
- grouping and grouping-matching activities;
- missing-number activities;
- length/size activities;
- existing count/select, number-line, comparison and pattern mechanics;
- all non-Math families.

## Interaction and evidence contract

Pattern: `take_away`.

The activity board shows one reviewed canonical starting group. Exactly the reviewed removed subset remains visible but faded/crossed so the subtraction action is explicit without deleting the original context.

Before a correct assessment:
- all starting objects remain represented;
- removed objects are visibly distinguished from remaining objects;
- numeric result stays `?`;
- canonical three numeric choices remain available via keyboard/touch/pointer;
- a wrong choice records incorrect/retry evidence;
- wrong choice cannot complete and cannot reveal the numeric remainder.

After the canonical correct choice:
- the existing activity completes;
- result slot may reveal the canonical remainder;
- no extra confirmation or intermediate assessment is introduced.

Config validation requires:
- exact reviewed activity ID;
- three unique canonical numeric choices;
- canonical `correctChoice` remains one of those choices;
- `startCount` is between 2 and 10;
- `removeCount` is a positive proper subset of `startCount`;
- `startCount - removeCount` equals canonical `correctChoice` exactly.

Runtime measurement:
- source `take-away-runtime`;
- assessed fidelity `choice_take_away_interaction`;
- records start count, remove count and selected canonical choice;
- canonical mastery, stars, progression and activity identity remain unchanged.

## QA history

Accepted implementation code head:

```text
5b6e774b942b5024bbf5fc21beac63ea0caeb7a7
```

Full CI #671 / run `35047494614` passed on the first run:
- Ubuntu quality gate;
- Windows compatibility;
- production build and build budgets;
- production dependency audit;
- secret-history scan;
- complete engine/learning suite including central and dedicated Take Away regressions;
- deterministic activity-quality audit;
- gameplay-distribution audit;
- simulations;
- Batch17 final acceptance contracts;
- Chromium canonical mobile/accessibility/browser matrix including Take Away responsive QA.

Cloudflare production smoke is correctly skipped on the unmerged PR and remains a post-merge `main` gate.

## Accepted audit evidence

Deterministic activity quality:

```text
subjects:                9
activities:            900
KEEP:                  900
POLISH:                  0
REDESIGN:                0
REPLACE:                 0
structural findings:     0
```

Gameplay distribution on accepted implementation head:

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   32
choice_grid               298 / 900 = 33.11%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Math choice_grid            46 / 100
Bahasa choice_grid          47 / 100
Logic choice_grid           47 / 100
Science choice_grid         56 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Global advisory hotspots: none. Subject advisory hotspots remain Coloring `coloring_canvas` 100%, Drawing `drawing_canvas` 100%, and Letters `symbol_hunt` 64%. These remain planning signals, not automatic redesign findings.

If merged unchanged, remaining distance is **18** patterns to minimum 50 and **28** to working target 60.

## Manual visual acceptance

All nine Take Away browser screenshots were manually reviewed and accepted:
- 320x720 — idle / wrong / success;
- 390x844 — idle / wrong / success;
- 768x1024 — idle / wrong / success.

Accepted observations:
- no horizontal overflow or required-content viewport clipping;
- starting group count and removed subset are visually distinct;
- removed objects are faded/crossed without erasing the original group context;
- result remains masked as `?` in idle and wrong states;
- wrong feedback is visible and does not reveal the numeric remainder;
- correct state reveals only the canonical remainder;
- success feedback and CTA remain visible;
- direct-choice targets remain usable across phone/tablet layouts;
- the 320px compact variant keeps the subtraction relationship, feedback and CTA inside the tested viewport.

## Closure gate

Pattern #32 is **not fully closed yet**. Remaining gates are:
1. canonical docs are updated to this accepted/unmerged state;
2. fresh full CI on the exact final docs head;
3. clean PR #143 mergeability/review-thread gate;
4. exact-head squash merge and independent `main` SHA verification;
5. post-merge `main` CI with Cloudflare production smoke;
6. separate docs-only closure PR with its own exact-head CI/merge/live verification.

No Pattern #33 family is pre-approved before Pattern #32 is fully closed.
