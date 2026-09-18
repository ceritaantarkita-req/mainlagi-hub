# Pattern #44 Objective / Evidence Audit — 18 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `18a4dd30ce58841dd3717b1e53c13af628e950af`  
Baseline state: **900/900 classified / 43 active patterns / `choice_grid` 249/900**.  
Verified audit-base CI: **#902 / run `35299122394` — full success including exact merged-main production verification**.

## Audit rule

Pattern #44 is selected only if the current interaction materially under-represents the learning objective. Existing mechanics must be reused when they already express the same evidence model.

Closest alternatives reviewed:
- Math numeral recognition: a fresh new mechanic is not justified; existing symbol-identification treatment can be generalized if later evidence shows a presentation gap.
- Math counting 2–10: already represented by `count_and_select`.
- Math number/quantity matching: already represented by canonical matching.
- Math comparison, number-order, pattern, addition, subtraction and grouping families: already have dedicated mechanics.
- Recent Bahasa/English/Logic/Science candidates rejected in Pattern #43 remain unapproved; this audit does not revive them.

## Selected candidate

Working pattern:

```text
subitizing_glance
```

Exact scope:

```text
math-subitize-2
math-subitize-4
math-subitize-5
```

Canonical ownership:

```text
subject:     math
stage:       math-jumlah-dasar
lesson:      math-subitizing
pack:        math.pack.subitizing
skill:       math.quantity.subitizing
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Lesson objective: **Mengenali jumlah kecil dari susunan visual tanpa harus selalu menghitung satu per satu.**

Skill description: **Mengenali jumlah kecil dari susunan visual dengan cepat.**

## Exact canonical tasks

```text
math-subitize-2
  prompt: Tanpa menghitung lama, berapa titik yang terlihat: ● ● ?
  choices: 1 | 2 | 3
  correct: 2

math-subitize-4
  prompt: Lihat pola ● ● / ● ●. Ada berapa titik?
  choices: 3 | 4 | 5
  correct: 4

math-subitize-5
  prompt: Lihat pola seperti dadu lima. Berapa jumlah titiknya?
  choices: 4 | 5 | 6
  correct: 5
```

## Why a distinct interaction is justified

All three activities measure **subitizing**: recognizing a small quantity from a visual arrangement quickly, without relying on one-by-one enumeration.

Generic `choice_grid` keeps the answer choices but leaves the quantity pattern embedded in prompt text. It does not present the canonical spatial arrangement as the primary evidence-bearing stimulus.

A dedicated board can make the intended evidence visible as:

```text
SPATIAL DOT PATTERN -> NUMERIC CHOICE
```

without adding a new assessed step or changing the canonical answer.

## Why this is not existing `count_and_select`

`count_and_select` is explicitly an enumeration mechanic. Its current child-facing instruction says **"Hitung benda satu per satu"**, and its rendering derives a repeated object set from the numeric target.

That is appropriate for `math.count.4_10`, but it conflicts with the subitizing objective, which explicitly asks the learner to recognize a small visual quantity **without always counting one by one**.

Pattern #44 therefore must not reuse the count-and-select presentation unchanged.

The new presentation must remain evidence-conservative:
- no forced timer;
- no automatic hiding of the stimulus;
- no speed score;
- no invented intermediate answer;
- no altered canonical choice set.

## Deterministic model

Implementation must use exact-ID config only; no prompt parser.

Suggested modes:

```text
pair
  math-subitize-2

square
  math-subitize-4

dice_five
  math-subitize-5
```

Each config must explicitly define:
- expected canonical prompt;
- exact canonical choices/order and `correctChoice`;
- deterministic dot positions;
- accessible visual label;
- presentation mode.

The board must not visually reveal the correct numeric answer before selection.

## Evidence contract

No canonical learning contract changes:
- exact IDs unchanged;
- subject/stage/lesson/pack/skill unchanged;
- runtime remains `tap_choice`;
- assessment remains assessed;
- evidence remains `choice_accuracy_v1`;
- prompts, choices/order and `correctChoice` stay byte-preserved;
- wrong answer is measured/retryable and cannot complete;
- correct answer completes through the existing attempt/evidence path;
- no mastery/progression/schema/database migration.

Suggested presentation metadata:

```text
source: subitizing-glance-runtime
evidenceFidelity: choice_subitizing_interaction
patternMode
selectedChoice
```

## Acceptance target after implementation

```text
900 / 900 classified
0 unclassified
44 active patterns
choice_grid                     246 / 900
subitizing_glance                 3 / 900
```

Required gates: exact three-ID regression, fail-closed config drift tests, unchanged `count_and_select` scope, canonical prompt/choice/answer preservation, keyboard + pointer + actual touch, wrong/success evidence, responsive 320/390/768 QA, permanent visual QA, full Ubuntu/Windows/build/security CI, exact-head merge, and merged-main Cloudflare production smoke.

## Decision

**Pattern #44 is justified as `subitizing_glance` for exactly the three Math Wave A subitizing activities above.**

No other family is approved by this audit.
