# WS-05 Pattern #38 Objective / Evidence Audit — 2026-09-17

Status: **AUDIT COMPLETE / `sentence_completion_slot` SELECTED FOR EXACT-SCOPE IMPLEMENTATION**

Base: `3751fb49c261a98eacd4080def0e18acdb8c578a`  
Production visual gate at base: **P0=0 / P1=0 / P2=3, live verified**  
Merged gameplay baseline: **37 patterns / 900 of 900 classified**

## Audit rule

Pattern #38 was not selected from pattern-count pressure. The audit first asked what evidence the learning objective requires, whether the current interaction exposes that evidence clearly, and whether an existing pattern already represents it adequately.

A candidate is rejected when the proposed interaction would only restyle the same one-of-three decision without making the learning relation more explicit.

## Selected exact family

English Wave D sentence completion:

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

Canonical boundary:

```text
subject: english
stage: english-phrases-review
lesson: english-sentence-completion
pack: english.pack.sentence-completion
skill: english.sentence.completion
runtime: tap_choice
assessment: unchanged assessed contract
choices: exactly three canonical choices per activity
correctChoice: unchanged
```

Canonical lesson objective: **“Melengkapi kalimat English pendek dengan kata yang tepat.”**

## Why the current representation is weak

The canonical content already contains one explicit blank in every target prompt, for example:

```text
Complete: The cat ___.
Complete: The bird ___.
Complete: I ___ a book.
Complete: I see two ___.
Complete: My ___ is here.
```

Generic `choice_grid` presents the three words as detached answer buttons. It records the correct lexical decision, but visually under-represents the objective because the child does not see the candidate word occupy the sentence position being assessed.

## Selected interaction: `sentence_completion_slot`

The new presentation must:
- keep the unchanged sentence context visible;
- render the canonical `___` position as one explicit slot;
- keep the same three canonical words as direct keyboard/touch/pointer buttons;
- place the selected word in that slot as immediate feedback;
- wrong selection remains measured and retryable and cannot complete;
- correct selection emits measured assessed evidence and completes the existing canonical activity;
- add no intermediate confirmation and no second assessed action.

This is materially different from a cosmetic card reskin because the visual structure externalizes the exact relation being assessed: **fixed sentence context + missing lexical item**.

## Why this is not Pattern #36 `sentence_order_cards`

Pattern #36 asks the child to choose an entire ordering of words that forms a sensible sentence. Its evidence is whole-sentence ordering.

Pattern #38 keeps word order fixed and asks for one missing lexical item. Its evidence is contextual lexical completion. Reusing sentence-order presentation would misrepresent the objective and imply an ordering decision that does not exist.

## Rejected candidates

### Bahasa open-syllable recognition — rejected

Reviewed family includes `bahasa-suku-ba`, `bahasa-suku-ma`, `bahasa-suku-sa`, `bahasa-suku-ka`, and `bahasa-suku-pa`.

Objective/evidence is direct written-form recognition among three visible syllables. A new shell would not add a real semantic action without inventing audio, construction, or another assessment step. Existing `choice_grid` already represents the evidence adequately.

### English alphabet recognition — rejected

Direct recognition of A/B/M/S among three written letter forms is already accurately represented by direct choice. A new pattern would be cosmetic.

### English vocabulary word/picture families — rejected

Animals, objects, body, family, food and actions already combine direct choice, `listen_and_choose`, and matching. Converting their remaining choice items to a new pattern would mostly duplicate existing word-picture/listening evidence.

### English category choice trio — rejected

The three category activities each ask which single word belongs to a named category. A true sorting interaction would require multiple items or multiple classifications and would alter the assessment contract. A one-item “bucket” presentation would be taxonomy inflation.

### Letters visual discrimination — rejected

The objective is choosing a target letter among visually similar forms. Direct choice already exposes exactly that evidence. `spot_difference`/scene-search would invent a scene or extra visual content not present canonically.

### Letters alphabet sequence — rejected

The reviewed `letters-order-*` family already has the exact-scoped `sequence_slot` / `missing_sequence_slot` presentation. It is not available as a new Pattern #38 family.

### Science Wave C direct concepts — rejected for this wave

Many remaining Earth/body/ecosystem/environment activities are direct conceptual selections. Existing coherent subfamilies already use `cause_effect`, `compare_properties`, `healthy_habit_routine`, matching, and other reviewed presentations where the objective warrants them. No stronger unrepresented Science family was identified in this audit.

## Evidence contract

Pattern #38 implementation must preserve:
- canonical activity ID and completion identity;
- `tap_choice` runtime;
- existing assessment mode;
- exact choices and `correctChoice`;
- retry/correct/incorrect accounting;
- canonical mastery/progression/readiness semantics;
- stage/lesson/pack/skill ownership;
- database/schema/migrations.

Assessed runtime fidelity target:

```text
choice_sentence_completion_slot_interaction
```

Metadata source target:

```text
sentence-completion-slot-runtime
```

Canonical answer metadata remains `selectedChoice`.

## Required implementation gates

Before Pattern #38 can be counted as active:
1. exact five-activity classifier/config regression;
2. fail-closed blank parsing;
3. unchanged choices/correctChoice/runtime/skill/assessment assertions;
4. wrong-answer no-false-completion browser assertion;
5. retry/incorrect/accuracy measured evidence assertion;
6. keyboard and pointer/touch completion paths;
7. 320x720, 390x844 and 768x1024 idle/wrong/success screenshots;
8. no horizontal overflow and readable slot/choices;
9. gameplay-distribution becomes 38 patterns and remains 900/900 classified;
10. deterministic activity-quality remains clean;
11. permanent 63-capture product visual gate remains green;
12. full PR CI, clean exact-head merge, independent `main` CI and exact Cloudflare smoke;
13. post-merge canonical docs closure.

Selection by this audit does **not** itself count Pattern #38 as implemented or merged.