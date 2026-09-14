# WS-05 Number Line Wave — 2026-09-14

## Status

**QA / PR #108.** Implementation, browser QA and manual visual review are accepted. Final docs-head CI and exact-head merge remain required.

Branch: `agent/ws05-gameplay-number-line-20260914`  
PR: #108  
Base `main`: `7c1a679c156c623a318cb9640880374eedc7e149`

## Purpose

Reduce repetitive Math `choice_grid` use with an interaction that directly represents relative number position.

## Exact scope

Pattern: `number_line`.

Exactly six Math Wave B ordering activities:

```text
math-order-next-1-2
math-order-next-3-4
math-order-before-6
math-order-between-6-8
math-order-descend-5
math-order-descend-10
```

Shared learning context:
- stage `math-banding-bentuk`;
- ordering lesson/objective;
- skill `math.number.ordering`;
- runtime `tap_choice`;
- three canonical numeric choices per activity.

Wave C `math-missing-*` is deliberately excluded and requires separate review.

## Interaction

- compact local number line with exactly five visible ticks;
- context numbers are highlighted as sequence clues;
- only the existing three canonical answer values are buttons;
- forward, backward and between tasks use explicit per-activity config;
- keyboard and pointer/touch use the same canonical choices;
- wrong answer remains retryable;
- correct answer emits runtime measurement before canonical completion.

## Preserved contracts

Unchanged:
- runtime `tap_choice`;
- activity IDs;
- choices and correctChoice;
- skill mapping;
- assessment mode;
- stars;
- stage progression;
- completion identity.

Assessed evidence fidelity:

```text
choice_number_line_interaction
```

Metadata contains:
- `lineDirection`;
- `lineMin`;
- `lineMax`;
- `contextValues`.

## Config boundary

`numberLineConfig.ts` contains explicit local-line context for all six IDs. Config is not inferred from prompt text.

Classifier returns `number_line` only when:
- subject is Math;
- stage is `math-banding-bentuk`;
- ID is in the exact six-ID allowlist;
- there are exactly three unique numeric choices;
- numeric correctChoice is one of those choices;
- prompt exists.

All other Math choice families keep their existing presentation.

## QA

Implementation head: `6b92ff922b6878d6ff1a88b1162f6adc9beee05f`  
CI: #489 — full green.

Representative browser activity: `math-order-between-6-8`.

Legitimate prerequisite fixture completes all required `math-jumlah-dasar` core activities and seeds qualifying evidence for:
- `math.numeral.recognition.0_10`;
- `math.count.4_10`;
- `math.quantity.matching`;
- `math.quantity.subitizing`.

Progression guard remains enabled.

Browser assertions:
- route does not redirect;
- exactly five ticks: 5, 6, 7, 8, 9;
- context values are 6 and 8;
- canonical choices are 5, 7, 9;
- keyboard wrong answer produces retry state;
- pointer correct answer completes;
- evidence fidelity is `choice_number_line_interaction`;
- metadata direction=`between`, min=5, max=9, context=[6,8];
- correctCount=1, incorrectCount=1, retryCount=1, accuracy=0.5;
- candidates remain >=44px;
- no horizontal overflow;
- success CTA remains fully visible;
- screenshots at 320x720, 390x844, 768x1024.

Manual visual review accepted idle/error/success at all three viewports. Context highlights are clear without obscuring answer candidates; CTA and decorative characters do not collide with controls.

Activity-quality audit remains:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
```

## Distribution delta

Merged baseline before PR #108:

```text
choice_grid 383 / 900 = 42.56%
Math choice_grid 73 / 100
active patterns 14
```

PR #108 implementation result:

```text
choice_grid 377 / 900 = 41.89%
number_line 6 / 900 = 0.67%
Math choice_grid 67 / 100
active patterns 15
```

Coverage stays 900/900 with 0 unclassified.

## Before merge

1. canonical docs current;
2. final docs-head CI fully green;
3. review threads/comments clean;
4. squash merge with exact current head SHA;
5. verify `main` after merge.

## Next

After #108 closes, review the exact six Wave B comparison activities for `more_less_balance`. Do not start that wave from this branch and do not include Wave C missing-number tasks without separate objective review.
