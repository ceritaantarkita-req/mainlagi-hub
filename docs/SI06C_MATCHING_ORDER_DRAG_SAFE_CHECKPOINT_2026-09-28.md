# SI-06C Matching / Order / Drag — Safe Checkpoint — 28 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Resume point

SI-06C is closed / merged / live verified. Do not restart SI-06A/B1/B2/C. **STOP before SI-06D** and return for product discussion/authorization.

```text
repository: ceritaantarkita-req/mainlagi-hub
verified pre-C main: fdbd6a9a8b54b62a5fcc8f8431a875a1ae3e5b83
B2 docs closure: PR #377 / push CI #2229 — FULL SUCCESS including exact Cloudflare smoke
runtime PR: #379 — merged
final PR head: a0bac57263224917d10910f8da8c2e9559d6a1dd
PR CI: #2230 / run 36411290409 — FULL SUCCESS
merged main: 050557cacb19d24ba329233ba9d934cc19ef2d4b
merged-main CI: #2231 / run 36412450434 — FULL SUCCESS
phase: SI-06C — CLOSED / MERGED / LIVE VERIFIED
after closure: STOP — SI-06D requires discussion
```

The verified pre-C main `fdbd6a9a8b54b62a5fcc8f8431a875a1ae3e5b83` passed push CI #2229 including exact Production smoke (Cloudflare). SI-06C runtime PR #379 then passed latest-head CI #2230, squash-merged to `050557cacb19d24ba329233ba9d934cc19ef2d4b`, and merged-main CI #2231 / run `36412450434` completed full success including exact Production smoke (Cloudflare).

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

All five closure gates are satisfied:

1. latest-head PR CI #2230 — FULL SUCCESS;
2. runtime PR #379 — MERGED;
3. exact merged-main push CI #2231 — FULL SUCCESS;
4. exact Production smoke (Cloudflare) for `050557cacb19d24ba329233ba9d934cc19ef2d4b` — SUCCESS;
5. checkpoint promoted to **CLOSED / MERGED / LIVE VERIFIED**.

**STOP. Do not start SI-06D until the user explicitly authorizes it after discussion.**
