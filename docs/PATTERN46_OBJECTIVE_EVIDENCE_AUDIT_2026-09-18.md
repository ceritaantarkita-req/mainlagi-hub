# Pattern #46 Objective / Evidence Audit — 18 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

## Verified baseline

```text
main:                           79788dfb7f88164e699d1c3b9ac62b689d366c74
Pattern #45 closure PR:         #198
Pattern #45 closure-main CI:    #927 / run 35314983842 — full success + exact Cloudflare production smoke
classified:                     900 / 900
unclassified:                     0
active child-facing patterns:    45
choice_grid:                    241 / 900
```

Audit rule: Pattern #46 is justified only when the learning objective is materially under-represented by the current interaction and no existing pattern already expresses the same evidence model well enough.

## Candidate selected

```text
pattern:      phenomenon_relation_board
subject:      science
stage:        science-earth-body-environment
lesson:       science-earth-sky-patterns
pack:         science.pack.earth-sky-patterns
skill:        science.earth.sky_patterns.basic
runtime:      tap_choice
assessment:   assessed
evidence:     choice_accuracy_v1
activities:   4
```

Lesson objective:

> Menghubungkan pengamatan Matahari, malam, bayangan, dan awan dengan pola sederhana.

Skill description:

> Menghubungkan pengamatan langit dan cahaya dengan pola harian serta cuaca sederhana.

The four direct-choice activities all ask the learner to relate an observable sky/light condition to the associated condition, object, result, or likely weather outcome. Generic `choice_grid` records the final choice but does not make that relation visible.

A dedicated relation board can show:

```text
observed condition / phenomenon -> related condition or result
```

while preserving the exact canonical answer and assessment semantics.

## Exact candidate scope

| Activity | Prompt | Choices | Correct |
| --- | --- | --- | --- |
| `science-earth-sun-day` | Saat bagian tempat kita berada menghadap Matahari, biasanya kita mengalami apa? | `siang hari`, `malam hari`, `musim hujan selalu` | `siang hari` |
| `science-earth-moon-night` | Benda langit mana yang sering mudah terlihat pada malam hari? | `bulan`, `pelangi setiap malam`, `awan selalu hitam` | `bulan` |
| `science-earth-shadow-sun` | Apa yang dapat terbentuk saat benda menghalangi cahaya? | `bayangan`, `suara`, `rasa manis` | `bayangan` |
| `science-earth-cloud-rain` | Jika awan makin gelap dan tebal, perubahan cuaca apa yang mungkin terjadi? | `hujan turun`, `bintang muncul siang hari`, `tanah langsung membeku` | `hujan turun` |

No prompt, choice order, submitted value, or `correctChoice` may change.

Explicit exclusion:

```text
science-match-sky-observation-c
```

The excluded activity remains canonical `matching` / `matching_accuracy_v1`.

## Why this is not existing `cause_effect`

Existing `cause_effect` is intentionally a physical-state transformation family:

- melting;
- freezing;
- evaporation;
- condensation.

It represents a starting physical state plus a condition that causes a material-state change.

Pattern #46 candidate is broader observational Earth/sky relation evidence:

- orientation toward the Sun -> daytime;
- night context -> commonly visible Moon;
- blocked light -> shadow;
- dark thick clouds -> possible rain.

Only part of this scope is causal. Broadening `cause_effect` would weaken its material-change contract.

## Why this is not existing `investigation_board`

Existing `investigation_board` represents explicit inquiry modes:

- observe;
- control;
- predict;
- conclude.

Its configs require multi-line scenarios and an investigation focus. The four Earth/sky candidate activities do not ask the learner to design or interpret an investigation. They ask for a direct relation from a familiar observable condition.

Turning them into investigation tasks would add evidence not present in the canonical source contract.

## Why this is not `growth_stage_transition`

`growth_stage_transition` represents biological temporal progression from a known life stage to another life stage. Earth/sky relations are not growth-stage transitions.

## Other remaining families rejected or deferred

The fresh 45-pattern audit also rechecked major remaining `choice_grid` groups:

