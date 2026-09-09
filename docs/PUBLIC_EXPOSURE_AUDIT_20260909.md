# Mainlagi Hub Public Exposure Audit — 2026-09-09

Status: **active remediation audit**

This document records what was actually verified after `ceritaantarkita-req/mainlagi-hub` became public. It intentionally separates verified findings from items that still require remediation or a manual/account-level check.

## Executive summary

### Verified / positive

- Repository visibility is Public.
- GitHub detects the root license as GNU Affero General Public License v3.0.
- The default branch is covered by the active `Protect main` repository ruleset.
- Direct deletion and force-push/non-fast-forward updates to the protected default branch are blocked by the ruleset.
- Pull requests are required for the protected default branch.
- Squash is the only allowed merge method under the ruleset.
- Existing required checks are strict and require the branch to be up to date.
- A full-history Gitleaks scan was added to CI and executed successfully against all fetched Git refs/history with redacted output.
- The current primary CI workflow uses `permissions: contents: read`.
- Production deployment in the primary CI workflow runs only for a push to `main` after its prerequisite jobs succeed; it is not executed for pull-request events.
- The reviewed temporary historical write-capable maintenance workflows were branch-scoped to same-repository PR branches and are no longer present in the current workflow tree.
- The reviewed temporary maintenance workflow runs did not publish GitHub Actions artifacts.

### Open / remediation required

- `Secret history scan` still needs to be added manually to the `Protect main` ruleset required checks after the new CI job is merged and has a stable check identity on `main`.
- Historical Actions log bodies could not be programmatically downloaded through the available GitHub integration in this audit. Job metadata, historical workflow source, and artifact inventories were reviewed, but this is not equivalent to a byte-for-byte log review.
- Public Git commit / Actions metadata contains the contributor email `ceritaantarkita@gmail.com`. This is already public metadata; whether to keep using it is an account/privacy decision. Future commits can use a GitHub `noreply` address if preferred.
- Affiliate/marketplace product images are stored in `public/affiliate/` and referenced by the public catalog, but the repository does not record per-file distribution rights/provenance. The generic third-party notice does not establish permission to redistribute each image.
- `public/artwork/` and other creative assets need a per-file provenance/ownership record before their licensing status can be considered fully verified.
- Draft PR #5 is a stacked product/UI PR whose base is `feature/mobile-learning-ui-system-20260909`, not `main`. It should be treated as intentional stacked development until the product branch strategy decides otherwise; this audit does not close or supersede it automatically.
- A formal CLA/contributor-rights process is still required before accepting substantial outside code if Mainlagi intends to preserve an alternative commercial licensing path.

## 1. Full Git-history secret scan

### Implementation

The primary CI workflow now contains a dedicated job:

```text
Secret history scan
```

The job:

- checks out the repository with `fetch-depth: 0`;
- installs Gitleaks `v8.30.1` from the canonical Go module path;
- invokes the Git scanner with `--log-opts="--all"`;
- uses `--redact` so a detected value is not intentionally printed in clear text by the scanner.

### Result

GitHub Actions run `34330844307`, head `85263822aab2eb0f9e187163c66c63bcc681b3da`:

- `Secret history scan`: **success**
- `Production build`: **success**
- `Quality gate (Ubuntu)`: **success**
- `Windows compatibility`: **success**
- `Production dependency audit`: **success**

The successful full-history scanner result means the scanner did not detect a secret matching its rules in the fetched history/refs for that run. It is strong evidence, but it is not a mathematical guarantee that no credential has ever existed: scanners can have false negatives and do not cover data stored outside Git objects such as issue attachments or arbitrary historical Actions log output.

## 2. Public PR / issue exposure review

The public pull-request set was reviewed at a metadata level. Current/known items at the time of audit included merged licensing/security work, closed older PRs, this audit PR, and stacked draft PR #5.

