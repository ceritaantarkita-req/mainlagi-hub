# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 / run `35110724150` including exact Cloudflare release smoke  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758  
**VUI-02 Stage / Gallery:** **FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764  
**VUI-03 Public/Auth/Account:** **EXACT-HEAD IMPLEMENTATION ACCEPTED**, PR #160 implementation head `96de380796cdcb16cd10f390805f4c7b62f9b83b`, CI #771 / run `35122985995` full success  
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
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | #37, VUI-01, VUI-02 closed; VUI-03 acceptance current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **IN_PROGRESS** | VUI-01 + VUI-02 closed; VUI-03 exact-head accepted |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | Art Bible + permanent 42-capture gate live |
| WS-09 Stage/gallery UX | **DONE / VUI-02 CLOSED** | PR #158 / CI #764 live verified |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | residual token cleanup first; broader cleanup after quality stabilizes |

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

Permanent browser evidence remains:

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

Blocking assertions include exact status/path, meaningful content, main/H1, expected route boundary, no Next error overlay, no horizontal overflow, child phone target floor, no page/console errors, Parent Report copy guard, Stage/Subject geometry guards and the VUI-03 public/auth/account guards described below.

## Current P1 state

Merged-main state remains after VUI-02 closure until PR #160 is live-verified:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation — OPEN**  
VUI-03 removes another large public/auth/account legacy styling cluster through scoped modules, but remaining global/legacy clusters still need an evidence-first closure pass.

**VBASE-P1-02 — parent-report density/jargon — CLOSED**  
PR #157 / CI #758.

**VBASE-P1-03 — stage/readiness hierarchy — CLOSED**  
PR #158 / CI #764.

**VBASE-P1-04 — public/adult root IA — EXACT-HEAD ACCEPTED**  
PR #160 implementation head `96de380796cdcb16cd10f390805f4c7b62f9b83b`; CI #771 full success. Formal closure waits for final docs-head CI, exact merge, independent `main` CI and exact Cloudflare smoke.

**VBASE-P1-05 — permanent visual coverage gap — CLOSED**  
PR #156 / CI #751.

If VUI-03 closes live without regression, P1 count becomes **1**.

## VUI-03 — Public/Auth/Account convergence — EXACT-HEAD IMPLEMENTATION ACCEPTED

### Implemented public contract

- clean-session `/` uses public/family navigation and hierarchy instead of child `PlayroomShell`;
- existing `readActiveChild()` fast resume remains intact for a valid known child;
- one primary child-start CTA and one parent/account CTA are explicit;
- root identifies Mainlagi as a family product for children 3–7 and says movement-camera play is optional without inventing privacy guarantees;
- subject discovery remains available and still routes through profile preparation.

### Implemented auth contract

- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` use one Mainlagi family shell;
- login/signup/forgot/reset form presentation uses scoped Mainlagi styling rather than the legacy global auth classes;
- family auth routes own the viewport, preventing duplicate public navbar + auth brand composition;
- Supabase operations, validation, recovery/callback semantics, messages and redirects remain unchanged.

### Implemented account contract

- `/account` uses a scoped family account module instead of its legacy global presentation classes;
- signed-in/signed-out behavior and all existing destinations remain unchanged;
- phone remains stacked; tablet/desktop use a readable two-column settings grid.

### VUI-03 permanent regression additions

Existing 14-route / 42-capture matrix now additionally asserts:
- public family marker, child CTA and parent CTA;
- optional-camera explanation;
- >=44px family CTA target height;
- auth family shell/context/panel markers;
- correct login/signup/forgot form mode and >=44px auth controls;
- auth callback error status inside the family shell;
- account family/settings markers, seven settings links, minimum card height and readable tablet/desktop width.

### Evidence

```text
implementation head: 96de380796cdcb16cd10f390805f4c7b62f9b83b
PR CI:              #771 / run 35122985995 — full success
artifact:           10458188042
artifact digest:    sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb
captures:           42 / 42
manifest mismatch:  0
```

Manual 390/768/1280 review accepted public root, account, login, signup, forgot-password and callback error presentation. Reset-password uses the same accepted shell/form styling but is not a separate route in the canonical 14-surface screenshot matrix.

VUI-03 is not fully closed until the final docs head passes fresh full CI, PR #160 passes clean merge checks, the exact head is merged, and independent `main` CI + exact Cloudflare release smoke succeed.

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

Closure: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, main CI #764, exact Cloudflare smoke success.

## VUI-04 — Game shell convergence — P2 after P1

Retain dark camera runtime where functionally useful, but align game catalog/detail/preflight navigation and metadata with Mainlagi. Do not start this P2 wave ahead of the remaining P1 token-fragmentation closure unless evidence changes priority.

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
- public/auth/account surfaces must feel like one family rather than child UI plus generic utility cards;
- known-child fast resume and auth/security behavior are functional contracts, not visual cleanup targets.

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

1. Finish **PR #160 / VUI-03**: fresh final docs-head CI -> clean gate -> exact-head squash merge -> independent main/Cloudflare verification.
2. Run the targeted **VBASE-P1-01 residual visual-token closure** and re-run permanent visual QA.
3. Reach **P0=0 / P1=0** and record it canonically.
4. Run fresh objective/evidence audit for Pattern #38; no family is pre-approved.
5. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
6. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
7. Final end-to-end production acceptance and canonical closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.