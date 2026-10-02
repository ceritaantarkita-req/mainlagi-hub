# JM-16 — Petualangan Uang desktop Journey Map final closure

Date: **2 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

Audit predecessor:
- JM-15 audit closure PR **#428**
- JM-15 audit main `335b01ae3369cf5c2a8ced96d58cc50b345025e5`
- main CI **#2356 / run `36953092509` — FULL SUCCESS**
- exact Cloudflare smoke — **SUCCESS**

JM-16 runtime:
- PR **#430**
- final PR head `80cdd57c86943e1f888b8bfb122bf977cb3193d5`
- PR CI **#2367 / run `36962973475` — FULL SUCCESS**
- merged main `544475c534a05176f9c6d349b32c3b37819f7e1f`
- merged-main CI **#2368 / run `36968729118` — FULL SUCCESS**
- exact Production smoke (Cloudflare) — **SUCCESS**

## 1. What JM-16 shipped

JM-16 delivers the **desktop Journey Map redesign for Petualangan Uang** without changing canonical World curriculum/runtime semantics.

The implementation adds a pure World-specific presentation adapter:

```text
canonical World structure
+ existing MoneyWorldProgress
        ↓
buildMoneyWorldJourneyMap()
        ↓
MoneyWorldMapScreen desktop presentation
        ↓
existing stable World Stage routes/runtime
```

The adapter projects:

- exact canonical World ID;
- exact Chapter identity/order;
- exact Stage identity/order;
- stable map and Stage hrefs;
- completed/current/open/locked presentation state;
- World completion stars;
- completed Stage counts;
- next Journey Stage;
- existing resume Stage + Segment checkpoint;
- canonical source state for QA.

It does **not** write progress and does not create a second progression store.

## 2. Desktop visual result

For viewports above 760px, Petualangan Uang now uses a cleaner structured Journey Map while preserving the illustrated Mainlagi World identity.

Desktop presentation includes:

- compact World hero composition;
- explicit World progress summary;
- resume/checkpoint card for the current Stage;
- semantic Chapter banners with completed counts;
- alternating left/right Stage journey;
- visually distinct completed/current/open/locked states;
- stable Stage route handoff;
- illustrated garden map environment;
- no horizontal overflow in permanent browser QA.

The desktop pass is intentionally scoped to `min-width: 761px`. Existing mobile map geometry remains the JM-17 responsibility.

## 3. Canonical World semantics preserved

JM-16 preserves the JM-15 audited World truth:

```text
World:                       money-festival
Chapters:                    2
Stages:                      8
Scenes:                      44
Segments:                    89
practice activity placements:16
activities per Stage:        2
```

Progression remains World-specific:

1. `completedStageIds` remains an ordered canonical prefix;
2. Stage 1 is always unlocked;
3. Stage N unlocks only after Stage N-1 completion;
4. completed Stage presentation remains exactly ★★★;
5. first incomplete Stage remains current;
6. `currentStageId + currentSegmentIndex` remains the separate resume checkpoint;
7. World stars remain completion presentation, not Belajar mastery;
8. no Belajar readiness/mastery/evidence threshold controls World unlock.

## 4. Belajar/World boundary preserved

JM-16 explicitly does **not** route World through `BelajarJourneyMap`.

The World adapter is independent of:

- `LearningSubjectId`;
- `getSubjectStageReadiness()`;
- `getActivitiesForStage()`;
- Belajar Browse All;
- Belajar `LearningAttemptBridge`;
- Belajar mastery/evidence unlock semantics.

World remains a separate first-class domain with Chapter → Stage → Scene → Segment hierarchy.

## 5. Stable routes and runtime preserved

Canonical routes remain:

```text
/child/:childId/worlds
/child/:childId/world/money-festival
/child/:childId/world/money-festival/stage/:stageId
```

Runtime ownership remains:

- map -> `MoneyWorldMapScreen`;
- Stage -> `MoneyWorldStageScreen`;
- Stage content -> existing World Scene/runtime pipeline.

No Stage/Scene/Segment IDs or ordering changed.

No World story, narration, reusable mechanic payload, activity placement, Completion/Share, evidence ingestion, age policy, database/schema, Belajar, Bermain or Shop behavior changed.

## 6. Permanent QA added

JM-16 adds permanent adapter and browser regressions.

### World static/engine gate

`test:learning:world-money` now compiles and verifies the World Journey Map adapter, including:

- exact 2 Chapters / 8 Stages;
- stable href projection;
- Stage 1 current at empty progress;
- sequential lock state;
- completed Stage ★★★;
- resume Stage + Segment projection;
- completed World projection;
- fail-closed unsettled state;
- absence of Belajar readiness/activity/mastery dependencies;
- runtime consumption of the World adapter;
- semantic `aria-current` sourced from adapter-projected current state.

### Dedicated desktop browser gate

`test:ui:jm16-world-desktop` verifies at 1280px:

- World adapter owner marker;
- no Belajar Journey Map owner;
- no World Browse All;
- exact two Chapter banners;
- exact eight canonical Stage order;
- completed/current/locked projections;
- resume checkpoint CTA;
- stable Stage routes;
- `aria-current="step"`;
- semantic locked Stage state;
- illustrated garden identity;
- alternating desktop geometry;
- no horizontal overflow;
- zero browser/page errors.

The dedicated JM-16 browser test is included in blocking `test:ui:mobile-routes`.

## 7. Regression fixes during PR validation

Earlier PR attempts exposed two test-contract drifts rather than runtime defects:

1. existing mobile World regression used a page-global Stage-2 href locator, which became ambiguous after the valid JM-16 resume CTA introduced a second stable Stage-2 link; the assertion was correctly scoped to the World map owner;
2. an old static World assertion expected the pre-adapter `nextJourneyStageId` implementation detail; it was updated to require the adapter-projected `stage.current` semantic contract.

The dedicated JM-16 browser gate also waits for World progress hydration before reading projected progress, avoiding a race against the transient `Memuat…` state.

Final exact PR head `80cdd57c86943e1f888b8bfb122bf977cb3193d5` passed full PR CI #2367.

## 8. Production verification

Merged runtime `main@544475c534a05176f9c6d349b32c3b37819f7e1f` passed merged-main CI **#2368 / run `36968729118` FULL SUCCESS**:

- Quality gate (Ubuntu) — SUCCESS
- Production dependency audit — SUCCESS
- Windows compatibility — SUCCESS
- Secret history scan — SUCCESS
- Production build — SUCCESS
- Mobile route QA (Chromium) — SUCCESS
- Production smoke (Cloudflare) — SUCCESS

Therefore:

```text
JM-16:
CLOSED / MERGED / LIVE VERIFIED
```

## 9. Next authorized boundary — JM-17

**JM-17 — Petualangan Uang mobile/responsive Journey Map** is next.

JM-17 may adapt the JM-16 presentation for mobile/tablet while preserving the same World-specific adapter and all semantic boundaries above.

JM-17 should focus on:

- portrait phone containment at 320 / 390 / 430 widths;
- tablet/landscape containment;
- mobile current-Stage visibility;
- mobile resume/checkpoint CTA;
- compact Chapter progress presentation;
- touch targets and keyboard/accessibility continuity;
- rotation/reflow state preservation;
- no horizontal overflow;
- no Stage route drift;
- no World Browse All;
- no progression/runtime rewrite.

JM-18 remains the final Journey Map closure after JM-17 is merged and live verified.