- **English sentence completion** — should reuse/generalize existing `cloze_sentence_choice`; no new pattern.
- **Math measure intuition** — overlaps existing `compare_properties`; no new pattern.
- **Math spatial position** — should reuse/generalize `spatial_relation_board`; no new pattern.
- **Logic repeating-pattern / rule continuation** — existing `pattern_completion` already expresses sequence completion and should be generalized rather than duplicated.
- **Logic multi-classification** — existing `set_reasoning` / sorting-classification interactions remain the correct reuse direction.
- **English categories** — existing matching/sorting interactions already express category membership.
- **English opposites** — prior audits remain valid: the same lesson already includes explicit opposite matching.
- **Bahasa sentence meaning / applied reading** — existing `reading_passage_question` should be considered for reuse/generalization instead of a duplicate comprehension mechanic.
- **Bahasa punctuation/capitalization** — still direct recognition evidence; a cosmetic proofreading skin does not justify a new pattern.
- **Science senses / part-function links** — existing `feature_function_link` is the preferred reuse direction.
- **Science force/motion** — prior audit rejection remains valid because the direct-choice evidence is heterogeneous.
- **Science food chain** — one direct-choice ordered-system activity remains too small for a reusable new family.
- **Iqro choice families** — remain outside new mechanic work until external Iqro expert acceptance is available.

## Deterministic presentation model

Implementation may use explicit per-ID config only. No prompt parser is permitted.

Suggested modes:

```text
science-earth-sun-day       -> sun_day_relation
science-earth-moon-night    -> night_sky_observation
science-earth-shadow-sun    -> light_shadow_relation
science-earth-cloud-rain    -> cloud_rain_prediction
```

Each config should provide:

- observation/condition icon(s);
- observation label;
- relation label;
- deterministic visual representation for all three canonical choices;
- accessible labels;
- success explanation;
- exact expected prompt/choices/correct answer for fail-closed validation.

The board should keep the related/result slot unresolved until the learner submits the canonical correct answer.

## Evidence boundary

Implementation may:

- show the observed condition as a stable scene;
- show an unresolved relation/result slot;
- render all three canonical choices in exact order;
- give every canonical choice an equivalent deterministic visual scene;
- preserve wrong retry behavior;
- reveal/resolve the relation only after correct selection;
- add presentation metadata identifying relation mode.

Implementation must **not**:

- reveal the canonical correct result before selection;
- pre-disable or silently remove distractors;
- add an experimental-control task or second inference checkpoint;
- introduce a timer, speed score, drag-only interaction, or prompt parser;
- change mastery, progression, schema, database, pack ownership, or evidence semantics.

Canonical evidence remains primary:

```text
runtime:           tap_choice
assessment:        assessed
contract:          choice_accuracy_v1
wrong selection:   incorrect + retry / no completion
correct selection: completion
accuracy:          1 / (1 + incorrectCount)
```

Suggested additive metadata:

```text
source:             phenomenon-relation-board-runtime
evidenceFidelity:   choice_phenomenon_relation_interaction
relationMode
selectedChoice
```

## Expected distribution if implementation passes

```text
classified:                       900 / 900
unclassified:                       0
active child-facing patterns:      46
choice_grid:                      237 / 900
phenomenon_relation_board:          4 / 900
```

Remaining distance after verified closure would be **4 patterns** to the current finish target of 50.

## Required implementation gates

1. Exact four-ID fail-closed config.
2. Byte-preserved prompt, choices/order and `correctChoice`.
3. Exact ownership regression: Science / `science-earth-body-environment` / `science-earth-sky-patterns` / `science.pack.earth-sky-patterns` / `science.earth.sky_patterns.basic`.
4. Matching activity in the same pack remains excluded.
5. Existing `cause_effect`, `investigation_board`, `growth_stage_transition` and unrelated Science families remain unchanged.
6. Idle state cannot complete.
7. Wrong selection increments incorrect/retry and cannot complete.
8. Correct selection completes with canonical measured accuracy.
9. Keyboard, pointer and actual-touch answer paths.
10. Responsive QA at 320x720, 390x844 and 768x1024.
11. Idle/wrong/success screenshots at all three viewports.
12. No horizontal clipping; primary feedback/CTA fully visible.
13. Permanent visual product QA remains blocking.
14. Full Ubuntu/Windows/build/dependency/security CI.
15. Exact-head merge followed by independent merged-main distribution and exact Cloudflare production smoke.
16. Canonical docs reconciliation and post-merge docs closure.

## Audit result

Pattern #46 `phenomenon_relation_board` is **JUSTIFIED FOR IMPLEMENTATION** for exactly the four direct-choice activities in `science-earth-sky-patterns`.

The matching activity in the same lesson remains matching. No other Science family and no non-Science activity is approved by this audit.

Runtime implementation has **not** started in this audit branch.
