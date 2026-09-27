import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SHOP_QA_PORT ?? 4071);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/shop-batch10");
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
];

let server;
let serverLog = "";

function startServer() {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-H", host, "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      SHOP_LOCAL_PREVIEW: "true",
      SHOP_SALES_ENABLED: "false",
      NEXT_PUBLIC_SITE_URL: baseUrl,
      NEXT_PUBLIC_DATA_BACKEND: "local",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const append = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", append);
  server.stderr.on("data", append);
}
function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}
async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 90_000) {
    try {
      const response = await fetch(baseUrl + "/shop");
      if (response.status === 200) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Shop QA dev server did not become ready.\n" + serverLog.slice(-5000));
}
async function noOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(
    metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1,
    `${label} horizontal overflow: ${JSON.stringify(metrics)}`,
  );
}
async function minTargets(page, selector, label) {
  const sizes = await page.locator(selector).evaluateAll((nodes) =>
    nodes
      .filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden";
      })
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return { tag: node.tagName, text: (node.textContent ?? "").trim().slice(0, 40), width: rect.width, height: rect.height };
      }),
  );
  assert.ok(sizes.length > 0, `${label} expected visible controls`);
  assert.ok(
    sizes.every((item) => item.height >= 44),
    `${label} control below 44px: ${JSON.stringify(sizes.filter((item) => item.height < 44))}`,
  );
}
function luminance([r, g, b]) {
  const values = [r, g, b].map((value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}
function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function rgb(value) {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error("Unsupported color: " + value);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}
async function installCommerceMocks(page, options = {}) {
  let ratesFailures = options.ratesFailures ?? 0;
  let checkoutCalls = 0;
  const product = {
    id: "product-001",
    product_code: "001",
    slug: "kaos-anak-mainlagi-sahabat-ceria-putih",
    title: "Kaos Anak Mainlagi — Sahabat Ceria Putih",
    description: "Fixture browser QA",
    category_slug: "wear",
    base_price_amount: 69000,
    status: "active",
    review_status: "approved",
    facts: {},
    initial_stock_total: 9,
    facts_verified: true,
    media_approved: true,
    shop_variants: [],
    shop_product_media: [],
  };
  const variant = {
    id: "variant-001",
    sku: "001-M",
    title: "Ukuran M",
    weight_grams: 200,
    is_active: true,
    price_override_amount: null,
    option_values: { size: "M" },
    shop_products: product,
  };
  await page.route("**/api/shop/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const json = (body, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
      });

    if (pathname === "/api/shop/cart" && request.method() === "GET")
      return json({ lines: [{ variant_id: variant.id, quantity: 2, shop_variants: variant }] });

    if (pathname === "/api/shop/shipping/rates" && request.method() === "POST") {
      if (ratesFailures > 0) {
        ratesFailures -= 1;
        return json({ error: "Kurir sementara belum dapat memberi tarif. Coba lagi." }, 503);
      }
      return json([{
        id: "quote-001",
        courier_code: "jne",
        service_code: "reg",
        service_name: "JNE REG",
        duration_text: "2–3 hari",
        price_amount: 18000,
        destination_postal_code: "17111",
        expires_at: "2099-01-01T00:00:00.000Z",
      }]);
    }

    if (pathname === "/api/shop/checkout" && request.method() === "POST") {
      checkoutCalls += 1;
      return json({ number: "MLG-20260927-ABCDEF123456" });
    }

    if (pathname === "/api/shop/orders/MLG-20260927-ABCDEF123456" && request.method() === "GET")
      return json({
        number: "MLG-20260927-ABCDEF123456",
        subtotal: 138000,
        shipping: 18000,
        total: 156000,
        payment: "paid",
        fulfillment: "in_transit",
        status: "processing",
        items: [{ title_snapshot: product.title, quantity: 2, line_total_amount: 138000 }],
        shipments: [{ waybill_id: "QA123456", tracking_url: "https://example.com/track", status: "in_transit" }],
      });

    if (pathname === "/api/shop/orders/refresh" && request.method() === "POST")
      return json({ ok: true });

    return json({ error: "QA route not mocked" }, 503);
  });
  return { checkoutCalls: () => checkoutCalls };
}

