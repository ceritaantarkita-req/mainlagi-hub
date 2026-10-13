# Mainlagi iPhone Safari — full-bleed and scroll-end continuity (13 October 2026)

## Owner report
Physical iPhone Safari screenshots at 13:29–13:30 WIB show a blank cream strip below an illustrated `bahasa-cari-a` Garden activity, and a blank cream/plain strip after "Lihat semua aktivitas Bahasa Indonesia" at the end of a Journey Map. Owner reports the same behavior across the system. Treat this as a shared viewport/shell bug, not as a request to crop background art, hide scroll, or change learning content.

## Actual source causes
- The child `MobileFoundation` root uses `--ml-viewport-height` based on Safari `visualViewport.height`. The nested `PlayroomShell` and `GardenActivityFrame` independently sized themselves at `min-height:100dvh` and did not stretch their painted child surface into surplus wrapper space. If Safari changes browser toolbar size, the viewport/layout heights can diverge; outer `--paper:#fffcf0` becomes visible.
- Each activity has an additional `.immersive` wrapper painted `#fffaf0`, previously not stretching its directly-rendered Garden scene. That cream background can appear below the game artwork.
- Public `.app-shell__main` independently requested **another** `100dvh` after the sticky header, plus an obsolete fixed **82px bottom-nav safe-space** on phones. The current navbar uses a top menu drawer, not this retired bottom nav. That creates unnecessary scroll-end gutter for public pages.
- The shared Journey Map ends in mobile `34px` internal padding; reduced to a small safe-area-responsive gap but preserved comfortable scrolling and touch targets.

## Fixed boundary
1. `PlayroomShell` is now a full-height flex column consuming the same `--ml-viewport-height` as its `MobileFoundation` ancestor. Its route child stretches into any remaining height; it never paints an exposed cream tail behind a short background scene.
2. `GardenActivityFrame` uses the shared viewport-height signal. The activity `.immersive` wrapper is a flex column; its own Garden `main` stretches to the wrapper bottom.
3. Public `AppShell` allocates remaining viewport space *after* the global top navbar and no longer reserves a nonexistent mobile bottom dock.
4. Keep World and Bermain native scene colors, stage progress, games, completion/share, all music/audio controls and wide-screen behaviors unchanged. No fixed heights, `overflow:hidden` scrollbar hacks, body-wide background forcing, or child scoring/data changes.

## Required QA
- Browser test with two phone heights (390×844 and 390×1180) scrolls to end of Home, Bahasa Journey, Garden activity, World, Bermain, public Home and Discover. Asserts no exposed parent bottom below its actual painted child surface; no horizontal overflow; the obsolete public footer dock padding is 0.
- Existing full Mobile Route browser suite (320–1024 widths), Ubuntu, Windows, cloud build, Shop PostgreSQL gate, secrets and dependency audit must be SUCCESS before merge.
- Cloudflare Workers production build and exact merged SHA smoke must succeed before live claim.
- Owner then repeats scroll-end check on real iPhone Safari (normal browser toolbar, collapse/expand, portrait rotation), including long scrolling journey and 3-star completion overlay; keep Issue #486 open until device acceptance.
