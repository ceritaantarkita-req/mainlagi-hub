# SI-06F Science Safe Checkpoint — 29 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This file is the canonical resume point for Shared Interaction SI-06F. Do not restart SI-06A/B1/B2/C/D/E/F from older handoffs.

## Verified baseline

```text
pre-F main:              3a478a6eec9e630ef565ab60e53e73f6e8aa8f2d
runtime PR:              #387 — merged
final PR head:           fb05b0bc60cda80a3ade6aa1aefe4a473cefced5
final PR CI:             #2259 / run 36456505562 — FULL SUCCESS
merged main:             2e0c7bbc4ce2bd12562137b63e40e4a2e94abb43
merged-main CI:          #2260 / run 36458102593 — FULL SUCCESS
Cloudflare smoke:        SUCCESS — exact merged main SHA verified
checkpoint:              docs/SI06F_SCIENCE_SAFE_CHECKPOINT_2026-09-29.md
```

Merged-main jobs were green for Windows compatibility, Secret history scan, Production build, Mobile route QA (Chromium), Quality gate (Ubuntu), Production dependency audit, and Production smoke (Cloudflare).

## SI-06F active owner set

```text
CauseEffectActivity
PhenomenonRelationBoardActivity
HealthyHabitRoutineActivity
MaterialLabActivity
FeatureFunctionLinkActivity
InvestigationBoardActivity
```

Shared renderers verified but intentionally not re-migrated:

```text
ComparePropertiesActivity
GrowthStageTransitionActivity
```

## Runtime boundary

- the six Science-owned renderers replace only local post-success navigation with canonical `ActivityCompletion` + Share;
- each migrated owner gets explicit local Again replay that resets renderer-local state without document reload;
- explicit runtime measurement, evidence fidelity, renderer-owned `completeActivity`, dispatcher ownership, progression/mastery semantics, and measurement-before-progress ordering remain unchanged;
- `PhenomenonRelationBoardActivity` preserves both `choice_phenomenon_relation_interaction` and ecosystem reuse `choice_ecosystem_dependency_relation_interaction`;
- `HealthyHabitRoutineActivity` preserves both `choice_healthy_habit_routine_interaction` and environment-care reuse `choice_environment_care_action_interaction`;
- `MaterialLabActivity` preserves its explicit select-then-test interaction before completion;
- local Again alone does not create a second target attempt;
- orphaned local `.nextLink` success CTA CSS is removed from the six migrated owners.

## Shared-renderer guards

`ComparePropertiesActivity` is not migrated again because SI-06D already migrated that shared Math/Science renderer once.

`GrowthStageTransitionActivity` is not migrated again because SI-06C already migrated that shared renderer once.

Later work must continue to migrate shared renderers once at the renderer owner, not copy subject-specific completion implementations.

## QA added/updated

```text
npm run test:learning:si06f-science
npm run test:ui:si06f-science
```

The static boundary covers the six Science owners plus the two previously migrated shared renderers. Browser coverage verifies canonical Completion, local Again without reload, no duplicate target attempt, and the existing ecosystem/environment reuse evidence variants.

## Explicit non-scope

SI-06F does not change:

- Creative workspace/coloring/drawing;
- Bermain;
- World stage adapter;
- Journey Map;
- Shop;
- database/schema.

## Resume authority

SI-06F is complete and live verified at `main@2e0c7bbc4ce2bd12562137b63e40e4a2e94abb43`.

**HARD STOP:** do not start SI-06G Creative workspace until the user explicitly authorizes it.
