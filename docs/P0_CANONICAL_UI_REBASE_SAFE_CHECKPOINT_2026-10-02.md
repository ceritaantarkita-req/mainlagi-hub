# SAFE CHECKPOINT — Post-JM canonical UI re-baseline

Date: **2 October 2026**  
Status: **SAFE RESUME CHECKPOINT / LIVE VERIFIED**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## Exact source of truth

```text
main:                b07c293a97b6cc5c71421d296ac350d7dd9cd23b
audit PR:            #434
audit PR head:       576429dde8a4f19da980030d3aca9e224ef01c04
PR CI:               #2377 / run 36980535324 — FULL SUCCESS
merged-main CI:      #2378 / run 36981780636 — FULL SUCCESS
Cloudflare smoke:    SUCCESS — exact merged-main SHA
```

## Closed workstreams that must not be restarted

- Phase C Journey Map JM-00 through JM-18 — FINAL CLOSED / LIVE VERIFIED.
- old WS-13 subject ownership is historical; all 9 canonical subjects use `BelajarJourneyMap`.
- matching randomization — closed.
- shared Completion + Share — closed.
- narration entry latency — closed.
- parent responsive wave — closed.
- public/auth/account convergence — closed.

## Canonical UI ownership at this checkpoint

- root/public family entry -> `HomePage` under non-immersive `AppShell`;
- child shell/navigation -> `WorldChildShell -> PlayroomShell`;
- child home -> `Batch14WorldHome`;
- child select -> `LearningPlatform.ChildSelectScreen -> CloudChildSelectScreen`;
- all 9 subject routes -> `ChildLearningPathViews.SubjectScreen -> BelajarJourneyMap`;
- canonical Stage -> `ChildLearningPathViews.StageScreen`, except Menggambar -> `DrawingStageScreen`;
- activity route -> specialized dispatcher with finite fallback through `WorldActivityScreen -> ChildLearningPlatform.ActivityScreen`;
- Bermain -> `ChildLearningPlatform.GamesScreen`;
- rewards -> `WorldRewardsScreen`;
- Petualangan Uang -> `world-v2/MoneyWorldExperience` catalog/map/Stage owners;
- parent root/children -> cloud aliases; parent detail/progress/report/certificates/settings remain split across verified owners.

## Governance cleanup already performed

- PR #424 — closed as superseded.
- PR #429 — closed as superseded.
- Shop PR #359 — intentionally untouched.
- child-surface PR #360 — intentionally untouched because it has its own dependency/history.

## Next authorized package

```text
P0-UIA-01 — canonical owner retirement / legacy isolation
```

Scope:

1. dependency-trace route-dead duplicate home/select/overview/old-World presentation owners;
2. remove or stop exporting only proven zero-consumer owners;
3. preserve active `WorldChildShell`, `WorldActivityScreen`, `WorldRewardsScreen`, `ChildLearningPlatform.ActivityScreen`, and `ChildLearningPlatform.GamesScreen`;
4. decide/document the now-unreachable canonical-subject `ActivityGallery` fallback;
5. add static route-owner regression;
6. no visual redesign;
7. no curriculum/progression/mastery/evidence/World semantics/parent auth/schema/Shop/character changes.

## Recovery rule

If P0-UIA-01 hits an unexpected runtime or ownership regression, return to exact `main@b07c293a97b6cc5c71421d296ac350d7dd9cd23b`. Do not reopen Journey Map JM-00 through JM-18 as a cleanup shortcut.
