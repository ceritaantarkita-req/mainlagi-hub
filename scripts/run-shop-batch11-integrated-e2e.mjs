import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createServerClient } from "@supabase/ssr";

const stagingUrl = required("STAGING_URL").replace(/\/$/, "");
const localSupabaseUrl = required("LOCAL_SUPABASE_URL").replace(/\/$/, "");
const serviceRole = required("LOCAL_SUPABASE_SERVICE_ROLE_KEY");
const localAnonKey = required("LOCAL_SUPABASE_ANON_KEY");
const stagingSecret = required("SHOP_STAGING_ACCEPTANCE_SECRET");
const cronSecret = required("SHOP_CRON_SECRET");
const midtransServerKey = required("MIDTRANS_SANDBOX_SERVER_KEY");
const biteshipKey = required("BITESHIP_TEST_API_KEY");
const biteshipWebhookSecret = required("BITESHIP_WEBHOOK_SECRET");
const runId = process.env.GITHUB_RUN_ID ?? String(Date.now());

assert.equal(
  new URL(stagingUrl).hostname.endsWith(".trycloudflare.com"),
  true,
  "Integrated Batch 11 E2E refuses non-Quick-Tunnel staging URLs",
);
assert.equal(
  biteshipKey.startsWith("biteship_test."),
  true,
  "Integrated Batch 11 E2E refuses non-testing Biteship keys",
);
assert.notEqual(
  process.env.MIDTRANS_IS_PRODUCTION,
  "true",
  "Integrated Batch 11 E2E refuses Midtrans production mode",
);

function required(name) {
  const value = process.env[name]?.trim();
  assert.ok(value, name + " is required");
  return value;
}

async function parseJson(response, label) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      label + " returned non-JSON HTTP " + response.status + ": " + text.slice(0, 500),
    );
  }
}

