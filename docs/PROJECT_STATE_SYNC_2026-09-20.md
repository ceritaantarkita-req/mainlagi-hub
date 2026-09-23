
### 23 September semantic P0 human-review gate

The exact-file semantic P0 human-review evidence gate is merged through PR #304 -> main `f0b48cbdbe162fd19e0665f4b29945f6aaa16a5f`. PR CI #1552 / run `35816166334` passed the full matrix; merged-main CI #1553 / run `35824198610` passed the full matrix and exact Cloudflare smoke.

Current truth remains:

- semantic registry: 17 review-required / 0 approved;
- exact P0 candidate set: 9;
- human-reviewed exact P0 binaries: 0;
- human-accepted exact P0 binaries: 0;
- production semantic binaries: 0;
- runtime semantic activation: 0.

The next step is actual human viewing and per-file accept/reject of the exact nine generated binaries. Human acceptance remains separate from later legal provenance/production approval, and runtime mapping remains a later wave.

Canonical closure: `LEARNING_SEMANTIC_P0_HUMAN_REVIEW_GATE_CLOSURE_2026-09-23.md`.

# Mainlagi Hub — Project State Sync — 20 September 2026

Status: **CURRENT HANDOFF SNAPSHOT — SYNCHRONIZED 23 SEPTEMBER 2026**  
Repository: `ceritaantarkita-req/mainlagi-hub`  
Canonical branch: `main`

This document summarizes the current repository/product state through the 23 September learning-semantic illustration registry/provenance closure, while preserving the earlier containment, English narration and WS-05 closures. It does not replace historical audit/closure records; it links the current truth that active work must preserve.

## 1. Source of truth and production verification

Latest production main:

```text
9f6270c79bb92f7cb6ce1d29a2165df54801debf
```

This is PR #301, the review-only P0 semantic candidate source refinement. Merged-main CI **#1548 / run `35807137419`** passed the full matrix and exact Cloudflare smoke confirmed production serves `9f6270c79bb92f7cb6ce1d29a2165df54801debf` on branch `main` with 9 modules and the canonical Supabase backend.

Current learning-illustration chain:

- containment/readability: closed/live verified through PR #294;
- semantic illustration registry/provenance gate: closed/live verified through PR #297 at **17 review-required / 0 approved / 0 production binary / 0 runtime activation**;
- existing-art creation-basis trace: PR #299;
- deterministic exact nine-item P0 generator: PR #300;
- AI small-scale prereview source refinement for `action.jump` and `feature.cactus-thick-stem`: PR #301;
- active next gate: exact human child-readability review bound to candidate manifest/file SHA values.

The human-review gate branch is `agent/semantic-p0-human-review-gate-20260923`. Until it is merged/live verified, production truth remains PR #301 main. The gate itself cannot approve production, copy assets into `public/`, mutate registry lifecycle, or activate runtime semantic mapping.

Safe checkpoint: `LEARNING_SEMANTIC_SAFE_CHECKPOINT_2026-09-23.md`.

Latest English-narration tooling implementation baseline:

```text
4b975130bf6e5fc28cecbf6aea5373b7a1430c65
```

This is the provider-pilot harness main from PR #283. Exact-head PR CI #1395 / run `35719163695` passed the full matrix and merged-main CI #1396 / run `35719862989` passed including exact Cloudflare production smoke. The smoke served exact SHA `4b975130bf6e5fc28cecbf6aea5373b7a1430c65` with the canonical Supabase target. Runtime narration behavior remains the browser-fallback behavior from the PR #280 asset-gate baseline `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`; PR #283 adds offline/server-side pilot tooling and gates, not static-audio runtime playback. The earlier WS-05 Logic `pattern_completion` reuse remains closed/live verified at PR #273 / main `709e2b7d...` and its 900/900 / 47-pattern gameplay truth is unchanged. Required secret-scan enforcement from PR #269 and cloud learning analytics integrity from PR #267 remain closed/live verified. The previous character asset pipeline docs closure remains PR #264 at `bb0645d298a645483fb10e12bc0550a8eccf0870`. The fail-closed human character asset pipeline implementation itself remains PR #263 at `e4d7b4285db17a2010c22cdd1bc29451208f6a1b`. The activity character-presentation foundation remains PR #259 and the runtime asset lifecycle registry remains PR #262. The subject-background runtime implementation remains the earlier PR #256 baseline:

