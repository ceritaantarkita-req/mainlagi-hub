# SI-06C Matching / Order / Drag — Safe Checkpoint — 28 September 2026

Status: **ACTIVE / NOT MERGED**

## Resume point

Continue this exact SI-06C branch. Do not restart SI-06A/B1/B2. After SI-06C reaches merged/live-verified closure, **STOP before SI-06D** and return for product discussion/authorization.

```text
repository: ceritaantarkita-req/mainlagi-hub
verified production baseline: 9eff1bd861ceb3cd0202022fa43dfe31db87fb40
B2 docs closure: PR #377
branch: agent/si-06c-matching-order-drag-20260928
phase: SI-06C — matching / order / drag specialized renderers
after closure: STOP — SI-06D requires discussion
```

The production baseline `9eff1bd861ceb3cd0202022fa43dfe31db87fb40` passed merged-main CI #2186 / run `36394939086` with exact Production smoke (Cloudflare).

## Current ownership preflight

Current dispatcher truth still confirms the full five-owner SI-06C set:

```text
MemoryMatchActivity
DragTargetMatchActivity
SequenceSlotChoiceActivity
SortingBucketsChoiceActivity
GrowthStageTransitionActivity
```

No historical SI-00 owner was silently dropped.

Important current-state correction:

- `MemoryMatchActivity` already used `ActivityCompletion`, but its Again path still fell back to page reload. SI-06C normalizes it to local replay.
- the other four owners still owned local post-success navigation and are migrated here.
- `GrowthStageTransitionActivity` is a shared renderer used by Science-facing content too. It is migrated **once** in SI-06C. A later Science batch must not duplicate this renderer migration.

## Runtime boundary

SI-06C changes post-success presentation/replay ownership only.

Preserved for all five owners:

- dispatcher ownership and order;
- correctness and interaction mechanics;
- explicit `emitLearningRuntimeMeasurement`;
- existing evidence-fidelity metadata;
- renderer-owned `completeActivity(childId, activity.id)`;
- catalog/spec/schema;
- `LearningAttemptBridge`;
- progression/mastery/evidence architecture.

Canonical success flow:

```text
successful interaction
-> existing explicit runtime measurement
-> existing completeActivity
-> local completed state
-> ActivityCompletion
-> CanonicalCompletion
-> CanonicalShareDialog
```

## Owner-specific Again reset

### MemoryMatchActivity

```text
incorrectRef = 0
retryRef = 0
open = []
matched = []
locked = false
message = initial instruction
done = false
```

This replaces reload-based Again behavior.

### DragTargetMatchActivity

```text
pointerDragRef = null
incorrectRef = 0
retryRef = 0
selectedPair = null
draggingPair = null
hoverTarget = null
ghost = null
matched = []
feedback = idle
done = false
```

### SequenceSlotChoiceActivity

```text
incorrectRef = 0
retryRef = 0
placed = null
feedback = idle
```

### SortingBucketsChoiceActivity

```text
incorrectRef = 0
retryRef = 0
selected = null
placed = {}
feedback = idle
done = false
```

### GrowthStageTransitionActivity

```text
incorrectRef = 0
retryRef = 0
selected = null
feedback = idle
```

Again must not reload the document, write a second attempt, or duplicate evidence by itself.

## Evidence contracts preserved

```text
MemoryMatchActivity
  matching_memory_interaction

DragTargetMatchActivity
  matching_drag_target_interaction

SequenceSlotChoiceActivity
  choice_sequence_interaction

SortingBucketsChoiceActivity
  choice_sorting_interaction

GrowthStageTransitionActivity
  choice_growth_stage_transition_interaction
```

## Removed legacy presentation ownership

For DragTarget, SequenceSlot, SortingBuckets and GrowthStage:

- remove local `next/link` success navigation;
- remove local `.nextLink` CSS;
- canonical Completion owns Back / Again / Next / Share.

MemoryMatch already had no local CTA and is normalized only for canonical local Again semantics.

## QA

New static boundary gate:

```text
scripts/run-si06c-matching-order-drag-tests.mjs
npm run test:learning:si06c-matching-order-drag
```

Dedicated browser aggregation:

```text
npm run test:ui:si06c-matching-order-drag
```

Permanent browser suites for all five owners remain inside the canonical mobile-route matrix. They now verify canonical Completion and local Again replay without duplicate target attempts.

## Explicit non-scope

SI-06C does not change:

- SI-06D Math renderers;
- remaining Logic or Science renderers;
- Creative workspace;
- audio architecture;
- LearningAttemptBridge;
- database/schema;
- Bermain;
- World;
- Journey Map;
- Shop.

## Closure gates

SI-06C can be called closed only after:

1. latest-head PR CI full success;
2. runtime PR merged;
3. exact merged-main push CI full success;
4. exact Cloudflare production smoke success;
5. docs promoted to **CLOSED / MERGED / LIVE VERIFIED**.

After those five gates, **STOP**. Do not start SI-06D until the user explicitly authorizes it after discussion.
