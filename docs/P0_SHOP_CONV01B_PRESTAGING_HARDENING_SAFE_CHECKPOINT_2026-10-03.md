# SAFE CHECKPOINT — P0-SHOP-CONV-01B pre-staging hardening

Date: **3 October 2026**  
Status: **TECHNICALLY GREEN / PRE-STAGING HOLD / PRODUCTION UNCHANGED**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## 1. Exact safe baselines

```text
current main:                     78dbfd1439af32b3649f1c374d19d85fae1c9e3b
main CI:                          #2409 / run 37041038038 — FULL SUCCESS
main Cloudflare production smoke: SUCCESS

Shop convergence PR:              #442
PR state:                         DRAFT / OPEN
current PR head:                  b39bcac7c97b4f73a7cdc1e0dcc23eed5f657087
PR CI:                            #2410 / run 37042769752 — FULL SUCCESS
PR production smoke:              SKIPPED by design
branch vs main:                   23 commits ahead / 1 behind
changed paths:                    118

last 01A checkpoint head:          a0ba5f68d8a048c780e39f388789d6aea4268992
last 01A checkpoint CI:            #2407 / run 37035178220 — FULL SUCCESS
delta after 01A checkpoint:        1 commit / 1 file
```

The single post-checkpoint delta is:

```text
b39bcac7c97b4f73a7cdc1e0dcc23eed5f657087
test(shop): lock prelaunch navigation discoverability boundary
```

It changes only `scripts/run-shop-batch11-preflight.mjs`.

## 2. What the new hardening locks

The latest convergence head now explicitly verifies all of the following while Shop remains pre-launch:

- public `PRIMARY_NAV` does not expose `/shop`;
- Shop is not promoted into the canonical child Journey Map destinations;
- the child Journey Map keeps the Shop slot explicitly disabled;
- owner/admin Shop navigation remains conditional on `shopRuntimeEnabled()`;
- Shop API remains behind the runtime master gate;
- staging acceptance remains secret-gated;
- public sales remain independently controlled by `SHOP_SALES_ENABLED`.

This closes the remaining static discoverability gap identified after P0-SHOP-CONV-01A.

## 3. Exact CI result on current Draft head

CI #2410 on `b39bcac7c97b4f73a7cdc1e0dcc23eed5f657087` is green:

```text
Quality gate (Ubuntu)             SUCCESS
Production dependency audit       SUCCESS
Secret history scan               SUCCESS
Production build                  SUCCESS
Mobile route QA (Chromium)        SUCCESS
Windows compatibility             SUCCESS
Shop PostgreSQL staging gate      SUCCESS
Production smoke (Cloudflare)     SKIPPED on PR by design
```

The Shop PostgreSQL gate still exercises the full migration/security/RLS/RPC/concurrency path.

The regular Ubuntu gate still includes the deterministic Shop contract, migration-chain, DB, Batch 08/09/11 preflight and provider-fixture suite.

The mobile/browser gate still covers Shop browser QA and production HTTP boundaries in addition to the canonical Mainlagi responsive matrix.

## 4. Production remains unchanged

Current production/main does **not** contain the Shop runtime convergence branch.

Production is still exactly:

`main@78dbfd1439af32b3649f1c374d19d85fae1c9e3b`

with exact main CI #2409 and Cloudflare smoke both successful.

Do not interpret #442 being technically green as production deployment or release authorization.

## 5. Fail-closed contract remains mandatory

PR #442 must continue to preserve:

```text
SHOP_RUNTIME_ENABLED=false
SHOP_SALES_ENABLED=false
MIDTRANS_IS_PRODUCTION=false
Biteship Testing Mode only
no production Shop migration
no public Shop nav
no child Journey Map Shop activation
```

The disposable Batch 11 staging workflow is allowed to set:

```text
SHOP_RUNTIME_ENABLED=true
SHOP_SALES_ENABLED=false
```

only inside its isolated ephemeral staging environment.

## 6. Integrated provider staging evidence — still pending

The remaining technical evidence before any release-ready claim is a successful run of:

`.github/workflows/shop-batch11-staging.yml`

on the converged code path.

The workflow remains **manual `workflow_dispatch` only** by design. Do not add a push/PR trigger just to make it easier to run, because the workflow consumes staging/provider secrets.

It requires these repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
MIDTRANS_SANDBOX_SERVER_KEY
BITESHIP_TEST_API_KEY
BITESHIP_WEBHOOK_SECRET
BITESHIP_ORIGIN_CONTACT_NAME
BITESHIP_ORIGIN_CONTACT_PHONE
BITESHIP_ORIGIN_ADDRESS
BITESHIP_ORIGIN_POSTAL_CODE
```

The workflow itself enforces:

- Biteship Testing Mode key format;
- Midtrans Sandbox only;
- ephemeral local Supabase;
- Cloudflare Quick Tunnel;
- no public exposure of the local Supabase ports;
- random staging-acceptance secret;
- `SHOP_RUNTIME_ENABLED=true` only inside staging;
- `SHOP_SALES_ENABLED=false`;
- test-only `SHOP_ORDER_PII_RETENTION_DAYS=30`;
- explicit fixture-only production-verification simulation that must never be promoted to production truth;
- real integrated app flow through cart, rates, checkout, payment, owner pack, shipment, webhook, tracking and reconciliation;
- evidence artifact upload.

At this checkpoint the workflow has **not been dispatched from this chat**. The connected GitHub toolset exposes workflow reads/reruns but not a workflow-dispatch action, and the authorized Desktop Commander device was offline during this checkpoint. Do not claim integrated provider staging success until an actual run is observed.

## 7. Owner launch blockers remain unchanged

P0-OPEN-02B remains unresolved:

```text
physically/supplier verified products:  0/9
verified active SKU candidates:          0/27
production PII retention decision:       pending
supported production retention range:    30–3650 days
```

These are independent from the technically green convergence branch.

Marketplace candidate values and simulated Batch 11 fixture values remain non-production evidence.

## 8. Safe next boundary

The next safe action is:

```text
P0-SHOP-CONV-01C — integrated disposable provider staging evidence
```

Required sequence:

1. keep #442 Draft;
2. dispatch `shop-batch11-staging.yml` against the current convergence branch/head;
3. require the workflow to remain Sandbox/Testing only;
4. collect the resulting evidence artifact;
5. inspect every integrated stage for success;
6. if the run fails, repair only the converged branch and rerun deterministic CI;
7. do not merge #442 merely because staging passes;
8. owner-input blockers must still be resolved separately before production release authorization.

## 9. Safe resume instruction

If another chat/agent resumes:

1. fetch current `main`;
2. verify it contains this checkpoint or a known later descendant;
3. read:
   - `docs/CURRENT_STATE.md`;
   - `docs/P0_OPEN02A_SHOP_CONVERGENCE_PREFLIGHT_2026-10-02.md`;
   - `docs/P0_OPEN02B_SHOP_OWNER_INPUT_PACK_2026-10-02.md`;
   - `docs/P0_SHOP_CONV01A_FAIL_CLOSED_CORE_SAFE_CHECKPOINT_2026-10-03.md`;
   - this checkpoint;
4. inspect PR #442 and verify its current head before editing;
5. use `b39bcac7c97b4f73a7cdc1e0dcc23eed5f657087` + CI #2410 as the latest known green convergence head recorded here;
6. keep PR #442 Draft;
7. do not merge historical PR #359;
8. do not revive superseded PR #360;
9. do not claim provider staging evidence unless an actual workflow run is observed;
10. do not claim local workstation synchronization unless separately verified.

This checkpoint records remote GitHub truth only.
