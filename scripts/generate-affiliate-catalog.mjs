import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

/**
 * Generate the affiliate catalog JSON from the Shopee spreadsheet.
 *
 * Local product imagery is intentionally fail-closed: a generated item only
 * receives a local `/affiliate/...` image path when the matching slug has an
 * `owned` or `licensed` provenance record with redistributionAllowed=true.
 * Unverified marketplace images are never made eligible merely because a file
 * exists in public/affiliate/.
 */

const root = process.cwd();
const source = process.argv[2] ?? path.join(root, "public", "mainlagi shopee link.xlsx");
const outFile = path.join(root, "src", "lib", "data", "affiliate-catalog.json");
const provenanceFile = path.join(root, "src", "lib", "data", "affiliate-provenance.json");

function slugify(text, index) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "item"}-${String(index + 1).padStart(3, "0")}`;
}

function loadProvenance() {
  const parsed = JSON.parse(readFileSync(provenanceFile, "utf8"));
  if (!parsed || parsed.version !== 1 || typeof parsed.items !== "object" || Array.isArray(parsed.items)) {
    throw new Error("Invalid affiliate-provenance.json registry");
  }
  return parsed.items;
}

function approvedImage(slug, provenanceItems) {
  const record = provenanceItems[slug];
  if (!record || record.redistributionAllowed !== true) return null;
  if (record.status !== "owned" && record.status !== "licensed") return null;
  if (typeof record.localPath !== "string" || !record.localPath.startsWith("/affiliate/")) return null;
  return record.localPath;
}

const provenanceItems = loadProvenance();
const wb = XLSX.readFile(source);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

const items = [];
for (let i = 1; i < rows.length; i++) {
  const [ , link, info] = rows[i] ?? [];
  if (!link || !info) continue;

  // Parse "Cek <PRODUCT> dengan harga RpXXX. ..." via the piece before "dengan harga".
  const cleaned = String(info).replace(/^Cek\s+/i, "");
  const priceMatch = cleaned.match(/dengan harga\s*Rp([\d.,]+)/i);
  const price = priceMatch ? `Rp${priceMatch[1].replace(/[.,]+$/g, "")}` : "";
  const title = priceMatch
    ? cleaned.slice(0, cleaned.indexOf(" dengan harga")).trim()
    : cleaned.split(" Dapatkan di Shopee")[0].trim();

  const slug = slugify(title || link, i - 1);
  items.push({
    slug,
    title,
    price,
    href: String(link).trim(),
    image: approvedImage(slug, provenanceItems),
    featured: i <= 3
  });
}

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(items, null, 2)}\n`);

console.log(`Wrote ${items.length} affiliate items to ${path.relative(root, outFile)}`);

const imgs = path.join(root, "public", "affiliate");
if (!existsSync(imgs)) mkdirSync(imgs, { recursive: true });

// Human-readable product mapping. This is not a rights/provenance grant.
const manifest = items
  .map((item) => `${item.slug}\t${item.image ?? "NO_LOCAL_IMAGE"}\t${item.title}${item.price ? ` (${item.price})` : ""}`)
  .join("\n");
writeFileSync(path.join(imgs, "manifest.txt"), `${manifest}\n`);

console.log("Local affiliate images require an approved entry in src/lib/data/affiliate-provenance.json.");
console.log(`See ${path.relative(root, path.join(imgs, "manifest.txt"))} for slug → product mapping.`);
