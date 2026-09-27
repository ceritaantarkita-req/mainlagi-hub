# Mainlagi Shop — implementation checkpoint, 2026-09-27

Status: **draft implementation; not approved for live sales**. No remote migration,
production secrets, provider transaction, merge, or deployment was performed.

## Source of truth and provenance

- Mainlagi `main`: `bf69beea081cff4eb1cf9f1a54ed3ef9aba6408a`, checked again before implementation.
- Main reference: `MAINLAGI_SHOP_IMPLEMENTATION_HANDOFF_2026-09-27.md` (full document reviewed in preceding audit).
- Commerce reference: `ceritaantarkita-req/pleated-and-beyond` at `be04933932b4e9aea0e616e705cc6aa6ae906217`.
- Source asset folder: https://drive.google.com/drive/folders/1vygtEwXuS_nOemblWEP5RqOftyFN84al
- Asset hashes and mapping: `docs/data/MAINLAGI_SHOP_MEDIA_MANIFEST_2026-09-27.json`.

The Drive audit found **29 entries**, comprising 27 PNG files and two documents;
the older handoff counted 28. PNG sources are 1254×1254, with **26 unique hashes**:
the tumbler in-use and alternate are identical. Keep that duplication visible for
owner review. Derivatives are 1200×1200 WebP, without creative alteration.
Three persisted derivatives were empty at session resume; they were regenerated
from hash-verified source PNGs and their derivative checksums updated.

Current Mainlagi uses Supabase/Next.js/OpenNext, not the reference repo's
Neon/Drizzle persistence. Existing migrations and learning/auth data are unchanged.
Use current Mainlagi coral `#bd492f`, not the older handoff's `#e46c49`.

## What this branch implements

- Public `/shop`, product detail/gallery, category/search, cart, guest/account
  checkout, payment redirect, order status and account order list.
- Public navigation keeps five destinations; Shop takes the former scoreboard
  slot. `/leaderboards` remains available from Main Gerak.
- Owner-gated `/admin/shop/products`, `/preview`, `/inventory`, `/orders`, `/reports`.
  Product review is read-only in this checkpoint. No placeholder weight, size,
  measurements, material claim, card issuer, review, or rating is invented.
- One additive migration creates the Shop domain and seeds nine **draft** products,
  27 review-state media rows, nine default variants and 79 total units exactly once.
- Server-only cart/order APIs; browser roles cannot read PII, token hashes, stock
  ledger or provider attempts, and cannot execute commerce RPCs.
- Cart secrets are 256-bit random HttpOnly/SameSite cookies, stored hashed in DB.
  Checkout retries reuse the cart's order; guest order access requires its cookie
  or the authenticated account that originally placed the order.
- Atomic checkout locks cart/catalog/stock; binds a 15-minute shipping quote to
  cart revision, price/weight signature and destination postal code; snapshots
  prices and weights; reserves inventory for 30 minutes.
- Midtrans SHA-512 notification validation plus independent GET status, amount and
  identity checks; idempotent settlement, release and late-payment hold. Browser
  redirects never mark orders paid. Fraud challenges stay pending.
- Midtrans hosted Snap redirect needs only the server key; no client key/script
  is shipped to the browser in this implementation.
- Biteship rate lookup supports allowlisted standard parcel services with pickup.
  Shipment creation requires owner confirmation that a paid order is packed.
  A DB lease serializes creation attempts; duplicate-reference error 40002060
  recovers the existing provider order. Webhooks require configured custom secret
  header and a fresh provider GET before state updates.
- Inventory adjustment requires owner identity, a reason and an idempotency key;
  it cannot reduce physical stock below reserved stock and writes an audit row.
- Reporting separates merchandise, shipping, total collected and full refunds.
  Date range boundaries use Asia/Jakarta. Failed queries display an unavailable
  state, not fictional zero revenue. Partial refunds require manual reconciliation
  and place fulfillment on hold; they are not represented as full refunds.

## Configuration and operational contract

See `.env.example`. All provider keys, service role and webhook/cron secrets are
server-only. `SHOP_SALES_ENABLED=false` is the default. Missing providers fail
closed; there is no successful mock-payment fallback.

`SHOP_LOCAL_PREVIEW=true` works **only with NODE_ENV=development** and exposes seed
visuals for local review. Production catalog reads use public RLS, which returns
only active products with verified facts and approved media. Owner preview is
separately authenticated. Static image paths themselves are public assets, not an
access-control boundary.

Configure these provider URLs on the deployment's canonical origin:

