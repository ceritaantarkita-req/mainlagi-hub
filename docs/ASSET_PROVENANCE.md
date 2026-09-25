# Mainlagi Hub Asset Provenance Policy

Last reviewed: **25 September 2026**

Mainlagi Hub is a public AGPL repository, so committing a binary asset can redistribute that asset to everyone who clones, forks, archives, or mirrors the repository. A disclaimer by itself does not create redistribution rights.

This policy defines the minimum evidence required before public binary assets are added or retained.

## 1. Default rule

**Unknown provenance fails closed.**

If ownership, license, permission, or redistribution rights are unclear, the asset must not be treated as redistributable from the public repository.

For third-party marketplace/product imagery, the safe default is to store product metadata/link information without locally redistributing the image binary.

## 2. Canonical statuses

The affiliate provenance registry supports:

- `owned` — Mainlagi/repository owner owns the relevant copyright or has equivalent rights to distribute the asset.
- `licensed` — a third party owns the asset but Mainlagi has a license/permission that explicitly allows the intended public redistribution.
- `third-party-reference` — the material is identified as third-party/reference material, but public binary redistribution is not approved by this registry.
- `unverified` — provenance or rights are not sufficiently established.

Only `owned` and `licensed` may set:

```json
"redistributionAllowed": true
```

`third-party-reference` and `unverified` must remain non-redistributable.

## 3. Affiliate provenance registry

Canonical file:

```text
src/lib/data/affiliate-provenance.json
```

An approved local affiliate image record must contain:

```json
{
  "status": "owned",
  "localPath": "/affiliate/example.jpg",
  "redistributionAllowed": true,
  "source": "Description or source record",
  "rightsHolder": "Rights holder name",
  "licenseBasis": "Why public redistribution is allowed",
  "reviewedAt": "2026-09-09"
}
```

For non-redistributable material:

```json
{
  "status": "third-party-reference",
  "localPath": null,
  "redistributionAllowed": false,
  "source": "Marketplace listing or source record",
  "rightsHolder": "Third-party rights holder",
  "licenseBasis": "No public redistribution permission recorded",
  "reviewedAt": "2026-09-09"
}
```

Do not put a local public path into a non-redistributable record.

## 4. Automated enforcement

Run:

```bash
npm run validate:assets
```

The validator rejects:

- malformed provenance records;
- `redistributionAllowed=true` for anything except `owned`/`licensed`;
- missing required rights/source fields;
- unsafe or duplicate local paths;
- an approved path whose file does not exist;
- any image binary under `public/affiliate/` that lacks an approved owned/licensed provenance record.

The Ubuntu quality gate runs this validation before typecheck/lint/tests.

Character production assets have a separate blocking registry/validator:

- `src/lib/data/character-asset-provenance.json`;
- `scripts/validate-character-assets.mjs`;
- `scripts/run-character-asset-validator-tests.mjs`;
- canonical production directory: `public/artwork/characters/`.

`npm run validate:assets` now runs both affiliate and character provenance checks plus the character-validator regression fixtures. `public/artwork/characters/` is production-only: any image binary found there without an approved character provenance record is rejected.

English narration production assets now have a separate fail-closed gate:

- `src/lib/data/english-narration-asset-provenance.json`;
- `scripts/validate-english-narration-assets.mjs`;
- `scripts/run-english-narration-asset-validator-tests.mjs`;
- reserved production directory: `public/audio/narration/en/`.

The narration registry covers exactly the 27 reviewed English listening activities. The gate is **merged/live verified** through PR #280 -> main `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`, merged-main CI #1372 / run `35701448136` with exact Cloudflare smoke. All records intentionally remain `review-required` with `productionPath=null`; current approved production audio = **0** and no production narration binary/runtime static-audio activation exists. Approval requires provider/model/voice terms review, commercial-use and redistribution clearance, explicit AI-disclosure decision, human pronunciation + child-learning review, and exact SHA-256. `npm run validate:assets` includes this narration gate and its regression fixtures.

The affiliate runtime also fails closed: a catalog entry only receives a local image path when the provenance registry explicitly approves the slug/path for redistribution.

## 5. Adding a new approved local image

1. Confirm who owns the image.
2. Preserve evidence of the source/permission outside the public repository if that evidence contains private contract information.
3. Add an appropriate provenance record.
4. Put the image under `public/affiliate/` using the exact approved `localPath`.
5. Because affiliate image extensions are `.gitignore`d by default, intentionally add the reviewed file with `git add -f`.
6. Run `npm run validate:assets`.
7. Explain provenance/licensing in the PR.
8. Do not merge until the rights basis is clear enough for public redistribution.

The `git add -f` requirement is deliberate friction; adding a public third-party image should never be accidental.

## 5.1 SVG-native production rule — current

When the exact canonical source is already a clean, reviewed SVG, Mainlagi should preserve that SVG into production instead of creating a WebP derivative solely for pipeline uniformity.

