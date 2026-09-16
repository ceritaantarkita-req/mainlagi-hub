# WS-05 Pattern #31 — Math Make Total

Date: **16 September 2026**  
Status: **IMPLEMENTATION / UNVERIFIED**  
Branch: `agent/ws05-math-make-total-20260916`  
Verified merged base: `53667560d72ca4cfe3556bc59411a71c53a84834`

## Why this family

Pattern #31 was selected from a fresh objective/evidence audit after Pattern #30 was fully closed. Distribution concentration is only an advisory planning signal.

The reviewed Math Wave C addition family is the strongest current fit because all five activities share one explicit objective: combine two small groups and determine the total within 10. A `make_total` board can externalize that composition step with two visible groups and a masked total while preserving the existing assessed three-choice evidence contract.

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

## QA gates

Pattern #31 is not accepted until all of the following are complete:
1. exact-family learning regression and permanent central default-family guard;
2. gameplay-distribution audit remains 900/900 classified and registers the new pattern intentionally;
3. production build/typecheck/lint/full engine suite;
4. Chromium browser QA at 320x720, 390x844 and 768x1024 for idle/wrong/success states;
5. manual review of all nine screenshots;
6. deterministic activity-quality audit remains clean;
7. canonical docs updated only after QA acceptance;
8. fresh exact docs-head CI, clean review-thread gate, exact-head merge and live-main verification;
9. separate docs-only closure PR with its own exact-head CI/merge/live verification.

No Pattern #32 family is pre-approved before Pattern #31 is fully closed.
