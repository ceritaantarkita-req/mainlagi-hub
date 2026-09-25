# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–09 COMPLETE / SESSION 10 NOT STARTED**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 09 PR: #340
Session 09 final PR head: 80e2a7211e6ebe1791370a87790b4c2ff20a621a
Session 09 final PR CI: #1673 / run 36131389534 — full success
merged implementation main: 227a77799cd73fecc8e58960ef8758c2e323bc30
merged-main CI: #1674 / run 36132350678 — full success
Production smoke (Cloudflare): success
```

This SHA is the safe implementation baseline for the next runtime session.

## Closed character work

```text
Session 01  exact SVG source inventory frozen
Session 02  shared SVG security/validation foundation
Session 03  provenance registry v2
Session 04  35/35 SVG production promotion + approval
Session 05  shared state-aware runtime resolver + CharacterLayer
Session 06  Belajar integration
Session 07  Belajar responsive QA
Session 08  Mainlagi World shared-character integration
Session 09  Home + Bermain shared-character integration
```

Current character bank:

```text
characters: 5
states per character: 7
approved SVG runtime assets: 35/35
states:
  hero
  welcome
  pointing
  thinking
  correct
  try_again
  celebrate
```

Canonical production paths:

```text
public/artwork/characters/<character>-<state>-v1.svg
```

Do not reconvert these SVGs to WebP as the normal runtime path.

## Current Belajar truth

Belajar is live on the shared SVG character runtime.

```text
Bahasa          Gavi + Paca
English         Naya + Zia
Math            Gian + Paca
Iqro            Gavi + Paca
Huruf           Gavi + Paca
Logic           Gavi + Paca
Science         Gavi + Paca
Color           Gavi + Paca, hidden in active creative workspace
Drawing         Gavi + Paca, hidden in active creative workspace
```

Presentation moments:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

Belajar integration is centralized through the shared resolver and CharacterLayer. Do not add per-activity character-file hardcoding.

## Session 07 responsive closure

Permanent regression:

```bash
npm run test:ui:character-responsive
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Matrix:

```text
routes:
  Bahasa
  English
  Math
  Science
  Iqro
  Coloring
  Drawing

viewports:
  320
  390
  430
  768
  1280

35/35 route × viewport captures PASS
horizontal overflow: 0
critical-content overlap: 0
pointer blocking: 0
broken character SVG: 0
creative-workspace character leakage: 0
```

Manual visual review found no defect that justified a CharacterLayer or GardenActivityFrame CSS correction.

## World truth at this checkpoint

**Session 08 is CLOSED / MERGED / LIVE VERIFIED.**

Petualangan Uang remains:

```text
World: Petualangan Uang
World ID: money-festival
authored cast: Gavi + Paca
Chapters: 2
Stages: 8
Scenes: 44
Segments: 89
auth/profile/shell: existing shared Mainlagi child app
narrative progress: child_world_progress
learning contribution: existing reviewed supplemental-evidence bridge only
```

World presentation now uses the shared character resolver + `CharacterLayer`.

```text
catalog/entry       -> welcome
map guidance        -> pointing
neutral story       -> hero
concept/challenge   -> thinking
correct             -> correct
retry               -> try_again
stage/final finish  -> celebrate
```

Permanent browser regression:

```bash
npm run test:ui:world-character
```

It is included in `npm run test:ui:mobile-routes` and verifies the shared SVG runtime at representative 390px and 1280px World flows, including SVG decode, state swaps, pointer safety, overflow, and mobile/tablet challenge containment.

Mandatory invariant remains:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

Session 08 did not change World structure/content, `child_world_progress` semantics, supplemental-evidence activation, Belajar mastery/progression, rewards/certificates, narration activation, or character provenance/approval. Historical World asset-plan gaps remain explicit.

Canonical closure: `MAINLAGI_WORLD_CHARACTER_INTEGRATION_SESSION08_2026-09-25.md`.

## Session 09 Home + Bermain truth

**Session 09 is CLOSED / MERGED / LIVE VERIFIED.**

Home now exposes one Mainlagi product surface with:

```text
Belajar
World
Bermain
```

Home uses the shared approved five-character SVG ensemble in canonical order:

```text
Naya / Gian / Paca / Zia / Gavi
```

Ordinary `CharacterLayer` surfaces remain capped at two characters. Only the explicit Home ensemble variant may render up to five.

Bermain authored cast remains:

```text
Gavi + Paca
```

Presentation mapping:

```text
catalog entry     -> welcome
game preflight    -> welcome
round completion  -> celebrate
```

Preflight characters render only while camera status is idle and disappear before active camera calibration/tracking.

Permanent browser regression:

```bash
npm run test:ui:home-bermain-character
```

It is included in `npm run test:ui:mobile-routes`.

Session 09 did not modify Motion Engine/game mechanics, Belajar mastery/progression, World progress/evidence semantics, character provenance/approval, narration activation, or semantic illustration runtime.

Canonical closure: `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`.

## Next authorized session

### Session 10 — Semantic/activity illustration registry SVG-aware production migration

Session 10 is a separate semantic-illustration infrastructure session.

It may:

- migrate semantic illustration provenance/validator/registry contracts to direct sanitized SVG production paths;
- preserve the existing 14 clear semantic P0 items as eligible for SVG production migration;
- keep the existing WebP derivatives as rollback/history during migration.

It must not:

- activate semantic illustrations into child runtime yet;
- change activity correctness/mastery/progression/evidence;
- reopen character runtime behavior from Sessions 01–09;
- clear the three held assets without new rights evidence.

Held keys remain fail-closed:

```text
vehicle.car
object.towel
object.raincoat
```

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm this implementation baseline or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`;
   - `LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md`;
   - `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`;
   - this checkpoint.
4. Trace the current semantic illustration registry/provenance/validator code before editing.
5. Create a new Session 10 branch from latest merged `main`.
6. Keep the 14 current source/license-clear semantic P0 items and the 3 held items distinct.
7. Add SVG-aware registry/validator tests before any production promotion.
8. Do not activate runtime semantic rendering in Session 10.
9. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 10 live.

## Stop conditions

Stop and request a separate decision instead of silently changing scope if Session 10 would require:

- a World, Home, Bermain or Belajar behavior rewrite;
- a progression/evidence schema change;
- a new character identity/state;
- clearing any held semantic asset without new rights evidence;
- global age-range expansion;
- Motion Engine or game-mechanic changes;
- narration activation;
- semantic runtime activation that belongs to later Sessions 11–13.

This checkpoint is the safe handoff between **closed Session 09** and **not-yet-started Session 10**.
