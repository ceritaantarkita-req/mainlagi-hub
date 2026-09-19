# WS-05 Phenomenon Relation Board Ecosystem Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACTIVE / VERIFICATION PENDING**

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

## Expected verified distribution

Only after CI acceptance:

```text
900 / 900 classified
0 unclassified
47 active gameplay patterns
choice_grid                    206 / 900
phenomenon_relation_board        8 / 900
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

## Remaining gates

1. implementation PR exact-head full CI;
2. manual review of all nine ecosystem screenshots with P0=0/P1=0;
3. verified distribution and deterministic activity quality;
4. exact-head merge;
5. merged-main CI + exact-SHA Cloudflare smoke;
6. post-merge closure docs/live verification.
