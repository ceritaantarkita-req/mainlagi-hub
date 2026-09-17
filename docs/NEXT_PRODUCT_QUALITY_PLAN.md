# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Visual checkpoint:** **P0=0 / P1=0 LIVE VERIFIED**  
**Final P1 closure:** PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, main CI #788 / run `35168877485` including exact Cloudflare release smoke  
**Permanent visual QA:** **21 routes × 3 viewports = 63 exact-path screenshots**  
**Pattern #38:** **UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT — no mechanic pre-approved**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi diversification wajib mengikuti learning objective dan evidence contract.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan demi mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact-scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA dan manual visual review.
5. Jangan membuat drag-only interaction tanpa fallback accessible bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Deployment smoke tidak sama dengan whole-product visual acceptance.
9. Public, child, parent/account/auth dan system states yang sudah accepted tidak boleh diregresikan untuk mempermudah wave berikutnya.
10. Screenshot QA invalid jika route diam-diam redirect dari expected pathname.
11. Green automated checks tidak menggantikan screenshot review; CI #780 adalah precedent bahwa visual defect dapat lolos structural gate.
12. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan layout cramped, clipped, kosong palsu, atau hierarchy yang buruk.
13. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
14. P2 cleanup tidak boleh menjadi alasan mass rewrite global CSS atau perubahan semantics.
15. Known-child fast resume, auth/session/recovery, mastery/evidence/progression/readiness dan curriculum semantics tetap protected boundaries.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | P1 live closure documented |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P0/P1 COMPLETE** | residual visual-token P1 closed/live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **READY FOR PATTERN #38 AUDIT** | 37 active patterns; fresh objective/evidence audit next |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 63-capture exact-path gate live |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | scoped cleanup after stable behavior |

## Verified gameplay baseline

```text
900 / 900 classified
0 unclassified
37 active merged patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards             5 / 900 = 0.56%
picture_word_match               5 / 900 = 0.56%
Bahasa choice_grid               29 / 100
```

Distance remaining: **13 patterns** to minimum 50 and **23** to working target 60.

## Visual checkpoint closure

The production visual checkpoint is closed at:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

Final P1 closure evidence:

```text
PR:                 #162
merged main:        2d3f95066e1106c43c76bf91dd29bf5707dca52c
PR implementation: 923635645c164f08e9d26cc84be0b527d0e13ae0
PR CI:              #781 / run 35137266315
PR artifact:        10464427013
artifact digest:    sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
main CI:            #788 / run 35168877485 — full success
Cloudflare exact release smoke: SUCCESS
```

The permanent matrix is now **21 canonical routes × 3 viewports = 63 captures** at 390x844, 768x1024 and 1280x800. Manual screenshot review is still required for changed family/system surfaces.

## Remaining P2 state

**VBASE-P2-01 — game detail/preflight legacy vocabulary**  
Treat as a separate scoped visual/product wave. Dark camera runtime may remain where useful.

**VBASE-P2-02 — iconography mixes canonical symbols and raw emoji**  
Prefer `LearningSymbol` / `Icon` for permanent semantic UI; content/decorative emoji may remain.

**VBASE-P2-03 — inline visual styles increase drift risk**  
Technical cleanup only after confirming no accepted behavior changes.

P2 work does not block starting the Pattern #38 audit, but it remains part of the quality roadmap.

## Pattern #38 entry gate

Pattern #38 may now enter a fresh audit, not immediate implementation.

Required sequence:
1. identify candidate activities from objective/evidence fit rather than pattern-count pressure;
2. inspect current presentation, evidence, mastery/progression and accessibility boundaries;
3. reject candidates that only create superficial visual variety;
4. define exact scope and invariant behavior;
5. implement only if the audit supports a distinct meaningful interaction;
6. require deterministic tests, full CI, permanent visual QA and manual screenshot review;
7. merge and live-verify before counting the pattern as active.

No gameplay family is pre-approved.

## Current execution order

1. Run fresh **Pattern #38 objective/evidence audit**.
2. If a legitimate candidate exists, implement one tightly scoped gameplay pattern with all regression/evidence gates.
3. Continue WS-05 toward 50–60 meaningful patterns with permanent WS-08 visual QA running in parallel.
4. Continue WS-02 narration, WS-10 external acceptance and WS-11 governance.
5. Address P2 game-shell/iconography/inline-style convergence in scoped waves.
6. Continue WS-12 technical cleanup later.
7. Final production E2E + external acceptance closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.