import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
const cloudflaredBin = process.env.CLOUDFLARED_BIN;
assert.ok(serverKey, "MIDTRANS_SANDBOX_SERVER_KEY is required");
assert.ok(cloudflaredBin, "CLOUDFLARED_BIN is required");
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "sandbox webhook probe refuses production mode",
);

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const baseUrl = "https://api.sandbox.midtrans.com";
const amount = 10000;
const port = 8787;
const webhookPath = "/api/shop/midtrans/notification";
const received = [];

function signatureFor(body) {
  return createHash("sha512")
    .update(
      String(body.order_id ?? "") +
        String(body.status_code ?? "") +
        String(body.gross_amount ?? "") +
        serverKey,
    )
    .digest("hex");
}

async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Midtrans returned non-JSON response: HTTP ${response.status} ${text.slice(0, 500)}`,
    );
  }
}

async function midtrans(path, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
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
  return { response, body: await parseJsonResponse(response) };
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
      return;
    }
    if (req.method !== "POST" || req.url !== webhookPath) {
      res.writeHead(404);
      res.end();
      return;
    }

    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
      length += chunk.length;
      if (length > 65536) throw new Error("Webhook body too large");
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    assert.equal(typeof body.order_id, "string");
    assert.equal(typeof body.signature_key, "string");
    assert.equal(body.signature_key, signatureFor(body));

    const status = await midtrans(
      `/v2/${encodeURIComponent(body.order_id)}/status`,
    );
    assert.ok(status.response.ok, JSON.stringify(status.body));
    assert.equal(status.body.order_id, body.order_id);
    assert.equal(Number(status.body.gross_amount), Number(body.gross_amount));
    assert.equal(
      status.body.transaction_id,
      body.transaction_id,
      "webhook/provider transaction identity mismatch",
    );

    received.push({
      orderId: body.order_id,
      notificationStatus: body.transaction_status,
      providerStatus: status.body.transaction_status,
      statusCode: String(body.status_code),
      verified: true,
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "invalid notification",
      }),
    );
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, "127.0.0.1", resolve);
});

let tunnel;
try {
  const tunnelUrl = await new Promise((resolve, reject) => {
    const child = spawn(
      cloudflaredBin,
      [
        "tunnel",
        "--url",
        `http://127.0.0.1:${port}`,
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

  let healthy = false;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const response = await fetch(`${tunnelUrl}/health`, {
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      if (response.ok) {
        healthy = true;
        break;
      }
    } catch {
      // Quick Tunnel registration can take a few seconds.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.ok(healthy, "Cloudflare Quick Tunnel never became externally reachable");

  const orderId = `MLG-SBX-WEBHOOK-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const notificationUrl = `${tunnelUrl}${webhookPath}`;
  const charged = await midtrans("/v2/charge", {
    method: "POST",
    headers: {
      "X-Override-Notification": notificationUrl,
    },
    body: {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      bank_transfer: {
        bank: "permata",
      },
    },
  });

  assert.ok(
    charged.response.ok,
    `Midtrans sandbox VA creation failed: HTTP ${charged.response.status} ${JSON.stringify(charged.body)}`,
  );
  assert.equal(charged.body.transaction_status, "pending");
  assert.equal(charged.body.order_id, orderId);
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
    const candidates = page.locator(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
    );
    if (!filled) {
      const count = await candidates.count();
      for (let i = 0; i < count; i += 1) {
        const input = candidates.nth(i);
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
    assert.ok(filled, "Could not locate sandbox simulator VA input");

    const inquireButton = page
      .getByRole("button", { name: /inquire/i })
      .or(page.locator('input[type="submit"][value*="Inquire" i]'))
      .or(page.locator('input[type="button"][value*="Inquire" i]'));
    assert.ok((await inquireButton.count()) > 0, "Simulator Inquire action missing");
    await inquireButton.first().click();
    await page.waitForTimeout(1000);

    const payButton = page
      .getByRole("button", { name: /^pay(?: now)?$/i })
      .or(page.locator('input[type="submit"][value*="Pay" i]'))
      .or(page.locator('input[type="button"][value*="Pay" i]'));
    assert.ok((await payButton.count()) > 0, "Simulator Pay action missing");
    await payButton.first().click();
  } finally {
    await browser.close();
  }

  let settlementWebhook;
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    settlementWebhook = received.find(
      (event) =>
        event.orderId === orderId &&
        ["settlement", "capture"].includes(event.providerStatus),
    );
    if (settlementWebhook) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  assert.ok(
    settlementWebhook,
    `No verified paid Midtrans webhook arrived within 30 seconds; received statuses: ${received
      .filter((event) => event.orderId === orderId)
      .map((event) => `${event.notificationStatus}/${event.providerStatus}`)
      .join(", ") || "none"}`,
  );

  console.log(
    `Midtrans sandbox webhook probe PASS: real notification delivery reached an ephemeral non-production receiver at the canonical Mainlagi path for ${orderId}; SHA-512 signature plus independent GET Status verified provider state ${settlementWebhook.providerStatus}. No real funds were used.`,
  );
} finally {
  if (tunnel && !tunnel.killed) tunnel.kill("SIGTERM");
  await new Promise((resolve) => server.close(resolve));
}
