# Number Line Math Missing-Number Reuse Audit — 19 September 2026

Status: **AUDIT MERGED / LIVE VERIFIED / EXISTING `number_line` REUSE JUSTIFIED / EXACT 5-ID SCOPE / RUNTIME IMPLEMENTATION ACTIVE**

## Verified baseline

```text
Audit base main:             1fa2da0ace6c3e90dd37483f4585adae90a70d4d
Final picture-word CI:       #1058 / run 35451391448 — full success
Cloudflare production:       exact base SHA PASS
Activities classified:       900 / 900
Unclassified:                  0
Active gameplay patterns:     47
choice_grid:                 188 / 900
number_line:                   6 / 900
picture_word_match:           23 / 900
Activity quality:            KEEP 900
```

Production smoke for the audit base verified `1fa2da0ace6c3e90dd37483f4585adae90a70d4d` on branch `main` with the canonical Cloudflare site and canonical Supabase project.

The latest gameplay-distribution artifact from CI #1058 reports the remaining `choice_grid` inventory as:

```text
Iqro      58
Science   41
Logic     26
Bahasa    24
Math      22
English   17
total    188
```

Iqro remains outside mechanic transformation until expert acceptance exists.

## Audit merge verification

```text
Audit PR:             #231
Audit PR head:        e796a3417d2209e19a9f515a1202843a24671a07
Audit PR CI:          #1059 / run 35453117130 — full success
Audit main:           31c03adac0d143e128996321588af514762c4cbd
Audit-main CI:        #1060 / run 35453492536 — full success
Cloudflare smoke:     exact audit-main SHA PASS
```

CI #1060 verified production is serving audit-main `31c03adac0d143e128996321588af514762c4cbd` on branch `main` with canonical Cloudflare + Supabase target.

Runtime implementation is now active on `agent/math-missing-number-line-reuse-20260919`. The audit decision itself remains unchanged: reuse existing `number_line`, do not create Pattern #48.

## Why this audit exists

The original Number Line wave explicitly scoped exactly six Math Wave B ordering activities and deliberately excluded Wave C `math-missing-*` activities pending a **separate objective review**.

That separate review is now complete.

Existing Pattern `number_line` represents relative numeric position using:
- a compact local number line;
- stable context values;
- three canonical answer choices;
- forward / backward / between position reasoning;
- one assessed canonical choice;
- evidence fidelity `choice_number_line_interaction`.

The Wave C missing-number family tests the same underlying evidence form: identify the missing numeric position in a short ordered sequence.

A new Pattern #48 is therefore not justified.

## Exact approved reuse scope

Exactly these five assessed Math activities are approved for reuse:

```text
math-missing-1-3
math-missing-3-5
math-missing-before-6
math-missing-after-8
math-missing-descend-10-8
```

Canonical source boundary:

```text
subject:        math
stage:          math-operasi-awal
lesson:         math-missing-numbers
pack:           math.pack.missing-numbers
skill:          math.sequence.missing_number
runtime:        tap_choice
evidence:       choice_accuracy_v1
choices:        exactly 3 numeric strings
assessment:     assessed
```

Canonical objective:

> Menemukan angka yang hilang pada urutan pendek.

No canonical activity content, answer, activity ID, skill, assessment, progression or database row is approved for rewrite.

## Exact activity evidence

### `math-missing-1-3`

```text
prompt:  1, ..., 3. Angka yang hilang?
choices: 0 / 2 / 4
answer:  2
```

Approved local line model:

```text
min/max: 0..4
context: 1, 3
mode:    between
```

### `math-missing-3-5`

```text
prompt:  3, ..., 5. Pilih angka di tengah.
choices: 2 / 4 / 6
answer:  4
```

Approved local line model:

```text
min/max: 2..6
context: 3, 5
mode:    between
```

### `math-missing-before-6`

```text
prompt:  ..., 6, 7. Angka apa yang hilang?
choices: 4 / 5 / 8
answer:  5
```

Approved local line model:

```text
min/max: 4..8
context: 6, 7
mode:    left
```

### `math-missing-after-8`

```text
prompt:  7, 8, ... lanjutkan urutannya.
choices: 6 / 9 / 10
answer:  9
```

Approved local line model:

