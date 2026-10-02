import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
const cloudflaredBin = process.env.CLOUDFLARED_BIN;
assert.ok(serverKey, "MIDTRANS_SANDBOX_SERVER_KEY is required");
assert.ok(cloudflaredBin, "CLOUDFLARED_BIN is required");
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "application webhook E2E probe refuses production mode",
);

const amount = 10000;
const appPort = 4011;
const fakeSupabasePort = 9999;
const fakeServiceRole = "test-only-service-role-not-a-real-secret";
const orderNumber =
  `MLG-20260927-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
const orderId = randomUUID();
const rpcEvents = [];

async function readJsonRequest(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

const fakeSupabase = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${fakeSupabasePort}`);
    const apiKey = req.headers.apikey;
    const authorization = req.headers.authorization;
    assert.equal(apiKey, fakeServiceRole);
    assert.equal(authorization, `Bearer ${fakeServiceRole}`);

    if (
      req.method === "GET" &&
      url.pathname === "/rest/v1/shop_orders" &&
      url.searchParams.get("order_number") === `eq.${orderNumber}`
    ) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Location": `/shop_orders?order_number=eq.${orderNumber}`,
      });
      res.end(JSON.stringify({ id: orderId, grand_total_amount: amount }));
      return;
    }

    if (
      req.method === "POST" &&
      url.pathname === "/rest/v1/rpc/shop_apply_payment"
    ) {
      const body = await readJsonRequest(req);
      assert.equal(body.p_number, orderNumber);
      assert.equal(body.p_amount, amount);
      assert.equal(typeof body.p_event, "string");
      assert.ok(body.p_event.length >= 32);
      if (body.p_status === "paid") {
        assert.equal(typeof body.p_transaction, "string");
        assert.ok(body.p_transaction.length > 10);
      }
      rpcEvents.push(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("null");
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Unexpected fake Supabase request: ${req.method} ${url.pathname}${url.search}`,
      }),
    );
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: error instanceof Error ? error.message : "fake Supabase error",
      }),
    );
  }
});

await new Promise((resolve, reject) => {
  fakeSupabase.once("error", reject);
  fakeSupabase.listen(fakeSupabasePort, "127.0.0.1", resolve);
});

let app;
let tunnel;

async function waitForApp() {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const response = await fetch(
        `http://127.0.0.1:${appPort}/api/shop/midtrans/notification`,
        { cache: "no-store", signal: AbortSignal.timeout(3000) },
      );
      if (response.status > 0) return;
    } catch {
      // Next dev boot/compile can take several seconds.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Mainlagi Next.js test runtime did not become ready");
}

