# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** PR #112 merge `768b7f53a003d7677a74ea54e9686418c900eab4`  
**Active gameplay PR:** none during this docs closure  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 18 merged; Science remains concentrated |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **18**. Latest gameplay merge is Science Cause/Effect PR #112 `768b7f53a003d7677a74ea54e9686418c900eab4`.

Merged distribution after #112:

```text
900 / 900 classified
0 unclassified
18 active patterns
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
pattern_completion     5 / 900 = 0.56%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

Science and Logic remain above the >60% subject hotspot advisory threshold. Each mechanic still requires exact-family objective fit.

## Cause/Effect PR #112 — DONE

Exactly four Science Wave B water-change choice activities use `cause_effect`; the related matching activity remains `visible_matching`.

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Preserved contracts:
- runtime `tap_choice`;
- activity IDs and canonical choices/correctChoice;
- skill `science.water.state_changes.basic`;
- assessment, stars, progression, and completion identity.

Interaction/evidence:
- explicit per-activity cause/effect config;
- **Awal -> Kondisi -> Hasil** flow;
- result unrevealed before selection;
- wrong answer cannot complete;
- assessed fidelity `choice_cause_effect_interaction`.

Accepted QA:
- CI #513 full green after compact-phone fix;
- CI #518 final docs-head full green;
- manual visual QA accepted 320/390/768 idle/error/success;
- deterministic quality 900 KEEP / 0 flagged / structural 0;
- review surface clean;
- exact-head squash merge `768b7f53a003d7677a74ea54e9686418c900eab4` verified on `main` immediately after merge.

## Next exact Science review — `compare_properties` candidate

Read-only audit after #112 identified the Wave C observation/measurement comparison trio as the strongest next candidate:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Why this family is coherent:
- one lesson/stage family and one assessed skill `science.observation.measurement.basic`;
- each activity compares one observable property directly: length, temperature, or quantity/volume;
- a comparative visual surface can represent the objective more directly than another generic answer grid;
- there are three reusable activities, enough to avoid a one-off engine;
- existing canonical choices/correctChoice can remain intact.

Explicitly keep outside the candidate scope unless fresh review proves otherwise:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

The first measures recording/observation habits rather than direct comparison; the second is canonical matching/tool association.

Proposed review questions before coding:
- can one reusable comparison-board interaction represent all three without misleading scale semantics?
- can left/right/equal evidence be explicit without inventing information not present in canonical prompts?
- should the visual use calibrated object bars, thermometers, and vessel fills while preserving the same `tap_choice` evidence identity?
- can keyboard/touch use the same candidate controls with >=44px targets and no result leakage?

Do not automatically convert material-property, prediction, environment, ecosystem, or force families in the same PR.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge status in canonical docs;
- never present unmerged work as shipped.

## Current execution order

1. Merge this docs-only closure for PR #112 status.
2. Start a fresh branch from latest `main` for the exact Science `compare_properties` candidate trio only after re-validating objective/evidence fit.
3. Run static allowlist regression + distribution delta before treating pattern #19 as accepted.
4. Add browser QA with legitimate stage readiness, keyboard wrong-state, pointer completion, evidence persistence, 320/390/768 screenshots, overflow and CTA checks.
5. Continue Science exact-family audit while Science remains above 60%, then audit Logic.
6. Continue toward 50–60 meaningful patterns using permanent audit evidence.
7. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