PR #5 was verified to target `feature/mobile-learning-ui-system-20260909` rather than `main`, so it is part of a stacked feature-branch workflow rather than an ordinary stale PR against the protected default branch.

For PR #5, the fetched patch was searched for high-risk credential indicators including:

- `API_KEY`
- `secret`
- `password`
- `token`
- `BEGIN`
- `PRIVATE KEY`
- `service_role`
- `OPENROUTER`

No actual credential value was identified by those searches. This keyword review is supplemental; the full-history scanner is the stronger automated Git-content control.

The public issue set contained one observed planning issue for OCR/OpenRouter. It uses placeholder environment-variable names and architecture discussion; no actual credential value was identified in the reviewed issue content.

### Follow-up

- Keep stacked PR #5 only while its feature-chain/base-branch strategy remains intentional; close or rebase it later only as part of the product-development decision, not as an exposure-audit side effect.
- Continue treating screenshots/attachments as a separate privacy surface: attachments are not covered by Git-content secret scanning.

## 3. Historical GitHub Actions review

Historical Actions metadata shows several temporary write-capable maintenance workflows that were intentionally used on same-repository PR branches and then deleted from the current workflow tree. Reviewed examples include:

- `Prepare public license`
- `Repair sanitizer lockfile`
- `Repair dependency lockfile`
- `Repair nanoid lockfile`

The historical workflow sources were reviewed. Each reviewed workflow:

- explicitly requested `contents: write` because it needed to commit generated files;
- was triggered on `pull_request` to `main`;
- contained an `if` condition restricting execution to a same-repository PR and an exact expected maintenance branch;
- pushed only back to the PR head branch;
- did not contain a production credential reference in the reviewed YAML;
- is absent from the current `.github/workflows/` directory.

Reviewed successful maintenance runs exposed no uploaded Actions artifacts through their artifacts endpoints.

### Important limitation

The available GitHub integration exposes workflow/run/job metadata and artifact inventories but does not expose the archived job-log download endpoint used for a complete historical raw-log review. Therefore this audit does **not** claim that every historical log line has been manually inspected.

If account UI access is available, maintainers should still spot-check historical Actions log bodies for the temporary write workflows and production deploy runs, especially any failed run where shell diagnostics may have been more verbose.

## 4. Personal metadata

Public commit and Actions metadata currently exposes:

```text
ceritaantarkita@gmail.com
```

This was observed as Git author metadata. It is different from a secret credential and is already part of published repository history.

Decision required:

- if this address is intentionally public, no history change is required;
- if future exposure is unwanted, configure Git to use the GitHub-provided `noreply` address for future commits;
- rewriting published history solely to hide an already-public author email is disruptive and should not be done casually.

The previously hard-coded public admin email in `.env.example` has already been removed from the current tree.

## 5. Asset and third-party provenance

### Affiliate / marketplace images

The repository contains many local product images under `public/affiliate/`. `public/affiliate/manifest.txt` and `src/lib/data/affiliate-catalog.json` connect those local files to third-party marketplace/product entries.

The repository already warns in `THIRD_PARTY_NOTICES.md` that marketplace/manufacturer imagery remains owned by its respective rights holders and that repository presence does not grant redistribution rights.

That warning is necessary but **not sufficient provenance**. The current catalog/generator does not require a per-item record such as:

- source URL or source record;
- rights holder;
- asset license / permission basis;
- attribution requirement;
- whether local redistribution is permitted;
- audit/review status.

Therefore the existing local affiliate image set must be treated as **provenance unresolved** until each retained asset has a documented lawful basis or is replaced/removed.

### Mainlagi artwork / brand assets

`public/artwork/`, `public/brand/`, `public/concepts/`, `public/og/`, and QA imagery also need an explicit ownership/provenance inventory. `TRADEMARKS.md` reserves Mainlagi brand/character rights, but trademark policy alone does not prove the copyright provenance of every binary asset.

### Required remediation