async function createTunnel() {
  return await new Promise((resolve, reject) => {
    const child = spawn(
      cloudflaredBin,
      [
        "tunnel",
        "--url",
        `http://127.0.0.1:${appPort}`,
        "--no-autoupdate",
        "--loglevel",
        "info",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    tunnel = child;
    let buffer = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error("Timed out waiting for Cloudflare Quick Tunnel URL"));
    }, 30000);
    const inspect = (chunk) => {
      buffer += chunk.toString();
      const match = buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
      if (match) {
        clearTimeout(timeout);
        resolve(match[0]);
      }
    };
    child.stdout.on("data", inspect);
    child.stderr.on("data", inspect);
    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`cloudflared exited before tunnel was ready: ${code}`));
    });
  });
}

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const midtrans = async (path, { method = "GET", body, headers = {} } = {}) => {
  const response = await fetch(`https://api.sandbox.midtrans.com${path}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      `Midtrans returned non-JSON response: HTTP ${response.status} ${text.slice(0, 500)}`,
    );
  }
  return { response, body: parsed };
};

try {
  app = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "127.0.0.1",
      "-p",
      String(appPort),
    ],
    {
      env: {
        ...process.env,
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${appPort}`,
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fakeSupabasePort}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-only-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: fakeServiceRole,
        MIDTRANS_SERVER_KEY: serverKey,
        MIDTRANS_IS_PRODUCTION: "false",
        SHOP_SALES_ENABLED: "false",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let appLogs = "";
  app.stdout.on("data", (chunk) => {
    appLogs = (appLogs + chunk.toString()).slice(-8000);
  });
  app.stderr.on("data", (chunk) => {
    appLogs = (appLogs + chunk.toString()).slice(-8000);
  });
  await waitForApp();

  const tunnelUrl = await createTunnel();
  let tunnelHealthy = false;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const response = await fetch(
        `${tunnelUrl}/api/shop/midtrans/notification`,
        { cache: "no-store", signal: AbortSignal.timeout(5000) },
      );
      if (response.status > 0) {
        tunnelHealthy = true;
        break;
      }
    } catch {
      // Quick Tunnel registration can take a few seconds.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.ok(tunnelHealthy, "Mainlagi Quick Tunnel never became reachable");

  const webhookUrl = `${tunnelUrl}/api/shop/midtrans/notification`;
  const charged = await midtrans("/v2/charge", {
    method: "POST",
    headers: { "X-Override-Notification": webhookUrl },
    body: {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: orderNumber,
        gross_amount: amount,
      },
      bank_transfer: { bank: "permata" },
    },
  });
  assert.ok(charged.response.ok, JSON.stringify(charged.body));
  assert.equal(charged.body.transaction_status, "pending");
  assert.equal(charged.body.order_id, orderNumber);
  assert.equal(typeof charged.body.permata_va_number, "string");
  const vaNumber = charged.body.permata_va_number;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.setDefaultTimeout(15000);
    await page.goto(
      "https://simulator.sandbox.midtrans.com/openapi/va/index?bank=permata",
      { waitUntil: "domcontentloaded", timeout: 30000 },
    );

    let filled = false;
    const labeled = page.getByLabel(/virtual account number/i);
    if ((await labeled.count()) > 0 && (await labeled.first().isVisible())) {
      await labeled.first().fill(vaNumber);
      filled = true;
    }
    const inputs = page.locator(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
    );
    if (!filled) {
      const count = await inputs.count();
      for (let i = 0; i < count; i += 1) {
        const input = inputs.nth(i);
        if (!(await input.isVisible())) continue;
        const attrs = [
          await input.getAttribute("name"),
          await input.getAttribute("id"),
          await input.getAttribute("placeholder"),
          await input.getAttribute("aria-label"),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (/virtual|account|va|number/.test(attrs)) {
          await input.fill(vaNumber);
          filled = true;
          break;
        }
      }
    }
    assert.ok(filled, "Could not locate Midtrans Sandbox VA input");

    const inquire = page
      .getByRole("button", { name: /inquire/i })
      .or(page.locator('input[type="submit"][value*="Inquire" i]'))
      .or(page.locator('input[type="button"][value*="Inquire" i]'));
    assert.ok((await inquire.count()) > 0, "Simulator Inquire action missing");
    await inquire.first().click();
    await page.waitForTimeout(1000);

    const pay = page
      .getByRole("button", { name: /^pay(?: now)?$/i })
      .or(page.locator('input[type="submit"][value*="Pay" i]'))
      .or(page.locator('input[type="button"][value*="Pay" i]'));
    assert.ok((await pay.count()) > 0, "Simulator Pay action missing");
    await pay.first().click();
  } finally {
    await browser.close();
  }

  let paidEvent;
  for (let attempt = 1; attempt <= 35; attempt += 1) {
    paidEvent = rpcEvents.find((event) => event.p_status === "paid");
    if (paidEvent) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  assert.ok(
    paidEvent,
    `Mainlagi route did not reconcile the real Sandbox notification to paid. RPC events: ${JSON.stringify(rpcEvents)}; app logs: ${appLogs}`,
  );
  assert.equal(paidEvent.p_number, orderNumber);
  assert.equal(paidEvent.p_amount, amount);

  const providerStatus = await midtrans(
    `/v2/${encodeURIComponent(orderNumber)}/status`,
  );
  assert.ok(providerStatus.response.ok, JSON.stringify(providerStatus.body));
  assert.equal(providerStatus.body.transaction_status, "settlement");
  assert.equal(String(providerStatus.body.status_code), "200");
  assert.equal(paidEvent.p_transaction, providerStatus.body.transaction_id);

  console.log(
    `Mainlagi Midtrans webhook route E2E PASS: real Sandbox notification for ${orderNumber} reached the actual Next.js /api/shop/midtrans/notification handler through a temporary non-production tunnel; signature verification, independent GET Status and application reconcile reached paid. The Supabase HTTP boundary was a deterministic in-memory test double; PostgreSQL RPC semantics remain covered separately by the real PostgreSQL 17 gate. No real funds or production database were used.`,
  );
} finally {
  if (tunnel && !tunnel.killed) tunnel.kill("SIGTERM");
  if (app && !app.killed) app.kill("SIGTERM");
  await new Promise((resolve) => fakeSupabase.close(resolve));
}
