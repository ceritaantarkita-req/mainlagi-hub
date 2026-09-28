# Mainlagi Shop — Batch 11 safe checkpoint — 28 September 2026

Status: **SAFE TO RESUME / DO NOT RESTART / PR #359 REMAINS DRAFT / LIVE SALES OFF**

This file is the active handoff for continuing Mainlagi Shop Batch 11. It exists so
the next agent or human does **not** restart the Shop implementation, recreate
provider acceptance, create a paid Supabase branch, or repeat already-closed QA.

## Canonical resume state

```text
repo:                  ceritaantarkita-req/mainlagi-hub
PR:                    #359
branch:                agent/mainlagi-shop-foundation-20260927
Shop code checkpoint:  554f43027855a5b8742a016e487d6d1b951909cc
reviewed main:         d85732d0cd434915c2e0650fe0468b2b8c104fea
PR state:              Draft
SHOP_SALES_ENABLED:    false
production DB changes: none from Batch 11 staging
paid Supabase branch:  DO NOT CREATE
```

The code checkpoint `554f43027855a5b8742a016e487d6d1b951909cc` passed Mainlagi TV V3 PR CI **#2085** /
run `36386147649` with Ubuntu quality, production build, PostgreSQL staging,
Windows compatibility, secret-history scan, dependency audit and Chromium/mobile
QA all successful.

This checkpoint-doc merge synchronizes the branch through reviewed main
`d85732d0cd434915c2e0650fe0468b2b8c104fea`, whose delta after the code checkpoint is SI-06B1 closure
documentation only.

## What is already closed — do not repeat

- Shop Batches 01–10 implementation/QA.
- Midtrans Sandbox acceptance from Batch 06.
- Biteship Testing Mode authentication, approved courier/service discovery and
  Rates API acceptance.
- Biteship simulated Order API create/retrieve.
- Duplicate reference code `40002060` detection; missing provider order ID fails
  closed to manual reconciliation.
- Authenticated Biteship webhook boundary plus independent provider GET.
- Delivered status simulation, HTTP 200 Events Log callbacks and Tracking API
  history.
- Cancelled control flow.
- Return/exception flow through dashboard `on_hold`, provider
  `return_in_transit → returned`, and terminal Order API `returned`.
- Free database-backed staging architecture using local ephemeral Supabase in
  GitHub Actions and a temporary Quick Tunnel for the Next.js app only.
- Real scheduled reconciliation evidence using a temporary Cloudflare Cron Worker.
- Owner operational policy: **already approved**, not an open decision.

Canonical free-staging evidence:

```text
workflow:       Shop Batch 11 free staging
run:            #4 / 36379851442
tested SHA:     525dabdabb56e048d2604cc48282f73484f3a659
result:         SUCCESS
artifact:       shop-batch11-free-staging-evidence
artifact id:    10952566305
artifact SHA:   c806e8fe04ca31e6a1a3b15f63e3db8ccc49e3c7cf5782351b2aedf83e2824a7
reconcile row:  32c97aed-fe9d-4148-8a31-baeb875f773a
row status:     ok
```

## Important diagnostic after run #4

Free-staging diagnostic run **#5** / `36384430865` failed intentionally at the
private-origin format check before starting the expensive staging path.

It established:

- `BITESHIP_ORIGIN_CONTACT_PHONE` raw secret format did not pass the strict
  optional-`+` + 9–15 digit regex;
- `BITESHIP_ORIGIN_POSTAL_CODE` raw secret format did not pass the exact five-digit
  regex;
- **owner operational-policy contract PASS**.

The likely issue is wrapper formatting retained in the GitHub secret values, not a
missing owner policy. Secret contents were not printed.

Code checkpoint `554f43027855a5b8742a016e487d6d1b951909cc` adds a safe normalization step that:

- strips CR and matching outer single/double quotes;
- trims whitespace;
- normalizes the historical escaped-dot address form;
- masks the normalized values before placing them in `GITHUB_ENV`;
- never prints the secret values.

It also removes the stale preflight assertion that incorrectly treated the
owner-approved operational policy as unresolved.

## Current remaining Batch 11 launch blockers

1. **Production product truth / sellable variants**
   - apparel 001–005: real sizes/measurements, actual stock split per variant,
     measured packed weight/dimensions;
   - SKU 006: verified physical tumbler facts required for production activation;
   - SKU 007: verified real product type/function/issuer-related facts where
     applicable;
   - provisional Sandbox fixture values must never become production truth.

2. **Production PII retention decision**
   - `SHOP_ORDER_PII_RETENTION_DAYS` still needs an explicit owner-selected value
     from 30–3650 days;
   - the `30` used by free-staging is test-only and is not an owner production
     decision.

3. **Final integrated DB-backed provider E2E**
   - technical staging can continue with testing-only SKU 008;
   - next proof is the manual free-staging rerun after normalized origin secrets;
   - then exercise the remaining integrated sequence without opening public sales:
     DB-backed cart/rates/checkout → Midtrans Sandbox → verified payment → packed
     state → Biteship Testing order → webhook/tracking/reconciliation;
   - production launch remains blocked independently by product truth and PII
     retention even if this technical E2E passes.

