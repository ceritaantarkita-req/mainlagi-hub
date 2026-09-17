# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos exact-scope regression, completion/evidence, keyboard, touch/pointer, responsive QA, manual visual review, dan merged-main verification.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.
- Production visual P1 checkpoint sudah closed/live verified; WS-08 visual QA tetap blocking pada setiap wave WS-05.

## Status implementasi

Patterns #1–#35 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — FULLY CLOSED
31. `make_total` — FULLY CLOSED
32. `take_away` — FULLY CLOSED
33. `equal_groups` — FULLY CLOSED
34. `initial_sound` — FULLY CLOSED
35. `picture_word_match` — FULLY CLOSED
36. `sentence_order_cards` — FULLY CLOSED
37. `reading_passage_question` — FULLY CLOSED
38. `cloze_sentence_choice` — FULLY CLOSED via implementation #166 + closure #168
39. `visual_word_problem` — FULLY CLOSED via audit #169 + implementation #170 + closure #171
40. `spatial_relation_board` — **FULLY CLOSED** via audit #173 + implementation #175 + closure #176
41. `phrase_scene_match` — **AUDIT CANDIDATE ONLY** in PR #179; implementation not started and not counted in merged distribution

Permanent gameplay-distribution audit foundation: MERGED PR #105.

Current verified merged distribution on `main`:

```text
900 / 900 classified
0 unclassified
40 active child-facing patterns
choice_grid                     261 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Remaining merged-main distance is **10 patterns** to minimum 50 and **20** to working target 60. Pattern #41 does not change those numbers until an implementation is merged and independently verified.

## Pattern #40 — `spatial_relation_board` FULLY CLOSED

Exact scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical boundaries remain Logic / `logic-patterns-sequences-relations` / `logic-spatial-relations` / `logic.pack.spatial-relations` / `logic.spatial.relation.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

Verified chain:

```text
Audit PR:                #173
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Closure main:            43d69c42ca456ab41011f1d198e021f2b0d53cae
Closure CI:              #850 / run 35219083042 — full success
Truth reconciliation:    #177 -> 7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f
```

## Pattern #41 — `phrase_scene_match` AUDIT CANDIDATE

Fresh objective/evidence audit PR #179 selects exactly four assessed direct-choice activities from `english-simple-phrases`:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical boundaries:

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

Why the candidate is justified for implementation review:

- the lesson objective is literal understanding of very short compositional English phrases;
- canonical tasks combine color+noun, quantity+noun and size+noun evidence;
- current generic `choice_grid` inconsistently mixes emoji scenes and phrase-only choices;
- deterministic scenes can expose those semantic features while preserving the exact canonical answer label and submitted answer string;
- this is distinct from `picture_word_match`, which measures a single lexical picture↔word mapping, and from `count_and_select`, which expects a numeric answer.

Strict boundaries:

- no arbitrary phrase parser; use explicit exact-ID config;
- all twelve canonical choices require deterministic scene config;
- canonical prompt, choice order, labels and `correctChoice` remain byte-for-byte unchanged;
- `english-listen-phrase-blue-book` remains outside because its canonical runtime is listening;
- `english-complete-*` remains outside; cloze reuse is not a new pattern;
- no drag-only interaction, translation checkpoint, speech scoring, mastery/progression/schema/database change;
- Pattern #41 is not implemented until a separate implementation PR passes distribution, regression, browser/visual and merged-main gates.

Expected implementation distribution, **only if** the audited scope is implemented successfully:

```text
900 / 900 classified
0 unclassified
41 active patterns
choice_grid                     257 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
```

These are acceptance targets, not current merged-main claims.

## Production visual checkpoint

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

P2 findings remain visible but do not re-block accepted gameplay implementations.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#40 — **FULLY CLOSED**.
- Pattern #41 `phrase_scene_match` — **AUDIT OPEN in PR #179 / IMPLEMENTATION NOT STARTED**.
- NEXT — exact-head audit acceptance -> docs-only merge -> independent merged-main verification -> separate implementation branch.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
