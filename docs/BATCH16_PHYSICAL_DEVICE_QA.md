# Batch 16 Physical-Device QA Matrix

Last reviewed: 11 September 2026

## Purpose

Batch 16 separates **automated regression evidence** from **representative physical-device acceptance**. A green GitHub Actions / headless-Chromium run is necessary but is not physical-device certification.

This document is the canonical manual evidence matrix for the remaining camera, audio/TTS, trace/touch, mobile-browser, accessibility, and offline/recovery checks.

## Status model

- `PASS` — exercised on the named physical device/browser with date and evidence/notes recorded.
- `FAIL` — reproducible defect exists; link the issue/PR or describe the failure precisely.
- `BLOCKED` — environment or hardware prevents the check; record why.
- `PENDING` — not yet executed on physical hardware.

Do not change a row to `PASS` solely because Playwright, desktop responsive mode, an emulator, or CI passed.

## Automated coverage already available

The repository automated suite covers, among other contracts:

- canonical route rendering at 320, 360, 375, 390, 430, 768, and 1024 px widths;
- document horizontal-overflow detection;
- phone touch-target minimums;
- representative learning runtimes;
- browser console/page-error detection;
- reduced-motion regression on representative routes;
- image alt/form-control labeling checks on representative routes;
- keyboard-focus reachability and focusable-content-inside-`aria-hidden` checks;
- prevention of eager MediaPipe/vision asset loading on non-vision representative routes;
- prevention of eager remote `/api/tts` requests before user interaction;
- production JavaScript/lazy-load budgets;
- RLS/ownership/RPC/outbox/security-boundary source regressions;
- dependency audit and full-history secret scan.

These automated checks reduce the manual surface but do not replace the physical checks below.

## Minimum representative hardware

Batch 16 requires at least:

1. one physical iPhone running current Safari available to the tester;
2. one physical Android phone running current Chrome available to the tester.

Where a defect appears device-specific, record the exact model, OS version, browser version, viewport/orientation, and whether the site was opened as browser/PWA/native wrapper.

## Guided QA harness

The production app exposes a hidden/noindex helper at:

```text
https://mainlagihub.my.id/qa/device
```

Use `/qa/device` directly on each physical phone to execute the same 22 canonical checks below. The harness:

- captures non-secret browser/device context such as user agent, viewport, screen size, DPR, touch-point count, orientation, online state, reduced-motion state, secure-context state, and camera/speech capability availability;
- records `PASS`, `FAIL`, `BLOCKED`, or `PENDING` plus free-text evidence notes for each canonical row;
- persists the in-progress checklist only in that browser's localStorage so the tester can open activity routes and return without losing progress;
- can export a local JSON evidence file or copy a text summary;
- does **not** upload QA evidence, access authentication/session data, or request camera/microphone permission automatically.

The harness is an evidence recorder, not an automated physical-device certifier. A row still becomes `PASS` only after the tester actually performs the physical test on the stated hardware/browser.

Recommended flow per device:

1. open `/qa/device` on the physical phone;
2. record device model, OS, and browser version;
3. run all relevant linked routes/tests and record the result immediately;
4. export JSON and/or copy the summary;
5. transfer the result into this matrix or issue #83;
6. never attach access tokens, child recordings, raw camera captures, or other unnecessary sensitive material.

## Physical-device acceptance matrix

