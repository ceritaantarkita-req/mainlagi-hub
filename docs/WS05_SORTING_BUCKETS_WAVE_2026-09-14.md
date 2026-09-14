# WS-05 Sorting Buckets Wave — 2026-09-14

**PR:** #103  
**Branch:** `agent/ws05-gameplay-sorting-buckets-20260914`  
**Status:** QA — implementation/browser/visual accepted; docs-head CI and merge remain.

## Purpose

Turn a small, coherent Logic classification family from one-answer quiz presentation into a real classification interaction without changing canonical curriculum, progression, or assessed identity.

## Exact scope

Only these 5 basic Logic activities use `sorting_buckets`:

- `logic-classify-animal`
- `logic-classify-round`
- `logic-classify-up-arrow`
- `logic-classify-two-items`
- `logic-classify-red`

Classifier scope is guarded by the basic classification stage so later multi-attribute `logic-classify-*` activities remain unchanged.

## Child interaction

1. Three canonical choice cards are shown.
2. Child selects one card.
3. Child places it into `Sesuai aturan` or `Tidak sesuai`.
4. Wrong bucket does not consume the card and increments incorrect/retry.
5. Activity completes only after all three cards are correctly classified.

This is intentionally **not** Drag-to-Target. Pointer/touch and keyboard both use select-card -> select-bucket. A real drag mechanic will be a separate wave with fallback input.

## Preserved contract

Unchanged:
- runtime `tap_choice`;
- activity IDs;
- canonical `choices` and `correctChoice`;
- skill mapping and assessment;
- stage/progression requirements;
- stars and completion identity.

Explicit measured evidence:
- source: `sorting-buckets-runtime`;
- fidelity: `choice_sorting_interaction`;
- `sortedItemCount: 3`;
- correct/incorrect/retry and assessed accuracy are emitted before canonical completion.

Representative browser path intentionally performs one wrong placement before solving, proving retry/evidence behavior.

## QA

Implementation acceptance head: `97ae2e4d4b76e64865abb634216c5d8ce94dc8f8`  
CI: **#457 full success**.

Covered:
- Ubuntu typecheck/lint/engine/activity-quality/simulations/final acceptance;
- Windows compatibility;
- production build + build budgets;
- dependency audit;
- secret-history scan;
- Chromium responsive/browser QA;
- legitimate progression prerequisites;
- keyboard wrong-state + pointer completion;
- persistence and explicit attempt evidence;
- >=44px interactive controls;
- horizontal-overflow check;
- success CTA must remain inside viewport;
- screenshots at 320×720, 390×844, 768×1024.

Static presentation regression reports:

```text
12 memory_pair + 10 sequence_slot + 5 sorting_buckets activities
```

Activity-quality audit remains:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
```

## Issues found during QA

1. `@phosphor-icons/react` was accidentally removed while editing `package.json`; CI caught the missing module. Dependency was restored and the final package diff only adds the Sorting browser-QA script.
2. First 320×720 success state placed `Pilih permainan lain` below the viewport. Success-only narrow-screen layout was compacted; browser QA now blocks regressions.

Manual visual review accepted final idle/error/success screenshots at 320, 390 and 768.

## Remaining before merge

- canonical docs committed;
- full CI must pass again on the docs head;
- PR review threads/comments must be clean;
- squash merge using exact current head SHA.

## Next wave

`drag_to_target` on a new branch from latest merged `main`. It must implement real drag placement plus tap/select and keyboard fallback, and must use a family whose learning objective genuinely benefits from spatial placement.
