# Mainlagi Shop — isolated Biteship staging deployment

Status: **DEPLOYED / WEBHOOK INSTALLATION PASS — isolated Cloudflare Worker is live, Biteship testing webhook is registered, and production remains untouched.**

This staging path exists specifically to avoid using production
`https://mainlagihub.my.id` for Biteship testing.

## Deployment target

Workflow:

```text
.github/workflows/ci.yml
```

Worker:

```text
mainlagi-hub-shop-staging
```

The workflow resolves the account's existing Workers subdomain and publishes the
staging Worker to:

```text
https://mainlagi-hub-shop-staging.mainlagihub.workers.dev
```

No production custom domain is attached by this workflow.

## Required GitHub Actions secrets

Configure these in GitHub before running the workflow:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
BITESHIP_TEST_API_KEY
BITESHIP_WEBHOOK_SECRET
```

Do not commit their values.

`BITESHIP_TEST_API_KEY` must be the API key created while Biteship **Mode Testing**
is active.

`BITESHIP_WEBHOOK_SECRET` must be a newly generated random value. Do not reuse
the value that was visible in an earlier screenshot.

The runtime header name is intentionally fixed to:

```text
X-Mainlagi-Biteship-Secret
```

The workflow maps the GitHub secret `BITESHIP_TEST_API_KEY` into the Worker
runtime binding `BITESHIP_API_KEY`. It also forces:

```text
SHOP_SALES_ENABLED=false
SHOP_LOCAL_PREVIEW=false
NEXT_PUBLIC_DATA_BACKEND=mock
```

This first staging deployment is therefore sufficient for the authenticated
Biteship webhook installation boundary, but **not** a substitute for the later
database-backed full Shop staging E2E.

## Cloudflare token boundary

Use a scoped Cloudflare API token, not a Global API Key. The deployment requires
Workers Scripts write access and enough Workers read access to resolve the account
Workers subdomain.

Run **Mainlagi TV V3 CI** manually from GitHub Actions, select the Shop branch, and enable the boolean input `deploy_shop_biteship_staging`. The staging job is hard-gated to:

```text
agent/mainlagi-shop-foundation-20260927
```

and refuses to deploy when manually dispatched from `main` or another branch.

## Automatic acceptance checks

After deployment the workflow automatically verifies:

1. `POST /api/shop/biteship/webhook` with `Content-Type: application/json`
   and `{}` returns HTTP 200 with `{"ok":true}`;
2. a non-empty fake Biteship event without
   `X-Mainlagi-Biteship-Secret` returns HTTP 403;
3. `SHOP_SALES_ENABLED` remains false;
4. the production custom domain is not modified.

These checks passed in GitHub Actions run #1938 on 2026-09-27. The Biteship
Testing Mode dashboard subsequently accepted and registered the webhook using the
same staging endpoint and configured custom secret header.

## Biteship dashboard fields after staging passes

```text
Name:
Mainlagi Shop Staging

Webhook URL:
https://mainlagi-hub-shop-staging.<workers-subdomain>.workers.dev/api/shop/biteship/webhook

Events:
order.status
order.price
order.waybill_id

Headers Signature Key:
X-Mainlagi-Biteship-Secret

Headers Signature Secret:
<the same newly generated value stored as BITESHIP_WEBHOOK_SECRET>
```

Do not paste the secret into repository files, issues, PR comments, chat, screenshots
or workflow logs.

## What remains after installation

A successful webhook installation closes only the public HTTPS + signature
installation boundary.

Batch 07 still requires real Biteship test evidence for:

- approved pickup origin/contact/postal code;
- approved courier allowlist;
- real product weight/dimensions;
- real test rate lookup;
- paid + owner-packed shipment creation;
- duplicate-reference/idempotency recovery;
- webhook event plus independent Biteship GET validation;
- tracking/exception progression.

The full Batch 11 staging gate additionally still requires a database-backed safe
non-production environment. This isolated Worker must not be represented as that
full staging database.


## Verified installation evidence

- GitHub Actions run **#1938** deployed the isolated Worker successfully.
- Exact staging origin:
  `https://mainlagi-hub-shop-staging.mainlagihub.workers.dev`.
