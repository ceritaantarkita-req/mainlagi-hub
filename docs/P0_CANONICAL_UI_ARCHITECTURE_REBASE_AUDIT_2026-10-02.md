# P0 Canonical UI Architecture Re-baseline Audit

Date: **2 October 2026**  
Status: **READ-ONLY AUDIT COMPLETE / NO RUNTIME CHANGE**  
Baseline: `main@f5657c1d36493b2803a8e457ccf7e9f2e0b2ee1d`

This audit re-runs the original 20 September canonical-UI ownership review after Shared Interaction, VUI, Parent responsive work, and the final JM-18 Journey Map closure.

The purpose is to stop agents from treating historical duplicate components or superseded backlog items as active production truth.

## 1. Current production route ownership

### Public / family entry

| Route | Canonical owner |
|---|---|
| `/` | `HomePage` |
| public non-immersive shell | `AppShell` -> `TopNavbar` / `BottomNavbar` |
| `/account/*` | account-specific components inside the public/family shell |

The root remains a public/family entry. Known-child fast resume remains owned by `HomePage` through `readActiveChild()` / `childDestination()`.

The account surface is intentionally separate from the authenticated parent dashboard. It is not a duplicate child shell.

### Child layout / shared navigation

Canonical child layout:

```text
src/app/child/[childId]/layout.tsx
  -> LearningAttemptBridge
  -> LearningProgressionGuard
  -> MobileFoundation / MobileRouteBoundary
  -> WorldChildShell
  -> PlayroomShell
```

`PlayroomShell` is the single shared non-immersive child header/navigation owner.

It currently owns:

- route-aware Kembali;
- Mainlagi wordmark;
- Belajar / Bermain / World menu;
- fail-closed disabled child Shop slot;
- profile/settings menu;
- audio mute toggle;
- parent/account links;
- mobile-safe bottom-sheet style profile menu;
- immersive suppression for activity and World Stage routes.

### Child selection

Canonical route:

```text
/child/select
```

Canonical owner chain:

```text
LearningPlatform.ChildSelectScreen
  -> CloudProfileScreens.CloudChildSelectScreen
```

This alias is intentional. `ChildLearningPlatform.ChildSelectScreen` is not the current route owner.

### Child home

Canonical route:

```text
/child/:childId/home
```

Canonical owner:

```text
Batch14WorldHome
```

Historical duplicate home implementations exist in both:

- `ChildLearningPathViews.ChildHomeScreen`;
- `ChildLearningPlatform.ChildHomeScreen`.

Neither is referenced by the active home route.

### Belajar subject

Canonical route:

```text
/child/:childId/subject/:subject
```

Canonical owner:

```text
ChildLearningPathViews.SubjectScreen
  -> BelajarJourneyMap
```

All **9 canonical subjects** are members of `JOURNEY_MAP_SUBJECTS`.

Therefore the old `ActivityGallery` subject fallback is currently **not reachable through any canonical subject ID**.

Important: the 20 September WS-13 audit that described `SubjectScreen -> ActivityGallery` as the production subject-catalog chain is now historical and superseded by JM-18.

### Belajar Stage

Canonical route:

```text
/child/:childId/stage/:stageId
```

Canonical owners:

- Menggambar Stage -> `CreativeTrackViews.DrawingStageScreen`;
- all other current canonical Stages -> `ChildLearningPathViews.StageScreen`.

`ChildLearningPlatform.StageScreen` is not the active app-route Stage owner.

### Activity runtime

Canonical route:

```text
/child/:childId/activity/:activityId
```

The route itself is the canonical dispatcher.

It resolves:

- specialized Belajar mechanics;
- creative Coloring/Drawing runtime;
- audio/listen-and-choose;
- semantic specialized gameplay;
- Math trace exception;
- finite fallback through `WorldActivityScreen`.

`WorldActivityScreen` remains active because it delegates unmatched legacy/fallback activities to:

