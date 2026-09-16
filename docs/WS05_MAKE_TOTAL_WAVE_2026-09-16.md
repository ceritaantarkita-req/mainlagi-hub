# WS-05 Pattern #31 — Math Make Total

Date: **16 September 2026**  
Status: **QA ACCEPTED / UNMERGED**  
Implementation PR: **#141**  
Branch: `agent/ws05-math-make-total-20260916`  
Verified merged base: `53667560d72ca4cfe3556bc59411a71c53a84834`

## Why this family

Pattern #31 was selected from a fresh objective/evidence audit after Pattern #30 was fully closed. Distribution concentration was used only as a planning signal.

The reviewed Math Wave C addition family is the strongest fit because all five activities share one explicit objective: combine two small groups and determine the total within 10. `make_total` externalizes that composition step with two visible groups and a masked total while preserving the existing assessed three-choice evidence contract.

Nearby candidates were not selected for this wave:
- Math subtraction has a different semantic action (remove/take away) and stays outside this mechanic;
- Math grouping asks how many equal groups exist and stays outside scope;
- Math missing-number activities are sequence tasks, not addition composition;
- Bahasa picture-word and English initial-sound families were reviewed but would currently risk a mostly cosmetic choice-grid restyle rather than a materially distinct interaction.

## Exact scope

```text
math-add-1-1
math-add-2-1
math-add-2-2
math-add-3-2
math-add-4-3
```

Canonical family boundaries:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-addition`;
- pack `math.pack.addition`;
- skill `math.operation.addition.within_10`;
- runtime remains `tap_choice`;
- assessment remains assessed;
- exactly three canonical numeric choices and unchanged `correctChoice`.

Explicit exclusions:
- all `math-sub-*` subtraction activities;
- grouping and grouping-matching activities;
- missing-number activities;
- length/size activities;
- existing count/select, number-line, comparison and pattern mechanics;
- all Bahasa, English, Logic and Science families.

## Interaction and evidence contract

Pattern: `make_total`.

The activity board shows two reviewed canonical addend groups and a masked result slot.

Before a correct assessment:
- both non-empty addend groups remain visible;
- result stays `?`;
- canonical three numeric choices remain available via keyboard/touch/pointer;
- a wrong choice records incorrect/retry evidence;
- wrong choice cannot complete and cannot reveal the total.

After the canonical correct choice:
- the existing activity completes;
- result slot may reveal the canonical total;
- no extra confirmation or intermediate assessment is introduced.

Config validation requires:
- exact reviewed activity ID;
- three unique canonical numeric choices;
- canonical `correctChoice` remains one of those choices;
- both addends are positive;
- addends sum exactly to canonical `correctChoice`;
- total remains within 10.

Runtime measurement:
- source `make-total-runtime`;
- assessed fidelity `choice_make_total_interaction`;
- records left/right group counts and selected canonical choice;
- canonical mastery, stars, progression and activity identity remain unchanged.

## QA history

Initial implementation CI #656 / run `35042089820` passed Ubuntu, Windows, production build, deterministic quality/distribution and all non-browser gates, but the Chromium matrix correctly failed the new Make Total assertion at 320x720 because the idle feedback extended below the viewport.

The fix did not weaken the assertion. It compacted only the <=340px / <=760px presentation: less vertical spacing, a shorter board/result, hidden secondary prompt copy, and smaller but still >=48px canonical choice targets.

Accepted implementation head:

```text
4b513676c9029fbb7a788a49175ed02954f0d2f7
```

Full CI #657 / run `35042439233` passed:
- Ubuntu quality gate;
- Windows compatibility;
- production build and build budgets;
- production dependency audit;
- secret-history scan;
- complete engine/learning suite including central and dedicated Make Total regressions;
- deterministic activity-quality audit;
- gameplay-distribution audit;
- simulations;
- Batch17 final acceptance contracts;
- Chromium canonical mobile/accessibility/browser matrix including Make Total responsive QA.

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

Gameplay distribution on accepted PR head:

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   31
choice_grid               303 / 900 = 33.67%
make_total                  5 / 900 = 0.56%
Math choice_grid            51 / 100
Bahasa choice_grid          47 / 100
Logic choice_grid           47 / 100
Science choice_grid         56 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

If merged unchanged, remaining distance is **19** patterns to minimum 50 and **29** to working target 60.

## Manual visual acceptance

All nine Make Total browser screenshots were manually reviewed and accepted:
- 320x720 — idle / wrong / success;
- 390x844 — idle / wrong / success;
- 768x1024 — idle / wrong / success.

Accepted observations:
- no horizontal overflow or viewport clipping;
- both addend groups remain readable and visually separate;
- total remains masked as `?` in idle and wrong states;
- wrong feedback is visible and does not reveal the total;
- correct state reveals only the canonical total;
- success feedback and CTA are fully visible;
- direct-choice targets remain usable across phone/tablet layouts;
- the 320px compact variant retains the learning relationship while fitting all required feedback in the viewport.

## Closure gate

Pattern #31 is **not fully closed yet**. Remaining gates are:
1. canonical docs are updated to this accepted/unmerged state;
2. fresh full CI on the exact final docs head;
3. clean PR #141 mergeability/review-thread gate;
4. exact-head squash merge and independent `main` SHA verification;
5. post-merge `main` CI with Cloudflare production smoke;
6. separate docs-only closure PR with its own exact-head CI/merge/live verification.

No Pattern #32 family is pre-approved before Pattern #31 is fully closed.
