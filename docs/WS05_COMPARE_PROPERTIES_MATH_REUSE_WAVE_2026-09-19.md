# WS-05 Math Compare Properties Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACTIVE / EXACT 4-ID MATH REUSE / PATTERN COUNT STAYS 47**

## Verified base

```text
base main:                    e47be5b7a5462865b6a7cd46d6a11def8b2118d9
Math spatial reuse:           FULLY CLOSED / LIVE VERIFIED
Math spatial main:            2cb948d614c90aceaa592ddbfae204ed639bc062
Math spatial main CI:         #987 / run 35422469117 — full success + exact Cloudflare smoke
current merged distribution:  47 active / choice_grid 223 / spatial_relation_board 11 / set_reasoning 10
Math measurement audit:       PR #210 -> main f9833568 / main CI #973 live verified
```

## Exact implementation scope

```text
math-measure-longer
math-measure-more-capacity
math-measure-fuller
math-measure-three-lengths
```

Explicit exclusion:

```text
math-measure-match-length -> matching / matching_accuracy_v1
```

## Implementation contract

Reuse existing `compare_properties`.

Binary variant:
- `math-measure-longer`
- `math-measure-fuller`

Multi-candidate variant:
- `math-measure-more-capacity`
- `math-measure-three-lengths`

The multi-candidate variant renders all three canonical answers as equivalent first-class property cards. No canonical answer may be visually demoted into the legacy binary “other” control.

## Preserved canonical evidence

All four Math activities remain:
- subject `math`;
- stage `math-ukur-ruang`;
- lesson `math-measure-intuition`;
- pack `math.pack.measure-intuition`;
- skill `math.measure.intuition`;
- runtime `tap_choice`;
- assessed `choice_accuracy_v1`;
- exact canonical prompt;
- exact canonical choices and order;
- exact canonical `correctChoice`.

No content rewrite, mastery/progression change, schema migration or database migration is in scope.

## Legacy Science regression

Existing Science scope remains exactly:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Science keeps binary comparison presentation, canonical payloads and runtime metadata behavior.

## Fail-closed boundary

Config validates exact:
- activity ID;
- subject;
- stage;
- runtime;
- prompt;
- choices and order;
- correct answer;
- variant;
- explicit candidate visual mapping.

Prompt/choice/answer/subject/stage/runtime drift must return `null`.

## Browser QA

Existing legacy Science QA remains wired:

```text
scripts/run-compare-properties-browser-tests.mjs
```

New Math reuse QA:

```text
scripts/run-compare-properties-math-reuse-browser-tests.mjs
representative route: /child/demo-gian/activity/math-measure-more-capacity
viewports:
- 320x720
- 390x844
- 768x1024
```

It verifies:
- legitimate Math progression readiness;
- three first-class canonical capacity candidates;
- canonical answer order;
- keyboard wrong/retry;
- actual-touch correct completion;
- assessed evidence;
- incorrect=1 / retry=1 / accuracy=0.5;
- >=44px touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- no page/console errors;
- idle / wrong / success screenshots at all three viewports.

## Target branch distribution

```text
activities:                 900
classified:                 900
unclassified:                 0
active patterns:             47
choice_grid                 219
spatial_relation_board       11
set_reasoning                10
compare_properties            7
cloze_sentence_choice         5
healthy_habit_routine         4
```

Pattern #48 remains unimplemented.

## Initial CI checkpoint

Initial implementation head:

```text
615c81d4cb0c9e9c49949de837b193696813aa68
```

CI:

```text
#990 / run 35424220516
```

Result: **FAILED ONLY AT THE GAMEPLAY-DISTRIBUTION SENTINEL**.

The generated distribution artifact already reported the intended runtime truth:

```text
activities:                 900
classified:                 900
unclassified:                 0
active patterns:             47
choice_grid                 219
spatial_relation_board       11
set_reasoning                10
compare_properties            7
```

Production build, dependency audit and secret-history scan passed; engine/typecheck/lint had not exposed a product defect. The failure was the audit script still freezing the prior Math-spatial baseline at `choice_grid=223` and without the new exact `compare_properties=7` sentinel.

Fix commit `941c643858a5cce4362f39149a91b3a18407d530` changes only that expected distribution baseline. Runtime/config/UI behavior is unchanged.

Second exact-head CI:

```text
#992 / run 35424446329
head before QA fix: 4847268e9f0e47ff202f4141bbdd2f334fdb4d96
```

Distribution sentinel passed the updated runtime target. Mobile QA then failed only because the new Math browser test asserted that the canonical activity prompt must be visible as body text. Existing `ComparePropertiesActivity` intentionally renders the reviewed `config.cue` in the body while the canonical prompt remains the narration source and is frozen exactly by config regression.

Fix commit `9d4d9d1126abb6511a3cbc41cfb6a72793d73326` changes only that browser assertion to the visible Math capacity comparison cue. Product/runtime behavior is unchanged.

## Merge gate

Before merge:
1. exact-head CI full success;
2. gameplay distribution 900/900 and exact 47/219/11/10/7 target;
3. activity-quality KEEP 900 / 0 flagged;
4. legacy Science browser QA green;
5. Math binary/multi-candidate regressions green;
6. new Math browser QA green at 320/390/768;
7. manual nine-shot review P0=0/P1=0;
8. no unresolved review threads;
9. exact-head merge only.

After merge:
- require merged-main CI + exact Cloudflare production smoke;
- add post-merge closure docs;
- only then advance to English cloze runtime reuse.
