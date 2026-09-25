# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–08 COMPLETE / SESSION 09 NOT STARTED**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 08 PR: #337
Session 08 final PR head: 6a728c36f7bc0a1a34c46e2511062df5e2b9af9d
Session 08 final PR CI: #1663 / run 36120579884 — full success
merged implementation main: e2e5e4b676ce45313786420708de41731ec2e3cb
merged-main CI: #1664 / run 36121741946 — full success
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

## Next authorized session

### Session 09 — Integrate characters into Home + Bermain shell

Session 09 may change product presentation only:

- Mainlagi Home full-cast/brand presentation;
- Belajar/World/Bermain entry cards where appropriate;
- Bermain entry/result/completion presentation through the shared character system.

It must not:

- redesign Motion Engine or game mechanics;
- merge World progression into Belajar mastery;
- change character provenance/approval;
- change the 900-activity or 47-pattern baselines;
- activate narration;
- start semantic SVG Sessions 10–16.

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm this implementation baseline or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `CHARACTER_PRESENTATION_SYSTEM.md`;
   - `MAINLAGI_WORLD_CHARACTER_INTEGRATION_SESSION08_2026-09-25.md`;
   - this checkpoint.
4. Trace actual Home + Bermain shell/component imports before editing.
5. Create a new Session 09 branch from latest merged `main`.
6. Reuse `characterPresentation.ts` + `CharacterLayer`; do not create a second character runtime.
7. Keep existing Belajar and Petualangan Uang character behavior unchanged while integrating Home/Bermain presentation.
8. Add representative Home/Bermain browser regression before merge.
9. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 09 live.

## Stop conditions

Stop and request a separate decision instead of silently changing scope if Session 09 would require:

- a World or Belajar structure/content rewrite;
- a progression/evidence schema change;
- a new character identity/state;
- a new asset approval;
- global age-range expansion;
- Motion Engine or game-mechanic changes;
- Home recommender/data-model redesign;
- narration activation;
- semantic SVG Sessions 10–16 work.

This checkpoint is the safe handoff between **closed Session 08** and **not-yet-started Session 09**.
