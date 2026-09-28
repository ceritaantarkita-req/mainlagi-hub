# SI-06D Math Specialized Renderers — Safe Checkpoint — 28 September 2026

Status: **ACTIVE — D1 choice/shared implementation; D2 trace blocked until D1 live verification**

## Resume point

Continue this exact SI-06D workstream. Do not restart SI-06A/B1/B2/C.

```text
repository: ceritaantarkita-req/mainlagi-hub
verified baseline main: 27a4e647b0819f532956eebe83c2668b6acfeb32
baseline CI: #2233 / run 36414788564 — FULL SUCCESS including exact Cloudflare smoke
active branch: agent/si-06d1-math-choice-20260928
phase: SI-06D1 — Math choice/shared renderers
next inside SI-06D: SI-06D2 — MathTraceWorldActivity
after SI-06D closure: STOP — SI-06E requires separate authorization
```

## Why SI-06D is split

Current preflight confirms the historical SI-00 Math owner list still exists, but replay/reset ownership is not homogeneous.

Nine owners are ordinary choice/shared renderers and can use the same local-reset boundary:

```text
CountAndSelectActivity
NumberLineActivity
MoreLessBalanceActivity
EqualGroupsActivity
MakeTotalActivity
TakeAwayActivity
ComparePropertiesActivity
VisualWordProblemActivity
SpatialRelationBoardActivity
```

`MathTraceWorldActivity` owns a different interaction model:

- stroke arrays;
- active pointer stroke;
- checkpoint index;
- trace start time;
- trace retry count;
- drawing/completed refs;
- trace validation before completion;
- audio/vibration feedback.

Therefore SI-06D is deliberately split:

```text
SI-06D1 — nine choice/shared owners
SI-06D2 — MathTraceWorldActivity only
```

D2 must not start until D1 is merged and exact production verification is green.

## SI-06D1 boundary

SI-06D1 changes post-success presentation/replay ownership only.

Preserved for all nine owners:

- current dispatcher ownership/order;
- correctness and retry mechanics;
- explicit `emitLearningRuntimeMeasurement`;
- current evidence-fidelity metadata;
- renderer-owned `completeActivity(childId, activity.id)`;
- learning catalog/spec/schema;
- `LearningAttemptBridge`;
- progression/mastery/evidence architecture.

Canonical flow:

```text
successful Math interaction
-> existing explicit runtime measurement
-> existing completeActivity
-> local success state
-> ActivityCompletion
-> CanonicalCompletion
-> CanonicalShareDialog
```

## SI-06D1 owner details

### CountAndSelectActivity

Evidence fidelity:

```text
choice_count_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### NumberLineActivity

Evidence fidelity:

```text
choice_number_line_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### MoreLessBalanceActivity

Evidence fidelity:

```text
choice_balance_comparison_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selectedSide = null
feedback = idle
```

### EqualGroupsActivity

Evidence fidelity:

```text
choice_equal_groups_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### MakeTotalActivity

Evidence fidelity:

```text
choice_make_total_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### TakeAwayActivity

TakeAway already rendered `ActivityCompletion` before SI-06D, but had no explicit local `onTryAgain`. SI-06D1 normalizes it instead of remigrating it.

Evidence fidelity:

```text
choice_take_away_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### ComparePropertiesActivity

This is a shared renderer. Math and Science data can both resolve through the same component.

Evidence fidelity:

```text
choice_compare_properties_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selectedTarget = null
feedback = idle
```

It is migrated **once here**. SI-06F must not duplicate this renderer migration.

### VisualWordProblemActivity

Evidence fidelity:

```text
choice_visual_word_problem_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

### SpatialRelationBoardActivity

This is a shared renderer. Math and Logic data can both resolve through it.

Evidence fidelity:

```text
choice_spatial_relation_interaction
```

Again reset:

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

It is migrated **once here**. SI-06E must not duplicate this renderer migration.

## QA

New static boundary:

```text
scripts/run-si06d1-math-choice-tests.mjs
npm run test:learning:si06d1-math-choice
```

Dedicated browser aggregate:

```text
npm run test:ui:si06d1-math-choice
```

Permanent browser suites for the nine owners are updated to require canonical Completion. The primary owner suites additionally prove:

- Again hides Completion;
- Again is local and does not reload the document;
- Again by itself does not create a second target attempt.

Existing Math reuse suites for NumberLine, mixed operation, CompareProperties and SpatialRelationBoard are also updated to expect canonical Completion rather than legacy local success navigation.

## Legacy presentation removed

SI-06D1 removes:

- local `next/link` success navigation from the eight owners that still had it;
- orphaned `.nextLink` CSS from all nine owners, including TakeAway.

## SI-06D2 boundary

Not started in D1.

D2 will migrate only:

```text
MathTraceWorldActivity
```

It must preserve:

- trace validation;
- stroke evidence;
- checkpoint progression;
- retry measurement;
- pointer/touch behavior;
- existing audio/vibration semantics;
- renderer-owned progress write.

D2 Again must reset the trace locally without page reload or duplicate attempt/evidence.

## Explicit non-scope

SI-06D does not change:

- Logic-only renderers;
- Science-only renderers;
- Creative workspace;
- Bermain;
- World stage adapter;
- Journey Map;
- Shop;
- database/schema.

Shared renderers migrated in D1 are not copied per subject.

## Closure policy

### D1 closure

Before D2 starts:

1. latest-head D1 PR CI full success;
2. D1 runtime PR merged;
3. exact merged-main CI full success;
4. exact Cloudflare production smoke success;
5. docs checkpoint updated with the verified D1 SHA.

### Final SI-06D closure

After D2:

1. latest-head D2 PR CI full success;
2. D2 runtime PR merged;
3. exact merged-main CI full success;
4. exact Cloudflare production smoke success;
5. canonical docs promoted to **CLOSED / MERGED / LIVE VERIFIED**.

After final SI-06D closure, **STOP**. Do not start SI-06E until the user explicitly authorizes it.
