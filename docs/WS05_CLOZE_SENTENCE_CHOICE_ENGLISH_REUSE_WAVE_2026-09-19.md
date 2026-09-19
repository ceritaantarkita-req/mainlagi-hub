# WS-05 English Cloze Sentence Choice Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACTIVE / EXACT 5-ID ENGLISH REUSE / PATTERN COUNT STAYS 47**

## Verified base

```text
canonical main:              218c93dcda5fca28e02554ce8379f8f99b590e93
prior wave:                  Math measurement -> compare_properties FULLY CLOSED / LIVE VERIFIED
prior merged distribution:   47 active / choice_grid 219 / compare_properties 7
activity quality:            KEEP 900 / 0 flagged
English audit:               PR #211 -> main 76e1eeb0 / CI #975 live verified
Pattern #48:                 not created
```

Audit record: `CLOZE_SENTENCE_CHOICE_ENGLISH_REUSE_AUDIT_2026-09-19.md`.

## Exact implementation scope

Reuse existing Pattern #38 `cloze_sentence_choice` for exactly these five English activities:

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

The five legacy Bahasa activities remain in the same mechanic and must remain behaviorally stable:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

No new gameplay pattern is introduced.

## Canonical contract

English ownership remains:

```text
subject:       english
stage:         english-phrases-review
lesson:        english-sentence-completion
pack:          english.pack.sentence-completion
skill:         english.sentence.completion
runtime:       tap_choice
assessment:    assessed
evidence:      choice_accuracy_v1
```

Implementation must preserve exact prompt, exact three choices and order, exact `correctChoice`, retry/incorrect/accuracy semantics, required-for-stage flags, mastery/progression behavior, schema and database state.

Runtime evidence metadata remains:

```text
source: cloze-sentence-choice-runtime
evidenceFidelity: choice_cloze_sentence_interaction
selectedChoice
```

## Implementation

Branch:

```text
agent/english-cloze-reuse-20260919
```

Code changes in the active wave:

1. `clozeSentenceChoiceConfig.ts`
   - replaces the prior Bahasa-only loose gate with an exact canonical ten-ID definition table;
   - validates exact subject, stage, runtime, prompt, three choices in exact order and exact answer;
   - parses the single cloze slot only after exact identity validation;
   - exposes reviewed subject-aware presentation config.

2. `ClozeSentenceChoiceActivity.tsx`
   - keeps the same assessed interaction/evidence flow;
   - renders Bahasa with existing `id-ID` copy;
   - renders English with reviewed `en-US` heading, instructions, feedback, ARIA labels and success CTA;
   - exposes `data-cloze-locale` for deterministic QA.

3. `run-cloze-sentence-choice-tests.mjs`
   - expands exact regression from five to ten activities;
   - validates Bahasa + English canonical authoring, manifest ownership, skill/evidence contracts and locale;
   - verifies fail-closed subject/stage/runtime/prompt/order/answer drift;
   - keeps unrelated Bahasa/English activities outside the family.

4. `run-cloze-sentence-choice-english-reuse-browser-tests.mjs`
   - adds dedicated English 320x720 / 390x844 / 768x1024 QA;
   - verifies English locale/copy, exact sentence/choices, keyboard wrong/retry, pointer + actual-touch completion, evidence and no overflow;
   - writes nine dedicated idle/try/success screenshots.

5. Product gates
   - English browser QA is wired into `test:ui:mobile-routes`;
   - gameplay distribution sentinel advances to `cloze_sentence_choice=10` and `choice_grid=214`.

## Expected branch distribution

After the exact five English activities classify through existing Pattern #38:

```text
activities:                 900
classified:                 900
unclassified:                 0
active patterns:             47
choice_grid                 214
cloze_sentence_choice        10
spatial_relation_board       11
set_reasoning                10
compare_properties            7
```

The active pattern count remains 47.

## Non-scope

This wave does not add:
- Pattern #48;
- typing or free response;
- translation or narration as an extra assessed checkpoint;
- arbitrary blank-syntax classification;
- English vocabulary/category/opposite migration;
- content rewrites;
- mastery/progression changes;
- schema/database migrations;
- Science environment-care runtime work.

## Merge gate

Before merge:
1. exact-head typecheck/lint/learning tests/build;
2. exact ten-ID cloze regression green;
3. gameplay distribution 900/900 and exact 47/214/10 target green;
4. activity-quality KEEP 900 / 0 flagged;
5. legacy Bahasa browser QA green;
6. dedicated English browser QA green at 320/390/768;
7. nine English screenshots manually reviewed with P0=0 / P1=0;
8. PR exact-head CI full success.

After merge:
1. exact implementation SHA on `main`;
2. merged-main full CI success;
3. exact Cloudflare production smoke against that SHA;
4. post-merge closure docs;
5. only then start Science environment-care runtime reuse.
