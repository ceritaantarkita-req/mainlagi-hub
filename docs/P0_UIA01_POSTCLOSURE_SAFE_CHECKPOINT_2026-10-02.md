# SAFE CHECKPOINT — Post P0-UIA-01 canonical owner retirement

Date: **2 October 2026**  
Status: **SAFE REMOTE RESUME CHECKPOINT**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## 1. Exact current source of truth

```text
current main:            6d3895080b9eb1e0369d56a732c111a2cd899142
UI re-baseline audit:    PR #434
audit merged main:       b07c293a97b6cc5c71421d296ac350d7dd9cd23b
audit PR CI:             #2377 / run 36980535324 — FULL SUCCESS
audit main CI:           #2378 / run 36981780636 — FULL SUCCESS
audit Cloudflare smoke:  SUCCESS

UIA-01 pre-checkpoint:   PR #435 / main 1644377302fbc1d3c8f4dd057d963957f89e0cf1

UIA-01 runtime:          PR #436
runtime final head:      8149522d9a3b2f73c0a61609f115f214806b9d35
runtime merged main:     cd5c530d45a472ac2eb3f4efce740a2ae4654076
runtime PR CI:           #2385 / run 36991457873 — FULL SUCCESS
runtime main CI:         #2386 / run 36992697294 — FULL SUCCESS
runtime Cloudflare:      SUCCESS

UIA-01 closure docs:     PR #437
closure docs main:       6d3895080b9eb1e0369d56a732c111a2cd899142
closure main CI:         #2388 / run 36995564774 — FULL SUCCESS
closure Cloudflare:      SUCCESS
```

The checkpoint is anchored to the **closure docs main** SHA above. If later work introduces a canonical-owner regression, the **runtime recovery baseline** is `cd5c530d45a472ac2eb3f4efce740a2ae4654076`.

## 2. What is closed

### Journey Map

Phase C — Canonical Journey Map System is final closed through **JM-00–JM-18**.

Do not create JM-19 by routine continuation.

### Post-JM UI architecture audit

The post-JM canonical UI ownership audit is complete.

Current canonical ownership remains:

- public root -> `HomePage` under `AppShell`;
- child shell/navigation -> `WorldChildShell -> PlayroomShell`;
- child home -> `Batch14WorldHome`;
- child select -> `LearningPlatform.ChildSelectScreen -> CloudChildSelectScreen`;
- all 9 canonical subject routes -> `ChildLearningPathViews.SubjectScreen -> BelajarJourneyMap`;
- non-Drawing canonical Stage -> `ChildLearningPathViews.StageScreen`;
- Menggambar Stage -> `DrawingStageScreen`;
- activity route -> specialized dispatcher with finite fallback through `WorldActivityScreen -> ChildLearningPlatform.ActivityScreen`;
- Bermain -> `ChildLearningPlatform.GamesScreen`;
- rewards -> `WorldRewardsScreen`;
- Petualangan Uang -> `world-v2/MoneyWorldExperience` catalog/map/Stage owners;
- parent root/children -> cloud aliases through `LearningPlatform`;
- parent shell/detail/progress/report/certificates/settings remain intentionally split across their verified owners.

The old WS-13 conclusion `SubjectScreen -> ActivityGallery` is historical and must not be restored.

### P0-UIA-01

P0-UIA-01 is **CLOSED / MERGED / LIVE VERIFIED**.

Retired:

- duplicate child-home owners;
- duplicate child-select owner;
- retired legacy child library/subject/stage presentation cluster;
- duplicate child rewards owner;
- duplicate parent overview owner;
- duplicate parent children listing;
- old route-dead World presentation owners:
  - `MainlagiWorldHome`;
  - `WorldSubjectScreen`;
  - `WorldStageScreen`;
  - `WorldLearnEntry`;
- unreachable canonical-subject `ActivityGallery`;
- `ActivityGallery.module.css`;
- retired duplicate barrel exports/imports.

Permanent regression:

```text
test:learning:ui-owners
scripts/run-canonical-ui-owner-tests.mjs
```

This regression is part of the blocking learning gate.

## 3. Active owners that must remain

Do not remove as “legacy” without a new explicit migration:

- `ChildLearningPlatform.ActivityScreen` — finite activity fallback;
- `ChildLearningPlatform.GamesScreen` — Bermain route owner;
- `WorldChildShell`;
- `WorldActivityScreen`;
- `WorldRewardsScreen`;
- `CloudChildSelectScreen`;
- `CloudParentOverviewScreen`;
- `CloudParentChildrenScreen`;
- `ChildLearningPathViews.SubjectScreen`;
- `ChildLearningPathViews.StageScreen`;
- `DrawingStageScreen`;
- Petualangan Uang world-v2 catalog/map/Stage owners;
- verified parent shell/detail/progress/report/certificates/settings owners.

## 4. Hard boundaries after UIA-01

Do **not** immediately start another broad UI refactor.

Do not change under the next audit package:

- visual design;
- curriculum;
- Stage/activity membership;
- readiness/evidence/mastery;
- activity mechanics;
- Completion/Share;
- World progression/content;
- parent auth/session;
- database/schema;
- Shop runtime;
- character assets;
- narration/voice behavior.

The final five-character home hero remains blocked until approved/provenance-safe character assets exist.

English voice quality beyond already-closed entry latency remains separate P1 work.

Physical-device acceptance remains a separate quality gate.

## 5. Governance state

Superseded PRs explicitly closed in the post-JM/UIA governance pass:

- #424 — stale JM-07–JM-11 docs branch;
- #429 — stale pre-final JM-16 branch;
- #395 — stale SI-08 docs closure branch.

Intentionally not merged/closed by UIA-01:

- #359 — Mainlagi Shop gated commerce foundation;
- #360 — child-surface visual/navigation revision with explicit Shop dependency/history.

Do not assume other historical open PRs are safe to merge or safe to close merely because they are old. Audit each separately before action.

## 6. Next authorized work

Next action is **READ-ONLY**:

```text
P0-OPEN-01 — remaining backlog / open-workstream audit
```

Priority order:

1. fresh-audit **Shop PR #359** against current `main@6d3895080b9eb1e0369d56a732c111a2cd899142`;
2. fresh-audit **child-surface PR #360** against current main and the actual current Shop state;
3. determine whether #360 should be rebased, reconstructed from its verified diff, superseded, or remain blocked;
4. inspect other historical open PRs only as a separate governance pass; do not bulk-close them;
5. only after the read-only audit, authorize a concrete implementation package.

No Shop migration, no Shop production enablement, no child-surface rebase/merge, and no new broad UI implementation is authorized by this checkpoint.

## 7. Safe resume instruction

If a future agent/chat resumes from this checkpoint:

1. fetch current `main`;
2. verify it contains `6d3895080b9eb1e0369d56a732c111a2cd899142` or a known later descendant;
3. read:
   - `docs/CURRENT_STATE.md`;
   - `docs/P0_CANONICAL_UI_ARCHITECTURE_REBASE_AUDIT_2026-10-02.md`;
   - `docs/P0_UIA01_CANONICAL_OWNER_RETIREMENT_FINAL_CLOSURE_2026-10-02.md`;
   - this checkpoint;
4. do not repeat Journey Map or UIA-01 work;
5. begin with the read-only audit of #359 and #360;
6. do not claim local laptop synchronization unless it has been separately verified.

This checkpoint is remote GitHub truth; local workstation sync is outside the guarantees of this record.
