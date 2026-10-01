# JM-07 through JM-11 — Standard-subject Journey Map final closure

Date: **1 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

Runtime PR: **#423**  
Final runtime head: `d99ac73370031181882721e27960374e7c1556cd`  
Merged main: `196d31d2252ffcde7e1621cbebde062b656477e1`  
PR CI: **#2346 / run `36868222234` — FULL SUCCESS**  
Merged-main CI: **#2347 / run `36869836933` — FULL SUCCESS**  
Production smoke: **SUCCESS — exact Cloudflare deployment gate passed**

## 1. Scope closed

JM-07 through JM-11 roll the five remaining standard Belajar subjects onto the existing shared `BelajarJourneyMap` engine:

- JM-07 — Matematika
- JM-08 — Iqro
- JM-09 — Huruf & Menulis
- JM-10 — Logika
- JM-11 — Sains

English and Bahasa Indonesia remain on the same shared owner. Mewarnai and Menggambar intentionally remain on the existing creative/gallery surface for JM-12/JM-13.

## 2. Canonical subject membership preserved

The rollout preserves exact canonical path/Stage/activity ownership and existing progression semantics:

- Matematika — **6 Stages / 100 activities**
- Iqro — **5 Stages / 100 activities**
- Huruf & Menulis — **5 Stages / 100 activities**
- Logika — **5 Stages / 100 activities**
- Sains — **5 Stages / 100 activities**

Together with Bahasa Inggris and Bahasa Indonesia, the shared Journey Map now serves **7 standard subjects / 37 canonical Stages / 700 activities**.

No curriculum, Stage membership/order, readiness/evidence/mastery, activity runtime, database/schema, auth/profile, Completion/Share, World, Shop, Mewarnai workspace, or Menggambar workspace behavior changed.

## 3. Shared-engine acceptance

Verified:

- one `BelajarJourneyMap` owner serves all seven standard subjects;
- no subject-specific Journey Map engine was added;
- each subject preserves its canonical title, Stage order, stable direct routes and exact 100-activity Browse All membership;
- Stage detail remains text-only with Continue learning;
- JM-02 `PlayroomShell` remains the single shared child-header owner;
- QA unlock-all opens Stage inspection without changing canonical readiness/evidence/mastery state;
- Mewarnai and Menggambar remain outside this rollout.

## 4. Verification evidence

Local FAST-SAFE verification passed:

- `npm run typecheck`;
- `npm run test:learning:journey-map`;
- `npm run lint` — 0 errors; baseline warnings only;
- `npm run build` on Next.js 16.3.6;
- shared Journey Map browser QA for English, Bahasa Indonesia, Matematika, Iqro, Huruf & Menulis, Logika and Sains;
- canonical mobile route matrix across 7 viewport widths with browser warning inventory **0**;
- permanent visual product baseline — **63/63 exact-path captures passed**.

PR CI **#2346 / run `36868222234`** passed all required gates after the permanent visual baseline contract was migrated from the retired Math gallery selector to the canonical Math Journey Map.

Merged-main CI **#2347 / run `36869836933`** passed:

- Mobile route QA (Chromium)
- Windows compatibility
- Secret history scan
- Production dependency audit
- Production build
- Quality gate (Ubuntu)
- Production smoke (Cloudflare)

Therefore JM-07 through JM-11 are **CLOSED / MERGED / LIVE VERIFIED** at exact `main@196d31d2252ffcde7e1621cbebde062b656477e1`.

## 5. Next authorized package

Next:

```text
JM-12 — Mewarnai
JM-13 — Menggambar
JM-14 — 9-subject Belajar closure
```

JM-12 and JM-13 must adapt the two creative subjects without breaking their existing creative workspaces, completion/replay behavior, canonical activity routes, progress semantics, or the shared Journey Map engine. JM-14 is the final integrated 9-subject Belajar closure and must not begin until both creative subjects are live verified.
