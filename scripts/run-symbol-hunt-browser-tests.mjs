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
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
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
    // A title must float in the illustrated world with a feathered fade,
    // not a solid cream block with rounded corners. Symbol Hunt owns its
    // heading in ChildLearningPlatform rather than Garden's title slot.
    const heading = await page.locator('[data-activity-frame="garden"] h1').first().evaluate((node) => {
      const css = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        gradient: css.backgroundImage,
        background: css.backgroundColor,
        border: parseFloat(css.borderTopWidth),
        radius: css.borderTopLeftRadius,
        shadow: css.boxShadow,
        textShadow: css.textShadow,
        left: rect.left,
        right: rect.right,
        viewport: document.documentElement.clientWidth
      };
    });
    assert.match(heading.gradient, /closest-side/, `symbol-hunt title needs an edge-bounded fade at ${viewport.width}px`);
    assert.match(heading.gradient, /radial-gradient/, `symbol-hunt title needs localized soft fade at ${viewport.width}px`);
    assert.equal(heading.background, "rgba(0, 0, 0, 0)", `symbol-hunt title has solid box at ${viewport.width}px`);
    assert.equal(heading.border, 0, `symbol-hunt title regained rectangular border at ${viewport.width}px`);
    assert.equal(heading.radius, "0px", `symbol-hunt title regained a rounded label at ${viewport.width}px`);
    assert.equal(heading.shadow, "none", `symbol-hunt title regained a card shadow at ${viewport.width}px`);
    assert.notEqual(heading.textShadow, "none", `symbol-hunt title lost text readability at ${viewport.width}px`);
    assert.ok(heading.left >= -1 && heading.right <= heading.viewport + 1,
      `symbol-hunt title clips outside the scene at ${viewport.width}px`);


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

    // Regress desktop spacing: a generic Garden .spacious [data-choices] margin
    // previously shifted all three absolutely positioned letter buttons down
    // ~190px and clipped the bottom choice in the illustrated board.
    const verifyLetterPositions = async (activityRoute) => {
      const measurements = await page.evaluate(() => {
        const field = document.querySelector("[data-symbol-hunt]");
        const scene = field?.closest("section");
        const prompt = scene?.querySelector("h1")?.closest("div");
        if (!field || !scene) return null;
        const sceneRect = scene.getBoundingClientRect();
        const buttons = [...field.querySelectorAll("button")].map((button) => {
          const r = button.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, centerY: (r.top + r.bottom) / 2 };
        });
        return {
          marginTop: getComputedStyle(field).marginTop,
          sceneTop: sceneRect.top,
          sceneBottom: sceneRect.bottom,
          promptBottom: prompt?.getBoundingClientRect().bottom ?? null,
          buttons
        };
      });
      assert.ok(measurements, activityRoute + " symbol hunt geometry exists");
      assert.equal(measurements.marginTop, "0px", activityRoute + " positioned choices must not inherit Garden spacing");
      assert.equal(measurements.buttons.length, 3, activityRoute + " must show three letters");
      for (const button of measurements.buttons) {
        assert.ok(button.top >= measurements.sceneTop - 2,
          activityRoute + " choice must remain inside board top: " + JSON.stringify(measurements));
        assert.ok(button.bottom <= measurements.sceneBottom - 4,
          activityRoute + " choice must not be clipped at board bottom: " + JSON.stringify(measurements));
      }
      const boardHeight = measurements.sceneBottom - measurements.sceneTop;
      assert.ok(measurements.buttons.some((b) => b.centerY < measurements.sceneTop + boardHeight * .60),
        activityRoute + " needs letters in the upper/middle playing field");
    };
    await verifyLetterPositions(route);

    // VQA-06: the nested pedagogical prompt is not the main Garden title.
    // Guard that it remains readable and doesn't physically obstruct the
    // three letter choices before considering any visual simplification.
    const instruction = await page.evaluate(() => {
      const title = document.querySelector("#symbol-hunt-prompt");
      const scene = title?.closest("section");
      const panel = title?.parentElement?.parentElement;
      const field = scene?.querySelector("[data-symbol-hunt]");
      if (!title || !scene || !panel || !field) return null;
      const p = panel.getBoundingClientRect();
      const r = scene.getBoundingClientRect();
      const buttons = [...field.querySelectorAll("button")].map(node => node.getBoundingClientRect());
      return {
        label: title.textContent?.trim() ?? "",
        help: panel.querySelector("p")?.textContent?.trim() ?? "",
        left: p.left, right: p.right, top: p.top, bottom: p.bottom,
        sceneLeft: r.left, sceneRight: r.right, sceneTop: r.top,
        minLetterTop: Math.min(...buttons.map(button => button.top)),
        width: p.width
      };
    });
    assert.ok(instruction && instruction.label.length > 0 && instruction.help.length > 0,
      `Symbol Hunt prompt and child instruction must be readable at ${viewport.width}px`);
    assert.ok(instruction.width >= 180 && instruction.left >= instruction.sceneLeft - 2 &&
      instruction.right <= instruction.sceneRight + 2,
      `Symbol Hunt nested instruction stays inside the board at ${viewport.width}px: ${JSON.stringify(instruction)}`);
    assert.ok(instruction.bottom <= instruction.minLetterTop + 2,
      `Symbol Hunt prompt overlaps the first playable letter at ${viewport.width}px: ${JSON.stringify(instruction)}`);

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
    await page.screenshot({path:path.join(screenshotDir, `${viewport.width}-${screenshotStem}-wrong.png`),fullPage:false});

    const correct = page.getByRole("button", { name: `Huruf ${targetSymbol}`, exact: true });
    await correct.waitFor({ state: "visible" });
    await correct.focus();
    const focusedLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
    assert.equal(focusedLabel, `Huruf ${targetSymbol}`, `canonical target must accept keyboard focus at ${viewport.width}px`);
    await page.keyboard.press("Enter");
    const completion = page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({ state: "visible", timeout: 3_000 });
    assert.deepEqual(
      await completion.locator("[data-completion-action]").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim())),
      ["Back", "Again", "Next", "Share"],
      `symbol hunt success must use canonical Completion action order at ${viewport.width}px`
    );

    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-${screenshotStem}-success.png`),
      fullPage: false
    });

    assert.equal(new URL(page.url()).pathname, route, `symbol hunt unexpectedly navigated away at ${viewport.width}px`);
    await completion.locator('[data-completion-action="again"]').click();
    await completion.waitFor({state:"hidden",timeout:3000});
    assert.equal(await hunt.getByRole("button", {disabled:false}).count(),3,
      `symbol hunt Again must restore all three playable letters at ${viewport.width}px`);
    await page.screenshot({path:path.join(screenshotDir, `${viewport.width}-${screenshotStem}-again.png`),fullPage:false});
    // Same positioning contract for the reported Bahasa vowel-O route.
    await page.goto(baseUrl + "/child/demo-gian/activity/bahasa-vokal-o", { waitUntil: "domcontentloaded" });
    await page.locator("[data-symbol-hunt]").waitFor({ state: "visible", timeout: 5_000 });
    await verifyLetterPositions("bahasa-vokal-o");
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-symbol-hunt-bahasa-vokal-o-idle.png`),
      fullPage: false
    });


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
  console.log(`Symbol-hunt browser QA passed ${viewports.length} representative viewports with pointer, keyboard, canonical Completion, and idle/success screenshot checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
