# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #40 — Logic `spatial_relation_board`  
**Pattern #41 audit:** PR #179 -> `917e933b2d69db3d014b98f3aa49bb6962aec992`  
**Pattern #41 implementation:** PR #180 -> `f90a0d377fa7227b8857f6069a5e957c99eb0b11`  
**Pattern #41 implementation merged-main CI:** **#862 / run `35229750381` — full success including exact Cloudflare production smoke**  
**Pattern #41 closure:** **IN PROGRESS on `agent/p41-closure-20260917`**  
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
| WS-01 Canonical docs | **CURRENT / CLOSURE GATE** | Pattern #41 implementation merged/live verified; closure docs being reconciled |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **41 MERGED / PATTERN #41 CLOSURE GATE** | 9 patterns to minimum 50 |
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

## Pattern #41 implementation — merged and independently verified

Exact scope remains:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership remains English / `english-phrases-review` / `english-simple-phrases` / `english.pack.simple-phrases` / `english.phrase.literal` / assessed `tap_choice` / `choice_accuracy_v1`.

Verified chain:

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + Cloudflare smoke
Implementation PR:       #180
Verified PR head:        03886f191d089a37bbaf7c9d429d6d9a8020ec6d
Implementation PR CI:    #861 / run 35228880841 — full success
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + Cloudflare smoke
```

Merged implementation preserves exact canonical prompt/choices/answer payload, deterministic twelve-scene config, measured retry/completion semantics, keyboard/touch/pointer controls, responsive QA and permanent visual P0=0/P1=0. No mastery/progression/schema/database rewrite was introduced.

## Pattern #41 closure gate

The current closure branch must:

1. reconcile `CURRENT_STATE`, gameplay catalog, execution plan and docs index to the verified merged-main implementation truth;
2. record exact implementation PR/head/main/CI chain and CI artifact evidence;
3. keep Pattern #41 status as **implementation merged + live verified / closure docs in progress** until the closure PR itself merges and passes merged-main verification;
4. preserve the verified 900/900 / 41-pattern distribution;
5. avoid rewriting historical audit/implementation records as if closure already existed;
6. pass exact-head full CI and clean review/thread/mergeability checks;
7. after closure merge, independently verify resulting `main` including exact Cloudflare smoke;
8. only then mark Pattern #41 **FULLY CLOSED** and move WS-05 to a fresh Pattern #42 objective/evidence audit.

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

## Current execution order

1. Open the Pattern #41 closure-docs PR from `agent/p41-closure-20260917`.
2. Run exact-head full CI; diagnose failures without weakening gates.
3. Merge only when exact-head green and review/thread/mergeability state is clean.
4. Independently verify resulting closure `main`, including exact Cloudflare production smoke.
5. Reconcile final closure identifiers if needed and only then declare Pattern #41 **FULLY CLOSED**.
6. Start a fresh Pattern #42 objective/evidence audit with no mechanic, subject or content family pre-approved.
7. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
8. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
