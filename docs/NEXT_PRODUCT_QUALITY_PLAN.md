# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #45 — Logic `elimination_board`  
**Pattern #42 implementation:** PR #187 -> main `37190f5dabd5d8421d7575b8f220d2824e831f23`  
**Pattern #42 implementation main CI:** **#884 / run `35260402125` — full success + exact Cloudflare production smoke**  
**Pattern #42 closure:** PR #188 -> `ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710`  
**Pattern #42 closure main CI:** **#886 / run `35290502532` — full success + exact Cloudflare production smoke**  
**Pattern #43 implementation:** PR #191 -> main `44f9dee07506a785f184d965b5bbc0a2aab66a8f`  
**Pattern #43 merged-main CI:** **#900 / run `35297572709` — full success + exact Cloudflare production smoke**  
**Pattern #44 audit:** PR #193 -> main `8b3cb7e73a77502b4c9206936e7736ac9169b1ca`  
**Pattern #44 audit merged-main CI:** **#904 / run `35299949341` — full success + exact Cloudflare production smoke**  
**Pattern #44 implementation:** PR #194 -> main `8406c89777a68da4bd6e89f01a561e5aa1e90c01`  
**Pattern #44 final PR head:** `0835d2b93c0ae3d579518dcfa5964266bcbb1f2c`  
**Pattern #44 final PR CI:** **#911 / run `35302598975` — full success**  
**Pattern #44 implementation main CI:** **#912 / run `35303076429` — full success + exact Cloudflare production smoke**  
**Pattern #44 closure docs:** PR #195 -> main `d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc`  
**Pattern #44 closure docs main CI:** **#914 / run `35306629423` — full success + exact Cloudflare production smoke**  
**Pattern #45 audit:** PR #196 -> main `a3a1702ae390fb24c95551d91d31b24b4b867be6`  
**Pattern #45 audit PR CI:** **#915 / run `35307361453` — full success**  
**Pattern #45 audit merged-main CI:** **#916 / run `35307880654` — full success + exact Cloudflare production smoke**  
**Pattern #45 implementation:** PR #197 -> main `43dd857b0fb5b51fe94c4e83da114260a788b4f8`  
**Pattern #45 accepted checkpoint:** `a182c4882d6eadbfb79a8fb88b96ad92b0e62139` / CI #919 full success  
**Pattern #45 final PR head:** `ac410e6905da2c7951bdc794715b5604c138a65b`  
**Pattern #45 final PR CI:** **#924 / run `35311598469` — full success**  
**Pattern #45 implementation main CI:** **#925 / run `35312057984` — full success + exact Cloudflare production smoke**  
**Pattern #45 manual visual review:** **ACCEPTED / nine dedicated screenshots / no P0-P1 blocker**  
**Merged-main P1:** **0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 sekarang diarahkan ke **finish target 50 meaningful gameplay patterns**. Target kerja 60 sebelumnya ditunda/non-blocking dan tidak termasuk scope finish saat ini. Mechanic baru tetap hanya boleh dipilih karena learning objective dan evidence contract-nya membutuhkan interaction tersebut.

Garden activity direction tetap child-facing anchor. Permanent visual QA tetap blocking di setiap wave berikutnya.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan demi mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact-scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA dan manual visual review.
5. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
6. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
7. Deployment smoke tidak sama dengan whole-product visual acceptance.
8. Pattern berikutnya wajib dimulai dari fresh objective/evidence audit. Tidak ada family mechanic yang otomatis pre-approved.
9. Green automated checks tidak menggantikan screenshot review.
10. P1=0 tidak menghapus P2 atau external-evidence backlog.
11. A transition presentation must not reveal the target growth stage before the learner submits the canonical correct answer.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **CURRENT** | Pattern #45 live truth synchronized; next gate is fresh Pattern #46 audit |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **45 FULLY CLOSED / LIVE VERIFIED** | Pattern #45 merged-main CI #925 green; 5 patterns remain to finish target 50 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | P45 merged-main permanent visual QA green; nine dedicated screenshots manually accepted |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified merged gameplay baseline

