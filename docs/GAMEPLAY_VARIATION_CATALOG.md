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
42. `growth_stage_transition` — **IMPLEMENTATION CODE VERIFIED / PR #187 NOT MERGED**

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

Current merged truth remains **41 patterns** while PR #187 is open.

## Pattern #42 — `growth_stage_transition`

Verification chain so far:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Verified code checkpoint: 0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
```

Exact scope:

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

Verified implementation contract:

- exact three-ID deterministic config; no lifecycle prompt parser;
- prompt, canonical choice labels/order, submitted values and `correctChoice` remain unchanged;
- two-stage board shows known stage plus unknown target slot;
- target remains hidden on idle and wrong states and is revealed only after correct selection;
- `previous_stage`, `next_adult_stage`, and `next_young_stage` modes are explicit;
- all nine choice scenes are deterministic and equal-affordance before answer;
- native buttons preserve keyboard/touch/pointer input and >=44px target gates;
- browser QA executes keyboard retry, pointer completion and actual touch `tap()` completion;
- wrong selection increments canonical incorrect/retry evidence and cannot complete;
- correct selection emits existing assessed evidence plus presentation metadata;
- no mastery/progression/schema/database migration.

Explicit exclusions remain:

- `science-cycle-butterfly` — complete ordered lifecycle sequence;
- `science-match-young-adult-b` — canonical matching runtime/evidence;
- existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families.

Verified implementation-code distribution from CI #878:

```text
900 / 900 classified
0 unclassified
42 active patterns
choice_grid                     254 / 900
growth_stage_transition           3 / 900
phrase_scene_match                4 / 900
```

This 42-pattern distribution is **branch evidence, not merged production truth** until PR #187 is merged and resulting `main` independently passes full CI + exact Cloudflare smoke.

Manual review of the nine 320/390/768 idle/wrong/success screenshots is accepted with no P0/P1 Pattern #42 visual blocker. Screenshot artifact `10513557620`, digest `sha256:de116a80764e2b87716cc377e807aabbd4e3c9107961306039d6e480d1cbb5bd`.

Evidence: `PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md` and `WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`.

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
- Pattern #42 audit — **MERGED / LIVE VERIFIED**.
- Pattern #42 implementation code — **VERIFIED ON CHECKPOINT `0ded3a43...` / PR #187 NOT MERGED**.
- Current gate — final docs-only PR head CI -> clean review/mergeability -> exact-head merge -> independent merged-main Cloudflare verification -> closure docs.
- Pattern #43 implementation must not begin until Pattern #42 closure is complete; any Pattern #43 candidate still requires a fresh objective/evidence audit.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
