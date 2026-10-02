# P0-OPEN-02A — Shop convergence preflight

Date: **2 October 2026**  
Status: **READ-ONLY TECHNICAL AUDIT COMPLETE / SAFE CONVERGENCE MAP**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## 1. Exact audit baseline

```text
current main:        ccd440c068eac9a18056999a5d0b4d08440e329d
source Shop PR:      #359
source Shop head:    9047931289e6ccd8981a35f7c79c321a24f34b59
merge base:          d85732d0cd434915c2e0650fe0468b2b8c104fea
Shop vs main:        diverged
Shop ahead:          367 commits
Shop behind:         58 commits
changed paths #359:  134
```

This audit does **not** merge, rebase, transplant, deploy, migrate, enable sales, or modify production configuration. PR #359 remains the evidence/source branch only.

## 2. Executive decision

The Shop implementation is **not safe to merge or rebase wholesale**, but its commerce core is substantially portable.

The correct convergence model is:

```text
fresh current-main branch
  + additive Shop namespaces
  + manual replay of a small set of shared seams
  + current-main package/CI/auth/navigation truth
  + full deterministic Shop tests
  + free/disposable provider staging
  + owner-supplied product truth + PII retention decision
  = future mergeable Shop release candidate
```

Do not attempt to make #359 mergeable by replaying all 367 commits.

## 3. File-level convergence map

PR #359 changes **134 paths**.

### A. Portable/additive Shop candidates — 113 paths

These are isolated or Shop-owned paths and can be reconstructed/transplanted into a fresh branch after the launch-input gate is satisfied.

#### Product assets — 27

All 27 files under:

`public/shop/products/`

They cover the 9 Shop products with three approved/draft media positions per product in the current Shop asset pack.

#### Shop test/probe scripts — 23

All `scripts/run-shop-*` files from #359, including:

- contract tests;
- migration-chain tests;
- DB/state-machine tests;
- Batch 08/09 tests;
- Batch 11 preflight;
- integrated DB-backed E2E;
- browser/HTTP tests;
- Midtrans Sandbox probes;
- Biteship Testing probes;
- PostgreSQL staging gate.

These scripts are evidence-bearing and should be retained as the Shop verification suite.

#### Shop migrations — 10

```text
20260926195237_shop_foundation.sql
20260927051000_shop_admin_workflow.sql
20260927123000_shop_batch08_state_machine_hardening.sql
20260927124000_shop_batch09_operations.sql
20260927125000_shop_batch09_pii_retention.sql
20260927130000_shop_batch09_reporting_review_exclusion.sql
20260928143000_shop_batch11_marketplace_candidate_variants.sql
20260928144000_shop_batch11_shipping_dimensions.sql
20260928145000_shop_batch11_physical_supplier_verification.sql
20260928146000_shop_batch11_verification_staleness.sql
```

Current main contains **51 existing migrations, 0001 through 0051**. The Shop timestamped migration names sort after the existing numbered chain, so there is no filename/version collision.

The #359 migration-chain test already runs the **full repository migration chain**, including 0001–0051 plus all 10 Shop migrations, under PGlite.

#### Shop components — 7

All `src/components/shop/*`.

#### Shop app/API routes — 16 additive paths

All new `src/app/shop/*`, `src/app/admin/shop/*`, and `src/app/api/shop/[...path]/route.ts` paths are absent from current main and therefore do not overwrite a current runtime owner.

The two non-additive app files are handled separately below:

- `src/app/admin/layout.tsx`;
- `src/app/games/page.tsx`.

#### Shop library — 10 additive paths

All `src/lib/shop/*` files are absent from current main and remain Shop-owned.

The only shared library path changed by #359 is `src/lib/navigation.ts`, handled separately below.

#### Dedicated Shop workflows — 2

```text
.github/workflows/shop-batch11-staging.yml
.github/workflows/shop-staging-reconcile.yml
```

They are separate from the canonical CI workflow and are the preferred home for provider/staging behavior.

#### Shop-specific docs/data — 18

Preserve the Shop-specific implementation, launch-gate, provider, product-truth, verification, staging, and machine-readable data files as evidence/reference material.

They are not production truth until their explicit verification states say so.

### B. Shared seams — manual replay only

These paths must **not** be copied wholesale from #359.

#### `.env.example`

Replay only the Shop variables onto the then-current file.

Required Shop families include:

- `SHOP_SALES_ENABLED`;
- `SHOP_LOCAL_PREVIEW`;
- staging-acceptance secret gate;
- Midtrans mode/key;
- Biteship key/origin/courier/webhook configuration;
- reconciliation secret;
- staging URL;
- `SHOP_ORDER_PII_RETENTION_DAYS`.

No real secret values belong in the repository.

#### `package.json`

Do not replace current main.

Current main uses **Next `^16.3.6`** while #359 still records **Next `^16.3.3`**.

Replay only:

- Shop npm scripts;
- `@electric-sql/pglite@0.5.8` as the Shop migration/DB test dependency.