```text
Background implementation main:       7502c708c998c87bb273639025fcb10ba6c81e12
Implementation merged-main CI:         #1183 / run 35565937149
Implementation exact production smoke: PASS

Background docs closure main:           41df41c9dc0edc449af8260bbfe3887e0175bfb0
Background docs closure CI:             #1186 / run 35567718494
Background docs closure smoke:          PASS

Character foundation main:              b5acbfcde66ea1451f3e55a8d469d33ba4845af1
Character foundation merged-main CI:    #1190 / run 35589937017
Character foundation exact smoke:       PASS

Character registry main:                ceb2546b6c626810901c5542e7f718acfad55341
Character registry merged-main CI:      #1196 / run 35594336327
Character registry exact smoke:         PASS

Character asset pipeline main:          e4d7b4285db17a2010c22cdd1bc29451208f6a1b
Character asset pipeline merged-main CI:#1198 / run 35599025558
Character asset pipeline exact smoke:   PASS
```

Canonical production path remains:

```text
GitHub main -> Cloudflare Git integration -> OpenNext Worker -> https://mainlagihub.my.id/
```

No VPS/SSH path is canonical production.

The project owner subsequently supplied one production screenshot for each of the nine subjects. Review record: `SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md`.

## 1A. English narration safe checkpoint

English narration now has the following closed/live-verified engineering checkpoints:

```text
Wave 1 quality PR:             #278
Wave 1 main:                   8d60a69a076cc6e5253650112f2ffe79add345ea
Wave 1 merged-main CI:         #1367 / run 35697909785 — exact smoke
Wave 1 docs closure PR:        #279
Wave 2 asset-gate PR:          #280
runtime behavior baseline:     2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48
runtime baseline main CI:      #1372 / run 35701448136 — exact smoke
provider-pilot harness PR:     #283
provider-pilot PR head:        ed1a0d08107fb35b5030fe296268eeb90b759170
provider-pilot tooling base:   4b975130bf6e5fc28cecbf6aea5373b7a1430c65
provider-pilot main CI:        #1396 / run 35719862989 — full success + exact smoke
human-review gate PR:           #285
human-review gate main:         dd84579624212b387a4e54dc93a5892c04de83d6
human-review gate PR CI:        #1412 / run 35724918622 — full success
human-review gate main CI:      #1415 / run 35725713601 — full success + exact smoke
```

Current narration truth: 27 reviewed activities = 22 target-first + 5 comprehension; 27 synchronized registry slots remain `review-required`; 0 approved audio; 0 production binaries; 0 generated pilot candidates in PR #283; no static-audio runtime activation; browser fallback preserved.

The fail-closed human-review evidence gate is now **MERGED / LIVE VERIFIED** through PR #285 -> `dd845796...`. It binds review to the exact generation-manifest SHA-256 and exact candidate SHA-256 values, requires explicit human listening/reviewer evidence, and treats human acceptance as non-production state. It has no code path to mutate the production registry, public narration directory, or runtime resolver.

OpenAI `gpt-4o-mini-tts-2025-12-15` with `marin`/`cedar` is a pilot candidate only, not final production-provider selection. The next safe step is actual local/server-side candidate generation + human listening/provenance review for the exact four items through the verified gate. Do not bulk-generate all 27 assets, auto-approve registry entries, copy candidates into `public/`, or activate static playback before later production approval.

Canonical handoff: `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`, `ENGLISH_NARRATION_PROVIDER_PILOT_HARNESS_CLOSURE_2026-09-22.md`, and `ENGLISH_NARRATION_HUMAN_REVIEW_GATE_CLOSURE_2026-09-22.md`.

## 1B. Cloud analytics integrity now

The previously reproduced long-history reporting defect is closed on production main:

- attempts/evidence are read page-by-page instead of stopping at fixed 500/2000 caps;
- all pages are scoped to authenticated account + child and frozen to one snapshot timestamp;
- a later-page failure produces unavailable state rather than partial analytics;
- authenticated cloud failure does not silently fall back to local browser analytics;
- parent report surfaces expose explicit loading/unavailable/retry behavior;
- stale async reads are invalidated across refresh/auth transitions;
- regression coverage proves 1,201 attempts + 3,603 evidence rows and is part of `npm run test:learning`.

Canonical record: `CLOUD_ANALYTICS_PAGINATION_CLOSURE_2026-09-21.md`.

## 1C. Required secret-scan enforcement now

The previous governance gap is closed:

- the standalone `Secret history scan` remains visible;
- the ruleset-required `Production dependency audit` now checks out full history and runs the same pinned/redacted Gitleaks scan first;
- PR #269 CI #1208 and merged-main CI #1209 both show `Required full-history secret gate` succeeding inside that required context;
- failure of the embedded scan therefore fails a required check and blocks merge;
- no separate GitHub account/UI action remains necessary for secret-scan enforcement.

Canonical record: `SECRET_SCAN_REQUIRED_GATE_CLOSURE_2026-09-22.md`.

## 1D. World evidence database live / application integration pending

The World evidence workstream has progressed beyond the earlier isolated-pilot state.

Verified database state:

