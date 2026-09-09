# Mainlagi Hub — Current State

Last reviewed: 10 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the only source of truth. Commit SHAs below are dated snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Visibility: Public
- Default/canonical branch: `main`
- Cloud learning/profile/ownership implementation baseline: `7fa7ab7b4642e67343370924e740433fefe8f914`
- Source license: `AGPL-3.0-only`
- Commercial/open-core policy: see `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `docs/PRODUCT_TIERS_AND_CODE_BOUNDARY.md`.

## Canonical production architecture

Production is **not VPS/SSH based**.

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

GitHub Actions is the quality/security gate. Cloudflare owns publication from the Git-connected `main` branch. Previous references to `mainlagi.inmydraft.com`, `/srv/mainlagi`, VPS SSH deploys, or `MAINLAGI_VPS_*` are superseded.

## Production deployment verification

Cloudflare Git deployment and exact-commit verification are active.

For implementation commit `7fa7ab7b4642e67343370924e740433fefe8f914`:

- Cloudflare check: `Workers Builds: mainlagi-hub` — success;
- Cloudflare Build ID: `77e6e799-bd5d-4170-ae2e-8a39876a5c6d`;
- Cloudflare Version ID: `e9d879f1-100d-48d6-9142-90f1f51d1912`;
- GitHub `Production smoke (Cloudflare)` — success;
- the smoke gate verified that the public production release served the exact current `main` SHA and canonical production metadata.

`/api/health` exposes only non-secret release/backend metadata. The smoke gate verifies the exact release instead of accepting an older still-running Worker.

## Shipped platform shape

Mainlagi is a child-learning platform whose motion/vision engine remains an activity runtime rather than the universal learning data model.

Current core includes:

- five subjects: Bahasa Indonesia, English, Matematika, Iqro, and Mewarnai;
- child profiles, learning progress, attempts, evidence, mastery, achievements, and certificates;
- touch/audio/story/coloring/tracing/matching/motion activity runtimes;
- evidence-aware progression and stage access;
- parent progress/report/certificate views;
- Mainlagi World child experience;
- existing motion games and MediaPipe/browser vision runtimes;
- cloud-backed authenticated learning state plus explicit guest/local fallback;
- server-side parent authentication and child-ownership guards.

Canonical learning flow:

```text
Child Profile
  -> Learning Attempt
    -> Skill Evidence
      -> Skill Mastery
        -> Stage Readiness / Unlock
          -> Parent Report / Achievement / Certificate
