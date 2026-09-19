# WS-05 Number Line Math Missing-Number Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACCEPTED / FINAL EXACT-HEAD CI REQUIRED / AUDIT LIVE VERIFIED**

## Audit gate

```text
Audit PR:             #231
Audit head:           e796a3417d2209e19a9f515a1202843a24671a07
Audit PR CI:          #1059 / run 35453117130 — full success
Audit main:           31c03adac0d143e128996321588af514762c4cbd
Audit-main CI:        #1060 / run 35453492536 — full success
Cloudflare smoke:     exact audit-main SHA PASS
```

Production health verified:
- release SHA `31c03adac0d143e128996321588af514762c4cbd`;
- branch `main`;
- site `https://mainlagihub.my.id`;
- data backend `supabase`;
- Supabase project `estvtgflwkebomsqlolv`.

Audit record: `NUMBER_LINE_MATH_MISSING_NUMBER_REUSE_AUDIT_2026-09-19.md`.

## Exact runtime scope

Reuse existing `number_line` for exactly five Math Wave C activities:

```text
math-missing-1-3
math-missing-3-5
math-missing-before-6
math-missing-after-8
math-missing-descend-10-8
```

The complete Number Line family becomes exactly 11 IDs:
- 6 legacy Math Wave B ordering activities;
- 5 audited Math Wave C missing-number activities.

No Pattern #48 is created.

## Runtime contract

Canonical contracts remain unchanged:
- activity IDs;
- subject;
- stage;
- title;
- prompt;
- three-choice order;
- correctChoice;
- runtime `tap_choice`;
- assessed status;
- skill mapping;
- stars;
- completion identity;
- mastery/progression model;
- schema/database rows.

Assessed evidence remains:

```text
source: number-line-runtime
evidenceFidelity: choice_number_line_interaction
lineDirection
lineMin
lineMax
contextValues
```

## Exact fail-closed hardening

`numberLineConfig.ts` now owns all 11 explicit identities and validates:
- exact activity ID through config lookup;
- subject = Math;
- exact expected stage;
- runtime = `tap_choice`;
- exact canonical title;
- exact canonical prompt;
- exact three-choice order;
- exact canonical correct answer;
- five-tick local range;
- context values inside that range;
- every canonical numeric choice visible on the configured range.

Any drift falls back out of `number_line`.

`gameplayPresentation.ts` no longer maintains a second broad Number Line allowlist. Classification delegates to the exact config.

## New Wave C line models

```text
math-missing-1-3
range 0..4 / context 1,3 / between / answer 2

math-missing-3-5
range 2..6 / context 3,5 / between / answer 4

math-missing-before-6
range 4..8 / context 6,7 / left / answer 5

math-missing-after-8
range 6..10 / context 7,8 / right / answer 9

math-missing-descend-10-8
range 7..11 / context 10,8 / left / answer 9
```

## Automated regression

Focused `run-number-line-tests.mjs` requires:
- exact 11-ID family;
- 6 legacy + 5 reuse split;
- assessed status;
- numeric three-choice contract;
- all choices visible on the local line;
- exact five-tick local line;
- title drift fail closed;
- prompt drift fail closed;
- choice-order drift fail closed;
- answer drift fail closed;
- stage drift fail closed;
- subject drift fail closed;
- runtime drift fail closed;
- explicit unrelated exclusions.

The general gameplay-presentation regression also expects exactly 11 Number Line activities across the two audited Math stages.

## Browser QA

Dedicated browser QA:
`run-number-line-math-missing-reuse-browser-tests.mjs`

Representative route:

```text
/child/demo-gian/activity/math-missing-descend-10-8
```

Viewports:
- 320x720 — touchscreen completion;
- 390x844 — pointer completion;
- 768x1024 — touchscreen completion.

Assertions include:
- legitimate progression readiness;
- exact route retained;
- canonical activity title;
- reviewed Number Line cue;
- five ticks exactly 7,8,9,10,11;
- canonical known context 10 and 8;
- exact canonical choices 7,9,11;
- idle cannot complete;
- keyboard wrong answer produces retry state;
- wrong answer cannot complete;
- pointer/touch correct answer completes;
- >=44px targets;
- no horizontal overflow;
- feedback and success CTA stay visible;
- assessed evidence source/fidelity;
- direction/range/context metadata;
- incorrectCount=1;
- retryCount=1;
- accuracy=0.5;
- nine dedicated screenshots.

