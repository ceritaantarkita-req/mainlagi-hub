# Pattern #47 Objective / Evidence Audit — 18 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

## Verified baseline

```text
main:                           49c33ba8c0e25f5ebea962b79eea77ce44acbd06
Pattern #46 closure PR:         #201
Pattern #46 closure-main CI:    #939 / run 35346435744 — full success + exact Cloudflare production smoke
classified:                     900 / 900
unclassified:                     0
active child-facing patterns:    46
choice_grid:                    237 / 900
```

## Candidate selected

```text
pattern:      shape_attribute_board
subject:      math
stage:        math-banding-bentuk
lesson:       math-shapes
pack:         math.pack.shapes
runtime:      tap_choice
assessment:   assessed
evidence:     choice_accuracy_v1
activities:   4
```

Lesson objective:

> Mengenali bentuk dasar dan sifat visual sederhananya.

Relevant skills:

```text
math.shape.recognition
  Membedakan lingkaran, segitiga, persegi, persegi panjang, dan bentuk dasar lain.

math.shape.properties
  Mengamati sisi dan sudut pada bentuk dasar secara visual.
```

## Exact candidate scope

| Activity | Prompt | Canonical choices | Correct | Skill |
| --- | --- | --- | --- | --- |
| `math-shape-find-circle` | Bentuk mana yang bulat tanpa sudut? | `●`, `▲`, `■` | `●` | `math.shape.recognition` |
| `math-shape-find-triangle` | Mana bentuk segitiga? | `■`, `▲`, `●` | `▲` | `math.shape.recognition` |
| `math-shape-find-square` | Pilih bentuk persegi. | `▭`, `■`, `●` | `■` | `math.shape.recognition` |
| `math-shape-three-sides` | Bentuk mana yang punya 3 sisi? | `●`, `▲`, `■` | `▲` | `math.shape.properties` |

The last activity is intentionally audited against the final runtime payload in `system.ts`: its canonical runtime choices are the three shape symbols above.

No prompt, choice order, submitted value, or `correctChoice` may change.

## Why generic `choice_grid` is under-representative

All four tasks are visual geometry evidence. The learner is not choosing an abstract text answer; the evidence depends on discriminating shape form or a visible shape property.

A geometry-specific board can make all three canonical choices equally legible as shape tiles and preserve their exact order while leaving correctness unresolved until selection.

The dedicated presentation may expose neutral visual structure such as:
- large canonical shape glyph;
- consistent tile size;
- shape name/property prompt;
- optional neutral “lihat sisi dan sudut” instruction.

It must not annotate the correct tile with answer-specific side counts, color, labels, or emphasis before submission.

## Why this is not existing `symbol_hunt`

Current `symbol_hunt` is not a safe reuse target for assessed Math shape evidence:

- its component is explicitly letter-oriented;
- its accessible labels say “Letter” / “Huruf”;
- its hint copy is letter-specific;
- it rotates choice order as a presentation variant;
- it completes through `completeActivity` without the measured assessed `choice_accuracy_v1` runtime metadata used by newer exact-scoped assessed interactions.

Generalizing it for Pattern #47 would broaden and rewrite an older pattern contract rather than reuse a compatible evidence model.

## Why this is not visible matching

The same pack already contains:
- `math-shape-match-circle-square`;
- `math-shape-match-triangle-rectangle`.

Those activities assess paired name-to-symbol matching and remain canonical `matching` / `matching_accuracy_v1`.

Pattern #47 candidate is single-choice recognition/property evidence and must not absorb matching activities.

## Why this is not `compare_properties`

`compare_properties` asks for relative comparison between alternatives (for example longer/shorter/hotter/more). Pattern #47 asks the learner to identify one shape or one intrinsic visible property. There is no two-item comparison relation to preserve.

## Why this is not `spatial_relation_board`

Spatial relation evidence asks where one object is relative to another. Shape identity and side/corner properties are intrinsic, not positional relations.

## Other remaining families rejected or deferred

Fresh review from the verified 46-pattern baseline also rechecked the largest remaining choice-grid families:

