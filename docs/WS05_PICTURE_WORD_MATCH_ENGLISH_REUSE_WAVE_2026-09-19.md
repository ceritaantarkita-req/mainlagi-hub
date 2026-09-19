# WS-05 Picture Word Match English Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACTIVE / EXACT 18-ID ENGLISH REUSE / PATTERN COUNT STAYS 47**

## Verified prerequisite audit

```text
Audit PR:                 #227
Audit exact head:         2847f6f0a4171bfd78d4243eb5ed477e1a4390f9
Audit PR CI:              #1046 / run 35446033060 — full success
Audit main:               293db85d9c64bd714a856fd5f4d68104ff5fc61f
Audit-main CI:            #1047 / run 35447487277 — full success
Cloudflare production:    exact audit-main SHA PASS
```

The production smoke explicitly verified `293db85d...` on branch `main` with canonical site `https://mainlagihub.my.id`, `dataBackend: supabase`, and Supabase project `estvtgflwkebomsqlolv`.

## Exact implementation scope

Existing Pattern #35 `picture_word_match` keeps its five Bahasa activities and adds exactly eighteen audited English direct-choice vocabulary activities.

### Legacy Bahasa

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

### English reuse

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

No new Pattern #48 is created.

## Exact fail-closed contract

The config owns the exact 23-ID family and validates, per activity:
- exact activity ID;
- exact subject;
- exact stage;
- `tap_choice` runtime;
- exact canonical title;
- exact canonical prompt;
- exact three-choice order;
- exact correct answer;
- stable reviewed visual;
- locale/domain variant.

Title/prompt/choice-order/answer/subject/stage/runtime drift falls closed to the generic runtime.

## Subject-aware presentation

Bahasa keeps the existing Indonesian child-facing behavior.

English uses:
- `en-US`;
- generic frame title `Picture & Word`;
- generic narration `Look at the picture and choose the matching word.`;
- English heading/instruction/ARIA/feedback/CTA;
- uppercase canonical answer rendering.

The English frame intentionally does **not** render or narrate the raw canonical title/prompt because several audited source strings contain the answer itself (for example `Find JUMP` / `Choose the action JUMP.`). Canonical source content remains unchanged and is still exact-validated by config.

## Evidence contract

Unchanged:
- canonical activity IDs/content;
- assessed `tap_choice`;
- `choice_accuracy_v1`;
- lesson/pack/skill ownership;
- retry/incorrect/accuracy semantics;
- mastery/progression;
- schema/database state.

Runtime metadata preserves:
- `source: picture-word-match-runtime`;
- `evidenceFidelity: choice_picture_word_match_interaction`;
- `picture`;
- `word`;
- `selectedChoice`.

Additive audit metadata:
- `domainVariant: bahasa_word_picture | english_word_picture`.

## Dedicated QA

Legacy browser QA stays active.

New English QA uses:

```text
route: /child/demo-gian/activity/english-action-jump
320x720: actual touchscreen completion
390x844: pointer completion
768x1024: actual touchscreen completion
```

It verifies:
- legitimate prior-stage readiness;
- generic leak-free English frame title/instruction;
- answer-bearing canonical title/prompt absent before submission;
- exact canonical visual and choice order;
- keyboard wrong/retry;
- wrong answer cannot complete or reveal target;
- pointer + actual touchscreen correct completion;
- minimum touch targets;
- no horizontal overflow;
- feedback and CTA visibility;
- assessed evidence with incorrect=1 / retry=1 / accuracy=0.5;
- idle/retry/success screenshots;
- no page/console errors.

## Expected distribution

Before this runtime wave:

```text
900 / 900 classified
47 active patterns
choice_grid             206 / 900
picture_word_match        5 / 900
```

After exact 18-ID reuse:

```text
900 / 900 classified
47 active patterns
choice_grid             188 / 900
picture_word_match       23 / 900
```

The active pattern count remains 47. Numeric distance to 50 does not authorize a new mechanic.

## Merge gates

Before merge:
1. learning regression proves exact 23-ID family and fail-closed drift;
2. gameplay distribution is exactly 900/900, 47 active, `choice_grid` 188, `picture_word_match` 23;
3. activity-quality remains clean;
4. legacy Bahasa browser QA remains green;
5. dedicated English 320/390/768 QA is green;
6. nine English screenshots receive manual P0/P1 review;
7. exact-head CI is full success;
8. canonical docs are reconciled.

After merge:
- require push-to-main CI;
- require exact-SHA Cloudflare production smoke;
- create post-merge closure verification before advancing the next WS-05 runtime change.