```text
Supabase project: estvtgflwkebomsqlolv / mainlagi-hub / ap-southeast-1
0047 world progress persistence:          LIVE
0048 supplemental evidence foundation:    LIVE
0049 source-aware mastery isolation:      LIVE
0050 Stage 8 evidence activation registry:LIVE
0051 advisor hardening:                   LIVE
supplemental evidence rows:               0
```

Safe source checkpoints:

```text
activation closure:
checkpoint/world-evidence-stage8-activation-final-closure-green-20260923
@ 3e30cae5f8f8ebb888e4d58c229bd953e576f615

live DB closure:
checkpoint/world-evidence-live-db-final-closure-green-20260923
@ 94062af9944943e5f82011087bff9e4dfd12e2b7
```

The application side remains release-controlled: the Stage 8 runtime must first be integrated with current `main`, pass full CI on the combined state, and then go through exact-SHA Cloudflare smoke before a controlled real/QA-child evidence write is used for end-to-end verification.

Do not interpret the live DB registry as permission to activate any second World evidence mapping or age-8 canonical evidence.

Canonical detailed record: `WORLD_EVIDENCE_LIVE_DB_DEPLOYMENT_2026-09-23.md`.

## 1E. World evidence integrated with current main — release candidate green

The application integration prerequisite described in 1D is now complete on a dedicated release branch.

```text
release branch:
release/world-evidence-integration-20260923

current-main parent:
17b9ca79749e171f62d3adb86df494badef11732

World/live-DB parent:
94062af9944943e5f82011087bff9e4dfd12e2b7

integration merge:
e4999265033b0263e906c2fe287fc08d09bde0bc

Draft release PR:
#312 -> main

safe checkpoint:
checkpoint/world-evidence-main-integration-green-20260923

CI:
#1584 / run 35892514511 — full success
```

The combined state preserves semantic P0, narration, learning-illustration and visual-containment work from current main while adding the full Petualangan Uang + World evidence stack.

Production application deployment is still pending. No real/QA-child evidence write should be fabricated before the reviewed runtime is merged/deployed.

## 2. Learning/product baseline

Current learning baseline remains:

- 9 subjects;
- 900 activities;
- 900/900 gameplay-classified;
- 47 active gameplay patterns;
- no approved Pattern #48;
- 683 assessed / 217 practice;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 200 active skills.

Quantity expansion is not the active goal. Quality, representation, usability, visual coherence and evidence integrity remain higher priority.

## 3. Product UX work completed on 20 September

The current WS-13 sequence has completed the following product work:

- canonical child/parent component ownership and browser-warning audit;
- child home/header/navigation update and responsive 3-column subject directory;
- activity gallery redesign with isolated QA unlock behavior;
- shared completion experience;
- visible matching randomization/retry behavior;
- first-instruction narration latency/preload improvement;
- parent/profile/settings responsive redesign;
- parent mobile/desktop navigation convergence;
- family profile vs demo-profile separation;
- child profile identity separated from guide-character identity on parent surfaces.

The parent wave is **MERGED / LIVE VERIFIED** through PR #251, main `77bee682...`, exact-head CI #1159 and merged-main CI #1160.

## 4. Parent architecture now

Canonical parent route ownership:

- `/parent/*` enters through `LearningPlatform`;
- canonical root overview is `CloudParentOverviewScreen`;
- shared parent shell/settings live in `ParentLearningPlatform.tsx`.

Responsive contract:

- below 760px: sticky parent header + fixed five-destination bottom navigation;
- at/above 760px: desktop parent sidebar;
- the old MobileFoundation rule that forced the parent sidebar visible on mobile is retired;
- parent content reserves bottom-nav/safe-area space;
- `Mode anak` remains directly reachable but visually separated from parent destinations.

The 768px parent dashboard uses the stacked hero; the two-column hero starts only when enough usable width exists.

## 5. Character system and current asset truth

Canonical character identities:

- **Naya** — older sister figure, approximately 8, wears hijab; warm/encouraging.
- **Gian** — boy, approximately 5; active, curious, playful.
- **Zia** — girl, approximately 3; expressive and beginner-friendly.
- **Paca** — friendly male-coded robot; hints/system/discovery.
- **Gavi** — orange cat; humor/rewards/reactions.

Do not add unsupported biography, clothing, hobby, hair or personality details outside these documented traits unless separately approved.

Current asset state:

- `public/artwork/garden-paca.webp` exists and is used in production;
- `public/artwork/garden-gavi.webp` exists and is used in production;
- Paca/Gavi coloring-preview assets also exist;
- Naya/Gian/Zia do **not** yet have production image files under `public/artwork`;
- `CharacterAvatar` currently falls back to inline SVG representations for Naya/Gian/Zia;
- child profile identity and guide-character identity remain separate concepts;
- coloring-character support remains intentionally limited to Paca/Gavi until a separate content decision changes it.

