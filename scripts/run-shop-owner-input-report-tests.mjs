import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  buildOwnerInputProgress,
  formatOwnerInputProgressMarkdown,
} from "./report-shop-owner-input.mjs";

const inputPath = path.join(
  process.cwd(),
  "docs",
  "data",
  "P0_OPEN02B_SHOP_OWNER_INPUT_TEMPLATE_2026-10-02.json",
);
const template = JSON.parse(readFileSync(inputPath, "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

const pending = buildOwnerInputProgress(clone(template));
assert.equal(pending.ready, false);
assert.equal(pending.structurallyValid, true);
assert.deepEqual(pending.summary, {
  verifiedProducts: 0,
  totalProducts: 9,
  verifiedVariants: 0,
  totalVariants: 27,
  piiRetentionReady: false,
});
assert.deepEqual(pending.piiRetention.missing, [
  "status=approved",
  "productionDays(30..3650)",
  "ownerDecisionEvidence",
]);
assert.equal(pending.products[0].code, "001");
assert.equal(pending.products[0].verifiedVariants, 0);
assert.match(pending.products[0].missing.join("\n"), /evidenceRef/);
assert.match(pending.products[0].variants[0].missing.join("\n"), /actual\.weightGrams/);
assert.match(pending.products[0].variants[0].missing.join("\n"), /actual\.attributes\.bodyWidthCm/);

const partial = clone(template);
partial.products[0].variants[0].actual.stock = 3;
const partialReport = buildOwnerInputProgress(partial);
assert.doesNotMatch(
  partialReport.products[0].variants[0].missing.join("\n"),
  /actual\.stock/,
);
assert.match(
  partialReport.products[0].variants[0].missing.join("\n"),
  /actual\.weightGrams/,
);

const markdown = formatOwnerInputProgressMarkdown(pending);
assert.match(markdown, /Overall release readiness: \*\*NOT READY\*\*/);
assert.match(markdown, /Verified products: \*\*0\/9\*\*/);
assert.match(markdown, /Verified active SKUs: \*\*0\/27\*\*/);
assert.match(markdown, /001 — Kaos Anak Mainlagi/);
assert.doesNotMatch(markdown, /candidate\.stock/);

console.log(JSON.stringify({
  status: "PASS",
  canonicalPendingTemplateReady: pending.ready,
  verifiedProducts: pending.summary.verifiedProducts,
  verifiedVariants: pending.summary.verifiedVariants,
  markdownGenerated: true,
}));
