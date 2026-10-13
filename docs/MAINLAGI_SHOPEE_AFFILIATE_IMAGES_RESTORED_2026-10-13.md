# Affiliate product-photo restoration / redirect acceptance — 2026-10-13

## Owner instruction and evidence
On 13 October 2026 the site owner directed the team to reuse the 120 historically supplied Shopee affiliate JPG photos and make each photo clickable so a click redirects to the corresponding Shopee **affiliate link**.

Before this change, commit `7c9eb84d8aa64015125110e9dd7103d26cb9ed1e` removed the binaries from the *current branch* because the prior upload did not document per-file rights, not because the images were missing from Git history. Photos existed at historical `f3eec8b61713815e76a8fe5d1c7fbc2235edc8a6`.

## Implementation
- Reuse the **original historical Git blobs** for 120 JPGs under `public/affiliate/<slug>.jpg`. No guessing, re-generation, scraping, or remote CDN scraping. Total historical image bytes ~9.1 MB.
- Match `120/120` exact `affiliate-catalog.json` slug to the photo basename and the original unique `https://s.shopee.co.id/...` link.
- Record site-owner authorization and per-product source in `affiliate-provenance.json`. **Important:** this records the owner's instruction, but does not prove an independently reviewed license from every original seller, photographer or marketplace. Third-party photo rights should still be monitored and substituted if requested by the rights holder.
- Persist `image: /affiliate/<slug>.jpg` in canonical catalog; `AFFILIATE_ITEMS` continues honoring source permission registry before displaying image.
- For Supabase-backed `affiliate_items`, use explicitly configured `image_url` first; only if absent/blank use approved local photo for the *same slug*. Supabase auth/RLS, rows, and schema are untouched.
- Every product tile already links to **`/go/[slug]`**; that server handler validates Shopee/TikTok HTTPS destination host, returns HTTP 302 to the associated `s.shopee.co.id` affiliate link, rate limits traffic, and records `affiliate_clicks` if a database row is available. Avoid direct external URLs inside product cards, preserving logging and safety. Shopee determines eventual in-app/browser experience and commission credit subject to its affiliate program, cookies, and eligibility rules.
- The screenshot's large missing-photo fallback is replaced by the actual previously supplied product image. Keep fallback for any image that fails to load.

## Automated acceptance
- `npm run validate:assets:affiliate`: provenance registry/allowed path validation plus all 120 unique basename-to-link mappings, real JPEG magic bytes, file sizes and matching registered source URLs.
- Existing mobile-route QA now tests iPhone-width actual restored image loading and corresponding `/go` 302 `Location: https://s.shopee.co.id/...`.
- Main CI: Ubuntu, Windows, production build, Chromium mobile suite, Shop PG staging, dependency audit and full history secret scan; then Cloudflare Workers build and exact SHA production smoke.
- Manual physical iPhone check remains: representative products, click and Shopee page/app destination, caching and occasional popup blockers. Affiliate *purchase attribution* cannot be claimed by QA until actually verified in the Shopee Affiliate dashboard.

## Out of scope
No change to payment checkout, Shop, World, Belajar mastery, Motion Engine, child age access, or Cloudflare settings. No external image scraping.