This applies to character assets and learning semantic/activity illustrations with canonical SVG sources. It does not apply to raster-native backgrounds/photos/generated imagery.

Direct SVG still requires the same rights gate plus an SVG security gate: valid SVG/XML, usable `viewBox`, no scripts/event handlers, no unsafe active content, no unreviewed external references, normalized path and exact SHA-256. Approved SVGs should be loaded as image assets, not injected as untrusted raw markup.

Canonical policy: `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`.

## 6. Mainlagi-owned brand / character / creative assets

Trademark policy and copyright provenance are different questions.

`TRADEMARKS.md` reserves Mainlagi branding and character identity, but an asset should still have documented provenance showing that Mainlagi has the copyright/permission necessary to publish that binary.

Before expanding public character/voice/art assets, create an equivalent provenance inventory for:

- `public/artwork/`;
- `public/brand/`;
- `public/concepts/`;
- `public/og/`;
- QA screenshots/recordings that contain third-party or personal material;
- future audio, TTS voice, animation, curriculum images, and model/dataset artifacts.

Premium character/audio/content intended to remain proprietary should normally live outside the public AGPL repository.

### 25 September character SVG provenance update — CURRENT

The project owner has authorized the new isolated/single-character SVG bank as the source set for the next Mainlagi character production wave. This is **source authorization, not automatic redistribution/runtime approval**.

The Drive bank now contains state assets for Naya, Gian, Zia, Paca and Gavi. The Gavi hero/default source has been clarified as `gavi-panel-hero.svg`. Design-set SVG files and `character-set-collection-mainlagi.ai` remain reference/master material only.

New canonical production format/path direction:

`/artwork/characters/<id>-<state>-v1.svg`

with state in `hero`, `welcome`, `pointing`, `thinking`, `correct`, `try_again`, `celebrate`.

Every exact SVG still requires a source/Drive identifier, source hash when materialized, rights holder/ownership or license basis, redistribution decision, review date, sanitizer/security result, normalized production path and production hash before it may become an approved public repository asset.

SVG sanitization is part of provenance/production acceptance: reject scripts, event handlers, unsafe active content, malformed files and unreviewed external references. Runtime must load approved SVGs as image assets rather than injecting unsanitized raw markup.

Existing Garden Gavi/Paca WebP files remain legacy migration fallbacks. Their presence does not waive the provenance requirements for the new SVG state bank.

The inventory section below is retained as the historical pre-SVG implementation baseline where it conflicts with this current update.

---
### Current character asset inventory

As of 20 September 2026:

- `public/artwork/garden-paca.webp` exists and is used by production UI;
- `public/artwork/garden-gavi.webp` exists and is used by production UI;
- `public/artwork/activity-previews/color-paca.webp` exists;
- `public/artwork/activity-previews/color-gavi.webp` exists;
- Naya/Gian/Zia do not yet have production image files under `public/artwork`;
- current Naya/Gian/Zia inline/fallback representations are not a substitute for a production provenance record.

Before a new Naya/Gian/Zia binary is committed or treated as production art, the PR must state whether the asset is owned or licensed, identify the source/creation basis, confirm public redistribution rights where it enters the public repository, and record any proprietary boundary if the final asset is intentionally kept outside the AGPL tree.

Current project Drive references reviewed on 21 September 2026:

- `kak-naya-character-design-set-v1.png`;
- `gian-character-design-set-v1.png`;
- `zia-character-design-set-v1.png`.

These are multi-view identity/design sheets, not direct production foreground sprites. Their existence does not approve isolated runtime derivatives or public-repository redistribution. The production character layer must continue to fail closed to the already-approved Gavi/Paca assets until new Naya/Gian/Zia production files pass the required review.

Runtime lifecycle enforcement is centralized in `src/lib/learning/characterAssets.ts`. That registry is a **runtime approval gate, not legal proof**: `approved` means the app may resolve a reviewed production file, while `reference-only` means runtime must remain blocked. A registry status must not be changed to `approved` until the provenance/redistribution decision and visual QA for the exact binary are documented.

For character assets, the machine-readable public-binary gate is **registry v2** at `src/lib/data/character-asset-provenance.json`: five characters × seven locked SVG states = 35 exact source-bound variants. Session 04 promoted all 35 exact SVGs to canonical `/artwork/characters/<id>-<state>-v1.svg` production paths. All 35 are now `approved`, exact production SHA-bound, `provenance.status=owned`, and `redistributionAllowed=true`. Runtime activation remains separate and still equals 0. Session 04 closure: `MAINLAGI_CHARACTER_SVG_PRODUCTION_SESSION04_2026-09-25.md`.

AI/image-generation output is not automatically safe to redistribute or claim as an official Mainlagi asset. Review identity consistency, tool/output terms, source/reference rights, and downstream trademark/copyright implications before production use.


### Current subject-background production set

As of 21 September 2026, the project owner approved the generated subject-background outputs from the Mainlagi project workflow for repository integration.

