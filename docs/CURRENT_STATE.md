# Mainlagi Hub — Current State

Last reviewed: **18 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open closure work must not be mistaken for final closure truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay pattern: **Pattern #45 — Logic `elimination_board`**
- Pattern #42 implementation: PR #187 -> main `37190f5dabd5d8421d7575b8f220d2824e831f23`
- Pattern #42 implementation merged-main CI: **#884 / run `35260402125` — full success including exact Cloudflare production smoke**
- Pattern #42 closure: PR #188 -> main `ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710`
- Pattern #42 closure merged-main CI: **#886 / run `35290502532` — full success including exact Cloudflare production smoke**
- Pattern #43 audit: PR #190 -> main `39830a5dfd91734e4cc88b7d79eafaa2f722615f`
- Pattern #43 audit main CI: **#890 / run `35295503508` — full success including exact Cloudflare production smoke**
- Pattern #43 implementation: PR #191 -> main `44f9dee07506a785f184d965b5bbc0a2aab66a8f`
- Pattern #43 implementation merged-main CI: **#900 / run `35297572709` — full success including exact Cloudflare production smoke**
- Pattern #44 audit: PR #193 -> main `8b3cb7e73a77502b4c9206936e7736ac9169b1ca`
- Pattern #44 audit merged-main CI: **#904 / run `35299949341` — full success including exact Cloudflare production smoke**
- Pattern #44 implementation: PR #194 -> main `8406c89777a68da4bd6e89f01a561e5aa1e90c01`
- Pattern #44 verified code checkpoint: `3a4385790a793ed5297db4f6d33fa8e1d084ccf1` / CI #906 full success
- Pattern #44 final PR head: `0835d2b93c0ae3d579518dcfa5964266bcbb1f2c`
- Pattern #44 final PR CI: **#911 / run `35302598975` — full success**
- Pattern #44 implementation merged-main CI: **#912 / run `35303076429` — full success including exact Cloudflare production smoke**
- Pattern #44 closure docs: PR #195 -> main `d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc`
- Pattern #44 closure docs merged-main CI: **#914 / run `35306629423` — full success including exact Cloudflare production smoke**
- Pattern #45 audit: PR #196 -> main `a3a1702ae390fb24c95551d91d31b24b4b867be6`
- Pattern #45 audit PR CI: **#915 / run `35307361453` — full success**
- Pattern #45 audit merged-main CI: **#916 / run `35307880654` — full success including exact Cloudflare production smoke**
- Pattern #45 implementation: PR #197 -> main `43dd857b0fb5b51fe94c4e83da114260a788b4f8`
- Pattern #45 accepted code checkpoint: `a182c4882d6eadbfb79a8fb88b96ad92b0e62139` / CI #919 full success
- Pattern #45 final PR head: `ac410e6905da2c7951bdc794715b5604c138a65b`
- Pattern #45 final PR CI: **#924 / run `35311598469` — full success**
- Pattern #45 implementation merged-main CI: **#925 / run `35312057984` — full success including exact Cloudflare production smoke**
- Pattern #45 manual visual review: **ACCEPTED / 9 screenshots / no P0-P1 blocker**
- permanent visual QA foundation: **VQA-01 FULLY CLOSED**
- visual P1 baseline: **P0=0 / P1=0 / P2=3**

## Engineering status

No known P0 engineering blocker is open on merged `main`.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Permanent visual QA: 21 canonical routes / 63 captures / BLOCKING
Pattern #38: FULLY CLOSED
Pattern #39: FULLY CLOSED
Pattern #40: FULLY CLOSED
Pattern #41: FULLY CLOSED / LIVE VERIFIED
Pattern #42: FULLY CLOSED / LIVE VERIFIED
Pattern #43: FULLY CLOSED / LIVE VERIFIED
Pattern #44: FULLY CLOSED / LIVE VERIFIED
Pattern #45: FULLY CLOSED / LIVE VERIFIED
```

External physical-device acceptance, accessibility-specialist review, human pedagogical/art acceptance and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Current WS-05 finish target: **50 meaningful patterns**. The former 60-pattern working target is non-blocking/deferred and is not part of the current finish scope.

Verified merged-main distribution after Pattern #45 implementation:

```text
classified:                    900 / 900
unclassified:                    0
active merged patterns:         45
choice_grid                    241 / 900
elimination_board                5 / 900
subitizing_glance                3 / 900
single_rule_apply                 5 / 900
growth_stage_transition          3 / 900
phrase_scene_match               4 / 900
spatial_relation_board           6 / 900
visual_word_problem              5 / 900
cloze_sentence_choice            5 / 900
reading_passage_question         5 / 900
sentence_order_cards             5 / 900
picture_word_match               5 / 900
```

Remaining distance is **5 patterns** to the WS-05 finish target of 50. Pattern #45 implementation is merged and live verified on `main` through CI #925 including exact Cloudflare production smoke.

Pattern #44 post-merge docs closure remains verified: PR #195 -> `d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc`, closure-main CI #914 full success.

## Pattern #45 — FULLY CLOSED / LIVE VERIFIED

Candidate pattern:

```text
elimination_board
```

Exact audited scope:

```text
logic-infer-not-red
logic-infer-only-triangle
logic-infer-not-largest
logic-infer-common-feature
logic-infer-missing-member
```

Canonical ownership is Logic / `logic-conditional-analogy-inference` / `logic-elimination-inference` / `logic.pack.elimination-inference` / `logic.inference.elimination.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

