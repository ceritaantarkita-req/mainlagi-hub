import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

/**
 * Generate the affiliate catalog JSON from the Shopee spreadsheet.
 *
 * The "foto" column is currently empty, so each product gets a deterministic
 * image path `/affiliate/<slug>.jpg`. Dropping a file with that name renders
 * the real photo; until then a placeholder shows.
 */

const root = process.cwd();
const source = process.argv[2] ?? path.join(root, "public", "mainlagi shopee link.xlsx");
const outFile = path.join(root, "src", "lib", "data", "affiliate-catalog.json");

function slugify(text, index) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "item"}-${String(index + 1).padStart(3, "0")}`;
}

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
    image: `/affiliate/${slug}.jpg`,
    featured: i <= 3
  });
}

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(items, null, 2)}\n`);

console.log(`Wrote ${items.length} affiliate items to ${path.relative(root, outFile)}`);

// Warm the images dir so the user knows where to drop photos.
const imgs = path.join(root, "public", "affiliate");
if (!existsSync(imgs)) mkdirSync(imgs, { recursive: true });

// Checklist: which filename holds which product.
const manifest = items
  .map((item) => `${item.image.split("/").pop()}\t${item.title}${item.price ? ` (${item.price})` : ""}`)
  .join("\n");
writeFileSync(path.join(imgs, "manifest.txt"), `${manifest}\n`);

console.log(`Drop product photos as JPG named by slug into ${path.relative(root, imgs)}/`);
console.log(`See ${path.relative(root, path.join(imgs, "manifest.txt"))} for slug → product mapping.`);
