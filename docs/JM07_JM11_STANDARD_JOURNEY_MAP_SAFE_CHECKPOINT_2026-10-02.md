# SAFE CHECKPOINT — JM-07 through JM-11 live verified

Date: **2 October 2026**  
Status: **SAFE RESUME CHECKPOINT**  
Repository: `ceritaantarkita-req/mainlagi-hub`

## Verified runtime source of truth

```text
runtime PR:        #423
runtime final head d99ac73370031181882721e27960374e7c1556cd
merged main:       196d31d2252ffcde7e1621cbebde062b656477e1
PR CI:             #2346 / run 36868222234 — FULL SUCCESS
merged-main CI:    #2347 / run 36869836933 — FULL SUCCESS
Cloudflare smoke:  SUCCESS — exact merged main SHA
```

## Closed scope

JM-07 through JM-11 are complete and must not be restarted:

- JM-07 — Matematika
- JM-08 — Iqro
- JM-09 — Huruf & Menulis
- JM-10 — Logika
- JM-11 — Sains

These five subjects now use the existing shared `BelajarJourneyMap` engine together with Bahasa Inggris and Bahasa Indonesia.

Shared Journey Map production truth:

- **7 standard subjects**
- **37 canonical Stages**
- **700 activities**
- one shared Journey Map owner
- exact canonical Stage order preserved
- exact 100-activity membership preserved per subject
- stable direct routes preserved
- readiness/evidence/mastery semantics preserved
- JM-02 shared header ownership preserved
- Completion/Share boundaries preserved

## Verification locked by this checkpoint

Passed before this checkpoint:

- typecheck
- canonical Journey Map foundation tests
- lint with 0 errors
- production build
- seven-subject shared Journey Map browser QA
- canonical mobile-route matrix across 7 viewport widths
- browser warning inventory = **0**
- permanent visual product baseline = **63/63 exact-path captures**
- PR CI #2346 full success
- merged-main CI #2347 full success
- exact Cloudflare production smoke for `196d31d2252ffcde7e1621cbebde062b656477e1`

The only CI blocker found during rollout was a stale permanent-visual-baseline assertion still looking for the retired Math gallery selector. It was corrected to assert the canonical Math Journey Map contract; no runtime rollback or duplicate engine was introduced.

## Hard boundaries

Do **not** reopen or change JM-07 through JM-11 unless a new regression is proven.

Do not change as part of the next package:

- curriculum membership/order
- readiness/evidence/mastery semantics
- activity runtime behavior
- database/schema
- auth/profile
- World
- Shop
- Completion/Share semantics
- shared Journey Map engine ownership
- existing creative-workspace behavior

## Safe resume point

Next authorized work:

```text
JM-12 — Mewarnai
JM-13 — Menggambar
JM-14 — 9-subject Belajar closure
```

Execution rule:

1. JM-12 and JM-13 may adapt the two creative subjects to the Journey Map system only if their existing creative workspaces, local workspace state, completion/replay behavior, canonical routes, and progress semantics remain intact.
2. Do not flatten Mewarnai/Menggambar into ordinary card/runtime behavior.
3. Do not start JM-14 until JM-12 and JM-13 are both merged and live verified.
4. JM-14 is integration/closure, not a new curriculum/runtime redesign.

## Documentation note

Runtime closure is already verified in production at `main@196d31d2252ffcde7e1621cbebde062b656477e1`.

Canonical documentation synchronization for the JM-07–JM-11 closure was in progress when the local Desktop Commander device became unavailable. This checkpoint is the safe remote source of truth and should be reconciled into `CURRENT_STATE.md`, `NEXT_PRODUCT_QUALITY_PLAN.md`, `PRODUCT_UX_NEXT_WORK_2026-09-20.md`, `README.md`, and `CHANGELOG.md` before or alongside the next implementation package.
