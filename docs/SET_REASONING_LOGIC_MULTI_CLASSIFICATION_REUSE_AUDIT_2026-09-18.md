# Set Reasoning Reuse Audit — Logic Multi-Attribute Classification — 18 September 2026

Status: **AUDIT COMPLETE / REUSE JUSTIFIED / CODE NOT STARTED**

## Verified base

```text
main:                          ae95f1c494351533e88463f7225d7d07440b708e
Pattern #48 audit PR:          #205
Pattern #48 audit-main CI:     #953 / run 35367422058 — full success + exact Cloudflare production smoke
activities:                    900
classified:                    900
active patterns:                47
choice_grid:                   233
set_reasoning:                   5
```

Audit-main #953 artifacts:

```text
mobile screenshots:       10556458700 / sha256:d43b17df2d2e9f51dae538caa3d05241249973320043584b0e728be6b4f9b8de
gameplay distribution:    10557376650 / sha256:5d7a4d3a49ace45710494596a0cf88c2c9a8832f467cddfb2e1d4ca8d2b2fb07
activity quality:          10557401593 / sha256:497daa5af8b3cb340b699870f85d27ba97069b2331f5aea439e533772256997f
```

## Goal

Reuse the existing `set_reasoning` mechanic for five Logic multi-attribute activities that are currently generic `choice_grid`.

This work **does not create Pattern #48** and **does not increase the active pattern count**.

Expected distribution only after a later verified implementation:

```text
active patterns:  47
choice_grid:      228
set_reasoning:     10
```

## Exact candidate scope

All five activities belong to:
- subject: `logic`
- stage: `logic-conditional-analogy-inference`
- lesson: `logic-multi-classification`
- pack: `logic.pack.multi-classification`
- skill: `logic.classification.multi_attribute`
- runtime: `tap_choice`
- assessment: assessed
- evidence: `choice_accuracy_v1`

| Activity | Prompt | Choices | Correct | Two-rule interpretation |
| --- | --- | --- | --- | --- |
| `logic-classify-red-round` | Mana yang sekaligus merah dan bulat? | `🔴`, `🟥`, `🔵` | `🔴` | merah = require; bulat = require |
| `logic-classify-blue-not-round` | Mana yang biru tetapi bukan bulat? | `🟦`, `🔵`, `🟥` | `🟦` | biru = require; bulat = exclude |
| `logic-classify-two-red-items` | Mana kelompok yang punya tepat dua benda merah? | `🔴🔴`, `🔴🔴🔴`, `🔵🔵` | `🔴🔴` | tepat dua benda = require; merah = require |
| `logic-classify-arrow-not-left` | Mana panah yang tidak mengarah ke kiri? | `→`, `←`, `↓` | `→` | panah = require; arah kiri = exclude |
| `logic-classify-same-shape-different-color` | Pasangan mana yang bentuknya sama tetapi warnanya berbeda? | `🔴 🔵`, `🔴 🟥`, `🟥 🔵` | `🔴 🔵` | bentuk sama = require; warna berbeda = require |

No prompt, choice order/value, `correctChoice`, runtime, assessment, skill, pack, lesson, mastery or progression contract may change.

## Why reuse is justified

Existing `set_reasoning` already implements the required evidence behavior:
- exactly two explicit rules;
- canonical three-choice selection;
- wrong choice increments incorrect/retry and cannot complete;
- correct choice completes with measured `choice_accuracy_v1`;
- accuracy remains `1 / (1 + incorrectCount)`;
- keyboard/pointer/touch interaction already exists.

The candidate lesson explicitly measures **multi-attribute classification**. Each candidate can be represented as two simultaneous constraints without adding a new answer or secondary assessed checkpoint.

## Required presentation generalization

Current child-facing Set Reasoning copy is overly specific to literal “himpunan” membership.

For reuse safety, implementation may generalize presentation wording for **all** `set_reasoning` activities:
- “anggota himpunan” -> neutral “pilihan” / “kandidat”;
- “harus masuk” -> “harus cocok”;
- “harus di luar” -> “harus tidak cocok”;
- board aria label -> “dua aturan” rather than “dua aturan himpunan”.

This is presentation wording only. Existing five Set Reasoning configs, answers, metadata, evidence and classification must remain unchanged.

Internal metadata may continue to use `membership: in|out` for backwards compatibility.

## Existing Set Reasoning scope that must remain unchanged

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

The existing family remains canonical `set_reasoning`.

## Fail-closed implementation requirements

1. Add only the exact five audited Wave C IDs.
2. Require Logic subject, exact stage and `tap_choice`.
3. Verify exact prompt.
4. Verify exact three canonical choices in exact order.
5. Verify exact `correctChoice`.
6. Verify explicit two-rule config and exact choice labels.
7. Preserve existing five Set Reasoning configs and classification.
8. Keep nearby Logic families outside `set_reasoning`:
   - elimination/inference;
   - relative ordering;
   - rule pipeline;
   - spatial transforms;
   - transitive chain;
   - basic sorting buckets.
9. No parser-based auto-classification.

## QA requirements

A later implementation must prove:
- old representative Set Reasoning activity still works;
- new representative `logic-classify-red-round` works;
- idle cannot complete;
- wrong remains retryable and records incorrect/retry;
- correct records assessed evidence;
- keyboard wrong path;
- pointer completion;
- actual touch completion;
- 320x720, 390x844 and 768x1024;
- idle/wrong/success screenshots for the new representative;
- no horizontal clipping;
- feedback + CTA fully visible;
- permanent visual QA remains blocking.

## Audit result

**Reuse is justified. No new Pattern #48 is created.**

Approved next step after this docs-only audit merges and its merged-main CI/Cloudflare gate passes: exact-scope implementation of the five IDs above through the existing `set_reasoning` mechanic.

Runtime code has **not** started on this audit branch.