Legacy `run-number-line-browser-tests.mjs` remains in the same mobile-route suite.

## Expected branch truth

```text
classified:       900 / 900
unclassified:       0
active patterns:    47
choice_grid:       183
number_line:        11
KEEP:              900
POLISH:              0
REDESIGN:            0
REPLACE:             0
```

This reuse wave changes presentation classification only. It does not increase active-pattern count.

## Audit-main artifacts

From CI #1060:

```text
gameplay-distribution-audit
artifact: 10587651561
sha256:68663589a9ba2be56841113e53e62cf0e24a89a1721d4ebeb4af10d307d8a713

activity-quality-audit
artifact: 10587402244
sha256:2e5888fd9f30d4d3393d7f9cc6233fe099743e91e7cbe625d5e3d8460b14cdf0

mobile-route-qa-screenshots
artifact: 10586869568
sha256:25a84f6d5d8646a5d32923045a5bf58d83856fd8a4f90fa57f6e6ea29aca1f29
```

## Implementation acceptance checkpoint

Accepted branch checkpoint:

```text
PR:                    #232
Accepted head:         c51dee54743903525ef5e5cf19c73982421a36e8
CI:                    #1061 / run 35454486492 — full success
Production smoke:      skipped on PR by design
```

Verified CI #1061 artifact truth:

```text
activities:            900
classified:            900
unclassified:            0
active patterns:        47
choice_grid:           183
number_line:            11
picture_word_match:      23
Math choice_grid:        17
Math number_line:        11
KEEP:                   900
POLISH:                   0
REDESIGN:                 0
REPLACE:                  0
structural findings:      0
```

Artifacts:

```text
activity-quality-audit
artifact: 10588505346
sha256:11ecb4fc8a3de3d179bcc8de3172945c88d93ba7c82ba85f31c1781af5ac7888

gameplay-distribution-audit
artifact: 10588410425
sha256:2a9ef480e9ba570da7753933442b6cf6bc63fda707e94a3152afbbf05ee3acbb

mobile-route-qa-screenshots
artifact: 10587907256
sha256:cc6d3452f735529f35d3217cfae7ff4f14fb599948ec884a5c4a7de74c832ad2
```

Dedicated missing-number screenshots reviewed manually:

```text
320-number-line-missing-idle.png
320-number-line-missing-try.png
320-number-line-missing-success.png
390-number-line-missing-idle.png
390-number-line-missing-try.png
390-number-line-missing-success.png
768-number-line-missing-idle.png
768-number-line-missing-try.png
768-number-line-missing-success.png
```

Manual visual acceptance:

```text
P0 = 0
P1 = 0
result = ACCEPTED
```

Observed acceptance:
- five-tick line remains legible at all three widths;
- known values and answer candidates remain visually distinct;
- wrong-state highlight and retry text are visible;
- success state and CTA remain visible;
- no blocking horizontal overflow or clipping;
- 320 and 768 touchscreen completion and 390 pointer completion passed in browser QA;
- legacy Number Line browser QA also remained green inside the mobile suite.

Because this acceptance evidence changes docs after the accepted runtime checkpoint, the final PR head must pass the complete CI gate again before merge.

## Before merge

1. exact-head full CI green;
2. gameplay distribution exactly 900/900 / 47 / 183 / 11;
3. activity quality KEEP 900;
4. dedicated Wave C browser QA green;
5. legacy Number Line browser QA green;
6. manual nine-shot P0/P1 review accepted;
7. review threads/comments clean;
8. squash merge exact current head SHA;
9. merged-main full CI + exact Cloudflare production smoke;
10. post-merge closure documentation.

## Explicit exclusions

Not included:
- grouping;
- addition;
- subtraction;
- size/length;
- mixed Math review;
- English initial-sound direct-choice;
- Iqro.

Pattern #48 remains **not justified**.
