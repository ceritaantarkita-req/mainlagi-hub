import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_VISIBLE_MATCHING_QA_PORT ?? 4030);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/english-match-hello";
const activityId = "english-match-hello";
const screenshotDir = path.join(root, ".mobile-route-qa");
const viewports = [{ width: 320, height: 720 }, { width: 390, height: 844 }, { width: 768, height: 1024 }];
let server;
let serverLog = "";

function startServer() {
  const bin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [bin, "start", "-H", host, "-p", String(port)], {
    cwd: root,
    env: { ...process.env, NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: baseUrl, NEXT_PUBLIC_DATA_BACKEND: "local" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const add = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", add);
  server.stderr.on("data", add);
}

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Visible matching server not ready\n${serverLog.slice(-3000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function waitForBoard(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const board = document.querySelector("[data-visible-matching]");
    return board?.getAttribute("data-visible-matching-ready") === "true"
      && board.querySelectorAll('[data-match-column="left"] [data-match-card]').length === 2
      && board.querySelectorAll('[data-match-column="right"] [data-match-card]').length === 2;
  }, undefined, { timeout: 6_000 });
  await page.waitForTimeout(80);
}

async function layout(page) {
  return page.evaluate(() => {
    const read = (column) => Array.from(document.querySelectorAll(`[data-match-column="${column}"] [data-match-card]`))
      .map((node) => node.getAttribute("data-match-pair"));
    return { left: read("left"), right: read("right") };
  });
}

async function clickPairCard(page, column, pair) {
  await page.locator(`[data-match-column="${column}"] [data-match-card][data-match-pair="${pair}"]`).click();
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
    assert(response && response.status() < 400, "visible matching route must load");
    await waitForBoard(page);
    assert.equal(new URL(page.url()).pathname, route, "progression guard must keep valid English matching route open");

    const initial = await layout(page);
    assert.equal(initial.left.length, 2);
    assert.equal(initial.right.length, 2);
    assert.deepEqual(new Set(initial.left), new Set(["cat", "sun"]));
    assert.deepEqual(new Set(initial.right), new Set(["cat", "sun"]));
    initial.left.forEach((pair, index) => {
      assert.notEqual(pair, initial.right[index], `correct pair leaked on the same row at ${viewport.width}px`);
    });

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `visible matching overflows horizontally at ${viewport.width}px`);
    for (const box of await page.locator("[data-match-card]").evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, left: rect.left, right: rect.right };
    }))) {
      assert(box.width >= 44 && box.height >= 44, "matching cards keep child-sized touch targets");
      assert(box.left >= -1 && box.right <= viewportWidth + 1, "matching cards stay inside viewport");
    }

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-visible-matching-idle.png`), fullPage: false });

    const firstLeft = initial.left[0];
    const secondLeft = initial.left[1];
    await clickPairCard(page, "left", firstLeft);
    await clickPairCard(page, "left", secondLeft);
    assert.equal(await page.locator('[data-match-column="left"] [aria-pressed="true"]').count(), 1, "same-column tap switches selection instead of creating a wrong attempt");

    const wrongRight = initial.right.find((pair) => pair !== secondLeft);
    assert(wrongRight, "a wrong right-side candidate must exist");
    await clickPairCard(page, "right", wrongRight);
    await page.getByRole("status").filter({ hasText: "Belum cocok" }).waitFor({ state: "visible", timeout: 2_000 });

    const current = await layout(page);
    for (const pair of current.left) {
      await clickPairCard(page, "left", pair);
      await clickPairCard(page, "right", pair);
    }

    const completion = page.locator("[data-activity-completion]");
    await completion.waitFor({ state: "visible", timeout: 3_000 });
    assert.equal(await completion.getByLabel("Tiga bintang").locator("svg").count(), 3, "visible matching uses shared completion");
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-visible-matching-success.png`), fullPage: false });

    const state = await page.evaluate((id) => {
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return [...list].reverse().find((item) => item.activityId === id);
    }, activityId);
    assert(state, "visible matching records attempt evidence");
    assert.equal(state.assessed, true);
    assert.equal(state.correctCount, 2);
    assert.equal(state.incorrectCount, 1, "same-column selection switch must not count as an incorrect match");
    assert.equal(state.retryCount, 1);
    assert.equal(state.accuracy, 2 / 3);

    await completion.getByRole("button", { name: "Try Again", exact: true }).click();
    await waitForBoard(page);
    assert.equal(await page.locator("[data-activity-completion]").count(), 0, "Try Again returns to matching board");
    const retryLayout = await layout(page);
    assert.notDeepEqual(retryLayout.left, initial.left, "Try Again must reshuffle the two-pair board");
    retryLayout.left.forEach((pair, index) => {
      assert.notEqual(pair, retryLayout.right[index], "Try Again must keep correct pairs off the same row");
    });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-visible-matching-retry.png`), fullPage: false });

    assert.deepEqual(pageErrors, [], `page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  startServer();
  await waitForServer();
  for (const viewport of viewports) await inspect(viewport);
  console.log(`Visible matching browser QA passed ${viewports.length} viewports with independent columns, no answer-row leakage, same-column reselection, shared completion and retry reshuffle.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
