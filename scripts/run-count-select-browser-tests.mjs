import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_COUNT_SELECT_QA_PORT ?? 4017);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/math-count-4";
const activityId = "math-count-4";
const correctChoice = "4";
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
  throw new Error(`Count-select QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const prerequisiteId = "math-pattern-touch";
    const completedAt = "2026-09-14T12:00:00.000Z";
    const attemptId = "qa-count-select-prereq-0";

    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: [prerequisiteId],
        stars: 0,
        lastActivityId: prerequisiteId
      }
    }));

    localStorage.setItem(attemptsKey, JSON.stringify({
      [childId]: [{
        id: attemptId,
        childId,
        activityId: prerequisiteId,
        subjectId: "math",
        stageId: "math-pola",
        runtime: "matching",
        difficulty: 2,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: 2,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "count-select-browser-prerequisite" },
        evidence: [{
          attemptId,
          activityId: prerequisiteId,
          skillId: "math.pattern.matching",
          score: 1,
          weight: 1,
          createdAt: completedAt,
          qualifiesForMastery: true
        }],
        masteryEligible: true
      }]
    }));
  });
}

async function waitForHydratedBoard(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const scene = document.querySelector("[data-count-select]");
    return scene?.getAttribute("data-count-select-ready") === "true" && scene.querySelectorAll("[data-count-choices] button").length === 3;
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
        inChoices: Boolean(element?.closest?.("[data-count-choices]")),
        tag: element?.tagName ?? "",
        label: element?.getAttribute?.("aria-label") ?? ""
      };
    });
    trace.push(`${focused.tag}:${focused.label || "(no label)"}`);
    if (focused.inChoices && focused.tag === "BUTTON" && focused.label !== "Pilih jumlah 4") {
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error(`Keyboard navigation did not reach a wrong count candidate. Focus trace: ${trace.join(" -> ")}`);
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
    assert(response && response.status() < 400, `count-select bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept seeded Math pattern readiness at ${viewport.width}`);

    const objects = page.locator("[data-count-objects] > span");
    assert.equal(await objects.count(), 4, "representative Math count activity renders four canonical visible objects");
    const objectText = await objects.allTextContents();
    assert.deepEqual(objectText, ["⭐", "⭐", "⭐", "⭐"], "count-select preserves the canonical prompt objects");

    const choices = page.locator("[data-count-choices] button");
    assert.equal(await choices.count(), 3, "count-select keeps three canonical choices");
    const labels = await choices.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label")));
    assert.deepEqual(new Set(labels), new Set(["Pilih jumlah 3", "Pilih jumlah 4", "Pilih jumlah 5"]), "count-select keeps the canonical answer set");

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `count-select overflows horizontally at ${viewport.width}`);

    const choiceGeometry = await choices.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, left: rect.left, right: rect.right, top: rect.top };
    }));
    for (const choice of choiceGeometry) {
      assert(choice.width >= 44 && choice.height >= 44, "count-select choice keeps touch target");
      assert(choice.left >= -1 && choice.right <= viewportWidth + 1, "count-select choice remains inside viewport");
    }
    assert.equal(new Set(choiceGeometry.map((item) => Math.round(item.top))).size, 1, `three count choices stay on one balanced row at ${viewport.width}`);

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-count-select-idle.png`), fullPage: false });

    const wrongLabel = await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel, `Pilih jumlah ${correctChoice}`);
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 2_000 });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-count-select-try.png`), fullPage: false });

    await page.getByRole("button", { name: `Pilih jumlah ${correctChoice}` }).click();
    await page.getByRole("status").filter({ hasText: "Tepat" }).waitFor({ state: "visible", timeout: 2_000 });

    const nextLink = page.getByRole("link", { name: "Pilih permainan lain" });
    const nextLinkBox = await nextLink.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    assert(nextLinkBox, "count-select success CTA must render");
    assert(nextLinkBox.y >= -1 && nextLinkBox.y + nextLinkBox.height <= viewportHeight + 1, `count-select success CTA must remain fully visible at ${viewport.width}`);

    const state = await page.evaluate(({ activityId: id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return {
        completed: (progress["demo-gian"]?.completedActivityIds ?? []).includes(id),
        attempt: [...list].reverse().find((item) => item.activityId === id)
      };
    }, { activityId });

    assert.equal(state.completed, true, "count-select completes canonical activity");
    assert(state.attempt, "count-select records attempt evidence");
    assert.equal(state.attempt.assessed, true, "Math counting remains assessed");
    assert.equal(state.attempt.metadata?.evidenceFidelity, "choice_count_interaction", "explicit count interaction owns evidence");
    assert.equal(state.attempt.metadata?.countTarget, 4, "count target metadata remains canonical");
    assert.equal(state.attempt.correctCount, 1);
    assert.equal(state.attempt.incorrectCount, 1);
    assert.equal(state.attempt.retryCount, 1);
    assert.equal(state.attempt.accuracy, 0.5);

    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-count-select-success.png`), fullPage: false });
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
  console.log(`Count-select browser QA passed ${viewports.length} viewports with legitimate progression, keyboard wrong-state, pointer completion, canonical object/choice rendering, layout, in-viewport CTA, and assessed evidence checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
