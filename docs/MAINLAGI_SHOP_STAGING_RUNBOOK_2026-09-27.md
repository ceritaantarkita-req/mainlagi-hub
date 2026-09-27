# Mainlagi Shop — Batch 05 staging database runbook

Status: **prepared, remote staging not yet executed**.

This runbook is for **non-production Supabase staging only**. It does not authorize
changing the canonical production project, enabling Shop sales, configuring live
providers, or merging PR #359.

## Preconditions

Before any remote staging mutation:

- identify the staging project/project-ref explicitly;
- verify it is not the canonical production Supabase project;
- record the current staging migration list and Shop-table presence;
- record baseline security and performance advisors;
- keep `SHOP_SALES_ENABLED=false`;
- keep provider keys in sandbox/test mode only;
- retain Batch 04 operational-policy blockers as launch blockers even when Batch 05
  is explicitly authorized for staging work.

The canonical production project documented by Mainlagi is
`estvtgflwkebomsqlolv`. **Do not use that project as the Batch 05 target.**

## Migration order

Apply the repository migration chain exactly in filename order. The Shop tail is:

```text
0051_world_evidence_advisor_hardening.sql
20260926195237_shop_foundation.sql
20260927051000_shop_admin_workflow.sql
```

Do not rewrite historical migrations to make staging pass. If a historical/current
migration conflict is discovered, stop and fix forward with a reviewed additive
migration.

## Pre-apply evidence

Capture:

1. project ref/name and environment purpose;
2. full remote migration list;
3. public table list;
4. security advisor results;
5. performance advisor results;
6. whether any `shop_%` table/function already exists.

If an unexpected Shop schema already exists without the repository migration
history, stop rather than guessing whether it is safe to overwrite.

## Apply

Apply only missing migrations, in order, using Supabase migration semantics. Do
not execute repository migration DDL through an ad-hoc untracked SQL path.

After apply, run:

```text
docs/data/MAINLAGI_SHOP_STAGING_VALIDATION_2026-09-27.sql
```

Expected seed/readiness state before real owner product data is entered:

- 9 Shop products;
- 79 total physical `on_hand`;
- 26 approved runtime media rows;
- 9 products still Draft/unverified;
- 0 public Active Shop products;
- every public `shop_%` table has RLS enabled;
- browser roles cannot read PII/order/inventory-ledger tables;
- browser roles cannot execute sensitive Shop RPCs.

## Concurrency acceptance

The final Batch 05 gate requires **real PostgreSQL**, not PGlite alone. Exercise at
least these races with independent concurrent clients:

1. two checkouts competing for the same final available unit;
2. duplicate checkout retry on one converted cart;
3. payment settlement delivered twice;
4. payment settlement racing order expiry/release;
5. owner inventory adjustment racing checkout reservation;
6. shipment claim racing a duplicate owner shipment request.

Acceptance rules:

- no oversell;
- no negative `reserved`;
- no double stock consumption;
- duplicate settlement is idempotent;
- late/ambiguous settlement cannot silently consume released inventory;
- inventory adjustment cannot take `on_hand` below `reserved`;
- only one shipment claim survives.

Use disposable staging test rows/accounts. Clean them up only after preserving
evidence of the assertions.

## Security validation

After DDL:

- run Supabase security advisors;
- run Supabase performance advisors;
- verify all advisor findings that touch Shop tables/functions;
- verify direct anon/authenticated mutation is denied;
- verify sensitive RPC EXECUTE is service-role-only;
- verify product public RLS remains fail-closed until
  `status='active' AND facts_verified AND media_approved`;
- verify owner/admin application routes still perform their own authorization even
  though server-side DB access uses the service role.

An advisor warning is not automatically waived. Record why it is fixed,
non-applicable, or deliberately accepted.

## Recovery / rollback

Batch 05 prefers **recreate/reset of disposable staging** over hand-written reverse
DDL.

If a migration fails or creates an unexpected schema:

1. stop all further Shop staging actions;
2. preserve the exact error, failing migration and remote migration state;
3. reset/recreate the staging database/branch from the known production baseline,
   when the selected Supabase staging mechanism supports that safely;
4. fix the repository migration **forward**;
5. rerun the complete migration-chain test and staging apply from a clean baseline.

Do not create a manual production rollback migration from a failed staging attempt.
Production remains untouched until the separate production launch gate.

## Current connectivity blocker

At the 2026-09-27 Batch 05 checkpoint, the connected Supabase tool returned **zero
accessible projects**. Therefore:

- no remote migration was applied;
- no remote table/RLS/RPC mutation occurred;
- no Supabase advisor was run against staging;
- no real-PostgreSQL concurrency test was claimed.

Batch 05 remains open until a specific non-production Supabase target is accessible.
