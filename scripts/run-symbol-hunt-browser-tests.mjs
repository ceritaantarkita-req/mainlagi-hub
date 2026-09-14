import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SYMBOL_HUNT_QA_PORT ?? 4011);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/letters-find-a";
const targetSymbol = "A";
const screenshotStem = "symbol-hunt-letters-find-a";
const screenshotDir = path.join(root, ".mobile-route-qa");
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 430, height: 860 },
  { width: 768, height: 1024 }
];

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
      NEXT_PUBLIC_DATA_BACKEND: "local"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const append = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", append);
  server.stderr.on("data", append);
}

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Symbol-hunt QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function inspect(viewport) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    assert.ok(response && response.status() < 400, `symbol hunt returned bad HTTP status at ${viewport.width}px`);
    await page.waitForLoadState("load");

    const hunt = page.locator("[data-symbol-hunt]");
    await hunt.waitFor({ state: "visible", timeout: 5_000 });
    await page.waitForFunction(
      () => document.querySelector("[data-symbol-hunt]")?.getAttribute("data-symbol-hunt-ready") === "true",
      undefined,
      { timeout: 5_000 }
    );

    assert.equal(new URL(page.url()).pathname, route, `progression guard redirected the representative route at ${viewport.width}px`);

    const choices = hunt.getByRole("button");
    assert.equal(await choices.count(), 3, `symbol hunt must render exactly three canonical choices at ${viewport.width}px`);

    const geometry = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const buttons = Array.from(document.querySelectorAll("[data-symbol-hunt] button")).map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          label: button.getAttribute("aria-label") || button.textContent?.trim() || "",
          value: button.textContent?.trim() || "",
          tabIndex: button.tabIndex,
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        };
      });
      return {
        viewportWidth,
        htmlWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        buttons
      };
    });

    assert.ok(geometry.htmlWidth <= geometry.viewportWidth + 1 && geometry.bodyWidth <= geometry.viewportWidth + 1, `symbol hunt overflows horizontally at ${viewport.width}px`);
    for (const button of geometry.buttons) {
      assert.ok(button.width >= 42 && button.height >= 42, `${button.label} is too small at ${viewport.width}px`);
      assert.ok(button.left >= -1 && button.right <= geometry.viewportWidth + 1, `${button.label} escapes viewport at ${viewport.width}px`);
      assert.ok(button.label.length > 0, `symbol-hunt choice needs an accessible label at ${viewport.width}px`);
      assert.ok(button.tabIndex >= 0, `${button.label} must remain keyboard focusable at ${viewport.width}px`);
    }

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-${screenshotStem}-idle.png`),
      fullPage: false
    });

    const values = geometry.buttons.map((button) => button.value).filter(Boolean);
    assert.ok(values.includes(targetSymbol), `representative symbol hunt must contain canonical target ${targetSymbol} at ${viewport.width}px`);
    const wrongButton = geometry.buttons.find((button) => button.value && button.value !== targetSymbol);
    assert.ok(wrongButton, `representative symbol hunt needs a wrong choice at ${viewport.width}px`);

    const hitLabel = await page.evaluate(({ x, y }) => {
      const hit = document.elementFromPoint(x, y);
      return hit?.closest("button")?.getAttribute("aria-label") ?? "";
    }, { x: wrongButton.centerX, y: wrongButton.centerY });
    assert.equal(hitLabel, wrongButton.label, `${wrongButton.label} center must be an unobstructed pointer target at ${viewport.width}px`);

    await page.mouse.click(wrongButton.centerX, wrongButton.centerY);
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 3_000 });

    const correct = page.getByRole("button", { name: `Huruf ${targetSymbol}`, exact: true });
    await correct.waitFor({ state: "visible" });
    await correct.focus();
    const focusedLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
    assert.equal(focusedLabel, `Huruf ${targetSymbol}`, `canonical target must accept keyboard focus at ${viewport.width}px`);
    await page.keyboard.press("Enter");
    await page.getByRole("status").filter({ hasText: "Ketemu" }).waitFor({ state: "visible", timeout: 3_000 });

    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-${screenshotStem}-success.png`),
      fullPage: false
    });

    assert.equal(new URL(page.url()).pathname, route, `symbol hunt unexpectedly navigated away at ${viewport.width}px`);
    assert.deepEqual(pageErrors, [], `symbol hunt raised page errors at ${viewport.width}px: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `symbol hunt logged console errors at ${viewport.width}px: ${consoleErrors.join(" | ")}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  startServer();
  await waitForServer();
  for (const viewport of viewports) await inspect(viewport);
  console.log(`Symbol-hunt browser QA passed ${viewports.length} representative viewports with pointer, keyboard, and idle/success screenshot checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
