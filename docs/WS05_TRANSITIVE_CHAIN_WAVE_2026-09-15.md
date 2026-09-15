# WS-05 Logic Transitive Chain Wave — 2026-09-15

Status: **COMPLETE / PR #127 + CLOSURE PR #128 MERGED**

Verified gameplay-closure SHA: `f0cec7c6cdede69d9dd94039ecd20f52d328d2ea`.

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
- no invented quantitative values, reordering requirement, drag-only dependency or altered answer set.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, choices and `correctChoice` remain unchanged;
- lesson remains `logic-transitive-comparison`;
- skill remains `logic.comparison.transitive.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity `choice_transitive_chain_interaction`.

## Final merged distribution

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid              332 / 900 = 36.89%
transitive_chain           5 / 900 = 0.56%
Logic choice_grid         62 / 100
Science choice_grid       60 / 100
```

Remaining distance: 25 patterns to minimum 50 and 35 to working target 60. Logic remains an advisory hotspot at 62%, so the next family requires a fresh audit rather than automatic promotion.

## Acceptance and closure history

### CI #569 — rejected: stale Rule Pipeline sentinel

The new exact Transitive Chain family passed its presentation regression, while the older Rule Pipeline regression correctly surfaced a stale `default` sentinel. Only that sentinel was replaced; Rule Pipeline exact-family protection remained active.

### CI #570 — rejected: 390 success CTA overflow

All non-browser gates passed, but Mobile Chromium correctly blocked the completed 390x844 state because its CTA was below the viewport. The phone completion state was compacted without shrinking touch targets or changing evidence.

### CI #572 — accepted implementation QA

Head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833`, run `34957824566`.

Passed Ubuntu, Windows, production build, dependency audit, secret scan and Mobile Chromium. Exact-family/static regressions passed, activity-quality remained 900 KEEP/0 flagged, distribution verified 25 patterns, all simulations had zero invariant errors, Batch17 totals stayed canonical, and manual screenshot review accepted 320/390/768 idle/try/success states.

### CI #577 — accepted PR #127 final docs-head QA

Head `beb2e793ad3dfeb7ebb2b41c0f085b11d910f948`, run `34961404909`.

All required jobs passed. Final gate: open, non-draft, mergeable, 0 comments, 0 submitted reviews, 0 review threads.

Exact-head squash merge PR #127 produced:
`c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`

Live `main` was verified at that exact SHA.

### CI #579 — accepted closure QA

Closure head `0d655a949b208e5e1b28207d2dec0da02f88ca4c`, run `34962248054`.

All required jobs passed again: Ubuntu, Windows, build, dependency audit, secret scan and Mobile Chromium; production smoke skipped as expected. Closure gate was clean: open, non-draft, mergeable, 0 comments, 0 submitted reviews, 0 review threads.

Exact-head squash merge closure PR #128 produced:
`f0cec7c6cdede69d9dd94039ecd20f52d328d2ea`

Live `main` was fetched and verified at exactly that SHA.

## Final state

Pattern #25 is fully closed. No gameplay PR is active. Canonical next action is a fresh Logic exact-family audit from the 25-pattern baseline, with no family pre-approved solely because Logic remains 62% `choice_grid`.
