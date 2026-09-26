import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_CORE_THUMBNAIL_QA_PORT ?? 4063);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/core-thumbnail-wave01");
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
      const response = await fetch(baseUrl + "/child/demo-gian/home");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Wave 01 QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1, `${label} horizontal overflow: ${JSON.stringify(metrics)}`);
}

async function imageSnapshot(image) {
  await image.waitFor({ state: "visible", timeout: 8_000 });
  await image.evaluate((item) => item.decode());
  return image.evaluate((item) => {
    const rect = item.getBoundingClientRect();
    return {
      src: item.currentSrc || item.getAttribute("src") || "",
      naturalWidth: item.naturalWidth,
      naturalHeight: item.naturalHeight,
      width: rect.width,
      height: rect.height
    };
  });
}

async function assertFourThree(image, label, expectedFragment = "core-thumbnails") {
  const snapshot = await imageSnapshot(image);
  assert(snapshot.src.includes(expectedFragment), `${label} must use ${expectedFragment}: ${snapshot.src}`);
  assert(snapshot.naturalWidth > 0 && snapshot.naturalHeight > 0, `${label} must decode`);
  assert(Math.abs((snapshot.width / snapshot.height) - (4 / 3)) < 0.04, `${label} must render 4:3: ${JSON.stringify(snapshot)}`);
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: viewport.width <= 768 });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

  await page.goto(baseUrl + "/child/demo-gian/home", { waitUntil: "domcontentloaded", timeout: 30_000 });
  await assertFourThree(page.locator("[data-mainlagi-home-hero] img").first(), `Home hero ${viewport.width}`, "home-hero-mainlagi");
  const subjects = page.locator('[data-core-thumbnail-card="subject"]');
  assert.equal(await subjects.count(), 9, "Home must render exactly nine subject thumbnails");
  const subjectColumns = await subjects.first().evaluate((element) => getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length);
  assert.equal(subjectColumns, viewport.width <= 760 ? 2 : 3, `subject columns at ${viewport.width}`);
  for (let i = 0; i < 9; i += 1) {
    const card = subjects.nth(i);
    assert.equal(await card.locator("img").count(), 1, `subject card ${i + 1} image count`);
    assert.equal(await card.locator("strong, small, p").count(), 0, `subject card ${i + 1} must not expose extra copy elements`);
    await assertFourThree(card.locator("img"), `subject ${i + 1} ${viewport.width}`);
  }
  await assertNoOverflow(page, `Home ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `home-${viewport.width}.png`), fullPage: true });

  pageErrors.length = 0;
  consoleErrors.length = 0;
  await page.goto(baseUrl + "/child/demo-gian/games", { waitUntil: "domcontentloaded", timeout: 30_000 });
  await assertFourThree(page.locator('[data-core-thumbnail-surface="main-gerak-header"] img').first(), `Main Gerak header ${viewport.width}`, "main-gerak-header");
  const games = page.locator('[data-core-thumbnail-card="game"]');
  assert.equal(await games.count(), 10, "child Main Gerak must render exactly ten game thumbnails");
  const gameColumns = await games.first().evaluate((element) => getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length);
  assert.equal(gameColumns, viewport.width >= 1080 ? 5 : viewport.width >= 760 ? 3 : 2, `game columns at ${viewport.width}`);
  for (let i = 0; i < 10; i += 1) {
    const card = games.nth(i);
    assert.equal(await card.locator("img").count(), 1, `game card ${i + 1} image count`);
    assert.equal(await card.locator("p, small").count(), 0, `game card ${i + 1} must not expose metadata copy`);
    await assertFourThree(card.locator("img"), `game ${i + 1} ${viewport.width}`);
  }
  await assertNoOverflow(page, `Main Gerak ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `games-${viewport.width}.png`), fullPage: true });

  pageErrors.length = 0;
  consoleErrors.length = 0;
  await page.goto(baseUrl + "/child/demo-gian/worlds", { waitUntil: "domcontentloaded", timeout: 30_000 });
  await assertFourThree(page.locator('[data-core-thumbnail-surface="world-header"] img').first(), `World header ${viewport.width}`, "world-header-mainlagi");
  const worlds = page.locator('[data-core-thumbnail-card="world"]');
  assert.equal(await worlds.count(), 9, "World catalog must render exactly nine cards");
  assert.equal(await page.locator('[data-world-status="live"]').count(), 1, "exactly one World is live");
  assert.equal(await page.locator('[data-world-status="locked"]').count(), 8, "exactly eight Worlds are locked");
  assert.equal(await page.locator('[data-world-status="live"]').getAttribute("href"), "/child/demo-gian/world/money-festival");
  assert.equal(await page.locator('[data-world-status="locked"] a').count(), 0, "locked Worlds must be non-navigable");
  const worldColumns = await worlds.first().evaluate((element) => getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length);
  assert.equal(worldColumns, viewport.width <= 760 ? 2 : 3, `World columns at ${viewport.width}`);
  for (let i = 0; i < 9; i += 1) {
    const card = worlds.nth(i);
    assert.equal(await card.locator("img").count(), 1, `World card ${i + 1} image count`);
    assert.equal(await card.locator("p, small").count(), 0, `World card ${i + 1} must not expose descriptive copy`);
    await assertFourThree(card.locator("img"), `World ${i + 1} ${viewport.width}`);
  }
  const lockedStyle = await page.locator('[data-world-status="locked"]').first().evaluate((element) => ({
    opacity: Number(getComputedStyle(element).opacity),
    filter: getComputedStyle(element).filter,
    locks: element.querySelectorAll("svg").length
  }));
  assert(lockedStyle.opacity < 0.8, `locked World must be visibly faded: ${JSON.stringify(lockedStyle)}`);
  assert(lockedStyle.locks >= 1, "locked World must expose a lock icon");
  await assertNoOverflow(page, `World catalog ${viewport.width}`);
  await page.screenshot({ path: path.join(outDir, `worlds-${viewport.width}.png`), fullPage: true });

  assert.deepEqual(pageErrors, [], `Wave 01 page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `Wave 01 console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
  await context.close();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of VIEWPORTS) await runViewport(browser, viewport);
    console.log("Core Thumbnail Wave 01 browser QA PASS: Home/9 subjects, Main Gerak/10 games, and World/9 cards use responsive 4:3 imagery with 1 live + 8 locked Worlds.");
  } finally {
    await browser.close();
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode = 1;
  stopServer();
});
