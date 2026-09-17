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

Remaining distance is **10 patterns** to minimum 50 and **20** to working target 60.

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

Canonical boundaries:

```text
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Verified interaction contract:

- exact six-ID deterministic classifier/config;
- canonical prompts, choices/order and `correctChoice` unchanged;
- left/right/between, turn-left/right, and opposite-direction representations are visually explicit;
- turn/opposite result stays hidden before successful completion and after wrong answers;
- direct keyboard/touch/pointer choice controls remain the assessed input;
- wrong answer remains retryable/measured and cannot complete;
- correct answer completes through the existing canonical evidence path;
- no drag-only dependency or additional assessed checkpoint;
- mastery/progression/schema/database remain unchanged;
- runtime metadata uses `spatial-relation-board-runtime` and `choice_spatial_relation_interaction`;
- responsive QA passes at 320x720, 390x844 and 768x1024;
- permanent visual QA remains green.

Verified chain:

```text
Audit PR:                #173
Audit main:              f1b4b13d3d9814d2ed06500022218848cd721419
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Final closure main:      43d69c42ca456ab41011f1d198e021f2b0d53cae
Final closure CI:        #850 / run 35219083042 — full success
```

Full evidence: `PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`, `WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`, `PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`, and `PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`.

## Recent closed patterns

### Pattern #39 — `visual_word_problem`

Fully closed via audit #169, implementation #170, closure #171; final closure main `98725727c866d410b2d0caa206e86e70cd0e5741`, CI #811 / run `35190499794`.

### Pattern #38 — `cloze_sentence_choice`

Fully closed via implementation #166 + closure #168; final main `86e6b69d576d72fec73158a7a1c6d8961de36887`, CI #803.

### Pattern #37 — `reading_passage_question`

Fully closed via implementation #153 + closure #154; final verified main `b1793adaabe19a9c73e021534899f8b50c4097f6`, CI #741.

### Pattern #36 — `sentence_order_cards`

Fully closed via implementation #151 + closure #152; final verified main `461b0fd59a6c238752aa858bf783716b225b548a`, CI #732.

## Production visual checkpoint

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

P2 findings remain visible but do not re-block accepted gameplay implementations.

## Pattern #41 objective/evidence audit gate

The next gameplay wave must begin with a fresh Pattern #41 audit that:

1. inspects remaining objectives/content where current interaction representation is weakest;
2. identifies the evidence actually required by those objectives;
3. determines whether an existing pattern already measures that evidence adequately;
4. rejects cosmetic re-skins and taxonomy-only variants;
5. rejects changes that weaken or ambiguously reinterpret mastery/progression evidence;
6. selects a small exact activity scope only after the mechanic is justified;
7. documents why the chosen interaction is materially better than the current representation;
8. preserves the valid outcome **“no justified Pattern #41 candidate yet.”**

No mechanic name, subject, or content family is pre-approved.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#40 — **FULLY CLOSED**.
- NEXT — fresh Pattern #41 objective/evidence audit.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
