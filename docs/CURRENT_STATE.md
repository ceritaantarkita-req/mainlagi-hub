# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open closure work is called out explicitly.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #35 — Bahasa `picture_word_match`**
- Pattern #35 implementation PR: **#149**
- Pattern #35 closure PR: **#150**
- Pattern #35 final verified `main`: `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`
- Pattern #35 final CI: **#727 / run `35086954102`**, full success including exact Cloudflare production smoke
- latest merged gameplay implementation: **Pattern #36 — Bahasa `sentence_order_cards`**
- Pattern #36 implementation PR: **#151**
- Pattern #36 final implementation head: `1b7917046d6b3cbe365132a3610d2dddc74286c1`
- Pattern #36 final implementation-head CI: **#729 / run `35090113449`**, full PR success
- Pattern #36 implementation merge: `e27339c32edbad5e9587ebc0b87365318d5d9fad`
- Pattern #36 post-merge CI: **#730 / run `35092795526`**, full success including exact Cloudflare production smoke
- Pattern #36 status: **IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE IN PROGRESS**

## Engineering status

No known P0 engineering blocker is open on merged `main`. Pattern #36 is live on exact merge SHA `e27339c32edbad5e9587ebc0b87365318d5d9fad`. Post-merge CI #730 passed Ubuntu quality, Windows compatibility, production build/budgets, dependency audit, secret-history scan, Chromium mobile/accessibility QA, deterministic activity-quality and gameplay-distribution audits, simulations, Batch17, and **Production smoke (Cloudflare)** against the exact release.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged on `main`: 36 patterns

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    36
choice_grid               282 / 900 = 31.33%
sentence_order_cards        5 / 900 = 0.56%
picture_word_match          5 / 900 = 0.56%
initial_sound               3 / 900 = 0.33%
Bahasa choice_grid          34 / 100
```

No global gameplay hotspot exceeds the advisory 35% threshold. Remaining distance is **14** patterns to minimum 50 and **24** to working target 60.

## Pattern #36 `sentence_order_cards` — IMPLEMENTATION MERGED / LIVE VERIFIED

Exact scope:

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Canonical boundaries remain unchanged:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-kalimat-urutan`;
- pack `bahasa.pack.kalimat-urutan`;
- skill `bahasa.kalimat.order`;
- assessed runtime remains `tap_choice`;
- exactly three canonical sentence choices with unchanged `correctChoice`;
- content, IDs, stars, assessment, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- each unchanged sentence choice is rendered as its canonical words in left-to-right cards;
- the child still makes one direct canonical keyboard/touch/pointer choice;
- no drag-only requirement, invented token, changed answer payload, extra confirmation or intermediate assessment;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice records the canonical answer and completes the existing activity;
- assessed fidelity `choice_sentence_order_cards_interaction`;
- runtime metadata source `sentence-order-cards-runtime` with canonical `selectedChoice` and derived `selectedWords`.

Verified implementation chain:
- branch started exactly from fully closed Pattern #35 final `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`;
- accepted code head `595bc4e94065eb5250aef27797858641ca959c67` passed CI #728 / run `35089266590`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review;
- final implementation head `1b7917046d6b3cbe365132a3610d2dddc74286c1` passed full CI #729 / run `35090113449`;
- PR #151 passed exact-head clean scope/review/thread/mergeability gates with zero commits behind `main`;
- PR #151 squash merged as `e27339c32edbad5e9587ebc0b87365318d5d9fad`;
- independent post-merge CI #730 / run `35092795526` passed the complete matrix including exact **Production smoke (Cloudflare)**;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #36 is live but is **not yet FULLY CLOSED** until this separate docs-only closure passes fresh exact-head CI, clean merge gate, squash merge, and final independent `main` + Cloudflare verification.

## Pattern #35 `picture_word_match` — FULLY CLOSED

Implementation PR #149 and closure PR #150 are complete. Final verified `main` is `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727 / run `35086954102` passed the complete matrix including exact Cloudflare production smoke.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Finish the separate docs-only Pattern #36 closure through fresh exact-head CI, clean scope/review/thread/mergeability gate, exact-head merge, and final `main` + Cloudflare verification.
2. Only after Pattern #36 is **FULLY CLOSED**, run a fresh objective/evidence audit for Pattern #37; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns, plus Art Bible, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
