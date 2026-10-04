# P0 Shop Read-Only Storefront — Live Closure

Date: **4 October 2026**

## Status

**CLOSED / MERGED / LIVE VERIFIED**

The Mainlagi Shop storefront is now integrated into current `main` as a **production read-only preview**. This closes the repository-convergence problem without claiming production commerce launch readiness.

## Verified release

- Integration PR: **#468 — `feat(shop): integrate live read-only storefront on current main`**
- Final PR head: `83ead960a715fb60e1b1f20945a2be5280334715`
- PR CI: **#2444 / run 37176569187 — FULL SUCCESS**
- Squash-merged main: `e4e377eec0e777d7d647c83676af151306b344dd`
- Merged-main CI: **#2445 / run 37177249545 — FULL SUCCESS**
- Exact Cloudflare production smoke: **SUCCESS**
- Smoke proved production was serving exact SHA `e4e377eec0e777d7d647c83676af151306b344dd` on branch `main`, canonical site `https://mainlagihub.my.id`, data backend `supabase`, and canonical Supabase project ref `estvtgflwkebomsqlolv`.
- Production smoke also required `/shop` HTTP **200** and the rendered storefront markers **`Koleksi Mainlagi`** and **`Pratinjau`**.

## What is live now

### Public Shop preview

Canonical URL:

```text
https://mainlagihub.my.id/shop
```

The public storefront exposes the existing **9-product / 27-media** Shop preview and supports browsing behavior such as catalog cards, search/filtering, product detail pages, image galleries, policy/help links, and responsive presentation.

The storefront is deliberately labelled **Pratinjau** while transactional launch gates remain off.

### Child-mode entry

The canonical child header no longer shows a dead Shop slot. It exposes a **parent-gated** Shop entry:

```text
Menu → Shop → /shop/parent-entry
```

When a verified parent session exists, the entry continues to `/shop`. Without a parent session, configured production redirects to:

```text
/login?next=%2Fshop
```

Login accepts only safe same-origin internal `next` paths before returning the parent to Shop.

Shop is **not** a Belajar Journey Map destination and does not alter Belajar/Bermain/World progression ownership.

## Safety / launch boundary

This merge does **not** launch paid commerce.

The production boundary remains:

- `SHOP_RUNTIME_ENABLED=false` by default;
- `SHOP_SALES_ENABLED=false` by default;
- no Shop production migration was applied as part of PR #468;
- public read-only catalog uses the seed-backed preview while sales are off, so browsing does not require Shop production tables;
- Shop transactional APIs remain fail-closed while runtime/sales gates are off;
- cart/order purchase navigation is hidden in the production read-only storefront;
- admin Shop remains hidden while the master runtime gate is off;
- no production Midtrans payment flow is enabled;
- no production Biteship shipment flow is enabled.

The deterministic Shop contract suite, Shop PostgreSQL staging/security/concurrency gate, browser QA, HTTP boundary tests, production build, Windows compatibility, dependency audit, secret-history scan, and canonical mobile route QA all passed before merge.

## Owner truth remains unresolved

Read-only storefront visibility must not be confused with production product truth or sales launch readiness.

Canonical owner launch evidence remains:

- **0/9 products** physically or supplier verified;
- **0/27 active SKU candidates** verified;
- production `SHOP_ORDER_PII_RETENTION_DAYS` decision still pending.

Candidate marketplace values and staging fixtures remain non-production evidence and must not be promoted into verified `actual` fields.

The existing owner-input tools remain the next evidence path:

```bash
npm run shop:report-owner-input
npm run shop:report-owner-input:md
npm run shop:validate-owner-input
npm run shop:validate-owner-input:ready
npm run test:shop:owner-input
```

## Superseded historical release path

Draft PR **#442** is now **CLOSED / UNMERGED / SUPERSEDED** by PR #468.

The older Shop source Draft **#359** is also **CLOSED / UNMERGED / SUPERSEDED** after its useful implementation/evidence was audited and reconstructed onto current main. The dependency-bound child-surface Draft **#360** is likewise **CLOSED / UNMERGED / SUPERSEDED** because its old navigation ownership conflicts with the finalized Journey Map/header architecture.

PRs #359, #360, and #442 remain historical evidence only. None is a current release path; do not merge or rebase them.

## Canonical next step

The code-convergence and read-only storefront problem is closed.

The next Shop work is **owner/supplier evidence collection plus the production PII-retention decision**. Only after those inputs are complete should a separate production-commerce activation package be authorized to consider Shop DB migration, runtime enablement, sales enablement, real Midtrans/Biteship production configuration, and live checkout/order fulfillment.

Until then, the correct production state is:

```text
Shop browse/read-only: LIVE
Shop sales/checkout: OFF
Shop production DB migration: NOT APPLIED
Owner product truth: PENDING
```
