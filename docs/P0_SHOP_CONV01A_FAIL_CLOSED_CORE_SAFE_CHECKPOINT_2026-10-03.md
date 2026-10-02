# SAFE CHECKPOINT — P0-SHOP-CONV-01A fail-closed core convergence

Date: **3 October 2026**  
Status: **TECHNICALLY GREEN / DRAFT HOLD / PRODUCTION UNCHANGED**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## 1. Exact source-of-truth baseline

```text
current production/main baseline:  b1d6a2d9c7b25ff4a2bd5585dee0ebc348ce3c6f
convergence PR:                    #442
convergence branch:                agent/p0-shop-conv01a-core-transplant-20261002
convergence head:                  a0ba5f68d8a048c780e39f388789d6aea4268992
PR state:                          DRAFT / OPEN
PR mergeable:                      true
branch vs main:                    22 commits ahead / 0 behind
changed paths:                     118
deterministic CI:                  #2407 / run 37035178220 — SUCCESS
production smoke on PR:            SKIPPED (push-to-main only)
```

This checkpoint records the technically green convergence branch without merging Shop runtime into `main`.

## 2. What P0-SHOP-CONV-01A now contains

The convergence branch was rebuilt from fresh `main`, not by rebasing or merging historical Shop PR #359 wholesale.

It contains:

- the 113 Shop-owned/additive paths selected in P0-OPEN-02A;
- 27 product media assets;
- Shop public/admin/API/component/library namespaces;
- 10 Shop migrations;
- deterministic Shop contract, migration, DB, browser, HTTP, provider-fixture, Batch 08/09/11 preflight and PostgreSQL concurrency/security tests;
- dedicated Batch 11 disposable/free staging workflows;
- current-main-safe replay of package/env/admin/CI seams;
- current Next/package authority preserved rather than downgraded to the historical branch.

## 3. Additional fail-closed hardening added during convergence

After the initial transplant, the convergence branch added a **runtime master gate**:

```text
SHOP_RUNTIME_ENABLED=false
```

This is separate from:

```text
SHOP_SALES_ENABLED=false
```

When the runtime gate is false:

- public Shop routes fail closed before Shop data is rendered;
- owner/admin Shop routes fail closed before Shop database access;
- Shop API fails closed before Shop tables/providers are touched;
- the main admin navigation does not expose the Shop entry;
- normal production/main remains unaffected even if the source files exist in a branch.

The current implementation uses:

- `shopRuntimeEnabled()`;
- `requireShopRuntime()`;
- route-level `notFound()` for public/admin Shop surfaces;
- API-level runtime guard;
- owner nav gating.

The disposable Batch 11 staging workflow explicitly opts into:

```text
SHOP_RUNTIME_ENABLED=true
SHOP_SALES_ENABLED=false
```

so staging can exercise the subsystem without opening live sales.

## 4. CI result on exact head

PR #442 head `a0ba5f68d8a048c780e39f388789d6aea4268992` passed:

```text
Quality gate (Ubuntu)             SUCCESS
Mobile route QA (Chromium)        SUCCESS
Secret history scan               SUCCESS
Production dependency audit       SUCCESS
Production build                  SUCCESS
Shop PostgreSQL staging gate      SUCCESS
Windows compatibility             SUCCESS
Production smoke (Cloudflare)     SKIPPED on PR by design
```

Important implications:

- Shop contract suite passes on current main architecture;
- full repository migration chain plus Shop migrations passes;
- Shop PostgreSQL security/RLS/RPC/concurrency tests pass;
- current Next/OpenNext Cloudflare production build passes;
- current browser/mobile route matrix passes with Shop test coverage;
- Windows compatibility passes;
- dependency and secret-history gates pass.

This is **technical compatibility evidence**, not production launch authorization.

## 5. Issues found and repaired during convergence

The first CI attempts exposed test-fixture drift rather than transaction/runtime regressions.

Repairs included:

1. updating admin verification contract tests so they validate the current stronger verification UI without depending on source-code ordering;
2. upgrading PostgreSQL concurrency fixtures to satisfy the newer Batch 11 verification/dimension gate;
3. making candidate-verification preflight order-independent;
4. adding a runtime-off HTTP boundary test;
5. using the canonical build origin for production HTTP QA;
6. hiding the owner Shop admin entry while the runtime master gate is off.

The final exact head #2407 is green after those repairs.

## 6. What is still intentionally NOT done

PR #442 remains Draft.

Do not yet:

- merge #442 into `main`;
- set `SHOP_RUNTIME_ENABLED=true` in production;
- set `SHOP_SALES_ENABLED=true`;
- apply the 10 Shop migrations to production Supabase;
- expose Shop through public `PRIMARY_NAV`;
- activate the child Journey Map Shop destination;
- use production Midtrans mode;
- use production Biteship mode;
- treat marketplace candidate product values as production truth;
- claim exact production Cloudflare verification for the Shop branch.

## 7. Owner-input blockers remain unchanged

P0-OPEN-02B is still pending.

Required before release readiness:

```text
physical/supplier verified products:  0/9 -> need 9/9
physical/supplier verified variants:  0/27 -> need 27/27
production PII retention decision:     pending
allowed retention range:               30–3650 days
```

The canonical input surfaces remain:

- `docs/P0_OPEN02B_SHOP_OWNER_INPUT_PACK_2026-10-02.md`;
- `docs/data/P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json`.

Unknown real-world values must stay null/pending.

## 8. Safe next boundary

The next safe technical package is:

```text
P0-SHOP-CONV-01B — convergence release hardening / staging evidence
```

Allowed work while owner inputs are still pending:

1. keep PR #442 Draft;
2. audit exact fail-closed runtime behavior and public discoverability;
3. preserve current Journey Map ownership;
4. verify no Shop route/API touches production Shop tables while `SHOP_RUNTIME_ENABLED=false`;
5. keep deterministic CI green on every change;
6. prepare the branch for disposable integrated provider staging;
7. do not promote candidate product facts or choose production PII retention on behalf of the owner.

Integrated Midtrans Sandbox + Biteship Testing evidence must be collected against the converged code path before a release-ready claim. Production enablement remains separately blocked by the owner inputs above.

## 9. Safe resume instruction

If another chat/agent resumes from here:

1. fetch current `main`;
2. verify it contains this checkpoint or a known later descendant;
3. read:
   - `docs/CURRENT_STATE.md`;
   - `docs/P0_OPEN02A_SHOP_CONVERGENCE_PREFLIGHT_2026-10-02.md`;
   - `docs/P0_OPEN02B_SHOP_OWNER_INPUT_PACK_2026-10-02.md`;
   - this checkpoint;
4. inspect PR #442 and confirm its current head before making changes;
5. use `a0ba5f68d8a048c780e39f388789d6aea4268992` + CI #2407 as the last known green convergence head;
6. if PR #442 has moved, audit the delta before editing;
7. do not merge historical PR #359;
8. do not revive superseded PR #360;
9. keep #442 Draft until the next convergence boundary is explicitly closed;
10. do not claim local workstation synchronization unless separately verified.

This checkpoint records remote GitHub truth only.