- Installation probe:
  `POST /api/shop/biteship/webhook` with JSON `{}` returned HTTP 200 and
  `{"ok":true}`.
- Unsigned non-empty event remained fail-closed with HTTP 403.
- Biteship Testing Mode accepted the webhook registration for
  `order.status`, `order.price`, and `order.waybill_id`.
- `SHOP_SALES_ENABLED=false` remained enforced.
- Production `https://mainlagihub.my.id` was not modified.

This closes the **public HTTPS + authenticated webhook installation** prerequisite.
It does not close the later database-backed full staging E2E or real shipment
acceptance.


## Sandbox API credential preflight

A non-mutating `GET /v1/couriers` preflight was added and executed after the
webhook installation passed.

Observed result on 2026-09-27:

- raw `Authorization: <secret>` -> HTTP 401 / Biteship code `40101003`;
- HTTP Basic with the secret as username -> HTTP 401 / `40101003`;
- HTTP Basic with the secret as password -> HTTP 401 / `40101003`.

No secret value was logged.

Therefore the webhook installation remains PASS, but the repository secret
`BITESHIP_TEST_API_KEY` must be replaced with a newly generated **Testing Mode
API key value** before Rates/Order API acceptance can continue. Do not substitute
the API-key label, token ID, masked dashboard value, webhook secret, or a live-mode
credential.


## Sandbox connectivity PASS

After replacing the repository secret with a newly generated Biteship Testing Mode
API key, GitHub Actions run **#1953** passed the non-mutating connectivity preflight.

Verified evidence:

- authentication succeeds with the canonical raw `Authorization: <API_KEY>` header;
- `GET /v1/couriers` returned HTTP 200;
- Biteship returned **81** courier/service rows;
- every owner-approved courier code is present;
- every owner-approved courier/service pair is present;
- `missingCouriers=[]`;
- `missingServices=[]`.

The earlier HTTP 401 / `40101003` evidence is retained as historical diagnostic
evidence only; it is no longer the active blocker.

The staging Worker must still be refreshed once after this credential rotation so
its runtime `BITESHIP_API_KEY` binding matches the newly verified Testing Mode key.


## Runtime courier allowlist

The isolated staging Worker now pins the owner-approved Biteship courier codes:

```text
BITESHIP_COURIERS=jne,jnt,sicepat,anteraja,ninja
```

This value is non-secret and must remain aligned with
`src/lib/shop/operational-policy.json`. The live Sandbox connectivity probe
confirmed that all approved courier codes and approved courier/service pairs are
available.

Rates remain intentionally blocked until owner-verified pickup/contact/address/
postal-code values and real product weight/dimensions are configured.


## Sandbox Rates API probe

The repository contains a non-mutating Biteship Rates API probe:

```text
scripts/run-shop-biteship-sandbox-rates-probe.mjs
```

It requires these GitHub Actions repository secrets:

```text
BITESHIP_ORIGIN_CONTACT_NAME
BITESHIP_ORIGIN_CONTACT_PHONE
BITESHIP_ORIGIN_ADDRESS
BITESHIP_ORIGIN_POSTAL_CODE
```

The API key continues to come from `BITESHIP_TEST_API_KEY`. Courier codes are
pinned by the workflow to `jne,jnt,sicepat,anteraja,ninja`.

The probe sends all nine testing-only DEFAULT SKUs from the sandbox fixture in a
single authenticated Rates request, so every provisional test weight/dimension is
exercised without multiplying Rates API hits. It does **not** create an order, pickup, waybill,
or real shipment. Origin contact/address values remain in GitHub Secrets and are
not committed or printed to logs.

The first acceptance request uses destination postal code `12240`, matching a
postal-code example documented by Biteship for Rates API testing. Later acceptance may add explicit
cross-city destinations after the basic Rates path passes.


