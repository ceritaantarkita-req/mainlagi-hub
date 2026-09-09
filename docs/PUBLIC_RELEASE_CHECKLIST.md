# Public Repository Release Checklist

Use this checklist **before** changing `ceritaantarkita-req/mainlagi-hub` from private to public.

Repository visibility change is a release event, not a cosmetic setting change. Public visibility exposes the repository source and history to the internet.

## Gate A — Code and CI

- [ ] `main` contains only intended source/history.
- [ ] Production build passes.
- [ ] Ubuntu quality gate passes.
- [ ] Windows compatibility gate passes.
- [ ] Production dependency audit passes.
- [ ] No temporary write-capable maintenance workflow remains.
- [ ] No stale PR intended to stay private contains sensitive information.

## Gate B — Secret and credential review

A current-tree search is not enough. **Git history must be scanned.**

- [ ] Scan all refs/history with a secret scanner such as `gitleaks` and/or `trufflehog`.
- [ ] Search for private keys, JWTs, Supabase service-role keys, OAuth secrets, provider tokens, SSH material, webhook secrets, database credentials, `.env` contents, and future OpenRouter keys.
- [ ] Review historical CI/Actions logs for accidental secret output.
- [ ] Review GitHub issues/PRs/comments/attachments that will become visible.
- [ ] Rotate any credential that has ever been exposed, even if the file/commit was later deleted.
- [ ] If a real secret exists in Git history, rewrite/purge history before public release and rotate the secret.

Suggested local commands/tools should be run from a trusted clone with all refs fetched. Do not paste scan findings containing secrets into public issues.

## Gate C — Personal data

- [ ] No personal email/phone/address is included unintentionally in templates, fixtures, screenshots, commit examples, or docs.
- [ ] No child photo/video/audio is committed without a clear authorized reason and distribution right.
- [ ] QA captures and logs do not contain unnecessary identifying data.
- [ ] Example accounts/IDs are synthetic.

Note: Git commit metadata can contain contributor email addresses. Review whether historical author metadata is acceptable before publishing.

## Gate D — Licensing

- [ ] Root `LICENSE` exists and is the canonical AGPL-3.0-only license text.
- [ ] `package.json` declares `AGPL-3.0-only`.
- [ ] `NOTICE.md` explains scope.
- [ ] `COMMERCIAL_LICENSE.md` explains the separate commercial path.
- [ ] `TRADEMARKS.md` separates brand/character rights from code rights.
- [ ] `THIRD_PARTY_NOTICES.md` exists.
- [ ] No file claims a license incompatible with its actual source/provenance.
- [ ] Substantial external contributions are not merged without a contributor-rights strategy compatible with future commercial licensing.

## Gate E — Third-party assets and dependencies

- [ ] Review `public/` and other asset directories for image/audio/font provenance.
- [ ] Affiliate product images are clearly treated as third-party/reference materials.
- [ ] MediaPipe runtime/model redistribution behavior is reviewed for the release format.
- [ ] Fonts keep their required notices/licenses.
- [ ] No third-party character/art asset is silently presented as Mainlagi-owned.
- [ ] Future TTS/OCR/AI model assets are not bundled until model/data/commercial terms are reviewed.

## Gate F — Documentation accuracy

- [ ] README matches current game count and architecture.
- [ ] Planned learning-platform features are marked **Planned**.
- [ ] OCR/OpenRouter is not described as implemented before code exists.
- [ ] `docs/KNOWN_LIMITATIONS.md` is reviewed for stale statements.
- [ ] Historical audit files are clearly historical evidence, not current guarantees.
- [ ] Deployment documentation does not expose real hosts, users, keys, or secrets.

## Gate G — GitHub public-repo settings

Before/at release:

- [ ] Protect `main` with a ruleset/branch protection.
- [ ] Require pull requests for changes to `main`.
- [ ] Require relevant CI checks before merge.
- [ ] Prevent force-push and accidental branch deletion on `main`.
- [ ] Enable Dependabot/security alerts where appropriate.
- [ ] Enable GitHub Private Vulnerability Reporting if available.
- [ ] Review Actions permissions; default to read-only and grant write permissions only to workflows that need them.
- [ ] Review whether workflows triggered from forks can access secrets (they should not receive production secrets).
- [ ] Review environments/deployment approvals for production.

## Gate H — Production deployment safety

- [ ] Repository Actions secrets remain stored as GitHub secrets, never files.
- [ ] Public fork PRs cannot trigger the production deploy job with secrets.
- [ ] Deploy job still requires a push to the protected `main` branch and successful gates.
- [ ] SSH known-host verification remains strict.
- [ ] Production service-role and future OpenRouter keys remain server-side.

## Gate I — Child/AI privacy readiness

For the repository becoming public, planned AI does not need to be implemented. But the architecture must not encourage unsafe implementation.

- [ ] `SECURITY.md` documents child-data expectations.
- [ ] `docs/AI_OCR_OPENROUTER.md` keeps the provider key server-only.
- [ ] No design proposes continuous camera upload to AI providers.
- [ ] Future parent/privacy controls are tracked before external child-data inference ships.

## Gate J — Final release decision

Only change visibility after all blocking items above are resolved.

Recommended sequence:

```text
public-readiness branch
  -> PR
  -> CI green
  -> squash merge to protected main
  -> full history/asset/log scan
  -> configure public security/ruleset settings
  -> change repository visibility to Public
  -> immediately verify public README/LICENSE/security pages
```

## After visibility becomes public

- [ ] Verify repository landing page renders README correctly.
- [ ] Verify GitHub detects the intended license or the README clearly links the canonical `LICENSE`.
- [ ] Verify no secret appears in public Actions logs.
- [ ] Verify public clone/install instructions work from a clean environment.
- [ ] Verify production deploy did not expose new credentials.
- [ ] Add a source link/legal notice to public network deployments where required for the licensing model used by that deployment.

Do not treat “repository is public” as completion. The first public release should be followed by a fresh external-style review of what an anonymous visitor can see and run.
