import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_WORLD_CHARACTER_QA_PORT ?? 4058);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/world-character-session08");
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 900 }
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

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/child/demo-gian/worlds`, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`World character QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function waitForWorldState(page, state, timeout = 5_000) {
  await page.waitForFunction(
    (expected) => document.querySelector("[data-world-character-state]")?.getAttribute("data-world-character-state") === expected,
    state,
    { timeout }
  );
}

async function assertSharedPair(scope, expectedState) {
  const layer = scope.locator("[data-character-layer]");
  assert.equal(await layer.count(), 1, "World surface must render one shared CharacterLayer");
  assert.equal(await layer.getAttribute("aria-hidden"), "true", "World CharacterLayer stays decorative");
  const images = layer.locator("img");
  assert.equal(await images.count(), 2, "World authored cast must contain Gavi + Paca");
  const snapshot = await images.evaluateAll((items) => items.map((item) => ({
    id: item.getAttribute("data-character-id"),
    state: item.getAttribute("data-character-state"),
    source: item.getAttribute("data-character-asset-source"),
    src: item.getAttribute("src"),
    naturalWidth: item.naturalWidth,
    naturalHeight: item.naturalHeight,
    pointerEvents: getComputedStyle(item).pointerEvents
  })));
  assert.deepEqual(snapshot.map((item) => item.id), ["gavi", "paca"]);
  assert(snapshot.every((item) => item.state === expectedState), `World cast must use ${expectedState}`);
  assert(snapshot.every((item) => item.source === "svg-state"), "World cast must use the approved shared SVG state bank");
  assert(snapshot.every((item) => item.src?.endsWith(`-${expectedState === "try_again" ? "try-again" : expectedState}-v1.svg`)), "World cast paths must match semantic state");
  assert(snapshot.every((item) => item.naturalWidth > 0 && item.naturalHeight > 0), "World SVG characters must load");
  assert(snapshot.every((item) => item.pointerEvents === "none"), "World character images must never block interaction");
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1, `${label} must not horizontally overflow: ${JSON.stringify(metrics)}`);
}

