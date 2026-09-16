# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Pattern #37 final CI:** #741 / run `35103399012` — full success including exact Cloudflare production smoke  
**Visual baseline checkpoint:** PR #155 -> `d3d600ed92e78d30da8172e0bdb300119990614f`; CI #743 full success including exact Cloudflare smoke  
**Current implementation:** PR #156 — VQA-01 permanent visual product baseline  
**VQA-01 exact-head acceptance:** CI #745 / run `35108485349` — full PR matrix success; 42/42 captures manually reviewed  
**Pattern #38:** **BLOCKED until P0=0 / P1=0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 remains targeted at minimum **50**, working target **60 meaningful gameplay patterns**, but gameplay diversification must not outrun the product shell.

The accepted Garden activity direction is the child-facing visual anchor. The current checkpoint is to converge the rest of the product toward one coherent Mainlagi family while keeping a permanent visual gate active before Pattern #38.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Deployment smoke tidak sama dengan whole-product visual acceptance.
9. Public, child, parent/account/auth and system states must preserve the canonical Art Bible once migrated.
10. A visual QA screenshot is invalid if the route silently redirected away from the expected pathname.
11. Pattern #38 cannot start while any baseline P0/P1 finding remains open.
12. A failing visual gate must be diagnosed; assertions may only be narrowed when the exception is an intentional, explicitly verified route contract.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37 closed; visual checkpoint current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS via baseline remediation** | VUI-01 parent report is next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / IN_PROGRESS** | Art Bible v1; VQA-01 exact-head accepted |
| WS-09 Stage/gallery UX | DONE / P1 convergence required | VUI-02 queued |
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

Distance remaining after the visual checkpoint: **13 patterns** to minimum 50 and **23** to working target 60.

## Pattern #37 — FULLY CLOSED

Implementation PR #153 and closure PR #154 are complete. Final verified `main` is `b1793adaabe19a9c73e021534899f8b50c4097f6`; final CI #741 / run `35103399012` passed the full matrix including exact Cloudflare production smoke.

No further #37 code/docs closure is required.

## Production visual/product baseline

Canonical audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`.  
Canonical visual rules: `MAINLAGI_ART_BIBLE.md`.

Current result before PR #156 merges:

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: exact-head accepted; merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
```

### P1 backlog

**VBASE-P1-01 — visual-token fragmentation**  
Garden/Playroom, `LearningPlatform.module.css`, and `globals.css` still express overlapping product languages. Close through scoped migration waves, not a one-shot rewrite.

**VBASE-P1-02 — parent-report density/jargon**  
Underlying evidence is trustworthy, but primary parent presentation exposes internal analytics terminology and dashboard density. This is **VUI-01, next implementation**.

**VBASE-P1-03 — stage/readiness hierarchy**  
Tablet/desktop stage composition underuses available space and weakly distinguishes progress, recommendation and lesson grouping. This is VUI-02.

**VBASE-P1-04 — public/adult entry IA**  
Root currently behaves primarily as child playroom/fast-resume. Clean-session adult/public value proposition and parent-vs-child entry need an explicit contract. This is part of VUI-03.

**VBASE-P1-05 — permanent visual QA coverage gap**  
Implementation is exact-head accepted on CI #745. It remains formally open only until PR #156 is merged from its final head and independent `main` CI + exact Cloudflare smoke are green. After that, baseline P1 count becomes four.

## VQA-01 — Permanent visual baseline gate

### Accepted implementation contract

PR #156 adds `scripts/run-visual-baseline-browser-tests.mjs` inside the existing blocking `Mobile route QA (Chromium)` job.

Canonical matrix:

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

Surfaces: public root, child select, child home, Math subject/gallery, Math Angka stage, `math-count-3`, rewards, parent report, account, login, signup, forgot-password, deterministic expired-auth-link state, and not-found.

Blocking assertions include:
- expected HTTP status;
- exact final pathname;
- nonblank body;
- main landmark + H1;
- expected route boundary where applicable;
- no Next.js error overlay;
- no horizontal overflow;
- child phone touch target floor;
- no uncaught page errors;
- no unexpected browser console errors.

### Failure-driven hardening

CI #744 exposed one intentional browser behavior: navigating the deliberate not-found probe correctly returned HTTP 404, and Chromium also emitted its normal document-load console error `Failed to load resource: the server responded with a status of 404 (Not Found)`.

