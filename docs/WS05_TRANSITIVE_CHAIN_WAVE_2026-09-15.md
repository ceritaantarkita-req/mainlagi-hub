# WS-05 Logic Transitive Chain Wave — 2026-09-15

Status: **IMPLEMENTATION IN PROGRESS / PR #127 UNMERGED**

Baseline: `main` @ `a961be0e61055f7347244b58b9dc252d5ed6f382` (Odd One Out closure PR #126).

## Audit decision

After Odd One Out closed, Logic remained the largest assessed `choice_grid` hotspot at 67/100. A fresh Wave B/C/D audit kept repeating-pattern, sequence, spatial, conditional, set, ordering, inference, composed-rule and transitive-comparison objectives separate.

The strongest next exact family is `logic-transitive-comparison`: five assessed activities in one stage, one lesson and one canonical skill. Every item gives two ordered comparison premises and asks the child to infer an extreme or middle member from the full chain.

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

Canonical skill:

```text
logic.comparison.transitive.basic
```

Explicit exclusions include composed rules, set reasoning, spatial transforms, Wave C inference/ordering and Wave B comparison/spatial families.

## Pattern #25

Pattern: `transitive_chain`.

Interaction contract:
- present the two canonical premises as one visible three-node relation chain;
- label the connectors `Premis 1` and `Premis 2` so the child must use both relations;
- preserve the canonical three answer choices as accessible direct-selection buttons;
- wrong choice increments assessed error/retry evidence and cannot complete;
- correct choice completes the canonical activity identity;
- success may explain the reviewed relation chain after completion;
- no invented quantitative values, reordering requirement, drag-only dependency or altered answer set.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, choices and `correctChoice` remain unchanged;
- lesson remains `logic-transitive-comparison`;
- skill remains `logic.comparison.transitive.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_transitive_chain_interaction`.

## PR-head distribution

CI #570 verified the exact implementation distribution:

```text
900 / 900 classified
0 unclassified
25 active patterns
choice_grid              332 / 900 = 36.89%
transitive_chain           5 / 900 = 0.56%
Logic choice_grid         62 / 100
Science choice_grid       60 / 100
```

Logic remains above the permanent subject advisory hotspot threshold (>60%) at 62%, so this wave does not justify forcing a weaker family afterward. The next family must be freshly audited again.

## Acceptance history

### CI #569 — blocked by stale Rule Pipeline sentinel

The new exact Transitive Chain family itself passed the permanent gameplay-presentation regression as exactly five activities. CI then correctly stopped in the older dedicated Rule Pipeline regression because `logic-transitive-height-abc` was still named there as a permanent `default` / `choice_grid` exclusion sentinel.

That assertion became stale only because PR #127 intentionally promotes this exact transitive-comparison activity. Product runtime, TypeScript, lint, production build, dependency audit and secret-history scan were otherwise healthy before the engine gate stopped the run.

Correct fix:
- replace only the stale Rule Pipeline exclusion sentinel `logic-transitive-height-abc` with `logic-infer-not-red`, which remains outside Rule Pipeline and must stay canonical `default` / `choice_grid`;
- keep the exact five-ID Rule Pipeline classifier and all other exclusion assertions active;
- do not weaken or bypass either Rule Pipeline or Transitive Chain scope coverage.

CI #569 is regression history only and is not an acceptance run.

### CI #570 — non-browser gates green; mobile success-layout regression found

Run `34957267576` at head `3584fa816fa40d0350956d37a8c505f0baee5219` proved the stale-sentinel repair was correct:
- Ubuntu quality gate passed typecheck, lint, full engine tests, deterministic activity-quality audit, gameplay-distribution audit, simulations and Batch17;
- Windows compatibility passed;
- production build and budgets passed;
- dependency audit and secret-history scan passed;
- gameplay-distribution artifact verified 25 patterns, `choice_grid` 332/900, `transitive_chain` 5/900, Logic 62/100 and Science 60/100.

Mobile Chromium correctly blocked acceptance at the dedicated Transitive Chain representative because the success CTA was not fully inside the 390x844 viewport. The failure occurred after progression, canonical choice rendering, keyboard wrong-state and correct completion had already passed. Screenshot evidence showed the idle/try layout was readable and the issue was vertical height in the completed mobile state, not horizontal overflow, progression or assessed evidence.

Correct fix:
- keep the full three-node/two-premise chain visible during idle and retry states;
- on completed phone-sized state, hide the already-consumed premise chain together with the prompt card;
- keep the question, canonical three choices, success explanation and CTA visible;
- do not shrink touch targets, alter canonical choices, bypass the CTA assertion or change evidence/mastery semantics.

Responsive fix commit: `9ecadf8291ef5203d782732aee600e65ab01fc35`.

CI #570 remains regression history only and is not an acceptance run.

## Required acceptance

Before shipping:
1. exact five-ID static family regression;
2. gameplay-presentation/default-family regression;
3. canonical Wave C prerequisite progression into Wave D;
4. keyboard wrong-state and pointer correct completion;
5. assessed attempt evidence with `choice_transitive_chain_interaction`;
6. 320x720, 390x844 and 768x1024 responsive QA, >=44px controls, no horizontal overflow and visible success CTA;
7. manual screenshot review;
8. deterministic activity-quality + gameplay-distribution audits;
9. full Ubuntu/Windows/build/dependency/secret/Mobile CI;
10. canonical docs finalization on the accepted PR head;
11. final docs-head CI + clean review/comment/thread gate;
12. exact-head merge + live-main verification;
13. docs-only post-merge closure + full closure CI + exact-head closure merge.

Only after all acceptance steps may pattern #25 be described as shipped.
