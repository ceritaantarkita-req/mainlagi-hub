# Math Mixed-Operation Existing-Mechanic Reuse Audit — 20 September 2026

Status: **AUDIT MERGED / LIVE VERIFIED / EXACT 4-ID RUNTIME FULLY CLOSED / NO PATTERN #48**

## Verified baseline

```text
Audit base main:             929a1363b4d0594bc3f21720ee528ae7c5f9bd47
Final publication CI:        #1085 / run 35460471630 — full success
Cloudflare production:       exact base SHA PASS
Activities classified:       900 / 900
Unclassified:                  0
Active gameplay patterns:     47
choice_grid:                 183 / 900
make_total:                    5 / 900
take_away:                     5 / 900
number_line:                  11 / 900
Activity quality:            KEEP 900
```

Current remaining `choice_grid` inventory:

```text
Iqro      58
Science   41
Logic     26
Bahasa    24
Math      17
English   17
total    183
```

Iqro remains excluded from mechanic transformation until expert acceptance exists.

## Audit merge verification

```text
Audit PR:             #237
Audit exact head:     64952f163ff426c2f79e1e5ca18d243627022072
Audit PR CI:          #1086 / run 35461546179 — full success
Audit main:           c01d0bac15e438640cacb5958db31c1a6ad36c66
Audit-main CI:        #1087 / run 35461876251 — full success
Cloudflare smoke:     exact audit-main SHA PASS
```

CI #1087 verified production is serving exact audit-main `c01d0bac15e438640cacb5958db31c1a6ad36c66` on branch `main` with canonical Cloudflare + Supabase target.

Runtime implementation is merged and live verified through PR #238 -> main `710ecdbad3f68b88bc3d6330f9c77cc7f9ad7f24`; final PR CI #1095 and runtime-main CI #1096 both passed, including exact Cloudflare production smoke. The audit decision remains exact: two mixed additions -> `make_total`, two mixed subtractions -> `take_away`, operation-selection excluded, no Pattern #48.

## Why this audit exists

Pattern #48 remains **NO JUSTIFIED NEW PATTERN YET**.

The correct next step is therefore to review remaining generic direct-choice activities for exact reuse of already-validated mechanics before inventing another interaction taxonomy.

Within the remaining Math inventory, `math.pack.mixed-operations` contains five direct-choice activities. Four of them ask the learner to **compute a numeric addition/subtraction result**. The fifth asks the learner to **choose the correct operation expression**.

Those evidence forms must not be collapsed together.

## Exact approved reuse scope

### Addition -> existing `make_total`

```text
math-mixed-add-2-3
math-mixed-add-4-4
```

Canonical evidence:

```text
math-mixed-add-2-3
title:   Campuran: 2 + 3
prompt:  2 + 3 = ?
choices: 4 / 5 / 6
answer:  5

math-mixed-add-4-4
title:   Campuran: 4 + 4
prompt:  Empat ditambah empat hasilnya?
choices: 6 / 7 / 8
answer:  8
```

These activities ask the learner to combine two known addends and select the total. That is the same assessed interaction evidence represented by existing `make_total`.

### Subtraction -> existing `take_away`

```text
math-mixed-sub-6-1
math-mixed-sub-9-3
```

Canonical evidence:

```text
math-mixed-sub-6-1
title:   Campuran: 6 − 1
prompt:  6 − 1 = ?
choices: 4 / 5 / 6
answer:  5

math-mixed-sub-9-3
title:   Campuran: 9 − 3
prompt:  Sembilan dikurangi tiga hasilnya?
choices: 5 / 6 / 7
answer:  6
```

These activities ask the learner to start from a known quantity, remove a known quantity, and select the remainder. That is the same assessed interaction evidence represented by existing `take_away`.

## Canonical boundaries

All four reuse candidates currently share:

```text
subject:        math
stage:          math-ukur-ruang
lesson:         math-mixed-operations
pack:           math.pack.mixed-operations
skill:          math.operation.mixed
runtime:        tap_choice
assessment:     assessed
evidence:       choice_accuracy_v1
choices:        exactly 3 numeric strings
```

Reuse does **not** change the skill from `math.operation.mixed` to the earlier Wave C addition/subtraction skills.

The child-facing mechanic may be reused while canonical curriculum identity and evidence ownership remain unchanged.

## Explicit exclusion — choose the operation

```text
math-mixed-choose-add
```

Canonical evidence:

```text
prompt:
Ada 3 balok lalu ditambah 2 balok. Operasi mana yang cocok?

choices:
3 + 2
3 − 2
2 − 3

answer:
3 + 2
```

This activity does not ask for a numeric result. It asks the learner to map a story/action to an operation representation.

It is therefore **not approved** for either `make_total` or `take_away`.