Use a dedicated follow-up PR to:

1. introduce a canonical asset-provenance registry/schema;
2. make the affiliate catalog generator reject new local assets without provenance metadata;
3. classify current local assets as `owned`, `licensed`, `third-party-reference`, or `unverified`;
4. remove/replace unverified redistributable binaries where no valid basis can be documented;
5. keep premium Mainlagi character/voice/art assets outside the public AGPL source tree unless their public-distribution terms are explicit.

Deleting a file from the current tree does not erase it from already-published Git history. If an asset is later confirmed to be unlawfully distributed, legal/remediation review should determine whether history rewriting is warranted.

## 6. Branch protection / repository rules

Verified repository ruleset:

```text
Protect main
```

Observed policy:

- enforcement: Active;
- target: default branch;
- bypass list: empty;
- branch deletion blocked;
- non-fast-forward / force-push blocked;
- PR required;
- required approving reviews: 0 (appropriate for the current single-maintainer workflow);
- review-thread resolution required;
- squash only;
- strict required checks / branch-up-to-date policy enabled;
- linear history required.

At the time this audit branch was opened, required checks are:

- `Production build`
- `Quality gate (Ubuntu)`
- `Windows compatibility`
- `Production dependency audit`

After this PR merges, add:

- `Secret history scan`

as a fifth required check in the GitHub ruleset UI.

## 7. CI and deployment boundary

The current primary CI workflow defaults to read-only repository contents permissions.

The production deploy job:

- is conditional on a `push` to `refs/heads/main`;
- is not executed for pull-request events;
- depends on CI gates;
- uses repository secrets only inside the deploy job;
- uses strict SSH known-host checking;
- removes the temporary private key file from the runner in an `always()` cleanup step.

This audit PR adds the full-history scan to the deploy prerequisites as well.

The separate manual deployment workflow remains an operational fallback. Repository write/access governance and who can invoke manual workflows is an account-level control and should be reviewed periodically in GitHub Settings.

## 8. Risk register

| Area | Status | Risk / next action |
| --- | --- | --- |
| Public visibility | Verified | Public by design |
| AGPL code license | Verified | Keep file-specific exceptions explicit |
| Full Git-history secret scan | Passed | Make check mandatory in ruleset after merge |
| Current CI permissions | Verified | Keep default read-only |
| Main protection ruleset | Verified | Maintain strict PR/check policy |
| Historical write workflows | Reviewed structurally | Raw archived logs still need optional UI spot-check |
| PR/issue credential indicators | No value identified in reviewed material | Continue attachment hygiene |
| Stacked draft PR #5 | Intentional branch-stack candidate | Product workflow decides its lifecycle; exposure audit does not close it |
| Commit author email | Public/known | Decide whether future commits use noreply |
| Affiliate image provenance | **Unresolved** | Dedicated remediation PR required |
| Mainlagi binary artwork provenance | **Unresolved** | Build provenance inventory |
| Contributor relicensing rights | **Unresolved** | Formal CLA/contributor policy before large outside merges |

## 9. Next execution order

1. Merge this CI/audit PR only after all checks are green.
2. Add `Secret history scan` to the `Protect main` required status checks.
3. Execute the asset-provenance remediation PR.
4. Establish the CLA/contributor-rights process.
5. Finalize the implementation boundary for Community / Mainlagi Plus / Mainlagi School.
6. Continue `next_mainlagihub` implementation only with those boundaries treated as architecture constraints.

## 10. Audit limitations

This report is technical/project-governance evidence, not legal advice and not a guarantee of absence of all secrets or third-party rights claims.

The following were outside the available programmatic audit surface and remain manual/account-level checks where relevant:

- complete archived GitHub Actions raw log bodies;
- private repository/account security settings not exposed by the integration;
- proof of ownership/permission not stored in the repository;
- legal validity of third-party asset rights without source documentation;
- credentials or data that may have been exposed outside GitHub.
