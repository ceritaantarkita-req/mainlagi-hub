# WS-05 More/Less Balance Wave — 2026-09-15

## Purpose

Reduce repetitive Math `choice_grid` usage with an objective-appropriate comparison interaction while preserving canonical assessment and progression contracts.

Branch: `agent/ws05-gameplay-more-less-balance-20260915`  
Base `main`: `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`

## Exact scope

Pattern: `more_less_balance`.

Exactly 6 reviewed Math Wave B comparison activities:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

Do not broaden by prefix without a new family review.

## Interaction contract

- child compares visible left/right quantities on a balance board;
- canonical three choices map explicitly to left / equal / right;
- beam stays neutral before completion so the UI does not reveal the answer;
- wrong answer increments incorrect/retry and does not complete;
- correct answer emits explicit runtime measurement before canonical completion;
- keyboard and touch/pointer use the same controls.

## Preserved contracts

Unchanged:
- runtime `tap_choice`;
- activity IDs;
- choices and correctChoice;
- skill `math.quantity.comparison`;
- assessment mode;
- stars;
- progression/stage requirements;
- completion identity.

Assessed evidence fidelity:

```text
choice_balance_comparison_interaction
```

Metadata includes comparison goal, left/right counts, and canonical correct side.

## QA plan

Representative browser activity: `math-compare-equal-4-4`.

The fixture keeps the Wave B progression guard enabled and seeds legitimate `math-jumlah-dasar` required completion + qualifying evidence, matching the accepted Number Line fixture.

Browser checks cover:
- route is not redirected;
- exactly three canonical left/equal/right controls;
- four apples vs four bananas remain visible for the representative equality task;
- keyboard wrong-state;
- pointer correct completion through the equal control;
- evidence persistence and retry/accuracy accounting;
- touch targets >=44px;
- no horizontal overflow;
- success CTA fully visible;
- screenshots at 320x720, 390x844, and 768x1024.

Canonical docs will be finalized only after implementation CI and manual screenshot review are accepted.