async function serviceFetch(path, options = {}) {
  const response = await fetch(localSupabaseUrl + path, {
    ...options,
    headers: {
      apikey: serviceRole,
      Authorization: "Bearer " + serviceRole,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  return {
    response,
    body: await parseJson(response, "Local Supabase"),
  };
}

async function biteship(path) {
  const response = await fetch("https://api.biteship.com" + path, {
    headers: {
      Authorization: biteshipKey,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  return {
    response,
    body: await parseJson(response, "Biteship Testing"),
  };
}

const midtransAuth =
  "Basic " + Buffer.from(midtransServerKey + ":").toString("base64");

async function midtransStatus(orderNumber) {
  const response = await fetch(
    "https://api.sandbox.midtrans.com/v2/" +
      encodeURIComponent(orderNumber) +
      "/status",
    {
      headers: {
        Accept: "application/json",
        Authorization: midtransAuth,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );
  const body = await parseJson(response, "Midtrans Sandbox");
  if (response.status === 404 || String(body.status_code) === "404") return null;
  assert.equal(
    response.ok,
    true,
    "Midtrans GET status failed HTTP " +
      response.status +
      ": " +
      JSON.stringify(body).slice(0, 500),
  );
  return body;
}

function providerVaNumber(status) {
  if (typeof status?.permata_va_number === "string")
    return status.permata_va_number;
  if (Array.isArray(status?.va_numbers)) {
    const permata = status.va_numbers.find(
      (row) => String(row?.bank ?? "").toLowerCase() === "permata",
    );
    if (typeof permata?.va_number === "string") return permata.va_number;
  }
  return null;
}

async function appPost(page, path, body, { staging = false } = {}) {
  const result = await page.evaluate(
    async ({ path: requestPath, payload, acceptanceSecret, useStaging }) => {
      const response = await fetch("/api/shop/" + requestPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(useStaging
            ? { "X-Mainlagi-Shop-Staging-Secret": acceptanceSecret }
            : {}),
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text.slice(0, 500) };
      }
      return { status: response.status, data };
    },
    {
      path,
      payload: body,
      acceptanceSecret: stagingSecret,
      useStaging: staging,
    },
  );
  assert.equal(
    result.status >= 200 && result.status < 300,
    true,
    "App POST /api/shop/" +
      path +
      " failed HTTP " +
      result.status +
      ": " +
      JSON.stringify(result.data).slice(0, 700),
  );
  return result.data;
}

async function createEphemeralOwner() {
  const password =
    "B11!" + randomBytes(18).toString("base64url") + "Aa1";
  const email =
    "mainlagi-b11-owner-" +
    runId.replace(/[^0-9A-Za-z_-]/g, "-") +
    "@example.invalid";

  const created = await serviceFetch("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { purpose: "mainlagi-shop-batch11-ephemeral-owner" },
    }),
  });
  assert.equal(
    created.response.ok,
    true,
    "Could not create ephemeral local Supabase owner: HTTP " +
      created.response.status,
  );
  const userId = created.body.id ?? created.body.user?.id;
  assert.match(
    String(userId ?? ""),
    /^[a-f0-9-]{36}$/i,
    "Ephemeral owner id missing",
  );

  let profile = null;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const profiles = await serviceFetch(
      "/rest/v1/profiles?select=id,role&id=eq." + encodeURIComponent(userId),
    );
    assert.equal(profiles.response.ok, true);
    if (Array.isArray(profiles.body) && profiles.body[0]) {
      profile = profiles.body[0];
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(profile, "Profile trigger did not create the ephemeral owner profile");

  const promoted = await serviceFetch(
    "/rest/v1/profiles?id=eq." + encodeURIComponent(userId),
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ role: "owner" }),
    },
  );
  assert.equal(promoted.response.ok, true);
  assert.equal(
    Array.isArray(promoted.body) && promoted.body[0]?.role === "owner",
    true,
    "Ephemeral profile could not be promoted to owner",
  );

  return { email, password, userId };
}

async function ephemeralOwnerCookies(owner) {
  const jar = new Map();
  const auth = createServerClient(localSupabaseUrl, localAnonKey, {
    cookies: {
      getAll() {
        return [...jar.entries()].map(([name, entry]) => ({
          name,
          value: entry.value,
        }));
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          if (!cookie.value) jar.delete(cookie.name);
          else jar.set(cookie.name, {
            value: cookie.value,
            options: cookie.options ?? {},
          });
        }
      },
    },
  });

  const { data, error } = await auth.auth.signInWithPassword({
    email: owner.email,
    password: owner.password,
  });
  assert.equal(error, null, "Ephemeral owner Supabase sign-in failed");
  assert.equal(data.user?.id, owner.userId);

  const cookies = [...jar.entries()].map(([name, entry]) => ({
    name,
    value: entry.value,
    url: stagingUrl,
    httpOnly: Boolean(entry.options?.httpOnly),
    secure: true,
    sameSite:
      String(entry.options?.sameSite ?? "lax").toLowerCase() === "strict"
        ? "Strict"
        : String(entry.options?.sameSite ?? "lax").toLowerCase() === "none"
          ? "None"
          : "Lax",
  }));
  assert.equal(cookies.length > 0, true, "Supabase SSR auth cookies were not produced");
  return cookies;
}

async function deleteEphemeralOwner(userId) {
  try {
    const response = await fetch(
      localSupabaseUrl + "/auth/v1/admin/users/" + encodeURIComponent(userId),
      {
        method: "DELETE",
        headers: {
          apikey: serviceRole,
          Authorization: "Bearer " + serviceRole,
        },
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      console.warn(
        "Ephemeral owner cleanup returned HTTP " + response.status + ".",
      );
  } catch (error) {
    console.warn(
      "Ephemeral owner cleanup failed: " +
        (error instanceof Error ? error.message : "unknown"),
    );
  }
}

async function clickFirstVisible(frame, regex) {
  const roleCandidates = [
    frame.getByRole("button", { name: regex }),
    frame.getByRole("link", { name: regex }),
    frame.getByText(regex, { exact: false }),
  ];
  for (const locator of roleCandidates) {
    const count = Math.min(await locator.count(), 12);
    for (let i = 0; i < count; i += 1) {
      const item = locator.nth(i);
      try {
        if (!(await item.isVisible())) continue;
        await item.click({ timeout: 3000 });
        return true;
      } catch {
        // Continue to the next visible candidate/frame.
      }
    }
  }
  return false;
}

async function choosePermataOnSnap(page, orderNumber) {
  const sequences = [
    /bank transfer|transfer bank|virtual account/i,
    /permata/i,
    /pay now|pay|bayar sekarang|bayar|continue|lanjut/i,
  ];

  for (let round = 1; round <= 12; round += 1) {
    const current = await midtransStatus(orderNumber);
    const va = providerVaNumber(current);
    if (
      current?.transaction_status === "pending" &&
      typeof va === "string" &&
      va.length >= 8
    ) {
      return { status: current, vaNumber: va };
    }

    let clicked = false;
    for (const regex of sequences) {
      for (const frame of page.frames()) {
        if (await clickFirstVisible(frame, regex)) {
          clicked = true;
          await page.waitForTimeout(800);
          break;
        }
      }
      const after = await midtransStatus(orderNumber);
      const afterVa = providerVaNumber(after);
      if (
        after?.transaction_status === "pending" &&
        typeof afterVa === "string" &&
        afterVa.length >= 8
      ) {
        return { status: after, vaNumber: afterVa };
      }
    }

    if (!clicked) await page.waitForTimeout(1000);
  }

  const bodyText = await page.locator("body").innerText().catch(() => "");
  throw new Error(
    "Could not create Permata VA from Snap Sandbox. Visible text: " +
      bodyText.slice(0, 1600),
  );
}

async function payPermataSimulator(browser, vaNumber, orderNumber) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  page.setDefaultTimeout(15000);
  try {
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
    assert.equal(filled, true, "Could not locate Permata simulator VA input");

    const inquire = page
      .getByRole("button", { name: /inquire/i })
      .or(page.locator('input[type="submit"][value*="Inquire" i]'))
      .or(page.locator('input[type="button"][value*="Inquire" i]'));
    assert.equal((await inquire.count()) > 0, true, "Simulator Inquire action missing");
    await inquire.first().click();
    await page.waitForTimeout(1000);

    const pay = page
      .getByRole("button", { name: /^pay(?: now)?$/i })
      .or(page.locator('input[type="submit"][value*="Pay" i]'))
      .or(page.locator('input[type="button"][value*="Pay" i]'));
    assert.equal((await pay.count()) > 0, true, "Simulator Pay action missing");
    await pay.first().click();

    for (let attempt = 1; attempt <= 30; attempt += 1) {
      await page.waitForTimeout(1000);
      const status = await midtransStatus(orderNumber);
      if (
        status &&
        ["settlement", "capture"].includes(status.transaction_status)
      ) {
        return status;
      }
    }
    throw new Error("Midtrans Sandbox payment did not settle within 30 seconds");
  } finally {
    await page.close();
  }
}

async function localOrder(number) {
  const query =
    "/rest/v1/shop_orders?select=id,order_number,payment_status,order_status,fulfillment_status,grand_total_amount&order_number=eq." +
    encodeURIComponent(number);
  const result = await serviceFetch(query);
  assert.equal(result.response.ok, true);
  assert.equal(Array.isArray(result.body) && result.body.length === 1, true);
  return result.body[0];
}

async function localShipment(orderId) {
  const query =
    "/rest/v1/shop_shipments?select=order_id,provider_order_id,status,waybill_id,tracking_url&order_id=eq." +
    encodeURIComponent(orderId);
  const result = await serviceFetch(query);
  assert.equal(result.response.ok, true);
  assert.equal(Array.isArray(result.body) && result.body.length === 1, true);
  return result.body[0];
}

async function localOrderItem(orderId) {
  const query =
    "/rest/v1/shop_order_items?select=sku_snapshot,weight_grams_snapshot,length_mm_snapshot,width_mm_snapshot,height_mm_snapshot&order_id=eq." +
    encodeURIComponent(orderId);
  const result = await serviceFetch(query);
  assert.equal(result.response.ok, true);
  assert.equal(Array.isArray(result.body) && result.body.length === 1, true);
  return result.body[0];
}

const owner = await createEphemeralOwner();
const browser = await chromium.launch({ channel: "chrome", headless: true });
let evidence = null;

try {
  const variantResult = await serviceFetch(
    "/rest/v1/shop_variants?select=id,sku,weight_grams,length_mm,width_mm,height_mm,is_active&sku=eq.008-A5-80-LINED",
  );
  assert.equal(variantResult.response.ok, true);
  assert.equal(
    Array.isArray(variantResult.body) && variantResult.body.length === 1,
    true,
    "Testing-only SKU 008 variant missing",
  );
  const variant = variantResult.body[0];
  assert.equal(variant.is_active, true);
  assert.deepEqual(
    [
      Number(variant.weight_grams),
      Number(variant.length_mm),
      Number(variant.width_mm),
      Number(variant.height_mm),
    ],
    [300, 220, 160, 20],
    "Testing-only SKU 008 must use the approved marketplace candidate shipping fixture",
  );

  const context = await browser.newContext();
  const customerPage = await context.newPage();
  customerPage.setDefaultTimeout(20000);
  await customerPage.goto(stagingUrl + "/shop", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await appPost(
    customerPage,
    "cart",
    { variantId: variant.id, quantity: 1 },
    { staging: true },
  );

  const quotes = await appPost(
    customerPage,
    "shipping/rates",
    { postalCode: "12240" },
    { staging: true },
  );
  assert.equal(Array.isArray(quotes) && quotes.length > 0, true);
  const quote =
    quotes.find(
      (row) =>
        String(row.courier_code).toLowerCase() === "sicepat" &&
        String(row.service_code).toLowerCase() === "reg",
    ) ?? quotes[0];

  const checkout = await appPost(
    customerPage,
    "checkout",
    {
      name: "Mainlagi Sandbox Receiver",
      email: "mainlagi-b11-customer-" + runId + "@example.invalid",
      phone: "088888888888",
      address: "Mainlagi Sandbox Destination, Jakarta Selatan",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12240",
      quoteId: quote.id,
    },
    { staging: true },
  );
  assert.match(
    String(checkout.number ?? ""),
    /^MLG-\d{8}-[A-F0-9]{12}$/,
  );
  const orderNumber = checkout.number;

  const paymentSession = await appPost(customerPage, "payments/session", {
    number: orderNumber,
  });
  assert.equal(
    typeof paymentSession.url === "string" &&
      paymentSession.url.startsWith("https://app.sandbox.midtrans.com/"),
    true,
    "App did not return a Midtrans Sandbox Snap URL",
  );

  const snapPage = await context.newPage();
  snapPage.setDefaultTimeout(10000);
  await snapPage.goto(paymentSession.url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await snapPage.waitForTimeout(1500);

  const pending = await choosePermataOnSnap(snapPage, orderNumber);
  assert.equal(pending.status.transaction_status, "pending");
  const settled = await payPermataSimulator(
    browser,
    pending.vaNumber,
    orderNumber,
  );
  assert.equal(Number(settled.gross_amount) > 0, true);

  const reconciledPayment = await appPost(customerPage, "orders/refresh", {
    number: orderNumber,
  });
  assert.equal(reconciledPayment.status, "paid");

  let order = await localOrder(orderNumber);
  assert.equal(order.payment_status, "paid");
  assert.equal(order.order_status, "processing");
  assert.equal(order.fulfillment_status, "unfulfilled");

  const ownerCookies = await ephemeralOwnerCookies(owner);
  await context.addCookies(ownerCookies);
  const adminPage = await context.newPage();
  adminPage.setDefaultTimeout(20000);
  await adminPage.goto(stagingUrl + "/admin/shop/orders", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await appPost(adminPage, "admin/pack", { number: orderNumber });
  order = await localOrder(orderNumber);
  assert.equal(order.fulfillment_status, "ready_to_ship");

  await appPost(adminPage, "admin/ship", { number: orderNumber });
  const shipment = await localShipment(order.id);
  assert.equal(
    typeof shipment.provider_order_id === "string" &&
      shipment.provider_order_id.length > 5,
    true,
    "Integrated Biteship provider order id missing",
  );

  const providerOrder = await biteship(
    "/v1/orders/" + encodeURIComponent(shipment.provider_order_id),
  );
  assert.equal(providerOrder.response.status, 200);
  assert.equal(providerOrder.body?.success, true);
  assert.equal(providerOrder.body?.id, shipment.provider_order_id);
  assert.equal(providerOrder.body?.reference_id, orderNumber);

  const trackingId = providerOrder.body?.courier?.tracking_id;
  assert.equal(
    typeof trackingId === "string" && trackingId.length > 5,
    true,
    "Integrated Biteship order did not expose courier.tracking_id",
  );
  const tracking = await biteship(
    "/v1/trackings/" + encodeURIComponent(trackingId),
  );
  assert.equal(tracking.response.status, 200);
  assert.equal(tracking.body?.success, true);
  assert.equal(tracking.body?.order_id, shipment.provider_order_id);

  const webhook = await fetch(stagingUrl + "/api/shop/biteship/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Mainlagi-Biteship-Secret": biteshipWebhookSecret,
    },
    body: JSON.stringify({
      event: "order.status",
      order_id: shipment.provider_order_id,
      status: providerOrder.body.status,
    }),
    signal: AbortSignal.timeout(20000),
  });
  const webhookBody = await parseJson(webhook, "Integrated Biteship webhook");
  assert.equal(
    webhook.status,
    200,
    "Integrated Biteship webhook failed: " + JSON.stringify(webhookBody),
  );
  assert.deepEqual(webhookBody, { ok: true });

  const reconciliation = await fetch(stagingUrl + "/api/shop/reconcile", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + cronSecret,
      "Content-Type": "application/json",
    },
    body: "{}",
    signal: AbortSignal.timeout(30000),
  });
  const reconciliationBody = await parseJson(
    reconciliation,
    "Integrated reconciliation",
  );
  assert.equal(
    reconciliation.status,
    200,
    "Integrated reconciliation failed: " +
      JSON.stringify(reconciliationBody).slice(0, 800),
  );
  assert.equal(typeof reconciliationBody.runId, "string");

  const finalOrder = await localOrder(orderNumber);
  const finalShipment = await localShipment(order.id);
  const finalItem = await localOrderItem(order.id);
  assert.deepEqual(
    [
      finalItem.sku_snapshot,
      Number(finalItem.weight_grams_snapshot),
      Number(finalItem.length_mm_snapshot),
      Number(finalItem.width_mm_snapshot),
      Number(finalItem.height_mm_snapshot),
    ],
    [variant.sku, 300, 220, 160, 20],
    "Checkout must preserve the candidate shipping facts used for Biteship",
  );

  evidence = {
    environment: {
      database: "ephemeral local Supabase",
      appIngress: "Cloudflare Quick Tunnel",
      midtrans: "Sandbox",
      biteship: "Testing Mode",
      productionSalesEnabled: false,
      productionDatabaseUsed: false,
    },
    runId,
    orderNumber,
    product: {
      sku: variant.sku,
      fixtureOnly: true,
      candidateShippingFacts: {
        weightGrams: Number(variant.weight_grams),
        lengthMm: Number(variant.length_mm),
        widthMm: Number(variant.width_mm),
        heightMm: Number(variant.height_mm),
      },
      checkoutSnapshot: {
        weightGrams: Number(finalItem.weight_grams_snapshot),
        lengthMm: Number(finalItem.length_mm_snapshot),
        widthMm: Number(finalItem.width_mm_snapshot),
        heightMm: Number(finalItem.height_mm_snapshot),
      },
    },
    flow: {
      cart: "PASS",
      rates: "PASS",
      checkout: "PASS",
      midtransSnapSession: "PASS",
      midtransSimulatorSettlement: "PASS",
      localPaymentReconcile: finalOrder.payment_status === "paid" ? "PASS" : "FAIL",
      ownerAuthGate: "PASS",
      packed: "PASS",
      biteshipOrder: "PASS",
      biteshipProviderGet: "PASS",
      biteshipWebhook: "PASS",
      biteshipTracking: "PASS",
      reconciliation: "PASS",
    },
    payment: {
      status: settled.transaction_status,
      amountVerified:
        Number(settled.gross_amount) === Number(finalOrder.grand_total_amount),
      transactionIdPresent:
        typeof settled.transaction_id === "string" &&
        settled.transaction_id.length > 10,
    },
    shipping: {
      courierCode: quote.courier_code,
      serviceCode: quote.service_code,
      providerOrderId: finalShipment.provider_order_id,
      providerStatus: providerOrder.body.status,
      trackingId,
      trackingStatus: tracking.body.status ?? null,
      localFulfillmentStatus: finalOrder.fulfillment_status,
    },
    reconciliation: {
      runId: reconciliationBody.runId,
      status: reconciliationBody.status,
      shipmentProcessed: reconciliationBody.shipment?.processed ?? null,
    },
    assertions: {
      usedRealProductionProductFacts: false,
      choseProductionPiiRetention: false,
      repeatedDeliveredCancelledReturnedSimulation: false,
    },
  };

  assert.equal(evidence.payment.amountVerified, true);
  assert.equal(evidence.flow.localPaymentReconcile, "PASS");

  await writeFile(
    "/tmp/mainlagi-shop-batch11-integrated-e2e.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );

  console.log(
    "Shop Batch 11 integrated DB-backed E2E PASS: cart -> live Testing rates -> checkout -> Midtrans Sandbox Snap -> paid -> owner pack -> Biteship Testing order -> authenticated webhook -> tracking -> reconciliation. Public sales remained disabled and no production database was used.",
  );

  await context.close();
} finally {
  await browser.close();
  await deleteEphemeralOwner(owner.userId);
}

assert.ok(evidence, "Integrated evidence was not produced");
