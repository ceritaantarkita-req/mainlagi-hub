# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–07 COMPLETE / SESSION 08 NOT STARTED**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 07 PR: #335
Session 07 final PR head: 1f0e52a13319b6c7730b825b11e3d8540fc967e0
Session 07 final PR CI: #1650 / run 36105937149 — full success
merged implementation main: 1c4ba5f41c554621ee29aeccb6b5b85415a45d55
merged-main CI: #1651 / run 36106692149 — full success
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

## World boundary at this checkpoint

**Session 08 has not started.**

World remains structurally/live as it was before the character migration:

```text
World: Petualangan Uang
World ID: money-festival
Chapters: 2
Stages: 8
Scenes: 44
Segments: 89
auth/profile/shell: existing shared Mainlagi child app
narrative progress: child_world_progress
learning contribution: existing reviewed supplemental-evidence bridge only
```

Mandatory invariant:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

Do not flatten World into Belajar activities or use World completion to mint canonical Belajar evidence.

## Next authorized session

### Session 08 — Integrate shared character runtime into Mainlagi World

Authored cast remains:

```text
money-festival -> Gavi + Paca
```

Target default state mapping:

```text
catalog/entry       -> welcome
map guidance        -> pointing
neutral story       -> hero
considering         -> thinking
correct             -> correct
retry               -> try_again
stage/final finish  -> celebrate
```

Session 08 may change **World presentation wiring only**.

It must not change:

- World ID;
- 2 Chapters / 8 Stages / 44 Scenes / 89 Segments;
- World persistence semantics;
- World evidence activation semantics;
- Belajar mastery/progression;
- stars/rewards/certificates semantics;
- the 900-activity baseline;
- the 47-pattern baseline;
- character provenance/approval;
- Home/Bermain integration.

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm this implementation baseline or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `CHARACTER_PRESENTATION_SYSTEM.md`;
   - `MAINLAGI_BELAJAR_CHARACTER_RESPONSIVE_SESSION07_2026-09-25.md`;
   - this checkpoint.
4. Trace actual World route/component imports before editing.
5. Create a new Session 08 branch from latest merged `main`.
6. Reuse `characterPresentation.ts` + `CharacterLayer`; do not create a second character runtime.
7. Keep Gavi + Paca as the authored Petualangan Uang cast.
8. Add representative World browser regression before merge.
9. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 08 live.

## Stop conditions

Stop and request a separate decision instead of silently changing scope if Session 08 would require:

- a World structure/content rewrite;
- a progression/evidence schema change;
- a new character identity/state;
- a new asset approval;
- global age-range expansion;
- Motion Engine changes;
- Home product redesign;
- narration activation.

This checkpoint is the safe handoff between **closed Session 07** and **not-yet-started Session 08**.
