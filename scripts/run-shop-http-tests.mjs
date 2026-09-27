import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3007",
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
      SHOP_LOCAL_PREVIEW: "true",
      SHOP_SALES_ENABLED: "false",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3007",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      MIDTRANS_SERVER_KEY: "test-only-key",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let log = "";
child.stdout.on("data", (b) => (log += b));
child.stderr.on("data", (b) => (log += b));
try {
  await new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      clearInterval(tick);
      child.off("exit", onExit);
      if (error) reject(error);
      else resolve();
    };
    const onExit = () =>
      finish(Error("Server exited before ready: " + log.slice(-2000)));
    const timeout = setTimeout(() => finish(Error(log.slice(-2000))), 45000);
    const tick = setInterval(() => {
      if (log.includes("Ready in")) finish();
    }, 200);
    child.once("exit", onExit);
  });
  const base = "http://127.0.0.1:3007";
  const r = await fetch(base + "/shop");
  assert.equal(r.status, 200);
  const html = await r.text();
  assert.ok(html.includes("Teman kecil."));
  assert.ok(html.includes("Koleksi Mainlagi"));
  assert.ok(!html.includes("Kaos Anak Mainlagi"));
  assert.ok(!html.includes("Pratinjau"));
  const detail = await fetch(
    base + "/shop/kaos-anak-mainlagi-sahabat-ceria-putih",
  );
  assert.equal(detail.status, 404);
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
  assert.equal((await post("cart", base)).status, 503);
  assert.equal((await post("admin/inventory", base)).status, 403);
  assert.equal(
    (
      await post("midtrans/notification", base, {
        order_id: "x",
        status_code: "200",
        gross_amount: "1",
        signature_key: "wrong",
      })
    ).status,
    403,
  );
  assert.equal((await post("reconcile", base)).status, 403);
  const cart = await fetch(base + "/api/shop/cart");
  assert.equal(cart.status, 503);
  assert.match(cart.headers.get("cache-control"), /no-store/);
  console.log(
    "Shop HTTP: production SSR, development preview ignored, draft detail hidden, restored image, CSRF, disabled sales, owner API denial, forged notification denial, cron authentication, no-store PASS",
  );
} catch (e) {
  console.error(e);
  console.error(log.slice(-5000));
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  setTimeout(() => child.kill("SIGKILL"), 1500).unref();
}
