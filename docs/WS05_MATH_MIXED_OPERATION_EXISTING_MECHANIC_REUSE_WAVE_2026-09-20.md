# WS-05 Math Mixed-Operation Existing-Mechanic Reuse Wave — 20 September 2026

Status: **IMPLEMENTATION ACCEPTED / FINAL EXACT-HEAD CI REQUIRED / AUDIT LIVE VERIFIED**

## Audit gate

```text
Audit PR:             #237
Audit exact head:     64952f163ff426c2f79e1e5ca18d243627022072
Audit PR CI:          #1086 / run 35461546179 — full success
Audit main:           c01d0bac15e438640cacb5958db31c1a6ad36c66
Audit-main CI:        #1087 / run 35461876251 — full success
Cloudflare smoke:     exact audit-main SHA PASS
```

Production health verified:
- release SHA `c01d0bac15e438640cacb5958db31c1a6ad36c66`;
- branch `main`;
- site `https://mainlagihub.my.id`;
- data backend `supabase`;
- Supabase project `estvtgflwkebomsqlolv`.

Audit record: `MATH_MIXED_OPERATION_EXISTING_MECHANIC_REUSE_AUDIT_2026-09-20.md`.

## Exact runtime scope

Reuse existing mechanics for exactly four Math mixed-operation direct-result activities.

### Existing `make_total`

```text
math-mixed-add-2-3
math-mixed-add-4-4
```

### Existing `take_away`

```text
math-mixed-sub-6-1
math-mixed-sub-9-3
```

Explicitly excluded:

```text
math-mixed-choose-add
```

That activity asks which operation expression matches a story. It does not ask for a numeric result and must remain outside both mechanics.

No Pattern #48 is created.

## Curriculum / evidence contract

Canonical learning identity remains unchanged for all four reuse activities:

```text
subject:        math
stage:          math-ukur-ruang
lesson:         math-mixed-operations
pack:           math.pack.mixed-operations
skill:          math.operation.mixed
runtime:        tap_choice
assessment:     assessed
evidence:       choice_accuracy_v1
```

The mechanics change presentation only.

No change is approved to:
- activity IDs;
- title/prompt;
- choice order;
- correct answers;
- canonical skill;
- assessment;
- stars;
- mastery;
- progression;
- schema/database rows.

## Hardened exact families

### `make_total`

Expected complete family after this wave:

```text
legacy Wave C: 5
mixed reuse:   2
total:         7
```

Exact IDs:

```text
math-add-1-1
math-add-2-1
math-add-2-2
math-add-3-2
math-add-4-3
math-mixed-add-2-3
math-mixed-add-4-4
```

### `take_away`

Expected complete family:

```text
legacy Wave C: 5
mixed reuse:   2
total:         7
```

Exact IDs:

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
math-mixed-sub-6-1
math-mixed-sub-9-3
```

Both configs now fail closed on:
- explicit ID/config membership;
- Math subject;
- exact expected stage;
- `tap_choice` runtime;
- exact canonical title;
- exact canonical prompt;
- exact three-choice order;
- canonical answer;
- arithmetic consistency;
- valid reviewed visual quantities.

`gameplayPresentation.ts` delegates eligibility to the hardened configs instead of duplicating old five-ID stage-specific allowlists.

## Mixed-operation visual models

```text
math-mixed-add-2-3
2 + 3 = 5
make_total / two visible groups / masked total

math-mixed-add-4-4
4 + 4 = 8
make_total / two visible groups / masked total

math-mixed-sub-6-1
6 − 1 = 5
take_away / start 6 / remove 1 / masked remainder

math-mixed-sub-9-3
9 − 3 = 6
take_away / start 9 / remove 3 / masked remainder
```

## Regression contract

Focused Make Total regression now requires:
- exact seven-ID family;
- five legacy + two mixed split;
- canonical stage by family;
- mixed activities retain `math.operation.mixed`;
- assessed status;
- exact arithmetic visual model;
- fail-closed title/prompt/choice-order/answer/stage/subject/runtime drift;
- explicit exclusion of `math-mixed-choose-add`.

Focused Take Away regression enforces the analogous seven-ID contract.

General gameplay-presentation regression also expects exact 7 + 7 families.

## Dedicated browser QA

Script:

`run-math-mixed-operation-reuse-browser-tests.mjs`

Representative routes:

```text
/child/demo-gian/activity/math-mixed-add-4-4
/child/demo-gian/activity/math-mixed-sub-9-3
```

Viewports / completion modes:
- 320x720 — actual touchscreen;
- 390x844 — pointer;
- 768x1024 — actual touchscreen.

Required checks:
- legitimate Math progression readiness through `math-ukur-ruang`;
- exact route retained;
- activity not pre-completed;
- exact canonical visual quantities;
- result stays masked before correct completion;
- exact canonical choice order;
- keyboard wrong/retry;
- wrong answer cannot complete or reveal result;
- pointer/touch correct completion;
- >=44px choice targets;
- no horizontal overflow;
- feedback and CTA fully visible;
- assessed evidence source/fidelity/count metadata;
- incorrect=1 / retry=1 / accuracy=0.5;
- no page/console errors;
- explicit `math-mixed-choose-add` route does not render either mechanic.

Dedicated evidence output: 18 screenshots (add + sub × idle/retry/success × 320/390/768).

Legacy Make Total and Take Away browser suites remain wired in the same mobile-route gate.

## Expected branch truth

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
POLISH:                 0
REDESIGN:               0
REPLACE:                0
```