The candidate is justified because the lesson objective and skill explicitly require **eliminating choices and drawing a direct conclusion**. Existing `set_reasoning` is a fixed two-rule membership board, `odd_one_out` identifies one mismatch against a shared trait, and `sorting_buckets` expresses category assignment. None covers all five inference forms without weakening its existing contract.

Verification chain:

```text
Audit PR:                  #196
Audit PR head:             e00106f0b65e6d007944d2a87b2f187e0b2dedbb
Audit PR CI:               #915 / run 35307361453 — full success
Audit main:                a3a1702ae390fb24c95551d91d31b24b4b867be6
Audit merged-main CI:      #916 / run 35307880654 — full success + exact Cloudflare production smoke
Implementation PR:         #197
Accepted code checkpoint:  a182c4882d6eadbfb79a8fb88b96ad92b0e62139
Checkpoint CI:             #919 / run 35309241809 — full success
Final implementation head: ac410e6905da2c7951bdc794715b5604c138a65b
Final PR CI:                #924 / run 35311598469 — full success
Implementation main:       43dd857b0fb5b51fe94c4e83da114260a788b4f8
Implementation main CI:    #925 / run 35312057984 — full success + exact Cloudflare production smoke
```

Merged-main distribution:

```text
45 active / choice_grid 241 / elimination_board 5
```

Merged-main CI #925 artifacts:

```text
mobile screenshots:      10534131038 / sha256:ee855f81403a490de077b1add0e4009437caf070a222da3ca860528354a4ea53
gameplay distribution:   10534385065 / sha256:4bad3ee041353b24b57a2715020aa302cbdbfa4b7d1c9eebd588a48ac0e65d2e
activity quality:         10534385061 / sha256:eebcc3b932495954314c11b69f7409f9c7d5ea3d38c4287bd9ba6958387c1503
```

Manual visual review: **ACCEPTED / 320, 390, 768 × idle, try, success / no P0-P1 blocker**.

Evidence records: `PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`, `PATTERN45_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md`, `WS05_ELIMINATION_BOARD_WAVE_2026-09-18.md`, and `PATTERN45_ELIMINATION_BOARD_CLOSURE_2026-09-18.md`.

## Pattern #44 — FULLY CLOSED / LIVE VERIFIED

Pattern:

```text
subitizing_glance
```

Exact scope:

```text
math-subitize-2
math-subitize-4
math-subitize-5
```

Canonical ownership remains Math / `math-jumlah-dasar` / `math-subitizing` / `math.pack.subitizing` / `math.quantity.subitizing` / assessed `tap_choice` / `choice_accuracy_v1`.

The candidate is justified because the existing `count_and_select` presentation explicitly teaches one-by-one counting, while this lesson/skill explicitly measures recognizing small quantities from spatial patterns without always counting one by one. The proposed presentation must use deterministic dot layouts, preserve exact canonical prompts/choices/answers, add no timer or speed score, and introduce no mastery/progression/schema/database migration.

Verification chain:

```text
Audit PR:                  #193
Audit PR head:             994f2150da4e8634ed9a79434fed5a9820daf354
Audit PR CI:               #903 / run 35299544562 — full success
Audit main:                8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Audit merged-main CI:      #904 / run 35299949341 — full success + exact Cloudflare production smoke

Implementation PR:         #194
Verified code checkpoint:  3a4385790a793ed5297db4f6d33fa8e1d084ccf1
Code checkpoint CI:        #906 / run 35301923329 — full success
Final implementation head: 0835d2b93c0ae3d579518dcfa5964266bcbb1f2c
Final PR CI:                #911 / run 35302598975 — full success
Implementation main:       8406c89777a68da4bd6e89f01a561e5aa1e90c01
Implementation main CI:    #912 / run 35303076429 — full success + exact Cloudflare production smoke
```

Implementation keeps the exact three-ID scope, introduces a deterministic 3x3 dot-board config with no timer/auto-hide/speed score, preserves canonical choice order and `choice_accuracy_v1`, and leaves `count_and_select`, mastery, progression, schema and database ownership unchanged.

Verified implementation and live result:

```text
Final PR head:           0835d2b93c0ae3d579518dcfa5964266bcbb1f2c
Final PR CI:             #911 / run 35302598975 — full success
Implementation main:     8406c89777a68da4bd6e89f01a561e5aa1e90c01
Implementation main CI:  #912 / run 35303076429 — full success + exact Cloudflare production smoke
Merged distribution:     44 active / choice_grid 246 / subitizing_glance 3
Manual visual review:    ACCEPTED / nine screenshots / no P0-P1 Pattern #44 blocker
```

