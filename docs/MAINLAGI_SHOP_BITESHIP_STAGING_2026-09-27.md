# Mainlagi Shop — isolated Biteship staging deployment

Status: **PREPARED — deployment workflow is repository-ready; external Cloudflare/GitHub secrets must be configured before first run.**

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
https://mainlagi-hub-shop-staging.<workers-subdomain>.workers.dev
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

Only after those checks pass should the Biteship Dashboard webhook URL be changed
to the exact staging URL printed in the GitHub Actions job summary.

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