Math `choice_grid` should be 13.

## Audit-main artifacts

CI #1087:

```text
mobile-route-qa-screenshots
artifact: 10589886830
sha256:73e316bbf2cd054ca55e0ee2b9e855f31abb1a0b7291302e159b0246549ab581

gameplay-distribution-audit
artifact: 10589094618
sha256:e3e1a21e7a81acad1b3af8027b3ab6af1faff2f3a6a67bc4f4cfeff908281e7a

activity-quality-audit
artifact: 10588919924
sha256:4483c5e6746f096ebf4058fb5dd84a834a7bdbd7910ac9662ae3264ee927569e
```

## Implementation acceptance checkpoint

```text
Implementation PR:       #238
Accepted runtime head:   33d05c520ee6439f0c4d60ed80e8d238a2e18218
CI:                      #1090 / run 35488429991 — full success
Production smoke:        skipped on PR by design
```

Verified CI #1090 artifact truth:

```text
activities:              900
classified:              900
unclassified:              0
active patterns:          47
choice_grid:             179
make_total:                7
take_away:                 7
number_line:              11
Math choice_grid:         13
KEEP:                     900
POLISH:                     0
REDESIGN:                   0
REPLACE:                    0
structural findings:        0
```

Artifacts:

```text
activity-quality-audit
artifact: 10598637144
sha256:63013a2f2f706e1edf55bf05423b4fb805035e11ad398e993741d6ba12a5dfda

gameplay-distribution-audit
artifact: 10598622505
sha256:506375fc7a7ecef83a93d46fe301bfdaa1db49a8b64eb7b3e95aaeb3885df7f6

mobile-route-qa-screenshots
artifact: 10597782774
sha256:eb30b78ec09f27a7173f8fb1d4284176ce934ce6780602bcc9b8eed27ad40066
```

Dedicated screenshots reviewed manually:

```text
320-mixed-add-idle.png
320-mixed-add-try.png
320-mixed-add-success.png
390-mixed-add-idle.png
390-mixed-add-try.png
390-mixed-add-success.png
768-mixed-add-idle.png
768-mixed-add-try.png
768-mixed-add-success.png

320-mixed-sub-idle.png
320-mixed-sub-try.png
320-mixed-sub-success.png
390-mixed-sub-idle.png
390-mixed-sub-try.png
390-mixed-sub-success.png
768-mixed-sub-idle.png
768-mixed-sub-try.png
768-mixed-sub-success.png
```

Manual visual acceptance:

```text
P0 = 0
P1 = 0
result = ACCEPTED
```

Acceptance notes:
- mixed-add and mixed-sub quantities remain visually clear at all three widths;
- wrong/retry state remains visible without completing or revealing the result;
- success state remains visible with feedback + CTA in viewport;
- the initial 320px CTA overflow was fixed;
- the subsequent 390px CTA overflow was fixed;
- 320 and 768 actual-touch completion plus 390 pointer completion passed;
- legacy Make Total and Take Away browser QA remained green;
- explicit operation-selection exclusion remained green.

Because this acceptance evidence updates docs after the accepted runtime checkpoint, the final PR head must pass the complete CI gate once more before merge.

## Before merge

1. exact runtime PR head full CI green;
2. focused Make Total / Take Away regressions green;
3. dedicated mixed-operation browser QA green;
4. legacy mechanic browser QA green;
5. distribution exactly 900/900 / 47 / 179 / 7 / 7;
6. activity quality KEEP 900;
7. manual visual review of all 18 dedicated screenshots with P0=0/P1=0;
8. review threads/comments clean;
9. exact-head squash merge;
10. merged-main full CI + exact Cloudflare production smoke;
11. post-merge closure documentation.

Pattern #48 remains **not justified**.