## Origin runtime secret propagation

When all four origin repository secrets are present, the isolated staging deploy
automatically copies them into the Worker as encrypted runtime secrets:

```text
BITESHIP_ORIGIN_CONTACT_NAME
BITESHIP_ORIGIN_CONTACT_PHONE
BITESHIP_ORIGIN_ADDRESS
BITESHIP_ORIGIN_POSTAL_CODE
```

If any one of the four is absent, the webhook-only staging deployment remains
available but rate/order operational readiness stays fail-closed. Values are never
committed to the repository or printed by the deployment workflow.


## Secret value normalization

Origin secrets may be pasted either as raw values or with one matching pair of
surrounding single/double quotes. The staging deploy and Sandbox Rates probe strip
that outer pair before validation/use. The address also normalizes a literal
`\.` sequence to `.`, preventing shell-style escaping from becoming part of
the pickup address. Secret values remain masked and are not printed.


## Sandbox Rates acceptance PASS

GitHub Actions run **#1975** completed one authenticated, non-mutating Biteship
Sandbox Rates request after private origin secrets were configured and normalized.

Evidence:

- all **9** testing-only fixture SKUs were included in one request;
- combined testing fixture weight: **3050 g**;
- destination postal code: **12240**;
- Biteship returned **8** pricing rows;
- all five Mainlagi-approved service pairs were available as standard parcel +
  pickup services:
  - `jne/reg` — Rp60.000 — 1–2 days;
  - `anteraja/reg` — Rp69.000 — 1–2 days;
  - `sicepat/reg` — Rp48.000 — 1–2 days;
  - `jnt/ez` — Rp60.000 — 2–3 days;
  - `ninja/standard` — Rp52.800 — 2–3 days;
- no order, pickup, waybill or shipment was created;
- origin/contact/address values remained masked in Actions logs.

These prices are dated Sandbox evidence only, not a production price commitment.

The same run also redeployed the isolated staging Worker with the normalized private
origin configuration. Webhook installation probe remained HTTP 200 and unsigned
non-empty webhook events remained HTTP 403.

This closes the **Sandbox Rates transport/integration** acceptance step. It does
not convert provisional fixture weights/dimensions into verified production facts.


## Sandbox Order API acceptance design

The next bounded provider test creates exactly two Biteship **Testing Mode** orders:

- one candidate for the manual Delivered simulation flow;
- one candidate for the manual Cancelled simulation flow.

The probe refuses to run unless the configured API key has the official
`biteship_test.` prefix. It verifies:

1. `POST /v1/orders` succeeds for each simulated order;
2. `GET /v1/orders/:id` independently returns the same reference;
3. replaying the same reference returns Biteship duplicate-reference code
   `40002060` and points back to the original provider order;
4. the staging webhook verifies the configured secret header and performs its own
   independent provider GET before acknowledging the `ML-SBX-` test reference.

The staging-only `SHOP_BITESHIP_SANDBOX_ACCEPTANCE=true` boundary permits this
provider/webhook acceptance without writing to a production or staging Shop
database. It is restricted to `ML-SBX-` references and is never enabled by the
production configuration.

Biteship documents Testing Mode orders as simulated: they do not deduct balance and
do not involve real couriers. Status progression to Delivered/Cancelled is performed
manually from the Biteship Testing dashboard after the two orders exist.


## Duplicate-reference provider variance

Live Sandbox evidence on 2026-09-27 confirmed Biteship error code `40002060` for
a repeated `reference_id`, but the actual response returned `details=null`
instead of the documented `details.order_id`.

Mainlagi now handles both cases:

- when Biteship supplies `details.order_id`, the existing automatic provider GET
  recovery remains available;
- when Biteship omits the provider order ID, Mainlagi fails closed with an explicit
  manual-reconciliation requirement rather than fabricating or guessing an ID.

Therefore duplicate **detection** is provider-verified, while fully automatic
duplicate recovery remains conditional on Biteship returning the provider order ID.


## Sandbox Order API acceptance PASS

