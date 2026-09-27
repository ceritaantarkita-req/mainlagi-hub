# Mainlagi Shop — Batch 05 zero-cost staging database runbook

Status: **Batch 05 zero-cost PostgreSQL staging gate completed**.

This runbook replaces the previously proposed paid Supabase development branch.
The owner explicitly declined paid branching and approved a zero-cost path:

1. real PostgreSQL 17 in GitHub Actions;
2. the same gate may be run locally with Docker/PostgreSQL;
3. production Supabase stays untouched until the later production release gate.

This does **not** waive Batch 04 policy blockers, authorize provider production
actions, enable Shop sales, merge PR #359, or authorize a production migration.

## Canonical production boundary

Canonical production Supabase project:

```text
estvtgflwkebomsqlolv
```

It is a read-only baseline during Batch 05. Do not run Shop migrations, concurrency
fixtures, destructive tests, or staging data against that project.

Read-only baseline captured before Shop is live:

- project status: `ACTIVE_HEALTHY`;
- production migration count: 51, through
  `0051_world_evidence_advisor_hardening`;
- zero Supabase development branches;
- security advisor: two existing authenticated SECURITY DEFINER warnings
  (`record_learning_attempt`, `save_world_progress`) plus leaked-password
  protection disabled;
- performance advisor: 16 existing unused-index INFO findings;
- no Shop-specific hosted finding can exist yet because Shop migrations are not in
  production.

## Repository migration chain

The PR branch contains 53 migrations:

```text
0001 ... 0051
20260926195237_shop_foundation.sql
20260927051000_shop_admin_workflow.sql
```

Historical migrations must not be rewritten merely to make a test pass. Fix
forward with an additive migration if a real incompatibility is discovered.

Two complementary gates exist:

- `scripts/run-shop-migration-chain-tests.mjs` — fast PGlite full-chain schema/RLS
  preflight;
- `scripts/run-shop-postgres-staging-tests.sh` — real PostgreSQL 17 full-chain,
  security and multi-session concurrency gate.

## Required GitHub Actions gate

Workflow job:

```text
Shop PostgreSQL staging gate
```

The job launches an ephemeral `postgres:17` service, applies the complete
repository migration chain, and destroys that database with the runner. No paid
Supabase branch is created.

The real-PostgreSQL gate must verify:

- 9 seeded Shop products;
- total initial `on_hand = 79`;
- 26 approved runtime media rows;
- 0 Active products immediately after migrations;
- RLS enabled on every public `shop_%` table;
- sensitive Shop RPCs deny `anon` and `authenticated` EXECUTE and allow
  `service_role`;
- anonymous users cannot see Draft products;
- anonymous users cannot read order/PII tables;
- authenticated browser role cannot execute owner product-admin RPCs.

## Real multi-connection concurrency gate

The PostgreSQL staging script uses independent `psql` sessions and must pass all
six races:

1. two checkouts compete for the final available unit — exactly one succeeds;
2. duplicate checkout retry returns the same order and creates no second order;
3. duplicate payment settlement consumes stock exactly once;
4. paid settlement racing expiry either settles safely or enters manual attention
   after release, never silently overselling;
5. inventory adjustment racing checkout preserves
   `0 <= reserved <= on_hand`;
6. duplicate shipment creation claim produces one lease winner.

Acceptance invariants:

- no oversell;
- no negative physical or reserved inventory;
- no double stock consumption;
- payment settlement is idempotent;
- released inventory cannot be silently consumed by a late payment;
- manual stock reduction cannot cross below reserved stock;
- only one concurrent shipment claim owns the active creation lease.

## Free local reproduction

GitHub Actions is the canonical zero-cost gate. A developer may reproduce it
locally with Docker.

Example from WSL/Git Bash/Linux with Docker running:

```bash
docker run --rm -d \
  --name mainlagi-shop-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mainlagi_shop_ci \
  -p 54329:5432 \
  postgres:17

export DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54329/mainlagi_shop_ci"
bash scripts/run-shop-postgres-staging-tests.sh

docker stop mainlagi-shop-postgres
```

This local database is disposable test infrastructure. Never point
`DATABASE_URL` at the canonical production Supabase database.

When the user's Remote Desktop device is unavailable, GitHub Actions remains the
authoritative execution environment for this gate.

## Hosted Supabase advisors under the zero-cost path

A paid cloud staging branch is **not** required for Batch 05.

Because Shop tables/functions do not yet exist in production, Supabase cannot
produce Shop-specific hosted advisor findings before the production migration.
Therefore the zero-cost Batch 05 acceptance uses:

- full migrations on PostgreSQL 17;
- explicit RLS and role privilege assertions;
- PGlite + PostgreSQL transaction tests;
- read-only pre-Shop production advisor baseline.

Shop-specific hosted Supabase security/performance advisors move to the later
production-pre-activation gate: after Shop migrations are applied with
`SHOP_SALES_ENABLED=false`, review advisors **before sales is enabled**.

An advisor warning at that later gate must be fixed, shown non-applicable, or
explicitly recorded; it must not be silently ignored.

## Recovery

The CI/local PostgreSQL staging database is disposable.

If the migration or concurrency gate fails:

1. preserve the exact failing migration/test output;
2. do not touch production;
3. fix the repository forward;
4. rerun against a fresh PostgreSQL 17 database;
5. close Batch 05 only after the full clean run passes.

No manual reverse migration should be created merely to undo a failed disposable
test database.

## Batch 05 closure evidence

Batch 05 is **DONE**.

Recorded implementation evidence:

- implementation SHA:
  `e8d0b57dfbc286545d25107bc75dd1c36e4d3786`;
- Mainlagi TV V3 CI **#1809**, run id `36300966067`;
- PGlite full-chain preflight: PASS;
- PostgreSQL 17 full 53-migration gate: PASS;
- RLS/RPC/browser-role assertions: PASS;
- all six real multi-session race cases: PASS;
- paid Supabase development branch: **not created**;
- production migration/mutation: **not performed**.

The first PostgreSQL attempt correctly exposed invalid test fixtures rather than a
Shop runtime defect: the owner profile fixture needed a matching `auth.users`
row, the synthetic category needed a canonical Shop category, and product media
paths needed the canonical `/shop/products/*.webp` shape. Those fixtures were
corrected and the clean exact implementation run passed.

No paid Supabase branch is required.

Production remains unchanged and `SHOP_SALES_ENABLED` remains disabled.
Shop-specific hosted Supabase advisor review remains deferred to the later
production-pre-activation checkpoint, after Shop migrations are applied with sales
still disabled.
