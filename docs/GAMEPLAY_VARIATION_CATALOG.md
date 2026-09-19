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
46. `phenomenon_relation_board` — **FULLY CLOSED / LIVE VERIFIED**
47. `shape_attribute_board` — **FULLY CLOSED / LIVE VERIFIED**
48. **NO JUSTIFIED NEW PATTERN YET — AUDIT COMPLETE / CODE NOT STARTED**

## Current verified merged distribution

Current runtime truth after the live-verified Set Reasoning reuse:

```text
900 / 900 classified
0 unclassified
47 active child-facing patterns
choice_grid                     228 / 900
set_reasoning                    10 / 900
elimination_board                 5 / 900
phenomenon_relation_board         4 / 900
shape_attribute_board             4 / 900
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
compare_properties                3 / 900
healthy_habit_routine             4 / 900
```

Active-pattern count remains 47 because Set Reasoning was reuse/generalization, not a new pattern. Remaining distance is **3 patterns** to the current finish target of 50; no new Pattern #48 is justified merely to close that numeric gap.

Pattern #46 verified merged distribution:

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

## Pattern #48 — AUDIT COMPLETE / NO JUSTIFIED NEW PATTERN YET

Verified base:

```text
Pattern #47 closure main:  bbb61965c951a3dd2628b4b4be6d3b547b7fd68a
closure-main CI:           #951 / run 35365286942 — full success + exact Cloudflare production smoke
active patterns:           47
choice_grid:              233 / 900
```

No new gameplay pattern is approved by the current audit.

Reuse/generalization remains the preferred direction for:
- Logic multi-attribute classification -> `set_reasoning` / sorting;
- Math spatial -> `spatial_relation_board`;
- Math measurement -> `compare_properties`;
- English sentence completion -> `cloze_sentence_choice`;
- Science environment care -> routine/action mechanics.

Rejected as new-pattern candidates:
- Science force/motion — heterogeneous evidence forms;
- Science mixed review — intentionally heterogeneous review;
- Science ecosystem dependencies — close to existing relation mechanics;
- English categories/opposites — existing sorting/matching;
- Bahasa punctuation/capitalization — direct recognition; proofreading skin would be cosmetic;
- Iqro choice families — deferred pending expert acceptance.

