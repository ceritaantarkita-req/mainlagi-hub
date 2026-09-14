import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_MORE_LESS_BALANCE_QA_PORT ?? 4019);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/math-compare-equal-4-4";
const activityId = "math-compare-equal-4-4";
const correctLabel = "Pilih sama: Sama";
const screenshotDir = path.join(root, ".mobile-route-qa");
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
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

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`More-less balance QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const requiredIds = [
      "math-recognize-0",
      "math-recognize-7",
      "math-count-4",
      "math-count-8",
      "math-count-10",
      "math-match-number-quantity-1-2",
      "math-subitize-4"
    ];

    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: requiredIds,
        stars: 0,
        lastActivityId: requiredIds.at(-1)
      }
    }));

    const seeds = [
      ["math-recognize-0", "math.numeral.recognition.0_10", "tap_choice"],
      ["math-count-4", "math.count.4_10", "tap_choice"],
      ["math-match-number-quantity-1-2", "math.quantity.matching", "matching"],
      ["math-subitize-4", "math.quantity.subitizing", "tap_choice"]
    ];

    const attempts = seeds.map(([seedActivityId, skillId, runtime], index) => {
      const attemptId = `qa-more-less-prereq-${index}`;
      const completedAt = `2026-09-14T14:0${index}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: seedActivityId,
        subjectId: "math",
        stageId: "math-jumlah-dasar",
        runtime,
        difficulty: 2,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: runtime === "matching" ? 2 : 1,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "more-less-balance-browser-prerequisite" },
        evidence: [{
          attemptId,
          activityId: seedActivityId,
          skillId,
          score: 1,
          weight: 1,
          createdAt: completedAt,
          qualifiesForMastery: true
        }],
        masteryEligible: true
      };
    });

    localStorage.setItem(attemptsKey, JSON.stringify({ [childId]: attempts }));
  });
}

async function waitForHydratedBoard(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const scene = document.querySelector("[data-more-less-balance]");
    return scene?.getAttribute("data-more-less-balance-ready") === "true" && scene.querySelectorAll("[data-balance-choice]").length === 3;
  }, undefined, { timeout: 6_000 });
  await page.waitForTimeout(80);
}

async function chooseWrongWithKeyboard(page) {
  const trace = [];
  for (let step = 0; step < 96; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      return {
        inBalance: Boolean(element?.closest?.("[data-more-less-balance]")),
        choice: element?.getAttribute?.("data-balance-choice") ?? "",
        tag: element?.tagName ?? "",
        label: element?.getAttribute?.("aria-label") ?? ""
      };
    });
    trace.push(`${focused.tag}:${focused.label || "(no label)"}`);
    if (focused.inBalance && focused.choice && focused.tag === "BUTTON" && focused.label !== correctLabel) {
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error(`Keyboard navigation did not reach a wrong balance candidate. Focus trace: ${trace.join(" -> ")}`);
}

async function inspect(viewport) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    await seedPrerequisiteReadiness(context);
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    assert(response && response.status() < 400, `more-less balance bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept seeded math-jumlah-dasar readiness at ${viewport.width}`);

    const choices = page.locator("[data-balance-choice]");
    assert.equal(await choices.count(), 3, "balance keeps exactly three canonical comparison choices");
    const labels = await choices.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label")));
    assert.deepEqual(new Set(labels), new Set([
      "Pilih sisi kiri: Kiri lebih banyak",
      "Pilih sama: Sama",
      "Pilih sisi kanan: Kanan lebih banyak"
    ]), "balance keeps canonical left/equal/right answer mapping");

    const leftTokens = page.locator('[data-balance-choice="left"] [aria-hidden] > span');
    const rightTokens = page.locator('[data-balance-choice="right"] [aria-hidden] > span');
    assert.equal(await leftTokens.count(), 4, "equal representative shows four apples on left");
    assert.equal(await rightTokens.count(), 4, "equal representative shows four bananas on right");
    assert.deepEqual(await leftTokens.allTextContents(), ["🍎", "🍎", "🍎", "🍎"]);
    assert.deepEqual(await rightTokens.allTextContents(), ["🍌", "🍌", "🍌", "🍌"]);

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `more-less balance overflows horizontally at ${viewport.width}`);

    const choiceGeometry = await choices.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }));
    for (const choice of choiceGeometry) {
      assert(choice.width >= 44 && choice.height >= 44, "balance choice keeps touch target");
      assert(choice.left >= -1 && choice.right <= viewportWidth + 1, "balance choice remains inside viewport");
    }

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-more-less-balance-idle.png`), fullPage: false });

    const wrongLabel = await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel, correctLabel);
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 2_000 });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-more-less-balance-try.png`), fullPage: false });

    await page.getByRole("button", { name: correctLabel }).click();
    await page.getByRole("status").filter({ hasText: "Tepat" }).waitFor({ state: "visible", timeout: 2_000 });

    const nextLink = page.getByRole("link", { name: "Pilih permainan lain" });
    const nextLinkBox = await nextLink.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    assert(nextLinkBox, "balance success CTA must render");
    assert(nextLinkBox.y >= -1 && nextLinkBox.y + nextLinkBox.height <= viewportHeight + 1, `balance success CTA must remain fully visible at ${viewport.width}`);

    const state = await page.evaluate(({ activityId: id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return {
        completed: (progress["demo-gian"]?.completedActivityIds ?? []).includes(id),
        attempt: [...list].reverse().find((item) => item.activityId === id)
      };
    }, { activityId });

    assert.equal(state.completed, true, "balance completes canonical activity");
    assert(state.attempt, "balance records attempt evidence");
    assert.equal(state.attempt.assessed, true, "Math comparison remains assessed");
    assert.equal(state.attempt.metadata?.evidenceFidelity, "choice_balance_comparison_interaction", "explicit balance interaction owns evidence");
    assert.equal(state.attempt.metadata?.comparisonGoal, "equal");
    assert.equal(state.attempt.metadata?.leftCount, 4);
    assert.equal(state.attempt.metadata?.rightCount, 4);
    assert.equal(state.attempt.metadata?.correctSide, "equal");
    assert.equal(state.attempt.correctCount, 1);
    assert.equal(state.attempt.incorrectCount, 1);
    assert.equal(state.attempt.retryCount, 1);
    assert.equal(state.attempt.accuracy, 0.5);

    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-more-less-balance-success.png`), fullPage: false });
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
  console.log(`More-less balance browser QA passed ${viewports.length} viewports with legitimate progression, keyboard wrong-state, pointer completion, canonical equal comparison, layout, in-viewport CTA, and assessed evidence checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
