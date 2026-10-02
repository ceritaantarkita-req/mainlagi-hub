import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_JM17_WORLD_QA_PORT ?? 4085);
const base = `http://${host}:${port}`;
const route = "/child/demo-gian/world/money-festival";
const outDir = path.resolve(".mobile-route-qa/jm17-world-responsive");
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
const seededProgress = {
  worldId: "money-festival",
  completedStageIds: ["money-stage-01-money-use"],
  currentStageId: "money-stage-02-price-change",
  currentSegmentIndex: 3,
  updatedAt: "2026-10-02T00:00:00.000Z"
};

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
  throw new Error(`JM-17 World responsive QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function newSeededContext(browser, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  await context.addInitScript((progress) => {
    window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
      "demo-gian": { "money-festival": progress }
    }));
  }, seededProgress);
  return context;
}

async function openJourney(page) {
  await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const rootNode = page.locator(
    '[data-world-journey-map="money-world-journey-map-v1"][data-world-journey-ready="true"][data-world-journey-responsive="jm17"]'
  );
  await rootNode.waitFor({ state: "visible", timeout: 8_000 });
  const map = page.locator(
    '[data-world-map="money-festival"][data-world-journey-adapter="money-world-journey-map-v1"]'
  );
  await map.waitFor({ state: "visible", timeout: 8_000 });
  await page.waitForFunction(() => {
    const current = document.querySelector('[data-world-stage-state="current"]');
    if (!(current instanceof HTMLElement)) return false;
    const box = current.getBoundingClientRect();
    return box.bottom > 0 && box.top < window.innerHeight;
  }, null, { timeout: 8_000 });
  return map;
}

async function inspectResponsiveViewport(browser, viewport) {
  const context = await newSeededContext(browser, viewport);
  const page = await context.newPage();
  const browserErrors = [];
  page.on("pageerror", (error) => browserErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  try {
    const map = await openJourney(page);

    assert.equal(await page.locator("[data-belajar-journey-map]").count(), 0, "World responsive map must not use the Belajar Journey Map owner");
    assert.equal(await page.locator("[data-journey-browse-all]").count(), 0, "World responsive map must not inherit Browse All");
    assert.equal(await page.getByText(/Lihat semua aktivitas/).count(), 0, "World responsive map must not invent an activity catalog");
    assert.equal((await page.locator("[data-world-journey-progress]").textContent())?.trim(), "1/8 Stage");

    const resume = page.locator("[data-world-journey-resume]");
    await resume.waitFor({ state: "visible" });
    assert.equal((await resume.locator("strong").textContent())?.trim(), "Stage 2 · Kok Jadi Lebih Mahal?");
    assert.equal((await resume.locator("a").textContent())?.trim(), "Lanjut dari checkpoint");
    assert.equal(
      await resume.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-02-price-change"]').count(),
      1,
      "responsive resume must preserve the stable Stage 2 route"
    );

    const chapters = map.locator("[data-world-chapter-id]");
    assert.equal(await chapters.count(), 2, "responsive World map must keep exactly two canonical Chapters");
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
      "responsive World map must preserve exact canonical Stage order"
    );
    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-01-money-use"] [data-world-stage-state="completed"]').count(),
      1
    );
    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-02-price-change"] [data-world-stage-state="current"]').count(),
      1
    );
    assert.equal(
      await map.locator('[data-world-stage-id="money-stage-03-income-sources"] [data-world-stage-state="locked"]').count(),
      1
    );

    const stageTwoLink = map.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-02-price-change"]');
    assert.equal(await stageTwoLink.count(), 1);
    assert.equal(await stageTwoLink.getAttribute("aria-current"), "step");
    assert.equal(
      await map.locator('[aria-label="Stage 3 terkunci · Uang Datang dari Mana?"][aria-disabled="true"]').count(),
      1
    );

    const background = await map.evaluate((node) => getComputedStyle(node).backgroundImage);
    assert.match(background, /garden-background\.webp/, "responsive World map must preserve the illustrated garden identity");

    const geometry = await page.evaluate(() => {
      const html = document.documentElement;
      const map = document.querySelector('[data-world-map="money-festival"]');
      const resume = document.querySelector("[data-world-journey-resume]");
      const resumeLink = resume?.querySelector("a");
      const current = document.querySelector('[data-world-stage-state="current"]');
      const stageLinks = Array.from(document.querySelectorAll('[data-world-stage-id] > a'));
      const banners = Array.from(document.querySelectorAll("[data-world-chapter-id]"));
      if (
        !(map instanceof HTMLElement) ||
        !(resume instanceof HTMLElement) ||
        !(resumeLink instanceof HTMLElement) ||
        !(current instanceof HTMLElement)
      ) return null;

      const mapBox = map.getBoundingClientRect();
      const resumeBox = resume.getBoundingClientRect();
      const resumeLinkBox = resumeLink.getBoundingClientRect();
      const currentBox = current.getBoundingClientRect();
      const stageBoxes = stageLinks.map((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width, height: box.height };
      });
      const bannerBoxes = banners.map((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width };
      });
      const firstCenter = stageBoxes[0] ? stageBoxes[0].left + stageBoxes[0].width / 2 : 0;
      const secondCenter = stageBoxes[1] ? stageBoxes[1].left + stageBoxes[1].width / 2 : 0;
      return {
        viewportWidth: html.clientWidth,
        viewportHeight: window.innerHeight,
        scrollWidth: Math.max(html.scrollWidth, document.body.scrollWidth),
        mapLeft: mapBox.left,
        mapRight: mapBox.right,
        resumeLeft: resumeBox.left,
        resumeRight: resumeBox.right,
        resumeDisplay: getComputedStyle(resume).display,
        resumeLinkWidth: resumeLinkBox.width,
        resumeLinkHeight: resumeLinkBox.height,
        currentTop: currentBox.top,
        currentBottom: currentBox.bottom,
        stageBoxes,
        bannerBoxes,
        firstCenter,
        secondCenter
      };
    });

    assert.ok(geometry, "JM-17 responsive geometry must be measurable");
    assert.ok(geometry.scrollWidth <= geometry.viewportWidth + 1, `JM-17 must not overflow horizontally at ${viewport.width}px`);
    assert.ok(geometry.mapLeft >= -1 && geometry.mapRight <= geometry.viewportWidth + 1, `map must fit at ${viewport.width}px`);
    assert.ok(geometry.resumeLeft >= -1 && geometry.resumeRight <= geometry.viewportWidth + 1, `resume must fit at ${viewport.width}px`);
    assert.notEqual(geometry.resumeDisplay, "none", `resume must be visible at ${viewport.width}px`);
    assert.ok(geometry.resumeLinkWidth >= 44 && geometry.resumeLinkHeight >= 44, `resume target must be at least 44px at ${viewport.width}px`);
    assert.ok(
      geometry.currentBottom > 0 && geometry.currentTop < geometry.viewportHeight,
      `current Stage must be returned into view at ${viewport.width}px`
    );
    for (const box of [...geometry.stageBoxes, ...geometry.bannerBoxes]) {
      assert.ok(box.left >= -1 && box.right <= geometry.viewportWidth + 1, `Journey item must fit at ${viewport.width}px`);
    }
    for (const box of geometry.stageBoxes) {
      assert.ok(box.height >= 44, `Stage touch target must remain at least 44px at ${viewport.width}px`);
    }

    if (viewport.width <= 900) {
      assert.ok(
        Math.abs(geometry.firstCenter - geometry.secondCenter) <= Math.max(18, viewport.width * 0.08),
        `JM-17 <=900px Stages must use the stacked responsive lane at ${viewport.width}px`
      );
    }

    await page.screenshot({
      path: path.join(outDir, `${viewport.width}x${viewport.height}-world-money-responsive.png`),
      fullPage: true
    });
    assert.deepEqual(browserErrors, [], `JM-17 ${viewport.width}px run must not emit browser/page errors`);
  } finally {
    await context.close();
  }
}

async function inspectRotation(browser) {
  const portrait = { width: 390, height: 844 };
  const landscape = { width: 844, height: 390 };
  const context = await newSeededContext(browser, portrait);
  const page = await context.newPage();

  try {
    await openJourney(page);
    await page.evaluate(() => { window.__jm17DocumentMarker = "same-document"; });

    const before = {
      progress: (await page.locator("[data-world-journey-progress]").textContent())?.trim(),
      resumeHref: await page.locator("[data-world-journey-resume] a").getAttribute("href"),
      resumeText: (await page.locator("[data-world-journey-resume] a").textContent())?.trim()
    };

    await page.setViewportSize(landscape);
    await page.waitForFunction(() => document.documentElement.clientWidth === 844);
    assert.equal(await page.evaluate(() => window.__jm17DocumentMarker), "same-document", "rotation must not reload the World map document");
    assert.equal((await page.locator("[data-world-journey-progress]").textContent())?.trim(), before.progress, "rotation must preserve World progress");
    assert.equal(await page.locator("[data-world-journey-resume] a").getAttribute("href"), before.resumeHref, "rotation must preserve resume route");
    assert.equal((await page.locator("[data-world-journey-resume] a").textContent())?.trim(), before.resumeText, "rotation must preserve checkpoint intent");

    const landscapeGeometry = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      resumeDisplay: getComputedStyle(document.querySelector("[data-world-journey-resume]")).display
    }));
    assert.ok(landscapeGeometry.scroll <= landscapeGeometry.viewport + 1, "landscape World map must not overflow");
    assert.notEqual(landscapeGeometry.resumeDisplay, "none", "resume must remain visible after portrait-to-landscape reflow");

    await page.setViewportSize(portrait);
    await page.waitForFunction(() => document.documentElement.clientWidth === 390);
    assert.equal(await page.evaluate(() => window.__jm17DocumentMarker), "same-document", "return to portrait must remain same-document");
    assert.equal((await page.locator("[data-world-journey-progress]").textContent())?.trim(), "1/8 Stage");
    assert.equal(
      await page.locator('[data-world-stage-id="money-stage-02-price-change"] [data-world-stage-state="current"]').count(),
      1,
      "rotation must preserve current World Stage projection"
    );

    await page.screenshot({ path: path.join(outDir, "390-rotation-return.png"), fullPage: true });
  } finally {
    await context.close();
  }
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [
      { width: 320, height: 720 },
      { width: 390, height: 844 },
      { width: 430, height: 860 },
      { width: 768, height: 1024 }
    ]) {
      await inspectResponsiveViewport(browser, viewport);
    }
    await inspectRotation(browser);
    console.log("JM-17 World responsive Journey Map QA PASS: 320/390/430 phone + 768 tablet containment, visible checkpoint resume, exact World states/routes, stacked <=900px lane, current-Stage return, touch targets, rotation persistence, no Belajar Browse All, illustrated identity, and no overflow.");
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