async function assertChallengeCharacterContainment(page, label) {
  const result = await page.evaluate(() => {
    const layer = document.querySelector("[data-world-scene-frame] [data-character-layer]");
    const content = document.querySelector("[data-world-scene-content]");
    if (!layer || !content) return null;
    const contentRect = content.getBoundingClientRect();
    const images = [...layer.querySelectorAll("img")].map((image) => {
      const rect = image.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
    const overlaps = images.some((rect) =>
      rect.left < contentRect.right - 2 &&
      rect.right > contentRect.left + 2 &&
      rect.top < contentRect.bottom - 2 &&
      rect.bottom > contentRect.top + 2
    );
    return {
      overlaps,
      layerPointerEvents: getComputedStyle(layer).pointerEvents,
      content: {
        left: contentRect.left,
        right: contentRect.right,
        top: contentRect.top,
        bottom: contentRect.bottom
      },
      images
    };
  });
  assert(result, `${label} must expose challenge character/content geometry`);
  assert.equal(result.layerPointerEvents, "none", `${label} layer must be pointer transparent`);
  if (page.viewportSize().width <= 1100) {
    assert.equal(result.overlaps, false, `${label} mobile/tablet character dock must stay out of challenge content flow: ${JSON.stringify(result)}`);
  }
}

async function advanceNarrative(page) {
  const next = page.locator("[data-world-next]").first();
  await next.waitFor({ state: "visible", timeout: 5_000 });
  if (await next.isDisabled()) {
    const hear = page.locator("[data-world-hear]").first();
    await hear.waitFor({ state: "visible", timeout: 5_000 });
    await hear.click();
    await page.waitForFunction(() => {
      const button = document.querySelector("[data-world-next]");
      return button instanceof HTMLButtonElement && !button.disabled;
    }, null, { timeout: 5_000 });
  }
  await next.click();
}

async function completeFirstDragChallenge(page) {
  await page.getByRole("button", { name: "Rp3", exact: true }).click();
  await page.getByRole("button", { name: /🍎 Buah · Rp4/ }).click();
  await waitForWorldState(page, "try_again");
  await assertSharedPair(page.locator("[data-world-scene-frame]"), "try_again");

  await page.getByRole("button", { name: "Rp3", exact: true }).click();
  await page.getByRole("button", { name: /🎈 Balon · Rp3/ }).click();
  await waitForWorldState(page, "correct");
  await assertSharedPair(page.locator("[data-world-scene-frame]"), "correct");

  await page.getByRole("button", { name: "Rp4", exact: true }).click();
  await page.getByRole("button", { name: /🍎 Buah · Rp4/ }).click();
  await page.getByRole("button", { name: "Rp5", exact: true }).click();
  await page.getByRole("button", { name: /🧃 Jus · Rp5/ }).click();
  await page.waitForFunction(() => document.querySelector("[data-world-character-state]")?.getAttribute("data-world-character-state") === "hero", null, { timeout: 5_000 });
}

async function completeMatchingChallenge(page) {
  const left = page.getByRole("group", { name: "Kartu kiri" });
  const right = page.getByRole("group", { name: "Kartu kanan" });
  for (const [leftLabel, rightLabel] of [
    ["🎈 Balon", "Rp3"],
    ["🍎 Buah", "Rp4"],
    ["🧃 Jus", "Rp5"]
  ]) {
    await left.getByRole("button", { name: leftLabel, exact: true }).click();
    await right.getByRole("button", { name: rightLabel, exact: true }).click();
  }
  await page.waitForFunction(() => document.querySelector("[data-world-character-state]")?.getAttribute("data-world-character-state") === "hero", null, { timeout: 5_000 });
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: viewport.width <= 768 });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const catalogRoute = "/child/demo-gian/worlds";
  await page.goto(baseUrl + catalogRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator("[data-world-catalog-cta]").waitFor({ state: "visible", timeout: 8_000 });
  assert.equal(new URL(page.url()).pathname, catalogRoute);
  const catalogHero = page.locator('[data-world-character-state="welcome"]').first();
  await catalogHero.waitFor({ state: "visible", timeout: 5_000 });
  await assertSharedPair(catalogHero, "welcome");
  await assertNoHorizontalOverflow(page, `catalog ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `catalog-${viewport.width}.png`), fullPage: true });

  const mapRoute = "/child/demo-gian/world/money-festival";
  await page.goto(baseUrl + mapRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator('[data-world-map="money-festival"]').waitFor({ state: "visible", timeout: 8_000 });
  assert.equal(new URL(page.url()).pathname, mapRoute);
  const mapHero = page.locator('[data-world-character-state="pointing"]').first();
  await mapHero.waitFor({ state: "visible", timeout: 5_000 });
  await assertSharedPair(mapHero, "pointing");
  await assertNoHorizontalOverflow(page, `map ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `map-${viewport.width}.png`), fullPage: true });

  const stageRoute = "/child/demo-gian/world/money-festival/stage/money-stage-01-money-use";
  await page.goto(baseUrl + stageRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator('[data-world-stage-shell="garden-baseline-v1"]').waitFor({ state: "visible", timeout: 10_000 });
  assert.equal(new URL(page.url()).pathname, stageRoute);
  await waitForWorldState(page, "hero", 8_000);
  const firstPortrait = page.locator('[data-world-story-character="gavi"]').first();
  await firstPortrait.waitFor({ state: "visible", timeout: 5_000 });
  await assertSharedPair(firstPortrait, "hero").catch(async () => {
    const layer = firstPortrait.locator("[data-character-layer]");
    assert.equal(await layer.count(), 1);
    const image = layer.locator("img");
    assert.equal(await image.count(), 1);
    assert.equal(await image.getAttribute("data-character-id"), "gavi");
    assert.equal(await image.getAttribute("data-character-state"), "hero");
    assert.equal(await image.getAttribute("data-character-asset-source"), "svg-state");
  });

  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);

  await waitForWorldState(page, "thinking", 8_000);
  await page.getByRole("heading", { name: "Cocokkan uang dengan harga barang.", exact: true }).waitFor({ state: "visible", timeout: 5_000 });
  await assertSharedPair(page.locator("[data-world-scene-frame]"), "thinking");
  await assertChallengeCharacterContainment(page, `challenge ${viewport.width}px`);
  await completeFirstDragChallenge(page);

  await advanceNarrative(page);
  await advanceNarrative(page);
  await waitForWorldState(page, "thinking", 8_000);
  await completeMatchingChallenge(page);

  await advanceNarrative(page);
  await advanceNarrative(page);

  await page.locator('[data-world-completion-stage="money-stage-01-money-use"]').waitFor({ state: "visible", timeout: 8_000 });
  const completionCharacters = page.locator('[data-world-character-state="celebrate"]').first();
  await completionCharacters.waitFor({ state: "visible", timeout: 5_000 });
  await assertSharedPair(completionCharacters, "celebrate");
  await assertNoHorizontalOverflow(page, `completion ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `completion-${viewport.width}.png`), fullPage: true });

  assert.deepEqual(pageErrors, [], `World character QA page errors at ${viewport.width}px: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `World character QA console errors at ${viewport.width}px: ${consoleErrors.join(" | ")}`);
  await context.close();
}

async function main() {
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const report = { status: "RUNNING", viewports: VIEWPORTS };
  try {
    for (const viewport of VIEWPORTS) await runViewport(browser, viewport);
    report.status = "PASS";
    console.log("World character Session 08 browser regression passed: catalog welcome, map pointing, story hero, challenge thinking/retry/correct, and completion celebrate use Gavi/Paca shared SVG runtime without mobile overlap.");
  } catch (error) {
    report.status = "FAIL";
    report.error = String(error?.stack ?? error);
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  } finally {
    writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
    await browser.close();
    stopServer();
  }
}

main();
