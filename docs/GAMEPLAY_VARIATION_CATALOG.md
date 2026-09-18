# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Current finish target:** 50 meaningful gameplay patterns. The former 60-pattern working target is deferred/non-blocking.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos exact-scope regression, completion/evidence, keyboard, touch/pointer, responsive QA, manual visual review, dan merged-main verification.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.
- WS-08 visual QA tetap blocking pada setiap wave WS-05.

## Status implementasi

Patterns #1–#35 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — FULLY CLOSED
31. `make_total` — FULLY CLOSED
32. `take_away` — FULLY CLOSED
33. `equal_groups` — FULLY CLOSED
34. `initial_sound` — FULLY CLOSED
35. `picture_word_match` — FULLY CLOSED
36. `sentence_order_cards` — FULLY CLOSED
37. `reading_passage_question` — FULLY CLOSED
38. `cloze_sentence_choice` — FULLY CLOSED
39. `visual_word_problem` — FULLY CLOSED
40. `spatial_relation_board` — FULLY CLOSED
41. `phrase_scene_match` — **FULLY CLOSED / LIVE VERIFIED**
42. `growth_stage_transition` — **FULLY CLOSED / LIVE VERIFIED**
43. `single_rule_apply` — **FULLY CLOSED / LIVE VERIFIED**
44. `subitizing_glance` — **FULLY CLOSED / LIVE VERIFIED**
45. `elimination_board` — **FULLY CLOSED / LIVE VERIFIED**
46. `phenomenon_relation_board` — **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Current verified merged distribution

```text
900 / 900 classified
0 unclassified
45 active child-facing patterns
choice_grid                     241 / 900
elimination_board                 5 / 900
subitizing_glance                 3 / 900
single_rule_apply                 5 / 900
growth_stage_transition           3 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Remaining distance is **5 patterns** to the current finish target of 50.

Pattern #46 implementation target (branch-only until verified/merged):

```text
46 active child-facing patterns
choice_grid                       237 / 900
phenomenon_relation_board           4 / 900
```

Exact candidate scope: `science-earth-sun-day`, `science-earth-moon-night`, `science-earth-shadow-sun`, `science-earth-cloud-rain`.

Pattern #45 merged/live-verified distribution:

```text
45 active child-facing patterns
choice_grid                     241 / 900
elimination_board                 5 / 900
```

Exact scope: `logic-infer-not-red`, `logic-infer-only-triangle`, `logic-infer-not-largest`, `logic-infer-common-feature`, `logic-infer-missing-member`.

Exact scope: `math-subitize-2`, `math-subitize-4`, `math-subitize-5`. Existing `count_and_select` remains unchanged because it measures explicit one-by-one enumeration rather than quantity recognition from spatial patterns.

Verification chain:

```text
Audit PR:                 #193
Audit main:               8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Audit merged-main CI:     #904 / run 35299949341 — full success + exact Cloudflare production smoke
Implementation PR:        #194
Verified code head:       3a4385790a793ed5297db4f6d33fa8e1d084ccf1
Code checkpoint CI:       #906 / run 35301923329 — full success
Final PR head:            0835d2b93c0ae3d579518dcfa5964266bcbb1f2c
Final PR CI:              #911 / run 35302598975 — full success
Implementation main:      8406c89777a68da4bd6e89f01a561e5aa1e90c01
Implementation main CI:   #912 / run 35303076429 — full success + exact Cloudflare production smoke
Manual visual review:     ACCEPTED / no P0-P1 Pattern #44 blocker
```

Pattern #44 uses deterministic pair/square/dice-five 3x3 dot layouts. The stimulus remains visible; there is no forced timer, auto-hide, speed score, prompt parser, extra assessed checkpoint, mastery/progression/schema migration, or change to the existing `count_and_select` family.

Evidence records: `PATTERN44_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md` and `WS05_SUBITIZING_GLANCE_WAVE_2026-09-18.md`.

Merged-main CI #912 independently reproduced the accepted 44-pattern distribution and passed mobile/browser QA, permanent visual QA, Ubuntu/Windows gates, production build/security checks, and exact Cloudflare production smoke.

## Pattern #45 — `elimination_board` / FULLY CLOSED / LIVE VERIFIED

Canonical scope is exactly the five Logic elimination/inference activities in `logic.pack.elimination-inference`, skill `logic.inference.elimination.basic`, assessed `tap_choice` / `choice_accuracy_v1`.

Why this candidate is distinct:
- the objective explicitly includes **eliminating choices** before drawing a direct conclusion;
- `set_reasoning` is a two-rule membership board;
- `odd_one_out` finds one mismatch among a shared trait;
- `sorting_buckets` assigns categories;
- the five candidate tasks span negative exclusion, unique target, size elimination, common-feature inference, and missing-member inference.

Approved future presentation is limited to making wrong/retry selections visibly `tersisih` while preserving the canonical three choices and final correct completion. No choice may be pre-disabled and no additional assessed checkpoint is approved.

Verification chain:

```text
Audit PR:                  #196
Audit PR head:             e00106f0b65e6d007944d2a87b2f187e0b2dedbb
Audit PR CI:               #915 / run 35307361453 — full success
Audit main:                a3a1702ae390fb24c95551d91d31b24b4b867be6
Audit merged-main CI:      #916 / run 35307880654 — full success + exact Cloudflare production smoke
Implementation PR:         #197
Accepted checkpoint:       a182c4882d6eadbfb79a8fb88b96ad92b0e62139
Checkpoint CI:             #919 / run 35309241809 — full success
Final implementation head: ac410e6905da2c7951bdc794715b5604c138a65b
Final PR CI:                #924 / run 35311598469 — full success
Implementation main:       43dd857b0fb5b51fe94c4e83da114260a788b4f8
Implementation main CI:    #925 / run 35312057984 — full success + exact Cloudflare production smoke
Manual visual review:      ACCEPTED / no P0-P1 Pattern #45 blocker
```

Merged-main CI #925 artifacts:

```text
mobile screenshots:       10534131038 / sha256:ee855f81403a490de077b1add0e4009437caf070a222da3ca860528354a4ea53
gameplay distribution:    10534385065 / sha256:4bad3ee041353b24b57a2715020aa302cbdbfa4b7d1c9eebd588a48ac0e65d2e
activity quality:          10534385061 / sha256:eebcc3b932495954314c11b69f7409f9c7d5ea3d38c4287bd9ba6958387c1503
```

Evidence records: `PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`, `PATTERN45_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md`, `WS05_ELIMINATION_BOARD_WAVE_2026-09-18.md`, and `PATTERN45_ELIMINATION_BOARD_CLOSURE_2026-09-18.md`.

## Pattern #46 — `phenomenon_relation_board` / IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED

Canonical scope is exactly the four Science direct-choice activities in `science.pack.earth-sky-patterns`, skill `science.earth.sky_patterns.basic`, assessed `tap_choice` / `choice_accuracy_v1`.

Why this candidate is distinct:
- objective explicitly links familiar sky/light observations to daily/weather patterns;
- generic `choice_grid` does not expose the observation -> related condition/result relation;
- `cause_effect` is a physical-state transformation mechanic;
- `investigation_board` is an explicit scientific-inquiry mechanic;
- `growth_stage_transition` is biological temporal progression;
- the same-pack `science-match-sky-observation-c` remains canonical matching and is excluded.

Approved future presentation is limited to a stable observation scene plus unresolved related/result slot and the exact canonical choices. The target may resolve only after the canonical correct choice is selected. No extra assessed checkpoint is approved.

Audit verification:

```text
Audit PR:                 #199
Audit PR head:            b53a299fafa8058af78797b3cd345984dedc9027
Audit PR CI:              #928 / run 35316239193 — full success
Audit main:               b620c78f186b7c8e8612afdb616420d923a57e00
Audit merged-main CI:     #929 / run 35316693100 — full success + exact Cloudflare production smoke
Implementation branch:    agent/pattern46-phenomenon-relation-20260918
```

Audit record: `PATTERN46_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Implementation checkpoint `558f154278a6a75c01e3fad14171e5ae5bc66fdd` on PR #200 passed CI #931, branch distribution 46/237/4, and manual nine-shot review with no P0/P1 blocker. CI #930 had correctly blocked the previous head on 320px overflow; the accepted head contains only the responsive containment fix on top of the audited implementation. Target distribution remains branch evidence until merge and merged-main verification.

