import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import { worldAge7Context } from "./world-age7-browser-fixture.mjs";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI01_ORIENTATION_QA_PORT ?? 4064);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/si01-orientation");
const portrait = { width: 390, height: 844 };
const landscape = { width: 844, height: 390 };
const memoryRoute = "/child/demo-gian/activity/letters-match-case-cd";
const worldStageRoute = "/child/qa-world-age7/world/money-festival/stage/money-stage-01-money-use";

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
      const response = await fetch(baseUrl + "/play/math-choice");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-01 orientation QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function seedMemoryReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const prerequisiteId = "letters-find-a";
    const completedAt = "2026-09-27T00:00:00.000Z";
    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: [prerequisiteId, "letters-trace-a"],
        stars: 0,
        lastActivityId: "letters-trace-a"
      }
    }));
    localStorage.setItem(attemptsKey, JSON.stringify({
      [childId]: [{
        id: "si01-memory-prerequisite",
        childId,
        activityId: prerequisiteId,
        subjectId: "letters",
        stageId: "letters-foundations",
        runtime: "tap_choice",
        difficulty: 1,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: 1,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "si01-orientation-prerequisite" },
        evidence: [{
          attemptId: "si01-memory-prerequisite",
          activityId: prerequisiteId,
          skillId: "letters.latin.a.recognition",
          score: 1,
          weight: 0.95,
          createdAt: completedAt,
          qualifiesForMastery: true
        }],
        masteryEligible: true
      }]
    }));
  });
}

async function waitForOrientation(page, rootSelector, expected) {
  await page.waitForFunction(
    ({ selector, orientation }) => document.querySelector(selector)?.getAttribute("data-mainlagi-orientation") === orientation,
    { selector: rootSelector, orientation: expected },
    { timeout: 5_000 }
  );
}

async function setDocumentMarker(page, marker) {
  await page.evaluate((value) => { window.__mainlagiSi01DocumentMarker = value; }, marker);
}

