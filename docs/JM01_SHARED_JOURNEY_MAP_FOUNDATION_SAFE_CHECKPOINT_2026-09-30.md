# JM-01 — Shared Journey Map data/state foundation safe checkpoint

Date: **30 September 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

## 1. Scope closed

JM-01 adds the shared **Belajar Journey Map data/state foundation** without changing Journey Map visuals.

Implementation:

- `src/lib/learning/journeyMap.ts`
- `scripts/run-journey-map-foundation-tests.mjs`
- `tsconfig.learning-tests.json`
- `package.json`

No subject page, Stage page, activity runtime, Browse All UI, World runtime, database schema, curriculum membership, mastery, evidence, progression, Completion, Share, or creative workspace was redesigned by JM-01.

## 2. Canonical source contract

The JM-01 model does not own a second curriculum.

For Belajar it derives:

- subject metadata from canonical `SUBJECTS`;
- path order and Stage order from canonical `CONTENT_PATHS[*].stageIds` through `getLearningPathsForSubject()`;
- Stage metadata and exact activity membership from canonical `STAGES` / `getStage()`;
- readiness from canonical `getSubjectStageReadiness()`.

Stable direct routes remain:

```text
/child/:childId/subject/:subjectId
/child/:childId/stage/:stageId
/child/:childId/activity/:activityId
```

JM-01 therefore projects existing truth rather than mutating it.

## 3. Shared state model

New public presentation state:

```text
completed
current
open
locked
```

The adapter also preserves the richer canonical readiness state:

```text
locked
in_progress
evidence_needed
ready
```

Important semantic boundary:

- `ready` projects as `completed`;
- `locked` projects as `locked`;
- the first unlocked, non-ready Stage is the current Stage;
- `evidence_needed` remains non-completed and can remain current;
- JM-01 does not fabricate advancement from activity completion alone when evidence readiness is still required.

The map model exposes both presentation booleans and canonical readiness details so later JM visual work cannot accidentally erase progression semantics.

## 4. Shared model shape

The Belajar model now exposes:

```text
subjectId
subjectTitle
subjectShortTitle
subjectEmoji
subjectDescription
subjectHref
pathIds
paths[]
stages[]
currentStageId
completedStageCount
totalStageCount
```

Each Stage projection includes:

```text
id
subjectId
pathId
order
pathOrder
orderInPath
title
subtitle
emoji
href
activityCount
canonicalStatus
statusLabel
reason
presentationState
completed
current
open
locked
completionRatio
completedCount
requiredCount
evidenceReadiness
evidencedSkillCount
assessedSkillCount
```

This is deliberately data/state only. Layout coordinates, map art, Stage popups, bottom sheets, header behavior, and responsive geometry belong to later JM sessions.

## 5. Child-facing English label

The historical internal subject metadata still uses `English`.

JM-01 explicitly projects the child-facing map label as:

```text
Bahasa Inggris
```

with short label:

```text
Inggris
```

The internal subject ID remains `english`; no canonical ID or route changed.

## 6. Drift protection

JM-01 fails closed if canonical registries diverge.

Guards cover:

- duplicate path IDs;
- duplicate Stage IDs across the subject path projection;
- duplicate readiness Stage IDs;
- path Stage count vs readiness Stage count mismatch;
- missing Stage;
- Stage owned by another subject;
- missing readiness row;
- missing canonical path ownership;
- empty child ID.

Unknown subject IDs return no fabricated map.

## 7. Regression contract

Dedicated command:

```text
npm run test:learning:journey-map
```

It is wired into aggregate:

```text
npm run test:learning
```

The dedicated regression proves:

- all **9 subjects** resolve from the canonical registry;
- exact audited Stage order for every subject;
- all **46 Belajar Stages** are projected;
- each subject projection totals exactly **100 activities**;
- fresh profiles expose Stage 1 as current and later Stages as locked;
- direct Stage hrefs remain canonical;
- Bahasa Inggris child-facing label is preserved;
- Math Stage 1 completed without qualifying evidence remains `evidence_needed`, current, and does **not** unlock Stage 2;
- practice-only Coloring Stage 1 can become ready/completed and correctly exposes Stage 2 as current;
- unknown subject and invalid child inputs fail closed.

The learning-test TypeScript compilation also explicitly includes `journeyMap.ts`.

## 8. Exact implementation lineage

```text
JM-00 live-closure main:  bf5753f78c23a93bdd24c793a46c202dc57d5e45

runtime PR:               #411
PR final head:            9ae8ad4e5debcc4fb13738919db94b80d23c4b97
PR CI:                    #2319 / run 36716608349
PR CI result:             required gates SUCCESS

merged runtime main:      756e3bd7bb24588041a3644f08018783e7b3b0f2
merged-main CI:           #2320 / run 36717855442
merged-main result:       SUCCESS
Production smoke:         exact main SHA required by workflow and run SUCCESS
```

The main-push workflow defines Production smoke as a required downstream job after Secret history scan, Quality, Production build, Mobile route QA, Windows compatibility, and Production dependency audit. CI #2320 concluded successfully.

Historical draft PR #410 was intentionally closed without merge after JM-00 closure was squash-merged; the clean branch/PR #411 removed ancestry-only documentation noise and contained the four intended JM-01 files.

## 9. Non-regression boundary

JM-01 did **not**:

- alter the 9-subject / 900-activity / 46-Stage curriculum;
- change Stage membership or ordering;
- change mastery/evidence thresholds;
- change Stage unlock rules;
- change Browse All;
- change subject/Stage/activity routes;
- change Completion/Share;
- change Mewarnai or Menggambar creative workspaces;
- add the Petualangan Uang adapter;
- change World progression;
- add a Journey Map visual;
- add database migrations.

## 10. Next execution boundary

**JM-01 is complete.**

Next Phase C step:

**JM-02 — Immersive Mainlagi Header**

JM-02 may implement:

- Kembali;
- compact Mainlagi logo;
- profile/menu;
- expandable `Belajar | Bermain | World | Shop`;
- desktop, touch, and keyboard behavior.

JM-02 must **not** pull JM-03 Bahasa Inggris map redesign forward. The shared data foundation landed in JM-01 should remain available but visually unused until the relevant map sessions.
