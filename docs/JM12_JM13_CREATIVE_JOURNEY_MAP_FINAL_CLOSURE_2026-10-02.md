# JM-12 + JM-13 — Creative Journey Map closure

Date: **2 October 2026**  
Status: **RUNTIME MERGED / MERGED-MAIN VERIFICATION PENDING**  
Workstream: **Phase C — Canonical Journey Map System**

Runtime PR: **#426**  
Final runtime head: `ecb9699b04fc4c133d8c27a6e0f37946384f82bc`  
Merged main: `5c9638303d562f96556bb16a18c40a716b27e73f`  
PR CI: **#2351 / run `36945436676` — FULL REQUIRED GATES SUCCESS**  
Merged-main CI: **#2352 / run `36946329650` — IN PROGRESS**  
Production smoke: **PENDING exact merged-main verification**

## 1. Scope

JM-12 and JM-13 migrate the final two Belajar subject navigation surfaces onto the existing shared `BelajarJourneyMap` engine:

- JM-12 — Mewarnai
- JM-13 — Menggambar

This makes all nine Belajar subjects consumers of one shared Journey Map owner without changing the canonical curriculum or creative runtimes.

## 2. Canonical creative membership preserved

Mewarnai remains exact:

1. `color-characters`
2. `color-exploration-basics`
3. `color-patterns-scenes`
4. `color-mood-material-story`
5. `color-palette-scene-capstone`

with **100 activities** total.

Menggambar remains exact:

1. `drawing-lines-shapes-basics`
2. `drawing-objects-scenes`
3. `drawing-space-story-imagination`
4. `drawing-composition-design-capstone`

with **100 activities** total.

## 3. Creative-runtime boundary preserved

Mewarnai keeps the existing Coloring creative activity runtime.

Menggambar keeps its canonical Stage exception: the Journey Map primary Stage CTA goes to the stable Stage route, which continues to resolve `DrawingStageScreen`. The Journey Map does not absorb or redesign Drawing Stage/workspace runtime.

No curriculum, Stage membership/order, readiness/evidence/mastery, database/schema, auth/profile, World, Shop, creative workspace mechanics, Completion/Again state preservation, or activity IDs changed.

## 4. PR verification

PR CI #2351 passed all required PR gates:

- Production dependency audit
- Windows compatibility
- Production build
- Mobile route QA (Chromium)
- Quality gate (Ubuntu)
- Secret history scan

The browser evidence explicitly verified:

- all **9 Belajar subjects** use one shared Journey Map engine;
- exact canonical Stage order and exact **100 activities per subject**;
- Mewarnai keeps creative activity handoff;
- Menggambar preserves `DrawingStageScreen` Stage handoff;
- text-only Stage detail, JM-02 header, responsive bottom sheet and rotation state remain intact;
- mobile route QA passed **29 canonical routes × 7 viewport widths**;
- browser warning inventory remained **0**;
- SI-06G creative regression remained PASS;
- permanent visual product baseline passed **63 exact-path captures × 3 viewports**.

## 5. Closure gate

Do not mark JM-12/JM-13 CLOSED / LIVE VERIFIED until merged-main CI #2352 passes all normal push gates including exact Production smoke (Cloudflare) for `5c9638303d562f96556bb16a18c40a716b27e73f`.

After exact smoke succeeds, the only next Journey Map step is:

```text
JM-14 — 9-subject Belajar closure
```

JM-14 is integration/closure, not a new curriculum or runtime redesign. JM-15 Petualangan Uang read-only adapter audit must not begin until JM-14 is closed.