Creation/review basis:

- the artwork was generated inside the Mainlagi project workflow with ChatGPT image generation;
- visual direction was based on project-owner-supplied Mainlagi references and the canonical Mainlagi Art Bible;
- no third-party marketplace/stock imagery was intentionally imported into this background wave;
- wide/mobile pairs were separately generated and reviewed rather than treating mobile as a simple crop;
- the project owner explicitly requested integration of these outputs into the Mainlagi Hub repository;
- production derivatives are optimized WebP files; the PNG generation outputs remain review/source material in the project Google Drive workflow.

Approved production scope:

- 9 subjects;
- 54 scene families;
- 108 WebP binaries (54 wide + 54 mobile);
- canonical path: `public/artwork/backgrounds/<asset-folder>/`.

Subject asset folders:

- `bahasa`
- `english`
- `math`
- `iqro`
- `letters`
- `logic`
- `science`
- `creative` for the `color` subject
- `drawing`

This is the project's provenance/redistribution decision for this specific generated set. It does not waive the policy for future replacements or third-party reference images. Any replacement must record its own creation/source basis and redistribution decision.

Canonical scene inventory and runtime paths live in `SUBJECT_BACKGROUND_SYSTEM.md`. The implementation checkpoint is `SUBJECT_BACKGROUND_ALL_SUBJECTS_INTEGRATION_2026-09-21.md`. The project-owner live production preview across all nine subjects is recorded in `SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md`.

## Learning semantic illustration production gate

Learning semantic illustrations now have a dedicated fail-closed registry/validator pilot:

- `src/lib/data/learning-illustration-asset-provenance.json`;
- `scripts/validate-learning-illustration-assets.mjs`;
- `scripts/run-learning-illustration-asset-validator-tests.mjs`;
- reserved production directory: `public/artwork/learning-illustrations/`.

The registry contains 17 recognition-critical semantic slots. The authorized 25 September production-integration wave is **merged/live verified through PR #324 -> main `1e27869dfc71186e83ed8bb0a4dff2ca44dddfc9`, merged-main CI #1610 / run `36036726413` with exact Cloudflare release smoke**. Current state: **14 approved with exact production WebP binaries / 3 remain review-required and fail-closed / runtime activation remains 0**.

Those 14 WebP files remain verified production history/current fallback. The current target is to migrate the 14 canonical SVG-backed assets to direct sanitized SVG production paths before broad semantic runtime activation. The three held keys remain held; format choice does not override redistribution rights.

Existing `public/artwork/activity-previews/` files may be recorded as candidate sources, but repository presence and filenames are not provenance approval. Preliminary candidate review may mark a file `visually-suitable` or `rejected`; production approval still requires exact owned/licensed provenance, public redistribution clearance, approved child-readability/semantic review, exact canonical path, technical validation and SHA-256.

The gate deliberately separates:

1. candidate visual suitability;
2. provenance/redistribution approval;
3. semantic child-readability approval;
4. later runtime activation.

Any image binary under `public/artwork/learning-illustrations/` without an approved registry binding is rejected.

Semantic registry v2 distinguishes format-specific production state:

```text
productionAssets.webp
productionAssets.svg
```

The 14 clear records currently preserve approved WebP history while their SVG slots remain `migration-ready` with `path=null` and `sha256=null`. Held records must keep WebP binding null, SVG status `held`, SVG path/hash null, and `redistributionAllowed=false`.

Canonical pilot record: `LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_PILOT_2026-09-23.md`. Historical WebP production integration: `LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md`. SVG-aware registry migration: `LEARNING_SEMANTIC_SVG_REGISTRY_SESSION10_CLOSURE_2026-09-25.md`. Safe resume handoff: `LEARNING_SEMANTIC_P0_PRODUCTION_SAFE_CHECKPOINT_2026-09-25.md`.

## 7. Third-party software, fonts, and model assets

Binary provenance policy complements, rather than replaces, `THIRD_PARTY_NOTICES.md`.

Dependencies/models/fonts require their own upstream license review. A package being installable, a model being downloadable, or a marketplace image being viewable in a browser does not automatically mean the material may be republished in this repository.

## 8. History caveat

Removing an unverified asset from the current tree does not erase an object that already existed in published Git history.

The current remediation removes unresolved binaries from future clones of the current branch tip and stops future accidental additions. If a rights holder or legal review later establishes that a historical asset must be purged from Git history, handle that as a separate coordinated history-rewrite/remediation event.

Do not rewrite public history casually because it disrupts forks, branches, pull requests, and existing clones.

## 9. Review responsibility

A provenance entry records a project decision; it is not magic proof. Reviewers should reject vague claims such as:

- “found on Google”;
- “free image” without actual terms;
- “seller photo” without permission basis;
- “AI generated” without reviewing tool/model/output rights and source material;
- “we credited the owner” when attribution alone does not grant redistribution rights.

When evidence is unclear, keep the asset out of the public repository.
