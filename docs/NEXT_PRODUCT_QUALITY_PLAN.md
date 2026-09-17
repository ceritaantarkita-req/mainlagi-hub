# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #41 — English `phrase_scene_match`  
**Pattern #41 final truth:** PR #185 -> `e20b50431d907f9ca6f3ef254b7c69aa24a132a5`  
**Pattern #41 final truth CI:** **#869 / run `35241959755` — full success + exact Cloudflare production smoke**  
**Pattern #42 audit:** PR #186 -> `541c2348507e976fb723c9c6e5b8f1b242cff490`  
**Pattern #42 audit CI:** **#871 / run `35255083348` — full success + exact Cloudflare production smoke**  
**Pattern #42 implementation:** **PR #187 — code checkpoint verified / final docs-head gate pending / NOT MERGED**  
**Pattern #42 verified code checkpoint:** `0ded3a43e49654a34e5a35aaffb7edf8c9fa4469` / **CI #878 full success**  
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
15. A transition presentation must not reveal the target growth stage before the learner submits the canonical correct answer.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **CURRENT** | Pattern #42 code checkpoint #878 + manual visual evidence synchronized; final docs-head CI pending |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | merged baseline remains clean |
| WS-05 Gameplay diversification | **41 FULLY CLOSED / P42 CODE VERIFIED** | PR #187 not merged; branch evidence proves intended 42-pattern distribution |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | P42 permanent visual CI + manual nine-shot review clean |
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

Merged truth stays at 41 until PR #187 is merged and independently verified.

## Pattern #42 — `growth_stage_transition`

Verification chain:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare smoke
Implementation PR:        #187
Verified code checkpoint: 0ded3a43e49654a34e5a35aaffb7edf8c9fa4469
Code checkpoint CI:       #878 / run 35256885341 — full success
```

Exact scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical ownership remains Science / `science-life-material-motion` / `science-life-cycles` / `science.pack.life-cycles` / `science.life_cycles.basic` / assessed `tap_choice` / `choice_accuracy_v1`.

Verified implementation behavior:

- exact-ID fail-closed deterministic config;
- byte-preserved prompt, choice labels/order and `correctChoice`;
- known growth stage + hidden target stage board;
- target hidden on idle/wrong and revealed only after correct answer;
- explicit previous-stage / next-adult-stage / next-young-stage modes;
- deterministic visual scene for all nine canonical choices;
- wrong selection records incorrect/retry and cannot complete;
- correct completion preserves `choice_accuracy_v1` semantics;
- keyboard retry, pointer completion and actual touch `tap()` completion verified;
- >=44px targets, no horizontal overflow and zero browser console/page errors;
- no drag-only, prompt parser, extra assessed checkpoint, timing score or speech scoring;
- no mastery/progression/schema/database rewrite.

Explicit exclusions remain `science-cycle-butterfly`, `science-match-young-adult-b`, and all unrelated existing gameplay families.

Verified branch distribution from code checkpoint #878:

```text
900 / 900 classified
0 unclassified
42 active patterns
choice_grid                     254 / 900
growth_stage_transition           3 / 900
```

Manual visual review of all nine 320/390/768 idle/wrong/success screenshots is accepted with no P0/P1 Pattern #42 blocker. Artifact `10513557620`, digest `sha256:de116a80764e2b87716cc377e807aabbd4e3c9107961306039d6e480d1cbb5bd`.

Because this truth synchronization adds docs-only commits after checkpoint `0ded3a43...`, the final PR #187 head must still complete full CI before merge.

Full implementation evidence: `WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`.

## Permanent visual/product gate — LIVE

The blocking production gate remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

## Current execution order

1. Let the final docs-only PR #187 head pass full exact-head CI.
2. Re-check comments/reviews/unresolved threads and mergeability.
3. Merge only the exact verified final head.
4. Independently verify resulting `main`, including the intended 42-pattern distribution and exact Cloudflare production smoke.
5. Create/merge Pattern #42 closure docs and verify closure main before calling Pattern #42 fully closed.
6. Only then perform a fresh Pattern #43 objective/evidence audit; no candidate is pre-approved.
7. Continue WS-02 narration, WS-10 external acceptance, WS-11 governance and later P2/WS-12 cleanup when they do not destabilize accepted surfaces.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
