# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 final verified main:** `b1793adaabe19a9c73e021534899f8b50c4097f6`  
**Permanent visual QA foundation:** **FULLY CLOSED**, PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751  
**VUI-01 Parent Report:** **FULLY CLOSED**, PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758  
**VUI-02 Stage / Gallery:** **FULLY CLOSED**, PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764  
**VUI-03 Public/Auth/Account:** **FULLY CLOSED**, PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180`  
**VBASE-P1-01 residual token closure:** **FULLY CLOSED / LIVE VERIFIED**, PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI **#788 / run `35168877485` including exact Cloudflare release smoke**  
**Merged-main P1:** **0**  
**Pattern #38:** **UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT; NOT YET SELECTED OR IMPLEMENTED**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi mechanic baru hanya boleh dipilih karena learning objective dan evidence contract-nya membutuhkan interaction tersebut.

Garden activity direction tetap child-facing anchor. Permanent visual QA tetap blocking di setiap wave berikutnya.

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
11. Pattern #38 wajib dimulai dari fresh objective/evidence audit. Tidak ada family mechanic yang pre-approved oleh keberhasilan checkpoint visual.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup tidak boleh menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
19. Green automated checks tidak menggantikan screenshot review; #780 membuktikan manual review dapat menemukan defect yang structural gate tidak tandai.
20. P1=0 tidak menghapus P2 atau external-evidence backlog. Status harus tetap dipisahkan.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | live P1 closure being finalized after main #788 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **READY FOR FRESH #38 AUDIT AT 37** | no mechanic pre-approved |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 21 routes / 63 captures live on main |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

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

## Permanent visual/product gate — LIVE

The blocking production gate now runs **21 canonical routes × 3 viewports = 63 exact-path screenshots** at:

```text
390x844
768x1024
1280x800
```

The live route set covers public root, child selection/home/subject/stage/activity/rewards, Parent Report, account root, all six account subpages, login, signup, forgot-password, reset-password, deterministic auth error and canonical not-found.

Blocking checks include exact path/status, main/H1, route boundary where applicable, no Next overlay, no horizontal overflow, no page/console errors, child touch floor, Parent Report copy guard, Stage/Subject geometry guards, public/auth/account guards, account-section geometry, reset-password auth mode and canonical not-found markers.

Production proof:

```text
PR #162 merge: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
main CI:       #788 / run 35168877485 — full success
Cloudflare:    exact release/public smoke — success
artifact id:   10476008006
digest:        sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c
```

The accepted negative precedent remains #780: structural checks were green, but manual review found an empty-card defect on `/account/security`. The defect was fixed before acceptance; future visual changes must continue to use screenshots as evidence rather than treating structural green as sufficient.

## Visual checkpoint result

Merged-production state is now:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

All P1 findings are closed:

- **VBASE-P1-01 visual-token fragmentation — CLOSED / LIVE VERIFIED** by PR #162 / CI #788;
- **VBASE-P1-02 parent-report density/jargon — CLOSED** by PR #157;
- **VBASE-P1-03 stage/readiness hierarchy — CLOSED** by PR #158;
- **VBASE-P1-04 public/adult root IA — CLOSED** by PR #160;
- **VBASE-P1-05 permanent visual coverage gap — CLOSED** by PR #156, later strengthened by PR #162.

Open P2 remains:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 iconography mixes canonical symbols and raw emoji;
- VBASE-P2-03 inline visual styles increase drift risk.

These P2 items do not re-block the completed P1 checkpoint but must remain visible in the roadmap.

## Pattern #38 entry gate

Pattern #38 is now unblocked for **audit only**.

The next audit must:

1. examine remaining objectives/content where current interaction representation is weakest;
2. identify the evidence type required by those objectives;
3. confirm whether a new gameplay family actually improves measurement or learning;
4. reject candidates that only increase pattern count;
5. preserve mastery/progression boundaries unless an explicit tested migration is justified;
6. choose an exact small activity scope before implementation;
7. record why the selected mechanic is better than existing patterns;
8. allow the valid outcome **“no justified Pattern #38 candidate yet”**.

No mechanic name, subject or content set is pre-approved at this checkpoint.

## Definition of Done for the visual P1 checkpoint

Completed evidence:

- permanent VQA green on merged `main`;
- every baseline P1 closed with evidence;
- final changed surfaces manually reviewed at 390 / 768 / 1280;
- merged-main CI #788 green;
- exact Cloudflare release smoke green;
- canonical live-closure docs record P0=0 / P1=0.

The docs live-closure PR itself must still pass its own CI, merge cleanly and pass merged-main production verification before WS-01 is called synchronized to this checkpoint.

## Current execution order

1. Finish and production-verify the P1 live-closure documentation.
2. Run the fresh objective/evidence audit for Pattern #38.
3. If justified, implement Pattern #38 on a small deterministic scope with full interaction/evidence/progression/visual gates.
4. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
5. Continue WS-02 narration and WS-10 external physical-device/accessibility/Iqro evidence.
6. Continue WS-11 governance.
7. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
8. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.