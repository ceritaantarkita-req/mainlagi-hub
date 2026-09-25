# Mainlagi Character SVG Production Promotion — Session 04 Closure

Date: **25 September 2026**  
Status: **SESSION 04 COMPLETE / 35 SVG PRODUCTION VARIANTS APPROVED / RUNTIME STILL INACTIVE**  
Base main: `7bb981daa9cb10256640162313c526012b1b2974`

## Result

```text
characters:                    5/5
locked states per character:   7/7
production SVG variants:       35/35
approved lifecycle:            35/35
unique production paths:       35/35
unique production SHA-256:     35/35
owned provenance:              35/35
redistributionAllowed=true:    35/35
source SHA == production SHA:  35/35
runtime activation:            0
```

Production directory:

```text
public/artwork/characters/
```

Canonical paths:

```text
/artwork/characters/<id>-hero-v1.svg
/artwork/characters/<id>-welcome-v1.svg
/artwork/characters/<id>-pointing-v1.svg
/artwork/characters/<id>-thinking-v1.svg
/artwork/characters/<id>-correct-v1.svg
/artwork/characters/<id>-try-again-v1.svg
/artwork/characters/<id>-celebrate-v1.svg
```

## Source integrity

Every production file was fetched from the exact Session 01 Drive file ID and checked before commit for:

- exact source byte size;
- exact source SHA-256;
- UTF-8 round-trip integrity;
- canonical normalized production path.

No character source required content rewriting during Session 04. Therefore every production SHA-256 equals the frozen Session 01 source SHA-256.

## Provenance / redistribution decision

The project owner stated that the character assets were created by the project owner and explicitly instructed integration into Mainlagi.

Registry v2 now records for all 35 variants:

```text
provenance.status:     owned
rightsHolder:          Mainlagi project owner
redistributionAllowed: true
reviewedAt:            2026-09-25
```

License basis:

> Project-owner-created/owned Mainlagi character artwork; public repository redistribution explicitly authorized by the project owner for this 35-SVG state bank.

This decision applies to the exact 35 SVG state sources bound by Drive ID + SHA-256 in the registry. It does not automatically extend to design-set sheets, waving-state extras, AI collection files, or unrelated artwork.

## Runtime boundary

Session 04 **does not activate characters at runtime**.

Unchanged:

- `src/lib/learning/characterAssets.ts`;
- subject pairings;
- Home/World/Bermain rendering;
- activity content;
- mastery/progression/evidence/certificates;
- legacy `/artwork/garden-gavi.webp` and `/artwork/garden-paca.webp`.

The 35 SVG assets are now safe production inputs for Session 05.

## Exit criteria

- [x] 35 exact SVG sources verified against Session 01 hashes.
- [x] 35 normalized production SVG files added.
- [x] 35 production paths bound in registry v2.
- [x] 35 production SHA-256 values bound.
- [x] exact ownership/redistribution basis recorded.
- [x] 35 lifecycle states changed to `approved`.
- [x] shared Session 02 validator remains the blocking technical gate.
- [x] no runtime activation.
- [x] legacy WebP fallback retained.

## Next allowed session

Only **Session 05 — Implement shared character runtime resolver**, after this Session 04 PR is merged and CI is green.

Session 05 may expose approved SVG paths through shared runtime resolution, but must not yet perform the broad Belajar/World/Home surface integrations assigned to later sessions.
