# Mainlagi Hub — Project State Sync — 20 September 2026

Status: **CURRENT HANDOFF SNAPSHOT**  
Repository: `ceritaantarkita-req/mainlagi-hub`  
Canonical branch: `main`

This document summarizes the repository/product state after the WS-13 parent/profile/settings wave and before the next character-production wave. It does not replace historical audit/closure records; it links the current truth that active work must preserve.

## 1. Source of truth and production verification

Sync-base `main` at the time this documentation synchronization started:

```text
a04bd51fb02dedf56b5cd62f7f579eb53c4be251
```

That commit is the docs-only closure of PR #252. The latest independently verified runtime/product implementation is:

```text
Parent responsive implementation PR:  #251
Implementation main:                   77bee682f84b5d68b85d2c91b1d6f2ca4c93d2d9
Implementation main CI:                #1160 / run 35520629179
Cloudflare exact-SHA production smoke: PASS
Responsive QA artifact:                10608044389
```

The sync-base docs-only `a04bd51...` main run is CI #1162 / run `35521404941`; it later completed successfully as CI #1162 / run `35521404941`. Runtime behavior at `77bee682...` remains independently live verified by CI #1160, while the docs-only closure main is independently green as well.

Canonical production path remains:

```text
GitHub main -> Cloudflare Git integration -> OpenNext Worker -> https://mainlagihub.my.id/
```

No VPS/SSH path is canonical production.

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

The next character wave must first lock the production character specification and provenance, then create/review Naya/Gian/Zia assets. Generated candidates are not production-approved merely because they render.

## 6. WS-05 gameplay track

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

## 7. Active next work

Product UX next order:

1. extend the canonical Art Bible with production-grade Naya/Gian/Zia character specification and asset contract;
2. create/review production candidates for Naya/Gian/Zia while preserving Paca/Gavi style continuity and provenance rules;
3. integrate approved character assets without conflating guide identity with child profile identity;
4. build the subject theme/background system;
5. improve English narration quality;
6. expand visual/usability cleanup and physical-device/human acceptance.

WS-05 may proceed independently only through its objective/evidence gates.

## 8. Non-negotiable boundaries

Do not silently change:

- mastery levels or evidence contracts;
- progression/unlock semantics;
- learning schema/database contracts;
- the 9-subject / 900-activity baseline;
- the active 47-pattern taxonomy merely to hit a numeric target;
- Iqro status from `expert_required` to `expert_approved` without expert evidence;
- child/parent information architecture in a way that exposes parent/product controls inside child navigation.

## 9. Documentation synchronization policy

Active/canonical docs should describe the current state. Dated audits, implementation acceptance records and closure documents are historical evidence and should not be rewritten to pretend later state existed at their original checkpoint.

For current work, start with:

1. `CURRENT_STATE.md`;
2. this file;
3. `PRODUCT_UX_NEXT_WORK_2026-09-20.md`;
4. `NEXT_PRODUCT_QUALITY_PLAN.md`;
5. `MAINLAGI_ART_BIBLE.md`;
6. `ARCHITECTURE.md`;
7. subsystem-specific audit/closure evidence as needed.
