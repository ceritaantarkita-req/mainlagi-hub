import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { DEFAULT_OWNER_INPUT_PATH, validateOwnerInput } from "./validate-shop-owner-input.mjs";

const present = (value) => value !== null && value !== undefined && value !== "";
const positive = (value) => Number.isFinite(value) && value > 0;
const nonNegativeInteger = (value) => Number.isInteger(value) && value >= 0;

function missingProductItems(product) {
  const missing = [];
  const verification = product.verification ?? {};

  if (!verification.method) missing.push("verification method");
  if (!verification.verifiedBy) missing.push("verifiedBy");
  if (!verification.verifiedAt) missing.push("verifiedAt");
  if (!verification.evidenceRef) missing.push("evidenceRef");
  if (verification.productFactsConfirmed !== true) missing.push("productFactsConfirmed");
  if (verification.stockCountConfirmed !== true) missing.push("stockCountConfirmed");

  for (const fact of product.productFactChecks ?? []) {
    if (fact.status !== "verified" || !present(fact.actualValue)) {
      missing.push(`fact:${fact.key}`);
    }
  }

  return missing;
}

function missingVariantItems(variant) {
  const missing = [];
  const actual = variant.actual ?? {};
  const checks = variant.checks ?? {};

  if (variant.status !== "verified") missing.push("status=verified");
  if (!nonNegativeInteger(actual.stock)) missing.push("actual.stock");
  if (!positive(actual.weightGrams)) missing.push("actual.weightGrams");
  if (
    !Array.isArray(actual.packageMm) ||
    actual.packageMm.length !== 3 ||
    !actual.packageMm.every(positive)
  ) {
    missing.push("actual.packageMm");
  }

  for (const key of Object.keys(variant.candidate?.attributes ?? {})) {
    if (!present(actual.attributes?.[key])) {
      missing.push(`actual.attributes.${key}`);
    }
  }

  for (const key of [
    "identityMatched",
    "physicalOrSupplierEvidenceSeen",
    "weightConfirmed",
    "packageDimensionsConfirmed",
    "optionMeasurementsConfirmed",
  ]) {
    if (checks[key] !== true) missing.push(`checks.${key}`);
  }

  return missing;
}

export function buildOwnerInputProgress(data) {
  const validation = validateOwnerInput(data);
  const products = Array.isArray(data?.products) ? data.products : [];

  const productReports = products.map((product) => {
    const productMissing = missingProductItems(product);
    const variants = (product.variants ?? []).map((variant) => {
      const missing = missingVariantItems(variant);
      return {
        sku: variant.sku,
        status: variant.status,
        ready: missing.length === 0,
        missing,
      };
    });

    const verifiedVariants = variants.filter((variant) => variant.ready).length;
    return {
      code: product.code,
      title: product.title,
      status: product.status,
      ready: product.status === "production_verified" &&
        productMissing.length === 0 &&
        verifiedVariants === variants.length,
      missing: productMissing,
      variants,
      verifiedVariants,
      variantCount: variants.length,
    };
  });

  const verifiedProducts = productReports.filter((product) => product.ready).length;
  const totalVariants = productReports.reduce((sum, product) => sum + product.variantCount, 0);
  const verifiedVariants = productReports.reduce((sum, product) => sum + product.verifiedVariants, 0);

  const piiMissing = [];
  if (data?.piiRetention?.status !== "approved") piiMissing.push("status=approved");
  if (
    !Number.isInteger(data?.piiRetention?.productionDays) ||
    data.piiRetention.productionDays < 30 ||
    data.piiRetention.productionDays > 3650
  ) {
    piiMissing.push("productionDays(30..3650)");
  }
  if (!present(data?.piiRetention?.ownerDecisionEvidence)) {
    piiMissing.push("ownerDecisionEvidence");
  }

  return {
    ready: validation.ready,
    structurallyValid: validation.valid,
    validationErrors: validation.errors,
    summary: {
      verifiedProducts,
      totalProducts: products.length,
      verifiedVariants,
      totalVariants,
      piiRetentionReady: piiMissing.length === 0,
    },
    piiRetention: {
      status: data?.piiRetention?.status ?? "missing",
      productionDays: data?.piiRetention?.productionDays ?? null,
      ready: piiMissing.length === 0,
      missing: piiMissing,
    },
    products: productReports,
  };
}

export function formatOwnerInputProgressMarkdown(report) {
  const lines = [
    "# P0-OPEN-02B owner-input progress",
    "",
    `Overall release readiness: **${report.ready ? "READY" : "NOT READY"}**`,
    `Verified products: **${report.summary.verifiedProducts}/${report.summary.totalProducts}**`,
    `Verified active SKUs: **${report.summary.verifiedVariants}/${report.summary.totalVariants}**`,
    `Production PII retention: **${report.piiRetention.ready ? "READY" : "PENDING"}**`,
    "",
  ];

  if (report.piiRetention.missing.length > 0) {
    lines.push("## PII retention", "");
    for (const item of report.piiRetention.missing) lines.push(`- missing: ${item}`);
    lines.push("");
  }

  for (const product of report.products) {
    lines.push(
      `## ${product.code} — ${product.title}`,
      "",
      `Product readiness: **${product.ready ? "READY" : "PENDING"}**`,
      `Verified SKUs: **${product.verifiedVariants}/${product.variantCount}**`,
    );

    for (const item of product.missing) lines.push(`- product missing: ${item}`);

    for (const variant of product.variants) {
      if (variant.ready) {
        lines.push(`- ${variant.sku}: READY`);
      } else {
        lines.push(`- ${variant.sku}: missing ${variant.missing.join(", ")}`);
      }
    }
    lines.push("");
  }

  if (report.validationErrors.length > 0) {
    lines.push("## Structural validation errors", "");
    for (const error of report.validationErrors) lines.push(`- ${error}`);
    lines.push("");
  }

  return lines.join("\n");
}

function parseCli(argv) {
  let inputPath = DEFAULT_OWNER_INPUT_PATH;
  let format = "json";

  for (const arg of argv) {
    if (arg === "--format=md") format = "md";
    else if (arg === "--format=json") format = "json";
    else inputPath = path.resolve(process.cwd(), arg);
  }

  return { inputPath, format };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { inputPath, format } = parseCli(process.argv.slice(2));
  try {
    const data = JSON.parse(readFileSync(inputPath, "utf8"));
    const report = buildOwnerInputProgress(data);
    if (format === "md") {
      console.log(formatOwnerInputProgressMarkdown(report));
    } else {
      console.log(JSON.stringify({ inputPath, ...report }, null, 2));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
