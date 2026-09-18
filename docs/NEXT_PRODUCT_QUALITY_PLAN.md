# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #42 — Science `growth_stage_transition`  
**Pattern #42 implementation:** PR #187 -> main `37190f5dabd5d8421d7575b8f220d2824e831f23`  
**Pattern #42 implementation main CI:** **#884 / run `35260402125` — full success + exact Cloudflare production smoke**  
**Pattern #42 closure:** PR #188 -> `ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710`  
**Pattern #42 closure main CI:** **#886 / run `35290502532` — full success + exact Cloudflare production smoke**  
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
| WS-01 Canonical docs | **CURRENT** | Pattern #43 audit merged/live-verified; implementation PR #191 in progress |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **42 MERGED / P43 IMPLEMENTATION IN PROGRESS** | PR #191 exact five Logic `single_rule_apply`; finish target remains 50 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | P42 merged-main permanent visual QA green |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified merged gameplay baseline

```text
900 / 900 classified
0 unclassified
42 active merged patterns
choice_grid                     254 / 900
growth_stage_transition           3 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
```

Distance remaining: **8 patterns** to the current WS-05 finish target of 50. No 60-pattern expansion is required for this finish scope.

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

1. Verify/merge the Pattern #43 `single_rule_apply` objective/evidence audit for exactly five Logic Wave C activities.
2. Implement only that exact scope from verified audit `main`; no adjacent Logic family is included.
3. Keep exact-scope regression, evidence semantics, keyboard/touch/pointer, responsive QA and permanent visual QA blocking.
4. Independently verify Pattern #43 on merged `main` and exact Cloudflare production before calling it complete.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
