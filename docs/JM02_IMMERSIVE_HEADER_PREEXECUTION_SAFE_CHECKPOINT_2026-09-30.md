# JM-02 — Immersive Mainlagi Header pre-execution safe checkpoint

Date: **30 September 2026**  
Status: **SAFE CHECKPOINT / MERGED / LIVE VERIFIED / JM-02 NOT IMPLEMENTED YET**  
Workstream: **Phase C — Canonical Journey Map System**  
Pre-checkpoint baseline: `main@640ce8f187259ae47010d7a039213263bc3c7b3e`  
Safe-checkpoint main: `main@bd93ffaa92521c55f2414d13f44a62fcf022d865`

## 1. Why this checkpoint exists

JM-00 and JM-01 are already closed. Before changing the shared child header, this checkpoint freezes the exact current ownership, route behavior, boundaries, and unresolved Shop decision so a later agent does not accidentally redesign the wrong shell or expose an adult/public commerce surface inside child learning.

No runtime code is changed by this checkpoint.

## 2. Verified baseline before JM-02

JM-01 runtime:

```text
runtime PR:               #411
runtime main:             756e3bd7bb24588041a3644f08018783e7b3b0f2
PR CI:                    #2319 / run 36716608349 — SUCCESS
merged-main CI:           #2320 / run 36717855442 — SUCCESS
```

JM-01 docs closure:

```text
docs PR:                  #412
docs main:                640ce8f187259ae47010d7a039213263bc3c7b3e
PR CI:                    #2321 / run 36722128614 — required PR gates SUCCESS
merged-main CI:           #2322 / run 36723699284 — FULL SUCCESS
Production smoke:         SUCCESS — exact merged main SHA
```

CI #2322 passed Secret history scan, Production build, Production dependency audit, Quality gate (Ubuntu), Windows compatibility, Mobile route QA (Chromium), and exact Production smoke (Cloudflare).

## 2A. Safe-checkpoint merge verification

The pre-execution checkpoint itself is now merged and live verified:

```text
checkpoint PR:             #413
checkpoint PR head:        b830a1f4d47dc896a5a79a22fa94da01d78ca8d6
PR CI:                    #2323 / run 36727660551 — required PR gates SUCCESS
merged checkpoint main:   bd93ffaa92521c55f2414d13f44a62fcf022d865
merged-main CI:           #2324 / run 36729548045 — FULL SUCCESS
Production smoke:         SUCCESS — exact merged main SHA
```

CI #2324 passed Production build, Quality gate (Ubuntu), Windows compatibility, Secret history scan, Mobile route QA (Chromium), Production dependency audit, and exact Production smoke (Cloudflare).

This checkpoint is therefore the safe resume authority before any JM-02 runtime/header implementation.

## 3. Canonical child-shell ownership

The active child route shell is:

```text
src/app/child/[childId]/layout.tsx
  -> WorldChildShell
      -> PlayroomShell
```

Canonical visual/navigation owner:

- `src/components/learning/Playroom.tsx`
- `src/components/learning/Playroom.module.css`

Do not edit similarly named historical/legacy presentation components as the JM-02 source of truth unless route tracing proves they are active.

## 4. Current header behavior before JM-02

Current `PlayroomShell` header contains:

- Mainlagi wordmark linking to child Home;
- top navigation:
  - Belajar
  - World
  - Bermain
- profile disclosure/menu;
- profile actions:
  - Ganti profil anak
  - Koleksi bintang
  - mute/unmute
  - Pengaturan orang tua
  - Akun keluarga

Current immersive suppression rule:

```text
/activity/*
/world/*/stage/*
```

Those routes hide the Playroom header because their activity/stage runtimes own immersive chrome.

Current child navigation routes:

```text
Belajar -> /child/:childId/home
World   -> /child/:childId/worlds
Bermain -> /child/:childId/games
```

Current mobile behavior:

- header wraps;
- three navigation items become a full-width grid;
- profile menu becomes a fixed bottom-sheet style panel;
- touch targets and focus-visible behavior already exist.

## 5. JM-02 authorized target

JM-02 is authorized to implement the shared immersive Mainlagi header with:

- **Kembali**
- compact Mainlagi logo
- profile/menu
- expandable product navigation:
  - Belajar
  - Bermain
  - World
  - Shop
- desktop behavior
- touch behavior
- keyboard behavior

JM-02 is a header/navigation session only.

It must **not** begin:

- JM-03 Bahasa Inggris desktop map;
- Stage popup/detail behavior;
- Journey Map coordinates/art;
- responsive Journey Map geometry;
- Petualangan Uang map redesign;
- curriculum/progression changes.

## 6. Critical Shop boundary discovered before implementation

There is currently **no canonical child `/shop` route** in the active child route tree.

Existing commerce/affiliate surfaces belong to public/adult product areas, and current product-direction documentation explicitly keeps affiliate shopping out of child-learning CTA flow.

Therefore JM-02 must **not invent a child Shop destination** and must not route a child header item directly into affiliate shopping.

Safe rule:

```text
Shop label may not become a live child-learning navigation target
until the separately owned Mainlagi Shop route/product boundary is explicitly resolved.
```

This is not a blocker for implementing the rest of JM-02. The header can be designed so the Shop slot is feature-gated/omitted/disabled according to an explicit product decision, but no destination may be fabricated in this session.

## 7. Existing accessibility contract to preserve

JM-02 must preserve or improve:

- minimum 44px touch targets;
- visible keyboard focus;
- semantic navigation landmark;
- accessible names for icon-only controls;
- profile disclosure operable by keyboard;
- Escape/outside-close behavior if custom disclosure logic replaces native `details`;
- no horizontal overflow at compact widths;
- no navigation overlay over immersive activity content.

The existing regression history already treats missing accessible `Kembali` naming as a real defect; JM-02 must not regress it.

## 8. Existing immersive-runtime boundary

Activity routes use their own canonical activity header/chrome, including Garden activity controls.

World stage routes use World immersive stage chrome.

JM-02 must not blindly force the shared Playroom header into these routes unless the intended new header architecture explicitly replaces that behavior without duplicating:

- Kembali;
- logo;
- audio controls;
- runtime controls;
- Completion/Share;
- World stage controls.

A duplicate-header state is a blocker.

## 9. JM-02 implementation acceptance

Before JM-02 can close, prove at minimum:

1. one canonical shared child header owner;
2. correct Kembali destination for each supported non-immersive Journey Map surface;
3. compact logo;
4. profile/menu remains reachable;
5. Belajar/Bermain/World navigation remains correct;
6. Shop does not fabricate a child commerce route;
7. desktop mouse interaction passes;
8. touch interaction passes;
9. keyboard-only interaction passes;
10. focus order is logical;
11. Escape/disclosure behavior is deterministic;
12. no horizontal overflow at mobile/tablet/desktop widths;
13. immersive activities/World stages do not receive duplicate chrome;
14. console has no new unexpected errors/warnings;
15. existing progression, Browse All, Completion/Share and JM-01 data/state behavior remain unchanged.

## 10. Current safe execution boundary

```text
JM-00  CLOSED / LIVE VERIFIED
JM-01  CLOSED / LIVE VERIFIED
JM-02  AUTHORIZED / NOT IMPLEMENTED
JM-03+ NOT STARTED
```

Safe next action:

**Implement JM-02 only from the canonical `PlayroomShell` ownership, keep Shop fail-closed until its destination/product boundary is explicitly resolved, then run desktop/touch/keyboard/mobile regression before merge.**
