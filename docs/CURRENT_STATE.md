# Mainlagi Hub — Current State

Last reviewed: 9 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the only source of truth. Commit SHAs below are dated snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Visibility: Public
- Default/canonical branch: `main`
- Baseline before this governance update: `53ab6ee899d8b978923d1d49a213e4ba4dff1a52`
- Source license: `AGPL-3.0-only`
- Commercial/open-core policy: see `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `docs/PRODUCT_TIERS_AND_CODE_BOUNDARY.md`.

## Shipped platform shape

Mainlagi is no longer treated only as a directory of camera games. The current product shape is a child-learning platform whose existing motion/vision engine remains a retained activity runtime.

Current public core includes:

- five learning subjects: Bahasa Indonesia, English, Matematika, Iqro, and Mewarnai;
- child profiles and local/basic learning progress;
- stage/activity learning registry;
- touch/audio/story/coloring/tracing/matching/motion activity types;
- parent-facing learning/progress surfaces;
- Mainlagi World child-facing vertical slice, including Kota Angka, stage progression, rewards, and responsive child navigation;
- ten existing motion games, retained rather than rewritten;
- MediaPipe/browser vision runtime and existing gesture/tracing engines;
- public licensing, security, provenance, and CI controls.

The architectural direction is:

```text
Subject
  -> Stage / learning path
    -> Activity
      -> Activity runtime
         - touch / choice
         - matching
         - tracing
         - coloring
         - listening / story
         - motion game
```

The motion engine is one activity runtime, not the learning-platform data model.

## CI and public-repository controls

Primary CI currently provides:

- `Production build`
- `Quality gate (Ubuntu)`
- `Windows compatibility`
- `Production dependency audit`
- `Secret history scan`

The `Protect main` repository ruleset is Active, requires PRs, squash-only merging, conversation resolution, strict/up-to-date status checks, linear history, and blocks deletion/non-fast-forward updates.

Account-level follow-up remains: add `Secret history scan` as a fifth required status check in the ruleset. The job already exists and passes in CI; the ruleset itself still lists the original four required checks.

## Public exposure / asset state

- Full fetched Git history is scanned with pinned Gitleaks in CI using redacted output.
- Public affiliate image redistribution is fail-closed.
- Unverified local affiliate binaries were removed from the current tree.
- New local affiliate imagery requires explicit provenance that permits redistribution.
- Historical Git objects remain historical; removal from the current tree is not a history rewrite.
- Other creative assets still require normal provenance discipline when added or changed.

## Deployment state

The GitHub workflows reference four server-side deployment secrets:

- `MAINLAGI_VPS_HOST`
- `MAINLAGI_VPS_USER`
- `MAINLAGI_VPS_KNOWN_HOSTS`
- `MAINLAGI_VPS_SSH_KEY`

Recent `main` runs passed code/security gates but failed at `Validate deployment secrets` before SSH because one or more required secret values were unavailable to the job. No secret value is stored in this repository.

The SSH command intentionally sends a harmless client command; the production design relies on the dedicated VPS key being restricted by an OpenSSH forced command to the server-side Mainlagi deployment script. See `docs/DEPLOYMENT.md`.

## Branch policy

No persistent `develop` branch is used.

Normal lifecycle:

```text
short-lived branch
  -> PR
  -> CI / visual QA when applicable
  -> squash merge
  -> delete branch
  -> main is canonical again
```

See `docs/BRANCH_LIFECYCLE.md`.

## Current engineering priority

The next public-core engineering layer is a canonical learning attempt/mastery foundation above the existing activity registry. It must not deepen the legacy game-score/session model as the universal learning model.

Target sequence:

1. learning-attempt contract and bounded local adapter;
2. skill mapping and derived mastery bands;
3. backward-compatible integration with activity completion;
4. parent-facing learning summary from canonical attempts;
5. separate UI locale vs learning language contract;
6. character/audio metadata contract for reviewed pre-generated assets;
7. public entitlement contract for Community / Plus / School boundaries;
8. later cloud persistence only after the public contracts stabilize.

## Manual/account-level actions

Items that cannot be completed from repository code are tracked in `docs/ACCOUNT_LEVEL_ACTIONS.md`. Do not mark them complete merely because code/docs exist.
