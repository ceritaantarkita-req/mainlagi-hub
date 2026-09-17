# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #40 — Logic `spatial_relation_board`  
**Pattern #40 truth reconciliation:** PR #177 -> `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`  
**Pattern #41 audit:** PR #179 -> `917e933b2d69db3d014b98f3aa49bb6962aec992`  
**Pattern #41 audit merged-main CI:** **#860 / run `35223876877` — full success including exact Cloudflare production smoke**  
**Pattern #41 implementation:** **IN PROGRESS on `agent/p41-phrase-scene-match-20260917`**  
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
| WS-01 Canonical docs | **CURRENT** | Pattern #41 audit merged/verified; implementation state synchronized |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **40 FULLY CLOSED / PATTERN #41 IMPLEMENTATION IN PROGRESS** | exact four English phrase activities |
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
40 active merged patterns
choice_grid                     261 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Distance remaining on merged `main`: **10 patterns** to minimum 50 and **20** to working target 60.

## Pattern #41 audit — accepted and merged

Pattern #41 audit selected `phrase_scene_match` for exactly:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership:

```text
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Audit verification chain:

```text
Audit PR:             #179
Audit main:           917e933b2d69db3d014b98f3aa49bb6962aec992
Audit merged-main CI: #860 / run 35223876877 — full success + Cloudflare smoke
```

## Pattern #41 implementation acceptance plan

The active branch must prove all of the following before merge:

1. exact four-ID classifier with canonical stage/runtime/content snapshots and fail-closed negatives;
2. explicit deterministic semantic config for all twelve canonical choices; no heuristic phrase parser;
3. canonical prompt, visible choice labels/order and submitted answer strings remain unchanged;
4. scenes distinguish task-relevant color, quantity, size and noun features without correctness styling leakage;
5. direct keyboard/touch/pointer controls remain primary; no drag-only requirement;
6. wrong attempts remain measured/retryable and cannot complete;
7. correct completion retains `choice_accuracy_v1` semantics and records `phrase-scene-match-runtime` / `choice_phrase_scene_interaction` metadata;
8. `english-listen-phrase-blue-book` and `english-complete-*` remain outside Pattern #41;
9. browser QA covers idle/wrong/success at 320x720, 390x844 and 768x1024, including touch targets, overflow, evidence and visible feedback/CTA;
10. gameplay distribution remains 900/900 classified and becomes exactly 41 active patterns with `choice_grid` 257/900 and `phrase_scene_match` 4/900 on the implementation branch;
11. deterministic activity-quality, Ubuntu, Windows, production build, dependency/security, simulations, permanent visual QA and full CI stay green;
12. only an exact verified head may merge; merged `main` must then be independently verified before implementation-complete status;
13. a separate closure-docs gate remains required before Pattern #41 is **FULLY CLOSED**.

Current branch implementation already includes deterministic config, child runtime, classifier/route registration, exact-scope regression, aggregate test wiring, distribution assertions and dedicated responsive browser QA. Those are branch facts, not merged-main acceptance claims.

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

1. Finish Pattern #41 implementation evidence/docs on `agent/p41-phrase-scene-match-20260917`.
2. Open the implementation PR against `main`.
3. Run exact-head full CI and diagnose failures without weakening gates.
4. If exact-head green and review/thread/mergeability clean, squash-merge the implementation.
5. Independently verify resulting `main`, including exact Cloudflare production smoke and distribution.
6. Run a separate Pattern #41 closure-docs gate before declaring it **FULLY CLOSED**.
7. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
8. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
