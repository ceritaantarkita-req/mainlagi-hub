# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; accepted unmerged work is called out explicitly.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #35 — Bahasa `picture_word_match`**
- Pattern #35 implementation PR: **#149**
- Pattern #35 closure PR: **#150**
- Pattern #35 implementation merge: `47e3373ed9ba4a96331a8e61286dc80d37b6b518`
- Pattern #35 implementation post-merge CI: **#724 / run `35085618422`**, full success including Cloudflare production smoke
- Pattern #35 closure head: `6c89827aeb19a3a73838415db1d825469c2c33bc`
- Pattern #35 closure CI: **#726 / run `35086437453`**, full success
- Pattern #35 final verified `main`: `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`
- Pattern #35 final CI: **#727 / run `35086954102`**, full success including exact Cloudflare production smoke
- active implementation PR: **#151 — Pattern #36 Bahasa `sentence_order_cards`**
- Pattern #36 accepted code head: `595bc4e94065eb5250aef27797858641ca959c67`
- Pattern #36 accepted code CI: **#728 / run `35089266590`**, full success; Cloudflare production smoke correctly skipped on PR
- Pattern #36 status: **QA ACCEPTED / UNMERGED; CANONICAL DOCS UPDATE IN PROGRESS**

## Engineering status

No known P0 engineering blocker is open on merged `main`. Pattern #35 is fully closed and independently verified live. Pattern #36 code head passed Ubuntu quality, Windows compatibility, production build/budgets, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic activity-quality and gameplay-distribution audits, simulations and Batch17.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged on `main`: 35 patterns

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    35
choice_grid               287 / 900 = 31.89%
picture_word_match          5 / 900 = 0.56%
initial_sound               3 / 900 = 0.33%
Bahasa choice_grid          39 / 100
```

### PR #151 accepted candidate: 36 patterns

Exact CI #728 artifact evidence:

```text
classified:               900 / 900
unclassified:               0
active candidate patterns: 36
choice_grid               282 / 900 = 31.33%
sentence_order_cards        5 / 900 = 0.56%
picture_word_match          5 / 900 = 0.56%
initial_sound               3 / 900 = 0.33%
Bahasa choice_grid          34 / 100
```

No global gameplay hotspot exceeds the advisory 35% threshold. Candidate remaining distance is **14** patterns to minimum 50 and **24** to working target 60.

## Pattern #36 `sentence_order_cards` — QA ACCEPTED / UNMERGED

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
- content seeds, IDs, stars, assessment, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- each canonical sentence choice is visualized as its existing words in left-to-right cards;
- the child still makes one direct canonical choice by keyboard/touch/pointer;
- no drag-only requirement, invented word, reordered canonical payload, extra confirmation or intermediate assessment is introduced;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice emits measured evidence and completes the canonical activity;
- assessed fidelity `choice_sentence_order_cards_interaction`;
- runtime metadata source `sentence-order-cards-runtime` with canonical `selectedChoice` and `selectedWords` derived only from that choice.

QA evidence:
- implementation branch started exactly from fully closed Pattern #35 final `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`;
- accepted code head `595bc4e94065eb5250aef27797858641ca959c67` passed full CI #728 / run `35089266590`;
- exact family regression locks only the five reviewed Bahasa activities and explicit nearby exclusions;
- representative browser QA uses `bahasa-urut-ibu-memasak` with legitimate immediate-prior Bahasa Wave B readiness;
- browser QA covers 320x720, 390x844 and 768x1024, keyboard wrong-state, pointer success, false-completion guard, evidence metadata, touch targets, horizontal overflow, feedback and CTA visibility;
- all nine idle/wrong/success screenshots passed manual visual review;
- CI #728 distribution artifact confirms 900/900 classified, 36 active candidate patterns, `choice_grid` 282 and `sentence_order_cards` 5;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #36 remains **UNMERGED** until this canonical docs head passes fresh full CI and PR #151 passes the clean exact-head merge gate. It is not fully closed until implementation merge/live verification plus a separate docs-only closure are complete.

## Pattern #35 `picture_word_match` — FULLY CLOSED

Implementation PR #149 and closure PR #150 are complete. Final verified `main` is `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727 / run `35086954102` passed the complete matrix including exact **Cloudflare production smoke**.

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

1. Finish Pattern #36 implementation PR #151: fresh exact docs-head CI -> clean scope/review/thread/mergeability gate -> exact-head squash merge -> independent `main` + Cloudflare verification.
2. Complete the separate docs-only Pattern #36 closure and final live verification.
3. Only then run a fresh objective/evidence audit for Pattern #37; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns, plus Art Bible, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
