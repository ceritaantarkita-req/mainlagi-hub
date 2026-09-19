# WS-05 Phenomenon Relation Board Ecosystem Reuse Wave — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Prerequisite audit

```text
Audit PR:          #224
Audit main:        206219947985677576402cdad637bd312cb292c2
Audit PR CI:       #1023 / run 35440607592 — full success
Audit main CI:     #1024 / run 35440919895 — full success
Production smoke:  exact audit-main SHA PASS
```

Audit record: `PHENOMENON_RELATION_BOARD_ECOSYSTEM_REUSE_AUDIT_2026-09-19.md`.

## Exact implementation scope

```text
science-eco-plant-sun-water
science-eco-bee-flower
science-eco-bird-tree
science-eco-food-chain-change
```

All four remain:
- Science;
- stage `science-earth-body-environment`;
- lesson `science-ecosystem-dependencies`;
- pack `science.pack.ecosystem-dependencies`;
- skill `science.ecosystem.dependencies.basic`;
- assessed `tap_choice`;
- `choice_accuracy_v1`.

Explicit exclusion:

```text
science-match-ecosystem-needs-c -> matching / matching_accuracy_v1
```

Science force/motion remains outside this wave.

## Runtime design

Existing Pattern #46 `phenomenon_relation_board` is generalized with explicit domains:

```text
earth_sky
ecosystem_dependency
```

Legacy Earth/sky four-ID behavior and evidence metadata remain stable.

Ecosystem activities receive:
- ecosystem-specific badge/heading/status copy;
- explicit organism/resource/dependency relation labels;
- exact per-choice visuals;
- assessed metadata fidelity `choice_ecosystem_dependency_relation_interaction`;
- `domainVariant: ecosystem_dependency`.

The historical pattern ID remains `phenomenon_relation_board`.

## Exact fail-closed boundary

The family is exactly eight IDs: four legacy Earth/sky + four ecosystem reuse IDs.

Classification requires:
- exact ID;
- Science subject;
- `science-earth-body-environment` stage;
- `tap_choice` runtime;
- exact canonical prompt;
- exact canonical three-choice order;
- exact correct answer;
- complete explicit choice visuals.

No prompt parser or generic Science relation detector is introduced.

## Verification

Structural regression now checks:
- exact eight-ID family;
- domain and relation mode;
- pack/lesson/skill ownership;
- assessed evidence contract;
- choice visual order;
- prompt/choice/answer/subject/stage/runtime fail-closed mutations;
- Earth/sky matching exclusion;
- ecosystem matching exclusion;
- all four force/motion direct-choice activities remain `choice_grid`.

Dedicated browser QA route:

```text
/child/demo-gian/activity/science-eco-plant-sun-water
```

Viewports:
- 320x720 — actual Playwright touchscreen completion;
- 390x844 — pointer completion;
- 768x1024 — actual Playwright touchscreen completion.

It verifies ecosystem-only copy, keyboard wrong/retry, unresolved wrong state, touch targets, horizontal overflow, assessed evidence metadata, success CTA visibility, no page/console errors, and nine screenshots (idle/wrong/success × three viewports).

## Accepted checkpoint

```text
PR:                    #225
accepted head:         6cc75d7e649c88aee99079983e02895c794ed49d
accepted CI:           #1028 / run 35442529485 — full success
manual visual review:  ACCEPTED / 9 screenshots / P0=0 / P1=0
```

The initial #1025 screenshot review found one P1 at 320x720: retry feedback extended below the viewport. The fix is scoped to ecosystem retry at <=340px: the redundant cue is hidden during retry, and browser QA now asserts that retry feedback is fully visible. CI #1028 passed this blocking assertion.

Accepted artifacts:

```text
mobile-route-qa-screenshots
artifact: 10583984187
sha256:0a59bdf84b106fd37248f5ce240298f2362b04712a1cdd18e5c37406fd151c78

gameplay-distribution-audit
artifact: 10583604498
sha256:3467c7436c92c41733ef5fc723a9baa583fb254d7be7a00318e531e002a64f5f

activity-quality-audit
artifact: 10584073796
sha256:c9c7a42f48ecb2c2921f9f5a55c4744d444d899904c411f8c3aab01a65f6dfe5
```

## Accepted distribution and activity quality

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

Pattern #48 remains unimplemented.

## Non-scope

- no curriculum payload rewrite;
- no mastery/progression changes;
- no schema/database migration;
- no activity-count change;
- no matching absorption;
- no force/motion transformation;
- no new gameplay pattern.

## Final implementation verification

```text
final PR head:       b5c0e40feddf327448ac39d15943112615965410
final PR CI:         #1033 / run 35443011165 — full success
implementation main: 0dd89c5d81ab239ba76549bd9ae17102c7a90274
main CI:             #1034 / run 35443758101 — full success
production smoke:    exact implementation-main SHA PASS
```

Main artifacts:

```text
mobile-route-qa-screenshots 10584652011
sha256:7de76848e344549ea4ac94645a94fce1f90ff949b6791c79c2117f50f9e5fca7

gameplay-distribution-audit 10584886074
sha256:5680efa6ec9b45db6960fff96fb368e453baeb1a1ed5d3744473170c1909a8a9

activity-quality-audit 10584945996
sha256:06a7e2d5cd5b00df3b56faff8032b8c2723141c08056de249ec3ac142692f48b
```

## Closure verification

```text
closure docs PR:      #226
closure PR CI:        #1035 / run 35444250203 — full success
closure main:         fb74c17d3af62e8845e7e0f4a2b8ad5ceaf962d5
closure-main CI:      #1036 / run 35444579513 — full success
production smoke:     exact closure-main SHA PASS
```

Final record: `PHENOMENON_RELATION_BOARD_ECOSYSTEM_REUSE_FINAL_CLOSURE_VERIFICATION_2026-09-19.md`.

No ecosystem closure gate remains open.
