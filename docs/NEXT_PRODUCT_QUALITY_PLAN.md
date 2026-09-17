# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #41 — English `phrase_scene_match`  
**Pattern #41 audit:** PR #179 -> `917e933b2d69db3d014b98f3aa49bb6962aec992`  
**Pattern #41 audit CI:** **#860 / run `35223876877` — full success + exact Cloudflare production smoke**  
**Pattern #41 implementation:** PR #180 -> `f90a0d377fa7227b8857f6069a5e957c99eb0b11`  
**Pattern #41 implementation CI:** **#862 / run `35229750381` — full success + exact Cloudflare production smoke**  
**Pattern #41 closure:** PR #184 -> `552a3123b7352d6d5ab0eb2d9caecab50d60f09c`  
**Pattern #41 closure CI:** **#867 / run `35240186539` — full success + exact Cloudflare production smoke**  
**Next gameplay gate:** **FRESH PATTERN #42 OBJECTIVE/EVIDENCE AUDIT; NO MECHANIC PRE-APPROVED**  
**Merged-main P1:** **0**  
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
9. Pattern berikutnya wajib dimulai dari fresh objective/evidence audit. Tidak ada family mechanic yang otomatis pre-approved oleh pattern sebelumnya.
10. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
11. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
12. Green automated checks tidak menggantikan screenshot review.
13. P1=0 tidak menghapus P2 atau external-evidence backlog. Status harus tetap dipisahkan.
14. Parallel implementation PR untuk scope yang sama harus ditutup/ditolak setelah canonical candidate terbukti.
15. Scene-based answer presentation must not reveal the correct option through styling, semantics or answer-only affordances before selection.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **CURRENT** | Pattern #41 fully closed; Pattern #42 audit is next |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **41 FULLY CLOSED / PATTERN #42 AUDIT NEXT** | 9 patterns to minimum 50 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 21 routes / 63 captures live on main |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified merged gameplay baseline

```text
900 / 900 classified
0 unclassified
41 active merged patterns
choice_grid                     257 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Distance remaining: **9 patterns** to minimum 50 and **19** to working target 60.

## Pattern #41 — fully closed

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership remains English / `english-phrases-review` / `english-simple-phrases` / `english.pack.simple-phrases` / `english.phrase.literal` / assessed `tap_choice` / `choice_accuracy_v1`.

Verification chain:

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + Cloudflare smoke
Implementation PR:       #180
Verified implementation head: 03886f191d089a37bbaf7c9d429d6d9a8020ec6d
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + Cloudflare smoke
Closure PR:              #184
Closure main:            552a3123b7352d6d5ab0eb2d9caecab50d60f09c
Closure main CI:         #867 / run 35240186539 — full success + Cloudflare smoke
```

Verified behavior remains exact-scoped, deterministic, keyboard/touch/pointer accessible, retry-safe, evidence-safe, responsive and permanent-visual-QA clean. Canonical content/evidence/mastery/progression/schema/database boundaries remain unchanged.

## Permanent visual/product gate — LIVE

The blocking production gate remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

Open P2 remains:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 iconography mixes canonical symbols and raw emoji;
- VBASE-P2-03 inline visual styles increase drift risk.

## Pattern #42 entry gate

Pattern #42 starts from a fresh objective/evidence audit on the verified Pattern #41 closure baseline. The audit must:

1. examine remaining objectives/content where current interaction representation is weakest;
2. identify the evidence actually required by those objectives;
3. confirm whether a new gameplay family materially improves measurement or learning;
4. reject candidates that only increase pattern count;
5. reject candidates already adequately measured by an existing mechanic;
6. preserve mastery/progression boundaries unless an explicit tested migration is justified;
7. choose an exact small activity scope before implementation;
8. record why the selected mechanic is better than existing patterns;
9. preserve the valid outcome **“no justified Pattern #42 candidate yet.”**

No mechanic name, subject, or content family is pre-approved.

## Current execution order

1. Run the fresh Pattern #42 objective/evidence audit from final verified Pattern #41 closure main.
2. If justified, merge the docs-only audit before any Pattern #42 runtime work begins.
3. Implement only the exact audited scope with full interaction/evidence/progression/visual gates.
4. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
5. Continue WS-02 narration and WS-10 external physical-device/accessibility/Iqro evidence.
6. Continue WS-11 governance.
7. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
8. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
