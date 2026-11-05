# P2 — cross-device release QA, 4 November 2026

**Status:** QA-only review proposal. Do not claim mobile/Safari certification until original evidence is inspected and physical devices tested.
**Base:** `main@363c1dbc069d50833564a03ad06b4a7c3894847d` (VSG-15 merged/live; VSG-16 #553 is a separate draft).
**Canonical physical matrix:** `docs/BATCH16_PHYSICAL_DEVICE_QA.md`.
**Manual evidence harness:** `https://mainlagihub.my.id/qa/device` (noindex, local-only results).

## What was already covered

The existing `Mobile route QA (Chromium)` checks 320/360/375/390/430/768/1024 widths and extensive learning runtimes, a permanent 390/768/1280 visual baseline, keyboard/focus/aria-hidden constraints, route and lazy-loading checks, and protected Stage progression. This is strong automated Chromium evidence, but **not native iPhone Safari, Android Chrome, or representative physical-device acceptance**.

The physical-device harness has **22 test rows** for child/parent navigation, safe areas, portrait↔landscape, keyboard, trace, drawing, coloring, audio unlock/replay/fallback, camera allow/deny/recovery/orientation, reduced motion, VoiceOver/TalkBack, text zoom, offline/outbox and account isolation. The existing canonical matrix remains **PENDING** without actual hardware evidence.

## New P2 automation (QA only)

Files:
- `scripts/run-p2-cross-browser-qa.mjs`
- `.github/workflows/p2-cross-browser-qa.yml`

Two independent CI jobs: **headless Chromium** and **headless Linux WebKit**. Each runs the built production Next.js app against a local data backend; no public/production writes, no auth or runtime/config changes.

**Eight representative routes:** public root, child profile selector, child home, Math Journey Map, basic Math activity, Parent report, Shop, and the 22-row device QA harness.

**Screen sizes:** 320×720, 390×844, 430×860, 768×1024, 1024×768, 1280×800, 1440×900; plus landscape 844×390 for child home, Math activity, Parent report and Shop.

**Per-engine expected evidence:** 8 routes × 7 standard viewports + 4 short-landscape screens = **60 checks**. Screenshot exports: 8 routes × four representative widths (320/390/768/1280) + 4 landscape = **36 per engine**, **72 images across both browsers**. A `manifest.json` per browser records exact route, HTTP status, heading visibility, horizontal document overflow, reduced-motion preference, script errors, viewport, screenshots and PASS/FAIL details.

Hard assertions check HTTP 200, no redirected/cached login instead of target route, real visible `main` and `h1`, meaningful content, no document-wide horizontal overflow, no uncaught JS errors, and minimum 44px control targets in the Math activity header. Existing Stage/mastery protections are deliberately left in place.

**Limitation:** Linux WebKit is useful cross-engine evidence, **not** iOS Safari. Emulator/CI input is not real-finger touch, native browser safe-area chrome, dynamic text zoom, VoiceOver/TalkBack, camera permissions, audible TTS, device battery/performance, or offline account reconciliation.

## Real-device acceptance — still required

Use the canonical harness `/qa/device` on **one physical iPhone (Safari)** and **one physical Android phone (Chrome)**; do not assign PASS without performing each test. Record device model, OS, browser version, viewport/orientation, test route, date, outcome and evidence notes. Review the 22 canonical rows; particularly:
- iPhone Safari: viewport/notch/home indicator, orientation recovery, scroll/keyboard, actual finger tracing/drawing/coloring, voice unlock and VoiceOver.
- Android Chrome: equivalent touch/resize/permissions, TalkBack, native back behavior and camera/motion lifecycle.
- Both: offline → reconnect queue ownership, no double attempts, no server mastery before canonical acceptance, session isolation.

Export JSON from harness and use tracker issue #83 / `docs/BATCH16_PHYSICAL_DEVICE_QA.md` for accepted manual results. No child recordings, camera captures, tokens, or sensitive data in QA artifacts.

## Release and follow-up rules

1. Do not merge a QA-only PR unless both browser CI jobs succeed or documented failures are resolved.
2. Review actual generated PNGs at native scale for first-action visibility, contrast, tap area, hidden overlays, text clipping and scene legibility; passing structural assertions **does not** prove child comprehension.
3. Keep P1 `#553` draft separate; its three Subitizing configurations require their **own** 44 screenshots and exact-head CI. A successful P2 smoke test cannot substitute for VSG-16 release acceptance.
4. Leave production `main` unchanged until review and protected merge. After any merge, verify exact-SHA main production smoke; physical Safari/Android remains separate.
5. Keep 900/900 classified across 47 patterns distinct from 900 manually reviewed activities. P2 covers representative screens, not every game or family.

**Current acceptance snapshot:** automated P2 head CI not yet verified on first authoring. Physical iPhone Safari and Android Chrome tests remain PENDING until genuine device evidence arrives.