```text
900 / 900 classified
0 unclassified
45 active merged patterns
choice_grid                     241 / 900
elimination_board                 5 / 900
subitizing_glance                 3 / 900
single_rule_apply                 5 / 900
growth_stage_transition           3 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
```

Distance remaining: **5 patterns** to the current WS-05 finish target of 50. No 60-pattern expansion is required for this finish scope.

## Pattern #45 — `elimination_board` / FULLY CLOSED / LIVE VERIFIED

Fresh audit base is Pattern #44 closure main `d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc`. Audit PR #196 merged to `a3a1702ae390fb24c95551d91d31b24b4b867be6`; audit merged-main CI #916 is full success including exact Cloudflare production smoke.

Exact candidate scope:

```text
logic-infer-not-red
logic-infer-only-triangle
logic-infer-not-largest
logic-infer-common-feature
logic-infer-missing-member
```

Canonical ownership is Logic / `logic-conditional-analogy-inference` / `logic-elimination-inference` / `logic.pack.elimination-inference` / `logic.inference.elimination.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

Audit rationale:
- lesson objective: eliminate choices and draw a direct conclusion from visible features;
- skill description: eliminate choices and draw a direct conclusion from simple information;
- generic `choice_grid` records the final selection but does not expose the elimination process;
- `set_reasoning` remains a two-rule membership interaction and should not be broadened;
- `odd_one_out` remains a one-mismatch interaction;
- `sorting_buckets` remains category assignment;
- nearby Math/English/Bahasa families were rejected where existing mechanics already cover the evidence model or where a new interaction would add unsupported evidence.

Approved presentation boundary, if the audit later merges:
- canonical choices stay in canonical order and remain selectable;
- a wrong selected choice may become visibly marked `tersisih` while retry stays available;
- a correct selection becomes the surviving conclusion and completes via the existing evidence path;
- no pre-disabled distractor, timer, speed score, drag-only interaction, prompt parser, extra assessed checkpoint, mastery/progression/schema/database migration.

Verified merged-main distribution:

```text
45 active patterns
choice_grid                     241 / 900
elimination_board                 5 / 900
```

Audit record: `PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Verification chain:

```text
Audit PR:                  #196
Audit main:                a3a1702ae390fb24c95551d91d31b24b4b867be6
Audit merged-main CI:      #916 / run 35307880654 — full success + exact Cloudflare production smoke
Implementation PR:         #197
Accepted checkpoint:       a182c4882d6eadbfb79a8fb88b96ad92b0e62139
Checkpoint CI:             #919 / run 35309241809 — full success
Final PR head:             ac410e6905da2c7951bdc794715b5604c138a65b
Final PR CI:               #924 / run 35311598469 — full success
Implementation main:       43dd857b0fb5b51fe94c4e83da114260a788b4f8
Implementation main CI:    #925 / run 35312057984 — full success + exact Cloudflare production smoke
Manual visual review:      ACCEPTED / 320, 390, 768 × idle, try, success
```

Merged-main CI #925 artifacts:

```text
mobile screenshots:      10534131038 / sha256:ee855f81403a490de077b1add0e4009437caf070a222da3ca860528354a4ea53
gameplay distribution:   10534385065 / sha256:4bad3ee041353b24b57a2715020aa302cbdbfa4b7d1c9eebd588a48ac0e65d2e
activity quality:         10534385061 / sha256:eebcc3b932495954314c11b69f7409f9c7d5ea3d38c4287bd9ba6958387c1503
```

Implementation keeps the five canonical choices/order/answers exact, marks only learner-selected wrong choices as visibly `tersisih`, preserves retry/completion semantics, and adds no mastery/progression/schema/database migration.

Closure record: `PATTERN45_ELIMINATION_BOARD_CLOSURE_2026-09-18.md`.

## Pattern #44 — `subitizing_glance` / FULLY CLOSED / LIVE VERIFIED

Audit base: `18a4dd30ce58841dd3717b1e53c13af628e950af`. Audit PR #193 merged to `8b3cb7e73a77502b4c9206936e7736ac9169b1ca`; merged-main CI #904 / run `35299949341` is full success including Cloudflare production smoke.

