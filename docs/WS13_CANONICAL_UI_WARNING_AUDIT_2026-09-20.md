# WS-13 — Canonical UI + Browser Warning Audit

Date: **20 September 2026**  
Status: **PHASE 1 ACTIVE**  
Base: `main` = `3854d04ded18f1859e1829712273053037ed32ad`

This audit is the first implementation step from `PRODUCT_UX_NEXT_WORK_2026-09-20.md`. Scope is intentionally narrow: identify the actual production UI owners, distinguish active vs legacy presentation paths, and make browser warnings measurable before visual refactors.

## Canonical production ownership

### Child shell / navigation

Canonical:
- `src/app/child/[childId]/layout.tsx`
- `WorldChildShell` -> `PlayroomShell`
- visual/navigation owner: `src/components/learning/Playroom.tsx` + `Playroom.module.css`

### Child home

Canonical route:
- `src/app/child/[childId]/home/page.tsx`

Actual renderer:
- `Batch14WorldHome`

Important: `ChildLearningPathViews.ChildHomeScreen` and `ChildLearningPlatform.ChildHomeScreen` are **not** the active home route. Future homepage redesign must modify `Batch14WorldHome` first.

### Subject catalog

Canonical route:
- `src/app/child/[childId]/subject/[subject]/page.tsx`

Actual renderer chain:
- `ChildLearningPathViews.SubjectScreen`
- `ActivityGallery`

Therefore gallery/card redesign belongs primarily to:
- `ChildLearningPathViews.tsx`
- `ActivityGallery.tsx`
- `ActivityGallery.module.css`

### Stage

Canonical route:
- `src/app/child/[childId]/stage/[stage]/page.tsx`

Actual renderer:
- drawing stage -> `DrawingStageScreen`
- all other current stages -> `ChildLearningPathViews.StageScreen`

The older `ChildLearningPlatform.StageScreen` is not the canonical route owner.

### Activity

Canonical route:
- `src/app/child/[childId]/activity/[activity]/page.tsx`

This route intentionally dispatches to specialized renderers. The common fallback chain is:
- `WorldActivityScreen`
- `ChildLearningPlatform.ActivityScreen`
- shared presentation wrapper `GardenActivityFrame`

Specialized renderers must keep evidence/completion contracts intact. Shared completion UI should be added as a reusable layer rather than duplicated per mechanic.

### Parent

Canonical shell:
- `src/app/parent/layout.tsx`
- `ParentLearningPlatform.ParentShell`

Canonical root overview:
- `LearningPlatform.ParentOverviewScreen`
- alias of `CloudProfileScreens.CloudParentOverviewScreen`

Canonical child list:
- alias of `CloudProfileScreens.CloudParentChildrenScreen`

Progress/report/other parent surfaces remain split across:
- `ParentCoreProgress`
- `ParentLearningPlatform`
- mastery/report components.

This split is active product debt and is a later WS-03/WS-13 convergence task; do not delete parent components until each route owner is verified.

## Legacy / overlapping presentation paths

The following are not automatically safe to delete, but must not be treated as the source of truth for redesign work:

- duplicate home/subject/stage implementations inside `ChildLearningPlatform.tsx`;
- `MainlagiWorldHome`, `WorldSubjectScreen`, `WorldStageScreen`, and `WorldLearnEntry` in `WorldExperience.tsx` unless a route/test is shown to consume them;
- parent local-prototype implementations that are superseded by cloud aliases on current routes.

Rule for agents: **trace from `src/app/**/page.tsx` and layout imports before editing a similarly named component.**

## Warning audit

Two different warning concepts exist and must not be mixed:

1. **Product-QA heuristic warnings** such as low fresh-profile activity exposure. These are deliberate product findings and are not browser console warnings.
2. **Browser console warnings** emitted by the rendered app/browser. The current local product QA blocks console errors but did not previously inventory warning-level console messages.

Phase 1 adds warning-level capture to `run-local-product-qa.mjs`:
- dedupe by route + message;
- store route/message evidence in the JSON report;
- summarize the count in the markdown report;
- record one product warning when browser warnings exist;
- do not hide or allowlist unknown warnings in this audit.

Browser warnings stay non-blocking for this inventory step. After exact messages are known, each warning must be classified as:
- product bug -> fix;
- dependency/browser noise -> document narrowly;
- expected behavior -> allowlist only with an explicit reason.

Target after cleanup remains **0 unexpected browser console errors and 0 unexpected browser console warnings** on canonical QA routes.

## Next code wave after this audit

1. Child navigation labels: **Belajar / Bermain**.
2. Active homepage only: `Batch14WorldHome`.
3. Subject directory: remove activity-count subtitle and rebuild responsive 3-column layout.
4. Mobile profile menu: replace desktop-style absolute dropdown behavior with a mobile-safe sheet/panel.
5. Then activity gallery + QA unlock-all.

Do not start the five-character final hero asset pass until Naya/Gian/Zia production art is ready or explicitly approved as temporary artwork.
