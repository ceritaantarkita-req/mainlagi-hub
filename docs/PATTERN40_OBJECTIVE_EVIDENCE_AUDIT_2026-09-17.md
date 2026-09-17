# Pattern #40 Objective / Evidence Audit — 17 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `98725727c866d410b2d0caa206e86e70cd0e5741`  
Latest fully closed gameplay at audit start: **Pattern #39 — `visual_word_problem`**  
Merged distribution at audit start: **900/900 classified / 39 active patterns / `choice_grid` 267/900**.

## Audit rule

Pattern #40 is not selected by pattern-count pressure. The valid outcome of this audit included **“no justified candidate”**.

A candidate is accepted only when:

- the canonical lesson objective and skill evidence are materially under-represented by the current interaction;
- the proposed presentation is semantically distinct from an already implemented gameplay pattern;
- canonical activity identity, answer payload, assessment, mastery and progression can remain unchanged;
- the scope is small, deterministic and fail-closed;
- the mechanic improves objective representation rather than only adding taxonomy.

## Candidate review

### English sentence completion

The remaining `english-complete-*` family should first be evaluated for reuse of the already implemented `cloze_sentence_choice` mechanic. Reusing an existing mechanic is preferable to creating a duplicate Pattern #40.

### Bahasa punctuation / capitalization

The `bahasa-tanda-*` and `bahasa-kapital-*` activities already directly measure recognition of correctly written sentences. Their current direct-choice evidence is not ideal visually, but a new gameplay taxonomy is not justified without a stronger interaction/evidence gap.

### Science life-cycle activities

The `science-cycle-*` family still has meaningful temporal content, but the evidence remains heterogeneous: full ordered sequence, earlier-stage recognition, adult-form recognition and young-plant-stage recognition. One strict Pattern #40 contract would require broad content-specific branching or semantic reinterpretation. This audit does not approve it.

### Logic pattern / sequence families

Several Logic pattern and sequence activities already expose the relevant symbol sequence directly inside the canonical prompt and ask for the next item. Existing pattern-completion and sequence mechanics overlap strongly with this evidence. A new mechanic here risks taxonomy duplication.

### Logic spatial relations

The six `logic-spatial-*` activities form one exact lesson/skill family and expose a clearer objective-to-presentation gap.

The lesson objective is explicitly spatial: left, right, middle, turns and opposite direction. The current generic choice grid records a valid answer, but most of the spatial state is encoded as inline text/symbol strings instead of being represented as a stable spatial board.

## Selected candidate

Working pattern name:

```text
spatial_relation_board
```

Exact scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical ownership:

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

## Canonical objective and skill

Lesson title:

```text
Posisi dan arah
```

Lesson objective:

> Menentukan kiri, kanan, tengah, belokan, dan arah berlawanan.

Mapped skill:

```text
logic.spatial.relation.basic
```

Skill description:

> Menentukan posisi kiri-kanan-tengah serta perubahan arah sederhana.

The exact six canonical tasks are:

1. choose the arrangement with a star to the left of a circle;
2. choose the arrangement with a circle to the right of a triangle;
3. choose the arrangement with a circle between two stars;
4. determine the direction after turning right from up;
5. determine the direction after turning left from right;
6. determine the direction opposite to left.

All six retain their canonical three choices and canonical `correctChoice`.

## Why the current representation is weak

The current `choice_grid` preserves correct/incorrect evidence, but it represents a spatial lesson mainly as text rows and arrow/symbol strings.

That is weaker than the canonical objective because the learner is supposed to reason about **position and direction**, not merely recognize a text token. For children aged 4–7, the spatial state itself should be visible as the stable task surface.

A `spatial_relation_board` can materially improve fidelity while preserving the assessed task:

- object-position tasks render objects in explicit left / center / right slots;
- turn tasks render a starting arrow and a visible clockwise/counter-clockwise turn cue;
- opposite-direction tasks render the reference arrow on a simple compass board;
- the unchanged canonical choices remain direct answer controls;
- the learner still submits the same canonical answer payload.

The board is a representation of the existing prompt, not an additional question.

## Why this is not an existing pattern

Relevant existing patterns are semantically different:

- `choice_grid` — generic direct choice;
- `relative_order_track` — ordinal ordering along a sequence/track;
- `rule_pipeline` — applies chained transformation rules;
- `pattern_completion` — predicts the next item in a repeating pattern;
- `number_line` — numeric ordering/position;
- `sentence_order_cards` — language word-order construction.

`relative_order_track` is the closest spatial relative, but it measures ordinal placement within an ordered sequence. The selected Pattern #40 family measures concrete left/right/between relations and single-step directional rotation/opposition.

