# Set Reasoning Reuse Implementation Acceptance — Logic Multi-Attribute — 18 September 2026

Status: **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Exact reuse scope

```text
logic-classify-red-round
logic-classify-blue-not-round
logic-classify-two-red-items
logic-classify-arrow-not-left
logic-classify-same-shape-different-color
```

Existing Set Reasoning scope remains covered:

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

## Audit verification

```text
Reuse audit PR:            #206
Reuse audit head:          e620784d3d09398a5f5f815ada604a9991799a5a
Reuse audit PR CI:         #954 / run 35368506391 — full success
Reuse audit main:          5f5f7741ee40544c4ab395740ef00fea1880400b
Reuse audit merged-main CI:#955 / run 35369220787 — full success + exact Cloudflare production smoke
```

## Implementation checkpoint

```text
Implementation PR:        #207
Initial head:             e6d04b4ee90a2085ca33fb16117947175cb3ccf5
Initial CI:               #956 / run 35371212668
Accepted checkpoint:      a7bb27bbbede42a5833144cab31af3c57ea3fa8a
Checkpoint CI:            #957 / run 35371679720 — full success
```

CI #956 found a **test-only selector issue** in the new reuse browser harness. The component rendered correctly and the Set Reasoning scene was ready, but `getByRole("heading")` did not expose the prompt heading in that harness. The accepted fix changed only the QA selector to exact visible text. Runtime behavior, config, classification, evidence and layout were unchanged.

## Verified config/classification contract

All ten Set Reasoning activities now require:
- subject `logic`;
- `tap_choice`;
- exact audited stage;
- exact prompt;
- exact three choices in exact order;
- exact `correctChoice`;
- explicit two-rule config;
- exact choice-label coverage.

The new five remain:
- stage: `logic-conditional-analogy-inference`;
- skill: `logic.classification.multi_attribute`;
- assessment: assessed;
- evidence: `choice_accuracy_v1`.

The existing five Wave D Set Reasoning activities remain:
- stage: `logic-mixed-reasoning-challenge`;
- skill: `logic.set.relation.basic`;
- pattern: `set_reasoning`.

No parser-based auto-classification was added.

## Child-facing wording generalization

Set Reasoning wording is now neutral enough for both set membership and multi-attribute classification:
- “Cari pilihan yang cocok”;
- “Baca dua aturan”;
- “harus cocok” / “harus tidak cocok”;
- “Pilih jawaban”.

Internal metadata remains backwards-compatible:
- `source: set-reasoning-runtime`;
- `evidenceFidelity: choice_set_reasoning_interaction`;
- `setRules`;
- `operationLabel`;
- `selectedMember`;
- `ruleCount: 2`.

## Interaction/evidence verification

Dedicated new-family browser QA verifies:
- idle state cannot complete;
- exact canonical choice order is preserved;
- wrong keyboard selection increments incorrect/retry and cannot complete;
- all choices remain retryable after wrong;
- correct pointer / actual-touch selection completes;
- one wrong then correct records:
  - correctCount = 1;
  - incorrectCount = 1;
  - retryCount = 1;
  - accuracy = 0.5;
- metadata source/fidelity/rules/operation/selectedMember stay exact.

Legacy Set Reasoning browser QA also remains green after the neutral wording change.

## Visual acceptance

Nine dedicated new-family screenshots were manually reviewed:

```text
320x720:  idle / wrong / success
390x844:  idle / wrong / success
768x1024: idle / wrong / success
```

Result: **ACCEPTED / no P0 or P1 blocker**.

Observed:
- two-rule structure is legible;
- target card is readable;
- equal canonical choices remain visible;
- wrong selection is clear without disabling retry;
- success state remains compact and understandable;
- CTA is fully visible;
- no horizontal clipping/overflow;
- 390 path uses actual touch;
- 320 compact layout remains usable.

## CI #957 artifacts

```text
mobile screenshots:
  id:      10558694718
  digest:  sha256:7c3128db3edc178adab8b40520a7619ec449dad6d57b575390211d464430afb8

gameplay distribution:
  id:      10558204450
  digest:  sha256:6bc10f976c442e2f46a9ad2a0f75d60cce35c3ab5226751ed234a2c3dce31161

activity quality:
  id:      10558429104
  digest:  sha256:967006895beb95eb850e077b021308a4cc0018288b2115e106d4b2ce8d54d07a
```

## Verified branch distribution

```text
activities:       900
classified:       900
unclassified:       0
active patterns:   47
choice_grid:      228
set_reasoning:     10
global hotspots:    0
```

This is reuse of an existing pattern. Pattern #48 remains unimplemented.

## Remaining gates

1. synchronize canonical docs to checkpoint-verified state;
2. run full CI on the final docs-inclusive PR #207 head;
3. require clean exact-head mergeability/review/thread state;
4. squash-merge only the unchanged green exact head;
5. independently verify merged-main 47 / 228 / 10 + exact Cloudflare production smoke;
6. create post-merge reuse closure docs before the next implementation.