Audit record: `PATTERN48_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Current reuse implementation: existing `set_reasoning` audit is merged/live verified and implementation is active for exactly five Logic `logic.classification.multi_attribute` activities:

```text
logic-classify-red-round
logic-classify-blue-not-round
logic-classify-two-red-items
logic-classify-arrow-not-left
logic-classify-same-shape-different-color
```

This is a generalization of an existing pattern, not Pattern #48. Audit PR #206 merged to `5f5f7741ee40544c4ab395740ef00fea1880400b`; audit-main CI #955 passed including exact Cloudflare production smoke. PR #207 final head `a37fdec7b3f89789999ce728c245ae17ee7f00bc` passed CI #963, final branch distribution 47/228/10, and final manual nine-shot review with no P0/P1 blocker, then squash-merged unchanged to main `9debb6cf30f789125c45eff1b88e65e4eaff7978`. Main CI #964 / run `35375338099` passed including exact Cloudflare smoke; post-merge docs main CI #969 / run `35376512392` also passed exact Cloudflare smoke. Set Reasoning reuse is **FULLY CLOSED / LIVE VERIFIED**.

Reuse audit record: `SET_REASONING_LOGIC_MULTI_CLASSIFICATION_REUSE_AUDIT_2026-09-18.md`.

Current next reuse audit: existing `spatial_relation_board` is justified for exactly five Math `math.spatial.position` activities:

```text
math-spatial-above
math-spatial-left
math-spatial-inside
math-spatial-near
math-spatial-between
```

This remains Pattern #40 reuse, not Pattern #48. The exact family is Math / `math-ukur-ruang` / `math-spatial-position` / `math.pack.spatial-position` / assessed `tap_choice` / `choice_accuracy_v1`. Required generalization is explicit/fail-closed; existing six Logic spatial activities must remain unchanged. Expected later verified distribution is 47 active / `choice_grid` 223 / `spatial_relation_board` 11 / `set_reasoning` 10.

Math spatial audit main CI #971 / run `35377783814` passed exact Cloudflare smoke. The reuse-chain closure is now live verified, and runtime implementation is **ACTIVE** on `agent/math-spatial-reuse-20260919`. Intended branch result remains 47 active / `choice_grid` 223 / `spatial_relation_board` 11 / `set_reasoning` 10.

Reuse audit record: `SPATIAL_RELATION_BOARD_MATH_POSITION_REUSE_AUDIT_2026-09-19.md`.

Audit PR #209 merged to main `3e30a817ef86fa691f9b2f1249ac00bc00dce4e6` after exact-head CI #970 success. Runtime remained unchanged at 47 active / `choice_grid` 228 / `spatial_relation_board` 6 / `set_reasoning` 10. Main CI #971 / run `35377783814` passed exact Cloudflare smoke, so this audit is **LIVE VERIFIED**.

Current next reuse audit: existing `compare_properties` is justified for exactly four Math `math.measure.intuition` direct-choice activities:

```text
math-measure-longer
math-measure-more-capacity
math-measure-fuller
math-measure-three-lengths
```

`math-measure-match-length` remains canonical matching / `matching_accuracy_v1`.

The current compare-properties UI uses two primary candidates plus a third other-choice. Math longer/fuller can reuse that binary contract; capacity/three-lengths require a typed multi-candidate variant where all three canonical choices are equivalent first-class property cards. This is existing-mechanic generalization, not Pattern #48. Code has not started.

Reuse audit record: `COMPARE_PROPERTIES_MATH_MEASURE_REUSE_AUDIT_2026-09-19.md`.

Audit PR #210 merged to main `f9833568dea0f021cd5c4ed94f6f6fc7505ad8d8` after exact-head CI #972 success. Runtime remained unchanged at 47 active / `choice_grid` 228 / `compare_properties` 3 / `spatial_relation_board` 6 / `set_reasoning` 10. Main CI #973 / run `35378825618` passed exact Cloudflare smoke, so this audit is **LIVE VERIFIED**.

Current next reuse audit: existing Pattern #38 `cloze_sentence_choice` is justified for exactly five English `english.sentence.completion` activities:

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

The existing five Bahasa cloze activities must remain behaviorally stable. English reuse requires exact 10-ID fail-closed configuration plus subject-aware child-facing locale/copy; it must not generalize by blank syntax alone. Code has not started.

Reuse audit record: `CLOZE_SENTENCE_CHOICE_ENGLISH_REUSE_AUDIT_2026-09-19.md`.

Audit PR #211 merged to main `76e1eeb0c0d50280c612b57af7d6e85e5a079f52` after exact-head CI #974 success. Runtime remained unchanged at 47 active / `choice_grid` 228 / `cloze_sentence_choice` 5 / `compare_properties` 3 / `spatial_relation_board` 6 / `set_reasoning` 10. Main CI #975 / run `35409217808` passed exact Cloudflare smoke, so this audit is **LIVE VERIFIED**.

Current next reuse audit: existing Pattern #22 `healthy_habit_routine` is justified for exactly four Science `science.environment.care.basic` direct-choice activities:

```text
science-env-trash-bin
science-env-save-water
science-env-reuse-bottle
science-env-plant-care
```

`science-match-environment-actions-c` remains canonical matching / `matching_accuracy_v1`.

Reuse requires an explicit domain variant because the current component/copy/metadata are body-health specific. Existing four body-health activities must remain unchanged; environment-care gets domain-correct action-selection copy/metadata. The legacy Pattern #22 identifier remains for compatibility. Audit PR #212 -> main `0fccffd769211e5b47be81ec5126c913d9c26fec`; PR CI #976 and main CI #977 both passed, with #977 exact Cloudflare smoke. Audit is **LIVE VERIFIED**; runtime code has not started.

Reuse audit record: `HEALTHY_HABIT_ROUTINE_ENVIRONMENT_CARE_REUSE_AUDIT_2026-09-19.md`.

## Pattern #47 — `shape_attribute_board` / FULLY CLOSED / LIVE VERIFIED

Exact candidate scope:

```text
math-shape-find-circle
math-shape-find-triangle
math-shape-find-square
math-shape-three-sides
```

Canonical ownership: Math / `math-banding-bentuk` / `math-shapes` / `math.pack.shapes` / assessed `tap_choice` / `choice_accuracy_v1`.

The candidate is distinct because:
- the lesson objective is direct recognition of basic shapes and simple visible properties;
- three activities measure `math.shape.recognition`, one measures `math.shape.properties`;
- current `symbol_hunt` is letter-specific and completion-only, not compatible reuse for assessed Math shape evidence;
- same-pack shape matching remains canonical matching;
- relative comparison and spatial relation mechanics do not represent intrinsic shape identity/property.

Audit-approved future presentation is a geometry board with exactly three canonical shape tiles in exact canonical order. Before submission, styling must be neutral/equivalent and cannot expose side-count or answer-specific clues. Wrong remains retryable/no completion; correct preserves canonical assessed accuracy.

Verified merged distribution:

```text
47 active child-facing patterns
choice_grid                      233 / 900
shape_attribute_board              4 / 900
```

Audit verification:

```text
Audit PR:                 #202
Audit PR head:            1ee6e245a3e150d1b6b4d9a4b0b3a801b0f9fe65
Audit PR CI:              #940 / run 35350664877 — full success
Audit main:               5978530aff2ad42a0feb28e8bf462b5048a8a69f
Audit merged-main CI:     #941 / run 35351346873 — full success + exact Cloudflare production smoke
Implementation branch:    agent/pattern47-shape-attribute-board-20260918
```

Audit record: `PATTERN47_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Implementation checkpoint `8d4a2bc1334b853d205cb8981312194ab1deeba5` on PR #203 passed CI #943, branch distribution 47/233/4, and manual nine-shot review with no P0/P1 blocker. CI #942 failed only because a regression asserted the wrong existing baseline for `math-spatial-above`; the accepted fix changed only that assertion.

