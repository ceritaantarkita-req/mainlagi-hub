# Cloze Sentence Choice Reuse Audit — English Sentence Completion — 19 September 2026

Status: **AUDIT COMPLETE / REUSE JUSTIFIED FOR EXACT 5 ENGLISH IDS / CODE NOT STARTED / IMPLEMENTATION BLOCKED BY PRIOR LIVE-CLOSURE GATES**

## Purpose

Evaluate whether the existing Pattern #38 `cloze_sentence_choice` can safely represent the five English sentence-completion activities without creating Pattern #48.

This audit is reuse-first and evidence-preserving. It does not authorize runtime work while earlier reuse/live-verification gates remain unresolved.

## Audit base

```text
canonical main:                    f9833568dea0f021cd5c4ed94f6f6fc7505ad8d8
active pattern count:              47
Pattern #48:                       no justified new pattern
Set Reasoning implementation:      main 9debb6cf / live closure pending
Math spatial audit:                PR #209 -> main 3e30a817 / PR CI #970 success / runtime not started
Math compare-properties audit:     PR #210 -> main f9833568 / PR CI #972 success / runtime not started
```

Independent push-to-main/Cloudflare verification for the recent reuse/audit chain is still not available through the current connector. That uncertainty remains explicit.

## Canonical English family

Lesson:

```text
id:        english-sentence-completion
title:     Complete simple sentences
objective: Melengkapi kalimat English pendek dengan kata yang tepat.
```

Pack:

```text
english.pack.sentence-completion
```

Skill:

```text
id:          english.sentence.completion
description: Melengkapi kalimat English pendek dengan kata yang sesuai konteks.
```

Canonical activity ownership:

```text
subject:     english
stage:       english-phrases-review
runtime:     tap_choice
assessment:  assessed
evidence:    choice_accuracy_v1
age:         5–7
```

## Exact reuse scope

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

### `english-complete-cat-sleeps`

```text
prompt:  Complete: The cat ___.
choices: SLEEPS / BOOK / YELLOW
correct: SLEEPS
```

### `english-complete-bird-flies`

```text
prompt:  Complete: The bird ___.
choices: FLIES / MILK / HAND
correct: FLIES
```

### `english-complete-i-read`

```text
prompt:  Complete: I ___ a book.
choices: READ / RED / RABBIT
correct: READ
```

### `english-complete-two-apples`

```text
prompt:  Complete: I see two ___.
choices: APPLES / FATHER / RUN
correct: APPLES
```

### `english-complete-mother-family`

```text
prompt:  Complete: My ___ is here.
choices: MOTHER / CHAIR / FISH
correct: MOTHER
```

All five contain exactly one visible cloze slot and exactly three canonical direct choices.

## Existing mechanic

Pattern #38 `cloze_sentence_choice` is fully closed/live verified for exactly five Bahasa context-completion activities:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

Current behavior:
- displays sentence prefix + visible blank + suffix;
- inserts learner selection into the blank;
- wrong answer is visibly retryable and cannot complete;
- correct answer completes through assessed direct-choice evidence;
- records `source: cloze-sentence-choice-runtime`;
- records `evidenceFidelity: choice_cloze_sentence_interaction`;
- has keyboard/pointer/touch and 320/390/768 QA.

The existing config is currently Bahasa-specific and recognizes its five IDs, subject/stage, three unique choices, correct-choice membership, and one parseable `___` slot.

## Reuse decision

**Reuse is justified for all five English activities.**

Why:
1. the canonical lesson/skill explicitly assess filling one missing word in a short sentence;
2. each activity has exactly one `___` cloze slot;
3. each remains a three-choice assessed `tap_choice` task;
4. existing Pattern #38 was built precisely for this evidence shape;
5. no drag, typing, free response, translation checkpoint, narration checkpoint, or second assessed step is required.

This is a subject/locale generalization of an existing mechanic, not a new gameplay pattern.

## Required subject-aware presentation

The current component is child-facing Bahasa:
- heading: “Lengkapi kalimat”;
- instruction: “Pilih kata yang membuat kalimat ini lengkap dan masuk akal.”;
- group label and feedback are Indonesian;
- frame language is `id-ID`.

English reuse must not present an English literacy task inside an Indonesian-only cloze shell unless that bilingual policy is explicitly intended elsewhere. The safe implementation boundary is subject-aware UI copy.

For English:
- frame language should be appropriate for English content, e.g. `en-US`;
- heading/instructions/feedback/ARIA labels should use reviewed English wording;
- the canonical activity prompt and answer tokens must remain unchanged.