Exact candidate scope:

```text
math-subitize-2
math-subitize-4
math-subitize-5
```

Canonical ownership is Math / `math-jumlah-dasar` / `math-subitizing` / `math.pack.subitizing` / `math.quantity.subitizing` / assessed `tap_choice` / `choice_accuracy_v1`.

The objective is recognizing small quantities from spatial arrangements without always counting one by one. Existing `count_and_select` explicitly teaches one-by-one enumeration, so it must remain unchanged. The candidate presentation is allowed only as a deterministic spatial-dot board that preserves exact prompts, choices/order, answers and existing measured retry/accuracy semantics. No forced timer, speed score, mastery/progression/schema/database migration or prompt parsing is approved.

Verified merged-main distribution:

```text
44 active patterns
choice_grid                     246 / 900
subitizing_glance                 3 / 900
```

Audit record: `PATTERN44_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`.

Verification chain:

```text
Audit PR:                 #193
Audit main:               8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Audit merged-main CI:     #904 / run 35299949341 — full success + exact Cloudflare production smoke
Implementation PR:        #194
Verified code checkpoint: 3a4385790a793ed5297db4f6d33fa8e1d084ccf1
Code checkpoint CI:       #906 / run 35301923329 — full success
Final PR head:            0835d2b93c0ae3d579518dcfa5964266bcbb1f2c
Final PR CI:              #911 / run 35302598975 — full success
Implementation main:      8406c89777a68da4bd6e89f01a561e5aa1e90c01
Implementation main CI:   #912 / run 35303076429 — full success + exact Cloudflare production smoke
Manual visual review:     ACCEPTED / 320, 390, 768 × idle, wrong, success
```

Merged-main CI #912 artifacts:

```text
mobile screenshots:      10531026015 / sha256:8898d82a8e1f000bd9924b7f3b9e04baeea137f139dfdb21fe83e274397a6021
gameplay distribution:   10531025693 / sha256:05fcac2bfac4fa07b9667c27d4b5ed17d3436911c27918b93b73201f4cb43fec
activity quality:         10530404555 / sha256:2ef4d746d92545e49fd2e6e9519db5f67ee0d26e18d28ccfb3d50c4331122400
```

The previous PR head was correctly blocked by CI #905 because the smallest-viewport success CTA was not fully visible. The corrected responsive success state passed CI #906 without changing canonical learning/evidence behavior.

Detailed records: `PATTERN44_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md` and `WS05_SUBITIZING_GLANCE_WAVE_2026-09-18.md`.

## Pattern #43 — `single_rule_apply`

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

Exactly five Logic Wave C conditional-rule activities use this pattern. Canonical prompts, choices, answer payloads, assessed evidence, mastery and progression are unchanged. Manual 320/390/768 review and permanent visual QA are accepted.

## Pattern #42 — `growth_stage_transition`

Verification chain:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Exact scope remains `science-cycle-frog`, `science-cycle-chick`, and `science-cycle-seed-sprout`; butterfly/full-sequence and matching lifecycle work remain excluded. Canonical Science ownership, assessed `tap_choice`, `choice_accuracy_v1`, prompts, choices, answer payloads, mastery and progression remain preserved.

Merged verification confirms exact-scoped fail-closed config, hidden-target transition board, measured retry/accuracy semantics, keyboard/pointer/touch access, 42-pattern distribution, permanent visual QA and production smoke.

Full closure evidence: `PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`.

## Permanent visual/product gate — LIVE

The blocking production gate remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

## Current execution order

1. Pattern #45 is closed/live verified; preserve its exact five-ID scope and merged 45-pattern baseline.
2. Start Pattern #46 with a fresh objective/evidence audit only. No mechanic, subject, or content family is pre-approved.
3. If an existing mechanic already expresses the objective/evidence model, reuse it instead of inventing a new pattern.
4. If Pattern #46 is justified, require the same exact-scope regression, keyboard/pointer/actual-touch QA, nine-shot visual review, permanent visual gate, exact-head merge and merged-main Cloudflare verification.
5. Repeat this path through Pattern #50, then run final overall QA/docs/production closeout.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
