# Mainlagi SVG Validation Foundation — Session 02 Closure

Date: **25 September 2026**  
Status: **SESSION 02 COMPLETE / SHARED SVG SECURITY FOUNDATION IMPLEMENTED / NO RUNTIME OR ASSET ACTIVATION**  
Base main: `3833edd7b49b9a6d12b5ebf6e447819ab39ce340`

## Scope

Session 02 implements one reusable SVG security/validation foundation for later character and learning-semantic SVG production waves.

New shared module:

```text
scripts/lib/svg-asset-security.mjs
```

Regression suite:

```text
scripts/run-svg-asset-security-tests.mjs
npm run test:assets:svg-security
```

The regression suite is included in the blocking aggregate:

```text
npm run validate:assets
```

## Implemented fail-closed gates

The shared validator/sanitizer now rejects:

- malformed XML element/attribute structure;
- missing `viewBox`;
- invalid/non-finite `viewBox`;
- zero/negative `viewBox` width or height;
- `<script>`;
- inline event handlers such as `onclick`;
- unsafe/active elements including `foreignObject`, iframe/object/embed/media/canvas and SVG animation elements;
- external `href` / `xlink:href` / `src` references;
- data-URI references;
- external CSS `url(...)` references;
- CSS `@import`, `expression()`, `javascript:`, unsafe binding/behavior;
- internal-subset/entity-capable DOCTYPE declarations;
- files above the configured byte limit;
- unsafe or duplicate SVG production paths;
- unexpected/stray SVG files in a production directory;
- symbolic links inside an SVG production directory.

Safe local fragment references such as:

```text
xlink:href="#gradient"
fill="url(#gradient)"
clip-path="url(#clip)"
```

remain allowed because the audited Mainlagi SVG sources use them legitimately.

## Sanitization policy

Sanitization is deliberately conservative.

The module does not rewrite arbitrary unsafe markup into something that might render differently. Unsafe content fails closed.

One deterministic cleanup is allowed:

- a simple external SVG DOCTYPE declaration with **no internal subset** is removed before validation.

Internal-subset DOCTYPE content remains rejected.

Reason: one already-approved semantic SVG source, `object-ball.svg`, contains the legacy SVG 1.1 external DTD declaration. The declaration is unnecessary for browser rendering and would otherwise preserve an external XML dependency.

The later production wave must record both source SHA and sanitized production SHA when bytes differ.

## Real-source compatibility check

The Session 02 implementation was exercised against the exact Session 01 scoped SVG set:

```text
character SVGs: 35/35 pass
semantic SVGs:  14/14 pass after sanitizer
total:           49/49 pass
```

Observed sanitization:

```text
object-ball.svg -> simple external DOCTYPE removed
all other scoped SVGs -> no DOCTYPE removal required
```

This compatibility check does **not** approve or publish those assets. It proves the shared foundation can safely accept the frozen source shapes without forcing SVG -> WebP conversion.

## Regression fixture coverage

The committed suite covers:

- valid SVG with local gradients, clip paths, stylesheet and local `xlink:href`;
- mismatched XML tags;
- missing/invalid `viewBox`;
- script;
- event handler;
- `foreignObject`;
- animation/active content;
- external URL;
- data URL;
- external CSS URL;
- CSS import;
- safe simple DOCTYPE stripping;
- unsafe DOCTYPE internal subset;
- oversize;
- unique production paths;
- duplicate production path;
- path escape;
- approved-directory exact file;
- stray SVG file.

## Boundary preserved

Session 02 does **not**:

- change `character-asset-provenance.json`;
- change `learning-illustration-asset-provenance.json`;
- add character/semantic SVGs under `public/`;
- alter existing WebP assets;
- activate any runtime resolver;
- change Belajar activity semantics;
- change World progress/evidence;
- change mastery/progression/certificates.

## Exit criteria

- [x] shared reusable SVG validator/sanitizer implemented;
- [x] malformed XML blocked;
- [x] missing/invalid `viewBox` blocked;
- [x] script/event/unsafe active content blocked;
- [x] external resource references blocked;
- [x] duplicate production paths blocked;
- [x] stray SVG files blocked;
- [x] oversized files blocked;
- [x] regression fixtures pass locally;
- [x] exact 49 Session 01 scoped SVG sources are compatible with the foundation;
- [x] aggregate asset gate now includes the regression suite;
- [x] no runtime or production asset activation.

## Next allowed session

Only **Session 03 — Migrate character provenance registry to 5 × 7 SVG states** after this Session 02 PR is merged and its CI is green.

Do not start Session 04+ from this branch.
