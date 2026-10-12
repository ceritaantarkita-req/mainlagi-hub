# Mainlagi — iPhone UI theme, affiliate imagery, and open World access (12 Oct 2026)

Status: implementation candidate on `fix/iphone-contrast-affiliate-world-all-ages-20261012`. **Do not claim merged, deployed or LIVE VERIFIED until PR CI, Cloudflare exact-SHA smoke, and an actual iPhone check pass.**

## User evidence and reproduction
- Safari iPhone: dark navy/space activity scene makes the dark Logic heading "Mana yang berbeda?" nearly invisible.
- Auth/parent entry: dark public top navigation makes the navy Mainlagi logo and account icon lose contrast, even while the content remains a light child/family card.
- Discover/affiliate: Shopee product card area appears as a blank/dark panel or broken image icon; title and redirect still render.
- World Catalog: age-5 demo sees 6–8 World Petualangan Uang as disabled, although the owner has now authorized **all player ages** to play every **shipped** World.

## Root causes found in source
- `src/app/layout.tsx` and `ThemeProvider.tsx` previously adopted OS dark preference whenever the visitor had no explicit saved theme. The shared bright child/family CSS is not a complete dark-mode implementation.
- Dark global CSS and garden tokens overrode the newer cream top navigation while preserving a navy image/logo.
- The general garden title contrast rule applied only to Garden's own `.title`; tap-choice Logic headers are rendered as a child component `h1`.
- `DiscoverShell` rendered `item.imageUrl` directly without any `onError` fallback; owner-controlled Supabase `image_url` may be blank, stale or blocked. Local `affiliate-catalog.json` contains null `image` values. **No Shopee images may be scraped or substituted without owner-supplied licensed assets**.
- `WorldCatalogScreen`, `MoneyWorldMapScreen`, `MoneyWorldStageScreen` hard-gated the shipped money World to ages 6–8. Core thumbnail and mobile QA also incorrectly required this restriction.

## Applied design direction (scope)
1. **Canonical Mainlagi default is light:** existing `system`/unset preferences now resolve to light even when the iPhone OS is dark; explicit manual dark selection is still available via Preferences. Public navbar/menu remains cream with navy logo/icons in both settings; menu drawer keeps keyboard/trap/close behavior.
2. **Activity contrast:** Logic garden gameplay headings have a warm translucent opaque-enough backing, dark lettering and compact padding; no change to answer scoring, audio, background artwork or game logic.
3. **Affiliate fallback:** Product listings use one `AffiliateProductMedia` owner, with a readable explicit photo-unavailable fallback for empty/failed sources in grid and list. Keep title and valid redirect. This is not recovery of the original product images. To restore real thumbnails, obtain approved licensed/owner-owned images and update the appropriate owner CMS rows.
4. **World all ages:** one shipped World, Petualangan Uang, becomes playable by **all registered child ages** in Home, catalog, map and direct stage. Ages **6–8 are content recommendation**, not a play permission. The eight unshipped Worlds remain noninteractive/locked. Existing sequential Stage progression and progress namespaces remain intact; do not introduce age-driven content morphing, change 2/8/44/89 topology, or touch Belajar mastery / Bermain Motion Engine.
5. **Auth mobile:** parent-entry hero copy no longer overlaps Gavi/Paca character artwork. No change to authentication or data.

## QA gates
- CI: secret history, Ubuntu quality, Windows compatibility, production build, dependency audit, Shop PostgreSQL staging, mobile/browser route QA.
- Browser at 390px with OS dark preference and no saved theme: `data-theme="light"`, cream header, navy account icon, menu opens/closes.
- World ages 5, 7, 9: exactly **1 playable** shipped World and **8 locked** future World concepts; map and direct first Stage accessible for 5 and 9, progress remains sequential.
- Safari real device: screenshot Home, auth/menu drawer, Logic heading, Discover grid/list, World catalog + Stage; test taps/scroll, audio, share; verify no console or image errors if accessible.
- After merge: production Cloudflare build **and** exact merge SHA `/api/health` + production smoke. Issue #486 remains open until owner iPhone acceptance.

## Boundaries
Do not alter Supabase schema/credentials, affiliate redirect/click tracking, Shop payment, child progress data, Motion Engine, animation assets, World game content or characters. No image files are fabricated or downloaded.
