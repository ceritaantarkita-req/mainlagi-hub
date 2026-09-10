# Public Repository Readiness & Ongoing Audit Checklist

`ceritaantarkita-req/mainlagi-hub` is **Public**. This checklist separates verified engineering/release state from ongoing governance and human/device acceptance. Historical exposure evidence remains in `PUBLIC_EXPOSURE_AUDIT_20260909.md`; canonical runtime state is in `CURRENT_STATE.md`.

## Release-critical engineering state

- [x] Canonical repository and production branch are `ceritaantarkita-req/mainlagi-hub` / `main`.
- [x] Cloudflare Git integration builds/deploys canonical `main`.
- [x] OpenNext production build is a permanent CI gate.
- [x] Ubuntu quality gate is active.
- [x] Windows compatibility gate is active.
- [x] Production dependency audit is active.
- [x] Full-history Gitleaks `Secret history scan` runs in CI and passes.
- [x] Exact-commit `Production smoke (Cloudflare)` verifies homepage, release SHA, branch, site URL, backend, and canonical Supabase project ref.
- [x] Canonical Supabase migrations `0001` through `0010` are live.
- [x] Supabase performance advisor has 0 WARN findings after final index hardening.
- [x] Authenticated learning attempts/evidence/mastery were observed in canonical production Supabase during controlled smoke validation.
- [x] Cloud child ownership and multi-child isolation are protected by RLS/server route guards/database contracts.
- [x] Offline authenticated attempt outbox is account-bound and regression tested.
- [x] Server-persisted achievements/certificates and Parent Report V2 are shipped.

Latest verified engineering deployment before this docs-only closure:

```text
main commit:        771409b04a5ea626f6dfc68d1265197492e0263e
Cloudflare Build:   01a94875-f9c8-4b1f-ad89-9824a14fdbc5
Cloudflare Version: 2f9a60e6-6571-494d-bfd5-ce9847454d9c
Production smoke:   success
Supabase target:    estvtgflwkebomsqlolv
```

## One remaining repository-settings action

- [ ] Add **`Secret history scan`** to the active `Protect main` ruleset's required-status-check list.

The scan itself already runs and passes. Current ruleset inspection shows four mandatory checks: `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. The GitHub connector used for this closure can read the ruleset but cannot modify repository administration settings, so this item requires a GitHub Settings UI action.

Do not weaken or remove any existing required check while adding it.

## Repository / licensing baseline

- [x] Repository visibility is Public.
- [x] Source declares `AGPL-3.0-only`.
- [x] `LICENSE`, `NOTICE.md`, `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `TRADEMARKS.md` exist.
- [x] Community / Plus / School code boundaries are documented.
- [x] Contributor-rights strategy is documented in `CLA_POLICY.md`.
- [ ] A legally reviewed executable CLA/signature workflow remains future legal/governance work; the policy document must not be represented as a signed agreement.

## Secret / credential posture

- [x] Full fetched Git history passes pinned Gitleaks scanning with redacted output.
- [x] No actual credential value was identified in the reviewed repository/PR material that required rotation during this closure.
- [x] Cloudflare/Supabase secret values are not printed by `/api/health`.
- [ ] Archived historical Actions logs can be manually spot-checked periodically; this is ongoing operational hygiene, not a release blocker.

If a real credential is discovered later, rotate/revoke it first, then evaluate history remediation.

## Child privacy / data handling

- [x] Production parent routes require server-verified authentication when Supabase is configured.
- [x] Real child routes enforce account ownership and reject deleted/foreign child IDs.
- [x] Guest mode remains local-only rather than silently uploading local profiles.
- [x] No pronunciation microphone capture was added in this release wave.
- [ ] Never commit real child photo/video/audio without a documented authorized reason and distribution right.
- [ ] Any future microphone, external AI/OCR, or continuous camera upload design requires explicit privacy/consent review first.
- [ ] Re-review screenshots, fixtures, logs, and datasets whenever new child-data features are introduced.

## Third-party asset provenance

- [x] Canonical affiliate provenance controls exist.
- [x] Unverified local affiliate imagery is fail-closed.
- [x] Unverified tracked affiliate binaries were removed from the current tree.
- [x] Asset provenance validation runs in CI.
- [ ] Continue provenance review for future artwork, fonts, models, datasets, audio, and generated assets.

