# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged gameplay baseline:** `main` @ `5d6b429b64681bc6f2aa055a643a607cf54b1102` (PR #116)  
**Active gameplay PR:** none  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 20 merged; next Science exact-family audit |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **20**. Latest gameplay merge is Science Material Lab PR #116 `5d6b429b64681bc6f2aa055a643a607cf54b1102`.

```text
900 / 900 classified
0 unclassified
20 active patterns
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

## Compare Properties PR #114 — MERGED

Exactly three Science Wave C observation/measurement activities use `compare_properties`:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

`science-observe-record-same-time` remains default choice gameplay and `science-match-observation-tools-c` remains canonical matching. Runtime stays `tap_choice`; assessed fidelity is `choice_compare_properties_interaction`.

## Material Lab PR #116 — MERGED

Exact Science Wave D scope:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Explicit exclusion:

```text
science-match-material-purpose-d
```

Why this family is coherent:
- all four ask which material property makes a familiar object fit its purpose;
- the Wave D investigation/evidence choices were audited but intentionally not grouped because they mix experiment design, fair variables, prediction, and conclusion;
- material-purpose matching remains a different matching objective.

Interaction/evidence contract:
- child selects one canonical material-property sample, then explicitly tests it against the visible object purpose;
- selection alone cannot complete;
- wrong tested sample is retryable and cannot complete;
- correct tested sample completes through the canonical activity identity;
- runtime remains `tap_choice`;
- assessed fidelity `choice_material_lab_interaction`;
- assessment, stars, progression, skill IDs, activity IDs, choices and `correctChoice` remain canonical.

Accepted and merged evidence:
- initial CI #532 correctly blocked a package regression where `@phosphor-icons/react` was accidentally omitted while editing `package.json`;
- dependency was restored at the same existing version; no dependency migration was introduced;
- implementation head `09dd638748d62da1da264ce3b4f6f8f6880354b7` passed full CI #533;
- final docs head `974589a39617997093cde9e73241223a1c684935` passed full CI #535;
- static regression confirms exactly 4 `material_lab` activities;
- deterministic activity quality remains **900 KEEP / 0 flagged / structural 0**;
- browser QA passes 320x720, 390x844 and 768x1024 with legitimate Wave C progression, keyboard sample selection, explicit test action, false-completion guards, pointer completion, >=44px targets, no overflow, in-viewport CTA and assessed evidence persistence;
- manual review of idle/error/success screenshots at 320/390/768 accepted the visual state without further polish;
- final PR check found 0 issue comments, 0 review comments, 0 submitted reviews, and 0 review threads;
- exact-head squash merge produced `5d6b429b64681bc6f2aa055a643a607cf54b1102`, then `main` was verified at that SHA.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- update stale QA wording through a docs-only closure if necessary;
- never present unmerged work as shipped.

## Current execution order

1. Re-audit remaining Science exact families from the verified 20-pattern `main` baseline; do not force heterogeneous investigation/evidence objectives into one mechanic.
2. Promote pattern #21 only when objective/evidence fit is exact and reusable.
3. Audit Logic after the Science pass; Logic remains the largest subject hotspot at 77% `choice_grid`.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