```text
ChildLearningPlatform.ActivityScreen
```

Therefore **`ChildLearningPlatform.tsx` cannot be deleted wholesale** even though several of its home/select/subject/stage presentation exports are legacy.

### Bermain

Canonical route:

```text
/child/:childId/games
```

Canonical owner:

```text
LearningPlatform.GamesScreen
  -> ChildLearningPlatform.GamesScreen
```

This remains active and must not be removed during legacy cleanup.

### Rewards

Canonical route:

```text
/child/:childId/rewards
```

Canonical owner:

```text
WorldExperience.WorldRewardsScreen
```

### Petualangan Uang

Canonical owners after JM-18:

| Route | Owner |
|---|---|
| `/child/:childId/worlds` | `world-v2/MoneyWorldExperience.WorldCatalogScreen` |
| `/child/:childId/world/money-festival` | `MoneyWorldMapScreen` |
| `/child/:childId/world/money-festival/stage/:stageId` | `MoneyWorldStageScreen` |

The following old World/Belajar presentation exports inside `world/WorldExperience.tsx` are **not app-route owners**:

- `MainlagiWorldHome`;
- `WorldSubjectScreen`;
- `WorldStageScreen`;
- `WorldLearnEntry`.

Do not delete `WorldExperience.tsx` wholesale because it still owns active `WorldChildShell`, `WorldActivityScreen`, and `WorldRewardsScreen`.

## 2. Parent / family ownership

Canonical parent shell:

```text
src/app/parent/layout.tsx
  -> requireParentSession()
  -> MobileFoundation
  -> ParentLearningPlatform.ParentShell
```

Current parent route owners:

| Route | Canonical owner |
|---|---|
| `/parent` | `LearningPlatform.ParentOverviewScreen` alias -> `CloudParentOverviewScreen` |
| `/parent/children` | alias -> `CloudParentChildrenScreen` |
| `/parent/children/:childId` | `ParentLearningPlatform.ParentChildScreen` |
| `/parent/children/:childId/progress` | `ParentCoreProgressScreen` |
| `/parent/children/:childId/reports` | `ParentBatch15ReportScreen` |
| `/parent/children/:childId/certificates` | `ParentIssuedCertificatesScreen` |
| `/parent/plan` | `ParentLearningPlatform.ParentPlanScreen` |
| `/parent/privacy` | `ParentLearningPlatform.ParentPrivacyScreen` |
| `/parent/settings` | `ParentLearningPlatform.ParentSettingsScreen` |

The split is real current architecture. It is not safe to collapse parent files by filename alone.

Historical duplicate:

```text
ParentLearningPlatform.ParentOverviewScreen
```

is not the current `/parent` owner because the `LearningPlatform` barrel explicitly aliases `CloudParentOverviewScreen` to `ParentOverviewScreen`.

## 3. Legacy / overlap classification

### Safe candidates for the next retirement/isolation pass

These are not current app-route owners and should be traced/tested for removal or explicit isolation:

- `ChildLearningPathViews.ChildHomeScreen`;
- `ChildLearningPlatform.ChildHomeScreen`;
- `ChildLearningPlatform.ChildSelectScreen`;
- `ParentLearningPlatform.ParentOverviewScreen`;
- old `WorldExperience` exports `MainlagiWorldHome`, `WorldSubjectScreen`, `WorldStageScreen`, `WorldLearnEntry`;
- `LearningPlatform.ChildHomeScreen` barrel export;
- current `ActivityGallery` subject fallback, which is unreachable for the nine canonical subjects after JM-18.

### Active code that resembles legacy code but must stay

Do not remove without a separate route/runtime migration:

- `ChildLearningPlatform.ActivityScreen` — active finite fallback through `WorldActivityScreen`;
- `ChildLearningPlatform.GamesScreen` — active Bermain route owner;
- `WorldExperience.WorldChildShell` — active child shell adapter;
- `WorldExperience.WorldActivityScreen` — active fallback bridge;
- `WorldExperience.WorldRewardsScreen` — active rewards route owner;
- `ParentLearningPlatform.ParentShell` and its child-detail/settings surfaces.

