# Mainlagi Shop — Batch 11 full staging E2E and launch-gate review

Status: **BLOCKED — free database-backed staging, real scheduler evidence, owner operational policy and provider Sandbox acceptance PASS; launch closure still waits on production product truth, production PII retention and the remaining full integrated DB-backed provider flow.**

The original post-Batch-10 review started from integrated Shop head
`7751942bdf29a7664aae6a4e075578d251feb687`. The active safe checkpoint now
continues from Shop code head `554f43027855a5b8742a016e487d6d1b951909cc`, which passed exact PR CI **#2085**
(run `36386147649`) and is synchronized through current reviewed `main`
`d85732d0cd434915c2e0650fe0468b2b8c104fea` in the accompanying checkpoint-doc merge.

Post-sync evidence:

- PR #359 remains Draft and `SHOP_SALES_ENABLED=false`;
- exact Shop code checkpoint `554f43027855a5b8742a016e487d6d1b951909cc` passed CI **#2085** / run
  `36386147649` including Ubuntu quality, production build, PostgreSQL staging,
  Windows compatibility, secret scan, dependency audit and Chromium/mobile QA;
- this docs checkpoint also synchronizes the branch through reviewed `main`
  `d85732d0cd434915c2e0650fe0468b2b8c104fea`;
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
| Successful order | PASS — checkout/state-machine/PostgreSQL/browser coverage exists | BLOCKED — free DB-backed staging exists; production product truth and the remaining full integrated provider sequence are not yet closed |
| Payment pending | PASS — deterministic coverage plus real Midtrans Sandbox pending evidence from Batch 06 | BLOCKED as part of full integrated staging E2E |
| Payment expired / cancelled | PASS — deterministic coverage plus real Midtrans Sandbox cancel/expire evidence | BLOCKED as part of full integrated staging E2E |
| Stock unavailable / race | PASS — real PostgreSQL multi-session race gate | PASS for database/concurrency behavior; full customer/provider staging path still blocked |
| Delayed / duplicate / out-of-order payment webhook | PASS — deterministic idempotency/order tests; real Midtrans notification route already accepted | BLOCKED for complete staging-sequence evidence |
| Packed shipment creation and tracking | PASS deterministically plus provider Sandbox Order/Tracking acceptance | **BLOCKED — full DB-backed paid→packed→provider shipment path still waits on production product truth and integrated E2E closure** |
| Failed / delayed / duplicate shipping webhook | PASS deterministically plus real Biteship HTTP 200 callback/provider-GET acceptance | **BLOCKED only for the full DB-backed integrated sequence** |
| Full refund | PASS deterministically, with explicit no-fictional-auto-restock behavior | BLOCKED for full staged provider flow |
| Manual-review / ambiguous provider state | PASS deterministically | BLOCKED for full staged provider flow |
| Reconciliation retry / recovery | PASS deterministically with Batch 09 backoff/alert tests | **PASS — real Cloudflare cron tick created a completed reconciliation row in ephemeral DB-backed staging** |

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
- post-Batch-10 synchronization with current reviewed `main`;
- owner-approved Batch 04 operational policy contract;
- free ephemeral Supabase database-backed staging;
- real Cloudflare scheduled reconciliation evidence;
- Biteship Sandbox Rates, Order, webhook, tracking, cancel and return/exception
  provider acceptance;
- exact Shop code checkpoint `554f43027855a5b8742a016e487d6d1b951909cc` CI #2085 full success.

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

4. **Safe non-production Shop staging origin — PASS for Batch 11 CI staging**
   - the database-backed staging path now runs against a fresh local Supabase stack
     on the GitHub runner;
   - only the Next.js app is exposed through a temporary HTTPS Quick Tunnel;
   - production Supabase is not used or mutated;
   - the isolated workers.dev endpoint remains the stable provider-webhook boundary.

5. **Batch 09 scheduler evidence — PASS**
   - a temporary Cloudflare Cron Worker was deployed on a real five-minute schedule;
   - it called the ephemeral staging `/api/shop/reconcile` endpoint with a matching
     generated `SHOP_CRON_SECRET`;
   - a completed `shop_reconciliation_runs` row with `status=ok` was observed;
   - the temporary cron Worker was deleted after evidence collection.

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


### Free database-backed staging execution path

The paid remote-Supabase branch plan was rejected by the owner. Batch 11 now uses
an ephemeral, zero-additional-Supabase-cost CI staging design:

1. GitHub Actions starts the Supabase stack locally with the official Supabase CLI
   and runs `supabase db reset --local` so the complete repository migration chain
   is replayed against a clean database;