async function assertDocumentMarker(page, marker, label) {
  assert.equal(
    await page.evaluate(() => window.__mainlagiSi01DocumentMarker),
    marker,
    `${label}: viewport change must not reload the document`
  );
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

async function assertViewportSignal(page, rootSelector, expected, expectedSize, label) {
  await waitForOrientation(page, rootSelector, expected);
  const snapshot = await page.locator(rootSelector).evaluate((element) => ({
    orientation: element.getAttribute("data-mainlagi-orientation"),
    width: element.style.getPropertyValue("--ml-viewport-width"),
    height: element.style.getPropertyValue("--ml-viewport-height")
  }));
  assert.equal(snapshot.orientation, expected, `${label}: orientation signal`);
  assert.equal(snapshot.width, `${expectedSize.width}px`, `${label}: viewport width token`);
  assert.equal(snapshot.height, `${expectedSize.height}px`, `${label}: viewport height token`);
}

async function rotate(page, rootSelector, size, expected, marker, label) {
  await page.setViewportSize(size);
  await assertViewportSignal(page, rootSelector, expected, size, label);
  await assertDocumentMarker(page, marker, label);
  await assertNoHorizontalOverflow(page, label);
}

const cleanMemoryLabel = (value) => String(value ?? "")
  .replace(/^Kartu\s+/i, "")
  .replace(/, sudah cocok$/i, "");

async function solveMemory(page) {
  const cards = page.locator("[data-memory-card]");
  while ((await cards.evaluateAll((nodes) => nodes.filter((node) => !node.disabled).length)) > 0) {
    const count = await cards.count();
    let first = -1;
    for (let index = 0; index < count; index += 1) {
      if (await cards.nth(index).isEnabled()) {
        first = index;
        break;
      }
    }
    if (first < 0) break;

    await cards.nth(first).click();
    const firstLabel = cleanMemoryLabel(await cards.nth(first).getAttribute("aria-label"));
    let paired = false;
    for (let second = 0; second < count; second += 1) {
      if (second === first || !(await cards.nth(second).isEnabled())) continue;
      await cards.nth(second).click();
      const secondLabel = cleanMemoryLabel(await cards.nth(second).getAttribute("aria-label"));
      if (firstLabel.toLowerCase() === secondLabel.toLowerCase()) {
        await page.waitForFunction(([a, b]) => {
          const buttons = document.querySelectorAll("[data-memory-card]");
          return buttons[a]?.disabled && buttons[b]?.disabled;
        }, [first, second]);
        paired = true;
        break;
      }
      await page.waitForTimeout(720);
      await cards.nth(first).click();
    }
    assert(paired, `memory solve must find pair for ${firstLabel}`);
  }
}

async function advanceWorldNarrative(page) {
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

async function testBelajarPartialAnswer(browser) {
  const context = await worldAge7Context(browser,{ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  await seedMemoryReadiness(context);
  const page = await context.newPage();
  await page.goto(baseUrl + memoryRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator('[data-memory-match][data-memory-match-ready="true"]').waitFor({ state: "visible", timeout: 8_000 });
  const rootSelector = '[data-mainlagi-mobile-root="child"]';
  await assertViewportSignal(page, rootSelector, "portrait", portrait, "Belajar initial");

  const first = page.locator("[data-memory-card]").first();
  await first.click();
  const openLabel = await first.getAttribute("aria-label");
  assert(openLabel && !openLabel.startsWith("Kartu tertutup"), "Belajar partial answer must reveal one memory card");
  await page.getByRole("status").filter({ hasText: "Sekarang buka satu kartu lagi." }).waitFor();

  const marker = "si01-belajar-partial";
  await setDocumentMarker(page, marker);
  await rotate(page, rootSelector, landscape, "landscape", marker, "Belajar portrait→landscape");
  assert.equal(await first.getAttribute("aria-label"), openLabel, "Belajar revealed answer must survive landscape reflow");
  await rotate(page, rootSelector, portrait, "portrait", marker, "Belajar landscape→portrait");
  assert.equal(await first.getAttribute("aria-label"), openLabel, "Belajar revealed answer must survive portrait recovery");

  await page.screenshot({ path: path.join(outDir, "belajar-partial-portrait-recovered.png"), fullPage: false });
  await context.close();
}

async function testCompletionAndShare(browser) {
  const context = await worldAge7Context(browser,{ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  await seedMemoryReadiness(context);
  const page = await context.newPage();
  await page.goto(baseUrl + memoryRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator('[data-memory-match][data-memory-match-ready="true"]').waitFor({ state: "visible", timeout: 8_000 });
  await solveMemory(page);

  const completion = page.locator("[data-activity-completion]");
  await completion.waitFor({ state: "visible", timeout: 5_000 });
  await completion.getByRole("button", { name: "Share", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Bagikan pencapaian" });
  await dialog.waitFor({ state: "visible", timeout: 5_000 });
  assert.equal(await dialog.getAttribute("data-canonical-share"), "v1", "SI-01 Share handoff uses canonical SI-04 owner");
  await page.waitForFunction(() => document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate") === "allowed");

  const marker = "si01-completion-share";
  const rootSelector = '[data-mainlagi-mobile-root="child"]';
  await setDocumentMarker(page, marker);
  await rotate(page, rootSelector, landscape, "landscape", marker, "Completion/Share portrait→landscape");
  assert.equal(await completion.isVisible(), true, "Completion must remain mounted after landscape reflow");
  assert.equal(await dialog.evaluate((element) => element.open), true, "Share dialog must remain open after landscape reflow");
  await rotate(page, rootSelector, portrait, "portrait", marker, "Completion/Share landscape→portrait");
  assert.equal(await dialog.evaluate((element) => element.open), true, "Share dialog must remain open after portrait recovery");

  const progress = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
    return state["demo-gian"]?.completedActivityIds ?? [];
  });
  assert(progress.includes("letters-match-case-cd"), "completion progress must remain persisted through rotation");
  await page.screenshot({ path: path.join(outDir, "completion-share-portrait-recovered.png"), fullPage: false });
  await context.close();
}

async function testBermainTimer(browser) {
  const context = await worldAge7Context(browser,{ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseUrl + "/play/math-choice", { waitUntil: "domcontentloaded", timeout: 30_000 });

  const rootSelector = '[data-mainlagi-mobile-root="play"]';
  await assertViewportSignal(page, rootSelector, "portrait", portrait, "Bermain initial");
  await page.locator(".preflight-toggle").click();
  await page.getByRole("button", { name: "Mouse / keyboard", exact: true }).click();
  await page.getByRole("button", { name: "Tutup mode orang tua", exact: true }).click();
  await page.getByRole("button", { name: "Tantangan", exact: true }).click();
  await page.getByRole("button", { name: "Ayo main", exact: true }).click();
  await page.locator(".countdown-screen").waitFor({ state: "visible", timeout: 3_000 });

  const marker = "si01-bermain-timer";
  await setDocumentMarker(page, marker);
  await rotate(page, rootSelector, landscape, "landscape", marker, "Bermain countdown portrait→landscape");
  await page.locator(".game-hud").waitFor({ state: "visible", timeout: 6_000 });
  await page.waitForFunction(() => {
    const value = Number(document.querySelector(".hud-center b")?.textContent);
    return Number.isFinite(value) && value <= 88;
  }, null, { timeout: 6_000 });
  const before = Number(await page.locator(".hud-center b").textContent());
  assert(before <= 88 && before > 0, `Bermain timed round must be running before recovery check, got ${before}`);

  await rotate(page, rootSelector, portrait, "portrait", marker, "Bermain landscape→portrait");
  await page.waitForTimeout(1100);
  const after = Number(await page.locator(".hud-center b").textContent());
  assert(after < before, `Bermain timer must continue instead of resetting on rotation: before=${before}, after=${after}`);
  assert.equal(await page.locator(".preflight-layout").count(), 0, "Bermain rotation must not return to preflight");
  await page.screenshot({ path: path.join(outDir, "bermain-timer-portrait-recovered.png"), fullPage: false });
  await context.close();
}

async function testWorldSegment(browser) {
  const context = await worldAge7Context(browser,{ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  const page = await context.newPage();
  await page.goto(baseUrl + worldStageRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const shell = page.locator('[data-world-stage-shell="garden-baseline-v1"]');
  await shell.waitFor({ state: "visible", timeout: 10_000 });
  await advanceWorldNarrative(page);

  const stateBefore = await page.evaluate(() => ({
    sceneId: document.querySelector("[data-world-scene-id]")?.getAttribute("data-world-scene-id"),
    sceneProgress: document.querySelector("[data-world-scene-progress]")?.textContent?.trim(),
    stageLabel: document.querySelector("[data-world-stage-shell] .stageShellTitle small")?.textContent?.trim()
  }));
  assert(stateBefore.sceneId, "World must expose current Scene identity before rotation");
  assert(stateBefore.sceneProgress, "World must expose current Scene progress before rotation");

  const marker = "si01-world-segment";
  const rootSelector = '[data-mainlagi-mobile-root="child"]';
  await setDocumentMarker(page, marker);
  await rotate(page, rootSelector, landscape, "landscape", marker, "World portrait→landscape");
  const stateLandscape = await page.evaluate(() => ({
    sceneId: document.querySelector("[data-world-scene-id]")?.getAttribute("data-world-scene-id"),
    sceneProgress: document.querySelector("[data-world-scene-progress]")?.textContent?.trim()
  }));
  assert.equal(stateLandscape.sceneId, stateBefore.sceneId, "World Scene identity must survive landscape reflow");
  assert.equal(stateLandscape.sceneProgress, stateBefore.sceneProgress, "World segment progress must survive landscape reflow");

  await rotate(page, rootSelector, portrait, "portrait", marker, "World landscape→portrait");
  const statePortrait = await page.evaluate(() => ({
    sceneId: document.querySelector("[data-world-scene-id]")?.getAttribute("data-world-scene-id"),
    sceneProgress: document.querySelector("[data-world-scene-progress]")?.textContent?.trim()
  }));
  assert.deepEqual(statePortrait, stateLandscape, "World Scene/segment state must survive portrait recovery");
  await page.screenshot({ path: path.join(outDir, "world-segment-portrait-recovered.png"), fullPage: false });
  await context.close();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });

  try {
    await testBelajarPartialAnswer(browser);
    await testCompletionAndShare(browser);
    await testBermainTimer(browser);
    await testWorldSegment(browser);
    console.log("SI-01 orientation foundation PASS: Belajar answer, Completion/Share, Bermain timer/phase, and World segment state survive portrait↔landscape reflow without reload.");
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
