# Contributing to Mainlagi Hub

Thanks for helping improve Mainlagi Hub.

Mainlagi Hub is a public **open-source core with a separate commercial offering**. That means contribution quality, child-safety boundaries, provenance, and contributor-rights hygiene matter from the start.

See:

- `OPEN_CORE.md` for the canonical public/open-core boundary;
- `docs/PRODUCT_TIERS_AND_CODE_BOUNDARY.md` for Community / Plus / School implementation boundaries;
- `CLA_POLICY.md` for the contributor-rights policy required by the separate commercial licensing path.

## What is welcome

Good contributions include:

- bug reports with reproducible steps;
- camera/gesture QA evidence that contains no sensitive data;
- tests and simulations;
- accessibility improvements;
- performance fixes;
- documentation corrections;
- security hardening;
- child-safe UX improvements;
- well-scoped game/runtime fixes that preserve existing behavior unless change is intentional and documented.

## Before changing code

1. Open or reference an issue for non-trivial work.
2. Explain the problem and proposed behavior.
3. Keep changes focused; avoid opportunistic rewrites.
4. Do not remove the current motion engine or existing games as part of unrelated work.
5. If a change touches camera, child data, auth, AI/OCR, payments, or external providers, document the security/privacy boundary.
6. If a change introduces code/content/assets intended to remain proprietary, do not put it into the public AGPL tree without an explicit, reviewed licensing boundary.
7. For substantial external source contributions, confirm whether the contributor-rights/CLA policy applies before investing in a large implementation.

## Branch and pull request discipline

Do not work directly on `main`. `main` is the canonical product state.

Use a focused branch such as:

```text
fix/<short-description>
feature/<short-description>
docs/<short-description>
security/<short-description>
```

A PR should explain:

- what changed;
- why it changed;
- what was intentionally not changed;
- how it was tested;
- any security/privacy implications;
- any licensing/provenance implications for new third-party code, content, assets, models, or datasets;
- screenshots or video only when they do not expose private child/family data.

After a squash merge, the merged branch should be deleted. See `docs/BRANCH_LIFECYCLE.md`.

## Required checks

For code changes, run as applicable:

```bash
npm ci
npm run validate:structure
npm run validate:assets
npm run audit:source
npm run typecheck
npm run lint
npm run test:engine
npm run simulate
npm run build
npm audit --omit=dev --audit-level=high
```

The repository CI also performs a redacted full-Git-history secret scan.

Physical camera QA is required for changes whose correctness depends on real hand/body tracking. Meaningful UI changes require representative visual verification before completion.

## Style and architecture expectations

- Prefer small, explicit boundaries over hidden coupling.
- Keep real-time vision data out of high-frequency React state when refs/subscriptions are more appropriate.
- Preserve server-only credential boundaries.
- Keep provider-specific AI code behind an adapter.
- Avoid putting future curriculum logic directly inside individual motion games.
- Treat the 10 existing games as retained product capabilities.
- Build canonical learning attempts/mastery above activity runtimes rather than making legacy game score/session tables the universal learning model.
- Mark planned work as planned; do not document an unimplemented feature as available.
- Keep commercial/private modules behind explicit APIs, package boundaries, or service contracts rather than mixing proprietary source invisibly into the public core.

## Child-safety and privacy expectations

Never submit:

- real child photos/video/audio that are not necessary and explicitly authorized;
- production credentials;
- API keys;
- raw Supabase service-role tokens;
- deployment keys;
- personal information in fixtures/logs/screenshots.

External AI/OCR changes must minimize payloads and must not silently upload full camera frames.

## Licensing of contributions

The repository source code is licensed under `AGPL-3.0-only` unless a file states otherwise.

The project owner intends to maintain a separate commercial edition/licensing path. Community contributions can complicate later relicensing if rights are not clear.

**`CLA_POLICY.md` is currently a policy requirement, not an active signed CLA process. Until a legally reviewed signing process is published, maintainers may decline or hold substantial third-party code contributions even when technically good.** Issues, review feedback, QA reports, documentation fixes, and proposals are still welcome.

The intended future model lets contributors retain copyright while granting the project the rights necessary to keep both the AGPL Community edition and separately licensed commercial products sustainable.

Do not submit code you do not have the right to contribute.

## Third-party code and assets

Do not paste code, images, audio, fonts, datasets, character art, curriculum content, or models from another source without checking the license and recording provenance.

Third-party material must keep its original license/notice and may need to be excluded from the Mainlagi AGPL grant.

See `THIRD_PARTY_NOTICES.md` and the repository asset-provenance controls.

## Trademark/character use

Contributing to the codebase does not grant a right to market a fork as official Mainlagi or to reuse protected brand/character identity outside the permissions documented by the project.

See `TRADEMARKS.md`.
