# Mainlagi Hub Asset Provenance Policy

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
