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
45. `elimination_board` — **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Current verified merged distribution

```text
900 / 900 classified
0 unclassified
44 active child-facing patterns
choice_grid                     246 / 900
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

Remaining distance is **6 patterns** to the current finish target of 50.

Pattern #45 implementation target (branch-only until verified/merged):

```text
45 active child-facing patterns
choice_grid                     241 / 900
elimination_board                 5 / 900
```

Exact candidate scope: `logic-infer-not-red`, `logic-infer-only-triangle`, `logic-infer-not-largest`, `logic-infer-common-feature`, `logic-infer-missing-member`.

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

## Pattern #45 — `elimination_board` / IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED

Canonical scope is exactly the five Logic elimination/inference activities in `logic.pack.elimination-inference`, skill `logic.inference.elimination.basic`, assessed `tap_choice` / `choice_accuracy_v1`.

Why this candidate is distinct:
- the objective explicitly includes **eliminating choices** before drawing a direct conclusion;
- `set_reasoning` is a two-rule membership board;
- `odd_one_out` finds one mismatch among a shared trait;
- `sorting_buckets` assigns categories;
- the five candidate tasks span negative exclusion, unique target, size elimination, common-feature inference, and missing-member inference.

Approved future presentation is limited to making wrong/retry selections visibly `tersisih` while preserving the canonical three choices and final correct completion. No choice may be pre-disabled and no additional assessed checkpoint is approved.

Audit verification:

```text
Audit PR:                 #196
Audit PR head:            e00106f0b65e6d007944d2a87b2f187e0b2dedbb
Audit PR CI:              #915 / run 35307361453 — full success
Audit main:               a3a1702ae390fb24c95551d91d31b24b4b867be6
Audit merged-main CI:     #916 / run 35307880654 — full success + exact Cloudflare production smoke
Implementation branch:    agent/pattern45-elimination-board-20260918
```

Audit record: `PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Verified implementation checkpoint:

```text
Implementation PR:        #197
Verified head:            a182c4882d6eadbfb79a8fb88b96ad92b0e62139
Checkpoint CI:            #919 / run 35309241809 — full success
Manual visual review:     ACCEPTED / no P0-P1 Pattern #45 blocker
Branch distribution:      45 active / choice_grid 241 / elimination_board 5
```

Artifacts:

```text
mobile screenshots:       10532478130 / sha256:afb197e83772b4cda39a325e682d32ec79ca17e02c6c5e88e964363895cb0a9b
gameplay distribution:    10532374574 / sha256:99c7d7b559626ae1b5ff289f3c5225e9ef8e3a3d720ef6bfb9b471de7d0a7c41
activity quality:          10532174875 / sha256:81a0c866032ad7d7bcd2e54c55ae1a12ab06393a98c524832119764b1e5ab619
```

Acceptance records: `PATTERN45_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md` and `WS05_ELIMINATION_BOARD_WAVE_2026-09-18.md`.

This remains branch evidence. Pattern #45 is not merged-main truth until the docs-inclusive final PR head passes CI, exact-head merge completes, and resulting `main` passes independent production verification.

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

- Patterns #1–#44 — **FULLY CLOSED / LIVE VERIFIED**.
- Pattern #44 docs closure — PR #195 merged to `d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc`; merged-main CI #914 passed including exact Cloudflare production smoke.
- Pattern #45 audit — merged/live verified through PR #196 and audit-main CI #916.
- Pattern #45 implementation checkpoint — PR #197 head `a182c488...` passed CI #919; nine dedicated screenshots manually accepted.
- Current gate — full CI on the docs-inclusive final PR #197 head, then exact-head merge and independent merged-main production verification.
- Continue only with justified exact scopes; reuse an existing mechanic when it already matches the evidence model.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
