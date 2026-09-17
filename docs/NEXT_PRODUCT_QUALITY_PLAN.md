# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay implementation:** Pattern #39 — Math `visual_word_problem`  
**Pattern #39 implementation main:** `bcb8479514f44d46ebc68917981699240aabc3b2`  
**Pattern #39 implementation main CI:** **#809 / run `35187506724` — full success including exact Cloudflare release smoke**  
**Pattern #39 closure:** **FULLY CLOSED**, PR #171 -> main `98725727c866d410b2d0caa206e86e70cd0e5741`, final CI **#811 / run `35190499794` — full success including exact Cloudflare release smoke**  
**Pattern #38:** **FULLY CLOSED**, closure PR #168 -> `86e6b69d576d72fec73158a7a1c6d8961de36887`, final CI #803  
**Merged-main P1:** **0**  
**Next gameplay gate:** **FRESH PATTERN #40 OBJECTIVE/EVIDENCE AUDIT; NO MECHANIC PRE-APPROVED**  
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
11. Pattern berikutnya wajib dimulai dari fresh objective/evidence audit. Tidak ada family mechanic yang otomatis pre-approved oleh pattern sebelumnya.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup tidak boleh menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
19. Green automated checks tidak menggantikan screenshot review.
20. P1=0 tidak menghapus P2 atau external-evidence backlog. Status harus tetap dipisahkan.
21. Parallel implementation PR untuk scope yang sama harus ditutup/ditolak setelah canonical candidate terbukti.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **CURRENT** | synchronized through Pattern #39 final live closure |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **39 PATTERNS / PATTERN #39 FULLY CLOSED** | Pattern #40 fresh objective/evidence audit is the active gate |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 21 routes / 63 captures live on main |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified gameplay baseline

Final Pattern #39 closure main CI #811 preserves the verified gameplay-distribution baseline:

```text
900 / 900 classified
0 unclassified
39 active merged patterns
choice_grid                     267 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Distance remaining: **11 patterns** to minimum 50 and **21** to working target 60.

No global pattern exceeds the existing >35% advisory hotspot threshold.

## Pattern #38 — fully closed

Canonical chain:

```text
Audit PR:        #165
Implementation:  #166
Implementation main: 76a2d87dca3689ed8206f5ce0556760dabe903b6
Implementation CI: #801 / run 35179596668 — full success
Closure PR:      #168
Closure main:    86e6b69d576d72fec73158a7a1c6d8961de36887
Final main CI:   #803 / run 35180530822 — full success
Cloudflare:      exact release/public smoke — success
```

## Pattern #39 — fully closed

Audit PR #169 justified a dedicated visual word-problem presentation for exactly five Math story-problem activities. Implementation PR #170 preserves canonical content, `tap_choice`, `choice_accuracy_v1`, `math.problem.visual`, mastery/progression and schema boundaries.

Interaction contract:

- canonical everyday story remains primary prompt;
- deterministic quantity board represents start -> add/remove -> unknown result;
- result remains hidden until correct completion;
- wrong answer remains retryable/measured and cannot complete;
- keyboard/touch/pointer remain direct primary controls;
- no drag-only dependency.

Canonical verification chain:

```text
Audit PR:                #169
Implementation PR:       #170
Implementation head:     df503b95abf86e2b530dd9ff18bd5d8b9707e2db
Implementation main:     bcb8479514f44d46ebc68917981699240aabc3b2
Implementation main CI:  #809 / run 35187506724 — full success
Closure PR:              #171
Closure main:            98725727c866d410b2d0caa206e86e70cd0e5741
Final main CI:           #811 / run 35190499794 — full success
Cloudflare exact smoke:  success
```

Responsive QA covers 320x720, 390x844 and 768x1024 idle/wrong/success states. Merged-main distribution artifact from implementation verification is `10482459288`, digest `sha256:4bacc984852eb4befd352a727935daf8e75cb0b30ec1a58af8451895649ae967`.

## Permanent visual/product gate — LIVE

The blocking production gate remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

Merged-production state remains:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

Open P2 remains:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 iconography mixes canonical symbols and raw emoji;
- VBASE-P2-03 inline visual styles increase drift risk.

## Pattern #40 entry gate — ACTIVE

Pattern #40 starts from a fresh objective/evidence audit. The audit must:

1. examine remaining objectives/content where current interaction representation is weakest;
2. identify the evidence type required by those objectives;
3. confirm whether a new gameplay family actually improves measurement or learning;
4. reject candidates that only increase pattern count;
5. preserve mastery/progression boundaries unless an explicit tested migration is justified;
6. choose an exact small activity scope before implementation;
7. record why the selected mechanic is better than existing patterns;
8. allow the valid outcome **“no justified Pattern #40 candidate yet”**.

No mechanic name, subject or content set is pre-approved.

## Current execution order

1. Run a fresh objective/evidence audit for Pattern #40.
2. If justified, implement Pattern #40 on a small deterministic scope with full interaction/evidence/progression/visual gates.
3. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
4. Continue WS-02 narration and WS-10 external physical-device/accessibility/Iqro evidence.
5. Continue WS-11 governance.
6. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
7. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
