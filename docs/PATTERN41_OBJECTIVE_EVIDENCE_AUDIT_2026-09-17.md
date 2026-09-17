# Pattern #41 Objective / Evidence Audit — 17 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`  
Latest fully closed gameplay at audit start: **Pattern #40 — `spatial_relation_board`**  
Merged distribution at audit start: **900/900 classified / 40 active patterns / `choice_grid` 261/900**.

## Audit rule

Pattern #41 is not selected by pattern-count pressure. The valid outcome of this audit included **“no justified candidate”**.

A candidate is accepted only when:

- the canonical learning objective is materially under-represented by the current interaction;
- the proposed presentation is semantically distinct from an implemented pattern;
- canonical activity identity, answer payload, assessment, mastery and progression can remain unchanged;
- exact deterministic representation is possible without heuristic prompt parsing;
- the scope is small, coherent and fail closed.

## Candidate review

### English sentence completion

The five `english-complete-*` activities should reuse the already implemented `cloze_sentence_choice` family if/when that reuse is separately approved. Reuse is not a new Pattern #41.

### English single-word vocabulary

Many animal/food/everyday vocabulary activities already ask the learner to map one familiar picture/emoji to one word. These overlap strongly with existing picture/word presentation families. A new pattern solely for English vocabulary would be taxonomy duplication.

### English opposites

The `english-opposite-*` choice activities have relational content, but the same lesson already includes explicit opposite-pair matching activities. The canonical evidence is already represented directly elsewhere in the same lesson, so this audit does not justify a new gameplay family for the choice subset.

### Bahasa punctuation / capitalization

The `bahasa-tanda-*` / `bahasa-kapital-*` family still directly measures recognition of correctly written sentences. A more decorative proofreading treatment would not materially change the evidence being measured, so it remains rejected as a new gameplay pattern.

### Science life cycles

The `science-cycle-*` family remains heterogeneous: one activity asks for a full ordered sequence while others ask for earlier-stage, adult-form, or young-plant-stage recognition. A single strict presentation contract still requires activity-specific semantic branching broad enough to risk becoming a content-specific wrapper rather than one reusable evidence pattern. This audit does not approve it.

### English simple phrases

The four assessed direct-choice activities in `english-simple-phrases` form the clearest remaining objective-to-presentation gap.

The canonical objective is to **understand very short English phrases by literal meaning**. The activities intentionally combine multiple semantic features:

- color + noun;
- quantity + noun;
- size + noun;
- color + noun again with phrase-form distractors.

Generic `choice_grid` records the selected answer but does not consistently expose the compositional meaning of the phrase. Some choices are emoji scenes, while others are text phrases. A deterministic scene representation can make the learner compare the phrase against visible attributes rather than only scan answer text.

## Selected candidate

Working pattern name:

```text
phrase_scene_match
```

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

The `english-listen-phrase-blue-book` activity is explicitly excluded because its canonical runtime is listening, not `tap_choice`.

Canonical ownership:

```text
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

## Canonical objective and skill

Lesson title:

```text
Simple phrases
```

Lesson objective:

> Memahami frasa English sangat pendek berdasarkan makna literal.

Mapped skill:

```text
english.phrase.literal
```

Skill description:

> Memahami makna literal frasa English pendek.

Exact canonical choice tasks:

```text
english-phrase-red-ball
  prompt: Which picture matches A RED BALL?
  choices: 🔴⚽ | 🔵⚽ | 🔴📘
  correct: 🔴⚽

english-phrase-two-books
  prompt: Which choice shows TWO BOOKS?
  choices: 📘 | 📘📘 | 📘📘📘
  correct: 📘📘

english-phrase-small-cat
  prompt: Which phrase means a small cat?
  choices: A SMALL CAT | A BIG DOG | TWO CATS
  correct: A SMALL CAT

english-phrase-yellow-banana
  prompt: Which phrase matches 🍌?
  choices: A GREEN APPLE | A YELLOW BANANA | A RED BALL
  correct: A YELLOW BANANA
```

## Why the current representation is weak

The current generic choice grid preserves valid final-answer evidence, but the lesson objective is compositional language understanding: adjective/quantity + noun.

The four activities currently mix answer representation styles:

- emoji scene choices for red ball;
- repeated-object quantity choices for two books;
- phrase-only choices for small cat;
- phrase-only choices for yellow banana.

This makes the interaction visually inconsistent and can let the learner solve some tasks as text scanning rather than comparing literal phrase meaning.

A `phrase_scene_match` presentation can materially improve objective fidelity by showing a stable visual scene for each canonical choice while preserving the unchanged answer labels and answer payload.

The learner still answers the exact same question. The scene is a representation of the canonical choice, not an invented extra checkpoint.

## Why this is not an existing pattern

Relevant existing patterns are semantically different:

- `choice_grid` — generic direct choice;
- `picture_word_match` — maps a single familiar object picture to a single word;
- `cloze_sentence_choice` — fills a missing word inside a sentence;
- `visible_matching` / `memory_pair` — pairs multiple items;
- `count_and_select` — counts a represented set to choose a number;
- `more_less_balance` — compares quantities;
- `spatial_relation_board` — reasons about position/direction.

`picture_word_match` is the closest language family, but it measures one lexical mapping. Pattern #41 measures **multi-feature phrase composition** such as RED + BALL, TWO + BOOKS, and SMALL + CAT.

`count_and_select` does not fit `TWO BOOKS` because the canonical answer is the scene/phrase itself, not a numeric response.

## Exact deterministic model

Implementation must use explicit config for the four audited IDs. No arbitrary English phrase parser is required or permitted for classification.

Suggested normalized scene model:

```text
english-phrase-red-ball
  targetPhrase: A RED BALL
  semanticFeatures: color=red, noun=ball, quantity=1
  canonical choice scenes:
    🔴⚽ -> red / ball / 1
    🔵⚽ -> blue / ball / 1
    🔴📘 -> red / book / 1

