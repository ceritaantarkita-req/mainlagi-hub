# WS-05 Set Reasoning Reuse — Logic Multi-Attribute Wave — 18 September 2026

Status: **MERGED TO MAIN / MAIN CI + CLOUDFLARE VERIFICATION PENDING**

## Purpose

Generalize the existing `set_reasoning` child-facing interaction to exactly five audited Logic multi-attribute activities.

This work:
- does **not** create Pattern #48;
- does **not** increase active gameplay-pattern count;
- preserves canonical `tap_choice`, assessed `choice_accuracy_v1`, prompts, choice order/values, answers, skills, pack/lesson ownership, mastery and progression.

## Audit verification

```text
Reuse audit PR:            #206
Reuse audit head:          e620784d3d09398a5f5f815ada604a9991799a5a
Reuse audit PR CI:         #954 / run 35368506391 — full success
Reuse audit main:          5f5f7741ee40544c4ab395740ef00fea1880400b
Reuse audit merged-main CI:#955 / run 35369220787 — full success + exact Cloudflare production smoke
```

Audit-main #955 artifacts:

```text
mobile screenshots:       10558720255 / sha256:57647c364427fd5c5ba0fd5a3b83e57e03b4c07d70bfaac809075038d41d8059
gameplay distribution:    10557284821 / sha256:11b7441882219c27bafa8d3766c0c194ee051c0ac8d1a95581f72b5c4e6e906e
activity quality:          10557594459 / sha256:84a2e49b1866e8e851c8e751c0fe00c94d5b8f9a7642785b9972070294e6a25f
```

## Exact reuse scope

```text
logic-classify-red-round
logic-classify-blue-not-round
logic-classify-two-red-items
logic-classify-arrow-not-left
logic-classify-same-shape-different-color
```

Canonical ownership:
- subject: Logic
- stage: `logic-conditional-analogy-inference`
- lesson: `logic-multi-classification`
- pack: `logic.pack.multi-classification`
- skill: `logic.classification.multi_attribute`
- runtime: `tap_choice`
- assessment: assessed
- evidence: `choice_accuracy_v1`

## Existing Set Reasoning family that must remain behaviorally stable

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

## Implementation boundary

The config is generalized to ten exact IDs and made fail-closed on:
- subject;
- exact family stage;
- runtime;
- exact prompt;
- exact three choices in exact order;
- exact `correctChoice`;
- explicit two-rule config;
- exact choice-label coverage.

Child-facing copy is generalized from literal set-membership language to neutral two-rule wording:
- “Cari anggota” -> “Cari pilihan”;
- “dua aturan himpunan” -> “dua aturan”;
- “harus masuk” -> “harus cocok”;
- “harus di luar” -> “harus tidak cocok”;
- choice aria label -> “Pilih jawaban”.

Existing metadata remains compatible:
- `source: set-reasoning-runtime`;
- `evidenceFidelity: choice_set_reasoning_interaction`;
- `setRules`;
- `operationLabel`;
- `selectedMember`;
- `ruleCount: 2`.

## Expected verified distribution

No new gameplay pattern:

```text
activities:       900
classified:       900
active patterns:   47
choice_grid:      228
set_reasoning:     10
```

## Regression and browser QA

Required:
1. all ten exact Set Reasoning IDs classify correctly;
2. existing five Wave D configs stay exact and measured;
3. new five Wave C configs preserve canonical payload/skill ownership;
4. fail-closed prompt/order/answer/stage/runtime drift tests;
5. nearby Logic families stay outside Set Reasoning;
6. legacy Set Reasoning browser route remains green after neutral copy;
7. new representative `logic-classify-red-round`:
   - idle cannot complete;
   - wrong via keyboard increments incorrect/retry and stays retryable;
   - correct via pointer / actual touch completes;
   - assessed attempt after one wrong = accuracy 0.5;
   - 320x720, 390x844 actual touch, 768x1024;
   - idle/wrong/success screenshots at all three viewports;
   - no horizontal overflow;
   - feedback + CTA fully visible.
8. permanent visual product QA remains blocking.

## Accepted checkpoint

```text
Implementation PR:        #207
Initial head:             e6d04b4ee90a2085ca33fb16117947175cb3ccf5
CI #956:                  failed test-only visible-heading selector
Accepted checkpoint:      a7bb27bbbede42a5833144cab31af3c57ea3fa8a
Checkpoint CI:            #957 / run 35371679720 — full success
Manual visual review:     ACCEPTED / 9 screenshots / no P0-P1 blocker
Branch distribution:      47 active / choice_grid 228 / set_reasoning 10
```

CI #956 did not expose a product defect. The new browser harness used an accessibility-role selector that did not expose the visible prompt heading; the accepted fix changed only that test selector.

## Final PR and merge checkpoint

```text
Final PR head:             a37fdec7b3f89789999ce728c245ae17ee7f00bc
Final PR CI:               #963 / run 35372830249 — full success
Final visual review:       ACCEPTED / 9 screenshots / no P0-P1 blocker
Final branch distribution: 47 active / choice_grid 228 / set_reasoning 10
Implementation main:       9debb6cf30f789125c45eff1b88e65e4eaff7978
```

Final #963 artifacts:

```text
mobile screenshots:       10559925402 / sha256:c12ec617921229ca1317e02424369fb85947cd0e12a323e8feefc41c23c6ea73
gameplay distribution:    10559301397 / sha256:824b9b798721eceb534ccaf6e992806910634d28c88db25222b2d3a1baac5901
activity quality:          10559091529 / sha256:31e8501a622e36788413a53252a82ac042c6629ca007ff0b7b93625697769f50
```

PR #207 was mergeable, had no submitted reviews and no unresolved review threads at the exact final head, then squash-merged unchanged. Independent merged-main CI/Cloudflare proof is still required before this wave is called live verified.

Checkpoint artifacts:

```text
mobile screenshots:       10558694718 / sha256:7c3128db3edc178adab8b40520a7619ec449dad6d57b575390211d464430afb8
gameplay distribution:    10558204450 / sha256:6bc10f976c442e2f46a9ad2a0f75d60cce35c3ab5226751ed234a2c3dce31161
activity quality:          10558429104 / sha256:967006895beb95eb850e077b021308a4cc0018288b2115e106d4b2ce8d54d07a
```

## Remaining closure gate

- independent full CI for main `9debb6cf30f789125c45eff1b88e65e4eaff7978`;
- merged-main distribution 47 / `choice_grid` 228 / `set_reasoning` 10;
- exact Cloudflare production smoke for the same main SHA;
- post-merge closure docs promoted to fully closed and merged;
- closure-main CI verified before the next reuse/new-pattern implementation.
