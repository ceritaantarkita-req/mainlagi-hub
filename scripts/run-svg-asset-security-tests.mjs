import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  SvgAssetValidationError,
  sanitizeAndValidateSvg,
  validateSvgProductionDirectory,
  validateSvgProductionPathRecords
} from "./lib/svg-asset-security.mjs";

function expectFail(name, fn, pattern) {
  assert.throws(
    fn,
    (error) => error instanceof SvgAssetValidationError && pattern.test(error.message),
    name
  );
}

const SAFE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 120">
  <defs>
    <linearGradient id="g"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="g2" xlink:href="#g"/>
    <clipPath id="clip"><rect x="0" y="0" width="100" height="120"/></clipPath>
  </defs>
  <style>.body { fill: url(#g2); clip-path: url(#clip); }</style>
  <g class="body"><path d="M0 0 L10 0 L10 10 Z"/></g>
</svg>`;

{
  const result = sanitizeAndValidateSvg(SAFE_SVG);
  assert.deepEqual(result.metadata.viewBox, [0, 0, 100, 120]);
  assert.ok(result.metadata.elementCount >= 8);
  assert.equal(result.metadata.styleElementCount, 1);
}

expectFail(
  "malformed mismatched tags",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><g></svg>`),
  /does not match/
);
expectFail(
  "missing viewBox",
  () => sanitizeAndValidateSvg(`<svg xmlns="http://www.w3.org/2000/svg"></svg>`),
  /requires viewBox/
);
expectFail(
  "invalid viewBox width",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 0 10"></svg>`),
  /width and height must be positive/
);
expectFail(
  "invalid viewBox non-number",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 x 10"></svg>`),
  /non-finite/
);
expectFail(
  "script",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><script>alert(1)</script></svg>`),
  /forbidden active\/unsafe/
);
expectFail(
  "inline event",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><path onclick="alert(1)" d="M0 0"/></svg>`),
  /inline event handler/
);
expectFail(
  "foreignObject",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><foreignObject/></svg>`),
  /forbidden active\/unsafe/
);
expectFail(
  "animation",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><animate attributeName="x"/></svg>`),
  /forbidden active\/unsafe/
);
expectFail(
  "external href",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><use href="https://example.com/a.svg#x"/></svg>`),
  /local fragment reference/
);
expectFail(
  "data href",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><use href="data:image/svg+xml;base64,abc"/></svg>`),
  /local fragment reference/
);
expectFail(
  "external CSS URL",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><style>.x{fill:url(https://example.com/x.svg)}</style><path class="x"/></svg>`),
  /local fragment reference/
);
expectFail(
  "CSS import",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10"><style>@import url(#x);</style></svg>`),
  /contains @import/
);

{
  const result = sanitizeAndValidateSvg(
    `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg viewBox="0 0 10 10"></svg>`
  );
  assert.equal(result.metadata.removedDoctype, true);
  assert.doesNotMatch(result.sanitizedText, /<!DOCTYPE/i);
}
expectFail(
  "DOCTYPE internal subset",
  () => sanitizeAndValidateSvg(`<!DOCTYPE svg [<!ENTITY x "boom">]><svg viewBox="0 0 10 10"></svg>`),
  /internal subsets are forbidden/
);
expectFail(
  "oversized",
  () => sanitizeAndValidateSvg(`<svg viewBox="0 0 10 10">${" ".repeat(100)}</svg>`, { maxBytes: 64 }),
  /exceeds maxBytes/
);

{
  const seen = validateSvgProductionPathRecords(
    [
      { id: "gavi.hero", productionPath: "/artwork/characters/gavi-hero-v1.svg" },
      { id: "paca.hero", productionPath: "/artwork/characters/paca-hero-v1.svg" }
    ],
    { productionDirectory: "/artwork/characters" }
  );
  assert.equal(seen.size, 2);
}

expectFail(
  "duplicate production path",
  () =>
    validateSvgProductionPathRecords(
      [
        { id: "gavi.hero", productionPath: "/artwork/characters/gavi-hero-v1.svg" },
        { id: "gavi.welcome", productionPath: "/artwork/characters/gavi-hero-v1.svg" }
      ],
      { productionDirectory: "/artwork/characters" }
    ),
  /already assigned/
);

expectFail(
  "path escape",
  () =>
    validateSvgProductionPathRecords(
      [{ id: "x", productionPath: "/artwork/characters/../x.svg" }],
      { productionDirectory: "/artwork/characters" }
    ),
  /unsafe productionPath|must stay under/
);

{
  const root = mkdtempSync(path.join(os.tmpdir(), "mainlagi-svg-security-"));
  try {
    const dir = path.join(root, "public", "artwork", "characters");
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "gavi-hero-v1.svg"), SAFE_SVG);

    const found = validateSvgProductionDirectory({
      root,
      productionDirectory: "/artwork/characters",
      approvedPaths: ["/artwork/characters/gavi-hero-v1.svg"]
    });
    assert.deepEqual(found, ["/artwork/characters/gavi-hero-v1.svg"]);

    writeFileSync(path.join(dir, "stray.svg"), SAFE_SVG);
    expectFail(
      "stray SVG",
      () =>
        validateSvgProductionDirectory({
          root,
          productionDirectory: "/artwork/characters",
          approvedPaths: ["/artwork/characters/gavi-hero-v1.svg"]
        }),
      /unexpected\/stray SVG/
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log(
  "SVG asset security regression passed: XML structure, viewBox, active-content, event-handler, URL, size, duplicate-path and stray-file gates."
);
