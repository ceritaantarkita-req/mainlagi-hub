# Healthy Habit Routine Reuse Audit — Science Environment Care — 19 September 2026

Status: **AUDIT COMPLETE / LIVE VERIFIED / REUSE JUSTIFIED FOR EXACT 4 ENVIRONMENT-CARE IDS / CODE NOT STARTED / IMPLEMENTATION QUEUED**

## Purpose

Evaluate whether the existing Pattern #22 `healthy_habit_routine` can safely represent the four Science environment-care direct-choice activities without creating Pattern #48.

This audit is reuse-first and evidence-preserving. The existing pattern identifier is treated as a historical implementation identifier; environment-care reuse is allowed only through an explicit domain variant so body-health semantics are not incorrectly imposed on environment activities.

## Audit base

```text
canonical main:                    76e1eeb0c0d50280c612b57af7d6e85e5a079f52
active pattern count:              47
Pattern #48:                       no justified new pattern
Set Reasoning implementation:      main 9debb6cf / live closure pending
Math spatial audit:                PR #209 -> main 3e30a817 / PR CI #970 success / runtime not started
Math compare-properties audit:     PR #210 -> main f9833568 / PR CI #972 success / runtime not started
English cloze audit:               PR #211 -> main 76e1eeb0 / PR CI #974 success / runtime not started
```


## Canonical environment-care family

Lesson:

```text
id:        science-environment-care
title:     Menjaga lingkungan
objective: Memilih tindakan sederhana yang mengurangi sampah dan pemborosan sumber daya.
```

Pack:

```text
science.pack.environment-care
```

Skill:

```text
id:          science.environment.care.basic
description: Memilih tindakan sederhana untuk menjaga kebersihan dan menghemat sumber daya.
```

Canonical direct-choice ownership:

```text
subject:     science
stage:       science-earth-body-environment
runtime:     tap_choice
assessment:  assessed
evidence:    choice_accuracy_v1
age:         4–7
```

## Exact reuse scope

```text
science-env-trash-bin
science-env-save-water
science-env-reuse-bottle
science-env-plant-care
```

### `science-env-trash-bin`

```text
prompt:  Apa tindakan yang tepat untuk bungkus makanan setelah digunakan?
choices:
- buang ke tempat sampah yang sesuai
- lempar ke sungai
- tinggalkan di jalan
correct: buang ke tempat sampah yang sesuai
```

### `science-env-save-water`

```text
prompt:  Apa yang sebaiknya dilakukan saat keran tidak sedang dipakai?
choices:
- matikan keran
- biarkan terus mengalir
- buka semua keran
correct: matikan keran
```

### `science-env-reuse-bottle`

```text
prompt:  Mana contoh menggunakan kembali barang?
choices:
- memakai botol isi ulang
- membuang gelas baru setelah satu teguk
- membakar semua kertas
correct: memakai botol isi ulang
```

### `science-env-plant-care`

```text
prompt:  Tindakan mana yang membantu tanaman di halaman tetap terawat?
choices:
- menyiram sesuai kebutuhan
- menginjak tanaman
- mencabut semua daun setiap hari
correct: menyiram sesuai kebutuhan
```

## Explicit exclusion

```text
science-match-environment-actions-c
```

This activity remains canonical:
- runtime `matching`;
- assessed;
- evidence `matching_accuracy_v1`;
- current gameplay pattern `visible_matching`.

It measures matching goals to actions rather than choosing one action for one context, so it must not be absorbed into the direct-choice routine/action family.

## Existing mechanic

Pattern #22 `healthy_habit_routine` is fully closed/live verified for exactly four Science body-health direct-choice activities:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Current behavior:
- presents one familiar goal/context strip;
- renders exactly three canonical choices as large action/habit cards;
- supports keyboard/pointer/touch;
- wrong answer increments assessed error/retry and cannot complete;
- correct answer completes through canonical direct-choice evidence;
- records `source: healthy-habit-routine-runtime`;
- records `evidenceFidelity: choice_healthy_habit_routine_interaction`;
- has 320/390/768 browser QA and accepted nine-shot visual QA.

The current child-facing copy and metadata are explicitly body-health specific.

## Reuse decision

**Reuse is justified for all four environment-care direct-choice activities only through an explicit domain variant.**

Why:
1. both families measure one context/goal plus one correct everyday action from three canonical choices;
2. both use assessed `tap_choice` / `choice_accuracy_v1`;
3. no new manipulation, sequence, drag, ranking, matching, or extra assessment step is required;
4. the environment-care lesson itself is action selection;
5. Pattern #48 audit explicitly preferred existing routine/action-choice generalization over an environment-specific skin.

This is a controlled generalization of the existing routine/action interaction, not a new gameplay pattern.

## Historical identifier boundary

The gameplay pattern identifier may remain:

```text
healthy_habit_routine
```

for compatibility and taxonomy stability.

However, implementation must not claim that environment-care tasks are body-health habits. The config/component needs an explicit domain variant such as:

```text
body_health
environment_care
```

The legacy identifier is historical; child-facing semantics and runtime metadata must be domain-correct.

## Required environment-care presentation

