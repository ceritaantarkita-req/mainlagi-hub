# Public Repository Readiness & Ongoing Audit Checklist

`ceritaantarkita-req/mainlagi-hub` is already **Public** as of 9 September 2026.

This checklist is therefore no longer only a pre-release gate. It is the ongoing security, licensing, privacy, and repository-hardening checklist for the public project.

Public visibility exposes repository source and Git history to the internet. Anything that should not be public must be treated as already exposed if it was present in published history, logs, issues, PRs, or attachments.

## Immediate post-public priorities

The following items should be treated as the highest-priority follow-up until verified:

1. Full Git-history secret scan, not only the current tree.
2. Historical GitHub Actions log/artifact review for accidental secret output.
3. Review public issues/PRs/comments/attachments for sensitive data.
4. Protect `main` with branch protection or a GitHub ruleset.
5. Review third-party image/audio/font/model/data provenance.
6. Confirm public clone/install works from a clean machine.

Known repository state checked on 9 September 2026:

- GitHub detects the repository license as **GNU Affero General Public License v3.0**.
- `package.json` declares `AGPL-3.0-only`.
- The repository has no active repository rulesets exposed by the GitHub rulesets API.
- The `main` branch reports `protected: false`.
- CI workflow permissions default to `contents: read`.
- Production deployment in the primary CI workflow is gated to a `push` on `main`, after quality/build/audit jobs; it is not run for pull-request events.

## Gate A — Code and CI

- [ ] `main` contains only intended source/history.
- [ ] Production build passes on the current public head.
- [ ] Ubuntu quality gate passes on the current public head.
- [ ] Windows compatibility gate passes on the current public head.
- [ ] Production dependency audit passes on the current public head.
- [x] No temporary write-capable maintenance workflow is present in `.github/workflows/` at the time of this review.
- [ ] No stale PR intended to stay private contains sensitive information.

## Gate B — Secret and credential review

A current-tree search is not enough. **Git history must be scanned.**

- [ ] Scan all refs/history with a secret scanner such as `gitleaks` and/or `trufflehog`.
- [ ] Search for private keys, JWTs, Supabase service-role keys, OAuth secrets, provider tokens, SSH material, webhook secrets, database credentials, `.env` contents, and future OpenRouter keys.
- [ ] Review historical CI/Actions logs for accidental secret output.
- [ ] Review GitHub issues/PRs/comments/attachments that are now public.
- [ ] Rotate any credential that has ever been exposed, even if the file/commit was later deleted.
- [ ] If a real secret exists in Git history, rewrite/purge history where appropriate and rotate the secret.

Suggested local commands/tools should be run from a trusted clone with all refs fetched. Do not paste scan findings containing secrets into public issues.

## Gate C — Personal data

- [ ] No personal email/phone/address is included unintentionally in templates, fixtures, screenshots, commit examples, or docs.
- [ ] No child photo/video/audio is committed without a clear authorized reason and distribution right.
- [ ] QA captures and logs do not contain unnecessary identifying data.
- [ ] Example accounts/IDs are synthetic.
- [ ] Historical Git author metadata has been reviewed and its public exposure is accepted.

Note: Git commit metadata may contain contributor email addresses. Public repository history should be treated as already published information.

## Gate D — Licensing

- [x] Root `LICENSE` exists and GitHub detects AGPL-3.0.
- [x] `package.json` declares `AGPL-3.0-only`.
- [x] `NOTICE.md` explains source-code licensing scope.
- [x] `COMMERCIAL_LICENSE.md` explains the separate commercial path.
- [x] `OPEN_CORE.md` defines the community vs paid/proprietary architecture boundary.
- [x] `TRADEMARKS.md` separates brand/character rights from code rights.
- [x] `THIRD_PARTY_NOTICES.md` exists.
- [ ] Review that no file claims a license incompatible with its actual source/provenance.
- [ ] Establish a formal contributor-rights/CLA process before accepting substantial external code where alternative commercial relicensing rights are needed.

Important licensing interpretation:

- AGPL permits commercial use when its terms are followed.
- A separate Mainlagi commercial license is an alternative rights path, not a blanket fee for every commercial use.
- Premium/proprietary code and assets should normally be kept outside the public AGPL source tree unless their licensing status is explicit.

See `OPEN_CORE.md`.

## Gate E — Third-party assets and dependencies

