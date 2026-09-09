# Public Repository Readiness & Ongoing Audit Checklist

`ceritaantarkita-req/mainlagi-hub` is already **Public** as of 9 September 2026.

This checklist is the ongoing security, licensing, privacy, provenance, and repository-hardening checklist for the public project. Verified evidence from the 9 September 2026 audit is recorded in [`PUBLIC_EXPOSURE_AUDIT_20260909.md`](PUBLIC_EXPOSURE_AUDIT_20260909.md).

Public visibility exposes repository source and Git history to the internet. Anything that should not be public must be treated as already exposed if it was present in published history, logs, issues, PRs, or attachments.

## Current priority order

1. Merge and retain the full-history `Secret history scan` CI job.
2. Add `Secret history scan` to the `Protect main` required checks after the job exists on `main`.
3. Remediate unresolved third-party/local asset provenance.
4. Perform optional manual GitHub-UI spot-checks of historical raw Actions log bodies that cannot be retrieved through the available integration.
5. Establish a formal CLA/contributor-rights process before substantial external code is accepted where alternative commercial relicensing rights are needed.
6. Confirm public clone/install from a clean external machine/environment.

## Known repository state — 9 September 2026

- [x] Repository visibility is Public.
- [x] GitHub detects the repository license as GNU Affero General Public License v3.0.
- [x] `package.json` declares `AGPL-3.0-only`.
- [x] Repository ruleset `Protect main` exists and is Active.
- [x] `Protect main` targets the default branch.
- [x] Ruleset bypass list is empty.
- [x] Pull requests are required for the protected default branch.
- [x] Squash is the only allowed merge method under the ruleset.
- [x] Branch deletion is restricted.
- [x] Force-push/non-fast-forward updates are blocked.
- [x] Required status checks use strict/up-to-date policy.
- [x] CI workflow permissions default to `contents: read`.
- [x] Production deploy in the primary CI workflow is not executed for pull-request events.

## Gate A — Code and CI

- [ ] `main` contains only intended source/history; continue reviewing intentionally retained historical material as the project evolves.
- [x] Production build passed on the public-exposure audit PR head.
- [x] Ubuntu quality gate passed on the public-exposure audit PR head.
- [x] Windows compatibility gate passed on the public-exposure audit PR head.
- [x] Production dependency audit passed on the public-exposure audit PR head.
- [x] Full-history secret scan passed on the public-exposure audit PR head.
- [x] No temporary write-capable maintenance workflow is present in the current `.github/workflows/` tree at the time of this review.
- [ ] Deliberately close, supersede, or retain stale draft PR #5; do not leave it indefinitely without an explicit decision.

## Gate B — Secret and credential review

A current-tree search is not enough. Git history must be scanned and non-Git surfaces must be reviewed separately.

- [x] Full fetched Git refs/history scanned with Gitleaks v8.30.1 using `--log-opts="--all"` and redacted output; GitHub Actions run `34330844307` passed.
- [x] Reviewed public PR/issue material did not reveal an actual credential value in the inspected content/keyword checks.
- [x] Historical temporary write-workflow source was structurally reviewed for the observed maintenance workflows.
- [x] Reviewed successful temporary maintenance runs exposed no uploaded GitHub Actions artifacts through their artifact inventories.
- [ ] Complete optional manual UI spot-check of archived historical Actions raw log bodies; the available integration cannot download those archived log bodies.
- [x] No credential rotation/history rewrite was triggered by this audit because the full-history scanner did not identify a matching secret and no actual credential value was identified in reviewed public PR/issue material.
- [ ] If a real credential is discovered later, rotate it immediately even if it was deleted from the current tree; evaluate history purge/rewrite separately.

Scanner success is evidence, not a proof that every possible credential pattern or external attachment is safe. Keep the scan as an ongoing CI gate.

## Gate C — Personal data and public metadata

- [x] The previously hard-coded public admin email was removed from the current `.env.example`.
- [ ] Review templates, fixtures, screenshots, QA captures, and docs whenever new personal data is added.
- [ ] No child photo/video/audio may be committed without a documented authorized reason and distribution right.
- [ ] Example accounts/IDs must remain synthetic.
- [x] Historical/public Git metadata was reviewed sufficiently to observe that `ceritaantarkita@gmail.com` appears as contributor author metadata.
- [ ] Decide whether that author email is intentionally public. If not desired for future commits, configure a GitHub `noreply` author address; do not rewrite published history casually.

## Gate D — Licensing and open-core structure

- [x] Root `LICENSE` exists and GitHub detects AGPL-3.0.
- [x] `package.json` declares `AGPL-3.0-only`.
- [x] `NOTICE.md` explains source-code licensing scope.
- [x] `COMMERCIAL_LICENSE.md` explains the separate commercial path.
- [x] `OPEN_CORE.md` defines the community vs paid/proprietary architecture boundary.
- [x] `TRADEMARKS.md` separates brand/character rights from source-code rights.
- [x] `THIRD_PARTY_NOTICES.md` exists.
- [ ] Review file-by-file provenance so no source/asset claims a license incompatible with its actual origin.
- [ ] Establish a formal contributor-rights/CLA process before accepting substantial external code where alternative commercial relicensing rights are needed.

Important interpretation:

- AGPL permits commercial use when its terms are followed.
- A separate Mainlagi commercial license is an alternative rights path, not a blanket fee for every commercial use.
- Proprietary premium source/assets should normally live outside the public AGPL source tree unless their licensing status is explicit.

## Gate E — Third-party assets and dependencies

### Current blocker: asset provenance

