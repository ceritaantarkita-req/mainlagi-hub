# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #36 — Bahasa `sentence_order_cards`  
**Current merged gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 implementation PR:** #153 — merged  
**Pattern #37 final implementation head:** `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`  
**Pattern #37 exact-head CI:** #738 / run `35097844249` — success  
**Pattern #37 merge SHA:** `6a6f99ccb3a733af4e298ed8c48452e019f9980c`  
**Pattern #37 post-merge CI:** #739 / run `35098428328` — full success including exact Cloudflare production smoke  
**Pattern #37:** **IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE IN PROGRESS**  
**Current product sequencing:** close #37 -> production visual/product baseline audit -> Pattern #38  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

Gameplay diversification must not outrun the product shell. The production visual/product baseline is therefore a required checkpoint before Pattern #38; after that checkpoint, WS-08 visual QA runs in parallel with WS-05.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Work tidak boleh disebut fully closed sebelum exact-head implementation merge, live `main` verification, dan required post-merge closure selesai.
9. Deployment smoke tidak sama dengan whole-product visual acceptance; public, child, parent/account/auth and system states need their own cross-surface QA.
10. Future WS-05 work must preserve the visual baseline once established.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | Pattern #37 closure docs in progress |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO / queued | production audit will define exact backlog |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | IN_PROGRESS | 37 merged patterns; #37 closure pending |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **NEXT PRODUCT CHECKPOINT** | production baseline + Art Bible + permanent visual gate |
| WS-09 Stage/gallery UX | DONE / re-audit in production baseline | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified merged gameplay baseline

```text
900 / 900 classified
0 unclassified
37 active merged patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards              5 / 900 = 0.56%
picture_word_match                5 / 900 = 0.56%
Bahasa choice_grid                29 / 100
```

Distance remaining: **13 patterns** to minimum 50 and **23 patterns** to working target 60.

## Pattern #37 — Bahasa Reading Passage Question — MERGED / LIVE VERIFIED

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Canonical boundaries:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-bacaan-pendek`;
- pack `bahasa.pack.bacaan-pendek`;
- skill `bahasa.bacaan.short_comprehension`;
- assessed runtime remains `tap_choice`;
- exactly three canonical answer choices, same order and unchanged `correctChoice`;
- all non-scope families, content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Verified chain:
- implementation base `461b0fd59a6c238752aa858bf783716b225b548a`;
- final implementation head `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`;
- exact-head CI #738 / run `35097844249` — success;
- PR #153 squash merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`;
- independent `main` CI #739 / run `35098428328` — full success including exact Cloudflare production smoke;
- all nine dedicated responsive idle/wrong/success screenshots accepted;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0;
- merged distribution is 900/900 classified with 37 active patterns.

Remaining #37 work is docs-only closure: fresh closure-head full CI -> clean exact-scope/review/thread/mergeability gate -> exact-head squash merge -> final independent `main` CI + exact Cloudflare production smoke. Only then may #37 be called **FULLY CLOSED**.

## Production visual/product baseline audit — required before Pattern #38

### Scope

Audit production behavior and visual consistency across:
- public/home entry;
- child profile selection;
- child home/playroom;
- subject/gallery;
- stage/readiness/locked/progress states;
- representative activity families;
- rewards;
- parent dashboard;
- account;
- login/register/forgot-password/auth states;
- loading, error, empty and offline/degraded states where applicable;
- header, nav, menus and back-navigation;
- desktop, tablet and mobile breakpoints.

### Evaluation axes

For every surface, check:
- information and visual hierarchy;
- child/family tone and consistency with Garden direction;
- typography scale and density;
- spacing/grid consistency;
- radius, shadows and surface language;
- icon/illustration/character usage;
- CTA priority and button consistency;
- responsive reflow and scroll length;
- clipping/overflow;
- focus states, accessible naming, target sizes and keyboard behavior;
- loading/error/empty-state clarity;
- route correctness and progression redirects.

### Required outputs

1. Route/surface inventory and viewport matrix.
2. P0/P1/P2 findings with evidence.
3. Approved visual baseline screenshots for representative surfaces.
4. Art Bible/design-system rules covering typography, colors, spacing, cards, buttons, icons, characters, states and responsive behavior.
5. Permanent screenshot/visual regression gate for stable representative routes.
6. Explicit backlog for WS-03 public/parent frontend and WS-08 visual QA.
7. Fix + re-test loop until no P0/P1 visual/product blockers remain.

Known direction from current evidence: Garden gameplay samples are the child-facing visual anchor; parent/account/public surfaces need consistency review so they do not drift into a generic SaaS/dashboard feel; full activity-route QA must detect progression redirects instead of false-pass counting.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, exact-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

The broader product-quality phase is complete only after:
- gameplay diversity reaches an accepted endpoint toward 50–60 meaningful patterns;
- production visual/product acceptance is current across public/child/parent/account/auth/system states;
- Art Bible/permanent visual QA exists;
- narration/voice work is addressed;
- external real-device/accessibility acceptance is complete;
- Iqro expert acceptance is complete;
- governance gates are current;
- final end-to-end production journey passes;
- canonical docs and exact production release are verified.

## Current execution order

1. Finish Pattern #37 separate docs-only closure from exact implementation merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`.
2. Run the production visual/product baseline audit and record P0/P1/P2 backlog.
3. Fix P0/P1 visual/product findings and establish/update WS-08 Art Bible + permanent visual QA.
4. Run a fresh objective/evidence audit for Pattern #38; no family is pre-approved.
5. Continue WS-05 toward 50–60 patterns while WS-08 visual QA runs in parallel.
6. Execute WS-02 narration and WS-03 public/parent improvements using the audited baseline.
7. Complete WS-10 external acceptance and WS-11 governance.
8. Run WS-12 technical cleanup only after product quality is stable.
9. Run final production end-to-end acceptance: fresh user -> profile -> subject -> activity wrong/retry/success -> mastery/progress -> rewards -> parent report -> account/auth journey.
10. Final canonical docs + exact Cloudflare release verification, then close the quality phase.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