The fix is deliberately narrow:
- the expected-404 route still must return exact 404 and exact pathname;
- all other structural/page assertions stay active;
- only that exact document-level 404 console string is permitted when the route contract itself expects 404;
- unrelated console errors still fail;
- all status-200 routes retain the zero-console-error contract.

Fresh exact-head CI #745 then passed every PR job, including VQA-01.

### Evidence review

Artifact `mobile-route-qa-screenshots` from run #745 contains 42/42 captures and the manifest. Manual review found no new P0 blocker and confirmed the baseline priorities:
- child select/home, representative Garden activity and rewards are usable visual references;
- parent report remains the densest/most technical family-facing surface;
- stage tablet/desktop still underuses space;
- auth/system cards are visually under-scaled on wider viewports.

VQA-01 is not fully closed until its final docs-head CI, exact clean merge and independent production verification complete.

## VUI-01 — Parent report convergence — NEXT

Preserve every report metric, mastery/evidence boundary and recommendation semantic. Change the primary reading layer, hierarchy and visual grouping only.

Implementation direction:
- translate internal words such as `attempt`, `assessed`, `practice`, `qualifying evidence`, `retry`, and `mastery canonical` into normal parent language;
- keep counts/percentages sourced from the exact same report fields;
- use fewer, clearer summary groups before subject-level detail;
- use canonical icons rather than emoji as permanent analytics semantics;
- move technical evidence wording into lower hierarchy or diagnostic detail rather than deleting the truth it represents;
- add dedicated 390/768/1280 browser evidence and retain permanent VQA coverage;
- do not edit `buildBatch15ParentReport` semantics merely for presentation.

## VUI-02 — Stage/gallery convergence

Improve Garden continuity, tablet/desktop composition, readiness/progress hierarchy and recommended-state emphasis. Do not alter stage gates or completion requirements.

## VUI-03 — Public/auth/account convergence

Define clean-session root behavior, adult/public overview/trust context and explicit parent-vs-child path. Migrate auth/account utility surfaces away from generic legacy dialog styling into the canonical family system.

## VUI-04 — Game shell convergence — P2 after P1

Retain dark camera runtime where functionally useful, but align game catalog/detail/preflight navigation and metadata with Mainlagi.

## Art Bible gate

`MAINLAGI_ART_BIBLE.md` is canonical for new product-surface visual work. Core rules include:
- cream paper + navy ink + green primary CTA;
- Nunito Variable for family-facing product UI with Noto fallback/script support;
- stable spacing/radius/elevation scale;
- >=44px minimum targets, 52–56px preferred child targets;
- Mainlagi Icon/LearningSymbol before raw emoji for permanent semantic UI;
- Garden characters/art used purposefully, never blocking task content;
- explicit idle/wrong/success/locked/loading/empty/error states;
- phone/tablet/desktop visual regression evidence.

Do not mass-rewrite already accepted Garden activity mechanics merely to centralize CSS.

## Definition of Done for visual checkpoint

The baseline checkpoint is complete only when:
- VQA-01 is merged and independently production-verified;
- every baseline P1 finding is fixed or explicitly reclassified with evidence;
- visual matrix is green at 390 / 768 / 1280 plus required supplemental viewports;
- Art Bible is current with implemented reality;
- no route capture passes via unintended redirect;
- final `main` CI + exact Cloudflare smoke are green;
- canonical docs record **P0=0 / P1=0**.

Only then may Pattern #38 begin.

## Broader quality-phase completion

The overall product-quality phase remains open until:
- gameplay diversity reaches an accepted endpoint toward 50–60 meaningful patterns;
- visual/product acceptance is current across public/child/parent/account/auth/system states;
- narration/voice work is addressed;
- external real-device/accessibility acceptance is complete;
- Iqro expert acceptance is complete;
- governance gates are current;
- final end-to-end production journey passes;
- canonical docs and exact production release are verified.

## Current execution order

1. Finish PR #156 from its final docs head: fresh CI -> exact clean gate -> squash merge -> independent `main` + exact Cloudflare smoke.
2. Implement **VUI-01 Parent Report convergence** and re-run permanent visual QA.
3. Implement **VUI-02 Stage/Gallery convergence** and re-run permanent visual QA.
4. Implement **VUI-03 Public/Auth/Account convergence** and re-run permanent visual QA.
5. Close all remaining P1 findings and verify the exact production release.
6. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
7. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
8. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
9. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.