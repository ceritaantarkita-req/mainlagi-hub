# Mainlagi Shop — Batch 06 Midtrans sandbox runbook

Status: **in progress; live Snap plus pending/cancel/expire provider-state probes passed, while paid/webhook acceptance remains open**.

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

Scripts:

```text
scripts/run-shop-midtrans-sandbox-probe.mjs
scripts/run-shop-midtrans-sandbox-state-probe.mjs
```

When `MIDTRANS_SANDBOX_SERVER_KEY` exists, the CI job:

1. refuses production mode;
2. creates a unique Rp10.000 Snap sandbox transaction;
3. requests secure card handling;
4. checks HTTP 201, a non-empty Snap token and the sandbox redirect host;
5. calls independent GET Status and accepts the documented pre-payment 404 before
   a payment method is selected, or a valid pending state;
6. creates two Rp10.000 Permata VA Sandbox transactions through Core API;
7. verifies both reach `pending`;
8. cancels one transaction and independently verifies `cancel`;
9. expires the other transaction and independently verifies `expire`;
10. accepts Midtrans body `status_code="407"` only in the documented expired
    transaction context rather than treating it as an unexpected success code;
11. never prints the Server Key.

The Core API VA lifecycle probe is **provider-state evidence only**. Mainlagi
continues to use hosted Snap for its checkout implementation; the probe does not
change the production integration mode.

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

Provider-level evidence already completed:

- real Snap creation and sandbox redirect boundary;
- pre-payment GET Status behavior;
- real asynchronous `pending` state;
- merchant-triggered `cancel`;
- merchant-triggered `expire`;
- independent GET Status confirmation of the terminal cancel/expire states.

This is useful but **not enough** to close Batch 06. Remaining real Sandbox
acceptance must exercise:

1. accepted payment that reaches a locally verified paid state;
2. bank/FDS denial;
3. fraud/challenge;
4. real notification delivery to the canonical application webhook;
5. duplicate notification;
6. delayed/out-of-order notification;
7. wrong signature;
8. wrong amount/order identity;
9. late payment after local reservation release;
10. remote Snap creation timeout/retry/reconciliation behavior.

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

## Current evidence and remaining blockers

Credential blocker is closed. Evidence:

- historical CI #1819 correctly skipped provider calls while the dedicated Sandbox
  Server Key was absent;
- CI #1822 rerun used the newly configured secret and passed real Snap creation;
- CI #1824 **Shop Midtrans sandbox probe** passed real Snap connectivity plus
  `pending -> cancel` and `pending -> expire` provider-state cycles;
- no production credential or real-world funds were used.

Batch 06 remains open because provider-level state probes are not application
end-to-end acceptance. The next hard requirement is a safe non-production,
publicly reachable Mainlagi endpoint for real Midtrans notification delivery plus
an accepted Sandbox payment. Deny/challenge, duplicate/out-of-order delivery,
timeout/retry and late-payment/reconciliation evidence remain after that.
