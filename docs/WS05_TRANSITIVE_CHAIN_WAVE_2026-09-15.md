# WS-05 Logic Transitive Chain Wave — 2026-09-15

Status: **QA ACCEPTED / PR #127 UNMERGED**

Baseline: verified `main` @ `a961be0e61055f7347244b58b9dc252d5ed6f382` after Odd One Out closure PR #126.

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

## Accepted PR-head distribution

CI #572 verifies the implementation head distribution:

```text
900 / 900 classified
0 unclassified
25 active PR-head patterns
choice_grid              332 / 900 = 36.89%
transitive_chain           5 / 900 = 0.56%
Logic choice_grid         62 / 100
Science choice_grid       60 / 100
```

Merged `main` still has 24 patterns because PR #127 is open. If #127 merges unchanged, remaining distance becomes 25 patterns to minimum 50 and 35 to working target 60.

Logic remains above the permanent subject advisory hotspot threshold (>60%) at 62%, so this wave does not justify forcing a weaker family afterward. The next family must be freshly audited again after merge + closure.

## Acceptance history

### CI #569 — blocked by stale Rule Pipeline sentinel

The new exact Transitive Chain family itself passed the permanent gameplay-presentation regression as exactly five activities. CI then correctly stopped in the older dedicated Rule Pipeline regression because `logic-transitive-height-abc` was still named there as a permanent `default` / `choice_grid` exclusion sentinel.

That assertion became stale only because PR #127 intentionally promotes this exact transitive-comparison activity.

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

Mobile Chromium correctly blocked acceptance because the success CTA was not fully inside the 390x844 viewport. The failure occurred after progression, canonical choice rendering, keyboard wrong-state and correct completion had already passed.

Correct fix:
- keep the full three-node/two-premise chain visible during idle and retry states;
- on completed phone-sized state, hide the already-consumed premise chain together with the prompt card;
- keep the question, canonical three choices, success explanation and CTA visible;
- do not shrink touch targets, alter canonical choices, bypass the CTA assertion or change evidence/mastery semantics.

Responsive fix commit: `9ecadf8291ef5203d782732aee600e65ab01fc35`.

CI #570 remains regression history only and is not an acceptance run.

### CI #572 — accepted implementation QA

Accepted implementation head:

```text
46bcd677d2b3003f30b2e20bd21fe854c4f1f833
```

Workflow:

```text
Mainlagi TV V3 CI #572
run: 34957824566
```

All required jobs passed:
- Quality gate (Ubuntu) — success;
- Windows compatibility — success;
- Production build — success;
- Production dependency audit — success;
- Secret history scan — success;
- Mobile route QA (Chromium) — success;
- Production smoke — skipped as expected.

Exact evidence from Ubuntu:
- gameplay-presentation regression reports `5 transitive_chain` activities while all prior families remain intact;
- dedicated exact-family regression: `Transitive Chain regression passed for exact five-activity Logic Wave D family.`;
- activity-quality: **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural finding count 0 / flagged 0**;
- gameplay distribution: **900 activities / 25 patterns / `choice_grid` 332 / `transitive_chain` 5**;
- all five simulation runs report `invariantErrors: 0`;
- Batch17: **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

Exact browser evidence:
- canonical Logic Wave C readiness is used before the Wave D target;
- keyboard wrong-state passes;
- wrong answer cannot complete;
- pointer correct completion passes;
- two-premise chain layout passes;
- assessed evidence persists with fidelity `choice_transitive_chain_interaction`;
- controls meet touch sizing;
- no horizontal overflow;
- success CTA is fully visible at 320x720, 390x844 and 768x1024;
- browser summary: `Transitive-chain browser QA passed 3 viewports with canonical Logic Wave C progression, keyboard wrong-state, pointer completion, two-premise chain layout, CTA and assessed evidence checks.`

Manual screenshot review of #572 is accepted:
- 390 idle and retry preserve the full vertical three-node/two-premise chain with readable hierarchy;
- 390 success now removes the consumed chain and keeps question, canonical choices, success explanation and CTA fully visible;
- 320 success is unclipped and touch targets remain usable;
- 768 success intentionally preserves the full horizontal relation chain and keeps the CTA visible;
- no overlap/horizontal clipping was found;
- no additional polish commit is required from this review.

## Current gate state

Implementation QA is accepted, but PR #127 is **not merged**. Canonical-doc updates after `46bcd677...` change the branch SHA, so CI #572 cannot be reused as final merge acceptance for the resulting docs head.

Remaining required steps:
1. update the five canonical docs to this QA-accepted/unmerged state;
2. capture the resulting exact docs-head SHA;
3. run full Mainlagi CI on that exact head;
4. verify Ubuntu/Windows/build/dependency/secret/Mobile all green;
5. recheck PR comments, submitted reviews, review threads, state/draft/mergeability and exact head;
6. exact-head squash merge PR #127;
7. verify live `main` at the returned merge SHA;
8. create a docs-only Transitive Chain closure branch from verified live `main`;
9. rewrite canonical docs to 25 **merged** patterns / no active gameplay PR;
10. full closure-head CI + clean review gate + exact-head squash merge;
11. verify live `main` again;
12. start a fresh Logic exact-family audit only after closure.

Only after those steps may pattern #25 be described as shipped and fully closed.