- [ ] Review `public/` and other asset directories for image/audio/font provenance.
- [ ] Affiliate product images are clearly treated as third-party/reference materials.
- [ ] MediaPipe runtime/model redistribution behavior is reviewed for the release format.
- [ ] Fonts keep their required notices/licenses.
- [ ] No third-party character/art asset is silently presented as Mainlagi-owned.
- [ ] Future TTS/OCR/AI model assets are not bundled until model/data/commercial terms are reviewed.
- [ ] Community TTS/model claims are independently checked for base-model license, dataset provenance, voice consent, and commercial-use rights before production use.

## Gate F — Documentation accuracy

- [ ] README matches current game count and architecture after each major product change.
- [ ] Planned learning-platform features are marked **Planned** until actually shipped.
- [ ] OCR/OpenRouter is not described as implemented before code exists.
- [ ] `docs/KNOWN_LIMITATIONS.md` is reviewed for stale statements.
- [ ] Historical audit files are clearly historical evidence, not current guarantees.
- [ ] Deployment documentation does not expose real hosts, users, keys, or secrets.
- [x] README states that the repository is already public and links the open-core/commercial licensing model.

## Gate G — GitHub public-repo settings

Current known gap: on 9 September 2026, `main` reports `protected: false` and the repository rulesets collection is empty.

- [ ] Protect `main` with a ruleset and/or branch protection.
- [ ] Require pull requests for changes to `main`.
- [ ] Require relevant CI checks before merge.
- [ ] Prevent force-push and accidental branch deletion on `main`.
- [ ] Enable Dependabot/security alerts where appropriate.
- [ ] Enable GitHub Private Vulnerability Reporting if available.
- [ ] Review Actions permissions; default to read-only and grant write permissions only to workflows that need them.
- [ ] Review whether workflows triggered from forks can access secrets; fork PRs must not receive production secrets.
- [ ] Review environments/deployment approvals for production.

## Gate H — Production deployment safety

- [ ] Repository Actions secrets remain stored as GitHub secrets, never files.
- [x] The primary CI workflow does not execute its production deploy job for `pull_request`; it requires a `push` to `refs/heads/main`.
- [x] The primary deploy job depends on quality, build, Windows compatibility, and production dependency-audit jobs.
- [x] SSH host verification is configured with `StrictHostKeyChecking=yes` in the current deployment workflow.
- [ ] Review the manual deployment workflow and repository access controls so only authorized maintainers can invoke production deployment.
- [ ] Production service-role and future OpenRouter keys remain server-side.

## Gate I — Child/AI privacy readiness

For a public repository, planned AI does not need to be implemented. But the architecture must not encourage unsafe implementation.

- [ ] `SECURITY.md` child-data expectations have been reviewed against current code.
- [ ] `docs/AI_OCR_OPENROUTER.md` keeps the provider key server-only.
- [ ] No design or implementation silently performs continuous camera upload to AI providers.
- [ ] Future parent/privacy controls are tracked before external child-data inference ships.
- [ ] Any future voice dataset/model has documented consent, provenance, retention, and child-safety boundaries.

## Gate J — Open-core / paid product boundary

Before merging a feature intended for a paid Mainlagi tier:

- [ ] Decide whether the implementation itself is community AGPL code or proprietary commercial code.
- [ ] If proprietary, keep it in a separate private repository/package/service unless an explicit reviewed license boundary requires otherwise.
- [ ] Keep Mainlagi trademarks, characters, premium voice/art, and commercial content rights separate from the code license.
- [ ] Confirm third-party dependencies/models/data permit the intended commercial use.
- [ ] Confirm contributor rights are sufficient if the same code may also be offered under alternative commercial licensing.
- [ ] Preserve a meaningful, functional community core rather than turning the public repository into a nonfunctional teaser.

See `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `TRADEMARKS.md`.

## Ongoing public-release loop

Recommended process for material changes:

```text
focused branch
  -> PR
  -> CI green
  -> security/privacy/license review where applicable
  -> merge to protected main
  -> deployment gate
  -> verify public docs/source behavior
```

## External-style verification

- [x] Repository landing source is publicly accessible.
- [x] GitHub detects the intended AGPL license.
- [ ] Verify no secret appears in public Actions logs/history.
- [ ] Verify public clone/install instructions work from a clean environment.
- [ ] Verify production deploy does not expose credentials.
- [ ] Add a source/legal notice to public network deployments where required by the applicable AGPL deployment scenario.
- [ ] Periodically repeat history/log/dependency/provenance reviews as the project grows.

Do not treat “repository is public” as completion. Public status changes the threat model, contribution model, licensing obligations, and operational controls permanently.
