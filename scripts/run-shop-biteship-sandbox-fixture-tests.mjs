import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const seed = JSON.parse(await readFile("src/lib/shop/seed.json","utf8"));
const fixture = JSON.parse(await readFile("docs/data/MAINLAGI_SHOP_BITESHIP_SANDBOX_FIXTURE_2026-09-27.json","utf8"));

assert.equal(fixture.productionUseAllowed,false);
assert.equal(fixture.products.length,seed.length);

for(const product of fixture.products){
  const source=seed.find((row)=>row.code===product.code);
  assert.ok(source,`missing seed product ${product.code}`);
  assert.equal(product.sku,`${product.code}-DEFAULT`);
  assert.equal(product.stock,source.initialStock);
  for(const key of ["weight_grams","length_mm","width_mm","height_mm"]){
    assert.ok(Number.isInteger(product[key]) && product[key]>0,`${product.code} invalid ${key}`);
  }
}
console.log("Shop Biteship sandbox fixture: 9 products, seed stock parity, positive test dimensions PASS");
