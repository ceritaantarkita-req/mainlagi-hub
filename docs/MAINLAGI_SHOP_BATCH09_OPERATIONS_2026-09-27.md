# Mainlagi Shop — Batch 09 operations, reconciliation and reporting

Status: **IMPLEMENTATION COMPLETE / DETERMINISTIC ACCEPTANCE DONE**.

Full Batch 09 exit is intentionally **not** marked DONE yet because its canonical
exit gate requires scheduled reconciliation to be configured in a real
non-production staging environment and observed. No safe staging origin is
currently recorded for PR #359, and production must not be used as a substitute.

## Accepted functional checkpoint

```text
functional SHA:
c4ee74b2b9e1e6e548d94a78c6ece172b444e8d9

CI:
#1851
run id: 36321030068
conclusion: SUCCESS
```

The run passed:

- full 57-migration chain;
- Shop PostgreSQL staging/security/concurrency gate;
- Shop contract + Batch 08 + Batch 09 acceptance tests;
- typecheck and lint;
- production build;
- production HTTP boundary;
- mobile route QA;
- Windows compatibility;
- dependency audit;
- secret-history scan.

The live Midtrans Sandbox job was intentionally skipped. Production smoke was also
skipped. No production migration, real charge, Shop activation or merge occurred.

## Reconciliation

Additive migration:

```text
supabase/migrations/20260927124000_shop_batch09_operations.sql
```

The runtime now stores per-order reconciliation state plus reconciliation-run
summaries. Payment reconciliation remains authoritative through Midtrans GET
Status. Shipment reconciliation performs a Biteship GET only when its runtime API
configuration exists.

Retry/backoff after unresolved errors is bounded at:

```text
attempt 1 -> 5 minutes
attempt 2 -> 10 minutes
attempt 3 -> 20 minutes
attempt 4+ -> 60 minutes
```

Persistent errors produce auditable `shop.reconciliation.alert` events at
attempts 3, 6 and 12. Error metadata is deliberately sanitized rather than storing
provider response bodies or secrets.

Expired pending orders that never created a provider payment attempt are released
atomically through the existing payment-state RPC after the two-minute expiry
grace. Ambiguous provider failures retain their safe state instead of fabricating
success.

## Scheduled reconciliation

Repository workflow:

```text
.github/workflows/shop-staging-reconcile.yml
```

Prepared cadence:

```text
every 15 minutes
```

It requires:

```text
SHOP_STAGING_URL
SHOP_CRON_SECRET
```

and sends:

```text
POST /api/shop/reconcile
Authorization: Bearer <SHOP_CRON_SECRET>
```

The workflow fails closed if configuration is absent, if the endpoint reports a
blocked reconciliation state, or if provider reconciliation reports failures.

This is currently **prepared but not staging-activated evidence**. Scheduled
workflows execute from the repository's default-branch configuration, while Shop
remains a Draft PR. A safe public non-production Shop origin and matching secret
must exist before this exit gate can close.

## Owner order operations

`/admin/shop/orders` now supports:

- search by order number, customer, email, phone, address, city or postal code;
- payment, fulfillment and order-state filters;
- bounded 25-row pagination;
- customer/address/shipment visibility;
- order-item detail;
- provider + audit timeline;
- reconciliation attempts, next retry and sanitized last-error state;
- explicit owner notes;
- payment reconciliation;
- pack/ship controls already protected by the order state machine;
- audited late-payment stock acceptance;
- audited full-refund physical restock.

Manual recovery never directly edits tables from the browser. It goes through
owner-gated server routes and service-role RPCs.

A verified late payment after reservation release can return to
`processing/unfulfilled` only when the owner explicitly confirms stock
availability. Stock is consumed atomically and recorded in the inventory ledger.

A full provider refund does **not** silently put merchandise back into physical
inventory. Restock requires explicit owner confirmation after the returned item is
physically received/inspected.

## Reporting

`shop_report_v2` reports with Asia/Jakarta date boundaries:

- settled order count;
- retained paid orders;
- retained merchandise;
- retained shipping;
- retained collected value;
- historical gross collected value;
- full-refund count/value;
- manual-review count;
- product-level gross/retained/refunded/manual-review units;
- variant-level gross/retained/refunded/manual-review units;
- current inventory on-hand/reserved/available snapshot.

Any Midtrans state mapped to application `review` is excluded from retained
revenue while still surfaced separately for manual reconciliation. This covers
the current partial-refund/chargeback/ambiguous payment boundary rather than
pretending its accounting is supported.

If the report RPC fails, the admin surface shows an unavailable state. It does not
replace a failed query with fictional zeroes.

## Pagination and PII retention

Account order history now uses 20-row range pagination. Admin order operations use
25 rows per page with server-side filters. The permanent newest-100 assumption is
removed.

Additive retention migration:

```text
supabase/migrations/20260927125000_shop_batch09_pii_retention.sql
```

Retention is **disabled by default** because no owner-approved duration has been
provided. If configured, `SHOP_ORDER_PII_RETENTION_DAYS` must be an integer from
30 through 3650.

Only old terminal orders may be redacted. Orders still requiring attention are
excluded. The redaction is idempotent and audited.

## Deterministic acceptance

Dedicated entry point:

```text
npm run test:shop:batch09
```

It is also part of:

```text
npm run test:shop
```

Acceptance covers expiry cleanup, reservation release, reconciliation due/backoff,
persistent-error alerts, admin search/filter/pagination/detail, owner authorization,
audit timeline, late-payment recovery, explicit full-refund restock, reporting,
manual-review exclusion, retention redaction and inventory invariants.

## Remaining exit blockers

Batch 09 is not fully closed until all of these are real rather than simulated:

1. safe public **non-production** staging Shop origin;
2. GitHub Actions secret `SHOP_STAGING_URL`;
3. `SHOP_CRON_SECRET` in GitHub Actions and the identical value in that staging
   deployment;
4. at least one successful observable scheduled reconciliation run;
5. Batch 07 Biteship API/origin acceptance before shipment reconciliation can be
   called provider-live;
6. owner choice for `SHOP_ORDER_PII_RETENTION_DAYS` before automatic retention
   is enabled.

Production `mainlagihub.my.id` is not a staging substitute for these gates.
`SHOP_SALES_ENABLED` stays false and PR #359 stays Draft.
