import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * VSG-09: real Chromium computed-style check after opening on-demand Cara main.
 * No OCR, no user-facing source mutations, no claim of human screenshot approval.
 */
export async function assertReadableHelpPanel(page, selector, width, family) {
  const panel = page.locator(selector);
  assert.equal(await panel.count(), 1, `${family}: exactly one open help surface`);
  const observed = await panel.evaluate(el => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      background: style.backgroundColor,
      foreground: style.color,
      border: style.borderTopWidth,
      padding: parseFloat(style.paddingLeft),
      fontSize: parseFloat(style.fontSize),
      x: rect.x,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  });
  assert.equal(observed.background, "rgb(255, 253, 244)",
    `${family}: opaque illustrated-scene help background at ${width}px`);
  assert.equal(observed.foreground, "rgb(25, 59, 85)",
    `${family}: dark readable text at ${width}px`);
  assert(observed.width > 100 && observed.height >= 36 &&
    observed.x >= -1 && observed.right <= width + 1,
    `${family}: help panel fits horizontally at ${width}px: ${JSON.stringify(observed)}`);
  assert(observed.padding >= 8 && observed.fontSize >= 14,
    `${family}: help needs readable inset and font at ${width}px`);
  const dir = path.join(process.cwd(), ".vsg09-shared-help");
  mkdirSync(dir, { recursive: true });
  const png = await page.screenshot({ fullPage: false });
  writeFileSync(path.join(dir, `${width}-${family}-help.png`), png);
}