- Math missing-number activities -> reuse/generalize `number_line` or sequence mechanics.
- Math spatial activities -> reuse/generalize `spatial_relation_board`.
- Math measure/size comparison -> reuse/generalize `compare_properties`.
- Logic comparisons -> reuse `more_less_balance` / `compare_properties`.
- Logic repeating-rule and sequence families -> reuse/generalize `pattern_completion`.
- Logic classification -> reuse sorting/set reasoning.
- English vocabulary picture/word families -> reuse/generalize `picture_word_match`.
- English categories -> reuse sorting/matching.
- English opposites -> existing matching evidence in the same lesson remains the preferred direction.
- English sentence completion -> reuse/generalize `cloze_sentence_choice`.
- Bahasa meaning/applied reading -> reuse/generalize `reading_passage_question`.
- Bahasa punctuation/capitalization -> prior audit remains valid: direct recognition is already measured; a cosmetic proofreading skin alone does not justify a new pattern.
- Science living classification -> reuse sorting/classification interactions.
- Science senses/features -> reuse `feature_function_link`.
- Science force/motion -> remains heterogeneous and can often be represented by existing relation/comparison interactions; not approved as a new Pattern #47 family.
- Science weather/environment direct relations -> reuse/generalize `phenomenon_relation_board` where exact evidence fits.
- Iqro choice families -> remain outside new mechanic work until external expert acceptance exists.

## Deterministic presentation boundary

Implementation may use explicit per-ID config only. No prompt parser is permitted.

Suggested modes:

```text
math-shape-find-circle      -> identify_circle
math-shape-find-triangle    -> identify_triangle
math-shape-find-square      -> identify_square
math-shape-three-sides      -> identify_three_sides
```

Approved presentation:
- geometry mat / board;
- exactly three canonical shape tiles in exact canonical order;
- neutral, equivalent styling before selection;
- wrong tile may receive retry feedback but cannot complete;
- correct tile may reveal success annotation after completion;
- property activity may reveal explanatory side/corner annotation only after correct completion.

Implementation must not:
- reorder canonical choices;
- label the correct shape before submission;
- pre-disable distractors;
- add drag-only interaction;
- add a second assessed checkpoint;
- change mastery, progression, schema, database, content ownership, prompt, choices, or answer.

Canonical evidence remains:

```text
runtime:            tap_choice
assessment:         assessed
contract:           choice_accuracy_v1
wrong selection:    incorrect + retry / no completion
correct selection:  completion
accuracy:           1 / (1 + incorrectCount)
```

Suggested additive metadata:

```text
source:             shape-attribute-board-runtime
evidenceFidelity:   choice_shape_attribute_interaction
shapeMode
selectedChoice
skillId
```

## Expected distribution if implementation passes

```text
classified:                  900 / 900
unclassified:                  0
active child-facing patterns: 47
choice_grid:                 233 / 900
shape_attribute_board:         4 / 900
```

Remaining distance after verified closure would be **3 patterns** to the current finish target of 50.

## Required implementation gates

1. Exact four-ID fail-closed config.
2. Preserve exact final-runtime prompt, choices/order and `correctChoice`.
3. Exact ownership regression for Math / `math-banding-bentuk` / `math-shapes` / `math.pack.shapes`.
4. Preserve per-activity skill: three `math.shape.recognition`, one `math.shape.properties`.
5. Same-pack matching activities remain matching.
6. Idle state cannot complete.
7. Wrong choice increments incorrect/retry and cannot complete.
8. Correct choice completes with measured assessed accuracy.
9. Keyboard, pointer and actual-touch answer paths.
10. Responsive QA at 320x720, 390x844 and 768x1024.
11. Idle/wrong/success screenshots at all three viewports.
12. No horizontal clipping; feedback and success CTA fully visible.
13. Permanent visual product QA remains blocking.
14. Full Ubuntu/Windows/build/dependency/security CI.
15. Exact-head merge followed by independent merged-main distribution and exact Cloudflare production smoke.
16. Canonical docs reconciliation and post-merge docs closure.

## Audit result

Pattern #47 `shape_attribute_board` is **JUSTIFIED FOR IMPLEMENTATION** for exactly the four direct-choice activities in `math.pack.shapes`.

The two matching activities in the same pack remain matching. No other Math family is approved by this audit.

Runtime implementation has **not** started in this audit branch.