A concrete addition/subtraction board would answer a different question than the canonical assessment.

## Objective / evidence fit

### `make_total`

Existing `make_total` evidence is:

1. show two known non-empty groups;
2. keep result masked;
3. learner chooses one canonical numeric total;
4. wrong remains retryable and cannot complete;
5. correct choice completes the same activity;
6. measured evidence remains one assessed choice interaction.

The two mixed-add activities have exactly that evidence form.

### `take_away`

Existing `take_away` evidence is:

1. show a known starting quantity;
2. mark a known removed subset;
3. keep remainder masked;
4. learner chooses one canonical numeric remainder;
5. wrong remains retryable and cannot complete;
6. correct choice completes the same activity.

The two mixed-sub activities have exactly that evidence form.

No new interaction pattern is justified.

## Existing implementation compatibility

`MakeTotalActivity` and `TakeAwayActivity` are already stage-agnostic at the component layer:
- back navigation derives from `activity.subjectId`;
- title/narration derive from the canonical activity;
- assessed status derives from the canonical learning spec;
- completion uses the canonical activity ID;
- evidence records the existing mechanic-specific fidelity while preserving the activity's canonical curriculum identity.

The current eligibility layer is more restrictive than the component layer:
- `gameplayPresentation.ts` limits `make_total` and `take_away` to `math-operasi-awal`;
- the current config maps only the five Wave C IDs for each family.

That restriction is an implementation boundary, not a pedagogical reason to create a new pattern.

## Required implementation hardening

The current `makeTotalConfig.ts` and `takeAwayConfig.ts` predate the stricter exact/fail-closed reuse standard now used by newer waves.

Implementation must not merely widen the stage condition or add a broad prompt parser.

### Expected exact families after implementation

```text
make_total
legacy Wave C: 5
mixed reuse:   2
total:         7

take_away
legacy Wave C: 5
mixed reuse:   2
total:         7
```

Each config should own explicit canonical identity metadata and fail closed on:
- exact activity ID;
- subject;
- exact expected stage;
- runtime;
- canonical title;
- canonical prompt;
- exact three-choice order;
- canonical correct answer;
- explicit reviewed arithmetic counts;
- arithmetic result matching the canonical answer.

No eligibility inference from generic numeric prompt shape is approved.

`gameplayPresentation.ts` should delegate eligibility to the hardened config rather than maintaining a second broader allowlist if practical.

## Expected distribution after runtime reuse

If exactly these four activities are implemented:

```text
activities:          900
classified:          900
unclassified:          0
active patterns:      47
choice_grid:         179
make_total:            7
take_away:             7
number_line:          11
KEEP:                 900
```

Math `choice_grid` is expected to move from 17 to 13.

Pattern count remains **47**.

No Pattern #48 is created.

## Required implementation QA

Before merge:

1. exact 7-ID `make_total` regression;
2. exact 7-ID `take_away` regression;
3. fail-closed drift checks for subject/stage/runtime/title/prompt/choice order/answer;
4. explicit exclusion test for `math-mixed-choose-add`;
5. representative mixed-add browser route at 320 / 390 / 768;
6. representative mixed-sub browser route at 320 / 390 / 768;
7. keyboard wrong/retry and false-completion guard;
8. pointer + actual touchscreen completion;
9. >=44px touch targets and no horizontal overflow;
10. assessed evidence preserves `choice_make_total_interaction` / `choice_take_away_interaction`;
11. canonical skill remains `math.operation.mixed`;
12. legacy Make Total and Take Away browser suites remain green;
13. gameplay distribution exactly 900/900 / 47 / 179 / 7 / 7;
14. activity quality remains KEEP 900;
15. manual visual review of representative idle/retry/success states;
16. exact-head CI, exact-head merge, merged-main exact-SHA production smoke.

## Other fresh-audit findings

### English initial sound

`english-initial-ball` and `english-initial-sun` remain excluded from existing Bahasa `initial_sound`.

Existing `initial_sound` asks the learner to choose the initial **letter** of a known word.

The English activities ask the learner to choose a **word** that begins with a target sound/letter.

Those are different interaction-evidence structures.

### Science force/motion

The prior rejection remains valid as one family. Push, pull, gravity direction and friction-result questions are heterogeneous and should not be forced into one relation mechanic.

### Heterogeneous reviews

Science mixed review and broad Math review remain intentionally heterogeneous and are not authorized as one mechanic family.

## Audit conclusion

**Reuse existing `make_total` for exactly two Math mixed-add direct-result activities and existing `take_away` for exactly two Math mixed-sub direct-result activities.**

Keep `math-mixed-choose-add` outside both mechanics.

Do not create Pattern #48.

Runtime implementation was limited to this exact four-ID reuse scope and is now live verified. No additional family is pre-approved by this audit.
