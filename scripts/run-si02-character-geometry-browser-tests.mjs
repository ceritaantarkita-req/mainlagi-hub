import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI02_CHARACTER_QA_PORT ?? 4065);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/si02-character-geometry");
const portrait = { width: 390, height: 844 };
const landscape = { width: 844, height: 390 };
const worldStageRoute = "/child/demo-gian/world/money-festival/stage/money-stage-01-money-use";

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
      const response = await fetch(baseUrl + "/child/demo-gian/activity/english-find-blue");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-02 character QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function waitForOrientation(page, expected) {
  await page.waitForFunction(
    (orientation) => {
      const rootNode = document.querySelector("[data-mainlagi-orientation]");
      return rootNode?.getAttribute("data-mainlagi-orientation") === orientation;
    },
    expected,
    { timeout: 5_000 }
  );
}

async function rotate(page, size, expected, label) {
  await page.setViewportSize(size);
  await waitForOrientation(page, expected);
  await page.waitForTimeout(80);
  await assertNoHorizontalOverflow(page, label);
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(
    metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1,
    `${label}: horizontal overflow ${JSON.stringify(metrics)}`
  );
}

async function assertSafeCharacterGeometry(scope, expectedIds, label) {
  const layer = scope.locator("[data-character-layer]").first();
  await layer.waitFor({ state: "attached", timeout: 8_000 });
  assert.equal(await layer.getAttribute("data-character-geometry"), "safe-contain-v1", `${label}: canonical geometry marker`);
  assert.equal(await layer.getAttribute("aria-hidden"), "true", `${label}: decorative layer`);

  const images = layer.locator("img");
  assert.equal(await images.count(), expectedIds.length, `${label}: expected character count`);
  await images.evaluateAll((items) => Promise.all(items.map((item) => item.decode())));

  const snapshot = await layer.evaluate((node) => {
    const rect = (element) => {
      const value = element.getBoundingClientRect();
      return {
        left: value.left,
        right: value.right,
        top: value.top,
        bottom: value.bottom,
        width: value.width,
        height: value.height
      };
    };
    return {
      layer: rect(node),
      innerWidth,
      innerHeight,
      overflow: getComputedStyle(node).overflow,
      pointerEvents: getComputedStyle(node).pointerEvents,
      images: [...node.querySelectorAll("img")].map((image) => ({
        id: image.getAttribute("data-character-id"),
        state: image.getAttribute("data-character-state"),
        rect: rect(image),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        objectFit: getComputedStyle(image).objectFit,
        pointerEvents: getComputedStyle(image).pointerEvents
      }))
    };
  });

  assert.deepEqual(snapshot.images.map((item) => item.id), expectedIds, `${label}: cast order`);
  assert.equal(snapshot.pointerEvents, "none", `${label}: layer cannot block input`);
  assert(snapshot.layer.width > 0 && snapshot.layer.height > 0, `${label}: character slot must have measurable geometry: ${JSON.stringify(snapshot.layer)}`);
  for (const image of snapshot.images) {
    assert(image.naturalWidth > 0 && image.naturalHeight > 0, `${label}/${image.id}: image decodes`);
    assert(image.rect.width > 0 && image.rect.height > 0, `${label}/${image.id}: rendered SVG must have non-zero geometry`);
    assert.equal(image.objectFit, "contain", `${label}/${image.id}: object fit`);
    assert.equal(image.pointerEvents, "none", `${label}/${image.id}: pointer transparent`);
    assert(image.rect.left >= snapshot.layer.left - 1, `${label}/${image.id}: no left crop`);
    assert(image.rect.right <= snapshot.layer.right + 1, `${label}/${image.id}: no right crop`);
    assert(image.rect.top >= snapshot.layer.top - 1, `${label}/${image.id}: no top crop`);
    assert(image.rect.bottom <= snapshot.layer.bottom + 1, `${label}/${image.id}: no bottom crop`);
    assert(image.rect.top >= -1 && image.rect.bottom <= snapshot.innerHeight + 1, `${label}/${image.id}: stays inside viewport block axis`);
    assert(image.rect.left >= -1 && image.rect.right <= snapshot.innerWidth + 1, `${label}/${image.id}: stays inside viewport inline axis`);
    const naturalRatio = image.naturalWidth / image.naturalHeight;
    const renderedRatio = image.rect.width / image.rect.height;
    assert(Math.abs(renderedRatio - naturalRatio) < 0.035, `${label}/${image.id}: safe fit must preserve aspect ratio`);
  }
}

