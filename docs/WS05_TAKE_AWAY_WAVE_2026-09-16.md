# WS-05 Pattern #32 — Math Take Away

Date: **16 September 2026**  
Status: **MERGED / LIVE VERIFIED / CLOSURE PENDING**  
Implementation PR: **#143**  
Implementation branch: `agent/ws05-math-take-away-20260916`  
Closure branch: `docs/close-take-away-20260916`  
Verified implementation merge SHA: `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`

## Why this family

Pattern #32 was selected from a fresh objective/evidence audit only after Pattern #31 was fully closed. Distribution concentration was used only as a planning signal.

The reviewed Math Wave C subtraction family is the strongest fit because all five activities share one explicit objective: take away part of a small group and determine the remainder within 10. `take_away` externalizes the removal action with one visible starting group, a reviewed subset visibly marked as removed, and a masked numeric remainder while preserving the existing assessed three-choice evidence contract.

Nearby candidates were not selected for this wave:
- Math addition already has the distinct `make_total` composition mechanic;
- Math grouping asks about equal groups rather than removal;
- Math missing-number activities remain sequence tasks;
- Bahasa picture-word activities risk a mostly cosmetic visual-choice restyle;
- English initial-sound activities were heterogeneous across direct-choice and matching activities.

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

## QA and implementation merge history

Accepted implementation code head:

```text
5b6e774b942b5024bbf5fc21beac63ea0caeb7a7
```

CI #671 / run `35047494614` passed on the first run across Ubuntu, Windows, production build, dependency/secret audits, complete engine/learning suite, deterministic activity-quality audit, gameplay-distribution audit, simulations, Batch17 and Chromium canonical mobile/accessibility/browser QA.

All nine Take Away screenshots were manually reviewed and accepted:
- 320x720 — idle / wrong / success;
- 390x844 — idle / wrong / success;
- 768x1024 — idle / wrong / success.

Final canonical implementation docs head:

```text
061b004188e827ff62bd1e5c48377a087f0f9144
```

That exact head passed full CI #676 / run `35048147580`. PR #143 then passed the exact-head clean gate with `mergeable=true`, zero comments, zero reviews and zero review threads, and squash merged as:

```text
3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a
```

`main` was independently verified at that exact SHA. Post-merge `main` CI #677 / run `35048981508` passed all primary jobs and **Cloudflare production smoke succeeded**.

## Verified merged audit evidence

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

Gameplay distribution:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    32
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

Remaining distance is **18** patterns to minimum 50 and **28** to working target 60.

## Closure gate

Implementation is merged and live-verified. Pattern #32 is **not fully closed yet**. Remaining gates are:
1. this separate docs-only closure PR contains only the five canonical docs;
2. fresh full CI on the exact final closure head;
3. clean closure PR mergeability/comments/reviews/review-thread gate;
4. exact-head squash merge and independent final `main` SHA verification;
5. final post-closure `main` CI with Cloudflare production smoke.

Only after all five closure gates succeed may Pattern #32 be marked **FULLY CLOSED** and a fresh objective/evidence audit for Pattern #33 begin. No Pattern #33 family is pre-approved.
