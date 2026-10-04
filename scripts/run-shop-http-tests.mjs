import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const host = "127.0.0.1";

function startServer(port, runtimeEnabled, localPreview = false) {
  let log = "";
  const base = `http://${host}:${port}`;
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      host,
      "--port",
      String(port),
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: "production",
        SHOP_RUNTIME_ENABLED: runtimeEnabled ? "true" : "false",
        SHOP_LOCAL_PREVIEW: localPreview ? "true" : "false",
        SHOP_SALES_ENABLED: "false",
        NEXT_PUBLIC_SITE_URL: base,
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
        MIDTRANS_SERVER_KEY: "test-only-key",
        BITESHIP_WEBHOOK_HEADER: "X-Mainlagi-Biteship-Secret",
        BITESHIP_WEBHOOK_SECRET: "test-only-biteship-webhook-secret",
        BITESHIP_API_KEY: "test-only-biteship-api-key",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  child.stdout.on("data", (b) => (log += b));
  child.stderr.on("data", (b) => (log += b));
  return { child, base, log: () => log };
}

async function waitForServer(server) {
  const started = Date.now();
  while (Date.now() - started < 45_000) {
    if (server.child.exitCode !== null)
      throw Error("Server exited before ready: " + server.log().slice(-2000));
    try {
      const response = await fetch(server.base + "/api/health");
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw Error("Server did not become ready: " + server.log().slice(-2000));
}

async function stopServer(server) {
  if (server.child.exitCode !== null) return;
  server.child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
  if (server.child.exitCode === null) server.child.kill("SIGKILL");
}

async function assertRuntimeOff() {
  const server = startServer(3007, false);
  try {
    await waitForServer(server);

    const shop = await fetch(server.base + "/shop", { redirect: "manual" });
    assert.equal(
      shop.status,
      200,
      "runtime-off /shop must expose the read-only storefront without touching Shop database access",
    );
    const shopHtml = await shop.text();
    assert.ok(shopHtml.includes("Koleksi Mainlagi"));
    assert.ok(shopHtml.includes("Pratinjau"));
    assert.ok(shopHtml.includes("Kaos Anak Mainlagi"));
    assert.ok(!shopHtml.includes('href="/shop/cart"'));
    assert.ok(!shopHtml.includes('href="/shop/orders"'));

    const detail = await fetch(
      server.base + "/shop/kaos-anak-mainlagi-sahabat-ceria-putih",
    );
    assert.equal(detail.status, 200);
    assert.ok((await detail.text()).includes("Produk ini belum tersedia untuk dibeli."));

    const api = await fetch(server.base + "/api/shop/cart");
    assert.equal(
      api.status,
      503,
      "runtime-off Shop API must fail closed before route/provider/database logic",
    );
    assert.match(api.headers.get("cache-control") ?? "", /no-store/);
    assert.deepEqual(await api.json(), { error: "Shop sedang disiapkan." });

    const webhook = await fetch(server.base + "/api/shop/biteship/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });
    assert.equal(
      webhook.status,
      503,
      "runtime-off must block provider webhook handling, including install probes",
    );
    assert.deepEqual(await webhook.json(), { error: "Shop sedang disiapkan." });
  } finally {
    await stopServer(server);
  }
}

async function assertRuntimeOnSalesOff() {
  const server = startServer(3008, true, false);
  try {
    await waitForServer(server);
    const base = server.base;
    // NEXT_PUBLIC_SITE_URL is a build-time canonical origin in Next production.
    // The CI build sets it before this child server starts, so preserve that
    // value when exercising same-origin CSRF behavior.
    const requestOrigin = process.env.NEXT_PUBLIC_SITE_URL || base;

    const r = await fetch(base + "/shop");
    assert.equal(r.status, 200);
    const html = await r.text();
    assert.ok(html.includes("Teman kecil."));
    assert.ok(html.includes("Koleksi Mainlagi"));
    assert.ok(html.includes("Kaos Anak Mainlagi"));
    assert.ok(html.includes("Pratinjau"));
    assert.ok(html.includes("/shop/policies"));
    assert.ok(!html.includes('href="/shop/cart"'));
    assert.ok(!html.includes('href="/shop/orders"'));

    const policies = await fetch(base + "/shop/policies");
    assert.equal(policies.status, 200);
    const policyHtml = await policies.text();
    assert.ok(policyHtml.includes("Belanja dengan aturan yang jelas"));
    assert.ok(policyHtml.includes("+6281280769076"));
    assert.ok(policyHtml.includes("Senin-Jumat"));
    assert.ok(policyHtml.includes("Buka WhatsApp"));
    assert.ok(policyHtml.includes("https://wa.me/6281280769076"));
    assert.ok(!policyHtml.includes("BITESHIP_ORIGIN_ADDRESS"));

    const detail = await fetch(
      base + "/shop/kaos-anak-mainlagi-sahabat-ceria-putih",
    );
    assert.equal(detail.status, 200);
    assert.ok((await detail.text()).includes("Produk ini belum tersedia untuk dibeli."));

    const asset = await fetch(
      base + "/shop/products/mainlagi-shop-003-gavi-pajama-worn-v1.webp",
    );
    assert.equal(asset.status, 200);
    assert.ok((await asset.arrayBuffer()).byteLength > 1000);

    const post = async (path, origin, data = {}) =>
      fetch(base + "/api/shop/" + path, {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

    assert.equal((await post("cart", "https://attacker.example")).status, 403);
    assert.equal((await post("cart", requestOrigin)).status, 503);
    assert.equal((await post("admin/inventory", requestOrigin)).status, 403);
    assert.equal(
      (
        await post("midtrans/notification", requestOrigin, {
          order_id: "x",
          status_code: "200",
          gross_amount: "1",
          signature_key: "wrong",
        })
      ).status,
      403,
    );
    assert.equal((await post("reconcile", requestOrigin)).status, 403);

    const biteshipProbe = await fetch(base + "/api/shop/biteship/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });
    assert.equal(biteshipProbe.status, 200);
    assert.deepEqual(await biteshipProbe.json(), { ok: true });

    assert.equal(
      (
        await post("biteship/webhook", requestOrigin, {
          order_id: "test-provider-order",
        })
      ).status,
      403,
      "non-empty Biteship events must still require the configured signature header",
    );

    const cart = await fetch(base + "/api/shop/cart");
    assert.equal(cart.status, 503);
    assert.match(cart.headers.get("cache-control") ?? "", /no-store/);
  } finally {
    await stopServer(server);
  }
}

try {
  await assertRuntimeOff();
  await assertRuntimeOnSalesOff();
  console.log(
    "Shop HTTP: runtime-off read-only storefront + API/provider fail-closed, runtime-on sales-off storefront remains seed-backed without Shop DB, public policy/support page, draft detail visible but non-purchasable, restored image, CSRF, disabled sales, owner endpoint denial, Midtrans/Biteship forged-event denial, Biteship empty install probe, cron authentication, no-store PASS",
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
