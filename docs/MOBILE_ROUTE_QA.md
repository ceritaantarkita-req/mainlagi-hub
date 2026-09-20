# Mainlagi Mobile Route & Visual Product QA

Last reviewed: **20 September 2026**

This document describes the blocking Chromium QA inside `Mobile route QA (Chromium)`. It complements `MOBILE_DESIGN_SYSTEM.md`, `MOBILE_ROUTE_MATRIX.md`, `MAINLAGI_ART_BIBLE.md`, `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`, and the external physical-device matrix in `BATCH16_PHYSICAL_DEVICE_QA.md`.

## Blocking browser gates

The CI job builds the local production Next.js app once, then runs:

```text
scripts/run-mobile-route-browser-tests.mjs
scripts/run-visual-baseline-browser-tests.mjs
```

The first script is the broad responsive/runtime/accessibility/lazy-load gate. The second script is the permanent whole-product exact-path screenshot/evidence gate. Both must pass before the `Mobile route QA (Chromium)` job is green. On `main`, `Production smoke (Cloudflare)` depends on the blocking CI chain.

VQA-01 was originally established by PR #156. PR #162 strengthened the production-live permanent route set from 14 routes / 42 captures to **21 routes / 63 captures** and was independently verified on merged main `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 including exact Cloudflare release smoke.

## Broad responsive route matrix

The broad route matrix continues to exercise:

- 320×720
- 360×800
- 375×812
- 390×844
- 430×860
- 768×1024
- 1024×768

It covers child entry/profile selection, child home/library/subject/stage/activity/games/rewards, Parent routes, global game catalog/detail and `/play/math-choice`.

At 320px and 430px it also opens representatives for `tap_choice`, `listen_and_choose`, `matching`, `trace`, `story`, `coloring`, and `drawing`. A 390×844 reduced-motion pass checks representative accessibility and lazy-loading behavior.

Per-route assertions include non-error navigation, meaningful content, route-boundary presence where applicable, no Next.js error overlay, no document horizontal overflow, phone touch-target sizing for child-facing controls, no uncaught page errors, and no browser console errors.

Important boundary: the broad matrix does **not** provide permanent visual evidence for all account subpages. PR #162 discovered this gap and explicitly added every migrated account route to the exact-path permanent baseline rather than treating broad coverage as sufficient.

### WS-13 parent-route extension

PR #251 extended the broad route harness for the redesigned parent shell and root dashboard. The blocking checks now also protect:

- family/demo separation on parent root;
- exactly five primary mobile parent destinations;
- fixed mobile parent navigation below 760px;
- hidden mobile nav / visible sidebar at desktop breakpoint;
- parent settings links to Profiles, Privacy & AI, and Plan;
- parent-root screenshots at 320 / 390 / 768 / 1024 for manual review.

Accepted evidence:

```text
PR head:        1c2017e28c8c74b6cdf50adad07b59511a3c3d56
PR CI:          #1159 / run 35520233825 — success
main:           77bee682f84b5d68b85d2c91b1d6f2ca4c93d2d9
main CI:        #1160 / run 35520629179 — success + exact Cloudflare smoke
artifact:       10608044389
manual review:  320 / 390 / 768 / 1024 accepted, no P0-P1 blocker
```

The 768 screenshot review caught an overly narrow two-column hero before merge. The fix deliberately keeps tablet hero content stacked and moves the wide composition to a larger usable-width breakpoint. This remains a precedent that breakpoint correctness includes readable composition, not only absence of overflow.

## Permanent visual product baseline — live production contract

Source:

```text
scripts/run-visual-baseline-browser-tests.mjs
```

Canonical viewports:

```text
390×844
768×1024
1280×800
```

Each run captures **21 canonical routes × 3 viewports = 63 deterministic screenshots**:

1. public root `/`;
2. child profile selection `/child/select`;
3. child home;
4. Math subject/gallery;
5. Math Angka stage/readiness;
6. representative Garden activity `math-count-3`;
7. rewards;
8. Parent Report;
9. account root `/account`;
10. `/account/profile`;
11. `/account/players`;
12. `/account/preferences`;
13. `/account/security`;
14. `/account/delete`;
15. `/account/about`;
16. login;
17. signup;
18. forgot-password;
19. reset-password;
20. deterministic expired-auth-link error;
21. canonical not-found probe.

Every capture blocks on:

- exact expected final pathname, so a progression/auth redirect cannot count as screenshot PASS;
- expected HTTP status (`404` is explicit only for the not-found probe);
- meaningful body content;
- `<main>` landmark;
- top-level heading;
- expected `MobileRouteBoundary` where the route family has one;
- absence of Next.js framework error overlays;
- absence of horizontal document overflow;
- phone touch-target minimums for child-facing baseline routes;
- zero uncaught page errors;
- zero unexpected browser console errors.

Additional product-specific assertions include:

