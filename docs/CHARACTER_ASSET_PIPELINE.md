# Character Asset Production Pipeline — 21 September 2026

Status: **PR #263 BASELINE LIVE / 25 SEP SVG-NATIVE UPDATE AUTHORIZED / RUNTIME MIGRATION PENDING**

This document defines the production path for the first Mainlagi human activity-foreground assets: **Naya, Gian, and Zia**.

Implementation checkpoint: PR **#263** -> `e4d7b4285db17a2010c22cdd1bc29451208f6a1b`; merged-main CI **#1198 / run `35599025558`** passed the full quality matrix and exact Cloudflare production smoke.


Canonical cross-system SVG rule: `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`.


## 25 September 2026 SVG-native update — CURRENT DECISION

This section **supersedes the WebP-specific format, naming and export instructions later in this file for all new character assets**. The older sections are retained as the historical PR #263 implementation baseline until code is migrated.

### Source scope

Production candidates are the isolated **single-character SVG** files for Naya, Gian, Zia, Paca and Gavi. Examples include `gavi-panel-hero.svg`, `gavi-sample-welcome.svg`, `paca-panel-pose-celebrate (4).svg`, `naya-panel-pose-correct (3).svg`, `zia-panel-pose-celebrate (2).svg`, and `gian-panel-pose-welcome.svg`.

The `*-character-design-set.svg` files and `character-set-collection-mainlagi.ai` are master/reference material only and must not become runtime sprites.

The project owner confirmed `gavi-panel-hero.svg` as Gavi hero/default.

### Locked states

`hero`, `welcome`, `pointing`, `thinking`, `correct`, `try_again`, `celebrate`.

`hero` is neutral/default; source `try-again` maps to runtime `try_again`.

### Canonical production paths

New assets use `/artwork/characters/<id>-<state>-v1.svg` with normalized names. Drive working suffixes such as `(2)`, `(3)`, `(4)`, `sample`, or `panel-pose` belong in provenance metadata, not production filenames.

### SVG gate

Before approval, each SVG must be provenance-bound, sanitized and validated. Require valid SVG/XML + `viewBox`; reject scripts, event handlers, unsafe active content, unreviewed external references, malformed files, duplicate state/path bindings, and unexpected files in the production directory. Load approved SVGs as image assets rather than raw trusted markup.

The existing WebP dimension/alpha validator behavior is **not sufficient** for this SVG-native bank and must be updated before any new SVG state is marked production-approved.

### Approval/runtime separation

Drive source exists ≠ production approved ≠ runtime active. The new SVG bank may be source-ready while Naya/Gian/Zia remain fail-closed in current runtime code. Runtime activation remains a separate wave after provenance + sanitizer/validator + responsive QA.

Existing `/artwork/garden-paca.webp` and `/artwork/garden-gavi.webp` remain legacy compatibility fallbacks during migration; do not delete them in the first SVG wave.

### Provenance model v2 — implemented in Session 03

The registry is now version 2 with five characters and seven state variants per character. Each of the 35 variants binds source filename/Drive ID, source SHA-256, source byte size, ambiguity/review status, normalized SVG production path, provenance state, technical/source-validation result, lifecycle, and future production SHA/path.

Session 04 has now promoted all 35 variants to exact production SVGs. Every variant is `approved`, has its canonical `productionPath`, exact `productionSha256`, `provenance.status=owned`, and `redistributionAllowed=true`. Source identity/hash equals production identity/hash for all 35 files. Runtime activation remains separate and is still 0.

---
It complements:

- `MAINLAGI_ART_BIBLE.md` for visual identity;
- `CHARACTER_PRESENTATION_SYSTEM.md` for runtime pairing and fail-closed behavior;
- `ASSET_PROVENANCE.md` for public-repository rights/provenance policy.

## 1. Historical PR #263 production directory contract

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

## 2. Machine-readable provenance registry — current v2

Canonical file:

```text
src/lib/data/character-asset-provenance.json
```

Current schema:

```text
version: 2
scope: mainlagi-character-svg-state-bank
characters: naya / gian / zia / paca / gavi
states: hero / welcome / pointing / thinking / correct / try_again / celebrate
total variants: 35
production directory: /artwork/characters
```

Current lifecycle after Session 04:

```text
0/35 review-required
35/35 production-approved
35/35 canonical productionPath bound
35/35 productionSha256 bound
35/35 provenance.status=owned
35/35 redistributionAllowed=true
runtime activation=0
```

Each state variant records:

- exact Drive source ID;
- exact source filename;
- exact source SHA-256;
- exact source byte size;
- unique/ambiguity status;
- inventory visual-review status;
- normalized expected SVG production path;
- provenance status/source basis;
- rights holder/license basis when approved;
- redistribution decision;
- Session 02 source-validation result;
- SVG technical contract;
- production path/hash only after approval.

The registry deliberately does **not** invent rights ownership/license facts. Source identity and technical compatibility are frozen, while public-repository redistribution remains fail-closed until exact rights basis is documented.

Session 03 closure: `MAINLAGI_CHARACTER_PROVENANCE_V2_SESSION03_2026-09-25.md`.

## 3. Historical PR #263 WebP technical export contract

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

## 4. Blocking validator — current v2

Commands:

```bash
npm run validate:assets:characters
npm run test:assets:characters
npm run validate:assets
```

The character validator now enforces:

- exact registry v2 header/scope/source inventory;
- exact five-character set;
- exact seven-state vocabulary;
- exact 35 variants;
- unique source Drive IDs;
- unique source SHA-256 bindings;
- SVG-only source filenames;
- exact canonical `/artwork/characters/<id>-<state>-v1.svg` paths;
- valid provenance lifecycle;
- fail-closed non-approved variants;
- Session 02 SVG source-validation contract;
- approved-state rights holder/license/redistribution requirements;
- approved production SHA-256;
- exact production SVG existence;
- shared SVG sanitizer/security validation;
- stray/unapproved SVG rejection;
- non-SVG rejection inside the v2 production character directory.

Regression fixtures cover the clean 5×7 baseline, missing/unknown characters and states, duplicate source IDs, invalid hashes, path violations, fail-closed lifecycle, rights failures, missing/unsafe approved SVGs, SHA mismatch, valid approved SVG, stray SVG and non-SVG production files.

Current merged/runtime tree still has **0 new production character SVGs** until Session 04.

## 5. Historical PR #263 WebP approval sequence

For each of Naya, Gian, and Zia:

1. create/review candidate artwork outside the public production directory;
2. compare identity, proportions, outfit, silhouette and pose to the canonical design sheet;
3. confirm the source/creation basis and public redistribution rights;
4. export the reviewed derivative as transparent WebP meeting the technical contract;
5. update the exact registry record to `approved`, including rights holder, license basis and `redistributionAllowed=true`;
6. add the exact production binary under `public/artwork/characters/`; image extensions in this directory are git-ignored by default, so intentionally stage the reviewed file with `git add -f <exact-path>`;
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