CI #905 on the prior head correctly caught a smallest-viewport success-CTA visibility failure. The responsive success state was fixed without changing the stimulus or evidence contract; corrected code head CI #906 passed the full gate.

Merged-main CI #912 artifacts:

```text
mobile-route screenshots: 10531026015
sha256:8898d82a8e1f000bd9924b7f3b9e04baeea137f139dfdb21fe83e274397a6021

gameplay distribution:    10531025693
sha256:05fcac2bfac4fa07b9667c27d4b5ed17d3436911c27918b93b73201f4cb43fec

activity quality:          10530404555
sha256:2ef4d746d92545e49fd2e6e9519db5f67ee0d26e18d28ccfb3d50c4331122400
```

Implementation acceptance: `PATTERN44_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md`.  
Implementation wave: `WS05_SUBITIZING_GLANCE_WAVE_2026-09-18.md`.

Audit evidence: `PATTERN44_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

## Pattern #43 — FULLY CLOSED / LIVE VERIFIED

Pattern:

```text
single_rule_apply
```

Exact scope:

```text
logic-if-red-then-circle
logic-if-two-then-star
logic-rule-small-goes-left
logic-rule-up-means-one
logic-rule-switch-shape
```

Canonical ownership remains Logic / `logic-conditional-analogy-inference` / `logic-conditional-rules` / `logic.pack.conditional-rules` / `logic.conditional.rule.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

Verification chain:

```text
Audit PR:                #190
Audit main:              39830a5dfd91734e4cc88b7d79eafaa2f722615f
Audit PR CI:             #889 / run 35295077035 — full success
Audit main CI:           #890 / run 35295503508 — full success + exact Cloudflare production smoke
Implementation PR:       #191
Final implementation head:
                        c893ba0ee63b256bbeb0da61e2bd90355c483a09
Implementation PR CI:    #899 / run 35296994744 — full success
Implementation main:     44f9dee07506a785f184d965b5bbc0a2aab66a8f
Implementation main CI:  #900 / run 35297572709 — full success + exact Cloudflare production smoke
```

Verified behavior preserves exact prompts/choices/answers and canonical assessed evidence, uses explicit one-rule config without prompt parsing or invented intermediate checkpoints, supports keyboard/pointer/actual touch, and keeps existing `rule_pipeline`, `set_reasoning` and unrelated Logic scopes unchanged.

Manual review of the nine dedicated 320/390/768 idle/wrong/success screenshots is accepted with no P0/P1 Pattern #43 blocker. Merged-main permanent visual QA passed.

Merged-main CI #900 artifacts:

```text
mobile-route screenshots: 10529175685
sha256:02f6d161013c2151755352ba1df44319801bbdc62ec9c3dd732f5850f4965640

gameplay distribution:    10528606719
sha256:1fbc2d437b28ea7862b0be9b6c5363a2bffa83d8b2e0e50839ca826533c87254

activity quality:          10529180435
sha256:0842fa7688cce28556a914e0ca1e63f69957955d6db100038c527f7641ddc2f7
```

## Pattern #42 — FULLY CLOSED / LIVE VERIFIED

Pattern:

```text
growth_stage_transition
```

Exact scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical ownership:

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Verification chain:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Verified code checkpoint: 0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR head:            bc115708c83c1f4829901455d4a5d39d7ea3261c
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure head:             ee2f57c7fdd89e393cc4fb8dcbb22c2bdb28b885
Closure PR CI:            #885 / run 35261277441 — full success
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Merged behavior preserves canonical prompts/choices/answers and `choice_accuracy_v1`, uses exact three-ID fail-closed config, hides the target until correct completion, records measured wrong/retry evidence, supports keyboard/pointer/touch, and introduces no mastery/progression/schema/database migration.

Manual review of all nine dedicated Pattern #42 screenshots remains accepted with no P0/P1 Pattern #42 visual blocker. Merged-main permanent visual QA also passed.

Merged-main CI #884 artifacts:

```text
mobile-route screenshots: 10514976832
sha256:ce7f6fc566952f8d20261eda8eb6c86c7fe6a2f0464f4c4fe72658d128451f4d

gameplay distribution:    10514382620
sha256:12212009d77256bb32b08a32de3a8e1dc4067c3899d7d410c8651f5bc2687b4f

activity quality:          10513967944
sha256:aa38d751cfdb5f24268c818dcf79a84d6d2fc30a2117bf8900df3f52ea3a6cc6
```

Explicit exclusions remain `science-cycle-butterfly`, `science-match-young-adult-b`, existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families.

Closure evidence: `PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:

- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Pattern #45 is the latest fully closed/live-verified gameplay pattern.
2. Preserve the merged 45-pattern baseline: 900/900 classified, `choice_grid` 241, `elimination_board` 5.
3. Pattern #46 must begin with a fresh objective/evidence audit; no mechanic, subject, or content family is pre-approved.
4. Reuse an existing mechanic whenever it already expresses the required evidence model.
5. Continue the same audit -> exact-scope implementation -> visual/browser QA -> merged-main verification -> docs-closure path through Pattern #50.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, marketplace expansion or mastery/backend rewrites before the current quality roadmap justifies them.