## 4. Re-baseline of the 20 September P0 backlog

The old P0 list must not be executed sequentially from item 1 as if nothing happened after 20 September.

### Already closed / superseded

| Old P0 item | Current truth |
|---|---|
| canonical route ownership audit | re-audited here; original WS-13 audit is stale on subject ownership |
| child nav labels Belajar / Bermain | already live in `PlayroomShell` |
| subject cards 3-column | already live in `Playroom.module.css`, including mobile 3-column layout |
| remove activity-count subtitle from subject directory | current `SubjectDirectory` renders image + title only |
| mobile profile dropdown -> safe sheet/panel | already live as fixed bottom sheet behavior on mobile |
| QA unlock-all | already implemented for `demo-gian` behind explicit QA flag |
| activity catalog redesign | superseded by the completed 9-subject Journey Map system |
| matching randomization | CLOSED / MERGED / LIVE VERIFIED |
| shared completion + Share | CLOSED / MERGED / LIVE VERIFIED and later hardened by Shared Interaction |
| narration entry latency | CLOSED / MERGED / LIVE VERIFIED |
| parent responsive shell/dashboard | CLOSED / MERGED / LIVE VERIFIED |
| public/auth/account convergence | CLOSED / LIVE VERIFIED |
| Journey Map | JM-00 through JM-18 FINAL CLOSED |

### Still genuinely open or separately blocked

1. **Canonical owner cleanup / legacy isolation** — real maintenance debt found by this audit.
2. **Five-character final home hero** — blocked because Naya/Gian/Zia still lack approved production-ready character assets; do not fabricate runtime art.
3. **Character production** — remains explicitly paused / provenance-gated.
4. **English voice quality beyond latency** — P1 quality work remains separate; latency being closed does not mean final native-voice quality is solved.
5. **Physical-device acceptance** — remains a separate quality gate where required.
6. **Shop** — separate workstream; do not mix draft Shop PR/migrations into UI-owner cleanup.
7. **Broader parent information architecture/product acceptance** — current responsive implementation is live, but future product changes require their own scoped audit rather than deleting active split owners.

## 5. Governance findings

At this audit baseline, two open PRs were unambiguously superseded by already-merged final work and were closed during this audit:

- PR **#424** — historical JM-07–JM-11 docs branch; superseded by later JM-14/JM-18 authority;
- PR **#429** — historical JM-16 implementation branch; superseded by merged PR #430, closure #431, and JM-18.

Other open workstreams are **not** implicitly stale just because they predate JM-18.

In particular:

- Shop PR #359 remains a separate gated commerce workstream;
- child-surface PR #360 has explicit Shop dependency/history and must not be merged or closed without its own fresh audit.

## 6. Next authorized package

The next product-quality implementation package is:

```text
P0-UIA-01 — canonical owner retirement / legacy isolation
```

Scope:

1. remove or stop exporting route-dead duplicate home/select/overview owners where dependency tracing proves zero active consumers;
2. isolate old World/Belajar presentation exports without touching active `WorldChildShell`, `WorldActivityScreen`, `WorldRewardsScreen`, `GamesScreen`, or activity fallback behavior;
3. decide whether the now-unreachable `ActivityGallery` subject fallback should be removed or retained as an explicitly named fail-safe;
4. add a static route-owner regression so future agents cannot accidentally make a historical duplicate canonical again;
5. do **not** redesign visuals in this package;
6. do **not** change curriculum, progression, mastery/evidence, activity mechanics, World semantics, parent auth, database/schema, Shop, or character assets.

After P0-UIA-01 is merged/live verified, re-audit the remaining P0 product backlog from the cleaned owner graph rather than returning to the 20 September list verbatim.
