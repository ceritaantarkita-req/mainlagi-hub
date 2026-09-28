# SI-04 Canonical Share — Safe Checkpoint — 28 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Resume point

Continue this exact workstream. Do not restart Shared Interaction from SI-00.

```text
repository: ceritaantarkita-req/mainlagi-hub
final PR:    #367
final head:  c96a5b51a5605fab60e6d10f801d042e8ee2fd2d
merged main: a41af99f3bacde43fd32d6d530134ea2225e8c72
phase:       SI-04 — CLOSED / LIVE
next:        SI-05 — Belajar pilot runtime
```

Closed prerequisites:

```text
SI-00 — coverage audit                    CLOSED
SI-01 — orientation foundation            CLOSED / LIVE
SI-02 — canonical character presentation  CLOSED / LIVE
SI-03 — canonical Completion              CLOSED / LIVE
```

SI-03 documentation closure itself is verified on main `9e233e2a05aeb34ecc536b73fe2040aefde72a89` through CI #1988 / run `36339213956`, including exact Cloudflare production smoke.

## SI-04 objective

Centralize one canonical Share experience for the Shared Interaction system:

- server-side parent gate;
- public-safe payload resolver;
- Copy Link;
- Share Device with fallback;
- WhatsApp;
- Telegram;
- X;
- Facebook;
- Threads;
- responsive portrait / short-landscape modal;
- context-safe public URLs that never expose authenticated child routes.

## Implemented shared owners

New canonical resolver:

```text
src/lib/share/canonicalShare.ts
```

New canonical modal:

```text
src/components/CanonicalShare.tsx
src/components/CanonicalShare.module.css
```

Stable QA contract:

```text
data-canonical-share="v1"
data-share-context="belajar|world|bermain"
data-share-public-path="..."
data-share-url="..."
data-share-gate="idle|checking|allowed|denied"
data-share-provider="copy|device|whatsapp|telegram|x|facebook|threads"
```

## Privacy / URL contract

`CanonicalShareInput` intentionally accepts only public product context.

Canonical public paths:

```text
Belajar  -> /
World    -> /worlds/{encoded worldId}
Bermain  -> /play/{encoded gameSlug}
```

The resolver does not accept `childId`, account identifiers, mastery/progress identifiers, or current authenticated route URLs.

`CanonicalShareDialog` uses `window.location.origin` only to absolutize the already-resolved public path. It does not use `window.location.href`.

Dynamic World/game path segments are encoded before construction.

## Parent gate ownership

The client path is centralized in `CanonicalShareDialog`:

```text
GET /api/parent/share-gate
cache: no-store
```

The existing server route remains unchanged and remains the authority for authenticated-parent / unconfigured-local QA access.

## Belajar proof adapter

`ActivityCompletion` now owns only:

- whether the Share modal is open;
- the existing canonical Completion navigation/replay semantics.

It no longer owns:

- `/api/parent/share-gate` fetch logic;
- clipboard handling;
- Web Share handling;
- provider URLs;
- Share dialog markup;
- Share dialog styles.

The old `ActivityCompletion.module.css` was removed because its remaining contents were Share-only.

Belajar invokes:

```tsx
<CanonicalShareDialog
  open={shareOpen}
  onOpenChange={setShareOpen}
  input={{ context: "belajar" }}
/>
```

This means the child activity route and `childId` are never supplied to the Share resolver.

## Provider / fallback contract

The canonical owner centralizes:

- Copy Link -> public URL only;
- Share Device -> public title/text/url;
- unsupported/error Share Device -> falls back to Copy Link;
- WhatsApp / Telegram / X / Facebook / Threads provider URLs.

Provider text remains generic and public-safe. No child name, age, account, mastery, private progress, or child-route identifier is included.

## Explicit migration boundary

SI-04 **does not migrate World or Bermain yet**.

Preserved for later sessions:

```text
MoneyWorldExperience.tsx::WorldStageCompletion Share -> SI-10
GameShell.tsx -> ShareButton.tsx gameplay Share      -> explicit Bermain migration/retirement decision
RoundEndOverlay completion Share                     -> SI-07/SI-08/SI-09
```

World still has its existing parent-gated duplicate Share until SI-10. This is deliberate sequencing, not an SI-04 failure.