- Midtrans notification: `POST /api/shop/midtrans/notification`
- Biteship webhook: `POST /api/shop/biteship/webhook`
- Scheduled reconciliation: `POST /api/shop/reconcile`, authenticated with
  `Authorization: Bearer <SHOP_CRON_SECRET>`.

The cron endpoint is implemented but **not scheduled by this branch**. It handles
up to 50 oldest pending orders per invocation. Monitor `failed` and pending-age
backlog. Expired orders with no payment attempt, or authoritative provider 404
beyond a two-minute grace period, release reservations. Ambiguous provider/network
failures retain stock rather than infer failed payment. Use the owner payment
check action for targeted reconciliation.

Provider timeout after successful remote Snap creation but before persisting the
response can leave an unavailable payment URL. Same provider order ID prevents a
new charge identity; reconcile/expire the pending order and investigate in the
provider dashboard. Do not overwrite order IDs to bypass duplicate protection.

Shipment webhook delivery before local creation response can recover from the
provider reference, but only if a local shipment claim already exists. Full refund
does not automatically restock consumed stock or cancel an already dispatched
courier. Inspect return/refund cases manually.

Order report dates refer to the first locally verified paid event, not a provider
settlement export. Full refunds are attributed to that original payment cohort.
The report is not profit accounting: provider fees, actual shipping cost, partial
refund amounts and settlement dates need a separate reconciliation release.

## Launch blockers and remaining implementation

1. Owner-supplied sizes and measurements for 001–005, exact stock split across
   variants, and measured shipping weights; dimensions where required. Default
   stock must be allocated, not copied into every size. A reviewed variant editor
   and activation workflow remain to be built after agreeing that data contract.
2. Pickup origin/contact/postal code, explicit courier allowlist, sandbox keys,
   webhook configuration, scheduler and operational monitoring.
3. Tumbler capacity/material facts, issuer/function of SKU 007, final product/media
   fidelity approval including duplicated tumbler shot and audited artwork drift.
4. Support contact, return/refund policy, shipping SLA, guest order recovery and
   customer notification decisions. Guest access currently depends on the original
   device cookie; no email/WhatsApp delivery is claimed.
5. Full staging Supabase migration-chain test and advisors; concurrent checkout
   tests against real PostgreSQL; provider sandbox end-to-end tests, webhook
   retry/out-of-order cases and timeout recovery drills.
6. Browser/mobile/accessibility verification. The available cloud browser rejected
   `http://localhost:3000/shop` with `net::ERR_BLOCKED_BY_CLIENT`. No visual pass or
   screenshot evidence is claimed; no alternative browser bypass was attempted.
7. Pagination beyond the 100 newest owner/account orders, shipment reconciliation
   scheduler, PII retention/cleanup, refund accounting and review submission remain
   later operational work. The reviews table is reserved, with no public writes.

Keep this a draft until the remaining code and acceptance gates above are closed.
Do not apply the migration to production merely because local tests passed.

## Verification completed

- `npm run test:shop`: provider signature tampering/fraud/status tests; all 27
  derivative checksums; exact nine product prices/stocks; executable PostgreSQL
  migration/RLS/transaction tests using pinned PGlite.
- DB scenarios include duplicate checkout/settlement/adjustment, wrong amount,
  stale/cross-cart quote, wrong cart secret, lost inventory row, late settlement,
  refund-before-settlement release, owner-only packing, unpaid shipping denial,
  shipment creation lease, no delivered regression and report totals.
- `npm run test:shop:http` after a production build: production catalog hides draft
  products and ignores the development preview flag; image bytes are served; CSRF,
  sales-disabled, owner, notification-signature and cron gates reject invalid
  requests, and API responses carry `no-store`. Uses HTTP assertions, not browser QA.
- `npm run typecheck` and `npm run lint` (six existing unrelated warnings).
- `npm run build` and `npm run build:cloudflare`.
- Structure/source audit, Batch 16 security boundary checks and existing mobile
  foundation contract checks.

PGlite tests bootstrap minimal existing `profiles`/`audit_logs`; they do not claim
that all 51 historical migrations, Supabase Auth/PostgREST, multi-connection races,
Cloudflare runtime network behavior or live provider integration were exercised.

## Provider references checked during implementation

- https://docs.midtrans.com/reference/backend-integration
- https://docs.midtrans.com/docs/https-notification-webhooks
- https://docs.midtrans.com/reference/get-transaction-status
- https://biteship.com/en/docs/api/rates/retrieve
- https://biteship.com/en/docs/api/orders/create
- https://biteship.com/en/docs/api/orders/retrieve
