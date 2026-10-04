# Mainlagi Shop — Post-1102 Safe Checkpoint

Date: **4 October 2026**

## Purpose

This document is the canonical **safe pause / discussion checkpoint** after the Mainlagi Shop read-only storefront went live and the subsequent Cloudflare 1102 incident on the public policy page was fixed and production-verified.

No further runtime, database, payment, shipping, inventory, owner-input, or product-truth changes are authorized by this checkpoint.

## Exact repository / production state

Current canonical `main`:

```text
d6591ab6f82e5a8408c9eb23fffb89b9392baa93
```

Relevant merged sequence:

1. **PR #468** — integrated the Shop as a live read-only production storefront.
2. **PR #469** — synchronized canonical Shop live-closure documentation.
3. **PR #470** — fixed Cloudflare Error 1102 on `/shop/policies`.
4. **PR #471** — recorded the 1102 final closure in canonical docs.

Merged-main CI for the exact current main:

```text
CI #2456
run 37184871032
FULL SUCCESS
```

All blocking jobs passed:

- Secret history scan — PASS
- Production dependency audit — PASS
- Production build — PASS
- Shop PostgreSQL staging gate — PASS
- Quality gate (Ubuntu) — PASS
- Windows compatibility — PASS
- Mobile route QA (Chromium) — PASS
- Production smoke (Cloudflare) — PASS

Production smoke explicitly proved production serves exact SHA:

```text
d6591ab6f82e5a8408c9eb23fffb89b9392baa93
```

with:

- branch: `main`
- site: `https://mainlagihub.my.id`
- data backend: `supabase`
- canonical Supabase project ref: `estvtgflwkebomsqlolv`

## Live Shop state

### Public storefront

Live:

```text
https://mainlagihub.my.id/shop
```

Current purpose: **read-only production preview**.

Current storefront behavior:

- 9 draft products are visible;
- 27 approved preview media assets are available through the Shop catalog/detail experience;
- catalog browsing works;
- search/filtering works;
- product detail/gallery surfaces work;
- public policy/help surface is available;
- responsive Shop QA is part of the blocking CI;
- storefront is visibly marked **Pratinjau**.

### Child entry

Canonical child navigation:

```text
Menu → Shop → /shop/parent-entry
```

Boundary:

- verified parent session → continue to `/shop`;
- no parent session → production redirects to `/login?next=/shop`;
- login only accepts safe same-origin internal return paths;
- Shop is not a Belajar Journey Map destination;
- Shop does not change Belajar/Bermain/World progression ownership.

## Cloudflare 1102 incident status

Incident route:

```text
/shop/policies
```

Observed failure:

```text
Cloudflare Error 1102
Worker exceeded resource limits
```

Root cause:

- shared Shop layout forced the entire Shop subtree through dynamic SSR with `export const dynamic = "force-dynamic"`;
- the public policy page has no request-time need for auth, cookies, Shop DB, Midtrans, Biteship, or transaction state;
- therefore it was consuming the Worker dynamic SSR path unnecessarily.

Fix in PR #470:

- removed Shop-wide forced dynamic rendering;
- `/shop/policies` is now explicitly static;
- `/shop/cart` and `/shop/checkout` explicitly retain dynamic behavior;
- production smoke now fails a release unless `/shop/policies` returns HTTP 200 and contains the expected policy marker.

Final build classification:

```text
ƒ /shop
ƒ /shop/[slug]
ƒ /shop/cart
ƒ /shop/checkout
ƒ /shop/order/[number]
ƒ /shop/orders
ƒ /shop/parent-entry
ƒ /shop/payment/finish
○ /shop/policies
```

So the exact public route that failed is no longer executed as on-demand dynamic SSR.

## Production commerce boundary — DO NOT CROSS DURING DISCUSSION

The current Shop being visible does **not** mean commerce launch is authorized.

Still intentionally off / not applied:

```text
SHOP_RUNTIME_ENABLED=false   (default boundary)
SHOP_SALES_ENABLED=false     (default boundary)
Shop production DB migration: NOT APPLIED
Production Midtrans: NOT ENABLED
Production Biteship: NOT ENABLED
Live checkout: OFF
Live order fulfillment: OFF
```

Transactional Shop APIs/admin behavior remains fail-closed under the current gates.

Do not enable any of the above merely to make the preview “more complete”.

## Owner / supplier truth remains unresolved

Canonical production-truth status is still:

```text
Products physically/supplier verified: 0 / 9
Active SKU candidates verified:       0 / 27
Production PII retention decision:    PENDING
```

Candidate marketplace values and staging fixtures are not production truth.

Existing owner-input tools remain available:

```bash
npm run shop:report-owner-input
npm run shop:report-owner-input:md
npm run shop:validate-owner-input
npm run shop:validate-owner-input:ready
npm run test:shop:owner-input
```

## Historical PR cleanup

These old paths are closed and must not be revived:

- PR #359 — CLOSED / UNMERGED / SUPERSEDED
- PR #360 — CLOSED / UNMERGED / SUPERSEDED
- PR #442 — CLOSED / UNMERGED / SUPERSEDED

They may be used only as historical evidence.

## Safe discussion boundary

At this checkpoint, it is safe to discuss and decide:

- whether the Shop visual/UI needs redesign before commerce activation;
- which Shop surfaces should remain public vs parent-gated;
- how owner/supplier product evidence should be collected;
- the intended real inventory/variant truth model;
- the production PII-retention decision;
- when and how to package the eventual production-commerce activation;
- whether additional public Shop pages should be made static to reduce Worker cost/risk.

Do **not** implement the next commerce phase until a new explicit decision is made after discussion.

## Resume instruction for another agent

Start from:

```text
main@d6591ab6f82e5a8408c9eb23fffb89b9392baa93
```

Read, in order:

1. `docs/CURRENT_STATE.md`
2. `docs/SHOP_POST_1102_SAFE_CHECKPOINT_2026-10-04.md`
3. `docs/SHOP_POLICIES_CLOUDFLARE_1102_FINAL_CLOSURE_2026-10-04.md`
4. `docs/P0_SHOP_READONLY_STOREFRONT_LIVE_CLOSURE_2026-10-04.md`
5. owner-input docs referenced by CURRENT_STATE

Then **stop and discuss** before any new production-commerce implementation.
