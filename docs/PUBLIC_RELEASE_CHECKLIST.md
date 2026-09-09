# Public Repository Readiness & Ongoing Audit Checklist

`ceritaantarkita-req/mainlagi-hub` is **Public**. This checklist tracks security, licensing, privacy, provenance, governance, and operational readiness. Historical evidence is recorded in `PUBLIC_EXPOSURE_AUDIT_20260909.md`; current project state is recorded in `CURRENT_STATE.md`.

Public visibility exposes source and published Git history to the internet. Anything that should not be public must be treated as exposed if it was present in published Git objects, logs, issues, PRs, or attachments.

## Current manual/account-level blockers

- [ ] Add `Secret history scan` as the fifth required status check in `Protect main`.
- [ ] Restore/verify the four required GitHub Actions deployment secrets.
- [ ] Verify the VPS forced-command deployment boundary and a successful production deployment end to end.
- [ ] Delete merged/superseded remote branches after active closure work is finished.

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

- [x] Production build is a permanent CI gate.
- [x] Ubuntu quality is a permanent CI gate.
- [x] Windows compatibility is a permanent CI gate.
- [x] Production dependency audit is a permanent CI gate.
- [x] Full fetched Git history is scanned with pinned Gitleaks and redacted output.
- [x] Asset provenance validation runs in Ubuntu quality CI.
- [x] Primary CI workflow defaults to read-only repository contents permissions.
- [x] Temporary QA/write workflows used during remediation were removed before final merge heads.
- [x] Mainlagi World clean mainline port passed automated CI and fresh responsive visual/interaction QA before merge.

## Secret / credential review

- [x] Full fetched Git refs/history have passed Gitleaks scanning using `--log-opts="--all"`.
- [x] Reviewed public PR/issue material did not reveal an actual credential value in the inspected content.
- [x] Reviewed temporary maintenance workflow sources were narrowly scoped and later removed.
- [x] No credential rotation/history rewrite was triggered by the 9 September audit because no matching real credential was identified.
- [ ] Optional manual UI spot-check of archived historical Actions raw logs remains useful because the integration audit did not inspect every historical log byte.
- [ ] If a real credential is discovered later, rotate/revoke it immediately before deciding whether history rewriting is warranted.

Scanner success is strong evidence, not proof that every possible secret pattern or non-Git attachment is safe.

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
- [ ] `Secret history scan` added to the ruleset required-check list. The CI job exists, but this setting still requires a GitHub Settings change.
- [ ] Review Dependabot/security alert/Private Vulnerability Reporting settings where available.

## Deployment

- [x] Deployment workflows reference GitHub Actions secrets rather than committed secret values.
- [x] Automatic production job is restricted to pushes to `main` and waits for CI/security prerequisites.
- [x] Pull requests do not execute the production job.
- [x] SSH workflow uses strict host-key checking and removes the temporary private-key file.
- [x] Intended forced-command deployment design is documented.
- [ ] Required Actions secrets are currently configured/available to the job.
- [ ] Current VPS key is verified to enforce the intended server-side forced command.
- [ ] A post-governance production deployment succeeds end to end and public health is verified.

A recent main run failed at `Validate deployment secrets` before SSH. Treat that as an explicit fail-closed operational blocker, not as a successful deployment.

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

The next public-core architecture work is canonical learning attempts/skills/mastery above the existing activity runtimes. Legacy game score/session structures must not become the universal curriculum/mastery model by accident.

Expected sequence:

```text
focused branch
  -> PR
  -> required CI + secret-history scan
  -> visual/privacy/license/provenance QA as applicable
  -> squash merge to protected main
  -> delete branch
  -> main remains canonical
```

## External/local verification still required before clone handoff is considered complete

- [ ] Clean public clone/install from a fresh local environment.
- [ ] Local `npm ci` / checks / build validated against final canonical `main`.
- [ ] Final local-setup instructions match the actual environment variables and Node version in the repository.
- [ ] Remote branch cleanup complete or explicitly documented as the only remaining manual branch action.

Public visibility is not a one-time checklist completion. It permanently changes the project threat model, contribution model, asset provenance requirements, and operational controls.
