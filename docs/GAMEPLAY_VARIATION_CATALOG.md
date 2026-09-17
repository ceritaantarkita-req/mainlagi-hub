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
38. `cloze_sentence_choice` — FULLY CLOSED
39. `visual_word_problem` — FULLY CLOSED
40. `spatial_relation_board` — FULLY CLOSED
41. `phrase_scene_match` — **FULLY CLOSED / LIVE VERIFIED**
42. `growth_stage_transition` — **AUDIT CANDIDATE JUSTIFIED / NOT IMPLEMENTED**

Permanent gameplay-distribution audit foundation: MERGED PR #105.

## Current verified merged distribution

```text
900 / 900 classified
0 unclassified
41 active child-facing patterns
choice_grid                     257 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Current merged truth remains **41 patterns**. Pattern #42 is not counted until implementation merges and is independently verified.

Remaining distance from current merged truth is **9 patterns** to minimum 50 and **19** to working target 60.

## Pattern #41 — `phrase_scene_match` FULLY CLOSED

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Final truth:

```text
Closure PR:              #184
Closure main:            552a3123b7352d6d5ab0eb2d9caecab50d60f09c
Closure main CI:         #867 / run 35240186539 — full success + Cloudflare smoke
Truth PR:                #185
Final truth main:        e20b50431d907f9ca6f3ef254b7c69aa24a132a5
Final truth main CI:     #869 / run 35241959755 — full success + Cloudflare smoke
```

## Pattern #42 audit candidate — `growth_stage_transition`

The fresh audit found a justified **narrow** Science lifecycle transition family:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical boundaries:

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Why this exact scope is coherent:

- all three ask for one target biological growth stage relative to a known stage;
- generic `choice_grid` preserves answer evidence but does not explicitly represent the growth transition;
- explicit deterministic config can show a known stage and an unknown target stage without changing the canonical answer payload;
- canonical prompt, choice order, `correctChoice`, assessment, mastery and progression can remain unchanged.

Explicit exclusions:

- `science-cycle-butterfly` remains outside because it asks for a complete ordered four-stage lifecycle;
- `science-match-young-adult-b` remains outside because its canonical runtime/evidence is matching;
- `cause_effect` remains scoped to physical water-state changes under environmental conditions;
- `relative_order_track` remains abstract multi-item positional reasoning;
- no arbitrary lifecycle prompt parser is approved.

Implementation target only, **not current merged truth**:

```text
900 / 900 classified
0 unclassified
42 active patterns
choice_grid                     254 / 900
growth_stage_transition           3 / 900
```

Full audit: `PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`.

## Production visual checkpoint

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#41 — **FULLY CLOSED**.
- Pattern #42 — docs-only audit candidate `growth_stage_transition`; implementation not started.
- NEXT GATE — merge/verify the audit, then implement only the exact three audited IDs on a separate branch.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
