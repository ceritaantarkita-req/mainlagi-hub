# Mainlagi Shop — Batch 08 deterministic commerce QA

Status: **DONE for deterministic application/state-machine acceptance**.

Functional acceptance SHA:

```text
1efc77ff4279efca1fcc0e95d8e4a0dba3a73b87
```

CI evidence:

```text
CI #1845
run id: 36318848780
conclusion: SUCCESS
```

This closure does not claim real Biteship Sandbox acceptance. Batch 07 still owns
real rate lookup, shipment creation, authenticated webhook delivery and provider GET
verification after Biteship API/origin configuration is available.

## Scope closed

Batch 08 now has deterministic positive/negative-path evidence for:

- guest-token and authenticated-account order ownership;
- duplicate checkout idempotency;
- stale shipping quote rejection;
- out-of-stock rejection;
- pending, failed, cancelled, expired and late-payment handling;
- paid -> processing -> packed -> shipment_created -> in_transit -> delivered;
- full refund after sale without silently recreating physical stock;
- partial-refund/manual-review hold without fictional restock;
- duplicate shipment event idempotency;
- delayed/out-of-order shipment callback monotonicity;
- wrong provider shipment identity rejection;
- documented Biteship exception states;
- unknown future provider status fail-closed handling;
- exception/manual-review states that cannot be silently cleared by a later success
  callback;
- global inventory invariant `reserved >= 0`, `on_hand >= 0`,
  `reserved <= on_hand`;
- no completed order with a non-paid or non-delivered state.

## Shipment hardening

Additive migration:

```text
supabase/migrations/20260927123000_shop_batch08_state_machine_hardening.sql
```

The migration keeps the original Shop foundation migration unchanged and replaces
only the shipment-application RPC behavior.

Biteship's documented order/tracking states are explicitly classified:

- `confirmed`, `scheduled`, `allocated` -> `shipment_created`;
- `picking_up`, `picked`, `in_transit`, `dropping_off` -> `in_transit`;
- `delivered` -> `delivered`;
- `cancelled`, `on_hold`, `return_in_transit`, `returned`, `rejected`,
  `disposed`, `courier_not_found` -> `exception`;
- any unknown future status -> `attention_required`.

Official references checked on 2026-09-27:

- https://biteship.com/en/docs/api/trackings/status
- https://biteship.com/id/docs/api/orders/overview

Unknown states are deliberately not mapped to `shipment_created`.

## Ownership boundary

New pure contract:

```text
src/lib/shop/access.ts
```

`orderAccessAllowed` permits an order read only when either the hashed guest order
cookie matches or the authenticated account id matches the order account id. The
existing owner/admin path remains an explicit server-side bypass for owner
operations.

## Test entry point

```text
npm run test:shop:batch08
```

The test is also part of:

```text
npm run test:shop
```

CI #1845 additionally passed the full 54-migration chain, PostgreSQL staging/
security/concurrency gate, production HTTP boundary, production build, mobile QA,
Windows compatibility, dependency audit, secret-history scan, typecheck and lint.

## Remaining external dependency

Batch 07 remains open because the repository does not contain owner-approved
Biteship runtime credentials/origin configuration. Do not simulate that missing
evidence and call it live acceptance.

Until Batch 07 is genuinely accepted:

- keep Shop sales disabled;
- do not claim real courier quote/order creation;
- do not claim real Biteship webhook delivery;
- do not enable production fulfillment.

Batch 09 may proceed for provider-independent reconciliation/admin/reporting work,
but any shipment-reconciliation feature must remain fail-closed around the missing
Batch 07 provider configuration.
