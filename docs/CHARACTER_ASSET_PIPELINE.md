# Character Asset Production Pipeline — 21 September 2026

Status: **CANONICAL PRODUCTION GATE / NO HUMAN RUNTIME ASSET ACTIVATED**

This document defines the production path for the first Mainlagi human activity-foreground assets: **Naya, Gian, and Zia**.

It complements:

- `MAINLAGI_ART_BIBLE.md` for visual identity;
- `CHARACTER_PRESENTATION_SYSTEM.md` for runtime pairing and fail-closed behavior;
- `ASSET_PROVENANCE.md` for public-repository rights/provenance policy.

## 1. Production directory

Canonical public production directory:

```text
public/artwork/characters/
```

This directory is **production-only**.

Do not use it as candidate staging. An image binary placed here is publicly redistributed by the repository and therefore must already have an approved provenance record.

Canonical first-pass paths are fixed:

```text
/artwork/characters/naya-activity-v1.webp
/artwork/characters/gian-activity-v1.webp
/artwork/characters/zia-activity-v1.webp
```

## 2. Machine-readable provenance registry

Canonical file:

```text
src/lib/data/character-asset-provenance.json
```

Current state:

- Naya: `reference-only`, no production path;
- Gian: `reference-only`, no production path;
- Zia: `reference-only`, no production path.

The registry records:

- identity reference sheet;
- fixed expected production path;
- lifecycle;
- exact production path once approved;
- provenance status and source;
- rights holder / license basis once approval exists;
- public redistribution decision;
- technical export contract.

The current registry deliberately does **not** invent a rights holder or license basis for a production binary that does not yet exist.

## 3. Technical export contract

The first Naya/Gian/Zia activity asset must be:

- WebP;
- isolated full-body character;
- transparent / alpha-bearing;
- minimum 384px wide;
- minimum 512px high;
- maximum 2048px wide/high;
- maximum 1,000,000 bytes;
- named exactly according to the canonical v1 path;
- free of baked text, scenery, floor/background panels, answer content, or task UI.

Automated validation checks the file/container properties above. Visual review is still mandatory because metadata validation cannot prove identity quality, pose quality, edge cleanup, absence of distracting props, or that the visible background is actually acceptable at activity scale.

## 4. Blocking validator

Commands:

```bash
npm run validate:assets:characters
npm run test:assets:characters
npm run validate:assets
```

`npm run validate:assets` is the blocking aggregate gate and now includes:

1. affiliate provenance validation;
2. character production validation;
3. character-validator regression fixtures.

The character validator rejects:

- missing or malformed registry records;
- unexpected character IDs;
- non-canonical production paths;
- a non-approved record with a production path;
- an approved record without owned/licensed provenance;
- missing rights holder or license basis for an approved asset;
- approved files that do not exist;
- non-WebP production files;
- dimensions outside the contract;
- files over the size budget;
- WebP files without alpha/transparency metadata;
- any image binary under `public/artwork/characters/` that is not represented by an approved provenance record.

Regression fixtures explicitly exercise:

- clean reference-only state -> PASS;
- stray public character binary -> FAIL;
- approved record without rights holder -> FAIL;
- opaque WebP -> FAIL;
- undersized WebP -> FAIL;
- valid transparent metadata fixture -> PASS.

## 5. Approval sequence

For each of Naya, Gian, and Zia:

1. create/review candidate artwork outside the public production directory;
2. compare identity, proportions, outfit, silhouette and pose to the canonical design sheet;
3. confirm the source/creation basis and public redistribution rights;
4. export the reviewed derivative as transparent WebP meeting the technical contract;
5. update the exact registry record to `approved`, including rights holder, license basis and `redistributionAllowed=true`;
6. add the exact production binary under `public/artwork/characters/`;
7. run the blocking asset validation suite;
8. merge the asset/provenance wave while `characterAssets.ts` may still remain fail-closed;
9. in a separate activation wave, update `src/lib/learning/characterAssets.ts` to expose the approved runtime path;
10. run responsive activity screenshots and verify no overlap with instructions, choices, canvas/tools or completion controls;
11. only then accept the subject pairing as live.

Merely adding a file, approving provenance, or passing metadata validation must **not** silently activate a character.

## 6. Runtime separation

Runtime approval remains centralized in:

```text
src/lib/learning/characterAssets.ts
```

The production provenance registry and runtime registry serve different purposes:

- provenance registry: may this exact binary be stored and redistributed from the public repository, and does it meet the technical production contract?
- runtime registry: may the application actually render this character in the activity foreground layer?

Both gates must agree before a new human character is considered production-live.

## 7. Existing Paca/Gavi assets

Paca and Gavi remain existing production runtime assets at their current Garden paths.

This Naya/Gian/Zia pipeline does **not** invent or retroactively backfill copyright/provenance facts for those older binaries. A separate provenance-backfill review may be performed later if needed.

## 8. Non-goals

This pipeline does not:

- generate character artwork;
- approve any current human-character candidate;
- activate Naya/Gian/Zia at runtime;
- change subject pairing;
- change child profile identity;
- change curriculum, evidence, mastery, progression, schema or narration;
- authorize the five-character homepage hero.

The homepage hero remains a later composition task using already-approved production identities.
