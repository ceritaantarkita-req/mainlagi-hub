# Picture Word Match Reuse Audit — English Concrete Vocabulary — 19 September 2026

Status: **AUDIT COMPLETE / REUSE JUSTIFIED FOR EXACT 18 ENGLISH IDS / CODE NOT STARTED / RUNTIME BLOCKED ON PRIOR CLOSURE GATE**

## Purpose

Evaluate whether existing Pattern #35 `picture_word_match` can safely represent the remaining concrete English picture-to-word direct-choice vocabulary families without creating Pattern #48.

This is a docs-only, reuse-first audit. It authorizes no runtime change until the preceding ecosystem relation closure-main verification is independently evidenced.

## Audit base

```text
canonical main:                    fb74c17d3af62e8845e7e0f4a2b8ad5ceaf962d5
ecosystem closure docs PR:        #226 -> main fb74c17d
ecosystem closure exact-head CI:  #1035 / run 35444250203 — full success
ecosystem closure-main CI:        independent run evidence still pending
classified:                       900 / 900
unclassified:                       0
active gameplay patterns:          47
choice_grid:                       206 / 900
picture_word_match:                  5 / 900
Pattern #48:                       no justified new pattern
```

The prior Pattern #48 and Pattern #47 audits already identified English vocabulary picture/word work as a reuse/generalization candidate. This audit resolves the next exact scope against current source truth.

## Existing mechanic

Pattern #35 `picture_word_match` is fully closed for exactly five Bahasa activities:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

Its evidence shape is:
- one stable familiar visual clue;
- exactly three canonical word choices;
- learner selects the word represented by the visual;
- wrong answer stays retryable and cannot complete;
- correct answer completes through the existing assessed direct-choice path;
- metadata source remains `picture-word-match-runtime`;
- evidence fidelity remains `choice_picture_word_match_interaction`.

The current implementation is deliberately Bahasa-specific. English reuse therefore requires an exact-scope subject/locale generalization rather than broad prompt inference.

## Canonical English scope

### Wave B — Everyday Words

Canonical stage:

```text
english-everyday-words
```

#### Animals

```text
english-animal-dog
prompt:  Which word means 🐶?
choices: DOG / BIRD / FISH
correct: DOG
visual:  🐶
skill:   english.vocab.animals

english-animal-rabbit
prompt:  Choose the word for 🐰.
choices: RABBIT / DOG / BIRD
correct: RABBIT
visual:  🐰
skill:   english.vocab.animals

english-animal-fish
prompt:  Which word matches 🐟?
choices: BIRD / FISH / RABBIT
correct: FISH
visual:  🐟
skill:   english.vocab.animals
```

#### Everyday objects

```text
english-object-book
prompt:  Which word means 📘?
choices: BOOK / CHAIR / CUP
correct: BOOK
visual:  📘
skill:   english.vocab.objects

english-object-chair
prompt:  Choose the word for 🪑.
choices: BAG / CHAIR / BALL
correct: CHAIR
visual:  🪑
skill:   english.vocab.objects

english-object-cup
prompt:  Which word matches a cup?
choices: CUP / BOOK / BAG
correct: CUP
visual:  🥤
skill:   english.vocab.objects
```

#### Body vocabulary

```text
english-body-head
prompt:  Which word names this body part: head?
choices: HEAD / HAND / FOOT
correct: HEAD
visual:  🙂
skill:   english.vocab.body

english-body-hand
prompt:  Choose the word HAND.
choices: EYES / HAND / EARS
correct: HAND
visual:  ✋
skill:   english.vocab.body

english-body-foot
prompt:  Which word means foot?
choices: HEAD / FOOT / HAND
correct: FOOT
visual:  🦶
skill:   english.vocab.body
```

#### Family vocabulary

```text
english-family-mother
prompt:  Which word means mother?
choices: MOTHER / FATHER / BABY
correct: MOTHER
visual:  👩
skill:   english.vocab.family

english-family-father
prompt:  Choose the word FATHER.
choices: SISTER / FATHER / BROTHER
correct: FATHER
visual:  👨
skill:   english.vocab.family

english-family-baby
prompt:  Which family word is BABY?
choices: BABY / MOTHER / SISTER
correct: BABY
visual:  👶
skill:   english.vocab.family
```

### Wave C — Food, Actions & Categories

Canonical stage:

```text
english-words-actions
```

#### Food vocabulary

```text
english-food-apple
prompt:  Which word matches 🍎?
choices: APPLE / BREAD / RICE
correct: APPLE
visual:  🍎
skill:   english.vocab.food

english-food-banana
prompt:  Choose the word for 🍌.
choices: MILK / BANANA / APPLE
correct: BANANA
visual:  🍌
skill:   english.vocab.food

english-food-bread
prompt:  Which word means bread?
choices: RICE / BREAD / MILK
correct: BREAD
visual:  🍞
skill:   english.vocab.food
```

#### Action vocabulary

```text
english-action-run
prompt:  Which word means to run?
choices: RUN / READ / SLEEP
correct: RUN
visual:  🏃
skill:   english.vocab.actions

english-action-jump
prompt:  Choose the action JUMP.
choices: EAT / JUMP / READ
correct: JUMP
visual:  🤸
skill:   english.vocab.actions

english-action-read
prompt:  Which action is READ?
choices: SLEEP / RUN / READ
correct: READ
visual:  📖
skill:   english.vocab.actions
```

Total approved scope: **18 direct-choice activities**.

## Why reuse is justified