- public family entry marker, exactly one child CTA and one parent CTA, optional-camera copy, CTA target height;
- Parent Report primary-copy jargon guard;
- subject journey tablet/desktop geometry;
- stage readiness, recommendation and lesson-grid geometry;
- account-root family/settings markers and destination geometry;
- all six account subpages expose the shared account-section shell/panel and readable tablet/desktop panel geometry;
- account-preferences controls remain sufficiently numerous and >=44px high;
- login/signup/forgot/reset auth form modes and controls;
- callback error status marker;
- canonical not-found system-state and CTA markers.

The screenshot artifact lives under:

```text
.mobile-route-qa/visual-baseline/
```

The suite writes `manifest.json` containing viewport, requested path, expected path, final path, HTTP status, and screenshot filename for every capture. CI uploads the directory inside the existing `mobile-route-qa-screenshots` artifact.

The permanent gate is intentionally **not** a brittle pixel-perfect image-diff gate. Structural/browser assertions are blocking; screenshots and the manifest are the permanent evidence surface for human/AI visual review against the Art Bible. Visual changes must still be inspected at actual screenshot scale.

## Intentional 404 browser-console rule

The deliberate not-found probe correctly returns HTTP 404. Chromium also emits the normal document-load console error:

```text
Failed to load resource: the server responded with a status of 404 (Not Found)
```

The suite allows **only that exact string and only when the route contract explicitly expects HTTP 404**.

This does not weaken the general browser-error gate:

- the not-found probe still must return exact 404;
- it must remain on the exact expected pathname;
- main/H1, overlay, overflow and page-error assertions remain blocking;
- unrelated console errors on that route still fail;
- all normal status-200 baseline routes still require zero console errors.

## Exact-path boundary

The older broad mobile route harness may intentionally probe redirect aliases such as `/child`. The permanent visual baseline applies exact-path assertions to canonical screenshot surfaces rather than pretending every historical alias must remain a non-redirect.

Any route selected as permanent visual evidence must declare its expected canonical pathname. An unintended redirect on such a route is a test failure.

## Evidence history

### Original VQA-01 establishment

PR #156 established the first stable whole-product baseline at 14 routes / 42 captures. Historical artifact evidence remains valid for that establishment point.

### PR #162 strengthening

CI #779 first proved the residual-token implementation with 17 routes / 51 captures. Coverage review then found four migrated account subpages were not represented by the broad harness, so the permanent route set was strengthened again before closure.

CI #780 / run `35136551735` proved 21 routes / 63 captures and produced artifact `10464045751`. Manual review caught an empty white card on the security stub despite green structural checks. That screenshot finding was treated as a real defect, not waived.

Commit `923635645c164f08e9d26cc84be0b527d0e13ae0` fixed the empty-panel visual root cause without adding security functionality or changing route behavior.

CI #781 / run `35137266315` then passed the complete PR gate on that exact implementation head.

Accepted implementation artifact:

```text
name: mobile-route-qa-screenshots
id: 10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200 captures
3 intentional HTTP 404 captures
0 missing screenshot files
```

Final PR #162 candidate-doc head `38b9eb7920d1e6796384b889f928dfcbf4d7e629` passed CI #787 / run `35138385672`, then clean-gated and squash-merged to:

```text
2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

Independent main CI #788 / run `35168877485` passed the broad route matrix, permanent visual baseline and exact Cloudflare release/public smoke.

Merged-main production artifact:

```text
name: mobile-route-qa-screenshots
id: 10476008006
digest: sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c
head SHA: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

The 21-route / 63-capture gate is therefore a **live production contract**, not candidate-only evidence.

## Manual screenshot precedent

Automated structural success is necessary but not sufficient. #780 demonstrated this directly: no-overflow and structural assertions were green, yet the security stub contained a visibly false empty card. The defect was discovered through screenshot review and fixed before acceptance.

Changed product surfaces must continue to be reviewed at actual screenshot scale even when the automated baseline is green.

## Artifact rules

Screenshots are evidence, not source assets. They are uploaded by CI and are not committed as product artwork.

Stable filenames use:

```text
<width>x<height>-<surface-name>.png
```

Examples:

```text
390x844-public-root.png
768x1024-stage-math-angka.png
1280x800-account-security.png
```

## What this automation does not prove

A green Chromium matrix does not replace physical-device acceptance. The following remain external evidence items:

- iOS Safari and Android Chrome browser chrome/safe-area behavior;
- virtual keyboard resizing and focus recovery;
- real camera permission/orientation/recovery;
- real finger precision on trace/drawing/coloring;
- audible audio/TTS unlock and cleanup;
- VoiceOver/TalkBack;
- real offline/network-interruption behavior.

Canonical manual evidence remains `BATCH16_PHYSICAL_DEVICE_QA.md`.

## Release gate

A visual implementation candidate is not called live-closed from a PR run. The required sequence remains:

1. exact-head PR CI including broad and permanent Chromium gates;
2. manual artifact review;
3. clean exact-head merge;
4. independent `main` CI;
5. exact Cloudflare release and public smoke on the merged SHA;
6. canonical live-closure documentation.

PR #162 completed all six product-verification steps through main CI #788. The live-closure documentation itself is still subject to its own PR CI, clean merge and independent main smoke before documentation synchronization is considered complete.