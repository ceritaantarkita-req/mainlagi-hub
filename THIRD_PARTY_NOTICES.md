# Third-Party Notices

Mainlagi Hub depends on third-party software, models, fonts, services, and may contain third-party/reference assets. Those materials are **not relicensed** by the Mainlagi source-code license.

## Dependency licenses

Dependencies installed through `package.json` / `package-lock.json` retain their own licenses and notices.

Important examples include, but are not limited to:

- Next.js / React ecosystem;
- MediaPipe Tasks Vision and related model/runtime assets;
- Supabase libraries;
- Capacitor;
- OpenNext / Cloudflare tooling;
- sanitize-html;
- fonts and browser/runtime packages.

Before redistribution, packaging, app-store release, or commercial distribution, review the license metadata and notices for the exact dependency versions shipped by that release.

## MediaPipe and model assets

The repository setup process downloads/copies MediaPipe runtime/model assets for local use. Their licensing and distribution terms come from their respective upstream owners and are not replaced by `AGPL-3.0-only`.

Any future model added for OCR, TTS, STT, or generative AI must have its model license, training/data-use restrictions, redistribution rights, and commercial-use terms reviewed before it is bundled or recommended as a default.

## External AI providers

A future OpenRouter integration would call external model providers. OpenRouter access and the underlying model/provider terms are separate from this repository's source-code license.

A model being reachable through an API does not automatically mean its weights, outputs, training data, or commercial use are covered by the Mainlagi license.

## Affiliate/product assets

Affiliate product names, prices, marketplace trademarks, destination URLs, and imagery may originate from merchants/marketplaces or other third parties. Their presence in application metadata does not grant rights to reuse or redistribute those materials beyond permissions provided by the original rights holder or platform.

Mainlagi's public repository now treats local affiliate image redistribution as **fail-closed**. A local image under `public/affiliate/` is eligible only when the canonical provenance registry records an `owned` or `licensed` basis and explicitly marks public redistribution as allowed.

See [`docs/ASSET_PROVENANCE.md`](docs/ASSET_PROVENANCE.md) and `src/lib/data/affiliate-provenance.json`.

Marketplace/reference metadata may remain useful without locally republishing the associated third-party image binary.

## Brand/character assets

Mainlagi logos and the planned Mainlagi character identities are governed by `TRADEMARKS.md` and any asset-specific notice. They are not automatically granted under the source-code AGPL merely because they are stored next to source code.

Trademark reservation also does not substitute for copyright provenance. Public brand, character, animation, voice, or creative binaries should have documented ownership/permission before being distributed from this repository.

## Adding new third-party material

Before committing a third-party library, model, dataset, image, audio file, icon pack, font, curriculum sample, or other asset:

1. record the source/provenance;
2. record the exact license/terms and version/date where practical;
3. confirm redistribution rights;
4. confirm commercial-use rights if the material may ship in a paid product;
5. preserve required attribution/notices;
6. avoid material with unclear ownership;
7. do not assume “free to download” means “open source” or “commercially reusable.”

For public binary assets, follow the repository's asset-provenance policy and automated validation requirements.

## Public-repository note

This repository is already Public. Third-party/provenance review is therefore an ongoing release control rather than a one-time pre-public checklist item.

This file is a policy boundary, not a claim that every historical asset automatically has valid redistribution rights. Historical unresolved assets are tracked in the dated public-exposure audit and remediated separately.

See:

- `docs/ASSET_PROVENANCE.md`
- `docs/PUBLIC_EXPOSURE_AUDIT_20260909.md`
- `docs/PUBLIC_RELEASE_CHECKLIST.md`