```text
min/max: 6..10
context: 7, 8
mode:    right
```

### `math-missing-descend-10-8`

```text
prompt:  10, ..., 8. Angka yang hilang saat turun?
choices: 7 / 9 / 11
answer:  9
```

Approved local line model:

```text
min/max: 7..11
context: 10, 8
mode:    left
```

## Objective/evidence fit

Reuse is justified because all five activities preserve the same assessed checkpoint:

1. observe one or two known sequence positions;
2. infer one missing adjacent/intermediate numeric position;
3. select exactly one of the canonical three numeric choices;
4. canonical completion occurs only after the correct choice;
5. the existing mastery evidence remains one choice-accuracy event.

The Number Line presentation adds a spatial representation of the same evidence; it does not add a second assessed step or change the answer.

## Existing mechanic compatibility

The existing `NumberLineActivity` already supports:
- `right`;
- `left`;
- `between`;
- explicit `min` / `max`;
- explicit context values;
- exactly three canonical interactive numeric choices;
- keyboard wrong/retry;
- pointer/touch completion;
- assessed retry/accuracy measurement;
- >=44px choice targets;
- no-horizontal-overflow QA;
- in-viewport success CTA.

No new child-facing mechanic is required.

## Required implementation hardening

The old six-ID Number Line config/classifier predates the stricter reuse waves and is not sufficiently fail-closed by current standards.

Any implementation PR must first make the complete Number Line family explicit and fail closed.

Expected combined family:

```text
legacy Wave B: 6
new Wave C:    5
total:        11
```

Required exact validation per ID:
- activity ID;
- subject;
- stage;
- runtime;
- canonical title;
- canonical prompt;
- exact three-choice order;
- correct answer;
- explicit local-line config;
- all choices visible on the configured local line.

Drift in any required canonical property must fall back to `choice_grid`.

Do not infer Number Line eligibility from prompt text or generic numeric shape.

## Explicit exclusions

Not approved by this audit:

### Other Wave C Math families

```text
math-group-*
math-add-*
math-sub-*
math-length-*
math-size-*
```

They have separate objectives and existing candidate mechanics.

### Math mixed review

```text
math-mixed-*
math-review-*
```

The review pack is heterogeneous and must not be promoted as one mechanic family.

### English initial-sound direct choice

```text
english-initial-ball
english-initial-sun
```

These are **not** approved for existing `initial_sound` reuse. The existing Bahasa mechanic asks the learner to select a letter, while these English activities ask the learner to select a word beginning with the target sound. The interaction evidence is not identical.

### Iqro

No Iqro mechanic transformation is authorized without external expert acceptance.

## Expected distribution after runtime reuse

If exactly these five IDs are implemented:

```text
900 / 900 classified
0 unclassified
47 active gameplay patterns
choice_grid   183 / 900
number_line    11 / 900
```

Pattern count remains **47**.

This audit does not create Pattern #48 and does not move the WS-05 target from 50.

## Required QA for implementation

Before runtime merge:

1. exact 11-ID Number Line regression;
2. fail-closed drift tests for subject/stage/runtime/title/prompt/choice order/answer;
3. representative Wave C browser route, preferably `math-missing-descend-10-8` or `math-missing-before-6`;
4. legitimate progression readiness for `math-operasi-awal`;
5. keyboard wrong/retry and false-completion guard;
6. pointer completion;
7. actual touchscreen completion at least at 320 and 768;
8. 320x720 / 390x844 / 768x1024 responsive screenshots;
9. >=44px targets and no horizontal overflow;
10. assessed evidence with incorrect/retry/accuracy checks;
11. legacy six-ID Number Line browser QA remains green;
12. gameplay distribution exactly 900/900 / 47 / 183 / 11;
13. activity quality remains KEEP 900;
14. manual nine-shot P0/P1 review;
15. exact-head CI, merge, merged-main exact-SHA production smoke and post-merge docs closure.

## Audit conclusion

**Reuse existing `number_line` for exactly five Math Wave C missing-number activities.**

Do not create Pattern #48.

Do not start a broad Math rewrite.

The next runtime implementation, if executed, should be the exact five-ID Number Line reuse with an explicit hardened eleven-ID family and no curriculum/evidence/schema migration.
