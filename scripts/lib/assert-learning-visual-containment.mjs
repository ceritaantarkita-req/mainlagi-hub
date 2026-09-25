import assert from "node:assert/strict";

export async function assertLearningVisualContainment(page, scopeSelector, label) {
  const metrics = await page.locator(`${scopeSelector} [data-learning-visual-token]`).evaluateAll((nodes) =>
    nodes.map((node) => {
      const frame = node.getBoundingClientRect();
      const glyphNode = node.querySelector("[data-learning-visual-glyph]");
      const glyph = glyphNode?.getBoundingClientRect() ?? null;
      const parent = node.parentElement?.getBoundingClientRect() ?? null;
      const style = getComputedStyle(node);
      const glyphStyle = glyphNode ? getComputedStyle(glyphNode) : null;
      const semanticImage = node.querySelector("[data-learning-semantic-image]");
      const semanticImageBox = semanticImage?.getBoundingClientRect() ?? null;
      const semanticImageData = semanticImage instanceof HTMLImageElement
        ? {
            src: semanticImage.currentSrc || semanticImage.src,
            complete: semanticImage.complete,
            naturalWidth: semanticImage.naturalWidth,
            naturalHeight: semanticImage.naturalHeight,
            box: semanticImageBox
              ? {
                  left: semanticImageBox.left,
                  top: semanticImageBox.top,
                  right: semanticImageBox.right,
                  bottom: semanticImageBox.bottom,
                  width: semanticImageBox.width,
                  height: semanticImageBox.height
                }
              : null
          }
        : null;

      return {
        frame: { left: frame.left, top: frame.top, right: frame.right, bottom: frame.bottom, width: frame.width, height: frame.height },
        glyph: glyph ? { left: glyph.left, top: glyph.top, right: glyph.right, bottom: glyph.bottom, width: glyph.width, height: glyph.height } : null,
        parent: parent ? { left: parent.left, top: parent.top, right: parent.right, bottom: parent.bottom } : null,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        visibility: style.visibility,
        opacity: Number(style.opacity),
        glyphVisibility: glyphStyle?.visibility ?? null,
        glyphOpacity: glyphStyle ? Number(glyphStyle.opacity) : null,
        semanticKey: node.getAttribute("data-learning-semantic-key"),
        visualSource: node.getAttribute("data-learning-visual-source"),
        pageOrigin: window.location.origin,
        semanticImage: semanticImageData
      };
    })
  );

  assert(metrics.length > 0, `${label} must expose at least one bounded learning visual`);

  for (const [index, item] of metrics.entries()) {
    assert(item.parent, `${label} visual ${index} must have a parent box`);
    assert(item.glyph, `${label} visual ${index} must render a glyph`);
    assert(item.frame.width >= 32 && item.frame.height >= 32, `${label} visual ${index} must remain readable, not collapse`);
    assert.equal(item.visibility, "visible", `${label} visual ${index} frame must remain visible`);
    assert(item.opacity > 0, `${label} visual ${index} frame must not be transparent`);
    assert.equal(item.glyphVisibility, "visible", `${label} visual ${index} glyph must remain visible`);
    assert((item.glyphOpacity ?? 0) > 0, `${label} visual ${index} glyph must not be transparent`);
    assert(["hidden", "clip"].includes(item.overflowX), `${label} visual ${index} must explicitly bound horizontal overflow`);
    assert(["hidden", "clip"].includes(item.overflowY), `${label} visual ${index} must explicitly bound vertical overflow`);

    const epsilon = 1.5;
    assert(item.frame.left >= item.parent.left - epsilon, `${label} visual ${index} escapes parent on the left`);
    assert(item.frame.right <= item.parent.right + epsilon, `${label} visual ${index} escapes parent on the right`);
    assert(item.frame.top >= item.parent.top - epsilon, `${label} visual ${index} escapes parent on the top`);
    assert(item.frame.bottom <= item.parent.bottom + epsilon, `${label} visual ${index} escapes parent on the bottom`);

    assert(item.glyph.left >= item.frame.left - epsilon, `${label} glyph ${index} escapes frame on the left`);
    assert(item.glyph.right <= item.frame.right + epsilon, `${label} glyph ${index} escapes frame on the right`);
    assert(item.glyph.top >= item.frame.top - epsilon, `${label} glyph ${index} escapes frame on the top`);
    assert(item.glyph.bottom <= item.frame.bottom + epsilon, `${label} glyph ${index} escapes frame on the bottom`);

    if (item.visualSource === "semantic-svg") {
      assert(item.semanticKey, `${label} semantic visual ${index} must expose a semantic key`);
      assert(item.semanticImage, `${label} semantic visual ${index} must render an image`);
      assert.equal(item.semanticImage.complete, true, `${label} semantic image ${index} must finish decoding`);
      assert(item.semanticImage.naturalWidth > 0 && item.semanticImage.naturalHeight > 0, `${label} semantic image ${index} must have non-zero intrinsic dimensions`);
      const url = new URL(item.semanticImage.src);
      assert.equal(url.origin, item.pageOrigin, `${label} semantic image ${index} must not depend on an external origin`);
      assert(url.pathname.startsWith("/artwork/learning-illustrations/"), `${label} semantic image ${index} must use the canonical production directory`);
      assert(url.pathname.endsWith(".svg"), `${label} semantic image ${index} must remain SVG-backed`);
      assert(item.semanticImage.box, `${label} semantic image ${index} must expose a rendered box`);
      assert(item.semanticImage.box.width > 0 && item.semanticImage.box.height > 0, `${label} semantic image ${index} must remain visible`);
      assert(item.semanticImage.box.left >= item.glyph.left - epsilon, `${label} semantic image ${index} escapes glyph on the left`);
      assert(item.semanticImage.box.right <= item.glyph.right + epsilon, `${label} semantic image ${index} escapes glyph on the right`);
      assert(item.semanticImage.box.top >= item.glyph.top - epsilon, `${label} semantic image ${index} escapes glyph on the top`);
      assert(item.semanticImage.box.bottom <= item.glyph.bottom + epsilon, `${label} semantic image ${index} escapes glyph on the bottom`);
    } else {
      assert.equal(item.semanticImage, null, `${label} fallback visual ${index} must not render a semantic production image`);
    }
  }

  return metrics;
}