Checkpoint artifacts:

```text
mobile screenshots:       10553614390 / sha256:a5211f08e5d0489c9f9a7aaf09a5ef5fe68d14793a18f393607e6c06db18a001
gameplay distribution:    10554204045 / sha256:3ebabd402a2880d8cdd87a251a1b14851347950c27d94567f10e84ecc86636bb
activity quality:          10553799372 / sha256:5c65273fb782b35af0524a52a685210266bce01e1d23b6fcf02978e365e78e42
```

Final PR head `aa77de822ca21ba6f4ab4347c946cd349fc2fff5` passed CI #948, merged through PR #203 to `7c5610d5872c572ad37e55a6bcffd5d6c576dc81`, and merged-main CI #949 independently verified 47/233/4 plus exact Cloudflare production smoke.

Merged-main #949 artifacts:

```text
mobile screenshots:       10554833911 / sha256:1dfb8c532c72e05a738edb515d875a8838e9ff38a9bd34819f298d174e484321
gameplay distribution:    10554873408 / sha256:abddd15f631bd3ba1432f714b1246c701ce4cbb5665f2794a60f5efb3488d78d
activity quality:          10555243210 / sha256:533ef27ca61acc255551fd71929e9e5eab8b5f23f2e89e2a8a80525b589834b8
```

Closure record: `PATTERN47_SHAPE_ATTRIBUTE_BOARD_CLOSURE_2026-09-18.md`.

## Pattern #46 — `phenomenon_relation_board` / FULLY CLOSED / LIVE VERIFIED

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

Implementation checkpoint `558f154278a6a75c01e3fad14171e5ae5bc66fdd` on PR #200 passed CI #931, branch distribution 46/237/4, and manual nine-shot review with no P0/P1 blocker. CI #930 had correctly blocked the previous head on 320px overflow. Final PR head `2b8e47b18a29cebf3b3dde0eda31b3d70c73dbaf` passed CI #936, merged to `027d81edba9f3b5585eb2c964aa89e80e3337422`, and merged-main CI #937 independently verified 46/237/4 plus exact Cloudflare production smoke.

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

- Patterns #1–#47 — **FULLY CLOSED / LIVE VERIFIED**.
- Pattern #47 final docs closure — PR #204 merged to `bbb61965c951a3dd2628b4b4be6d3b547b7fd68a`; closure-main CI #951 passed including exact Cloudflare production smoke.
- Pattern #48 fresh audit — merged/live verified through PR #205 / audit-main CI #953; **no justified new pattern yet**.
- Set Reasoning reuse — PR #207 -> main `9debb6cf`; main CI #964 + docs main #969 exact Cloudflare smoke; **FULLY CLOSED / LIVE VERIFIED**.
- Math spatial reuse audit — PR #209 -> main `3e30a817`; main CI #971 exact Cloudflare smoke; **LIVE VERIFIED / RUNTIME NEXT / CODE NOT STARTED**.
- Math measurement reuse audit — PR #210 -> main `f9833568`; main CI #973 exact Cloudflare smoke; matching excluded; **LIVE VERIFIED / RUNTIME QUEUED / CODE NOT STARTED**.
- English completion reuse audit — PR #211 -> main `76e1eeb0`; main CI #975 exact Cloudflare smoke; **LIVE VERIFIED / RUNTIME QUEUED / CODE NOT STARTED**.
- Science environment-care reuse audit — PR #212 -> main `0fccffd7`; main CI #977 exact Cloudflare smoke; explicit `environment_care` domain variant required; matching excluded; **LIVE VERIFIED / RUNTIME QUEUED / CODE NOT STARTED**.
- Math spatial runtime reuse is ACTIVE on `agent/math-spatial-reuse-20260919`; exact five Math IDs join the six legacy Logic IDs under existing `spatial_relation_board`.
- No Pattern #48 is created.
- Continue only with justified exact scopes; reuse an existing mechanic when it already matches the evidence model.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
