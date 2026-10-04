import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright";

const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
assert.ok(
  serverKey,
  "MIDTRANS_SANDBOX_SERVER_KEY is required for the live Midtrans sandbox paid probe",
);
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "sandbox paid probe refuses production mode",
);

const auth = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
const baseUrl = "https://api.sandbox.midtrans.com";
const orderId = `MLG-SBX-PAID-${Date.now()}-${randomUUID().slice(0, 8)}`;
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

const charged = await midtrans("/v2/charge", {
  method: "POST",
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
assert.equal(String(charged.body.status_code), "201");
assert.equal(charged.body.transaction_status, "pending");
assert.equal(charged.body.order_id, orderId);
assert.equal(Number(charged.body.gross_amount), amount);
assert.equal(typeof charged.body.permata_va_number, "string");
assert.ok(charged.body.permata_va_number.length >= 8);
const vaNumber = charged.body.permata_va_number;

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
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

  if (!filled) {
    const visible = [];
    const count = await candidates.count();
    for (let i = 0; i < count; i += 1) {
      const input = candidates.nth(i);
      if (await input.isVisible()) visible.push(input);
    }
    if (visible.length === 1) {
      await visible[0].fill(vaNumber);
      filled = true;
    }
  }

  assert.ok(
    filled,
    `Could not locate simulator VA input. Page text: ${(await page.locator("body").innerText()).slice(0, 1000)}`,
  );

  const inquireButton = page
    .getByRole("button", { name: /inquire/i })
    .or(page.locator('input[type="submit"][value*="Inquire" i]'))
    .or(page.locator('input[type="button"][value*="Inquire" i]'));
  assert.ok(
    (await inquireButton.count()) > 0,
    `Could not locate simulator Inquire action. Page text: ${(await page.locator("body").innerText()).slice(0, 1000)}`,
  );
  await inquireButton.first().click();
  await page.waitForTimeout(1000);

  const payButton = page
    .getByRole("button", { name: /^pay(?: now)?$/i })
    .or(page.locator('input[type="submit"][value*="Pay" i]'))
    .or(page.locator('input[type="button"][value*="Pay" i]'));
  assert.ok(
    (await payButton.count()) > 0,
    `Could not locate simulator Pay action after inquiry. Page text: ${(await page.locator("body").innerText()).slice(0, 1500)}`,
  );
  await payButton.first().click();

  let finalStatus;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    await page.waitForTimeout(1000);
    const status = await midtrans(
      `/v2/${encodeURIComponent(orderId)}/status`,
    );
    if (
      status.response.ok &&
      ["settlement", "capture"].includes(status.body.transaction_status)
    ) {
      finalStatus = status.body;
      break;
    }
  }

  assert.ok(
    finalStatus,
    "Sandbox simulator payment did not reach settlement/capture within 20 seconds",
  );
  assert.equal(finalStatus.order_id, orderId);
  assert.equal(Number(finalStatus.gross_amount), amount);
  assert.equal(String(finalStatus.status_code), "200");
  assert.equal(typeof finalStatus.transaction_id, "string");
  assert.ok(finalStatus.transaction_id.length > 10);

  console.log(
    `Midtrans sandbox paid probe PASS: Permata VA simulator moved ${orderId} from pending to ${finalStatus.transaction_status}; independent GET Status verified Rp${amount.toLocaleString("id-ID")} without real funds.`,
  );
} finally {
  await browser.close();
}