- [x] The public asset tree was reviewed sufficiently to identify provenance as a real unresolved area.
- [x] `THIRD_PARTY_NOTICES.md` warns that marketplace/manufacturer imagery remains owned by its respective rights holders and that repository presence does not grant redistribution rights.
- [ ] Build a canonical per-file/per-item provenance registry for public binary assets.
- [ ] Affiliate catalog/generator must reject new local product assets unless provenance/permission metadata is present.
- [ ] Classify current local affiliate images as `owned`, `licensed`, `third-party-reference`, or `unverified`.
- [ ] Remove/replace local third-party binaries for which no redistribution basis can be documented.
- [ ] Record ownership/provenance for `public/artwork/`, `public/brand/`, `public/concepts/`, `public/og/`, and relevant QA imagery.
- [ ] Review MediaPipe runtime/model redistribution behavior for the release format.
- [ ] Confirm fonts keep their required licenses/notices.
- [ ] Future TTS/OCR/AI model assets must not be bundled until base-model license, dataset provenance, voice consent, and commercial-use rights are reviewed.

A generic notice is not proof of permission to redistribute a specific binary file.

## Gate F — Documentation accuracy

- [x] README states that the repository is already public and links the open-core/commercial licensing model.
- [x] A dated public-exposure audit report exists.
- [ ] README must continue to match the current game/activity count and architecture after major changes.
- [ ] Planned features must remain marked Planned until actually shipped.
- [ ] OCR/OpenRouter must not be described as implemented before the code exists.
- [ ] Review `docs/KNOWN_LIMITATIONS.md` for staleness after each major architecture phase.
- [ ] Historical audit files must remain clearly dated evidence, not timeless guarantees.
- [ ] Deployment documentation must not expose real hosts, usernames, keys, or secrets.

## Gate G — GitHub public-repository controls

`Protect main` was verified active through the GitHub rulesets API.

- [x] Protect the default branch with an active repository ruleset.
- [x] Require pull requests before merge.
- [x] Require conversation resolution before merge.
- [x] Allow squash merge only under the ruleset.
- [x] Require relevant existing CI checks before merge.
- [x] Require branch to be up to date before merge.
- [x] Prevent force-push/non-fast-forward updates.
- [x] Prevent accidental default-branch deletion.
- [ ] After this audit PR merges, add `Secret history scan` as a fifth required status check in `Protect main`.
- [ ] Enable/review Dependabot and security alerts where appropriate.
- [ ] Enable/review GitHub Private Vulnerability Reporting if available.
- [x] Primary CI Actions permission defaults to read-only repository contents.
- [x] Primary production deploy does not run for pull-request events, so fork PRs do not execute that deploy job.
- [ ] Review production environment approvals and manual-workflow access periodically at the account/repository settings level.

## Gate H — Production deployment safety

- [x] Primary deploy secrets are referenced through GitHub Actions secrets, not committed values in the reviewed workflow.
- [x] Primary CI production deploy requires a push to `refs/heads/main`.
- [x] Primary deploy depends on quality, build, Windows compatibility, and production dependency-audit jobs.
- [x] This audit PR adds full-history secret scan as an additional deploy prerequisite.
- [x] SSH known-host verification uses `StrictHostKeyChecking=yes` in the current primary workflow.
- [x] The temporary SSH private-key file is removed in an `always()` cleanup step.
- [ ] Review who can invoke the separate manual deployment workflow and whether environment approvals should be added.
- [ ] Production service-role and future OpenRouter keys must remain server-side.

## Gate I — Child/AI privacy readiness

- [ ] Re-review `SECURITY.md` child-data expectations against each shipped child-data feature.
- [ ] Keep `docs/AI_OCR_OPENROUTER.md` provider keys server-only.
- [ ] No design/implementation may silently perform continuous camera upload to external AI providers.
- [ ] Parent/privacy controls must exist before external child-data inference ships.
- [ ] Any future voice dataset/model needs documented consent, provenance, retention, and child-safety boundaries.

## Gate J — Open-core / paid product boundary

Before merging a feature intended for a paid Mainlagi tier:

- [ ] Decide whether the implementation itself is Community AGPL code or proprietary commercial code.
- [ ] If proprietary, keep it in a separate private repository/package/service unless a reviewed explicit licensing boundary requires otherwise.
- [ ] Keep Mainlagi trademarks, characters, premium voice/art, and commercial content rights separate from the code license.
- [ ] Confirm third-party dependencies/models/data permit the intended commercial use.
- [ ] Confirm contributor rights are sufficient if the same code may also be offered under alternative commercial licensing.
- [ ] Preserve a meaningful functional community core rather than turning the public repository into a nonfunctional teaser.

See `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `TRADEMARKS.md`.

## Ongoing public-release loop

```text
focused branch
  -> PR
  -> required CI + secret-history scan
  -> security/privacy/license/provenance review where applicable
  -> squash merge to protected main
  -> deployment gate
  -> verify public docs/source/runtime behavior
```

## External-style verification

- [x] Repository landing source is publicly accessible.
- [x] GitHub detects the intended AGPL license.
- [x] Full Git-history secret scan has a repeatable CI implementation and a successful audit run.
- [ ] Perform manual spot-check of historical raw Actions logs if account UI access is available.
- [ ] Verify public clone/install instructions from a clean external environment.
- [ ] Verify production deployment after the audit PR does not expose credentials.
- [ ] Add a source/legal notice to public network deployments where required by the applicable AGPL deployment scenario.
- [ ] Periodically repeat history/log/dependency/provenance reviews as the project grows.

Do not treat Public visibility as completion. Public status permanently changes the threat model, contribution model, licensing obligations, and operational controls.
