# WS-05 Count-and-Select Wave — 2026-09-14

## Purpose

Reduce repetitive Math `choice_grid` usage with an objective-appropriate counting interaction while preserving canonical assessment/progression contracts.

Branch: `agent/ws05-gameplay-count-select-20260914`  
PR: #106  
Base `main`: `02d4696760d7b697cfd319804cd655c0d2bfec4c`

## Exact scope

Pattern: `count_and_select`.

Exactly 9 activities:

```text
math-count-2
math-count-3
math-count-4
math-count-5
math-count-6
math-count-7
math-count-8
math-count-9
math-count-10
```

Do not broaden by prefix without a new family review.

## Interaction

- visible canonical objects are the counting surface;
- child counts objects, then chooses one of the existing three numeric answers;
- wrong answer remains retryable and increments incorrect/retry;
- correct answer emits explicit runtime measurement before canonical completion;
- keyboard and touch/pointer use the same answer controls.

## Preserved contracts

Unchanged:
- runtime `tap_choice`;
- activity IDs;
- choices and correctChoice;
- skill mapping;
- assessment mode;
- stars;
- progression/stage requirements;
- completion identity.

Assessed evidence fidelity:

```text
choice_count_interaction
```

Metadata includes canonical numeric `countTarget`.

## Classifier boundary

`choiceGameplayPresentation(activity)` returns `count_select` only when:
- subject is Math;
- activity ID is one of the exact 9 reviewed IDs;
- runtime is `tap_choice`;
- there are exactly 3 unique numeric choices;
- correctChoice is numeric and present in choices;
- prompt exists.

All other choice activities retain their existing presentation.

## Audit correction

The PR #105 baseline classified `math-count-3` as `choice_grid`, even though it historically had a counting-specific renderer in `WorldExperience`. PR #106 makes the full reviewed 2–10 family explicit in the canonical child-facing classifier and route-level renderer.

The old `WorldExperience` special-case is bypassed by the route-level Count-and-Select dispatch. Removing that historical fallback can be handled as technical cleanup without changing the accepted child route.

## QA

Implementation head: `871677650ecc9e2e86618fb5f81b342b0b370c85`  
CI: #480 — full green.

Browser representative: `math-count-4`.

Legitimate prerequisite fixture:
- completes `math-pattern-touch` in previous `math-pola` stage;
- seeds qualifying `math.pattern.matching` evidence;
- progression guard remains enabled.

Browser assertions:
- route is not redirected;
- exactly four canonical stars render;
- canonical choices remain 3/4/5;
- keyboard wrong answer produces retry state;
- pointer correct answer completes;
- evidence fidelity is `choice_count_interaction`;
- correctCount=1, incorrectCount=1, retryCount=1, accuracy=0.5;
- `countTarget=4`;
- touch targets >=44px;
- no horizontal overflow;
- success CTA fully visible;
- screenshots at 320x720, 390x844, 768x1024.

Manual visual review accepted idle/error/success at all three viewports.

Activity-quality audit remains:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
```

## Distribution delta

PR #105 merged baseline:

```text
choice_grid 392 / 900 = 43.56%
Math choice_grid 82 / 100
active patterns 13
```

PR #106 implementation result:

```text
choice_grid 383 / 900 = 42.56%
count_and_select 9 / 900 = 1.00%
Math choice_grid 73 / 100
active patterns 14
```

Coverage stays 900/900 with 0 unclassified.

## Before merge

1. canonical docs updated;
2. final docs-head CI fully green;
3. review threads/comments clean;
4. squash merge with exact current head SHA;
5. verify `main` after merge.

## Next

Review exact Math families for the next objective-appropriate mechanic. Current candidates: `number_line`, `more_less_balance`, `pattern_completion`, then `make_total`. Do not mass-convert generic Math choice activities.