The activity character-presentation architecture is merged/live verified through PR #259, the runtime asset lifecycle registry through PR #262, and the fail-closed human character asset pipeline through PR #263. Naya/Gian/Zia remain reference-only with no production path and no committed human production binary. **Character production/development is now PAUSED by the project owner**; current Drive character material is reference-only until an explicit resume instruction.

## 6. Subject background production system

Canonical execution detail: `SUBJECT_BACKGROUND_SYSTEM.md`.

The pilot is complete and superseded by the production all-subject system:

- **9 subjects / 900 activities** are covered;
- **54 scene families** are active, six per subject;
- **108 optimized WebP assets** are in `public/artwork/backgrounds/`: 54 wide + 54 mobile;
- activity-to-scene resolution is centralized and deterministic;
- wide/mobile artwork is art-directed as a pair;
- gameplay UI remains a separate foreground layer;
- gameplay backgrounds do not bake in Naya/Gian/Zia/Paca/Gavi;
- Coloring/Drawing preserve the themed scene behind the creative workspace;
- normal gameplay routes keep Gavi/Paca as separate foreground layers.

Production implementation:

```text
PR #256
main: 7502c708c998c87bb273639025fcb10ba6c81e12
CI:   #1183 / run 35565937149 — full success + exact Cloudflare smoke
```

The project-owner desktop preview covers one live production route in every subject:

`english-find-blue`, `bahasa-cari-a`, `math-count-2`, `iqro-cari-alif`, `letters-find-a`, `logic-match-pairs`, `science-living-cat`, `color-gavi`, and `drawing-line-horizontal`.

Responsive/mobile coverage remains backed by CI/browser QA rather than by those desktop screenshots alone.

## 7. WS-05 gameplay track

WS-05 remains separate from broad product-UX refactors.

Pattern #48 remains:

```text
NO JUSTIFIED NEW PATTERN YET
```

The Logic repeating-pattern audit approved reuse of existing `pattern_completion` for exactly five activities, and the runtime wave is now fully closed/live verified:

```text
Audit PR:                  #240
Audit main:                7109db41134f18884b6c08fba99ad2af997b3fed
Audit main CI:             #1100 / run 35492367065 — success
Runtime PR:                #273
Final PR head:              299d493da2e74e6e583322d3a16af69455d8d926
Final PR CI:                #1321 / run 35682848171 — full success
Merged runtime main:        709e2b7d3e529cf37f10a05e9c9dc92884e0a781
Merged-main CI:             #1353 / run 35687996669 — full success + exact Cloudflare smoke
Verified distribution:      900/900 / 47 / choice_grid 174 / pattern_completion 10 / KEEP 900
```

The implementation remains existing-mechanic reuse; it creates no Pattern #48 and changes no mastery/progression/schema contract.

## 8. Active next work

Current project-owner boundary:

1. Mainlagi World is currently authorized only for the validated PR #312 release-candidate scope. Preserve the Stage 8-only supplemental evidence mapping; do not add a second mapping or age-8 canonical evidence in this release.
2. **Do not resume character development**; Drive character assets are reference-only while paused.
3. Preserve the closed Mainlagi Belajar WS-05 PR #273 production baseline; any later mechanic runtime starts from a fresh objective/evidence audit.
4. Preserve 900 activities, 47 active patterns and all mastery/evidence/progression/schema contracts.
5. English narration Wave 1 + Wave 2 asset gate are closed/live verified. Preserve 27 reviewed / 27 registry slots / 0 approved production audio / 0 runtime static-audio activation.
6. If narration continues, begin only with the four-item provider/voice pilot defined in `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`; human listening/provenance approval comes before runtime activation.
7. Select any unrelated later product wave separately.

The all-subject background generation/integration wave remains **closed / merged / live verified**.

## 9. Non-negotiable boundaries

Do not silently change:

- mastery levels or evidence contracts;
- progression/unlock semantics;
- learning schema/database contracts;
- the 9-subject / 900-activity baseline;
- the active 47-pattern taxonomy merely to hit a numeric target;
- Iqro status from `expert_required` to `expert_approved` without expert evidence;
- child/parent information architecture in a way that exposes parent/product controls inside child navigation.

## 10. Documentation synchronization policy

Active/canonical docs should describe the current state. Dated audits, implementation acceptance records and closure documents are historical evidence and should not be rewritten to pretend later state existed at their original checkpoint.

For current work, start with:

1. `CURRENT_STATE.md`;
2. this file;
3. `PRODUCT_UX_NEXT_WORK_2026-09-20.md`;
4. `NEXT_PRODUCT_QUALITY_PLAN.md`;
5. `MAINLAGI_ART_BIBLE.md`;
6. `ARCHITECTURE.md`;
7. subsystem-specific audit/closure evidence as needed.
