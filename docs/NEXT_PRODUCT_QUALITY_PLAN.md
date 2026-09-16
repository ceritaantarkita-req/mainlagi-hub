# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, main CI #751 / run `35110724150` full success including exact Cloudflare release smoke  
**Current product PR:** **#157 — VUI-01 Parent Report convergence**  
**VUI-01 accepted code head:** `6a4450467b8d9bd01cd9f2bc0806100c84d187f3`, CI #753 / run `35112741852` full PR success + accepted 390/768/1280 evidence  
**Next implementation after VUI-01 closure:** **VUI-02 Stage/Gallery convergence**  
**Pattern #38:** **BLOCKED until P0=0 / P1=0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 remains targeted at minimum **50**, working target **60 meaningful gameplay patterns**, but gameplay diversification must not outrun the product shell.

The accepted Garden activity direction is the child-facing visual anchor. Permanent visual QA now stays active while the remaining product surfaces converge wave-by-wave.

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
12. A failing visual gate must be diagnosed; assertions may only be narrowed when the exception is intentional and explicitly verified.
13. Responsive acceptance is evidence-based: a green non-overflow assertion does not excuse unreadable tablet/desktop composition.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37 closed; visual docs current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS** | VUI-01 exact-head accepted; VUI-02 next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | Art Bible v1 + permanent 42-capture gate live |
| WS-09 Stage/gallery UX | DONE / P1 convergence required | VUI-02 next |
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

Blocking assertions include expected HTTP status, exact final pathname, meaningful content, main/H1, expected route boundary, no Next error overlay, no horizontal overflow, child phone target floor, no uncaught page errors and no unexpected console errors.

The explicit 404 probe is still strict: it must return exact 404 and exact pathname. Only Chromium's exact document-level 404 console string is scoped out on that expected-404 route.

**VBASE-P1-05 permanent visual coverage gap is CLOSED.**

## Current P1 state

Merged-main baseline after VQA-01 closure:

```text
P0 findings: 0
P1 findings: 4
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation**  
Open. It is intentionally reduced through VUI-01/VUI-02/VUI-03 and later targeted cleanup, not a risky one-shot stylesheet rewrite.

**VBASE-P1-02 — parent-report density/jargon**  
VUI-01 exact-head accepted on PR #157; final merge + independent main/Cloudflare verification still required before formal closure.

**VBASE-P1-03 — stage/readiness hierarchy**  
Next implementation: VUI-02.

**VBASE-P1-04 — public/adult root IA**  
Queued for VUI-03 together with public/auth/account convergence.

After VUI-01 is fully live-verified, P1 count should become **3**.

## VUI-01 — Parent Report convergence — EXACT-HEAD ACCEPTED

Scope boundary: presentation + visual regression only. `buildBatch15ParentReport`, mastery/evidence computation, progression/readiness, schema, migrations, activity content and learning answers are untouched.

Implemented:
- primary weekly report uses normal family-facing Indonesian rather than `attempt / assessed / practice / qualifying evidence / retry / mastery canonical` vocabulary;
- underlying counts, accuracy, completion, mastery score/coverage, stage states, recommendations, recent results and awards remain sourced from the same fields;
- technical terminology remains available in per-subject diagnostic disclosure;
- canonical `LearningSymbol` + product icons replace permanent analytics emoji where appropriate;
- nine equal dashboard-like subject cards become one grouped report panel;
- dedicated `ParentReport.module.css` keeps migration scoped;
- permanent VQA asserts the primary Parent Report layer contains the family summary and does not leak guarded internal jargon.

Evidence sequence:
- CI #752 was green and produced valid screenshots, but human review found the 768px three-column metric layout too cramped despite no overflow;
- the tablet layout was corrected to **2+1 cards**, while 390 remains single-column and 1280 remains three-column;
- fresh code head `6a4450467b8d9bd01cd9f2bc0806100c84d187f3` passed CI **#753 / run `35112741852`** completely;
- artifact `10452654695`, digest `sha256:c8d985fdf5cc9601d8fe2bbecd4ac0c4f7b39a82ed14bf7f091eec7dd273a170`, contains 42/42 permanent screenshots;
- Parent Report exact path `/parent/children/demo-gian/reports` returned HTTP 200 at 390/768/1280;
- manual visual review accepted all three viewports after the fix.

VUI-01 is not called fully closed until the final docs head passes fresh CI, PR #157 passes clean merge checks, the exact head is merged, and independent `main` CI + exact Cloudflare smoke succeed.

## VUI-02 — Stage/Gallery convergence — NEXT

Objective:
- improve Garden continuity on subject/stage/gallery surfaces;
- use tablet/desktop space intentionally;
- make progress, readiness, recommended state and lesson grouping visually distinct;
- retain exact stage gates, prerequisites and completion rules;
- keep permanent 390/768/1280 evidence and existing 320 high-risk coverage.

VUI-02 must start from the final live-verified VUI-01 `main` SHA, not from PR #157's branch.

## VUI-03 — Public/Auth/Account convergence

Define clean-session root behavior, adult/public overview/trust context and explicit parent-vs-child path. Migrate auth/account utility surfaces away from generic legacy dialog styling into the canonical family system.

## VUI-04 — Game shell convergence — P2 after P1

Retain dark camera runtime where functionally useful, but align game catalog/detail/preflight navigation and metadata with Mainlagi.

## Art Bible gate

`MAINLAGI_ART_BIBLE.md` remains canonical. Important constraints:
- cream paper + navy ink + green primary CTA;
- Nunito Variable for family-facing UI with Noto fallback/script support;
- stable spacing/radius/elevation scale;
- >=44px minimum targets, 52–56px preferred child targets;
- Mainlagi Icon/LearningSymbol before raw emoji for permanent semantic UI;
- Garden characters/art used purposefully;
- explicit idle/wrong/success/locked/loading/empty/error states;
- phone/tablet/desktop visual regression evidence.

Do not mass-rewrite already accepted Garden activity mechanics merely to centralize CSS.

## Definition of Done for visual checkpoint

The visual checkpoint is complete only when:
- permanent VQA remains green on merged `main`;
- every baseline P1 finding is fixed or explicitly reclassified with evidence;
- visual matrix is green and manually accepted at 390 / 768 / 1280 plus required supplemental viewports;
- Art Bible matches implemented reality;
- no permanent route capture passes through an unintended redirect;
- final `main` CI + exact Cloudflare smoke are green;
- canonical docs record **P0=0 / P1=0**.

Only then may Pattern #38 begin.

## Current execution order

1. Finish **PR #157 / VUI-01**: final docs-head CI -> clean gate -> exact-head squash merge -> independent main/Cloudflare verification.
2. Start **VUI-02 Stage/Gallery** from that live-verified main SHA and re-run permanent visual QA.
3. Implement **VUI-03 Public/Auth/Account** and re-run permanent visual QA.
4. Close remaining token-fragmentation P1 with evidence; reach **P0=0 / P1=0**.
5. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
6. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
7. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
8. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.