GitHub Actions run **#1991** completed the bounded Biteship Testing Mode order
acceptance job after redeploying the isolated staging Worker.

Provider evidence:

- simulated Delivered candidate:
  - provider order ID: `6ab95bf62cf339db52b93e9e`;
  - reference: `ML-SBX-DELIVER-36339411333`;
  - current provider status at creation: `confirmed`;
- simulated Cancelled candidate:
  - provider order ID: `6ab95bfa6960f5e88be36376`;
  - reference: `ML-SBX-CANCEL-36339411333`;
  - provider status after cancel API verification: `cancelled`;
- independent `GET /v1/orders/:id` verification passed;
- duplicate `reference_id` detection passed with code `40002060`;
- current Sandbox duplicate response returned `details=null`, so automatic
  recovery by provider order ID cannot be claimed for that response shape;
- staging authenticated webhook boundary plus independent Biteship provider GET
  passed for `ML-SBX-` references;
- `POST /v1/orders/:id/cancel` passed in Testing Mode;
- no real courier, production shipment or balance charge was involved.

Evidence artifact:

```text
biteship-sandbox-order-evidence
artifact id: 10938641341
sha256: 6d2b18c3d9456e61c51b9c271dfd3cfdd7a3fc19a647d71eb9561a3fb8d16c45
```

Remaining provider-status acceptance is the manual Testing Mode progression of the
Delivered candidate through the Biteship Dashboard to `delivered`, followed by
verification in Webhook Events Log. Biteship requires this status simulation to be
performed from the Testing dashboard rather than by pretending a production courier
performed the transitions.


## Biteship Events Log evidence

After manually progressing the Delivered candidate through Biteship Testing Mode,
the Biteship Dashboard Events Log showed sequential `order.status` callbacks with
HTTP **200** responses during the simulation.

User-supplied dashboard evidence on 2026-09-28 showed six visible
`order.status` events, all returning HTTP 200. This confirms provider-to-staging
webhook delivery across the manual status progression, rather than only the
synthetic authenticated callback used by CI.

The delivered order is:

```text
order id: 6ab95bf62cf339db52b93e9e
reference: ML-SBX-DELIVER-36339411333
```

The cancelled control order is:

```text
order id: 6ab95bfa6960f5e88be36376
reference: ML-SBX-CANCEL-36339411333
```

A read-only Tracking API acceptance probe independently verifies the terminal
provider state and tracking history after this dashboard simulation.


## Exception progression acceptance design

A dedicated Biteship Testing Mode order is created with an `ML-SBX-EXCEPTION-`
reference for manual provider-status simulation. The intended progression is:

```text
confirmed
→ allocated
→ picking_up
→ picked
→ dropping_off
→ on_hold
→ return_in_transit
→ returned
```

These are Biteship-defined tracking states. The Mainlagi shipment state machine
already treats `on_hold`, `return_in_transit`, `returned`, `rejected`,
`disposed`, and `courier_not_found` as exception/manual-attention states.

The candidate creation itself is automated, but exception status progression must
be performed from the Biteship Testing dashboard so Events Log evidence represents
real provider callbacks rather than synthetic local events.


## Sandbox Tracking API acceptance PASS

GitHub Actions run **#2011** completed read-only Biteship Tracking API acceptance
against the manually Delivered Testing Mode order.

Verified provider evidence:

- order ID `6ab95bf62cf339db52b93e9e` independently retrieved as
  `delivered`;
- reference `ML-SBX-DELIVER-36339411333`;
- Biteship courier tracking ID:
  `ce831eb42iNhD2rDTuGjLiMv`;
- `GET /v1/trackings/:id` returned terminal status `delivered`;
- tracking history contained exactly the observed seven-step progression:
  `confirmed → allocated → picking_up → picked → in_transit → dropping_off → delivered`;
- the order-level courier history reported the same progression;
- cancelled control order `6ab95bfa6960f5e88be36376` independently remained
  `cancelled`;
