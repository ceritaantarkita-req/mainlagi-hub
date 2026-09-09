# Public Repository Readiness & Ongoing Audit Checklist

`ceritaantarkita-req/mainlagi-hub` is **Public**. This checklist tracks security, licensing, privacy, provenance, governance, and operational readiness. Historical evidence is recorded in `PUBLIC_EXPOSURE_AUDIT_20260909.md`; current project state is recorded in `CURRENT_STATE.md`.

Public visibility exposes source and published Git history to the internet. Anything that should not be public must be treated as exposed if it was present in published Git objects, logs, issues, PRs, or attachments.

## Current manual/account-level blockers

- [ ] Add `Secret history scan` as the fifth required status check in `Protect main` if it is not already required.
- [ ] Verify Cloudflare Git integration points to `ceritaantarkita-req/mainlagi-hub` and production branch `main`.
- [ ] Verify Cloudflare production runtime variables point to canonical Supabase `mainlagi-hub` (`estvtgflwkebomsqlolv`).
- [ ] Verify successful Cloudflare deployment and public smoke tests at `https://mainlagihub.my.id/`.
- [ ] Delete merged/superseded remote branches after active closure work is finished.

There is no Mainlagi VPS/SSH deployment blocker and no `MAINLAGI_VPS_*` GitHub Actions secret requirement.

See `ACCOUNT_LEVEL_ACTIONS.md`.

## Repository / licensing baseline

- [x] Repository visibility is Public.
- [x] GitHub detects GNU Affero General Public License v3.0.
- [x] `package.json` declares `AGPL-3.0-only`.
- [x] `LICENSE`, `NOTICE.md`, `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `TRADEMARKS.md` exist.
- [x] Community / Plus / School implementation boundaries are documented in `PRODUCT_TIERS_AND_CODE_BOUNDARY.md`.
- [x] Contributor-rights strategy is documented in `CLA_POLICY.md`.
- [ ] A legally reviewed executable CLA/signature process exists. The current CLA file is policy only and must not be represented as a signed agreement.

## Code / CI

- [x] `Production build` is a permanent CI gate and targets the OpenNext/Cloudflare production artifact.
- [x] Ubuntu quality is a permanent CI gate.
- [x] Windows compatibility is a permanent CI gate.
- [x] Production dependency audit is a permanent CI gate.
- [x] Full fetched Git history is scanned with pinned Gitleaks and redacted output.
- [x] Asset provenance validation runs in Ubuntu quality CI.
- [x] Primary CI workflow defaults to read-only repository contents permissions.
- [x] Pull requests do not run a production deployment command.
- [x] Mainlagi World clean mainline port passed automated CI and fresh responsive visual/interaction QA before merge.

## Secret / credential review

- [x] Full fetched Git refs/history have passed Gitleaks scanning using `--log-opts="--all"`.
- [x] Reviewed public PR/issue material did not reveal an actual credential value in the inspected content.
- [x] No credential rotation/history rewrite was triggered by the 9 September audit because no matching real credential was identified.
- [ ] Optional manual UI spot-check of archived historical Actions raw logs remains useful because the integration audit did not inspect every historical log byte.
- [ ] If a real credential is discovered later, rotate/revoke it immediately before deciding whether history rewriting is warranted.

Cloudflare and Supabase secret values must remain in their platform secret/environment stores and must not be copied into GitHub source, issues, PRs, screenshots, or public logs.

## Personal data / child privacy

- [x] The previously hard-coded admin email was removed from `.env.example`.
- [x] Existing public Git author email exposure is documented as metadata rather than a credential.
- [ ] Keep example accounts/IDs synthetic.
- [ ] Never commit real child photo/video/audio without a documented authorized reason and distribution right.
- [ ] Re-review screenshots, fixtures, QA captures, and logs whenever new child-data features are introduced.
- [ ] Parent/privacy controls must exist before external child-data inference is shipped.
- [ ] No future AI/OCR design may silently upload continuous/full camera feeds to an external provider.

## Third-party assets / provenance

- [x] Affiliate/marketplace image redistribution risk was identified.
- [x] Canonical affiliate provenance metadata/control exists.
- [x] Local affiliate imagery is fail-closed unless an `owned`/`licensed` record explicitly permits redistribution.
- [x] Unverified tracked affiliate binaries were removed from the current tree.
- [x] Legacy local affiliate image paths were nulled in the fallback catalog.
- [x] Catalog generation/CI rejects unapproved local affiliate imagery.
- [ ] Continue provenance review for new artwork, brand assets, concepts, OG/QA imagery, fonts, models, datasets, and audio as they are added.
- [ ] Future TTS/OCR/AI assets must not be bundled until base-model license, dataset provenance, voice consent, and commercial-use rights are verified.

Removing a file from the current tree does not erase an already-published Git object.

## GitHub repository controls

`Protect main` is verified Active.

- [x] Default branch targeted.
- [x] Bypass list empty.
- [x] Pull request required.
- [x] Conversation resolution required.
- [x] Squash merge only.
- [x] Strict/up-to-date required-check policy.
- [x] Linear history required.
- [x] Default-branch deletion blocked.
- [x] Non-fast-forward/force-push blocked.
- [ ] `Secret history scan` added to the ruleset required-check list if not already present.
- [ ] Review Dependabot/security alert/Private Vulnerability Reporting settings where available.

## Deployment

Canonical production architecture:

```text
GitHub `main`
  -> Cloudflare Git integration / build
  -> OpenNext Cloudflare Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

