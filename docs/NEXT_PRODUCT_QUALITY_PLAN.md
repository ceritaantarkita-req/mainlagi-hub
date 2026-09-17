# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Visual checkpoint:** **P0=0 / P1=0 LIVE VERIFIED**  
**Final P1 closure:** PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 / run `35168877485`, exact Cloudflare release smoke success  
**Pattern #38:** **UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT — NOT PRE-APPROVED FOR IMPLEMENTATION**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**.

Visual P1 sudah live-closed. Permanent visual QA tetap blocking dan sekarang mencakup 21 canonical routes × 3 viewports = 63 exact-path screenshots.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan demi mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact-scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA dan manual visual review.
5. Jangan membuat drag-only interaction tanpa fallback accessible bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Deployment smoke tidak sama dengan whole-product visual acceptance.
9. Public, child, parent/account/auth dan system states harus mengikuti Art Bible setelah dimigrasikan.
10. Screenshot QA invalid jika route diam-diam redirect dari expected pathname.
11. P1=0 tidak berarti mechanic baru otomatis layak; setiap Pattern baru tetap harus melalui objective/evidence audit.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup tidak boleh menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
19. Green automated checks tidak menggantikan screenshot review; CI #780 membuktikan manual review dapat menemukan defect yang structural gate tidak tandai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | live closure through PR #162 / main CI #788 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 CLOSED** | P0=0 / P1=0 live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **READY FOR FRESH #38 AUDIT** | 37 active merged patterns |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 63-capture gate live |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after current product-quality waves |

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

Deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 structural findings**.

## Permanent visual/product gate

The browser gate is now **21 canonical routes × 3 viewports = 63 exact-path screenshots** at:

```text
390x844
768x1024
1280x800
```

Coverage includes public root, child selection/home/subject/stage/activity/rewards, Parent Report, account root, all six migrated account subpages, login, signup, forgot-password, reset-password, deterministic auth error and canonical not-found.

Blocking checks include exact path/status, main/H1, route boundary where applicable, no Next overlay, no horizontal overflow, no page/console errors, child touch floor, Parent Report copy guard, Stage/Subject geometry guards, public/auth/account guards, account-section geometry, reset-password auth mode and canonical not-found markers.

Final P1 live evidence:

```text
PR:                       #162
merge/main SHA:           2d3f95066e1106c43c76bf91dd29bf5707dca52c
main CI:                  #788 / run 35168877485 — full success
Cloudflare exact release: success
visual artifact:          10464427013
artifact digest:          sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures:                 63 / 63
```

## Visual finding state

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

All five baseline P1 findings are closed. Full record: `VBASE_P1_01_LIVE_CLOSURE_2026-09-17.md` plus the prior VUI closure records.

Remaining P2:
- game detail/preflight legacy vocabulary;
- mixed canonical symbols/raw emoji;
- inline visual styles increasing drift risk.

These are lower priority than the now-unblocked gameplay objective/evidence audit and must be handled without destabilizing accepted surfaces.

## Pattern #38 audit boundary — NEXT

Pattern #38 begins with research, not implementation.

Required sequence:
1. Re-read `GAMEPLAY_VARIATION_CATALOG.md`, current activity catalog/distribution and mastery/evidence contracts.
2. Identify learning objectives still over-concentrated in existing interaction families.
3. Select a candidate only where a distinct interaction improves the objective, not merely the pattern count.
4. Verify assessed/practice ownership and whether qualifying measured evidence is required.
5. Reject any candidate that would duplicate an existing mechanic under a new label.
6. Define exact activity scope before code changes.
7. Document expected learning interaction, fallback/accessibility behavior, completion/evidence contract and regression matrix.
8. Only then implement Pattern #38 on a new branch from the latest live-verified main SHA.

No gameplay family is pre-approved.

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

## Current execution order

1. Finish and live-verify the P1 closure-doc branch.
2. Run the fresh Pattern #38 objective/evidence audit from the latest verified main SHA.
3. If justified, implement Pattern #38 with permanent WS-08 QA and exact evidence/progression tests.
4. Continue WS-05 toward 50–60 meaningful patterns.
5. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later WS-12 cleanup.
6. Address P2 visual cleanup without destabilizing the P1-accepted product shell.
7. Final end-to-end production acceptance and canonical release closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
