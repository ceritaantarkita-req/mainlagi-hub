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
const route = "/child/demo-gian/activity/letters-find-upper-b";
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

    const hunt = page.locator("[data-symbol-hunt]");
    await hunt.waitFor({ state: "visible", timeout: 5_000 });
    const choices = hunt.getByRole("button");
    assert.equal(await choices.count(), 3, `symbol hunt must render exactly three canonical choices at ${viewport.width}px`);

    const geometry = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const buttons = Array.from(document.querySelectorAll("[data-symbol-hunt] button")).map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          label: button.getAttribute("aria-label") || button.textContent?.trim() || "",
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right
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
    }

    let focusedChoice = false;
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Tab");
      focusedChoice = await page.evaluate(() => Boolean(document.activeElement?.closest?.("[data-symbol-hunt]")));
      if (focusedChoice) break;
    }
    assert.ok(focusedChoice, `symbol-hunt choices must be keyboard reachable at ${viewport.width}px`);

    const choiceB = choices.filter({ hasText: /^B$/ });
    const wrong = choices.filter({ hasNotText: /^B$/ }).first();
    await wrong.click();
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 3_000 });
    await choiceB.click();
    await page.getByRole("status").filter({ hasText: "Ketemu" }).waitFor({ state: "visible", timeout: 3_000 });

    assert.deepEqual(pageErrors, [], `symbol hunt raised page errors at ${viewport.width}px: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `symbol hunt logged console errors at ${viewport.width}px: ${consoleErrors.join(" | ")}`);

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-symbol-hunt-letters-find-upper-b.png`),
      fullPage: false
    });
    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  startServer();
  await waitForServer();
  for (const viewport of viewports) await inspect(viewport);
  console.log(`Symbol-hunt browser QA passed ${viewports.length} representative viewports with screenshots.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