```

## Learning evidence integrity

Legacy completion events remain conservative:

- completion-only data is stored as completion/practice context;
- no placeholder accuracy is fabricated;
- no mastery evidence is created without a measurable assessed outcome.

Current mastery protections include:

- one qualifying perfect attempt remains at most `exploring`;
- repeated qualifying evidence is required for higher mastery;
- replay inside 30 seconds is retained but non-qualifying;
- seven or more retries make evidence non-qualifying;
- practice activity classification is server/catalog owned;
- stage readiness uses qualifying evidence rather than raw replay count.

Parent-facing evidence wording uses **Skor evidence** rather than implying that a single 100% attempt equals mastery.

## Cloud child profiles and source-of-truth boundary

Authenticated accounts now use existing `public.player_profiles` as the child-profile source of truth for the learning UI.

Authenticated mode:

- lists undeleted account-owned profiles from Supabase;
- creates profiles under the authenticated `account_id`;
- soft-deletes profiles with `deleted_at`;
- reads learning attempts, skill evidence, mastery, and derived progress from Supabase;
- does **not** silently replace a failed cloud read with stale localStorage data;
- refreshes cloud learning state immediately after a successful attempt RPC sync.

Guest mode:

- remains local-only for child play/profile state;
- does not silently upload local profiles to cloud after login.

Legacy `player_profiles.age_group` values remain compatible for child-specific groups: `TK -> 5`, `SD 1 -> 6`, `SD 2 -> 7`. The ambiguous legacy value `Umum` is intentionally not assigned a child learning age automatically.

The fixed `demo-gian` profile is an explicit sandbox sentinel. Its learning rows remain account-scoped by RLS; it is not a cross-account shared data row.

## Parent and child ownership gates

Production parent routes are server gated:

- `/parent/*` requires a valid server-verified Supabase session when Supabase is configured;
- `/parent/children/<childId>/*` requires the real child profile to be owned by the authenticated account and not soft-deleted;
- foreign/deleted child IDs fail closed with `notFound()`;
- the explicit `demo-gian` sandbox is allowed.

Authenticated child-mode direct URLs are also ownership checked. A logged-in account cannot render another account's real child route by changing the URL. Unauthenticated guest/local child play remains available by design.

Database migration `0007_learning_child_ownership` adds a second boundary at `learning_attempts`: a real `child_key` must resolve to an undeleted `player_profiles` row with the same `account_id`; only `demo-gian` is exempt as the explicit sandbox sentinel.

## CI and regression coverage

Primary CI runs:

- `Production build` — actual OpenNext/Cloudflare artifact;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` on canonical `main`.

Learning tests cover:

- mastery transitions and anti-one-shot behavior;
- replay/retry anti-farming;
- evidence degradation and practice classification;
- progression based on qualifying evidence;
- assessed-runtime/catalog consistency;
- certificate competency integrity;
- multi-child local isolation;
- cloud `child_key` filtering and account binding;
- parent/child direct-route ownership contracts;
- legacy child age-group compatibility;
- migration/RLS/RPC security contracts including migration `0007`.

PR #18 passed Ubuntu, Windows, OpenNext production build, dependency audit, secret-history scan, engine tests, and simulations before merge. The exact merged production commit also passed Cloudflare deployment and post-deploy smoke verification.

## Supabase state

Canonical Mainlagi database:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1` (Singapore)
- status: active/healthy

Applied migration history verified 10 September 2026:

1. `0001_init`
2. `0002_learning_attempt_schema`
3. `0003_learning_mastery_functions`
4. `0004_learning_rpc_hardening`
5. `0005_database_advisor_hardening`
6. `0006_private_admin_helper`
7. `0007_learning_child_ownership`

Live structural verification confirmed the `learning_attempt_child_ownership` trigger is enabled and points to `private.enforce_learning_attempt_child_ownership`.

The SQL inspection connector runs read-only, so it cannot perform a direct test INSERT through `execute_sql`; an attempted verification INSERT was rejected by the connector's read-only transaction before any test row could be written. This is a tooling limitation, not an application/database failure.

Earlier authenticated production smoke already proved real `demo-gian` learning attempts, evidence, and mastery materialization in the canonical Supabase project. Four measured attempts were observed live and the corresponding one-evidence skills correctly remained `exploring` rather than jumping to mastery.

Supabase advisor state after hardening:

- performance advisor: no WARN findings;
- intentional security warning remains for authenticated execution of the protected SECURITY DEFINER attempt RPC;
- leaked-password protection remains unavailable on the current Supabase Free plan and is treated as an accepted plan limitation.

## Closure state for cloud learning items 1–5

Engineering implementation is complete for the requested block:

1. [x] cloud child-profile list/create/select/soft-delete path;
2. [x] authenticated cloud reads for attempts/evidence/mastery/progress;
3. [x] immediate cloud refresh after successful attempt sync;
4. [x] multi-child isolation + account/RLS/DB ownership regression coverage;
5. [x] parent authentication gate + parent/child direct-URL ownership fail-closed behavior.

All code changes were merged through PR #18 and the exact production commit passed CI, Cloudflare deploy, and production smoke. Migration `0007` is live.

A manual browser exercise of creating and deleting a brand-new real cloud child profile can still be used as UX acceptance evidence, but it is not an unresolved code/schema deployment blocker for items 1–5.

## Current engineering priority

The next phase is no longer cloud-profile plumbing. Priorities can move to:

- broader authenticated E2E/UX acceptance with real cloud child profiles;
- remaining progression/reward/achievement/certificate product QA;
- wider next-best/adaptive UI integration;
- curriculum/content expansion;
- audio/voice and richer child experience work.

## Branch policy

Normal lifecycle:

```text
short-lived branch
  -> PR
  -> CI / QA
  -> squash merge
  -> Cloudflare deploy from main
  -> exact-commit production smoke
  -> delete branch
```

`main` remains canonical. See `docs/BRANCH_LIFECYCLE.md`.

## Manual/account-level actions

Items that truly require account/UI access are tracked in `docs/ACCOUNT_LEVEL_ACTIONS.md`. Never commit or paste secret values into repository files, issues, screenshots, or chat.
