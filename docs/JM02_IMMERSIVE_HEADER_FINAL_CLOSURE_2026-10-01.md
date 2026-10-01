# JM-02 â€” Immersive Mainlagi Header final closure

Date: **1 October 2026**
Status: **CLOSED / MERGED / LIVE VERIFIED**
Workstream: **Phase C â€” Canonical Journey Map System**
Runtime implementation PR: **#415**
Runtime merged main: `4fab9369a238805ddd53ff357d5b3587eb1ac05c`
Security remediation PR: **#416**
Security-remediated main: `84ab23778ab1013cdc0d9cddcbbb8237067236af`
Post-merge CI: **#2332 / run `36795318859` â€” FULL SUCCESS including exact Cloudflare smoke**

## 1. Closure scope

JM-02 implements only the shared immersive Mainlagi child header. It does not begin JM-03 map visuals, Stage popup/detail behavior, Journey Map geometry, Petualangan Uang redesign, curriculum changes, mastery/evidence changes, or database/schema changes.

Canonical ownership remains:

```text
src/app/child/[childId]/layout.tsx
  -> WorldChildShell
      -> PlayroomShell
```

Header implementation ownership remains `src/components/learning/Playroom.tsx` + `Playroom.module.css`, with route behavior centralized in `src/lib/learning/journeyHeader.ts`.

## 2. Implemented runtime contract

JM-02 now provides:

- route-aware **Kembali** behavior on non-immersive child surfaces;
- compact centered Mainlagi wordmark;
- expandable product navigation for **Belajar / Bermain / World**;
- **Shop remains disabled/fail-closed** because no canonical child Shop route exists;
- existing profile menu actions remain available;
- desktop mouse, touch, keyboard, Escape, and outside-close behavior;
- mobile bottom-sheet presentation for menu disclosures;
- minimum 44px interactive target contract;
- shared header suppression on activity routes and World Stage routes;
- duplicate subject/stage/drawing back controls removed where the shared header now owns that navigation.

No child `/shop` route was invented.

## 3. Runtime lineage

```text
pre-runtime safe baseline:     787d3fd3d59cdc4274f038a0937c914d394e605c
runtime PR:                    #415
runtime final head:            536c95f9d65af0a56909380b902393ae7ecdbfa3
runtime PR CI:                 #2328 / run 36743194635 â€” SUCCESS
runtime merged main:           4fab9369a238805ddd53ff357d5b3587eb1ac05c
runtime main CI:               #2329 / run 36744776282 â€” dependency audit blocked by new Next.js advisory
security remediation PR:       #416
security PR final head:        85bcc6c7f19fd42ef3dce9a60c715e45cf75b8c0
security PR CI:                run 36755582780 â€” SUCCESS
security-remediated main:      84ab23778ab1013cdc0d9cddcbbb8237067236af
post-merge CI:                 #2332 / run 36795318859 â€” FULL SUCCESS
Production smoke:              SUCCESS â€” exact 84ab23778ab1013cdc0d9cddcbbb8237067236af
```

The runtime PR itself passed Production build, Production dependency audit, Quality gate Ubuntu, Windows compatibility, Mobile route QA Chromium, and Secret history scan before merge. The subsequent main run was blocked only because the npm advisory service surfaced a newly published critical Next.js advisory after merge.

## 4. Security closure incorporated into JM-02 closure

The post-merge blocker was **GHSA-vcvr-r3jv-pc5j / CVE-2026-94545** affecting the existing Next.js line below 16.3.6.

PR #416:

- bumps `next` from `^16.3.3` to `^16.3.6`;
- refreshes matching Next.js / `@next/env` / platform `@next/swc` lock entries;
- does not change JM-02 runtime behavior;
- aligns the local Playroom QA harness with current canonical Home copy, coloring DOM ownership, canonical Completion, and progression-aware direct-route behavior.

## 5. Local FAST-SAFE verification

Before relying on GitHub CI, the security-remediated branch was validated locally on Windows.

Passed locally:

- `npm ci --no-audit --no-fund`;
- `npm audit --omit=dev --audit-level=high` -> **0 vulnerabilities**;
- `npm run test:learning:journey-map`;
- `npm run typecheck`;
- `npm run lint` -> **0 errors**; existing warnings only;
- `npm run build` on Next.js 16.3.6;
- `node scripts/run-local-playroom-check.mjs` -> **PASS** across 1440 / 390 / 1505 plus 100 Drawing guides and 100 Coloring illustrations;
- `npm run test:ui:mobile-routes` -> **PASS** across the complete blocking browser matrix, including 28 canonical routes, 7 viewport widths, creative, World, Completion/Share, and browser warning inventory 0.

The local environment required a process-local `ComSpec=C:\\Windows\\System32\\cmd.exe` because the Desktop Commander PowerShell environment did not expose `ComSpec`; no repository or system configuration change was required.

## 6. Preserved boundaries

JM-02 preserves:

- JM-01 canonical Journey Map state derivation;
- 9 subjects / 46 Belajar stages / 900 activities;
- readiness/evidence/progression semantics;
- Browse All behavior;
- existing Completion + Share ownership;
- Drawing/Coloring creative workspaces;
- World Stage immersive chrome;
- Petualangan Uang runtime/progression;
- current auth/profile behavior;
- child commerce fail-closed boundary.

## 7. Final live verification

Main CI **#2332 / run `36795318859` completed FULL SUCCESS**. Production smoke verified that `https://mainlagihub.my.id` served exact commit `84ab23778ab1013cdc0d9cddcbbb8237067236af`, branch `main`, canonical Supabase backend, and project ref `estvtgflwkebomsqlolv`.

JM-02 is therefore **CLOSED / MERGED / LIVE VERIFIED**.

The next authorized Phase C FAST-SAFE package is:

```text
JM-03 + JM-04 + JM-05
Bahasa Inggris complete reference implementation
```

JM-03 must begin with the clean full-page desktop map baseline before JM-04 Stage detail and JM-05 responsive behavior are layered in.
