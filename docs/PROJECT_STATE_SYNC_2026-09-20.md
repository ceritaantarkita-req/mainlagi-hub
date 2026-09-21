# Mainlagi Hub — Project State Sync — 20 September 2026

Status: **CURRENT HANDOFF SNAPSHOT — SYNCHRONIZED 22 SEPTEMBER 2026**  
Repository: `ceritaantarkita-req/mainlagi-hub`  
Canonical branch: `main`

This document summarizes the repository/product state after the all-subject background integration and production-preview review. It does not replace historical audit/closure records; it links the current truth that active work must preserve.

## 1. Source of truth and production verification

Current production/documentation main:

```text
6fd9e3fc7ffa57aab687b5529033f1a995e0e5ba
```

This is the required secret-scan enforcement hardening from PR #269. PR CI #1208 passed and merged-main CI #1209 / run `35625953536` passed the full matrix including exact Cloudflare production smoke. The cloud learning analytics pagination/failure-state integrity fix remains PR #267 at `89a2bc629e8535bddbf2ab78ae1990a063f0f361`. The previous character asset pipeline docs closure remains PR #264 at `bb0645d298a645483fb10e12bc0550a8eccf0870`. The fail-closed human character asset pipeline implementation itself remains PR #263 at `e4d7b4285db17a2010c22cdd1bc29451208f6a1b`. The activity character-presentation foundation remains PR #259 and the runtime asset lifecycle registry remains PR #262. The subject-background runtime implementation remains the earlier PR #256 baseline:

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

## 1A. Cloud analytics integrity now

The previously reproduced long-history reporting defect is closed on production main:

- attempts/evidence are read page-by-page instead of stopping at fixed 500/2000 caps;
- all pages are scoped to authenticated account + child and frozen to one snapshot timestamp;
- a later-page failure produces unavailable state rather than partial analytics;
- authenticated cloud failure does not silently fall back to local browser analytics;
- parent report surfaces expose explicit loading/unavailable/retry behavior;
- stale async reads are invalidated across refresh/auth transitions;
- regression coverage proves 1,201 attempts + 3,603 evidence rows and is part of `npm run test:learning`.

Canonical record: `CLOUD_ANALYTICS_PAGINATION_CLOSURE_2026-09-21.md`.

## 1B. Required secret-scan enforcement now

The previous governance gap is closed:

- the standalone `Secret history scan` remains visible;
- the ruleset-required `Production dependency audit` now checks out full history and runs the same pinned/redacted Gitleaks scan first;
- PR #269 CI #1208 and merged-main CI #1209 both show `Required full-history secret gate` succeeding inside that required context;
- failure of the embedded scan therefore fails a required check and blocks merge;
- no separate GitHub account/UI action remains necessary for secret-scan enforcement.

Canonical record: `SECRET_SCAN_REQUIRED_GATE_CLOSURE_2026-09-22.md`.

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

The activity character-presentation architecture is merged/live verified through PR #259, the runtime asset lifecycle registry through PR #262, and the fail-closed human character asset pipeline through PR #263. A fresh Drive intake audit found **no separate Naya/Gian/Zia activity-foreground candidate**; the only canonical human art found is the three reviewed design sheets. Naya/Gian/Zia therefore remain reference-only with no production path and no committed human production binary. The next character wave is candidate asset creation/review outside the production directory, provenance/redistribution approval for the exact reviewed derivative, then binary integration and later runtime activation through the central allowlist/resolver.

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

The current fresh Logic repeating-pattern audit approved reuse of existing `pattern_completion` for exactly five activities:

```text
PR #240
Audit main: 7109db41134f18884b6c08fba99ad2af997b3fed
Main CI:    #1100 / run 35492367065 — success
Runtime:    NOT STARTED
```

If implemented, this remains existing-mechanic reuse; it must not create Pattern #48 or change mastery/progression/schema.

## 8. Active next work

Product UX next order:

1. create/review one isolated **Naya** candidate outside the public production directory against the locked Art Bible/design-sheet identity, then repeat for Gian and Zia only after each prior candidate review is closed;
2. confirm source/creation basis plus public redistribution rights for each exact reviewed derivative;
3. export only approved transparent WebP binaries to the canonical production paths and promote the provenance records from reference-only to approved;
4. merge binary/provenance integration while keeping runtime activation separate;
5. activate approved assets through the central character allowlist/resolver and run responsive activity QA;
6. validate English -> Naya + Zia and Math -> Gian + Paca while preserving fail-closed fallback and leaving other subject pairings unchanged;
7. revisit the five-character homepage hero only with approved production identities;
8. improve English narration quality;
9. continue learning-illustration consistency and broader human/device acceptance.

The all-subject background generation/integration wave is **closed / merged / live verified** and is no longer an active implementation task.

WS-05 may proceed independently only through its objective/evidence gates.

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
