import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI03_COMPLETION_QA_PORT ?? 4066);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/si03-canonical-completion");
const memoryRoute = "/child/demo-gian/activity/letters-match-case-cd";
const portrait = { width: 390, height: 844 };
const narrow = { width: 320, height: 740 };
const landscape = { width: 844, height: 390 };

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
      const response = await fetch(baseUrl + memoryRoute);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-03 completion QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function seedMemoryReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const completedAt = "2026-09-27T00:00:00.000Z";
    localStorage.setItem("mainlagi-learning-progress-v1", JSON.stringify({
      [childId]: {
        completedActivityIds: ["letters-find-a", "letters-trace-a"],
        stars: 0,
        lastActivityId: "letters-trace-a"
      }
    }));
    localStorage.setItem("mainlagi-learning-attempts-v1", JSON.stringify({
      [childId]: [{
        id: "si03-memory-prerequisite",
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
        startedAt: completedAt,
        completedAt,
        metadata: { source: "si03-completion-prerequisite" },
        evidence: [{
          attemptId: "si03-memory-prerequisite",
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
  });
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

async function waitForOrientation(page, expected) {
  await page.waitForFunction(
    (orientation) => document.querySelector("[data-mainlagi-orientation]")?.getAttribute("data-mainlagi-orientation") === orientation,
    expected,
    { timeout: 5_000 }
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

async function assertCanonicalCompletion(page, label) {
  const completion = page.locator('[data-canonical-completion="v1"][data-activity-completion]');
  await completion.waitFor({ state: "visible", timeout: 5_000 });

  assert.equal(await completion.getAttribute("data-completion-context"), "belajar", `${label}: Belajar context`);
  assert.equal(await completion.getAttribute("data-completion-surface"), "overlay", `${label}: overlay surface`);
  assert.equal(await completion.getAttribute("data-completion-stars"), "3", `${label}: three-star contract`);
  assert.equal(await completion.getAttribute("role"), "dialog", `${label}: dialog semantics`);
  assert.equal(await completion.getAttribute("aria-modal"), "true", `${label}: modal semantics`);
  assert.equal(await completion.getByLabel("Tiga bintang").locator("svg").count(), 3, `${label}: exactly three visual stars`);

  const actions = completion.locator("[data-completion-action]");
  assert.deepEqual(
    await actions.evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim())),
    ["Back", "Again", "Next", "Share"],
    `${label}: canonical action order`
  );

  for (const action of ["back", "again", "next", "share"]) {
    const target = completion.locator(`[data-completion-action="${action}"]`);
    const box = await target.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, `${label}: ${action} touch target >=44px`);
  }

  const nav = completion.getByRole("navigation", { name: "Navigasi setelah selesai" });
  const share = completion.locator('[data-completion-action="share"]');
  const [navBox, shareBox] = await Promise.all([nav.boundingBox(), share.boundingBox()]);
  assert(navBox && shareBox && shareBox.y >= navBox.y + navBox.height - 1, `${label}: Share stays below Back/Again/Next`);

  const heading = completion.locator("h2");
  await page.waitForFunction(() => document.activeElement?.closest?.('[data-canonical-completion="v1"]')?.querySelector("h2") === document.activeElement);
  assert.equal(await heading.evaluate((node) => node === document.activeElement), true, `${label}: completion heading receives focus`);

  const cardMetrics = await completion.evaluate((rootNode) => {
    const card = rootNode.firstElementChild;
    const rect = card?.getBoundingClientRect();
    return rect ? {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight
    } : null;
  });
  assert(cardMetrics, `${label}: card geometry exists`);
  assert(cardMetrics.left >= -1 && cardMetrics.right <= cardMetrics.viewportWidth + 1, `${label}: card stays inside viewport horizontally`);
  assert(cardMetrics.top >= -1 && cardMetrics.bottom <= cardMetrics.viewportHeight + 1, `${label}: card stays inside viewport vertically`);

  await assertNoHorizontalOverflow(page, label);
  return completion;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  await seedMemoryReadiness(context);
  const page = await context.newPage();

  try {
    await page.goto(baseUrl + memoryRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.locator('[data-memory-match][data-memory-match-ready="true"]').waitFor({ state: "visible", timeout: 8_000 });
    await solveMemory(page);

    let completion = await assertCanonicalCompletion(page, "390 portrait");
    await page.screenshot({ path: path.join(outDir, "390-portrait.png"), fullPage: false });

    await page.setViewportSize(narrow);
    await waitForOrientation(page, "portrait");
    completion = await assertCanonicalCompletion(page, "320 portrait");
    await page.screenshot({ path: path.join(outDir, "320-portrait.png"), fullPage: false });

    await page.setViewportSize(landscape);
    await waitForOrientation(page, "landscape");
    completion = await assertCanonicalCompletion(page, "844x390 landscape");
    await page.screenshot({ path: path.join(outDir, "844x390-landscape.png"), fullPage: false });

    await completion.locator('[data-completion-action="share"]').click();
    const shareDialog = page.getByRole("dialog", { name: "Bagikan pencapaian" });
    await shareDialog.waitFor({ state: "visible", timeout: 5_000 });
    await shareDialog.getByText("Yang dibagikan hanya tautan Mainlagi", { exact: false }).waitFor({ timeout: 5_000 });
    assert.equal(await completion.isVisible(), true, "opening legacy Share owner must not replace canonical Completion");

    const progress = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      return state["demo-gian"]?.completedActivityIds ?? [];
    });
    assert(progress.includes("letters-match-case-cd"), "SI-03 must preserve existing completion/progression write");

    console.log("SI-03 canonical completion browser QA PASS: exact actions, three stars, focus, portrait/landscape containment, Share handoff, and existing progression are preserved.");
  } finally {
    await context.close();
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