2. the Supabase containers remain runner-internal and are never exposed by the
   public tunnel; the only public temporary ingress targets Next.js on port 3000;
3. the workflow applies the explicit testing-only SKU 008 Biteship fixture to this
   ephemeral database only;
4. a production-like Next.js build runs on the GitHub runner against that local
   Supabase;
5. Cloudflare Quick Tunnel exposes **only the Next.js app**, never Supabase;
6. public sales remain disabled; the secret-gated Batch 11 request must advance
   beyond the sales-off gate and, after safe normalization of quoted private origin
   secrets, reach the DB-backed cart/rates boundary without bypassing any policy;
7. a temporary Cloudflare Cron Worker calls the tunneled
   `/api/shop/reconcile` endpoint on a real five-minute schedule;
8. the workflow verifies that the scheduled call creates a completed
   `shop_reconciliation_runs` row in the local Supabase database;
9. evidence is uploaded, then the cron Worker, app, tunnel and local database
   containers are all removed.

This follows Supabase's local-development boundary: local Supabase is used only for
development/CI and its ports are never publicly tunneled. Cloudflare Quick Tunnel is
used only for the temporary Next.js application endpoint needed for staging and
scheduler testing.

No Supabase development branch or additional paid Supabase project is required.
The workflow may still consume whatever GitHub Actions and Cloudflare Workers usage
is included in the owner's existing plans/quotas; it introduces no Supabase branch
hourly charge.

The test workflow uses `SHOP_ORDER_PII_RETENTION_DAYS=30` only as an ephemeral
valid-value fixture. The production owner retention decision remains unresolved and
must not be inferred from that test value.


The Batch 04 operational-policy packet is already owner-approved and
`operational-policy.json` is `status=approved`. Free-staging run #5 showed the
remaining operational-readiness failure was not a missing owner policy: the private
origin phone and postal-code GitHub secrets retained wrapper formatting that failed
the strict runtime regex. The workflow now strips matching outer quotes/CR safely,
normalizes the historical escaped-dot address form, masks normalized values, and
never prints the secret contents. A manual rerun is the next proof that the
secret-gated request reaches the DB-backed cart/rates boundary.


## Free staging acceptance evidence

Canonical zero-additional-Supabase-cost acceptance run:

- workflow: `Shop Batch 11 free staging`;
- run: **#4**, GitHub Actions run `36379851442`;
- tested SHA: `525dabdabb56e048d2604cc48282f73484f3a659`;
- result: **SUCCESS**;
- full repository Supabase migration chain replayed from a clean local database;
- testing-only non-apparel SKU 008 fixture activated only inside the ephemeral DB;
- production-like Next.js build completed against local Supabase;
- public request stopped at the normal sales-disabled gate;
- staging-secret request advanced past sales-disabled but stopped at operational
  readiness because the private origin phone/postal secrets still contained wrapper
  formatting in that historical run; owner policy itself was already approved;
- real Cloudflare Cron scheduled invocation created reconciliation row
  `32c97aed-fe9d-4148-8a31-baeb875f773a` with `status=ok`;
- temporary Cron Worker cleanup completed without a workflow warning/failure;
- evidence artifact: `shop-batch11-free-staging-evidence`,
  artifact ID `10952566305`;
- artifact SHA-256:
  `c806e8fe04ca31e6a1a3b15f63e3db8ccc49e3c7cf5782351b2aedf83e2824a7`.

After this acceptance was captured, the workflow trigger was returned to
`workflow_dispatch` only so the costly staging harness does not run on every Shop
branch push.

This acceptance closes the **safe DB-backed staging** and **real scheduler evidence**
blockers. It does not convert provisional product dimensions into production truth,
choose production PII retention, or prove the remaining full
paid→packed→Biteship→webhook integrated database flow. Free-staging run #5 then
isolated the quoted-secret formatting issue; code checkpoint `554f43027855a5b8742a016e487d6d1b951909cc`
contains the safe normalization fix and passed exact CI #2085.


### Safe resume pointer — 28 September 2026

Do **not** restart Batch 11 from the beginning. Resume from
`docs/MAINLAGI_SHOP_BATCH11_SAFE_CHECKPOINT_2026-09-28.md`.

The immediate next technical action is one manual
`Shop Batch 11 free staging` workflow run from PR #359 after the secret-normalizer
fix. Do not re-enable the push trigger. Do not create a paid Supabase branch. Do not
touch production Supabase. Production sales stay disabled.
