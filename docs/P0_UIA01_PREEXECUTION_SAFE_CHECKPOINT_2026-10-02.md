# P0-UIA-01 Pre-execution Safe Checkpoint — 2026-10-02

Status: **HISTORICAL PRE-EXECUTION CHECKPOINT / SUPERSEDED BY FINAL UIA-01 CLOSURE**

> Current authority: `P0_UIA01_CANONICAL_OWNER_RETIREMENT_FINAL_CLOSURE_2026-10-02.md`. This file remains the exact rollback baseline before runtime cleanup.

This checkpoint exists so a later agent/chat can resume the canonical UI cleanup without repeating the post-JM audit or accidentally editing historical presentation owners.

## 1. Exact safe baseline

Repository:

```text
ceritaantarkita-req/mainlagi-hub
```

Canonical main at this checkpoint:

```text
b07c293a97b6cc5c71421d296ac350d7dd9cd23b
```

Audit PR:

```text
PR #434 — docs: rebaseline canonical UI architecture after JM-18
PR head: 576429dde8a4f19da980030d3aca9e224ef01c04
merged main: b07c293a97b6cc5c71421d296ac350d7dd9cd23b
```

Verification:

```text
PR CI:          #2377 / run 36980535324 — FULL SUCCESS
merged-main CI: #2378 / run 36981780636 — FULL SUCCESS
Cloudflare:     Production smoke SUCCESS on exact merged main SHA
```

All blocking jobs passed:

- Production build;
- Quality gate (Ubuntu);
- Mobile route QA (Chromium);
- Secret history scan;
- Production dependency audit;
- Windows compatibility;
- exact merged-main Production smoke (Cloudflare).

This is the safe rollback/resume baseline before P0-UIA-01 runtime changes.

## 2. Canonical authority

Read these before editing runtime:

1. `docs/P0_CANONICAL_UI_ARCHITECTURE_REBASE_AUDIT_2026-10-02.md`;
2. `docs/CURRENT_STATE.md`;
3. `docs/NEXT_PRODUCT_QUALITY_PLAN.md`;
4. `docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md`;
5. `docs/JM18_CANONICAL_JOURNEY_MAP_FINAL_CLOSURE_2026-10-02.md`.

The older `WS13_CANONICAL_UI_WARNING_AUDIT_2026-09-20.md` is historical for current ownership. Its old subject-catalog conclusion predates JM-18.

## 3. Current route-owner truth

### Public/family

- `/` -> `HomePage`;
- public non-immersive shell -> `AppShell`;
- account routes remain separate family/account surfaces.

### Child

- child layout -> `WorldChildShell -> PlayroomShell`;
- child home -> `Batch14WorldHome`;
- child select -> `LearningPlatform.ChildSelectScreen` alias -> `CloudChildSelectScreen`;
- all 9 canonical subjects -> `ChildLearningPathViews.SubjectScreen -> BelajarJourneyMap`;
- canonical Stage -> `ChildLearningPathViews.StageScreen`;
- Menggambar Stage -> `DrawingStageScreen`;
- activity route -> explicit specialized dispatcher;
- finite unmatched activity fallback -> `WorldActivityScreen -> ChildLearningPlatform.ActivityScreen`;
- Bermain -> `ChildLearningPlatform.GamesScreen`;
- rewards -> `WorldRewardsScreen`.

### Petualangan Uang

Current World route owners are in `world-v2/MoneyWorldExperience`:

- catalog -> `WorldCatalogScreen`;
- map -> `MoneyWorldMapScreen`;
- Stage -> `MoneyWorldStageScreen`.

### Parent

- shell -> `ParentLearningPlatform.ParentShell`;
- `/parent` -> `CloudParentOverviewScreen` through the `LearningPlatform` alias;
- `/parent/children` -> `CloudParentChildrenScreen` through the alias;
- child detail/progress/report/certificate/settings routes remain intentionally split across their current verified owners.

## 4. Route-dead / overlapping candidates proven by the audit

These are candidates for P0-UIA-01 removal or explicit isolation after exact zero-consumer tracing:

