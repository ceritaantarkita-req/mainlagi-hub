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

The probe uses testing-only SKU `001-DEFAULT` from the sandbox fixture and makes
one authenticated Rates request. It does **not** create an order, pickup, waybill,
or real shipment. Origin contact/address values remain in GitHub Secrets and are
not committed or printed to logs.

The destination postal code is intentionally a same-zone sandbox smoke value
(`12820`) for the first acceptance request. Later acceptance may add explicit
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
