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

async function clickAndWait(page, locator, expectedPathPattern, label) {
  await locator.waitFor({ state: "visible", timeout: 8_000 });
  const href = await locator.getAttribute("href");
  if (!href) throw new Error(`${label} has no href`);
  await Promise.all([
    page.waitForURL(expectedPathPattern, { timeout: 10_000 }),
    locator.click()
  ]);
  await page.waitForLoadState("domcontentloaded");
  return href;
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

    await clickAndWait(
      page,
      page.locator(`a[href="/child/${childId}/learn"]`).first(),
      new RegExp(`/child/${childId}/learn(?:\\?.*)?$`),
      "home Learn link"
    );
    steps.push(new URL(page.url()).pathname);

    const subjectLink = page.locator(`a[href^="/child/${childId}/subject/"]`).first();
    const subjectHref = await subjectLink.getAttribute("href").catch(() => null);
    await subjectLink.waitFor({ state: "visible", timeout: 8_000 });
    const resolvedSubjectHref = subjectHref ?? await subjectLink.getAttribute("href");
    if (!resolvedSubjectHref) throw new Error("learn page has no subject href");
    await Promise.all([
      page.waitForURL(new RegExp(`${resolvedSubjectHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`), { timeout: 10_000 }),
      subjectLink.click()
    ]);
    await page.waitForLoadState("domcontentloaded");
    steps.push(new URL(page.url()).pathname);

    const stageLink = page.locator(`a[href^="/child/${childId}/stage/"]`).first();
    await stageLink.waitFor({ state: "visible", timeout: 8_000 });
    const stageHref = await stageLink.getAttribute("href");
    if (!stageHref) throw new Error("subject page has no unlocked stage href");
    await Promise.all([
      page.waitForURL(new RegExp(`${stageHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`), { timeout: 10_000 }),
      stageLink.click()
    ]);
    await page.waitForLoadState("domcontentloaded");
    steps.push(new URL(page.url()).pathname);

    const activityLink = page.locator(`a[href^="/child/${childId}/activity/"]`).first();
    try {
      await activityLink.waitFor({ state: "visible", timeout: 8_000 });
    } catch {
      const body = (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 1200);
      throw new Error(`stage page did not expose an activity link after hydration wait; body=${body}`);
    }
    const activityHref = await activityLink.getAttribute("href");
    if (!activityHref) throw new Error("stage activity link has no href");
    await Promise.all([
      page.waitForURL(new RegExp(`${activityHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`), { timeout: 10_000 }),
      activityLink.click()
    ]);
    await page.waitForLoadState("domcontentloaded");
    steps.push(new URL(page.url()).pathname);

    console.log("Local product primary flow PASS.");
    console.log(JSON.stringify({ clickDepthHomeToActivity: 4, steps, destinationActivity: activityHref }, null, 2));
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
