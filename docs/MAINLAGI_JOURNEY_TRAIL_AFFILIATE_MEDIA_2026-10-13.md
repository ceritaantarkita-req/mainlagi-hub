# Mainlagi — Journey Trail visual & affiliate photo provenance (13 October 2026)

**Status:** scoped implementation PR, not production live until exact-SHA smoke and iPhone Safari confirmation.

## Owner evidence & decisions
- Owner iPhone screenshot shows **Sains Belajar Journey Map** as oversized repeated rectangular cards linked by straight dashed rail. Wants playful, coherent kid-first path rather than a generic workflow diagram.
- Owner also reports Discover/Shopee cards now show a box and "Foto produk belum tersedia" after PR #489 and asks to use the already supplied Shopee-linked photos.

## Findings (actual source)
- `BelajarJourneyMap.tsx` is **one canonical component used by 9 Belajar subjects**. `BelajarJourneyMap.module.css` owned the old pale background + straight line + big cards. Stage semantics/order and QA are already well covered. Do not branch curriculum logic per subject to fix presentation.
- `src/lib/data/affiliate-catalog.json` has **120 entries with `image: null`** and `href: https://s.shopee.co.id/...`. The supplied short link is a **product/affiliate destination**, not an image file URL.
- Historical `public/affiliate/` images existed in an older commit but were removed by `7c9eb84d8aa64015125110e9dd7103d26cb9ed1e` ("Fail closed on unverified public affiliate assets"). `src/lib/data/affiliate-provenance.json` now has empty `items`. **Do not restore old third-party photo binaries without specific provenance/permission.**
- The owner admin `AffiliateAdminPanel` allowed creating rows with `image_url`, but did not offer editing `image_url` for existing rows. Public `products-supabase.ts` already consumes the value if it is present; blank/failed media shows honest fallback from PR #489.
- Linked Supabase projects are **not accessible through this chat session** and historic user asset locations cannot establish live `affiliate_items.image_url` values. Public product image mapping has to be verified on the live owner CMS; never claim all photos restored.

## Implementation
1. Render a single decorative winding SVG walking trail under canonical Stage buttons; scenic backgrounds for each of 9 subjects reuse existing `public/artwork/backgrounds/<subject>` assets, including `science/nature-trail-*.webp`.
2. Compact the mobile Stage footprint with visibly alternating waypoints, tactile cream card surfaces, state-specific borders/badges, themed illustrated canvas and readable long titles. Respect dark/color accessibility, viewport width 320/360/390/430 and orientation; no new external image generation or asset downloads.
3. Keep existing onClick/detail sheet semantics, current/completed/locked/progression, 9×100 activity catalog, 46 Stage canonical order, all keyboard/touch routes, World all-ages and Shop boundaries.
4. Add owner-only **Edit foto** to each Supabase-backed existing affiliate product: direct HTTPS image URL from approved Shopee Affiliate creative media, stored in existing `affiliate_items.image_url`. Block accidental use of the `s.shopee.co.id` landing URL as an image. Product redirect `/go/[slug]`, click tracking and permissions unchanged.
5. No automated extraction/scraping of third-party Shopee creative media. The Shopee Affiliate terms restrict automated harvesting. Direct media URL/official creative export or appropriately permission-cleared owner media is the required separate input for populating photos. Old removed binaries are not restored.

## Gates
- CI: 7 PR quality/security/build/mobile/Shop tests.
- Existing JM-06 browser tests check one scenic trail and background per subject, all original stage selection/locked behavior.
- iPhone Safari: verify Sains scrolling visual, 320/390 width no overflow, Stage Detail/return/progress, all nine themes; Discover grid/list fallback if image genuinely absent; admin Edit foto with actual permitted image URL and resulting Discover media; Shop unchanged.
- Production: Cloudflare build and exact commit production smoke green. Do not close original Issue #486 without owner iPhone acceptance.
