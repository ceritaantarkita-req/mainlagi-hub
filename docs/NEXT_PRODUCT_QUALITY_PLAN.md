# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150` including exact Cloudflare release smoke  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758 / run `35115248445` including exact Cloudflare release smoke  
**Current product PR:** **#158 — VUI-02 Stage / Gallery convergence**  
**VUI-02 accepted implementation head before docs:** `7e85721bf42a1b31605bc87cd58594a8bbc55bd7`, CI #759 / run `35116294362` full PR success  
**Next implementation after VUI-02 closure:** **VUI-03 Public/Auth/Account convergence**  
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

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37 closed; visual docs current through VUI-02 acceptance |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS** | VUI-01 closed; VUI-02 accepted; VUI-03 next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | Art Bible + permanent 42-capture gate live |
| WS-09 Stage/gallery UX | **VUI-02 EXACT-HEAD ACCEPTED** | merge/live closure pending |
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

PR #156 is merged and independently verified on `main` SHA `9269e9fd576004d7d91fbd840e8c752acc7a5aae`. CI #751 / run `35110724150` passed the complete matrix including exact Cloudflare release smoke.

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

**VBASE-P1-05 permanent visual coverage gap is CLOSED.**

## Current P1 state

Merged-main state after VUI-01 closure:

```text
P0 findings: 0
P1 findings: 3
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation — OPEN**  
Reduced through scoped VUI waves and later targeted cleanup, not a risky one-shot stylesheet rewrite.

**VBASE-P1-02 — parent-report density/jargon — CLOSED**  
PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`; independent main CI #758 / run `35115248445` passed including exact Cloudflare smoke.

**VBASE-P1-03 — stage/readiness hierarchy — EXACT-HEAD ACCEPTED**  
VUI-02 PR #158 passed code-head CI #759. Formal closure requires final docs-head CI, clean exact merge and independent main/Cloudflare verification.

**VBASE-P1-04 — public/adult root IA — OPEN**  
Next wave VUI-03 Public/Auth/Account.

After VUI-02 is fully live-verified, P1 count should become **2**.

## VUI-01 — Parent Report convergence — FULLY CLOSED

Scope remained presentation + visual regression. `buildBatch15ParentReport`, mastery/evidence computation, progression/readiness, schema, migrations, activity content and learning answers were untouched.

Accepted outcome:
- primary weekly report uses family-facing Indonesian rather than internal analytics vocabulary;
- all original report fields remain the metric source;
- technical terminology stays available in per-subject diagnostic disclosure;
- permanent VQA prevents guarded jargon from leaking back into the primary report layer;
- 390 single-column, 768 2+1, 1280 three-column layout manually accepted.

Closure evidence:
- PR #157 exact head merged as `e212002eafef77a37a220834c6263e433cf9acbb`;
- independent main CI **#758 / run `35115248445`** full success;
- exact Cloudflare release smoke success.

## VUI-02 — Stage / Gallery convergence — EXACT-HEAD ACCEPTED

### Problem confirmed by baseline

Subject Gallery itself was structurally healthy, but two presentation defects remained:
- tablet/desktop subject journey used a horizontal row, leaving later stage cards partially clipped and requiring internal scrolling;
- StageScreen inherited global fixed card-grid columns, so a lesson with only two activities occupied narrow left-side columns and left a large empty right canvas at desktop widths.

### Implemented scope

No readiness/progression/mastery/content contract was changed.

Stage:
- stage identity and existing readiness become one Garden-aligned hero;
- readiness uses the same `status`, `completedCount` and `requiredCount` values;
- lessons become explicit visual panels with their existing objective and done count;
- lesson activity grid uses `repeat(auto-fit, minmax(260px, 1fr))` so one to three activities use readable available width;
- the same adaptive recommendation ID gets visual emphasis without reordering activities;
- optional motion remains explicitly separate and optional.

Subject journey:
- phone keeps compact horizontal behavior;
- tablet/desktop switch to responsive grid while preserving the exact same stage items, statuses and links.

### Permanent regression additions

Canonical Math subject/stage routes now assert:
- no internal journey horizontal scrolling at tablet/desktop;
- journey cards remain >= readable minimum width;
- stage readiness summary exists;
- exactly one canonical recommended activity remains visually marked;
- lesson grid does not overflow;
- canonical lesson cards use a minimum readable width: >=240px tablet and >=320px wide desktop.

### Evidence

Code head `7e85721bf42a1b31605bc87cd58594a8bbc55bd7` passed **CI #759 / run `35116294362`** completely.

Artifact:

```text
name:   mobile-route-qa-screenshots
id:     10455798162
digest: sha256:41ee08ebb674a7f2ccebd6d7498c6f60e2c4032618dd268c3db2290686eed012
captures: 42 / 42
```

Manual review accepted:
- 390 subject horizontal journey as intentional phone affordance;
- 768 subject two-column stage grid;
- 1280 subject responsive full-width journey;
- 390 stage stacked hero/readiness + readable lesson cards;
- 768 stage balanced hero and two-column lesson activities;
- 1280 stage two-column hero and full-width two-card lesson composition.

VUI-02 is not fully closed until this final docs head passes fresh CI, PR #158 passes clean merge checks, exact head is merged, and independent `main` CI + exact Cloudflare smoke succeed.

## VUI-03 — Public/Auth/Account convergence — NEXT AFTER VUI-02

Define an explicit clean-session adult/public entry while preserving known-child fast resume. Converge public/auth/account utility surfaces onto the Mainlagi family system and provide clearer trust/context around parent mode and camera/data expectations.

Required boundaries:
- do not remove fast resume for a known active child;
- distinguish public/adult onboarding from child play mode;
- keep auth/account behavior and security semantics unchanged unless a separately justified backend change is required;
- retain permanent 390/768/1280 evidence.

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
- content-aware grid density: cards should fill usable width without becoming cramped or creating accidental empty canvas;
- stage journey may be horizontally scrollable on phone but should expose all stages without internal horizontal scrolling on tablet/desktop where space allows.

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

1. Finish **PR #158 / VUI-02**: final docs-head CI -> clean gate -> exact-head squash merge -> independent main/Cloudflare verification.
2. Start **VUI-03 Public/Auth/Account** from the live-verified VUI-02 `main` SHA and re-run permanent visual QA.
3. Close residual token-fragmentation P1 with evidence; reach **P0=0 / P1=0**.
4. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
5. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
6. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
7. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.