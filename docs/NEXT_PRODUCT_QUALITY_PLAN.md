# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Latest verified gameplay baseline:** `main` @ `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1`  
**Latest merged gameplay change:** PR #123 — Logic `rule_pipeline`  
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
8. Work in PR tidak boleh disebut shipped sebelum exact-head merge dan live `main` diverifikasi.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88; terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 23 merged; next Logic `odd-one-out` exact-family audit |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged on verified gameplay `main`: **23 active patterns**.

```text
900 / 900 classified
0 unclassified
23 active patterns
choice_grid                 342 / 900 = 38.00%
rule_pipeline                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            72 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the permanent subject advisory threshold (`>60%`) and is the next audit focus.

## PR #123 Logic Rule Pipeline — MERGED

Exact Logic Wave D scope:

```text
logic-compose-red-circle-to-star
logic-compose-small-left-then-up
logic-compose-two-to-blue
logic-compose-triangle-turn-right
logic-compose-swap-then-grow
```

Pattern: `rule_pipeline`.

Why this family is coherent:
- all five are assessed `tap_choice` activities in stage `logic-mixed-reasoning-challenge`;
- all five belong to lesson `logic-composed-rules`;
- all five target canonical skill `logic.rule.composition.basic`;
- all five require applying two rules in sequence while retaining the intermediate state;
- nearby one-step conditional, set, transitive, spatial and odd-one-out families remain outside scope.

Interaction/evidence contract:
- visible start state + rule 1;
- accessible explicit execution of rule 1 reveals deterministic intermediate state;
- rule 2 then exposes exactly the canonical three final choices;
- final choices stay disabled before rule 1;
- wrong final choice increments assessed error/retry and cannot complete;
- correct final choice completes the canonical activity;
- runtime, activity IDs, choices, `correctChoice`, assessment, stars, progression and skill identity remain canonical;
- assessed fidelity: `choice_rule_pipeline_interaction`.

Accepted and merged evidence:
- implementation head `5def5791d3e3b09fbc680ba52e9e6605695e66c4` passed full implementation CI #557 / run `34936058944`;
- final canonical docs head `3bb4684ae69fcd76a354b6b319fbe9992e6a50d3` passed full CI #558 / run `34937511724`;
- Ubuntu quality gate, Windows compatibility, production build, dependency audit, secret-history scan and Mobile Chromium all passed;
- gameplay-presentation regression reports exactly `5 rule_pipeline` activities;
- dedicated Rule Pipeline regression passes for exactly the five reviewed Logic Wave D activities;
- deterministic activity-quality remains **900 KEEP / 0 flagged / structural findings 0**;
- gameplay-distribution audit verifies **900/900 classified, 23 active patterns, `choice_grid` 342/900 (38.00%), `rule_pipeline` 5/900, Logic `choice_grid` 72/100, Science 60/100**;
- all five simulations report `invariantErrors: 0`;
- Batch17 remains PASS with **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes legitimate Logic Wave C readiness, keyboard rule-1 execution, visible intermediate state, keyboard wrong-state, pointer correct completion, false-completion guards, assessed evidence persistence, >=44px controls, no horizontal overflow and in-viewport success CTA at 320x720, 390x844 and 768x1024;
- manual review of green #557 idle/intermediate/error/success screenshots at 320/390/768 accepted the visual state;
- final pre-merge review gate found **0 PR comments, 0 submitted reviews, 0 review threads**;
- exact-head squash merge of docs head `3bb4684ae69fcd76a354b6b319fbe9992e6a50d3` produced `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1`;
- live `main` was verified at that exact merge SHA.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from accepted screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- update stale QA wording through a docs-only closure when needed;
- never present unmerged work as shipped.

## Current execution order

1. Merge this docs-only post-merge closure for Rule Pipeline from verified gameplay `main` `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1`.
2. Start a fresh Logic Wave A `odd-one-out` exact-family audit from the verified 23-pattern baseline.
3. Promote the next mechanic only if objective/evidence fit is exact; do not lower hotspot counts cosmetically.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
