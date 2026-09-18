# Pattern #45 Objective / Evidence Audit — 18 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

## Baseline

Verified starting point:

```text
main:                           d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc
closure docs PR:                #195
closure merged-main CI:         #914 / run 35306629423 — full success + exact Cloudflare production smoke
classified:                     900 / 900
unclassified:                     0
active child-facing patterns:    44
choice_grid:                    246 / 900
```

Pattern #45 is selected only when the current interaction materially under-represents the learning objective/evidence. Existing mechanics must be reused when they already express the same reasoning behavior.

## Candidate selected

```text
pattern:      elimination_board
subject:      logic
stage:        logic-conditional-analogy-inference
lesson:       logic-elimination-inference
pack:         logic.pack.elimination-inference
skill:        logic.inference.elimination.basic
runtime:      tap_choice
assessment:   assessed
evidence:     choice_accuracy_v1
activities:   5
```

Lesson objective:

> Menyisihkan pilihan dan menarik kesimpulan langsung dari ciri yang terlihat.

Skill description:

> Menyisihkan pilihan dan menarik kesimpulan langsung dari informasi sederhana.

The current generic `choice_grid` records the final selected answer, but it does not visually express the lesson's explicit elimination step. A dedicated elimination board can preserve the canonical answer/evidence contract while turning each wrong/retry attempt into a visible rejected option and keeping the surviving conclusion legible.

## Exact implementation scope

| Activity | Prompt | Choices | Correct |
| --- | --- | --- | --- |
| `logic-infer-not-red` | Pilih yang bukan merah. | `biru 🔵`, `merah bulat 🔴`, `merah kotak 🟥` | `biru 🔵` |
| `logic-infer-only-triangle` | Hanya satu pilihan berbentuk segitiga. Mana itu? | `▲`, `●`, `■` | `▲` |
| `logic-infer-not-largest` | Yang terbesar sudah disisihkan. Mana yang paling kecil? | `● kecil`, `◉ sedang`, `⬤ besar` | `● kecil` |
| `logic-infer-common-feature` | Contoh: 🔴 dan 🔵. Ciri apa yang sama? | `keduanya bulat`, `keduanya merah`, `keduanya kotak` | `keduanya bulat` |
| `logic-infer-missing-member` | Set arah harus punya ↑ → ↓ ←. Yang terlihat ↑ → ↓. Mana yang belum ada? | `←`, `↑`, `→` | `←` |

No prompt, choice order, submitted value, or `correctChoice` may change.

## Why existing mechanics are not reused unchanged

### `set_reasoning`

Existing `set_reasoning` is a deterministic two-rule membership/intersection board. It is appropriate for explicit set constraints such as "merah AND bulat" or "hewan but not burung".

Pattern #45 scope is broader and not consistently representable as two set-membership rules:
- single negative exclusion;
- unique category target;
- size conclusion after elimination;
- common-feature inference from examples;
- missing-member inference from a required set.

Therefore broadening `set_reasoning` would weaken its current two-rule contract.

### `odd_one_out`

Existing `odd_one_out` asks the learner to find one item that differs while two share a common trait. Pattern #45 instead asks the learner to use a clue or incomplete set to eliminate candidates and infer a conclusion. The answer relation is not consistently "one differs from the other two".

### `sorting_buckets`

Existing `sorting_buckets` represents category assignment. It is a fit for classification work, not for all five inference tasks above.

## Candidate families explicitly rejected for Pattern #45

The audit reviewed other remaining `choice_grid` families before selecting the Logic inference scope:

- **Logic multi-classification** — should prefer existing `set_reasoning` / classification mechanics; not a justified new pattern.
- **Math measure intuition** — qualitative length/fill comparison overlaps existing `compare_properties`; prefer reuse/generalization rather than taxonomy inflation.
- **English categories** — category membership can use existing matching/sorting interactions.
- **English opposites** — the same lesson already includes explicit opposite matching; no new interaction is required merely for the choice items.
- **Bahasa ejaan dasar** — canonical evidence is recognition of the correctly written sentence. A new editing mechanic would add evidence not present in the source contract unless separately redesigned.
- **Iqro choice families** — remain outside this candidate because Iqro expert acceptance is still an external unresolved gate; Pattern #45 must not invent pedagogical transformations there.

## Approved interaction boundary

The candidate presentation may:

- show one clue/inference panel above the canonical choices;
- render the canonical choices as option cards in their existing order;
- after a wrong selection, visibly mark that selected option as **tersisih** while keeping retry available;
- keep all not-yet-selected canonical choices available;
- on the canonical correct selection, show the surviving conclusion and complete through the existing measured attempt path;
- support keyboard, pointer, and actual touch through native controls;
- use deterministic, activity-ID-based labels/modes only.

The candidate must **not**:

- pre-disable a canonical distractor;
- silently remove a choice before the child selects it;
- introduce a timer, speed score, drag-only requirement, or prompt parser;
- add an intermediate assessed checkpoint;
- alter mastery, progression, schema, database, pack ownership, or evidence semantics;
- treat a wrong elimination as success.

This keeps the canonical evidence contract primary: correct/incorrect/retry counts still come from the existing assessed `choice_accuracy_v1` completion flow.

## Proposed deterministic modes

```text
logic-infer-not-red          -> negative_exclusion
logic-infer-only-triangle    -> unique_target
logic-infer-not-largest      -> size_elimination
logic-infer-common-feature   -> common_feature
logic-infer-missing-member   -> missing_member
```

These modes are presentation metadata only. They do not change submitted values or assessment.

## Expected distribution if implementation passes

```text
classified:                    900 / 900
unclassified:                    0
active child-facing patterns:    45
choice_grid:                    241 / 900
elimination_board:                5 / 900
```

Remaining distance after a verified implementation would be **5 patterns** to the current finish target of 50.

## Required implementation gates

1. Fail-closed exact five-ID config with byte-preserved prompt/choices/`correctChoice`.
2. Exact-scope classifier regression and explicit exclusions for nearby Logic families.
3. Wrong selection increments incorrect/retry and cannot complete.
4. Correct selection preserves measured assessed accuracy `1 / (1 + incorrectCount)`.
5. Keyboard, pointer, and actual-touch completion.
6. Responsive browser QA at 320x720, 390x844, and 768x1024 with idle/wrong/success screenshots.
7. No horizontal clipping; success feedback/CTA fully visible.
8. Permanent visual product gate remains blocking.
9. Full Ubuntu/Windows/build/dependency/security CI.
10. Exact-head merge followed by independent merged-main gameplay distribution and exact Cloudflare production smoke.
11. Canonical docs reconciliation after merged-main verification.

## Audit result

Pattern #45 `elimination_board` is **JUSTIFIED FOR IMPLEMENTATION** for exactly the five `logic-elimination-inference` activities above.

No other Logic family and no non-Logic activity is approved by this audit.
