# JM-06 — Shared Journey Map Engine + Bahasa Indonesia final closure

Date: **1 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

Runtime PR: **#420**  
Runtime head: `e910211c5924ee806ed43ab9d9ac7d5c26845951`  
Merged main: `aec5233a8397eeb4e8cc17cf521e350596ed4ad0`  
Merged-main CI: **#2340 / run `36833622638` — FULL SUCCESS**  
Production smoke: **SUCCESS — exact Cloudflare deployment gate passed**

## 1. Scope closed

JM-06 extracts the Bahasa Inggris reference Journey Map into one reusable subject-agnostic owner and activates Bahasa Indonesia as the second consumer.

Closed scope:

- `EnglishJourneyMap` generalized to `BelajarJourneyMap`;
- shared CSS ownership moved with the engine;
- English behavior from JM-03/04/05 preserved;
- Bahasa Indonesia now uses the same map, Stage detail, Browse All, responsive bottom-sheet, keyboard/touch, and rotation-state implementation;
- one shared browser QA contract added for English + Bahasa;
- the historical Session 13 Bahasa gallery regression was migrated to the canonical JM-06 text-only Journey Map contract.

## 2. Canonical content preserved

English remains exact:

- **5 canonical Stages**;
- **100 activities**;
- existing stable routes;
- existing readiness/evidence/mastery semantics;
- existing English compatibility markers used by JM-03/04/05 regression.

Bahasa Indonesia is exact:

1. `bahasa-huruf`
2. `bahasa-cerita`
3. `bahasa-dasar-huruf`
4. `bahasa-suku-kata-kata`
5. `bahasa-kalimat-pemahaman`
6. `bahasa-literasi-terapan`

with exact **100-activity** subject membership.

No curriculum, Stage membership/order, readiness/evidence/mastery, database/schema, auth/profile, Completion/Share, World, creative-workspace, or Shop-route behavior changed.

## 3. Shared-engine acceptance

Verified:

- one `BelajarJourneyMap` owner serves both `english` and `bahasa`;
- no duplicated English-only engine remains;
- subject title, IDs, Stage order, Browse All membership, and detail labels are subject-driven;
- English keeps the `data-english-journey-map="v1"` compatibility marker;
- both subjects expose `data-belajar-journey-map="v1"` and subject-specific `data-journey-subject`;
- JM-02 `PlayroomShell` remains the single shared child-header owner;
- other seven Belajar subjects remain on the existing gallery pending JM-07+.

## 4. Bahasa Indonesia acceptance

Verified across desktop and mobile:

- exact 6-Stage canonical order;
- exact 100 Browse All activities;
- no legacy gallery on the Bahasa subject route;
- text-only Stage detail and Browse All presentation;
- Continue learning present;
- no semantic-thumbnail/answer leakage in the Journey Map surface;
- portrait Stage detail uses the bottom sheet;
- landscape rotation preserves the selected Stage;
- no horizontal overflow.

## 5. Local FAST-SAFE evidence

Passed:

- `npm run typecheck`;
- `npm run test:learning:journey-map`;
- `npm run lint` — 0 errors / 9 pre-existing warnings;
- `npm run build` on Next.js 16.3.6;
- `npm run test:ui:journey-map-english`;
- `npm run test:ui:journey-map-shared`.

The blocking `npm run test:ui:mobile-routes` passed every gate before the Session 13 migration point. The old Session 13 gallery assertion was replaced with the canonical JM-06 Bahasa Journey Map contract and then passed all 5 required viewports. The remaining tail regression also passed: Session 14 approved SVGs, Core Thumbnail Wave 01, creative runtime, Bermain games 4–10, and SI-10 World adapter. Browser warning inventory remained **0**.

## 6. CI / production evidence

Runtime PR #420 passed all PR required gates and was squash-merged to:

```text
main@aec5233a8397eeb4e8cc17cf521e350596ed4ad0
```

Merged-main CI:

```text
#2340 / run 36833622638
Mobile route QA (Chromium)     SUCCESS
Windows compatibility         SUCCESS
Secret history scan           SUCCESS
Production dependency audit   SUCCESS
Production build              SUCCESS
Quality gate (Ubuntu)         SUCCESS
Production smoke (Cloudflare) SUCCESS
```

Therefore **JM-06 is CLOSED / MERGED / LIVE VERIFIED**.

## 7. Next authorized package

Next:

```text
JM-07 through JM-11 — standard-subject rollout
Matematika
Iqro
Huruf & Menulis
Logika
Sains
```

Use the existing shared `BelajarJourneyMap` engine. Add only subject adapters/configuration needed for exact canonical Stage membership/order/readiness. Do not duplicate the engine. Keep direct routes, Browse All, Completion/Share, JM-02 header ownership, responsive behavior, evidence/mastery, World, and creative boundaries unchanged.
