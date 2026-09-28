# SI-06B2 Sentence/Reading Specialized — Safe Checkpoint — 28 September 2026

Status: **ACTIVE / NOT MERGED**

## Resume point

Continue this exact SI-06B2 branch. Do not restart SI-06B or SI-06B1, and do not start SI-06C until B2 is merged/live verified.

```text
repository: ceritaantarkita-req/mainlagi-hub
baseline main: 3b4c87729bad3bc49be264b13e39eb955f1d767e
branch: agent/si-06b2-sentence-reading-20260928
phase: SI-06B2 — sentence / reading specialized renderers
next after closure: SI-06C — matching/order/drag specialized renderers
```

Baseline `3b4c87729bad3bc49be264b13e39eb955f1d767e` is the verified SI-06B1 documentation checkpoint. Push-to-main CI #2090 / run `36389940509` completed full success including exact Production smoke (Cloudflare).

## Current ownership preflight

Current dispatcher truth confirms all five historical B2 owners remain production owners:

```text
PhraseSceneMatchActivity
PictureWordMatchActivity
SentenceOrderCardsActivity
ReadingPassageQuestionActivity
ClozeSentenceChoiceActivity
```

No owner was removed or replaced before mutation, so the bounded five-owner B2 scope remains exact.

## Migration boundary

For every B2 owner, SI-06B2 changes only post-success presentation.

Preserved:

- renderer-owned correctness and retry semantics;
- explicit `emitLearningRuntimeMeasurement`;
- existing evidence-fidelity metadata;
- renderer-owned `completeActivity(childId, activity.id)`;
- dispatcher order and route ownership;
- catalog/spec/schema;
- LearningAttemptBridge;
- subject/stage progression and mastery architecture.

Changed:

```text
correct answer
-> existing explicit runtime measurement
-> existing completeActivity
-> local feedback = good
-> ActivityCompletion
-> CanonicalCompletion
-> CanonicalShareDialog
```

Removed from the five owners:

- local success navigation ownership through `next/link`;
- local post-success “Pilih permainan lain” CTA.

## Again semantics

Each owner resets only its local interaction state:

```text
incorrectRef.current = 0
retryRef.current = 0
selected = null
feedback = idle
```

Again must not reload the page, rewrite evidence, or create a second attempt by itself.

## Evidence contracts preserved

```text
PhraseSceneMatchActivity
  choice_phrase_scene_interaction

PictureWordMatchActivity
  choice_picture_word_match_interaction

SentenceOrderCardsActivity
  choice_sentence_order_cards_interaction

ReadingPassageQuestionActivity
  choice_reading_passage_question_interaction

ClozeSentenceChoiceActivity
  choice_cloze_sentence_interaction
```

## QA

New static boundary gate:

```text
scripts/run-si06b2-sentence-reading-tests.mjs
npm run test:learning:si06b2-sentence-reading
```

The existing permanent browser suites for all five owners are updated to require `[data-activity-completion]` after success. They already run inside `test:ui:mobile-routes`, so PR CI exercises the real five-owner browser surface without introducing a duplicate browser harness.

The SI-06B1 static gate is intentionally made forward-compatible: it continues protecting B1 ownership without asserting that later SI batches must remain unmigrated forever.

## Explicit non-scope

SI-06B2 does not change:

- SI-06C+ specialized owners;
- audio architecture;
- LearningAttemptBridge;
- database/schema;
- Bermain;
- World;
- Journey Map;
- Shop;
- character system.

## Closure gates

SI-06B2 can be called closed only after:

1. latest-head PR CI is full success;
2. runtime PR is merged;
3. exact merged-main push CI is full success;
4. exact Cloudflare production smoke succeeds;
5. canonical docs are updated to **CLOSED / MERGED / LIVE VERIFIED**.

Until then, SI-06C is blocked.