english-phrase-two-books
  targetPhrase: TWO BOOKS
  semanticFeatures: noun=book, quantity=2
  canonical choice scenes:
    📘 -> book / 1
    📘📘 -> book / 2
    📘📘📘 -> book / 3

english-phrase-small-cat
  targetPhrase: A SMALL CAT
  semanticFeatures: size=small, noun=cat, quantity=1
  canonical choice scenes:
    A SMALL CAT -> small / cat / 1
    A BIG DOG -> big / dog / 1
    TWO CATS -> cat / 2

english-phrase-yellow-banana
  targetPhrase: A YELLOW BANANA
  semanticFeatures: color=yellow, noun=banana, quantity=1
  canonical choice scenes:
    A GREEN APPLE -> green / apple / 1
    A YELLOW BANANA -> yellow / banana / 1
    A RED BALL -> red / ball / 1
```

Implementation may use deterministic icons/shapes for the text-only choices, but must keep the canonical visible choice label available and must not change the submitted answer string.

## Evidence contract

Pattern #41 must preserve the existing evidence model exactly:

- canonical activity IDs unchanged;
- runtime remains `tap_choice`;
- assessment remains `assessed`;
- contract remains `choice_accuracy_v1`;
- lesson/pack/skill links unchanged;
- three canonical choices unchanged and in canonical order;
- `correctChoice` unchanged;
- wrong selection remains measured/retryable and cannot complete;
- correct selection completes the existing activity;
- no new mastery threshold or progression rule;
- no schema, migration or content rewrite.

## Exact presentation contract

Implementation may proceed only if all of these remain true:

1. Classification is exact-scoped to the four audited IDs and requires canonical English stage/lesson/pack/skill/runtime ownership.
2. Deterministic semantic config exists for every scoped activity and every canonical choice.
3. The unchanged canonical prompt remains visible and remains the narration source.
4. Every canonical choice keeps its exact visible label/order and submitted answer string.
5. Each choice additionally receives a deterministic scene representing its literal semantic features.
6. Visual scenes must distinguish the task-relevant features: color, quantity, size and noun where applicable.
7. Scene presentation must not reveal which option is correct through styling before selection.
8. Wrong feedback remains retryable and does not reveal the correct choice.
9. Correct feedback completes through the existing measured completion path.
10. Direct keyboard/touch/pointer controls remain available; no drag-only dependency.
11. No invented translation checkpoint, spoken-answer checkpoint, or second assessed step.
12. Layout remains usable at 320x720, 390x844, 768x1024 and desktop widths.
13. The implementation must not absorb unrelated English vocabulary, listening, opposites, or sentence-completion activities.

## Required runtime evidence metadata

For assessed completion, metadata should identify the interaction without replacing canonical evidence semantics:

```text
source: phrase-scene-match-runtime
evidenceFidelity: choice_phrase_scene_interaction
targetPhrase
selectedChoice
featureKinds
```

Accuracy, incorrect count and retry count must retain canonical measured semantics.

## Regression requirements

Before implementation merge, prove:

- exactly four activities classify as `phrase_scene_match`;
- all four keep canonical prompt, choices, order and `correctChoice` byte-for-byte;
- all four remain English / `english-phrases-review` / `english-simple-phrases` / `english.pack.simple-phrases` / `english.phrase.literal` / assessed `tap_choice`;
- deterministic scene config exists for all twelve canonical choices;
- target feature set matches the canonical correct choice in all four activities;
- malformed/non-scope activities fail closed;
- the listening activity `english-listen-phrase-blue-book` remains outside Pattern #41;
- English sentence completion remains outside Pattern #41 and eligible for existing cloze reuse rather than accidental absorption;
- wrong answer cannot complete and correct answer can complete;
- evidence metadata/count/accuracy/retry semantics are verified;
- keyboard plus touch/pointer are verified;
- representative idle/wrong/success browser states are captured at 320x720, 390x844 and 768x1024;
- no horizontal overflow or hidden answer controls;
- gameplay distribution remains 900/900 classified with exactly 41 active patterns after implementation;
- deterministic activity-quality remains clean;
- permanent visual QA remains P0=0/P1=0;
- full CI, Windows compatibility, production build and independent exact Cloudflare release smoke pass.

## Decision

**Pattern #41 is justified as `phrase_scene_match` for exactly the four assessed direct-choice activities in `english-simple-phrases` listed above.**

The reason is objective fidelity: the canonical lesson and skill assess literal understanding of short compositional English phrases, while generic choice presentation inconsistently mixes text and emoji answer forms. A deterministic scene-per-choice presentation can make color/quantity/size/noun composition visible without changing canonical answer payload, assessment, mastery or progression.

This audit does **not** approve:

- converting all English vocabulary activities;
- absorbing the listening simple-phrase activity;
- creating a duplicate sentence-completion mechanic instead of reusing `cloze_sentence_choice` where appropriate;
- changing canonical prompts, labels, choice order or answers;
- adding translation, speech scoring or drag-only requirements;
- changing mastery/progression/schema/database;
- any Pattern #42+ mechanic.

## Next step

After this audit is merged, implementation should start from the resulting latest `main` on a separate branch and add only the exact config/classifier, scene-based child-facing presentation, regression/browser QA, distribution registration and implementation documentation required for these four activities.
