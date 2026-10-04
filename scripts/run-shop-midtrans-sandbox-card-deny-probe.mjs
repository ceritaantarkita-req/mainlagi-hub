import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
const clientKey = process.env.MIDTRANS_SANDBOX_CLIENT_KEY;
assert.ok(serverKey, "MIDTRANS_SANDBOX_SERVER_KEY is required");
assert.ok(clientKey, "MIDTRANS_SANDBOX_CLIENT_KEY is required");
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "sandbox card-deny probe refuses production mode",
);

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const baseUrl = "https://api.sandbox.midtrans.com";
const amount = 10000;

async function parseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Midtrans returned non-JSON response: HTTP ${response.status} ${text.slice(0, 500)}`,
    );
  }
}

async function midtrans(path, { method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  return { response, body: await parseJson(response) };
}

async function cardToken(cardNumber) {
  const url = new URL(`${baseUrl}/v2/token`);
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("card_number", cardNumber);
  url.searchParams.set("card_cvv", "123");
  url.searchParams.set("card_exp_month", "12");
  url.searchParams.set("card_exp_year", "2030");
  url.searchParams.set("gross_amount", String(amount));
  url.searchParams.set("currency", "IDR");
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const body = await parseJson(response);
  assert.ok(
    response.ok,
    `Midtrans card token request failed: HTTP ${response.status} ${JSON.stringify(body)}`,
  );
  assert.equal(String(body.status_code), "200");
  assert.equal(typeof body.token_id, "string");
  assert.ok(body.token_id.length > 10);
  return body.token_id;
}

async function finishRedirectIfNeeded(redirectUrl) {
  if (!redirectUrl) return;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(redirectUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(3000);
  } finally {
    await browser.close();
  }
}

async function verifyDenied(label, cardNumber) {
  const orderId = `MLG-SBX-${label}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const tokenId = await cardToken(cardNumber);
  const charged = await midtrans("/v2/charge", {
    method: "POST",
    body: {
      payment_type: "credit_card",
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      credit_card: {
        token_id: tokenId,
        authentication: true,
      },
    },
  });

  assert.ok(
    charged.response.ok || charged.response.status === 201 || charged.response.status === 202,
    `Midtrans card charge failed unexpectedly: HTTP ${charged.response.status} ${JSON.stringify(charged.body)}`,
  );

  if (
    charged.body.transaction_status === "pending" &&
    typeof charged.body.redirect_url === "string"
  ) {
    await finishRedirectIfNeeded(charged.body.redirect_url);
  }

  let finalStatus;
  for (let attempt = 1; attempt <= 15; attempt += 1) {
    const status = await midtrans(`/v2/${encodeURIComponent(orderId)}/status`);
    if (
      status.response.ok &&
      ["deny", "cancel", "expire"].includes(status.body.transaction_status)
    ) {
      finalStatus = status.body;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  assert.ok(
    finalStatus,
    `Sandbox card ${label} did not reach a denied terminal state. Initial response: ${JSON.stringify(charged.body)}`,
  );
  assert.equal(finalStatus.order_id, orderId);
  assert.equal(Number(finalStatus.gross_amount), amount);
  assert.equal(finalStatus.transaction_status, "deny");
  assert.equal(typeof finalStatus.transaction_id, "string");

  return {
    orderId,
    fraudStatus: finalStatus.fraud_status ?? null,
    channelCode: finalStatus.channel_response_code ?? null,
  };
}

const fdsDenied = await verifyDenied(
  "FDS-DENY",
  ["4611", "1111", "1111", "1116"].join(""),
);
const bankDenied = await verifyDenied(
  "BANK-DENY",
  ["4711", "1111", "1111", "1115"].join(""),
);

console.log(
  `Midtrans sandbox card-deny probe PASS: FDS-deny ${fdsDenied.orderId} and bank-deny ${bankDenied.orderId} both reached deny and were independently verified by GET Status.`,
);
