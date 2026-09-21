# Cloud Learning Analytics Pagination + Failure-State Closure — 21 September 2026

Status: **FULLY CLOSED / MERGED / LIVE VERIFIED**

## 1. Problem that was verified

A fresh audit reproduced two reporting-integrity problems in the parent learning analytics path:

1. cloud attempts were read with a fixed `.limit(500)`, so a child with a longer history could lose newer attempts from the assembled report;
2. skill evidence had a fixed `.limit(2000)`, creating the same completeness risk for long histories;
3. when an authenticated cloud read failed, the client hook could silently substitute local browser analytics, making stale or empty local data look like a successful cloud report.

The 500-attempt issue was reproduced against the real production module contract before the fix.

## 2. Production fix

Implementation PR: **#267**  
Merged main: `89a2bc629e8535bddbf2ab78ae1990a063f0f361`

The merged implementation:

- replaces fixed analytics caps with paged `.range(from, to)` reads until the server returns an empty page;
- follows actual returned offsets, so pagination remains complete even when the server returns fewer rows than requested;
- reads attempts and evidence under the authenticated `account_id` + `child_key` boundary;
- freezes each multi-page read to a common `snapshotAt` timestamp;
- uses stable secondary ordering for paged rows;
- fails the whole analytics read closed if a later page fails instead of publishing a partial report;
- sorts the assembled attempt history deterministically before deriving summary timestamps;
- distinguishes intentional guest/local play from authenticated cloud failure;
- adds explicit `loading`, `ready`, and `unavailable` states;
- shows a visible “Laporan belajar belum tersedia” state plus “Coba lagi” instead of silently substituting local data;
- retries on reconnect and explicit retry;
- invalidates stale async requests across refresh/auth transitions so an older account/read cannot overwrite a newer result.

No learning schema, migration, mastery formula, evidence rule, progression rule, curriculum, activity identity, or character/background behavior changed.

## 3. Regression coverage

New blocking regression:

```text
scripts/run-cloud-analytics-tests.mjs
npm run test:learning:cloud-analytics
```

Coverage includes:

- **1,201 attempts** returned completely;
- **3,603 skill-evidence rows** returned completely;
- requested page size larger than a simulated server cap;
- later-page failure returns unavailable instead of partial analytics;
- account/child isolation;
- reconnect recovery;
- stale-request protection;
- authenticated session failure does not fall back to guest localStorage;
- explicit guest play remains local.

The regression is wired into the aggregate `npm run test:learning` suite.

## 4. Verification

Local pre-PR checks passed:

- `npm run typecheck`;
- `npm run lint` with 0 errors and the two existing unrelated warnings;
- cloud analytics regression;
- learning isolation;
- awards/report tests;
- Batch 15 scaling;
- Batch 16 security.

PR CI:

```text
PR:        #267
Head:      0acd61a966b6325c03debc7a608d9912f12b1015
CI:        #1204 / run 35620911905
Result:    full success
```

Merged-main verification:

```text
Main:      89a2bc629e8535bddbf2ab78ae1990a063f0f361
CI:        #1205 / run 35621724090
Result:    full success
Cloudflare exact production smoke: PASS
```

The merged-main matrix passed Ubuntu quality, Windows compatibility, Cloudflare/OpenNext production build, Chromium mobile-route/accessibility/lazy-load QA, permanent visual product baseline, dependency audit, secret-history scan, and the exact production smoke.

## 5. Closure truth

The previously reproduced fixed-cap / silent-fallback reporting defect is **closed** on production main.

Future analytics changes must preserve:

- complete paged reads;
- account + child isolation;
- fail-closed behavior for partial cloud reads;
- explicit unavailable UI for authenticated cloud failure;
- stale-request protection;
- the `test:learning:cloud-analytics` regression gate.

## 6. Remaining work outside this closure

This closure does **not** mark every project audit item complete.

Separate follow-up tracks remain:

- repository governance: verify/enforce the secret-history scan as a required merge status check where repository branch-protection permissions allow;
- real-device/accessibility acceptance;
- Iqro expert review;
- product-UX character work: Naya candidate first, then Gian and Zia through the already-live fail-closed asset/provenance pipeline.

These tracks must not reopen or dilute the analytics integrity fix.