## Pattern #43 — `single_rule_apply`

Verification chain:

```text
Audit PR:                #190
Audit main:              39830a5dfd91734e4cc88b7d79eafaa2f722615f
Audit main CI:           #890 / run 35295503508 — full success + exact Cloudflare production smoke
Implementation PR:       #191
Implementation head:     c893ba0ee63b256bbeb0da61e2bd90355c483a09
Implementation PR CI:    #899 / run 35296994744 — full success
Implementation main:     44f9dee07506a785f184d965b5bbc0a2aab66a8f
Implementation main CI:  #900 / run 35297572709 — full success + exact Cloudflare production smoke
```

Exact scope is the five audited Logic Wave C conditional-rule activities. Canonical assessed `tap_choice` / `choice_accuracy_v1` evidence is preserved. Existing `rule_pipeline`, `set_reasoning`, inference and unrelated Logic scopes remain unchanged. Browser QA, actual touch, manual nine-shot review and permanent visual QA are green.

## Pattern #42 — `growth_stage_transition`

Verification chain:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Code checkpoint:          0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR head:            bc115708c83c1f4829901455d4a5d39d7ea3261c
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Exact scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical boundaries remain Science / `science-life-material-motion` / `science-life-cycles` / `science.pack.life-cycles` / `science.life_cycles.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

Verified contract:

- exact three-ID deterministic config; no lifecycle prompt parser;
- canonical prompt, choices/order, submitted values and `correctChoice` unchanged;
- known stage + hidden target board;
- target hidden on idle/wrong, revealed only after correct completion;
- explicit previous-stage / next-adult-stage / next-young-stage modes;
- measured incorrect/retry and assessed accuracy preserved;
- keyboard, pointer and actual touch completion verified;
- no mastery/progression/schema/database migration.

Explicit exclusions remain `science-cycle-butterfly`, `science-match-young-adult-b`, existing `cause_effect`, `relative_order_track`, sequence and unrelated Science families.

Manual nine-shot visual review is accepted and merged-main permanent visual QA is green. Merged screenshot artifact `10514976832`, digest `sha256:ce7f6fc566952f8d20261eda8eb6c86c7fe6a2f0464f4c4fe72658d128451f4d`.

Closure evidence: `PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`.

## Production visual checkpoint

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#45 — **FULLY CLOSED / LIVE VERIFIED**.
- Pattern #45 docs closure — PR #198 merged to `79788dfb7f88164e699d1c3b9ac62b689d366c74`; merged-main CI #927 passed including exact Cloudflare production smoke.
- Pattern #46 audit — merged/live verified through PR #199 and audit-main CI #929.
- Pattern #46 implementation checkpoint — PR #200 head `558f1542` accepted; CI #931 full green; nine-shot review accepted; branch 46/237/4.
- Current gate — docs-inclusive final-head full CI, then exact-head merge and merged-main production verification.
- Continue only with justified exact scopes; reuse an existing mechanic when it already matches the evidence model.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
