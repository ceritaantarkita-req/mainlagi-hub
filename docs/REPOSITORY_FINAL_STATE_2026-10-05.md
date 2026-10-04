# Mainlagi Hub — Final GitHub Repository State

Date: **5 October 2026 (WIB)**

## Status

**CLEAN / CANONICAL / RECOVERABLE / CI-GATED**

This document is the canonical repository-hygiene closure for `ceritaantarkita-req/mainlagi-hub`.

The cleanup changed repository branch hygiene and historical-ref management only. It did **not** change Mainlagi product runtime, database schema, Shop commercial activation, Belajar, Bermain, World, authentication, Midtrans, Biteship, or owner-product truth.

## Canonical branch model

The repository is now intentionally operated with one permanent branch:

```text
main
```

All product work must start from current `main` on a short-lived task branch, go through pull request + blocking CI, then disappear after merge.

Permanent historical `agent/*`, `docs/*`, `feature/*`, `checkpoint/*`, preview, repair, or temporary branches are no longer part of the operating model.

## Cleanup result

Before the cleanup workflow ran, the repository contained:

```text
528 remote branch refs
```

The cleanup workflow then:

- required **0 open pull requests** before deletion;
- fetched all branch and tag refs;
- captured a branch manifest with every branch name, tip SHA and commit timestamp;
- created and verified a full Git bundle;
- published the recovery artifacts as a GitHub Release;
- deleted **527 non-main branch refs**;
- verified that the only remaining branch was `main`.

The cleanup job completed **SUCCESS** in workflow:

```text
One-time repository branch cleanup 2026-10-04
run 37208504551
job: Archive branch refs and keep only main
```

The exact cleanup-start main was:

```text
be26d25d2fbd3f4ee799f7464b521aaccbba67da
```

The repository subsequently advanced through metadata-repair commits only; no product/runtime behavior changed during those repository-hygiene follow-ups.

## Historical recovery archive

Nothing important was discarded without a recovery path.

GitHub Release tag:

```text
repo-branch-archive-20261004-precleanup
```

The release contains exactly these recovery assets:

```text
mainlagi-branch-manifest-20261004.tsv
mainlagi-branches-precleanup-20261004.bundle
mainlagi-branches-precleanup-20261004.sha256
```

Verified sizes at closure:

```text
manifest: 59,553 bytes
bundle:   59,949,227 bytes
sha256:   116 bytes
```

The release metadata was repaired and verified successfully by:

```text
Repair branch archive release metadata
run 37222348367
SUCCESS
```

The bundle is recovery-only. Historical branch tips should not be reintroduced into normal development unless a specific recovery need is explicitly identified and audited first.

## Pull-request cleanup

All stale open pull requests discovered during the branch audit were reviewed and closed rather than merged into modern `main`.

At the stable cleanup boundary before this final docs PR:

```text
open pull requests: 0
remote branches:    1
canonical branch:   main
```

Historical superseded/unmerged PRs remain visible in GitHub history for auditability even though their branch refs were removed.

## Permanent branch hygiene

The permanent workflow:

```text
.github/workflows/branch-hygiene.yml
```

deletes same-repository PR head branches automatically after a successful merge.

It deliberately does **not** delete arbitrary open work, forks, the default branch, or unmerged branches merely because they exist.

This prevents the previous hundreds-of-branches accumulation from returning while keeping active work safe.

## One-time workflow cleanup

The one-time bulk cleanup workflow was removed after successful execution.

The one-time archive-release repair workflow is also removed by this final closure because its repair and verification already passed.

Only the permanent branch-hygiene mechanism remains.

## Repository safety evidence

Repository cleanup was performed through normal pull requests and blocking CI.

Key evidence:

```text
PR #473 — branch archive + bulk cleanup bootstrap
PR CI #2459 / run 37207747982 — FULL SUCCESS
merged main: be26d25d2fbd3f4ee799f7464b521aaccbba67da
merged-main CI #2460 / run 37208504553 — FULL SUCCESS
one-time branch cleanup run 37208504551 — SUCCESS

PR #474 — finalize archive metadata tooling
PR CI #2461 / run 37208691662 — FULL SUCCESS
merged main: 4a39884939fee2520ef7c5cfc6b1ab62515be073
merged-main CI #2462 / run 37221332514 — FULL SUCCESS

PR #475 — repair release metadata execution
final PR head: c1aff657c1087f998a112b6b6010334b1356077f
PR CI #2464 / run 37221461056 — FULL SUCCESS
merged main: 64aada8b5b5e44e54cc17405d133c63ea4ff1508
release-repair run 37222348367 — SUCCESS
branch-hygiene run 37222348436 — SUCCESS
```

The normal CI matrix continues to cover:

- full-history secret scan;
- production dependency audit;
- Cloudflare/OpenNext production build;
- Shop PostgreSQL staging/security/concurrency gate;
- Ubuntu quality gate;
- Windows compatibility;
- Mobile route / accessibility / visual QA;
- production smoke on merged `main`.

## Current product boundary

Repository cleanup does not alter the safe product checkpoint.

Mainlagi Shop remains:

```text
public browse/read-only preview: LIVE
child Menu → Shop: parent-gated
SHOP_RUNTIME_ENABLED: false by default
SHOP_SALES_ENABLED: false by default
Shop production DB migration: NOT APPLIED
production Midtrans: OFF
production Biteship: OFF
live checkout/fulfillment: OFF
owner product verification: 0/9
active SKU verification: 0/27
production PII-retention decision: PENDING
```

The existing Shop safe checkpoint and Cloudflare 1102 closure remain authoritative for product/runtime decisions.

## Development rule from now on

Use this branch lifecycle:

```text
main
  ↓
short-lived task branch
  ↓
pull request
  ↓
blocking CI
  ↓
merge
  ↓
automatic head-branch deletion
```

Do not create permanent checkpoint branches. Important checkpoints belong in `docs/` and, when binary/ref recovery is required, in an explicit GitHub Release or tag.

Do not revive historical archived branches as a shortcut around current architecture or current `main`.

## Canonical handoff

For any new agent or developer:

1. start from current `main`;
2. read `docs/CURRENT_STATE.md`;
3. read this document for repository/branch hygiene;
4. read the subsystem-specific closure/checkpoint relevant to the requested work;
5. create one short-lived branch only for the authorized task;
6. merge only after blocking CI is green;
7. allow branch hygiene to delete the merged task branch.

**Repository branch cleanup is closed.**