- user-supplied Biteship Events Log evidence showed sequential `order.status`
  callbacks returning HTTP 200 while the Delivered status simulation was performed.

Evidence artifact:

```text
biteship-sandbox-tracking-evidence
artifact id: 10946783117
sha256: 612c2c0e308c6be62f0af4a18d4d20020e91693e20a68cca5ab1578016537547
```

This closes the normal Delivered/cancelled tracking progression acceptance in
Biteship Testing Mode. Exception/return progression remains a separate acceptance
case.


## Exception progression verifier

The repository now contains a read-only verifier for the terminal exception/return
flow. It expects a Biteship Testing Mode order to be manually progressed through
the dashboard until `returned`, then independently verifies the provider order and
tracking object contain:

```text
on_hold
→ return_in_transit
→ returned
```

The dedicated exception candidate was created successfully in GitHub Actions run
**#2015**:

```text
order id: 6ab9c37f2e892bfc4f659778
reference: ML-SBX-EXCEPTION-36365748564
initial status: confirmed
```

Candidate evidence artifact:

```text
biteship-sandbox-exception-candidate
artifact id: 10947806212
sha256: 8844a74afb9fa4ad13c28d9c207cc09c8ee1bb146ad1d1ab426dbd881de8e52d
```

The verifier now targets this dedicated order. It performs GET requests only and
never mutates provider status itself.


## Actual returned exception candidate

Owner-provided Biteship Testing dashboard evidence showed that the order which
actually completed the return flow is:

```text
order id: 6ab95a95a555b84db1ed7f25
reference: ML-SBX-CANCEL-36338987485
dashboard status: Dikembalikan
```

This provider order originated from an earlier sandbox acceptance run and was later
used to complete the manual return simulation. The exception verifier is therefore
repointed to this real returned candidate instead of the dedicated candidate that
was accidentally progressed to Delivered.


## Final returned-order API variance

For returned order `6ab95a95a555b84db1ed7f25`, Biteship independently
reported terminal order status `returned`. The final provider tracking history was:

```text
confirmed
→ allocated
→ picking_up
→ picked
→ in_transit
→ dropping_off
→ return_in_transit
→ returned
```

The owner-supplied Testing dashboard screenshots show that the order was manually
placed into `Ditahan` / `on_hold` before `RETURN PROCESS`, and the Events Log
showed HTTP 200 `order.status` callbacks during the flow. However, Biteship's final
Tracking API history for this order no longer includes an `on_hold` row.

Acceptance therefore treats:

- dashboard/manual-flow evidence as proof of the transient `on_hold` step;
- provider Tracking API as proof of `return_in_transit → returned`;
- terminal Order API status `returned` as the final return-state authority.

The verifier intentionally does not require `on_hold` to survive in final tracking
history because the live Sandbox provider response disproves that assumption.


## Sandbox exception/return acceptance PASS

GitHub Actions run **#2043** completed the read-only verification against the
actual returned Biteship Testing Mode order:

```text
order id: 6ab95a95a555b84db1ed7f25
reference: ML-SBX-CANCEL-36338987485
terminal order status: returned
```

Provider evidence:

- the owner manually entered `Ditahan` / `on_hold` in the Biteship Testing
  dashboard before choosing `RETURN PROCESS`;
- Biteship Events Log showed the corresponding `order.status` callbacks returning
  HTTP 200 during the return flow;
- the final Order API reported `returned`;
- the final Tracking API history reported:
  `confirmed → allocated → picking_up → picked → in_transit → dropping_off → return_in_transit → returned`;
- live Sandbox provider history omitted the transient `on_hold` row after the
  return completed, so acceptance intentionally uses dashboard evidence for
  `on_hold` and provider API evidence for `return_in_transit → returned`.

Evidence artifact:

```text
biteship-sandbox-exception-verification
artifact id: 10948248815
sha256: 92f47b85e8ac2b75ee197140392b5a2c8027b3eae459620cf753c669b6047176
```

This closes the bounded Biteship Testing Mode exception/return progression
acceptance.
