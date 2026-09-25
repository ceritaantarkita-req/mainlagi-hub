# Mainlagi SVG-Native Asset Policy — 25 September 2026

Status: **CURRENT PROJECT-OWNER ASSET FORMAT POLICY / IMPLEMENTATION MIGRATION PENDING**

This document records the current Mainlagi asset-format decision after the character and learning-illustration reviews.

## 1. Core rule

When the canonical source asset already exists as a clean, production-suitable **SVG**, preserve and integrate that SVG directly into production/runtime.

Do **not** rasterize an approved SVG to WebP merely because an older pipeline expected WebP.

```text
canonical SVG source
    -> provenance / rights
    -> sanitize + validate
    -> normalized production SVG path
    -> runtime resolver
```

Not:

```text
canonical SVG source
    -> convert to WebP
    -> duplicate production derivative
    -> runtime
```

The objective is to reduce unnecessary processing, preserve vector quality and keep source-to-runtime provenance simpler.

## 2. Where this applies

This policy applies to Mainlagi assets whose exact canonical production source is already SVG, including:

- the new Naya / Gian / Zia / Paca / Gavi single-character state assets;
- learning semantic / activity illustrations whose approved canonical source is SVG;
- future icons, instructional illustrations or vector artwork where SVG is already the correct source format.

This does **not** mean every visual in Mainlagi must become SVG.

## 3. Where raster still makes sense

Keep raster production formats such as WebP when the canonical artwork is inherently raster or the existing raster pipeline is appropriate, for example:

- generated or painted subject backgrounds;
- photographic imagery;
- screenshots;
- texture-heavy artwork;
- source PNG/JPEG artwork without a canonical vector source;
- other assets where a reviewed technical reason requires rasterization.

The current **9 subjects / 54 scene families / 108 responsive WebP backgrounds** remain valid. This policy does not require converting raster backgrounds to SVG.

## 4. Existing WebP assets are not silently deleted

Existing verified WebP assets remain valid until an explicit SVG migration is implemented and production-verified.

Examples:

- legacy Gavi/Paca Garden WebP remains a character compatibility fallback during the character SVG migration;
- the 14 semantic P0 WebP files merged through PR #324 remain historical/current production binaries until their direct-SVG replacements are integrated and verified.

Do not remove a verified WebP in the same change that merely changes documentation or prepares a validator.

Migration should be:

```text
approve exact SVG
-> add SVG + registry binding
-> activate resolver/runtime
-> visual/CI/deploy verify
-> retire redundant WebP in a later cleanup if safe
```

## 5. SVG production security contract

Direct SVG use still requires a production gate.

Every production SVG must:

- have clear provenance / ownership / license / redistribution basis;
- be the exact reviewed source or an explicitly documented reviewed derivative;
- be valid SVG/XML;
- have a usable `viewBox`;
- be sanitized before production approval;
- contain no scripts or inline event handlers;
- contain no unreviewed active content;
- avoid unsafe `foreignObject` use;
- contain no unreviewed external URL/resource dependency;
- use normalized repository production paths;
- have an exact SHA-256 binding;
- pass visual/readability review at actual child-facing sizes;
- be loaded through an image asset URL/path rather than injected as untrusted raw markup.

Unknown provenance or unsafe SVG content fails closed.

## 5.1 Implemented shared SVG security foundation

Session 02 implements the reusable production-safety foundation in:

```text
scripts/lib/svg-asset-security.mjs
scripts/run-svg-asset-security-tests.mjs
```

The foundation is included in `npm run validate:assets` through `npm run test:assets:svg-security`.

It is intentionally registry-agnostic so both character and learning-semantic migrations can reuse the same SVG/XML, URL, active-content, path, size and stray-file gates.

Sanitization is fail-closed. The only automatic rewrite currently allowed is removal of a simple external DOCTYPE without an internal subset; unsafe/internal-subset declarations are rejected.

Current exact-source compatibility check: **49/49 Session 01 scoped SVGs pass**, with only `object-ball.svg` requiring simple DOCTYPE removal.

## 6. Character application

Character production uses the reviewed isolated single-character SVG bank directly.

Locked states:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

Canonical naming:

```text
/artwork/characters/<id>-<state>-v1.svg
```

`gavi-panel-hero.svg` is the confirmed Gavi hero/default source.

Design-set SVG files and `character-set-collection-mainlagi.ai` remain reference/master material rather than runtime sprites.

Canonical detail:
- `CHARACTER_ASSET_PIPELINE.md`
- `CHARACTER_PRESENTATION_SYSTEM.md`

## 7. Learning semantic / activity illustration application

The semantic P0 production wave through PR #324 created **14 approved 512x512 alpha WebP production derivatives from canonical Drive/library SVG sources**. That completed wave remains historical truth.

The current project-owner decision changes the **next target architecture**:

```text
approved canonical semantic SVG
-> sanitized production SVG
-> /artwork/learning-illustrations/<semantic-slug>-v1.svg
-> semantic resolver/runtime
```

The 14 source/license-clear semantic P0 assets are therefore candidates for direct-SVG migration before broad runtime semantic activation.

The three held keys remain held:

```text
vehicle.car
object.towel
object.raincoat
```

SVG format does not override missing/insufficient redistribution rights.

The semantic validator/registry must be migrated from a WebP-only production contract to an SVG-aware contract before direct SVG is declared production-live.

## 8. Runtime architecture rule

Application code should resolve an approved logical asset to an approved repository path.

Do not hardcode raw Drive URLs throughout activities.

Preferred pattern:

```text
semantic key / character state
        ->
central approved registry/resolver
        ->
normalized local production SVG path
        ->
image rendering layer
```

This keeps future source/format changes centralized and avoids editing hundreds of activities individually.

## 9. Provenance and lifecycle remain separate

These statements remain distinct:

```text
source SVG exists
!= rights approved
!= production approved
!= runtime active
!= used on every surface
```

The SVG-first policy removes unnecessary raster conversion. It does **not** remove provenance, security, semantic review, child-readability, responsive QA or runtime activation gates.

## 10. Migration priority

Recommended implementation order:

1. update canonical docs and asset-format boundaries;
2. inventory exact SVG-source production candidates;
3. migrate character and learning-illustration registries/validators to SVG-aware rules;
4. promote exact reviewed SVGs to normalized repository paths;
5. activate shared resolvers/runtime in controlled waves;
6. run responsive/browser/accessibility/CI/deploy verification;
7. only after verified activation, remove redundant WebP derivatives when no longer needed.

## 11. Historical documents

Older audit, preflight and closure documents that describe WebP generation remain valid evidence of what was actually implemented at that dated checkpoint.

Do not rewrite historical facts to pretend those WebP waves did not happen.

For current implementation decisions, this policy and the canonical current-state documents take precedence over old “convert SVG to WebP” next-step wording.
