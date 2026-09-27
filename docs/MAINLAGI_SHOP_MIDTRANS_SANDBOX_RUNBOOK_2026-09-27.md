# Mainlagi Shop — Batch 06 Midtrans sandbox runbook

Status: **closure candidate; live provider acceptance is complete and the latest deterministic edge-case suite is awaiting green CI on the current tree**.

This runbook is for Midtrans **Sandbox only**. It does not authorize production
Midtrans credentials, real customer charges, production database migration, Shop
sales activation, or merging PR #359.

## Environment boundary

Application runtime keeps:

```text
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=<sandbox Server Key>
```

GitHub Actions keeps sandbox credentials as repository secrets. Server Key values
must never be committed or printed.

Official Midtrans boundaries rechecked on 2026-09-27:

```text
POST https://app.sandbox.midtrans.com/snap/v1/transactions
GET  https://api.sandbox.midtrans.com/v2/{order_id}/status
```

Authentication uses HTTP Basic with Base64(`ServerKey + ":"`). Sandbox
transactions use test funds only.

## Live Sandbox probe policy

The CI job **Shop Midtrans sandbox probe** is now **manual-only**. Normal
push/pull-request CI skips it so repository work does not repeatedly create
Sandbox transactions or webhook retries.

A deliberate manual run uses the workflow-dispatch input
`run_midtrans_sandbox=true`.

Current live-probe scripts:

```text
scripts/run-shop-midtrans-sandbox-probe.mjs
scripts/run-shop-midtrans-sandbox-state-probe.mjs
scripts/run-shop-midtrans-sandbox-paid-probe.mjs
scripts/run-shop-midtrans-sandbox-card-deny-probe.mjs
scripts/run-shop-midtrans-sandbox-webhook-probe.mjs
scripts/run-shop-midtrans-sandbox-app-webhook-probe.mjs
```

They cover Snap creation, pending/cancel/expire provider states, paid VA
settlement, bank/FDS deny paths, real Sandbox notification delivery, and the
actual Next.js Midtrans notification route.

## Payment-state contract in application code

Batch 06 keeps these fail-closed rules:

- notification signature:
  `SHA512(order_id + status_code + gross_amount + ServerKey)`;
- a notification body never directly marks an order paid;
- a signed notification triggers independent GET Status reconciliation;
- GET Status must match local order id and gross amount and contain a provider
  transaction id;
- a locally paid mapping additionally requires provider `status_code="200"`;
- pending `status_code="201"` remains pending;
- `capture + fraud_status=accept` and valid `settlement` map to paid;
- fraud challenge remains pending and therefore keeps the reservation;
- contradictory terminal fraud state maps to manual review;
- `deny` and `failure` map to failed;
- `cancel` maps to cancelled;
- `expire` maps to expired;
- `refund` maps to refunded;
- partial refund/chargeback states map to manual review;
- unknown future states remain fail-closed as pending;
- a verified late payment after reservation release is recorded but placed in
  `attention_required`; already released stock is not silently consumed.

## Live provider evidence already completed

All live evidence below used Midtrans Sandbox and no real funds:

- **CI #1822 / run 36302954764** — Sandbox credential readable; real Snap
  transaction created and redirect host verified.
- **CI #1824 / run 36306828931** — real pending state plus independent GET Status;
  cancel and expire terminal states verified. The probe also captured Midtrans
  body `status_code="407"` for the documented expired transaction behavior and
  was corrected instead of masking the provider response.
- **CI #1826 / run 36307354368** — Permata VA Sandbox payment moved from pending
  to `settlement`; independent GET Status verified the Rp10.000 amount and paid
  provider state.
- **CI #1827 / run 36307520893** — FDS-deny and bank-deny Sandbox card paths both
  reached `deny` and were independently verified with GET Status.
- **CI #1828 / run 36307825123** — a real Midtrans Sandbox notification reached a
  temporary non-production receiver at the canonical Mainlagi notification path;
  SHA-512 signature and independent GET Status verified `settlement`.
- **CI #1829 / run 36308068325** — a real Sandbox notification reached the actual
  Next.js `/api/shop/midtrans/notification` route through a temporary
  non-production tunnel. The route verified the signature, independently fetched
  provider status and reconciled to paid. The Supabase HTTP boundary in this
  route probe was deterministic/in-memory; PostgreSQL payment RPC semantics are
  exercised separately by the PostgreSQL/PGlite gates.

The provider docs confirm that Sandbox is for non-real transactions, Get Status is
the authoritative status lookup, and card `fraud_status=challenge` is a
non-final state that must not be treated as paid.

## Deterministic application-state acceptance

The current Batch 06 test changes extend the existing database/provider contracts
with:

- payment-session lease: first claim succeeds, concurrent claim fails, expired
  lease can be reclaimed without creating a second provider-order identity;
- duplicate provider event key remains idempotent;
- paid state cannot regress when stale/out-of-order expire/cancel/failure events
  arrive later;
- wrong gross amount fails before event persistence;
- a different provider transaction id fails closed;
- challenge/pending state remains pending and retains inventory reservation;
- expiration releases that reservation without consuming physical stock;
- late paid settlement after release becomes `attention_required`, keeps
  physical stock unchanged, and writes the late-payment audit event;
- ambiguous/manual-review state retains reservation and creates no sale movement;
- forged signature, wrong order identity, wrong amount, missing transaction id,
  and invalid pending status-code cases remain rejected by provider contracts;
- source contract locks the webhook sequence to
  `verifyMidtrans -> reconcile -> independent GET Status`, never direct payment
  application from notification body;
- provider HTTP calls keep the 15-second timeout boundary.

Primary deterministic gates:

```text
npm run test:shop
bash scripts/run-shop-postgres-staging-tests.sh
npm run test:shop:http
```

The latest additions must pass on the current PR tree before Batch 06 is marked
`DONE`.

## Webhook boundary

Canonical application endpoint:

```text
POST /api/shop/midtrans/notification
```

Production Midtrans notifications must never point at Sandbox/test endpoints.

The live acceptance used temporary non-production public tunnels rather than
changing the existing InMyDraft Sandbox notification URL globally. Future live
probes should remain deliberate/manual to avoid repeated notification retries and
alert email noise.

## Exit gate

Batch 06 becomes `DONE` only when the latest tree confirms:

- real Sandbox Snap creation;
- real Sandbox paid settlement verified by independent GET Status;
- pending/deny/cancel/expire behavior evidenced against the provider;
- challenge/pending behavior held safely by the application state machine;
- signed real notification reaches the actual application route and triggers
  independent GET Status;
- forged/wrong amount/wrong identity inputs fail safely;
- duplicate/out-of-order events are idempotent and cannot regress paid state;
- payment-session timeout/lease retry keeps one provider order identity;
- late/ambiguous payment states preserve inventory invariants and require review;
- no production Midtrans credential, real funds, or production database was used.

## Current blocker

There is **no remaining live-provider blocker** in Batch 06. The only closure
condition is a green deterministic CI run on the latest tree containing the new
edge-case assertions. The live Midtrans job must stay skipped during that normal
CI run.