Preserve every current-main script added after the Shop branch diverged.

#### `package-lock.json`

Do not copy the historical lock file.

Regenerate from the then-current `package.json` after adding the Shop dependency/scripts so current Next/security dependency versions remain authoritative.

#### `.github/workflows/ci.yml`

Do not copy the #359 workflow wholesale.

Current main CI is ~276 lines / 7 canonical jobs. #359 grew the historical CI to ~726 lines / 17 jobs, including several provider jobs hard-bound to the old branch name `agent/mainlagi-shop-foundation-20260927`.

Fresh convergence should:

1. keep the current main CI structure;
2. add deterministic `test:shop` coverage to the normal quality gate;
3. add the Shop PostgreSQL staging/security/concurrency gate as a required deterministic job;
4. add Shop browser/HTTP coverage in the appropriate existing browser/build gates;
5. make production smoke depend on the deterministic Shop database gate when Shop is in the release candidate;
6. **not** restore historical branch-name-triggered provider jobs;
7. keep live Midtrans/Biteship acceptance in the dedicated manual Batch 11 workflow.

#### `src/app/admin/layout.tsx`

Current owner/auth shell remains valid.

Replay only one new owner-only Shop navigation item after the current NAV array. Do not replace the file.

#### `src/lib/navigation.ts`

Do **not** replay the #359 change during technical convergence.

The old #359 patch replaced public `Skor game` with `Shop`.

Current architecture now distinguishes:

- public-site navigation through `PRIMARY_NAV`;
- child Journey Map navigation through `PlayroomShell` / `journeyHeaderDestinations()`;
- Shop as a disabled child-menu slot until explicitly activated.

Shop exposure is a release/product decision and is not part of core commerce convergence.

#### `src/app/games/page.tsx`

Do **not** replay the historical #359 change by default.

That branch added a direct `Lihat skor game` link only because #359 removed `Skor game` from `PRIMARY_NAV`. If current public navigation is not changed, this compensating patch is unnecessary.

#### `README.md`

Add canonical Shop documentation links only after the Shop docs are reconstructed on the fresh convergence branch.

Do not import stale post-Shop/Journey Map handoff language.

### C. Cross-cutting docs — never overwrite from #359

Do not copy old #359 versions of current cross-product authority files such as:

