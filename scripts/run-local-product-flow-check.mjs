import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_PRODUCT_FLOW_PORT ?? 4021);
const baseUrl = process.env.MAINLAGI_PRODUCT_FLOW_BASE_URL ?? `http://${host}:${port}`;
const childId = process.env.MAINLAGI_PRODUCT_QA_CHILD_ID ?? "demo-gian";
const shouldStartServer = !process.env.MAINLAGI_PRODUCT_FLOW_BASE_URL;

let server = null;
let serverLog = "";

function startServer() {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: baseUrl,
      NEXT_PUBLIC_DATA_BACKEND: process.env.NEXT_PUBLIC_DATA_BACKEND ?? "local"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const append = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", append);
  server.stderr.on("data", append);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`server did not become ready: ${lastError ?? "unknown"}\n${serverLog.slice(-3000)}`);
}

async function main() {
  if (shouldStartServer) {
    startServer();
    await waitForServer();
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const steps = [];

    await page.goto(`${baseUrl}/child/${childId}/home`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    steps.push(new URL(page.url()).pathname);

    const subjectLink = page.locator(`a[href^="/child/${childId}/subject/"]`).first();
    const subjectHref = await subjectLink.getAttribute("href").catch(() => null);
    await subjectLink.waitFor({ state: "visible", timeout: 8_000 });
    const resolvedSubjectHref = subjectHref ?? await subjectLink.getAttribute("href");
    if (!resolvedSubjectHref) throw new Error("home page has no subject href");
    await Promise.all([
      page.waitForURL(new RegExp(`${resolvedSubjectHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`), { timeout: 10_000 }),
      subjectLink.click()
    ]);
    await page.waitForLoadState("domcontentloaded");
    steps.push(new URL(page.url()).pathname);

    const journeyMap = page.locator("[data-belajar-journey-map=\"v1\"]");
    let activityLink;
    if (await journeyMap.count()) {
      await journeyMap.waitFor({ state: "visible", timeout: 8_000 });
      if (await journeyMap.locator("[data-journey-browse-all] [data-activity-id]").count() !== 100) {
        throw new Error("Journey Map subject page must preserve the complete 100-activity catalog");
      }
      const openStage = journeyMap.locator("[data-journey-stage]:not([disabled])").first();
      await openStage.waitFor({ state: "visible", timeout: 8_000 });
      await openStage.click();
      activityLink = page.locator(`[data-stage-detail-open] [data-stage-continue][href^="/child/${childId}/activity/"]`).first();
    } else {
      await page.locator("[data-activity-gallery]").waitFor({ state: "visible", timeout: 8_000 });
      if (await page.locator("[data-activity-id]").count() !== 100) throw new Error("gallery subject page must preserve the complete 100-activity catalog");
      activityLink = page.locator(`[data-playable-activity-gallery] a[href^="/child/${childId}/activity/"]`).first();
    }
    try {
      await activityLink.waitFor({ state: "visible", timeout: 8_000 });
    } catch {
      const body = (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 1200);
      throw new Error(`subject page did not expose a playable activity after hydration wait; body=${body}`);
    }
    const activityHref = await activityLink.getAttribute("href");
    if (!activityHref) throw new Error("playable activity link has no href");
    await Promise.all([
      page.waitForURL(new RegExp(`${activityHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`), { timeout: 10_000 }),
      activityLink.click()
    ]);
    await page.waitForLoadState("domcontentloaded");
    steps.push(new URL(page.url()).pathname);

    console.log("Local product primary flow PASS.");
    await page.locator('[data-activity-frame="garden"]').waitFor({ timeout: 8_000 });
    if (new URL(page.url()).pathname !== activityHref) throw new Error("activity redirected before its renderer became ready");
    console.log(JSON.stringify({ clickDepthHomeToActivity: steps.length - 1, steps, destinationActivity: activityHref }, null, 2));
    await context.close();
  } finally {
    await browser.close();
    stopServer();
  }
}

main().catch((error) => {
  console.error("Local product primary flow FAIL.");
  console.error(error);
  console.error(serverLog.slice(-4000));
  stopServer();
  process.exitCode = 1;
});