Removing a file from the current tree does not erase an already-published Git object.

## GitHub repository controls

`Protect main` is verified active with:

- [x] default branch targeting;
- [x] empty bypass list;
- [x] pull request required;
- [x] conversation resolution required;
- [x] squash merge only;
- [x] strict/up-to-date required-check policy;
- [x] linear history;
- [x] deletion protection;
- [x] non-fast-forward/force-push protection;
- [ ] `Secret history scan` mandatory in the ruleset — the one remaining account-level action above.

Dependabot/security alert/Private Vulnerability Reporting settings remain periodic repository administration review items rather than application-code blockers.

## Deployment

Canonical production architecture:

```text
GitHub `main`
  -> Cloudflare Git integration
  -> OpenNext Cloudflare Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

- [x] `@opennextjs/cloudflare`, `open-next.config.ts`, and `wrangler.jsonc` are present.
- [x] Worker name is `mainlagi-hub`.
- [x] Obsolete VPS/SSH deployment is removed from the canonical architecture.
- [x] GitHub CI validates the production artifact without deploying PR branches.
- [x] Fresh `main` commits automatically trigger Cloudflare production builds.
- [x] Exact-commit smoke verifies canonical Supabase metadata after deployment.
- [x] Production health does not expose secrets.

Supabase leaked-password protection remains unavailable on the current Free plan. Existing minimum-password and secure/current-password-change protections remain the accepted mitigation until plan capability changes.

## Learning/platform acceptance

Automated regression coverage is complete for the shipped foundation:

- [x] learning attempt -> evidence -> mastery;
- [x] anti-farming replay/retry rules;
- [x] practice vs assessed classification;
- [x] curriculum hierarchy and evidence variants;
- [x] adaptive remediation/confidence/spacing/difficulty ranking;
- [x] stage readiness/progression;
- [x] Parent Dashboard/Report V2;
- [x] persisted achievements/certificates;
- [x] explicit guided-trace measurement;
- [x] audio/TTS fallback;
- [x] cloud profile/account ownership;
- [x] offline authenticated outbox and cross-account isolation;
- [x] Ubuntu + Windows engine/learning tests and simulations.

Human/device acceptance remains useful but is not represented as automated evidence:

- [ ] disposable real-child create/use/delete browser exercise;
- [ ] intentional offline -> online browser reconciliation exercise;
- [ ] camera/gesture QA on representative physical devices;
- [ ] screen-reader/keyboard/touch-target/visual QA on representative devices.

These are ongoing UX/device acceptance items, not unresolved database/deployment blockers.

## Supabase advisor state

- [x] Performance advisor: 0 WARN.
- [x] Unindexed-FK findings resolved by additive migration `0010_legacy_fk_indexes`.
- [x] Newly created/young indexes are not removed merely because the advisor currently labels them unused.
- [x] Intentional authenticated SECURITY DEFINER warning for `record_learning_attempt` is documented and regression protected.
- [x] Leaked-password warning is documented as a Free-plan limitation.

## Branch / project-state hygiene

- [x] `main` is the only canonical product branch.
- [x] Persistent `develop` is not part of the current workflow.
- [x] Branch lifecycle policy is documented in `BRANCH_LIFECYCLE.md`.
- [ ] Delete merged/superseded remote branches after this docs closure is merged.

Expected lifecycle:

```text
focused branch
  -> PR
  -> CI
  -> squash merge
  -> Cloudflare exact-commit deployment smoke
  -> delete merged branch
```

## Clean-clone boundary

The CI environment repeatedly performs clean checkouts followed by `npm ci`, typecheck/lint/tests, and Cloudflare production builds on Linux and Windows. That is the canonical automated clean-environment evidence.

A separate ad-hoc container in this closure could not resolve external DNS, so it was not used to fabricate a second public `git clone` result. A developer workstation fresh clone remains optional handoff evidence rather than a release blocker.

## Product work after foundation closure

The foundation is not the end of Mainlagi product development. Future work can focus on:

- curriculum breadth and content quality;
- richer Mainlagi World and character animation;
- additional measured trace/listening activities;
- privacy-reviewed voice/pronunciation features;
- real-device camera tuning;
- accessibility and performance profiling;
- broader UX studies with parents/children.

Public visibility is an ongoing threat-model and provenance responsibility, not a one-time checkbox.