The gameplay-header Share remains deliberately identifiable because SI-00 decision D3 still requires either retirement when achievement Share lands or explicit retention for a different non-achievement purpose.

## Regression updates

SI-03 static regression was updated so it no longer requires the temporary legacy Share owner inside `ActivityCompletion`; it still proves `CanonicalCompletion` itself does not absorb Share provider/gate logic.

SI-01 and SI-03 browser regressions now assert the canonical SI-04 marker/gate rather than legacy copy text.

## New SI-04 QA

Static:

```text
scripts/run-si04-canonical-share-tests.mjs
npm run test:learning:si04-share
```

It locks:

- canonical modal/gate/provider ownership;
- public-path resolver for Belajar / World / Bermain;
- no private child fields in resolver API;
- no `window.location.href` in canonical Share;
- ActivityCompletion no longer owns provider/gate logic;
- World and GameShell remain intentionally unmigrated.

Browser:

```text
scripts/run-si04-canonical-share-browser-tests.mjs
npm run test:ui:canonical-share
```

Representative Belajar completion route:

```text
/child/demo-gian/activity/letters-match-case-cd
```

Browser acceptance covers:

- parent gate resolves allowed in local QA;
- canonical marker/context/public path;
- absolute Share URL is site origin `/`, never child route;
- provider order Copy / Device / WhatsApp / Telegram / X / Facebook / Threads;
- provider hrefs exclude `childId` and activity ID;
- >=44px provider targets;
- modal heading focus;
- Copy Link writes public URL only;
- Share Device receives public URL only;
- portrait -> landscape -> narrow portrait keeps Share open;
- modal remains inside SI-01 visual viewport;
- Completion remains mounted behind Share;
- opening/using Share does not mutate completion progress.

The new static test is wired into `test:learning`; browser acceptance is wired into the permanent mobile-route gate immediately after SI-03.

## Final verification

SI-04 passed the full closure sequence:

```text
PR:                     #367 — merged
final PR head:          c96a5b51a5605fab60e6d10f801d042e8ee2fd2d
final PR CI:            #1999 / run 36341904495 — FULL SUCCESS
merged main:            a41af99f3bacde43fd32d6d530134ea2225e8c72
merged-main CI:         #2000 / run 36342644695 — FULL SUCCESS
Cloudflare smoke:       SUCCESS — exact merged main SHA verified
```

Final PR CI proved:

- Ubuntu quality gate — PASS;
- Windows compatibility — PASS;
- production build — PASS;
- dependency audit — PASS;
- secret-history scan — PASS;
- Chromium mobile-route matrix — PASS;
- permanent visual product baseline — PASS.

Merged-main CI #2000 repeated the full matrix and the Cloudflare production smoke verified the exact merged SHA `a41af99f3bacde43fd32d6d530134ea2225e8c72`.

Two pre-closure regressions were test/harness issues, not a privacy-boundary rollback:

1. CI #1997 caught React 19 lint errors from synchronous state updates inside effects; the modal was changed to derive origin from open state and schedule gate reset outside the synchronous effect body.
2. CI #1997 also proved the dedicated SI-04 browser test itself passed, then a later permanent mobile-route assertion failed because it still expected the legacy Belajar Share copy. That stale assertion was updated to the canonical SI-04 marker/gate/public-path contract.

The final head `c96a5b51a5605fab60e6d10f801d042e8ee2fd2d` then passed CI #1999 in full before merge.

## Non-scope

Do not expand SI-04 into:

- SI-05 Belajar specialized pilot;
- mass Belajar migration;
- World completion/share migration;
- Bermain RoundEnd migration;
- gameplay-header Share retirement decision;
- AirBoard completion semantics;
- Journey Map;
- Shop;
- learning attempt/evidence/mastery/progression changes.

## Closure state

SI-04 is **closed / merged / live verified**.

Do not reopen canonical Share architecture during SI-05. The next authorized Shared Interaction phase is:

`SI-05 — Belajar pilot runtime`

SI-05 must reuse the live canonical Completion + Share owners, preserve existing `completeActivity` / attempt / evidence semantics, and migrate exactly one representative currently-inline Belajar renderer before any SI-06 batch work.