async function assertBelajarCharactersClearContent(page, label) {
  const result = await page.evaluate(() => {
    const layer = document.querySelector('[data-activity-frame="garden"] [data-character-layer]');
    const content = document.querySelector('[data-character-safe-content]');
    if (!layer || !content) return null;
    const contentRect = content.getBoundingClientRect();
    const images = [...layer.querySelectorAll("img")].map((image) => {
      const rect = image.getBoundingClientRect();
      return { id: image.getAttribute("data-character-id"), left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
    const overlaps = images.filter((rect) =>
      rect.left < contentRect.right - 2 &&
      rect.right > contentRect.left + 2 &&
      rect.top < contentRect.bottom - 2 &&
      rect.bottom > contentRect.top + 2
    );
    return {
      overlaps,
      content: { left: contentRect.left, right: contentRect.right, top: contentRect.top, bottom: contentRect.bottom }
    };
  });
  assert(result, `${label}: Belajar geometry snapshot exists`);
  assert.deepEqual(result.overlaps, [], `${label}: characters must stay outside the task-content safe box: ${JSON.stringify(result)}`);
}

async function waitForBelajar(page) {
  await page.locator('[data-activity-frame="garden"]').waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForFunction(
    () => document.querySelector('[data-activity-frame="garden"]')?.getAttribute("data-character-moment") === "waiting",
    null,
    { timeout: 12_000 }
  );
}

async function testBelajar(browser) {
  const context = await browser.newContext({ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseUrl + "/child/demo-gian/activity/english-find-blue", { waitUntil: "domcontentloaded", timeout: 30_000 });
  await waitForBelajar(page);
  const frame = page.locator('[data-activity-frame="garden"]');

  await frame.locator("[data-character-layer]").scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(frame, ["naya", "zia"], "Belajar portrait");
  await assertBelajarCharactersClearContent(page, "Belajar portrait");
  await page.evaluate(() => window.scrollTo(0, 0));
  await rotate(page, landscape, "landscape", "Belajar landscape");
  await assertSafeCharacterGeometry(frame, ["naya", "zia"], "Belajar landscape");
  await assertBelajarCharactersClearContent(page, "Belajar landscape");
  assert.equal(await frame.getAttribute("data-character-state"), "hero", "Belajar character state survives rotation");
  await page.screenshot({ path: path.join(outDir, "belajar-landscape.png"), fullPage: false });

  await rotate(page, portrait, "portrait", "Belajar portrait recovery");
  await frame.locator("[data-character-layer]").scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(frame, ["naya", "zia"], "Belajar portrait recovery");
  await assertBelajarCharactersClearContent(page, "Belajar portrait recovery");
  await context.close();
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
  await page.getByRole("button", { name: /🎈 Balon · Rp3/ }).click();
  await page.getByRole("button", { name: "Rp4", exact: true }).click();
  await page.getByRole("button", { name: /🍎 Buah · Rp4/ }).click();
  await page.getByRole("button", { name: "Rp5", exact: true }).click();
  await page.getByRole("button", { name: /🧃 Jus · Rp5/ }).click();
  await page.waitForTimeout(520);
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
  await page.waitForTimeout(520);
}

async function testWorld(browser) {
  const context = await browser.newContext({ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseUrl + worldStageRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator('[data-world-stage-shell="garden-baseline-v1"]').waitFor({ state: "visible", timeout: 10_000 });

  const story = page.locator("[data-world-story-character]").first();
  await story.waitFor({ state: "visible", timeout: 8_000 });
  assert.equal(await story.locator(":scope > strong").count(), 0, "World SpeechCard must not render a floating character-name label");
  const storyId = await story.getAttribute("data-world-story-character");
  assert(storyId, "World story exposes speaker id");
  await story.scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(story, [storyId], "World SpeechCard portrait");

  const sceneId = await page.locator("[data-world-scene-id]").getAttribute("data-world-scene-id");
  await rotate(page, landscape, "landscape", "World SpeechCard landscape");
  assert.equal(await page.locator("[data-world-scene-id]").getAttribute("data-world-scene-id"), sceneId, "World SpeechCard rotation preserves Scene");
  await story.scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(story, [storyId], "World SpeechCard landscape");
  await page.screenshot({ path: path.join(outDir, "world-speech-landscape.png"), fullPage: false });
  await rotate(page, portrait, "portrait", "World SpeechCard portrait recovery");

  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await completeFirstDragChallenge(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await completeMatchingChallenge(page);
  await advanceNarrative(page);
  await advanceNarrative(page);

  const completion = page.locator('[data-world-completion-stage="money-stage-01-money-use"]');
  await completion.waitFor({ state: "visible", timeout: 8_000 });
  const completionCharacters = completion.locator('[data-world-character-state="celebrate"]');
  await completionCharacters.scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(completionCharacters, ["gavi", "paca"], "World completion portrait");
  await rotate(page, landscape, "landscape", "World completion landscape");
  await completionCharacters.scrollIntoViewIfNeeded();
  await assertSafeCharacterGeometry(completionCharacters, ["gavi", "paca"], "World completion landscape");
  assert.equal(await completion.isVisible(), true, "World completion remains mounted through rotation");
  await page.screenshot({ path: path.join(outDir, "world-completion-landscape.png"), fullPage: false });
  await rotate(page, portrait, "portrait", "World completion portrait recovery");
  await context.close();
}

async function installFastClock(context) {
  await context.addInitScript(() => {
    const nativeNow = performance.now.bind(performance);
    let offset = 0;
    Object.defineProperty(performance, "now", {
      configurable: true,
      value: () => nativeNow() + offset
    });
    window.__mainlagiSi02AdvanceClock = (milliseconds) => {
      offset += milliseconds;
    };
  });
}

async function openBermainRoundEnd(page) {
  await page.goto(baseUrl + "/play/math-choice", { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator(".preflight-layout").waitFor({ state: "visible", timeout: 8_000 });
  await page.locator(".preflight-toggle").click();
  await page.getByRole("button", { name: "Mouse / keyboard", exact: true }).click();
  await page.getByRole("button", { name: "Tutup mode orang tua", exact: true }).click();
  await page.getByRole("button", { name: "Tantangan", exact: true }).click();
  await page.getByRole("button", { name: "Ayo main", exact: true }).click();
  await page.locator(".game-hud").waitFor({ state: "visible", timeout: 7_000 });
  await page.evaluate(() => window.__mainlagiSi02AdvanceClock?.(95_000));
  await page.locator(".round-end-overlay").waitFor({ state: "visible", timeout: 5_000 });
}

async function testBermainRoundEnd(browser) {
  const context = await browser.newContext({ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  await installFastClock(context);
  const page = await context.newPage();
  await openBermainRoundEnd(page);

  const card = page.locator(".round-end-card");
  assert.equal(await card.getAttribute("data-mainlagi-play-character-state"), "celebrate", "Bermain round-end keeps celebrate state");
  const characters = card.locator(".round-end-characters");
  await assertSafeCharacterGeometry(characters, ["gavi", "paca"], "Bermain RoundEnd portrait");

  await rotate(page, landscape, "landscape", "Bermain RoundEnd landscape");
  await assertSafeCharacterGeometry(characters, ["gavi", "paca"], "Bermain RoundEnd landscape");
  assert.equal(await page.locator(".round-end-overlay").isVisible(), true, "Bermain RoundEnd remains mounted through rotation");
  await page.screenshot({ path: path.join(outDir, "bermain-round-end-landscape.png"), fullPage: false });
  await rotate(page, portrait, "portrait", "Bermain RoundEnd portrait recovery");
  await context.close();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const report = { status: "RUNNING", surfaces: ["belajar", "world-speech", "world-completion", "bermain-round-end"] };

  try {
    await testBelajar(browser);
    await testWorld(browser);
    await testBermainRoundEnd(browser);
    report.status = "PASS";
    console.log("SI-02 character geometry PASS: Belajar, World SpeechCard, World completion, and Bermain RoundEnd preserve full SVG geometry across portrait↔landscape; World floating name label is removed.");
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
