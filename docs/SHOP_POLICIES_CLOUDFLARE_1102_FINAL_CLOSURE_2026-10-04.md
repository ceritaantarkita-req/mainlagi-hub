# Mainlagi Shop Policies Cloudflare 1102 — Final Closure

Date: **4 October 2026**

## Status

**CLOSED / FIXED / MERGED / PRODUCTION VERIFIED**

## Incident

After the read-only Mainlagi Shop storefront went live, the public route:

```text
https://mainlagihub.my.id/shop/policies
```

returned Cloudflare:

```text
Error 1102
Worker exceeded resource limits
```

The storefront root `/shop` itself remained healthy.

## Root cause

The Shop layout declared:

```ts
export const dynamic = "force-dynamic";
```

at the shared `src/app/shop/layout.tsx` level.

That forced every route inside the Shop subtree, including the purely public policy page, through on-demand dynamic SSR in the Cloudflare Worker.

The policy page does not require request-time personalization, cookies, authentication, Shop database access, Midtrans, Biteship, or any transaction state. Keeping it on the dynamic Worker path created unnecessary resource pressure and exposed it to Cloudflare Worker execution limits.

## Fix

PR **#470 — `fix(shop): prevent Cloudflare 1102 on policies`**:

- removed the Shop-wide forced dynamic rendering directive;
- kept Shop commerce visibility controlled by the existing runtime/sales environment flags;
- explicitly marked `/shop/policies` as `force-static`;
- explicitly preserved dynamic rendering for `/shop/cart` and `/shop/checkout`;
- extended production smoke so releases now fail unless:
  - `/shop` returns HTTP 200;
  - `/shop` contains `Koleksi Mainlagi` and `Pratinjau`;
  - `/shop/policies` returns HTTP 200;
  - `/shop/policies` contains `Belanja dengan aturan yang jelas`;
  - exact release SHA, branch, canonical site URL, data backend, and Supabase project ref still match.

## Build proof

The final PR build manifest classified:

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

So the public policy page is no longer rendered on-demand by the Worker.

## Merge and production proof

- PR **#470** final head: `7770b444e8076e057fae7c790b2f07ccdc57de79`
- PR CI **#2453 / run 37181132480 — FULL SUCCESS**
- Squash-merged as: `main@36c6a155b3e19b9aff38c5a7004c5de379c172b6`
- Merged-main CI **#2454 / run 37181842040 — FULL SUCCESS**
- **Production smoke (Cloudflare) — SUCCESS**
- Production smoke verified exact live SHA:
  `36c6a155b3e19b9aff38c5a7004c5de379c172b6`
- Canonical production:
  `https://mainlagihub.my.id`
- Canonical data backend: `supabase`
- Canonical Supabase project ref: `estvtgflwkebomsqlolv`

The smoke now exercises the policy route itself, so this failure mode is permanently release-gated.

## Scope boundary

This fix does **not** change Shop commercial readiness.

Still unchanged:

- `SHOP_RUNTIME_ENABLED=false` default;
- `SHOP_SALES_ENABLED=false` default;
- no Shop production DB migration activated;
- no production Midtrans flow activated;
- no production Biteship flow activated;
- no live checkout/order fulfillment activated;
- owner truth remains **0/9 products verified**;
- **0/27 active SKU candidates verified**;
- production PII retention remains pending.

## Operational note

Cloudflare dashboard invocation logging is not required to keep this fix working. The permanent fix is architectural: the public policy page no longer consumes the dynamic SSR Worker path.

If a future Cloudflare 1102 appears on a different route, inspect that route's dynamic rendering ownership and request-time dependencies first rather than enabling more production functionality.
