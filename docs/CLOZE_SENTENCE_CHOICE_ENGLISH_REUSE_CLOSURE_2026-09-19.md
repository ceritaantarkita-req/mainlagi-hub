# English Cloze Sentence Choice Reuse Closure — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope

Existing Pattern #38 `cloze_sentence_choice` now serves exactly ten assessed sentence-completion activities.

Legacy Bahasa:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

English reuse:

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

Active gameplay-pattern count remains 47. Pattern #48 remains unimplemented.

## Verification chain

Audit:

```text
Audit PR:          #211
Audit main:        76e1eeb0c0d50280c612b57af7d6e85e5a079f52
Audit main CI:     #975 / run 35409217808
Audit smoke:       exact Cloudflare production smoke PASS
```

Implementation:

```text
Implementation PR:       #219
Accepted code head:      a054b76b1e13cba03a255b9c60f0bd43deb9051f
Accepted code CI:        #1003 / run 35430916587 — full success
Final PR head:           e0353c873bb5eee39190a881a6a7e972e136dff6
Final PR CI:             #1008 / run 35431387504 — full success
Implementation main:     e3c92cfe8c1050fdcca1599ae92d98a9345b04ca
Implementation main CI:  #1009 / run 35431721131 — full success
Cloudflare smoke:        exact main SHA PASS
```

## Merged-main evidence

Main CI #1009 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10581068359
sha256:32a0bb83a07d63674bab602448d211ad739d88e4f4a1c7ffc2c51d4cb37f03d5

gameplay-distribution-audit
artifact: 10580049726
sha256:7b686ace88d8287713521b41fe45f08424f4ef9f31acf1db0ba771152504e179

activity-quality-audit
artifact: 10580304396
sha256:1fe2275b3bb45e373b6fef8b95be8067e4e22d166c5a10beea40d133fa17703a
```

Verified distribution:

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                47
choice_grid                    214
cloze_sentence_choice           10
spatial_relation_board          11
set_reasoning                   10
compare_properties               7
healthy_habit_routine            4
```

Deterministic activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Runtime / evidence contract

All five English activities remain canonical:
- subject `english`;
- stage `english-phrases-review`;
- lesson `english-sentence-completion`;
- pack `english.pack.sentence-completion`;
- skill `english.sentence.completion`;
- runtime `tap_choice`;
- assessed `choice_accuracy_v1`;
- exact prompt, choices/order and `correctChoice`.

The ten-ID config is fail-closed on:
- ID;
- subject;
- stage;
- runtime;
- prompt;
- choices/order;
- correct answer;
- locale;
- parseable one-slot cloze syntax.

Bahasa stays `id-ID` with its historical child-facing copy. English uses `en-US` with reviewed English copy. Blank syntax alone never classifies an arbitrary activity.

No content rewrite, mastery/progression change, schema/database migration, activity-count change or new gameplay pattern was introduced.

## Browser and visual acceptance

Legacy Bahasa browser QA remains wired.

Dedicated English QA uses:

```text
/child/demo-gian/activity/english-complete-cat-sleeps
```

at:
- 320x720;
- 390x844;
- 768x1024.

It verifies:
- legitimate English progression readiness;
- English locale/copy and ARIA labels;
- canonical sentence and choice order;
- keyboard wrong/retry;
- pointer and actual-touch correct completion;
- assessed evidence;
- incorrect=1 / retry=1 / accuracy=0.5;
- >=44px touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- no page/console errors.

Nine English screenshots (idle / wrong / success × 320 / 390 / 768) were manually reviewed. Result: **P0=0 / P1=0**.

Permanent visual product baseline also passed on final PR CI #1008 and merged-main CI #1009.

## Closure

English sentence completion -> `cloze_sentence_choice` reuse is **FULLY CLOSED / LIVE VERIFIED**.

The next authorized runtime wave is the already-audited Science environment-care reuse:

```text
science-env-trash-bin
science-env-save-water
science-env-reuse-bottle
science-env-plant-care
```

into existing Pattern #22 `healthy_habit_routine`.

Implementation requirements:
- preserve the four legacy body-health activities exactly;
- harden the full eight-ID family fail-closed;
- add explicit `body_health` vs `environment_care` domain variants;
- use domain-correct environment child-facing copy and evidence metadata;
- keep `science-match-environment-actions-c` as matching / `matching_accuracy_v1`;
- keyboard/pointer/actual-touch QA;
- 320/390/768 nine-shot visual review;
- exact-head CI and merge;
- merged-main exact-SHA Cloudflare verification;
- post-merge closure before moving to any later runtime wave.
