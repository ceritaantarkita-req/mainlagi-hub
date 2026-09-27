# Mainlagi Shop — Batch 06 Midtrans sandbox runbook

Status: **prepared; blocked by missing Midtrans sandbox Server Key**.

This runbook is for Midtrans **Sandbox only**. It does not authorize production
Midtrans credentials, real customer charges, production database migration, Shop
sales activation, or merging PR #359.

## Environment boundary

Application runtime keeps:

```text
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=<sandbox Server Key>
```

GitHub Actions uses a dedicated repository secret:

```text
MIDTRANS_SANDBOX_SERVER_KEY
```

Do not commit either sandbox or production Server Key. Do not use a production
Server Key to satisfy this batch.

Official Midtrans sandbox endpoints verified on 2026-09-27:

```text
POST https://app.sandbox.midtrans.com/snap/v1/transactions
GET  https://api.sandbox.midtrans.com/v2/{order_id}/status
```

Authentication is HTTP Basic using Base64(`ServerKey + ":"`).

## Automated credential/live-connectivity probe

CI job:

```text
Shop Midtrans sandbox probe
```

Script:

```text
scripts/run-shop-midtrans-sandbox-probe.mjs
```

When `MIDTRANS_SANDBOX_SERVER_KEY` exists, the probe:

1. refuses production mode;
2. creates a unique Rp10.000 Snap sandbox transaction;
3. requests secure card handling;
4. checks HTTP 201 and non-empty Snap token;
5. requires redirect host `app.sandbox.midtrans.com`;
6. calls independent GET Status;
7. accepts the documented pre-payment 404 before a payment method is selected, or
   a valid pending state;
8. never prints the Server Key.

When the secret is absent the job records
`MIDTRANS_SANDBOX_SERVER_KEY_NOT_CONFIGURED` and performs no provider request.

## Payment-state contract in application code

Batch 06 hardening keeps these rules:

- notification signature:
  `SHA512(order_id + status_code + gross_amount + ServerKey)`;
- webhook body never directly marks an order paid;
- a signed notification triggers an independent GET Status lookup;
- GET Status must match local order id and gross amount and contain a provider
  transaction id;
- a locally paid mapping additionally requires provider `status_code="200"`;
- documented pending status code `201` is accepted as pending;
- `capture + fraud_status=accept` and valid `settlement` map to paid;
- fraud challenge stays pending;
- contradictory fraud state on an otherwise successful terminal status goes to
  manual review;
- `deny` and `failure` map to failed;
- `cancel` maps to cancelled;
- `expire` maps to expired;
- `refund` maps to refunded;
- partial refund/chargeback states go to manual review;
- unknown future status remains fail-closed as pending.

## Real sandbox acceptance still required

A successful credential probe is **not enough** to close Batch 06. With a sandbox
Server Key configured, exercise real Midtrans sandbox transactions for:

1. initial pending state;
2. accepted payment;
3. bank/FDS denial;
4. cancel;
5. expire;
6. fraud/challenge;
7. duplicate notification;
8. delayed/out-of-order notification;
9. wrong signature;
10. wrong amount/order identity;
11. late payment after local reservation release;
12. remote Snap creation timeout/retry/reconciliation behavior.

Midtrans sandbox test credentials are test-only and must never be accepted in
production. For card acceptance testing, use the current official Midtrans Sandbox
test-card documentation rather than copying a card number into application code.

## Webhook boundary

Canonical application endpoint:

```text
POST /api/shop/midtrans/notification
```

Do not point Midtrans production notifications at a sandbox deployment.

For Batch 06, notification configuration must target a safe non-production
publicly reachable origin. Localhost alone is not a valid external webhook target.
If no safe public sandbox origin exists, provider notification delivery remains a
recorded Batch 06 blocker rather than being simulated and claimed as real.

## Exit gate

Batch 06 becomes `DONE` only when evidence shows:

- real sandbox Snap creation;
- at least one sandbox payment reaches a locally verified paid state;
- pending/deny/cancel/expire/challenge paths are exercised;
- signed webhook plus independent GET Status is verified;
- forged/wrong amount/wrong identity inputs fail safely;
- duplicates/out-of-order delivery remain idempotent;
- late/ambiguous states retain or release inventory according to the existing
  fail-closed database contract;
- no production Midtrans credential or transaction was used.

## Current blocker

CI #1819 on PR #359 reported:

```text
MIDTRANS_SANDBOX_SERVER_KEY_NOT_CONFIGURED
```

Therefore no Midtrans provider request was made in that run and no sandbox payment
result is claimed.
