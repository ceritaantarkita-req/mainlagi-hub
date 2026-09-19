# WS-05 Picture Word Match English Reuse Wave — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

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

## Accepted implementation checkpoint

```text
PR:                         #228
Accepted head:              94eaa68d5be1dc13bf3f7eab2b75514fceedd40c
PR CI:                      #1048 / run 35448308040 — full success
Gameplay classified:        900 / 900
Active patterns:            47
choice_grid:                188 / 900
picture_word_match:          23 / 900
Activity quality:           KEEP 900 / POLISH 0 / REDESIGN 0 / REPLACE 0
Manual English screenshots: 9 / 9 reviewed
Manual visual findings:     P0 0 / P1 0
```

CI #1048 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10586202450
sha256:fe212481bf6a6b22d6f9262a24ba7408ab04f9a1b7089bb3728dd188499eb591

gameplay-distribution-audit
artifact: 10586242250
sha256:8f34aa95874f8e3dd80ebf67d0f63a3ae38575bda7e31b560dbc6cab5dd3a8c3

activity-quality-audit
artifact: 10586596895
sha256:9646e55bac367a68ad7f3a82145b11a381eee1f25009e5da0c1d6c557e429efc
```

Manual visual review covered idle / retry / success at 320x720, 390x844 and 768x1024. The reviewed frames preserve the hidden target before submission, readable English instruction/feedback, visible success CTA, stable choice layout and no visible horizontal overflow. No P0/P1 blocker was found.

## Final implementation verification

```text
Implementation PR:        #228
Accepted checkpoint:      94eaa68d5be1dc13bf3f7eab2b75514fceedd40c
Accepted CI:              #1048 / run 35448308040 — full success
Final PR head:            3dfacb8d77e9e0fff4d34448d1a5311d2081bab3
Final exact-head CI:      #1053 / run 35449117180 — full success
Implementation main:     3c9b6058994c58e2f51c2f133842c6b9dfede13f
Merged-main CI:           #1054 / run 35449535573 — full success
Cloudflare production:    exact implementation-main SHA PASS
```

Merged-main #1054 verifies:

```text
900 / 900 classified
0 unclassified
47 active patterns
choice_grid             188 / 900
picture_word_match       23 / 900
KEEP                    900
POLISH                     0
REDESIGN                   0
REPLACE                    0
```

Production health reports `release.sha = 3c9b6058994c58e2f51c2f133842c6b9dfede13f`, branch `main`, canonical Cloudflare site and canonical Supabase project.

Post-merge closure record: `PICTURE_WORD_MATCH_ENGLISH_VOCAB_REUSE_CLOSURE_2026-09-19.md`.

Closure docs PR #229 merged to `a3437888998bf43ec6eb2dcab0ec58657c59a494`. Closure-main CI #1056 passed the full gate and exact-SHA Cloudflare production smoke.

Final verification record: `PICTURE_WORD_MATCH_ENGLISH_VOCAB_REUSE_FINAL_CLOSURE_VERIFICATION_2026-09-19.md`.

This English picture-word reuse wave is **FULLY CLOSED / LIVE VERIFIED**.
