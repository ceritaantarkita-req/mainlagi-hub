# P0-UIA-01 — Canonical owner retirement / legacy isolation final closure

Date: **2 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Baseline before execution: `main@1644377302fbc1d3c8f4dd057d963957f89e0cf1`

Runtime PR: **#436**  
Final PR head: `8149522d9a3b2f73c0a61609f115f214806b9d35`  
PR CI: **#2385 / run `36991457873` — FULL SUCCESS**  
Merged main: `cd5c530d45a472ac2eb3f4efce740a2ae4654076`  
Merged-main CI: **#2386 / run `36992697294` — FULL SUCCESS**  
Production smoke: **SUCCESS — exact merged-main SHA**

## 1. Scope closed

P0-UIA-01 retired route-dead duplicate UI owners and added a permanent canonical-owner regression without changing product behavior.

Removed or retired:

- `ChildLearningPathViews.ChildHomeScreen`;
- `ChildLearningPlatform.ChildSelectScreen`;
- `ChildLearningPlatform.ChildHomeScreen`;
- retired legacy child library/subject/stage presentation cluster inside `ChildLearningPlatform`;
- duplicate `ChildLearningPlatform.RewardsScreen`;
- `ParentLearningPlatform.ParentOverviewScreen`;
- duplicate `ParentLearningPlatform.ParentChildrenScreen`;
- old World presentation exports:
  - `MainlagiWorldHome`;
  - `WorldSubjectScreen`;
  - `WorldStageScreen`;
  - `WorldLearnEntry`;
- unreachable canonical-subject `ActivityGallery` component;
- unused `ActivityGallery.module.css`;
- retired duplicate barrel exports and imports associated with the above.

## 2. Active owners explicitly preserved

UIA-01 did **not** delete broad files by filename. These active owners remain:

- `ChildLearningPlatform.ActivityScreen` — finite activity fallback;
- `ChildLearningPlatform.GamesScreen` — canonical Bermain route owner;
- `WorldChildShell` — active child shell adapter;
- `WorldActivityScreen` — active activity fallback bridge;
- `WorldRewardsScreen` — active rewards route owner;
- `CloudChildSelectScreen` alias via `LearningPlatform.ChildSelectScreen`;
- `CloudParentOverviewScreen` alias via `LearningPlatform.ParentOverviewScreen`;
- `CloudParentChildrenScreen` alias via `LearningPlatform.ParentChildrenScreen`;
- `ChildLearningPathViews.SubjectScreen` — canonical 9-subject Journey Map entry;
- `ChildLearningPathViews.StageScreen` — canonical non-Drawing Stage owner;
- `DrawingStageScreen` — canonical Menggambar Stage owner;
- Petualangan Uang `world-v2/MoneyWorldExperience` catalog/map/Stage owners.

## 3. ActivityGallery decision

The old subject `ActivityGallery` fallback is now removed.

Reason:

- JM-18 places all nine canonical subject IDs in `JOURNEY_MAP_SUBJECTS`;
- no current canonical subject route reaches the fallback;
- retaining the dead gallery would create an attractive false owner for future agents;
- Browse All membership now belongs to the canonical Journey Map contract.

Historical gallery documentation remains provenance only and must not be treated as current route ownership.

## 4. Permanent regression

UIA-01 adds:

```text
test:learning:ui-owners
```

implemented by:

```text
scripts/run-canonical-ui-owner-tests.mjs
```

and wired into the blocking learning gate.

The regression locks:

- canonical child-select alias ownership;
- canonical child home ownership;
- canonical 9-subject Journey Map ownership;
- exact canonical Stage owners;
- cloud parent aliases;
- active Bermain/activity fallback/shell/rewards owners;
- absence of retired duplicate owners;
- absence of restored `ActivityGallery`;
- World v2 ownership boundaries.

Supporting World source assertions were updated only where canonical ownership moved; World runtime/progression semantics remain unchanged.

## 5. Non-scope preserved

UIA-01 did not change:

- visual design;
- curriculum or Stage/activity membership;
- readiness / evidence / mastery;
- activity mechanics;
- Completion / Share;
- World progression or content;
- parent auth/session;
- database/schema;
- Shop;
- character assets;
- narration/voice behavior.

## 6. Governance cleanup

Historical/superseded PRs closed during the post-JM/UIA governance pass:

- #424 — stale JM-07–JM-11 docs branch;
- #429 — stale pre-final JM-16 branch;
- #395 — stale SI-08 docs closure branch, superseded by current SI-09/SI-11 authority.

Still intentionally open and **not merged/closed by UIA-01**:

- #359 — Shop gated commerce foundation;
- #360 — child-surface visual/navigation revision with explicit Shop dependency/history.

These require fresh workstream-specific audits against current main before any merge/close decision.

## 7. Current safe checkpoint

```text
main:                cd5c530d45a472ac2eb3f4efce740a2ae4654076
runtime PR:          #436
runtime head:        8149522d9a3b2f73c0a61609f115f214806b9d35
PR CI:               #2385 / run 36991457873 — FULL SUCCESS
merged-main CI:      #2386 / run 36992697294 — FULL SUCCESS
Cloudflare smoke:    SUCCESS — exact merged-main SHA
```

If later cleanup creates a route-owner regression, this SHA is the recovery baseline.

## 8. Next boundary

Do **not** immediately begin another broad UI refactor.

Next action is a **read-only remaining-backlog / open-workstream audit** from the cleaned owner graph.

Priority questions:

1. fresh-audit Shop PR #359 against current main before any commerce continuation;
2. fresh-audit child-surface PR #360 against current main and the current Shop state before any rebase/merge;
3. keep five-character final home hero blocked until approved/provenance-safe character assets exist;
4. keep English voice quality beyond already-closed entry latency as separate P1 work;
5. keep physical-device acceptance as its own quality gate.

No visual redesign is authorized merely because UIA-01 is complete.
