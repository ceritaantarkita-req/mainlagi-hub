# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Pattern #37 final CI:** #741 / run `35103399012` — full success including exact Cloudflare production smoke  
**Current product gate:** **Production Visual / Product Baseline + P1 remediation**  
**Pattern #38:** **BLOCKED until P0=0 / P1=0 and permanent visual QA is green**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 remains targeted at minimum **50**, working target **60 meaningful gameplay patterns**, but gameplay diversification must not outrun the product shell.

The accepted Garden activity direction is the child-facing visual anchor. The current checkpoint is to make the rest of the product converge toward one coherent Mainlagi family and to install a permanent visual gate before Pattern #38.

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

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37 fully closed; visual baseline docs active |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS via baseline remediation** | parent/public/auth/account backlog defined |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for visual gate |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / IN_PROGRESS** | Art Bible v1 + permanent gate + P1 fixes |
| WS-09 Stage/gallery UX | DONE / P1 convergence required | progression correct; visual hierarchy needs convergence |
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

Current audit result:

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Whole-product visual acceptance: NOT YET ACCEPTED
```

### P1 backlog

**VBASE-P1-01 — visual-token fragmentation**  
Garden/Playroom, `LearningPlatform.module.css`, and `globals.css` currently express different product languages.

**VBASE-P1-02 — parent-report density/jargon**  
Underlying evidence is trustworthy, but primary parent presentation exposes internal analytics terminology and generic dashboard density.

**VBASE-P1-03 — stage/readiness hierarchy**  
Tablet/desktop stage layout is structurally correct but underuses available space and weakly distinguishes progress, recommendation and lesson grouping.

**VBASE-P1-04 — public/adult entry IA**  
Root currently behaves primarily as child playroom/fast-resume. Clean-session adult/public value proposition and parent-vs-child entry need an explicit contract.

**VBASE-P1-05 — permanent visual QA coverage gap**  
Current screenshots are strong for gameplay but do not cover enough shell/auth/account/rewards/system states to make whole-product visual drift blocking.

## Active remediation waves

### VQA-01 — Permanent visual baseline gate — NEXT IMPLEMENTATION

Required:
- deterministic fixtures/profile/readiness where needed;
- exact pathname assertion before capture;
- stable screenshot names;
- minimum viewports 390x844, 768x1024, 1280x800;
- 320px supplemental for high-risk child/activity controls;
- representative routes: public root clean state, child select, child home, subject/gallery, stage, representative Garden activities, rewards, parent report, account, login/auth state, not-found/empty/error/degraded representative states;
- screenshots uploaded from CI;
- no false PASS from progression redirects.

### VUI-01 — Parent report convergence

Preserve metrics/mastery/evidence semantics. Change only presentation hierarchy and parent-facing language where appropriate. Technical evidence vocabulary belongs in secondary/diagnostic detail, not the first reading layer.

### VUI-02 — Stage/gallery convergence

Improve Garden continuity, tablet/desktop composition, readiness/progress hierarchy and recommended-state emphasis. Do not alter stage gates or completion requirements.

### VUI-03 — Public/auth/account convergence

Define clean-session root behavior, adult/public overview/trust context and explicit parent-vs-child path. Migrate auth/account utility surfaces away from generic legacy dialog styling into the canonical family system.

### VUI-04 — Game shell convergence — P2 after P1

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
- permanent VQA-01 is merged and runs in CI;
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

1. Merge this visual baseline + Art Bible docs from exact fully closed Pattern #37 main.
2. Implement **VQA-01 permanent visual baseline gate**.
3. Implement **VUI-01 parent report** and re-run baseline.
4. Implement **VUI-02 stage/gallery** and re-run baseline.
5. Implement **VUI-03 public/auth/account** and re-run baseline.
6. Close P1 findings and verify exact production release.
7. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
8. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
9. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
10. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.