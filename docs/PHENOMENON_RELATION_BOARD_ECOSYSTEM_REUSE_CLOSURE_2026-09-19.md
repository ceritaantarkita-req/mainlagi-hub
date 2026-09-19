# Phenomenon Relation Board Ecosystem Reuse Closure — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope closed

Exactly four Science ecosystem-dependency direct-choice activities now reuse existing Pattern #46 `phenomenon_relation_board`:

```text
science-eco-plant-sun-water
science-eco-bee-flower
science-eco-bird-tree
science-eco-food-chain-change
```

Canonical matching remains excluded:

```text
science-match-ecosystem-needs-c
runtime: matching
evidence: matching_accuracy_v1
```

All four force/motion direct-choice activities remain `choice_grid`.

## Audit prerequisite

```text
Audit PR:            #224
Audit head:          3551ca8e1c2a973396801df9ebad0a7777889723
Audit PR CI:         #1023 / run 35440607592 — full success
Audit main:          206219947985677576402cdad637bd312cb292c2
Audit-main CI:       #1024 / run 35440919895 — full success
Production smoke:    exact audit-main SHA PASS
```

Audit result: reuse existing `phenomenon_relation_board`; Pattern #48 not justified.

## Implementation verification

```text
Implementation PR:        #225
Accepted checkpoint:      6cc75d7e649c88aee99079983e02895c794ed49d
Accepted CI:              #1028 / run 35442529485 — full success
Final PR head:            b5c0e40feddf327448ac39d15943112615965410
Final exact-head CI:      #1033 / run 35443011165 — full success
Implementation main:      0dd89c5d81ab239ba76549bd9ae17102c7a90274
Merged-main CI:           #1034 / run 35443758101 — full success
Cloudflare production:    exact implementation-main SHA PASS
```

Production smoke explicitly verified:

```text
release.sha:        0dd89c5d81ab239ba76549bd9ae17102c7a90274
release.branch:     main
siteUrl:            https://mainlagihub.my.id
dataBackend:        supabase
result:             PASS
```

## Runtime behavior

Pattern #46 now has explicit domain variants:

```text
earth_sky
ecosystem_dependency
```

The historical pattern identifier remains `phenomenon_relation_board`.

Legacy Earth/sky activities preserve their existing copy/evidence behavior.

Ecosystem activities use:
- ecosystem-specific badge/heading/status copy;
- organism/resource/dependency relation labels;
- explicit per-choice visuals;
- `source: phenomenon-relation-board-runtime`;
- `evidenceFidelity: choice_ecosystem_dependency_relation_interaction`;
- `domainVariant: ecosystem_dependency`;
- relation mode, selected choice, observation label and relation label metadata.

The evidence contract remains one assessed direct-choice checkpoint.

## Fail-closed family

The generalized family is exactly eight direct-choice activities:
- four legacy Earth/sky;
- four ecosystem dependency.

Classification rejects drift in:
- activity ID;
- subject;
- stage;
- runtime;
- prompt;
- three-choice order;
- correct answer;
- required visuals.

No prompt-shape classifier or broad Science relation inference was introduced.

## Responsive QA and visual acceptance

Dedicated representative route:

```text
/child/demo-gian/activity/science-eco-plant-sun-water
```

Verified:
- 320x720 actual touchscreen completion;
- 390x844 pointer completion;
- 768x1024 actual touchscreen completion;
- keyboard wrong-answer/retry;
- wrong answer does not complete or reveal the target;
- minimum touch targets;
- no horizontal overflow;
- assessed evidence metadata;
- visible success CTA;
- no page/console errors.

Initial CI #1025 screenshot review found one P1 at 320x720: retry feedback extended below the viewport.

That P1 was fixed before acceptance:
- ecosystem retry at <=340px hides the redundant cue;
- browser QA now blocks unless retry feedback is fully visible.

Final nine-shot review from accepted head `6cc75d7e...`:

```text
P0 = 0
P1 = 0
idle / retry / success x 320 / 390 / 768 = ACCEPTED
```

## Merged-main evidence

```text
900 / 900 classified
0 unclassified
47 active gameplay patterns
choice_grid                    206 / 900
phenomenon_relation_board        8 / 900
KEEP                           900
POLISH                           0
REDESIGN                         0
REPLACE                          0
```

Implementation-main #1034 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10584652011
sha256:7de76848e344549ea4ac94645a94fce1f90ff949b6791c79c2117f50f9e5fca7

gameplay-distribution-audit
artifact: 10584886074
sha256:5680efa6ec9b45db6960fff96fb368e453baeb1a1ed5d3744473170c1909a8a9

activity-quality-audit
artifact: 10584945996
sha256:06a7e2d5cd5b00df3b56faff8032b8c2723141c08056de249ec3ac142692f48b
```

## Product decision

No new Pattern #48 is created.

The active pattern count remains 47. The current target of 50 is not permission to invent mechanics.

Science force/motion remains unapproved as one relation-board family because push, pull, gravity and friction do not share one sufficiently precise evidence presentation.

No later runtime wave is pre-approved. The next WS-05 runtime change must start from another fresh objective/evidence audit.

## Final closure verification

Post-merge closure docs completed the final gate:

```text
Closure docs PR:         #226
Exact PR head:           6f649c73ad2eaca265f313284e9eea41fefc709f
PR CI:                   #1035 / run 35444250203 — full success
Closure main:            fb74c17d3af62e8845e7e0f4a2b8ad5ceaf962d5
Closure-main CI:         #1036 / run 35444579513 — full success
Cloudflare smoke:        exact closure-main SHA PASS
```

Final verification record: `PHENOMENON_RELATION_BOARD_ECOSYSTEM_REUSE_FINAL_CLOSURE_VERIFICATION_2026-09-19.md`.

This reuse wave is **FULLY CLOSED / LIVE VERIFIED**.