- `docs/CURRENT_STATE.md`;
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md`;
- `docs/PRODUCT_UX_NEXT_WORK_2026-09-20.md`;
- `docs/PRODUCT_DIRECTION.md`;
- `docs/KNOWN_LIMITATIONS.md`;
- `docs/MAINLAGI_ART_BIBLE.md`;
- `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`;
- `docs/SUBJECT_BACKGROUND_SYSTEM.md`;
- `docs/README.md`;
- historical post-Shop child-surface / visual-session handoffs;
- old 27 September Completion/Journey Map proposal docs.

Current Journey Map JM-00–JM-18 and P0-UIA-01 are later authority.

## 4. Commerce-core architecture audit

### Server/auth seams remain available on current main

The #359 Shop runtime depends on:

- `requireOwner()`;
- `getAdminClient()`;
- `getServerClient()`;
- current Next `cookies()`;
- the existing `IconName` contract including `tag`.

All of those required seams still exist on current main with compatible signatures.

### API boundary

`src/app/api/shop/[...path]/route.ts` centralizes:

- cart;
- shipping rates;
- checkout;
- payment session/reconciliation;
- authenticated order access;
- owner/admin mutations;
- Midtrans notification handling;
- Biteship webhook handling;
- scheduled reconciliation.

Public cart/rates/checkout remain behind `salesEnabled(request)`.

Staging acceptance is separately secret-gated and does not change `SHOP_SALES_ENABLED=false`.

### Provider security

Midtrans:

- notification signature verification uses SHA-512;
- payment state is re-read from Midtrans before applying local state;
- expected order number, amount, status and transaction identity are checked.

Biteship:

- requests are server-only;
- Testing and production API keys are environment configuration;
- webhook non-empty events require the configured secret header;
- provider order state is re-read before applying local shipment state.

### Order access

Guest order access requires the original device/order cookie token or the authenticated account that owns the order.

There is no public order lookup based only on order number/email/phone.

### Operational policy

The Shop operational-policy contract on #359 is owner-approved, but private Biteship origin values still remain runtime environment data and therefore fail closed when missing.

## 5. Database/security audit

The Shop database architecture is designed as a server-mediated system:

- Shop tables enable RLS;
- draft/unverified product rows are not publicly readable;
- sensitive operational/order tables are not granted normal public access;
- Shop mutation/RPC functions are revoked from `public`, `anon`, and `authenticated`;
- required RPC execution is granted to `service_role`;
- API mutation paths use the server-side admin client;
- owner admin actions additionally use `requireOwner()`.

The migration-chain regression explicitly verifies RPC privilege isolation and Shop RLS behavior after the full repository chain.

## 6. Product truth / activation safety

Current candidate dataset:

```text
products:                 9
candidate variants:       27
candidate stock:          79 units
physically verified:      0/9 products
verified variants:        0/27
production verification:  BLOCKED
```

The candidate dataset remains `marketplace_candidate_unverified`.

The database readiness gate requires `production_verified` plus auditable verification data.

Verification staleness is also enforced:

- editing verified product facts invalidates old verification;
- changing physical variant properties invalidates old verification;
- prior evidence is archived;
- fresh evidence is required;
- price-only edits do not invalidate physical verification.

Do not convert the marketplace candidate values into production truth without real evidence.

## 7. Physical/supplier input package required from owner

The existing verification pack already defines the required evidence for all **9 products / 27 variants**.

Product groups:

```text
001 kids white tee       5 variants
002 oversized black tee  5 variants
003 Gavi pajamas         5 variants
004 character socks      3 variants
005 navy hoodie          5 variants
006 tumbler              1 variant
007 e-money card         1 variant
008 writing notebook     1 variant
009 drawing book         1 variant
```

For each active SKU, convergence cannot claim production verification until real evidence confirms the applicable identity/specification, stock, packed weight, package dimensions, and variant measurements/facts.

Accepted verification methods in the current DB gate include:

- physical production-equivalent sample;
- supplier production sheet.

## 8. PII retention blocker

`SHOP_ORDER_PII_RETENTION_DAYS` remains an owner production decision.

Current supported range:

```text
30–3650 days
```

The Batch 11 staging value of `30` is explicitly test-only and must not be promoted as the production decision.

The runtime already supports scheduled redaction through `shop_redact_order_pii` once the production value is configured.

## 9. CI/staging convergence decision

The newer dedicated Batch 11 workflow is the preferred provider-E2E authority.

It is:

- `workflow_dispatch` only;
- based on ephemeral local Supabase;
- exposed temporarily through a Cloudflare Quick Tunnel to the local app only;
- guarded against exposing Supabase API/database ports;
- restricted to Midtrans Sandbox;
- restricted to Biteship Testing keys;
- `SHOP_SALES_ENABLED=false`;
- protected by a random staging-acceptance secret;
- using the 30-day PII value as test-only;
- able to exercise cart -> live testing rates -> checkout -> Midtrans Sandbox -> paid -> owner pack -> Biteship Testing order -> authenticated webhook -> tracking -> reconciliation;
- able to collect evidence artifacts;
- able to exercise a real temporary Cloudflare scheduled reconciliation path.

Therefore the historical provider-specific jobs embedded in #359's old monolithic `ci.yml` should **not** be brought forward wholesale.

## 10. Current technical risks to revalidate on the fresh branch

These are revalidation requirements, not current defects:

1. **Next upgrade**
   - Shop source was last proven with Next `^16.3.3`;
   - current main is `^16.3.6`;
   - fresh typecheck/build/browser/Cloudflare build is mandatory.

2. **Node compatibility on Cloudflare/OpenNext**
   - Shop server code uses `node:crypto` and `Buffer`;
   - historical Shop builds passed, but the fresh current-main Cloudflare build remains the required authority.

3. **Current Journey Map/navigation regression**
   - Shop convergence must not modify child Journey Map ownership;
   - no live child Shop destination is authorized by this preflight.

4. **Production database**
   - the 10 migrations are technically compatible in the tested chain;
   - this audit does not authorize applying them to production.

## 11. Authorized next boundary

P0-OPEN-02A is **complete**.

The next blocker-resolution package is:

```text
P0-OPEN-02B — owner launch inputs
```

It requires two real inputs:

1. physical/supplier verification data/evidence for the 9 products / 27 variants;
2. explicit production `SHOP_ORDER_PII_RETENTION_DAYS` decision.

Until those are available:

- keep #359 open as source/evidence;
- do not merge/rebase #359;
- do not apply Shop migrations to production;
- do not enable live Shop sales;
- do not expose Shop as a live child Journey Map destination;
- do not start a production release branch that claims launch readiness.

After those owner inputs exist, the first implementation package should be:

```text
P0-SHOP-CONV-01 — fresh current-main commerce-core transplant
```

with the manual shared-seam rules in this document.

## 12. Safe resume instruction

A future agent/chat should:

1. fetch current `main`;
2. verify it contains `ccd440c068eac9a18056999a5d0b4d08440e329d` or a known later descendant;
3. read:
   - `docs/CURRENT_STATE.md`;
   - `docs/P0_OPEN01_OPEN_WORKSTREAM_AUDIT_SAFE_CHECKPOINT_2026-10-02.md`;
   - this preflight;
4. use #359 head `9047931289e6ccd8981a35f7c79c321a24f34b59` only as the Shop source/evidence reference;
5. never overwrite current cross-product/Journey Map authority from the historical Shop branch;
6. do not copy `package.json`, lockfile, canonical CI, navigation, admin layout, or CURRENT_STATE wholesale;
7. do not claim Shop production readiness until both owner-input blockers are resolved;
8. do not claim local workstation synchronization unless separately verified.

This checkpoint records remote GitHub truth only.