async function auditCatalog(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: viewport.width <= 768 });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl + "/shop", { waitUntil: "networkidle", timeout: 45_000 });
  assert.equal(await page.locator(".shop-card").count(), 9, `catalog product count at ${viewport.width}`);
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Teman kecil.\nCerita besar.");
  await noOverflow(page, `catalog ${viewport.width}`);
  await minTargets(page, ".shop-nav a, .shop-filters button, .shop-button, .shop-search input", `catalog ${viewport.width}`);

  const primary = await page.locator(".shop-button").first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { bg: style.backgroundColor, fg: style.color };
  });
  assert.equal(primary.bg, "rgb(189, 73, 47)", "Shop primary must use canonical coral #bd492f");
  assert.ok(contrast(rgb(primary.bg), rgb(primary.fg)) >= 4.5, `primary CTA contrast too low: ${JSON.stringify(primary)}`);

  await page.getByLabel("Cari produk").fill("tidak-ada-produk");
  assert.equal(await page.getByText("Belum ketemu.").count(), 1);
  await page.getByRole("button", { name: "Tampilkan semua" }).click();
  assert.equal(await page.locator(".shop-card").count(), 9);

  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return null;
    const style = getComputedStyle(active);
    return { tag: active.tagName, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  assert.ok(focus && focus.outlineStyle !== "none" && parseFloat(focus.outlineWidth) >= 3, `visible keyboard focus missing: ${JSON.stringify(focus)}`);

  await page.screenshot({ path: path.join(outDir, `catalog-${viewport.width}.png`), fullPage: true });
  assert.deepEqual(pageErrors, [], `catalog page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
  await context.close();
}

async function auditDetail(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: viewport.width <= 768 });
  const page = await context.newPage();
  await page.goto(baseUrl + "/shop/kaos-anak-mainlagi-sahabat-ceria-putih", { waitUntil: "networkidle", timeout: 45_000 });
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "Kaos Anak Mainlagi — Sahabat Ceria Putih");
  assert.equal(await page.locator(".shop-thumbs button").count(), 3);
  assert.equal(await page.locator(".shop-detail-image img").getAttribute("alt"), "Kaos Anak Mainlagi — Sahabat Ceria Putih — tampilan produk");
  assert.equal(await page.getByText("Produk ini belum tersedia untuk dibeli.").count(), 1);
  await page.locator(".shop-thumbs button").nth(1).click();
  assert.equal(await page.locator(".shop-thumbs button").nth(1).getAttribute("aria-pressed"), "true");
  await minTargets(page, ".shop-nav a, .shop-thumbs button", `detail ${viewport.width}`);
  await noOverflow(page, `detail ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `detail-${viewport.width}.png`), fullPage: true });
  await context.close();
}

async function auditCheckout(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: viewport.width <= 768 });
  const page = await context.newPage();
  const state = await installCommerceMocks(page, { ratesFailures: 1 });

  await page.goto(baseUrl + "/shop/cart", { waitUntil: "networkidle", timeout: 45_000 });
  assert.equal(await page.getByText("Kaos Anak Mainlagi — Sahabat Ceria Putih").count(), 1);
  assert.match(await page.locator(".shop-summary").innerText(), /Rp\s*138\.000/);
  await noOverflow(page, `cart ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `cart-${viewport.width}.png`), fullPage: true });

  await page.goto(baseUrl + "/shop/checkout", { waitUntil: "networkidle", timeout: 45_000 });
  const postal = page.getByLabel("Kode pos");
  await postal.fill("17abc111");
  assert.equal(await postal.inputValue(), "17111", "postal input must retain digits only");
  await page.getByRole("button", { name: "Hitung ongkir" }).click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /sementara belum dapat memberi tarif/i);

  await page.getByRole("button", { name: "Hitung ongkir" }).click();
  const quote = page.getByLabel(/JNE REG/);
  await quote.waitFor();
  await quote.check();
  const submit = page.getByRole("button", { name: "Buat pesanan" });
  assert.equal(await submit.isEnabled(), true);

  await submit.click();
  assert.equal(state.checkoutCalls(), 0, "invalid required fields must not call checkout API");
  assert.equal(await page.getByLabel("Nama penerima").evaluate((input) => input.matches(":invalid")), true);

  await page.getByLabel("Nama penerima").fill("Orang Tua QA");
  await page.getByLabel("Email").fill("qa@example.invalid");
  await page.getByLabel("Nomor telepon").fill("+628111111111");
  await page.getByLabel("Alamat lengkap").fill("Jl. Mainlagi No. 10");
  await page.getByLabel("Kota / kabupaten").fill("Bekasi");
  await page.getByLabel("Provinsi").fill("Jawa Barat");
  await minTargets(page, ".shop-nav a, .shop-form input, .shop-form button, .shop-form .shop-quote", `checkout ${viewport.width}`);
  await noOverflow(page, `checkout ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `checkout-${viewport.width}.png`), fullPage: true });

  await submit.click();
  await page.waitForURL("**/shop/order/MLG-20260927-ABCDEF123456", { timeout: 15_000 });
  assert.equal(state.checkoutCalls(), 1);
  await page.getByText("Pembayaran diterima").waitFor();
  assert.match(await page.locator(".shop-summary").innerText(), /Dalam perjalanan/);
  assert.equal(await page.getByRole("link", { name: /Lacak pengiriman/ }).getAttribute("href"), "https://example.com/track");
  await noOverflow(page, `order ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `order-${viewport.width}.png`), fullPage: true });

  await context.close();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      await auditCatalog(browser, viewport);
      await auditDetail(browser, viewport);
      await auditCheckout(browser, viewport);
    }
    console.log("Shop Batch 10 browser QA PASS: 9-product preview, canonical coral/contrast, keyboard focus, 44px targets, 320/390/768/1280 overflow checks, product gallery, cart, rate retry, required-field checkout gate and order status screenshots.");
  } finally {
    await browser.close();
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode = 1;
  stopServer();
});
