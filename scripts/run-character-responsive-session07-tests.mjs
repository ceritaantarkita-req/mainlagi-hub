import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_CHARACTER_SESSION07_QA_PORT ?? 4057);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/character-session07");
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 }
];

const ROUTES = [
  { label: "bahasa", activityId: "bahasa-cari-a", pair: ["gavi", "paca"], visible: true },
  { label: "english", activityId: "english-find-blue", pair: ["naya", "zia"], visible: true },
  { label: "math", activityId: "math-count-2", pair: ["gian", "paca"], visible: true },
  { label: "science", activityId: "science-living-cat", pair: ["gavi", "paca"], visible: true },
  { label: "iqro", activityId: "iqro-cari-alif", pair: ["gavi", "paca"], visible: true },
  { label: "color", activityId: "color-gavi", pair: ["gavi", "paca"], visible: false },
  { label: "drawing", activityId: "drawing-line-horizontal", pair: ["gavi", "paca"], visible: false }
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

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/child/demo-gian/activity/bahasa-cari-a`, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Session 07 QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

function intersects(a, b, tolerance = 2) {
  return (
    a.left < b.right - tolerance &&
    a.right > b.left + tolerance &&
    a.top < b.bottom - tolerance &&
    a.bottom > b.top + tolerance
  );
}

async function waitForStableFrame(page, activityId) {
  const expectedPath = `/child/demo-gian/activity/${activityId}`;
  await page.locator('[data-activity-frame="garden"]').waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForFunction(
    () => document.querySelector('[data-activity-frame="garden"]')?.getAttribute("data-character-moment") === "waiting",
    null,
    { timeout: 12_000 }
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  assert.equal(new URL(page.url()).pathname, expectedPath, `${activityId} must remain on its canonical route after hydration`);
}

async function inspectVisibleCharacters(page, route, viewport) {
  const frame = page.locator('[data-activity-frame="garden"]');
  assert.equal(await frame.getAttribute("data-character-left"), route.pair[0], `${route.label} left character`);
  assert.equal(await frame.getAttribute("data-character-right"), route.pair[1], `${route.label} right character`);
  assert.equal(await frame.getAttribute("data-character-state"), "hero", `${route.label} stable state`);

  const layer = page.locator("[data-character-layer]");
  assert.equal(await layer.count(), 1, `${route.label} renders one shared CharacterLayer`);
  assert.equal(await layer.getAttribute("aria-hidden"), "true", `${route.label} decorative layer stays hidden from accessibility tree`);

  const snapshot = await page.evaluate(() => {
    const main = document.querySelector('[data-activity-frame="garden"]');
    const layer = document.querySelector("[data-character-layer]");
    const safeContent = document.querySelector("[data-character-safe-content]");
    if (!main || !layer || !safeContent) return null;

    const rect = (element) => {
      const value = element.getBoundingClientRect();
      return {
        left: value.left,
        right: value.right,
        top: value.top,
        bottom: value.bottom,
        width: value.width,
        height: value.height
      };
    };

    const criticalSelector = [
      "h1",
      "[data-choices]",
      "[data-symbol-hunt]",
      "[data-count-select]",
      "canvas",
      "svg[aria-label^='Gambar untuk diwarnai']",
      "[aria-label='Alat mewarnai']",
      "[aria-label='Alat menggambar']",
      "[role='group'][aria-label='Palet warna']"
    ].join(",");

    const critical = [...safeContent.querySelectorAll(criticalSelector)]
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return bounds.width > 1 && bounds.height > 1 && style.visibility !== "hidden" && style.display !== "none";
      })
      .map((element, index) => ({
        index,
        tag: element.tagName.toLowerCase(),
        aria: element.getAttribute("aria-label"),
        role: element.getAttribute("role"),
        dataChoices: element.hasAttribute("data-choices"),
        rect: rect(element)
      }));

    const images = [...layer.querySelectorAll("img")].map((image) => ({
      id: image.getAttribute("data-character-id"),
      state: image.getAttribute("data-character-state"),
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt"),
      draggable: image.draggable,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      complete: image.complete,
      rect: rect(image),
      pointerEvents: getComputedStyle(image).pointerEvents,
      animationName: getComputedStyle(image).animationName,
      objectFit: getComputedStyle(image).objectFit
    }));

    const pointerTargets = critical.map((item) => {
      const x = Math.max(0, Math.min(innerWidth - 1, item.rect.left + item.rect.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, item.rect.top + item.rect.height / 2));
      const hit = document.elementFromPoint(x, y);
      return {
        index: item.index,
        hitCharacterLayer: Boolean(hit?.closest("[data-character-layer]"))
      };
    });

    return {
      main: rect(main),
      layer: rect(layer),
      layerPointerEvents: getComputedStyle(layer).pointerEvents,
      critical,
      images,
      pointerTargets,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      bodyHeight: document.body.scrollHeight
    };
  });

  assert(snapshot, `${route.label} frame snapshot exists`);
  assert(snapshot.scrollWidth <= snapshot.innerWidth + 1, `${route.label} has no horizontal overflow at ${viewport.width}px`);
  assert.equal(snapshot.layerPointerEvents, "none", `${route.label} layer cannot block pointer input`);
  assert.equal(snapshot.images.length, 2, `${route.label} renders exactly two characters`);

  for (const image of snapshot.images) {
    assert(image.complete && image.naturalWidth > 0 && image.naturalHeight > 0, `${route.label}/${image.id} SVG loads`);
    assert(image.src.endsWith(".svg"), `${route.label}/${image.id} stays on direct SVG runtime`);
    assert.equal(image.state, "hero", `${route.label}/${image.id} stable state is hero`);
    assert.equal(image.alt, "", `${route.label}/${image.id} remains decorative`);
    assert.equal(image.draggable, false, `${route.label}/${image.id} is not draggable`);
    assert.equal(image.pointerEvents, "none", `${route.label}/${image.id} cannot block input`);
    assert.equal(image.animationName, "none", `${route.label}/${image.id} respects reduced motion`);
    assert.equal(image.objectFit, "contain", `${route.label}/${image.id} preserves SVG containment`);

    assert(image.rect.left >= snapshot.main.left - 1, `${route.label}/${image.id} stays inside left frame edge`);
    assert(image.rect.right <= snapshot.main.right + 1, `${route.label}/${image.id} stays inside right frame edge`);
    assert(image.rect.top >= snapshot.main.top - 1, `${route.label}/${image.id} stays inside top frame edge`);
    assert(image.rect.bottom <= snapshot.main.bottom + 1, `${route.label}/${image.id} stays inside bottom frame edge`);
  }

  const overlaps = [];
  for (const image of snapshot.images) {
    for (const item of snapshot.critical) {
      if (intersects(image.rect, item.rect)) {
        overlaps.push({
          character: image.id,
          critical: item.aria || item.role || item.tag,
          criticalIndex: item.index
        });
      }
    }
  }
  assert.deepEqual(
    overlaps,
    [],
    `${route.label} characters must not geometrically overlap prompts/answers/canvas/tools at ${viewport.width}px: ${JSON.stringify(overlaps)}`
  );
  assert(
    snapshot.pointerTargets.every((item) => !item.hitCharacterLayer),
    `${route.label} character layer must never win hit testing at critical content centers`
  );

  return snapshot;
}

async function inspectCreativeSuppression(page, route, viewport) {
  const frame = page.locator('[data-activity-frame="garden"]');
  assert.equal(await frame.getAttribute("data-character-left"), route.pair[0]);
  assert.equal(await frame.getAttribute("data-character-right"), route.pair[1]);
  assert.equal(await page.locator("[data-character-layer]").count(), 0, `${route.label} workspace must not render decorative CharacterLayer`);
  assert.equal(
    await page.locator("[data-character-safe-content] canvas, [data-character-safe-content] svg[aria-label^='Gambar untuk diwarnai']").count() > 0,
    true,
    `${route.label} creative canvas remains present`
  );
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    true,
    `${route.label} has no horizontal overflow at ${viewport.width}px`
  );
}

async function main() {
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const report = { status: "RUNNING", viewports: {}, screenshots: [] };

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
        hasTouch: viewport.width <= 768
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
      });

      report.viewports[viewport.width] = [];

      for (const route of ROUTES) {
        const url = `${baseUrl}/child/demo-gian/activity/${route.activityId}`;
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
        assert(response && response.status() < 400, `${route.label} route returns successfully`);
        await page.waitForLoadState("load");
        await waitForStableFrame(page, route.activityId);

        const snapshot = route.visible
          ? await inspectVisibleCharacters(page, route, viewport)
          : await inspectCreativeSuppression(page, route, viewport);

        const file = `${route.label}-${route.activityId}-${viewport.width}.png`;
        await page.screenshot({ path: path.join(outDir, file), fullPage: true });
        report.screenshots.push(file);
        report.viewports[viewport.width].push({
          route: route.activityId,
          visible: route.visible,
          snapshot
        });
      }

      assert.deepEqual(errors, [], `Session 07 browser errors at ${viewport.width}px: ${errors.join(" | ")}`);
      await context.close();
    }

    report.status = "PASS";
    console.log(
      "Session 07 character responsive QA passed: 7 representative Belajar routes x 5 viewports, direct SVG containment, zero critical-content overlap, pointer safety, decorative accessibility, reduced motion, and creative-workspace suppression."
    );
  } catch (error) {
    report.status = "FAIL";
    report.error = String(error?.stack ?? error);
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  } finally {
    writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
    await browser.close();
    stopServer();
  }
}

main();
