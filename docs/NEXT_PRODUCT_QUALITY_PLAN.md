# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150` including exact Cloudflare release smoke  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758 / run `35115248445` including exact Cloudflare release smoke  
**VUI-02 Stage / Gallery:** **FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764 / run `35118210891` including exact Cloudflare release smoke  
**Next implementation:** **VUI-03 Public/Auth/Account convergence**  
**Pattern #38:** **BLOCKED until P0=0 / P1=0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi gameplay diversification tidak boleh mendahului kualitas product shell.

Garden activity direction tetap child-facing anchor. Permanent visual QA berjalan terus selama public/child/parent/account/auth/system surfaces dikonvergensikan wave-by-wave.

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

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37, VUI-01, VUI-02 closed; VUI-03 next |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS** | VUI-01 + VUI-02 closed; VUI-03 next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | Art Bible + permanent 42-capture gate live |
| WS-09 Stage/gallery UX | **DONE / VUI-02 CLOSED** | PR #158 / CI #764 live verified |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

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

## Permanent visual/product gate — FULLY CLOSED

PR #156 is independently verified on `main` SHA `9269e9fd576004d7d91fbd840e8c752acc7a5aae`. CI #751 / run `35110724150` passed the complete matrix including exact Cloudflare release smoke.

Permanent browser evidence covers:

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

Blocking assertions cover expected HTTP status, exact final pathname, meaningful content, main/H1, expected route boundary, no Next error overlay, no horizontal overflow, child phone target floor, no uncaught page errors and no unexpected console errors.

## Current P1 state

Merged-main state after VUI-02 closure:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation — OPEN**  
Reduced through scoped VUI waves and later targeted cleanup, not a risky one-shot stylesheet rewrite. VUI-03 targets the remaining public/auth/account legacy cluster.

**VBASE-P1-02 — parent-report density/jargon — CLOSED**  
PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`; CI #758 including exact Cloudflare smoke.

**VBASE-P1-03 — stage/readiness hierarchy — CLOSED**  
PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`; CI #764 including exact Cloudflare smoke.

**VBASE-P1-04 — public/adult root IA — OPEN / NEXT**  
VUI-03 Public/Auth/Account.

**VBASE-P1-05 — permanent visual coverage gap — CLOSED**  
PR #156 -> `9269e9fd...`; CI #751.

## VUI-02 — Stage / Gallery convergence — FULLY CLOSED

No readiness/progression/mastery/content contract changed.

Accepted implementation:
- stage title/subtitle + existing readiness form one Garden-aligned hero;
- lessons form explicit panels with existing objective/progress;
- stage-only activity grid is content-aware so one to three cards use available width rather than fixed global 3/4-column slots;
- existing adaptive recommendation receives visual emphasis without reordering;
- optional motion remains separate and optional;
- phone subject journey remains horizontal by intent;
- tablet/desktop subject journey becomes responsive grid with no internal horizontal scroll.

Permanent regression asserts journey scrolling/width, stage readiness, canonical recommendation presence, lesson-grid overflow and minimum card width.

Closure evidence:
- implementation head `7e85721bf42a1b31605bc87cd58594a8bbc55bd7`, CI #759;
- final docs head `cba874f0b43904999c1ca905137fb092076b9334`, CI #763 / run `35117490284` full success;
- PR #158 squash merge `fe260ba7a239586ca2362fbabfca3e0a5019d453`;
- independent main CI **#764 / run `35118210891` full success**;
- exact Cloudflare release smoke success.

## VUI-03 — Public/Auth/Account convergence — NEXT

### Evidence-backed baseline

Exact source + final VUI-02 screenshots show:
- `/` still uses `PlayroomShell` in a clean session. Known-child fast resume is correct and must remain, but first-time/signed-out entry is still child-first rather than family/public-first;
- root does not yet make parent/account path or camera/data expectations explicit at the first decision point;
- `/login`, `/signup`, `/forgot-password` share correct `AuthForm` behavior but use the generic legacy `center-page` + `dialog-card` presentation;
- `/auth/callback` uses the same generic presentation while its callback/error logic is already correct;
- `/account` is already closer to the Mainlagi family language and needs targeted convergence rather than a full redesign;
- auth/security behavior is not the defect.

### Required implementation boundary

1. Preserve `readActiveChild()` fast resume for a valid known child.
2. Give clean-session root an explicit family/public hierarchy with separate child-start and parent/account actions.
3. Explain at a high level that Mainlagi is for children 3–7 and that camera-based movement play is optional; do not invent privacy claims beyond existing product behavior.
4. Converge login/signup/forgot/callback through a shared scoped Mainlagi family shell while leaving Supabase operations and redirect semantics unchanged.
5. Apply only evidence-backed account polish.
6. Add permanent VQA assertions for the public family entry and auth family shell at 390/768/1280.
7. Manual screenshot acceptance remains required even if structural assertions pass.

## VUI-04 — Game shell convergence — P2 after P1

Retain dark camera runtime where functionally useful, but align game catalog/detail/preflight navigation and metadata with Mainlagi.

## Art Bible gate

`MAINLAGI_ART_BIBLE.md` remains canonical. Important constraints:
- cream paper + navy ink + green primary CTA;
- Nunito Variable for family-facing UI with Noto fallback/script support;
- stable spacing/radius/elevation scale;
- >=44px minimum targets, 52–56px preferred child targets;
- Mainlagi Icon/LearningSymbol before raw emoji for permanent semantic UI;
- explicit idle/wrong/success/locked/loading/empty/error states;
- phone/tablet/desktop visual regression evidence;
- content-aware grid density;
- public/auth/account surfaces must feel like one family rather than child UI plus generic utility cards.

## Definition of Done for visual checkpoint

The visual checkpoint is complete only when:
- permanent VQA remains green on merged `main`;
- every baseline P1 finding is fixed or explicitly reclassified with evidence;
- visual matrix is green and manually accepted at 390 / 768 / 1280 plus required supplemental viewports;
- Art Bible matches implemented reality;
- no permanent route capture passes through unintended redirect;
- final `main` CI + exact Cloudflare smoke are green;
- canonical docs record **P0=0 / P1=0**.

Only then may Pattern #38 begin.

## Current execution order

1. Implement **VUI-03 Public/Auth/Account** from the live-verified VUI-02 baseline and re-run permanent visual QA.
2. Close residual token-fragmentation P1 with evidence; reach **P0=0 / P1=0**.
3. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
4. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
5. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
6. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.