import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_HOME_BERMAIN_CHARACTER_QA_PORT ?? 4059);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/home-bermain-character-session09");
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
      const response = await fetch(`${baseUrl}/child/demo-gian/home`, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Session 09 character QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function assertCharacterLayer(scope, expectedIds, expectedState, label) {
  const layer = scope.locator("[data-character-layer]");
  assert.equal(await layer.count(), 1, `${label} must render exactly one shared CharacterLayer`);
  assert.equal(await layer.getAttribute("aria-hidden"), "true", `${label} character layer stays decorative`);

  const images = layer.locator("img");
  assert.equal(await images.count(), expectedIds.length, `${label} must render the expected character count`);
  await images.evaluateAll((items) => Promise.all(items.map((item) => item.decode())));

  const snapshot = await images.evaluateAll((items) => items.map((item) => ({
    id: item.getAttribute("data-character-id"),
    state: item.getAttribute("data-character-state"),
    source: item.getAttribute("data-character-asset-source"),
    src: item.getAttribute("src"),
    width: item.naturalWidth,
    height: item.naturalHeight,
    pointerEvents: getComputedStyle(item).pointerEvents
  })));

  assert.deepEqual(snapshot.map((item) => item.id), expectedIds, `${label} must preserve canonical cast order`);
  assert(snapshot.every((item) => item.state === expectedState), `${label} must use ${expectedState}`);
  assert(snapshot.every((item) => item.source === "svg-state"), `${label} must use approved SVG state assets`);
  assert(
    snapshot.every((item) => item.src?.endsWith(`-${expectedState === "try_again" ? "try-again" : expectedState}-v1.svg`)),
    `${label} asset paths must match semantic state`
  );
  assert(snapshot.every((item) => item.width > 0 && item.height > 0), `${label} SVGs must decode`);
  assert(snapshot.every((item) => item.pointerEvents === "none"), `${label} characters must remain pointer transparent`);
}

async function assertCoreThumbnail(image, expectedFragment, label) {
  await image.waitFor({ state: "visible", timeout: 8_000 });
  await image.evaluate((item) => item.decode());
  const snapshot = await image.evaluate((item) => {
    const rect = item.getBoundingClientRect();
    return {
      src: item.currentSrc || item.getAttribute("src") || "",
      naturalWidth: item.naturalWidth,
      naturalHeight: item.naturalHeight,
      width: rect.width,
      height: rect.height
    };
  });
  assert(snapshot.src.includes(expectedFragment), `${label} must load ${expectedFragment}: ${snapshot.src}`);
  assert(snapshot.naturalWidth > 0 && snapshot.naturalHeight > 0, `${label} must decode`);
  assert(Math.abs((snapshot.width / snapshot.height) - (4 / 3)) < 0.04, `${label} must render 4:3: ${JSON.stringify(snapshot)}`);
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(
    metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1,
    `${label} must not horizontally overflow: ${JSON.stringify(metrics)}`
  );
}

async function assertNoPageErrors(page, pageErrors, consoleErrors, label) {
  assert.deepEqual(pageErrors, [], `${label} page errors: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `${label} console errors: ${consoleErrors.join(" | ")}`);
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
    hasTouch: viewport.width <= 768
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(baseUrl + "/child/demo-gian/home", { waitUntil: "domcontentloaded", timeout: 30_000 });
  const homeHero = page.locator("[data-mainlagi-home-hero] img").first();
  await assertCoreThumbnail(homeHero, "core-thumbnails", `Home hero ${viewport.width}px`);

  const domainCards = page.locator("[data-mainlagi-domain-card]");
  assert.equal(await domainCards.count(), 3, "Home must expose exactly Belajar, World, and Bermain product domains");
  assert.deepEqual(
    await domainCards.evaluateAll((items) => items.map((item) => item.getAttribute("data-mainlagi-domain-card"))),
    ["belajar", "world", "bermain"],
    "Home domain order stays Belajar -> World -> Bermain"
  );
  assert.equal(
    await page.locator('[data-mainlagi-domain-card="world"]').getAttribute("data-mainlagi-home-world-state"),
    "age-gated",
    "age-5 demo profile must not silently bypass the 6–8 Petualangan Uang pilot gate"
  );
  assert.equal(
    await page.locator('[data-mainlagi-domain-card="bermain"]').getAttribute("href"),
    "/child/demo-gian/games",
    "Bermain Home card must stay inside the child shell before entering a game"
  );

  const subjectCards = page.locator('[data-core-thumbnail-card="subject"]');
  assert.equal(await subjectCards.count(), 9, "Home must preserve all nine Belajar subject entries");
  const subjectImages = subjectCards.locator("img");
  assert.equal(await subjectImages.count(), 9, "all subject cards must use a thumbnail");
  for (let index = 0; index < 9; index += 1) {
    await assertCoreThumbnail(subjectImages.nth(index), "core-thumbnails", `subject thumbnail ${index + 1} at ${viewport.width}px`);
  }
  const subjectColumns = await subjectCards.first().evaluate((element) =>
    getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length
  );
  assert.equal(
    subjectColumns,
    viewport.width <= 760 ? 2 : 3,
    `subject directory must use ${viewport.width <= 760 ? 2 : 3} columns at ${viewport.width}px`
  );

  await assertNoHorizontalOverflow(page, `Home ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `home-${viewport.width}.png`), fullPage: true });
  await assertNoPageErrors(page, pageErrors, consoleErrors, `Home ${viewport.width}px`);

  pageErrors.length = 0;
  consoleErrors.length = 0;
  await page.goto(baseUrl + "/child/demo-gian/games", { waitUntil: "domcontentloaded", timeout: 30_000 });
  const playEntry = page.locator("[data-mainlagi-play-entry]");
  await playEntry.waitFor({ state: "visible", timeout: 8_000 });
  await assertCoreThumbnail(playEntry.locator("img").first(), "main-gerak-header", `Bermain header ${viewport.width}px`);

  const gameCards = page.locator('[data-core-thumbnail-card="game"]');
  assert.equal(await gameCards.count(), 10, "Bermain catalog must preserve all 10 existing game entries");
  assert.equal(await page.locator('a[href^="/play/"]').count(), 10, "Bermain catalog routes must remain unchanged");
  const gameImages = gameCards.locator("img");
  for (let index = 0; index < 10; index += 1) {
    await assertCoreThumbnail(gameImages.nth(index), "core-thumbnails", `game thumbnail ${index + 1} at ${viewport.width}px`);
  }

  await assertNoHorizontalOverflow(page, `Bermain catalog ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `bermain-${viewport.width}.png`), fullPage: true });
  await assertNoPageErrors(page, pageErrors, consoleErrors, `Bermain catalog ${viewport.width}px`);

  pageErrors.length = 0;
  consoleErrors.length = 0;
  await page.goto(baseUrl + "/play/math-choice", { waitUntil: "domcontentloaded", timeout: 30_000 });
  const preflight = page.locator('[data-mainlagi-play-character-state="welcome"]');
  await preflight.waitFor({ state: "visible", timeout: 8_000 });
  await assertCharacterLayer(preflight.locator(".preflight-character-stage"), ["gavi", "paca"], "welcome", `Bermain preflight ${viewport.width}px`);
  assert.equal(await page.getByRole("heading", { name: /Math Pilih Jawaban/i }).count(), 1, "preflight must preserve game title");
  assert.equal(await page.getByRole("button", { name: "Nyalakan kamera", exact: true }).count(), 1, "preflight must preserve camera start control");
  await assertNoHorizontalOverflow(page, `Bermain preflight ${viewport.width}px`);
  await page.screenshot({ path: path.join(outDir, `preflight-${viewport.width}.png`), fullPage: false });
  await assertNoPageErrors(page, pageErrors, consoleErrors, `Bermain preflight ${viewport.width}px`);

  await context.close();
}

function assertCompletionSourceContract() {
  const sharedSource = readFileSync(path.resolve("src/games/shared.tsx"), "utf8");
  const shellSource = readFileSync(path.resolve("src/components/GameShell.tsx"), "utf8");
  const preflightSource = readFileSync(path.resolve("src/components/PreflightPanel.tsx"), "utf8");

  assert.match(sharedSource, /context:\s*"play_completion"/, "shared RoundEndOverlay must resolve Bermain completion state centrally");
  assert.match(sharedSource, /requestedCharacters:\s*\["gavi",\s*"paca"\]/, "shared RoundEndOverlay keeps Gavi + Paca authored play cast");
  assert.match(sharedSource, /<CharacterLayer/, "shared RoundEndOverlay renders through CharacterLayer");
  assert.match(sharedSource, /data-mainlagi-play-character-state=/, "shared RoundEndOverlay exposes completion QA state");
  assert.match(preflightSource, /context:\s*"play_entry"/, "preflight resolves Bermain entry state centrally");
  assert.match(preflightSource, /status === "idle"/, "entry characters must disappear once camera calibration starts");
  assert.doesNotMatch(shellSource, /resolveCharacterPresentation|CharacterLayer/, "GameShell mechanics remain character-policy agnostic");
}

async function main() {
  assertCompletionSourceContract();
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const report = { status: "RUNNING", viewports: VIEWPORTS };

  try {
    for (const viewport of VIEWPORTS) await runViewport(browser, viewport);
    report.status = "PASS";
    console.log("Session 09 compatibility regression passed after Core Thumbnail Wave 01: Home/Main Gerak catalog surfaces use 4:3 thumbnail art, while Bermain preflight/completion character runtime remains shared-SVG and mechanic-neutral.");
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