| Area | Physical test | iPhone / Safari | Android / Chrome | Evidence / notes |
| --- | --- | --- | --- | --- |
| Core mobile | Open child home, learn, stage, activity, rewards; verify no clipped/hidden primary controls at normal browser zoom | PENDING | PENDING | |
| Parent mobile | Open overview, child progress, reports, certificates, privacy/settings; verify navigation and long content remain usable | PENDING | PENDING | |
| Safe areas | Verify top/bottom controls do not collide with notch/home indicator/browser chrome | PENDING | PENDING | |
| Orientation | Rotate portrait -> landscape -> portrait on child activity and `/play/math-choice`; layout and state remain recoverable | PENDING | PENDING | |
| Virtual keyboard | Focus/edit profile/settings inputs; keyboard resize must not trap controls or lose scroll/focus recovery | PENDING | PENDING | |
| Trace/touch | Complete representative guided trace with a real finger; coordinate mapping remains accurate and visible | PENDING | PENDING | |
| Trace orientation | Start/continue a trace across orientation change; surface must not retain stale coordinate geometry | PENDING | PENDING | |
| Drawing | Draw with a real finger; strokes follow touch without material offset, clipping, or scroll conflict | PENDING | PENDING | |
| Coloring | Color with a real finger; intended region interaction remains reachable and responsive | PENDING | PENDING | |
| Audio unlock | On first eligible user gesture, trigger TTS/audio; no silent dead state or repeated permission-like friction | PENDING | PENDING | |
| Audio replay | Replay listen-and-choose/TTS several times and navigate away mid-speech; old speech must stop/avoid overlap | PENDING | PENDING | |
| Audio fallback | Exercise a supported locale and verify intelligible browser/local fallback when remote TTS is unavailable | PENDING | PENDING | |
| Camera allow | Open `/play/math-choice`, grant camera, and verify live camera/motion path initializes | PENDING | PENDING | |
| Camera deny | Deny camera permission; UI must fail gracefully and remain navigable/recoverable | PENDING | PENDING | |
| Camera recovery | Background/foreground the browser or navigate away/back; camera must not remain stuck or multiply streams | PENDING | PENDING | |
| Camera orientation | With camera active, rotate device and verify overlay/interaction coordinates remain aligned | PENDING | PENDING | |
| Reduced motion | Enable OS reduced-motion setting and verify representative child/parent routes suppress non-essential long motion | PENDING | PENDING | |
| Assistive tech | Navigate key child/parent controls with VoiceOver/TalkBack; primary controls have understandable names/order | PENDING | PENDING | |
| Zoom/text size | Increase browser/OS text size where supported; critical navigation/actions remain reachable without destructive clipping | PENDING | PENDING | |
| Offline attempt | After app state is loaded, interrupt network during an eligible attempt; app must not fabricate server mastery | PENDING | PENDING | |
| Reconnect/outbox | Restore network and verify queued attempt behavior is account-bound, non-duplicating, and recoverable | PENDING | PENDING | |
| Session isolation | Switch/logout account after an offline failure; queued data must not replay into another account | PENDING | PENDING | |

## Pass criteria by subsystem

### Camera / motion

A pass requires real permission behavior, actual camera initialization, stable overlay/interaction alignment, graceful deny/failure handling, and recoverability after route/orientation/background changes. Headless Chromium without a physical camera is not sufficient evidence.

### Audio / TTS

A pass requires audible output on hardware, user-gesture unlock behavior, repeated-play behavior, route-transition cleanup, and a usable fallback path. Unit tests can validate policy/state but cannot prove physical speaker/browser voice timing.

### Trace / touch / creative surfaces

A pass requires actual finger input on a physical touchscreen. Desktop pointer emulation does not prove device-pixel-ratio, browser-chrome, orientation, or touch-scroll interaction correctness.

### Accessibility

Automated semantic checks are regression gates, not assistive-technology certification. At minimum, representative navigation and primary controls must be exercised with VoiceOver on iPhone and TalkBack on Android before Batch 16 is production-closed.

### Offline / ownership

A pass must preserve the existing rule: failed/offline participation cannot create server mastery before canonical acceptance, and account-bound queued attempts cannot cross user boundaries.

## Evidence recording rule

For every manual row moved out of `PENDING`, record enough information to reproduce the result:

```text
Date:
Device model:
OS version:
Browser + version:
Route/activity:
Orientation:
Result: PASS | FAIL | BLOCKED
Evidence: screenshot/video/log/issue reference when useful
Notes:
```

The `/qa/device` JSON export is an acceptable structured source for this information, but the canonical matrix/issue must still summarize the final accepted result.

Do not store child recordings, camera captures, access tokens, or other unnecessary sensitive data as QA evidence.

## Batch 16 closure rule

Batch 16 may be marked `COMPLETE IN PRODUCTION` only when:

- automated Batch 16 security/performance/accessibility regression gates are green on `main`;
- dependency/secret/build/mobile/Windows/Ubuntu CI remains green;
- exact-SHA Cloudflare production smoke is green;
- the representative physical-device rows required above have actual recorded evidence or an explicitly reviewed blocker;
- any FAIL rows that affect release-critical flows are resolved or explicitly accepted with rationale;
- canonical state/deployment/implementation-plan docs are synchronized.

Until then, Batch 16 remains **IN PROGRESS**, even if all automated CI checks are green.
