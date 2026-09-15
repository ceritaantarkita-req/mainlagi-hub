# WS-05 Logic Transitive Chain Wave — 2026-09-15

Status: **MERGED / POST-MERGE CLOSURE ACTIVE**

Verified merged baseline: `main` @ `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6` from PR #127.

## Audit decision

After Odd One Out closed, Logic remained the largest assessed `choice_grid` hotspot at 67/100. A fresh Wave B/C/D audit kept repeating-pattern, sequence, spatial, conditional, set, ordering, inference, composed-rule and transitive-comparison objectives separate.

The strongest exact family was `logic-transitive-comparison`: five assessed activities in one stage, one lesson and one canonical skill. Every item gives two ordered comparison premises and asks the child to infer an extreme or middle member from the full chain.

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

## Merged distribution

Verified after PR #127:

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid              332 / 900 = 36.89%
transitive_chain           5 / 900 = 0.56%
Logic choice_grid         62 / 100
Science choice_grid       60 / 100
```

Remaining distance is 25 patterns to minimum 50 and 35 to working target 60.

Logic remains above the permanent subject advisory hotspot threshold (>60%) at 62%, so the next family must still be freshly audited. No family is pre-approved from count alone.

## Acceptance history

### CI #569 — rejected: stale Rule Pipeline sentinel

The new exact Transitive Chain family itself passed the permanent gameplay-presentation regression as exactly five activities. CI correctly stopped because `logic-transitive-height-abc` was still named by the older Rule Pipeline regression as a permanent `default` / `choice_grid` sentinel.

Fix:
- replace only that stale sentinel with `logic-infer-not-red`;
- keep the exact five-ID Rule Pipeline classifier and all other exclusion assertions active.

CI #569 is regression history only.

### CI #570 — rejected: 390 success CTA overflow

Run `34957267576` at head `3584fa816fa40d0350956d37a8c505f0baee5219` passed every non-browser gate but Mobile Chromium correctly blocked acceptance because the success CTA was not fully inside the 390x844 viewport.

Fix:
- keep the full premise chain during idle/retry;
- hide the already-consumed prompt + chain only in completed phone-sized state;
- keep question, canonical choices, success explanation and CTA visible;
- do not shrink touch targets or alter evidence/mastery semantics.

Responsive fix commit: `9ecadf8291ef5203d782732aee600e65ab01fc35`.

CI #570 is regression history only.

### CI #572 — accepted implementation QA

Accepted implementation head:
`46bcd677d2b3003f30b2e20bd21fe854c4f1f833`

Run:
`34957824566`

All required jobs passed. Exact evidence included:
- gameplay-presentation regression reports exactly `5 transitive_chain` activities;
- dedicated exact-family regression passes;
- activity-quality **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution **900 activities / 25 patterns / choice_grid 332 / transitive_chain 5**;
- all five simulations `invariantErrors: 0`;
- Batch17 canonical totals unchanged;
- browser QA passed canonical Logic Wave C readiness, keyboard wrong-state, pointer completion, two-premise layout, assessed evidence, touch sizing, no horizontal overflow and CTA visibility at 320x720, 390x844 and 768x1024.

Manual screenshot review of #572 was accepted at all three viewports; no further polish commit was required.

### CI #577 — accepted final docs-head QA

Final canonical-docs head:
`beb2e793ad3dfeb7ebb2b41c0f085b11d910f948`

Run:
`34961404909`

All required jobs passed again:
- Ubuntu quality gate;
- Windows compatibility;
- production build;
- production dependency audit;
- secret-history scan;
- Mobile Chromium;
- production smoke skipped as expected.

Final pre-merge gate on PR #127:
- exact head `beb2e793ad3dfeb7ebb2b41c0f085b11d910f948`;
- state open;
- draft false;
- mergeable true;
- 0 PR comments;
- 0 submitted reviews;
- 0 review threads.

Exact-head squash merge produced:
`c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`

Live `main` was fetched and verified at exactly that SHA.

## Closure state

Pattern #25 is now merged in product code and canonical data. This branch performs the required docs-only post-merge closure so canonical docs no longer describe PR #127 as active/unmerged.

The closure itself must still pass:
1. full CI on the exact closure head;
2. clean PR comments/reviews/threads gate;
3. exact-head squash merge;
4. live `main` verification at the closure merge SHA.

Only after those closure steps is the wave fully closed. After closure, the next action is a fresh Logic exact-family audit from the verified 25-pattern baseline.
