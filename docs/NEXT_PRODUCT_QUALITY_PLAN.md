# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758  
**VUI-02 Stage / Gallery:** **FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764  
**VUI-03 Public/Auth/Account:** **FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke  
**Current P1:** **1 — residual visual-token fragmentation**  
**Pattern #38:** **BLOCKED until P0=0 / P1=0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi gameplay diversification tidak boleh mendahului kualitas product shell.

Garden activity direction tetap child-facing anchor. Permanent visual QA tetap blocking selama public/child/parent/account/auth/system surfaces dikonvergensikan wave-by-wave.

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
11. Pattern #38 tidak boleh mulai selama baseline masih punya P0/P1 terbuka.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup **tidak boleh** menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | through VUI-03 live closure |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 CLOSURE** | VUI-01/02/03 closed; residual token pass next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | Art Bible + permanent 42-capture gate live |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after P1 visual closure |

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

## Permanent visual/product gate — FULLY CLOSED / BLOCKING

The browser gate remains 14 canonical routes x 3 viewports = **42 exact-path screenshots** at:

```text
390x844
768x1024
1280x800
```

Blocking checks include exact path/status, main/H1, route boundary where applicable, no Next overlay, no horizontal overflow, no page/console errors, child touch floor, Parent Report copy guard, Stage/Subject geometry guards and VUI-03 public/auth/account guards.

## Current P1 state

Merged-main state after VUI-03 closure:

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation — OPEN / SOLE P1**  
VUI-01/02/03 removed the major parent/stage/public/auth/account drift. Remaining work is a targeted system/public residual audit, not a global rewrite. Initial evidence: canonical not-found still uses legacy `center-page`, `dialog-card` and blue `.button--primary`.

**VBASE-P1-02 — parent-report density/jargon — CLOSED**  
PR #157 / CI #758.

**VBASE-P1-03 — stage/readiness hierarchy — CLOSED**  
PR #158 / CI #764.

**VBASE-P1-04 — public/adult root IA — CLOSED**  
PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`; independent CI #776 / run `35124809180` including exact Cloudflare release smoke.

**VBASE-P1-05 — permanent visual coverage gap — CLOSED**  
PR #156 / CI #751.

## VUI-03 closure

VUI-03 is live verified. Full evidence is recorded in `VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`.

Functional contracts preserved:
- valid remembered child still fast-resumes through the existing child destination logic;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` keep existing Supabase operations, validation, recovery/callback semantics and redirects;
- `/account` keeps signed-in/signed-out behavior and destination routes;
- no learning/mastery/evidence/progression/content/schema/database behavior changed.

## Residual P1 closure — NEXT

### Goal

Reach **P0=0 / P1=0** without destabilizing accepted surfaces.

### Required audit boundary

1. Enumerate remaining uses of legacy global utility shells (`center-page`, `dialog-card`, legacy blue primary actions) on public/family/system routes.
2. Separate product-facing drift from admin/diagnostic-only utility styling.
3. Migrate only the product-facing residuals to scoped Mainlagi system/family presentation.
4. Prefer shared scoped modules and canonical Art Bible tokens; do not mass-edit all global classes.
5. Add or strengthen permanent VQA markers for any newly migrated canonical surface.
6. Review 390 / 768 / 1280 screenshots manually.
7. Require fresh exact-head full CI, clean merge gate, independent `main` CI and exact Cloudflare smoke.
8. Update canonical docs to **P0=0 / P1=0** only after production verification.

### Initial evidence

The permanent not-found route remains a direct residual candidate:
- `src/app/not-found.tsx` still uses `center-page` + `dialog-card`;
- its primary action still inherits the old blue `.button--primary` token;
- the route is already in the permanent screenshot matrix, making it a deterministic closure target.

Admin-only `AdminGate` also uses the old utility classes, but admin styling is not automatically a P1 because the Art Bible explicitly allows denser/utilitarian admin presentation. It should only be migrated if the audit proves user-facing leakage or a shared-token risk.

## Art Bible gate

`MAINLAGI_ART_BIBLE.md` remains canonical. Key constraints:
- cream paper + navy ink + green primary CTA;
- Nunito Variable for family-facing UI with Noto fallback/script support;
- >=44px minimum targets, 52–56px preferred child targets;
- Mainlagi Icon/LearningSymbol before raw emoji for permanent semantic UI;
- explicit loading/empty/error/success states;
- phone/tablet/desktop visual regression evidence;
- no one-shot stylesheet rewrite;
- public/auth/account/system surfaces must feel like one product family.

## Definition of Done for visual checkpoint

The visual checkpoint is complete only when:
- permanent VQA remains green on merged `main`;
- every baseline P1 is closed or explicitly reclassified with evidence;
- manual 390 / 768 / 1280 review is accepted;
- final `main` CI + exact Cloudflare smoke are green;
- canonical docs record **P0=0 / P1=0**.

Only then may Pattern #38 begin.

## Current execution order

1. Execute targeted **VBASE-P1-01 residual visual-token closure**.
2. Live-verify and document **P0=0 / P1=0**.
3. Run a fresh objective/evidence audit for Pattern #38; no family is pre-approved.
4. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
5. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
6. Final end-to-end production acceptance and canonical release closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.