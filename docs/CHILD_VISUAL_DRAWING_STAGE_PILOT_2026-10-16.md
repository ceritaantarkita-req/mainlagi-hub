# Child Visual Pilot P1-c — Drawing Stage shared playful catalog (16 Oct 2026)

Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**. Base `main@6b850c5362aa494c09a188361399d372272232a4` after P0 #509, Sorting #510 and Audio/Symbol QA #512. P1-b shared Choice successor #513 is independent and must meet exact-head CI before any integration. Supersession of historical approvals is not implied.

## User goal
One global Stage Page visual system, **including Drawing**, not 900 manual patches. Preserve nine separate subject identities and the creative canvas/gameplay runtime. Stage is a catalog, not an answer/question experience.

## Verified source divergence before this pilot
- `src/app/child/[childId]/stage/[stage]/page.tsx` already routes Drawing through `CreativeTrackViews.DrawingStageScreen` and eight other subjects through `ChildLearningPathViews.StageScreen`.
- Historical Drawing owner separately built cards using `LearningPlatform.module.css` with own title, lesson wrappers, tags and local progress; it bypassed the shared Stage hero/readiness/lesson design.
- Shared `StageScreen` already renders the canonical stage title, `StagePath.module.css` hero with subject identity, readiness from `getSubjectStageReadiness`, lessons from `getLessonsForStage`, age-eligible activities, adaptive recommendation, completion tags and same canonical activity paths.
- `LearningSymbol` already supports `drawing` and `PaintBrush`. No catalog or illustration asset migration required.

## Minimal implementation
`DrawingStageScreen` remains the stage-route handoff and preserves the canonical Drawing owner and validation boundary, but *delegates only presentation* to the existing `StageScreen` (same template as other eight subjects). No runtime Canvas, `CreativePracticeActivity`, activity dispatcher or progress gate is moved. `StageScreen` has existing colored stage symbol and per-subject accent. No new overlay/panel on live drawing.

## Browser/regression gates
Extend the existing JM-06 shared Journey Map Chromium suite rather than duplicate the page engine:
- `/child/demo-gian/stage/drawing-lines-shapes-basics` retains canonical name **Garis, Bentuk & Jalur** and exact stage URL after the Journey Map Continue action.
- Check 320x720, 390x844, 768x1024, 1280x860 with stage owner marker, one h1, shared readiness panel, at least one lesson and age-eligible drawing activity cards, and canonical `/child/demo-gian/activity/drawing-*` links.
- No horizontal scroll or child-card clipping. A scrollable card remains keyboard/touch sized (>=44px).
- Permanent eight PNG screenshots: four idle and four first-card positions, uploaded as distinct `drawing-stage-qa-screenshots` artifact to survive the main mobile QA runner's cleanup.
- Continue all prior Journey Map, drawing guide/canvas, Completion/Again, progression, age, CI, Shop and World tests unchanged.

## Release gate
1. **7/7 exact PR-head CI PASS** and artifact includes eight PNGs; actually review 320/390/768/1280 for first-action visibility, body text/lesson density, tag clutter and cards.
2. If visually wrong, fix shared catalog *with opt-in Drawing styling only* or reject this pilot. Avoid global Stage CSS regressions.
3. Squash merge protected exact head only after acceptance, then independently verify merged-main **8/8 including Cloudflare exact SHA**. Real iOS Safari and owner review remain open.
4. 900/900 classification is NOT 900 visual approvals. No answers, scoring, mastery, stage locks, DB, auth, World, Motion, Shop or character design change.
