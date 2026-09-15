# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae`  
**Active gameplay PR:** #112 — Science `cause_effect` water-change wave  
**Primary focus:** WS-05 gameplay/mechanic diversification.  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya static scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. **Code merged tanpa canonical docs yang current = pekerjaan belum selesai.**

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 17 merged + pattern #18 accepted QA in #112 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **17**. Latest merged gameplay implementation is Pattern Completion PR #110; canonical docs closure moved `main` to `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae` before PR #112 started.

Merged distribution before PR #112:

```text
900 / 900 classified
0 unclassified
17 active patterns
choice_grid          366 / 900 = 40.67%
pattern_completion     5 / 900 = 0.56%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

## Active PR #112 — Science `cause_effect`

Exactly four Science Wave B water-change choice activities are routed to `cause_effect`:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

`science-match-water-states-b` intentionally remains canonical matching / `visible_matching`.

Interaction contract:
- explicit per-activity config, no prompt parsing;
- child-facing **Awal -> Kondisi -> Hasil** flow;
- result slot stays unrevealed before selection;
- canonical three choices/correctChoice stay intact;
- wrong answer remains retryable and cannot complete;
- assessed fidelity `choice_cause_effect_interaction`;
- keyboard and touch/pointer share the same controls;
- exact four-ID allowlist prevents broader Science reclassification.

Preserved product contracts:
- runtime `tap_choice`;
- activity IDs;
- skill `science.water.state_changes.basic`;
- assessment and stars;
- stage/progression prerequisites;
- canonical completion identity.

Accepted implementation QA head: `ad5f427afc9cb0c755872ee88588534066942d47`.

CI #513 is full green across Ubuntu quality gate, Windows compatibility, production build, dependency audit, secret-history scan, and Mobile Chromium. CI #512 had correctly caught a 320x720 success-CTA clipping bug; the compact-phone layout was fixed without dropping controls below 44px, and #513 passed the same CTA assertion.

Manual screenshot review accepted idle/error/success at 320x720, 390x844, and 768x1024. Deterministic activity quality on the accepted head remains **900 KEEP / 0 flagged**, structural findings 0.

PR #112 QA distribution:

```text
900 / 900 classified
0 unclassified
18 active patterns
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

Science remains above the >60% subject hotspot threshold. This is a planning signal, not an instruction to force unsuitable mechanics.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge SHA in canonical docs/status closure if current docs still describe the PR as QA;
- never present unmerged work as shipped.

## Current execution order

1. Finish PR #112 docs on the accepted implementation QA evidence.
2. Run final CI on the docs head.
3. Check review threads/comments, exact-head squash merge #112, and verify `main`.
4. Close canonical status to the final merge SHA if needed.
5. Re-audit the remaining Science exact families because Science will still be concentrated at 75% `choice_grid` after #112.
6. Select the next Science mechanic only where objective/evidence fit is strong; keep prediction, materials, observation/measurement, environment reasoning, and related families separate unless the audit proves one coherent mechanic scope.
7. Audit Logic exact families after the Science pass.
8. Continue toward 50–60 meaningful patterns, then continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