- [x] Repository contains `@opennextjs/cloudflare`, `open-next.config.ts`, and `wrangler.jsonc`.
- [x] Worker name in `wrangler.jsonc` is `mainlagi-hub`.
- [x] GitHub CI validates the OpenNext/Cloudflare production artifact.
- [x] Obsolete VPS/SSH GitHub deployment workflow is removed from the canonical architecture.
- [ ] Cloudflare Git integration repository/branch mapping is verified from the Cloudflare dashboard.
- [ ] Cloudflare runtime variables point to canonical Supabase project.
- [ ] Custom domain `mainlagihub.my.id` is verified against the intended deployment.
- [ ] A post-correction production deployment succeeds and public health is verified.
- [ ] Authenticated learning/mastery write-path smoke test succeeds.
- [ ] Guest/local fallback smoke test succeeds.

Supabase leaked-password protection remains unavailable on the current Free plan; minimum password length >= 8 plus secure/current-password change protections are the current mitigation. This is an accepted plan limitation rather than a deployment blocker.

## Branch / project-state hygiene

- [x] `main` is defined as the only canonical product branch.
- [x] Persistent `develop` is explicitly rejected for the current workflow.
- [x] Stacked PR #5 was superseded by clean current-main PR #9 and closed.
- [x] Mainlagi World was cleanly landed via PR #9 after fresh QA.
- [x] Branch lifecycle policy is documented in `BRANCH_LIFECYCLE.md`.
- [ ] Old merged/superseded remote branches deleted in GitHub after active work is complete.
- [ ] Local clones use `git fetch origin --prune` (or `fetch.prune=true`) after remote cleanup.

## Open-core / paid-product boundary

Before merging any paid-tier feature:

- [x] Canonical tier/code-boundary policy exists.
- [ ] Classify the feature as Community AGPL contract/code vs proprietary paid implementation/content.
- [ ] Keep proprietary implementations/assets outside the public AGPL tree unless an explicit reviewed license says otherwise.
- [ ] Confirm third-party dependencies/models/data permit the intended distribution and commercial use.
- [ ] Confirm contributor rights are sufficient if externally authored code may also be offered under alternative commercial licensing.
- [ ] Preserve a meaningful functional Community product.

## Next engineering gate

Finish Cloudflare production closure of the learning-attempt/mastery foundation, then continue explicit measurable activity-result integration, wider adaptive next-best UI integration, and curriculum/content expansion.

Expected sequence:

```text
focused branch
  -> PR
  -> required CI + secret-history scan
  -> squash merge to protected main
  -> Cloudflare Git integration deploys canonical main
  -> production smoke checks
  -> delete branch
```

## External/local verification still required before clone handoff is considered complete

- [ ] Clean public clone/install from a fresh local environment.
- [ ] Local `npm ci` / checks / Cloudflare build validated against final canonical `main`.
- [ ] Final local-setup instructions match the actual environment variables and Node version in the repository.
- [ ] Remote branch cleanup complete or explicitly documented as the only remaining manual branch action.

Public visibility is not a one-time checklist completion. It permanently changes the project threat model, contribution model, asset provenance requirements, and operational controls.
