# WS-05 Drag-to-Target Wave — 2026-09-14

**PR:** #104  
**Branch:** `agent/ws05-gameplay-drag-target-20260914`  
**Base:** `main` @ `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`  
**Status:** QA — implementation/browser/visual accepted; docs-head CI required before merge.

## Objective

Introduce a reusable `drag_to_target` child-facing mechanic only where spatial source-to-target placement matches the learning objective, while preserving canonical learning identity and evidence boundaries.

## Exact scope

Exactly five Science Wave A matching activities use the new `drag_targets` presentation:

- `science-match-living-nonliving`
- `science-match-plant-parts`
- `science-match-animal-homes-a`
- `science-match-senses-a`
- `science-match-weather-signs-a`

All are in stage `science-living-observation-basics`, runtime `matching`, and retain six canonical `matchItems` representing three pair ids.

## Preserved contracts

Unchanged:
- activity IDs;
- canonical runtime `matching`;
- `matchItems` labels and pair ids;
- skill mapping;
- assessed/practice status;
- stars;
- progression/stage rules;
- canonical completion identity.

Other matching activities remain on `memory_pairs` or `grid_pairs`; the classifier is intentionally guarded by exact IDs, Science subject, stage, six match items, and three pair ids.

## Interaction

The child sees three source cards and three target cards.

Supported input:
- native mouse drag/drop;
- touch/pen pointer drag with a visible drag ghost;
- tap/select source -> tap target fallback;
- keyboard Tab/Enter fallback through normal buttons.

Wrong placement does not consume either card. It increments incorrect/retry counters. A matched source and target are locked. Completion requires all three canonical pairs.

## Evidence

Before canonical `completeActivity`, the runtime emits explicit measurement:

- source: `drag-target-runtime`;
- evidence fidelity: `matching_drag_target_interaction` for assessed activities;
- `correctCount`: 3;
- `incorrectCount` and `retryCount`: observed interaction errors;
- `accuracy`/`score`: `3 / (3 + incorrectCount)`;
- `matchedPairCount`: 3;
- canonical input mode remains attached.

## Static regression

Implementation-head CI #465 reports:

```text
Gameplay presentation regression PASS: 12 memory_pair + 5 drag_targets + 10 sequence_slot + 5 sorting_buckets activities.
```

This locks the drag-target family to the five reviewed Science activities and keeps unreviewed matching on the visible grid.

## Browser QA

Representative route:

`/child/demo-gian/activity/science-match-animal-homes-a`

Viewports:
- 320×720
- 390×844
- 768×1024

The browser test seeds legitimate assessed Science foundation prerequisites rather than bypassing the progression guard.

Coverage:
- correct direct-route identity after hydration;
- three source and three target controls;
- >=44px controls and no horizontal overflow;
- keyboard wrong placement;
- real mouse drag for one pair;
- touch tap fallback for one pair;
- pointer/click fallback for final pair;
- canonical completion persistence;
- assessed evidence `matching_drag_target_interaction`;
- expected correct/incorrect/retry/accuracy values;
- success CTA fully inside viewport;
- no page/console errors;
- idle/error/success screenshots.

## Acceptance evidence

Implementation head: `722391fe049b3e055ab69e16140141bdf971268b`  
CI: **#465 full success** across Ubuntu, Windows, production build, production dependency audit, secret-history scan, and Chromium mobile route QA.

Activity-quality result:

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
flagged total: 0
```

Manual visual QA accepted idle/error/success screenshots at 320, 390 and 768. Source/target hierarchy is clear, states are readable, no horizontal clipping is present, and the narrow-phone success CTA remains visible.

## Remaining before merge

1. Run full CI on the final docs head.
2. Require all applicable jobs green.
3. Check PR review threads/comments.
4. Squash merge PR #104 using the exact current head SHA.
5. Verify `main` contains the merge.

After merge, the active merged gameplay-pattern count becomes **13**. The next implementation wave must start from latest `main` and remain separate from this PR.
