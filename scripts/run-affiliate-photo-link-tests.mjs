import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(path.join(root, "src/lib/data/affiliate-catalog.json"), "utf8"));
const provenance = JSON.parse(readFileSync(path.join(root, "src/lib/data/affiliate-provenance.json"), "utf8"));
const photosDir = path.join(root, "public/affiliate");
const files = readdirSync(photosDir).filter(name => name.endsWith(".jpg"));
assert.equal(catalog.length, 120, "expect exactly 120 affiliate products");
assert.equal(files.length, 120, "expect 120 approved JPEG images, no extra local marketplace assets");
assert.equal(Object.keys(provenance.items).length, 120, "all 120 images need provenance");
assert.equal(new Set(catalog.map(item => item.slug)).size, 120, "product slugs unique");
assert.equal(new Set(catalog.map(item => item.href)).size, 120, "affiliate shortlinks unique");
for (const item of catalog) {
  const expected = `/affiliate/${item.slug}.jpg`;
  assert.equal(item.image, expected, `wrong image for ${item.slug}`);
  assert.equal(new URL(item.href).hostname, "s.shopee.co.id", `invalid Shopee affiliate destination for ${item.slug}`);
  const proof = provenance.items[item.slug];
  assert.ok(proof, `missing photo provenance for ${item.slug}`);
  assert.equal(proof.localPath, expected);
  assert.equal(proof.redistributionAllowed, true);
  assert.equal(proof.status, "licensed");
  assert.equal(proof.source, item.href, `photo provenance must point to matching affiliate product: ${item.slug}`);
  assert.match(proof.licenseBasis, /not independently audited/i, "do not claim independently verified image rights");
  const file = path.join(photosDir, item.slug + ".jpg");
  assert.ok(existsSync(file), `missing JPEG for ${item.slug}`);
  const header = readFileSync(file).subarray(0, 3);
  assert.deepEqual([...header], [0xff, 0xd8, 0xff], `not a JPEG for ${item.slug}`);
  assert.ok(readFileSync(file).length > 4096, `suspiciously small image for ${item.slug}`);
}
console.log("Shopee affiliate images PASS: 120/120 exact slug/JPEG/approved registry/unique affiliate URL mappings.");
