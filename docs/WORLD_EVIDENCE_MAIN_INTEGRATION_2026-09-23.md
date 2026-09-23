# Mainlagi World → Evidence — Current Main Integration — 23 September 2026

Status: **RELEASE CANDIDATE GREEN / DRAFT PR / NOT MERGED / NOT CLOUDFLARE-DEPLOYED**

This record documents the integration of the validated World evidence stack with the actual current `main` baseline without silently merging or deploying production.

## 1. Integration lineage

Current `main` used as integration base:

```text
17b9ca79749e171f62d3adb86df494badef11732
docs: close semantic P0 human review gate (#306)
```

World/live-DB stack head:

```text
94062af9944943e5f82011087bff9e4dfd12e2b7
checkpoint/world-evidence-live-db-final-closure-green-20260923
CI #1583 / run 35886307365 — full success
```

Common ancestor:

```text
709e2b7d3e529cf37f10a05e9c9dc92884e0a781
```

Integration branch:

```text
release/world-evidence-integration-20260923
```

Two-parent integration merge commit:

```text
e4999265033b0263e906c2fe287fc08d09bde0bc
```

Parents:

```text
1. 17b9ca79749e171f62d3adb86df494badef11732  current main
2. 94062af9944943e5f82011087bff9e4dfd12e2b7  World/live-DB stack
```

The integration branch is ahead of that main baseline and behind by zero commits.

## 2. PR topology

Internal stack-to-integration PR:

```text
PR #311
feature/world-evidence-live-db-hardening-20260923
→ release/world-evidence-integration-20260923
```

PR #311 is merged **only into the integration branch** through the two-parent integration commit above. It is not a main/production merge.

Release-candidate PR:

```text
PR #312
release/world-evidence-integration-20260923
→ main
Draft / open / mergeable
```

PR #312 is the only active release path for this integrated state.

## 3. Conflict audit and resolution

Exactly seven files were modified on both sides and required explicit resolution:

```text
docs/CHANGELOG.md
docs/CURRENT_STATE.md
docs/KNOWN_LIMITATIONS.md
docs/PROJECT_STATE_SYNC_2026-09-20.md
docs/README.md
package.json
scripts/run-mobile-route-browser-tests.mjs
```

Resolution principles:

- current-main semantic P0 / English narration / learning-illustration truth stays authoritative;
- World evidence implementation and live-DB records are added without replacing those newer main facts;
- historical World design checkpoints remain historical rather than rewritten;
- package/test chains keep both main-only quality gates and World-only evidence gates;
- browser QA keeps both learning visual containment and World Stage/Scene responsive coverage.

## 4. Code-sensitive merge verification

Merged `package.json` retains:

- English narration quality regression;
- narration asset/pilot/review validators;
- semantic learning-illustration validators/review gates;
- World money tests;
- World cloud tests;
- source-aware World evidence tests;
- Stage 8 activation tests.

Merged mobile browser QA retains:

- shared learning visual containment assertions;
- 1280px Math activity-gallery containment;
- World Petualangan Uang stage checkpoints;
- World Scene responsive matrix;
- final Stage 8 subtraction/finale coverage.

## 5. Integrated acceptance checkpoint

Immutable integration code checkpoint:

```text
checkpoint/world-evidence-main-integration-green-20260923
@ e4999265033b0263e906c2fe287fc08d09bde0bc
```

Exact-head acceptance:

```text
Mainlagi TV V3 CI #1584
run 35892514511
conclusion: success
```

PASS matrix:

- Quality gate (Ubuntu), including combined engine tests, quality audits, simulations and Batch 17 final acceptance;
- Windows compatibility, including combined engine tests;
- Production build;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium), including accessibility/lazy-load matrix and permanent visual baseline.

Artifacts:

```text
mobile-route-qa-screenshots — 10766080229
activity-quality-audit      — 10765857108
gameplay-distribution-audit — 10765862064
```

Production smoke is intentionally skipped for this Draft PR because the integration commit is not on `main`.

## 6. Database state

Canonical Supabase project remains:

```text
estvtgflwkebomsqlolv
mainlagi-hub
ap-southeast-1
ACTIVE_HEALTHY
```

Migrations `0047`–`0051` are already live and verified.

Database closure invariants remain:

```text
World progress rows                 0
supplemental World evidence rows    0
mastery rows                        26
canonical evidence rows             51
Belajar progress rows               3
achievement rows                    10
certificate rows                    0
```

The integration wave performs no additional database write.

## 7. Authorized World scope

This release candidate contains exactly one activated supplemental evidence mapping:

```text
money-s08-activity-02
money-stage-08-final-festival
tap_choice
assessment = assessed
content version = money-world-s08-subtraction-v2-assessed
skill = math.operation.subtraction.within_10
role = supplemental
```

Still not authorized:

- Stage 2 price comparison evidence activation;
- any second World mapping;
- canonical age-8 evidence;
- direct reuse of `record_learning_attempt(...)`;
- World-driven Belajar stars/completion/certificate effects;
- character-development restart.

## 8. Release boundary

The integrated state is now technically green but still **not production application truth**.

Current boundary:

```text
integration code:            GREEN
PR #312:                     Draft / unmerged
main:                        still production source of truth
Cloudflare exact-SHA smoke:  pending main merge/deploy
controlled Stage 8 live evidence write: pending app deploy
```

Do not fabricate a child/evidence write merely to prove the path before the reviewed application runtime is actually deployed.

The next separately authorized release step is:

```text
final PR #312 review
→ merge through protected main flow
→ merged-main full CI
→ exact-SHA Cloudflare production smoke
→ controlled authorized Stage 8 evidence verification
→ final production docs closure
```
