import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SORTING_BUCKETS_QA_PORT ?? 4015);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/logic-classify-animal";
const activityId = "logic-classify-animal";
const correctChoice = "🐱";
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
  throw new Error(`Sorting-buckets QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const completedActivityIds = ["logic-match-pairs", "logic-odd-one-out"];

    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds,
        stars: 0,
        lastActivityId: "logic-odd-one-out"
      }
    }));

    const seeds = [
      { activityId: "logic-match-pairs", runtime: "matching", skillId: "logic.visual.matching" },
      { activityId: "logic-odd-one-out", runtime: "tap_choice", skillId: "logic.visual.discrimination" }
    ];
    const attempts = seeds.map((seed, index) => {
      const attemptId = `qa-sorting-prereq-${index}`;
      const completedAt = `2026-09-14T11:0${index}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: seed.activityId,
        subjectId: "logic",
        stageId: "logic-foundations",
        runtime: seed.runtime,
        difficulty: 1,
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
        metadata: { source: "sorting-buckets-browser-prerequisite" },
        evidence: [{
          attemptId,
          activityId: seed.activityId,
          skillId: seed.skillId,
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
    const scene = document.querySelector("[data-sorting-buckets]");
    return scene?.getAttribute("data-sorting-buckets-ready") === "true" && scene.querySelectorAll("[data-sorting-cards] button").length === 3;
  }, undefined, { timeout: 6_000 });
  await page.waitForTimeout(80);
}

async function keyboardWrongPlacement(page) {
  const trace = [];
  let selected = false;
  for (let step = 0; step < 96; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => ({
      label: document.activeElement?.getAttribute?.("aria-label") ?? "",
      tag: document.activeElement?.tagName ?? ""
    }));
    trace.push(`${focused.tag}:${focused.label || "(no label)"}`);
    if (!selected && focused.label === "Pilih kartu 🐱") {
      await page.keyboard.press("Enter");
      selected = true;
      continue;
    }
    if (selected && focused.label === "Masukkan ke tidak sesuai") {
      await page.keyboard.press("Enter");
      return;
    }
  }
  throw new Error(`Keyboard sorting path not reached. Focus trace: ${trace.join(" -> ")}`);
}

async function solve(page) {
  const cards = page.locator("[data-sorting-cards] button");
  while ((await cards.count()) > 0) {
    const label = await cards.first().getAttribute("aria-label");
    const choice = String(label ?? "").replace(/^Pilih kartu\s+/, "");
    await cards.first().click();
    const bucketName = choice === correctChoice ? "Masukkan ke sesuai aturan" : "Masukkan ke tidak sesuai";
    await page.getByRole("button", { name: bucketName }).click();
    await page.waitForTimeout(40);
  }
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
    assert(response && response.status() < 400, `sorting buckets bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept seeded Logic prerequisites at ${viewport.width}`);

    const cards = page.locator("[data-sorting-cards] button");
    assert.equal(await cards.count(), 3, "representative classification keeps three canonical cards");
    const buckets = page.getByRole("group", { name: "Keranjang pengelompokan" }).getByRole("button");
    assert.equal(await buckets.count(), 2, "sorting board exposes exactly two buckets");

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `sorting buckets overflow horizontally at ${viewport.width}`);

    for (const locator of [cards, buckets]) {
      const geometry = await locator.evaluateAll((nodes) => nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, left: rect.left, right: rect.right };
      }));
      for (const item of geometry) {
        assert(item.width >= 44 && item.height >= 44, "sorting controls keep touch target");
        assert(item.left >= -1 && item.right <= viewportWidth + 1, "sorting controls remain inside viewport");
      }
    }

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sorting-buckets-idle.png`), fullPage: false });

    await keyboardWrongPlacement(page);
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 2_000 });
    assert.equal(await cards.count(), 3, "wrong bucket placement does not consume the card");
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sorting-buckets-try.png`), fullPage: false });

    await solve(page);
    await page.getByRole("status").filter({ hasText: "Semua kartu" }).waitFor({ state: "visible", timeout: 2_000 });
    assert.equal(await page.locator("[data-sorting-match-items] > span").count(), 1, "one positive item lands in matching bucket");
    assert.equal(await page.locator("[data-sorting-other-items] > span").count(), 2, "two negative items land in other bucket");

    const nextLink = page.getByRole("link", { name: "Pilih permainan lain" });
    const nextLinkBox = await nextLink.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    assert(nextLinkBox, "sorting success CTA must render");
    assert(nextLinkBox.y >= -1 && nextLinkBox.y + nextLinkBox.height <= viewportHeight + 1, `sorting success CTA must remain fully visible at ${viewport.width}`);

    const state = await page.evaluate(({ id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return {
        completed: (progress["demo-gian"]?.completedActivityIds ?? []).includes(id),
        attempt: [...list].reverse().find((item) => item.activityId === id)
      };
    }, { id: activityId });

    assert.equal(state.completed, true, "sorting buckets complete canonical activity");
    assert(state.attempt, "sorting buckets record attempt evidence");
    assert.equal(state.attempt.assessed, true, "Logic classification remains assessed");
    assert.equal(state.attempt.metadata?.evidenceFidelity, "choice_sorting_interaction", "explicit sorting interaction owns evidence");
    assert.equal(state.attempt.metadata?.sortedItemCount, 3);
    assert.equal(state.attempt.correctCount, 3);
    assert.equal(state.attempt.incorrectCount, 1);
    assert.equal(state.attempt.retryCount, 1);
    assert.equal(state.attempt.accuracy, 0.75);

    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sorting-buckets-success.png`), fullPage: false });
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
  console.log(`Sorting-buckets browser QA passed ${viewports.length} viewports with progression, keyboard wrong-state, pointer sorting, visual layout, in-viewport CTA, and assessed evidence checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
