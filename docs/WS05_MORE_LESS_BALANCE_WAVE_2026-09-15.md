# WS-05 More/Less Balance Wave — 2026-09-15

## Purpose

Reduce repetitive Math `choice_grid` usage with an objective-appropriate comparison interaction while preserving canonical assessment and progression contracts.

Branch: `agent/ws05-gameplay-more-less-balance-20260915`  
PR: #109  
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

## Accepted implementation QA

Implementation head: `9c71560e37a5dace1c79abea56d4cda625eb27c0`  
CI: #496 — full green across Ubuntu, Windows, production build, dependency audit, secret-history scan, and Chromium mobile route QA.

Representative browser activity: `math-compare-equal-4-4`.

The fixture keeps the Wave B progression guard enabled and seeds legitimate `math-jumlah-dasar` required completion + qualifying evidence.

Browser checks accepted:
- route is not redirected;
- exactly three canonical left/equal/right controls;
- four apples vs four bananas remain visible for the representative equality task;
- keyboard wrong-state;
- pointer correct completion through the equal control;
- evidence fidelity and retry/accuracy persistence;
- touch targets >=44px;
- no horizontal overflow;
- success CTA fully visible;
- screenshots at 320x720, 390x844, and 768x1024.

Manual visual review accepted idle/error/success at all three viewports. Left/right quantities are readable, the center `Sama` control is clear, wrong-state feedback does not shift the layout, and the 320px success CTA remains fully visible.

Activity-quality audit remains:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
```

## Distribution delta

Merged PR #108 baseline:

```text
choice_grid       377 / 900 = 41.89%
Math choice_grid   67 / 100
active patterns    15
```

PR #109 implementation result:

```text
choice_grid          371 / 900 = 41.22%
more_less_balance      6 / 900 = 0.67%
Math choice_grid       61 / 100
active patterns        16
```

Coverage remains 900/900 with 0 unclassified.

## Remaining merge gates

1. final docs-head CI fully green;
2. review threads/comments clean;
3. squash merge with exact current head SHA;
4. verify `main` after merge.

## Next

After #109 merges, review the exact Wave B pattern-choice family for `pattern_completion`. Keep Wave C `math-missing-*` and `make_total` as separate family reviews rather than widening this wave.