For `environment_care`:
- heading/instruction should use neutral/environment-care wording such as choosing the action that best protects or cares for the environment;
- goal/context strip should represent the canonical environmental goal or situation;
- all three canonical answer choices remain equivalent first-class action cards;
- icons may clarify actions but must not reveal the correct answer through unique success-like styling before selection;
- success/retry feedback must discuss the selected environmental action, not body health.

For `body_health`:
- current copy, visuals, metadata, and browser behavior remain stable unless an additive internal abstraction is necessary.

## Required config hardening

The current `healthyHabitRoutineConfig` returns a config by ID and does not independently validate exact prompt/order/answer/stage/runtime.

A later reuse implementation should make the full eight-ID family fail closed.

For each approved activity require:
- exact subject `science`;
- exact stage `science-earth-body-environment`;
- exact activity ID;
- runtime `tap_choice`;
- exact canonical prompt;
- exactly three canonical choices in exact order;
- exact `correctChoice`;
- exact domain variant;
- exact explicit visuals for every canonical choice.

No prompt parser, prefix classifier, or generic “positive action” detector is approved.

## Evidence metadata boundary

Canonical evidence remains `choice_accuracy_v1`.

For existing body-health IDs, preserve current metadata semantics:

```text
source: healthy-habit-routine-runtime
evidenceFidelity: choice_healthy_habit_routine_interaction
routineLabel
cueLabel
selectedHabit
```

For environment-care IDs, use domain-correct metadata. A safe additive contract would use:

```text
source: healthy-habit-routine-runtime
evidenceFidelity: choice_environment_care_action_interaction
domainVariant: environment_care
goalLabel
cueLabel
selectedAction
```

Exact key names may be refined during implementation, but body-health historical metadata must not be silently redefined.

## Required regression/browser proof

Before a later runtime merge:
1. exactly four body-health + four environment-care direct-choice activities classify as `healthy_habit_routine`;
2. `science-match-environment-actions-c` remains `visible_matching`;
3. all eight configs fail closed on ID/subject/stage/runtime/prompt/order/answer drift;
4. old body-health child copy, evidence, and visual behavior remain unchanged;
5. environment-care child copy contains no body-health-specific wording;
6. all three canonical environment actions are equivalent selectable controls before submission;
7. wrong selection increments incorrect/retry and cannot complete;
8. correct selection completes through canonical assessed evidence;
9. keyboard, pointer and actual touch are covered;
10. representative environment route covers 320x720, 390x844 and 768x1024 idle/wrong/success;
11. no horizontal overflow;
12. feedback and success CTA remain visible on short viewport;
13. icons do not leak the answer before submission;
14. permanent visual QA remains P0=0/P1=0;
15. gameplay distribution remains 900/900 classified;
16. deterministic activity-quality remains clean.

## Distribution impact

Current code truth before environment-care reuse:

```text
47 active patterns
choice_grid                228 / 900
healthy_habit_routine        4 / 900
set_reasoning               10 / 900
spatial_relation_board        6 / 900
compare_properties            3 / 900
cloze_sentence_choice         5 / 900
```

If **only this four-ID environment-care reuse** were later implemented and verified from the current code baseline:

```text
47 active patterns
choice_grid                224 / 900
healthy_habit_routine        8 / 900
```

If all already-audited pending reuse waves later ship and pass every gate:

```text
47 active patterns
choice_grid                210 / 900
set_reasoning               10 / 900
spatial_relation_board      11 / 900
compare_properties            7 / 900
cloze_sentence_choice       10 / 900
healthy_habit_routine         8 / 900
```

These are future expected distributions only. This audit changes no runtime classification.

## Explicit non-scope

This audit does not approve:
- `science-match-environment-actions-c`;
- Wave D cause/effect environment activities;
- arbitrary Science “good action” questions;
- content rewrites;
- mastery/progression changes;
- schema/database migrations;
- renaming Pattern #22 across historical evidence;
- creating a new environment-specific pattern;
- Pattern #48;
- runtime work before prerequisite live/audit gates are resolved.

## Decision

**Reuse existing Pattern #22 `healthy_habit_routine` for exactly four Science `science.environment.care.basic` direct-choice activities is justified, provided implementation uses an explicit `environment_care` domain variant and does not mislabel them as body-health habits.**

This preserves the actual evidence shape—select the correct everyday action for a familiar context—without cosmetic taxonomy inflation.

## Post-merge audit verification

PR #212 merged the docs-only audit to main `0fccffd769211e5b47be81ec5126c913d9c26fec`. Exact-head PR CI #976 / run `35409354940` passed. Push-to-`main` CI #977 / run `35409698981` then passed the full matrix including exact-SHA Cloudflare production smoke for `0fccffd7...`.

This audit is therefore live verified. Runtime stays queued behind the earlier Math and English reuse waves.

## Next gate

1. keep this audit queued behind the prior reuse runtime closures;
2. when eligible, implement exact eight-ID config with explicit `body_health` vs `environment_care` domain variants;
3. preserve legacy body-health copy/metadata and keep `science-match-environment-actions-c` as matching;
4. require exact-head CI, environment keyboard/pointer/actual-touch QA, manual visual acceptance, exact merge and merged-main Cloudflare verification.
