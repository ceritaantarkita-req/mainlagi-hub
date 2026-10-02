# JM-14 — 9-subject Belajar Journey Map final closure

Date: **2 October 2026**  
Status: **CLOSED / MERGED RUNTIME / LIVE VERIFIED / DOCS CLOSURE**  
Workstream: **Phase C — Canonical Journey Map System**

Creative runtime PR: **#426**  
Creative final head: `ecb9699b04fc4c133d8c27a6e0f37946384f82bc`  
Merged runtime main: `5c9638303d562f96556bb16a18c40a716b27e73f`  
PR CI: **#2351 / run `36945436676` — FULL SUCCESS**  
Merged-main CI: **#2352 / run `36946329650` — FULL SUCCESS**  
Production smoke: **SUCCESS — exact merged runtime SHA verified**

Predecessor safe checkpoint:
- docs checkpoint PR **#425**
- checkpoint main `14b085d69c124ad18139fa230a87b83e90ef1161`
- main CI **#2350 / run `36944762430` — FULL SUCCESS**
- exact Cloudflare smoke — **SUCCESS**

## 1. JM-14 closes the complete Belajar Journey Map rollout

JM-14 is an integration/closure step. It does **not** introduce a new curriculum, runtime, schema, progression model, activity mechanic, or second Journey Map engine.

The single shared `BelajarJourneyMap` owner now serves all nine canonical Belajar subjects:

1. Bahasa Indonesia
2. Bahasa Inggris
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Integrated production truth:

```text
subjects:                9
canonical Stages:        46
activities:              900
activities per subject:  100
Journey Map owners:      1 shared engine
```

Canonical Stage order remains derived from the existing learning paths; Stage metadata/activity membership remains owned by the canonical learning system; readiness remains derived from the existing progression/evidence contract.

## 2. Creative boundaries are preserved

JM-12 and JM-13 did not flatten creative subjects into ordinary learning runtime behavior.

### Mewarnai

- subject navigation now uses the shared Journey Map;
- exact **5 Stages / 100 activities** are preserved;
- Stage detail remains text-only;
- activity destinations continue to use the existing Coloring creative runtime;
- workspace state, fill/history behavior, Completion/Again and creative completion-only evidence semantics remain unchanged.

### Menggambar

- subject navigation now uses the shared Journey Map;
- exact **4 Stages / 100 activities** are preserved;
- Stage detail remains text-only;
- the primary Stage CTA deliberately hands off to the canonical Stage route;
- Drawing Stage routes continue to resolve `DrawingStageScreen`;
- direct activity links remain stable;
- canvas/workspace state, drawing guides, Completion/Again and creative completion-only evidence semantics remain unchanged.

## 3. Shared contracts preserved across all nine subjects

The completed Belajar Journey Map system preserves:

- one shared Journey Map implementation;
- exact subject IDs and stable subject/stage/activity routes;
- exact canonical Stage ordering and membership;
- exact 100-activity membership per subject;
- `locked | in_progress | evidence_needed | ready` canonical readiness semantics;
- `completed | current | open | locked` as presentation-only projection;
- QA unlock-all as inspection-only behavior that does not mutate canonical readiness;
- JM-02 `PlayroomShell` as the single shared child-header owner on subject/stage navigation surfaces;
- activity and immersive runtime ownership outside the Journey Map;
- existing Completion + Share semantics;
- World as a separate first-class domain;
- Shop boundaries;
- database/schema and auth/profile boundaries.

## 4. Verification evidence

The final shared Journey Map browser contract covers all nine subjects and verifies:

- exact canonical Stage order;
- exact 100-activity Browse All membership per subject;
- no fallback to the legacy activity gallery on Journey Map subject pages;
- text-only Stage detail;
- Continue/Stage handoff behavior;
- JM-02 header ownership;
- responsive behavior;
- Drawing Stage handoff to the canonical Drawing Stage route.

The blocking mobile route suite also covers creative subject Journey Maps while retaining the existing Drawing Stage and creative activity runtime routes.

PR **#426** head `ecb9699b04fc4c133d8c27a6e0f37946384f82bc` passed required PR CI **#2351 / run `36945436676`**.

Merged runtime `main@5c9638303d562f96556bb16a18c40a716b27e73f` passed merged-main CI **#2352 / run `36946329650` FULL SUCCESS**:

- Production build
- Quality gate (Ubuntu)
- Windows compatibility
- Secret history scan
- Mobile route QA (Chromium)
- Production dependency audit
- Production smoke (Cloudflare)

Exact production smoke succeeded for the merged runtime SHA.

Therefore:

```text
JM-00 through JM-14 Belajar scope:
CLOSED / MERGED / LIVE VERIFIED
```

## 5. Next authorized Journey Map boundary

The Belajar portion of Phase C is complete.

Next sequence:

```text
JM-15 — Petualangan Uang read-only adapter audit
JM-16 — Petualangan Uang desktop redesign
JM-17 — Petualangan Uang mobile/responsive
JM-18 — final Journey Map closure
```

JM-15 must begin as a **read-only audit**. Do not remodel Petualangan Uang as a normal Belajar subject, do not reuse Belajar mastery/readiness semantics for World, and do not change World story, progression, evidence, Stage ordering, Chapter/Scene/Segment structure, narration, Completion/Share, database/schema, or gameplay behavior during JM-15.

The canonical World baseline remains the separate Petualangan Uang hierarchy and progression model already audited in JM-00. JM-16/JM-17 must not begin until the JM-15 adapter boundary is explicitly documented and verified.
