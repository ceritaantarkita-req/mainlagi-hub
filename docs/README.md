# Mainlagi Hub Documentation Index

Last reviewed: **18 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction.
5. [`MOBILE_ROUTE_QA.md`](MOBILE_ROUTE_QA.md) — blocking browser route and permanent visual QA contract.
6. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
7. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — child/product/UX/activity rules.
8. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — evidence/mastery/progression contract.
9. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
10. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
11. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #44 `subitizing_glance` is now the latest **FULLY CLOSED / LIVE VERIFIED** gameplay pattern.

Pattern #45 audit candidate is Logic `elimination_board` for exactly five `logic-elimination-inference` activities. This audit is branch-only and implementation code has not started.

Pattern #42 `growth_stage_transition` implementation is now merged and live verified:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare production smoke
Implementation PR:        #187
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Verified merged gameplay distribution is now **900/900 classified, 44 active patterns, 0 unclassified**, with `choice_grid` 246/900 and `subitizing_glance` 3/900.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = FULLY CLOSED / LIVE VERIFIED
Pattern #42 = FULLY CLOSED / LIVE VERIFIED
Pattern #43 = FULLY CLOSED / LIVE VERIFIED
Pattern #44 = FULLY CLOSED / LIVE VERIFIED
```

## Pattern #43 live checkpoint

```text
Audit PR:                #190
Audit main:              39830a5dfd91734e4cc88b7d79eafaa2f722615f
Audit main CI:           #890 / run 35295503508 — full success + exact Cloudflare production smoke
Implementation PR:       #191
Implementation head:     c893ba0ee63b256bbeb0da61e2bd90355c483a09
Implementation PR CI:    #899 / run 35296994744 — full success
Implementation main:     44f9dee07506a785f184d965b5bbc0a2aab66a8f
Implementation main CI:  #900 / run 35297572709 — full success + exact Cloudflare production smoke
```

Exact five-ID Logic scope is live verified. Browser keyboard/pointer/actual-touch QA, manual nine-shot review and permanent visual QA passed. No mastery/progression/schema/database change was introduced.

## Pattern #44 live checkpoint

Pattern #44 `subitizing_glance` is **FULLY CLOSED / LIVE VERIFIED**.

```text
Audit PR:                 #193
Audit main:               8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Audit merged-main CI:     #904 / run 35299949341 — full success + exact Cloudflare production smoke
Implementation PR:        #194
Verified code checkpoint: 3a4385790a793ed5297db4f6d33fa8e1d084ccf1
Code checkpoint CI:       #906 / run 35301923329 — full success
Final PR head:            0835d2b93c0ae3d579518dcfa5964266bcbb1f2c
Final PR CI:              #911 / run 35302598975 — full success
Implementation main:      8406c89777a68da4bd6e89f01a561e5aa1e90c01
Implementation main CI:   #912 / run 35303076429 — full success + exact Cloudflare production smoke
Closure docs PR:          #195
Closure docs main:        d1d16d1acf5dd8baa2445c2c2901459a1d0e64cc
Closure docs main CI:     #914 / run 35306629423 — full success + exact Cloudflare production smoke
Manual visual review:     ACCEPTED / nine dedicated screenshots / no P0-P1 Pattern #44 blocker
```

Exact scope remains `math-subitize-2`, `math-subitize-4`, and `math-subitize-5`. Merged production truth is **44 active / `choice_grid` 246 / `subitizing_glance` 3**.

The implementation preserves assessed `tap_choice` / `choice_accuracy_v1`, exact canonical prompts/choice order/answers, and existing mastery/progression/schema/database boundaries. It deliberately does not reuse `count_and_select` because that interaction teaches one-by-one enumeration, while the audited subitizing objective is visual quantity recognition from a spatial pattern.

Merged-main CI #912 artifacts:

```text
mobile-route screenshots: 10531026015
sha256:8898d82a8e1f000bd9924b7f3b9e04baeea137f139dfdb21fe83e274397a6021

gameplay distribution:    10531025693
sha256:05fcac2bfac4fa07b9667c27d4b5ed17d3436911c27918b93b73201f4cb43fec

activity quality:          10530404555
sha256:2ef4d746d92545e49fd2e6e9519db5f67ee0d26e18d28ccfb3d50c4331122400
```

## Pattern #42 closure checkpoint

Exact Pattern #42 scope remains:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical Science ownership, assessed `tap_choice`, `choice_accuracy_v1`, prompt/choice/answer payloads, mastery and progression are preserved. Butterfly full-sequence evidence and lifecycle matching remain explicitly outside scope.

Merged-main CI #884 reverified the exact 42-pattern distribution, Ubuntu/Windows engine suites, activity quality, simulations/final acceptance, production build, dependency/security gates, mobile route QA, permanent visual QA and exact Cloudflare production smoke.

Merged-main artifacts:

```text
mobile-route screenshots: 10514976832
sha256:ce7f6fc566952f8d20261eda8eb6c86c7fe6a2f0464f4c4fe72658d128451f4d

gameplay distribution:    10514382620
sha256:12212009d77256bb32b08a32de3a8e1dc4067c3899d7d410c8651f5bc2687b4f

activity quality:          10513967944
sha256:aa38d751cfdb5f24268c818dcf79a84d6d2fc30a2117bf8900df3f52ea3a6cc6
```

Pattern #42 closure gates are complete. Closure PR #188 merged and closure main `ad7deb67...` passed CI #886 including exact Cloudflare production smoke.

## Current evidence records

- [`PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`](PATTERN45_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md) — branch-only Pattern #45 Logic `elimination_board` audit candidate; implementation not started.
- [`PATTERN44_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md`](PATTERN44_IMPLEMENTATION_ACCEPTANCE_2026-09-18.md) — accepted Pattern #44 code checkpoint, automated gates, artifacts and manual nine-shot review.
- [`WS05_SUBITIZING_GLANCE_WAVE_2026-09-18.md`](WS05_SUBITIZING_GLANCE_WAVE_2026-09-18.md) — Pattern #44 implementation/QA wave and remaining merge gates.
- [`PATTERN44_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md`](PATTERN44_OBJECTIVE_EVIDENCE_AUDIT_2026-09-18.md) — merged/live-verified Pattern #44 objective/evidence audit.
- [`PATTERN42_FINAL_CLOSURE_VERIFICATION_2026-09-18.md`](PATTERN42_FINAL_CLOSURE_VERIFICATION_2026-09-18.md) — final Pattern #42 merged-main closure truth.
- [`PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`](PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md) — Pattern #42 closure record.
- [`WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`](WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md) — Pattern #42 implementation/QA wave.
- [`PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged/live-verified Pattern #42 objective/evidence audit.
- [`PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md`](PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md) — final Pattern #41 merged-main truth.
- [`PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md`](PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md) — Pattern #41 closure record.
- [`WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`](WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md) — Pattern #41 implementation/QA wave.
- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #41 objective/evidence audit.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 gate is the docs-only Pattern #45 audit PR for Logic `elimination_board` over exactly five `logic-elimination-inference` activities. The audit must merge and pass merged-main Cloudflare verification before runtime implementation begins. Six patterns remain to the finish target of 50.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression to the current finish target of 50.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
