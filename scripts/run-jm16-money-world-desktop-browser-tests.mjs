import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_JM16_WORLD_QA_PORT ?? 4087);
const baseUrl = `http://${host}:${port}`;
const mapPath = "/child/demo-gian/world/money-festival";
const stageTwoPath = mapPath + "/stage/money-stage-02-price-change";
const outDir = path.resolve(".mobile-route-qa/jm16-world-desktop");
const viewport = { width: 1280, height: 860 };

const expectedStageIds = [
  "money-stage-01-money-use",
  "money-stage-02-price-change",
  "money-stage-03-income-sources",
  "money-stage-04-needs-wants",
  "money-stage-05-saving",
  "money-stage-06-investment-intro",
  "money-stage-07-risk",
  "money-stage-08-final-festival"
];

const expectedChapterIds = [
  "money-chapter-01-road-to-festival",
  "money-chapter-02-prepare-festival"
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
      const response = await fetch(baseUrl + mapPath);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("JM-16 World desktop QA server did not become ready.\n" + serverLog.slice(-4000));
}

async function noHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(
    metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1,
    label + ": horizontal overflow " + JSON.stringify(metrics)
  );
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
      "demo-gian": {
        "money-festival": {
          worldId: "money-festival",
          completedStageIds: ["money-stage-01-money-use"],
          currentStageId: "money-stage-02-price-change",
          currentSegmentIndex: 3,
          updatedAt: "2026-10-02T00:00:00.000Z"
        }
      }
    }));
  });

  const page = await context.newPage();

  try {
    await page.goto(baseUrl + mapPath, { waitUntil: "domcontentloaded", timeout: 30_000 });

    const owner = page.locator('[data-jm16-world-journey="money-world-journey-map-v1"]');
    await owner.waitFor({ state: "visible", timeout: 8_000 });
    await page.waitForFunction(() =>
      document.querySelector('[data-jm16-world-journey="money-world-journey-map-v1"]')
        ?.getAttribute("data-world-journey-ready") === "true"
    );

    const map = page.locator('[data-world-map="money-festival"][data-world-journey-adapter="money-world-journey-map-v1"]');
    await map.waitFor({ state: "visible", timeout: 5_000 });

    assert.equal(await page.locator('[data-belajar-journey-map]').count(), 0, "JM-16 World must not mount the Belajar Journey Map owner");
    assert.equal(await page.locator('[data-journey-browse-all]').count(), 0, "JM-16 World must not invent Belajar Browse All");

    assert.deepEqual(
      await map.locator("[data-world-chapter-id]").evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-world-chapter-id"))
      ),
      expectedChapterIds,
      "JM-16 must preserve exact two-Chapter order"
    );

    assert.deepEqual(
      await map.locator("[data-world-stage-id]").evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-world-stage-id"))
      ),
      expectedStageIds,
      "JM-16 must preserve exact eight-Stage order"
    );

    assert.equal(
      (await page.locator("[data-world-journey-progress]").textContent())?.trim(),
      "1/8 Stage",
      "JM-16 progress summary must derive from World adapter state"
    );

    const stageOne = map.locator('[data-world-stage-id="money-stage-01-money-use"]');
    const stageTwo = map.locator('[data-world-stage-id="money-stage-02-price-change"]');
    const stageThree = map.locator('[data-world-stage-id="money-stage-03-income-sources"]');

    assert.equal(
      await stageOne.locator('[data-world-journey-state="completed"]').count(),
      1,
      "Stage 1 must project completed state"
    );
    assert.equal(
      await stageTwo.locator('[data-world-journey-state="current"]').count(),
      1,
      "Stage 2 must project current state"
    );
    assert.equal(
      await stageThree.locator('[data-world-journey-state="locked"]').count(),
      1,
      "Stage 3 must remain locked"
    );
    assert.equal(
      await stageOne.locator('a[href="' + mapPath + '/stage/money-stage-01-money-use"]').count(),
      1,
      "completed Stage keeps its stable World route"
    );
    assert.equal(
      await stageTwo.locator('a[href="' + stageTwoPath + '"][aria-current="step"]').count(),
      1,
      "current Stage keeps stable route and aria-current"
    );
    assert.equal(
      await stageThree.locator('[aria-disabled="true"]').count(),
      1,
      "locked Stage remains non-navigable"
    );

    assert.equal(
      (await map.locator('[data-world-chapter-id="money-chapter-01-road-to-festival"] > span').textContent())?.trim(),
      "1/4 Stage selesai",
      "Chapter 1 progress must come from the adapter"
    );
    assert.equal(
      (await map.locator('[data-world-chapter-id="money-chapter-02-prepare-festival"] > span').textContent())?.trim(),
      "0/4 Stage selesai",
      "Chapter 2 progress must remain zero"
    );

    const resume = page.locator("[data-jm16-world-resume]");
    await resume.waitFor({ state: "visible", timeout: 5_000 });
    assert.equal(
      await resume.getByRole("link", { name: "Lanjut petualangan", exact: true }).getAttribute("href"),
      stageTwoPath,
      "desktop resume CTA must point at canonical Stage 2 route"
    );
    assert.equal(
      (await resume.getByText("Kok Jadi Lebih Mahal?", { exact: true }).textContent())?.trim(),
      "Kok Jadi Lebih Mahal?",
      "desktop resume CTA must name the canonical current Stage"
    );

    const backgroundImage = await map.evaluate((node) => getComputedStyle(node).backgroundImage);
    assert.match(backgroundImage, /garden-background\.webp/, "JM-16 desktop map must preserve illustrated Mainlagi World identity");

    const geometry = await page.evaluate(() => {
      const mapNode = document.querySelector('[data-world-map="money-festival"]');
      const left = document.querySelector('[data-world-stage-id="money-stage-01-money-use"]');
      const right = document.querySelector('[data-world-stage-id="money-stage-02-price-change"]');
      if (!(mapNode instanceof HTMLElement) || !(left instanceof HTMLElement) || !(right instanceof HTMLElement)) return null;
      const mapBox = mapNode.getBoundingClientRect();
      const leftBox = left.getBoundingClientRect();
      const rightBox = right.getBoundingClientRect();
      return {
        mapCenter: mapBox.left + mapBox.width / 2,
        stageOneCenter: leftBox.left + leftBox.width / 2,
        stageTwoCenter: rightBox.left + rightBox.width / 2
      };
    });
    assert(geometry, "JM-16 desktop geometry must resolve");
    assert(geometry.stageOneCenter < geometry.mapCenter, "Stage 1 must sit left of the desktop Journey spine");
    assert(geometry.stageTwoCenter > geometry.mapCenter, "Stage 2 must sit right of the desktop Journey spine");

    await noHorizontalOverflow(page, "JM-16 desktop map");
    await page.screenshot({ path: path.join(outDir, "1280-world-money-journey.png"), fullPage: true });

    await resume.getByRole("link", { name: "Lanjut petualangan", exact: true }).click();
    await page.waitForURL(new RegExp("/child/demo-gian/world/money-festival/stage/money-stage-02-price-change$"), { timeout: 8_000 });
    assert.equal(new URL(page.url()).pathname, stageTwoPath, "JM-16 resume handoff must preserve canonical World Stage route");
    await page.locator('[data-world-stage-shell="garden-baseline-v1"]').waitFor({ state: "visible", timeout: 8_000 });

    console.log("JM-16 World desktop Journey Map QA PASS: adapter ownership, 2-Chapter/8-Stage order, progress states, desktop geometry, stable routes, Mainlagi World visual identity, and no Belajar Browse All.");
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
