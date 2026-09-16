# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA foundation:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758  
**VUI-02 Stage / Gallery:** **FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764  
**VUI-03 Public/Auth/Account:** **FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke  
**VUI-03 docs baseline:** `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215` including exact Cloudflare release smoke  
**Merged-main P1:** **1 — residual visual-token fragmentation**  
**PR #162:** final P1 implementation candidate accepted on head `923635645c164f08e9d26cc84be0b527d0e13ae0`; live closure pending  
**Pattern #38:** **BLOCKED until merged production is P0=0 / P1=0**  
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
11. Pattern #38 tidak boleh mulai selama merged production masih punya P0/P1 terbuka.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup tidak boleh menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
19. Green automated checks tidak menggantikan screenshot review; #780 membuktikan manual review dapat menemukan defect yang structural gate tidak tandai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | candidate docs through PR #162; production closure still pending |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 LIVE-VERIFY GATE** | final implementation candidate accepted; merge/main verification next |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **PAUSED AT 37** | Pattern #38 waits for production P1=0 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PRIMARY / RUNNING** | permanent candidate gate expanded to 63 captures |
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

## Permanent visual/product gate

Merged `main` has the original blocking VQA foundation. PR #162 strengthens that gate on the candidate head to **21 canonical routes × 3 viewports = 63 exact-path screenshots** at:

```text
390x844
768x1024
1280x800
```

The 21-route candidate set covers public root, child selection/home/subject/stage/activity/rewards, Parent Report, account root, all six migrated account subpages, login, signup, forgot-password, reset-password, deterministic auth error and canonical not-found.

Blocking checks include exact path/status, main/H1, route boundary where applicable, no Next overlay, no horizontal overflow, no page/console errors, child touch floor, Parent Report copy guard, Stage/Subject geometry guards, public/auth/account guards, account-section geometry, reset-password auth mode and canonical not-found markers.

Accepted implementation evidence:

```text
head:    923635645c164f08e9d26cc84be0b527d0e13ae0
CI:      #781 / run 35137266315 — full PR success
artifact id: 10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures: 63 / 63
routes:   21
status:   60 x 200 + 3 intentional 404
missing:  0
```

Manual review accepted the final artifact. A prior #780 artifact exposed an empty-card defect on the security stub; that defect was fixed before #781 and was not waived.

## Current P1 state

Merged-main state remains:

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
```

**VBASE-P1-01 — visual-token fragmentation — IMPLEMENTATION CANDIDATE ACCEPTED / LIVE CLOSURE PENDING**  
PR #162 removes the evidenced residual family/system drift without a global CSS rewrite. Six account subpages now share a scoped family shell, canonical not-found uses a scoped Mainlagi system state, and permanent evidence covers every migrated route. Final production closure still requires exact-head docs CI, clean merge, independent main CI and exact Cloudflare smoke.

**VBASE-P1-02 — parent-report density/jargon — CLOSED**  
PR #157 / CI #758.

**VBASE-P1-03 — stage/readiness hierarchy — CLOSED**  
PR #158 / CI #764.

**VBASE-P1-04 — public/adult root IA — CLOSED**  
PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`; independent CI #776 / run `35124809180` including exact Cloudflare release smoke.

**VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED**  
PR #156 established the gate; PR #162 strengthens it from 14 routes / 42 captures to 21 routes / 63 captures on its candidate head.

## PR #162 functional boundaries

Preserved:
- valid remembered child fast resume;
- Supabase auth/session/recovery/callback behavior;
- account signed-in/signed-out behavior and existing destination routes;
- account component data operations;
- learning/mastery/evidence/progression/content/schema/database behavior.

Explicit exclusions:
- admin-only utility styling unless proven to leak;
- game detail/preflight P2 convergence;
- discover/leaderboard/legal lower-priority cleanup;
- mass rewrite of `globals.css`.

`/account/security` remains a stub. The visual pass does not claim that password/session controls exist there.

Full candidate record: `VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`.

## Definition of Done for visual checkpoint

The visual checkpoint is complete only when:
- final PR #162 exact-head CI is fully green after candidate docs;
- clean merge gate passes with behind=0 and no unresolved review/thread issue;
- PR #162 exact head is merged;
- independent merged-`main` CI is fully green;
- exact Cloudflare release smoke succeeds on that merged SHA;
- final live-closure docs record **P0=0 / P1=0**;
- the live-closure docs themselves are merged and production-verified.

Only then may Pattern #38 move to a **fresh objective/evidence audit**. No gameplay family is pre-approved.

## Current execution order

1. Finish PR #162 candidate canonical docs.
2. Require fresh exact-head full PR CI.
3. Run clean merge gate; squash-merge exact head.
4. Require independent main CI + exact Cloudflare smoke.
5. Publish and verify final live-closure docs marking **P0=0 / P1=0**.
6. Run a fresh objective/evidence audit for Pattern #38.
7. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
8. Continue WS-02, WS-10, WS-11 and later WS-12 cleanup.
9. Final end-to-end production acceptance and canonical release closure.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.