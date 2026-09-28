# Mainlagi Shop — Batch 11 full staging E2E and launch-gate review

Status: **BLOCKED — deterministic launch-gate review complete; required live staging/provider evidence is still missing.**

This review is based on post-Batch-10 integrated Shop head
`7751942bdf29a7664aae6a4e075578d251feb687`, which contains latest `main`
`f2b3768745f11e4fa33954d61aabb1a01acda2ff` as a merge parent.

Post-sync evidence:

- PR #359 remains Draft and is mergeable, with the Shop branch 0 commits behind
  the reviewed `main` parent at integration time;
- Mainlagi TV V3 CI **#1915**, run `36328184665`, completed **SUCCESS** on the
  exact integrated tree;
- Windows compatibility, Ubuntu quality, production build, PostgreSQL staging
  gate, dependency audit, secret-history scan and repository-wide Chromium mobile
  QA passed;
- live Midtrans probe and production smoke remained intentionally skipped by normal
  CI conditions;
- `SHOP_SALES_ENABLED` remains disabled;
- no production migration, provider-production transaction, merge to `main` or
  deployment was performed.

## Required Batch 11 scenario review

| Required scenario | Deterministic / existing evidence | Full staging status |
| --- | --- | --- |
| Successful order | PASS — checkout/state-machine/PostgreSQL/browser coverage exists | BLOCKED — no safe public non-production Shop origin with complete launch data/config |
| Payment pending | PASS — deterministic coverage plus real Midtrans Sandbox pending evidence from Batch 06 | BLOCKED as part of full integrated staging E2E |
| Payment expired / cancelled | PASS — deterministic coverage plus real Midtrans Sandbox cancel/expire evidence | BLOCKED as part of full integrated staging E2E |
| Stock unavailable / race | PASS — real PostgreSQL multi-session race gate | PASS for database/concurrency behavior; full customer/provider staging path still blocked |
| Delayed / duplicate / out-of-order payment webhook | PASS — deterministic idempotency/order tests; real Midtrans notification route already accepted | BLOCKED for complete staging-sequence evidence |
| Packed shipment creation and tracking | PASS deterministically | **BLOCKED — real Biteship Sandbox/origin acceptance is not available** |
| Failed / delayed / duplicate shipping webhook | PASS deterministically | **BLOCKED — real Biteship webhook/provider GET evidence is not available** |
| Full refund | PASS deterministically, with explicit no-fictional-auto-restock behavior | BLOCKED for full staged provider flow |
| Manual-review / ambiguous provider state | PASS deterministically | BLOCKED for full staged provider flow |
| Reconciliation retry / recovery | PASS deterministically with Batch 09 backoff/alert tests | **BLOCKED — staging scheduler has not been activated and observed** |

The deterministic PASS entries above do not substitute for the live provider/staging
evidence required by Batch 11.

## Final launch-gate checklist

### PASS from current evidence

- media mapping/review contract;
- admin product activation workflow and fail-closed completeness validation;
- PostgreSQL migration-chain, RLS/RPC/browser-role security and concurrency gate;
- Midtrans Sandbox acceptance from Batch 06;
- deterministic checkout/order/payment/refund/fulfillment exception state machine;
- admin order operations and reporting deterministic acceptance;
- Batch 10 desktop/tablet/mobile/accessibility browser quality;
- post-Batch-10 synchronization with current reviewed `main` and full integrated
  CI #1915.

### BLOCKED before Batch 11 can close

1. **Product truth / sellable variants**
   - apparel 001–005 still require owner-verified real sizes/measurements, exact
     stock split per real variant and measured shipping weight/dimensions;
   - SKU 006 still requires verified tumbler physical facts needed for activation;
   - SKU 007 still requires verified real product type/function/issuer-related
     facts where applicable;
   - unknown values must remain Draft and must not be inferred from generated
     product imagery.

2. **Operational deployment configuration**
   - **PASS:** isolated non-production Cloudflare Worker is deployed at
     `https://mainlagi-hub-shop-staging.mainlagihub.workers.dev`;
   - **PASS:** Biteship Testing Mode webhook installation is registered and the
     custom secret-header boundary is verified;
   - **PASS for Sandbox:** private pickup/contact/full-address/postal-code values
     are configured as encrypted staging secrets and were accepted by live Rates
     and Order API probes;
   - **PASS:** refreshed Biteship Testing Mode API key authenticates successfully
     against `GET /v1/couriers`;
   - **PASS:** all approved courier codes and approved courier/service pairs are
     present in the Sandbox response;
   - **PASS for Sandbox transport:** live Rates and simulated Order API acceptance
     passed using the testing fixture;
   - **BLOCKED for production truth:** packed weights/dimensions remain provisional
     test fixtures rather than measured sellable-product facts.

