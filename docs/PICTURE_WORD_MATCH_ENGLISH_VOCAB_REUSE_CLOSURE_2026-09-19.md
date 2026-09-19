# Picture Word Match English Vocabulary Reuse Closure — 19 September 2026

Status: **RUNTIME FULLY VERIFIED / DOCS CLOSURE ACTIVE**

## Scope closed

Existing Pattern #35 `picture_word_match` now serves exactly 23 assessed direct-choice activities:

Legacy Bahasa:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

English concrete-vocabulary reuse:

```text
english-animal-dog
english-animal-rabbit
english-animal-fish
english-object-book
english-object-chair
english-object-cup
english-body-head
english-body-hand
english-body-foot
english-family-mother
english-family-father
english-family-baby
english-food-apple
english-food-banana
english-food-bread
english-action-run
english-action-jump
english-action-read
```

Explicit exclusions remain outside Pattern #35:
- English category classification;
- listening activities;
- matching activities;
- opposites;
- phrase-scene activities;
- cloze/sentence completion;
- mixed review;
- unrelated Bahasa/Math/Science direct-choice families.

No new Pattern #48 is created.

## Verification chain

Audit:

```text
Audit PR:              #227
Audit exact head:      2847f6f0a4171bfd78d4243eb5ed477e1a4390f9
Audit PR CI:           #1046 / run 35446033060 — full success
Audit main:            293db85d9c64bd714a856fd5f4d68104ff5fc61f
Audit-main CI:         #1047 / run 35447487277 — full success
Cloudflare smoke:      exact audit-main SHA PASS
```

Implementation:

```text
Implementation PR:     #228
Accepted code head:    94eaa68d5be1dc13bf3f7eab2b75514fceedd40c
Accepted code CI:      #1048 / run 35448308040 — full success
Final PR head:         3dfacb8d77e9e0fff4d34448d1a5311d2081bab3
Final PR CI:           #1053 / run 35449117180 — full success
Implementation main:  3c9b6058994c58e2f51c2f133842c6b9dfede13f
Merged-main CI:        #1054 / run 35449535573 — full success
Cloudflare smoke:      exact implementation-main SHA PASS
```

Production smoke explicitly verified:

```text
release.sha:        3c9b6058994c58e2f51c2f133842c6b9dfede13f
release.branch:     main
siteUrl:            https://mainlagihub.my.id
dataBackend:        supabase
supabaseProjectRef: estvtgflwkebomsqlolv
result:             PASS
```

## Runtime / evidence contract

The generalized Pattern #35 family is exact and fail-closed on:
- activity ID;
- subject;
- stage;
- `tap_choice` runtime;
- canonical title;
- canonical prompt;
- exact three-choice order;
- canonical correct answer.

The config supplies a stable reviewed visual and explicit locale/domain variant.

Supported presentation variants:

```text
bahasa_word_picture / id-ID
english_word_picture / en-US
```

English uses leak-free generic frame copy:

```text
frame title: Picture & Word
narration:   Look at the picture and choose the matching word.
```

This prevents answer-bearing canonical titles/prompts such as `Find JUMP` or `Choose the action JUMP.` from being exposed before submission. Canonical stored content itself remains unchanged and is still exact-validated.

Assessed evidence remains:

```text
source: picture-word-match-runtime
evidenceFidelity: choice_picture_word_match_interaction
picture
word
selectedChoice
domainVariant
```

No curriculum payload rewrite, mastery/progression change, schema/database migration, activity-count change or new gameplay pattern was introduced.

## Browser and visual acceptance

Legacy Bahasa browser QA remains wired.

Dedicated English representative route:

```text
/child/demo-gian/activity/english-action-jump
```

Verified:
- 320x720 actual touchscreen completion;
- 390x844 pointer completion;
- 768x1024 actual touchscreen completion;
- keyboard wrong-answer/retry;
- wrong answer cannot complete or reveal the target;
- answer-bearing canonical title/prompt do not render before submission;
- exact canonical visual and choice order;
- >=44px touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- assessed evidence with incorrect=1 / retry=1 / accuracy=0.5;
- no page/console errors.

Nine screenshots — idle / retry / success × 320 / 390 / 768 — were manually reviewed.

```text
P0 = 0
P1 = 0
result = ACCEPTED
```

## Merged-main evidence

Merged-main CI #1054 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10585709719
sha256:620438d769a39ce400dc0502ccd2600cfc8f628442a4e815ca42d782636a4832

gameplay-distribution-audit
artifact: 10586393790
sha256:fe68f17110548251d9695b0638e724cb5da39cdcceb171c2518c7610120d0aff

activity-quality-audit
artifact: 10586183905
sha256:8a3a343348a7053ff95781a7c1d316702d9a4c90c458e6e6cec73b38286ca890
```

Verified merged distribution:

```text
activities:               900
classified:               900
unclassified:               0
active patterns:           47
choice_grid               188
picture_word_match         23
phenomenon_relation_board   8
cloze_sentence_choice      10
spatial_relation_board     11
set_reasoning              10
compare_properties          7
```

Deterministic activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Product decision

English concrete-vocabulary direct-choice -> existing `picture_word_match` is runtime **LIVE VERIFIED**.

The active gameplay-pattern count remains 47. Pattern #48 remains unjustified.

No additional runtime wave is pre-approved by this closure. Any next WS-05 runtime change must begin with a fresh objective/evidence audit.

## Remaining closure gate

This branch is documentation-only. To fully close the wave:
1. merge these closure docs through exact-head CI;
2. verify closure-main push CI;
3. verify exact closure-main SHA in Cloudflare production;
4. add the final closure verification record.

Until then, runtime is live verified but the documentation closure remains active.