For Bahasa:
- current `id-ID` copy and behavior must remain stable.

This localization is presentation-only and must not alter the answer/evidence contract.

## Required fail-closed generalization

A later implementation should tighten the full ten-ID family instead of merely adding English IDs to the current loose parser gate.

For every approved ID require:
- exact subject;
- exact stage;
- exact activity ID;
- runtime `tap_choice`;
- exact canonical prompt;
- exactly three canonical choices in exact canonical order;
- exact `correctChoice`;
- exactly one non-empty prefix + suffix around one `___`;
- exact locale/presentation config.

The parser may continue to derive prefix/suffix **after** exact identity validation. It must not classify arbitrary prompts by blank syntax.

No generic “any prompt containing ___” classifier is approved.

## Evidence contract

Must remain unchanged:
- canonical activity IDs;
- assessed status;
- `choice_accuracy_v1`;
- prompt;
- choices and order;
- `correctChoice`;
- retry/incorrect/accuracy semantics;
- skill ownership;
- lesson/pack ownership;
- progression/mastery;
- schema/database state.

Runtime metadata should preserve:

```text
source: cloze-sentence-choice-runtime
evidenceFidelity: choice_cloze_sentence_interaction
selectedChoice
```

Subject/locale metadata may be additive if needed, but must not redefine correctness.

## Required regression/browser proof

Before later runtime merge:
1. exactly five existing Bahasa + five audited English activities classify as `cloze_sentence_choice`;
2. all ten exact configs fail closed on subject/stage/prompt/order/answer/runtime drift;
3. unrelated Bahasa/English choices stay outside the family;
4. all five old Bahasa activities preserve canonical content/evidence and Indonesian child-facing behavior;
5. all five English activities preserve exact content/evidence and use reviewed English child-facing UI;
6. idle state cannot complete;
7. wrong keyboard selection binds visibly into the blank, increments incorrect/retry and cannot complete;
8. correct pointer/actual-touch selection completes through canonical assessed evidence;
9. all three choices remain equivalent selectable controls before submission;
10. 320x720, 390x844 and 768x1024 English representative screenshots cover idle/wrong/success;
11. no horizontal overflow;
12. sentence, feedback and success CTA remain fully visible;
13. permanent visual QA remains P0=0/P1=0;
14. gameplay distribution remains 900/900 classified;
15. deterministic activity-quality remains clean.

## Distribution impact

Current code truth before English reuse:

```text
47 active patterns
choice_grid              228 / 900
cloze_sentence_choice      5 / 900
set_reasoning              10 / 900
spatial_relation_board      6 / 900
compare_properties          3 / 900
```

If **only this five-ID English reuse** were later implemented and verified from the current code baseline:

```text
47 active patterns
choice_grid              223 / 900
cloze_sentence_choice     10 / 900
```

If the separately audited Math spatial five-ID and Math measurement four-ID reuse waves are both implemented first and all three later pass every gate, the combined expected counts become:

```text
47 active patterns
choice_grid              214 / 900
set_reasoning             10 / 900
spatial_relation_board    11 / 900
compare_properties         7 / 900
cloze_sentence_choice     10 / 900
```

These are future expected distributions only. This audit changes no runtime classification.

## Explicit non-scope

This audit does not approve:
- typing/free response;
- translation as an extra checkpoint;
- arbitrary English vocabulary/category/opposite choices;
- `listen_and_choose` activities;
- prompt-keyword or blank-only auto-classification;
- content rewrites;
- mastery/progression changes;
- schema/database migrations;
- Pattern #48;
- runtime work before prerequisite live/audit gates are resolved.

## Decision

**Reuse existing `cloze_sentence_choice` for exactly five English `english.sentence.completion` activities is justified.**

The objective, interaction and evidence contract already match Pattern #38. Required work is exact-scope subject/locale generalization and stronger fail-closed configuration, not a new gameplay taxonomy entry.

## Next gate

1. merge and verify this docs-only audit;
2. keep Set Reasoning, Math spatial and Math compare-properties live/audit verification debt explicit;
3. do not start English runtime reuse before the prerequisite chain is resolved;
4. when eligible, implement exact ten-ID config, subject-aware locale/copy, legacy Bahasa regressions and English browser/touch QA on a separate branch;
5. require exact-head CI, manual visual acceptance, exact merge, merged-main Cloudflare verification and post-merge docs closure.
