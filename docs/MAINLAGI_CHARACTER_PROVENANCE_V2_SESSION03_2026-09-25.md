# Mainlagi Character Provenance Registry v2 — Session 03 Closure

Date: **25 September 2026**  
Status: **SESSION 03 COMPLETE / 5 × 7 SVG PROVENANCE SCHEMA IMPLEMENTED / 0 PRODUCTION SVG ACTIVATED**  
Base main: `782d358aa2559f9aa48fb55aa94db4675d7cd6bf`

## Scope

Session 03 migrates the machine-readable character asset gate from the historical three-human / one-WebP-slot model to the locked five-character / seven-state SVG model.

Canonical registry:

```text
src/lib/data/character-asset-provenance.json
```

Registry header:

```text
version:             2
scope:               mainlagi-character-svg-state-bank
productionDirectory: /artwork/characters
characters:          5
states:              7
total variants:      35
```

Characters:

```text
naya
gian
zia
paca
gavi
```

States:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

## Exact source binding

Every one of the 35 variants now records:

- exact Session 01 Drive file ID;
- exact source filename;
- exact source SHA-256;
- source byte size;
- unique/ambiguity status;
- inventory visual-review status;
- canonical normalized production SVG path;
- provenance/rights state;
- source SVG validation result from Session 02;
- future production path/hash slots;
- lifecycle.

Normalized path:

```text
/artwork/characters/<id>-<state>-v1.svg
```

Runtime source sheets / waving files remain outside the locked state registry.

## Current lifecycle truth

All 35 variants are intentionally:

```text
lifecycle:             review-required
productionPath:        null
productionSha256:      null
provenance.status:     pending
redistributionAllowed: false
```

Reason: source identity and technical safety are frozen, but the exact public-repository rights-holder/license/redistribution basis has not yet been approved for the 35 character SVGs.

Session 03 therefore **does not** claim that any new character SVG may already be committed under `public/artwork/characters/`.

## Validator v2

`scripts/validate-character-assets.mjs` now validates:

- exact registry version/scope/source inventory;
- exact five-character set;
- exact seven-state vocabulary;
- exact 35 state slots;
- unique source Drive IDs;
- unique source SHA-256 values;
- valid SVG source filenames;
- positive source byte size;
- unique inventory status;
- exact canonical state production path;
- valid provenance lifecycle;
- fail-closed non-approved state;
- SVG technical/security contract;
- production SHA for approved future variants;
- owned/licensed + rights-holder/license basis before approval;
- exact approved production file existence;
- shared Session 02 SVG sanitizer/security gate;
- unexpected/stray character SVGs;
- non-SVG files inside the v2 production character directory.

## Regression suite

`scripts/run-character-asset-validator-tests.mjs` was migrated to v2 and covers:

- clean 5 × 7 review-required baseline;
- missing character;
- unknown character;
- missing state;
- unknown state;
- duplicate source Drive ID;
- invalid source SHA;
- non-canonical production path;
- non-approved variant with production path;
- approved variant missing rights holder;
- approved variant missing SVG file;
- approved unsafe SVG;
- production SHA mismatch;
- valid approved SVG variant;
- stray public SVG;
- non-SVG file in the v2 production tree.

Existing commands remain:

```bash
npm run validate:assets:characters
npm run test:assets:characters
npm run validate:assets
```

## Registry self-check

```text
version:                  2
characters:               5/5
state vocabulary:         7/7
variant slots:            35/35
unique source Drive IDs:  35/35
unique source SHA-256:     35/35
unique expected paths:    35/35
review-required:          35/35
production paths null:    35/35
production hashes null:   35/35
redistribution false:     35/35
SVG format:               35/35
```

## Hard boundaries preserved

Session 03 does **not**:

- add SVG binaries to `public/artwork/characters/`;
- mark any variant production-approved;
- delete legacy Gavi/Paca WebP;
- alter `src/lib/learning/characterAssets.ts`;
- activate Naya/Gian/Zia;
- change subject pairing;
- change Home/World/Bermain UI;
- change activity identity/content;
- change mastery/progression/evidence/certificates.

## Exit criteria

- [x] registry is versioned to v2;
- [x] all five characters are present;
- [x] all seven states are present for every character;
- [x] source Drive IDs + hashes are frozen;
- [x] normalized SVG production paths are frozen;
- [x] non-approved state remains fail-closed;
- [x] validator understands the new schema;
- [x] regression suite tests the new schema and future approved SVG path;
- [x] no production SVG/runtime activation occurs.

## Next allowed session

Only **Session 04 — Promote approved character SVGs into production**, after Session 03 is merged and CI is green.

Important: Session 04 must resolve/document the exact rights-holder/license/redistribution basis before changing a state from `review-required` to `approved`. If that rights gate cannot be established, the affected SVG must remain fail-closed.
