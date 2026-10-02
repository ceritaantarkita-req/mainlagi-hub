import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_JM16_WORLD_QA_PORT ?? 4084);
const base = `http://${host}:${port}`;
const route = "/child/demo-gian/world/money-festival";
const outDir = path.resolve(".mobile-route-qa/jm16-world-desktop");
const viewport = { width: 1280, height: 900 };
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

let server = null;
let serverLog = "";

function startServer() {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: base,
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
      const response = await fetch(base + route);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`JM-16 World desktop QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
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
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  try {
    await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30_000 });

    const pageRoot = page.locator('[data-world-journey-map="money-world-journey-map-v1"]');
    await pageRoot.waitFor({ state: "visible", timeout: 8_000 });
    await page.locator('[data-world-journey-map="money-world-journey-map-v1"][data-world-journey-ready="true"]').waitFor({ state: "visible", timeout: 8_000 });
    const map = page.locator('[data-world-map="money-festival"][data-world-journey-adapter="money-world-journey-map-v1"]');
    await map.waitFor({ state: "visible", timeout: 8_000 });

    assert.equal(await page.locator('[data-belajar-journey-map]').count(), 0, "World must not render through the Belajar Journey Map owner");
    assert.equal(await page.locator('[data-journey-browse-all]').count(), 0, "World must not inherit Belajar Browse All");
    assert.equal(await page.getByText(/Lihat semua aktivitas/).count(), 0, "World must not invent an activity catalog");

    assert.equal((await page.locator("[data-world-journey-progress]").textContent())?.trim(), "1/8 Stage");
    const resume = page.locator("[data-world-journey-resume]");
    await resume.waitFor({ state: "visible" });
    assert.equal((await resume.locator("strong").textContent())?.trim(), "Stage 2 · Kok Jadi Lebih Mahal?");
    assert.equal(
      await resume.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-02-price-change"]').count(),
      1,
      "desktop resume must keep the stable Stage 2 route"
    );
    assert.equal((await resume.locator("a").textContent())?.trim(), "Lanjut dari checkpoint", "resume must preserve Segment checkpoint intent");

    const chapters = map.locator("[data-world-chapter-id]");
    assert.equal(await chapters.count(), 2, "World desktop Journey Map must render exactly two canonical Chapters");
    assert.equal(
      (await map.locator('[data-world-chapter-id="money-chapter-01-road-to-festival"] > span').textContent())?.trim(),
      "1/4 Stage selesai"
    );
    assert.equal(
      (await map.locator('[data-world-chapter-id="money-chapter-02-prepare-festival"] > span').textContent())?.trim(),
      "0/4 Stage selesai"
    );

    const stages = map.locator("[data-world-stage-id]");
    assert.deepEqual(
      await stages.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-world-stage-id"))),
      expectedStageIds,
      "World desktop Journey Map must preserve exact canonical Stage order"
    );

    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-01-money-use"] [data-world-stage-state="completed"]').count(),
      1,
      "Stage 1 must project completed"
    );
    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-02-price-change"] [data-world-stage-state="current"]').count(),
      1,
      "Stage 2 must project current"
    );
    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-03-income-sources"] [data-world-stage-state="locked"]').count(),
      1,
      "Stage 3 must remain locked"
    );
    assert.equal(
      await map.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-01-money-use"]').count(),
      1,
      "completed Stage remains revisit-able"
    );
    const stageTwoLink = map.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-02-price-change"]');
    assert.equal(await stageTwoLink.count(), 1);
    assert.equal(await stageTwoLink.getAttribute("aria-current"), "step", "current World Stage must expose aria-current");
    assert.equal(
      await map.locator('[aria-label="Stage 3 terkunci · Uang Datang dari Mana?"][aria-disabled="true"]').count(),
      1,
      "locked World Stage keeps semantic locked state"
    );

    const background = await map.evaluate((node) => getComputedStyle(node).backgroundImage);
    assert.match(background, /garden-background\.webp/, "JM-16 desktop map must keep illustrated World identity");

    const geometry = await page.evaluate(() => {
      const html = document.documentElement;
      const map = document.querySelector('[data-world-map="money-festival"]');
      const stage1 = document.querySelector('[data-world-stage-id="money-stage-01-money-use"]');
      const stage2 = document.querySelector('[data-world-stage-id="money-stage-02-price-change"]');
      const resume = document.querySelector("[data-world-journey-resume]");
      if (!(map instanceof HTMLElement) || !(stage1 instanceof HTMLElement) || !(stage2 instanceof HTMLElement) || !(resume instanceof HTMLElement)) {
        return null;
      }
      const mapBox = map.getBoundingClientRect();
      const one = stage1.getBoundingClientRect();
      const two = stage2.getBoundingClientRect();
      const resumeStyle = getComputedStyle(resume);
      return {
        viewport: html.clientWidth,
        scrollWidth: Math.max(html.scrollWidth, document.body.scrollWidth),
        mapLeft: mapBox.left,
        mapRight: mapBox.right,
        mapCenter: mapBox.left + mapBox.width / 2,
        stage1Center: one.left + one.width / 2,
        stage2Center: two.left + two.width / 2,
        resumeDisplay: resumeStyle.display
      };
    });
    assert.ok(geometry, "desktop Journey Map geometry must be measurable");
    assert.ok(geometry.scrollWidth <= geometry.viewport + 1, "JM-16 desktop map must not create horizontal overflow");
    assert.ok(geometry.mapLeft >= 0 && geometry.mapRight <= geometry.viewport + 1, "desktop map must remain contained in viewport");
    assert.ok(geometry.stage1Center < geometry.mapCenter, "odd Stage must sit on the left side of the desktop journey");
    assert.ok(geometry.stage2Center > geometry.mapCenter, "even Stage must sit on the right side of the desktop journey");
    assert.equal(geometry.resumeDisplay, "flex", "desktop resume card must be visible");

    await page.screenshot({ path: path.join(outDir, "1280-world-money-journey-map.png"), fullPage: true });
    assert.deepEqual(browserErrors, [], "JM-16 desktop browser run must not emit console/page errors");

    console.log("JM-16 World desktop Journey Map QA PASS: adapter owner, 2 Chapters, exact 8 Stage order, sequential states, resume checkpoint, stable routes, illustrated desktop geometry, no Belajar Browse All, and no overflow.");
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