## Exact next action

Run **one** manual `Shop Batch 11 free staging` workflow from PR #359.

Expected boundaries:

1. local Supabase starts and the complete migration chain replays;
2. testing-only SKU 008 activates only inside the ephemeral database;
3. production-like Next.js build succeeds;
4. Quick Tunnel exposes only the app;
5. request without staging secret returns sales-disabled;
6. request with the staging secret passes the sales flag and reaches the DB-backed
   cart/rates boundary using the now-normalized origin config;
7. real Cloudflare cron produces another completed reconciliation row;
8. evidence uploads;
9. cron/app/tunnel/local Supabase are cleaned up.

If that run fails, continue from the failing step. **Do not rebuild Batch 11 from
zero.**


## 28 September continuation — integrated DB-backed E2E harness prepared

Status: **IMPLEMENTED ON PR #359 / LIVE MANUAL EVIDENCE STILL PENDING**.

The next technical slice has now been implemented without changing the production
launch boundary:

```text
integrated harness:       scripts/run-shop-batch11-integrated-e2e.mjs
harness commit:           85976b6cf7e9d1e6d39c51da19b1e4928267608b
workflow wiring commit:   39481b36fe3d03aee379cc1d47aee2a9dcdd5844
guardrail commit:         80ce980b8966b9c96adadacdc80091246db36171
syntax-check commit:      7e9d080fd66e43988cf55e2bcff4f0fc9f690d86
workflow trigger:         workflow_dispatch only
production sales:         still false
production DB changes:    none
```

The manual free-staging workflow now has one bounded integrated path using only the
existing ephemeral local Supabase + temporary Quick Tunnel staging architecture.
It is designed to prove, in one sequence:

```text
testing-only SKU 008
  -> DB-backed cart
  -> live Biteship Testing rates
  -> checkout
  -> Midtrans Sandbox Snap
  -> Midtrans Sandbox Permata simulator settlement
  -> application payment reconcile -> paid
  -> ephemeral Supabase owner login through the real /login flow
  -> existing admin/pack route
  -> existing admin/ship route
  -> Biteship Testing order + independent provider GET
  -> Biteship Tracking API
  -> authenticated application Biteship webhook
  -> application reconciliation
```

Important security/acceptance properties:

- no staging-only `pack` or `ship` bypass route was added;
- the harness creates a synthetic user only inside the ephemeral local Supabase,
  waits for its normal profile row, promotes that local profile to `owner`, logs
  in through the existing auth UI, and therefore exercises the same owner gate used
  by the real admin routes;
- the harness refuses non-`trycloudflare.com` app ingress, refuses a Biteship key
  that is not `biteship_test.*`, and refuses Midtrans production mode;
- public Shop sales remain disabled; customer mutations still require the existing
  staging acceptance secret;
- it does not run Delivered/Cancelled/Returned provider simulations again;
- it emits sanitized integrated evidence to
  `/tmp/mainlagi-shop-batch11-integrated-e2e.json` for workflow artifact upload;
- the normal Shop preflight now syntax-checks the harness and regression-locks the
  manual-only trigger, provider boundaries, existing owner-auth path and absence of
  staging fulfillment bypasses.

This implementation **does not yet mark the integrated E2E PASS**. The evidence is
valid only after the manual `Shop Batch 11 free staging` workflow succeeds on this
new harness. Until then, the previous successful free-staging/scheduler evidence
remains canonical and Batch 11 remains blocked.

The two owner/data blockers are unchanged and intentionally independent from this
technical test:

1. production product truth / real variants, measurements, stock and packed
   dimensions;
2. explicit production `SHOP_ORDER_PII_RETENTION_DAYS` selection.

### Exact next action from this continuation

Run exactly one manual **Shop Batch 11 free staging** workflow on PR #359 after the
new harness has passed normal PR CI. Do not restore a push trigger. If the
integrated step fails, continue from that failing step and preserve all already
closed Batch 01–10/provider/scheduler evidence.

## Hard boundaries

- Do not merge PR #359 yet.
- Do not set `SHOP_SALES_ENABLED=true`.
- Do not deploy Shop migrations to production as part of staging QA.
- Do not use production Supabase as staging.
- Do not create a paid Supabase development branch.
- Do not invent physical product facts from generated images.
- Do not silently choose production PII retention.
- Do not repeat already-provider-verified Biteship Delivered/Cancelled/Returned
  simulations unless a regression specifically requires it.
- Keep character/learning work from current `main` intact when synchronizing the
  Shop branch.

## Source-of-truth order for resuming

1. this checkpoint;
2. `MAINLAGI_SHOP_BATCH11_LAUNCH_GATE_2026-09-27.md`;
3. `SHOP_IMPLEMENTATION.md`;
4. `MAINLAGI_SHOP_BITESHIP_STAGING_2026-09-27.md`;
5. older Batch docs only for historical evidence.

If wording in an older Shop document says owner operational policy, Biteship
provider acceptance, safe DB-backed staging, or scheduler evidence are still wholly
missing, this checkpoint supersedes that stale wording.
