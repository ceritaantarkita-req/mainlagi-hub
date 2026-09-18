# WS-05 Set Reasoning Reuse — Logic Multi-Attribute Wave — 18 September 2026

Status: **IMPLEMENTATION IN PROGRESS / NOT MERGED**

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

## Merge gate

- exact-head full CI;
- manual review of nine new reuse screenshots;
- clean mergeability/review/thread state;
- exact-head squash merge;
- merged-main distribution 47 / choice_grid 228 / set_reasoning 10;
- exact Cloudflare production smoke;
- post-merge docs closure before the next reuse/new-pattern implementation.