- `ChildLearningPathViews.ChildHomeScreen`;
- `ChildLearningPlatform.ChildHomeScreen`;
- `ChildLearningPlatform.ChildSelectScreen`;
- `ParentLearningPlatform.ParentOverviewScreen`;
- `LearningPlatform.ChildHomeScreen` barrel export;
- old `WorldExperience` presentation exports:
  - `MainlagiWorldHome`;
  - `WorldSubjectScreen`;
  - `WorldStageScreen`;
  - `WorldLearnEntry`;
- the `ActivityGallery` subject fallback, which is not reached by any of the nine canonical subject IDs after JM-18.

## 5. Active similarly named code — DO NOT DELETE WHOLE FILES

The audit explicitly proved that cleanup by filename would be unsafe.

Keep unless separately migrated and tested:

- `ChildLearningPlatform.ActivityScreen` — active finite fallback;
- `ChildLearningPlatform.GamesScreen` — active Bermain route;
- `WorldExperience.WorldChildShell` — active child shell adapter;
- `WorldExperience.WorldActivityScreen` — active fallback bridge;
- `WorldExperience.WorldRewardsScreen` — active rewards route;
- `ParentLearningPlatform.ParentShell`;
- active parent child/detail/settings surfaces.

Therefore:

> Do not delete `ChildLearningPlatform.tsx`, `WorldExperience.tsx`, or `ParentLearningPlatform.tsx` wholesale.

## 6. Already-completed P0 work — DO NOT REPEAT

The 20 September P0 list is not a current sequential to-do list.

Already closed/superseded:

- Belajar / Bermain navigation naming;
- responsive 3-column subject directory;
- removal of subject activity-count subtitle;
- mobile-safe profile sheet/panel;
- QA unlock-all;
- old subject ActivityGallery redesign, superseded by JM-18 Journey Map;
- visible matching randomization;
- shared Completion + Share;
- narration first-instruction latency;
- parent responsive shell/dashboard;
- public/auth/account convergence;
- Journey Map JM-00 through JM-18.

## 7. Governance cleanup already performed

The post-JM audit closed two unambiguously superseded PRs:

- PR #424 — historical JM-07–JM-11 docs branch;
- PR #429 — historical JM-16 branch superseded by merged/final Journey Map authority.

Do not reopen or merge them.

These were deliberately **not** touched:

- Shop PR #359 — separate gated commerce workstream;
- child-surface PR #360 — dependency-bound historical work requiring its own fresh audit.

Do not infer that other old open PRs are stale without a dedicated audit.

## 8. Next authorized package

```text
P0-UIA-01 — canonical owner retirement / legacy isolation
```

Required execution order:

1. branch from this checkpoint main;
2. perform exact code/test consumer tracing for each candidate;
3. remove or stop exporting only route-dead duplicates;
4. preserve all active fallback/Bermain/shell/reward/parent owners;
5. decide whether `ActivityGallery` should be removed or retained as an explicitly named fail-safe;
6. add a permanent static route-owner regression that asserts the canonical route/component graph;
7. run typecheck/lint/build plus targeted route-owner tests;
8. run full repository CI;
9. merge only when green;
10. verify exact merged-main Cloudflare smoke;
11. write P0-UIA-01 closure checkpoint before selecting another product-quality package.

## 9. UIA-01 non-scope

Do not change in UIA-01:

- visual design/redesign;
- curriculum/content counts;
- progression/readiness/mastery/evidence;
- activity mechanics;
- Completion/Share semantics;
- Petualangan Uang structure/progression;
- parent auth/session behavior;
- database/schema;
- Shop;
- character assets/provenance;
- narration quality/provider behavior.

UIA-01 is architecture/ownership cleanup only.

## 10. Resume instruction for another agent/chat

Use this exact instruction:

```text
Resume Mainlagi from docs/P0_UIA01_PREEXECUTION_SAFE_CHECKPOINT_2026-10-02.md.
Do not redo JM-00–JM-18 or the post-JM ownership audit.
Verify current main still descends from b07c293a97b6cc5c71421d296ac350d7dd9cd23b.
Then execute P0-UIA-01 only: retire/isolate route-dead duplicate UI owners, preserve active fallback/Bermain/shell/rewards/parent owners, add permanent route-owner regression, run full CI, merge only when green, verify exact merged-main Cloudflare smoke, and document closure.
Do not touch Shop, character production, curriculum/progression/mastery/evidence, World semantics, schema, or visual redesign.
```

If current main has advanced since this checkpoint, rebase/trace from the new main first. Do not blindly replay patches.