3. **Batch 07 live Biteship acceptance**
   - **PASS for Sandbox integration:** authenticated non-mutating Rates API request
     completed with all nine testing-only fixture SKUs; every approved
     courier/service pair returned as parcel + pickup;
   - **BLOCKED for production truth:** fixture weight/dimensions are provisional
     testing values and must be replaced by measured packed values;
   - **PASS for provider simulation:** two Testing Mode orders were created and
     independently retrieved; one candidate was successfully cancelled via the
     sandbox cancel endpoint;
   - **PARTIAL PASS:** duplicate reference code `40002060` is provider-verified,
     but the observed Sandbox response returned `details=null`; automatic recovery
     remains conditional on Biteship returning a provider order ID, otherwise the
     runtime now fails closed to manual reconciliation;
   - **PASS for bounded staging acceptance:** authenticated webhook boundary plus
     independent provider GET passed for `ML-SBX-` test references;
   - **BLOCKED:** integrated Shop paid + owner-packed database flow has not yet
     created the provider shipment because this isolated staging Worker intentionally
     uses the mock data backend;
   - **PASS:** Delivered status progression, real Biteship `order.status` Events
     Log callbacks with HTTP 200, independent Tracking API retrieval, and the full
     seven-step normal delivery history are provider-verified;
   - **PASS:** exception/return progression is provider-verified: dashboard
     `on_hold`, HTTP 200 `order.status` callbacks, Order API terminal
     `returned`, and Tracking API `return_in_transit → returned` all passed.

4. **Safe non-production Shop staging origin**
   - **PASS for provider-webhook boundary:** isolated workers.dev staging origin
     is deployed and Biteship accepted it;
   - **BLOCKED for full Shop staging:** this Worker currently uses the safe mock
     data backend and is not the database-backed integrated staging environment
     required for full Batch 11 E2E;
   - production remains excluded as a staging substitute.

5. **Batch 09 scheduler evidence**
   - configure GitHub `SHOP_STAGING_URL`;
   - configure matching `SHOP_CRON_SECRET` in GitHub and staging;
   - observe at least one successful real scheduled reconciliation run;
   - live shipment reconciliation also depends on Batch 07.

6. **PII retention owner decision**
   - `SHOP_ORDER_PII_RETENTION_DAYS` remains unset;
   - accepted implementation range is 30–3650 days;
   - automatic terminal-order PII redaction remains disabled until the owner
     explicitly selects a duration.

7. **Full integrated staging E2E**
   - run the complete required scenario set only after the above product,
     provider and staging prerequisites exist.

## Decision

Batch 11 must remain **BLOCKED**. The correct next action is to close the concrete
external/data prerequisites above; it is not acceptable to create placeholder
physical facts, fake Biteship evidence, use production as staging, silently choose
a retention period, or mark the full staging E2E gate PASS from deterministic tests
alone.

PR #359 stays Draft and `SHOP_SALES_ENABLED=false`.


### Batch 11 staging acceptance boundary

The application now has an explicit staging-only request gate for the customer
mutation path. Public sales remain controlled by `SHOP_SALES_ENABLED` and stay
disabled. A non-production full-staging workflow may bypass only that public sales
flag when all of the following are true:

- `SHOP_STAGING_ACCEPTANCE_ENABLED=true`;
- a non-empty `SHOP_STAGING_ACCEPTANCE_SECRET` is configured server-side;
- the request supplies the exact value in
  `X-Mainlagi-Shop-Staging-Secret`.

This bypass does **not** bypass `operationalPolicyBlockers()`: pickup origin,
courier allowlist and all approved operational policy requirements still have to
pass. Production must leave the staging-acceptance flag disabled/unset.

The purpose is to allow a bounded Batch 11 end-to-end test against a dedicated
non-production database while `SHOP_SALES_ENABLED=false`, so the release candidate
can be exercised without accidentally opening public checkout.
