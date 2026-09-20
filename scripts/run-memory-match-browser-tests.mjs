import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_MEMORY_MATCH_QA_PORT ?? 4013);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/letters-match-case-cd";
const activityId = "letters-match-case-cd";
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
  throw new Error(`Memory-match QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

const cleanLabel = (value) => String(value ?? "")
  .replace(/^Kartu\s+/i, "")
  .replace(/, sudah cocok$/i, "");

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";

    if (!localStorage.getItem(progressKey)) {
      localStorage.setItem(progressKey, JSON.stringify({
        [childId]: {
          completedActivityIds: ["letters-find-a", "letters-trace-a"],
          stars: 0,
          lastActivityId: "letters-trace-a"
        }
      }));
    }

    if (!localStorage.getItem(attemptsKey)) {
      const completedAt = "2026-09-14T10:00:00.000Z";
      localStorage.setItem(attemptsKey, JSON.stringify({
        [childId]: [{
          id: "qa-letters-foundation-readiness",
          childId,
          activityId: "letters-find-a",
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
          startedAt: "2026-09-14T09:59:59.000Z",
          completedAt,
          metadata: { source: "memory-match-browser-prerequisite" },
          evidence: [{
            attemptId: "qa-letters-foundation-readiness",
            activityId: "letters-find-a",
            skillId: "letters.latin.a.recognition",
            score: 1,
            weight: 0.95,
            createdAt: completedAt,
            qualifiesForMastery: true
          }],
          masteryEligible: true
        }]
      }));
    }
  });
}

async function waitForHydratedBoard(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const scene = document.querySelector("[data-memory-match]");
    return scene?.getAttribute("data-memory-match-ready") === "true" && scene.querySelectorAll("button").length === 4;
  }, undefined, { timeout: 5_000 });
  await page.waitForTimeout(80);
}

async function focusFirstCardWithKeyboard(page) {
  const focusTrace = [];
  for (let step = 0; step < 96; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      return {
        inBoard: Boolean(element?.closest?.("[data-memory-match]")),
        tag: element?.tagName ?? "",
        label: element?.getAttribute?.("aria-label") ?? "",
        text: element?.textContent?.trim().slice(0, 60) ?? ""
      };
    });
    focusTrace.push(`${focused.tag}:${focused.label || focused.text || "(no label)"}`);
    if (focused.inBoard && focused.tag === "BUTTON") return focused;
  }
  throw new Error(`Keyboard navigation did not reach a memory card. Focus trace: ${focusTrace.join(" -> ")}`);
}

async function solve(page) {
  const cards = page.locator("[data-memory-match] button");
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
    const firstLabel = cleanLabel(await cards.nth(first).getAttribute("aria-label"));
    let paired = false;

    for (let second = 0; second < count; second += 1) {
      if (second === first || !(await cards.nth(second).isEnabled())) continue;
      await cards.nth(second).click();
      const secondLabel = cleanLabel(await cards.nth(second).getAttribute("aria-label"));
      if (firstLabel.toLowerCase() === secondLabel.toLowerCase()) {
        await page.waitForFunction(([a, b]) => {
          const buttons = document.querySelectorAll("[data-memory-match] button");
          return buttons[a]?.disabled && buttons[b]?.disabled;
        }, [first, second]);
        paired = true;
        break;
      }
      await page.waitForTimeout(720);
      await cards.nth(first).click();
    }

    assert(paired, `must find pair for ${firstLabel}`);
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
    assert(response && response.status() < 400, `memory match bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    await page.waitForTimeout(250);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept the seeded prerequisite readiness at ${viewport.width}`);

    const scene = page.locator("[data-memory-match]");
    await scene.waitFor({ state: "visible", timeout: 5_000 });
    const cards = scene.getByRole("button");
    assert.equal(await cards.count(), 4, "representative case-match has four cards");
    const geometry = await cards.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        label: node.getAttribute("aria-label") ?? ""
      };
    }));
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `memory match overflows at ${viewport.width}`);
    for (const card of geometry) {
      assert(card.width >= 44 && card.height >= 44, "memory cards keep touch target");
      assert(card.left >= -1 && card.right <= viewportWidth + 1, "card remains in viewport");
      assert(card.label.startsWith("Kartu tertutup"), "cards begin concealed");
    }
    const columnCount = new Set(geometry.map((card) => Math.round(card.left))).size;
    const rowCount = new Set(geometry.map((card) => Math.round(card.top))).size;
    assert.equal(columnCount, 2, `four-card memory board must use two columns at ${viewport.width}`);
    assert.equal(rowCount, 2, `four-card memory board must use two rows at ${viewport.width}`);

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-memory-match-idle.png`),
      fullPage: false
    });

    const focused = await focusFirstCardWithKeyboard(page);
    assert.match(focused.label, /^Kartu tertutup \d+$/, "keyboard reaches a concealed memory card");
    await page.keyboard.press("Enter");
    const activeLabel = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
    assert.match(activeLabel, /^Kartu [A-Za-z]/, "keyboard opens a card");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname, route, "reload must retain valid progression readiness");
    await solve(page);
    await page.getByRole("status").filter({ hasText: "Semua pasangan ketemu" }).waitFor({ state: "visible", timeout: 3_000 });

    const state = await page.evaluate(({ activityId: id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return {
        completed: (progress["demo-gian"]?.completedActivityIds ?? []).includes(id),
        attempt: [...list].reverse().find((item) => item.activityId === id)
      };
    }, { activityId });

    assert.equal(state.completed, true, "memory match completes canonical activity");
    assert(state.attempt, "memory match records attempt evidence");
    assert.equal(state.attempt.assessed, true, "case matching remains assessed");
    assert.equal(state.attempt.metadata?.evidenceFidelity, "matching_memory_interaction", "explicit memory evidence wins over DOM fallback");
    assert.equal(state.attempt.correctCount, 2, "two canonical pairs are counted");

    const completion = page.locator("[data-activity-completion]");
    await completion.waitFor({ state: "visible", timeout: 2_000 });
    assert.equal(await completion.getByLabel("Tiga bintang").locator("svg").count(), 3, "memory match shared completion renders three stars");
    assert.equal(await completion.getByRole("link", { name: "Next", exact: true }).count(), 1, "memory match shared completion exposes Next");

    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-memory-match-success.png`),
      fullPage: false
    });
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
  console.log(`Memory-match browser QA passed ${viewports.length} viewports with valid progression prerequisites, keyboard, pointer, 2x2 layout, completion, and evidence checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