The new presentation must therefore remain a spatial representation layer over the same direct-choice assessment rather than turning the activity into ordering, dragging, pathfinding or a multi-step rule task.

## Exact deterministic model

Implementation should use explicit exact-scope config and must not heuristically parse arbitrary prompt text.

Suggested config model:

```text
logic-spatial-star-left-circle
  mode: object_relation
  relation: left_of
  objects: star, circle

logic-spatial-circle-right-triangle
  mode: object_relation
  relation: right_of
  objects: circle, triangle

logic-spatial-circle-between-stars
  mode: object_relation
  relation: between
  objects: star, circle, star

logic-spatial-turn-right-from-up
  mode: turn
  start: up
  turn: right
  result: right

logic-spatial-turn-left-from-right
  mode: turn
  start: right
  turn: left
  result: up

logic-spatial-opposite-left
  mode: opposite
  start: left
  result: right
```

The exact config result must agree with the canonical `correctChoice` for every activity.

## Evidence contract

Pattern #40 must preserve the existing evidence model exactly:

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

The implementation may add runtime metadata describing the spatial interaction, but that metadata must not redefine correctness.

## Exact presentation contract

Implementation may proceed only if all of these remain true:

1. Classification is exact-scoped to the six audited IDs and requires the canonical Logic stage/lesson/pack/skill/runtime shape.
2. Deterministic config exists for every scoped activity.
3. The unchanged canonical prompt remains visible and remains the narration source.
4. Object-relation activities visibly encode left/right/between without relying only on prose.
5. Turn activities visibly distinguish starting direction and left/right rotation.
6. Opposite-direction activity visibly presents the reference direction without revealing the answer.
7. The three canonical choices remain direct keyboard/touch/pointer controls; no drag-only dependency.
8. Wrong feedback is retryable and does not reveal the correct answer.
9. Correct feedback completes through the existing measured completion path.
10. No invented intermediate checkpoint, confirmation step, pathfinding task or extra assessed answer.
11. Layout remains usable at 320x720, 390x844, 768x1024 and desktop widths.
12. The implementation must not reclassify unrelated Logic activities.

## Required runtime evidence metadata

For assessed completion, metadata should identify the interaction without replacing canonical evidence semantics:

```text
source: spatial-relation-board-runtime
evidenceFidelity: choice_spatial_relation_interaction
mode
relationOrTurn
selectedChoice
```

Accuracy, incorrect count and retry count must retain the canonical measured semantics used by assessed choice presentations.

## Regression requirements

Before implementation merge, prove:

- exactly six activities classify as `spatial_relation_board`;
- every scoped activity keeps canonical prompt, choices, choice order and `correctChoice` byte-for-byte;
- every scoped activity remains Logic / `logic-patterns-sequences-relations` / `logic-spatial-relations` / `logic.pack.spatial-relations` / `logic.spatial.relation.basic` / assessed `tap_choice`;
- deterministic config result matches canonical `correctChoice` for all six;
- object-relation, turn and opposite variants are all covered;
- malformed/non-scope activities fail closed;
- wrong answer cannot complete and correct answer can complete;
- evidence metadata/count/accuracy/retry semantics are verified;
- keyboard plus touch/pointer are verified;
- representative idle/wrong/success browser states are captured at 320x720, 390x844 and 768x1024;
- no horizontal overflow or hidden answer controls;
- gameplay distribution remains 900/900 classified with exactly 40 active patterns after implementation;
- deterministic activity-quality remains clean;
- permanent visual QA remains green with P0=0/P1=0;
- full CI, Windows compatibility, production build and independent exact Cloudflare release smoke pass.

## Decision

**Pattern #40 is justified as `spatial_relation_board` for exactly the six `logic-spatial-*` activities listed above.**

The reason is objective fidelity: the canonical lesson and skill explicitly assess spatial position and direction, while the current generic choice grid leaves that spatial model mostly embedded in text/symbol strings. A dedicated deterministic spatial board can make the intended reasoning visible without changing canonical answers, assessment, mastery or progression.

This audit does **not** approve:

- converting all Logic activities;
- changing any canonical prompt, choice or answer;
- adding drag/pathfinding as a required interaction;
- reusing the label for sequence/pattern activities;
- changing mastery/progression/schema;
- any Pattern #41+ mechanic.

## Next step

After this audit is merged and independently verified on `main`, implementation should start from that resulting latest `main` on a separate branch and add only the exact config/classifier, child-facing spatial presentation, regression/browser QA, distribution registration and implementation documentation needed for these six activities.