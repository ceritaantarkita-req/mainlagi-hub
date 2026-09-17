# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #40 — Logic `spatial_relation_board`  
**Pattern #40 implementation main:** `fd017b81137f03bb30eca19a2ceb71c734cb3ba9`  
**Pattern #40 implementation CI:** **#848 / run `35217949039` — full success**  
**Pattern #40 closure main:** `43d69c42ca456ab41011f1d198e021f2b0d53cae`  
**Pattern #40 closure CI:** **#850 / run `35219083042` — full success**  
**Pattern #40 truth reconciliation:** PR #177 -> `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`  
**Pattern #41 audit:** **OPEN PR #179 — `phrase_scene_match`, exact four-activity candidate; implementation not started**  
**Merged-main P1:** **0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi mechanic baru hanya boleh dipilih karena learning objective dan evidence contract-nya membutuhkan interaction tersebut.

Garden activity direction tetap child-facing anchor. Permanent visual QA tetap blocking di setiap wave berikutnya.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan demi mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact-scope regression, completion/evidence, keyboard, touch/pointer, responsive QA dan manual visual review.
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
| WS-01 Canonical docs | **CURRENT ON PR #179** | Pattern #40 fully closed; Pattern #41 audit candidate synchronized |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **40 FULLY CLOSED / PATTERN #41 AUDIT GATE** | candidate `phrase_scene_match`, implementation not started |
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

## Pattern #40 — fully closed

Canonical chain:

```text
Audit PR:                #173
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Closure main:            43d69c42ca456ab41011f1d198e021f2b0d53cae
Closure CI:              #850 / run 35219083042 — full success
Truth reconciliation:    #177 -> 7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f
```

Exact scope remains the six audited `logic-spatial-*` activities. Canonical prompts/choices/answers, assessed `tap_choice`, `choice_accuracy_v1`, mastery, progression, schema and database boundaries remain unchanged.

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

## Pattern #41 objective/evidence audit — current gate

PR #179 selects `phrase_scene_match` as an implementation candidate for exactly:

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

Audit decision:

- objective: literal understanding of very short English phrases;
- evidence combines color, quantity, size and noun features;
- generic choice presentation inconsistently mixes emoji and phrase-only answers;
- deterministic scene-per-choice presentation is semantically distinct from single-word `picture_word_match`;
- canonical prompt, choice labels/order, `correctChoice`, answer payload and evidence semantics can remain unchanged;
- listening simple phrase, sentence completion, generic vocabulary, opposites, Bahasa punctuation and heterogeneous Science lifecycle activities are excluded.

The audit does not authorize runtime work until its exact head passes CI and is merged.

## Pattern #41 implementation acceptance plan

If PR #179 is accepted, implementation must start from resulting latest `main` on a separate branch and prove all of the following before merge:

1. exact four-ID classifier with canonical stage/runtime/content snapshots and fail-closed negatives;
2. explicit deterministic semantic config for all twelve canonical choices; no heuristic phrase parser;
3. canonical prompt, visible choice labels/order and submitted answer strings remain unchanged;
4. scenes distinguish the task-relevant color, quantity, size and noun features without correctness styling leakage;
5. direct keyboard/touch/pointer controls remain primary; no drag-only requirement;
6. wrong attempts remain measured/retryable and cannot complete;
7. correct completion retains `choice_accuracy_v1` semantics and records `phrase-scene-match-runtime` / `choice_phrase_scene_interaction` metadata;
8. `english-listen-phrase-blue-book` and `english-complete-*` remain outside Pattern #41;
9. browser QA covers idle/wrong/success at 320x720, 390x844 and 768x1024, including touch targets, overflow, evidence and visible feedback/CTA;
10. gameplay distribution remains 900/900 classified and, after implementation, becomes exactly 41 active patterns with `choice_grid` 257/900 and `phrase_scene_match` 4/900;
11. deterministic activity-quality, Ubuntu, Windows, production build, dependency/security, simulations, permanent visual QA and full CI stay green;
12. only an exact verified head may merge; merged `main` must then be independently verified before implementation-complete status;
13. a separate closure-docs gate is still required before Pattern #41 is **FULLY CLOSED**.

## Current execution order

1. Finish PR #179 exact-head audit CI and clean review/thread/mergeability gate.
2. Squash-merge the audit only if exact-head green, then independently verify resulting `main`.
3. Create a separate Pattern #41 implementation branch from that latest `main`.
4. Implement deterministic config, canonical classifier registration, child scene presentation, regression/browser QA, distribution update and implementation docs for exactly four activities.
5. Run exact-head full CI; diagnose failures rather than weakening gates.
6. If implementation merges, independently verify merged-main production behavior and then run the separate closure-docs gate.
7. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
8. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