All eighteen activities share the same evidence contract:
1. the lesson objective is recognition of a concrete English word from a familiar referent or action;
2. the authored seed already contains a stable visual/emoji cue suitable as the primary stimulus;
3. each activity is an assessed `tap_choice` with exactly three canonical choices;
4. correctness is still the same one-choice recognition evidence;
5. Pattern #35 already expresses visual -> word mapping without requiring a new checkpoint;
6. no drag, spelling, typing, translation, narration score, speed score, or second assessed step is required.

The mechanic name remains appropriate: it maps a picture/visual referent to its word. Extending it across subjects does not create a new learning interaction.

## Explicit exclusions

The audit does **not** approve these nearby English families:

- Wave A alphabet recognition: letter identity should remain symbol/letter recognition.
- Wave A initial sound: phonics evidence is not generic picture-to-word mapping.
- Wave A colors and numbers: these have their own recognition/relation evidence.
- Wave B integrated review such as `english-review-word-book`: the prompt asks a category/property question ("thing you can read"), not direct visual lexical mapping.
- Wave C category direct choices: category membership is classification evidence.
- all `listen_and_choose` activities: listening is the evidence-bearing stimulus.
- all `matching` activities: matching has its own canonical evidence contract.
- Wave D opposites: relation/opposite evidence.
- Wave D simple phrases: existing `phrase_scene_match`.
- Wave D sentence completion: existing `cloze_sentence_choice`.
- mixed final review: heterogeneous evidence and must not be forced into one mechanic.

Iqro remains outside mechanic transformation until expert acceptance.

## Required fail-closed implementation

A later implementation must configure exactly the existing five Bahasa + these eighteen English IDs.

For every approved ID, validate exact:
- activity ID;
- subject;
- stage;
- runtime `tap_choice`;
- canonical prompt;
- canonical three-choice order;
- exact `correctChoice`;
- stable reviewed visual;
- locale/presentation variant.

No `id.startsWith("english-")`, prompt regex, emoji-only inference, skill-prefix inference, or generic "three uppercase words" classifier is approved.

Drift in prompt, choices/order, answer, subject, stage or runtime must fall closed to the canonical fallback rather than silently enter Pattern #35.

## Subject-aware presentation requirement

Current Pattern #35 child-facing copy is Indonesian and frame language is `id-ID`. English reuse must introduce explicit presentation variants while preserving the existing Bahasa experience.

Required variants:

```text
bahasa_word_picture
english_word_picture
```

Bahasa must preserve existing Indonesian copy and lowercase word behavior.

English must use reviewed English child-facing copy and appropriate language metadata, for example:
- heading: "Look at the picture, find the word";
- instruction: "Look carefully, then choose the word that matches.";
- retry and success feedback in English;
- English ARIA labels;
- frame language appropriate for English content.

This is presentation localization only. It must not change canonical activity content or correctness.

## Evidence contract

Must remain unchanged:
- canonical activity IDs;
- assessed status;
- `choice_accuracy_v1`;
- prompts;
- choices and exact order;
- `correctChoice`;
- skill/lesson/pack ownership;
- retry/incorrect/accuracy semantics;
- mastery/progression;
- schema/database state.

Runtime metadata must preserve:

```text
source: picture-word-match-runtime
evidenceFidelity: choice_picture_word_match_interaction
picture
word
selectedChoice
```

An additive `domainVariant` / locale field is allowed for auditability.

## Required regression and browser proof

Before runtime merge:
1. exactly 23 activities classify as `picture_word_match`: five legacy Bahasa + eighteen audited English;
2. every approved config fails closed on ID/subject/stage/runtime/prompt/choice-order/answer/visual drift;
3. all excluded English direct choices remain outside Pattern #35;
4. all five legacy Bahasa activities preserve current Indonesian copy, content and evidence;
5. all eighteen English activities preserve canonical content and use reviewed English copy;
6. wrong keyboard selection increments incorrect/retry and cannot complete;
7. correct pointer selection completes;
8. actual touchscreen completion is verified;
9. all three choices remain equivalent selectable controls before submission;
10. 320x720, 390x844 and 768x1024 representative English screenshots cover idle/wrong/success;
11. no horizontal overflow;
12. prompt, feedback and success CTA remain fully visible;
13. permanent visual QA remains P0=0/P1=0;
14. 900/900 classification remains complete;
15. activity quality remains KEEP 900.

## Distribution impact

Current merged runtime truth remains:

```text
47 active patterns
choice_grid             206 / 900
picture_word_match        5 / 900
```

If and only if this exact 18-ID reuse later passes every runtime gate:

```text
47 active patterns
choice_grid             188 / 900
picture_word_match       23 / 900
```

No new pattern is created. Pattern #48 remains unjustified.

## Non-scope

This audit does not approve:
- content rewrites;
- new activities;
- typing or spelling input;
- translation checkpoints;
- audio scoring;
- changes to `listen_and_choose`;
- changes to matching activities;
- mastery/progression changes;
- schema/database migration;
- Pattern #48;
- runtime implementation before the prior ecosystem closure-main verification is resolved.

## Decision

**Reuse existing Pattern #35 `picture_word_match` for exactly eighteen English concrete-vocabulary direct-choice activities is justified.**

The next runtime change, after prior closure gates are independently satisfied, should generalize Pattern #35 with exact 23-ID fail-closed configuration, explicit Bahasa/English presentation variants, dedicated regression/browser QA, exact-head CI, manual visual acceptance, exact merge, and merged-main production verification.
