import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI04_SHARE_QA_PORT ?? 4067);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/si04-canonical-share");
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
  throw new Error(`SI-04 Share QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function seedMemoryReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const completedAt = "2026-09-28T00:00:00.000Z";
    localStorage.setItem("mainlagi-learning-progress-v1", JSON.stringify({
      [childId]: {
        completedActivityIds: ["letters-find-a", "letters-trace-a"],
        stars: 0,
        lastActivityId: "letters-trace-a"
      }
    }));
    localStorage.setItem("mainlagi-learning-attempts-v1", JSON.stringify({
      [childId]: [{
        id: "si04-memory-prerequisite",
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
        metadata: { source: "si04-share-prerequisite" },
        evidence: [{
          attemptId: "si04-memory-prerequisite",
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

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__mainlagiSi04Copied = value;
        }
      }
    });

    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload) => {
        window.__mainlagiSi04NativeShare = payload;
      }
    });
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

async function waitForGate(page) {
  await page.waitForFunction(
    () => document.querySelector('[data-canonical-share="v1"]')?.getAttribute("data-share-gate") === "allowed",
    null,
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

async function assertModalGeometry(page, label) {
  const dialog = page.locator('[data-canonical-share="v1"]');
  const metrics = await dialog.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight
    };
  });
  assert(metrics.left >= -1 && metrics.right <= metrics.viewportWidth + 1, `${label}: Share stays inside viewport horizontally`);
  assert(metrics.top >= -1 && metrics.bottom <= metrics.viewportHeight + 1, `${label}: Share stays inside viewport vertically`);
  await assertNoHorizontalOverflow(page, label);
}

async function assertPublicProviders(page) {
  const dialog = page.locator('[data-canonical-share="v1"]');
  assert.equal(await dialog.getAttribute("data-share-context"), "belajar", "Belajar Share context");
  assert.equal(await dialog.getAttribute("data-share-public-path"), "/", "Belajar share path is public origin");
  assert.equal(await dialog.getAttribute("data-share-url"), baseUrl + "/", "Belajar absolute Share URL is site origin");

  const providers = ["copy", "device", "whatsapp", "telegram", "x", "facebook", "threads"];
  assert.deepEqual(
    await dialog.locator("[data-share-provider]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-share-provider"))),
    providers,
    "canonical Share provider order"
  );

  const externalHrefs = await dialog.locator('a[data-share-provider]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("href") ?? "")
  );
  for (const href of externalHrefs) {
    assert(!href.includes("/child/"), `provider must not expose child route: ${href}`);
    assert(!href.includes("demo-gian"), `provider must not expose child id: ${href}`);
    assert(!href.includes("letters-match-case-cd"), `provider must not expose activity id: ${href}`);
    assert(href.includes(encodeURIComponent(baseUrl + "/")) || href.includes(encodeURIComponent(baseUrl + "/").replace(/%2F/g, "%2F")), `provider should contain public origin URL: ${href}`);
  }

  for (const provider of providers) {
    const target = dialog.locator(`[data-share-provider="${provider}"]`);
    const box = await target.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, `${provider} touch target must be >=44px`);
  }
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

    const completion = page.locator('[data-canonical-completion="v1"][data-activity-completion]');
    await completion.waitFor({ state: "visible", timeout: 5_000 });
    await completion.locator('[data-completion-action="share"]').click();

    const dialog = page.locator('[data-canonical-share="v1"]');
    await dialog.waitFor({ state: "visible", timeout: 5_000 });
    await waitForGate(page);
    assert.equal(await dialog.getAttribute("open") !== null, true, "canonical Share opens as modal dialog");
    assert.equal(await dialog.getByRole("heading", { name: "Bagikan pencapaian" }).evaluate((node) => node === document.activeElement), true, "Share heading receives focus");
    await assertPublicProviders(page);
    await assertModalGeometry(page, "390 portrait");
    await page.screenshot({ path: path.join(outDir, "390-portrait.png"), fullPage: false });

    await page.setViewportSize(landscape);
    await page.waitForTimeout(100);
    assert.equal(await dialog.evaluate((node) => node.open), true, "Share stays open through portrait→landscape");
    assert.equal(await completion.isVisible(), true, "Completion stays mounted behind Share in landscape");
    await assertModalGeometry(page, "844x390 landscape");
    await page.screenshot({ path: path.join(outDir, "844x390-landscape.png"), fullPage: false });

    await page.setViewportSize(narrow);
    await page.waitForTimeout(100);
    assert.equal(await dialog.evaluate((node) => node.open), true, "Share stays open through landscape→narrow portrait");
    await assertModalGeometry(page, "320 portrait");
    await page.screenshot({ path: path.join(outDir, "320-portrait.png"), fullPage: false });

    await dialog.locator('[data-share-provider="copy"]').click();
    await page.waitForFunction(() => window.__mainlagiSi04Copied === location.origin + "/");
    assert.equal(await page.evaluate(() => window.__mainlagiSi04Copied), baseUrl + "/", "Copy link uses public origin only");

    await dialog.locator('[data-share-provider="device"]').click();
    await page.waitForFunction(() => Boolean(window.__mainlagiSi04NativeShare?.url));
    const nativePayload = await page.evaluate(() => window.__mainlagiSi04NativeShare);
    assert.equal(nativePayload.url, baseUrl + "/", "Share device uses public origin");
    assert(!JSON.stringify(nativePayload).includes("demo-gian"), "Share device payload excludes child id");
    assert(!JSON.stringify(nativePayload).includes("letters-match-case-cd"), "Share device payload excludes activity id");

    const progress = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      return state["demo-gian"]?.completedActivityIds ?? [];
    });
    assert(progress.includes("letters-match-case-cd"), "opening/using Share must not alter completion progress");

    console.log("SI-04 canonical Share browser QA PASS: parent gate, public-only URL, provider actions, copy/device payloads, orientation persistence, and completion state are preserved.");
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
